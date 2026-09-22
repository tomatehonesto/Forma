/* ============================================================
   O RESUMO PARA A CONSULTA — o documento que a pessoa leva

   ⚠️⚠️ ESTE TEXTO VAI PARA O MÉDICO, e é o único do aplicativo que sai
   dele. Isso muda duas coisas na redação:

   O REGISTRO É MAIS FORMAL que o do resto. "Cadência", "Variação", "Em" —
   são rótulos de tabela clínica, e não a voz de conversa que a Home usa.
   Quem lê do outro lado tem dois minutos e procura números.

   E A ORIGEM VAI JUNTO, na última linha. Quem recebe isto por mensagem
   precisa saber que saiu de um aplicativo de acompanhamento, e não de um
   prontuário — e que os números são o que a PESSOA registrou.

   ⚠️ CADA SINTOMA COM A SUA UNIDADE. Náusea, fome e energia são escalas
   de zero a dez; sono é hora de relógio. Uma seção inteira rotulada
   "(0–10)" punha sete horas de sono na mesma régua de uma náusea sete.
   ============================================================ */

export const resumo = {
  /* ---------------- medicação ---------------- */
  medicacao: 'Medicação',
  medicamento: 'Medicamento',
  dose: 'Dose',
  cadencia: 'Cadência',
  tempoDeTratamento: 'Tempo de tratamento',
  emDias: (dias: number) => `${dias} dias`,
  aplicacoes: 'Aplicações',
  aplicacoesValor: (feitas: number, previstas: number) => `${feitas} de ${previstas} previstas`,

  /* ---------------- peso ---------------- */
  peso: 'Peso',
  inicioAtual: 'Início → atual',
  variacao: 'Variação',
  em: 'Em',
  metaDePeso: 'Meta de peso',

  /* ---------------- sintomas ---------------- */
  sintomas: 'Sintomas',
  mediaDosDias: (comResposta: number) => `Média dos últimos 14 dias · ${comResposta} com resposta`,
  semRespostas: 'Sem respostas nos últimos 14 dias',
  nausea: 'Náusea',
  fome: 'Fome',
  energia: 'Energia',
  sono: 'Sono',
  de10: ' de 10',
  horas: ' h',

  /* ---------------- exames e anotações ---------------- */
  examesRecentes: 'Exames recentes',
  anotacoes: 'Anotações para a consulta',
  semAnotacoes: '(sem anotações)',

  /* ---------------- o texto que se envia ---------------- */
  cabecalho: (nome: string) => `RESUMO DE TRATAMENTO — ${nome}`,
  paraDoutor: (doutor: string) => ` · para ${doutor}`,
  origem: 'Gerado pelo aplicativo a partir dos registros da própria pessoa.',

  /* O documento guardado, na lista de documentos. */
  nomeDoDocumento: 'Resumo de tratamento',
  enviadoPara: (doutor: string) => `Enviado por você a ${doutor}`,
  enviado: 'Enviado por você',

  /* ============================================================
     A TELA DO RESUMO — a prévia do que vai chegar na consulta

     O documento em si está no resto deste arquivo, com o registro mais
     formal de quem lê do outro lado. Isto aqui é a moldura: para quem é,
     de quando, o que já foi enviado e a única parte escrita à mão.

     ⚠️ PARA QUEM É O RESUMO NÃO DEPENDE DE PLATAFORMA. O documento é PARA
     quem acompanha; o que precisa de servidor é ENVIÁ-LO. A linha lia o
     vínculo com a clínica e dizia "você ainda não tem equipe" para quem
     acabou de anotar o próprio médico — negando, na cara dela, o dado que
     ela mesma escreveu.

     ⚠️ E "VÊ NA PLATAFORMA DELA" SUPUNHA UMA MÉDICA. O possessivo tem
     gênero em português, e a tela não sabe o de quem acompanha. A frase
     foi reescrita para não precisar saber.
     ============================================================ */
  tela: {
    titulo: 'Resumo para consulta',
    lead: 'Tudo que você registrou, do jeito que vai chegar na consulta.',

    enviar: (doutor: string) => `Enviar a ${doutor}`,
    enviarDeNovo: (doutor: string) => `Enviar de novo a ${doutor}`,
    enviado: 'Enviado',
    compartilhar: 'Compartilhar de outro jeito',

    resumoDe: (data: string) => `Resumo de ${data}`,
    paraQuem: (quem: string) => `Para ${quem}`,
    paraQuemComClinica: (doutor: string, clinica: string) => `Para ${doutor} · ${clinica}`,
    paraLevar: 'Para levar na próxima consulta',
    enviadoEm: (quando: string) => `Enviado ${quando}`,
    enviosSub: (quantos: number) =>
      `${quantos} ${quantos === 1 ? 'envio' : 'envios'} · fica com a sua equipe`,

    examesRecentes: 'Exames recentes',
    verTodos: 'Ver todos',

    /* As anotações são a única parte escrita à mão deste resumo, e a
       única que some se a pessoa esquecer. */
    anotacoes: 'Anotações para a consulta',
    anotar: 'Anotar',
    anotacoesNota: 'Só as que você ainda não marcou como conversadas.',
    nadaAnotado: 'Nada anotado',
    nadaAnotadoTexto: 'O que você quiser perguntar na consulta se escreve aqui, e entra no resumo.',

    relatoTitulo: 'É um relato, não um exame',
    relatoTexto: 'Os números vêm do que você registrou no aplicativo. Servem para a conversa da consulta, e não substituem avaliação nem laudo.',

    confirmacaoEnvio: (doutor: string) => `Enviado. Chega para ${doutor}.`,
  },
};
