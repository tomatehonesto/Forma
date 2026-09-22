/* ============================================================
   LES UNITÉS DE MESURE — les mots, pas les symboles · fr-FR

   ⚠️ Les raisons vivent dans ../pt-BR/medidas.ts. Seul ce qui se lit à
   voix haute entre ici : « kg », « cm », « oz » et « ml » sont des
   symboles internationaux et restent dans le code.
   ============================================================ */

export const medidas = {
  metrico: 'Métrique',
  imperial: 'Impérial',
  unidadesMetrico: 'kilos, mètres, centimètres et litres',
  unidadesImperial: 'livres, pieds, pouces et onces',

  /* ⚠️ LES SEPT MARQUEURS DU CORPS VIVENT ICI, ET SEULEMENT ICI — ils
     étaient écrits à deux endroits. Voir ../pt-BR/medidas. */
  corpo: {
    peso: 'Poids',
    cintura: 'Tour de taille',
    quadril: 'Tour de hanches',
    braco: 'Bras',
    coxa: 'Cuisse',
    gordura: 'Masse grasse',
    massaMagra: 'Masse maigre',
  },

  tela: {
    periodo12s: '12 semaines',
    periodo3m: '3 mois',
    periodoTudo: 'Tout',

    mesmoJeitoTitulo: 'Mesurer toujours de la même façon',
    mesmoJeitoTexto: 'À la même heure du jour, sans vêtement serré, le mètre posé à plat sur la peau, sans tirer. Comparer deux mesures ne vaut que si les deux ont été prises pareil.',

    notaManha: 'le matin',

    vazioTitulo: (nome: string) => `Aucun relevé de ${nome.toLowerCase()}`,
    vazioDaBalanca: 'Cette mesure vient d’une balance à impédancemétrie, et aucune n’est encore arrivée.',
    vazioRegistre: 'Notez la première pour commencer à la suivre.',

    lead: (data: string, inicial: string, unidade: string) =>
      `Noté le ${data} · ${inicial} ${unidade} au début du traitement`,
    subCurva: (periodo: string, quantos: number) =>
      `${periodo.toLowerCase()}${quantos > 1 ? ` · ${quantos} relevés` : ''}`,

    registros: 'Relevés',
    notaLeitura: 'Lectures d’une balance à impédancemétrie. Il n’y a rien à corriger ici — elles arrivent finies.',
    notaCorrigir: 'Touchez pour corriger ou supprimer. Ce qui est ici part dans le compte rendu pour votre médecin.',
  },

  telaEvolucao: {
    titulo: 'Évolution',
    lead: 'Douze semaines de traitement. Touchez un marqueur pour voir l’historique et corriger les relevés.',

    voceRegistra: 'Ce que vous notez',
    voceRegistraNota: 'Des marqueurs qui ne dépendent que de vous — touchez pour voir l’historique et corriger.',

    vemDeExame: 'Ce qui vient d’une analyse',
    vemDeExameNota: 'Ils demandent un compte rendu de laboratoire ou une balance à impédancemétrie. En lecture seule — mais chacun ouvre son propre historique.',

    pressao: 'Tension',
    emQueda: 'En baisse',
    emAlta: 'En hausse',
    estavel: 'Stable',
    pressaoValor: (sistolica: number, diastolica: number) => `${sistolica}/${diastolica}`,

    todosOsExames: 'Toutes les analyses',
    todosOsExamesSub: 'Comptes rendus, valeurs de référence et historique complet',
  },

  telaSinaisVitais: {
    titulo: 'Signes vitaux',
    lead: 'Des indicateurs qui s’améliorent avec le poids — et que la balance seule ne montre pas.',

    aoLongoDoTempo: 'Suivis dans le temps',
    pressaoArterial: 'Tension artérielle',
    pressaoSub: (inicial: string, medicoes: number) =>
      `${inicial} au départ · ${medicoes} mesures`,
    glicemiaDeJejum: 'Glycémie à jeun',
    glicemiaSub: (inicial: number, medicoes: number) =>
      `${inicial} mg/dL au départ · ${medicoes} mesures`,

    ultimaLeitura: 'Dernière mesure',
    ultimaLeituraNota: 'Une mesure ponctuelle : ces chiffres disent si vous êtes dans la fourchette, pas vers où vous allez.',
    pontuais: {
      fc: 'Fréq. cardiaque',
      spo2: 'Saturation O₂',
      fr: 'Fréq. respiratoire',
      glic: 'Glycémie',
    },
    seloNormal: 'normal',
    seloBaixo: 'bas',
    seloAlto: 'haut',

    deOndeVem: 'D’où ils viennent',
    aparelhosEContas: 'Appareils et comptes',
    aparelhosEContasSub: 'Voir ce qui se connecte aujourd’hui, et ce qui reste à venir',

    naoSeDigitam: 'Ces chiffres ne se tapent pas',
    naoSeDigitamTexto: 'La tension, la saturation et la fréquence arrivent d’un appareil connecté — et cette liaison n’existe pas encore dans cette version. Un résultat de laboratoire entre par Analyses.',
  },
};
