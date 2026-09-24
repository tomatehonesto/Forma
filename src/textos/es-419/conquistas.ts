/* ============================================================
   LOS LOGROS — los caminos, qué dice cada nivel y qué falta · es-419

   ⚠️ Las razones viven en ../pt-BR/conquistas.ts. Las dos que mandan:

   LOS `id` Y LOS ESCALONES NO ESTÁN AQUÍ. 'kg', 'rodizio', 'prot-seq' son
   dato, y los números de cada nivel son contenido: escalones propios por
   idioma harían que la misma persona ganara logros distintos según la
   lengua en que lee.

   CADA CAMINO HABLA EN DOS TIEMPOS, y no son la misma frase: `desc` es lo
   que ese nivel YA ES — "12 inyecciones registradas" —, y `falta` es lo
   que la separa del próximo. "Faltan" y no "necesitas": el sujeto es la
   distancia, no la persona.

   ⚠️⚠️ Y EL PLURAL ES GRAMÁTICA, y por eso vive aquí. El español mueve el
   acento: "sesión" hace "sesiones", "medición" hace "mediciones",
   "inyección" hace "inyecciones" — la tilde DESAPARECE en el plural. Un
   `+ 's'` colgado al final escribiría "sesións" y nadie lo vería hasta
   que apareciera en la pantalla de alguien.
   ============================================================ */

/* El plural del español, con el irregular dicho por extenso cuando existe. */
const p = (n: number, s: string, pl = `${s}s`) => `${n} ${n === 1 ? s : pl}`;

