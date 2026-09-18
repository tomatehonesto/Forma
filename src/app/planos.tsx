import React from 'react';
import { View, Pressable, ScrollView, StyleSheet } from 'react-native';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Path } from 'react-native-svg';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useStore } from '../logic/store';
import { PLANOS, RECOMENDADO, TESTE_DIAS, reais, isento, assinar, type Plano } from '../logic/assinatura';
import { useAurora } from '../ui/aurora';
import { TEM_REDE_PARCEIRA } from '../logic/mercado';
import { D_SIMBOLO, RAZAO_SIMBOLO } from '../ui/marca';
import { Txt, Row } from '../ui/kit';
import { Icon } from '../ui/Icon';
import { useTheme } from '../ui/useTheme';
import { paletaDe, comPaleta, dark, mix, alfa, radius, font, ty } from '../theme';

/* ============================================================
   PLANOS — a tela que pede dinheiro

   ⚠️ O BOTÃO NÃO COMPRA NADA, E ELE DIZ ISSO.

   Não há loja ligada (ver src/logic/assinatura.ts e PENDENCIAS.md, item
   5). A tela está inteira — é o desenho que a integração vai vestir —, e
   o toque no botão devolve o estado real em vez de uma animação de
   sucesso. Um paywall que finge cobrar é a pior porta emparedada que um
   aplicativo pode ter, porque a pessoa sai dela achando que pagou.

   ⚠️ ELA JÁ É O FIM DO CADASTRO, e é a única porta por enquanto: o
   botão "Ver planos" da tela de plano inicial entrega aqui. Nenhuma
   outra tela do aplicativo empurra para cá, e nenhuma função está
   trancada atrás dela — quem fechar segue com tudo, porque a cobrança
   não existe. Os outros gatilhos entram com a loja.

   O QUE ESTA TELA DELIBERADAMENTE NÃO FAZ

     · não inventa prêmio nem depoimento. As telas de plano que se
       copiam por aí abrem com "Apple Design Award" e cinco estrelas de
       um usuário chamado Volan_deMort — e uma recomendação que não
       existe é mentira mesmo quando é só um rascunho de layout, porque
       é exatamente o tipo de coisa que sobrevive até a produção;
     · não anuncia teste grátis. Os Termos dão sete dias de
       arrependimento (CDC art. 49), que é direito de quem JÁ comprou.
       Vender um como o outro é o tipo de atalho que depois vira
       reclamação com razão;
     · não esconde o preço cheio atrás do "por mês". O anual aparece
       pelos dois números, porque quem decide precisa dos dois.

   ⚠️ A DECISÃO É FIXA E O RESTO ROLA.

   O preço e o botão moram numa barra ancorada no pé da tela; o que se lê
   — a peça, a promessa, o que vem junto, a letra miúda, o código —
   passa por baixo dela. É o padrão das telas de plano que funcionam, e a
   razão é simples: quem decidiu no terceiro item não pode ser obrigada a
   rolar até o fim para pagar, e quem ainda está lendo não pode perder de
   vista quanto custa o que está lendo.

   O FIO DE CIMA É UM DEGRADÊ, e não uma borda. Borda corta a tela em
   duas; o degradê deixa o conteúdo se dissolver na barra, o que diz que
   há mais coisa ali atrás — e a barra deixa de parecer uma segunda tela
   grudada embaixo da primeira.

   A LINHA DO CÓDIGO FICA EMBAIXO DOS PREÇOS, e é o lugar certo dela: no
   cadastro, perguntar por indicação antes de mostrar o custo era
   anunciar um prêmio e depois fazer a pergunta que o concede. Aqui a
   ordem se inverte — a pessoa já viu o preço, e quem tem código digita
   porque tem.
   ============================================================ */

