import { nf } from './time';
import { numeroEnxuto } from './local';

/* ============================================================
   AS UNIDADES — métrico e imperial

   ⚠️⚠️ O PRINCÍPIO, E ELE É A PEÇA INTEIRA: guarda-se sempre em MÉTRICO, e
   converte-se só na borda de exibição.

   A lógica deste aplicativo faz conta em métrico do começo ao fim — IMC,
   limiares de platô, a meta de proteína por quilo, a de água por quilo, a
   faixa de dose por molécula. Guardar em libra significaria converter
   cada uma dessas contas e cada um desses limiares, e — o que é pior — o
   registro de peso de alguém deixaria de ser comparável com o dele mesmo
   de antes, porque metade da série estaria numa unidade e metade na
   outra.

   Aqui a conversão acontece no último instante possível: quando o número
   vira texto na tela, ou quando um controle devolve o que a pessoa
   arrastou. Entre esses dois pontos, tudo é quilo, metro, centímetro e
   mililitro.

   ⚠️ O QUE NÃO CONVERTE, e por quê:

   · DOSE em mg — medicamento é métrico no mundo inteiro. Não existe
     caneta de Mounjaro em onças.
   · PROTEÍNA e FIBRA em g — os Estados Unidos também contam macro em
     grama; o rótulo nutricional de lá é em grama.
   · EXERCÍCIO em minutos, que é minuto em todo lugar.

   ⚠️ E O SEPARADOR DECIMAL FICA COMO ESTÁ. O `nf` escreve vírgula e ponto
   de milhar à brasileira, então quem escolher imperial vai ler
   "165,6 lb". Isso é LOCALE, e não unidade — são duas coisas que parecem
   a mesma e não são. Está registrado como a costura que a peça de idioma
   fecha; conflacionar as duas aqui seria o atalho que vira defeito
   depois.
   ============================================================ */

export type Sistema = 'metrico' | 'imperial';

/* ⚠️ É FUNÇÃO, e o campo é opcional — mesmo motivo do `formaDe` em
   logic/formas: quem já usava o aplicativo antes disto não tem
   `profile.sistema`, e não vai ser levado de volta ao cadastro para
   ganhar um. Sem resposta, métrico. */
/* ⚠️ ACEITA O ESTADO OU O SISTEMA SOLTO, e a segunda forma não é
   conveniência: a prévia do plano recebe um objeto de dados montado à
   mão — ela é desenhada no cadastro, ANTES de existir perfil salvo — e
   não tem estado para oferecer. Sem esta porta, ou aquela tela montaria
   um perfil falso só para formatar um número, ou teria a própria cópia
   da conversão. */
type ComPerfil = Sistema | { profile: { sistema?: Sistema } };
export const sistemaDe = (o: ComPerfil): Sistema =>
  (typeof o === 'string' ? o : o.profile.sistema ?? 'metrico');
const imp = (o: ComPerfil) => sistemaDe(o) === 'imperial';

/* Os fatores, num lugar só. Todos são "quanto vale UMA unidade métrica na
   imperial", para a conversão ser sempre multiplicação num sentido e
   divisão no outro — dois fatores para o mesmo par é como um deles fica
   desatualizado. */
const LB_POR_KG = 2.20462;
const POL_POR_M = 39.3701;
const POL_POR_CM = 0.393701;
const OZ_POR_ML = 0.033814;
const G_POR_OZ = 28.3495;

/* ------------------------------------------------------------------ *
 * PESO
 * ------------------------------------------------------------------ */
export const pesoU = (S: ComPerfil) => (imp(S) ? 'lb' : 'kg');
/** O valor na unidade de exibição — para réguas e contadores. */
export const pesoV = (S: ComPerfil, kg: number) => (imp(S) ? kg * LB_POR_KG : kg);
/** De volta para quilo — o que se guarda. */
export const pesoKg = (S: ComPerfil, v: number) => (imp(S) ? v / LB_POR_KG : v);
export const pesoN = (S: ComPerfil, kg: number, casas = 1) => nf(pesoV(S, kg), casas);
export const pesoTxt = (S: ComPerfil, kg: number, casas = 1) => `${pesoN(S, kg, casas)} ${pesoU(S)}`;
/** Em prosa: ninguém diz "perder dez vírgula zero quilos". */
export const pesoProsa = (S: ComPerfil, kg: number) => {
  const v = pesoV(S, kg);
  return nf(v, v % 1 === 0 ? 0 : 1);
};
export const pesoProsaTxt = (S: ComPerfil, kg: number) => `${pesoProsa(S, kg)} ${pesoU(S)}`;

