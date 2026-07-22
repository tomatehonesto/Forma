#!/usr/bin/env bash
# Forma (norte-app) dev preview — cloudflared tunnel + Metro (SDK 54) na porta 8083.
# Ordem robusta: túnel -> Metro(proxy) -> espera Metro LOCAL pronto -> compila bundle
# LOCAL (prova) -> verifica manifest pelo túnel (best-effort) -> emite exp:// + QR.
set -uo pipefail

PORT=8083
APP_DIR="$HOME/norte-app"
LOG_DIR="$HOME/logs"
CF_LOG="$LOG_DIR/norte-cf.log"
METRO_LOG="$LOG_DIR/norte-metro.log"
URL_FILE="$LOG_DIR/norte-dev-url.txt"
QR_FILE="$LOG_DIR/norte-qr.png"
mkdir -p "$LOG_DIR"; touch "$CF_LOG" "$METRO_LOG"

stop_tunnel() {
  local pid cmdline
  for pid in $(pgrep -x cloudflared 2>/dev/null || true); do
    cmdline=$(tr '\0' ' ' < "/proc/$pid/cmdline" 2>/dev/null || true)
    [[ "$cmdline" == *"localhost:$PORT"* ]] && { echo "  parando cloudflared $pid"; kill "$pid" 2>/dev/null || true; }
  done
}
stop_metro() {
  local pid
  pid=$(ss -tlnp "sport = :$PORT" 2>/dev/null | grep -oE 'pid=[0-9]+' | head -1 | cut -d= -f2 || true)
  [[ -n "${pid:-}" ]] && { echo "  parando Metro $pid"; kill "$pid" 2>/dev/null || true; sleep 2; kill -9 "$pid" 2>/dev/null || true; }
}

echo "[1/6] parando processos antigos"; stop_tunnel; stop_metro; sleep 1

echo "[2/6] subindo cloudflared (--no-autoupdate)"
cf_start=$(wc -l < "$CF_LOG" 2>/dev/null || echo 0)
nohup cloudflared tunnel --no-autoupdate --url "http://localhost:$PORT" >> "$CF_LOG" 2>&1 &
TUNNEL_URL=""
for _ in $(seq 1 40); do
  TUNNEL_URL=$(tail -n +$((cf_start + 1)) "$CF_LOG" 2>/dev/null | grep -oE 'https://[a-z0-9-]+\.trycloudflare\.com' | head -1 || true)
  [[ -n "$TUNNEL_URL" ]] && break; sleep 1
done
[[ -n "$TUNNEL_URL" ]] || { echo "FALHOU: cloudflared não anunciou URL. Ver $CF_LOG" >&2; exit 1; }
echo "  túnel: $TUNNEL_URL"

echo "[3/6] subindo Metro (proxy = túnel)"
cd "$APP_DIR"
EXPO_PACKAGER_PROXY_URL="$TUNNEL_URL" EXPO_NO_TELEMETRY=1 \
  nohup npx expo start --port "$PORT" >> "$METRO_LOG" 2>&1 &

echo "[4/6] esperando Metro LOCAL ficar pronto"
lb=""
for _ in $(seq 1 60); do
  lb=$(curl -s --max-time 8 -H "expo-platform: ios" -H "Accept: application/expo+json,application/json" "http://localhost:$PORT/" 2>/dev/null || true)
  [[ "$lb" == *'"sdkVersion":"54.0.0"'* ]] && { echo "  Metro pronto"; break; }
  sleep 2
done
[[ "$lb" == *'54.0.0'* ]] || { echo "FALHOU: Metro local não respondeu. Ver $METRO_LOG" >&2; exit 1; }

echo "[5/6] compilando bundle iOS LOCAL (prova de compilação)"
bo=$(curl -s -o /dev/null -w '%{http_code} %{size_download}' --max-time 280 "http://localhost:$PORT/node_modules/expo-router/entry.bundle?platform=ios&dev=true&hot=false" 2>/dev/null || echo "000 0")
echo "  bundle: HTTP ${bo%% *} | ${bo##* } bytes"
[[ "${bo%% *}" == "200" && "${bo##* }" -gt 1000000 ]] || { echo "FALHOU: bundle não compilou. Ver $METRO_LOG" >&2; exit 1; }

echo "[6/6] verificando manifest pelo túnel (best-effort) + QR"
ok=""
for _ in $(seq 1 30); do
  body=$(curl -s --max-time 12 -H "expo-platform: ios" -H "Accept: application/expo+json,application/json" "$TUNNEL_URL/" 2>/dev/null || true)
  [[ "$body" == *'"sdkVersion":"54.0.0"'* ]] && { ok=1; echo "  túnel OK · $(grep -oE '"hostUri":"[^"]*"' <<<"$body" | head -1)"; break; }
  sleep 3
done
[[ -n "$ok" ]] || echo "  AVISO: túnel lento para responder o manifest (Metro/bundle local OK). Tente o QR mesmo assim."

EXP_URL="exp://${TUNNEL_URL#https://}"
printf '%s\n' "$EXP_URL" > "$URL_FILE"
if command -v qrencode >/dev/null 2>&1; then
  qrencode -o "$QR_FILE" -s 11 -m 4 -l M "$EXP_URL" && echo "  PNG: $QR_FILE"
  echo; echo "════════ ESCANEIA COM O EXPO GO ════════"; qrencode -t UTF8 -m 2 "$EXP_URL"
fi
echo "  URL: $EXP_URL"
echo "=== PRONTO ==="
