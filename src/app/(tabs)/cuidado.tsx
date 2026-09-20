import React from 'react';
import { View, Pressable, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Image } from 'expo-image';
import Svg, { Defs, Ellipse, RadialGradient, Stop } from 'react-native-svg';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useStore } from '../../logic/store';
import {
  clinicaConectada, temAcompanhamento, nextConsult, lastMessage, carePending, careState,
  examesComValor, examesForaDaRef,
  doseContext, doseCycle, penStock, weekGrid, M, cadenciaCurta,
  medComDose, fichaDe,
} from '../../logic/derive';
import { Nivel, Malha } from '../../ui/instrumentos';
import { fmtDate, DOW_PT } from '../../logic/time';
import { Txt, Row, SectionHead, Divider, ListRow, Chevron } from '../../ui/kit';
import { Icon } from '../../ui/Icon';
import { TEM_REDE_PARCEIRA } from '../../logic/mercado';
import { useTheme } from '../../ui/useTheme';
import { radius } from '../../theme';
import { fotoDe, focoDe } from '../../ui/retratos';

/* ============================================================
   CUIDADO — a aba das pessoas

   As outras três abas são sobre dados: a Home mostra o dia, a Jornada a
   história, o Insights a interpretação. Esta é sobre quem cuida.

   A tela nasceu sem hero colorido, apostando que a identidade viria da
   ausência — fundo claro e muito ar. Não veio: sem cor a aba lia como
   prontuário, que é exatamente o oposto do que ela deve transmitir. O
   hero voltou, mas com linguagem própria: malha de degradê em vez da
   rampa da Jornada, e da aurora fotográfica do Insights.

   Duas telas dentro de uma. Com clínica vinculada, é o painel do
   acompanhamento; sem vínculo, é a porta de entrada para encontrar um
   especialista — e nesse caso nada aqui finge que já existe uma equipe.
   ============================================================ */

const PAD = 24;
/* ⚠️ VEM DE `RETRATOS`, e era um `require` escrito aqui. A mesma foto
   aparecia por três caminhos diferentes — esta aba, a Home e o Perfil —
   e cada uma tinha a sua linha. No dia em que a clínica mandar a foto
   dela, uma das três ia ficar para trás, e seria a que ninguém abre com
   frequência. Agora há um mapa e três leitores. */
const FOTO_MEDICA = fotoDe('responsavel');

/* ------------------------------------------------------------------ *
 * COM VÍNCULO
 * ------------------------------------------------------------------ */

/* A Malha mudou para ui/instrumentos: ela serve a qualquer tela, não
   só a esta. */

/* A régua das semanas — um traço por semana, aberta à direita — morava
   aqui, dentro do hero. Ela estava certa como instrumento: crescia com a
   pessoa e o futuro se dissolvia na borda, sem prometer alta.

   Saiu por divisão de papéis entre as abas. Contar quanto tempo passou e
   como isso avança é a Jornada; Cuidado é o estado agora e o que precisa
   de mim. A régua narrava — e narrativa repetida em duas abas enfraquece
   as duas. Fica registrada aqui porque o dia em que a Jornada precisar
   de uma linha do tempo compacta, é esta. */

/** O topo — a leitura do estado, não o painel dele.

    Três versões atrás isto era a ficha da médica. Depois virou um painel:
    frase de estado, número grande, régua das semanas, data desde quando,
    e uma faixa de vidro com a próxima consulta. Cada peça se justificava
    sozinha e o conjunto não: quem abre a aba faz UMA pergunta — "como
    está meu acompanhamento agora?" — e um bloco que responde cinco coisas
    não responde nenhuma primeiro.

    O que saiu e por quê:

    A régua contava a história do tratamento, e história é a Jornada. Duas
    abas narrando a mesma evolução deixam as duas mais fracas: aqui ela
    ocupava 34 px de altura para dizer o que o "10 semanas" já dizia.

    A consulta saiu porque tem seção própria trinta linhas abaixo, com
    data, tipo, especialista e preparação. Repetida no hero, ela roubava o
    lugar da manchete e ainda chegava pior — sem nada do que a torna útil.

    O que ficou é uma frase que muda com o momento (`careState`), três
    números pequenos de contexto e um pulso discreto. O hero deixou de ser
    dashboard e voltou a ser leitura. */
