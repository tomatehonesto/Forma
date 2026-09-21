/* O que ainda é texto em português dentro do código.

   Fora da conta, de propósito:
     · src/textos/          é o catálogo
     · logic/alimentos*.ts  nome de comida (TACO/FNDDS/redes) — dado
     · logic/documentos.ts  minuta jurídica
     · logic/seed.ts        a semente de demonstração — dado, não fala
     · logic/meds.ts?       nome de medicamento é marca */
import { readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const RAIZ = 'C:/dev/Forma/src';
const FORA = [/textos[\\/]/, /logic[\\/]alimentos/, /logic[\\/]documentos/, /logic[\\/]seed\.ts$/];

const PT = /[çãõáéíóúâêôàÇÃÕÁÉÍÓÚÂÊÔÀ]|\b(voc[eê]|sua|seu|n[ãa]o|para|com|que|dia|dias|dose|peso|hoje|meta|semana|ver|fazer|de|do|da|em|uma|um)\b/i;

const anda = (dir, out = []) => {
  for (const nome of readdirSync(dir)) {
    const p = join(dir, nome);
    if (statSync(p).isDirectory()) anda(p, out);
    else if (/\.tsx?$/.test(nome)) out.push(p.replace(/\\/g, '/'));
  }
  return out;
};

/* tira comentários de bloco e de linha, sem tocar no resto */
const semComentarios = (src) => src
  .replace(/\/\*[^]*?\*\//g, (m) => m.replace(/[^\n]/g, ' '))
  .split('\n')
  .map((l) => l.replace(/([^:'"`])\/\/.*$/, '$1'))
  .join('\n');

const achados = [];

for (const f of anda(RAIZ)) {
  if (FORA.some((re) => re.test(f))) continue;
  const bruto = readFileSync(f, 'utf8');
  const src = semComentarios(bruto);

  const daqui = [];

  /* 1. literais de string com prosa */
  for (const m of src.matchAll(/'((?:[^'\\\n]|\\.){3,}?)'|"((?:[^"\\\n]|\\.){3,}?)"|`((?:[^`\\]|\\.){3,}?)`/g)) {
    const s = m[1] ?? m[2] ?? m[3];
    if (!s || !/[a-zA-Zà-ÿ]/.test(s)) continue;
    if (!PT.test(s)) continue;
    /* nome de módulo, rota, classe, chave: sem espaço e tudo minúsculo */
    if (!/\s/.test(s) && /^[a-z0-9@./_-]+$/.test(s)) continue;
    if (/^https?:|^\.\/|^\.\.\//.test(s)) continue;
    daqui.push(s.trim());
  }

  /* 2. texto solto entre tags JSX */
  for (const m of src.matchAll(/>([^<>{}\n]{3,})</g)) {
    const s = m[1].trim();
    if (!s || !/[a-zA-Zà-ÿ]/.test(s) || !PT.test(s)) continue;
    daqui.push(s);
  }

  if (daqui.length) achados.push([f.replace('C:/dev/Forma/', ''), daqui]);
}

achados.sort((a, b) => b[1].length - a[1].length);

const total = achados.reduce((n, [, l]) => n + l.length, 0);
let saida = `# INVENTÁRIO — ${total} frases em ${achados.length} arquivos\n\n`;
for (const [f, l] of achados) {
  saida += `\n## ${f}  (${l.length})\n`;
  for (const s of l) saida += `  · ${s}\n`;
}

writeFileSync(process.argv[2] ?? 'inventario-textos.txt', saida);
console.log(total + ' frases em ' + achados.length + ' arquivos');
console.log('\nos vinte maiores:');
for (const [f, l] of achados.slice(0, 20)) console.log('  ' + String(l.length).padStart(4) + '  ' + f);
