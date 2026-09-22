import React from 'react';
import { useRouter } from 'expo-router';
import { Txt } from '../ui/kit';
import { TelaInterna, Titulao, Cartao, Linha } from '../ui/internas';
import { useTheme } from '../ui/useTheme';
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
   tela, desenhada como folha, com o scrim cobrindo a própria página. A
   saída não foi mudar a rota: foi aceitar o que a rota já dizia.

   ⚠️ E ELA JÁ PERGUNTOU DUAS COISAS. O país era a segunda linha, e saiu do
   aplicativo inteiro — ver o alto de logic/pais. Com uma pergunta só ela
   poderia voltar a ser folha; continua tela porque é aqui que mora a
   RESSALVA, que é a parte que tira o medo de tocar, e folha de lista não
   é lugar de parágrafo.

   ⚠️ E A ASSINATURA DO ESTADO SAIU JUNTO COM O PAÍS. Ela existia porque a
   linha do país lia `paisAtual()`, que é valor de módulo e não avisa
   ninguém: a tela ficava montada atrás da folha e nunca re-renderizava. O
   idioma não tem esse problema — trocá-lo remonta a árvore inteira pelo
   `key` da Moldura.

   ⚠️ NADA SE CONVERTE NO ESTADO, como na folha de unidades: o que está
   gravado continua gravado, e só a forma de escrever muda. Por isso a
   tela não pede confirmação — não há o que dar errado.
   ============================================================ */

export default function Idioma() {
  const router = useRouter();
  const { c } = useTheme();

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
          onPress={() => router.push('/escolher' as any)}
        />
      </Cartao>

      <Txt v="caption" c={c.tx3} style={{ paddingHorizontal: 2, lineHeight: 20 }}>
        {T.idioma.ressalva}
      </Txt>
    </TelaInterna>
  );
}