function Topo() {
  const S = useStore((s) => s.S);
  const { c } = useTheme();
  const router = useRouter();
  const st = careState(S);
  const cs = nextConsult(S);

  /* O pulso muda de cor com o nível, e é a única cor de estado do card.
     Verde não existe na paleta como cor de dado; lima é a cor de "está
     indo bem" no app inteiro, e sobre campo escuro ela lê como sinal
     aceso — que é exatamente o que um indicador de estado precisa ser. */
  const corPulso = st.nivel === 'acao'
    /* âmbar fixo e não c.amber: o token claro é #B58900, escolhido para
       contrastar sobre branco, e sobre este campo escuro ele apaga. O
       card é sempre escuro nos dois temas, então a cor do sinal também
       é sempre a mesma. */
    ? '#E7BE55'
    : st.nivel === 'atencao' ? c.bluePale : c.lime;

  return (
    <View style={{ borderRadius: radius.xl, overflow: 'hidden', backgroundColor: c.altMid }}>
      <Malha id="cuidadoTopo" forca={1} escura />

      <View style={{ paddingHorizontal: 24, paddingTop: 24, paddingBottom: 24 }}>
        {/* O pulso é o kicker.

            Ele estava no pé do card, numa linha só dele, e dizia "3 itens
            pendentes" — a mesma coisa que o parágrafo logo acima já
            dizia por extenso. Duas frases sobre o mesmo fato, a uma tela
            de distância uma da outra, é a redundância que esta rodada
            veio caçar.

            Como kicker ele deixa de repetir e passa a anunciar: o sinal
            aparece ANTES da manchete, que é a ordem em que se lê um
            estado — primeiro a luz acesa, depois o que ela significa. A
            adesão fecha a linha do outro lado, onde qualificador cabe sem
            competir. */}
        <Row gap={9}>
          <View style={{ width: 7, height: 7, borderRadius: 4, backgroundColor: corPulso }} />
          <Txt v="micro" c={c.onHero2} style={{ letterSpacing: 1.1, flex: 1 }}>
            {st.pulso.toUpperCase()}
          </Txt>
          {/* A adesão em tag e não em texto solto.

              Solta no fim da linha ela lia como continuação do pulso — duas
              informações diferentes na mesma frase, e a segunda parecendo
              complemento da primeira. "3 itens pendentes · Boa adesão" não
              é uma frase; são dois vereditos sobre coisas distintas, um de
              atenção e outro de mérito.

              A cápsula os separa sem precisar de divisor: forma fechada
              lê como unidade, e o que está dentro dela deixa de pertencer
              ao que está fora. */}
          <View style={{ backgroundColor: c.glass, borderWidth: 1, borderColor: c.glassLine, borderRadius: radius.pill, paddingHorizontal: 10, paddingVertical: 4 }}>
            <Txt v="micro" c={c.onHero}>{st.adesaoRotulo}</Txt>
          </View>
        </Row>

        {/* A manchete é a resposta. Ela muda de texto conforme o momento —
            consulta chegando, tratamento atualizado, pendências, tudo em
            dia — e é por isso que o resto do card é fixo: se a moldura
            também mudasse, a pessoa teria que reaprender o bloco a cada
            estado. */}
        <Txt v="display" c={c.onHero} style={{ fontSize: 30, lineHeight: 38, marginTop: 14 }}>
          {st.titulo}
        </Txt>
        <Txt v="caption" c={c.onHero2} style={{ marginTop: 12, lineHeight: 22 }}>
          {st.texto}
        </Txt>

        {/* Os big numbers saíram.

            "10 semanas de acompanhamento" em corpo 27 e "Semana 10 de 16
            previstas" logo abaixo são o mesmo fato duas vezes — e a
            segunda vez é a melhor, porque tem denominador. O número
            grande sozinho impressionava e não situava.

            "10 aplicações registradas" foi junto: é a mesma contagem que
            a régua mostra em forma e a frase confirma em palavra. Três
            versões do mesmo dado num card de 500 px era o excesso que a
            rodada passada não pegou. */}
        <View style={{ marginTop: 26 }}>
          <LinhaDoPlano />
        </View>

        {/* A faixa do resumo, de volta ao pé do card.

            Ela tinha virado uma frase dentro do parágrafo de estado — "a
            Forma já preparou um resumo da sua evolução" — e como frase
            ela era só informação. Como faixa, com ícone e chevron, é uma
            coisa que se abre, que é o que ela sempre quis ser.

            E isto não recria a seção da consulta: aquela é sobre a
            consulta (data, tipo, especialista, preparação); esta é sobre
            o que a Forma tem PRONTO para você levar. Uma é o compromisso,
            a outra é o material. */}
        {!!cs && (
          <Pressable onPress={() => router.push('/companion?q=Prepare%20minha%20consulta' as any)} style={({ pressed }) => [{ opacity: pressed ? 0.75 : 1 }]}>
            <Row gap={12} style={{ marginTop: 22, backgroundColor: c.glass, borderWidth: 1, borderColor: c.glassLine, borderRadius: radius.lg, padding: 14 }}>
              <View style={{ width: 36, height: 36, borderRadius: 18, backgroundColor: 'rgba(255,255,255,0.16)', alignItems: 'center', justifyContent: 'center' }}>
                <Icon name="aura" size={16} color={c.onHero} sw={1.9} />
              </View>
              <View style={{ flex: 1 }}>
                <Txt v="micro" c={c.onHero2}>PARA A CONSULTA {cs.label.toUpperCase()}</Txt>
                <Txt v="caption" c={c.onHero} style={{ marginTop: 2 }} numberOfLines={1}>
                  {/* perto da consulta o resumo já existe; longe dela, a
                      promessa é a certa — dizer "preparei" três semanas
                      antes seria prometer um documento com dados que ainda
                      vão mudar */}
                  {cs.prepararAgora ? 'Seu resumo já está pronto' : 'Vou preparar seu resumo'}
                </Txt>
              </View>
              <Icon name="chev" size={15} color={c.onHero2} sw={2} />
            </Row>
          </Pressable>
        )}
      </View>
    </View>
  );
}

/** O plano, em uma frase e uma linha.

    A régua de traços que morava aqui não dizia nada, e a causa não era o
    desenho: era a falta de DENOMINADOR. Onze traços acesos não
    significam coisa alguma sem saber quantos existem ao todo — barra sem
    total é decoração com aparência de dado. Eu tinha tirado o total de
    propósito, para não prometer uma alta que o tratamento não tem, e ao
    tirá-lo tirei junto a única coisa que dava sentido à forma.

    A saída é dizer qual total é esse. Não é alta: é o horizonte do plano
    que a equipe traçou até a dose de manutenção. Com ele nomeado, a
    frase se sustenta sozinha e a barra vira o que ela deve ser — a
    confirmação visual de uma leitura que já foi feita em palavras.

    A parte além da semana atual fica em fio e não em vazio: plano é
    previsão, não promessa, e um trecho apagado esperando ser preenchido
    daria à continuação um ar de obrigação. */
