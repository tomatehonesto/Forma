/* O PERFIL · fr-FR — ver o cabeçalho do pt-BR para as regras. */

export const perfil = {
  naoInformado: 'Non renseigné',
  nenhuma: 'Aucune',
  especialista: 'Spécialiste',
  dia: (numero: number) => `Jour ${numero}`,
  inicial: 'Départ',
  atual: 'Aujourd’hui',
  meta: 'Objectif',

  consultaEm: (quando: string) => `Consultation ${quando}`,
  naoLidas: (quantas: number) => `${quantas} non ${quantas === 1 ? 'lu' : 'lus'}`,

  planoECobranca: 'Formule et facturation',
  suaAssinatura: 'Votre abonnement',

  acompanhamento: 'Suivi',
  metasDiarias: 'Objectifs du jour',
  metasDiariasSub: (proteina: number, agua: string) => `${proteina} g de protéines · ${agua} L d’eau`,
  lembretes: 'Rappels',
  lembretesSub: 'Dose, pesée, eau et protéines',
  dispositivos: 'Appareils et intégrations',
  dispositivosSub: 'Apple Health, Withings et plus',

  oQueVoceJaFez: 'Ce que vous avez déjà fait',
  conquistas: 'Étapes franchies',
  conquistasSub: 'Ce que vous avez déjà atteint dans le traitement',

  sobreVoce: 'À propos de vous',
  seusDados: 'Vos informations',
  seusDadosSub: 'Taille, poids, rythme et plus',
  exames: 'Analyses',
  examesSub: 'Les résultats du laboratoire, expliqués',
  seuTratamento: 'Votre traitement',
  seuTratamentoSub: 'Tout ce que vous avez noté, semaine par semaine',

  personalize: 'Personnaliser l’application',
  aparencia: 'Apparence',
  aparenciaSub: (paleta: string, escuro: boolean) =>
    `${paleta}, en ${escuro ? 'sombre' : 'clair'} · choisissez la couleur de l’application`,
  idiomaSub: (idioma: string, pais: string) => `${idioma} · ${pais}`,
  unidades: 'Unités de mesure',
  unidadesSub: (sistema: string, unidades: string) => `${sistema} · ${unidades}`,

  ajudaEDados: 'Aide et données',
  privacidade: 'Confidentialité et données',
  privacidadeSub: 'Ce qui reste sur l’appareil, exporter, effacer et les documents',
  ajuda: 'Aide',
  ajudaSub: 'Questions fréquentes sur l’application',

  reportar: 'Signaler un problème',
  reportarSub: 'Racontez ce qui s’est passé — la version de l’application part avec',
  problemaAssunto: 'Morphi — problème',
  problemaSistema: (sistema: string, versao: string) => `Système : ${sistema} ${versao}`,
  problemaPaleta: (paleta: string, escuro: boolean) =>
    `Palette : ${paleta} · Thème : ${escuro ? 'sombre' : 'clair'}`,
  problemaCorpo: 'Racontez ce que vous étiez en train de faire et ce qui est arrivé.',

  sair: 'Se déconnecter',
  versao: (numero: string) => `Morphi · version ${numero}`,
};