export const conquistas = {
  familias: {
    tratamento: 'Tratamiento',
    peso: 'Peso',
    constancia: 'Constancia',
    hidratacao: 'Hidratación',
    proteina: 'Proteína',
    movimento: 'Movimiento',
    comida: 'Alimentación',
    acompanhamento: 'Seguimiento',
  },

  doses: 'Inyecciones',
  dosesDesc: (a: number) => `${p(a, 'inyección', 'inyecciones')} registrada${a === 1 ? '' : 's'}`,
  dosesFalta: (r: number) => `Faltan ${p(r, 'inyección', 'inyecciones')}`,

  tempo: 'Tiempo de tratamiento',
  /* Abajo de un año cuenta en meses, y a partir de ahí en años: "12 meses"
     y "1 año" son el mismo tiempo, y solo el segundo se celebra. */
  tempoDesc: (a: number) => (a < 365
    ? `${a / 30} ${a === 30 ? 'mes' : 'meses'} desde la primera dosis`
    : `${a / 365} año${a > 365 ? 's' : ''} desde la primera dosis`),
  tempoFalta: (r: number) => `Faltan ${p(r, 'día')}`,

  /* ⚠️ LA ROTACIÓN NO ES ADORNO: repetir el mismo punto causa nódulos, y
     alternar es indicación de prospecto. Es el único camino que premia una
     práctica de seguridad. */
  rodizio: 'Rotación',
  rodizioDesc: (a: number) => `${p(a, 'lugar', 'lugares')} de inyección usado${a === 1 ? '' : 's'}`,
  rodizioFalta: (r: number) => `Faltan ${p(r, 'lugar', 'lugares')}`,

  titulacao: 'Titulación',
  titulacaoDesc: (a: string) => `Llegar a la dosis de ${a}`,
  titulacaoFalta: (a: string) => `Próxima: ${a}`,

  /* ⚠️ EL PESO LLEGA YA ESCRITO, en la unidad de quien lee.

     ⚠️⚠️ Y POR ESO EL TÍTULO NO DICE LA UNIDAD: "Kilos de menos" sobre
     un valor en libras es la pantalla contradiciéndose. Las razones
     están en ../pt-BR/conquistas.ts. */
  kg: 'Peso perdido',
  kgDesc: (peso: string) => `${peso} por debajo del peso inicial`,
  kgFalta: (peso: string) => `Faltan ${peso}`,

  /* ⚠️ EL PORCENTAJE ES OTRA CONVERSACIÓN, y no repetición de los kilos:
     el cinco por ciento es la marca clínica que usa la literatura, y diez
     kilos significan cosas distintas en cuerpos distintos. */
  pct: 'Porcentaje perdido',
  pctDesc: (a: number) => `${a}% del peso inicial`,
  pctFalta: (r: string) => `Faltan ${r} puntos`,

  pesagens: 'Pesajes',
  pesagensDesc: (a: number) => `${p(a, 'pesaje')} registrado${a === 1 ? '' : 's'}`,
  pesagensFalta: (r: number) => `Faltan ${p(r, 'pesaje')}`,

  checkins: 'Check-ins',
  checkinsDesc: (a: number) => `${p(a, 'día')} respondido${a === 1 ? '' : 's'}`,
  checkinsFalta: (r: number) => `Faltan ${p(r, 'día')}`,

  sequencia: 'Días seguidos',
  sequenciaDesc: (a: number) => `${p(a, 'check-in')} en días seguidos`,
  sequenciaFalta: (r: number, alvo: number) => `Faltan ${p(r, 'día')} para ${alvo}`,

  aguaDias: 'Días en la meta de agua',
  aguaDiasDesc: (a: number) => `${p(a, 'día')} cumpliendo tu meta de agua`,
  aguaDiasFalta: (r: number) => `Faltan ${p(r, 'día')}`,

  aguaSemana: 'Semana hidratada',
  aguaSemanaDesc: (a: number) => `${p(a, 'día')} en la meta, en la misma semana`,
  aguaSemanaFalta: (r: number, alvo: number) => `Faltan ${p(r, 'día')} para ${alvo}`,

  protDias: 'Días en la meta de proteína',
  protDiasDesc: (a: number) => `${p(a, 'día')} cumpliendo tu meta de proteína`,
  protDiasFalta: (r: number) => `Faltan ${p(r, 'día')}`,

  protSeq: 'Proteína seguida',
  protSeqDesc: (a: number) => `${p(a, 'día')} seguidos en la meta`,
  protSeqFalta: (r: number, alvo: number) => `Faltan ${p(r, 'día')} para ${alvo}`,

  treinos: 'Entrenamientos',
  treinosDesc: (a: number) => `${p(a, 'sesión', 'sesiones')} registrada${a === 1 ? '' : 's'}`,
  treinosFalta: (r: number) => `Faltan ${p(r, 'entrenamiento')}`,

  exercSemana: 'Semana activa',
  exercSemanaDesc: (a: number) => `${p(a, 'día')} en la meta de movimiento, en la misma semana`,
  exercSemanaFalta: (r: number, alvo: number) => `Faltan ${p(r, 'día')} para ${alvo}`,

  refeicoes: 'Comidas',
  refeicoesDesc: (a: number) => `${p(a, 'plato')} registrado${a === 1 ? '' : 's'}`,
  refeicoesFalta: (r: number) => `Faltan ${p(r, 'comida')}`,

  favoritos: 'Platos favoritos',
  favoritosDesc: (a: number) => `${p(a, 'plato')} guardado${a === 1 ? '' : 's'} para repetir`,
  favoritosFalta: (r: number) => `Faltan ${p(r, 'plato')}`,

  medidas: 'Medidas de cinta',
  medidasDesc: (a: number) => `${p(a, 'medición', 'mediciones')} registrada${a === 1 ? '' : 's'}`,
  medidasFalta: (r: number) => `Faltan ${p(r, 'medición', 'mediciones')}`,

  /* ⚠️ SIN UNIDAD EN EL TÍTULO, por lo mismo que en la de peso. */
  cintura: 'Cintura',
  cinturaDesc: (comp: string) => `${comp} menos de cintura`,
  cinturaFalta: (comp: string) => `Faltan ${comp}`,

  exames: 'Exámenes',
  examesDesc: (a: number) => `${p(a, 'panel', 'paneles')} importado${a === 1 ? '' : 's'}`,
  examesFalta: (r: number) => `Faltan ${p(r, 'examen', 'exámenes')}`,

  consultas: 'Consultas',
  consultasDesc: (a: number) => `${p(a, 'consulta')} en el historial`,
  consultasFalta: (r: number) => `Faltan ${p(r, 'consulta')}`,

  marco: (titulo: string, nivel: number) => `${titulo} · nivel ${nivel}`,
  tela: {
    titulo: 'Logros',
    lead: 'Marcas que salen solas de lo que registraste — aquí nadie decide si te las mereces.',

    nivelDeTotal: (nivel: number, total: number) => `Nivel ${nivel} de ${total}`,
    niveisTotal: (total: number) => `${total} ${total === 1 ? 'nivel' : 'niveles'}`,
    trilhaCompleta: 'Camino completo',

    todas: 'Todos',
    checkinsNoMes: 'check-ins del mes',
    niveis: 'niveles',
    diasDeJornada: 'días de camino',

    conquistadas: 'Alcanzados',
    nenhumaAinda: 'Ninguno todavía',
    nenhumaAindaTexto: 'Los que están en camino aparecen aquí abajo.',
    ossoDaRegra: 'Los niveles salen de tus registros. Si un registro se va, el nivel que cerró se va con él.',
    aCaminho: 'En camino',
  },
};
