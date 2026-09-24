/* ============================================================
   I TRAGUARDI — i percorsi, che cosa dice ogni livello e che cosa manca
   · it-IT

   ⚠️ Le ragioni vivono in ../pt-BR/conquistas.ts. Gli `id` e i gradini
   non stanno qui: sono dato, e vivono in logic/conquistas accanto al
   conto che li misura.

   ⚠️ OGNI PERCORSO PARLA IN DUE TEMPI, e non sono la stessa frase:
   `desc` dice che cosa quel livello GIÀ È, `falta` dice che cosa lo
   separa dal prossimo. Il primo è passato e si legge con orgoglio; il
   secondo è futuro e deve stare su una riga senza suonare come un
   rimprovero. "Mancano" e non "ti servono": il soggetto è la distanza,
   non la persona.

   ⚠️⚠️ E QUI L'ITALIANO CHIEDE DUE COSE CHE IL PORTOGHESE NON CHIEDE.

   PRIMA: IL PLURALE NON HA UNA REGOLA SOLA. "-o" fa "-i", "-a" fa "-e",
   "-e" fa "-i" — e una funzione che appendesse una lettera sbaglierebbe
   due volte su tre. Per questo `p` vuole sempre il plurale scritto.

   SECONDA: IL PARTICIPIO CONCORDA IN GENERE E IN NUMERO. "1 puntura
   registrata", "3 punture registrate", "1 piatto registrato", "3 piatti
   registrati" — quattro forme per lo stesso verbo. Il portoghese ne ha
   due (la "s" finale) e l'inglese nessuna, e per questo là il ternario
   era una lettera sola. Qui ogni riga sceglie la desinenza intera.
   ============================================================ */

/* ⚠️ IL PLURALE SI SCRIVE, NON SI CALCOLA. Senza un valore di default che
   funzioni, il terzo argomento è obbligatorio di fatto: è la stessa
   scelta del tedesco, dove "Blister" non cambia affatto. */
const p = (n: number, s: string, pl: string) => `${n} ${n === 1 ? s : pl}`;

