import React from 'react';
import { View } from 'react-native';
import { useRouter } from 'expo-router';
import { useStore } from '../logic/store';
import { Txt, SheetScreen } from '../ui/kit';
import { Campo, Opc } from '../ui/internas';
import { localAtual, trocarLocal, type Local } from '../logic/local';

/* ============================================================
   O IDIOMA

   ⚠️⚠️ ESTA TELA SÓ PODIA NASCER DEPOIS DA TRADUÇÃO. Enquanto só existia
   catálogo em português, um seletor que oferecesse "English" e entregasse
   frases em português seria porta emparedada — e a régua da casa é que
   uma linha com seta e sem destino é pior do que nenhuma linha.

   ⚠️ CADA OPÇÃO SE ESCREVE NO PRÓPRIO IDIOMA, e não no idioma em uso.
   "Inglês" só ajuda quem já lê português; quem abriu esta tela por estar
   perdido num idioma que não é o seu procura a palavra que reconhece.
   É por isso que a lista não passa pelo catálogo: ela é a única do
   aplicativo que não deve ser traduzida.

   ⚠️ E O NÚMERO MUDA JUNTO COM A PALAVRA. Trocar para English troca
   também a vírgula decimal pelo ponto, o desenho da data e o relógio —
   são o mesmo valor, e o motivo está no alto de logic/local. O aviso
   embaixo diz isso, porque é a parte que surpreende.

   ⚠️ NADA SE CONVERTE NO ESTADO, como na folha de unidades: o que está
   gravado continua gravado, e só a forma de escrever muda. Por isso a
   tela não pede confirmação — não há o que dar errado.
   ============================================================ */

/* ⚠️ A LISTA NÃO PASSA PELO CATÁLOGO. Ver o alto desta tela. */
const OPCOES: [Local, string, string][] = [
  ['pt-BR', 'Português', 'Brasil · 82,4 kg · 21 de setembro'],
  ['en-US', 'English', 'United States · 181.7 lb · September 21'],
];

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
      titulo="Idioma · Language"
      sub="Muda o texto, os números e as datas."
      onClose={() => router.back()}
    >
      <View style={{ marginTop: 18, gap: 10 }}>
        <Campo rotulo="Como você lê o aplicativo" nu>
          <View style={{ gap: 8 }}>
            {OPCOES.map(([id, nome, exemplo]) => (
              <Opc
                key={id}
                cheia
                label={nome}
                sub={exemplo}
                on={atual === id}
                onPress={() => escolher(id)}
              />
            ))}
          </View>
        </Campo>

        <Txt v="caption" c="#8A8F98" style={{ paddingHorizontal: 2 }}>
          O que você já registrou continua como está. Muda só a forma de escrever:
          a palavra, a vírgula do número, o desenho da data e o relógio.
        </Txt>
      </View>
    </SheetScreen>
  );
}
