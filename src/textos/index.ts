import { localAtual, type Local } from '../logic/local';
import { alimentacao as alimentacaoPt } from './pt-BR/alimentacao';
import { ajuda as ajudaPt } from './pt-BR/ajuda';
import { alertas as alertasPt } from './pt-BR/alertas';
import { aviso as avisoPt } from './pt-BR/aviso';
import { assinatura as assinaturaPt } from './pt-BR/assinatura';
import { avisos as avisosPt } from './pt-BR/avisos';
import { cadastro as cadastroPt } from './pt-BR/cadastro';
import { ciclo as cicloPt } from './pt-BR/ciclo';
import { companion as companionPt } from './pt-BR/companion';
import { comum as comumPt } from './pt-BR/comum';
import { confirmacoes as confirmacoesPt } from './pt-BR/confirmacoes';
import { conquistas as conquistasPt } from './pt-BR/conquistas';
import { cruzamentos as cruzamentosPt } from './pt-BR/cruzamentos';
import { cuidado as cuidadoPt } from './pt-BR/cuidado';
import { descobertas as descobertasPt } from './pt-BR/descobertas';
import { equilibrio as equilibrioPt } from './pt-BR/equilibrio';
import { home as homePt } from './pt-BR/home';
import { idioma as idiomaPt } from './pt-BR/idioma';
import { escalas as escalasPt } from './pt-BR/escalas';
import { etapa as etapaPt } from './pt-BR/etapa';
import { exames as examesPt } from './pt-BR/exames';
import { fontes as fontesPt } from './pt-BR/fontes';
import { formas as formasPt } from './pt-BR/formas';
import { leituras as leiturasPt } from './pt-BR/leituras';
import { marcadores as marcadoresPt } from './pt-BR/marcadores';
import { medidas as medidasPt } from './pt-BR/medidas';
import { metas as metasPt } from './pt-BR/metas';
import { perfil as perfilPt } from './pt-BR/perfil';
import { resumo as resumoPt } from './pt-BR/resumo';
import { rotina as rotinaPt } from './pt-BR/rotina';
import { tempo as tempoPt } from './pt-BR/tempo';
import { tratamento as tratamentoPt } from './pt-BR/tratamento';
import { semente as sementePt } from './pt-BR/semente';

import { alimentacao as alimentacaoEn } from './en-US/alimentacao';
import { ajuda as ajudaEn } from './en-US/ajuda';
import { alertas as alertasEn } from './en-US/alertas';
import { aviso as avisoEn } from './en-US/aviso';
import { assinatura as assinaturaEn } from './en-US/assinatura';
import { avisos as avisosEn } from './en-US/avisos';
import { cadastro as cadastroEn } from './en-US/cadastro';
import { ciclo as cicloEn } from './en-US/ciclo';
import { companion as companionEn } from './en-US/companion';
import { comum as comumEn } from './en-US/comum';
import { confirmacoes as confirmacoesEn } from './en-US/confirmacoes';
import { conquistas as conquistasEn } from './en-US/conquistas';
import { cruzamentos as cruzamentosEn } from './en-US/cruzamentos';
import { cuidado as cuidadoEn } from './en-US/cuidado';
import { descobertas as descobertasEn } from './en-US/descobertas';
import { equilibrio as equilibrioEn } from './en-US/equilibrio';
import { home as homeEn } from './en-US/home';
import { idioma as idiomaEn } from './en-US/idioma';
import { escalas as escalasEn } from './en-US/escalas';
import { etapa as etapaEn } from './en-US/etapa';
import { exames as examesEn } from './en-US/exames';
import { fontes as fontesEn } from './en-US/fontes';
import { formas as formasEn } from './en-US/formas';
import { leituras as leiturasEn } from './en-US/leituras';
import { marcadores as marcadoresEn } from './en-US/marcadores';
import { medidas as medidasEn } from './en-US/medidas';
import { metas as metasEn } from './en-US/metas';
import { perfil as perfilEn } from './en-US/perfil';
import { resumo as resumoEn } from './en-US/resumo';
import { rotina as rotinaEn } from './en-US/rotina';
import { tempo as tempoEn } from './en-US/tempo';
import { tratamento as tratamentoEn } from './en-US/tratamento';
import { semente as sementeEn } from './en-US/semente';

