import React from 'react';
import { View, Pressable } from 'react-native';
import Svg, { Circle, G, Path } from 'react-native-svg';
import { useTheme } from './useTheme';

/* ============================================================
   A SILHUETA DOS SEIS LOCAIS

   Duas telas desenham o mesmo corpo e querem coisas diferentes dele: o
   formulário pede para ESCOLHER onde aplicar, e a tela de aplicações
   mostra o RODÍZIO — quais locais descansaram e qual é a vez.

   Por isso o componente não sabe o que as cores querem dizer. Ele recebe
   um tom por zona e desenha; quem interpreta é a tela, porque o
   significado é diferente nas duas.

   DE BONECO DE PLACA PARA GENTE. A primeira versão era um círculo e cinco
   retângulos arredondados — cabeça, tronco, dois braços, duas pernas —,
   e o resultado parecia peça de brinquedo. Num app em que a pessoa vai
   apontar onde enfiar uma agulha no próprio corpo, o desenho ser um
   boneco não é neutro: ele empurra a cena para longe do corpo dela.

   Agora é um contorno com ombro, cintura e quadril, desenhado em curvas.
   Só METADE foi escrita à mão: a outra vem espelhada, o que garante
   simetria exata e corta pela metade o que há para errar.

   E continua ESQUEMÁTICO de propósito. O alvo não é anatomia — é
   reconhecer seis áreas de relance. Mais detalhe daqui para frente
   competiria com as zonas, que são o assunto.

   O DESENHO NÃO RECEBE O TOQUE. Cada zona já foi um <Rect onPress>, e no
   navegador isso não funciona: o react-native-svg traduz o onPress em
   props de responder do React Native, que o DOM não conhece — seis erros
   de console a cada render e nenhum toque funcionando. O SVG é só
   desenho, e os Pressable ficam por cima, nas mesmas coordenadas.
   ============================================================ */

export type Zona = { id: string; x: number; y: number; w: number; h: number; r: number };

/* As seis áreas, nas coordenadas do corpo novo: braços na altura do
   deltoide, abdômen dos dois lados do umbigo, coxas na frente. */
export const ZONAS: Zona[] = [
  { id: 'braco-e', x: 19, y: 50, w: 14, h: 21, r: 7 },
  { id: 'braco-d', x: 79, y: 50, w: 14, h: 21, r: 7 },
  { id: 'abd-d', x: 42, y: 62, w: 13, h: 19, r: 6 },
  { id: 'abd-e', x: 57, y: 62, w: 13, h: 19, r: 6 },
  { id: 'coxa-d', x: 42, y: 106, w: 12, h: 26, r: 6 },
  { id: 'coxa-e', x: 58, y: 106, w: 12, h: 26, r: 6 },
];

/* A METADE ESQUERDA, da base do pescoço ao pé. Ombro, deltoide, cintura,
   quadril e a perna inteira num traço só: separar tronco de perna
   deixaria uma emenda visível justo na virilha. */
const METADE = 'M50,28 C45,29 40,32 37,37 C39,43 40,48 41,53 C42,63 44,71 45,79 '
  + 'C43,85 41,89 41,94 C40,106 39,118 39,131 C39,143 40,156 41,167 '
  + 'L50,168 C50,151 51,133 52,119 C53,111 54,106 55,102 L56,102 L56,28 Z';

/* O braço, separado porque ele se desprende do tronco: desenhado junto,
   a axila virava um vinco em vez de um vão. */
const BRACO = 'M38,39 C32,42 27,47 25,54 C23,62 21,72 20,81 C19,87 18,92 18,96 '
  + 'C18,99 22,99 23,96 C25,88 27,78 29,68 C31,59 34,52 40,49 Z';

export type TomDaZona = { fill: string; stroke: string; opacidade?: number; tracejada?: boolean };

export function Corpo({ tons, onEscolher, escala = 1 }: {
  /** o tom de cada zona, por id; quem decide o que a cor diz é a tela */
  tons: Record<string, TomDaZona>;
  /** só quando o corpo é um seletor */
  onEscolher?: (id: string) => void;
  /** 1 desenha 112×176; 0.75 encolhe tudo junto */
  escala?: number;
}) {
  const { c } = useTheme();
  /* A silhueta fica no tom mais claro da escala e as zonas recebem cor:
     assim o que é uma ÁREA se separa do que é só contorno. Zona e corpo
     no mesmo cinza deixava as seis invisíveis, e o mapa virava desenho. */
  const corpo = c.bg2;
  const L = 112 * escala;
  const A = 176 * escala;

  return (
    <View style={{ width: L, height: A }}>
      <Svg width={L} height={A} viewBox="0 0 112 176">
        <Circle cx={56} cy={15} r={11.5} fill={corpo} />
        <Path d={METADE} fill={corpo} />
        <Path d={BRACO} fill={corpo} />
        {/* A outra metade é a mesma, espelhada no eixo do corpo. */}
        <G transform="translate(112,0) scale(-1,1)">
          <Path d={METADE} fill={corpo} />
          <Path d={BRACO} fill={corpo} />
        </G>

        {ZONAS.map((z) => {
          const t = tons[z.id];
          if (!t) return null;
          return (
            <Path
              key={z.id}
              d={`M${z.x + z.r},${z.y} h${z.w - 2 * z.r} a${z.r},${z.r} 0 0 1 ${z.r},${z.r} `
                + `v${z.h - 2 * z.r} a${z.r},${z.r} 0 0 1 ${-z.r},${z.r} h${-(z.w - 2 * z.r)} `
                + `a${z.r},${z.r} 0 0 1 ${-z.r},${-z.r} v${-(z.h - 2 * z.r)} a${z.r},${z.r} 0 0 1 ${z.r},${-z.r} Z`}
              fill={t.fill}
              fillOpacity={t.opacidade}
              stroke={t.stroke}
              strokeWidth={1.5}
              strokeDasharray={t.tracejada ? '3 3' : undefined}
            />
          );
        })}
      </Svg>

      {/* A área de toque cresce 6 px para cada lado do que está pintado: a
          maior das seis zonas tem 14 por 21, que é menos da metade de um
          alvo confortável de dedo. O retângulo colorido continua do
          tamanho que é — quem cresce é só o que escuta. */}
      {onEscolher ? ZONAS.map((z) => (
        <Pressable
          key={z.id}
          onPress={() => onEscolher(z.id)}
          style={{
            position: 'absolute',
            left: (z.x - 6) * escala,
            top: (z.y - 6) * escala,
            width: (z.w + 12) * escala,
            height: (z.h + 12) * escala,
          }}
        />
      )) : null}
    </View>
  );
}
