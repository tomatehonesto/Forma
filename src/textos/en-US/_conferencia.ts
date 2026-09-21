/* ============================================================
   A CONFERÊNCIA DE FORMA — o inglês tem de ter a assinatura do português

   ⚠️⚠️ ESTE ARQUIVO NÃO PRODUZ NADA, E É O QUE IMPEDE A TRADUÇÃO DE SAIR
   TORTA. Cada linha abaixo diz ao compilador: este módulo em inglês
   satisfaz exatamente o tipo do módulo em português — mesmas chaves,
   mesmos parâmetros, mesma ordem, mesmos tipos.

   É a garantia que nenhum arquivo de JSON dá. Lá, uma chave esquecida só
   aparece como texto faltando na tela de alguém, e um parâmetro a menos
   vira "undefined" no meio de uma frase.

   ⚠️ E ELE EXISTE SEPARADO DO `CATALOGOS` de propósito: a conferência
   precisa valer enquanto a tradução está sendo escrita, arquivo por
   arquivo, e não só no fim. Um erro descoberto no sexto arquivo é um
   erro; o mesmo erro descoberto no décimo quinto é um padrão que já foi
   repetido catorze vezes.
   ============================================================ */

import type { ciclo as cicloPt } from '../pt-BR/ciclo';
import type { companion as companionPt } from '../pt-BR/companion';
import type { comum as comumPt } from '../pt-BR/comum';
import type { equilibrio as equilibrioPt } from '../pt-BR/equilibrio';
import type { escalas as escalasPt } from '../pt-BR/escalas';
import type { etapa as etapaPt } from '../pt-BR/etapa';
import type { exames as examesPt } from '../pt-BR/exames';
import type { marcadores as marcadoresPt } from '../pt-BR/marcadores';
import type { metas as metasPt } from '../pt-BR/metas';
import type { cruzamentos as cruzamentosPt } from '../pt-BR/cruzamentos';
import type { rotina as rotinaPt } from '../pt-BR/rotina';
import type { tratamento as tratamentoPt } from '../pt-BR/tratamento';
import type { home as homePt } from '../pt-BR/home';
import type { cuidado as cuidadoPt } from '../pt-BR/cuidado';
import type { tempo as tempoPt } from '../pt-BR/tempo';

import { ciclo } from './ciclo';
import { companion } from './companion';
import { comum } from './comum';
import { equilibrio } from './equilibrio';
import { escalas } from './escalas';
import { etapa } from './etapa';
import { exames } from './exames';
import { marcadores } from './marcadores';
import { metas } from './metas';
import { cruzamentos } from './cruzamentos';
import { rotina } from './rotina';
import { tratamento } from './tratamento';
import { home } from './home';
import { cuidado } from './cuidado';
import { tempo } from './tempo';

const _ciclo: typeof cicloPt = ciclo;
const _companion: typeof companionPt = companion;
const _comum: typeof comumPt = comum;
const _equilibrio: typeof equilibrioPt = equilibrio;
const _escalas: typeof escalasPt = escalas;
const _etapa: typeof etapaPt = etapa;
const _exames: typeof examesPt = exames;
const _marcadores: typeof marcadoresPt = marcadores;
const _metas: typeof metasPt = metas;
const _cruzamentos: typeof cruzamentosPt = cruzamentos;
const _rotina: typeof rotinaPt = rotina;
const _tratamento: typeof tratamentoPt = tratamento;
const _home: typeof homePt = home;
const _cuidado: typeof cuidadoPt = cuidado;
const _tempo: typeof tempoPt = tempo;

export const conferidos = [
  _metas, _marcadores, _rotina, _cruzamentos, _cuidado, _home, _tratamento, _ciclo, _companion, _comum, _equilibrio, _escalas, _etapa, _exames, _tempo,
];
