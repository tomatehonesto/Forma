import { localAtual, type Local } from '../logic/local';
import { alimentacao as alimentacaoPt } from './pt-BR/alimentacao';
import { alertas as alertasPt } from './pt-BR/alertas';
import { avisos as avisosPt } from './pt-BR/avisos';
import { ciclo as cicloPt } from './pt-BR/ciclo';
import { companion as companionPt } from './pt-BR/companion';
import { comum as comumPt } from './pt-BR/comum';
import { cruzamentos as cruzamentosPt } from './pt-BR/cruzamentos';
import { cuidado as cuidadoPt } from './pt-BR/cuidado';
import { equilibrio as equilibrioPt } from './pt-BR/equilibrio';
import { home as homePt } from './pt-BR/home';
import { escalas as escalasPt } from './pt-BR/escalas';
import { etapa as etapaPt } from './pt-BR/etapa';
import { exames as examesPt } from './pt-BR/exames';
import { fontes as fontesPt } from './pt-BR/fontes';
import { marcadores as marcadoresPt } from './pt-BR/marcadores';
import { metas as metasPt } from './pt-BR/metas';
import { rotina as rotinaPt } from './pt-BR/rotina';
import { tempo as tempoPt } from './pt-BR/tempo';
import { tratamento as tratamentoPt } from './pt-BR/tratamento';

import { alimentacao as alimentacaoEn } from './en-US/alimentacao';
import { alertas as alertasEn } from './en-US/alertas';
import { avisos as avisosEn } from './en-US/avisos';
import { ciclo as cicloEn } from './en-US/ciclo';
import { companion as companionEn } from './en-US/companion';
import { comum as comumEn } from './en-US/comum';
import { cruzamentos as cruzamentosEn } from './en-US/cruzamentos';
import { cuidado as cuidadoEn } from './en-US/cuidado';
import { equilibrio as equilibrioEn } from './en-US/equilibrio';
import { home as homeEn } from './en-US/home';
import { escalas as escalasEn } from './en-US/escalas';
import { etapa as etapaEn } from './en-US/etapa';
import { exames as examesEn } from './en-US/exames';
import { fontes as fontesEn } from './en-US/fontes';
import { marcadores as marcadoresEn } from './en-US/marcadores';
import { metas as metasEn } from './en-US/metas';
import { rotina as rotinaEn } from './en-US/rotina';
import { tempo as tempoEn } from './en-US/tempo';
import { tratamento as tratamentoEn } from './en-US/tratamento';

/* ============================================================
   O CATÁLOGO — como o código chega no texto

   ⚠️⚠️ O IDIOMA É UM VALOR DE MÓDULO, e não um parâmetro que atravessa o
   aplicativo.

   A alternativa seria enfiar o idioma em toda função que produz texto,
   como acabou de acontecer com as unidades: `S` teve de entrar em quatro
   tabelas constantes e em oito assinaturas de callback, e aquilo eram
   quatro grandezas. Aqui são mil e quinhentas frases — a mesma solução
   custaria mil e quinhentos sítios de chamada, duas vezes: uma agora e
   outra quando o segundo idioma chegasse.

   Com um valor de módulo, o sítio de chamada é `T.etapa.platoHead` hoje e
   `T.etapa.platoHead` depois do inglês. Nada muda.

   ⚠️ E A TROCA DE IDIOMA REMONTA A ÁRVORE, a partir do layout raiz. O
   React não sabe que este valor mudou — ele não está no estado dele —, e
   uma tela já desenhada continuaria em português. Remontar é o resultado
   certo para uma operação que acontece uma vez na vida do aplicativo, e é
   uma linha: uma `key` no topo.

   ⚠️ A EXTRAÇÃO E A TRADUÇÃO FORAM DUAS PEÇAS, e nessa ordem. A extração
   tira o texto do código e tem uma invariante verificável: a saída não
   muda. A tradução muda a saída de propósito. Misturar as duas faria o
   diff da primeira carregar mudanças de sentido, e não haveria como dizer
   se o aplicativo continuou falando a mesma coisa.

   A rede que garante isso é `scripts/congelar.ts` — ver o README daqui.
   ============================================================ */

