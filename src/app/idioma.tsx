import React from 'react';
import { View } from 'react-native';
import { useRouter } from 'expo-router';
import { useStore } from '../logic/store';
import { Txt, SheetScreen, Row } from '../ui/kit';
import { Roda } from '../ui/internas';
import { useTheme } from '../ui/useTheme';
import { NOME_DO_PAIS, PAISES, paisAtual, trocarPais, type Pais } from '../logic/pais';
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

/* O MESMO RÓTULO DO CADASTRO — micro, espaçado, discreto. Ele vive lá
   como componente local; duas cópias de três linhas é menos dívida do que
   um componente na ui que só duas telas usam. */
function Rotulo({ children }: { children: React.ReactNode }) {
  const { c } = useTheme();
  return <Txt v="micro" c={c.tx4} style={{ letterSpacing: 1, marginBottom: 10 }}>{children}</Txt>;
}

export default function Idioma() {
  const update = useStore((s) => s.update);
  const router = useRouter();
  const atual = localAtual();

  const pais = paisAtual();

  /* Os dois passos, nas duas perguntas: o valor de módulo, que é quem o
     texto e as listas leem, e o perfil, que é quem lembra no próximo
     arranque. */
  const escolher = (id: Local) => {
    trocarLocal(id);
    update((st: any) => { st.profile.idioma = id; });
  };
  const escolherPais = (p: Pais) => {
    trocarPais(p);
    update((st: any) => { st.profile.pais = p; });
  };

  return (
    <SheetScreen
      titulo={T.idioma.titulo}
      sub={T.idioma.tituloSub}
      onClose={() => router.back()}
    >
      {/* ⚠️⚠️ DUAS RODAS LADO A LADO, e não duas listas de cartões.

          Com dois idiomas a lista de cartões ganhava; com seis, e com
          cento e onze países ao lado, ela vira uma tela de rolar. A roda
          é o controle desta casa para lista longa com ordem própria — é a
          mesma do nascimento, três casas acima neste mesmo formulário.

          ⚠️ E ELA ABRE NO VALOR QUE JÁ VALE. O do aparelho para quem
          nunca respondeu, o guardado para quem respondeu: no caso comum
          ninguém rola nada, e os cento e onze países só existem para
          quem precisa deles. */}
      <View style={{ marginTop: 18, gap: 10 }}>
        <Row gap={10}>
          <View style={{ flex: 1 }}>
            <Rotulo>{T.idioma.rotulo}</Rotulo>
            <Roda
              itens={idiomasOrdenados().map((id) => ({ v: id, label: NOME_DO_LOCAL[id] }))}
              valor={atual}
              onEscolhe={escolher}
            />
          </View>
          <View style={{ flex: 1 }}>
            <Rotulo>{T.idioma.paisRotulo}</Rotulo>
            <Roda
              itens={PAISES.map((p) => ({ v: p, label: NOME_DO_PAIS[p] }))}
              valor={pais}
              onEscolhe={escolherPais}
            />
          </View>
        </Row>

        <Txt v="caption" c="#8A8F98" style={{ paddingHorizontal: 2 }}>
          {T.idioma.ressalva}
        </Txt>
        <Txt v="caption" c="#8A8F98" style={{ paddingHorizontal: 2 }}>
          {T.idioma.paisRessalva}
        </Txt>
      </View>
    </SheetScreen>
  );
}
