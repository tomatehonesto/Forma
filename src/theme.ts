/* ============================================================
   Forma — design tokens (single source of truth)

   V2: extraído do Figma "Aplicativo de Caneta GLP-1" › frame Home
   (node 181:1869). Azul elétrico + lima sobre branco, tipografia
   Outfit em pesos leves.

   Procedência de cada valor:
     [figma]  lido direto do frame — não alterar sem nova referência
     [infer]  derivado por consistência; o frame não define. Substituir
              quando chegarem os frames de Jornada / Insights / Cuidado.
   ============================================================ */

export const BRAND = 'Morphi';

export type Palette = {
  bg: string; bg1: string; bg2: string; bg3: string;
  tx: string; tx2: string; tx3: string; tx4: string;
  line: string; line2: string;
  accent: string; accent2: string; accentInk: string;
  accentWeak: string; accentLine: string;
  lime: string; limeDim: string; limeInk: string; limeWeak: string;
  limePale: string; bluePale: string; teal: string; tealPale: string;
  tealBg: string; tealInk: string;
  panelFrom: string; panelMid: string; panelTo: string;
  altFrom: string; altMid: string; altTo: string;
  glass: string; glassLine: string;
  green: string; greenDim: string; blue: string; blueDim: string;
  good: string; bad: string;
  ok: string; okBg: string;
  limeSoft: string; limeSoftInk: string;
  cta: string; cta2: string; ctaInk: string; ctaWeak: string; ctaLine: string;
  water: string; waterBg: string;
  purple: string; purpleBg: string;
  amber: string; amberBg: string;
  rose: string; roseBg: string;
  gradFrom: string; gradTo: string;
  onHero: string; onHero2: string; onHeroWeak: string; onHeroLine: string;
  track: string; shadow: string; scrim: string;
  /* O VÉU DO HERO. A aurora é imagem e vive atrás de texto branco; o que
     garante a leitura é um gradiente escuro por cima dela. Esse escuro
     era o azul-noite cravado em seis lugares — e com a aurora seguindo a
     paleta, um véu azul sobre um fundo verde puxa o verde de volta para o
     azul e come metade da troca. */
  veu: string;
};

export const light: Palette = {
  // superfícies — bg é a folha branca que sobe sobre o hero  [figma]
  bg: '#F5F6FA', bg1: '#FFFFFF', bg2: '#EDF1F3', bg3: '#E5E7EA',
  // texto                                                    [figma]
  tx: '#000000', tx2: '#4D5461', tx3: '#727272', tx4: '#98A2B3',
  // divisores                                                [figma]
  line: '#E5E7EA', line2: '#EDF1F3',

  // ação — azul elétrico. accent = controles ("Registrar",
  // tab ativa), accent2 = links de seção ("Ir para metas").  [figma]
  accent: '#065CF5', accent2: '#003FEF', accentInk: '#FFFFFF',
  accentWeak: 'rgba(6,92,245,0.08)', accentLine: 'rgba(6,92,245,0.20)',

  // destaque — lima. Botão de check-in, números de streak,
  // overline "PARA HOJE", barra de proteína.                 [figma]
  lime: '#DDF62C', limeDim: '#C7DD2A', limeInk: '#0A0A0A',
  limeWeak: 'rgba(221,246,44,0.18)',

  // barras de meta diária — cada uma é um gradiente do tom
  // pálido ao saturado. Proteína lima, água azul, exercício
  // teal.                                                    [figma]
  limePale: '#F5F8DF', bluePale: '#D7DDEF',
  teal: '#15E4CB', tealPale: '#C5EAE6',

  /* ⚠️ O PAR DA MÁ NOTÍCIA QUE NÃO COBRA.

     O `cta` existe para o que é destrutivo e para o que precisa parar o
     olho. Num aplicativo de tratamento de obesidade existe uma terceira
     categoria que ele não serve: a notícia ruim que a pessoa não escolheu
     e não pode desfazer — o peso que subiu, a cintura que cresceu, a
     pressão em alta. Vermelho ali acusa, e a semana em que a balança sobe
     é a semana em que as pessoas desistem.

     O teal é a única cor viva da paleta sem juízo embutido: ela marca sem
     cobrar. Estas duas viraram token quando o mesmo par apareceu na
     segunda tela, montado à mão nas duas.

     ⚠️ E ELE NÃO SEGUE A PALETA, como o lima e o azul seguem. As cinco
     paletas trocam a cor de AÇÃO e a de ALCANÇADO, que são as duas que
     dizem quem o aplicativo é; esta aqui diz o estado de um número, e um
     estado que muda de cor conforme o gosto de quem instalou deixa de ser
     um código. O teal já era fixo para a barra de exercício, pelo mesmo
     motivo.

     ⚠️ COM UMA EXCEÇÃO, A AMORA (02/10/2026). A forte dela é este mesmo
     verde-água, e ali manter o teal fixo é o que quebra o código: a má
     notícia sairia com a cor do alcançado. Só ela troca a família
     inteira, por um azul calmo — ver `calma` em PALETAS e o fim de
     `comPaleta`. */
  tealBg: '#D5FAF6', tealInk: '#08574D',

  /* Painel de destaque — azul saturado em gradiente. Precisa ler como
     CARD, não como fundo: o app inteiro é claro, então a superfície de
     ênfase se separa por saturação, e o lima pontua os itens dentro. */
  panelFrom: '#3D7BFF', panelMid: '#065CF5', panelTo: '#0130BE',

  /* Segundo gradiente, para o Insights — azul escuro descendo até azul
     claro. Mesma família do painel da Jornada, em outro registro: aquele
     é azul vivo chapado num card, este é uma lavagem que começa quase
     noturna e termina no fundo da tela.

     A versão anterior puxava para o violeta (#2E3C9E / #161F63) e lia
     como outra marca. Agora o azul é azul em toda a rampa.

     altMid é a cor da faixa chapada onde moram campo e chips em vidro:
     branco sobre ela dá 9,9:1. */
  altFrom: '#4C77E8', altMid: '#123A9E', altTo: '#05143F',

  /* Vidro sobre fundo escuro — o mesmo tratamento da faixa de check-in
     da Home, agora nomeado para poder se repetir. */
  glass: 'rgba(255,255,255,0.13)', glassLine: 'rgba(255,255,255,0.20)',

  // legado do tema v1 — sem uso nas telas, mantidos só para
  // não quebrar o tipo Palette                               [infer]
  green: '#DDF62C', greenDim: '#C7DD2A', blue: '#065CF5', blueDim: '#003FEF',

  // estado                                                   [figma p/ bad]
  good: '#065CF5', bad: '#D51A1A',

  /* Selos das telas internas — o par de lavagens que carrega o veredito
     dentro de um card: lima para variação medida ('−7,3 kg') e verde para
     estado clínico bom ('Na referência'). São washes com tinta escura por
     cima, não cores de marca: o selo informa, não compete com o azul.  */
  ok: '#3C6B2C', okBg: '#D9EFC6',
  limeSoft: '#EFF6A6', limeSoftInk: '#4A5410',

  // atenção / destrutivo — o frame só define o vermelho do
  // indicador de piora; o resto é derivado dele.             [infer]
  cta: '#D51A1A', cta2: '#E8452B', ctaInk: '#FFFFFF',
  ctaWeak: 'rgba(213,26,26,0.08)', ctaLine: 'rgba(213,26,26,0.20)',

  // cores de dado — só "água" aparece no frame (barra azul).
  // As outras três são usadas pela timeline e pelo radar e
  // ainda não têm referência de design.                      [infer]
  water: '#065CF5', waterBg: '#EAF1FE',
  purple: '#7A5AF8', purpleBg: '#F0EDFE',
  amber: '#B58900', amberBg: '#FAF6E0',
  rose: '#E0457B', roseBg: '#FDECF2',

  // gradiente do FAB e do avatar — no frame o FAB é azul
  // chapado; mantido como gradiente sutil entre os dois azuis
  gradFrom: '#065CF5', gradTo: '#003FEF',

  // texto sobre o hero escuro (aurora)                       [figma]
  onHero: '#FFFFFF', onHero2: 'rgba(255,255,255,0.80)',
  onHeroWeak: 'rgba(255,255,255,0.10)', onHeroLine: 'rgba(255,255,255,0.20)',

  track: '#EDF1F3',
  shadow: 'rgba(0,0,0,0.05)',                              // [figma]
  scrim: 'rgba(0,0,0,0.45)',
  /* O azul-noite que já estava cravado nos gradientes do hero. */
  veu: '#030A26',
};

