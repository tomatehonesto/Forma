import { medidas } from './medidas';

/* ============================================================
   LAS CONFIRMACIONES — la hoja que aparece después de registrar · es-419

   ⚠️ Las razones viven en ../pt-BR/confirmacoes.ts. Las dos que mandan:

   EL TÍTULO SOLO SE VUELVE NOTICIA CUANDO LA META CIERRA. "Hidratación del
   día cerrada" en cada vaso sería la mentira de siempre: decir que se
   acabó cuando todavía falta. Mientras falta, el título es el registro —
   "Agua registrada".

   Y EL SELLO DE LA VARIACIÓN NO JUZGA. El mismo tono vale para quien subió
   y para quien bajó: pintar uno de neutro y otro de lima sería la
   aplicación diciendo cuál de los dos días estuvo bien.
   ============================================================ */

export const confirmacoes = {
  /* ⚠️ "SIN CAMBIO" Y NO "−0,0". Un número que no se movió no varió para
     ningún lado, y el signo de menos delante de un cero sugiere una
     pérdida que no hubo. */
  semMudanca: 'sin cambio',

  peso: 'Peso registrado',
  pesoDesdeUltima: 'Desde el último pesaje',
  pesoMeta: 'Meta de peso',
  pesoFaltam: (quanto: string) => `faltan ${quanto}`,
  pesoAlcancada: 'alcanzada',
  /* ⚠️ EN MESETA EL CAMINO SE CAMBIA, no se suma: la hoja dibuja una sola
     invitación discreta, y dos empiezan a volverse menú. */
  pesoNotaPlato: 'Un mes con el peso en el mismo rango. Ahí es donde la cintura suele seguir bajando, y la cinta es la que lo muestra.',
  pesoCaminhoPlato: 'Medir el cuerpo también',
  pesoCaminho: 'Ver la curva del peso',

  medidas: 'Medidas registradas',
  cintura: medidas.corpo.cintura,
  quadril: medidas.corpo.quadril,
  braco: medidas.corpo.braco,
  coxa: medidas.corpo.coxa,
  medidasCaminho: 'Ver la evolución',

  exame: 'Resultado registrado',
  /* ⚠️ EL VEREDICTO PRIMERO, porque es la pregunta de quien acaba de
     escribir un número de examen — y el rango va junto, porque es el que
     sostiene el veredicto. */
  exameFaixa: 'Rango de referencia',
  exameNaReferencia: 'en el rango',
  exameAcima: 'arriba',
  exameAbaixo: 'abajo',
  exameDesdeAnterior: 'Desde la toma anterior',
  examePrimeira: 'Primera toma de este marcador',
  examePrimeiraSub: 'la próxima ya se vuelve comparación',
  exameCaminho: 'Ver en el panel de exámenes',

  anotacao: 'Nota guardada',
  anotacaoPauta: 'En la agenda de la consulta',
  anotacaoComDoutor: (doutor: string) => `va en el resumen para ${doutor}`,
  anotacaoSemDoutor: 'va en el resumen para la consulta',
  anotacaoCaminho: 'Ver el resumen para la consulta',

  refeicao: 'Comida registrada',
  refeicaoTexto: (agora: number, alvo: number) => `${agora} de ${alvo} g de proteína hoy`,
  refeicaoFesta: 'Meta de proteína del día cerrada',
  proteinaDoDia: 'Proteína del día',
  proteinaMeta: (alvo: number) => `meta de ${alvo} g`,
  faltamGramas: (v: string) => `faltan ${v} g`,
  metaBatida: 'meta alcanzada',
  refeicaoCaminho: 'Ver la alimentación del día',

  exercicio: 'Entrenamiento registrado',
  exercicioTexto: (tipo: string, min: string) => `${tipo} · ${min} min`,
  exercicioSemTreino: (agora: number) => `${agora} min hoy`,
  exercicioFesta: 'Meta de movimiento del día cerrada',
  movimentoDoDia: 'Movimiento del día',
  movimentoSub: (agora: number, alvo: number) => `${agora} de ${alvo} min`,
  faltamMinutos: (v: string) => `faltan ${v} min`,
  treinosHoje: 'Entrenamientos hoy',
  exercicioCaminho: 'Ver la semana de ejercicio',

  agua: 'Agua registrada',
  aguaFechada: 'Hidratación del día cerrada',
  aguaTexto: (agora: string, alvo: string) => `${agora} de ${alvo} hoy`,
  hidratacaoDoDia: 'Hidratación del día',
  hidratacaoMeta: (alvo: string) => `meta de ${alvo}`,
  faltamAgua: (v: string) => `faltan ${v}`,
  aguaCaminho: 'Ver la hidratación',
};
