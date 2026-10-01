/* O RELÓGIO FIXO DA AVALIAÇÃO: quarta, 30/09/2026, 10h (hora local).

   O resumo da jornada escreve datas ("Hoje: 2026-09-30", "há 2 dias"), e
   os pacientes são montados em "há N dias". Com o relógio de verdade, o
   mesmo caso mudaria de texto a cada dia, e "segunda" deixaria de ser
   há 2 dias. Fixo, a entrada do modelo é a mesma em toda rodada.

   ⚠️ SÓ DURANTE A MONTAGEM. O `Date` global é trocado dentro da função e
   devolvido no fim: o executor mede tempo de resposta e prazo de cada
   caso com o relógio de verdade. */
export const AGORA = new Date(2026, 8, 30, 10, 0, 0).getTime();

export function comRelogioFixo<T>(fn: () => T): T {
  const Real = Date;
  class Fixo extends Real {
    constructor(...a: any[]) {
      if (a.length === 0) super(AGORA);
      else super(...(a as [number]));
    }
    static now() { return AGORA; }
  }
  (globalThis as any).Date = Fixo;
  try { return fn(); } finally { (globalThis as any).Date = Real; }
}
