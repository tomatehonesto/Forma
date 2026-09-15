import React from 'react';
import { View, Pressable } from 'react-native';
import Svg, { Circle, Rect } from 'react-native-svg';
import { useTheme } from './useTheme';

/* ============================================================
   A SILHUETA DOS SEIS LOCAIS

   Duas telas desenham o mesmo corpo e querem coisas diferentes dele: o
   formulário pede para ESCOLHER onde aplicar, e a tela de aplicações
   mostra o RODÍZIO — quais locais descansaram e qual é a vez.

   Por isso o componente não sabe o que as cores querem dizer. Ele recebe
   um tom por zona e desenha; quem interpreta é a tela, porque o
   significado é diferente nas duas.

   O DESENHO NÃO RECEBE O TOQUE. Cada zona já foi um <Rect onPress>, e no
   navegador isso não funciona: o react-native-svg traduz o onPress em
   props de responder do React Native, que o DOM não conhece — seis erros
   de console a cada render e nenhum toque funcionando. O SVG é só
   desenho, e os Pressable ficam por cima, nas mesmas coordenadas. Dá
   certo porque o desenho tem tamanho fixo igual ao viewBox: uma unidade
   dele é um pixel, e não há conversão para errar.

   A silhueta é esquemática de propósito — detalhe anatômico aqui só
   atrapalharia o reconhecimento das seis áreas.
   ============================================================ */

export type Zona = { id: string; x: number; y: number; w: number; h: number; r: number };

export const ZONAS: Zona[] = [
  { id: 'braco-e', x: 15, y: 44, w: 16, h: 22, r: 8 },
  { id: 'braco-d', x: 81, y: 44, w: 16, h: 22, r: 8 },
  { id: 'abd-d', x: 40, y: 60, w: 15, h: 20, r: 7 },
  { id: 'abd-e', x: 57, y: 60, w: 15, h: 20, r: 7 },
  { id: 'coxa-d', x: 41, y: 100, w: 12, h: 26, r: 6 },
  { id: 'coxa-e', x: 59, y: 100, w: 12, h: 26, r: 6 },
];

/* A OPACIDADE VEM SEPARADA DA COR, e não embutida num rgba().

   A tela de aplicações precisa de seis tons da mesma cor — quanto mais
   recente o local, mais cheio — e escrever isso como rgba(6,92,245,…)
   cravaria o azul do tema claro num desenho que também aparece no
   escuro, onde o azul é outro. Com fillOpacity, a cor continua sendo a
   da paleta e só a força muda. */
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
        <Circle cx={56} cy={18} r={12} fill={corpo} />
        <Rect x={38} y={34} width={36} height={52} rx={12} fill={corpo} />
        <Rect x={14} y={38} width={18} height={52} rx={9} fill={corpo} />
        <Rect x={80} y={38} width={18} height={52} rx={9} fill={corpo} />
        <Rect x={40} y={92} width={14} height={70} rx={7} fill={corpo} />
        <Rect x={58} y={92} width={14} height={70} rx={7} fill={corpo} />

        {ZONAS.map((z) => {
          const t = tons[z.id];
          if (!t) return null;
          return (
            <Rect
              key={z.id}
              x={z.x} y={z.y} width={z.w} height={z.h} rx={z.r}
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
          maior das seis zonas tem 16 por 22, que é menos da metade de um
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