/* ------------------------------------------------------------------ *
 * ALTURA
 * ------------------------------------------------------------------ */
/* ⚠️ EM IMPERIAL A ALTURA É UMA RÉGUA SÓ, EM POLEGADAS, e não duas — pés
   e polegadas separados dobrariam o controle para uma resposta que se dá
   uma vez na vida. O que muda é como o número se ESCREVE: 66 aparece como
   5′6″, que é o jeito como a pessoa pensa a própria altura. */
export const alturaU = (S: ComPerfil) => (imp(S) ? 'in' : 'm');
export const alturaV = (S: ComPerfil, m: number) => (imp(S) ? Math.round(m * POL_POR_M) : m);
export const alturaM = (S: ComPerfil, v: number) => (imp(S) ? v / POL_POR_M : v);
export const pesEPol = (pol: number) => {
  const t = Math.round(pol);
  return `${Math.floor(t / 12)}′${t % 12}″`;
};
export const alturaTxt = (S: ComPerfil, m: number) =>
  (imp(S) ? pesEPol(m * POL_POR_M) : `${nf(m, 2)} m`);

/* ------------------------------------------------------------------ *
 * CIRCUNFERÊNCIA
 * ------------------------------------------------------------------ */
export const compU = (S: ComPerfil) => (imp(S) ? 'in' : 'cm');
export const compV = (S: ComPerfil, cm: number) => (imp(S) ? cm * POL_POR_CM : cm);
export const compCm = (S: ComPerfil, v: number) => (imp(S) ? v / POL_POR_CM : v);
export const compN = (S: ComPerfil, cm: number, casas = 1) => nf(compV(S, cm), casas);
export const compTxt = (S: ComPerfil, cm: number, casas = 1) => `${compN(S, cm, casas)} ${compU(S)}`;

/* ------------------------------------------------------------------ *
 * ÁGUA
 * ------------------------------------------------------------------ */
/* ⚠️ MÉTRICO MOSTRA LITRO e guarda mililitro, que é como o aplicativo
   sempre foi: o passo de 50 vive em ml, e a tela fala em L. Imperial
   mostra ONÇA LÍQUIDA inteira — 84,5 fl oz não é um número que alguém
   persiga. */
export const aguaU = (S: ComPerfil) => (imp(S) ? 'fl oz' : 'L');

/* ------------------------------------------------------------------ *
 * O PESO DE UM ALIMENTO
 * ------------------------------------------------------------------ */
/* ⚠️⚠️ PESO DE COMIDA VIRA ONÇA; NUTRIENTE CONTINUA EM GRAMA. Parece
   contradição, e é a diferença entre duas coisas que por acaso se medem
   na mesma grandeza.

   Quanto PESA um filé é conversa de gente: americano diz "a 6 oz steak",
   e "170 g" não lhe diz nada. Então "1 filé pesa perto de 120 g" vira
   "perto de 4,2 oz", que é o número que ele reconhece do açougue.

   Quanto de PROTEÍNA esse filé tem é rótulo, e o rótulo americano é em
   grama — não por gosto, por lei. O Nutrition Facts da FDA traz proteína,
   carboidrato, gordura e fibra em GRAMA e sódio em MILIGRAMA, e o peso da
   porção vem em grama entre parênteses: "1 sandwich (325g)". Meta de
   proteína lá também se fala em grama, "30 grams per meal". "0,9 oz de
   proteína" não existe em lugar nenhum, e convertê-la seria traduzir para
   um idioma que ninguém fala.

   ⚠️ E A BASE DE 100 g FICA COMO ESTÁ. Ela não é uma medida da comida, é
   a régua da tabela — o USDA publica por 100 g do mesmo jeito que a
   Unicamp. "Valores por 3,5 oz" seria uma conversão de uma coisa que
   ninguém procura assim. */
export const massaTxt = (S: ComPerfil, g: number) => (imp(S)
  ? `${nf(g / G_POR_OZ, 1)} oz`
  : `${Math.round(g)} g`);

/* AS UNIDADES POR EXTENSO, para quem está escolhendo entre os dois
   sistemas.

   ⚠️ "MÉTRICO" E "IMPERIAL" SÃO PALAVRAS DE ENCICLOPÉDIA: quem cresceu
   com uma delas raramente sabe o nome dela. O que se reconhece é a
   unidade — quilo, libra, polegada —, e é ela que decide a escolha.

   ⚠️ E A LISTA MORA AQUI porque aparece em dois lugares: a linha do
   perfil e a folha onde se troca. Escrita duas vezes, uma envelhece
   sozinha no dia em que o aplicativo passar a mostrar outra medida. */
