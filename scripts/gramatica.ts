/* ============================================================
   A CONFERÊNCIA DA GRAMÁTICA — a rede que o congelamento não cobre

   ⚠️⚠️ O CONGELAMENTO NÃO VÊ ESTE MÓDULO. Ele roda sete cenários e nenhum
   deles produz uma frase que contenha o nome do recipiente: a palavra
   "caneta" aparece na saída só como nome de cenário e como chave
   `canetaAtual`. Rodar o congelamento antes e depois de mexer na
   concordância dá "idêntico" sem ter testado nada — que é pior do que
   não ter rede, porque parece uma.

   Então a rede da gramática é esta: as seis funções, vezes as quatro
   formas, vezes os dois idiomas. São puras e não dependem de estado
   nenhum, então a saída é estável e o diff é o teste.

     npx tsx --tsconfig scripts/tsconfig.json scripts/gramatica.ts

   ⚠️ E O PORTUGUÊS É O QUE NÃO PODE MUDAR. O inglês pode: ele está sendo
   escrito. As quatro linhas de português abaixo são as mesmas que o
   código produzia quando a concordância morava em logic/formas.ts.
   ============================================================ */

import { trocarLocal, DISPONIVEIS } from '../src/logic/local';
import { FORMAS, concordar, noNa, doDa, nesteNesta, umOutro, oA, type Forma } from '../src/logic/formas';

const TODAS: Forma[] = ['caneta', 'frasco', 'seringa', 'comprimido'];

const saida: Record<string, Record<string, string>> = {};

for (const local of DISPONIVEIS) {
  trocarLocal(local);
  const porForma: Record<string, string> = {};
  for (const f of TODAS) {
    const v = FORMAS()[f];
    porForma[f] = [
      v.recipiente, v.plural, v.verbo, v.acao, v.estoque, v.injetavel ? 'injetável' : 'oral',
      noNa(f), doDa(f), nesteNesta(f),
      umOutro(f), umOutro(f, true), oA(f),
      concordar(f, 'novo', 'nova'), concordar(f, 'deste', 'desta'),
    ].join(' · ');
  }
  saida[local] = porForma;
}

console.log(JSON.stringify(saida, null, 2));
