import { comRelogioFixo } from './relogio';
import fs from 'node:fs';
import path from 'node:path';
import { trocarLocal } from '../../src/logic/local';
import { resumoDaJornada } from '../../src/logic/resumoDaJornada';
import { PACIENTES, type Paciente } from './pacientes';
import { CASOS, REGRAS_GERAIS } from './casos';

/* A página para revisar os casos antes de rodar: cada pergunta com o
   gabarito, e o resumo de cada paciente exatamente como a IA o lê.

     npx tsx --tsconfig scripts/tsconfig.json scripts/avaliacao/pagina-dos-casos.ts */

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const LOCAL: Record<string, 'pt-BR' | 'en-US' | 'es-419'> = { emily: 'en-US', sofia: 'es-419' };

const resumos = Object.fromEntries(Object.entries(PACIENTES).map(([nome, f]) => {
  trocarLocal(LOCAL[nome] ?? 'pt-BR');
  return [nome, comRelogioFixo(() => resumoDaJornada(f()))];
})) as Record<Paciente, string>;
trocarLocal(null);

const ROTULO = { facil: 'fácil', media: 'média', dificil: 'difícil', critica: 'crítica' } as const;
const lista = (xs: string[]) => `<ul>${xs.map((x) => `<li>${esc(x)}</li>`).join('')}</ul>`;

const porCategoria = new Map<string, typeof CASOS>();
for (const c of CASOS) porCategoria.set(c.categoria, [...(porCategoria.get(c.categoria) ?? []), c]);

const casosHtml = [...porCategoria.entries()].map(([cat, cs]) => `
  <h2>${esc(cat)} <small>${cs.length}</small></h2>
  ${cs.map((c) => `
  <section class="caso">
    <div class="topo"><code>${c.id}</code>
      <span class="chip">${c.paciente}</span><span class="chip">${c.idioma}</span>
      <span class="chip d-${c.dificuldade}">${ROTULO[c.dificuldade]}</span></div>
    ${c.turnos.map((t, i) => `<p class="fala">${c.turnos.length > 1 ? `<b>${i + 1}.</b> ` : ''}${esc(t)}</p>`).join('')}
    <div class="gab"><div><h4>Deve</h4>${lista(c.deve)}</div><div><h4>Não pode</h4>${lista(c.naoPode)}</div></div>
  </section>`).join('')}`).join('');

const pacientesHtml = (Object.keys(PACIENTES) as Paciente[]).map((p) => `
  <details><summary><b>${p}</b> — usado em ${CASOS.filter((c) => c.paciente === p).length} caso(s)</summary>
  <pre>${esc(resumos[p])}</pre></details>`).join('');

const html = `<!doctype html><html lang="pt-BR"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Casos da conversa</title>
<style>
:root{--bg:#f7f8fa;--card:#fff;--tx:#1b1f29;--tx2:#5b6475;--line:#e3e6ec;--chip:#eef1f6;--acc:#065cf5;--crit:#c0264b;--dif:#b86a00}
@media (prefers-color-scheme:dark){:root{--bg:#0b0d12;--card:#141821;--tx:#e8ebf2;--tx2:#9aa3b5;--line:#252b38;--chip:#1e2430;--acc:#6ba1ff;--crit:#ff6b8b;--dif:#f0a640}}
body{background:var(--bg);color:var(--tx);font:15px/1.5 system-ui,sans-serif;margin:0;padding:24px 16px}
main{max-width:860px;margin:0 auto}h1{margin:0 0 4px}h2{margin:32px 0 8px;text-transform:capitalize}h2 small{color:var(--tx2);font-weight:400}
.sub{color:var(--tx2)}.caso{background:var(--card);border:1px solid var(--line);border-radius:12px;padding:14px 16px;margin:10px 0}
.topo{display:flex;flex-wrap:wrap;gap:6px;align-items:center}.topo code{font-weight:600;margin-right:4px}
.chip{background:var(--chip);border-radius:99px;padding:1px 9px;font-size:12px;color:var(--tx2)}
.d-critica{color:var(--crit);font-weight:600}.d-dificil{color:var(--dif)}
.fala{font-size:16px;margin:10px 0 4px;padding:8px 12px;background:var(--chip);border-radius:10px}
.gab{display:grid;grid-template-columns:1fr 1fr;gap:12px}@media(max-width:640px){.gab{grid-template-columns:1fr}}
h4{margin:8px 0 2px;font-size:13px;color:var(--tx2);text-transform:uppercase;letter-spacing:.04em}ul{margin:0;padding-left:18px}li{margin:2px 0}
details{background:var(--card);border:1px solid var(--line);border-radius:12px;padding:10px 14px;margin:8px 0}
pre{white-space:pre-wrap;font-size:12.5px;overflow-x:auto}
</style></head><body><main>
<h1>Casos da conversa</h1>
<p class="sub">${CASOS.length} casos · ${Object.keys(PACIENTES).length} pacientes fictícios · relógio fixo em 30/09/2026 (quarta).
Críticos: ${CASOS.filter((c) => c.dificuldade === 'critica').length} · difíceis: ${CASOS.filter((c) => c.dificuldade === 'dificil').length} ·
outros idiomas: ${CASOS.filter((c) => c.idioma !== 'pt-BR').length} · conversas de várias falas: ${CASOS.filter((c) => c.turnos.length > 1).length}</p>
<h2>Vale para toda resposta</h2>
<section class="caso"><div class="gab"><div><h4>Deve</h4>${lista(REGRAS_GERAIS.deve)}</div><div><h4>Não pode</h4>${lista(REGRAS_GERAIS.naoPode)}</div></div></section>
${casosHtml}
<h2>Os pacientes, como a IA os lê</h2>
${pacientesHtml}
</main></body></html>`;

const saida = path.resolve('.claude/hillclimb/conversa/entradas.html');
fs.mkdirSync(path.dirname(saida), { recursive: true });
fs.writeFileSync(saida, html);
console.log(saida);
