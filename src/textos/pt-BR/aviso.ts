/* ============================================================
   O CONSENTIMENTO E O RESTO — a isenção, os avisos de dado e as sobras

   ⚠️⚠️ A ISENÇÃO ABRE O ÚLTIMO PASSO DO CADASTRO, E TEM CHAVE PRÓPRIA. O
   resto do aviso é sobre DADO — o que fica guardado, o que sai daqui.
   Ela é sobre o TRATAMENTO, e é a única coisa do cadastro que alguém pode
   entender errado de um jeito que faz mal: achar que o aplicativo sabe se
   a dose está certa.

   ⚠️ E ELA NÃO DIMINUI O APLICATIVO PARA SE PROTEGER. "Isto não é um
   aplicativo médico" é verdade e é covarde: quem está lendo acabou de
   responder treze perguntas sobre o próprio tratamento, e merece saber o
   que ganha, não só o que não ganha. A frase diz as duas coisas, nessa
   ordem — o que fazemos, e onde paramos.
   ============================================================ */

export const aviso = {
  isencaoTitulo: 'Acompanhamos o seu tratamento — não o conduzimos',
  isencaoTexto: 'Guardamos o que você registra, mostramos como a coisa vem andando e preparamos o que levar para a consulta. Não somos diagnóstico e não prescrevemos: dose, intervalo e medicação são decisão de quem acompanha você.',
  isencaoReforco: 'Antes de mudar qualquer coisa na sua dose ou no seu horário, fale com a sua equipe. E se aparecer sintoma que assusta, não espere a próxima consulta.',
  isencaoAceite: 'Entendi e concordo',

  /* Os quatro cartões de dado, na ordem em que a dúvida aparece. */
  guardadoTitulo: 'O que você registra fica no seu aparelho',
  guardadoTexto: 'Peso, sintomas, aplicações, exames e anotações são gravados dentro do aplicativo, neste telefone. Não há conta nem senha: ninguém entra nos seus dados com um login.',

  usoTitulo: 'Para que os seus dados são usados',
  usoTexto: 'Para montar as suas metas diárias, acompanhar a evolução do tratamento e organizar o que você levar para a consulta. Nada disso é diagnóstico, e o aplicativo não prescreve nem ajusta dose.',

  /* ⚠️ A PARTE QUE UM AVISO DE CONSENTIMENTO COSTUMA CALAR, e que aqui é
     a única que muda o que a pessoa decide. */
  saiTitulo: 'O que pode sair daqui, e só com um toque seu',
  saiTexto: 'O resumo e as mensagens que você enviar para a sua equipe de saúde. E a foto do prato, quando você usar a leitura por foto: ela é enviada para ser lida e não fica guardada.',

  controleTitulo: 'Você continua no controle',
  controleTexto: 'Dá para corrigir e apagar qualquer registro, exportar tudo num arquivo e apagar os seus dados por inteiro, a qualquer momento, nas configurações.',

  /* ============================================================
     AS INTEGRAÇÕES — o que cada depósito traz

     ⚠️ SÓ O NOME DA APPLE MUDA DE IDIOMA. "Apple Saúde" é "Apple Health"
     em inglês porque é a Apple que traduz o nome do próprio aplicativo.
     Health Connect, Garmin, Fitbit e Withings são marcas e ficam no
     código: marca não se traduz.
     ============================================================ */
  appleSaude: 'Apple Saúde',
  trazPesagens: 'As suas pesagens — inclusive as que a sua balança manda para lá.',
  trazTreinos: 'Treinos e frequência cardíaca',
  trazBalanca: 'Balança e pressão',

  /* ============================================================
     A LEITURA POR FOTO, quando ela não acontece

     ⚠️ AS TRÊS TERMINAM OFERECENDO O CAMINHO MANUAL, e é o que as separa
     de uma mensagem de erro: a pessoa fotografou o prato porque quer
     registrar, e dizer só "não deu" a deixa no meio do caminho.
     ============================================================ */
  fotoSemServidor: 'A leitura por foto ainda não está ligada. Dá para montar o prato aqui embaixo.',
  fotoSemRede: 'Sem conexão para ler a foto agora. Dá para montar o prato aqui embaixo.',
  fotoNaoReconheci: 'Não consegui reconhecer o prato. Monte aqui embaixo o que tinha.',

  /* ============================================================
     A ASSINATURA e a exportação
     ============================================================ */
  porMes: 'por mês',
  porMesCurto: '/mês',

  /* ⚠️ O AVISO DO ARQUIVO EXPORTADO É O MESMO DO RESUMO, e pela mesma
     razão: quem abrir este JSON precisa saber que são registros da
     própria pessoa, e não prontuário. */
  exportacaoAviso: 'Registros feitos pela própria pessoa no aplicativo. Não é prontuário nem laudo.',
  exportacaoTitulo: 'Seus dados do Morphi',

  /* O medicamento de quem ainda não respondeu. */
  medIndefinido: 'Ainda não definido',

  /* O recipiente maior da água, que não cabia na lista de bebidas. */
  garrafao: 'Garrafão',

  /* ============================================================
     AS MODALIDADES DE EXERCÍCIO

     ⚠️ OS NOMES SÃO CHAVE E RÓTULO AO MESMO TEMPO — é o `tipo` que fica
     gravado em cada treino. Mesma família do momento da refeição e do
     marcador de exame: traduzir não quebra registro novo, e registro
     antigo aparece com o nome que foi gravado.
     ============================================================ */
  modalidades: {
    caminhada: 'Caminhada',
    corrida: 'Corrida',
    musculacao: 'Musculação',
    bike: 'Bike',
    natacao: 'Natação',
    yoga: 'Yoga',
    pilates: 'Pilates',
    funcional: 'Funcional',
    alongamento: 'Alongamento',
    outro: 'Outro',
  },
};