export const conquistas = {
  /* Le otto famiglie, che sono le schede della schermata. */
  familias: {
    tratamento: 'Terapia',
    peso: 'Peso',
    constancia: 'Costanza',
    hidratacao: 'Idratazione',
    proteina: 'Proteine',
    movimento: 'Movimento',
    comida: 'Alimentazione',
    acompanhamento: 'Monitoraggio',
  },

  /* ---------------- terapia ---------------- */
  doses: 'Punture',
  dosesDesc: (a: number) => `${p(a, 'puntura', 'punture')} registrat${a === 1 ? 'a' : 'e'}`,
  dosesFalta: (r: number) => `Mancano ${p(r, 'puntura', 'punture')}`,

  tempo: 'Durata della terapia',
  /* Sotto l'anno conta in mesi, e da lì in poi in anni: "12 mesi" e "1
     anno" sono lo stesso tempo, e solo il secondo si festeggia. */
  tempoDesc: (a: number) => (a < 365
    ? `${a / 30} ${a === 30 ? 'mese' : 'mesi'} dalla prima dose`
    : `${a / 365} ann${a > 365 ? 'i' : 'o'} dalla prima dose`),
  tempoFalta: (r: number) => `Mancano ${p(r, 'giorno', 'giorni')}`,

  /* ⚠️ LA ROTAZIONE NON È UN ORNAMENTO: ripetere lo stesso punto provoca
     noduli, e alternare è indicazione del foglietto. È l'unico percorso
     che premia una pratica di sicurezza. */
  rodizio: 'Rotazione',
  rodizioDesc: (a: number) => `${p(a, 'zona', 'zone')} di iniezione usat${a === 1 ? 'a' : 'e'}`,
  rodizioFalta: (r: number) => `Mancano ${p(r, 'zona', 'zone')}`,

  titulacao: 'Titolazione',
  titulacaoDesc: (a: string) => `Arrivare alla dose di ${a}`,
  titulacaoFalta: (a: string) => `Prossima: ${a}`,

  /* ---------------- peso ---------------- */
  /* ⚠️ IL PESO ARRIVA GIÀ SCRITTO, nell'unità di chi legge — "4,4 lb sotto
     il peso iniziale". Vedi logic/medidas.

     ⚠️⚠️ E PER QUESTO IL TITOLO NON DICE L'UNITÀ. "Chili in meno" sopra
     un valore in libbre è lo schermo che si contraddice. Le ragioni
     stanno in ../pt-BR/conquistas.ts. */
  kg: 'Peso in meno',
  kgDesc: (peso: string) => `${peso} sotto il peso iniziale`,
  kgFalta: (peso: string) => `Mancano ${peso}`,

  /* ⚠️ LA PERCENTUALE È UN ALTRO DISCORSO, e non la ripetizione dei
     chili: il cinque per cento è il segno clinico che la letteratura
     usa, e dieci chili vogliono dire cose diverse in corpi diversi. */
  pct: 'Percentuale persa',
  pctDesc: (a: number) => `${a}% del peso iniziale`,
  pctFalta: (r: string) => `Mancano ${r} punti`,

  pesagens: 'Pesate',
  pesagensDesc: (a: number) => `${p(a, 'pesata', 'pesate')} registrat${a === 1 ? 'a' : 'e'}`,
  pesagensFalta: (r: number) => `Mancano ${p(r, 'pesata', 'pesate')}`,

  /* ---------------- costanza ---------------- */
  checkins: 'Check-in',
  checkinsDesc: (a: number) => `${p(a, 'giorno', 'giorni')} con risposta`,
  checkinsFalta: (r: number) => `Mancano ${p(r, 'giorno', 'giorni')}`,

  sequencia: 'Giorni di fila',
  sequenciaDesc: (a: number) => `${p(a, 'check-in', 'check-in')} in giorni di fila`,
  sequenciaFalta: (r: number, alvo: number) => `Mancano ${p(r, 'giorno', 'giorni')} per arrivare a ${alvo}`,

  /* ---------------- idratazione ---------------- */
  aguaDias: 'Giorni in obiettivo di acqua',
  aguaDiasDesc: (a: number) => `${p(a, 'giorno', 'giorni')} con l’acqua a posto`,
  aguaDiasFalta: (r: number) => `Mancano ${p(r, 'giorno', 'giorni')}`,

  aguaSemana: 'Settimana idratata',
  aguaSemanaDesc: (a: number) => `${p(a, 'giorno', 'giorni')} in obiettivo, nella stessa settimana`,
  aguaSemanaFalta: (r: number, alvo: number) => `Mancano ${p(r, 'giorno', 'giorni')} per arrivare a ${alvo}`,

  /* ---------------- proteine ---------------- */
  protDias: 'Giorni in obiettivo di proteine',
  protDiasDesc: (a: number) => `${p(a, 'giorno', 'giorni')} nell’obiettivo del profilo`,
  protDiasFalta: (r: number) => `Mancano ${p(r, 'giorno', 'giorni')}`,

  protSeq: 'Proteine di fila',
  protSeqDesc: (a: number) => `${p(a, 'giorno', 'giorni')} di fila in obiettivo`,
  protSeqFalta: (r: number, alvo: number) => `Mancano ${p(r, 'giorno', 'giorni')} per arrivare a ${alvo}`,

  /* ---------------- movimento ---------------- */
  treinos: 'Allenamenti',
  treinosDesc: (a: number) => `${p(a, 'sessione', 'sessioni')} registrat${a === 1 ? 'a' : 'e'}`,
  treinosFalta: (r: number) => `Mancano ${p(r, 'allenamento', 'allenamenti')}`,

  exercSemana: 'Settimana attiva',
  exercSemanaDesc: (a: number) => `${p(a, 'giorno', 'giorni')} in obiettivo di movimento, nella stessa settimana`,
  exercSemanaFalta: (r: number, alvo: number) => `Mancano ${p(r, 'giorno', 'giorni')} per arrivare a ${alvo}`,

  /* ---------------- alimentazione ---------------- */
  refeicoes: 'Pasti',
  refeicoesDesc: (a: number) => `${p(a, 'piatto', 'piatti')} registrat${a === 1 ? 'o' : 'i'}`,
  refeicoesFalta: (r: number) => `Mancano ${p(r, 'pasto', 'pasti')}`,

  favoritos: 'Piatti preferiti',
  favoritosDesc: (a: number) => `${p(a, 'piatto', 'piatti')} salvat${a === 1 ? 'o' : 'i'} da ripetere`,
  favoritosFalta: (r: number) => `Mancano ${p(r, 'piatto', 'piatti')}`,

  /* ---------------- monitoraggio ---------------- */
  medidas: 'Misure con il metro',
  medidasDesc: (a: number) => `${p(a, 'misurazione', 'misurazioni')} registrat${a === 1 ? 'a' : 'e'}`,
  medidasFalta: (r: number) => `Mancano ${p(r, 'misurazione', 'misurazioni')}`,

  /* ⚠️ NIENTE UNITÀ NEL TITOLO, per la stessa ragione del peso. */
  cintura: 'Vita',
  cinturaDesc: (comp: string) => `${comp} in meno sulla vita`,
  cinturaFalta: (comp: string) => `Mancano ${comp}`,

  exames: 'Esami',
  examesDesc: (a: number) => `${p(a, 'pannello', 'pannelli')} importat${a === 1 ? 'o' : 'i'}`,
  examesFalta: (r: number) => `Mancano ${p(r, 'esame', 'esami')}`,

  consultas: 'Visite',
  consultasDesc: (a: number) => `${p(a, 'visita', 'visite')} nello storico`,
  consultasFalta: (r: number) => `Mancano ${p(r, 'visita', 'visite')}`,

  /* Il segno sulla linea del tempo: il percorso e a che livello era. */
  marco: (titulo: string, nivel: number) => `${titulo} · livello ${nivel}`,

  /* ============================================================
     TRAGUARDI — la schermata, e il foglio del percorso
     ============================================================ */
  tela: {
    titulo: 'Traguardi',
    lead: 'Segni che escono da soli da quello che hai registrato — qui nessuno decide se te li meriti.',

    nivelDeTotal: (nivel: number, total: number) => `Livello ${nivel} di ${total}`,
    niveisTotal: (total: number) => `${total} ${total === 1 ? 'livello' : 'livelli'}`,
    trilhaCompleta: 'Percorso completo',

    todas: 'Tutti',
    checkinsNoMes: 'check-in nel mese',
    niveis: 'livelli',
    diasDeJornada: 'giorni di percorso',

    conquistadas: 'Raggiunti',
    nenhumaAinda: 'Ancora nessuno',
    nenhumaAindaTexto: 'Quelli che stanno arrivando compaiono qui sotto.',
    ossoDaRegra: 'I livelli escono dai tuoi registri. Se un registro sparisce, sparisce con lui anche il livello che aveva chiuso.',
    aCaminho: 'In arrivo',
  },
};
