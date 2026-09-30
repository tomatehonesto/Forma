import React from 'react';
import Svg, { Path, Defs, LinearGradient as SvgGrad, Stop } from 'react-native-svg';
import { useTheme } from './useTheme';

/* ============================================================
   A MARCA

   Os caminhos vêm do SVG oficial, copiados sem retoque — símbolo e
   letreiro. Antes disto havia aqui um redesenho a olho, feito a partir de
   uma imagem: acertava a silhueta e errava todo o resto, que é o tipo de
   erro que passa despercebido num app e salta impresso ao lado do
   original. Marca não se aproxima.

   `LOCKUP` é a caixa do arquivo inteiro — símbolo mais letreiro. `SIMBOLO`
   é a do símbolo sozinho, que por acaso começa na origem: o M ocupa de
   (0,0) a (533,222) dentro do mesmo desenho, então o mesmo `d` serve para
   os dois, só muda a viewBox.

   O SÍMBOLO SERVE TAMBÉM DE CONTORNO, sem preenchimento e com o traço
   apagado: é o que a abertura usa como fundo. Uma marca gigante e vazada
   atrás do conteúdo é textura que continua sendo a marca — ao contrário
   de arcos e réguas emprestados de outro app, que eram só enfeite.
   ============================================================ */

import {
  D_SIMBOLO, D_LETREIRO, LIMA_MARCA, LOCKUP, SIMBOLO, RAZAO_LOCKUP, RAZAO_SIMBOLO,
} from './marcaCaminhos';
/* os caminhos moram em ui/marcaCaminhos, que o PDF também lê */
export { D_SIMBOLO, LIMA_MARCA, RAZAO_LOCKUP, RAZAO_SIMBOLO };

/** símbolo e letreiro juntos, na proporção do arquivo */
export function Marca({ altura = 22, tinta = '#FFFFFF' }: { altura?: number; tinta?: string }) {
  return (
    <Svg width={altura * RAZAO_LOCKUP} height={altura} viewBox={LOCKUP}>
      <Path d={D_SIMBOLO} fill={LIMA_MARCA} />
      {D_LETREIRO.map((d) => <Path key={d.slice(0, 12)} d={d} fill={tinta} />)}
    </Svg>
  );
}

/** só o M, cheio — o Morphi de pé ao lado do app de saúde */
export function Simbolo({ altura = 40, cor = LIMA_MARCA }: { altura?: number; cor?: string }) {
  return (
    <Svg width={altura * RAZAO_SIMBOLO} height={altura} viewBox={SIMBOLO}>
      <Path d={D_SIMBOLO} fill={cor} />
    </Svg>
  );
}

/** só o M, vazado — o fundo da abertura */
export function MarcaContorno({
  largura, cor = LIMA_MARCA, opacidade = 0.22, traco = 2.5,
}: { largura: number; cor?: string; opacidade?: number; traco?: number }) {
  return (
    <Svg width={largura} height={largura / RAZAO_SIMBOLO} viewBox={SIMBOLO}>
      <Path
        d={D_SIMBOLO}
        fill="none"
        stroke={cor}
        strokeOpacity={opacidade}
        strokeWidth={traco}
        strokeLinejoin="round"
      />
    </Svg>
  );
}

/* ============================================================
   AS MARCAS DOS SERVIÇOS DE SAÚDE

   ⚠️ SÃO DESENHOS NOSSOS, E NÃO OS LOGOTIPOS DELES. Apple Saúde, Health
   Connect, Garmin, Fitbit e Withings são marcas registradas com regra de
   uso própria, e usar o arquivo de cada uma sem licença é o tipo de
   economia que vira carta de advogado. O que está aqui é uma peça na COR
   de cada serviço — o suficiente para a fileira ser lida de relance, e
   longe o bastante de se passar pelo original.

   A cor faz quase todo o trabalho. Num quadrado de 34 px, ninguém lê o
   desenho: lê o tom. Por isso o Apple Saúde é o rosa-vermelho, o Health
   Connect é o azul, a Garmin é o azul-escuro dela, a Fitbit é o turquesa
   e a Withings é o verde-água — e a figura em cima é genérica.

   No dia em que houver licença e os arquivos entrarem em assets/images,
   estas duas funções viram <Image> e somem.
   ============================================================ */

const CORACAO = 'M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z';

/** O coração do app de saúde do aparelho — rosa no iOS, azul no Android. */
export function CoracaoDeSaude({ tamanho = 40, de = 'ios' }: { tamanho?: number; de?: 'ios' | 'android' }) {
  const cor = de === 'ios' ? '#F43B47' : '#1A56DB';
  return (
    <Svg width={tamanho} height={tamanho} viewBox="0 0 24 24">
      <Path d={CORACAO} fill={cor} />
    </Svg>
  );
}