function LinhaDoPlano() {
  const S = useStore((s) => s.S);
  const { c } = useTheme();
  const st = careState(S);
  const { previstas, atual, cumpridas, temHorizonte } = st.plano;
  const grade = weekGrid(S, 0);
  const feitas = new Set(grade.filter((g) => g.aplicou).map((g) => g.n));

  return (
    <View>
      {/* Barra por semana, com a marca acima dela.

          Passou por duas formas erradas antes desta. Só barras codificava
          tudo em altura, e altura diz "mais" e "menos" — semana cumprida
          não é uma semana MAIOR, é uma semana feita, e era por isso que a
          barra apagada não passava sensação de concluído: estava na mesma
          escala do concluído, só que mais baixa. Depois virou célula
          quadrada com o check dentro, o que resolvia o binário e criava
          outro problema — num quadrado de 15 px o check tem que encolher
          a 10, e a marca que deveria ser a mais legível da fileira virava
          a menos.

          A resposta não era tirar o check da barra: era dar à barra
          altura para caber. Com 24 px ela aceita um check de 10 sem que
          ele encolha, e o conjunto volta a ser uma coisa só — barra e
          marca no mesmo objeto, em vez de dois elementos empilhados que o
          olho precisa juntar. Fora dela o check ficava órfão: centrado
          acima de uma coluna, ele parecia pertencer tanto a ela quanto à
          vizinha.

          A semana corrente fica em lima a 50% com contorno pontilhado. É a
          única linha tracejada do app e ganha exceção por significar
          exatamente o que a forma sugere: contorno aberto é coisa em
          andamento, e ela é a única que ainda pode ganhar o check antes do
          domingo. Cheia, prometeria um feito que não aconteceu; apagada,
          esconderia que está acontecendo.

          As previstas viram fio. Semana prevista não é uma barra curta: é
          uma barra que ainda não existe, e fio é o mínimo que marca
          posição sem afirmar quantidade nenhuma. */}
      <Row gap={3} style={{ alignItems: 'flex-end', height: 26 }}>
        {Array.from({ length: previstas }, (_, i) => {
          const n = i + 1;
          const futura = n > atual;
          const hoje = n === atual;
          /* O check é o selo de semana ENCERRADA, não de aplicação feita.

             `hoje` fica de fora mesmo quando já houve aplicação nela. Uma
             semana em curso ainda pode ter dose atrasada, sintoma, consulta
             remarcada — marcá-la como cumprida no meio do caminho é
             carimbar um resultado antes de ele existir, e obrigaria o
             desenho a desmarcar depois, que é a única coisa que um selo
             não pode fazer.

             É também o que dá sentido ao pontilhado: contorno aberto e
             ausência de marca dizem a mesma coisa por dois meios, e a
             célula fica coerente consigo mesma. */
          const ok = feitas.has(n) && !futura && !hoje;
          return (
            <View
              key={n}
              style={{
                flex: 1,
                alignItems: 'center', justifyContent: 'center',
                /* Quatro alturas. As três primeiras são barra de verdade;
                   a última é fio — semana prevista não é uma barra curta,
                   é uma barra que ainda não existe, e fio é o mínimo que
                   marca posição sem afirmar quantidade. */
                height: hoje ? 26 : futura ? 2 : ok ? 24 : 10,
                borderRadius: futura ? 1 : 4,
                backgroundColor: hoje ? 'rgba(221,246,44,0.5)'
                  : ok ? c.lime
                    : futura ? 'rgba(255,255,255,0.28)' : 'rgba(255,255,255,0.26)',
                /* pontilhado só na de hoje, e transparente nas outras para
                   as larguras não divergirem */
                borderWidth: 1,
                borderStyle: 'dashed' as const,
                borderColor: hoje ? c.lime : 'transparent',
              }}
            >
              {ok && <Icon name="check" size={10} color={c.limeInk} sw={3} />}
            </View>
          );
        })}
      </Row>

      {/* O texto embaixo, e não em cima: a forma dá a impressão em um
          relance, a frase confirma com os números para quem quer o exato.
          Invertido, a frase seria lida primeiro e a régua viraria enfeite
          do que já foi dito. */}
      <Txt v="caption" c={c.onHero2} style={{ marginTop: 10, lineHeight: 20 }}>
        {/* O DENOMINADOR SÓ APARECE QUANDO EXISTE. Sem meta a perseguir
            não há horizonte, e "de N previstas" seria um plano que
            ninguém traçou — a régua vira o registro do que já andou. */}
        Semana <Txt v="bodyMed" c={c.onHero}>{atual}</Txt>
        {temHorizonte ? ` de ${previstas} até a sua meta` : ` do seu tratamento`} ·{' '}
        <Txt v="bodyMed" c={c.lime}>{cumpridas}</Txt> com aplicação em dia
      </Txt>
    </View>
  );
}

/** A porta para o lado de lá — e a última coisa que veio de lá.

    ⚠️ ERA UM CARTÃO DE TRÊS FAIXAS, e o que ele fazia na primeira era
    apresentar a médica: retrato de 76, nome, papel, registro e nome da
    clínica, sobre uma malha de cor com dois véus por cima. Exatamente o
    cartão que a Área médica tem no alto dela — mesma pessoa, mesmos
    quatro campos, mesmo desenho, a um toque de distância.

    Apresentar quem cuida de você é trabalho de UMA tela, e é da outra:
    lá a pergunta "quem é essa pessoa?" é a primeira da página, e há as
    quatro ações e o perfil logo abaixo. Aqui ela era uma ficha parada no
    meio de uma aba que fala do tratamento.

    ⚠️ MAS A PORTA NÃO PODIA VIRAR SÓ UM NOME COM UMA SETA. Porta que não
    diz o que tem atrás é a mesma coisa que não ter porta: a pessoa
    aprende a passar reto. O que tem atrás e muda é a última orientação —
    e é ela que fica, inteira, porque é a única coisa nesta aba em que a
    clínica FALA. O retrato encolhe para 44 e a linha de cima vira o que
    sempre foi: o caminho para a Área médica.

    ⚠️ E A TERCEIRA FAIXA SAIU, a do resto da equipe. Ela apresentava
    mais gente numa aba que parou de apresentar gente, e a lista inteira
    já mora em /clinica — a um toque daqui pelo botão "Clínica" da Área
    médica. */
