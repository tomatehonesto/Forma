/* Catálogo de medicamentos — agnóstico. Porta verbatim. */

/* ⚠️ A FORMA MORA AQUI, e o vocabulário dela em logic/formas.

   O tipo fica neste arquivo porque em que forma um medicamento vem é fato
   DELE, do mesmo naipe de `cad`, `unit` e `shelf`. O que cada forma
   IMPLICA — se é injetável, como se chama o recipiente, que verbo usa —
   mora em formas.ts, que importa daqui. Uma direção só, sem ciclo. */
export type Forma = 'caneta' | 'frasco' | 'seringa' | 'comprimido';

export type Med = {
  label: string; mol: string; cad: 'weekly' | 'daily';
  doses: number[]; unit: string; hl: number; maker: string;
  /** dias de validade depois de aberta — ver o bloco sobre `shelf` abaixo */
  shelf: number;
  /** em que formas este medicamento existe — ver o bloco abaixo */
  formas: Forma[];
  /* ⚠️ SE É MARCA REGISTRADA, e isto existe porque o cadastro escreve "®".
     Escrever "Semaglutida manipulada®" seria o aplicativo afirmar uma
     marca que não existe, numa tela de saúde. Manipulado é categoria, não
     produto: sem dono, sem registro, sem ®. */
  marca: boolean;
};

/* ============================================================
   EM QUE FORMAS O MEDICAMENTO VEM (`formas`)

   Um array, e não um valor, porque há medicamento que vem em mais de uma:
   semaglutida manipulada sai da farmácia em frasco ou em seringa pronta,
   e quem sabe qual é quem está com ela na mão.

   É isso que decide se o cadastro PERGUNTA. Com uma forma só — que é o
   caso de toda caneta de marca — não há o que perguntar, e perguntar
   seria cobrar um toque por uma resposta que o catálogo já tem. Com duas,
   a pergunta aparece.

   A ordem importa: o primeiro item é o padrão de quem nunca respondeu.
   ============================================================ */

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

   ⚠️⚠️ ZERO QUER DIZER "NÃO SABEMOS", e não "vence hoje".

   Medicamento manipulado não tem prazo de catálogo: quem define é a
   farmácia que preparou, caso a caso, e o aplicativo não tem como
   derivá-lo de nada. Zero é a marca disso, e quem consome `shelf` tem de
   tratá-lo como ausência — calar o aviso de validade em vez de anunciar
   um vencimento que ninguém calculou.

   O prazo de um manipulado é PERGUNTADO, no registro de um recipiente
   novo, e guardado junto com o recipiente. Validade é fato do frasco, não
   do tratamento: cada frasco que chega da farmácia tem a sua.

   ⚠️ E A PERGUNTA SÓ VALE PARA INJETÁVEL. Cartela de comprimido não vence
   "depois de aberta" do jeito que uma caneta vence, então zero ali quer
   dizer "não se aplica", e não "pergunte". Quem for perguntar precisa de
   `injetavel && shelf === 0`, e não só do zero.

   ⚠️ PROCEDÊNCIA — estes números vêm do que consta em bula, mas NÃO foram
   conferidos contra a bula brasileira vigente de cada produto. Antes de
   isto chegar a uma pessoa de verdade, cada linha precisa ser verificada e
   esta marca, removida. O prazo também muda com a temperatura de guarda —
   o valor aqui é o de conservação em temperatura ambiente, que é como as
   pessoas de fato usam a caneta no dia a dia.
   ============================================================ */

