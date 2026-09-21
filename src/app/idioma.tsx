import React from 'react';
import { View } from 'react-native';
import { useRouter } from 'expo-router';
import { useStore } from '../logic/store';
import { Txt, SheetScreen } from '../ui/kit';
import { Campo, Opc } from '../ui/internas';
import { T } from '../textos';
import {
  NOME_DO_LOCAL, idiomasOrdenados, localAtual, trocarLocal, type Local,
} from '../logic/local';

/* ============================================================
   O IDIOMA

   ⚠️⚠️ ESTA TELA SÓ PODIA NASCER DEPOIS DA TRADUÇÃO. Enquanto só existia
   catálogo em português, um seletor que oferecesse "English" e entregasse
   frases em português seria porta emparedada — e a régua da casa é que
   uma linha com seta e sem destino é pior do que nenhuma linha.

   ⚠️ A LISTA É `idiomasOrdenados`, e não uma lista escrita aqui. Ela vem
   de logic/local com duas garantias: só entra idioma que tem catálogo, e
   a ordem põe em cima o do país de quem está lendo. As duas coisas moram
   lá porque o cadastro faz a mesma pergunta e precisa da mesma resposta.

   ⚠️ E CADA OPÇÃO SE ESCREVE NO PRÓPRIO IDIOMA — é a única lista do
   aplicativo que não passa pelo catálogo. "Inglês" só ajuda quem já lê
   português; quem abriu esta tela por estar perdido num idioma que não é
   o seu procura a palavra que reconhece.

   ⚠️ NADA SE CONVERTE NO ESTADO, como na folha de unidades: o que está
   gravado continua gravado, e só a forma de escrever muda. Por isso a
   tela não pede confirmação — não há o que dar errado.
   ============================================================ */

export default function Idioma() {
  const update = useStore((s) => s.update);
  const router = useRouter();
  const atual = localAtual();

  const escolher = (id: Local) => {
    /* Os dois passos: o valor de módulo, que é quem o texto lê, e o
       perfil, que é quem lembra no próximo arranque. */
    trocarLocal(id);
    update((st: any) => { st.profile.idioma = id; });
  };

  return (
    <SheetScreen
      titulo={T.idioma.titulo}
      sub={T.idioma.tituloSub}
      onClose={() => router.back()}
    >
      <View style={{ marginTop: 18, gap: 10 }}>
        <Campo rotulo={T.idioma.rotulo} nu>
          <View style={{ gap: 8 }}>
            {idiomasOrdenados().map((id) => (
              <Opc
                key={id}
                cheia
                label={NOME_DO_LOCAL[id]}
                on={atual === id}
                onPress={() => escolher(id)}
              />
            ))}
          </View>
        </Campo>

        <Txt v="caption" c="#8A8F98" style={{ paddingHorizontal: 2 }}>
          {T.idioma.ressalva}
        </Txt>
      </View>
    </SheetScreen>
  );
}