function BannerMedica() {
  const S = useStore((s) => s.S);
  const { c } = useTheme();
  const router = useRouter();
  const go = (to: string) => () => router.push(to as any);
  const msg = lastMessage(S);
  /* O papel vem de `fichaDe`, que é quem sabe juntar doctorInfo com
     S.team. O registro e o nome da clínica não vêm mais: numa porta eles
     são duas linhas que ninguém lê, e na ficha da Área médica eles são a
     parte verificável. */
  const medica = fichaDe(S);

  return (
    <View style={{ marginTop: 36 }}>
      {/* O título fica, e o link sai. Ele dizia "Área médica" ao lado de
          um cartão cuja primeira linha agora leva exatamente para lá —
          duas promessas de abrir a mesma tela, uma escrita e uma
          desenhada, que é o par que este arquivo já desfez uma vez. */}
      <SectionHead title="Quem cuida de você" style={{ marginBottom: 12 }} />

      <View style={{ borderRadius: radius.lg, overflow: 'hidden' }}>
        <Pressable onPress={go('/medico')} style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1 }]}>
          <Row gap={13} style={{ backgroundColor: c.bg1, padding: 16, alignItems: 'center' }}>
            {FOTO_MEDICA ? (
              <Image
                source={FOTO_MEDICA}
                style={{ width: 44, height: 44, borderRadius: radius.sm, backgroundColor: c.bg2 }}
                contentFit="cover"
                contentPosition={focoDe('responsavel')}
              />
            ) : (
              <View style={{
                width: 44, height: 44, borderRadius: radius.sm,
                backgroundColor: c.accentWeak, alignItems: 'center', justifyContent: 'center',
              }}>
                <Txt v="bodyMed" c={c.accent}>{(S.profile.doctor || '?').trim()[0]}</Txt>
              </View>
            )}
            <View style={{ flex: 1 }}>
              <Txt v="bodyMed" numberOfLines={1}>{S.profile.doctor}</Txt>
              {!!medica?.papel && (
                <Txt v="micro" c={c.tx3} numberOfLines={1} style={{ marginTop: 2 }}>{medica.papel}</Txt>
              )}
            </View>
            <Chevron />
          </Row>
        </Pressable>

        {/* A fala dela, que é o motivo de a porta existir. */}
        {msg ? (
          <Pressable onPress={go('/conversa')} style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1 }]}>
            <View style={{ backgroundColor: c.bg1, borderTopWidth: 1, borderTopColor: c.line2, padding: 18 }}>
              {/* "Última orientação" e não "última mensagem": vindo dela, o
                  que chega não é recado, é conduta — e nomear assim muda o
                  peso do que se lê. Quando é a paciente que escreveu, volta
                  a ser "você escreveu", porque orientação ela não dá. */}
              <Row gap={8}>
                <Row gap={7} style={{ flex: 1 }}>
                  <Icon name={msg.daEquipe ? 'steth' : 'pencil'} size={13} color={c.tx3} sw={2} />
                  <Txt v="micro" c={c.tx3} style={{ letterSpacing: 0.8 }}>
                    {msg.daEquipe ? 'ÚLTIMA ORIENTAÇÃO' : 'VOCÊ ESCREVEU'}
                  </Txt>
                </Row>
                {S.unread > 0 && msg.daEquipe && (
                  <Row gap={5}>
                    <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: c.accent }} />
                    <Txt v="micro" c={c.accent2}>não lida</Txt>
                  </Row>
                )}
              </Row>
              <Txt v="body" c={c.tx} style={{ marginTop: 10, lineHeight: 24, fontStyle: 'italic' }} numberOfLines={2}>
                “{msg.text}”
              </Txt>
              <Row style={{ marginTop: 12 }}>
                <Txt v="micro" c={c.tx3} style={{ flex: 1 }}>{msg.quando}</Txt>
                <Row gap={6}>
                  <Txt v="label" c={c.accent2}>Responder</Txt>
                  <Icon name="chev" size={13} color={c.accent2} sw={2.2} />
                </Row>
              </Row>
            </View>
          </Pressable>
        ) : (
          /* sem histórico não há frase para mostrar, e aí o botão volta a
             ser a única coisa que faz sentido */
          <Pressable onPress={go('/conversa')} style={({ pressed }) => [{ opacity: pressed ? 0.8 : 1 }]}>
            <Row gap={10} style={{ backgroundColor: c.bg1, borderTopWidth: 1, borderTopColor: c.line2, padding: 18 }}>
              <Icon name="companion" size={18} color={c.accent} sw={1.9} />
              <Txt v="bodyMed" c={c.accent2} style={{ flex: 1 }}>Enviar a primeira mensagem</Txt>
              <Icon name="chev" size={14} color={c.accent2} sw={2} />
            </Row>
          </Pressable>
        )}
      </View>
    </View>
  );
}

/* "Seu cuidado hoje" morava aqui — quatro cards com consulta, mensagens,
   receita e exames, cada um com um ponto de estado. Saiu inteiro.

   A defesa dela era que respondia outra pergunta que "Precisa de você":
   uma dizia COMO ESTÁ, a outra O QUE FAZER. Isso é verdade no papel, e na
   tela não sobreviveu — os quatro assuntos já aparecem cada um no seu
   lugar próprio (consulta tem seção, mensagens estão no card da
   especialista, receita e doses estão no tratamento, exames estão em
   pendências), então o painel os mostrava pela segunda vez, menor e sem
   nada do que os torna úteis.

   E o que restava do "como está" o hero passou a dizer melhor em uma
   frase. Painel de quatro caixas iguais é o que se faz quando não se sabe
   qual das quatro importa hoje; a leitura do `careState` sabe. */

/** Os quatro destinos mais usados. "Sobre" saiu — é uma tela que se visita
    uma vez, e atalho existe para o que se repete. Entrou Tratamento, que
    é onde se olha a dose e o estoque toda semana. */
/* Os quatro atalhos moravam aqui — Mensagens, Consultas, Exames,
   Tratamento. Saíram por repetição: os mesmos quatro assuntos já
   aparecem logo abaixo em "Seu cuidado hoje", e lá com estado junto.
   Botão que leva ao mesmo lugar que o card de baixo, com o mesmo nome,
   é o card de baixo duas vezes. */

/* A seção solta de última mensagem morava aqui. Foi para dentro do
   card da médica: a pessoa e a fala dela são a mesma coisa, e mantê-las
   em dois blocos fazia a tela apresentar duas vezes a mesma relação. */

/* ⚠️ "PREPARADO PARA VOCÊ" MORAVA AQUI, e era o carrossel de materiais
   da clínica — o mesmo array `S.materials`, no mesmo cartão de 178, que
   a Área médica mostra em "O que a clínica preparou".

   Material é o que ELES mandaram: só existe porque existe alguém do
   outro lado, e por isso mora do lado de lá. Esta aba responde o que o
   tratamento pede de VOCÊ.

   (O próprio /medico já sabia disso e se contradisse: o comentário de
   cabeçalho dele dizia que os materiais não entravam lá para não ser "a
   segunda porta para a mesma sala", e quinhentas linhas abaixo eles
   entravam. A porta era esta.) */

/* "Converse com sua clínica" morava aqui, fechando a aba. Saiu quando o
   banner da especialista voltou: os dois eram o mesmo convite em lima,
   com o mesmo destino, a uma rolagem de distância um do outro. O banner
   ganha por ter rosto. */

/** O que está esperando você — agora a primeira seção da tela.

    Com o painel fora, esta lista é o que transforma o estado do hero em
    coisa que se faz. Por isso ela ganhou o estado vazio que antes eu
    tinha recusado: quando a seção só aparecia se houvesse pendência, sua
    ausência era ambígua — não dava para saber se estava tudo em dia ou se
    a tela tinha esquecido de carregar. Dito em voz alta, "nada precisa de
    você agora" é a melhor notícia que esta aba tem para dar.

    Só entra aqui o que exige um toque da pessoa. "Consulta em 3 dias" e
    "mensagens em dia" são estado, não ação, e estado já é o hero. */