export const MEDS: Record<string, Med> = {
  mounjaro:  { label: 'Mounjaro',  mol: 'Tirzepatida', cad: 'weekly', doses: [2.5, 5, 7.5, 10, 12.5, 15], unit: 'mg', hl: 5,    maker: 'Lilly',         shelf: 21, formas: ['caneta'], marca: true },
  zepbound:  { label: 'Zepbound',  mol: 'Tirzepatida', cad: 'weekly', doses: [2.5, 5, 7.5, 10, 12.5, 15], unit: 'mg', hl: 5,    maker: 'Lilly',         shelf: 21, formas: ['caneta'], marca: true },
  ozempic:   { label: 'Ozempic',   mol: 'Semaglutida', cad: 'weekly', doses: [0.25, 0.5, 1, 2],           unit: 'mg', hl: 7,    maker: 'Novo Nordisk',  shelf: 56, formas: ['caneta'], marca: true },
  wegovy:    { label: 'Wegovy',    mol: 'Semaglutida', cad: 'weekly', doses: [0.25, 0.5, 1, 1.7, 2.4],    unit: 'mg', hl: 7,    maker: 'Novo Nordisk',  shelf: 56, formas: ['caneta'], marca: true },
  trulicity: { label: 'Trulicity', mol: 'Dulaglutida', cad: 'weekly', doses: [0.75, 1.5, 3, 4.5],         unit: 'mg', hl: 5,    maker: 'Lilly',         shelf: 14, formas: ['caneta'], marca: true },
  saxenda:   { label: 'Saxenda',   mol: 'Liraglutida', cad: 'daily',  doses: [0.6, 1.2, 1.8, 2.4, 3],     unit: 'mg', hl: 0.55, maker: 'Novo Nordisk',  shelf: 30, formas: ['caneta'], marca: true },
  victoza:   { label: 'Victoza',   mol: 'Liraglutida', cad: 'daily',  doses: [0.6, 1.2, 1.8],             unit: 'mg', hl: 0.55, maker: 'Novo Nordisk',  shelf: 30, formas: ['caneta'], marca: true },

  /* ⚠️ O PRIMEIRO QUE NÃO SE INJETA.

     Semaglutida oral, um comprimido por dia. A meia-vida é a da molécula
     — a mesma que Ozempic e Wegovy já declaram —, e não um número novo:
     o que muda entre as vias é a absorção, não a eliminação.

     ⚠️ E A ESCALA DE DOSE É OUTRA ORDEM DE GRANDEZA: 3 a 14 mg, contra
     0,25 a 2,4 mg da injetável. É a mesma molécula e são números que não
     se comparam. Quem for somar doses por molécula PRECISA separar por
     via — ver `faixaDaMolecula`, em logic/formas.

     `shelf: 0` aqui quer dizer NÃO SE APLICA, e não "não sabemos":
     cartela de comprimido não vence depois de aberta do jeito que uma
     caneta vence. Quem pergunta validade exige `injetavel` antes do zero. */
  rybelsus:  { label: 'Rybelsus',  mol: 'Semaglutida', cad: 'daily',  doses: [3, 7, 14],                  unit: 'mg', hl: 7,    maker: 'Novo Nordisk',  shelf: 0,  formas: ['comprimido'], marca: true },
};

/* ============================================================
   OS MANIPULADOS — categoria, e não produto.

   Saem de farmácia de manipulação, e é por isso que quase tudo que o
   catálogo sabe de um medicamento de marca aqui não existe:

   · `doses: []` — não há escada. Quem define a dose é a receita, caso a
     caso. A tela que precisa de um número usa a faixa da molécula.
   · `shelf: 0` — não há prazo de bula. Quem define é quem preparou, e o
     aplicativo pergunta em vez de inventar.
   · `maker: '—'` e `marca: false` — não há fabricante nem registro.
     Escrever "Semaglutida manipulada®" seria afirmar uma marca que não
     existe, numa tela de saúde.

   A meia-vida é a da molécula, que é o que ela é independentemente de
   quem preparou.

   ⚠️ DUAS FORMAS, e é daqui que a pergunta do cadastro nasce: sai da
   farmácia em frasco, para aspirar com seringa, ou em seringa já
   preenchida. Quem sabe qual é quem está com ela na mão.
   ============================================================ */
MEDS['semaglutida-manipulada'] = {
  label: 'Semaglutida manipulada', mol: 'Semaglutida', cad: 'weekly', doses: [], unit: 'mg',
  hl: 7, maker: '—', shelf: 0, formas: ['frasco', 'seringa'], marca: false,
};
MEDS['tirzepatida-manipulada'] = {
  label: 'Tirzepatida manipulada', mol: 'Tirzepatida', cad: 'weekly', doses: [], unit: 'mg',
  hl: 5, maker: '—', shelf: 0, formas: ['frasco', 'seringa'], marca: false,
};

/* AINDA NÃO DEFINIDO — para quem vai começar e não sabe qual caneta.

   Não é um medicamento: é a ausência de um, com nome. Existe aqui, e não
   como `null` no perfil, porque meia-vida, cadência, escada de doses e
   validade da caneta pendem todas do id — um id ausente derrubaria as
   quinze telas que leem M(S), e um id inventado faria o app afirmar uma
   caneta que ninguém escolheu.

   A escada vazia é de propósito: não há dose a oferecer para quem não
   sabe o remédio. E o rótulo diz o que é, para que nenhuma tela acabe
   mostrando uma marca que a pessoa não escolheu.

   ⚠️ As telas de tratamento ainda não sabem lidar com este estado: quem
   ficar nele vai ver "Ainda não definido · 0 mg" onde outras pessoas veem
   a caneta delas. É menos errado do que inventar uma, e é o próximo
   pedaço a fazer. */
MEDS.indefinido = {
  label: 'Ainda não definido', mol: '—', cad: 'weekly', doses: [], unit: 'mg',
  hl: 5, maker: '—', shelf: 21,
  /* Caneta porque é o que nove entre dez pessoas terão, e porque uma forma
     só é o que impede o cadastro de perguntar a forma de um medicamento
     que a pessoa acabou de dizer que não conhece. Sem `marca`: "Ainda não
     definido®" seria a pior frase do aplicativo. */
  formas: ['caneta'], marca: false,
};

export const CADENCE_DAYS = (m: string) => (MEDS[m]?.cad === 'daily' ? 1 : 7);

/** Validade da caneta aberta, em dias, para o medicamento em uso. */
export const SHELF_DAYS = (m: string) => MEDS[m]?.shelf ?? 21;