/* Dark — NÃO existe frame de referência. Derivado da paleta clara
   invertendo superfícies e preservando azul/lima. Trocar quando
   houver desenho. */
export const dark: Palette = {
  bg: '#0B0D12', bg1: '#141821', bg2: '#1C2029', bg3: '#262B36',
  tx: '#FFFFFF', tx2: '#C3C9D4', tx3: '#98A2B3', tx4: '#6B7280',
  line: 'rgba(255,255,255,0.09)', line2: 'rgba(255,255,255,0.14)',

  accent: '#4C8BFF', accent2: '#6BA1FF', accentInk: '#04102B',
  accentWeak: 'rgba(76,139,255,0.14)', accentLine: 'rgba(76,139,255,0.28)',

  lime: '#DDF62C', limeDim: '#C7DD2A', limeInk: '#0A0A0A',
  limeWeak: 'rgba(221,246,44,0.16)',
  limePale: '#4A5220', bluePale: '#1E2A4D', teal: '#15E4CB', tealPale: '#12463F',
  /* No escuro o fundo é véu da cor, e a tinta é a cor clareada — o mesmo
     inverso que o `okBg`/`ok` faz do lado verde. */
  tealBg: 'rgba(21,228,203,0.16)', tealInk: '#A6F5EB',
  panelFrom: '#4C8BFF', panelMid: '#1F5FE0', panelTo: '#0A2E9E',
  altFrom: '#5B84EE', altMid: '#123A9E', altTo: '#040F33',
  glass: 'rgba(255,255,255,0.11)', glassLine: 'rgba(255,255,255,0.17)',

  green: '#DDF62C', greenDim: '#C7DD2A', blue: '#4C8BFF', blueDim: '#6BA1FF',

  good: '#4C8BFF', bad: '#FF5A5A',

  ok: '#A7D98A', okBg: 'rgba(167,217,138,0.16)',
  limeSoft: 'rgba(221,246,44,0.16)', limeSoftInk: '#DDF62C',

  cta: '#FF5A5A', cta2: '#FF7A5A', ctaInk: '#2B0404',
  ctaWeak: 'rgba(255,90,90,0.16)', ctaLine: 'rgba(255,90,90,0.30)',

  water: '#4C8BFF', waterBg: 'rgba(76,139,255,0.15)',
  purple: '#9D86FF', purpleBg: 'rgba(157,134,255,0.15)',
  amber: '#E0BC4A', amberBg: 'rgba(224,188,74,0.15)',
  rose: '#F26A9B', roseBg: 'rgba(242,106,155,0.15)',

  gradFrom: '#4C8BFF', gradTo: '#065CF5',

  onHero: '#FFFFFF', onHero2: 'rgba(255,255,255,0.80)',
  onHeroWeak: 'rgba(255,255,255,0.10)', onHeroLine: 'rgba(255,255,255,0.20)',

  track: 'rgba(255,255,255,0.10)',
  shadow: 'rgba(0,0,0,0.45)',
  scrim: 'rgba(0,0,0,0.60)',
  veu: '#030A26',
};

