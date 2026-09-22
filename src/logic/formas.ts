import { T } from '../textos';
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

/* ⚠️⚠️ A TABELA TEM DUAS METADES, E SÓ UMA DELAS É TEXTO.

   `injetavel` e `estoque` são ESTRUTURA: valem em qualquer idioma, e
   mudá-las apaga ou acende telas inteiras. Ficam aqui.

   `recipiente`, `plural`, `verbo` e `acao` são PALAVRA: mudam de idioma
   e não mudam nada do que o aplicativo faz. Moram no catálogo, em pt-BR/formas.ts e no par em inglês.

   O gênero não está em nenhuma das duas listas — ele saiu daqui de vez.
   Era o único campo que existia só para o português, e três telas o liam
   direto para escolher entre "próximo" e "próxima". Quem precisa disso
   agora chama `concordar`, que é uma pergunta que toda língua responde.

   ⚠️ É FUNÇÃO, porque lê o catálogo. Ver src/textos/README. */
export const FORMAS = (): Record<Forma, {
  /** decide se existem local de aplicação e rodízio */
  injetavel: boolean;
  /** como se chama o que guarda o medicamento */
  recipiente: string;
  /** o plural dele, que é campo e não `recipiente + 's'` */
  plural: string;
  /** o verbo da ação: "aplicar" ou "tomar" */
  verbo: string;
  /** o substantivo dela: "aplicação" ou "dose" — títulos e confirmações */
  acao: string;
  /** como o estoque se conta */
  estoque: 'doses' | 'volume' | 'unidades' | 'comprimidos';
}> => {
  const p = T.formas.palavras;
  return {
    caneta: { injetavel: true, estoque: 'doses', ...p.caneta },
    frasco: { injetavel: true, estoque: 'volume', ...p.frasco },
    seringa: { injetavel: true, estoque: 'unidades', ...p.seringa },
    comprimido: { injetavel: false, estoque: 'comprimidos', ...p.comprimido },
  };
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

/* ⚠️⚠️ AS SEIS SÃO CASCA, E ISSO É O PONTO.

   Elas continuam aqui, com a mesma assinatura, porque são dezenove
   chamadas espalhadas em oito telas e nenhuma delas precisa saber que a
   concordância mudou de casa. O corpo, esse, foi para o catálogo: é lá
   que "na caneta" vira "in the pen" sem passar por um gênero que o inglês
   não tem.

   Com elas, quem escreve a frase não tem como errar a contração — e é o
   erro mais comum de uma varredura destas, porque passa no `tsc`, passa
   na revisão de diff e só aparece na tela de quem usa a forma menos
   comum. */
export const concordar = (f: Forma, masc: string, fem: string) => T.formas.concordar(f, masc, fem);
export const noNa = (f: Forma) => T.formas.noNa(f);
export const doDa = (f: Forma) => T.formas.doDa(f);
/** "nesta caneta", "neste frasco" — o demonstrativo com a preposição. */
export const nesteNesta = (f: Forma) => T.formas.nesteNesta(f);

/* ⚠️⚠️ E "CANETA" TAMBÉM QUER DIZER O MEDICAMENTO, por metonímia — foi a
   descoberta da varredura, e ela vale mais do que a troca em si.

   Metade das menções não fala do recipiente: "os efeitos colaterais mais
   comuns da caneta", "a caneta deixa tudo mais lento", "o tratamento com
   a caneta". Trocar essas por `recipiente` daria "os efeitos colaterais
   mais comuns do frasco", que é absurdo — um frasco não causa náusea.

   Essas não se substituem: se reescrevem. E a palavra certa quase nunca
   é uma forma — é "o medicamento" quando se fala da substância, e "o
   tratamento" quando se fala do que o corpo está atravessando. As duas
   servem a caneta, frasco, seringa e comprimido sem vocabulário nenhum.

   Por isso não há função para elas aqui. Se você veio procurar uma,
   provavelmente a frase que está na sua mão é do segundo tipo. */

/** "outra caneta", "outro frasco" — o artigo que o nome sozinho não dá. */
export const umOutro = (f: Forma, maiusculo = false) => T.formas.umOutro(f, maiusculo);

/** "a caneta", "o frasco" — para frases em que o artigo definido entra. */
export const oA = (f: Forma) => T.formas.oA(f);

/** O que a forma em uso implica, em uma linha. */
export const formaAtual = (S: { profile: { med: string; forma?: Forma } }) => FORMAS()[formaDe(S)];

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
/* ============================================================
   O NOME DO PRINCÍPIO ATIVO, NA LÍNGUA DE QUEM LÊ

   ⚠️⚠️ `MEDS[x].mol` É CHAVE E RÓTULO AO MESMO TEMPO, e essa é a mesma
   família do nome de marcador de exame e do momento da refeição:
   'Tirzepatida' é o que `faixaDaMolecula` compara logo abaixo, o que sai
   no arquivo exportado, e o que aparecia no meio de frase em seis telas.

   Então a chave fica, e o nome sai daqui. O nome comum internacional tem
   grafia própria por língua — tirzepatide, tirzépatide, Tirzepatid —, e
   sem esta função um alemão lia "Tirzepatida" no meio de uma frase alemã.

   ⚠️ E ELA NÃO MEXE NA CAIXA. Quem precisa do nome no meio da frase passa
   o resultado por `T.comum.noMeio`, que é onde essa regra mora — e que no
   alemão não faz nada, porque lá todo substantivo é maiúsculo.
   ============================================================ */
export const nomeDaMolecula = (mol: string) => T.tratamento.molecula[mol] ?? mol;

export function faixaDaMolecula(mol: string, forma: Forma): { min: number; max: number } | null {
  const injetavel = FORMAS()[forma].injetavel;
  const todas = Object.values(MEDS)
    .filter((m) => m.mol === mol
      && m.doses.length
      && FORMAS()[m.formas[0]].injetavel === injetavel)
    .flatMap((m) => m.doses);
  return todas.length ? { min: Math.min(...todas), max: Math.max(...todas) } : null;
}
