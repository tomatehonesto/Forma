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
};