/* Largura máxima do app.

   Isto é um app de celular. No web ele rodaria edge-to-edge, e aí a mesma
   manchete de 32px que domina uma tela de 390 vira uma linha perdida num
   hero de 1400 — o desenho some, e quem avalia a tela pelo navegador julga
   um layout que ninguém vai ver. A coluna centrada em app/_layout devolve
   ao preview a proporção do aparelho.

   430 é a largura do iPhone Pro Max, o maior telefone que o app precisa
   atender: a coluna nunca aperta um aparelho real, só segura o desktop. */
export const APP_MAX_W = 430;

export const space = { xs: 4, sm: 8, md: 12, base: 16, lg: 20, xl: 24, xxl: 32, huge: 44 };

/* Altura da tab bar sem a safe area. Mora aqui, e não em ui/TabBar, porque
   o kit precisa dela para posicionar os sheets acima da barra — e kit não
   pode importar de TabBar, que já importa do kit. */
export const TAB_BAR_H = 58;

/* ⚠️ O QUANTO A ROLAGEM DAS ABAS RESPIRA NO FIM, e ele era 120 escrito à
   mão nas quatro.

   O número vinha de um desenho em que a barra de abas ficava POR CIMA do
   conteúdo: ali os 120 eram a altura dela mais uma folga, e sem eles o
   último cartão ficava debaixo dos ícones. Hoje a barra ocupa espaço de
   layout — a rolagem termina onde ela começa —, e os 120 viraram vão
   vazio: quem descia até o fim da Home encontrava a Área médica e depois
   uma tela de nada.

   O que de fato invade a rolagem é o botão do meio, que sobe 24 px acima
   da barra e aparece 13 px dentro dela. 28 cobre isso com folga e é o
   mesmo respiro que as telas de capa já usam quando não têm rodapé. */
export const RESPIRO_ABAS = 28;

/* Raios do frame: 8 · 12 · 24 · 32 · pill. 32 é o dominante
   (cards e superfícies agrupadas).                           [figma] */
/* 18 entra entre md e lg como o raio de CARD das telas internas: elas são
   listas densas de cartões pequenos, e 24 num card de 60px de altura come a
   própria caixa. As telas de aba seguem em lg/xl — lá o card é grande e o
   raio maior é o que dá o ar de superfície agrupada.                [figma] */
export const radius = { sm: 8, md: 12, card: 18, lg: 24, xl: 32, pill: 999 };

/* Outfit em quatro pesos. O frame usa 300 como peso mais frequente —
   o app v1 era 700/800, então o conjunto fica visivelmente mais leve. */
export const font = {
  display: 'Outfit_600SemiBold',
  displayX: 'Outfit_600SemiBold',
  bold: 'Outfit_600SemiBold',
  semi: 'Outfit_500Medium',
  medDisplay: 'Outfit_400Regular',
  body: 'Outfit_400Regular',
  bodyMed: 'Outfit_500Medium',
  bodySemi: 'Outfit_600SemiBold',
  light: 'Outfit_300Light',
};

/* Escala tipográfica.

   O frame do Figma usa 10px em overline e 12px em legenda. Numa peça de
   apresentação isso funciona; num app de tratamento, não — a pessoa lê
   isto no ônibus, com pressa, às vezes com a vista cansada, e boa parte
   do público tem mais de 40. A escala foi subida um degrau na ponta
   pequena, mantendo a hierarquia e as proporções do frame.

   A régua era: 12 · 14 · 15 · 17 · 19 · 20 · 30 · 32 · 36

   E ainda era pequena. Vista na proporção certa — o app numa coluna de
   telefone, não esticado no navegador —, a leitura continuou apertada, e
   a escala subiu de novo, cerca de 12% em toda a extensão. O degrau maior
   ficou nas legendas: caption e note carregam quase todo o texto
   secundário do app (a data de um registro, o de-onde-para-onde de uma
   métrica, a frase que explica um campo) e eram justamente as que a vista
   cansada perdia primeiro.

   A régua agora: 13 · 16 · 17 · 19 · 21 · 23 · 40 · 44

   A ponta grande veio depois, do protótipo das telas internas: lá o
   número do hero é 44 e o corpo é 14,5, e o que dá caráter àquelas telas
   não é o tamanho do texto — é a DISTÂNCIA entre os dois. Os tamanhos de
   leitura ficaram onde estavam; subiu só o que é valor. */
