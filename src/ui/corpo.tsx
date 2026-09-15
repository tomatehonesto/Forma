import React from 'react';
import { View, Pressable } from 'react-native';
import Svg, { G, Path, Rect } from 'react-native-svg';
import { useTheme } from './useTheme';

/* ============================================================
   A SILHUETA DOS SEIS LOCAIS

   Duas telas desenham o mesmo corpo e querem coisas diferentes dele: o
   formulário pede para ESCOLHER onde aplicar, e a tela de aplicações
   mostra o RODÍZIO — quais locais descansaram e qual é a vez.

   Por isso o componente não sabe o que as cores querem dizer. Ele recebe
   um tom por zona e desenha; quem interpreta é a tela, porque o
   significado é diferente nas duas.

   O DESENHO JÁ FOI DUAS COISAS PIORES. Começou como um círculo e cinco
   retângulos arredondados — boneco de placa de banheiro. Depois virou um
   contorno com ombro e cintura, mais gente, mas ainda um chaveiro: braços
   grudados, pernas coladas, sem mãos nem pés.

   Agora é uma figura de pé, em proporção de oito cabeças: crânio que
   afina no pescoço, trapézio descendo até o deltoide, braços AFASTADOS do
   tronco com o vão da axila aberto, mãos na altura do meio da coxa,
   cintura, quadril, joelho, panturrilha e pé. Isso importa num app em que
   a pessoa aponta onde vai enfiar a agulha no próprio corpo: quanto mais
   o desenho parece um corpo, menos ela precisa traduzir.

   METADE À MÃO, a outra espelhada em translate(200,0) scale(-1,1). Além
   de garantir simetria exata, corta pela metade o que há para errar — e
   o par de linhas que encosta no eixo passa meio ponto do centro, para
   as duas metades se sobreporem em vez de deixarem costura clara no
   antialiasing.

   DESENHADO EM 200×320 e mostrado em 120×192: a escala de dentro é maior
   que a de fora de propósito, porque mão e pé só cabem com casa decimal
   se houver espaço para eles.

   O DESENHO NÃO RECEBE O TOQUE. Cada zona já foi um <Rect onPress>, e no
   navegador isso não funciona: o react-native-svg traduz o onPress em
   props de responder do React Native, que o DOM não conhece — seis erros
   de console a cada render e nenhum toque funcionando. O SVG é só
   desenho, e os Pressable ficam por cima, nas mesmas coordenadas.
   ============================================================ */

export type Zona = {
  id: string; x: number; y: number; w: number; h: number; r: number;
  /** graus: a marca do braço precisa acompanhar a inclinação dele */
  rot?: number;
};

/* A grade interna do desenho. Tudo aqui — silhueta e zonas — é escrito
   nela, e só na hora de mostrar é que vira pixel. */
const LARGURA = 200;
const ALTURA = 320;

/* As seis áreas, em cima do corpo novo: deltoide, os dois lados do
   umbigo e a frente das coxas. */
export const ZONAS: Zona[] = [
  { id: 'braco-e', x: 53, y: 97, w: 11, h: 23, r: 5.5, rot: 12 },
  { id: 'braco-d', x: 136, y: 97, w: 11, h: 23, r: 5.5, rot: -12 },
  { id: 'abd-d', x: 80, y: 122, w: 17, h: 26, r: 8 },
  { id: 'abd-e', x: 103, y: 122, w: 17, h: 26, r: 8 },
  { id: 'coxa-d', x: 76, y: 176, w: 15, h: 34, r: 7.5 },
  { id: 'coxa-e', x: 109, y: 176, w: 15, h: 34, r: 7.5 },
];

/* A METADE ESQUERDA, do alto da cabeça ao pé e de volta pela virilha. O
   Z fecha subindo pelo eixo do corpo, que é por onde a outra metade
   encosta. Braço e tronco saem do mesmo traço: descer por fora do braço,
   contornar a mão e SUBIR por dentro até a axila é o que abre o vão
   entre braço e costela — desenhados separados, a axila virava vinco. */