function Pendencias() {
  const S = useStore((s) => s.S);
  const { c } = useTheme();
  const router = useRouter();
  const itens = carePending(S);

  if (!itens.length) {
    return (
      <View style={{ marginTop: 32 }}>
        <SectionHead title="Precisa de você" />
        <Row gap={14} style={{ backgroundColor: c.limeWeak, borderRadius: radius.lg, marginTop: 14, padding: 18 }}>
          <View style={{ width: 34, height: 34, borderRadius: 17, backgroundColor: c.bg1, alignItems: 'center', justifyContent: 'center' }}>
            <Icon name="check" size={16} color={c.tx} sw={2.2} />
          </View>
          <View style={{ flex: 1 }}>
            <Txt v="bodyMed">Nada precisa de você agora.</Txt>
            <Txt v="caption" c={c.tx2} style={{ marginTop: 3 }}>Seu acompanhamento está em dia.</Txt>
          </View>
        </Row>
      </View>
    );
  }

  return (
    <View style={{ marginTop: 32 }}>
      <SectionHead title="Precisa de você" />
      {/* Mesma UI de "Gerar resumos" no Insights: ListRow com fio, dentro
          de um card branco. São a mesma coisa — uma pilha de atalhos para
          um destino cada — e o app já tinha o padrão em duas telas. Ter
          uma terceira variante aqui obrigava a pessoa a aprender de novo
          um gesto que ela já sabe. */}
      <View style={{ backgroundColor: c.bg1, borderRadius: radius.lg, marginTop: 14, padding: 16 }}>
        {itens.map((it, i) => (
          <React.Fragment key={it.texto}>
            {i > 0 && <View style={{ height: 1, backgroundColor: c.line, marginVertical: 12 }} />}
            <ListRow
              ic={it.ic} title={it.texto} sub={it.sub}
              onPress={() => router.push(it.to as any)}
            />
          </React.Fragment>
        ))}
      </View>
    </View>
  );
}

/** A consulta como data, não como linha de lista: é o único compromisso
    marcado da pessoa com outra pessoa, e merece o tamanho disso. */
function Consulta() {
  const S = useStore((s) => s.S);
  const { c } = useTheme();
  const router = useRouter();
  const cs = nextConsult(S);

  /* ⚠️ SEM CONSULTA, O BLOCO SUMIA INTEIRO — e com ele a única porta
     para anotar uma. Quem marca pela clínica não perde nada com isso: a
     agenda chega de lá. Quem anota sozinha perdia a descoberta da
     funcionalidade, que é o jeito mais silencioso de uma tela não
     existir.

     ⚠️ MAS O CONVITE NÃO VALE PARA TODO MUNDO. Quem respondeu que conduz
     o tratamento por conta própria não precisa ver "anote uma consulta"
     toda vez que abrir a aba: ela não esqueceu de marcar, ela decidiu.
     Insistir transforma uma escolha legítima numa pendência — e é
     exatamente o que faz um aplicativo parecer que não ouviu. */
  if (!cs) {
    if (clinicaConectada(S) || !temAcompanhamento(S)) return null;
    return (
      <View style={{ marginTop: 36 }}>
        <SectionHead title="Sua próxima consulta" />
        <Pressable
          onPress={() => router.push('/anotar-consulta' as any)}
          style={({ pressed }) => [{ marginTop: 14, opacity: pressed ? 0.7 : 1 }]}
        >
          <Row gap={14} style={{ backgroundColor: c.bg1, borderRadius: radius.lg, padding: 16, alignItems: 'center' }}>
            <View style={{
              width: 46, height: 46, borderRadius: radius.md, backgroundColor: c.bg3,
              alignItems: 'center', justifyContent: 'center',
            }}>
              <Icon name="cal" size={20} color={c.tx3} sw={1.8} />
            </View>
            <View style={{ flex: 1 }}>
              <Txt v="bodyMed">Anotar uma consulta</Txt>
              <Txt v="micro" c={c.tx3} style={{ marginTop: 3, lineHeight: 17 }}>
                Com a data aqui, o resumo fica pronto e o app avisa quando ela chegar perto.
              </Txt>
            </View>
            <Icon name="chev" size={14} color={c.tx4} sw={2} />
          </Row>
        </Pressable>
      </View>
    );
  }

  const go = (to: string) => () => router.push(to as any);
  /* fmtDate devolve "14 ago" — dia e mês separados por espaço, não por
     barra. O bloco de calendário quer as duas metades soltas. */
  const dia = cs.data.getDate();
  const mes = (fmtDate(cs.data).split(' ')[1] ?? '').toUpperCase();

  return (
    <View style={{ marginTop: 36 }}>
      <SectionHead title="Sua próxima consulta" link="Consultas" onPress={go('/consultas')} />
      <View style={{ backgroundColor: c.bg1, borderRadius: radius.lg, marginTop: 14, padding: 20 }}>
        <Row gap={18}>
          {/* bloco de calendário: dia grande e mês pequeno, que é como a
              pessoa guarda a data na cabeça */}
          <View style={{ width: 64, alignItems: 'center', paddingVertical: 12, borderRadius: radius.md, backgroundColor: c.accentWeak }}>
            <Txt v="h1" c={c.accent} style={{ fontSize: 28 }}>{dia}</Txt>
            <Txt v="micro" c={c.accent} style={{ letterSpacing: 0.8 }}>{mes}</Txt>
          </View>
          <View style={{ flex: 1 }}>
            <Txt v="title">{cs.tipo}</Txt>
            <Txt v="caption" c={c.tx3} style={{ marginTop: 3 }}>
              {DOW_PT[cs.data.getDay()]} · {cs.doutor}
            </Txt>
            <Row gap={7} style={{ marginTop: 10 }}>
              <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: c.accent }} />
              <Txt v="caption" c={c.accent2}>É {cs.label}</Txt>
            </Row>
          </View>
        </Row>

        {cs.prepararAgora && (
          <>
            <Divider style={{ marginVertical: 18 }} />
            <Txt v="caption" c={c.tx3} style={{ lineHeight: 20 }}>
              Eu monto um resumo com peso, adesão e sintomas do período — você escolhe
              o que quer perguntar.
            </Txt>
            {/* preenchimento tonal, não contorno: o princípio 4 diz que
                superfície se separa por tom, e um botão em borda cinza é
                exatamente a borda que a linguagem não tem */}
            <Pressable onPress={go('/companion?q=Prepare%20minha%20consulta')} style={({ pressed }) => [{ marginTop: 14, alignSelf: 'flex-start', opacity: pressed ? 0.8 : 1 }]}>
              <Row gap={8} style={{ backgroundColor: c.accentWeak, borderRadius: radius.pill, paddingHorizontal: 16, paddingVertical: 11 }}>
                <Icon name="aura" size={15} color={c.accent} sw={1.9} />
                <Txt v="label" c={c.accent2}>Preparar a consulta</Txt>
              </Row>
            </Pressable>
          </>
        )}
      </View>
    </View>
  );
}