export const ty = {
  /* O número do hero — "−7,3 kg" na Jornada. É o maior degrau da régua e
     não é vaidade: no protótipo das telas internas ele é 44 contra um
     corpo de 14,5, uma razão de 3×, e é dela que vem o soco daquelas
     telas. A nossa razão era 1,9× e a tela lia chapada.

     Separado de `display` porque os dois papéis divergiram: o titulão de
     uma tela interna ("Evolução", "A história") é um TÍTULO e fica em 36;
     isto aqui é um VALOR, a resposta que a pessoa abriu o app para ver, e
     ganha a ponta da escala sozinho. */
  hero: { fontFamily: font.light, fontSize: 44, lineHeight: 52 },
  /** manchete de tela — titulão das internas, slides do hero da Home */
  display: { fontFamily: font.light, fontSize: 36, lineHeight: 42 },
  /** número grande em destaque (streak) */
  h1: { fontFamily: font.display, fontSize: 36, lineHeight: 44 },
  /** título de seção — "Suas metas diárias" */
  h2: { fontFamily: font.display, fontSize: 23, lineHeight: 30 },
  /** título de card — "Ingestão de proteína" */
  title: { fontFamily: font.body, fontSize: 21, lineHeight: 28 },
  /** valor numérico — "57g", "−16,5 kg", o número do stepper */
  metric: { fontFamily: font.body, fontSize: 40, lineHeight: 48 },
  body: { fontFamily: font.body, fontSize: 19, lineHeight: 26 },
  bodyMed: { fontFamily: font.bodyMed, fontSize: 19, lineHeight: 26 },
  /** link de seção e tab ativa — "Ir para metas" */
  label: { fontFamily: font.bodyMed, fontSize: 16, lineHeight: 22 },
  /** legenda — "Faltam 33 g", "Meta: −23 kg", eixos */
  note: { fontFamily: font.light, fontSize: 17, lineHeight: 24 },
  /** sub de item de lista — "3 novas mensagens" */
  caption: { fontFamily: font.body, fontSize: 16, lineHeight: 21 },
  /* Selo — "Em ritmo saudável", "−7,3 kg", "Na referência".

     Vivia em `micro` junto com o overline, e os dois querem coisas
     opostas. O overline é um rótulo de seção em caixa alta: ele orienta e
     depois some, e ser pequeno é parte do trabalho. O selo é um VALOR —
     o veredito do tratamento, a variação da semana — e encolhê-lo esconde
     justamente o que a pessoa veio ler. Ao lado de um número de 44px, 13
     sumia.

     15 contra um corpo de 19 dá a mesma razão que o protótipo tem entre o
     selo dele e o corpo dele. */
  tag: { fontFamily: font.body, fontSize: 15, lineHeight: 20 },
  /** overline em caixa alta — "SUA ESPECIALISTA", "PARA HOJE" */
  micro: { fontFamily: font.body, fontSize: 13, lineHeight: 17 },
} as const;

/* Sombra do frame é bem mais suave que a do v1: preto a 5%. */
export const shadowCard = (p: Palette) => ({
  shadowColor: p.shadow,
  shadowOffset: { width: 0, height: 4 },
  shadowOpacity: 1,
  shadowRadius: 16,
  elevation: 2,
});

export const shadowSoft = (p: Palette) => ({
  shadowColor: p.shadow,
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 1,
  shadowRadius: 8,
  elevation: 1,
});


/* ============================================================
   AS PALETAS

   ⚠️ ERAM DUAS ESCOLHAS SOLTAS — uma cor de ação e uma de alcançado — e
   isso empurrava para a pessoa uma decisão que é de design. As duas
   juntas dão vinte e cinco combinações, e algumas delas são ruins: ação e
   alcançado próximos fazem o botão que leva a algum lugar e a marca do
   que já foi feito virarem a mesma coisa. Oferecer o erro como opção não
   é dar liberdade; é terceirizar um problema.

   Agora são cinco paletas fechadas. Cada uma é um conjunto que já foi
   olhado junto: a cor que age, a cor que celebra e a aurora do fundo.
   Quem escolhe escolhe um clima, não dois valores.

   ⚠️ E ERAM DOZE. Doze cabem numa grade de quatro por três e não cabem
   numa decisão: metade delas era vizinha de outra — oceano ao lado de
   original, menta ao lado de floresta, índigo ao lado de amora —, e
   escolher entre dois azuis parecidos é trabalho, não personalização. As
   cinco que ficaram dividem a roda inteira, e cada uma se reconhece de
   longe: azul, violeta, magenta, laranja, verde.

   ⚠️ E VOLTARAM A SER DEZ (02/10/2026), escolhidas pelo dono em cinco
   rodadas de prévia lado a lado — no claro, no escuro e sobre a aurora.
   O que mudou desde as doze não foi o número, foi a régua: cada uma passa
   na trava de contraste e sentido, e numa regra nova, a R17 — uma cor de
   base por paleta, nenhuma com o nome de cor de outra, no claro e no
   escuro. Três pares ficam perto de propósito, vistos e aprovados por ele
   (Original e Marinho, os dois azuis; Floresta e Oliva, os dois verdes;
   Camurça e Grafite, os dois neutros), e moram na trava como exceção com
   nome: a próxima paleta não herda a licença. Saíram Pitaia e Brasa, e
   quem as tinha escolhido passa para a vizinha mais próxima (ver
   `PALETA_QUE_SAIU`, abaixo). A escolha é em duas fileiras de cinco, e
   são elas que decidem a ordem (`FILEIRAS_DA_ESCOLHA`).

   O que sai daqui sai junto: a aurora, o ícone e a linha do plugin. Os
   dois geradores leem esta lista, e quem a encurtar precisa rodar
   `node scripts/gerar-aurora.mjs` e `node scripts/gerar-icones.mjs`, e
   colar o plugin.json novo em app.json.

   ⚠️ E NENHUMA ENTRA SEM PASSAR NA TRAVA (02/10/2026). O corte de doze
   para cinco foi feito no olho, por vizinhança de matiz, e o olho deixou
   passar o contraste: das sete que saíram, três quebravam a regra que a
   Original segue sem dizer — uma SÓBRIA escura que carrega branco e uma
   FORTE luminosa que carrega tinta preta. Agora ela está escrita em
   números em scripts/paletas.ts, sobre os tokens que `comPaleta` entrega,
   e os dois geradores se recusam a rodar se ela falhar:

     npx tsx --tsconfig scripts/tsconfig.json scripts/paletas.ts

   CADA PALETA TEM TRÊS PARTES

     ação        botão, link, aba ativa, painel da Jornada
     alcançado   check-in feito, meta batida, conquista
     aurora      o gradiente que é fundo da Home e do Insights

   A AURORA É IMAGEM, e por isso entra como receita e não como cor: o
   arquivo original é girado no matiz e ajustado na saturação por
   scripts/gerar-aurora.mjs, uma vez, antes da compilação. Sem isso a
   paleta trocaria tudo menos a maior superfície de cor do aplicativo —
   que é justamente a primeira coisa que alguém vê ao abrir.

   A PRIMEIRA É A DO FIGMA, com os valores exatos: quem não escolher nada
   vê o aplicativo que foi desenhado, e não uma aproximação calculada
   dele.
   ============================================================ */

