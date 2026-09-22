/* ============================================================
   DIE QUELLEN — woher jede Zahl der App kommt · de-DE

   ⚠️ Die Gründe stehen in ../pt-BR/fontes.ts. DER TITEL DER ARBEIT WIRD
   NICHT ÜBERSETZT und steht nicht hier: „Once-Weekly Semaglutide in
   Adults with Overweight or Obesity“ ist der Name einer veröffentlichten
   Arbeit, und ihn zu übersetzen machte sie unauffindbar — wer auf das
   Siegel tippt, sucht nach genau diesen Wörtern.

   ⚠️ HIER STEHEN DIE ZWEI SÄTZE, DIE UNS GEHÖREN: was jene Arbeit in der
   App TRÄGT, und der Name der Herausgeber, wenn er sich auf Deutsch sagen
   lässt. „Weltgesundheitsorganisation“ ist dieselbe Einrichtung, die das
   Englische World Health Organization nennt; „New England Journal of
   Medicine“ ist ein Eigenname und ändert sich nicht.
   ============================================================ */

export const fontes = {
  /* Was jede Arbeit trägt, in der Sprache der App. */
  sustenta: {
    acompanha: 'Was diese App begleitet: Eiweiß, Bewegung, Wasser und Beschwerden',
    imc: 'Die BMI-Bereiche',
    plato: 'Wann die Abnahme sich üblicherweise einpendelt',
    proteina: 'Das Eiweißziel pro Kilo Körpergewicht',
    ritmo: 'Das sichere Abnehmtempo und die Kalorienuntergrenze',
    curva: 'Die Form der Kurve: schnell am Anfang, danach flacher',
    agua: 'Das Wasserziel pro Kilo, und wie es sich mit dem Alter ändert',
    fibra: 'Das Ballaststoffziel pro tausend Kilokalorien',
    gasto: 'Die Schätzung des Tagesumsatzes (Mifflin-St Jeor)',
    equacao: 'Die Wahl dieser Formel unter den verfügbaren',
  },

  /* ⚠️ NUR DIE, DIE SICH AUF DEUTSCH SAGEN LASSEN. Die Zeitschriften —
     Clinical Obesity, Metabolites, New England Journal of Medicine — sind
     Eigennamen und stehen in logic/fontes, neben Titel und URL. */
  onde: {
    harvard: 'Harvard T.H. Chan School of Public Health, zu zwei Arbeiten aus JAMA Internal Medicine',
    oms: 'Weltgesundheitsorganisation',
    nhs: 'NHS — der öffentliche Gesundheitsdienst des Vereinigten Königreichs',
    academy: 'Academy of Nutrition and Dietetics',
  },

  /* ⚠️ DAS KÜRZEL AUF DEM SIEGEL ÄNDERT SICH MIT. Im Deutschen heißt die
     Einrichtung WHO — das englische Kürzel ist auch das deutsche, „WGO“
     sagt niemand. Es steht trotzdem hier und nicht im Code, weil es eine
     Sprachentscheidung ist und keine Konstante: Portugiesisch sagt „OMS“,
     Spanisch auch, Französisch sagt „OMS“, Deutsch sagt „WHO“. */
  siglaOms: 'WHO',
  siglaNhs: 'National Health Service - UK',

  /* Der Titel der Academy-Arbeit zur Umsatzformel: als einziger der Liste
     von uns geschrieben, weil er eine Auswertung beschreibt und keinen
     Artikel mit Eigennamen. */
  tituloMifflin: 'Mifflin-St Jeor: Formel für den Ruheenergieumsatz, in der Evidenzauswertung der Academy',
};