const METADE = [
  'M100.5,9',
  'C91,9 85,17 85,28',           /* crânio */
  'C85,37 87,42 89,45',          /* a cabeça afinando na mandíbula */
  'C90,48 91,50 91,56',          /* pescoço */
  'C85,58 72,62 63,70',          /* clavícula: o ombro é quase reto */
  'C58,73 55,78 55,88',          /* e o deltoide é que arredonda */
  'C54,101 51,115 48,128',       /* braço, por fora */
  'C45,140 42,153 39,166',       /* antebraço */
  'C36,172 35,181 36,190',       /* dorso da mão */
  'C37,199 41,205 46,204',       /* pontas dos dedos */
  'C50,203 53,195 53,185',       /* o lado do polegar */
  'C55,180 55,173 52,167',       /* base do polegar, no punho */
  'C55,153 58,140 62,128',       /* antebraço, subindo por dentro */
  'C64,112 68,95 72,82',         /* e o braço até a axila */
  'C73,98 73,118 77,133',        /* costela até a cintura */
  'C79,143 70,152 70,163',       /* quadril */
  'C70,171 71,176 72,182',       /* coxa */
  'C74,200 78,218 79,234',       /* joelho */
  'C80,244 77,254 77,262',       /* panturrilha */
  'C78,278 83,290 85,297',       /* tornozelo */
  'C84,303 78,306 77,310',       /* o pé, virado um pouco para fora */
  'C76,314 78,316 83,316',
  'L96,316',
  'C98,316 98,310 97,306',
  'C96,303 96,300 96,298',       /* e subindo por dentro da perna */
  'C95,284 91,272 91,262',
  'C91,250 92,242 92.5,234',
  'C93,215 94,200 94,192',
  'C95,177 100.5,169 100.5,160', /* virilha */
  'Z',
].join(' ');

export type TomDaZona = { fill: string; stroke: string; opacidade?: number; tracejada?: boolean };

export function Corpo({ tons, onEscolher, escala = 1 }: {
  /** o tom de cada zona, por id; quem decide o que a cor diz é a tela */
  tons: Record<string, TomDaZona>;
  /** só quando o corpo é um seletor */
  onEscolher?: (id: string) => void;
  /** 1 desenha 120×192; 0.82 encolhe tudo junto */
  escala?: number;
}) {
  const { c } = useTheme();
  /* A silhueta fica no tom mais claro da escala e as zonas recebem cor:
     assim o que é uma ÁREA se separa do que é só contorno. Zona e corpo
     no mesmo cinza deixava as seis invisíveis, e o mapa virava desenho. */
  const corpo = c.bg2;
  /* arredondado porque 192 × 0,92 sai 176,64000000000001 e isso vai
     parar no atributo do SVG; o viewBox reescala sozinho. */
  const L = Math.round(120 * escala);
  const A = Math.round(192 * escala);
  /* de ponto de desenho para pixel de tela */
  const k = L / LARGURA;

  return (
    <View style={{ width: L, height: A }}>
      <Svg width={L} height={A} viewBox={'0 0 ' + LARGURA + ' ' + ALTURA}>
        <Path d={METADE} fill={corpo} />
        {/* A outra metade é a mesma, espelhada no eixo do corpo. */}
        <G transform={'translate(' + LARGURA + ',0) scale(-1,1)'}>
          <Path d={METADE} fill={corpo} />
        </G>

        {ZONAS.map((z) => {
          const t = tons[z.id];
          if (!t) return null;
          return (
            <Rect
              key={z.id}
              x={z.x} y={z.y} width={z.w} height={z.h} rx={z.r} ry={z.r}
              transform={z.rot ? 'rotate(' + z.rot + ' ' + (z.x + z.w / 2) + ' ' + (z.y + z.h / 2) + ')' : undefined}
              fill={t.fill}
              fillOpacity={t.opacidade}
              stroke={t.stroke}
              strokeWidth={2.4}
              strokeDasharray={t.tracejada ? '5 5' : undefined}
            />
          );
        })}
      </Svg>

      {/* A ÁREA DE TOQUE CRESCE 8 PONTOS para cada lado do que está
          pintado: a maior das seis zonas tem 17 por 34, que mostrada dá
          uns 10 por 20 pixels — menos da metade de um alvo confortável de
          dedo. O retângulo colorido continua do tamanho que é; quem
          cresce é só o que escuta.

          Mas ela NÃO ATRAVESSA O EIXO DO CORPO. As duas marcas do abdômen
          são vizinhas de umbigo, e com a folga inteira a da direita —
          desenhada depois, e por isso por cima — cobria a borda direita da
          esquerda: o dedo caía em cima da marca clara e acendia a outra.
          Quem está de um lado do eixo escuta só do seu lado. */}
      {onEscolher ? ZONAS.map((z) => {
        const meio = LARGURA / 2;
        const x0 = z.x >= meio ? Math.max(z.x - 8, meio) : z.x - 8;
        const x1 = z.x + z.w <= meio ? Math.min(z.x + z.w + 8, meio) : z.x + z.w + 8;
        return (
          <Pressable
            key={z.id}
            onPress={() => onEscolher(z.id)}
            style={{
              position: 'absolute',
              left: x0 * k,
              top: (z.y - 8) * k,
              width: (x1 - x0) * k,
              height: (z.h + 16) * k,
            }}
          />
        );
      }) : null}
    </View>
  );
}
