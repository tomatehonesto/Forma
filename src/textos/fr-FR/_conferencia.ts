/* ============================================================
   A CONFERÊNCIA DE FORMA — fr-FR tem de ter a assinatura do português

   ⚠️⚠️ ESTE ARQUIVO NÃO PRODUZ NADA, E É O QUE IMPEDE A TRADUÇÃO DE SAIR
   TORTA. Cada linha abaixo diz ao compilador: este módulo satisfaz
   exatamente o tipo do módulo em português — mesmas chaves, mesmos
   parâmetros, mesma ordem, mesmos tipos.

   ⚠️ Ele existe separado do `CATALOGOS` de propósito: a conferência
   precisa valer ENQUANTO a tradução está sendo escrita, arquivo por
   arquivo. Um erro descoberto no sexto arquivo é um erro; o mesmo erro
   descoberto no trigésimo é um padrão repetido vinte e nove vezes.

   ⚠️⚠️ E A ASSINATURA NÃO É A TRADUÇÃO. Isto compilar prova que não falta
   chave e que nenhum parâmetro mudou de lugar. NÃO prova que o idioma
   está bem escrito, nem que a cópia clínica diz o que tem de dizer — isso
   quem confere é quem fala o idioma. Ver PENDENCIAS.

   ⚠️ GERADO por scripts/conferencia.mjs. Não edite à mão.
   ============================================================ */


import type { alertas as alertasPt } from '../pt-BR/alertas';
import type { avisos as avisosPt } from '../pt-BR/avisos';
import type { comum as comumPt } from '../pt-BR/comum';
import type { fontes as fontesPt } from '../pt-BR/fontes';
import type { idioma as idiomaPt } from '../pt-BR/idioma';
import type { medidas as medidasPt } from '../pt-BR/medidas';
import type { tempo as tempoPt } from '../pt-BR/tempo';

import { alertas } from './alertas';
import { avisos } from './avisos';
import { comum } from './comum';
import { fontes } from './fontes';
import { idioma } from './idioma';
import { medidas } from './medidas';
import { tempo } from './tempo';

const _alertas: typeof alertasPt = alertas;
const _avisos: typeof avisosPt = avisos;
const _comum: typeof comumPt = comum;
const _fontes: typeof fontesPt = fontes;
const _idioma: typeof idiomaPt = idioma;
const _medidas: typeof medidasPt = medidas;
const _tempo: typeof tempoPt = tempo;

export const conferidos = [_alertas, _avisos, _comum, _fontes, _idioma, _medidas, _tempo];