const canal = (hex: string, i: number) => parseInt(hex.slice(1 + i * 2, 3 + i * 2), 16);
const hex2 = (n: number) => Math.round(Math.max(0, Math.min(255, n))).toString(16).padStart(2, '0');

/** Mistura duas cores. t=0 devolve a primeira, t=1 a segunda. */
export const mix = (a: string, b: string, t: number) =>
  `#${[0, 1, 2].map((i) => hex2(canal(a, i) + (canal(b, i) - canal(a, i)) * t)).join('')}`;

/** A mesma cor, com alfa. É como o véu e o fio da cor de ação nascem. */
export const alfa = (hex: string, a: number) =>
  `rgba(${canal(hex, 0)},${canal(hex, 1)},${canal(hex, 2)},${a})`;

/* ⚠️ ESCURECER NÃO É MISTURAR COM O AZUL DA NOITE.

   A primeira versão fazia as pontas escuras da rampa misturando a cor com
   o azul-noite do tema. Funcionava para o azul e virava lama para o
   resto: âmbar misturado com azul é cinza, porque são complementares — a
   tela de Insights ficou um borrão sem cor nenhuma.

   Multiplicar os canais em direção ao preto preserva a matiz: âmbar
   escuro continua âmbar, violeta escuro continua violeta. */
const escurecer = (hex: string, t: number) =>
  `#${[0, 1, 2].map((i) => hex2(canal(hex, i) * (1 - t))).join('')}`;

const BRANCO = '#FFFFFF';

/* O contraste do WCAG 2, o mesmo que scripts/paletas.ts mede. */
const luz = (hex: string) => {
  const lin = (i: number) => { const v = canal(hex, i) / 255; return v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; };
  return 0.2126 * lin(0) + 0.7152 * lin(1) + 0.0722 * lin(2);
};
const contraste = (a: string, b: string) => {
  const [x, y] = [luz(a), luz(b)].sort((m, n) => n - m);
  return (x + 0.05) / (y + 0.05);
};

/** A cor, levantada para o branco só o bastante para ler `minimo` sobre
    `fundo` — e intacta, se já lê. */
const levantarAte = (cor: string, fundo: string, minimo: number) => {
  for (let t = 0; t < 1; t += 0.01) {
    const c = mix(cor, BRANCO, t);
    if (contraste(c, fundo) >= minimo) return c;
  }
  return BRANCO;
};

/** A família da má notícia que não cobra: os quatro tokens que a Jornada
    lê para o ponto do veredito e para a pílula do ChangeTile. */
export type Calma = Pick<Palette, 'teal' | 'tealPale' | 'tealBg' | 'tealInk'>;

export type Paleta = {
  id: string;
  nome: string;
  /** a cor de ação, em cada modo — o resto da família sai daqui.
      `acaoClara` é a SÓBRIA: escura, carrega branco, e é superfície nos
      dois modos (botão no claro, painel, "+" e avatar em ambos).
      `acaoEscura` é a CLARA: a sóbria levantada para ser texto no escuro. */
  acaoClara: string;
  acaoEscura: string;
  /** a tinta por cima da cor de ação cheia */
  inkClaro: string;
  inkEscuro: string;
  /** a cor do alcançado — a FORTE: luminosa, brilha sobre o escuro —, e a
      tinta escura que vai por cima dela */
  alcancado: string;
  alcancadoInk: string;
  /** giro de matiz, em graus, sobre a aurora original — que é azul */
  auroraHue: number;
  /** fator de saturação da aurora: 1 mantém, abaixo de 1 lava */
  auroraSat: number;
  /** ⚠️ SÓ PARA QUEM A FORTE CAI EM CIMA DO TEAL (02/10/2026). A família
      da má notícia que não cobra, trocada inteira e nos dois modos — ver
      o fim de `comPaleta`. A trava recusa quem a trouxer sem precisar
      (R18 em scripts/paletas.ts). */
  calma?: { claro: Calma; escuro: Calma };
};

