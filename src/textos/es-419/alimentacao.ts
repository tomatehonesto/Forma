/* ============================================================
   LA ALIMENTACIÓN — lo que se come, lo que se bebe y lo que queda fuera · es-419

   ⚠️ Las razones viven en ../pt-BR/alimentacao.ts. La que vale para el
   archivo entero: NINGUNA frase de aquí es prescripción. Las lecturas
   señalan lo que el conteo muestra y sugieren un próximo plato; ninguna le
   dice a la persona que está equivocada, porque la aplicación no sabe qué
   acordó con su equipo.
   ============================================================ */

export const alimentacao = {
  /* ⚠️ TODA FRASE TRAE EL NÚMERO AL LADO. "Tu desayuno viene con 9 g" se
     puede verificar en la pantalla de abajo; "te está yendo bien en el
     desayuno" no se puede verificar en ninguna parte. Elogio sin número es
     la forma más rápida de que una aplicación suene a tarjeta de
     autoayuda.

     ⚠️ Y LA PREGUNTA DE CADA TARJETA VA EN PRIMERA PERSONA, como la
     persona preguntaría. El campo del companion recibe texto, y un título
     de sección pegado ahí se leería como comando de máquina. */
  conselhos: {
    fibraQ: '¿Cómo aumento la fibra de mi día sin cansarme de la comida?',
    fibraTitulo: (media: number) => `Fibra: ${media} g por día`,
    /* ⚠️ LA SEGUNDA MITAD ES LA RAZÓN DE QUE ESTA TARJETA SEA LA PRIMERA:
       el estreñimiento es de los efectos secundarios más comunes del
       tratamiento, y la fibra es la palanca de comida que existe para él. */
    fibraTexto: (dias: number, meta: number) =>
      `Es tu promedio en los últimos ${dias} días registrados, contra una meta de ${meta} g. Frijoles, avena, hojas verdes y frutas con cáscara son el camino más corto — y es la fibra la que ayuda con el estreñimiento, de los efectos secundarios más comunes del tratamiento.`,

    fibraBoaQ: '¿Qué cambia la fibra en mi tratamiento?',
    fibraBoaTitulo: (media: number) => `Fibra: ${media} g por día, arriba de la meta`,
    fibraBoaTexto: (dias: number, meta: number) =>
      `Es tu promedio en los últimos ${dias} días registrados, contra una meta de ${meta} g. Es lo que suele sostener el estreñimiento del tratamiento — vale mantenerlo como está.`,

    /* ⚠️ EL MOMENTO FLOJO NOMBRA EL MOMENTO, y es lo que el número del día
       no dice: un desayuno de 6 g y un almuerzo de 40 g suman lo mismo que
       dos de 23, y solo el primero tiene un próximo paso obvio. */
    momentoFracoQ: (momento: string) => `¿Qué puedo comer en ${momento.toLowerCase()} para tener más proteína?`,
    momentoFracoTitulo: (momento: string, media: number) => `${momento}: ${media} g de proteína, en promedio`,
    /* ⚠️ LAS FUENTES RESPETAN LO QUE LA PERSONA COME. La frase decía "un
       huevo, un yogur o un pedazo de queso" para todo el mundo — consejo
       que una persona vegana no puede seguir, dicho por la aplicación que
       acaba de preguntarle si es vegana. */
    momentoFracoTexto: (melhor: string, mediaMelhor: number, fontes: string) =>
      `Es tu momento más liviano en proteína — ${melhor.toLowerCase()} viene con ${mediaMelhor} g. Dentro de lo que comes, lo que más entrega proteína por caloría es ${fontes}.`,

    momentoForteQ: '¿Por qué importa tanto la proteína en este tratamiento?',
    momentoForteTitulo: (momento: string, media: number) => `${momento}: ${media} g de proteína, en promedio`,
    momentoForteTexto: 'Es el momento que más sostiene tu meta del día. Repetir lo que ya funciona ahí es más fácil que arreglar otro.',

    /* ⚠️ LA FRASE CUENTA EN CUÁNTOS DÍAS APARECIÓ UNA VERDURA EN EL
       REGISTRO, y no en cuántos la persona comió verdura. Son cosas
       distintas, y un plato preparado puede llevar verdura dentro sin que
       la aplicación lo sepa. */
    verdeQ: '¿Qué verduras combinan con lo que ya suelo comer?',
    verdeTitulo: (comVerde: number, total: number) =>
      `Verduras en ${comVerde} de ${total} días registrados`,
    verdeTexto: 'Una ensalada o una verdura en el almuerzo llena el plato con pocas calorías — ayuda a llegar al final de la comida satisfecha sin gastar el día, y trae la fibra junto.',
  },

  /* ⚠️ LOS `id` SON DATO — 'agua', 'cafe', 'coco' es lo que queda grabado
     en cada registro de hidratación. Solo el nombre y el recipiente vienen
     de aquí.

     ⚠️ Y EL RECIPIENTE ES LO QUE LA PERSONA DIRÍA EN VOZ ALTA. Nadie toma
     un bidón de café, y quien tomó una taza no sabe decir de memoria
     cuántos mililitros fueron. */
  bebidas: {
    agua: 'Agua',
    cafe: 'Café',
    cafeLeite: 'Café con leche',
    cha: 'Té',
    coco: 'Agua de coco',
    leite: 'Leche',
    suco: 'Jugo',
    shake: 'Batido o whey',
    refri: 'Gaseosa',
    alcool: 'Bebida alcohólica',
    outro: 'Otro',

    /* ⚠️ LA SALVEDAD DEL ALCOHOL SE QUEDA EN LA PANTALLA, y no escondida en
       una cuenta. Es la única bebida con efecto líquido negativo bien
       establecido — suprime la vasopresina y el cuerpo devuelve más de lo
       que recibió. Se sigue pudiendo registrar, porque el diario existe
       para registrar lo que pasó; solo no entra en el total. */
    notaAlcool: 'Queda registrada, pero no entra en el total: el alcohol hace que el cuerpo devuelva más líquido del que recibió.',

    recipientes: {
      xicara: 'Taza',
      caneca: 'Jarro',
      copo: 'Vaso',
      garrafa: 'Botella',
      caixinha: 'Cajita',
      lata: 'Lata',
      taca: 'Copa',
      longNeck: 'Long neck',
      coqueteleira: 'Coctelera',
    },
  },

  prato: {
    /* ⚠️ LOS MOMENTOS SON CLAVE Y RÓTULO A LA VEZ: el nombre es lo que
       queda grabado en cada comida, y también lo que la pantalla muestra.
       Traducir la lista NO rompe registros, porque la comparación siempre
       es contra el valor que la propia aplicación acaba de devolver — pero
       una comida vieja guardada con "Almoço" no casa con "Almuerzo", y por
       eso la pantalla cae en el nombre grabado cuando no lo reconoce. */
    cafeDaManha: 'Desayuno',
    almoco: 'Almuerzo',
    lanche: 'Merienda',
    jantar: 'Cena',

    porcoes: (qtd: number) => `${qtd} ${qtd === 1 ? 'porción' : 'porciones'}`,

    /* ⚠️ LA PROCEDENCIA SOLO APARECE CUANDO HAY QUE DECIRLA. Un ítem de
       tabla no dice nada: es el caso normal, y anunciarlo sería ruido en
       todas las líneas para avisar sobre ninguna. */
    estimado: 'estimado por la foto',
    semConta: 'todavía no entra en la cuenta',

    /* ⚠️ LA LECTURA DE UN ALIMENTO NO PROHÍBE NADA. "No está prohibido,
       pero ocupa bastante del día" es lo más lejos que va, y es a
       propósito: la aplicación no sabe qué acordó el equipo con la
       persona. */
    muitaProteinaPoucaCaloria: 'Mucha proteína para pocas calorías. Es el tipo de comida que el tratamiento pide: cabe en el plato que se achicó y todavía sostiene la masa magra.',
    boaFonte: 'Buena fuente de proteína, que es lo que sostiene la masa magra mientras el peso baja.',
    caloriaAlta: 'Calorías altas y poca proteína. No está prohibido, pero ocupa bastante del día y devuelve poco de lo que el tratamiento necesita.',
    bastanteFibra: 'Bastante fibra. Ayuda con el estreñimiento, que es de los efectos secundarios más comunes del tratamiento.',
    quaseNaoPesa: 'Casi no pesa en el día. Bueno para acompañar el plato, pero la proteína tiene que venir de otro lado.',
    temFibra: 'Tiene fibra, que ayuda con el estreñimiento — de los efectos secundarios más comunes del tratamiento.',
  },

  /* ⚠️ LO QUE EL ÍTEM DECLARA VALE MÁS QUE EL REPLIEGUE. Un producto de
     cadena trae la tabla de la propia cadena, y la frase de repliegue — "la
     tabla de la Unicamp no analiza este" — es verdad y es inútil: describe
     lo que la fuente NO es, cuando el ítem sabe decir lo que es. */
  origem: {
    porCem: (fonte: string) => `${fonte}. Son los valores por 100 g, y el peso de cada porción es el que la propia cadena declara.`,
    porPorcaoSemPeso: (fonte: string) => `${fonte}. Son los valores de la porción que la cadena vende, y no de 100 g — publica la etiqueta del producto, sin decir cuánto pesa.`,
    porPorcaoComPeso: (fonte: string) => `${fonte}. Son los valores de la porción que la cadena vende, y no de 100 g — con el peso que ella misma declara.`,
    taco: 'Los números vienen de la tabla brasileña de composición de alimentos, hecha por la Unicamp, que mide en laboratorio lo que cada comida tiene dentro.',
    somaTaco: 'Este es un plato armado: sumamos ingrediente por ingrediente por la tabla de la Unicamp, en una porción de restaurante. El tuyo puede venir más grande o más chico.',
    rotulo: 'La tabla de la Unicamp no analiza este, así que los números vienen de la etiqueta de productos comunes en el mercado. De marca a marca cambian un poco.',
  },

  /* ⚠️ EL SUBTÍTULO DICE LO QUE SIGUE, y no solo lo que sale. "Sin carne,
     pollo ni pescado" solo deja a la persona sin saber del huevo y el
     queso, que es justamente la duda de quien está eligiendo entre
     vegetariano y vegano. */
  restricoes: {
    vegetariano: 'Vegetariano',
    vegetarianoSub: 'Sin carne, pollo ni pescado. El huevo y los lácteos siguen.',
    vegano: 'Vegano',
    veganoSub: 'Nada de origen animal: carne, pescado, huevo, leche y queso quedan fuera.',
    semLactose: 'Sin lactosa',
    semLactoseSub: 'Leche, queso y derivados quedan fuera — por intolerancia o alergia.',
    semOvo: 'Sin huevo',
    semOvoSub: 'El huevo y los platos que llevan huevo quedan fuera.',
    semPeixe: 'Sin pescado ni mariscos',
    semPeixeSub: 'Pescado, camarón y mariscos quedan fuera.',
    semCarneVermelha: 'Sin carne roja',
    semCarneVermelhaSub: 'Res y cerdo quedan fuera. Pollo y pescado siguen.',
  },

  /* ⚠️ La frase de la energía trae `<b>` adentro, y eso suelta el ORDEN de
     las palabras: la cantidad puede ir en cualquier lugar de la frase. Ver
     ../pt-BR/alimentacao. */
  tela: {
    titulo: 'Alimentación',
    linhaSemProteina: (alvo: number) => `Proteína: nada registrado · meta de ${alvo} g`,
    linhaComProteina: (prot: number, alvo: number, resto: string) => `Proteína: ${prot} de ${alvo} g · ${resto}`,
    faltamParaMeta: (falta: number) => `faltan ${falta} g para la meta`,
    metaAlcancada: 'meta alcanzada',
    registrarRefeicao: 'Registrar una comida',

    energiaTitulo: 'La energía de hoy',
    calorias: 'CALORÍAS',
    deKcal: (meta: string) => `de ${meta} kcal`,

    sobramDoQueConta: (quanto: string) => `Sobran <b>${quanto} kcal</b> de lo que se puede contar.`,
    aindaCabem: (quanto: string) => `Todavía caben <b>${quanto} kcal</b> en tu día. Elige bien cómo gastarlas.`,
    passouAMeta: (quanto: string) => `Pasaste la meta del día por <b>${quanto} kcal</b>. Mañana es otro día.`,

    foraDaConta: (fora: number, total: number) =>
      `${fora} de ${total} ${total === 1 ? 'comida no entra' : 'comidas no entran'} en esta cuenta: solo el plato armado con la tabla tiene etiqueta verificada.`,

    carboidrato: 'Carbohidratos',
    gordura: 'Grasa',
    fibra: 'Fibra',
    deG: (meta: number) => `de ${meta} g`,

    semanaTitulo: 'La proteína de la semana',
    estaSemana: 'Esta semana',
    nadaNaSemana: 'Nada registrado en los últimos siete días',
    mediaDeDias: (dias: number) => `Promedio de ${dias} ${dias === 1 ? 'día registrado' : 'días registrados'}`,
    metaG: (alvo: number) => `Meta: ${alvo} g`,

    notamosTitulo: 'Lo que notamos',
    notamosNota: 'De tu rutina de las últimas dos semanas — y solo de lo que registraste.',
    continueAssim: 'SIGUE ASÍ',
    umaIdeia: 'UNA IDEA',
    conversarSobre: 'Conversar sobre esto',

    diarioTitulo: 'Diario de comidas',
    diarioNota: 'Toca una comida para verla, corregirla o borrarla.',
    porVoce: 'por ti',
    pelaFoto: 'por la foto',
    deProteina: 'de proteína',
    totalDoDia: (refeicoes: number, gramas: number) =>
      `${refeicoes} ${refeicoes === 1 ? 'comida' : 'comidas'} · ${gramas} g de proteína`,
    diaVazioTitulo: 'Ninguna comida este día',
    diaVazioTexto: 'Lo que registres entra en la proteína del día.',

    favoritosTitulo: 'Platos favoritos',
    favoritosLink: 'Guardar',
    favoritosNota: 'Arma el plato una vez y entra al registro con un toque.',
    semPratoGuardado: 'Sin plato guardado — se abre por la búsqueda',
    favVazioTitulo: 'Ningún plato favorito',
    favVazioTexto: 'Guarda un plato que repitas y entra con un toque.',

    seusAlimentos: 'Tus alimentos',
    dicionario: 'Diccionario de alimentos',
    dicionarioSub: 'Aprende cómo cada comida puede ayudarte en el tratamiento',
    restricoesLinha: 'Restricciones alimentarias',
    semRestricao: 'Ninguna',
  },

  telaAgua: {
    titulo: 'Hidratación',
    hojeNada: (meta: string) => `Hoy: nada registrado · meta de ${meta}`,
    hojeCom: (bebido: string, meta: string, resto: string) =>
      `Hoy: ${bebido} de ${meta} · ${resto}`,
    faltam: (quanto: string) => `faltan ${quanto}`,
    metaAlcancada: 'meta alcanzada',
    registrar: 'Registrar lo que tomaste',

    suaSemana: 'Tu semana',
    nadaNaSemana: 'Nada registrado en los últimos siete días',
    mediaDeDias: (dias: number) =>
      `Promedio de ${dias} ${dias === 1 ? 'día registrado' : 'días registrados'}`,
    meta: (quanto: string) => `Meta: ${quanto}`,

    diario: 'Diario de bebidas',
    diarioNota: 'Café, té, leche y jugo cuentan: la meta es de líquido, y no de agua pura. Borra lo que haya entrado mal.',
    apagarDoDia: '¿Borrar el agua de este día?',
    apagarGole: (quanto: string, hora: string) => `¿Borrar ${quanto} de las ${hora}?`,
    deBebida: (nome: string) => ` de ${nome}`,
    totalSemHora: 'Total del día, sin registro de horario',
    asHoras: (hora: string) => `a las ${hora}`,
    foraDaContaSufixo: ' · fuera de la cuenta',
    registros: (quantos: number, total: string) =>
      `${quantos} ${quantos === 1 ? 'registro' : 'registros'} · ${total}`,
    maisForaDaConta: (quantos: number) => ` · ${quantos} fuera de la cuenta`,
    daComida: (quanto: string) => `Más ${quanto} de la comida que registraste`,
    vazioTitulo: 'Nada registrado en este día',
    vazioTexto: 'Lo que anotes entra en el total del día.',

    lembrete: 'Recordatorio',
    alertas: (quantos: number) =>
      `${quantos} ${quantos === 1 ? 'alerta' : 'alertas'} de hidratación`,
    nenhumAlerta: 'Ninguna alerta de hidratación',
    tocaEm: (quando: string) => `Suena ${quando}`,
    umToquePorDia: 'Un toque por día, a la hora que elijas',
  },

  telaMedirRefeicao: {
    favorito: 'Un plato favorito',
    favoritoSub: 'Arma el plato una vez y queda a un toque',
    corrigir: 'Corregir la comida',
    corrigirSub: 'Qué quedó mal en el registro',
    oQueComeu: '¿Qué comiste?',
    proteinaHoje: (hoje: number, alvo: number) => `${hoje} de ${alvo} g de proteína hoy`,

    digaOQueTinha: 'Di qué había en el plato',
    guardarNosFavoritos: 'Guardar en favoritos',
    salvarCorrecao: 'Guardar la corrección',
    registrarMomento: (momento: string) => `Registrar ${momento}`,

    quando: 'CUÁNDO',
    oQueTinhaNoPrato: 'QUÉ HABÍA EN EL PLATO',
    proteinaDestaRefeicao: 'Proteína de esta comida',
    gramas: (quanto: number) => `~${quanto} g`,
    semContaUm: (item: string) =>
      `${item} no entra en esa cuenta — todavía no tengo la proteína de ese plato.`,
    semContaVarios: (quantos: number) =>
      `${quantos} ítems no entran en esa cuenta — todavía no tengo la proteína de ellos.`,
    estimadoPelaFoto: 'Parte de este total fue estimada por la foto, sin tabla detrás.',

    pratosFavoritos: 'Platos favoritos',
    pratosGuardados: (quantos: number) =>
      `${quantos} ${quantos === 1 ? 'plato guardado' : 'platos guardados'}`,
    favoritoProteina: (quanto: number) => `~${quanto} g de proteína`,

    /* ---------- o compositor do prato (ui/comida) ---------- */
    buscaPlaceholder: 'Busca un alimento o un plato',
    itemSub: (marca: string, medida: string, gramas: number) =>
      `${marca}${medida} · ~${gramas} g de proteína`,
    anotarEscrito: (texto: string) => `Anotar “${texto}”`,
    semProteinaAinda: 'Todavía no tengo la proteína de ese',
    escanear: 'Escanear',
    lendoOPrato: 'Leyendo el plato…',
    confiraALista: 'Revisa la lista de abajo y ajusta lo que haga falta.',

    apagar: 'Borrar esta comida',
  },

  telaAlimento: {
    titulo: 'Alimento',
    naoEncontrado: 'No encontré este alimento.',

    destaque: {
      'proteína': 'Mucha proteína',
      'fibra': 'Mucha fibra',
      'vitamina C': 'Mucha vitamina C',
      'vitamina A': 'Mucha vitamina A',
      'cálcio': 'Mucho calcio',
      'ferro': 'Mucho hierro',
      'magnésio': 'Mucho magnesio',
      'zinco': 'Mucho zinc',
      'fósforo': 'Mucho fósforo',
      'niacina': 'Mucha niacina',
      'tiamina': 'Mucha tiamina',
      'riboflavina': 'Mucha riboflavina',
    },
    porcentoDoDia: (pct: number) => `${pct}% de lo que una persona necesita por día`,

    porcaoDe: (medida: string) => `Porción: ${medida}`,
    porcaoDe100: 'Porción de 100 g',
    valoresDe: (medida: string) => `Valores de ${medida}`,
    valoresPor100: 'Valores por 100 g',

    proteina: 'Proteína',
    carboidrato: 'Carbohidrato',
    gordura: 'Grasa',

    proteinaEm: (medida: string) => `Proteína en ${medida}`,
    fibraEm: (medida: string) => `Fibra en ${medida}`,
    fibraPor100: 'Fibra por 100 g',
    naoMedida: 'sin medir',
    pesaPertoDe: (medida: string, peso: string) => `${medida} pesa cerca de ${peso}.`,

    registrarComIsto: 'Registrar una comida con esto',
  },
};
