import React from 'react';
import { View, Pressable, ScrollView, StyleSheet, useWindowDimensions } from 'react-native';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Path } from 'react-native-svg';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useStore } from '../logic/store';
import { PLANOS, RECOMENDADO, TESTE_DIAS, reais, isento, assinar, type Plano } from '../logic/assinatura';
import { useAurora } from '../ui/aurora';
import { TEM_REDE_PARCEIRA } from '../logic/mercado';
import { Marca, D_SIMBOLO, RAZAO_SIMBOLO } from '../ui/marca';
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
   — a marca, a promessa, o que vem junto, a letra miúda, o código —
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

   O ARQUIVO É WEBP DE 1200 px, e não o PNG de 4000 que chegou: renderizada
   a 375 pt, a peça nunca precisa de mais do que 1200 px mesmo em tela de
   3×, e a conversão levou 2,4 MB para 50 KB sem diferença visível. É a
   mesma régua das auroras, em src/ui/aurora.ts.
   ============================================================ */
const MOCKUP = require('../../assets/images/mockup-planos.webp');

/* 4000×3000 na origem. A altura sai da proporção e não de um número
   escrito à mão: trocar a peça por uma de outro formato não deve exigir
   caçar um `height` perdido aqui dentro. */
const MOCKUP_PROPORCAO = 4 / 3;

/* ⚠️ A ARTE É MAIS LARGA DO QUE A TELA, DE PROPÓSITO.

   O telefone ocupa 46% da largura do quadro: medido com sharp, são 556
   px de aparelho num quadro de 1200. Desenhada na largura da tela, a
   peça rendia um telefone de 173 px com dois vazios de 100 px dos lados
   — o respiro da arte somado ao respiro da tela, duas vezes a mesma
   coisa.

   Ela é desenhada a 1,2× e recuada pela metade da sobra. A arte sangra
   para fora nos dois lados, onde só há transparência, e o aparelho
   chega a 208 px sem custar altura proporcional. Mexer no número é uma
   linha, e não uma reexportação. */
const MOCKUP_ESCALA = 1.2;

function PecaDoAlto() {
  const { width } = useWindowDimensions();
  const larg = width * MOCKUP_ESCALA;
  return (
    <Image
      source={MOCKUP}
      style={{
        width: larg,
        height: larg / MOCKUP_PROPORCAO,
        marginTop: 2,
        marginHorizontal: -(larg - width) / 2,
      }}
      contentFit="contain"
    />
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
        <View style={{ paddingTop: insets.top + 12, paddingHorizontal: 20, paddingBottom: 22 }}>
          <Image source={aurora.hero} style={StyleSheet.absoluteFill} contentFit="cover" />
          <LinearGradient
            colors={[alfa(c.veu, 0.55), alfa(c.veu, 0.34), c.bg]}
            locations={[0, 0.5, 1]}
            style={StyleSheet.absoluteFill}
            pointerEvents="none"
          />

          {/* ⚠️ A MARCA, E NÃO O ÍCONE DO APLICATIVO.

              O ícone é o quadrado com gradiente que mora na tela inicial
              do telefone: ele serve para ser achado entre outros ícones,
              e é por isso que tem moldura. Dentro do próprio aplicativo
              ele vira o retrato de uma coisa que a pessoa já está usando
              — e numa tela que pede dinheiro, o que precisa aparecer é
              quem cobra, com nome e tudo.

              A marca por extenso é o lockup, com o símbolo em lima e o
              letreiro em branco. É a mesma peça da abertura do cadastro,
              que foi a última vez que essa pessoa viu o nome. */}
          <View style={{ alignItems: 'center', gap: 10, marginTop: 30 }}>
            <Marca altura={22} />
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

        <PecaDoAlto />

        <View style={{ paddingHorizontal: 20, marginTop: 26 }}>
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
          {/* ⚠️ OS DOIS CARTÕES TÊM A MESMA ALTURA, e isso precisou de uma
              linha a mais no mensal, e não de um `height` fixo.

              O anual carrega um terceiro dado — o preço cheio do ano — e
              por isso crescia; com `minHeight` ele passava do piso e o
              mensal ficava. Dois cartões lado a lado com alturas diferentes
              dizem, antes de qualquer texto, que um vale mais do que o
              outro — e a escolha já é sinalizada pela cor e pela borda, que
              é onde ela deve ser feita.

              A linha nova do mensal não é enchimento: "cobrado todo mês" é
              a informação que o anual dá em "R$ 199,90 por ano", e faltava
              do lado de cá. */}
          <Row gap={10} style={{ alignItems: 'stretch' }}>
            {PLANOS.map((p) => {
              const on = p.id === escolhido;
              return (
                <Pressable key={p.id} onPress={() => { setEscolhido(p.id); setRecusa(false); }} style={{ flex: 1 }}>
                  <View style={{
                    backgroundColor: on ? c.accentWeak : c.bg1,
                    borderWidth: 1.5, borderColor: on ? c.accent : c.line,
                    borderRadius: radius.lg, padding: 14, gap: 2, minHeight: 106, justifyContent: 'center',
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
                        R$ 199,90 numa linha miúda embaixo — que é
                        exatamente "a conta que o anúncio faz e a fatura
                        desmente", escrita por mim no comentário de cima
                        enquanto eu fazia a conta do anúncio.

                        Agora o corpo grande é a cobrança e o equivalente
                        por mês vem embaixo, onde ele é o argumento que é:
                        uma ajuda para comparar, e não o preço. */}
                    <Txt v="h2" c={c.tx} style={{ marginTop: 4 }}>{reais(p.preco)}</Txt>
                    <Txt v="micro" c={c.tx3}>{p.periodo}</Txt>
                    <Txt v="micro" c={c.tx4} style={{ marginTop: 3 }}>
                      {p.id === 'anual' ? `${reais(p.porMes)} por mês` : 'cobrado todo mês'}
                    </Txt>
                  </View>
                </Pressable>
              );
            })}
          </Row>

          {/* Aqui havia "São R$ 158,90 a menos que no mensal". Saiu com a
              chegada do teste grátis: a barra passou a ter o preço, a
              promessa do teste e as duas garantias disputando o mesmo
              lugar, e o desconto é o menos urgente dos quatro. O "−44%"
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
