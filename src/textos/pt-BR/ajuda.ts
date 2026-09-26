/* ============================================================
   A AJUDA — as oito perguntas, e por que são estas oito

   Toda seção de configurações tem uma seção de ajuda, e quase toda uma é
   a mesma coisa: oito perguntas genéricas sobre conta e senha, escritas
   por quem não conhece o aplicativo. A conta aqui é um e-mail com código,
   sem senha, e as dúvidas deste aplicativo são outras — por que uma conquista sumiu, de
   onde saiu um número, por que o lembrete não tocou.

   ⚠️⚠️ CADA RESPOSTA É UMA REGRA DO CÓDIGO, e não uma promessa de
   marketing. "As conquistas saem dos registros" está escrito em
   conquistas.ts; "os avisos dependem da permissão do celular" está em
   avisos.ts. Se uma dessas regras mudar, a resposta aqui fica errada —
   e por isso cada uma diz ONDE a coisa acontece, com caminho para lá.

   Quem traduzir precisa saber disto antes de suavizar qualquer frase: a
   resposta sobre desinstalar diz que o diário volta com a conta porque
   volta, e diz o que se perde sem conexão porque se perde.

   ⚠️ A LINHA DE CONTATO SÓ ENTROU QUANDO HOUVE CANAL (26/09/2026). Um
   "fale com a gente" que não vai a lugar nenhum é a pior linha que uma
   tela de ajuda pode ter: ela aparece exatamente para quem já não
   conseguiu resolver sozinho. Agora há a caixa `contact@morphihealth.com`,
   que alguém lê (`EMPRESA.email`, em logic/documentos).

   ⚠️ A ORDEM É A DA VIDA DE ALGUÉM: primeiro a desconfiança com os
   números, depois o que fazer com eles, e por último o que acontece com
   os dados.
   ============================================================ */

export const ajuda = {
  titulo: 'Ajuda',
  lead: 'As dúvidas que este aplicativo costuma provocar, respondidas pelo que ele de fato faz.',
  perguntasFrequentes: 'Perguntas frequentes',

  /* ⚠️ É UMA LISTA, E A ORDEM IMPORTA — ver o alto do arquivo. O `q` é a
     pergunta fechada da sanfona; o `a` só aparece quando ela abre. */
  qa: [
    {
      q: 'De onde saem os números que aparecem aqui?',
      a: 'Todos eles são contas feitas em cima do que você registrou — peso, aplicações, check-ins, refeições, exames. O aplicativo não completa o que faltou nem estima o que você não disse: dia sem resposta aparece como dia sem resposta, e não como zero.',
    },
    {
      q: 'Posso corrigir ou apagar um registro?',
      a: 'Pode, e no lugar onde ele aparece. Pesagens e medidas se apagam no detalhe do marcador; refeições e treinos, abrindo o registro no diário do dia. O que você apagar some das contas na hora — inclusive dos gráficos e do resumo para consulta.',
    },
    {
      q: 'Por que uma conquista desapareceu?',
      a: 'Porque ela nunca foi guardada. As conquistas são contadas dos seus registros toda vez que a tela abre, e não marcadas como feitas em algum lugar. Se o registro que fechou um nível for apagado, o nível sai junto — ele deixou de ter acontecido.',
    },
    {
      q: 'Marquei um lembrete e ele não tocou.',
      /* ⚠️ "Morphi" É O NOME DO APLICATIVO, e não se traduz: é o que a
         pessoa vê na lista de permissões do sistema. Trocar aqui mandaria
         ela procurar um nome que não existe naquela tela. */
      a: 'Quem toca é o celular, e ele só toca com permissão. Se os avisos estiverem negados para o Morphi nos ajustes do sistema, os seus alertas continuam guardados aqui e nada soa. A tela de Lembretes mostra quando é esse o caso e leva à permissão.',
    },
    {
      q: 'O meu peso pode vir da balança sozinho?',
      /* "Lemos só o peso, e só lemos" — as duas metades são fato
         verificável, e a segunda é a que responde o medo de quem
         pergunta. */
      a: 'Se a sua balança, relógio ou anel escrevem no Apple Saúde (iPhone) ou no Health Connect (Android), sim — lemos de lá. Lemos só o peso, e só lemos: nunca escrevemos nada nesses aplicativos. Garmin, Fitbit, Withings, Oura e Whoop chegam por esse caminho.',
    },
    {
      q: 'O que a minha equipe consegue ver?',
      a: 'Nada, até você se conectar a uma clínica parceira pelo código dela. Com a conexão, a equipe vê o seu diário enquanto ela durar, e a lista inteira do que ela passa a ver aparece antes de você conectar. As suas perguntas ao Morphi ficam fora, e dá para desconectar a qualquer momento, na tela da clínica.',
    },
    {
      q: 'O Morphi substitui o acompanhamento médico?',
      a: 'Não, e em nenhuma tela. O que fazemos é organizar o que aconteceu e mostrar padrões nos seus próprios registros. Não diagnosticamos nem prescrevemos: dose, sintoma e conduta são assunto para um profissional de saúde — e, quando um texto do aplicativo toca nesses assuntos, ele diz isso junto.',
    },
    {
      q: 'E se eu desinstalar o aplicativo?',
      a: 'O seu diário fica guardado na sua conta: ao instalar de novo e entrar, ele volta inteiro. Só o que você registrou sem conexão, e ainda não tinha chegado à conta, se perde junto. E, se quiser uma cópia sua, dá para montar um arquivo em Exportar.',
    },
  ] as { q: string; a: string }[],

  /* ⚠️ AS PORTAS QUE AS RESPOSTAS CITAM. Explicar onde uma coisa acontece
     e não levar até lá transforma a ajuda numa aula: quem leu que o
     lembrete depende da permissão quer ir conferir a permissão, e não
     decorar o caminho. */
  ondeResolver: 'Onde resolver',
  lembretes: 'Lembretes',
  lembretesSub: 'Criar, editar e conferir a permissão de avisos',
  integracoes: 'Dispositivos e integrações',
  integracoesSub: 'Ligar o Apple Saúde ou o Health Connect',
  privacidade: 'Privacidade e dados',
  privacidadeSub: 'Onde o seu diário fica e o que sai dele',
  exportar: 'Exportar seus dados',
  exportarSub: 'Montar um arquivo com o que você registrou',

  /* "Fale com a gente": o e-mail do canal (ver ui/contato). O endereço entra como subtítulo, sem tradução. */
  faleConosco: 'Fale com a gente',
  escreverParaNos: 'Escrever para nós',
  emailAssunto: 'Morphi — ajuda',

  /* ⚠️⚠️ ESTA É A ÚNICA FRASE DA TELA QUE NÃO É SOBRE O APLICATIVO, e é
     por isso que ela está aqui: quem abre a ajuda com um sintoma que
     assusta precisa da porta certa, e a porta certa não é esta tela. */
  emergenciaTitulo: 'Em caso de sintoma grave',
  emergenciaTexto: 'Esta tela é sobre o aplicativo. Se alguma coisa no seu corpo pede atenção agora, procure a sua equipe ou um serviço de emergência — não espere a próxima consulta.',
};
