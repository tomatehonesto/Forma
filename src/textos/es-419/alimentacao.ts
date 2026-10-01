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
      `Es tu promedio en los últimos ${dias} días registrados, contra una meta de ${meta} g. Es lo que suele mantener a raya el estreñimiento del tratamiento — conviene seguir así.`,

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
    verdeTexto: 'Una ensalada o una verdura en el almuerzo llena el plato con pocas calorías — ayuda a llegar al final de la comida satisfecha sin gastar las calorías del día, y de paso trae fibra.',
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
    estimadoPeloNome: 'estimado por el nombre',
    semConta: 'todavía no entra en la cuenta',

    /* ⚠️ LA LECTURA DE UN ALIMENTO NO PROHÍBE NADA. "No está prohibido,
       pero ocupa bastante del día" es lo más lejos que va, y es a
       propósito: la aplicación no sabe qué acordó el equipo con la
       persona. */
    muitaProteinaPoucaCaloria: 'Mucha proteína para pocas calorías. Es el tipo de comida que el tratamiento pide: cabe en el plato que se achicó y todavía sostiene la masa magra.',
    boaFonte: 'Buena fuente de proteína, que es lo que sostiene la masa magra mientras el peso baja.',
    caloriaAlta: 'Calorías altas y poca proteína. No está prohibido, pero ocupa bastante de las calorías del día y devuelve poco de lo que el tratamiento necesita.',
    bastanteFibra: 'Bastante fibra. Ayuda con el estreñimiento, que es de los efectos secundarios más comunes del tratamiento.',
    quaseNaoPesa: 'Casi no pesa en las calorías del día. Bueno para acompañar el plato, pero la proteína tiene que venir de otro lado.',
    temFibra: 'Tiene fibra, que ayuda con el estreñimiento — de los efectos secundarios más comunes del tratamiento.',
  },

  /* ⚠️ LO QUE EL ÍTEM DECLARA VALE MÁS QUE EL REPLIEGUE. Un producto de
     cadena trae la tabla de la propia cadena, y la frase de repliegue — "la
     tabla de la Unicamp no analiza este" — es verdad y es inútil: describe
     lo que la fuente NO es, cuando el ítem sabe decir lo que es. */
  origem: {
    taco: 'Los números vienen de la tabla brasileña de composición de alimentos, hecha por la Unicamp, que mide en laboratorio lo que cada comida tiene dentro.',
    somaTaco: 'Este es un plato armado: sumamos ingrediente por ingrediente por la tabla de la Unicamp, en una porción de restaurante. El tuyo puede venir más grande o más chico.',
    rotulo: 'Ninguna de las tablas que usamos analiza este, así que los números vienen de la etiqueta de productos comunes en el mercado. De marca a marca cambian un poco.',
    usda: 'Los números vienen de la tabla de composición de alimentos del Departamento de Agricultura de Estados Unidos (USDA), que mide en laboratorio lo que cada comida tiene dentro.',
    soma: 'Este es un plato armado: sumamos ingrediente por ingrediente con las tablas que usamos, en una porción de restaurante. El tuyo puede venir más grande o más chico.',
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
    telaTitulo: 'Restricción alimentaria',
    telaTituloGrande: 'Restricciones alimentarias',
    telaLead: 'Marca lo que queda fuera de tu plato: solo sugerimos lo que encaja, y la tabla de alimentos muestra primero lo que sirve — sin esconder el resto. Si tienes alergia, revisa siempre la etiqueta, porque no podemos saber la marca ni la preparación.',
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

    comEstimativa: (n: number) => `${n === 1 ? 'Una comida entra' : `${n} comidas entran`} con números estimados, y no de tabla.`,

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
    diarioNota: 'Café, té, leche y jugo cuentan: la meta es de líquido, y no de agua pura. Borra lo que hayas registrado por error.',
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
    estimadoPelaFoto: 'Parte de este total fue estimada por la foto, y no salió de la tabla.',
    estimadoPelaIa: 'Parte de este total fue estimada, sin una tabla detrás.',

    pratosFavoritos: 'Platos favoritos',
    pratosGuardados: (quantos: number) =>
      `${quantos} ${quantos === 1 ? 'plato guardado' : 'platos guardados'}`,
    favoritoProteina: (quanto: number) => `~${quanto} g de proteína`,

    /* ---------- o compositor do prato (ui/comida) ---------- */
    buscaPlaceholder: 'Busca un alimento o un plato',
    itemSub: (marca: string, medida: string, gramas: number) =>
      `${marca}${medida} · ~${gramas} g de proteína`,
    /* quando nada da lista bate (ui/comida, BuscaAlimento): a estimativa com IA em destaque */
    foraDaLista: 'No está en nuestra lista',
    estimarComIa: 'Estimar con IA',
    estimarComIaSub: (texto: string) => `Proteína y calorías de 1 porción de “${texto}”`,
    /* o que a estimativa considerou, e o "descrever melhor" (ui/comida, ItemAlimento) */
    calculadoCom: (com: string) => `Calculamos con ${com}`,
    descreverMelhor: 'Describir mejor',
    descreverPlaceholder: 'Ej.: de tomate, sin queso',
    recalcular: 'Recalcular',
    recalculando: 'Recalculando…',
    redescreverFalhou: 'No se pudo recalcular ahora. Intenta de nuevo.',
    descreverCancelar: 'Cancelar',
    calculando: 'Calculando…',
    seuPrato: 'tu plato',
    estimativaSemRede: 'Sin conexión ahora. Inténtalo de nuevo cuando vuelva.',
    estimativaNaoReconheci: 'No reconocimos eso como comida. Intenta escribirlo de otra forma.',
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


    /* De que preparo são os números — ver scripts/dados/consolidacao. */

    preparo: {
      cru: 'Medido crudo.',
      cozido: 'Medido cocido, sin aceite.',
      grelhado: 'Medido a la plancha, sin aceite.',
      assado: 'Medido asado, sin aceite.',
      frito: 'Medido frito.',
      refogado: 'Medido salteado, con el aceite del salteado.',
    },
  },


  /* As prateleiras, pela chave com que ficam gravadas — ver
     logic/prateleiras. */
  prateleira: {
    'Arroz, massas e pães': 'Arroz, pastas y panes',
    'Bebidas': 'Bebidas',
    'Molhos e gorduras': 'Salsas y grasas',
    'Café da manhã': 'Desayuno',
    'Carnes e aves': 'Carnes y aves',
    'Castanhas e sementes': 'Nueces y semillas',
    'Doces e lanches': 'Dulces y botanas',
    'Frutas': 'Frutas',
    'Grãos e feijões': 'Granos y frijoles',
    'Leite e queijos': 'Lácteos y quesos',
    'Ovos': 'Huevos',
    'Peixes e frutos do mar': 'Pescados y mariscos',
    'Pratos prontos': 'Platos preparados',
    'Suplementos': 'Suplementos',
    'Verduras e legumes': 'Verduras',
  },

  telaAlimentos: {
    titulo: 'Alimentos',
    lead: (n: number) => `La tabla con la que contamos, con ${n} alimentos. Toca uno para ver la etiqueta completa.`,
    busca: 'Busca un alimento',
    tudo: 'Todo',
    fora: (nomes: string, n: number) => `${nomes}: ${n} fuera de la lista`,
    verTudo: 'Ver todo',
    sub: (medida: string, gramas: number) => `${medida} · ~${gramas} g de proteína`,
    nenhum: 'Ningún alimento con ese nombre. Prueba una palabra más corta.',
    verTodos: (n: number) => `Ver los ${n}`,
  },
  telaRefeicao: {
    titulo: 'Comida',
    naoEncontrada: 'No encontramos este registro',
    podeTerSidoApagada: 'Puede haberse borrado en otra pantalla.',
    deProteina: ' g de proteína',
    quando: (hora: string, semana: number) => `a las ${hora} · semana ${semana} del tratamiento`,
    noPrato: 'En el plato',
    origem: 'Origen',
    pelaFoto: 'Por la foto — la cámara leyó el plato y estimó',
    porVoce: 'Por ti — registrado en esta pantalla',
    corrigir: 'Corregir',
    apagar: 'Borrar',
    apagarTira: (g: number) => `Borrar quita los ${g} g de la proteína de ese día.`,
  },
  telaFavorito: {
    titulo: 'Plato favorito',
    naoEncontrado: 'No encontramos este plato',
    podeTerSidoApagado: 'Puede haberse borrado en otra pantalla.',
    itens: (n: number) => `${n} ${n === 1 ? 'ingrediente' : 'ingredientes'}`,
    semPrato: 'Sin plato guardado',
    deProteina: ' g de proteína',
    cadaVez: 'cada vez que registres este plato',
    linha: (medida: string, g: number) => `${medida} · ~${g} g de proteína`,
    registrar: 'Registrar una comida con este plato',
    apagar: 'Quitar de favoritos',
    apagarTira: 'Esto quita el plato de favoritos. Las comidas ya registradas con él se quedan.',
  },
  telaAguaRegistro: {
    titulo: '¿Cuánto bebiste?',
    sub: 'Toca las veces que necesites',
    escolha: 'Elige la cantidad',
    adicionar: (litros: string, bebida: string | null) => `Agregar ${litros} L${bebida ? ` de ${bebida}` : ''}`,
    deHoje: (alvo: string) => `de ${alvo} L hoy`,
    oQueBebeu: 'Qué bebiste',
    dosesDeProteina: 'Cuántas medidas de proteína',
    nenhuma: 'ninguna',
    outraPlaceholder: 'Kombucha, bebida isotónica, jugo de caña…',
    quantidade: 'Cantidad',
    doses: (d: number): string => `${d} ${d === 1 ? 'medida' : 'medidas'}`,
    semWhey: 'Sin whey',
  },
  telaCamera: {
    precisa: 'Se necesita la cámara',
    porque: 'La cámara lee el plato y estima la proteína de la comida. La foto se usa para eso y nada más.',
    permitir: 'Permitir la cámara',
    escolherFoto: 'Elegir una foto',
    agoraNao: 'Ahora no',
    enquadre: 'El plato entero, visto desde arriba',
  },
};
