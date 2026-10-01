import { createHash } from 'node:crypto';
import { readFileSync, writeFileSync } from 'node:fs';
import { relative, resolve } from 'node:path';

/* A TRAVA DO ARCABOUÇO, para todo script da avaliação que gasta crédito.

   O hash dos arquivos listados em _state.json.harness_paths (os casos, os
   pacientes, o juiz e os próprios scripts). Mudou, nada roda até uma
   PESSOA revisar e aprovar com `rodar.ts --so-aprovar` — nunca o
   assistente. Assim uma rodada que edita a avaliação não roda sem que
   alguém tenha olhado.

   ⚠️ SÓ A LISTA, e não "o script que chamou": rodar.ts e rejulgar.ts
   chegam ao mesmo hash, e uma aprovação vale para os dois. */
export function conferirArcabouco(caminho: string, st: any, aprovar: boolean) {
  const lista = Array.isArray(st.harness_paths) ? st.harness_paths.map(String) : [];
  if (!lista.length) { console.error(`${caminho} não lista harness_paths`); process.exit(2); }
  const caminhos = [...new Set(lista.map((p: string) => resolve(p)))].sort() as string[];
  const h = createHash('sha256');
  for (const p of caminhos) h.update(relative(process.cwd(), p)).update('\0').update(readFileSync(p)).update('\0');
  const sha = h.digest('hex');
  if (st.harness_sha === sha) return;
  if (aprovar) {
    st.harness_sha = sha;
    writeFileSync(caminho, JSON.stringify(st, null, 2) + '\n');
    console.error(`arcabouço aprovado: ${sha.slice(0, 12)} sobre ${caminhos.length} arquivo(s)`);
    return;
  }
  console.error(st.harness_sha == null
    ? `nenhum arcabouço aprovado em ${caminho} (agora ${sha.slice(0, 12)}). Revise e rode rodar.ts --so-aprovar.`
    : `a avaliação mudou desde a última aprovação (${String(st.harness_sha).slice(0, 12)} → ${sha.slice(0, 12)}). Revise e rode rodar.ts --so-aprovar.`);
  process.exit(2);
}
