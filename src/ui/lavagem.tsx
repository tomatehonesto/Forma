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

export function Lavagem({ altura, forca = 0.26, solta = false }: {
  altura: number;
  forca?: number;
  /* ⚠️⚠️ SOLTA quer dizer "esta lavagem não está encostada nas bordas da
     tela", e foi um defeito que levou tempo para aparecer.

     Esta peça nasceu para o TOPO de uma página: largura inteira, colada
     no alto. Três das quatro bordas dela são as bordas da tela, e por
     isso só a de baixo precisava de véu — é o que o comentário do
     degradê explica.

     Aí ela foi usada solta, no meio de uma tela, atrás dos dois ícones da
     conexão com o aplicativo de saúde. Ali as quatro bordas estão à
     vista, e as três que ninguém tinha velado apareceram como o que são:
     um retângulo de cantos retos, com corte no topo e nos dois lados.

     Com `solta`, o véu fecha nos quatro lados. Não é um degradê radial —
     é o vertical mais dois horizontais, que se somam nos cantos e chegam
     ao fundo opaco antes de qualquer borda. Para uma mancha desfocada,
     isso é indistinguível de radial e custa duas views. */
  solta?: boolean;
}) {
  const { c } = useTheme();
  const vazio = semCor(c.bg);
  const cobre = { position: 'absolute' as const, left: 0, right: 0, top: 0, height: altura };

  /* ⚠️⚠️ O VÉU DE TOPO É MEDIDO EM PIXELS, e era uma fração da caixa.

     A conta certa não depende do tamanho da caixa: depende do BORRÃO. O
     véu existe para apagar a mancha antes da borda, e uma mancha
     desfocada precisa de uns cinquenta pixels para sumir — numa caixa de
     176 ou numa de 300, os mesmos cinquenta.

     Como fração, crescer a caixa crescia o véu junto: subir a lavagem da
     tela de saúde em sessenta pixels empurrava o véu de topo em vinte, e
     a luz não subia quase nada. Era o efeito oposto ao pedido.

     O teto de 0,4 é para caixa pequena: numa de 100 px, cinquenta seriam
     metade dela só de véu. */
  const veuTopo = Math.min(0.4, 46 / altura);
  const veuPe = Math.min(0.5, 70 / altura);
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

          Colada no alto, o primeiro terço fica sem véu, que é onde a
          malha tem o direito de aparecer. Solta, o alto também fecha —
          ali ele é borda, e não o começo da tela. */}
      <LinearGradient
        colors={solta ? [c.bg, vazio, vazio, c.bg] : [vazio, vazio, c.bg]}
        locations={solta ? [0, veuTopo, 1 - veuPe, 1] : [0, 0.3, 1]}
        style={cobre}
      />
      {solta ? (
        <>
          <LinearGradient
            colors={[c.bg, vazio]}
            locations={[0, 0.3]}
            start={{ x: 0, y: 0.5 }} end={{ x: 1, y: 0.5 }}
            style={cobre}
          />
          <LinearGradient
            colors={[vazio, c.bg]}
            locations={[0.7, 1]}
            start={{ x: 0, y: 0.5 }} end={{ x: 1, y: 0.5 }}
            style={cobre}
          />
        </>
      ) : null}
    </View>
  );
}
