import { appendFileSync, existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { join, relative, resolve } from 'node:path';
import { comRelogioFixo } from './relogio';
import { trocarLocal } from '../../src/logic/local';
import { resumoDaJornada } from '../../src/logic/resumoDaJornada';
import { limparResposta, TELAS_DA_CONVERSA } from '../../src/logic/conversa';
import { PACIENTES } from './pacientes';
import { CASOS, type Caso } from './casos';
import { NOTAS, JUIZ_PADRAO, chamarJuiz, pedidoAoJuiz } from './juiz';
import { conferirArcabouco } from './arcabouco';

/* ============================================================
   A AVALIAÇÃO DA CONVERSA DO MORPHI INTELLIGENCE

     npx tsx --tsconfig scripts/tsconfig.json scripts/avaliacao/rodar.ts \
       --variant baseline [--casos id1,id2] [--model claude-opus-5] [--reps 1]

   Na primeira vez, e sempre que casos, pacientes, juiz ou este arquivo
   mudarem, uma PESSOA revisa e aprova o arcabouço, sem rodar nada:

     npx tsx --tsconfig scripts/tsconfig.json scripts/avaliacao/rodar.ts --so-aprovar

   Roda cada caso de casos.ts pelo MESMO pedido que o servidor monta
   (servidor/api/conversa, `parametrosDaConversa`), julga com o Sonnet
   5.5 (juiz.ts) e escreve em .claude/hillclimb/conversa/<variante>/:
   results.jsonl (uma linha por caso), traces/ (a conversa inteira) e
   errors.jsonl (o que falhou por infraestrutura, e não por resposta).

   ⚠️ A CHAVE DA API É DE SCRIPT, e mora no .env da raiz (fora do git),
   como a do Pexels: ANTHROPIC_API_KEY=... Nunca EXPO_PUBLIC_.

   ⚠️ GASTA CRÉDITO DE VERDADE: cada caso é uma chamada ao Opus 5 por fala
   e uma ao Sonnet 5.5. Rode o piloto (--casos) antes da bateria inteira.

   Adaptado do esqueleto de avaliação do guia de evals da Anthropic
   (retomada, espera com sorteio, teto por caso, conferência do modelo
   servido, falhas à parte, trava do arcabouço).
   ============================================================ */

const FLUXO = '.claude/hillclimb/conversa';

if (existsSync('.env')) process.loadEnvFile('.env');
const doServidor = createRequire(resolve('servidor/package.json'));
const Anthropic = doServidor('@anthropic-ai/sdk').default;

type Args = { variant: string; model?: string; juiz: string; reps: number; concurrency: number; timeoutS: number; casos?: string[]; approveHarness: boolean; soAprovar?: boolean };

function lerArgs(argv: string[]): Args {
  const a: Args = { variant: 'baseline', juiz: JUIZ_PADRAO, reps: 1, concurrency: 4, timeoutS: 300, approveHarness: false };
  const val = (i: number) => { if (argv[i] === undefined) { console.error(`falta o valor de ${argv[i - 1]}`); process.exit(2); } return argv[i]; };
  for (let i = 0; i < argv.length; i++) {
    const k = argv[i];
    if (k === '--variant') a.variant = val(++i);
    else if (k === '--model') a.model = val(++i);
    else if (k === '--juiz') a.juiz = val(++i);
    else if (k === '--reps') a.reps = +val(++i);
    else if (k === '--concurrency') a.concurrency = +val(++i);
    else if (k === '--timeout-s') a.timeoutS = +val(++i);
    else if (k === '--casos') a.casos = val(++i).split(',').map((s) => s.trim()).filter(Boolean);
    else if (k === '--approve-harness') a.approveHarness = true;
    else if (k === '--so-aprovar') { a.approveHarness = true; a.soAprovar = true; }
    else { console.error(`argumento desconhecido: ${k}`); process.exit(2); }
  }
  if (!/^(baseline|v[1-9]\d*)$/.test(a.variant)) { console.error(`--variant tem de ser 'baseline' ou 'v<N>'`); process.exit(2); }
  if (!Number.isInteger(a.reps) || a.reps < 1 || !Number.isInteger(a.concurrency) || a.concurrency < 1) process.exit(2);
  return a;
}

async function comEspera<T>(fn: () => Promise<T>, tentativas: { n: number }, prazo: number, max = 5): Promise<T> {
  for (let i = 0; ; i++) {
    if (Date.now() >= prazo) { const e: any = new Error('teto do caso antes da tentativa'); e.failure_class = 'timeout'; throw e; }
    try { return await fn(); } catch (e: any) {
      const st = e?.status;
      const passageiro = st === 429 || st === 529 || (st >= 500 && st < 600) || /overloaded|rate.?limit/i.test(String(e?.message ?? ''));
      if (!passageiro || i >= max - 1) throw e;
      const espera = Math.min(60_000, 1000 * 2 ** i) * (0.5 + Math.random());
      if (Date.now() + espera >= prazo) throw e;
      tentativas.n++;
      await new Promise((r) => setTimeout(r, espera));
    }
  }
}

function comTeto<T>(p: Promise<T>, s: number, rotulo: string): Promise<T> {
  if (!(s > 0)) return p;
  let t: any;
  const teto = new Promise<never>((_, rej) => { t = setTimeout(() => { const e: any = new Error(`${rotulo}: passou de ${s}s`); e.failure_class = 'timeout'; rej(e); }, s * 1000); });
  return Promise.race([p, teto]).finally(() => clearTimeout(t));
}

type Uso = { input_tokens: number; output_tokens: number; cache_read_input_tokens: number; cache_creation_input_tokens: number };
const somaUso = (a: Uso, b: any): Uso => ({
  input_tokens: a.input_tokens + (b?.input_tokens ?? 0),
  output_tokens: a.output_tokens + (b?.output_tokens ?? 0),
  cache_read_input_tokens: a.cache_read_input_tokens + (b?.cache_read_input_tokens ?? 0),
  cache_creation_input_tokens: a.cache_creation_input_tokens + (b?.cache_creation_input_tokens ?? 0),
});
const usoZero = (): Uso => ({ input_tokens: 0, output_tokens: 0, cache_read_input_tokens: 0, cache_creation_input_tokens: 0 });

/* O formato que o app espera (servidor/conversa/prompt.ts, O FORMATO),
   conferido sem juiz: no máximo dois <b>, sem asteriscos de markdown,
   sem títulos, sem tabela, e link só para tela que existe. */
function formatoOk(bruto: string): { ok: boolean; motivo: string } {
  const falhas: string[] = [];
  if ((bruto.match(/<b>/g) ?? []).length > 2) falhas.push('mais de dois <b>');
  if (/\*\*[^*]+\*\*/.test(bruto)) falhas.push('negrito com asteriscos');
  if (/^\s*#{1,6}\s/m.test(bruto)) falhas.push('título com #');
  if (/^\s*\|.*\|\s*$/m.test(bruto)) falhas.push('tabela');
  for (const m of bruto.matchAll(/\[[^\]]+\]\(([^)]*)\)/g)) {
    if (!TELAS_DA_CONVERSA.includes(m[1].trim())) falhas.push(`link para fora: ${m[1]}`);
  }
  return { ok: !falhas.length, motivo: falhas.join('; ') || 'ok' };
}

