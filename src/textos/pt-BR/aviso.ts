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
  trazSono: 'Sono e passos',
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

  /* ============================================================
     A TELA DE EXPORTAR

     ⚠️ CADA LINHA DE "O QUE ENTRA" É UM INTERRUPTOR, e o subtítulo dela
     conta o que existe para entrar. Por isso toda contagem é função: quem
     nunca registrou exame lê "0 resultados", que é a verdade, e não uma
     linha muda.

     ⚠️⚠️ E "COLETAS" VIROU "RESULTADOS". A conta soma os VALORES de cada
     marcador — três datas de HbA1c são três valores —, e chamar isso de
     coleta anunciava um número de coletas que nunca houve. A conta estava
     certa; a palavra é que não estava.
     ============================================================ */
  telaExportar: {
    titulo: 'Exportar',
    lead: 'Um arquivo com os seus registros, para guardar ou levar para outro lugar.',

    periodo: 'Período',
    periodoAjuda: (de: string, ate: string, semanas: number) =>
      `De ${de} a ${ate} · ${semanas} ${semanas === 1 ? 'semana' : 'semanas'}`,
    ultimas4: 'Últimas 4 semanas',
    desdeAConsulta: 'Desde a última consulta',
    tratamentoInteiro: 'Tratamento inteiro',

    oQueEntra: 'O que entra',
    oQueEntraNota: 'Toque para incluir ou tirar. O que ficar de fora não entra no arquivo.',
    incluido: 'incluído',
    fora: 'fora',

    aplicacoes: 'Aplicações',
    aplicacoesSub: (quantas: number) =>
      `${quantas} ${quantas === 1 ? 'registro' : 'registros'} · data, dose e local`,
    pesoEMedidas: 'Peso e medidas',
    pesoEMedidasSub: (pesagens: number, medidas: number) =>
      `${pesagens} ${pesagens === 1 ? 'pesagem' : 'pesagens'} · ${medidas} ${medidas === 1 ? 'medida' : 'medidas'}`,
    checkins: 'Check-ins',
    checkinsSub: (dias: number) => `${dias} ${dias === 1 ? 'dia' : 'dias'} · sintoma a sintoma`,
    exames: 'Exames',
    examesSub: (quantos: number) =>
      `${quantos} ${quantos === 1 ? 'resultado' : 'resultados'} · valor e referência`,
    notas: 'Notas para a consulta',
    notasSub: (quantas: number) => `${quantas} ${quantas === 1 ? 'anotação' : 'anotações'}`,
    habitos: 'Refeições, água e exercício',
    habitosSub: (refeicoes: number) =>
      `${refeicoes} ${refeicoes === 1 ? 'refeição' : 'refeições'} e o diário do dia`,

    formatoTitulo: 'Sai um arquivo .json',
    formatoTexto: 'É o formato que outro aplicativo consegue abrir e ler — serve para guardar uma cópia ou levar os registros para outro lugar. Para a versão feita para alguém ler, use o resumo para consulta.',

    gerar: 'Gerar o arquivo',
    gerando: 'Gerando...',
    verResumo: 'Ver o resumo para consulta',

    pronto: 'Arquivo gerado. Ele só vai para onde você escolher.',
    erro: 'Não deu para gerar o arquivo neste aparelho. Os seus registros continuam aqui, intactos.',
    parado: 'Nada sai daqui sem o seu toque.',
  },
};
