import React from 'react';
import { View } from 'react-native';
import { useRouter } from 'expo-router';
import { useStore } from '../logic/store';
import { Txt } from '../ui/kit';
import { TelaInterna, Titulao, Cartao, Linha } from '../ui/internas';
import { useTheme } from '../ui/useTheme';
import { NOME_DO_PAIS, paisAtual } from '../logic/pais';
import { T } from '../textos';
import { NOME_DO_LOCAL, localAtual } from '../logic/local';

/* ============================================================
   O IDIOMA

   ⚠️⚠️ ESTA TELA SÓ PODIA NASCER DEPOIS DA TRADUÇÃO. Enquanto só existia
   catálogo em português, um seletor que oferecesse "English" e entregasse
   frases em português seria porta emparedada — e a régua da casa é que
   uma linha com seta e sem destino é pior do que nenhuma linha.

   ⚠️⚠️ ELA ERA UMA FOLHA DESENHADA DENTRO DE UMA TELA EMPURRADA, e é por
   isso que abria com uma sombra por cima e nada atrás.

   `SheetScreen` pinta o próprio scrim, e conta com a apresentação
   `transparentModal` para que o scrim tenha o que escurecer. A irmã desta
   tela, /unidades, está na lista dos modais do layout; esta ficou de fora,
   encostada no `checkin`, e virou o pior dos dois mundos: empurrada como
   tela, desenhada como folha, com o scrim cobrindo a própria página.

   A saída não foi mudar a rota: foi aceitar o que a rota já dizia. Aqui
   cabe uma tela — duas escolhas, duas ressalvas —, e a rolagem larga é o
   que as cento e onze… vinte e oito opções de país pediam desde o começo.

   ⚠️ AS DUAS ESCOLHAS VIRARAM LINHA, E NÃO DUAS RODAS LADO A LADO. A roda
   mostra o valor escolhido no meio de outros dois, e duas delas juntas
   fazem a pessoa ler quatro palavras para achar as duas que valem. A
   linha diz o que está valendo e mais nada; quem quer trocar toca nela, e
   aí sim vê a lista inteira, numa folha, com espaço para as vinte e oito.

   ⚠️ E CADA OPÇÃO SE ESCREVE NO PRÓPRIO IDIOMA — é a única lista do
   aplicativo que não passa pelo catálogo. "Inglês" só ajuda quem já lê
   português; quem abriu esta tela por estar perdido num idioma que não é
   o seu procura a palavra que reconhece. Ver /escolher.

   ⚠️ NADA SE CONVERTE NO ESTADO, como na folha de unidades: o que está
   gravado continua gravado, e só a forma de escrever muda. Por isso a
   tela não pede confirmação — não há o que dar errado.
   ============================================================ */

export default function Idioma() {
  const router = useRouter();
  const { c } = useTheme();
  const ir = (o: string) => () => router.push(`/escolher?o=${o}` as any);

  /* ⚠️ A ASSINATURA DO ESTADO EXISTE PARA A TELA REAGIR À FOLHA, e não
     para ler nada daqui.

     `localAtual()` e `paisAtual()` são leitura de módulo: módulo não
     avisa ninguém, e a tela que ficou montada atrás da folha nunca
     re-renderizava. Com o idioma isso passava despercebido — trocá-lo
     remonta a árvore inteira pelo `key` da Moldura —, mas o país não
     remonta nada, e a linha continuava dizendo "Brasil" depois de a
     pessoa ter escolhido Portugal.

     Assinar `S` é o que as outras telas da casa fazem, e é o bastante:
     quem escolhe grava no perfil, e gravar no perfil devolve um `S` novo.
     O valor mostrado continua saindo das duas funções, que sabem cair no
     aparelho enquanto o perfil ainda não respondeu. */
  useStore((s: any) => s.S);

  return (
    <TelaInterna titulo={T.idioma.titulo}>
      <Titulao titulo={T.idioma.titulo} lead={T.idioma.tituloSub} />

      {/* O título curto na linha e a PERGUNTA na folha: "Idioma" é o nome
          do ajuste, e "Como você lê o aplicativo" é o que se pergunta na
          hora de mexer nele. São os dois textos que o catálogo já tinha,
          cada um no lugar que é dele. */}
      <Cartao>
        <Linha
          ic="site"
          titulo={T.idioma.idioma}
          sub={NOME_DO_LOCAL[localAtual()]}
          onPress={ir('idioma')}
        />
        <Linha
          ic="pin"
          titulo={T.idioma.pais}
          sub={NOME_DO_PAIS[paisAtual()]}
          onPress={ir('pais')}
        />
      </Cartao>

      <View style={{ gap: 10 }}>
        <Txt v="caption" c={c.tx3} style={{ paddingHorizontal: 2, lineHeight: 20 }}>
          {T.idioma.ressalva}
        </Txt>
        <Txt v="caption" c={c.tx3} style={{ paddingHorizontal: 2, lineHeight: 20 }}>
          {T.idioma.paisRessalva}
        </Txt>
      </View>
    </TelaInterna>
  );
}