async function main() {
  const args = lerArgs(process.argv.slice(2));
  const vdir = join(FLUXO, args.variant);
  mkdirSync(join(vdir, 'traces'), { recursive: true });
  const caminhoEstado = join(FLUXO, '_state.json');
  let st: any = {};
  if (existsSync(caminhoEstado)) st = JSON.parse(readFileSync(caminhoEstado, 'utf8')) || {};
  conferirArcabouco(caminhoEstado, st, args.approveHarness);
  if (args.soAprovar) process.exit(0);

  if (!process.env.ANTHROPIC_API_KEY) {
    console.error('Falta ANTHROPIC_API_KEY no .env da raiz (chave de script, fora do git).');
    process.exit(2);
  }
  /* O servidor é importado só agora: ele cria o cliente da API no import,
     e a chave precisa estar no ambiente antes. */
  const { lerPedido, parametrosDaConversa } = await import('../../servidor/api/conversa');
  const { INSTRUCOES, blocoDaPessoa } = await import('../../servidor/conversa/prompt');
  const { BASE } = await import('../../servidor/conversa/base');
  const cliente = new Anthropic();

  /* Os resumos, montados com o relógio fixo e no idioma do caso. */
  const casos = CASOS.filter((c) => !args.casos || args.casos.includes(c.id));
  if (args.casos) for (const id of args.casos) if (!CASOS.some((c) => c.id === id)) { console.error(`caso desconhecido: ${id}`); process.exit(2); }
  const resumoDe = new Map<string, string>();
  for (const c of casos) {
    trocarLocal(c.idioma);
    resumoDe.set(c.id, comRelogioFixo(() => resumoDaJornada(PACIENTES[c.paciente]())));
  }
  trocarLocal(null);

  const caminhoResultados = join(vdir, 'results.jsonl');
  const caminhoErros = join(vdir, 'errors.jsonl');
  const feitos = new Set<string>();
  if (existsSync(caminhoResultados)) {
    for (const l of readFileSync(caminhoResultados, 'utf8').split('\n')) {
      if (!l.trim()) continue;
      try { const r = JSON.parse(l); feitos.add(`${r.prompt_id}\0${r.rep}`); } catch {}
    }
  }
  for (const p of [caminhoResultados, caminhoErros]) {
    if (!existsSync(p)) continue;
    const b = readFileSync(p);
    if (b.length && b[b.length - 1] !== 0x0a) appendFileSync(p, '\n');
  }

  /* Uma conversa inteira: cada fala vai ao modelo com as respostas
     anteriores DELE, limpas como o app guarda (limparResposta). */
  async function rodarCaso(c: Caso, tent: { n: number }, prazo: number) {
    const resumo = resumoDe.get(c.id)!;
    const historico: { quem: 'eu' | 'morphi'; texto: string }[] = [];
    let uso = usoZero();
    const porFala: any[] = [];
    let bruto = '', modelo = '', parada = '', latencia = 0;
    let modeloPedido = '';
    for (const pergunta of c.turnos) {
      const pedido = lerPedido({ pergunta, historico, resumo, idioma: c.idioma });
      if (!pedido) throw Object.assign(new Error('o servidor recusaria este pedido (lerPedido)'), { failure_class: 'harness' });
      const params = parametrosDaConversa(pedido);
      if (args.model) params.model = args.model;
      /* O Haiku 4.5 não aceita `effort` (400): sem ele, roda no padrão. */
      if (params.model.startsWith('claude-haiku')) delete (params as any).output_config;
      if (params.model === args.juiz) throw Object.assign(new Error('o modelo que responde não pode ser o juiz'), { failure_class: 'harness' });
      modeloPedido = params.model;
      const final: any = await comEspera(async () => {
        const t0 = Date.now();
        const m = await cliente.messages.stream(params).finalMessage();
        latencia = (Date.now() - t0) / 1000;
        return m;
      }, tent, prazo);
      if (final.model !== params.model) throw Object.assign(new Error(`modelo servido ${final.model} ≠ pedido ${params.model}`), { failure_class: 'serving_substitution' });
      bruto = final.content.filter((b: any) => b.type === 'text').map((b: any) => b.text).join('');
      modelo = final.model; parada = final.stop_reason;
      uso = somaUso(uso, final.usage);
      porFala.push({ pergunta, stop_reason: final.stop_reason, usage: final.usage, latency_s: latencia });
      historico.push({ quem: 'eu', texto: pergunta }, { quem: 'morphi', texto: limparResposta(bruto) });
      if (final.stop_reason === 'max_tokens') break;
    }
    const truncada = porFala.some((f) => f.stop_reason === 'max_tokens');
    const transcricao = [
      { role: 'system', content: `[regras e base de conhecimento: ${INSTRUCOES.length} caracteres, iguais para todo caso]\n\n${blocoDaPessoa(c.idioma, resumo)}` },
      ...historico.map((h) => ({ role: h.quem === 'eu' ? 'user' : 'assistant', content: h.texto })),
    ];
    return { bruto, historico, uso, porFala, modelo, modeloPedido, parada, truncada, transcricao, latencia_s: porFala.reduce((x, f) => x + f.latency_s, 0) };
  }

  async function julgar(c: Caso, run: Awaited<ReturnType<typeof rodarCaso>>, tent: { n: number }, prazo: number) {
    const conversa = run.historico.slice(0, -1).map((h) => ({ quem: h.quem === 'eu' ? 'pessoa' as const : 'morphi' as const, texto: h.texto }));
    const { veredito: v, judge_model, judge_usage } = await comEspera(
      () => chamarJuiz(cliente, args.juiz, BASE, pedidoAoJuiz(c, resumoDe.get(c.id)!, conversa, run.bruto)), tent, prazo);
    const f = formatoOk(run.bruto);
    const grade: Record<string, number> = { aprovada: NOTAS.every((n) => v[n].passou) ? 1 : 0 };
    const explanation: Record<string, string> = {};
    for (const n of NOTAS) { grade[n] = v[n].passou ? 1 : 0; explanation[n] = v[n].motivo; }
    grade.formato = f.ok ? 1 : 0;
    explanation.formato = f.motivo;
    return { grade, explanation, judge_model, judge_usage };
  }

  const tarefas: { c: Caso; rep: number }[] = [];
  for (const c of casos) for (let rep = 0; rep < args.reps; rep++) if (!feitos.has(`${c.id}\0${rep}`)) tarefas.push({ c, rep });
  console.error(`[${args.variant}] ${tarefas.length} de ${casos.length * args.reps} (caso, rep) para rodar`);

  let i = 0, ok = 0, falha = 0;
  const t0 = Date.now();
  async function trabalhador() {
    while (i < tarefas.length) {
      const { c, rep } = tarefas[i++];
      const inicio = Date.now();
      const prazo = args.timeoutS > 0 ? inicio + args.timeoutS * 1000 : Infinity;
      const tApp = { n: 0 }, tJuiz = { n: 0 };
      let ultimo: any = null;
      let gravou = false;
      try {
        const { run, g } = await comTeto((async () => {
          const run = await rodarCaso(c, tApp, prazo);
          ultimo = run;
          if (run.truncada) return { run, g: null };
          const g = await julgar(c, run, tJuiz, prazo);
          return { run, g };
        })(), args.timeoutS, `${c.id} rep${rep}`);
        const linha = {
          prompt_id: c.id, rep,
          prompt: c.turnos.join('\n→ '),
          tags: [c.categoria, c.dificuldade, c.idioma, c.paciente],
          status: run.truncada ? 'truncated' : 'ok',
          model: run.modelo, usage: run.uso, stop_reason: run.parada,
          judge_model: g?.judge_model, judge_usage: g?.judge_usage,
          latency_s: run.latencia_s,
          palavras: run.bruto.trim().split(/\s+/).filter(Boolean).length,
          turnos: c.turnos.length,
          grade: g?.grade ?? {}, explanation: g?.explanation,
          meta: { resposta_bruta: run.bruto, por_fala: run.porFala, ...(tApp.n ? { retries: tApp.n } : {}), ...(tJuiz.n ? { judge_retries: tJuiz.n } : {}) },
        };
        appendFileSync(caminhoResultados, JSON.stringify(linha) + '\n');
        gravou = true;
        writeFileSync(join(vdir, 'traces', `${c.id}_rep${rep}.json`), JSON.stringify(run.transcricao, null, 2));
        ok++;
        console.error(`  ${c.id}: ${g ? (g.grade.aprovada ? 'aprovada' : `reprovada (${NOTAS.filter((n) => !g.grade[n]).join(', ')})`) : 'CORTADA'}`);
      } catch (e: any) {
        falha++;
        if (gravou) { console.error(`  ${c.id} rep${rep}: nota gravada, mas a transcrição falhou: ${e?.message}`); continue; }
        appendFileSync(caminhoErros, JSON.stringify({
          prompt_id: c.id, rep, failure_class: e?.failure_class ?? 'error', error: String(e?.message || e),
          retries: tApp.n, judge_retries: tJuiz.n,
          model: ultimo?.modelo, usage: ultimo?.uso, judge_model: e?.judge_model, judge_usage: e?.judge_usage,
          latency_s: (Date.now() - inicio) / 1000,
        }) + '\n');
        console.error(`  ${c.id} rep${rep} FALHOU: ${e?.message || e}`);
      }
    }
  }
  const progresso = () => {
    const linha = `[${args.variant}] ${ok + falha}/${tarefas.length} (${ok} ok, ${falha} falharam), ${Math.round((Date.now() - t0) / 1000)}s`;
    console.error(linha);
    try { writeFileSync(join(vdir, 'progress.txt'), linha + '\n'); } catch {}
  };
  const tique = setInterval(progresso, 30_000);
  /* ⚠️ O PRIMEIRO CASO RODA SOZINHO, para aquecer o cache. As regras e a
     base são 12,5 mil tokens; no piloto, os quatro primeiros casos saíram
     juntos e cada um gravou a própria cópia — e gravar custa 12x ler.
     Um caso sozinho grava uma vez (resposta e juiz), e os outros leem. */
  if (tarefas.length > 1) {
    const resto = tarefas.splice(1);
    await trabalhador();
    tarefas.push(...resto);
  }
  await Promise.all(Array.from({ length: args.concurrency }, trabalhador));
  clearInterval(tique); progresso();
  process.exit(falha ? 1 : 0);
}

main();