/** O que está sendo tomado, e quanto ainda tem. */
function Tratamento() {
  const S = useStore((s) => s.S);
  const { c } = useTheme();
  const router = useRouter();
  const go = (to: string) => () => router.push(to as any);
  const med = M(S);
  const p = penStock(S);
  const dose = medComDose(S);
  const receita = (S.prescriptions as any[])[0];
  const critico = p.left <= 1;
  const ctx = doseContext(S);
  /* doseCycle já traz dia e total do ciclo; a fração 0..1 que o Medidor
     pedia saiu junto com ele */
  const ciclo = doseCycle(S);

  return (
    <View style={{ marginTop: 36 }}>
      <SectionHead title="Seu tratamento" link="Aplicações" onPress={go('/aplicacoes')} />

      {/* Claro, como o resto da aba.

          A versão anterior era escura com cápsulas em neon. Funcionava
          como peça, e estava errada como produto: fundo escuro com luz
          ácida é linguagem de app de performance — treino, corrida,
          métrica de atleta. Esta é a área médica de alguém em tratamento,
          e a promessa da aba é calma.

          Também quebrava a identidade por dentro: a atmosfera escura já é
          o momento de marca do hero, e repeti-la aqui num registro
          diferente fazia a tela ter duas vozes.

          Os instrumentos ficam — eles não dependiam do escuro, dependiam
          de contraste. Sobre branco, a cápsula troca o fulgor pelo próprio
          degradê, e o medidor usa o azul da marca. Instrumento bom se
          adapta à superfície; o que não se adapta era efeito. */}
      <View style={{ borderRadius: radius.xl, marginTop: 14, overflow: 'hidden', backgroundColor: c.bg1 }}>
        <View style={{ padding: 22 }}>
          <Row gap={14}>
            <View style={{ width: 44, height: 44, borderRadius: 22, backgroundColor: c.accentWeak, alignItems: 'center', justifyContent: 'center' }}>
              <Icon name="syringe" size={20} color={c.accent} sw={1.8} />
            </View>
            <View style={{ flex: 1 }}>
              <Txt v="title">{dose}</Txt>
              <Txt v="caption" c={c.tx3} style={{ marginTop: 3 }}>
                {/* O separador some junto com o nome. Sem receita
                    guardada e sem médico anotado, a linha terminava em
                    "1× por semana ·" — um ponto esperando alguém. */}
                {cadenciaCurta(S)}{(receita?.by ?? S.profile.doctor) ? ` · ${receita?.by ?? S.profile.doctor}` : ''}
              </Txt>
            </View>
          </Row>

          {/* Três frases curtas. Cada uma é um tempo diferente do mesmo
              tratamento — o que vem, o que dura, o que será revisto. */}
          <Row gap={7} style={{ flexWrap: 'wrap', marginTop: 18 }}>
            {[ctx.proxima, ctx.naDose, ctx.revisao].filter(Boolean).map((frase) => (
              <View key={frase as string} style={{ backgroundColor: c.bg2, borderRadius: radius.pill, paddingHorizontal: 11, paddingVertical: 6, marginBottom: 3 }}>
                <Txt v="micro" c={c.tx2}>{frase}</Txt>
              </View>
            ))}
          </Row>

          <Divider style={{ marginVertical: 20 }} />

          {/* Doses em traços deitados, um por dose.

              Passou por duas versões erradas. A cápsula em pé tinha corpo
              demais e virava o assunto do card. Os grupos de três em
              escadinha vieram depois e erraram pior: a escadinha sugeria
              que uma dose vale mais que a outra, e não vale — quatro
              doses são quatro iguais. Sempre que a forma insinua uma
              diferença que o dado não tem, ela mente.

              Agora é um traço por dose, todos do mesmo tamanho, deitados
              com vão entre eles. Deitado porque a leitura é de SEQUÊNCIA
              — as doses se gastam em ordem — e a gasta fica no mesmo
              lugar, apagada: a posição é o que conta.

              Vermelho só quando resta uma dose ou menos. "Vale renovar a
              receita" é lembrete com semanas de antecedência, e pintá-lo de
              vermelho o iguala a um problema clínico — que é o que a cor de
              alerta precisa continuar significando neste app. */}
          <Row>
            <Txt v="caption" c={c.tx2} style={{ flex: 1 }}>Doses na caneta</Txt>
            {/* ⚠️ A COR DE LINK SÓ VALE SE HOUVER LINK. "Vale renovar a
                receita" é estado, não ação — ele ficava em cor de ação
                porque o botão "Pedir renovação" vinha logo abaixo, e os
                dois liam como um par. Sem plataforma o botão não existe, e
                o texto sozinho em azul vira um link que não leva a lugar
                nenhum. O crítico continua em vermelho: ali a cor é
                gravidade, e não convite. */}
            <Txt v="caption" c={critico ? c.cta : p.verdict.good ? c.tx3 : clinicaConectada(S) ? c.accent2 : c.tx2}>{p.verdict.label}</Txt>
          </Row>
          <View style={{ marginTop: 14 }}>
            <Nivel
              total={p.total} cheios={p.left}
              de={critico ? c.cta2 : c.accent} para={critico ? c.cta : c.accent2}
              altura={9}
            />
          </View>
          <Txt v="caption" c={c.tx3} style={{ marginTop: 12 }}>
            {p.left} de {p.total} · cerca de {p.semanas} {p.semanas === 1 ? 'semana' : 'semanas'}
          </Txt>

          {/* ⚠️ "PEDIR RENOVAÇÃO" É PEDIR A ALGUÉM. O botão abre a conversa
              com a equipe, e sem equipe ele levava a uma tela vazia. A
              caneta acabando continua dita logo acima, em número de doses
              e semanas — o fato não depende de plataforma, o pedido sim. */}
          {clinicaConectada(S) && !p.verdict.good && (
            <Pressable onPress={go('/conversa?pedir=receita')} style={({ pressed }) => [{ marginTop: 18, alignSelf: 'flex-start', opacity: pressed ? 0.8 : 1 }]}>
              <Row gap={8} style={{ backgroundColor: c.accentWeak, borderRadius: radius.pill, paddingHorizontal: 18, paddingVertical: 11 }}>
                <Txt v="label" c={c.accent2}>Pedir renovação</Txt>
                <Icon name="chev" size={13} color={c.accent2} sw={2.2} />
              </Row>
            </Pressable>
          )}
        </View>
      </View>
    </View>
  );
}

/** Exames, resumos e receitas numa lista só, por data — é assim que a
    pessoa procura ("o que veio depois da última consulta?"), não por tipo. */
/* ⚠️ ESTA SEÇÃO VOLTAVA `null` SEM DOCUMENTO, e levava a porta dos
   exames junto.

   O link para /exames vivia no cabeçalho dela, como link lateral. Isso
   fazia a única porta estável da tela de exames depender de haver PDF
   guardado — ou seja, ela sumia exatamente para quem ainda não importou
   nada, que é justamente quem precisa achar "Importar exame".

   Agora a porta é uma LINHA, e não um link de cabeçalho: ela é o primeiro
   item do cartão, existe sempre, e traz no subtítulo a mesma conta que a
   tela de destino abre — quantos marcadores, quantos fora. Link lateral
   de cabeçalho é para "ver mais do mesmo"; isto é outro lugar. */