/* ⚠️ O VALOR DO IDIOMA NÃO MORA MAIS AQUI. Ele é o mesmo que decide o
   separador decimal e o desenho da data, e mora em logic/local com eles —
   "português com números americanos" não é um estado que deva existir.
   Este arquivo passou a ser só o catálogo. */
export type { Local } from '../logic/local';

/* Tipos que descrevem a FORMA de um texto, e não de um dado — por isso
   moram no catálogo e saem por aqui. Ver textos/pt-BR/marcadores. */
export type { SobreOMarcador, JeitoDeAjudar } from './pt-BR/marcadores';

/* ⚠️ O CONTRATO SAI DO PORTUGUÊS, e não de uma interface escrita à mão.

   `typeof` sobre o catálogo em português dá, de graça, a assinatura exata
   de cada mensagem — nome, número de parâmetros e tipo de cada um. Quando
   o inglês chegar, ele terá de satisfazer este tipo, e o `tsc` acusa a
   mensagem que faltou e o parâmetro que mudou de forma.

   É a garantia que nenhum arquivo de JSON dá: lá, uma chave esquecida só
   aparece como texto faltando na tela de alguém. */
export type Textos = {
  alertas: typeof alertasPt;
  alimentacao: typeof alimentacaoPt;
  avisos: typeof avisosPt;
  ciclo: typeof cicloPt;
  companion: typeof companionPt;
  comum: typeof comumPt;
  cruzamentos: typeof cruzamentosPt;
  cuidado: typeof cuidadoPt;
  equilibrio: typeof equilibrioPt;
  home: typeof homePt;
  escalas: typeof escalasPt;
  etapa: typeof etapaPt;
  exames: typeof examesPt;
  fontes: typeof fontesPt;
  marcadores: typeof marcadoresPt;
  metas: typeof metasPt;
  rotina: typeof rotinaPt;
  tempo: typeof tempoPt;
  tratamento: typeof tratamentoPt;
};

/* ⚠️ O INGLÊS CHEGOU, e o `Partial` saiu com ele: agora todo local do
   tipo tem catálogo, e o `tsc` passa a cobrar isso de qualquer idioma
   novo no dia em que ele entrar no tipo `Local`.

   ⚠️ E A CONFERÊNCIA DE FORMA ACONTECE AQUI, de graça: `Textos` sai do
   `typeof` do português, e um inglês com uma chave a menos ou um
   parâmetro trocado não compila. É a garantia que nenhum arquivo de JSON
   dá — lá, chave esquecida vira texto faltando na tela de alguém. */
const CATALOGOS: Record<Local, Textos> = {
  'pt-BR': {
    alertas: alertasPt, alimentacao: alimentacaoPt, avisos: avisosPt,
    ciclo: cicloPt, companion: companionPt, comum: comumPt, cruzamentos: cruzamentosPt,
    cuidado: cuidadoPt, equilibrio: equilibrioPt, escalas: escalasPt, etapa: etapaPt,
    exames: examesPt, fontes: fontesPt, home: homePt,
    marcadores: marcadoresPt, metas: metasPt, rotina: rotinaPt,
    tempo: tempoPt, tratamento: tratamentoPt,
  },
  'en-US': {
    alertas: alertasEn, alimentacao: alimentacaoEn, avisos: avisosEn,
    ciclo: cicloEn, companion: companionEn, comum: comumEn, cruzamentos: cruzamentosEn,
    cuidado: cuidadoEn, equilibrio: equilibrioEn, escalas: escalasEn, etapa: etapaEn,
    exames: examesEn, fontes: fontesEn, home: homeEn,
    marcadores: marcadoresEn, metas: metasEn, rotina: rotinaEn,
    tempo: tempoEn, tratamento: tratamentoEn,
  },
};



/* ⚠️ É UM PROXY, e não o objeto direto: o catálogo precisa ser resolvido
   na hora da LEITURA, e não na hora do import. Exportar
   `CATALOGOS[atual]` congelaria o português no primeiro módulo que
   importasse este arquivo, e a troca de idioma não teria efeito nenhum.

   Uma propriedade por domínio é barato — são poucas dezenas —, e o custo
   por leitura é um acesso a objeto. */
export const T = new Proxy({} as Textos, {
  get: (_alvo, chave: string) => (CATALOGOS[localAtual()] as any)[chave],
});
