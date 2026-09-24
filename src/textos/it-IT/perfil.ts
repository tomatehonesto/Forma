/* ============================================================
   IL PROFILO — la scheda e l'indice dei controlli · it-IT

   ⚠️ Le ragioni vivono in ../pt-BR/perfil.ts. La schermata ha due
   nature: sopra la scheda, con l'etichetta corta accanto al numero che
   il resto dell'app usa per calcolare tutto; sotto l'indice, dove ogni
   riga è un argomento, con il nome della schermata di destinazione e una
   seconda riga che dice che cosa ci abita.

   ⚠️ IL NOME DELLA RIGA È IL NOME DELLA DESTINAZIONE. "La tua terapia"
   apre una schermata che si chiama "La tua terapia"; "Storico completo"
   aprirebbe la stessa e farebbe credere di essere arrivate altrove.
   ============================================================ */

export const perfil = {
  /* ---------- la scheda ---------- */
  naoInformado: 'Non indicato',
  nenhuma: 'Nessuna',
  especialista: 'Specialista',
  dia: (numero: number) => `Giorno ${numero}`,
  inicial: 'Iniziale',
  atual: 'Attuale',
  meta: 'Obiettivo',

  /* ---------- chi ti segue ---------- */
  consultaEm: (quando: string) => `Visita ${quando}`,
  /* ⚠️ IL MESSAGGIO NON LETTO COMPARE SOLO QUANDO ESISTE: "0 non letti" è
     l'app che attacca discorso sul nulla. */
  naoLidas: (quantas: number) => `${quantas} ${quantas === 1 ? 'non letto' : 'non letti'}`,

  /* ---------- piano e pagamenti ---------- */
  planoECobranca: 'Piano e pagamenti',
  suaAssinatura: 'Il tuo abbonamento',

  /* ---------- il monitoraggio ----------

     ⚠️ LE TRE NON SONO PREFERENZE. Cambiare un obiettivo di proteine è
     decidere che cosa la terapia insegue, non regolare un'opzione
     dell'app — per questo stanno in un gruppo a parte. */
  acompanhamento: 'Monitoraggio',
  metasDiarias: 'Obiettivi del giorno',
  metasDiariasSub: (proteina: number, agua: string) => `${proteina} g di proteine · ${agua} L d’acqua`,
  lembretes: 'Promemoria',
  lembretesSub: 'Dose, pesata, acqua e proteine',
  dispositivos: 'Dispositivi e collegamenti',
  dispositivosSub: 'Apple Salute, Withings e altri',

  /* ---------- i traguardi ---------- */
  oQueVoceJaFez: 'Quello che hai già fatto',
  conquistas: 'Traguardi',
  conquistasSub: 'Quello che hai già raggiunto nella terapia',

  /* ---------- su di te ----------

     La regola di questo gruppo: ci abita solo quello che finisce nella
     persona stessa. Il riepilogo per la visita è uscito di qui proprio
     per questo — parla di lei a qualcun altro. */
  sobreVoce: 'Su di te',
  seusDados: 'I tuoi dati',
  seusDadosSub: 'Altezza, peso, ritmo e altro',
  exames: 'Esami',
  examesSub: 'I risultati del laboratorio, spiegati',
  seuTratamento: 'La tua terapia',
  seuTratamentoSub: 'Tutto quello che hai registrato, settimana per settimana',

  /* ---------- personalizza ----------

     ⚠️ LA LINGUA VIENE PRIMA DELLE UNITÀ, perché è lei a decidere tutte e
     due le cose: cambiare lingua cambia la parola E la virgola decimale.

     ⚠️ "UNITÀ DI MISURA", e non "Unità": da sola, la parola è anche
     quella delle "unità di insulina" — un'altra cosa che questa app ha. */
  personalize: 'Personalizza l’app',
  aparencia: 'Aspetto',
  aparenciaSub: (paleta: string, escuro: boolean) =>
    `${paleta}, modalità ${escuro ? 'scura' : 'chiara'} · scegli il colore dell’app`,
  idiomaSub: (idioma: string) => idioma,
  unidades: 'Unità di misura',
  unidadesSub: (sistema: string, unidades: string) => `${sistema} · ${unidades}`,

  /* ---------- aiuto e dati ---------- */
  ajudaEDados: 'Aiuto e dati',
  privacidade: 'Privacy e dati',
  privacidadeSub: 'Che cosa resta sul dispositivo, esportare, cancellare e i documenti',
  ajuda: 'Aiuto',
  ajudaSub: 'Domande frequenti sull’app',

  /* ---------- segnalare un problema ----------

     ⚠️ NELLA MAIL VA SOLO QUELLO CHE NESSUNO SA A MEMORIA: versione,
     sistema e dispositivo. NIENTE DEL DIARIO VA INSIEME — peso, dose e
     sintomo non escono di qui senza che sia la persona a mandarli, e la
     segnalazione di un difetto non è mandarli. */
  reportar: 'Segnala un problema',
  reportarSub: 'Racconta che cos’è successo — alleghiamo la versione dell’app',
  problemaAssunto: 'Morphi — problema',
  problemaSistema: (sistema: string, versao: string) => `Sistema: ${sistema} ${versao}`,
  problemaPaleta: (paleta: string, escuro: boolean) =>
    `Palette: ${paleta} · Tema: ${escuro ? 'scuro' : 'chiaro'}`,
  problemaCorpo: 'Racconta che cosa stavi facendo e che cosa è successo.',

  /* ---------- il piè di pagina ---------- */
  sair: 'Esci dall’account',
  versao: (numero: string) => `Morphi · versione ${numero}`,
};