export const unidadesDe = (sis: Sistema) => (sis === 'imperial'
  ? 'libras, pés, polegadas e onças'
  : 'quilos, metros, centímetros e litros');
export const aguaV = (S: ComPerfil, ml: number) => (imp(S) ? ml * OZ_POR_ML : ml / 1000);
export const aguaMl = (S: ComPerfil, v: number) => (imp(S) ? v / OZ_POR_ML : v * 1000);
export const aguaN = (S: ComPerfil, ml: number) => (imp(S)
  ? nf(aguaV(S, ml), 0)
  /* Uma casa decimal só quando ela existe: 1 L, 1,5 L, 0,25 L. Sem zero à
     toa no fim, como se escreve à mão. A regra mora em logic/local, com o
     resto do que sabe qual é o separador. */
  : numeroEnxuto(ml / 1000, 2));
export const aguaTxt = (S: ComPerfil, ml: number) => `${aguaN(S, ml)} ${aguaU(S)}`;

/* ------------------------------------------------------------------ *
 * AS RÉGUAS
 * ------------------------------------------------------------------ */
/* ⚠️⚠️ A FAIXA SE DECLARA EM MÉTRICO E SAI CONVERTIDA, em vez de cada
   tela escrever as duas.

   Isso preserva o que já era deliberado: o cadastro pede peso numa faixa
   de 40 a 180 — a faixa plausível de quem está começando —, e a pesagem
   numa de 30 a 250, porque ali é o registro de um número que já existe e
   um limite apertado viraria um valor que não entra. As duas continuam
   dizendo o que querem, em quilo, e a conversão é problema daqui.

   O `esp` é pixel por PASSO, e por isso ele acompanha o passo: em libra o
   passo é 0,2 (perto dos 0,1 kg que a régua métrica usa), e o número de
   traços fica parecido. Sem isso, atravessar a faixa em libra seria mais
   que o dobro de arrasto. */
export const reguaDePeso = (S: ComPerfil, kgMin: number, kgMax: number) => (imp(S)
  ? {
    min: Math.round(kgMin * LB_POR_KG), max: Math.round(kgMax * LB_POR_KG),
    passo: 0.2, tracoCada: 1, casas: 1, esp: 5, salto: 0.2, unidade: 'lb',
  }
  : {
    min: kgMin, max: kgMax,
    passo: 0.1, tracoCada: 0.5, casas: 1, esp: 5, salto: 0.1, unidade: 'kg',
  });

export const reguaDeAltura = (S: ComPerfil) => (imp(S)
  ? {
    min: 47, max: 87, passo: 1, tracoCada: 1, casas: 0, esp: 22, salto: 1,
    unidade: '', escreve: pesEPol,
  }
  : {
    min: 1.2, max: 2.2, passo: 0.01, tracoCada: 0.01, casas: 2, esp: 12, salto: 0.01,
    unidade: 'm', escreve: undefined,
  });

export const reguaDeComp = (S: ComPerfil, cmMin: number, cmMax: number) => (imp(S)
  ? {
    min: Math.round(cmMin * POL_POR_CM), max: Math.round(cmMax * POL_POR_CM),
    passo: 0.5, tracoCada: 1, casas: 1, esp: 9, salto: 0.5, unidade: 'in',
  }
  : {
    min: cmMin, max: cmMax,
    passo: 0.5, tracoCada: 1, casas: 1, esp: 9, salto: 0.5, unidade: 'cm',
  });

/* ------------------------------------------------------------------ *
 * OS RECIPIENTES DE ÁGUA
 * ------------------------------------------------------------------ */
/* ⚠️⚠️ ESTES NÃO SÃO CONVERSÃO — SÃO RECIPIENTES, e é outra coisa.

   Copo, garrafa e garrafão são 250, 500 e 1000 ml. Convertidos, dariam
   8,5, 16,9 e 33,8 fl oz — números que ninguém tem em casa e que ninguém
   soma de cabeça. O que a pessoa toca é "o copo que eu bebi", e o copo de
   lá tem outro tamanho.

   Então a tabela imperial é a dos recipientes americanos, em onças
   redondas, e o que se grava é o mililitro correspondente — que é o que
   ela de fato bebeu. */
export const RECIPIENTES_IMP: [string, number][] = [
  ['Copo', Math.round(8 / OZ_POR_ML)],
  ['Garrafa', Math.round(16 / OZ_POR_ML)],
  ['Garrafão', Math.round(32 / OZ_POR_ML)],
];
