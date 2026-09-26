import { T } from '../textos';
/* ============================================================
   O CONSENTIMENTO

   ⚠️⚠️ A VERSÃO 2 É A DA CONTA (fase 8 do plano do Supabase). ⚠️⚠️

   A versão 1 dizia que tudo ficava no telefone, sem conta e sem senha, e
   era verdade até a nuvem ser ligada. A 2 diz que o diário fica na conta,
   no banco em São Paulo, e que as perguntas ao Morphi ficam no aparelho
   (a leitura delas por nós está desligada: ver `LEITURA_DAS_PERGUNTAS`,
   abaixo). Quem aceitou a 1 vê a nova na abertura (a tranca 2 do
   portão, em app/_layout), e nada sobe enquanto não aceitar (ver
   `consentimentoPendente` e a sincronia em logic/conta).

   ⚠️ NÃO HAVIA NENHUM. O cadastro perguntava altura, peso, medicamento,
   dose, restrição alimentar e autorização para ler o aplicativo de saúde
   do celular — dado de saúde do começo ao fim — e em nenhum momento
   dizia à pessoa o que seria feito com aquilo, nem pedia que ela
   concordasse. O app simplesmente começava.

   Dado de saúde é dado pessoal SENSÍVEL, e consentimento para ele
   precisa ser informado, específico e registrado. Este arquivo é as três
   coisas:

   INFORMADO — o texto abaixo é o mesmo conteúdo da tela de Privacidade,
   encurtado. Não é um resumo tranquilizador: ele diz também o que sai do
   aparelho, que é a parte que um aviso de consentimento costuma calar.

   ESPECÍFICO — cada item é uma finalidade, e não "melhorar sua
   experiência". Quem lê consegue apontar para uma linha e perguntar por
   quê.

   REGISTRADO — `VERSAO` viaja junto com a data no perfil. Sem versão, um
   consentimento guardado só diz que a pessoa concordou um dia, com um
   texto que ninguém sabe qual era. Quando este texto mudar de forma
   relevante, a versão sobe, e quem concordou com a anterior precisa ver
   a nova.

   ⚠️ E ISTO NÃO É A POLÍTICA DE PRIVACIDADE. É o aviso que a precede: o
   que cabe numa tela de cadastro, antes de alguém decidir se continua.
   Os documentos por inteiro estão em src/logic/documentos.ts, e o passo
   linka os dois assim que a identificação da empresa estiver completa.
   ============================================================ */

/** Sobe quando o texto abaixo mudar de forma relevante. */
export const VERSAO = 2;

/* Os documentos moram DENTRO do aplicativo, e não numa página na
   internet: um link que depende de rede escolheria a pior hora para
   falhar — a pessoa no cadastro, sem contexto, decidindo se confia.

   Eles só aparecem quando a identificação da empresa estiver completa;
   quem decide isso é `temIdentificacao`, em src/logic/documentos.ts. */
export const TERMOS = '/documento?id=termos';
export const POLITICA = '/documento?id=privacidade';

/* ============================================================
   A ISENÇÃO — o que este aplicativo é, e o que ele não é

   ⚠️⚠️ ELA ABRE O ÚLTIMO PASSO, E TEM UMA CHAVE PRÓPRIA. O resto do aviso
   é sobre DADO — o que fica guardado, o que sai daqui. Esta é sobre o
   TRATAMENTO, e é a única coisa do cadastro que alguém pode entender
   errado de um jeito que faz mal: achar que o aplicativo sabe se a dose
   está certa.

   ⚠️ E ELA NÃO DIMINUI O APLICATIVO PARA SE PROTEGER. "Isto não é um
   aplicativo médico" é verdade e é covarde: quem está lendo acabou de
   responder treze perguntas sobre o próprio tratamento, e merece saber o
   que ganha, não só o que não ganha. A frase diz as duas coisas, nessa
   ordem — o que fazemos, e onde paramos.

   ⚠️ O QUE SE EXALTA É A CONSULTA. O trabalho deste aplicativo é chegar
   nela com a história inteira, em vez de com a memória dos últimos dias.
   Quem conduz o tratamento continua sendo quem sempre foi.
   ============================================================ */
/* ⚠️ A ISENÇÃO NÃO TEM MAIS CHAVE PRÓPRIA (pedido do dono, 26/09/2026).
   O "Entendi e concordo" travava o botão; agora o botão Continuar é o
   aceite de tudo o que está na tela — a isenção, os dados e os
   documentos —, e a frase logo acima dele diz isso com todas as letras
   (`FraseDoAceite`, em ui/consentimento). É a frase que faz do toque um
   ato claro: "Continuar" sozinho seria consentir sem saber. */
export const ISENCAO = () => ({
  titulo: T.aviso.isencaoTitulo,
  texto: T.aviso.isencaoTexto,
});

export type ItemDoAviso = { ic: string; titulo: string; texto: string };

export const AVISO = (): ItemDoAviso[] => [
  { ic: 'lock', titulo: T.aviso.guardadoTitulo, texto: T.aviso.guardadoTexto },
  { ic: 'target', titulo: T.aviso.usoTitulo, texto: T.aviso.usoTexto },
  { ic: 'send', titulo: T.aviso.saiTitulo, texto: T.aviso.saiTexto },
  { ic: 'gear', titulo: T.aviso.controleTitulo, texto: T.aviso.controleTexto },
];

export type Consentimento = { em: number; versao: number };

/** O que ficou guardado, quando ficou — ou nada. */
export const consentimentoDe = (S: any): Consentimento | null =>
  (S?.profile?.consentimento as Consentimento) ?? null;

/* ⚠️⚠️ A LEITURA DAS PERGUNTAS ESTÁ DESLIGADA, POR DECISÃO DO DONO
   (26/09/2026). Nós não lemos as perguntas feitas ao Morphi, e elas não
   saem do aparelho: a escolha não aparece em lugar nenhum, e o estado
   sempre diz que ela está desligada (`ensureDefaults`, em logic/seed).
   O resto fica pronto e parado — a tabela `perguntas` e as regras dela no
   banco, a subida e a revogação na sincronia, os textos da escolha no
   catálogo —, para voltar quando fizer sentido ler.

   ⚠️ VOLTAR NÃO É SÓ TROCAR ISTO. A Política e os cartões deixaram de
   falar dessa finalidade, e voltam a falar junto; a versão do
   consentimento sobe; e a leitura por nós volta a bloquear a publicação
   (PENDENCIAS, item 37). */
export const LEITURA_DAS_PERGUNTAS = false;

/** A escolha das perguntas, com o que o texto dela diz — o mesmo cartão
    no último passo do cadastro e na folha do consentimento novo. */
export const ESCOLHA_DAS_PERGUNTAS = () => ({
  titulo: T.aviso.perguntasTitulo,
  texto: T.aviso.perguntasTexto,
  escolha: T.aviso.perguntasEscolha,
  detalhe: T.aviso.perguntasDetalhe,
});

/** Quem terminou o cadastro e aceitou uma versão anterior — ou nenhuma.
    É a condição da tranca 2 do portão e da sincronia parada. A semente
    de desenvolvimento não conta: ela nunca sobe, e nunca pede nada. */
export const consentimentoPendente = (S: any): boolean =>
  !!S?.onboardDone && !(S?.semente && typeof __DEV__ !== 'undefined' && __DEV__)
  && (consentimentoDe(S)?.versao ?? 0) < VERSAO;
