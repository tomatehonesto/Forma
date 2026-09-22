import React from 'react';
import { View, Pressable, type ScrollView } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useStore } from '../logic/store';
import { Txt, Row, SheetScreen } from '../ui/kit';
import { Cartao } from '../ui/internas';
import { Icon } from '../ui/Icon';
import { useTheme } from '../ui/useTheme';
import { NOME_DO_PAIS, PAISES, paisAtual, trocarPais, type Pais } from '../logic/pais';
import { T } from '../textos';
import {
  NOME_DO_LOCAL, idiomasOrdenados, localAtual, trocarLocal, type Local,
} from '../logic/local';

/* ============================================================
   ESCOLHER — a folha de uma lista longa

   Ela serve às duas perguntas de /idioma, e é uma rota só porque as duas
   listas têm exatamente a mesma forma: um valor, um nome escrito no
   próprio idioma, e o visto em quem está valendo. Duas rotas seriam duas
   cópias da mesma folha, e a segunda é sempre a que fica para trás.

   ⚠️ NENHUM DOS NOMES PASSA PELO CATÁLOGO, e é a única lista do
   aplicativo assim. "Inglês" só ajuda quem já lê português; quem abre
   esta folha por estar perdido num idioma que não é o seu procura a
   palavra que reconhece — "English", "Deutsch". Com o país é o mesmo: o
   nome dele se escreve como ele se escreve.

   ⚠️ A LISTA DE IDIOMAS É `idiomasOrdenados`, e não uma lista escrita
   aqui. Ela vem de logic/local com duas garantias: só entra idioma que
   tem catálogo, e a ordem põe em cima o do país de quem está lendo. As
   duas coisas moram lá porque o cadastro faz a mesma pergunta e precisa
   da mesma resposta.

   ⚠️⚠️ E A ESCOLHA FECHA A FOLHA ANTES DE VALER. Trocar o idioma remonta
   a árvore inteira — é o `key={localAtual()}` da Moldura, no layout raiz
   —, e remontar com a folha aberta por cima a deixaria pendurada sobre
   uma tela que já não é a mesma. Fechar primeiro é o que faz o remonte
   acontecer onde a pessoa vai estar quando ele terminar.
   ============================================================ */

/* A linha da lista. Ela não é a <Linha> da casa: aquela fecha com selo ou
   com chevron, e aqui o fecho é o visto — que não é um fim de linha, é o
   estado da opção. */
function Opcao({ nome, on, onPress, onAltura }: {
  nome: string; on: boolean; onPress: () => void; onAltura?: (h: number) => void;
}) {
  const { c } = useTheme();
  return (
    <Pressable
      onPress={onPress}
      onLayout={onAltura ? (e) => onAltura(e.nativeEvent.layout.height) : undefined}
      style={({ pressed }) => [{ opacity: pressed ? 0.6 : 1 }]}
    >
      <Row gap={12} style={{ paddingHorizontal: 16, paddingVertical: 14, alignItems: 'center' }}>
        <Txt v="body" c={on ? c.tx : c.tx2} style={{ flex: 1 }}>{nome}</Txt>
        {on ? <Icon name="check" size={16} color={c.accent} sw={2.4} /> : null}
      </Row>
    </Pressable>
  );
}

export default function Escolher() {
  const update = useStore((s) => s.update);
  const router = useRouter();
  const { o } = useLocalSearchParams<{ o?: string }>();
  const ehPais = o === 'pais';

  /* Os dois passos, nas duas perguntas: o valor de módulo, que é quem o
     texto e as listas leem, e o perfil, que é quem lembra no próximo
     arranque. */
  const escolherIdioma = (id: Local) => {
    router.back();
    trocarLocal(id);
    update((st: any) => { st.profile.idioma = id; });
  };
  const escolherPais = (p: Pais) => {
    router.back();
    trocarPais(p);
    update((st: any) => { st.profile.pais = p; });
  };

  /* ⚠️ A FOLHA ABRE NO VALOR QUE JÁ VALE, e é isto que a roda antiga fazia
     de graça: com cento e onze países, abrir em "Angola" é pedir que
     quase todo mundo role até o seu. Só o país precisa — cinco idiomas
     cabem na tela sem rolar.

     A altura vem do onLayout da primeira linha em vez de um número
     escrito: ela muda com o tamanho de fonte do aparelho, e um 48 cravado
     aqui erraria justamente para quem aumentou a letra. */
  const rolagem = React.useRef<ScrollView | null>(null);
  const [altura, setAltura] = React.useState(0);
  const indice = ehPais ? PAISES.indexOf(paisAtual()) : -1;

  React.useEffect(() => {
    if (altura > 0 && indice > 0) {
      rolagem.current?.scrollTo({ y: indice * altura, animated: false });
    }
  }, [altura, indice]);

  return (
    <SheetScreen
      titulo={ehPais ? T.idioma.paisRotulo : T.idioma.rotulo}
      onClose={() => router.back()}
      scrollRef={rolagem}
    >
      <View style={{ marginTop: 18 }}>
        <Cartao>
          {ehPais
            ? PAISES.map((p, i) => (
              <Opcao
                key={p}
                nome={NOME_DO_PAIS[p]}
                on={p === paisAtual()}
                onPress={() => escolherPais(p)}
                onAltura={i === 0 ? setAltura : undefined}
              />
            ))
            : idiomasOrdenados().map((id) => (
              <Opcao key={id} nome={NOME_DO_LOCAL[id]} on={id === localAtual()} onPress={() => escolherIdioma(id)} />
            ))}
        </Cartao>
      </View>
    </SheetScreen>
  );
}
