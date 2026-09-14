/* Gera src/ui/fotosAlimento.ts a partir dos arquivos que existirem em
   assets/images/alimentos/.

     node scripts/gerar-fotos.mjs

   POR QUE UM GERADOR. O `require` do Metro precisa do caminho literal
   no código — não dá para montar 'assets/.../' + id em tempo de
   execução, e não dá para escrever as 224 linhas de antemão porque um
   `require` de arquivo que não existe quebra o bundle inteiro.

   Então o mapa é escrito a partir do que está no disco. Caia uma foto
   nova na pasta, rode isto, e ela entra. Saia uma, rode isto, e ela
   some sem deixar um require órfão.

   O NOME DO ARQUIVO É O ID DO ALIMENTO: peito-frango.jpg, banana.jpg,
   tikka-masala.jpg. Os ids estão em src/logic/alimentos.ts, e o script
   avisa quando encontra um arquivo que não corresponde a nenhum.

   Prateleira também vale: um arquivo chamado como a prateleira em
   minúsculas e sem acento — "carnes-e-aves.jpg" — cobre todo alimento
   daquele corredor que ainda não tiver foto própria. */
import fs from 'node:fs';
import path from 'node:path';

const PASTA = 'assets/images/alimentos';
const SAIDA = 'src/ui/fotosAlimento.ts';

const semAcento = (s) =>
  s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase()
    .replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

/* Os ids e as prateleiras que existem, para avisar sobre arquivo que
   não vai ser usado por ninguém. */
const fonte = fs.readFileSync('src/logic/alimentos.ts', 'utf8');
const ids = new Set([...fonte.matchAll(/\{ id: '([^']+)'/g)].map((m) => m[1]));
const prateleiras = new Set(
  [...fonte.matchAll(/onde: '([^']+)'/g)].map((m) => semAcento(m[1])),
);

const arquivos = fs.existsSync(PASTA)
  ? fs.readdirSync(PASTA).filter((n) => /\.(jpg|jpeg|png|webp)$/i.test(n)).sort()
  : [];

const porItem = [];
const porPrateleira = [];
const orfaos = [];
for (const arq of arquivos) {
  const chave = path.basename(arq, path.extname(arq));
  if (ids.has(chave)) porItem.push([chave, arq]);
  else if (prateleiras.has(chave)) porPrateleira.push([chave, arq]);
  else orfaos.push(arq);
}

const linha = ([chave, arq]) => `  '${chave}': require('../../${PASTA}/${arq}'),`;

const ts = `/* ============================================================
   AS FOTOS DOS ALIMENTOS

   ARQUIVO GERADO por scripts/gerar-fotos.mjs a partir do que existe em
   ${PASTA}/. Para acrescentar uma foto, ponha o arquivo lá com o id do
   alimento no nome e rode:

     node scripts/gerar-fotos.mjs

   A tela de consulta procura nesta ordem: a foto DAQUELE alimento, a
   foto da prateleira dele, e por último o painel de cor — que continua
   dizendo alguma coisa, porque a cor vem do nutriente em destaque.

   A prateleira existe para o meio do caminho. Com vinte fotos entre
   duzentas e vinte e quatro, dezenove telas caem no painel de cor; com
   uma foto de "carnes e aves", todas as carnes já abrem com imagem
   enquanto a específica não chega.
   ============================================================ */
const POR_ITEM: Record<string, any> = {
${porItem.map(linha).join('\n')}
};

const POR_PRATELEIRA: Record<string, any> = {
${porPrateleira.map(linha).join('\n')}
};

const chave = (s: string) =>
  s.normalize('NFD').replace(/[\\u0300-\\u036f]/g, '').toLowerCase()
    .replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

/** A foto de um alimento: a dele, a da prateleira dele, ou nenhuma. */
export function fotoDoAlimento(id: string, onde: string): any | null {
  return POR_ITEM[id] || POR_PRATELEIRA[chave(onde)] || null;
}

/** Quantas fotos existem hoje — a tela de consulta não usa, o gerador sim. */
export const TOTAL_FOTOS = ${porItem.length + porPrateleira.length};
`;

fs.writeFileSync(SAIDA, ts);

if (orfaos.length) {
  console.log('arquivos que não batem com nenhum id nem prateleira:');
  for (const o of orfaos) console.log('  ' + o);
}
console.log(
  `fotos: ${porItem.length} por alimento, ${porPrateleira.length} por prateleira` +
  ` (de ${ids.size} alimentos)`,
);
