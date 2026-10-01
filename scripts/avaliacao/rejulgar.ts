import { appendFileSync, copyFileSync, existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { join, resolve } from 'node:path';
import { comRelogioFixo } from './relogio';
import { trocarLocal } from '../../src/logic/local';
import { resumoDaJornada } from '../../src/logic/resumoDaJornada';
import { PACIENTES } from './pacientes';
import { CASOS } from './casos';
import { NOTAS, JUIZ_PADRAO, chamarJuiz, pedidoAoJuiz } from './juiz';
import { conferirArcabouco } from './arcabouco';

/* ============================================================
   JULGAR DE NOVO UMA RODADA, SEM GERAR AS RESPOSTAS DE NOVO

     npx tsx --tsconfig scripts/tsconfig.json scripts/avaliacao/rejulgar.ts \
       --de v2 --para v3 [--juiz claude-opus-5-5]

   Para comparar com justiça quando o juiz muda: as respostas de uma
   rodada antiga recebem as notas do juiz novo, e só o juiz é pago. A
   linha nova guarda o modelo e o uso DA RESPOSTA original (o custo dela
   é o de quando foi gerada) e o juiz novo.

   A resposta julgada é a bruta (meta.resposta_bruta) quando a rodada a
   guardou; nas mais antigas, a última fala da transcrição, que é a
   resposta já limpa pelo app (limparResposta) — o mesmo texto, com
   **negrito** virado <b> e link inválido virado texto. Por isso a nota
   de formato vem copiada da rodada original, e não refeita.
   ============================================================ */

const FLUXO = '.claude/hillclimb/conversa';
if (existsSync('.env')) process.loadEnvFile('.env');
const Anthropic = createRequire(resolve('servidor/package.json'))('@anthropic-ai/sdk').default;

const arg = (k: string) => { const i = process.argv.indexOf(k); return i > 0 ? process.argv[i + 1] : undefined; };
const deArg = arg('--de'), paraArg = arg('--para'), juiz = arg('--juiz') ?? JUIZ_PADRAO;
if (!deArg || !paraArg || !/^v[1-9]\d*$/.test(paraArg)) { console.error('uso: rejulgar.ts --de <variante> --para v<N> [--juiz modelo]'); process.exit(2); }
const de: string = deArg, para: string = paraArg;

(async () => {
  const caminhoEstado = join(FLUXO, '_state.json');
  const st = JSON.parse(readFileSync(caminhoEstado, 'utf8'));
  conferirArcabouco(caminhoEstado, st, false);
  const { BASE } = await import('../../servidor/conversa/base');
  const cliente = new Anthropic();

  const origem = readFileSync(join(FLUXO, de, 'results.jsonl'), 'utf8').split('\n').filter((l) => l.trim()).map((l) => JSON.parse(l));
  const destino = join(FLUXO, para);
  mkdirSync(join(destino, 'traces'), { recursive: true });
  const saida = join(destino, 'results.jsonl');
  const feitos = new Set(existsSync(saida) ? readFileSync(saida, 'utf8').split('\n').filter((l) => l.trim()).map((l) => JSON.parse(l).prompt_id) : []);

  let i = 0, ok = 0, falha = 0;
  const fila = origem.filter((r) => !feitos.has(r.prompt_id));
  console.error(`[${para}] julgando de novo ${fila.length} resposta(s) de ${de} com ${juiz}`);
  async function trabalhador() {
    while (i < fila.length) {
      const r = fila[i++];
      const c = CASOS.find((x) => x.id === r.prompt_id);
      if (!c) { console.error(`  caso sumiu: ${r.prompt_id}`); falha++; continue; }
      const trilha = JSON.parse(readFileSync(join(FLUXO, de, 'traces', `${r.prompt_id}_rep${r.rep}.json`), 'utf8'));
      const falas = trilha.filter((t: any) => t.role === 'user' || t.role === 'assistant');
      const resposta: string = r.meta?.resposta_bruta ?? falas[falas.length - 1].content;
      const conversa = falas.slice(0, -1).map((t: any) => ({ quem: t.role === 'user' ? 'pessoa' as const : 'morphi' as const, texto: t.content }));
      trocarLocal(c.idioma);
      const resumo = comRelogioFixo(() => resumoDaJornada(PACIENTES[c.paciente]()));
      trocarLocal(null);
      try {
        let j: Awaited<ReturnType<typeof chamarJuiz>> | null = null;
        for (let tent = 0; !j; tent++) {
          try { j = await chamarJuiz(cliente, juiz, BASE, pedidoAoJuiz(c, resumo, conversa, resposta)); } catch (e: any) {
            const passageiro = e?.status === 429 || e?.status === 529 || (e?.status >= 500 && e?.status < 600);
            if (!passageiro || tent >= 4) throw e;
            await new Promise((ok2) => setTimeout(ok2, Math.min(60_000, 1000 * 2 ** tent) * (0.5 + Math.random())));
          }
        }
        const grade: Record<string, number> = { aprovada: NOTAS.every((n) => j!.veredito[n].passou) ? 1 : 0 };
        const explanation: Record<string, string> = {};
        for (const n of NOTAS) { grade[n] = j.veredito[n].passou ? 1 : 0; explanation[n] = j.veredito[n].motivo; }
        grade.formato = r.grade?.formato ?? 1;
        explanation.formato = r.explanation?.formato ?? '';
        appendFileSync(saida, JSON.stringify({ ...r, judge_model: j.judge_model, judge_usage: j.judge_usage, grade, explanation }) + '\n');
        copyFileSync(join(FLUXO, de, 'traces', `${r.prompt_id}_rep${r.rep}.json`), join(destino, 'traces', `${r.prompt_id}_rep${r.rep}.json`));
        ok++;
      } catch (e: any) {
        falha++;
        appendFileSync(join(destino, 'errors.jsonl'), JSON.stringify({ prompt_id: r.prompt_id, rep: r.rep, failure_class: e?.failure_class ?? 'error', error: String(e?.message || e), judge_model: e?.judge_model, judge_usage: e?.judge_usage }) + '\n');
        console.error(`  ${r.prompt_id} FALHOU: ${e?.message || e}`);
      }
    }
  }
  await Promise.all(Array.from({ length: 4 }, trabalhador));
  console.error(`[${para}] ${ok} julgadas, ${falha} falharam`);
  process.exit(falha ? 1 : 0);
})();
