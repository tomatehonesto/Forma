import { medidas } from './medidas';

/* ============================================================
   LE CONFERME — il foglio che compare dopo aver registrato · it-IT

   ⚠️ Le ragioni vivono in ../pt-BR/confirmacoes.ts. Sette registri, un
   foglio ciascuno: peso, misure, esame, appunto, pasto, allenamento e
   acqua. Tutti hanno la stessa forma — titolo, che cosa è stato
   registrato, una o due righe di contesto, e una strada.

   ⚠️ IL TITOLO DIVENTA NOTIZIA SOLO QUANDO L'OBIETTIVO SI CHIUDE.
   "Idratazione del giorno completata" a ogni bicchiere sarebbe la solita
   bugia: dire che è finita mentre manca ancora.

   ⚠️ E IL BOLLINO DELLA VARIAZIONE NON GIUDICA. Lo stesso tono vale per
   chi è salita e per chi è scesa: colorarne uno di neutro e l'altro di
   verde sarebbe l'app che dice quale dei due giorni sia stato buono.
   ============================================================ */

export const confirmacoes = {
  /* ⚠️ "NESSUN CAMBIAMENTO" E NON "−0,0". Un numero che non si è mosso non
     è variato da nessuna parte, e il segno meno davanti a uno zero
     suggerisce una perdita che non c'è stata. */
  semMudanca: 'nessun cambiamento',

  /* ---------------- peso ---------------- */
  peso: 'Peso registrato',
  pesoDesdeUltima: 'Dall’ultima pesata',
  pesoMeta: 'Obiettivo di peso',
  pesoFaltam: (quanto: string) => `mancano ${quanto}`,
  pesoAlcancada: 'raggiunto',
  /* ⚠️ IN PLATEAU LA STRADA SI CAMBIA, e non si somma: il foglio disegna
     un solo invito discreto, e due cominciano a diventare un menu. */
  pesoNotaPlato: 'Un mese con il peso nella stessa fascia. È lì che la vita di solito continua a scendere, ed è il metro a mostrarlo.',
  pesoCaminhoPlato: 'Misura anche il corpo',
  pesoCaminho: 'Vedi la curva del peso',

  /* ---------------- misure ---------------- */
  medidas: 'Misure registrate',
  cintura: medidas.corpo.cintura,
  quadril: medidas.corpo.quadril,
  braco: medidas.corpo.braco,
  coxa: medidas.corpo.coxa,
  medidasCaminho: 'Vedi l’andamento',

  /* ---------------- esame ---------------- */
  exame: 'Risultato registrato',
  /* ⚠️ PRIMA IL VERDETTO, perché è la domanda di chi ha appena scritto un
     numero di esame — e la fascia arriva insieme, perché è lei a
     sostenerlo. */
  exameFaixa: 'Valori di riferimento',
  exameNaReferencia: 'nella norma',
  exameAcima: 'sopra',
  exameAbaixo: 'sotto',
  exameDesdeAnterior: 'Dal prelievo precedente',
  examePrimeira: 'Primo prelievo di questo valore',
  examePrimeiraSub: 'il prossimo diventa già un confronto',
  exameCaminho: 'Vedi nel pannello degli esami',

  /* ---------------- appunto ---------------- */
  anotacao: 'Appunto salvato',
  anotacaoPauta: 'Nei punti da portare alla visita',
  anotacaoComDoutor: (doutor: string) => `va nel riepilogo per ${doutor}`,
  anotacaoSemDoutor: 'va nel riepilogo per la visita',
  anotacaoCaminho: 'Vedi il riepilogo per la visita',

  /* ---------------- pasto ---------------- */
  refeicao: 'Pasto registrato',
  refeicaoTexto: (agora: number, alvo: number) => `${agora} su ${alvo} g di proteine oggi`,
  refeicaoFesta: 'Obiettivo di proteine del giorno raggiunto',
  proteinaDoDia: 'Proteine del giorno',
  proteinaMeta: (alvo: number) => `obiettivo di ${alvo} g`,
  faltamGramas: (v: string) => `mancano ${v} g`,
  metaBatida: 'obiettivo raggiunto',
  refeicaoCaminho: 'Vedi l’alimentazione del giorno',

  /* ---------------- allenamento ---------------- */
  exercicio: 'Allenamento registrato',
  exercicioTexto: (tipo: string, min: string) => `${tipo} · ${min} min`,
  exercicioSemTreino: (agora: number) => `${agora} min oggi`,
  exercicioFesta: 'Obiettivo di movimento del giorno raggiunto',
  movimentoDoDia: 'Movimento del giorno',
  movimentoSub: (agora: number, alvo: number) => `${agora} su ${alvo} min`,
  faltamMinutos: (v: string) => `mancano ${v} min`,
  treinosHoje: 'Allenamenti oggi',
  exercicioCaminho: 'Vedi la settimana di movimento',

  /* ---------------- acqua ---------------- */
  agua: 'Acqua registrata',
  aguaFechada: 'Idratazione del giorno completata',
  aguaTexto: (agora: string, alvo: string) => `${agora} su ${alvo} oggi`,
  hidratacaoDoDia: 'Idratazione del giorno',
  hidratacaoMeta: (alvo: string) => `obiettivo di ${alvo}`,
  faltamAgua: (v: string) => `mancano ${v}`,
  aguaCaminho: 'Vedi l’idratazione',
};
