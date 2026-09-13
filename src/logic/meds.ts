/* Catálogo de medicamentos — agnóstico (qualquer caneta GLP-1). Porta verbatim. */
export type Med = {
  label: string; mol: string; cad: 'weekly' | 'daily';
  doses: number[]; unit: string; hl: number; maker: string;
  /** dias de validade depois de aberta — ver o bloco sobre `shelf` abaixo */
  shelf: number;
};

/* ============================================================
   VALIDADE DEPOIS DE ABERTA (`shelf`)

   Cada caneta tem um prazo próprio de uso depois da primeira aplicação, e
   ele NÃO é derivável de nada que já esteja aqui: não segue a molécula,
   não segue a cadência, não segue o fabricante. Liraglutida dura 30 dias
   nas duas canetas; semaglutida dura 56; tirzepatida, 21; dulaglutida, 14.
   Por isso é campo, e não conta.

   Antes era uma constante única (21, o número do Mounjaro) valendo para os
   sete produtos. Quem usa Ozempic via a caneta "vencer" com 35 dias de
   sobra; quem usa Trulicity via prazo onde já não havia. Num app de
   tratamento isso é as duas piores coisas ao mesmo tempo: mandar descartar
   o que está bom e autorizar o que não está.

   ⚠️ PROCEDÊNCIA — estes números vêm do que consta em bula, mas NÃO foram
   conferidos contra a bula brasileira vigente de cada produto. Antes de
   isto chegar a uma pessoa de verdade, cada linha precisa ser verificada e
   esta marca, removida. O prazo também muda com a temperatura de guarda —
   o valor aqui é o de conservação em temperatura ambiente, que é como as
   pessoas de fato usam a caneta no dia a dia.
   ============================================================ */

export const MEDS: Record<string, Med> = {
  mounjaro:  { label: 'Mounjaro',  mol: 'Tirzepatida', cad: 'weekly', doses: [2.5, 5, 7.5, 10, 12.5, 15], unit: 'mg', hl: 5,    maker: 'Lilly',         shelf: 21 },
  zepbound:  { label: 'Zepbound',  mol: 'Tirzepatida', cad: 'weekly', doses: [2.5, 5, 7.5, 10, 12.5, 15], unit: 'mg', hl: 5,    maker: 'Lilly',         shelf: 21 },
  ozempic:   { label: 'Ozempic',   mol: 'Semaglutida', cad: 'weekly', doses: [0.25, 0.5, 1, 2],           unit: 'mg', hl: 7,    maker: 'Novo Nordisk',  shelf: 56 },
  wegovy:    { label: 'Wegovy',    mol: 'Semaglutida', cad: 'weekly', doses: [0.25, 0.5, 1, 1.7, 2.4],    unit: 'mg', hl: 7,    maker: 'Novo Nordisk',  shelf: 56 },
  trulicity: { label: 'Trulicity', mol: 'Dulaglutida', cad: 'weekly', doses: [0.75, 1.5, 3, 4.5],         unit: 'mg', hl: 5,    maker: 'Lilly',         shelf: 14 },
  saxenda:   { label: 'Saxenda',   mol: 'Liraglutida', cad: 'daily',  doses: [0.6, 1.2, 1.8, 2.4, 3],     unit: 'mg', hl: 0.55, maker: 'Novo Nordisk',  shelf: 30 },
  victoza:   { label: 'Victoza',   mol: 'Liraglutida', cad: 'daily',  doses: [0.6, 1.2, 1.8],             unit: 'mg', hl: 0.55, maker: 'Novo Nordisk',  shelf: 30 },
};

export const CADENCE_DAYS = (m: string) => (MEDS[m].cad === 'weekly' ? 7 : 1);

/** Validade da caneta aberta, em dias, para o medicamento em uso. */
export const SHELF_DAYS = (m: string) => MEDS[m]?.shelf ?? 21;
