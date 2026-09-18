/* ============================================================
   O CONSENTIMENTO

   ⚠️⚠️ O SUPABASE VAI DERRUBAR METADE DISTO. ⚠️⚠️

   O aplicativo vai passar a ter conta, autenticação e banco. Hoje não
   tem, e por isso o que está escrito aqui é verdade: um app sem
   servidor, sem login e sem cópia. No dia em que o Supabase entrar,
   cada frase sobre "fica no seu aparelho" vira declaração falsa numa
   política de privacidade — que é o pior lugar possível para uma.

   Não reescreva antes: descrever tratamento que ainda não acontece é o
   erro simétrico. A lista frase por frase, e a decisão de região que é
   difícil de desfazer, estão em PENDENCIAS.md, item 10.

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
export const VERSAO = 1;

/* Os documentos moram DENTRO do aplicativo, e não numa página na
   internet: um link que depende de rede escolheria a pior hora para
   falhar — a pessoa no cadastro, sem contexto, decidindo se confia.

   Eles só aparecem quando a identificação da empresa estiver completa;
   quem decide isso é `temIdentificacao`, em src/logic/documentos.ts. */
export const TERMOS = '/documento?id=termos';
export const POLITICA = '/documento?id=privacidade';

export type ItemDoAviso = { titulo: string; texto: string };

export const AVISO: ItemDoAviso[] = [
  {
    titulo: 'O que você registra fica no seu aparelho',
    texto: 'Peso, sintomas, aplicações, exames e anotações são gravados dentro do aplicativo, neste telefone. Não há conta nem senha: ninguém entra nos seus dados com um login.',
  },
  {
    titulo: 'Para que os seus dados são usados',
    texto: 'Para montar as suas metas diárias, acompanhar a evolução do tratamento e organizar o que você levar para a consulta. Nada disso é diagnóstico, e o aplicativo não prescreve nem ajusta dose.',
  },
  {
    /* A PARTE QUE UM AVISO DE CONSENTIMENTO COSTUMA CALAR, e que aqui é
       a única que muda o que a pessoa decide. */
    titulo: 'O que pode sair daqui, e só com um toque seu',
    texto: 'O resumo e as mensagens que você enviar para a sua equipe de saúde. E a foto do prato, quando você usar a leitura por foto: ela é enviada para ser lida e não fica guardada.',
  },
  {
    titulo: 'Você continua no controle',
    texto: 'Dá para corrigir e apagar qualquer registro, exportar tudo num arquivo e apagar os seus dados por inteiro, a qualquer momento, nas configurações.',
  },
];

export type Consentimento = { em: number; versao: number };

/** O que ficou guardado, quando ficou — ou nada. */
export const consentimentoDe = (S: any): Consentimento | null =>
  (S?.profile?.consentimento as Consentimento) ?? null;
