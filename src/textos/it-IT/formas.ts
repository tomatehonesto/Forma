/* ============================================================
   LA FORMA DELLA SOMMINISTRAZIONE — il vocabolario e l'accordo · it-IT

   ⚠️ Le ragioni vivono in ../pt-BR/formas.ts. L'italiano chiede quello
   che chiede il portoghese — la penna, il flacone, la siringa — più due
   cose che nessuna delle altre quattro lingue chiede allo stesso modo.

   ⚠️⚠️ PRIMA: "UN ALTRO" NON PRENDE L'APOSTROFO, "UN'ALTRA" SÌ. È
   l'errore di ortografia più comune dell'italiano scritto, e va in una
   direzione sola: l'apostrofo appartiene al femminile, perché lì "una"
   si elide davanti a vocale. Al maschile "un" non è mai elisione, è la
   forma piena — "un'altro" non esiste. Le due forme stanno scritte per
   intero qui sotto proprio per questo: una regola derivata le
   sbaglierebbe a turno.

   ⚠️⚠️ SECONDA: LE PREPOSIZIONI SI ARTICOLANO, e non si scrivono
   staccate. "in + la" fa "nella", "di + il" fa "del". Scrivere "in la
   penna" o "di il flacone" non è formale: è sbagliato. Qui è peggio che
   in spagnolo, dove solo "de + el" si contrae e "en" resta intero: in
   italiano si contraggono tutte e due, e in entrambi i generi.

   ⚠️ E C'È UNA TERZA FORMA CHE OGGI NON SERVE. Davanti a s+consonante,
   z, gn, ps, x e y il maschile prende "lo", non "il" — e con la
   preposizione fa "nello" e "dello". Nessuno dei quattro contenitori di
   oggi comincia così ("flacone", "blister"), e per questo le funzioni
   qui sotto conoscono due casi e non tre. Il giorno in cui entra uno
   "spray" o uno "stick", questo file sbaglia in silenzio — è la stessa
   trappola del neutro tedesco, annotata in ../de-DE/formas.ts.

   ⚠️ LA PAROLA PER L'INIEZIONE È "PUNTURA", e non "iniezione". Le due
   sono corrette, ma non hanno lo stesso registro: "iniezione" è la
   parola del referto, "puntura" è quella che si usa parlando — "mi
   faccio la puntura". L'app parla, il referto no; per questo "iniezione"
   resta soltanto in resumo, che è scritto per chi legge il referto.

   ⚠️ E IL PLURALE DI "SIRINGA" È "SIRINGHE", con l'acca. Senza, la
   parola cambia suono. È la ragione per cui il plurale è un campo e non
   un calcolo.
   ============================================================ */

type Recipiente = 'caneta' | 'frasco' | 'seringa' | 'comprimido';

/* ⚠️ PRIVATO DI PROPOSITO. Non entra in `palavras` e non si esporta:
   l'unica porta al genere sono le funzioni qui sotto. */
const GENERO: Record<Recipiente, 'm' | 'f'> = {
  caneta: 'f', frasco: 'm', seringa: 'f', comprimido: 'm',
};

const f = (r: Recipiente) => GENERO[r] === 'f';

export const formas = {
  /* ⚠️ IL PLURALE È UN CAMPO. "Siringa" fa "siringhe" e non "siringe";
     "blister" non cambia affatto. Due eccezioni su quattro parole: non
     c'è nessun calcolo da applicare. */
  palavras: {
    caneta: { recipiente: 'penna', plural: 'penne', verbo: 'iniettare', acao: 'puntura' },
    frasco: { recipiente: 'flacone', plural: 'flaconi', verbo: 'iniettare', acao: 'puntura' },
    seringa: { recipiente: 'siringa', plural: 'siringhe', verbo: 'iniettare', acao: 'puntura' },
    comprimido: { recipiente: 'blister', plural: 'blister', verbo: 'prendere', acao: 'dose' },
  } as Record<Recipiente, { recipiente: string; plural: string; verbo: string; acao: string }>,

  concordar: (r: Recipiente, masc: string, fem: string) => (f(r) ? fem : masc),

  /* ⚠️ "nella penna", "nel flacone" — la preposizione si articola. */
  noNa: (r: Recipiente) => `${f(r) ? 'nella' : 'nel'} ${formas.palavras[r].recipiente}`,
  /* ⚠️ "della penna", "del flacone" — anche questa. */
  doDa: (r: Recipiente) => `${f(r) ? 'della' : 'del'} ${formas.palavras[r].recipiente}`,
  /** "in questa penna", "in questo flacone" — il dimostrativo resta staccato. */
  nesteNesta: (r: Recipiente) => `${f(r) ? 'in questa' : 'in questo'} ${formas.palavras[r].recipiente}`,

  /** ⚠️ "un'altra penna", "un altro flacone" — l'apostrofo è solo del
      femminile. Vedi l'avviso in alto. */
  umOutro: (r: Recipiente, maiusculo = false) => {
    const p = f(r) ? 'un’altra' : 'un altro';
    return maiusculo ? p[0].toUpperCase() + p.slice(1) : p;
  },

  /** "la penna", "il flacone". */
  oA: (r: Recipiente): string => (f(r) ? 'la' : 'il'),
};
