/* ============================================================
   OS MARCADORES QUE O LAUDO PODE TRAZER

   A chave é a mesma que o aplicativo grava em cada exame (`e.marker`), e
   as unidades são as que a folha de anotar oferece para cada um (ver
   src/logic/unidadesDeExame no aplicativo). O servidor não enxerga o
   código do aplicativo, então a lista mora aqui também — e a sonda dos
   primeiros passos confere que as duas não se separaram.

   Os nomes ao lado são como cada marcador costuma aparecer nos laudos dos
   mercados do aplicativo, para o modelo reconhecer "Fasting glucose",
   "Glycémie à jeun" ou "Nüchternglukose" como a mesma coisa.
   ============================================================ */

export const MARCADORES = {
  HbA1c: { unidades: ['%', 'mmol/mol'], nomes: 'HbA1c, hemoglobina glicada, glycated hemoglobin, A1C, hémoglobine glyquée, HbA1c (glykiertes Hämoglobin), emoglobina glicata' },
  'Glicemia jejum': { unidades: ['mg/dL', 'mmol/L', 'g/L'], nomes: 'glicemia de jejum, glicose, fasting glucose, glucosa en ayunas, glycémie à jeun, Nüchternglukose, Blutzucker nüchtern, glicemia a digiuno' },
  Insulina: { unidades: ['µUI/mL', 'pmol/L'], nomes: 'insulina, insulin, insuline, Insulin' },
  'Colesterol total': { unidades: ['mg/dL', 'mmol/L', 'g/L'], nomes: 'colesterol total, total cholesterol, cholestérol total, Gesamtcholesterin, colesterolo totale' },
  HDL: { unidades: ['mg/dL', 'mmol/L', 'g/L'], nomes: 'HDL, HDL-colesterol, HDL cholesterol, HDL-Cholesterin' },
  LDL: { unidades: ['mg/dL', 'mmol/L', 'g/L'], nomes: 'LDL, LDL-colesterol, LDL cholesterol, LDL-Cholesterin' },
  Triglicerídeos: { unidades: ['mg/dL', 'mmol/L', 'g/L'], nomes: 'triglicerídeos, triglicérides, triglycerides, triglicéridos, triglycérides, Triglyzeride, trigliceridi' },
  Creatinina: { unidades: ['mg/dL', 'µmol/L'], nomes: 'creatinina, creatinine, créatinine, Kreatinin' },
  TGO: { unidades: ['U/L'], nomes: 'TGO, AST, aspartato aminotransferase, ASAT, GOT' },
  TGP: { unidades: ['U/L'], nomes: 'TGP, ALT, alanina aminotransferase, ALAT, GPT' },
  TSH: { unidades: ['µUI/mL', 'mUI/L'], nomes: 'TSH, tireotrofina, thyroid stimulating hormone, thyréostimuline' },
  'T4 livre': { unidades: ['ng/dL', 'pmol/L'], nomes: 'T4 livre, free T4, FT4, T4 libre, freies T4, T4 libero' },
  'Vitamina D': { unidades: ['ng/mL', 'nmol/L'], nomes: 'vitamina D, 25-hidroxivitamina D, 25(OH)D, vitamin D, vitamine D, Vitamin D' },
  'Vitamina B12': { unidades: ['pg/mL', 'pmol/L'], nomes: 'vitamina B12, cobalamina, vitamin B12, vitamine B12' },
  Ferritina: { unidades: ['ng/mL', 'µg/L'], nomes: 'ferritina, ferritin, ferritine, Ferritin' },
} as const;

export type Marcador = keyof typeof MARCADORES;
export const CHAVES = Object.keys(MARCADORES) as Marcador[];