export const PALETAS: Paleta[] = [
  {
    id: 'original', nome: 'Original',
    acaoClara: '#065CF5', acaoEscura: '#4C8BFF', inkClaro: '#FFFFFF', inkEscuro: '#04102B',
    alcancado: '#DDF62C', alcancadoInk: '#0A0A0A',
    auroraHue: 0, auroraSat: 1,
  },
  {
    id: 'amora', nome: 'Amora',
    acaoClara: '#6B3BF5', acaoEscura: '#9B7BFF', inkClaro: '#FFFFFF', inkEscuro: '#150B2B',
    alcancado: '#2BE8C8', alcancadoInk: '#04211C',
    auroraHue: 12, auroraSat: 1.05,
    /* ⚠️ A AMORA NÃO USA O TEAL, E É A ÚNICA (02/10/2026).

       O dono quis a forte de sempre, o verde-água #2BE8C8 — e ele mora a
       ΔEok 1,45 do teal fixo, a cor da má notícia que não cobra. Na
       Jornada, quem escolhia a Amora via o ponto de "Acima do início" com
       a cor do ponto de "No seu ritmo", no mesmo painel; e no escuro a
       pílula do peso que subiu ficava com a cara do selo do alcançado
       (0,44 entre os fundos). O código dizia "você conseguiu" e "isto
       subiu" com uma cor só.

       Mover o teal de todo mundo foi descartado: ele é fixo justamente
       para um estado não mudar de cor conforme o gosto de quem instalou,
       e trocá-lo por causa de uma paleta mudaria o código das outras
       nove. Ele se dobra só aqui, onde mantê-lo fixo é o que quebra o
       código.

       ⚠️ AZUL, E NÃO ARDÓSIA NEM PERVINCA. Um azul calmo, matiz 245°:
       longe da água (13,9), do violeta da ação (41° de matiz), do âmbar
       do "pede conversa" e do vermelho. A ardósia foi vista e saiu: a
       pílula lia como a do "Estável", e a Jornada já recusou ausência de
       cor para notícia ruim — lê como desligado. A pervinca também: lia
       como o chip "Dose ajustada", que vive na mesma tela.

       ⚠️ NO ESCURO, A TINTA É O PRÓPRIO PONTO E O VÉU É O AZUL CHEIO. O
       véu do ponto, que é claro e pouco saturado, dava um cinza-azulado
       sobre o cartão, e com a tinta clara a pílula virava a do "Estável".
       O véu de #5CB6FD carrega cor; o ponto lê 7,2:1 sobre ele.

       O ponto lê no painel exatamente como o teal lê hoje: 3,64:1 no
       meio, 2,62 debaixo do vidro, onde a etiqueta mora. 3:1 até no alto
       do painel pedia um ponto quase branco, e ele deixava de ser cor.

       O que vem junto, porque lê o mesmo token: o terceiro tom do orbe
       (Companion e Insights), o painel "estado" da apresentação, o painel
       sem foto de cálcio e fósforo, e no escuro o traço do valor na
       régua dos exames. Visto nas duas folhas da rodada. */
    calma: {
      claro: { teal: '#9ED1FD', tealPale: '#BADEFE', tealBg: '#D3E9FD', tealInk: '#13517D' },
      escuro: { teal: '#9ED1FD', tealPale: '#264056', tealBg: 'rgba(92,182,253,0.22)', tealInk: '#9ED1FD' },
    },
  },  {
    /* Vinho com champanhe. A sóbria é escura de propósito: o vinho de 18/09
       (#9F1239) ficava a 12 do vermelho de apagar, e aqui fica a 18,6
       (R13). No escuro, a clara vira um rosa-claro — e é a vizinha mais
       perto da Telha, as duas bases vermelho-escuras. */
    id: 'vinho', nome: 'Vinho',
    acaoClara: '#830F3E', acaoEscura: '#FFA3B1', inkClaro: '#FFFFFF', inkEscuro: '#2B040F',
    alcancado: '#FDEFBA', alcancadoInk: '#231F1A',
    auroraHue: 80, auroraSat: 0.75,
  },
  {
    /* ⚠️ O LARANJA DAS DEZ (02/10/2026). Laranja vivo não carrega branco e
       mora a menos de 15 do vermelho de apagar; o que passa é o tijolo, o
       laranja queimado mais claro que ainda fica longe dele (R13). A
       Brasa (âmbar) e o Urucum (laranja-ferrugem) foram vistos e
       recusados pelo dono; o tijolo com creme ficou. No escuro, os botões
       são laranja. */
    id: 'telha', nome: 'Telha',
    acaoClara: '#852102', acaoEscura: '#FF8F4F', inkClaro: '#FFFFFF', inkEscuro: '#2B0E04',
    alcancado: '#FFE2CC', alcancadoInk: '#2A1A12',
    auroraHue: 136, auroraSat: 1,
  },
  {
    /* Verde-oliva com pêssego alaranjado. O pêssego foi escolha do dono,
       no lugar do lilás e do mel: o mel era quase o dourado da antiga
       Pitaia e fazia da Oliva uma irmã da Floresta. A aurora fica oliva —
       com o giro que a métrica dizia "certo" ela saía verde puro, e foi o
       olho que escolheu. */
    id: 'oliva', nome: 'Oliva',
    acaoClara: '#555D1C', acaoEscura: '#BBC851', inkClaro: '#FFFFFF', inkEscuro: '#191C06',
    alcancado: '#FDBA8A', alcancadoInk: '#311805',
    auroraHue: 172, auroraSat: 0.7,
  },
  {
    /* ⚠️ VERDE COM LILÁS, E NÃO COM AMARELO (02/10/2026). Com a Oliva ao
       lado, as duas eram "verde com amarelo ou laranja" em dois tons — a
       mesma ideia duas vezes, nas palavras do dono. A base fica; troca a
       forte, que se afasta do pêssego da Oliva de 11 para 16 e de 36° para
       102° de matiz. O lilás puxa para o rosa (315°) porque o lilás
       azulado ficava a 5 do gelo da Marinho. */
    id: 'floresta', nome: 'Floresta',
    acaoClara: '#15803D', acaoEscura: '#4ADE80', inkClaro: '#FFFFFF', inkEscuro: '#042B14',
    alcancado: '#E9B8FF', alcancadoInk: '#1E0F24',
    auroraHue: -124, auroraSat: 0.95,
  },
  {
    /* Azul-petróleo com rosa-coral — o oceano e o coral. O petróleo foi
       girado para longe da Original (de 223° para 209°), e a clara mora a
       8,5 do teal fixo: é a paleta que mais encosta na má notícia que não
       cobra, e ainda passa. */
    id: 'oceano', nome: 'Oceano',
    acaoClara: '#017482', acaoEscura: '#3ECCE2', inkClaro: '#FFFFFF', inkEscuro: '#04202B',
    alcancado: '#FFBAD4', alcancadoInk: '#311420',
    auroraHue: -90, auroraSat: 1,
  },
  {
    /* ⚠️ TODA EM AZUL, A PEDIDO DO DONO (02/10/2026): marinho, um azul de
       céu no escuro e azul-gelo na conquista. O marinho fechado, e não o
       petróleo da prévia, porque o petróleo encostava na Oceano (sóbrias a
       12,4 e claras a 26°); o fechado as leva a 17,5 e 34°. O preço é
       ficar perto da Original — os dois azuis do conjunto, aprovados assim
       (R17). O azul-água da referência dele não passa: é o teal da má
       notícia. */
    id: 'marinho', nome: 'Marinho',
    acaoClara: '#033B7A', acaoEscura: '#559CD4', inkClaro: '#FFFFFF', inkEscuro: '#06182B',
    alcancado: '#C3D4FD', alcancadoInk: '#151E37',
    auroraHue: -30, auroraSat: 0.6,
  },
  {
    /* O neutro quente: marrom-acinzentado com rosa antigo, a referência de
       pastel do dono. A base continua fechada o bastante para o branco — o
       pastel mora na forte e na aurora, quase sem cor. Fica da família da
       Grafite (as duas sem matiz, R17), aprovado assim. */
    id: 'camurca', nome: 'Camurça',
    acaoClara: '#655046', acaoEscura: '#BB958E', inkClaro: '#FFFFFF', inkEscuro: '#221B1A',
    alcancado: '#F6C3BB', alcancadoInk: '#221B1A',
    auroraHue: 105, auroraSat: 0.28,
  },
  {
    /* A ÚNICA SEM MATIZ. Aqui a aurora não gira: ela perde cor, e o
       alcançado fica sendo a única coisa saturada da tela — que é
       exatamente o que esta paleta quer dizer.

       ⚠️ COM AMARELO-LIMÃO, E NÃO MAIS COM O VERDE-LIMÃO DA ORIGINAL
       (02/10/2026, escolha do dono a partir de uma referência dele). As
       duas dividiam a forte, e no seletor a Grafite era "a Original de
       roupa escura". O amarelo estava livre no conjunto — a Floresta
       passou para o lilás —, e o limão (#FFEE32) é o mais aceso e o mais
       frio dos testados; o ouro e a base de carvão neutro também passavam. */
    id: 'grafite', nome: 'Grafite',
    acaoClara: '#2E3440', acaoEscura: '#B6BECC', inkClaro: '#FFFFFF', inkEscuro: '#14181F',
    alcancado: '#FFEE32', alcancadoInk: '#262100',
    auroraHue: -17, auroraSat: 0.12,
  },
];

