/* ============================================================
   A LOCALIZAÇÃO — só para medir distância, e só no aparelho

   Ela existe para uma pergunta: quão longe fica cada consultório da rede.
   A conta é feita aqui (ver `distanciaKm`), e o ponto nunca sai do
   aparelho — nem para o portal, nem para lugar nenhum. É isso que o texto
   da permissão promete, em app.json.

   ⚠️ A PERMISSÃO SÓ É PEDIDA NO TOQUE. Quem abre a vitrine vê a lista
   primeiro; o pedido vem quando a pessoa toca em "Usar minha
   localização", e aí ela sabe para que é.

   ⚠️⚠️ O MÓDULO É CARREGADO COM CUIDADO, e não importado no alto. O
   aplicativo roda num build próprio no iPhone (tem HealthKit), e um
   módulo nativo novo só chega lá no próximo build. Importado direto, o
   `expo-location` derrubaria a tela no build de agora; carregado assim,
   a linha da localização some e o resto da vitrine funciona.
   ============================================================ */

export type Ponto = { lat: number; lng: number };

export type Resposta =
  | { ok: true; ponto: Ponto }
  | { ok: false; motivo: 'negada' | 'indisponivel' | 'falhou' };

let modulo: any;
function carregar(): any {
  if (modulo !== undefined) return modulo;
  try {
    modulo = require('expo-location');
  } catch {
    modulo = null;
  }
  return modulo;
}

/** Se este aparelho sabe perguntar a localização. */
export const localizacaoDisponivel = () => !!carregar();

export async function pedirLocalizacao(): Promise<Resposta> {
  const L = carregar();
  if (!L) return { ok: false, motivo: 'indisponivel' };
  try {
    const p = await L.requestForegroundPermissionsAsync();
    if (!p?.granted) return { ok: false, motivo: 'negada' };
    /* A última posição conhecida responde na hora e basta para distância
       de bairro; a atual só entra quando não há nenhuma. */
    let pos: any = null;
    try { pos = await L.getLastKnownPositionAsync(); } catch {}
    if (!pos) pos = await L.getCurrentPositionAsync({ accuracy: L.Accuracy.Balanced });
    return { ok: true, ponto: { lat: pos.coords.latitude, lng: pos.coords.longitude } };
  } catch {
    return { ok: false, motivo: 'falhou' };
  }
}

/** A posição SEM PEDIR NADA: só responde se a pessoa já deu a permissão
    antes. É o que a aba Cuidado usa — ela mostra os mais próximos quando
    sabe onde a pessoa está, e nunca abre um pedido de permissão sozinha. */
export async function pontoSemPedir(): Promise<Ponto | null> {
  const L = carregar();
  if (!L) return null;
  try {
    const p = await L.getForegroundPermissionsAsync();
    if (!p?.granted) return null;
    const pos = await L.getLastKnownPositionAsync().catch(() => null);
    return pos ? { lat: pos.coords.latitude, lng: pos.coords.longitude } : null;
  } catch {
    return null;
  }
}

/** Distância em linha reta, em quilômetros — a fórmula do haversine. */
export function distanciaKm(a: Ponto, b: Ponto): number {
  const R = 6371;
  const rad = (g: number) => (g * Math.PI) / 180;
  const dLat = rad(b.lat - a.lat);
  const dLng = rad(b.lng - a.lng);
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(rad(a.lat)) * Math.cos(rad(b.lat)) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.min(1, Math.sqrt(h)));
}
