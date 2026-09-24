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
  pontosPercentuais: '%-Pkt.',

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
    notaLeitura: 'Werte von einer Körperanalysewaage. Hier gibt es nichts zu korrigieren — sie kommen bereits vollständig an.',
    /* „Arztbericht“ statt „der Bericht für deine Ärztin oder deinen
       Arzt“: das Kompositum nennt die Rolle und kein Geschlecht, und es
       passt in die Zeile. Siehe comum.ts. */
    notaCorrigir: 'Tipp darauf, um zu korrigieren oder zu löschen. Was hier steht, geht in den Arztbericht.',
  },

  telaEvolucao: {
    titulo: 'Verlauf',
    lead: 'Zwölf Wochen Behandlung. Tippe auf einen Marker, um den Verlauf zu sehen und Einträge zu korrigieren.',

    voceRegistra: 'Was du selbst einträgst',
    voceRegistraNota: 'Marker, die nur von dir abhängen — tippe, um den Verlauf zu sehen und Einträge zu korrigieren.',

    vemDeExame: 'Was aus einem Befund kommt',
    vemDeExameNota: 'Dafür braucht es einen Laborbefund oder eine Waage mit Körperanalyse. Nur zum Lesen — aber jeder öffnet seinen eigenen Verlauf.',

    pressao: 'Blutdruck',
    emQueda: 'Fallend',
    emAlta: 'Steigend',
    estavel: 'Gleichbleibend',
    pressaoValor: (sistolica: number, diastolica: number) => `${sistolica}/${diastolica}`,

    todosOsExames: 'Alle Befunde',
    todosOsExamesSub: 'Berichte, Referenzbereiche und der ganze Verlauf',
  },

  telaSinaisVitais: {
    titulo: 'Vitalwerte',
    lead: 'Werte, die sich zusammen mit dem Gewicht bessern — und die die Waage allein nicht zeigt.',

    aoLongoDoTempo: 'Über die Zeit verfolgt',
    pressaoArterial: 'Blutdruck',
    pressaoSub: (inicial: string, medicoes: number) =>
      `${inicial} am Anfang · ${medicoes} Messungen`,
    glicemiaDeJejum: 'Nüchternblutzucker',
    glicemiaSub: (inicial: number, medicoes: number) =>
      `${inicial} mg/dL am Anfang · ${medicoes} Messungen`,

    ultimaLeitura: 'Letzte Messung',
    ultimaLeituraNota: 'Eine Momentaufnahme: diese Zahlen sagen, ob du im Bereich liegst, nicht wohin es geht.',
    pontuais: {
      fc: 'Herzfrequenz',
      spo2: 'O₂-Sättigung',
      fr: 'Atemfrequenz',
      glic: 'Blutzucker',
    },
    seloNormal: 'normal',
    seloBaixo: 'niedrig',
    seloAlto: 'hoch',

    deOndeVem: 'Woher sie kommen',
    aparelhosEContas: 'Geräte und Konten',
    aparelhosEContasSub: 'Sehen, was sich heute verbinden lässt und was noch kommt',

    naoSeDigitam: 'Diese Zahlen tippt man nicht ein',
    naoSeDigitamTexto: 'Blutdruck, Sättigung und Frequenz kommen von einem verbundenen Gerät — und diese Verbindung gibt es in dieser Version noch nicht. Ein Laborergebnis kommt über Befunde herein.',
  },
};
