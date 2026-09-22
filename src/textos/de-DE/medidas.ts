/* ============================================================
   DIE MASSEINHEITEN — die Wörter, nicht die Zeichen · de-DE

   ⚠️ Die Gründe stehen in ../pt-BR/medidas.ts. Hier steht nur, was
   ausgeschrieben gelesen wird: „kg“, „cm“, „oz“ und „ml“ sind
   internationale Zeichen und bleiben im Code.

   ⚠️ UND DIE LISTE IST DAS BEISPIEL, NICHT DAS INVENTAR. Sie steht unter
   dem Namen des Systems, für alle, die nicht auswendig wissen, was
   „imperial“ meint.
   ============================================================ */

export const medidas = {
  /* ⚠️ „METRISCH“ SAGT EINEM DEUTSCHEN LESER SO WENIG WIE „MÉTRICO“ einem
     brasilianischen — niemand wählt nach dem Namen. Genau deshalb läuft
     die Beispielliste nebenher. */
  metrico: 'Metrisch',
  imperial: 'Imperial',
  unidadesMetrico: 'Kilogramm, Meter, Zentimeter und Liter',
  /* „Fuß“ und „Zoll“ und nicht „feet“ und „inch“: die Einheiten haben
     deutsche Namen, auch wenn sie hier kaum jemand benutzt. */
  unidadesImperial: 'Pfund, Fuß, Zoll und Unzen',

  /* ⚠️⚠️ DIE SIEBEN KÖRPERMARKER WOHNEN HIER, UND NUR HIER. Sie standen an
     zwei Stellen geschrieben — vier in `home.mudancas` und vier in
     `confirmacoes` —, und mit dem Marker-Bildschirm wären sie an der
     dritten gelandet. Siehe ../pt-BR/medidas. */
  corpo: {
    peso: 'Gewicht',
    cintura: 'Taille',
    quadril: 'Hüfte',
    braco: 'Arm',
    coxa: 'Oberschenkel',
    gordura: 'Körperfett',
    massaMagra: 'Magermasse',
  },

  tela: {
    periodo12s: '12 Wochen',
    periodo3m: '3 Monate',
    periodoTudo: 'Alles',

    mesmoJeitoTitulo: 'Immer auf dieselbe Weise messen',
    mesmoJeitoTexto: 'Zur selben Tageszeit, ohne enge Kleidung, das Band eng an der Haut, ohne zu ziehen. Zwei Messungen zu vergleichen gilt nur, wenn beide gleich gemacht wurden.',

    notaManha: 'morgens',

    /* ⚠️ KEIN `toLowerCase()` HIER, anders als in den vier anderen
       Sprachen: „Noch kein Eintrag für gewicht“ wäre ein
       Rechtschreibfehler. Dieselbe Regel wie `comum.noMeio`. */
    vazioTitulo: (nome: string) => `Noch kein Eintrag für ${nome}`,
    vazioDaBalanca: 'Dieser Wert kommt von einer Körperanalysewaage, und es ist noch keiner angekommen.',
    vazioRegistre: 'Trag den ersten ein, um ihn zu verfolgen.',

    lead: (data: string, inicial: string, unidade: string) =>
      `Eingetragen am ${data} · ${inicial} ${unidade} zu Beginn der Behandlung`,
    subCurva: (periodo: string, quantos: number) =>
      `${periodo}${quantos > 1 ? ` · ${quantos} Einträge` : ''}`,

    registros: 'Einträge',
    notaLeitura: 'Werte von einer Körperanalysewaage. Hier gibt es nichts zu korrigieren — sie kommen fertig an.',
    /* „Arztbericht“ statt „der Bericht für deine Ärztin oder deinen
       Arzt“: das Kompositum nennt die Rolle und kein Geschlecht, und es
       passt in die Zeile. Siehe comum.ts. */
    notaCorrigir: 'Tipp darauf, um zu korrigieren oder zu löschen. Was hier steht, geht in den Arztbericht.',
  },
};
