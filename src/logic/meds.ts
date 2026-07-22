/* Catálogo de medicamentos — agnóstico (qualquer caneta GLP-1). Porta verbatim. */
export type Med = {
  label: string; mol: string; cad: 'weekly' | 'daily';
  doses: number[]; unit: string; hl: number; maker: string;
};

export const MEDS: Record<string, Med> = {
  mounjaro:  { label: 'Mounjaro',  mol: 'Tirzepatida', cad: 'weekly', doses: [2.5, 5, 7.5, 10, 12.5, 15], unit: 'mg', hl: 5,    maker: 'Lilly' },
  zepbound:  { label: 'Zepbound',  mol: 'Tirzepatida', cad: 'weekly', doses: [2.5, 5, 7.5, 10, 12.5, 15], unit: 'mg', hl: 5,    maker: 'Lilly' },
  ozempic:   { label: 'Ozempic',   mol: 'Semaglutida', cad: 'weekly', doses: [0.25, 0.5, 1, 2],           unit: 'mg', hl: 7,    maker: 'Novo Nordisk' },
  wegovy:    { label: 'Wegovy',    mol: 'Semaglutida', cad: 'weekly', doses: [0.25, 0.5, 1, 1.7, 2.4],    unit: 'mg', hl: 7,    maker: 'Novo Nordisk' },
  trulicity: { label: 'Trulicity', mol: 'Dulaglutida', cad: 'weekly', doses: [0.75, 1.5, 3, 4.5],         unit: 'mg', hl: 5,    maker: 'Lilly' },
  saxenda:   { label: 'Saxenda',   mol: 'Liraglutida', cad: 'daily',  doses: [0.6, 1.2, 1.8, 2.4, 3],     unit: 'mg', hl: 0.55, maker: 'Novo Nordisk' },
  victoza:   { label: 'Victoza',   mol: 'Liraglutida', cad: 'daily',  doses: [0.6, 1.2, 1.8],             unit: 'mg', hl: 0.55, maker: 'Novo Nordisk' },
};

export const CADENCE_DAYS = (m: string) => (MEDS[m].cad === 'weekly' ? 7 : 1);
