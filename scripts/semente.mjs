/* ============================================================
   A SEMENTE DO PROJETO DE DESENVOLVIMENTO — a rede de exemplo

     node scripts/semente.mjs

   Sobe supabase/seed.sql no morphi-dev: as oito clínicas inventadas, os
   nove profissionais e os oito códigos. Idempotente — rodar de novo
   devolve tudo ao estado do arquivo, inclusive os códigos de exemplo a
   "não usados".

   ⚠️ Só roda com a CLI ligada ao morphi-dev (ver scripts/banco-dev.mjs).
   NUNCA pela opção `--include-seed` do `db push`: ela roda cada arquivo
   uma vez só, e depois ignora as mudanças.
   ============================================================ */
import fs from 'node:fs';
import path from 'node:path';
import { RAIZ, conferirProjeto, rodarSql } from './banco-dev.mjs';

conferirProjeto();

const r = rodarSql(fs.readFileSync(path.join(RAIZ, 'supabase', 'seed.sql'), 'utf8'));
console.log(r.saida.trim());
process.exit(r.status ?? 1);