/* ⚠️ O ESPANHOL É NEUTRO DA AMÉRICA LATINA — ustedes, sem vosotros.
   Ver o alto de textos/es-419/formas, onde a contração "del" mora. */
import { ajuda as ajudaEs } from './es-419/ajuda';
import { alertas as alertasEs } from './es-419/alertas';
import { alimentacao as alimentacaoEs } from './es-419/alimentacao';
import { assinatura as assinaturaEs } from './es-419/assinatura';
import { aviso as avisoEs } from './es-419/aviso';
import { avisos as avisosEs } from './es-419/avisos';
import { cadastro as cadastroEs } from './es-419/cadastro';
import { ciclo as cicloEs } from './es-419/ciclo';
import { companion as companionEs } from './es-419/companion';
import { comum as comumEs } from './es-419/comum';
import { confirmacoes as confirmacoesEs } from './es-419/confirmacoes';
import { conquistas as conquistasEs } from './es-419/conquistas';
import { cruzamentos as cruzamentosEs } from './es-419/cruzamentos';
import { cuidado as cuidadoEs } from './es-419/cuidado';
import { descobertas as descobertasEs } from './es-419/descobertas';
import { equilibrio as equilibrioEs } from './es-419/equilibrio';
import { escalas as escalasEs } from './es-419/escalas';
import { etapa as etapaEs } from './es-419/etapa';
import { exames as examesEs } from './es-419/exames';
import { fontes as fontesEs } from './es-419/fontes';
import { formas as formasEs } from './es-419/formas';
import { home as homeEs } from './es-419/home';
import { idioma as idiomaEs } from './es-419/idioma';
import { leituras as leiturasEs } from './es-419/leituras';
import { marcadores as marcadoresEs } from './es-419/marcadores';
import { medidas as medidasEs } from './es-419/medidas';
import { metas as metasEs } from './es-419/metas';
import { perfil as perfilEs } from './es-419/perfil';
import { resumo as resumoEs } from './es-419/resumo';
import { rotina as rotinaEs } from './es-419/rotina';
import { tempo as tempoEs } from './es-419/tempo';
import { tratamento as tratamentoEs } from './es-419/tratamento';
import { semente as sementeEs } from './es-419/semente';

/* ⚠️ O FRANCÊS NÃO TEM PONTO MÉDIO. "né·e", "suivi·e" estavam escritos e
   saíram: o ponto médio CONTORNA o acordo de gênero, não o evita, e os
   leitores de tela o pronunciam mal. A saída é reformular — ver o alto de
   textos/fr-FR/cadastro. */
import { ajuda as ajudaFr } from './fr-FR/ajuda';
import { alertas as alertasFr } from './fr-FR/alertas';
import { alimentacao as alimentacaoFr } from './fr-FR/alimentacao';
import { aviso as avisoFr } from './fr-FR/aviso';
import { assinatura as assinaturaFr } from './fr-FR/assinatura';
import { avisos as avisosFr } from './fr-FR/avisos';
import { cadastro as cadastroFr } from './fr-FR/cadastro';
import { ciclo as cicloFr } from './fr-FR/ciclo';
import { companion as companionFr } from './fr-FR/companion';
import { comum as comumFr } from './fr-FR/comum';
import { confirmacoes as confirmacoesFr } from './fr-FR/confirmacoes';
import { conquistas as conquistasFr } from './fr-FR/conquistas';
import { cruzamentos as cruzamentosFr } from './fr-FR/cruzamentos';
import { cuidado as cuidadoFr } from './fr-FR/cuidado';
import { descobertas as descobertasFr } from './fr-FR/descobertas';
import { equilibrio as equilibrioFr } from './fr-FR/equilibrio';
import { home as homeFr } from './fr-FR/home';
import { idioma as idiomaFr } from './fr-FR/idioma';
import { escalas as escalasFr } from './fr-FR/escalas';
import { etapa as etapaFr } from './fr-FR/etapa';
import { exames as examesFr } from './fr-FR/exames';
import { fontes as fontesFr } from './fr-FR/fontes';
import { formas as formasFr } from './fr-FR/formas';
import { leituras as leiturasFr } from './fr-FR/leituras';
import { marcadores as marcadoresFr } from './fr-FR/marcadores';
import { medidas as medidasFr } from './fr-FR/medidas';
import { metas as metasFr } from './fr-FR/metas';
import { perfil as perfilFr } from './fr-FR/perfil';
import { resumo as resumoFr } from './fr-FR/resumo';
import { rotina as rotinaFr } from './fr-FR/rotina';
import { tempo as tempoFr } from './fr-FR/tempo';
import { tratamento as tratamentoFr } from './fr-FR/tratamento';
import { semente as sementeFr } from './fr-FR/semente';