function IconeDoApp({ lado }: { lado: number }) {
  const S = useStore((s) => s.S);
  const p = paletaDe((S as any).paleta);
  const largura = lado * 0.56;
  return (
    <LinearGradient
      colors={[mix(p.acaoClara, '#FFFFFF', 0.2), mix(p.acaoClara, '#000000', 0.42)]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={{ width: lado, height: lado, borderRadius: lado * 0.225, alignItems: 'center', justifyContent: 'center' }}
    >
      <Svg width={largura} height={largura / RAZAO_SIMBOLO} viewBox="0 0 533 222">
        <Path d={D_SIMBOLO} fill={p.alcancado} />
      </Svg>
    </LinearGradient>
  );
}

/* O QUE A ASSINATURA DÁ É O APLICATIVO, e a lista diz isso em coisas que
   a pessoa reconhece de tê-las usado — não em substantivos de marketing.
   Cinco linhas, porque a sexta ninguém lê. */
/* ============================================================
   A PEÇA DO ALTO — o aplicativo, fotografado

   ⚠️ AQUI HAVIA UM APARELHO DESENHADO EM CÓDIGO, e ele cumpriu o papel de
   suporte até esta imagem existir: moldura, ilha, a aurora em escala e os
   números da própria pessoa — o peso que ela registrou, a aplicação que
   vem. Era o argumento da tela feito com o produto.

   O QUE SE PERDEU NA TROCA, e vale saber que se perdeu: a peça mostra os
   mesmos números para todo mundo. Quem está na semana 20 vê o dia 35 de
   outra pessoa. Foi uma escolha — fidelidade de composição no lugar de
   dado vivo —, e é reversível: o componente antigo está no histórico, no
   commit que trouxe esta linha.

   ⚠️ E A IMAGEM ENVELHECE SOZINHA. Ela é um retrato da Home de hoje; no
   dia em que o hero, a cor ou a tipografia mudarem, a tela de planos
   continua mostrando o aplicativo antigo sem avisar ninguém. Quem mexer
   na Home passa por aqui.

   O ARQUIVO É WEBP, e não o PNG que chegou: desenhada a 260 pt, a peça
   nunca precisa de mais do que 900 px de largura, nem numa tela de 3×. A
   conversão levou 1,4 MB para 138 KB sem diferença visível — a mesma
   régua das auroras, em src/ui/aurora.ts.
   ============================================================ */
const MOCKUP = require('../../assets/images/mockup-planos.webp');

/* 900×1959, retrato. A proporção sai daqui e a altura se calcula: trocar
   a peça por uma de outro formato não deve exigir caçar um `height`
   perdido lá embaixo. */
const MOCKUP_PROPORCAO = 900 / 1959;

/* ⚠️ O APARELHO NÃO CABE INTEIRO, E É POR ISSO QUE ELE DESAPARECE.

   A primeira peça era um quadro deitado com o telefone pequeno no meio;
   esta é o telefone de corpo inteiro, em retrato, e o problema virou o
   oposto. Desenhada na largura da tela, ela pediria 817 px de altura —
   mais do que o telefone tem de tela, com a barra de decisão ocupando
   325 deles.

   Encolher até caber devolveria o aparelho minúsculo que a peça anterior
   já era. Então ela é desenhada num tamanho que se lê — 210 px de
   aparelho — e a janela mostra só o alto: o resto continua existindo,
   embaixo do recorte.

   ⚠️ E O CORTE É UM DESVANECIMENTO, E NÃO UMA TESOURA. Um telefone
   cortado com régua no meio da tela lê como imagem quebrada; dissolvido
   no fundo, lê como um aparelho que sobe de dentro da página. É o mesmo
   recurso do fio da barra de decisão, pela mesma razão: emenda dura
   anuncia a montagem, emenda macia some. */
/* ⚠️ A JANELA É MEDIDA CONTRA A BARRA DE DECISÃO, e não escolhida por
   gosto. Ela é o único regulador da primeira dobra: tudo que vem depois
   — título, subtítulo, lista — desce junto quando ela cresce.

   252 px é o número que deixa o primeiro tópico assomar por baixo da
   barra em vez de ficar escondido atrás dela. Isso não é sobra de
   espaço, é a única coisa na tela que diz que existe mais para ler; sem
   ele a página parece terminar na barra e ninguém rola. Crescer a janela
   sem medir de novo apaga essa pista. */
const MOCKUP_JANELA = 252;
const MOCKUP_LARGURA = 286;

function PecaDoAlto({ c }: { c: any }) {
  return (
    /* ⚠️ A JANELA SANGRA PARA FORA DA CALHA, e o −20 é o padding do alto.

       A peça mora dentro de um bloco com `paddingHorizontal: 20`, então o
       desvanecimento parava a 20 px de cada borda — e os 20 px que sobravam
       continuavam com a aurora acesa. O resultado eram duas lascas claras
       nos cantos, exatamente na altura em que a imagem deveria ter sumido:
       o corte que não se vê no meio da tela aparecia nas pontas.

       Um véu que termina antes da borda não é um véu. Se o padding do alto
       mudar, este número muda junto. */
    <View style={{ height: MOCKUP_JANELA, marginHorizontal: -20, overflow: 'hidden', alignItems: 'center' }}>
      <Image
        source={MOCKUP}
        style={{ width: MOCKUP_LARGURA, height: MOCKUP_LARGURA / MOCKUP_PROPORCAO }}
        contentFit="contain"
      />
      {/* ⚠️ O DESVANECIMENTO É CURTO DE PROPÓSITO, e foi longo demais.

          Com 110 px ele cobria quase metade da janela, e o que devia ser
          o fim da peça virou uma faixa escura atravessando o aparelho —
          a pessoa via a sombra, e não o telefone. O erro é de relação e
          não de valor absoluto: quanto mais a janela encolhe, maior a
          fatia da imagem que um véu fixo come.

          56 px resolve mantendo a mesma ideia — o corte continua sendo
          uma dissolução e não uma tesoura —, e `0.94` empurra o preto
          para os últimos seis por cento — a mesma parada da aurora aqui
          atrás, de propósito: as duas camadas precisam chegar ao fundo da
          página juntas, senão uma delas aparece sozinha e vira risca.
          Quem mexer em MOCKUP_JANELA olha para cá. */}
      <LinearGradient
        colors={['transparent', c.bg]}
        locations={[0, 0.94]}
        style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: 56 }}
        pointerEvents="none"
      />
    </View>
  );
}

