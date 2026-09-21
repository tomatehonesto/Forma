import { MEDS, type Forma } from './meds';

export type { Forma };

/* ============================================================
   A FORMA DE APLICAÇÃO

   O aplicativo inteiro nasceu assumindo que o medicamento é uma caneta:
   são 177 menções a "caneta" em 37 arquivos, um `pen` no estado, as rotas
   /caneta e /caneta-nova. Quem usa semaglutida manipulada num frasco, ou
   semaglutida oral em comprimido, não cabe em nada disso.

   Este módulo é onde essa suposição vira um dado. Ele diz o que cada
   forma implica, e é a única fonte disso — quando a varredura da cópia
   acontecer, é para cá que as 177 menções desaguam.

   ⚠️ `injetavel` É O CAMPO QUE APAGA TELAS, e não só troca palavras.
   Local de aplicação e rodízio de locais não são detalhes de um
   comprimido: são perguntas que não existem. Uma tela que pergunta onde a
   pessoa aplicou o comprimido não está com o texto errado — está fazendo
   uma pergunta sem sentido.

   ⚠️ E O RECIPIENTE DO COMPRIMIDO É A CARTELA, não o frasco. Não é
   preciosismo: a cartela não "vence depois de aberta" do jeito que uma
   caneta vence, e é por isso que a validade que se pergunta no frasco não
   se pergunta aqui. Ver o bloco de `shelf` em meds.ts.

   Ver docs/superpowers/specs/2026-09-21-forma-de-aplicacao-design.md.
   ============================================================ */

export const FORMAS: Record<Forma, {
  /** decide se existem local de aplicação e rodízio */
  injetavel: boolean;
  /** como se chama o que guarda o medicamento */
  recipiente: string;
  /** o verbo da ação: "aplicar" ou "tomar" */
  verbo: string;
  /** o substantivo dela: "aplicação" ou "dose" — títulos e confirmações */
  acao: string;
  /** como o estoque se conta */
  estoque: 'doses' | 'volume' | 'unidades' | 'comprimidos';
}> = {
  caneta: {
    injetavel: true, recipiente: 'caneta', verbo: 'aplicar', acao: 'aplicação', estoque: 'doses',
  },
  frasco: {
    injetavel: true, recipiente: 'frasco', verbo: 'aplicar', acao: 'aplicação', estoque: 'volume',
  },
  seringa: {
    injetavel: true, recipiente: 'seringa', verbo: 'aplicar', acao: 'aplicação', estoque: 'unidades',
  },
  comprimido: {
    injetavel: false, recipiente: 'cartela', verbo: 'tomar', acao: 'dose', estoque: 'comprimidos',
  },
};

/* ⚠️⚠️ É FUNÇÃO, E NÃO UM CAMPO LIDO DIRETO — e a diferença é quem já está
   em tratamento.

   Quem instalou o aplicativo antes disto existir não tem `profile.forma`,
   e não vai ser levado de volta ao cadastro para ganhar um. Lendo por
   aqui, essa pessoa cai no que o catálogo diz do medicamento dela; e como
   as entradas de marca injetáveis são todas `['caneta']`, ela não enxerga
   diferença nenhuma. Sem migração e sem pergunta retroativa.

   O 'caneta' do fim é a terceira rede, para um id de medicamento que não
   esteja no catálogo. Ele não deveria acontecer, e se acontecer é melhor
   cair na forma de nove entre dez pessoas do que quebrar quinze telas.

   ⚠️ O PARÂMETRO É ESTRUTURAL, e não `State`. Importar `State` daqui
   faria seed → meds → formas → seed. A função precisa de dois campos, e é
   só eles que ela pede. */
export const formaDe = (S: { profile: { med: string; forma?: Forma } }): Forma =>
  S.profile.forma ?? MEDS[S.profile.med]?.formas[0] ?? 'caneta';

/** O que a forma em uso implica, em uma linha. */
export const formaAtual = (S: { profile: { med: string; forma?: Forma } }) => FORMAS[formaDe(S)];

/* ============================================================
   A FAIXA DA MOLÉCULA, para quem não tem escada.

   Um manipulado não tem degraus: quem define a dose é a receita, caso a
   caso. A tela que precisa de um número usa uma régua, e régua precisa de
   um mínimo e um máximo que não podem ser chutados.

   Então eles são DERIVADOS: o menor e o maior que existem em bula para a
   mesma molécula. É a diferença entre um limite que vem de algum lugar e
   um palpite com cara de dado.

   ⚠️⚠️ E A VIA SEPARA, o que quase virou um erro grave.

   Semaglutida injetável vai de 0,25 a 2,4 mg. Semaglutida ORAL, que é a
   mesma molécula, vai de 3 a 14 mg — mais de dez vezes. Somando as duas,
   a régua de um frasco injetável iria até 14 mg, e o aplicativo estaria
   oferecendo, num controle de dose, um número seis vezes acima da dose
   máxima daquela via.

   Por isso a função pede a FORMA, e não só a molécula: ela só soma
   medicamentos cuja via bate com a de quem perguntou. E por isso ela mora
   aqui, e não em meds.ts — quem sabe o que é via é o FORMAS.

   Devolve null quando não há nenhuma marca com aquela molécula naquela
   via — e aí quem chamou decide o que fazer, em vez de receber um zero
   fingindo ser resposta.
   ============================================================ */
export function faixaDaMolecula(mol: string, forma: Forma): { min: number; max: number } | null {
  const injetavel = FORMAS[forma].injetavel;
  const todas = Object.values(MEDS)
    .filter((m) => m.mol === mol
      && m.doses.length
      && FORMAS[m.formas[0]].injetavel === injetavel)
    .flatMap((m) => m.doses);
  return todas.length ? { min: Math.min(...todas), max: Math.max(...todas) } : null;
}