/* ⚠️ O ALEMÃO TRATA POR "DU". É a decisão que mais custa desfazer neste
   catálogo, e a razão inteira está no alto de textos/de-DE/comum.

   ⚠️ E ELE NÃO TEM O PROBLEMA DO FRANCÊS — tem outros dois. Particípio
   alemão não concorda com o sujeito, então a armadilha do "né·e" some;
   no lugar dela entram o CASO (der/den/dem/des, e o oA só sabe um deles)
   e a MAIÚSCULA de todo substantivo, que derruba todo toLowerCase
   que as outras quatro línguas compartilhavam. */
import { ajuda as ajudaDe } from './de-DE/ajuda';
import { alertas as alertasDe } from './de-DE/alertas';
import { alimentacao as alimentacaoDe } from './de-DE/alimentacao';
import { aviso as avisoDe } from './de-DE/aviso';
import { assinatura as assinaturaDe } from './de-DE/assinatura';
import { avisos as avisosDe } from './de-DE/avisos';
import { cadastro as cadastroDe } from './de-DE/cadastro';
import { ciclo as cicloDe } from './de-DE/ciclo';
import { companion as companionDe } from './de-DE/companion';
import { comum as comumDe } from './de-DE/comum';
import { confirmacoes as confirmacoesDe } from './de-DE/confirmacoes';
import { conquistas as conquistasDe } from './de-DE/conquistas';
import { cruzamentos as cruzamentosDe } from './de-DE/cruzamentos';
import { cuidado as cuidadoDe } from './de-DE/cuidado';
import { descobertas as descobertasDe } from './de-DE/descobertas';
import { equilibrio as equilibrioDe } from './de-DE/equilibrio';
import { home as homeDe } from './de-DE/home';
import { idioma as idiomaDe } from './de-DE/idioma';
import { escalas as escalasDe } from './de-DE/escalas';
import { etapa as etapaDe } from './de-DE/etapa';
import { exames as examesDe } from './de-DE/exames';
import { fontes as fontesDe } from './de-DE/fontes';
import { formas as formasDe } from './de-DE/formas';
import { leituras as leiturasDe } from './de-DE/leituras';
import { marcadores as marcadoresDe } from './de-DE/marcadores';
import { medidas as medidasDe } from './de-DE/medidas';
import { metas as metasDe } from './de-DE/metas';
import { perfil as perfilDe } from './de-DE/perfil';
import { resumo as resumoDe } from './de-DE/resumo';
import { rotina as rotinaDe } from './de-DE/rotina';
import { tempo as tempoDe } from './de-DE/tempo';
import { tratamento as tratamentoDe } from './de-DE/tratamento';
import { semente as sementeDe } from './de-DE/semente';

/* ⚠️ O ITALIANO TRATA POR "TU", como o alemão, e escreve "l'app" e não
   "l'applicazione" — as duas são corretas, e a segunda recria em italiano
   a colisão que custou caro ao espanhol: "applicazione" é também o gesto
   de aplicar alguma coisa no corpo. A razão inteira está no alto de
   textos/it-IT/idioma.

   ⚠️ E ELE TEM DUAS ARMADILHAS PRÓPRIAS. As preposições se articulam nos
   dois gêneros — "nella penna", "nel flacone", "della", "del" —, e o
   apóstrofo de "un'altra" é só do feminino: "un'altro" não existe. As
   duas moram em textos/it-IT/formas. */
