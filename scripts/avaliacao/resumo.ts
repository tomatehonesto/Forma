import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

/* O RESUMO DE UMA RODADA: a nota principal com intervalo, cada nota, os
   casos críticos à parte, as reprovações e o custo medido.

     npx tsx scripts/avaliacao/resumo.ts [baseline|vN]

   ⚠️ O CUSTO SAI DO `usage` DE CADA LINHA × O PREÇO DO MODELO DAQUELA
   LINHA (e o do juiz à parte). Preços por milhão de tokens, da tabela da
   Anthropic em 25/09/2026, com a leitura de cache de cada modelo. Modelo fora da tabela é erro, e não zero. */

const PRECO: Record<string, { in: number; out: number; leitura: number }> = {
  'claude-opus-5': { in: 5, out: 25, leitura: 0.5 },
  'claude-opus-5-5': { in: 4, out: 20, leitura: 0.2 },
  'claude-sonnet-5-5': { in: 2, out: 10, leitura: 0.2 },
  'claude-sonnet-5': { in: 2, out: 10, leitura: 0.2 },
  'claude-haiku-4-5': { in: 1, out: 5, leitura: 0.1 },
};
/* gravação de cache: 1,25x a entrada no de 5 minutos, 2x no de 1 hora */
const custo = (modelo: string | undefined, u: any) => {
  if (!u) return 0;
  const p = PRECO[modelo ?? ''];
  if (!p) throw new Error(`sem preço para o modelo ${modelo}`);
  const umaHora = u.cache_creation?.ephemeral_1h_input_tokens ?? 0;
  const cincoMin = (u.cache_creation_input_tokens ?? 0) - umaHora;
  return ((u.input_tokens ?? 0) * p.in + cincoMin * p.in * 1.25 + umaHora * p.in * 2
    + (u.cache_read_input_tokens ?? 0) * p.leitura + (u.output_tokens ?? 0) * p.out) / 1e6;
};
/* intervalo de Wilson, 95% */
const wilson = (k: number, n: number) => {
  if (!n) return [0, 0];
  const z = 1.96, p = k / n, d = 1 + z * z / n;
  const c = (p + z * z / (2 * n)) / d, m = (z * Math.sqrt(p * (1 - p) / n + z * z / (4 * n * n))) / d;
  return [Math.max(0, c - m), Math.min(1, c + m)];
};
const pct = (x: number) => `${Math.round(x * 100)}%`;
const mediana = (xs: number[]) => { const s = [...xs].sort((a, b) => a - b); return s.length ? s[Math.floor(s.length / 2)] : 0; };

const variante = process.argv[2] ?? 'baseline';
const dir = join('.claude/hillclimb/conversa', variante);
const ler = (f: string) => existsSync(join(dir, f))
  ? readFileSync(join(dir, f), 'utf8').split('\n').filter((l) => l.trim()).map((l) => JSON.parse(l)) : [];
const linhas = ler('results.jsonl');
const erros = ler('errors.jsonl');
const ok = linhas.filter((l) => l.status !== 'truncated');
const NOTAS = ['aprovada', 'seguranca', 'limites', 'dados', 'fatos', 'utilidade', 'tom', 'formato'];

const out: string[] = [];
const p = (s = '') => out.push(s);
p(`# Avaliação da conversa — ${variante}`);
p();
p(`${ok.length} caso(s) julgados · ${linhas.length - ok.length} cortado(s) por tamanho · ${erros.length} falha(s) de infraestrutura`);
p();
for (const n of NOTAS) {
  const k = ok.filter((l) => l.grade?.[n] === 1).length;
  const [a, b] = wilson(k, ok.length);
  p(`- ${n.padEnd(10)} ${pct(k / (ok.length || 1)).padStart(4)}  (${k}/${ok.length}; IC 95% ${pct(a)}–${pct(b)})`);
}
const criticos = ok.filter((l) => l.tags?.[1] === 'critica');
p();
p(`Críticos aprovados: ${criticos.filter((l) => l.grade?.aprovada === 1).length}/${criticos.length}` +
  (criticos.some((l) => l.grade?.seguranca !== 1) ? ` — ⚠️ segurança reprovada em: ${criticos.filter((l) => l.grade?.seguranca !== 1).map((l) => l.prompt_id).join(', ')}` : ''));
p();
p('Por categoria (aprovadas):');
const cats = [...new Set(ok.map((l) => l.tags?.[0]))];
for (const c of cats) {
  const xs = ok.filter((l) => l.tags?.[0] === c);
  p(`- ${c}: ${xs.filter((l) => l.grade?.aprovada === 1).length}/${xs.length}`);
}
p();
p('Reprovadas:');
for (const l of ok.filter((l) => l.grade?.aprovada !== 1)) {
  const quais = NOTAS.slice(1, 7).filter((n) => l.grade?.[n] !== 1);
  p(`- ${l.prompt_id} (${quais.join(', ')}): ${quais.map((n) => l.explanation?.[n]).join(' | ').slice(0, 400)}`);
}
const app = linhas.map((l) => custo(l.model, l.usage));
const juiz = linhas.map((l) => custo(l.judge_model, l.judge_usage));
const falhou = erros.map((e) => custo(e.model, e.usage) + custo(e.judge_model, e.judge_usage));
const total = app.reduce((a, b) => a + b, 0) + juiz.reduce((a, b) => a + b, 0) + falhou.reduce((a, b) => a + b, 0);
p();
p(`Custo medido: US$ ${total.toFixed(3)} no total — resposta US$ ${(app.reduce((a, b) => a + b, 0)).toFixed(3)}, juiz US$ ${(juiz.reduce((a, b) => a + b, 0)).toFixed(3)}, falhas US$ ${(falhou.reduce((a, b) => a + b, 0)).toFixed(3)}`);
if (linhas.length) {
  const porCaso = linhas.map((_, i) => app[i] + juiz[i]);
  p(`Por caso: mediana US$ ${mediana(porCaso).toFixed(4)} (mín ${Math.min(...porCaso).toFixed(4)}, máx ${Math.max(...porCaso).toFixed(4)})`);
  p(`Tempo de resposta: mediana ${mediana(linhas.map((l) => l.latency_s)).toFixed(1)} s · palavras: mediana ${mediana(linhas.map((l) => l.palavras))}`);
  const entrada = linhas.map((l) => (l.usage?.input_tokens ?? 0) + (l.usage?.cache_read_input_tokens ?? 0) + (l.usage?.cache_creation_input_tokens ?? 0));
  p(`Tokens da resposta: entrada mediana ${mediana(entrada)} (cache lida mediana ${mediana(linhas.map((l) => l.usage?.cache_read_input_tokens ?? 0))}), saída mediana ${mediana(linhas.map((l) => l.usage?.output_tokens ?? 0))}`);
}
const texto = out.join('\n');
console.log(texto);
writeFileSync(join(dir, 'resumo.md'), texto + '\n');
