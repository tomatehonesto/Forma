import { medidas } from './medidas';

/* ============================================================
   EL INICIO Y EL CAMINO — las metas del día, las tarjetas y la línea de tiempo · es-419

   ⚠️ Las razones viven en ../pt-BR/home.ts. Las dos que mandan:

   TODO NÚMERO MOSTRADO VIENE CON UN VEREDICTO, y es la palabra que la
   persona busca primero. El valor dice la medida; la palabra dice si está
   bien. Sin ella la persona hace la cuenta sola, y en una aplicación de
   salud la hace mal.

   Y NINGÚN VEREDICTO DE AQUÍ LE PONE NOTA A LA PERSONA. "Abajo de la meta"
   califica el número; "no te esforzaste" calificaría a quien lo produjo.
   La diferencia se pierde fácil al traducir, y el archivo entero depende
   de ella.
   ============================================================ */

/* ⚠️ Los nombres del cuerpo vienen de medidas.corpo. Ver ../pt-BR. */
/* ⚠️ Los nombres del cuerpo vienen de medidas.corpo. Ver ../pt-BR. */
export const home = {
  /* ⚠️ "META ALCANZADA" NO ES CELEBRACIÓN, ES ESTADO. Ocupa el mismo lugar
     que "Faltan 27 g" — es la misma línea diciendo lo mismo del otro lado.
     Un "¡Felicitaciones!" ahí cambiaría lo que la tarjeta es. */
  metas: {
    proteina: 'Consumo de proteína',
    agua: 'Tomar más agua',
    exercicio: 'Ejercitarse a diario',
    batida: 'Meta alcanzada',
    faltamProteina: (gramas: number) => `Faltan ${gramas} g`,
    /* La cantidad llega ya escrita, con la unidad de quien lee. */
    faltamAgua: (quanto: string) => `Faltan ${quanto}`,
    faltamExercicio: (minutos: number) => `Faltan ${minutos} min`,
  },

  /* ⚠️ "CERCA DE LA META" ES BUENA NOTICIA, y es a propósito: 85% de la
     meta de proteína es un buen día, y llamarle "abajo" le enseña a la
     persona a ignorar la palabra. El tercer escalón existe para que el
     primero siga significando algo. */
  veredito: {
    naMeta: 'En la meta',
    pertoDaMeta: 'Cerca de la meta',
    abaixoDaMeta: 'Abajo de la meta',
    /* ⚠️ "BAJANDO" ES EL RAMO QUE SALVA LA TARJETA DE GRASA CORPORAL. Quien
       está arriba de la meta pero bajando desde el comienzo no está
       fallando — está a mitad de camino, que es donde está casi todo el
       mundo. */
    emQueda: 'Bajando',
    acimaDaMeta: 'Arriba de la meta',
  },

  /* ⚠️ EL TÍTULO TAMBIÉN CAMBIA, Y NO SOLO EL NÚMERO. "Peso perdido" encima
     de "+3,3 kg" es una contradicción dentro de la misma tarjeta — y la
     palabra equivocada duele más que el número. */
  peso: {
    perdido: 'Peso perdido',
    variacao: 'Variación del peso',
    meta: (quanto: string, unidade: string) => `Meta: ${quanto} ${unidade}`,
  },

  /* ⚠️ "ESTABLE", Y NO "−0,0". Un número que no se movió no varió para
     ningún lado, y la palabra es esa. No es buena noticia ni mala. */
  estavel: 'Estable',

  tipos: {
    checkin: 'Check-ins',
    aplicacao: 'Inyecciones',
    peso: 'Peso',
    refeicao: 'Comidas',
    exercicio: 'Ejercicios',
    consulta: 'Consultas',
    exame: 'Exámenes',
  },

  evento: {
    aplicacao: (dose: string, unidade: string) => `Inyección ${dose} ${unidade}`,
    peso: 'Peso',
    /* El primer pesaje no tiene anterior con qué comparar, así que en lugar
       de la variación va lo que es. */
    pesoInicial: 'Peso inicial',
    checkin: 'Check-in',
    exercicio: 'Ejercicio',
    minDeMovimento: (minutos: number) => `${minutos} min de movimiento`,
    proteinaDaRefeicao: (quanto: string) => `Proteína ${quanto}`,
    consulta: (tipo: string) => `Consulta ${tipo}`,
    marcadoresDe: (quantos: number, fonte: string) => `${quantos} marcadores · ${fonte}`,
    marcadoresDetalhe: (nome: string, quantos: number, fonte: string) =>
      `${nome} · ${quantos} marcadores · ${fonte}`,
    compartilhado: 'Compartido',

    gramasDeProteina: (gramas: number) => `${gramas} g proteína`,
    horasDeSono: (horas: number) => `${horas}h de sueño`,

    /* ⚠️ EL VEREDICTO DEL DÍA VIENE DEL ÁNIMO, y las tres palabras son
       cortas a propósito: ocupan la columna de la derecha, al lado de un
       número. "Difícil" es la más importante de las tres — nombra el día
       malo sin llamarlo fracaso. */
    diaBem: 'Bien',
    diaNeutro: 'Neutro',
    diaDificil: 'Difícil',

    respostaHumor: 'Ánimo',
    respostaEnergia: 'Energía',
    respostaFome: 'Hambre',
    respostaOutroSintoma: 'Otro síntoma',
  },

  /* ⚠️ EL RESUMEN CUENTA LO QUE LA SEMANA RINDIÓ, y no lista lo que hubo.
     Por eso cada tipo tiene singular y plural propios — "1 pesaje" y "3
     pesajes" —, y no un "(s)" colgado. */
  semana: {
    checkin: ['check-in', 'check-ins'] as [string, string],
    peso: ['pesaje', 'pesajes'] as [string, string],
    refeicao: ['comida', 'comidas'] as [string, string],
    exercicio: ['ejercicio', 'ejercicios'] as [string, string],
    consulta: ['consulta', 'consultas'] as [string, string],
    exame: ['examen', 'exámenes'] as [string, string],
    contagem: (quantos: number, nome: string) => `${quantos} ${nome}`,
    /* ⚠️ LA SEMANA VACÍA TIENE FRASE PROPIA, y no un espacio en blanco: una
       semana sin registros ocurrió, y su capítulo existe. */
    semRegistros: 'Sin registros en esta semana',

    hidratacao: 'Hidratación',
    proteina: 'Proteína',
    exercicioMetrica: 'Ejercicio',
    pesoMetrica: 'Peso',
    litrosPorDia: (quanto: string) => `${quanto} L/día`,
    gramasPorDia: (quanto: number) => `${quanto} g/día`,
    minutos: (quanto: number) => `${quanto} min`,
    deltaLitros: (quanto: string) => `${quanto} L`,
    deltaGramas: (quanto: string) => `${quanto} g`,
    deltaMinutos: (quanto: string) => `${quanto} min`,
  },

  mudancas: {
    peso: medidas.corpo.peso,
    cintura: medidas.corpo.cintura,
    gorduraCorporal: medidas.corpo.gordura,
    /* ⚠️ LA ÚNICA EN QUE SUBIR ES LA BUENA NOTICIA: el músculo perdido en
       un adelgazamiento es lo que el tratamiento intenta evitar. El rótulo
       no lo dice — quien lo dice es el tono —, pero quien traduzca tiene
       que saberlo. */
    massaMagra: medidas.corpo.massaMagra,
    naReferencia: 'En el rango',
    foraDaReferencia: 'Fuera del rango',
    pressao: 'Presión',
    /* ⚠️ "ESTABLE" ERA LO QUE SOBRABA DE TODO LO QUE NO FUERA BAJADA, y la
       presión subiendo catorce puntos salía como estable — en verde. Subir
       tiene nombre. */
    pressaoEmQueda: 'Bajando',
    pressaoEmAlta: 'Subiendo',
    pressaoEstavel: 'Estable',
  },

  metaDePeso: {
    /* "Llegar a 68 kg", y no "Meta: 68 kg": la lista es de cosas por
       conseguir, y el verbo es lo que la hace parecer una de ellas. */
    chegarA: (peso: string) => `Llegar a ${peso}`,
    alcancada: 'meta alcanzada',
    faltam: (quanto: string) => `faltan ${quanto}`,
  },

  /* ⚠️ SOLO EL NOMBRE DE APPLE CAMBIA DE IDIOMA, porque es Apple quien
     traduce el nombre de su propia aplicación. */
  fontes: {
    appleSaude: 'Apple Salud',
  },

  /* ⚠️ La pantalla del recorrido vive en `home` porque es la misma
     conversación. Ver ../pt-BR/home para los tres silencios. */
  telaHistorico: {
    exportar: 'Exportar',
    lead: (data: string) => `Todo lo que registraste desde el ${data}.`,
    semPesagem: 'sin pesaje',
    semanasVazias: (quantas: number) =>
      quantas === 1 ? 'Una semana quedó casi vacía' : `${quantas} semanas quedaron casi vacías`,
    semanasVaziasTexto: 'Las semanas sin registro siguen en la lista, del mismo tamaño que las demás. No desaparecen ni cuentan como falla.',
    registrosDesde: (quantos: number) =>
      `${quantos} ${quantos === 1 ? 'registro' : 'registros'} desde el comienzo del tratamiento`,
    registrosAteAqui: (quantos: number) =>
      `${quantos} ${quantos === 1 ? 'registro' : 'registros'} hasta ahora`,
  },

  telaJornada: {
    ultimos7: 'TUS ÚLTIMOS 7 DÍAS',
    doseEm: (quando: string) => `dosis ${quando}`,
    diasComCheckin: (feitos: number, dias: number, aplicadas: number, vividas: number) =>
      `${feitos} de ${dias} ${dias === 1 ? 'día' : 'días'} con check-in · ${aplicadas} de ${vividas} ${vividas === 1 ? 'semana' : 'semanas'} con inyección`,
    diasComCheckinSo: (feitos: number, dias: number) =>
      `${feitos} de ${dias} ${dias === 1 ? 'día' : 'días'} con check-in`,
    primeiraDose: 'Primera dosis',
    primeiraDoseTexto: 'El ciclo empieza a contar desde la primera dosis que registres.',
    semanaASemana: 'Semana a semana. Toca para ver qué marcó cada ciclo.',
    verAsSemanas: (quantas: number) => `Ver las ${quantas} semanas`,
    semanaEDia: (semana: number, dia: number) => `SEMANA ${semana} · DÍA ${dia}`,
    noInicio: (peso: string) => `${peso} al inicio`,
    primeiraPesagem: 'primer pesaje',
    hoje: 'hoy',
    faltam: (peso: string) => `faltan ${peso}`,

    protocolos: 'Protocolos',
    sinaisVitais: 'Signos vitales',
    refeicoesContadas: (quantas: number) => `${quantas} comidas`,
    aguaHoje: (quanto: string) => `${quanto} hoy`,
    minutosHoje: (minutos: number) => `${minutos} min hoy`,
    indicadores: (quantos: number) => `${quantos} ${quantos === 1 ? 'indicador' : 'indicadores'}`,
    feitasDeTotal: (feitas: number, total: number) => `${feitas} de ${total}`,

    semRegistro: 'sin registro',
    semQueixas: 'sin molestias en la semana',
    sintomaEmDias: (sintoma: string, dias: number) =>
      `${sintoma.toLowerCase()} en ${dias} ${dias === 1 ? 'día' : 'días'}`,

    dosesRestantes: (restam: number, semanas: number) =>
      restam === 0
        ? 'Ninguna dosis restante'
        : `${restam === 1 ? 'Queda 1 dosis' : `Quedan ${restam} dosis`} · cerca de ${semanas} ${semanas === 1 ? 'semana' : 'semanas'}`,

    oQueJaMudou: 'Lo que ya cambió',
    oQueJaMudouVazio: 'A partir del segundo pesaje, lo que cambió aparece aquí.',
    evolucao: 'Evolución',
    suasMetas: 'Tus metas',
    metas: 'Metas',
    oDiaADia: 'El día a día',
    seuTratamento: 'Tu tratamiento',
    /* o vazio de "Seu tratamento" e de "Suas metas" (Jornada, Histórico) */
    semanasVaziasTitulo: 'Las semanas empiezan con la primera aplicación',
    semanasVaziasTexto: 'El tratamiento se cuenta de una aplicación a la otra. Registra la primera, y cada semana aparece aquí con lo que pasó en ella.',
    registrarAplicacao: 'Registrar aplicación',
    metasVaziasTitulo: 'Crea una meta',
    metasVaziasTexto: 'Agua, sueño, entrenamiento o lo que tenga sentido para ti.',
    verTudo: 'Ver todo',

    porSemana: 'Por semana',
    semana: (numero: number) => `Semana ${numero}`,
    doseAjustada: 'dosis ajustada',
    semRegistrosNaSemana: 'Sin registros en esta semana.',
    nadaNesteTipo: 'Nada registrado en este tipo todavía',

    metaFeita: 'lograda',
    metaAberta: 'abierta',
  },

  telaInicio: {
    bomDia: 'Buenos días',
    boaTarde: 'Buenas tardes',
    boaNoite: 'Buenas noches',
    linhaDoDia: (dia: string, semana: number) => `${dia} • Semana ${semana}`,

    semRegistro: 'SIN REGISTRO',
    semRegistroOntem: 'La inyección de ayer no está registrada.',
    semRegistroDias: (dias: number) => `La inyección de hace ${dias} días no está registrada.`,
    semRegistroCorpo: 'Si te la aplicaste, puedes registrarla ahora. Si no, el ciclo se rehace a partir de la próxima.',
    semRegistroCta: 'Registrar inyección',

    aConsulta: 'LA CONSULTA',
    consultaHoje: 'Tu consulta es hoy.',
    consultaAmanha: 'Tu consulta es mañana.',
    consultaCorpo: 'Llevo ordenado todo lo que pasó desde la última consulta — peso, adherencia, síntomas y las preguntas que valen la pena.',
    consultaCta: 'Ver el resumen',

    acabou: (oRecipiente: string) => `${oRecipiente} se acabó.`,
    restaUmaDose: (onde: string) => `Queda una dosis ${onde}.`,
    receitaCorpo: 'Una receta nueva tarda algunos días entre el pedido y la farmacia — empezar ahora evita parar a mitad de camino.',
    pedirRenovacao: 'Pedir renovación',
    verMedicamento: 'Ver el medicamento',

    entendaOPorQue: 'Entender por qué',
    /* o destaque de boas-vindas, na primeira semana (logic/apresentacao) */
    boasVindasChapeu: 'BIENVENIDA',
    boasVindasTitulo: (nome: string): string => (nome ? `Qué bueno tenerte aquí, ${nome}` : 'Qué bueno tenerte aquí'),
    boasVindasCorpo: 'Tú registras el tratamiento y nosotros organizamos el resto: dosis, síntomas, alimentación y evolución.',
    boasVindasCta: 'Mira cómo podemos ayudarte',
    /* a semana que acabou de fechar, nos dois dias depois da dose nova */
    resumoChapeu: 'LA SEMANA QUE PASÓ',
    resumoTitulo: (n: number): string => `Tu semana ${n}`,
    resumoPeso: (d: string): string => `Peso ${d}`,
    resumoCta: 'Ver la semana',
    /* o nível de conquista alcançado nos últimos dias */
    marcoChapeu: 'LOGRO ALCANZADO',
    marcoCorpo: (trilha: string, n: number, de: number): string => `${trilha} · nivel ${n} de ${de}`,
    marcoCta: 'Ver logros',

    proximaAplicacao: 'PRÓXIMA INYECCIÓN',
    hojeEDiaDeAplicar: 'Hoy es día de aplicar tu dosis.',
    proximaDose: (quando: string) => `Tu próxima dosis es ${quando}.`,
    doseCorpo: (medicamento: string, dose: string, local: string) =>
      `${medicamento} ${dose} · ${local} sugerido.`,
    verAplicacao: 'Ver tus inyecciones',
    criarLembrete: 'Crear un recordatorio',

    checkinFeito: 'Check-in hecho',
    fazerCheckin: 'Hacer check-in',
    checkinUmMinuto: 'Toma menos de un minuto',
    diasSeguidos: (dias: number): string => (dias === 1 ? 'día de check‑in' : 'días seguidos de check‑in'),

    metasDiarias: 'Tus metas diarias',
    metasLink: 'Metas',
    registrar: 'Registrar',
    evolucao: 'Tu evolución',
    evolucaoLink: 'Evolución',
    gPorDia: 'g/día',
    forca: 'Entrenamiento de fuerza',
    dias: (n: number): string => (n === 1 ? 'día' : 'días'),
    nosUltimos7: 'En los últimos 7 días',

    quemCuida: 'Quién te cuida',
    areaMedica: 'Área médica',
    mensagens: 'Mensajes',
    novasMensagens: (quantas: number) =>
      `${quantas} ${quantas === 1 ? 'mensaje nuevo' : 'mensajes nuevos'}`,
    nenhumaMensagem: 'Ningún mensaje nuevo',
    proximaConsulta: 'Próxima consulta',
    consultaEm: (data: string, diaDaSemana: string) => `${data} • ${diaDaSemana}`,
    semConsulta: 'Ninguna consulta agendada',
    solicitarReceita: 'Solicitar receta nueva',
    solicitarReceitaSub: 'Un mensaje para tu equipo',
    acompanhaSeuTratamento: 'Acompaña tu tratamiento',
    resumoParaConsulta: 'Resumen para la consulta',
    resumoParaConsultaSub: 'Peso, adherencia, síntomas y exámenes en un solo documento',
    anotarConsulta: 'Anotar una consulta',
    anotarConsultaSub: 'Para avisarte cuando se acerque',
    quemAcompanha: '¿Quién acompaña tu tratamiento?',
    quemAcompanhaSub: 'Anota el nombre y el resumen queda dirigido a esa persona para la próxima consulta.',
    preencherFicha: 'Completar la ficha',
  },

  telaSemana: {
    titulo: 'Semana',
    semanaN: (numero: number) => `Semana ${numero}`,
    vazio: 'Todavía no hay semanas registradas.',
    lead: (periodo: string, dose: string) => `${periodo} · ${dose}`,

    aplicacao: 'Inyección',
    semPesagem: 'sin pesaje',

    comoSeSentiu: 'Cómo te sentiste',
    diasRespondidos: (quantos: number) => `${quantos} de 7 días respondidos`,
    sintomaDias: (legenda: string, dias: number) =>
      `${legenda} · ${dias} ${dias === 1 ? 'día' : 'días'}`,
    energia: 'Energía',
    energiaDe5: (media: string) => `${media} de 5`,

    diaADia: 'Día a día',
    diaComData: (diaDaSemana: string, data: string) => `${diaDaSemana}, ${data}`,
    selo: {
      aplicacao: 'inyección',
      checkin: 'check-in',
      peso: 'pesaje',
      refeicao: 'comida',
      exercicio: 'ejercicio',
      consulta: 'consulta',
      exame: 'examen',
    },

    nota: 'Nota para la consulta',
    verTodas: 'Ver todas',
    nenhumaNota: 'Ninguna nota en esta semana',
    anotadaEm: (data: string) => `Anotada el ${data}`,
    toqueParaEscrever: 'Toca para escribir una',
  },

  telaRegistrar: {
    titulo: '¿Qué quieres registrar?',

    checkinChapeu: 'CHECK-IN DIARIO',
    checkinFeito: 'Hecho hoy',
    checkinPendente: '¿Cómo estuvo tu día?',
    checkinEditar: 'Editar',
    diasSeguidos: (dias: number): string => (dias === 1 ? 'día seguido' : 'días seguidos'),

    agua: 'Me\nhidraté',
    /* ⚠️ EL OBJETIVO LLEGA CON LA UNIDAD ADENTRO, y por eso no hay "L"
       acá: en imperial los dos números son onzas. Ver ../pt-BR/home.ts. */
    aguaSub: (bebido: string, alvo: string) => `${bebido} de ${alvo}`,
    exercicio: 'Me\nejercité',
    exercicioSub: (feito: number, alvo: number) => `${feito} de ${alvo} min`,
    refeicao: 'Hice una comida',
    refeicaoSub: (proteina: number, alvo: number) => `${proteina} de ${alvo} g`,

    levaUmMinuto: 'LLEVA UN MINUTO',
    aplicacao: 'Me apliqué la dosis',
    peso: 'Acabo de pesarme',
    medidas: 'Me medí el cuerpo',
    exame: 'Recibí un examen',
    anotacao: 'Anoté algo para la consulta',
  },
  telaRitmo: {
    titulo: 'Tu ritmo de pérdida',
    sub: 'Cuánto baja tu peso por semana, en promedio, junto al ritmo que elegiste en el registro.',
    desdeOInicio: 'Desde el inicio',
    media: (semanas: number) => `promedio de ${semanas} ${semanas === 1 ? 'semana' : 'semanas'}`,
    recente: 'Últimas cuatro semanas',
    recenteSub: 'el tramo más reciente de la curva',
    escolhido: 'El ritmo que elegiste',
    semEscolha: 'Ningún ritmo elegido',
    semEscolhaSub: 'Toca para elegir uno',
    porSemana: (peso: string) => `${peso} por semana`,
    devagarTitulo: 'Más despacio también es camino',
    devagarTexto: 'El cuerpo no sigue el calendario que elegimos para él, y las semanas más lentas pasan en casi todo tratamiento — no quiere decir que algo salió mal. Lo que sostiene el resultado es seguir: las dosis, la proteína, el agua, el sueño. Si el ritmo elegido te pesa, puedes cambiarlo por uno que encaje mejor con tu momento.',
    acimaTitulo: 'Un número no es la historia',
    acimaTexto: 'La balanza oscila con el agua, el intestino, la sal y las hormonas, en cualquier fase del tratamiento — un peso por encima del inicio no borra lo que el tratamiento está haciendo. Conviene mirar la línea a lo largo de las semanas, y no el día. Si sigue subiendo por algunas semanas, es una buena conversación para tener con quien te acompaña, sin ninguna culpa.',
    avisoTitulo: 'La bajada no es recta',
    avisoTexto: 'Las primeras semanas suelen rendir más, y el ritmo afloja a medida que el cuerpo se ajusta. El ritmo elegido es el promedio del camino, no una exigencia de cada semana.',
    aceleradoTitulo: 'Un ritmo para conversar',
    aceleradoTexto: (limite: string) => `Por encima de ${limite} por semana, conviene hablar con quien te acompaña sobre hidratación y masa magra. No es un error tuyo: es el cuerpo respondiendo rápido.`,
    entendi: 'Entendí',
  },
  telaProtocolos: {
    semanaN: (n: number) => `Semana ${n}`,
    tudoCumprido: 'todo cumplido',
    cumpridasDeTotal: (feitas: number, total: number) => `${feitas} de ${total} cumplidas`,
    aplicacaoEm: (quando: string) => `inyección ${quando}`,

    falarComEquipe: 'Hablar con el equipo',

    estaSemana: 'Esta semana',
    ressalva: 'Estas metas son formas de sacarle más al tratamiento, y no una lista de exigencias — no cerrar todo está bien. Lo que conduce el tratamiento es la dosis y el acompañamiento. Lo que quede abierto vuelve a empezar la semana que viene, y los conteos se llenan solos con tus registros.',

    ressalvaDaSemana: 'Las metas son las de hoy, medidas en los registros de esta semana.',

    semanasAnteriores: 'Semanas anteriores',
    semanasAnterioresNota: 'Las metas de hoy, medidas en los registros de cada semana.',
  },
  telaDia: {
    registrosDeste: 'Registros de este día',
    diaDeAplicacao: 'Día de inyección',
    nadaRegistrado: 'nada registrado todavía',

    aplicacao: 'Inyección',
    doseLinha: (med: string, dose: string, unidade: string, estado?: string) =>
      `${med} ${dose} ${unidade}${estado ? ` · ${estado}` : ''}`,
    prevista: 'prevista para hoy',
    semRegistroMinusculo: 'sin registro',

    escalaDe: (nome: string, valor: number, max: number) => `${nome} ${valor} de ${max}`,
    respondidoNesteDia: 'Respondido en este día',
    semRegistro: 'Sin registro',

    seloFeita: 'hecha',
    seloFeito: 'hecho',
    seloRegistrar: 'registrar',

    semPrazo: 'Los días sin registro quedan en blanco. Puedes completarlos después, sin plazo.',
  },
  /* ---- a apresentação: como podemos ajudar (app/apresentacao) ---- */
  apresentacao: {
    pular: 'Saltar',
    continuar: 'Continuar',
    comecar: 'Empezar',
    /** o leitor de tela diz em que página está */
    pagina: (i: number, n: number): string => `${i} de ${n}`,
    /* quem toma comprimido não tem local de aplicação: a frase da dose muda */
    dose: { titulo: 'Tu dosis siempre al día', texto: 'Te recordamos a la hora justa, sugerimos dónde aplicarla la próxima vez y te avisamos antes de que se acabe el medicamento.', textoOral: 'Te recordamos a la hora justa y te avisamos antes de que se acabe el medicamento.' },
    estado: { titulo: 'Descubre lo que cambia en ti', texto: 'Un check-in rapidito al día y, con el tiempo, verás qué influye en tu apetito, tu sueño y tu ánimo.' },
    comida: { titulo: 'Comer bien, sin complicarte', texto: 'Mira cuánta proteína y agua llevas en el día. Fotografía tu plato y nosotros lo leemos por ti.' },
    evolucao: { titulo: 'Mira cuánto has avanzado', texto: 'El peso, las medidas y las metas que van más allá de la báscula, juntos en un solo lugar.' },
    consultas: { titulo: 'Un resumen para tu consulta', texto: 'Llega con todo lo que cambió desde la última, ordenado en un solo documento.' },
    /* ⚠️ "MORPHI INTELLIGENCE" É NOME, e não se traduz (pedido do dono). */
    companheiro: { titulo: 'Morphi Intelligence', texto: '¿Tienes alguna duda sobre el tratamiento? Pregunta cuando quieras, a cualquier hora.' },
  },

  primeirosPassos: {
    titulo: 'Primeros pasos',
    feito: 'Hecho',
    plano: 'Tu plan está listo',
    medicacao: 'Define tu medicamento',
    medicacaoSub: 'De él salen la dosis, el ciclo y los recordatorios',
    aplicacao: (injetavel: boolean): string => (injetavel ? 'Registra tu primera inyección' : 'Registra tu primera dosis'),
    aplicacaoSub: 'A partir de ella contamos el ciclo y la próxima dosis',
    checkin: 'Haz tu primer check-in',
    checkinSub: 'Cómo estás hoy, en menos de un minuto',
    meta: 'Define una meta más allá del peso',
    metaSub: 'Lo que más quieres que cambie, además de la báscula',
    lembretes: 'Permite los recordatorios',
    lembretesSub: 'Para que el aviso de la dosis suene a tiempo',
    saude: (app: string) => `Conecta ${app}`,
    saudeSub: 'El peso de la báscula entra solo',
    opcional: (porque: string) => `Opcional · ${porque}`,
    tudoPronto: '¡Todo listo!',
    tudoProntoTexto: 'Tu diario está armado. De aquí en adelante, solo registra: lo demás lo seguimos contigo.',
    essencialPronto: '¡Lo esencial está listo!',
    essencialProntoTexto: 'Lo que queda es opcional, y está en tu Perfil para cuando quieras.',
    fechar: 'Cerrar',
    reabrir: 'Primeros pasos',
    reabrirSub: (feitos: number, total: number) => `${feitos} de ${total} hechos · mostrar en Inicio`,
  },
  telaCheckinOk: {
    concluido: 'Check-in listo',
    diasSeguidos: (n: number): string => (n === 1 ? 'DÍA SEGUIDO DE CHECK-IN' : 'DÍAS SEGUIDOS DE CHECK-IN'),
    energia: 'Energía',
    sono: 'Sueño',
    humor: 'Ánimo',
    comoFoiODia: 'CÓMO FUE EL DÍA',
    sintomas: 'SÍNTOMAS',
    nenhumHoje: 'Ninguno hoy',
    naoEsqueca: 'NO LO OLVIDES',
    oQueFazer: 'QUÉ HACER',
    voltarHome: 'Volver al inicio',
  },
};
