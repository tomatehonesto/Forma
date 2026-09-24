/* ============================================================
   LE REGOLE DI LINGUA CHE NON SONO DI NESSUN DOMINIO · it-IT

   ⚠️ Le ragioni vivono in ../pt-BR/comum.ts. Qui sta la grammatica pura:
   quello che serve a tutti i domini e che non appartiene a nessuno.

   ⚠️⚠️ L'APP DÀ DEL "TU". È la decisione che costa di più disfare in
   questo catalogo, e in italiano non è nemmeno una scelta difficile: il
   "Lei" è la forma della lettera formale e del referto, e questa app
   parla accanto a una persona che si pesa la mattina. Il tedesco ha
   preso la stessa strada con "du" per la stessa ragione — la nota sta in
   alto in ../de-DE/comum.ts.

   ⚠️ E IL FEMMINILE È LA FORMA PREDEFINITA, come nelle altre lingue
   romanze del catalogo: chi legge questa app è in stragrande maggioranza
   una donna in trattamento. Dove l'accordo si vede ("sei arrivata",
   "sazia"), esce al femminile. Dove si può scrivere senza accordo, si
   scrive senza — non con la schwa né con l'asterisco, che i lettori di
   schermo pronunciano male. È la stessa regola del punto mediano
   francese, annotata in ../fr-FR/cadastro.ts.
   ============================================================ */

/* ⚠️ LA « D » EUFONICA. Davanti a una parola che comincia per « e », la
   congiunzione diventa « ed »: « ricetta ed esami », non « ricetta e
   esami ». Davanti alle altre vocali l'uso moderno la lascia cadere. */
export const ed = (s: string) => (/^[eèé]/i.test(s) ? 'ed' : 'e');

export const comum = {
  /* ⚠️ LA MINUSCOLA IN MEZZO ALLA FRASE È REGOLA DI LINGUA. In italiano
     vale come in portoghese: il nome comune perde la maiuscola quando
     entra dentro una frase. È il tedesco l'eccezione dei sei, e lì questa
     funzione restituisce quello che riceve. */
  noMeio: (s: string) => s.toLowerCase(),

  /* ⚠️ LE VIRGOLETTE SONO DI OGNI LINGUA. L'italiano scritto usa le
     caporali «» per il discorso riportato — è la forma della stampa e dei
     quotidiani — e non le virgolette inglesi. A differenza del francese,
     NON vuole lo spazio fine all'interno: si scrive «così», attaccato.

     ⚠️ E VIVE QUI perché la citazione non è di una schermata: è la nota
     della settimana, il sintomo che la persona ha scritto, l'appunto
     della visita. */
  citacao: (texto: string) => `«${texto}»`,

  /* ⚠️ "E" DIVENTA "ED" DAVANTI A VOCALE — "pane ed acqua". La regola
     moderna la limita alla vocale uguale ("ed è", "ed ecco"), e negli
     altri casi "e" resta. Qui l'ultimo elemento è un nome di sintomo o di
     argomento che non conosciamo in anticipo, e una funzione che
     indovinasse la vocale sbaglierebbe in silenzio: resta "e", che non è
     mai scorretto. */
  lista: (itens: string[], mostrar = Infinity) => {
    if (!itens.length) return '';
    if (itens.length === 1) return itens[0];
    if (itens.length <= mostrar) {
      return `${itens.slice(0, -1).join(', ')} ${ed(itens[itens.length - 1])} ${itens[itens.length - 1]}`;
    }
    return `${itens.slice(0, mostrar).join(', ')} e altri ${itens.length - mostrar}`;
  },

  /* ============================================================
     I NOMI DELLE QUATTRO SCHEDE

     ⚠️ La scheda del Percorso è quella delle persone, non quella dei
     dati: è il pannello di chi ha una clinica e la porta d'ingresso di
     chi non ce l'ha ancora. Per questo non si chiama "Team".
     ============================================================ */
  abas: {
    home: 'Home',
    jornada: 'Percorso',
    cuidado: 'Cura',
    insights: 'Insight',
  },
};
