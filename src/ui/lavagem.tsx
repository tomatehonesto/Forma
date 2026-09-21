import React from 'react';
import { View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Malha } from './instrumentos';
import { useTheme } from './useTheme';

/* ============================================================
   LAVAGEM — o ar azul atrás de uma manchete

   A malha de manchas desfocadas cobrindo o topo da tela, esmaecendo até o
   branco antes de encontrar o conteúdo. É o que abre cada pergunta do
   cadastro, a tela de conferência e a de plano.

   MANCHAS, E NÃO RAMPA. A primeira versão era um degradê de três
   paradas, e ficou feia pelo motivo de sempre: rampa linear tem direção,
   e direção numa superfície de fundo lê como listra. As referências não
   têm rampa — têm manchas de cor grandes e desfocadas, que se cruzam e
   produzem tons que não estão em nenhuma delas. O app já sabia fazer
   isso: `Malha`, da aba Cuidado, é um conjunto de blobs em gradiente
   radial com as cores da marca, e a família clara dela concentra as
   manchas à direita, deixando a esquerda quase branca — que é onde mora
   o texto escuro destas telas.

   FORÇA BAIXA. A família clara da malha foi calibrada para o card da aba
   Cuidado, onde ela é o assunto; aqui ela é o ar atrás de um texto preto,
   e na força original virava uma mancha azul chapada que engolia a letra.

   E COR ÚNICA: o azul de acento do app, e não a família inteira. A
   família mistura accent2, que puxa para o violeta — atrás de um
   formulário isso lia como lavanda, e lavanda não é cor desta marca. Com
   um pigmento só, o que sobra é o azul do app diluído, que é o que esta
   superfície sempre quis ser.

   E A DISSOLUÇÃO COMEÇA MAIS CEDO: o degradê para transparente cobre
   62% da altura em vez de metade, o que empurra a cor para cima e deixa
   a faixa onde o texto mora praticamente branca.

   O DEGRADÊ PARA TRANSPARENTE É O QUE FAZ ELA ACABAR SEM BORDA. Sem ele a
   malha termina num corte reto no meio da tela, e o corte é a costura
   aparecendo.

   Morava dentro de cadastro.tsx e saiu de lá quando a tela de plano virou
   rota própria: duas telas usando a mesma superfície não podem depender de
   uma delas importar a outra. */
/* TRANSPARENTE NÃO É "A MESMA COR COM ALFA ZERO".

   `transparent` em React Native é rgba(0,0,0,0) — preto invisível. Num
   degradê que termina no fundo claro da tela, o caminho entre os dois
   passa por cinza: a rampa escurece antes de clarear, e o resultado é
   uma faixa acinzentada atravessando a tela na altura em que o degradê
   começa. Era isso que parecia "uma opacidade estranha" atrás da
   manchete, e não a malha.

   Com a própria cor do fundo em alfa zero, os dois extremos são o mesmo
   pigmento e a rampa só muda de opacidade — que é o que ela sempre quis
   fazer. */
const semCor = (hex: string) => {
  const h = hex.replace('#', '');
  const n = parseInt(h.length === 3 ? h.split('').map((x) => x + x).join('') : h, 16);
  return `rgba(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}, 0)`;
};

/* ⚠️⚠️ ELA É SEMPRE COLADA NO ALTO, E ISSO É UMA RESTRIÇÃO, não um
   acaso — houve uma tentativa de usá-la solta, e ela não sobreviveu.

   A tela de conexão com o aplicativo de saúde queria luz atrás de dois
   ícones no meio da página. A primeira ideia foi uma lavagem local, numa
   caixa de 176 px colada na figura, e ela trouxe dois problemas em
   sequência:

   · As QUATRO bordas passaram a estar à vista. Aqui só a de baixo tem
     véu, porque as outras três são as bordas da tela; solta, ela desenhou
     um retângulo de cantos retos. Chegou a existir um modo `solta`, com
     véu nos quatro lados e a medida em pixels em vez de fração — o véu
     precisa do tamanho do BORRÃO, e não de uma fração da caixa.

   · E mesmo consertada, ela não subia. A rolagem RECORTA: a luz não
     passava de 69 px acima dos ícones, e o que passasse virava aresta.
     Uma luz que nasce e morre na altura da figura lê como halo preso a
     ela, em vez de ar na tela.

   A resposta foi devolver a lavagem ao nível da PÁGINA, onde ela já
   estava nas outras catorze perguntas, e só dar mais altura à dessa
   tela. O modo `solta` foi embora com o problema que ele resolvia.

   Se um dia fizer falta de novo, o caminho está no histórico — mas
   comece perguntando se a luz não pode ser da página. */
export function Lavagem({ altura, forca = 0.26 }: { altura: number; forca?: number }) {
  const { c } = useTheme();
  const vazio = semCor(c.bg);
  return (
    <View
      pointerEvents="none"
      style={{ position: 'absolute', top: 0, left: 0, right: 0, height: altura }}
    >
      <Malha id="cad" forca={forca} cor={c.accent} />
      {/* O DEGRADÊ COBRE A ALTURA INTEIRA, e não só o pé dela.

          A malha é desenhada num quadro de altura fixa, e uma mancha que
          ainda tinha cor na borda de baixo era cortada em linha reta. O
          degradê existe para matar a mancha antes do corte — por isso ele
          chega ao fundo opaco no mesmo ponto em que o quadro acaba.

          O primeiro terço fica sem véu, que é onde a malha tem o direito
          de aparecer. */}
      <LinearGradient
        colors={[vazio, vazio, c.bg]}
        locations={[0, 0.3, 1]}
        style={{ position: 'absolute', left: 0, right: 0, top: 0, height: altura }}
      />
    </View>
  );
}
