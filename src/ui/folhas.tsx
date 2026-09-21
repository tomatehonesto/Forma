import React from 'react';
import { Animated, Easing, Platform, Pressable, StyleSheet } from 'react-native';
import { create } from 'zustand';
import { useTheme } from './useTheme';

/* ============================================================
   A SOMBRA DAS FOLHAS — e por que ela não mora dentro da folha.

   ⚠️⚠️ ESTE ARQUIVO EXISTE POR CAUSA DE UM ERRO QUE CUSTOU CINCO
   TENTATIVAS, e a nota inteira é para ninguém refazer o caminho.

   O bottom sheet é uma ROTA apresentada como `transparentModal`, e a
   rota desliza de baixo — `slide_from_bottom`, animação do sistema
   operacional, no tempo do sistema operacional. O scrim (a sombra que
   escurece a página atrás) morava DENTRO dessa tela. Resultado: ele
   subia junto, como cortina puxada pelo pé. Sombra não vem de lugar
   nenhum; ela escurece o que já está ali.

   O caminho errado foi tentar consertar a sombra mexendo no painel: tirei
   o deslize da rota e refiz as duas animações à mão, com `Animated`,
   dentro da folha. Aí começou a via-crúcis — o valor inicial que vinha
   zero do hook, a duração comida pela montagem, a curva, a distância, a
   mola. Cinco versões reprovadas no aparelho, e a última aparecia
   instantânea nas duas pontas.

   A lição: eu troquei uma animação NATIVA, garantida, que roda fora da
   thread de JavaScript, por uma imitação em JavaScript que depende de a
   thread estar livre exatamente quando a folha está montando — que é o
   único momento em que ela nunca está.

   ⚠️ A CORREÇÃO É DE LUGAR, E NÃO DE ANIMAÇÃO. A sombra não pertence à
   folha: ela pertence ao APLICATIVO, que fica mais escuro enquanto uma
   folha está aberta. Pintada aqui, no layout raiz, ela fica abaixo do
   modal e acima da página — e não viaja com coisa nenhuma, porque a raiz
   não vai a lugar nenhum. Só acende e apaga.

   E o painel volta a subir pelo `slide_from_bottom`, que é o que ele
   nunca deveria ter deixado de fazer.
   ============================================================ */

/* ⚠️ É UMA PILHA, e não um booleano — porque folha abre em cima de folha:
   do "o que deseja registrar" sai o "acabei de me pesar". Com um
   booleano, fechar a de cima apagaria a sombra da de baixo, que continua
   aberta. A pilha também diz a cada folha se ela é a de cima, que é o que
   o `SheetScreen` usa para se escurecer quando fica coberta. */
type Pilha = {
  pilha: string[];
  abrir: (id: string) => void;
  fechar: (id: string) => void;
};

export const useFolhas = create<Pilha>((set) => ({
  pilha: [],
  abrir: (id) => set((s) => (s.pilha.includes(id) ? s : { pilha: [...s.pilha, id] })),
  fechar: (id) => set((s) => ({ pilha: s.pilha.filter((x) => x !== id) })),
}));

/* ============================================================
   O QUE TODA FOLHA FAZ — e são três folhas, não uma.

   O `SheetScreen` do kit serve a maioria das rotas, mas `registrar` e
   `registro-ok` montam a própria: a primeira porque é um menu e não um
   formulário, a segunda porque é uma confirmação sem título nem grabber.
   As três tinham o mesmo scrim copiado dentro de si, e por isso as três
   tinham o mesmo defeito.

   Esta função é o que elas passam a herdar: anuncia que existe uma folha
   aberta — o que acende a sombra da raiz — e devolve se esta folha está
   COBERTA por outra, para ela se escurecer sozinha.

   ⚠️ QUEM ESCURECE A COBERTA É ELA MESMA porque a sombra da raiz fica
   abaixo de todas: ela escurece a página, não a folha de baixo quando
   outra abre em cima. Sem isto, abrir "acabei de me pesar" a partir de "o
   que deseja registrar" deixaria o topo da primeira acesa atrás da
   segunda. E é seguro animar aqui: a folha coberta está parada. */
