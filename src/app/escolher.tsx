import React from 'react';
import { View, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { useStore } from '../logic/store';
import { Txt, Row, SheetScreen } from '../ui/kit';
import { Cartao } from '../ui/internas';
import { Icon } from '../ui/Icon';
import { useTheme } from '../ui/useTheme';
import { T } from '../textos';
import {
  NOME_DO_LOCAL, idiomasOrdenados, localAtual, trocarLocal, type Local,
} from '../logic/local';

/* ============================================================
   ESCOLHER O IDIOMA — a folha do perfil

   ⚠️ ELA JÁ SERVIU A DUAS PERGUNTAS, idioma e país, e por isso levava um
   parâmetro de rota. O país saiu do aplicativo inteiro — ver o alto de
   logic/pais —, e com uma pergunta só o parâmetro era peça sem função.

   ⚠️ E HOUVE UMA TELA ENTRE ESTA FOLHA E O PERFIL, que também saiu. Ela
   fazia sentido com duas perguntas e duas ressalvas; com uma, o título
   dela e a sua única linha diziam a mesma palavra — "Idioma" em cima de
   "Idioma". O ajuste irmão, logo abaixo no Perfil, é folha desde sempre:
   as unidades. Agora os dois se abrem igual.

   ⚠️ A RESSALVA VEIO COM ELA, e é a parte que tira o medo de tocar: nada
   se converte no estado, o que está gravado continua gravado, e só a
   forma de escrever muda. Ela fica DEPOIS da lista porque responde o que
   a lista provoca — e não antes, onde seria pedágio para chegar no que a
   pessoa veio fazer.

   ⚠️ CADA OPÇÃO SE ESCREVE NO PRÓPRIO IDIOMA, e é a única lista do
   aplicativo assim. "Inglês" só ajuda quem já lê português; quem abre
   esta folha por estar perdido numa língua que não é a sua procura a
   palavra que reconhece — "English", "Deutsch".

   ⚠️ A LISTA É `idiomasOrdenados`, e não uma lista escrita aqui. Ela vem
   de logic/local com duas garantias: só entra idioma que tem catálogo, e
   a ordem põe em cima o do país de quem está lendo. As duas coisas moram
   lá porque o cadastro faz a mesma pergunta e precisa da mesma resposta.

   ⚠️⚠️ E A ESCOLHA FECHA A FOLHA ANTES DE VALER. Trocar o idioma remonta
   a árvore inteira — é o `key={localAtual()}` da Moldura, no layout raiz
   —, e remontar com a folha aberta por cima a deixaria pendurada sobre
   uma tela que já não é a mesma. Fechar primeiro é o que faz o remonte
   acontecer onde a pessoa vai estar quando ele terminar.
   ============================================================ */

/* A linha da lista. Ela não é a <Linha> da casa: aquela fecha com selo ou
   com chevron, e aqui o fecho é o visto — que não é um fim de linha, é o
   estado da opção. */
function Opcao({ nome, on, onPress }: { nome: string; on: boolean; onPress: () => void }) {
  const { c } = useTheme();
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [{ opacity: pressed ? 0.6 : 1 }]}>
      <Row gap={12} style={{ paddingHorizontal: 16, paddingVertical: 14, alignItems: 'center' }}>
        <Txt v="body" c={on ? c.tx : c.tx2} style={{ flex: 1 }}>{nome}</Txt>
        {on ? <Icon name="check" size={16} color={c.accent} sw={2.4} /> : null}
      </Row>
    </Pressable>
  );
}

export default function Escolher() {
  const { c } = useTheme();
  const update = useStore((s) => s.update);
  const router = useRouter();

  /* Os dois passos: o valor de módulo, que é quem o texto e as listas
     leem, e o perfil, que é quem lembra no próximo arranque. */
  const escolher = (id: Local) => {
    router.back();
    trocarLocal(id);
    update((st: any) => { st.profile.idioma = id; });
  };

  return (
    <SheetScreen titulo={T.idioma.rotulo} onClose={() => router.back()}>
      <View style={{ marginTop: 18, gap: 14 }}>
        <Cartao>
          {idiomasOrdenados().map((id) => (
            <Opcao
              key={id}
              nome={NOME_DO_LOCAL[id]}
              on={id === localAtual()}
              onPress={() => escolher(id)}
            />
          ))}
        </Cartao>

        <Txt v="caption" c={c.tx3} style={{ paddingHorizontal: 2, lineHeight: 20 }}>
          {T.idioma.ressalva}
        </Txt>
      </View>
    </SheetScreen>
  );
}
