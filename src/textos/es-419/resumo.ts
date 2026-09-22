/* ============================================================
   EL RESUMEN PARA LA CONSULTA — el documento que la persona lleva · es-419

   ⚠️ Las razones viven en ../pt-BR/resumo.ts. Las dos que mandan:

   ESTE TEXTO VA AL MÉDICO, y es el único de la aplicación que sale de
   ella. El registro es MÁS FORMAL que el del resto — "Cadencia",
   "Variación", "En" son rótulos de tabla clínica, y no la voz de
   conversación que usa la pantalla de inicio. Quien lee del otro lado
   tiene dos minutos y busca números.

   Y EL ORIGEN VA JUNTO, en la última línea: quien recibe esto por mensaje
   necesita saber que salió de una aplicación de seguimiento y no de una
   historia clínica, y que los números son lo que la PERSONA registró.

   ⚠️ CADA SÍNTOMA CON SU UNIDAD. Náusea, hambre y energía son escalas de
   cero a diez; el sueño es hora de reloj. Una sección entera rotulada
   "(0–10)" ponía siete horas de sueño en la misma regla de una náusea
   siete.
   ============================================================ */

export const resumo = {
  medicacao: 'Medicación',
  medicamento: 'Medicamento',
  dose: 'Dosis',
  cadencia: 'Cadencia',
  tempoDeTratamento: 'Tiempo de tratamiento',
  emDias: (dias: number) => `${dias} días`,
  aplicacoes: 'Aplicaciones',
  aplicacoesValor: (feitas: number, previstas: number) => `${feitas} de ${previstas} previstas`,

  peso: 'Peso',
  inicioAtual: 'Inicio → actual',
  variacao: 'Variación',
  em: 'En',
  metaDePeso: 'Meta de peso',

  sintomas: 'Síntomas',
  mediaDosDias: (comResposta: number) => `Promedio de los últimos 14 días · ${comResposta} con respuesta`,
  semRespostas: 'Sin respuestas en los últimos 14 días',
  nausea: 'Náusea',
  fome: 'Hambre',
  energia: 'Energía',
  sono: 'Sueño',
  de10: ' de 10',
  horas: ' h',

  examesRecentes: 'Exámenes recientes',
  anotacoes: 'Notas para la consulta',
  semAnotacoes: '(sin notas)',

  cabecalho: (nome: string) => `RESUMEN DE TRATAMIENTO — ${nome}`,
  paraDoutor: (doutor: string) => ` · para ${doutor}`,
  origem: 'Generado por la aplicación a partir de los registros de la propia persona.',

  nomeDoDocumento: 'Resumen de tratamiento',
  enviadoPara: (doutor: string) => `Enviado por ti a ${doutor}`,
  enviado: 'Enviado por ti',

  tela: {
    titulo: 'Resumen para la consulta',
    lead: 'Todo lo que registraste, tal como va a llegar a la consulta.',

    enviar: (doutor: string) => `Enviar a ${doutor}`,
    enviarDeNovo: (doutor: string) => `Enviar de nuevo a ${doutor}`,
    enviado: 'Enviado',
    compartilhar: 'Compartir de otra forma',

    resumoDe: (data: string) => `Resumen del ${data}`,
    paraQuem: (quem: string) => `Para ${quem}`,
    paraQuemComClinica: (doutor: string, clinica: string) => `Para ${doutor} · ${clinica}`,
    paraLevar: 'Para llevar a la próxima consulta',
    enviadoEm: (quando: string) => `Enviado ${quando}`,
    enviosSub: (quantos: number) =>
      `${quantos} ${quantos === 1 ? 'envío' : 'envíos'} · queda con tu equipo`,

    examesRecentes: 'Exámenes recientes',
    verTodos: 'Ver todos',

    anotacoes: 'Anotaciones para la consulta',
    anotar: 'Anotar',
    anotacoesNota: 'Solo las que todavía no marcaste como conversadas.',
    nadaAnotado: 'Nada anotado',
    nadaAnotadoTexto: 'Lo que quieras preguntar en la consulta se escribe aquí, y entra en el resumen.',

    relatoTitulo: 'Es un relato, no un examen',
    relatoTexto: 'Los números vienen de lo que registraste en la aplicación. Sirven para la conversación de la consulta, y no sustituyen una evaluación ni un informe.',

    confirmacaoEnvio: (doutor: string) => `Enviado. Le llega a ${doutor}.`,
  },
};