import { ajuda as ajudaIt } from './it-IT/ajuda';
import { alertas as alertasIt } from './it-IT/alertas';
import { alimentacao as alimentacaoIt } from './it-IT/alimentacao';
import { aviso as avisoIt } from './it-IT/aviso';
import { assinatura as assinaturaIt } from './it-IT/assinatura';
import { avisos as avisosIt } from './it-IT/avisos';
import { cadastro as cadastroIt } from './it-IT/cadastro';
import { ciclo as cicloIt } from './it-IT/ciclo';
import { companion as companionIt } from './it-IT/companion';
import { comum as comumIt } from './it-IT/comum';
import { confirmacoes as confirmacoesIt } from './it-IT/confirmacoes';
import { conquistas as conquistasIt } from './it-IT/conquistas';
import { cruzamentos as cruzamentosIt } from './it-IT/cruzamentos';
import { cuidado as cuidadoIt } from './it-IT/cuidado';
import { descobertas as descobertasIt } from './it-IT/descobertas';
import { equilibrio as equilibrioIt } from './it-IT/equilibrio';
import { home as homeIt } from './it-IT/home';
import { idioma as idiomaIt } from './it-IT/idioma';
import { escalas as escalasIt } from './it-IT/escalas';
import { etapa as etapaIt } from './it-IT/etapa';
import { exames as examesIt } from './it-IT/exames';
import { fontes as fontesIt } from './it-IT/fontes';
import { formas as formasIt } from './it-IT/formas';
import { leituras as leiturasIt } from './it-IT/leituras';
import { marcadores as marcadoresIt } from './it-IT/marcadores';
import { medidas as medidasIt } from './it-IT/medidas';
import { metas as metasIt } from './it-IT/metas';
import { perfil as perfilIt } from './it-IT/perfil';
import { resumo as resumoIt } from './it-IT/resumo';
import { rotina as rotinaIt } from './it-IT/rotina';
import { tempo as tempoIt } from './it-IT/tempo';
import { tratamento as tratamentoIt } from './it-IT/tratamento';
import { semente as sementeIt } from './it-IT/semente';

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
  ajuda: typeof ajudaPt;
  alertas: typeof alertasPt;
  alimentacao: typeof alimentacaoPt;
  aviso: typeof avisoPt;
  assinatura: typeof assinaturaPt;
  avisos: typeof avisosPt;
  cadastro: typeof cadastroPt;
  ciclo: typeof cicloPt;
  companion: typeof companionPt;
  comum: typeof comumPt;
  confirmacoes: typeof confirmacoesPt;
  conquistas: typeof conquistasPt;
  cruzamentos: typeof cruzamentosPt;
  cuidado: typeof cuidadoPt;
  descobertas: typeof descobertasPt;
  equilibrio: typeof equilibrioPt;
  home: typeof homePt;
  idioma: typeof idiomaPt;
  leituras: typeof leiturasPt;
  escalas: typeof escalasPt;
  etapa: typeof etapaPt;
  exames: typeof examesPt;
  fontes: typeof fontesPt;
  formas: typeof formasPt;
  marcadores: typeof marcadoresPt;
  medidas: typeof medidasPt;
  metas: typeof metasPt;
  perfil: typeof perfilPt;
  resumo: typeof resumoPt;
  rotina: typeof rotinaPt;
  /** a paciente de exemplo — não é o aplicativo falando; ver pt-BR/semente */
  semente: typeof sementePt;
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
    ajuda: ajudaPt, alertas: alertasPt, alimentacao: alimentacaoPt, assinatura: assinaturaPt, aviso: avisoPt, avisos: avisosPt,
    cadastro: cadastroPt, ciclo: cicloPt, companion: companionPt, comum: comumPt, confirmacoes: confirmacoesPt, conquistas: conquistasPt, cruzamentos: cruzamentosPt,
    cuidado: cuidadoPt, descobertas: descobertasPt, equilibrio: equilibrioPt, escalas: escalasPt, etapa: etapaPt,
    exames: examesPt, fontes: fontesPt, formas: formasPt, home: homePt, idioma: idiomaPt,
    leituras: leiturasPt, marcadores: marcadoresPt, medidas: medidasPt, metas: metasPt, perfil: perfilPt,
    resumo: resumoPt, rotina: rotinaPt,
    semente: sementePt, tempo: tempoPt, tratamento: tratamentoPt,
  },
  'en-US': {
    ajuda: ajudaEn, alertas: alertasEn, alimentacao: alimentacaoEn, assinatura: assinaturaEn, aviso: avisoEn, avisos: avisosEn,
    cadastro: cadastroEn, ciclo: cicloEn, companion: companionEn, comum: comumEn, confirmacoes: confirmacoesEn, conquistas: conquistasEn, cruzamentos: cruzamentosEn,
    cuidado: cuidadoEn, descobertas: descobertasEn, equilibrio: equilibrioEn, escalas: escalasEn, etapa: etapaEn,
    exames: examesEn, fontes: fontesEn, formas: formasEn, home: homeEn, idioma: idiomaEn,
    leituras: leiturasEn, marcadores: marcadoresEn, medidas: medidasEn, metas: metasEn, perfil: perfilEn,
    resumo: resumoEn, rotina: rotinaEn,
    semente: sementeEn, tempo: tempoEn, tratamento: tratamentoEn,
  },
  'es-419': {
    ajuda: ajudaEs, alertas: alertasEs, alimentacao: alimentacaoEs, assinatura: assinaturaEs, aviso: avisoEs, avisos: avisosEs,
    cadastro: cadastroEs, ciclo: cicloEs, companion: companionEs, comum: comumEs, confirmacoes: confirmacoesEs,
    conquistas: conquistasEs, cruzamentos: cruzamentosEs, cuidado: cuidadoEs, descobertas: descobertasEs, equilibrio: equilibrioEs,
    escalas: escalasEs, etapa: etapaEs, exames: examesEs, fontes: fontesEs, formas: formasEs,
    home: homeEs, idioma: idiomaEs, leituras: leiturasEs, marcadores: marcadoresEs, medidas: medidasEs,
    metas: metasEs, perfil: perfilEs, resumo: resumoEs, rotina: rotinaEs, semente: sementeEs, tempo: tempoEs, tratamento: tratamentoEs,
  },
  'fr-FR': {
    ajuda: ajudaFr, alertas: alertasFr, alimentacao: alimentacaoFr, assinatura: assinaturaFr, aviso: avisoFr, avisos: avisosFr,
    cadastro: cadastroFr, ciclo: cicloFr, companion: companionFr, comum: comumFr, confirmacoes: confirmacoesFr,
    conquistas: conquistasFr, cruzamentos: cruzamentosFr, cuidado: cuidadoFr, descobertas: descobertasFr, equilibrio: equilibrioFr,
    escalas: escalasFr, etapa: etapaFr, exames: examesFr, fontes: fontesFr, formas: formasFr,
    home: homeFr, idioma: idiomaFr, leituras: leiturasFr, marcadores: marcadoresFr, medidas: medidasFr,
    metas: metasFr, perfil: perfilFr, resumo: resumoFr, rotina: rotinaFr, semente: sementeFr, tempo: tempoFr, tratamento: tratamentoFr,
  },
  'de-DE': {
    ajuda: ajudaDe, alertas: alertasDe, alimentacao: alimentacaoDe, assinatura: assinaturaDe, aviso: avisoDe, avisos: avisosDe,
    cadastro: cadastroDe, ciclo: cicloDe, companion: companionDe, comum: comumDe, confirmacoes: confirmacoesDe,
    conquistas: conquistasDe, cruzamentos: cruzamentosDe, cuidado: cuidadoDe, descobertas: descobertasDe, equilibrio: equilibrioDe,
    escalas: escalasDe, etapa: etapaDe, exames: examesDe, fontes: fontesDe, formas: formasDe,
    home: homeDe, idioma: idiomaDe, leituras: leiturasDe, marcadores: marcadoresDe, medidas: medidasDe,
    metas: metasDe, perfil: perfilDe, resumo: resumoDe, rotina: rotinaDe, semente: sementeDe, tempo: tempoDe, tratamento: tratamentoDe,
  },
  'it-IT': {
    ajuda: ajudaIt, alertas: alertasIt, alimentacao: alimentacaoIt, aviso: avisoIt, assinatura: assinaturaIt, avisos: avisosIt,
    cadastro: cadastroIt, ciclo: cicloIt, companion: companionIt, comum: comumIt, confirmacoes: confirmacoesIt, conquistas: conquistasIt, cruzamentos: cruzamentosIt,
    cuidado: cuidadoIt, descobertas: descobertasIt, equilibrio: equilibrioIt, home: homeIt, idioma: idiomaIt,
    escalas: escalasIt, etapa: etapaIt, exames: examesIt, fontes: fontesIt, formas: formasIt,
    leituras: leiturasIt, marcadores: marcadoresIt, medidas: medidasIt, metas: metasIt, perfil: perfilIt,
    resumo: resumoIt, rotina: rotinaIt, semente: sementeIt, tempo: tempoIt, tratamento: tratamentoIt,
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
