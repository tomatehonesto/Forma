/* Tempo — helpers determinísticos (porta verbatim do protótipo). */
export const DAY = 864e5;
export const now = () => new Date();
export const startOfDay = (d: Date | number) => { const x = new Date(d); x.setHours(0, 0, 0, 0); return x; };
export const daysAgo = (n: number) => new Date(Date.now() - n * DAY);
export const addDays = (d: Date | number, n: number) => new Date(+d + n * DAY);
export const diffDays = (a: Date | number, b: Date | number) => Math.round((+startOfDay(a) - +startOfDay(b)) / DAY);

export const WD = ['dom', 'seg', 'ter', 'qua', 'qui', 'sex', 'sáb'];
export const MO = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'];
export const MO_LONG = ['janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho', 'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'];
export const DOW_PT = ['domingo', 'segunda', 'terça', 'quarta', 'quinta', 'sexta', 'sábado'];
export const DOW_SHORT = ['dom', 'seg', 'ter', 'qua', 'qui', 'sex', 'sáb'];

export const fmtDate = (d: Date) => `${d.getDate()} ${MO[d.getMonth()]}`;
export const fmtWD = (d: Date) => WD[d.getDay()];
export const fmtTime = (d: Date) => `${d.getHours()}:${String(d.getMinutes()).padStart(2, '0')}`;
export const hm = (h: number, m: number) => `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;

export function relDay(d: Date) {
  const n = diffDays(d, now());
  if (n === 0) return 'hoje'; if (n === -1) return 'ontem'; if (n === 1) return 'amanhã';
  if (n < 0) return `há ${-n} dias`; return `em ${n} dias`;
}
export const nf = (x: number, d = 1) => x.toLocaleString('pt-BR', { minimumFractionDigits: d, maximumFractionDigits: d });
export const kg = (x: number) => nf(x, 1).replace('.', ',');
