import { medidas } from './medidas';

/* ============================================================
   DIE BESTÄTIGUNGEN — das Blatt, das nach dem Eintragen erscheint · de-DE

   ⚠️ Die Gründe stehen in ../pt-BR/confirmacoes.ts. Sieben Einträge, je
   ein Blatt: Gewicht, Maße, Befund, Notiz, Mahlzeit, Bewegung und Wasser.
   Alle haben dieselbe Form — Titel, was eingetragen wurde, eine oder zwei
   Zeilen Zusammenhang, und ein Weg.

   ⚠️ DER TITEL WIRD ERST ZUR NACHRICHT, WENN DAS ZIEL ZUGEHT. „Trinkziel
   des Tages geschafft“ bei jedem Glas wäre die übliche Lüge: zu sagen, es
   sei vorbei, während noch etwas fehlt. Solange etwas fehlt, ist der
   Titel der Eintrag — „Wasser eingetragen“.

   ⚠️ UND DAS ABZEICHEN DER VERÄNDERUNG URTEILT NICHT. Derselbe Ton gilt
   für die, deren Gewicht gestiegen ist, wie für die, deren Gewicht
   gefallen ist.
   ============================================================ */

export const confirmacoes = {
  /* ⚠️ „UNVERÄNDERT“ UND NICHT „−0,0“. Eine Zahl, die sich nicht bewegt
     hat, ist in keine Richtung gegangen, und ein Minus vor einer Null
     behauptet einen Verlust, den es nicht gab. */
  semMudanca: 'unverändert',

  /* ---------------- Gewicht ---------------- */
  peso: 'Gewicht eingetragen',
  pesoDesdeUltima: 'Seit dem letzten Wiegen',
  pesoMeta: 'Zielgewicht',
  pesoFaltam: (quanto: string) => `noch ${quanto}`,
  pesoAlcancada: 'erreicht',
  /* ⚠️ IM PLATEAU WIRD DER WEG GETAUSCHT, nicht ergänzt: das Blatt
     zeichnet nur eine einzige, zurückhaltende Einladung, und zwei fangen
     an, ein Menü zu werden. „Die Gewichtskurve ansehen“ ist genau das,
     was die Person gerade gelernt hat — eine gerade Linie —, der Tausch
     nimmt ihr also nichts. */
  pesoNotaPlato: 'Ein Monat mit dem Gewicht im selben Bereich. Genau dann fällt die Taille meist weiter, und das zeigt das Maßband.',
  pesoCaminhoPlato: 'Auch den Körper messen',
  pesoCaminho: 'Die Gewichtskurve ansehen',

  /* ---------------- Maße ---------------- */
  medidas: 'Maße eingetragen',
  cintura: medidas.corpo.cintura,
  quadril: medidas.corpo.quadril,
  braco: medidas.corpo.braco,
  coxa: medidas.corpo.coxa,
  medidasCaminho: 'Die Entwicklung ansehen',

  /* ---------------- Befund ---------------- */
  exame: 'Ergebnis eingetragen',
  /* ⚠️ DAS URTEIL ZUERST, weil das die Frage derjenigen ist, die gerade
     einen Laborwert eingetippt hat — und der Bereich kommt mit, weil er
     das Urteil trägt. Ohne hinterlegte Referenz gibt es kein Urteil, und
     die Zeile erscheint nicht. */
  exameFaixa: 'Referenzbereich',
  exameNaReferencia: 'im Bereich',
  exameAcima: 'darüber',
  exameAbaixo: 'darunter',
  exameDesdeAnterior: 'Seit der letzten Abnahme',
  examePrimeira: 'Erste Abnahme dieses Markers',
  examePrimeiraSub: 'die nächste wird schon zum Vergleich',
  exameCaminho: 'In der Befundübersicht ansehen',

  /* ---------------- Notiz ---------------- */
  anotacao: 'Notiz abgelegt',
  anotacaoPauta: 'Auf der Liste für den Termin',
  anotacaoComDoutor: (doutor: string) => `kommt in die Übersicht für ${doutor}`,
  anotacaoSemDoutor: 'kommt in die Übersicht für den Termin',
  anotacaoCaminho: 'Die Übersicht für den Termin ansehen',

  /* ---------------- Mahlzeit ---------------- */
  refeicao: 'Mahlzeit eingetragen',
  refeicaoTexto: (agora: number, alvo: number) => `${agora} von ${alvo} g Eiweiß heute`,
  refeicaoFesta: 'Eiweißziel des Tages geschafft',
  proteinaDoDia: 'Eiweiß des Tages',
  proteinaMeta: (alvo: number) => `Ziel ${alvo} g`,
  faltamGramas: (v: string) => `noch ${v} g`,
  metaBatida: 'Ziel erreicht',
  refeicaoCaminho: 'Das Essen des Tages ansehen',

  /* ---------------- Bewegung ---------------- */
  exercicio: 'Einheit eingetragen',
  exercicioTexto: (tipo: string, min: string) => `${tipo} · ${min} Min.`,
  exercicioSemTreino: (agora: number) => `${agora} Min. heute`,
  exercicioFesta: 'Bewegungsziel des Tages geschafft',
  movimentoDoDia: 'Bewegung des Tages',
  movimentoSub: (agora: number, alvo: number) => `${agora} von ${alvo} Min.`,
  faltamMinutos: (v: string) => `noch ${v} Min.`,
  treinosHoje: 'Einheiten heute',
  exercicioCaminho: 'Die Bewegungswoche ansehen',

  /* ---------------- Wasser ---------------- */
  agua: 'Wasser eingetragen',
  aguaFechada: 'Trinkziel des Tages geschafft',
  aguaTexto: (agora: string, alvo: string) => `${agora} von ${alvo} heute`,
  hidratacaoDoDia: 'Trinken heute',
  hidratacaoMeta: (alvo: string) => `Ziel ${alvo}`,
  faltamAgua: (v: string) => `noch ${v}`,
  aguaCaminho: 'Das Trinken ansehen',
};