/** Os exames — o único arquivo desta aba, porque é o único que é da
    pessoa.

    ⚠️ ELA SE CHAMAVA "DOCUMENTOS", e listava exames, resumos e receitas
    juntos: `careDocs` é `S.documents` somado a `S.prescriptions`, cortado
    em três. Ou seja, era uma prévia de três linhas das DUAS últimas
    seções da Área médica — sem link para elas, e com a receita levando a
    /medico do mesmo jeito.

    Documento e receita são o registro da relação com a clínica: ninguém
    neste aplicativo os cria, eles só chegam do outro lado. Exame é o
    contrário — a pessoa importa o dela, com clínica ou sem, e por isso
    ele é o que fica.

    E nada se perde para quem não tem clínica: sem ela as duas listas
    estão vazias, porque só o outro lado as enche. */
function Exames() {
  const S = useStore((s) => s.S);
  const { c } = useTheme();
  const router = useRouter();
  const exames = examesComValor(((S as any).exams as any[]) ?? []);
  const foraDaRef = examesForaDaRef(exames).length;

  return (
    <View style={{ marginTop: 36 }}>
      <SectionHead title="Exames" />
      <View style={{ backgroundColor: c.bg1, borderRadius: radius.lg, marginTop: 14, paddingHorizontal: 18 }}>
        <Pressable onPress={() => router.push('/exames' as any)} style={({ pressed }) => [{ opacity: pressed ? 0.6 : 1 }]}>
          <Row gap={14} style={{ paddingVertical: 18 }}>
            <View style={{ width: 34, height: 34, borderRadius: radius.sm, backgroundColor: c.bg2, alignItems: 'center', justifyContent: 'center' }}>
              <Icon name="chart" size={16} color={c.tx2} sw={1.9} />
            </View>
            <View style={{ flex: 1 }}>
              <Txt v="bodyMed">
                {exames.length
                  ? `${exames.length} ${exames.length === 1 ? 'marcador acompanhado' : 'marcadores acompanhados'}`
                  : 'Nenhum resultado guardado'}
              </Txt>
              {/* O vermelho só quando há o que ver: a linha não é um alerta,
                  é uma porta — e porta que acende todo dia deixa de ser
                  lida no dia em que tem motivo. */}
              <Txt v="micro" c={foraDaRef ? c.cta : c.tx3} style={{ marginTop: 5 }}>
                {!exames.length
                  ? 'Importe um exame para começar a acompanhar'
                  : foraDaRef
                    ? `${foraDaRef} fora da referência`
                    : 'Todos na referência'}
              </Txt>
            </View>
            <Icon name="chev" size={14} color={c.tx4} sw={2} />
          </Row>
        </Pressable>
      </View>
    </View>
  );
}

/* ------------------------------------------------------------------ */
/**
 * QUEM ACOMPANHA VOCÊ — o bloco das pessoas, sem plataforma
 *
 * ⚠️ AQUI MORAVA A "DESCOBERTA", E ELA ERA A TELA INTEIRA.
 *
 * Quem não tinha médico não via a aba Cuidado: via uma vitrine. Um card
 * grande — "Encontre quem acompanhe seu tratamento" — e três promessas
 * embaixo: especialistas credenciados, os seus dados já organizados,
 * conversa direta. Nenhuma das três era coisa que a pessoa pudesse fazer
 * ali, e a primeira descrevia uma rede credenciada que não existe hoje e
 * não vai existir fora do Brasil, onde o aplicativo também vai rodar.
 *
 * O PREÇO NÃO ERA A VITRINE, ERA O QUE ELA OCUPAVA. Uma pessoa na semana
 * 11, com 91% de adesão, um exame pendente e a caneta acabando, abria a
 * aba do cuidado e recebia um anúncio. Tudo o que o app sabia sobre o
 * tratamento dela — e ele sabia tudo — ficava atrás de uma condição que
 * não era sobre o tratamento: ter ou não ter médico cadastrado.
 *
 * Agora ela vê a mesma aba que todo mundo. O que era a tela virou um
 * bloco, do tamanho que o assunto tem: quem acompanha você, com a ficha
 * quando há alguém e o convite quando não há. E o convite leva a uma
 * porta que existe — a de anotar, que não promete rede nenhuma.
 * ------------------------------------------------------------------ */
function QuemAcompanha() {
  const S = useStore((s) => s.S);
  const { c } = useTheme();
  const router = useRouter();
  const quem = S.profile.doctor || S.profile.clinic;

  /* ⚠️ E ELE NÃO APARECE PARA QUEM ESCOLHEU SEGUIR SOZINHA. Uma seção
     chamada "Quem acompanha você" com "Ninguém registrado ainda" dentro é
     uma lacuna desenhada — o app apontando, toda vez, para a resposta que
     ele gostaria de ter recebido. Para essa pessoa a porta existe no
     perfil e no convite do rodapé, que é onde uma oferta não atrapalha. */
  if (!temAcompanhamento(S)) return null;
  const especialidade = (S.profile as any).doctorInfo?.especialidade as string | undefined;

  return (
    <View style={{ marginTop: 36 }}>
      <SectionHead title="Quem acompanha você" />
      <Pressable
        onPress={() => router.push('/acompanhamento' as any)}
        style={({ pressed }) => [{ marginTop: 14, opacity: pressed ? 0.7 : 1 }]}
      >
        <Row gap={14} style={{ backgroundColor: c.bg1, borderRadius: radius.lg, padding: 16, alignItems: 'center' }}>
          <View style={{
            width: 52, height: 52, borderRadius: radius.md, backgroundColor: c.bg3,
            alignItems: 'center', justifyContent: 'center',
          }}>
            <Icon name="steth" size={22} color={quem ? c.tx3 : c.tx4} sw={1.8} />
          </View>
          <View style={{ flex: 1 }}>
            <Txt v="bodyMed" c={quem ? c.tx : c.tx2}>{quem || 'Ninguém registrado ainda'}</Txt>
            <Txt v="micro" c={c.tx3} style={{ marginTop: 3, lineHeight: 17 }}>
              {quem
                ? (especialidade || 'Acompanha o seu tratamento')
                : 'Se você se trata com alguém, anote aqui — o resumo sai pronto para a consulta.'}
            </Txt>
          </View>
          <Icon name="chev" size={14} color={c.tx4} sw={2} />
        </Row>
      </Pressable>

    </View>
  );
}

