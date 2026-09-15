import React from 'react';
import { Platform } from 'react-native';
import { BlurView } from 'expo-blur';
import MaskedView from '@react-native-masked-view/masked-view';
import { LinearGradient } from 'expo-linear-gradient';

/* ============================================================
   O VIDRO QUE SE DESFAZ

   Mora aqui, e não dentro de uma tela, porque duas usam: o topo do
   alimento e o topo da água. Era código de /alimento até a segunda
   precisar dele — e uma cópia teria divergido na primeira vez que
   alguém mexesse na curva da máscara de um lado só.

   Um BlurView tem uma altura, e onde essa altura acaba o desfoque acaba
   junto: um corte reto atravessando a foto, que é a coisa que mais
   denuncia que existe uma camada ali. O que se quer é um vidro só,
   forte no alto, que vá ficando transparente até sumir.

   E A MESMA IDEIA PRECISA DE DOIS CAMINHOS, um por plataforma:

     web     o próprio desfoque leva uma máscara em degradê no estilo,
             que é a técnica de "progressive blur" do CSS;
     nativo  MaskedView, que é o equivalente de lá.

   O MaskedView sozinho não serve porque na web ele não mascara: ele
   DESENHA o elemento da máscara. O degradê preto que devia recortar o
   vidro aparecia como um bloco preto cobrindo a foto — e foi assim que
   eu descobri, olhando a tela em tamanho real depois de três tentativas
   olhando um print reduzido.

   AS DUAS APROXIMAÇÕES QUE NÃO FUNCIONARAM ficam registradas, porque as
   duas pareciam boas no papel:

   EMPILHAR CAMADAS de desfoque, cada uma mais curta que a anterior, não
   soma o bastante. Medido no navegador: nove camadas de intensidade
   baixa rendiam de 0,8 a 4 px de desfoque cada, quase nada.

   E TODA CAMADA DE VIDRO PINTA UM FUNDO junto, por menor que seja — 1%
   a 6% de branco cada. Nove delas viram um véu leitoso de 30% por cima
   da comida, que é exatamente o que o desfoque veio evitar. Não existe
   vidro sem tinta.
   ============================================================ */
const MASCARA = 'linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 40%, rgba(0,0,0,0.5) 72%, rgba(0,0,0,0) 100%)';

export function VidroDegrade({ altura, intensidade = 55 }: { altura: number; intensidade?: number }) {
  const caixa = { position: 'absolute' as const, left: 0, right: 0, top: 0, height: altura };

  if (Platform.OS === 'web') {
    return (
      <BlurView
        intensity={intensidade}
        tint="dark"
        style={[caixa, { maskImage: MASCARA, WebkitMaskImage: MASCARA } as any]}
      />
    );
  }

  return (
    <MaskedView
      style={caixa}
      maskElement={
        <LinearGradient
          colors={['#000', '#000', 'rgba(0,0,0,0.5)', 'transparent']}
          locations={[0, 0.4, 0.72, 1]}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={{ flex: 1 }}
        />
      }
    >
      <BlurView intensity={intensidade} tint="dark" style={{ flex: 1 }} />
    </MaskedView>
  );
}