export function useFolhaAberta() {
  const meu = React.useId();
  const abrir = useFolhas((s) => s.abrir);
  const tirar = useFolhas((s) => s.fechar);
  React.useEffect(() => {
    abrir(meu);
    return () => tirar(meu);
  }, [meu, abrir, tirar]);
  return useFolhas((s) => s.pilha.length > 0 && s.pilha[s.pilha.length - 1] !== meu);
}

/* A camada que escurece a folha coberta. Vai DEPOIS do painel, para
   pintar por cima dele. */
export function Cobertura({ coberta }: { coberta: boolean }) {
  const { c } = useTheme();
  const v = React.useRef(new Animated.Value(0)).current;
  React.useEffect(() => {
    Animated.timing(v, {
      toValue: coberta ? 1 : 0,
      duration: coberta ? 260 : 200,
      easing: Easing.out(Easing.quad),
      useNativeDriver: true,
    }).start();
  }, [coberta, v]);
  return (
    <Animated.View
      pointerEvents="none"
      style={{
        position: 'absolute', left: 0, right: 0, top: 0, bottom: 0,
        backgroundColor: c.scrim, opacity: v,
      }}
    />
  );
}

/* ============================================================
   O TOQUE QUE FECHA — e, na web, a sombra junto.

   ⚠️⚠️ NA WEB A SOMBRA VOLTA PARA DENTRO DA FOLHA, e isto não é
   inconsistência: é a mesma decisão aplicada a duas plataformas que
   empilham de jeitos diferentes.

   No aparelho o modal é uma CAMADA DO SISTEMA acima de tudo. A sombra
   pintada na raiz fica embaixo dela — que é exatamente o lugar certo, e é
   o único lugar onde ela não viaja com a tela que desliza.

   Na web não existe camada nenhuma: a folha é uma div irmã, na mesma
   árvore, e a sombra da raiz pintaria POR CIMA dela — testado, a folha
   inteira ficava escurecida. E lá ela também não precisa sair de dentro:
   a rota NÃO DESLIZA na web (medido: duas capturas em sequência durante a
   abertura, idênticas), então não há o que levar a sombra junto.

   Daí esta peça: as três folhas do aplicativo põem uma só linha, e a
   diferença entre as plataformas fica escrita aqui, uma vez.

   ⚠️ E O TOQUE MORA SEMPRE AQUI DENTRO, nas duas plataformas. No aparelho
   a sombra da raiz é `pointerEvents: 'none'` — ela está debaixo do modal, e
   nada atravessa até ela. Separar o que PINTA do que RESPONDE é o preço
   de a sombra não viajar, e é barato. */
export function TocarParaFechar({ onPress }: { onPress: () => void }) {
  const { c } = useTheme();
  return (
    <Pressable
      onPress={onPress}
      style={[StyleSheet.absoluteFill, Platform.OS === 'web' ? { backgroundColor: c.scrim } : null]}
    />
  );
}

export function SombraDasFolhas() {
  const { c } = useTheme();
  const tem = useFolhas((s) => s.pilha.length > 0);
  const sombra = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    /* A raiz não está montando nada quando isto roda — ela já está de pé
       há muito tempo. É a diferença entre esta animação e a que não
       funcionava: aqui a thread está livre. */
    Animated.timing(sombra, {
      toValue: tem ? 1 : 0,
      duration: tem ? 260 : 200,
      easing: tem ? Easing.out(Easing.quad) : Easing.in(Easing.quad),
      useNativeDriver: true,
    }).start();
  }, [tem, sombra]);

  /* Na web quem pinta é o `TocarParaFechar`, lá em cima. */
  if (Platform.OS === 'web') return null;

  return (
    <Animated.View
      pointerEvents="none"
      style={{
        position: 'absolute', left: 0, right: 0, top: 0, bottom: 0,
        backgroundColor: c.scrim,
        opacity: sombra,
      }}
    />
  );
}