/* ------------------------------------------------------------------ */
/**
 * O CONVITE, NO FIM DA TELA
 *
 * ⚠️ É A VITRINE ANTIGA, REDUZIDA AO QUE ELA PODIA SER. Ela ocupava a aba
 * inteira de quem não tinha médico, com três promessas e nenhuma porta.
 * Aqui é um bloco, e é o último: a pessoa lê depois de ter visto a semana
 * dela, as pendências, a caneta e os documentos. Oferta depois do
 * serviço, e não no lugar dele.
 *
 * ⚠️ E ELE É SÓ DE QUEM NÃO TEM NINGUÉM.
 *
 * Ficava também para quem anotou o próprio médico, com o argumento de
 * que essa pessoa poderia querer um que usasse o aplicativo. O argumento
 * é fraco e o custo é alto: ela ACABOU de responder que tem alguém, e o
 * app abre a aba do cuidado dela oferecendo outros profissionais. Isso
 * não lê como opção — lê como se o aplicativo achasse a escolha dela
 * insuficiente, toda vez que ela entra.
 *
 * Quem não tem acompanhamento nenhum é outra conversa: ali não há
 * escolha sendo contrariada, e a oferta responde a uma lacuna real que a
 * própria pessoa declarou.
 *
 * Some inteiro onde não há rede (ver src/logic/mercado.ts).
 * ------------------------------------------------------------------ */
function Parceiros() {
  const S = useStore((s) => s.S);
  const { c } = useTheme();
  const router = useRouter();
  if (!TEM_REDE_PARCEIRA || temAcompanhamento(S)) return null;

  return (
    <View style={{ marginTop: 36 }}>
      <SectionHead title="Acompanhamento profissional" />

      <Pressable
        onPress={() => router.push('/parceiros' as any)}
        style={({ pressed }) => [{ marginTop: 14, opacity: pressed ? 0.8 : 1 }]}
      >
        <View style={{ backgroundColor: c.accentWeak, borderRadius: radius.lg, padding: 18 }}>
          <Row gap={12} style={{ alignItems: 'center' }}>
            <Icon name="steth" size={20} color={c.accent} sw={1.9} />
            <Txt v="bodyMed" c={c.accent2} style={{ flex: 1 }}>Conheça os médicos parceiros</Txt>
            <Icon name="chev" size={14} color={c.accent2} sw={2} />
          </Row>
          <Txt v="caption" c={c.tx2} style={{ marginTop: 10, lineHeight: 20 }}>
            Algumas clínicas acompanham o tratamento por aqui junto com você — mensagens
            entre as consultas, o seu resumo chegando na equipe e a agenda já preenchida.
          </Txt>
        </View>
      </Pressable>

      {/* ⚠️ UMA LINHA, E SÓ. É a porta para quem mudou de ideia sobre
          seguir sozinha, e ela precisa existir em algum lugar da aba —
          mas como linha de texto no rodapé, e não como seção com título e
          card, que é o que ela era antes e o que transformava a escolha
          da pessoa numa lacuna a preencher.

          Ela não tem condição própria: este bloco inteiro só existe para
          quem não tem acompanhamento, e é exatamente essa pessoa que
          pode passar a ter. */}
      <Pressable
        onPress={() => router.push('/acompanhamento' as any)}
        style={({ pressed }) => [{ marginTop: 14, opacity: pressed ? 0.6 : 1 }]}
      >
        <Txt v="caption" c={c.tx3} style={{ paddingHorizontal: 2, lineHeight: 20 }}>
          Passou a ter acompanhamento médico? <Txt v="caption" c={c.accent2}>Anote quem é.</Txt>
        </Txt>
      </Pressable>
    </View>
  );
}

export default function Cuidado() {
  const S = useStore((s) => s.S);
  const { c } = useTheme();
  const insets = useSafeAreaInsets();
  const conectada = clinicaConectada(S);

  return (
    <View style={{ flex: 1, backgroundColor: c.bg }}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: PAD, paddingTop: insets.top + 20, paddingBottom: 120 }}
      >
        {/* Sem título de tela. A tab bar já diz onde a pessoa está, e
            repetir "Cuidado" no topo gasta a primeira dobra com informação
            que ela acabou de dar. O hero abre direto — é ele que responde
            por que se veio aqui.

            ⚠️ HAVIA UMA LINHA AQUI, "Ninguém precisa fazer isso sozinho",
            só para quem não tinha médico. Ela era a chamada da vitrine, e
            sem a vitrine vira o quê? Uma frase de consolo no alto da tela
            de alguém que não pediu consolo — e que está, de fato, tocando
            o próprio tratamento. */}
        {conectada ? (
          /* Oito blocos, e cada assunto aparece em exatamente um.

             Estado (hero) → ação (Precisa de você) → compromisso
             (Consulta) → pessoas (Especialista, Equipe) → medicamento
             (Tratamento) → seus exames.

             A regra que a iteração passada quebrou e esta restabelece:
             consulta só na Consulta, mensagem só no card da especialista,
             dose e receita só no Tratamento. Nada volta ao hero — ele
             lê o conjunto, não reexibe as partes. */
          <>
            <Topo />

            <Pendencias />
            <Consulta />
            <BannerMedica />
            <Tratamento />
            <Exames />
          </>
        ) : (
          /* ⚠️ SEM PLATAFORMA — SEIS DOS OITO BLOCOS, COM OU SEM MÉDICO.

             A aba foi construída em volta da clínica, mas o nome dela
             nunca foi "Clínica" nem "Médico": é Cuidado, e cuidado do
             tratamento existe sem servidor nenhum. O que sai é o que
             precisa de alguém do outro lado — o retrato da especialista e
             a equipe de apoio. O que fica é a maior parte, e é justamente
             o tratamento.

             Sem esta ramificação, quem registrasse o próprio médico veria
             a foto da Dra. Helena e uma equipe de apoio que não existe:
             o banner não pergunta de onde veio o nome.

             ⚠️ E ERAM TRÊS RAMOS, não dois. O terceiro — sem médico
             nenhum — trocava a aba inteira por uma vitrine. Não troca
             mais: ter ou não ter médico cadastrado mudou de tamanho, e
             agora é um bloco desta lista, no lugar onde a versão com
             plataforma põe o retrato da especialista e a equipe. */
          <>
            <Topo />

            <Pendencias />
            <Consulta />
            <QuemAcompanha />
            <Tratamento />
            <Exames />
            <Parceiros />
          </>
        )}
      </ScrollView>
    </View>
  );
}