/* ⚠️ A LISTA VOLTOU A TER TÍTULO E DESCRIÇÃO, depois de uma passagem só
   com vistos e uma frase curta.

   O visto funciona quando o item é óbvio pelo nome — "50 vozes", "sem
   anúncios". Aqui não é: "as leituras dos seus números" não diz o que a
   pessoa recebe, e "o assistente" é um substantivo esperando explicação.
   Quatro itens com uma linha de contexto cada dizem mais do que cinco
   que a pessoa precisa adivinhar.

   QUATRO, E NÃO CINCO: com descrição, o quinto empurrava a barra de
   decisão para fora da primeira dobra — e uma lista que ninguém termina
   de ler não ganha nada com o último item. */
const ENTRA: [string, string, string][] = [
  ['journey', 'Seu tratamento em um só lugar',
    'Tudo organizado para você acompanhar sua jornada.'],
  ['barchart', 'Seus números interpretados',
    'Os seus dados viram informação que faz sentido.'],
  ['spark', 'Evolução que você consegue enxergar',
    'Peso, medidas, sintomas, exames e registros ao longo do tempo.'],
  ['companion', 'Um assistente para o dia a dia',
    'Pergunte, registre e entenda melhor a sua jornada.'],
];

export default function Planos() {
  const S = useStore((s) => s.S);
  const update = useStore((s) => s.update);
  const router = useRouter();

  /* ⚠️ ESTA TELA É SEMPRE ESCURA, e é a única do aplicativo que ignora a
     escolha de tema da pessoa.

     Não é capricho de composição: o alto dela é a aurora, que é uma
     imagem escura com véu por cima, e no tema claro o resto da tela
     ficava branco embaixo de um cabeçalho noturno — a emenda aparecia no
     meio e a barra do pé virava uma faixa clara colada numa tela escura.

     E há a razão maior: o paywall é uma interrupção, não um lugar onde se
     mora. Ele chega por cima do aplicativo, entrega uma decisão e sai. As
     telas que se comportam assim no resto do app — o hero da Home, o
     check-in concluído, o Insights — também são escuras por baixo da
     aurora, e o tema claro nunca as clareou.

     A paleta escolhida continua valendo: o que se fixa é o modo, e não a
     cor. Quem está no Pitaia vê o paywall em magenta.

     ⚠️⚠️ E POR ISSO TODO `Txt` DESTA TELA PRECISA DE `c`. ⚠️⚠️

     `Txt` sem cor cai no `useTheme()`, que lê o tema DO APARELHO — e
     não o `c` montado aqui. No navegador, com o tema escuro ligado, a
     diferença não aparecia; no telefone de quem está no claro, os títulos
     dos tópicos e os preços saíam em tinta escura sobre o fundo escuro, e
     a tela chegou a ficar ilegível em produção de teste.

     Quatro textos estavam assim. Se você acrescentar um `Txt` aqui e
     esquecer o `c`, ele volta a sumir — e some só para quem usa o
     aplicativo no claro, que é o jeito mais silencioso de um defeito
     existir.

     ⚠️ MAS A COR DE AÇÃO É A CLARA, E NÃO A DO MODO ESCURO.

     Cada paleta tem dois tons de ação: o cheio, que é o do Figma e o da
     marca — #065CF5 no azul —, e um mais claro que o tema escuro usa
     para não afundar num fundo já escuro. Fixar o modo trouxe o segundo
     junto, e o botão desta tela apareceu num azul que não é o da marca.

     O motivo do tom claro existir não vale aqui: ele serve a telas
     escuras em que a cor precisa competir com muito conteúdo. Esta tela
     é quase toda preta, e o azul cheio salta nela do mesmo jeito que
     salta no claro — com a vantagem de ser o azul que a pessoa viu na
     loja, no ícone e na abertura.

     Então o modo é escuro e a cor de ação é a da marca. O resto da
     paleta escura fica como está: fundo, tinta, fios e o lima. */
  const c = React.useMemo(() => {
    const base = comPaleta(dark, (S as any).paleta, true);
    const pal = paletaDe((S as any).paleta);
    return {
      ...base,
      accent: pal.acaoClara,
      /* No escuro o segundo tom clareia, e é ele que veste link e texto
         sobre fundo preto — a mesma regra do resto do aplicativo. */
      accent2: mix(pal.acaoClara, '#FFFFFF', 0.22),
      accentInk: pal.inkClaro,
      accentWeak: alfa(pal.acaoClara, 0.22),
      accentLine: alfa(pal.acaoClara, 0.38),
    };
  }, [(S as any).paleta]);
  const insets = useSafeAreaInsets();

  /* ⚠️ O X PRECISA FUNCIONAR NAS DUAS ENTRADAS.

     Quem chega pelo fim do cadastro chega por `replace`: não há tela
     atrás, e um `back` puro não faria nada — o botão de fechar de uma
     tela que pede dinheiro é o último lugar do aplicativo onde um toque
     pode não responder. Havendo história, volta; não havendo, entra no
     aplicativo, que é para onde essa pessoa ia de qualquer jeito. */
  const fechar = () => {
    if (router.canGoBack()) router.back();
    else router.replace('/(tabs)' as any);
  };

  const aurora = useAurora();
  const [escolhido, setEscolhido] = React.useState<Plano['id']>(RECOMENDADO);
  /* ⚠️ QUEM É ISENTA TAMBÉM PODE QUERER VER O PREÇO, e até aqui não
     podia: a tela dela era uma folha só, com "você não paga" e nenhuma
     saída. Era um beco, e um beco em cima da única pergunta que essa
     pessoa tem motivo para fazer — quanto custaria se o vínculo
     terminasse. Os próprios Termos prometem avisá-la antes de qualquer
     cobrança começar; esconder o valor até lá é prometer um aviso sobre
     um número secreto. */
  const [verPrecos, setVerPrecos] = React.useState(false);
  /* A barra é medida, e não estimada: o texto miúdo muda de altura com o
     plano escolhido e com o tamanho de fonte do sistema, e um número
     chutado aqui deixaria a última linha do rolo escondida atrás dela
     justamente para quem aumentou a letra. */
  const [alturaDaBarra, setAlturaDaBarra] = React.useState(230);

  /* ⚠️ O CÓDIGO ENTRA AQUI, E NÃO NUMA TELA AO LADO.

     Ele já tem casa em /parceiros, que explica o que o vínculo muda. Mas
     quem chega ao paywall com o código do consultório na mão quer digitar
     AGORA: mandá-la para uma tela de explicação primeiro é pedir que ela
     leia sobre a coisa que já veio decidida a fazer.

     E fica na área fixa pelo mesmo motivo que o preço fica: é uma das
     duas saídas desta tela, e a outra está a um dedo de distância. Quem
     tem código não deveria precisar rolar para não pagar.

     Fechado, é uma linha. Só vira campo quando alguém diz que tem um —
     um teclado aberto embaixo de um botão de compra é a tela tentando
     fazer duas coisas ao mesmo tempo. */
  /* ⚠️ PORTA DE DESENVOLVIMENTO — `?compra=1`.

     A semente é a Mariana, que tem clínica parceira, e por isso a tela
     abre no estado isento em toda conferência: não havia como olhar a
     versão que cobra sem editar o estado à mão.

     Este parâmetro NÃO muda nada do que está guardado. Ele só finge, para
     o desenho desta tela, que não há vínculo — e só responde em build de
     desenvolvimento. Em produção `__DEV__` é falso e a linha inteira
     desaparece na compilação, junto com a linha do perfil que leva aqui.

     Ver PENDENCIAS.md, item 5: quando a cobrança existir, isto sai. */
  const { compra } = useLocalSearchParams<{ compra?: string }>();
  const fingindoPagante = __DEV__ && compra === '1';

  const guardado = ((S.profile as any).convite as string) || '';
  const [recusa, setRecusa] = React.useState(false);

  const plano = PLANOS.find((x) => x.id === escolhido)!;
  const ehIsenta = isento(S) && !fingindoPagante;

  const comprar = async () => {
    const r = await assinar(escolhido);
    if (!r.ok) setRecusa(true);
  };

  /* Quem tem vínculo não vê preço. Ela não está fora de uma oferta: está
     dentro do acordo que a clínica já fez por ela, e os Termos prometem
     aviso antes de qualquer cobrança começar. */
  if (ehIsenta && !verPrecos) {
    return (
      <View style={{ flex: 1, backgroundColor: c.bg, paddingTop: insets.top + 12 }}>
        <Row style={{ paddingHorizontal: 20, justifyContent: 'flex-end' }}>
          <Pressable onPress={fechar} hitSlop={10}>
            <View style={{ width: 36, height: 36, borderRadius: 18, backgroundColor: c.bg1, alignItems: 'center', justifyContent: 'center' }}>
              <Icon name="x" size={16} color={c.tx2} sw={2.2} />
            </View>
          </Pressable>
        </Row>
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: 32, gap: 14 }}>
          <IconeDoApp lado={64} />
          <Txt v="h2" c={c.tx} style={{ textAlign: 'center' }}>Você não paga pelo aplicativo</Txt>
          <Txt v="note" c={c.tx3} style={{ textAlign: 'center', lineHeight: 22 }}>
            O acesso vem do seu vínculo com {S.profile.clinic || 'a clínica que acompanha você'}, e
            vale enquanto ele durar. Se ele terminar, avisamos antes de qualquer cobrança.
          </Txt>
          <Pressable
            onPress={() => setVerPrecos(true)}
            hitSlop={8}
            style={({ pressed }) => [{ marginTop: 6, opacity: pressed ? 0.6 : 1 }]}
          >
            <Txt v="label" c={c.accent2}>Ver os planos mesmo assim</Txt>
          </Pressable>
        </View>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: c.bg }}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: alturaDaBarra + 24 }}>
        {/* ---- o alto ----

            ⚠️ A AURORA, E NÃO UM FUNDO CHAPADO. As telas de plano que se
            copiam por aí abrem com gradiente, orbe ou foto — e a razão é
            boa: uma tela que pede dinheiro precisa parecer o produto, e
            não um formulário. Só que o gradiente delas é decoração
            genérica; este é a mesma imagem que abre a Home e o Insights,
            na cor que a pessoa escolheu.

            É a diferença entre "parece um app bonito" e "é o app que eu
            estou usando", e é de graça: a peça já existe, já segue a
            paleta e já veste o resto do aplicativo. */}
        <View style={{ paddingTop: insets.top, paddingHorizontal: 20, paddingBottom: 8 }}>
          {/* ⚠️ A AURORA TERMINA EXATAMENTE ONDE A PEÇA TERMINA, e isso não
              é estética: é o que impede um corte seco.

              Antes ela cobria o alto inteiro e ia se apagando até o fim do
              bloco — só que o bloco acaba muito depois da peça, lá embaixo
              no subtítulo. Na altura em que a janela da peça fechava, o
              véu ainda estava aceso: dentro da janela o desvanecimento
              pintava preto puro, e um pixel abaixo dela voltava a aurora.
              Dava uma risca reta atravessando a tela de ponta a ponta.

              ⚠️ E A CORREÇÃO NÃO PODE SER UMA FRAÇÃO CHUTADA. Bastaria
              mandar o gradiente chegar ao preto em "62%" para a risca
              sumir hoje — e voltar no dia em que o subtítulo ganhasse uma
              linha e mudasse a altura do bloco. Então a aurora ganha
              altura própria, a mesma da peça, e as duas chegam ao fundo
              da página no mesmo pixel por construção. Uma conta só, e ela
              vem de MOCKUP_JANELA. */}
          <View
            style={{ position: 'absolute', left: 0, right: 0, top: 0, height: insets.top + MOCKUP_JANELA }}
            pointerEvents="none"
          >
            <Image source={aurora.hero} style={StyleSheet.absoluteFill} contentFit="cover" />
            <LinearGradient
              colors={[alfa(c.veu, 0.55), alfa(c.veu, 0.34), c.bg]}
              locations={[0, 0.5, 0.94]}
              style={StyleSheet.absoluteFill}
              pointerEvents="none"
            />
          </View>

          {/* ⚠️ AQUI FICAVA A MARCA, E ELA SAIU DE PROPÓSITO.

              O argumento para tê-la era bom: numa tela que pede dinheiro,
              quem cobra aparece com nome e tudo. O argumento contra é que
              a pessoa acabou de sair do aplicativo para chegar aqui — ela
              sabe de quem é a tela —, e o lockup custava sessenta pixels
              da única dobra que existe, empurrando o título para debaixo
              da barra de decisão.

              ⚠️ ENTÃO A PEÇA É A PRIMEIRA COISA, e é ela quem se apresenta:
              a marca continua na tela, dentro do aparelho fotografado, do
              jeito que a pessoa vê todo dia. Quem quiser o lockup de volta
              precisa achar os sessenta pixels em outro lugar — encolher a
              janela do aparelho é o candidato óbvio.

              ⚠️ E O X MORA NESTE CANTO. Ele é fixo, em cima à direita, e a
              peça passa por baixo dele: a arte tem respiro nas laterais,
              então o que fica sob o botão é fundo. Trocar a peça por uma
              sangrada até a borda traz o problema de volta. */}
          <PecaDoAlto c={c} />

          <View style={{ alignItems: 'center', gap: 10 }}>
            {/* ⚠️ "DE VERDADE" EM LIMA, e só isso. O lima é a cor do
                alcançado no resto do aplicativo — a meta batida, o
                check-in feito —, e aqui ela cai exatamente sobre a
                diferença que a frase está afirmando. Duas palavras; a
                terceira faria o título virar decoração.

                DUAS LINHAS, E O CORPO MEDIDO PARA CABEREM. A frase tem
                duas metades de vinte e um caracteres cada, e em h1 cheio
                (36 px) a segunda estourava a largura e quebrava sozinha
                num terceiro pedaço — "acompanha de / verdade.", com duas
                palavras órfãs embaixo.

                31 px, e o número é medido e não chutado. Num telefone de
                375 pt sobram 335 px de linha; as duas metades pedem 321 e
                323 px a 31, 332 e 334 a 32, e 343 a 33 — onde a frase
                quebra de novo. A 32 caberia por um pixel, que não é folga:
                é sorte, e some no primeiro aparelho mais estreito ou com
                o texto do sistema um passo maior. */}
            <Txt
              v="h1"
              c="#FFFFFF"
              style={{ textAlign: 'center', letterSpacing: -0.8, fontSize: 31, lineHeight: 38 }}
            >
              Tudo muda quando você{'\n'}acompanha{' '}
              <Txt v="h1" c={c.lime} style={{ fontSize: 31, lineHeight: 38 }}>de verdade.</Txt>
            </Txt>
            <Txt v="note" c="rgba(255,255,255,0.78)" style={{ textAlign: 'center', lineHeight: 22 }}>
              Seus dados reunidos, a sua evolução organizada, e clareza em cada etapa do
              tratamento.
            </Txt>
          </View>
        </View>

        <View style={{ paddingHorizontal: 20, marginTop: 18 }}>
        {/* ⚠️ AQUI HAVIA UMA FAIXA — "Você não paga nada hoje" — e ela
            repetia a tela anterior. Quem é isenta só chega nesta vista
            depois de ler, em corpo grande, que não paga pelo aplicativo e
            por quê; dizer de novo, num aviso, é o app achando que ela não
            leu. O que muda para ela não é o texto: é não ter botão. */}
        {/* ⚠️ UMA LINHA POR ITEM, E NÃO UM PARÁGRAFO.

            Cada um destes já foi uma frase de duas linhas — "o registro do
            dia inteiro, peso, aplicações, sintomas, água, proteína e
            movimento" —, e cinco parágrafos empilhados numa tela de preço
            é o texto que ninguém lê exatamente onde a pessoa mais precisa
            entender. A lista é uma varredura, não uma leitura. */}
        <View style={{ gap: 18, marginTop: 6 }}>
          {ENTRA.map(([ic, t, sub]) => (
            <Row key={t} gap={14} style={{ alignItems: 'flex-start' }}>
              {/* A PASTILHA VOLTA AQUI, e só aqui. No resto do app o ícone
                  fica solto na lista; nesta o item tem duas linhas, e sem
                  a caixa o desenho flutuava ao lado de um bloco de texto
                  em vez de ancorá-lo.

                  ⚠️ E ELA É UM VÉU BRANCO, e não o `bg1` da paleta. Num
                  fundo quase preto, o cinza de cartão do tema escuro fica
                  a três pontos do fundo: a caixa existia no código e não
                  na tela. O véu sobe com o fundo, seja ele qual for. */}
              <View style={{
                width: 38, height: 38, borderRadius: radius.md,
                backgroundColor: 'rgba(255,255,255,0.09)',
                alignItems: 'center', justifyContent: 'center',
              }}>
                <Icon name={ic} size={18} color={c.accent} sw={1.9} />
              </View>
              <View style={{ flex: 1 }}>
                <Txt v="bodyMed" c={c.tx}>{t}</Txt>
                <Txt v="caption" c={c.tx3} style={{ marginTop: 2, lineHeight: 19 }}>{sub}</Txt>
              </View>
            </Row>
          ))}
        </View>

        {/* O FIO SEPARA O QUE VEM DO QUE CUSTA. Sem ele a lista e os
            preços viram um bloco só, e a pessoa lê o valor antes de ter
            terminado de ler o que ele compra. */}
        <View style={{ height: StyleSheet.hairlineWidth, backgroundColor: c.line, marginTop: 24 }} />

        <Row gap={16} style={{ marginTop: 24, justifyContent: 'center' }}>
          {([
            ['Restaurar compras', null],
            ['Termos', '/documento?id=termos'],
            ['Privacidade', '/documento?id=privacidade'],
          ] as [string, string | null][]).map(([rotulo, to]) => (
            <Pressable
              key={rotulo}
              onPress={() => { if (to) router.push(to as any); else setRecusa(true); }}
              hitSlop={8}
              style={({ pressed }) => [{ opacity: pressed ? 0.6 : 1 }]}
            >
              <Txt v="micro" c={c.tx3}>{rotulo}</Txt>
            </Pressable>
          ))}
        </Row>

        </View>
      </ScrollView>

      {/* ---- a barra de decisão ---- */}
      <View style={{ position: 'absolute', left: 0, right: 0, bottom: 0 }} pointerEvents="box-none">
        <LinearGradient
          colors={['transparent', c.bg]}
          style={{ height: 22 }}
          pointerEvents="none"
        />
        <View
          onLayout={(e) => setAlturaDaBarra(e.nativeEvent.layout.height)}
          style={{ backgroundColor: c.bg, paddingHorizontal: 20, paddingTop: 2, paddingBottom: insets.bottom + 12 }}
        >
          {/* ---- os planos ---- */}
          {/* ⚠️ OS DOIS CARTÕES TÊM A MESMA ALTURA, e agora sem `minHeight`.

              Dois cartões lado a lado com alturas diferentes dizem, antes
              de qualquer texto, que um vale mais do que o outro — e a
              escolha já é sinalizada pela cor e pela borda, que é onde ela
              deve ser feita.

              Antes isso custava um piso de 106 px: o anual tinha um dado a
              mais e o mensal precisava de uma linha para alcançá-lo. Agora
              os dois têm exatamente as mesmas três linhas — nome, preço,
              equivalente —, então `flex: 1` dentro de uma Row esticada
              basta, e a altura passa a ser a que o conteúdo pede. Mexer no
              conteúdo de um lado só traz o piso de volta. */}
          <Row gap={10} style={{ alignItems: 'stretch' }}>
            {PLANOS.map((p) => {
              const on = p.id === escolhido;
              return (
                <Pressable key={p.id} onPress={() => { setEscolhido(p.id); setRecusa(false); }} style={{ flex: 1 }}>
                  <View style={{
                    flex: 1,
                    backgroundColor: on ? c.accentWeak : c.bg1,
                    borderWidth: 1.5, borderColor: on ? c.accent : c.line,
                    borderRadius: radius.lg, padding: 12, gap: 2, justifyContent: 'center',
                  }}>
                    <Row style={{ justifyContent: 'space-between', alignItems: 'center' }}>
                      <Txt v="label" c={on ? c.accent2 : c.tx2}>{p.nome}</Txt>
                      {p.economia ? (
                        <View style={{ backgroundColor: on ? c.accent : c.bg3, borderRadius: radius.pill, paddingHorizontal: 8, paddingVertical: 3 }}>
                          <Txt v="micro" c={on ? c.accentInk : c.tx3}>−{p.economia}%</Txt>
                        </View>
                      ) : null}
                    </Row>
                    {/* ⚠️ O NÚMERO GRANDE É O QUE A LOJA COBRA, e não o
                        equivalente mensal. Estava ao contrário: o anual
                        anunciava R$ 16,66 em corpo grande e escondia os
                        R$ 299,00 numa linha miúda embaixo — que é
                        exatamente "a conta que o anúncio faz e a fatura
                        desmente", escrita por mim no comentário de cima
                        enquanto eu fazia a conta do anúncio.

                        Agora o corpo grande é a cobrança e o equivalente
                        por mês vem embaixo, onde ele é o argumento que é:
                        uma ajuda para comparar, e não o preço. */}
                    {/* ⚠️ O PERÍODO ENCOSTA NO NÚMERO, e não mora numa linha
                        própria. "R$ 49,90" sozinho não é um preço, é um
                        valor; o preço é "R$ 49,90 por mês", e separar as
                        duas coisas em duas linhas fazia o olho ler o número
                        grande primeiro e a condição depois — que é a ordem
                        de quem anuncia, não a de quem compra.

                        ALINHADO PELA BASE, e não pelo centro: o sufixo é um
                        terço do corpo do número, e centralizado ele flutua
                        no meio do algarismo. `baseline` é do Yoga e vale
                        nos dois lados, não é um truque de navegador. */}
                    <Row gap={2} style={{ alignItems: 'baseline', marginTop: 4 }}>
                      {/* ⚠️ O CORPO É MEDIDO, E A MEDIDA É APERTADA. Dentro de
                          um cartão de 163 px sobram 137 px de linha, e o
                          preço mais largo que os dois planos podem produzir
                          — "R$ 299,00", com três algarismos gordos — pede
                          107 px em h2 cheio. Com o "/ano" ao lado dá 135, e
                          a 23 px com `padding: 14` dava 136 contra 133: a
                          linha quebrava e o cartão anual crescia sozinho.

                          22 px com o rastro fechado devolve 9 px de folga,
                          que é o que sobrevive à diferença de desenho entre
                          a web e o aparelho. `numberOfLines` é o cinto de
                          segurança: se um preço maior aparecer um dia, ele
                          aperta em vez de empurrar a altura do cartão —
                          mas quem passar dos R$ 999,00 tem que voltar aqui. */}
                      <Txt v="h2" c={c.tx} numberOfLines={1} style={{ fontSize: 22, letterSpacing: -0.3 }}>{reais(p.preco)}</Txt>
                      <Txt v="micro" c={c.tx3} numberOfLines={1}>{p.sufixo}</Txt>
                    </Row>
                    <Txt v="micro" c={c.tx4} style={{ marginTop: 2 }}>
                      {`${reais(p.outraUnidade.valor)} ${p.outraUnidade.periodo}`}
                    </Txt>
                  </View>
                </Pressable>
              );
            })}
          </Row>

          {/* Aqui havia "São R$ 158,90 a menos que no mensal". Saiu com a
              chegada do teste grátis: a barra passou a ter o preço, a
              promessa do teste e as duas garantias disputando o mesmo
              lugar, e o desconto é o menos urgente dos quatro. O "−50%"
              no cartão diz a mesma coisa em dois caracteres. */}

          {ehIsenta ? null : recusa ? (
            /* ⚠️ A RECUSA HONESTA. Enquanto a loja não está ligada, o botão
               responde o que é verdade — e não com um erro genérico, que
               faria a pessoa tentar de novo. */
            <View style={{ marginTop: 12, backgroundColor: c.bg1, borderRadius: radius.lg, padding: 16, gap: 5 }}>
              <Txt v="bodyMed" c={c.tx}>A assinatura ainda não está ligada</Txt>
              <Txt v="caption" c={c.tx3} style={{ lineHeight: 19 }}>
                Esta tela existe, a cobrança ainda não. Nada foi cobrado de você, e o aplicativo
                segue inteiro do jeito que está.
              </Txt>
            </View>
          ) : null}
          {/* ⚠️ QUEM É ISENTA VÊ O PREÇO E NÃO VÊ O BOTÃO.

              Ela veio saber quanto custa — é a pergunta que os Termos
              prometem responder antes de qualquer cobrança começar —, e
              não comprar o que já tem. Um botão de assinar aqui venderia
              a ela a mesma coisa duas vezes, e a letra miúda falaria de
              uma renovação que não existe no caso dela.

              Sai o botão, sai a letra miúda, sai o campo do código: os
              três são da compra, e não do preço. Fica o que ela veio
              ver. */}
          {ehIsenta ? null : (
            <>
              <Pressable onPress={comprar} style={({ pressed }) => [{ marginTop: 14, opacity: pressed ? 0.85 : 1 }]}>
                <View style={{ backgroundColor: c.accent, borderRadius: radius.pill, paddingVertical: 16, alignItems: 'center' }}>
                  <Txt v="body" c={c.accentInk} style={{ fontFamily: font.bodyMed }}>
                    {TESTE_DIAS > 0 ? `Começar os ${TESTE_DIAS} dias grátis` : `Assinar — ${reais(plano.preco)}`}
                  </Txt>
                </View>
              </Pressable>

              {/* ⚠️ AS DUAS GARANTIAS, E O PREÇO JUNTO COM ELAS.

                  A referência põe "cancele quando quiser" e "sem
                  compromisso" embaixo do botão, e funciona: são as duas
                  perguntas que seguram o dedo. Mas ela para aí, e é aí que
                  um teste grátis vira reclamação — quem começa sem saber
                  quanto vem depois descobre pela fatura.

                  Então as garantias vêm com o número: o que é grátis, por
                  quantos dias, quanto custa depois, e que cancelar antes
                  não cobra nada. É a mesma frase que a loja vai mostrar na
                  folha de compra, dita antes dela. */}
              <Row gap={16} style={{ marginTop: 12, justifyContent: 'center' }}>
                {['Cancele quando quiser', 'Sem compromisso'].map((t) => (
                  <Row key={t} gap={5} style={{ alignItems: 'center' }}>
                    <Icon name="check" size={12} color={c.lime} sw={2.6} />
                    <Txt v="micro" c={c.tx3}>{t}</Txt>
                  </Row>
                ))}
              </Row>

              <Txt v="micro" c={c.tx4} style={{ marginTop: 8, textAlign: 'center', lineHeight: 16 }}>
                {TESTE_DIAS > 0
                  ? `Depois de ${TESTE_DIAS} dias, ${reais(plano.preco)} ${plano.periodo}. Cancele antes e não paga nada.`
                  : `${reais(plano.preco)} ${plano.periodo}, renovando até você cancelar.`}
              </Txt>
            </>
          )}

          {/* ---- o código do parceiro ---- */}
          {/* ⚠️ O CÓDIGO ABRE UMA FOLHA, e não um campo aqui dentro.

              Ele já foi um campo nesta barra, e o problema não era o
              campo: era onde ele abria. Esta é a área de decisão, ancorada
              no pé, e o teclado sobe exatamente por cima dela — a pessoa
              digitava com o botão de assinar encostado no dedo e o preço
              sumindo atrás do teclado.

              Na folha o teclado empurra em vez de cobrir, e fechar devolve
              a pessoa aqui, com o código guardado dito nesta mesma linha. */}
          {TEM_REDE_PARCEIRA && !ehIsenta ? (
            <View style={{ marginTop: 14 }}>
              {guardado ? (
                <Pressable onPress={() => router.push('/codigo' as any)} hitSlop={8} style={({ pressed }) => [{ opacity: pressed ? 0.6 : 1 }]}>
                  <Row gap={8} style={{ justifyContent: 'center', alignItems: 'center' }}>
                    <Icon name="check" size={14} color={c.lime} sw={2.4} />
                    <Txt v="micro" c={c.tx3}>Código {guardado} guardado</Txt>
                  </Row>
                </Pressable>
              ) : (
                <Pressable
                  onPress={() => router.push('/codigo' as any)}
                  hitSlop={8}
                  style={({ pressed }) => [{ opacity: pressed ? 0.6 : 1 }]}
                >
                  <Row gap={7} style={{ justifyContent: 'center', alignItems: 'center' }}>
                    <Icon name="steth" size={14} color={c.accent2} sw={1.9} />
                    <Txt v="label" c={c.accent2}>Tenho um código de convite</Txt>
                  </Row>
                </Pressable>
              )}
            </View>
          ) : null}

        </View>
      </View>

      {/* O X FICA POR CIMA DE TUDO, e não dentro do rolo: numa tela que
          pede dinheiro, a saída não pode depender de rolar de volta até o
          alto. Seta diria "volte um passo"; X diz "isto é uma interrupção,
          e você pode encerrá-la", que é quem está no comando. */}
      <Pressable
        onPress={fechar}
        hitSlop={10}
        style={({ pressed }) => [{
          position: 'absolute', top: insets.top + 12, right: 20, opacity: pressed ? 0.6 : 1,
        }]}
      >
        <View style={{ width: 36, height: 36, borderRadius: 18, backgroundColor: 'rgba(255,255,255,0.16)', alignItems: 'center', justifyContent: 'center' }}>
          <Icon name="x" size={16} color="#FFFFFF" sw={2.2} />
        </View>
      </Pressable>
    </View>
  );
}