/* ============================================================
   A ESTRELA DA IA — preenchida, e com o degradê da aurora.

   ⚠️ NÃO ENTROU NO `Icon`, E É DE PROPÓSITO. Aquele vocabulário é de
   ícones de interface: traço aberto de 24, uma cor só, herdada de quem
   chama. Um ícone que traz o próprio degradê deixa de obedecer à tela e
   passa a carregar identidade — é marca, não ícone, e marca mora aqui.

   ⚠️ E O DEGRADÊ SAI DO TEMA, não de dois hexadecimais escritos à mão. O
   aplicativo tem cinco paletas trocáveis; uma estrela com azul cravado
   ficaria azul na Pitaia e na Brasa, sendo a única peça da tela que não
   soube que a pessoa mudou de cor.

   O desenho é a mesma faísca de quatro pontas que marca "isto saiu de
   uma análise dos seus dados" no resto do aplicativo — ver o comentário
   do carrossel da Home. Aqui ela não marca uma resposta: marca QUEM
   responde, que é o título da tela. Preenchida porque é assinatura, e
   assinatura não é contorno.
   ============================================================ */

/** A faísca do Lucide (sparkle), fechada — por isso aceita preenchimento. */
export const D_FAISCA = 'M11.017 2.814a1 1 0 0 1 1.966 0l1.051 5.558a2 2 0 0 0 1.594 1.594l5.558 1.051a1 1 0 0 1 0 1.966l-5.558 1.051a2 2 0 0 0-1.594 1.594l-1.051 5.558a1 1 0 0 1-1.966 0l-1.051-5.558a2 2 0 0 0-1.594-1.594l-5.558-1.051a1 1 0 0 1 0-1.966l5.558-1.051a2 2 0 0 0 1.594-1.594z';

/* ⚠️ O CACHO É UMA FAÍSCA SÓ, TRÊS VEZES. Desenhar três estrelas
   diferentes daria três desenhos para manter alinhados; a mesma peça
   deslocada e reduzida mantém a família por construção, e um ajuste no
   `d` vale para as três.

   A faísca está centrada em (12,12) no desenho original, então para pôr
   uma cópia com centro em (cx,cy) e escala s, a translação tem de
   desfazer o deslocamento que a escala provoca: `cx − 12s`. Errar isso
   não quebra nada — só desalinha, e desalinho de 2 px num símbolo de
   17 px é o que faz um logo parecer torto sem que ninguém saiba dizer
   por quê. */
const CACHO: { cx: number; cy: number; s: number; op: number }[] = [
  /* A grande fica BAIXA E À ESQUERDA, e as pequenas sobem para a direita.
     Cacho simétrico lê como enfeite repetido; é a assimetria que faz três
     formas iguais virarem "brilho". */
  { cx: 10, cy: 13.6, s: 0.78, op: 1 },
  { cx: 19.2, cy: 5.2, s: 0.3, op: 0.92 },
  { cx: 20.6, cy: 14.2, s: 0.19, op: 0.78 },
];

export function EstrelaIA({ size = 16 }: { size?: number }) {
  const { c } = useTheme();
  /* O id precisa ser único por instância: dois degradês com o mesmo id na
     mesma árvore fazem o segundo herdar as paradas do primeiro. */
  /* ⚠️ SÓ LETRA E NÚMERO NO id. O useId do React devolve formatos com
     dois-pontos ou aspas angulares dependendo da versão, e o url(#…) do
     react-native-svg casa o id por nome — um caractere especial faz o
     degradê simplesmente não ser encontrado, e a estrela sai preta. Na
     web funciona; no aparelho, não dá para descobrir depois. */
  const id = `ia${React.useId().replace(/[^a-zA-Z0-9]/g, '')}`;
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Defs>
        {/* ⚠️ `userSpaceOnUse`, E NÃO O PADRÃO. Sem isto, cada faísca ganha
            a rampa inteira dentro da própria caixa: a pequenininha de
            2 px vira azul-para-lima sozinha, e o cacho fica com três
            degradês brigando. Preso ao espaço do desenho, o degradê
            atravessa as três — a de baixo puxa o azul, a de cima o
            lima, e elas lêem como pedaços de uma luz só. */}
        <SvgGrad id={id} x1="0" y1="0" x2="24" y2="24" gradientUnits="userSpaceOnUse">
          <Stop offset="0" stopColor={c.accent2} />
          <Stop offset="1" stopColor={c.lime} />
        </SvgGrad>
      </Defs>
      {CACHO.map((f, i) => (
        <Path
          key={i}
          d={D_FAISCA}
          fill={`url(#${id})`}
          fillOpacity={f.op}
          transform={`translate(${f.cx - 12 * f.s} ${f.cy - 12 * f.s}) scale(${f.s})`}
        />
      ))}
    </Svg>
  );
}