/** ⚠️ A ESCOLHA É EM DUAS FILEIRAS DE CINCO, e elas são escritas aqui, e não
    quebradas pela tela (02/10/2026). Uma fileira que quebra sozinha deixa
    um item solto quando a conta muda; com as fileiras escritas, a undécima
    paleta não cabe até alguém decidir onde ela mora — a trava confere que
    toda paleta está numa fileira, uma vez, e que nenhuma passa de cinco. */
export const FILEIRAS_DA_ESCOLHA: string[][] = [
  ['original', 'amora', 'vinho', 'telha', 'oliva'],
  ['floresta', 'oceano', 'marinho', 'camurca', 'grafite'],
];

/** ⚠️ QUEM ESCOLHEU UMA PALETA QUE SAIU (02/10/2026) passa para a vizinha
    mais próxima, e não para a Original: a Pitaia (magenta) vira a Vinho e
    a Brasa (laranja) vira a Telha. Ver `ensureDefaults`, em logic/seed. */
export const PALETA_QUE_SAIU: Record<string, string> = { pitaia: 'vinho', brasa: 'telha' };

export const paletaDe = (id?: string) => PALETAS.find((x) => x.id === id) ?? PALETAS[0];

/* A paleta calculada fica guardada por id e modo. `useTheme` roda em toda
   tela e a cada render: sem isto, cada um deles receberia um objeto novo
   e recém-misturado, e a comparação por identidade que o React usa para
   decidir o que redesenhar pararia de valer em cima de um valor que muda
   cinco vezes por ano. */
const guardadas = new Map<string, Palette>();

