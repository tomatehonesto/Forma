/* ============================================================
   LE FONTI — da dove viene ogni numero dell'app · it-IT

   ⚠️ Le ragioni vivono in ../pt-BR/fontes.ts. Il titolo dell'articolo non
   si traduce e non sta qui: chi tocca il bollino andrà a cercare proprio
   quelle parole. I titoli, l'anno e l'URL stanno in logic/fontes.

   ⚠️ Qui vivono le due frasi che sono nostre: che cosa quel lavoro
   SOSTIENE dentro l'app, e il nome di chi l'ha pubblicato quando quel
   nome si dice in italiano. "Organizzazione Mondiale della Sanità" è la
   stessa istituzione che l'inglese chiama World Health Organization; il
   "New England Journal of Medicine" è un nome proprio e non cambia.
   ============================================================ */

export const fontes = {
  /* Che cosa sostiene ogni lavoro, nella lingua dell'app. */
  sustenta: {
    acompanha: 'Quello che questa app segue: proteine, movimento, acqua e sintomi',
    imc: 'Le fasce di IMC',
    plato: 'Quando il calo di solito si ferma',
    proteina: 'L’obiettivo di proteine per chilo di peso',
    ritmo: 'Il ritmo sicuro di perdita e il minimo di calorie',
    curva: 'La forma della curva: veloce all’inizio, poi più lenta',
    agua: 'L’obiettivo di acqua per chilo, e come cambia con l’età',
    fibra: 'L’obiettivo di fibre per mille chilocalorie',
    gasto: 'La stima del consumo della giornata (Mifflin-St Jeor)',
    equacao: 'La scelta di questa equazione fra quelle disponibili',
  },

  /* ⚠️ SOLO QUELLI CHE SI DICONO IN ITALIANO. Le riviste — Clinical
     Obesity, Metabolites, New England Journal of Medicine — sono nomi
     propri e restano in logic/fontes, accanto al titolo e all'URL. */
  onde: {
    harvard: 'Harvard T.H. Chan School of Public Health, su due articoli di JAMA Internal Medicine',
    oms: 'Organizzazione Mondiale della Sanità',
    nhs: 'NHS — servizio sanitario pubblico del Regno Unito',
    academy: 'Academy of Nutrition and Dietetics',
  },

  /* ⚠️ ANCHE LA SIGLA DEL BOLLINO CAMBIA. In Italia l'istituzione si
     nomina "OMS", come in portoghese e in spagnolo; in inglese la stessa
     è "WHO". Le altre sigle del bollino sono nomi propri di rivista e
     restano in logic/fontes. */
  siglaOms: 'OMS',
  siglaNhs: 'National Health Service - UK',

  /* Il titolo del lavoro dell'Academy sull'equazione del consumo: è
     l'unico dell'elenco scritto da noi, perché descrive un'analisi e non
     un articolo con un nome proprio. */
  tituloMifflin: 'Mifflin-St Jeor: equazione del dispendio energetico a riposo, nell’analisi delle evidenze dell’Academy',
};
