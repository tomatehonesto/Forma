/* ============================================================
   EL EQUILIBRIO — la lectura del radar, en dos frases · es-419

   ⚠️ Las razones viven en ../pt-BR/equilibrio.ts. Las dos que mandan:

   HABLA EN PRIMERA PERSONA, Y ABRE CONVERSACIÓN. "Tu equilibrio está
   consistente" es informe, y quien escribe informes es un sistema. "Algo
   me llamó la atención" es alguien que miró los datos y decidió
   comentarlos. Las tres aperturas son tres grados de la misma voz, y
   ninguna pone nota.

   Y LA LECTURA NUNCA MANDA HACER NADA. La versión más grave dice "sería mi
   foco para la próxima semana" — condicional, primera persona, una
   sugerencia de dónde mirar.
   ============================================================ */

/* ⚠️⚠️ SOLO, EL EJE PIDE SU ARTÍCULO. El par de apertura puede ir sin él,
   en estilo de titular ("Sueño y adherencia están estables"), pero el eje
   aislado no: "Ejercicio es lo que más oscila" y "ni ejercicio se quedó
   atrás" son el portugués, que sí lo omite. Los ocho nombres de `eixos`
   tienen aquí su artículo; "mi" no pregunta género, y la proteína sola
   sería "mi proteína", que nadie dice — es el consumo. */
const ART: Record<string, string> = {
  Sueño: 'el sueño', Energía: 'la energía', Ánimo: 'el ánimo', Hidratación: 'la hidratación',
  Ejercicio: 'el ejercicio', Proteína: 'la proteína', Saciedad: 'la saciedad', Adherencia: 'la adherencia',
};
const el = (eixo: string) => ART[eixo] ?? eixo.toLowerCase();
const mayus = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
const mi = (eixo: string) => (eixo === 'Proteína' ? 'mi consumo de proteína' : `mi ${eixo.toLowerCase()}`);

export const equilibrio = {
  /* ⚠️ "SACIEDAD" NO ES EL NOMBRE DE LA COLUMNA que la persona respondió.
     Ella responde HAMBRE en el check-in, y el eje muestra lo contrario:
     cuanta más hambre, menos saciedad. El nombre del eje es el del lado
     bueno, porque en un gráfico donde todo crece hacia afuera el eje tiene
     que crecer con él. */
  eixos: {
    sono: 'Sueño',
    energia: 'Energía',
    humor: 'Ánimo',
    hidratacao: 'Hidratación',
    exercicio: 'Ejercicio',
    proteina: 'Proteína',
    saciedade: 'Saciedad',
    adesao: 'Adherencia',
  },

  aberturaTudoBem: 'Vi algo bueno.',
  aberturaAtencao: 'Algo me llamó la atención.',
  aberturaPreciso: 'Necesito mostrarte una cosa.',

  /* ⚠️⚠️ ESTE PAR ES UNA TRAMPA DE TRADUCCIÓN, y por eso es una función y
     no una concatenación afuera.

     En español los dos nombres abren la oración solos y el SEGUNDO va en
     minúscula: "Sueño y adherencia empujan hacia arriba". Sin "tu"
     adelante, a propósito — "tu sueño y adherencia" concuerda mal, y
     arreglarlo con "tu sueño y tu adherencia" traba la frase.

     ⚠️ Y AQUÍ VUELVE LA "y" QUE SE VUELVE "e" delante de i- o hi-: "Ánimo
     e hidratación", nunca "ánimo y hidratación". De los ocho ejes, dos
     empiezan así. */
  par: (primeiro: string, segundo: string) => {
    const s = segundo.toLowerCase();
    const conj = /^hie/.test(s) ? 'y' : (/^h?[ií]/.test(s) ? 'e' : 'y');
    return `${primeiro} ${conj} ${s}`;
  },

  corpoEquilibrado: (doisFortes: string, fraco: string) =>
    `${doisFortes} empujan hacia arriba, y ni ${el(fraco)} se quedó atrás. Yo no cambiaría nada por ahora.`,
  corpoUmAtras: (doisFortes: string, fraco: string) =>
    `${doisFortes} están estables. ${mayus(el(fraco))} es lo que más oscila — sería mi foco para la próxima semana.`,

  /* ⚠️ EL BOTÓN LLEVA LA PREGUNTA AL COMPANION. Si el texto del botón y la
     pregunta enviada divergen, la persona toca una cosa y recibe respuesta
     de otra. */
  botaoMelhorar: (eixo: string) => `Cómo mejorar ${mi(eixo)}`,
  perguntaMelhorar: (eixo: string) => `¿Cómo mejorar ${mi(eixo)}?`,

  serieDe: (eixo: string, dias: number) => `${eixo.toUpperCase()} · ÚLTIMOS ${dias} DÍAS`,
};