export function comPaleta(p: Palette, id: string | undefined, isDark: boolean): Palette {
  const pal = paletaDe(id);
  if (pal.id === 'original') return p;

  const chave = `${pal.id}:${isDark ? 'd' : 'l'}`;
  const pronta = guardadas.get(chave);
  if (pronta) return pronta;

  const base = isDark ? pal.acaoEscura : pal.acaoClara;
  const ink = isDark ? pal.inkEscuro : pal.inkClaro;
  const alc = pal.alcancado;
  /* ⚠️ A SÓBRIA NÃO MUDA DE MODO (02/10/2026).

     No escuro, `base` é a CLARA — a cor de ação clareada para ser TEXTO
     sobre o fundo escuro: link, aba ativa, chip. O painel da Jornada, o
     "+" da barra e o avatar são o contrário disso: SUPERFÍCIES, com texto
     branco e a cor do alcançado por cima. Saindo da clara, o branco sobre
     o painel da Floresta dava 1,74:1 e o alcançado 1,26:1 — o número da
     Jornada, o "+" e a inicial do avatar sumiam em quatro das cinco
     paletas, e só no escuro, que ninguém olha na hora de escolher.

     A Original nunca teve isso porque o escuro dela foi ajustado à mão: o
     painel desce de #4C8BFF por #1F5FE0 — a luz da sóbria — até #0A2E9E,
     e o gradiente vai de #4C8BFF à própria sóbria #065CF5. Aqui é o mesmo
     desenho: o painel é a rampa do claro (a superfície é a mesma nos dois
     modos; o que muda é a página em volta dela), e o gradiente vai da
     sóbria levantada até a sóbria. Assim a R11 de scripts/paletas.ts
     herda a R1 e a R4, que o claro já confere.

     O preço está no traço: grad* também pinta a curva de área e o anel
     sobre o cartão escuro, e eles ficam mais escuros do que eram com a
     clara — exatamente como na Original. A ponta escura sobe até ler
     (abaixo), e a trava mede essa ponta (R11t). */
  const sobria = pal.acaoClara;
  /* ⚠️ E A PONTA DO GRADIENTE NO ESCURO SOBE ATÉ LER (02/10/2026, visto
     na prévia das dez). Com a sóbria pura, o "+" da barra, o avatar e o
     traço do gráfico de doses quase sumiam no cartão escuro nas paletas
     de sóbria escura — Grafite 1,42:1, Índigo 1,79, Cacau 1,85, Ameixa
     2,03. A ponta escura sobe para o branco só o bastante para dar 3:1
     sobre o cartão, que é exatamente onde a Original já está (#065CF5
     sobre o cartão dá 3,03). Quem já passava fica igual. O "+" continua
     branco por cima: a R11 confere o branco sobre a ponta clara. */
  const pontaEscura = isDark ? levantarAte(sobria, p.bg1, 3) : sobria;

  const feita: Palette = {
    ...p,

    /* ---- a cor que age ---- */
    accent: base,
    /* No claro o segundo tom é mais fundo que o primeiro; no escuro é
       mais claro — a mesma inversão que o azul do tema já fazia. */
    accent2: isDark ? mix(base, BRANCO, 0.18) : escurecer(base, 0.24),
    accentInk: ink,
    accentWeak: alfa(base, isDark ? 0.14 : 0.08),
    accentLine: alfa(base, isDark ? 0.28 : 0.2),
    /* No claro, da sóbria para baixo; no escuro, de cima para a sóbria —
       o mesmo degrau que a Original dá à mão entre os dois modos. */
    gradFrom: isDark ? mix(pontaEscura, BRANCO, 0.22) : sobria,
    gradTo: isDark ? pontaEscura : escurecer(sobria, 0.24),
    /* O painel de destaque é a rampa curta: claro em cima, cheio no meio,
       fundo embaixo. Sai da sóbria nos dois modos — ver acima. */
    panelFrom: mix(sobria, BRANCO, 0.22),
    panelMid: sobria,
    panelTo: escurecer(sobria, 0.5),
    /* A rampa longa começa quase noturna e termina no fundo da tela. */
    altFrom: mix(base, BRANCO, 0.1),
    altMid: escurecer(base, 0.58),
    altTo: escurecer(base, 0.88),
    /* A pastilha do "Inicial", no perfil: a lavagem mais pálida da cor. */
    bluePale: isDark ? escurecer(base, 0.7) : mix(base, p.bg, 0.78),
    /* O VÉU É A PRÓPRIA COR, quase preta. Assim ele escurece a aurora sem
       arrastá-la de volta para o azul — e a paleta chega até a maior
       superfície do aplicativo inteira, e não só até a imagem. */
    veu: escurecer(base, 0.93),

    /* ---- a cor do alcançado ---- */
    lime: alc,
    limeDim: escurecer(alc, 0.1),
    limeInk: pal.alcancadoInk,
    limeWeak: alfa(alc, isDark ? 0.16 : 0.18),
    /* O selo é lavagem com tinta escura por cima; no escuro é o
       contrário: véu da cor com a própria cor por tinta. */
    limeSoft: isDark ? alfa(alc, 0.16) : mix(alc, BRANCO, 0.62),
    limeSoftInk: isDark ? alc : escurecer(alc, 0.62),
    limePale: isDark ? escurecer(alc, 0.68) : mix(alc, BRANCO, 0.82),
    /* `green` é legado do tema v1 e aponta para o mesmo alcançado; segue
       junto para não ficar um verde solto no meio de uma paleta vinho. */
    green: alc,
    greenDim: escurecer(alc, 0.1),

    /* ---- a má notícia que não cobra ----

       ⚠️ O TEAL É FIXO, MENOS ONDE A FORTE É ELE (02/10/2026). A paleta
       que traz `calma` troca a família inteira — o ponto, a lavagem, a
       tinta e a pálida —, e as telas não ficam sabendo: elas leem
       `teal`, e o teal da Amora é azul. Trocar só a pílula deixaria o
       ponto do veredito com a cor da forte; trocar só o ponto, a pílula.
       A trava mede a família de quem a traz como mede o teal de todo
       mundo (R12 e R18), e recusa quem a trouxer sem precisar. */
    ...pal.calma?.[isDark ? 'escuro' : 'claro'],
  };

  guardadas.set(chave, feita);
  return feita;
}
