import React from 'react';
import { View, Pressable, ScrollView, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Defs, Ellipse, RadialGradient, Stop } from 'react-native-svg';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useStore } from '../../logic/store';
import {
  hasClinic, nextConsult, lastMessage, carePending, careDocs, careState,
  doseContext, doseCycle, penStock, weekGrid, M,
} from '../../logic/derive';
import { Nivel, Malha } from '../../ui/instrumentos';
import { fmtDate, relDay, DOW_PT, nf, now, diffDays } from '../../logic/time';
import { Txt, Card, Row, IconBadge, SectionHead, Divider, ListRow } from '../../ui/kit';
import { Icon } from '../../ui/Icon';
import { useTheme } from '../../ui/useTheme';
import { radius } from '../../theme';

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
const FOTO_MEDICA = require('../../../assets/images/especialista.png');

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

/** Inicial dentro de um bloco tingido, para quem não tem foto. Só a médica
    tem retrato; a equipe de apoio entra assim até haver imagens delas — e
    não finge ter: nome próprio em corpo grande identifica uma pessoa tão
    bem quanto um retrato, e melhor que um boneco genérico. */
function Retrato({ nome, size = 56 }: { nome: string; size?: number }) {
  const { c } = useTheme();
  const letra = nome.replace(/^Dr[a]?\.\s*/, '')[0];
  return (
    <View style={{
      width: size, height: size, borderRadius: size * 0.32,
      overflow: 'hidden', alignItems: 'center', justifyContent: 'center',
    }}>
      {/* degradê e não cor chapada: um bloco de tom único ao lado de uma
          foto de verdade denuncia na hora que ali falta a imagem. Com luz
          caindo na diagonal ele vira um objeto, não um espaço vazio. */}
      <LinearGradient
        colors={[c.bluePale, c.accentWeak]}
        start={{ x: 0.1, y: 0 }} end={{ x: 0.9, y: 1 }}
        style={StyleSheet.absoluteFillObject}
      />
      <Txt v="h1" c={c.accent2} style={{ fontSize: size * 0.4 }}>{letra}</Txt>
    </View>
  );
}

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
  const { previstas, atual, cumpridas } = st.plano;
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
        Semana <Txt v="bodyMed" c={c.onHero}>{atual}</Txt> de {previstas} previstas no seu plano ·{' '}
        <Txt v="bodyMed" c={c.lime}>{cumpridas}</Txt> com aplicação em dia
      </Txt>
    </View>
  );
}

/** O banner da especialista, agora no meio da rolagem.

    No topo ele fazia a tela ser sobre ela; aqui, depois do estado do
    cuidado, das pendências e da consulta, a escala grande volta a ser um
    ganho — a pergunta "como está meu cuidado?" já foi respondida antes
    dele.

    O card tem duas metades: quem é ela em cima, o que ela disse embaixo. */
function BannerMedica() {
  const S = useStore((s) => s.S);
  const { c } = useTheme();
  const router = useRouter();
  const go = (to: string) => () => router.push(to as any);
  const msg = lastMessage(S);

  return (
    <View style={{ borderRadius: radius.xl, overflow: 'hidden', marginTop: 36 }}>
      {/* metade de cima: quem é ela */}
      <View style={{ height: 168, overflow: 'hidden', backgroundColor: c.bg1 }}>
        {/* a mesma malha do topo, em meia força: aqui ela é fundo para um
            retrato recortado, e a foto é que precisa ganhar o olho */}
        <Malha id="cuidadoBanner" forca={0.55} />

        {/* alinhada pela base: retrato flutuando no meio parece adesivo */}
        <Image
          source={FOTO_MEDICA}
          style={{ position: 'absolute', right: -6, bottom: 0, width: 128, height: 182 }}
          contentFit="contain"
          contentPosition="bottom center"
        />

        <Pressable onPress={go('/especialista')} style={{ flex: 1 }}>
          <View style={{ flex: 1, padding: 20, justifyContent: 'center' }}>
            <Txt v="micro" c={c.tx3} style={{ letterSpacing: 1.1 }}>SUA ESPECIALISTA</Txt>
            <Txt v="h2" style={{ marginTop: 7, maxWidth: '66%' }}>{S.profile.doctor}</Txt>
            <Row gap={6} style={{ marginTop: 5 }}>
              <Icon name="heart" size={13} color={c.tx3} sw={1.9} />
              <Txt v="caption" c={c.tx2}>{S.profile.clinic}</Txt>
            </Row>
            <Row gap={6} style={{ marginTop: 12 }}>
              <Txt v="label" c={c.accent2}>Ver perfil</Txt>
              <Icon name="chev" size={13} color={c.accent2} sw={2.2} />
            </Row>
          </View>
        </Pressable>
      </View>

      {/* metade de baixo: o que ela disse.

          Substitui o botão "Enviar mensagem". Um botão genérico ao lado do
          retrato pedia uma ação sem dar motivo; a frase que ela escreveu É
          o motivo — e transforma o card de ficha em conversa. A ação
          continua ali, agora nomeada pelo que se vai fazer de fato:
          responder, não enviar.

          Colada no mesmo card e não solta acima: a pessoa e a fala dela
          são a mesma coisa, e separá-las em dois blocos fazia a tela
          apresentar duas vezes a mesma relação. */}
      {msg ? (
        <Pressable onPress={go('/medico')} style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1 }]}>
          <View style={{ backgroundColor: c.bg1, borderTopWidth: 1, borderTopColor: c.line2, padding: 18 }}>
            {/* "Última orientação" e não "última mensagem": vindo dela, o
                que chega não é recado, é conduta — e nomear assim muda o
                peso do que se lê. Quando é a paciente que escreveu, volta a
                ser "você escreveu", porque orientação ela não dá. */}
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
        /* sem histórico não há frase para mostrar, e aí o botão volta a ser
           a única coisa que faz sentido */
        <Pressable onPress={go('/medico')} style={({ pressed }) => [{ opacity: pressed ? 0.8 : 1 }]}>
          <Row gap={10} style={{ backgroundColor: c.bg1, borderTopWidth: 1, borderTopColor: c.line2, padding: 18 }}>
            <Icon name="companion" size={18} color={c.accent} sw={1.9} />
            <Txt v="bodyMed" c={c.accent2} style={{ flex: 1 }}>Enviar a primeira mensagem</Txt>
            <Icon name="chev" size={14} color={c.accent2} sw={2} />
          </Row>
        </Pressable>
      )}
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

/** O apoio, compacto.

    Era um carrossel de cards de 150 px, que dava a três profissionais de
    apoio o mesmo peso visual da consulta e do tratamento. Virou uma linha
    só, com os retratos encavalados à esquerda e a contagem à direita —
    presença suficiente para dizer "não é só ela", pequena o bastante para
    não disputar com o que se usa toda semana. */
function Time() {
  const S = useStore((s) => s.S);
  const { c } = useTheme();
  const router = useRouter();
  const time = ((S as any).team ?? []) as { name: string; role: string }[];
  if (!time.length) return null;

  return (
    <Pressable onPress={() => router.push('/medico' as any)} style={({ pressed }) => [{ marginTop: 10, opacity: pressed ? 0.7 : 1 }]}>
      <Row gap={14} style={{ backgroundColor: c.bg1, borderRadius: radius.lg, padding: 16 }}>
        <Row style={{ width: 34 + (time.length - 1) * 22 }}>
          {time.map((p, i) => (
            <View key={p.name} style={{ position: 'absolute', left: i * 22, borderWidth: 2, borderColor: c.bg1, borderRadius: 19 }}>
              <Retrato nome={p.name} size={34} />
            </View>
          ))}
        </Row>
        {/* A linha de baixo é convite e não legenda: este card é a porta
            para a tela da clínica, e "Nutricionista · Enfermeira" sozinho
            parece um rótulo do que já está à vista nos retratos. */}
        <View style={{ flex: 1 }}>
          <Txt v="bodyMed">Sua equipe de apoio</Txt>
          <Txt v="micro" c={c.tx3} style={{ marginTop: 2 }} numberOfLines={1}>
            {time.map((p) => p.role).join(' · ')}
          </Txt>
          <Row gap={5} style={{ marginTop: 7 }}>
            <Txt v="label" c={c.accent2} style={{ fontSize: 13 }}>Conheça toda a equipe</Txt>
            <Icon name="chev" size={12} color={c.accent2} sw={2.2} />
          </Row>
        </View>
      </Row>
    </Pressable>
  );
}

/** O que a clínica mandou para você — orientação recebida, não prova
    enviada. Por isso não se mistura com Documentos. */
function Materiais() {
  const S = useStore((s) => s.S);
  const { c } = useTheme();
  const router = useRouter();
  const mats = ((S as any).materials ?? []) as { name: string; kind: string; meta: string; ic: string; motivo: string }[];
  if (!mats.length) return null;

  return (
    <View style={{ marginTop: 36 }}>
      <SectionHead title="Preparado para você" />
      <Txt v="note" c={c.tx3} style={{ marginTop: 4 }}>
        Material que sua equipe montou a partir do seu tratamento.
      </Txt>
      <ScrollView
        horizontal showsHorizontalScrollIndicator={false}
        style={{ marginTop: 14, marginHorizontal: -PAD }}
        contentContainerStyle={{ paddingHorizontal: PAD, gap: 10 }}
      >
        {mats.map((m) => (
          <Pressable key={m.name} onPress={() => router.push('/protocolos' as any)} style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1 }]}>
            <View style={{ width: 178, backgroundColor: c.bg1, borderRadius: radius.lg, padding: 16 }}>
              {/* o ícone diz o formato antes do rótulo dizer: vídeo, guia e
                  checklist se consomem de maneiras diferentes, e saber isso
                  antes de tocar evita abrir a coisa errada com pressa */}
              <Row style={{ justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <View style={{ width: 36, height: 36, borderRadius: radius.sm, backgroundColor: c.limeWeak, alignItems: 'center', justifyContent: 'center' }}>
                  <Icon name={m.ic} size={17} color={c.tx} sw={1.9} />
                </View>
                <View style={{ backgroundColor: c.bg2, borderRadius: radius.sm, paddingHorizontal: 7, paddingVertical: 3 }}>
                  <Txt v="micro" c={c.tx2}>{m.kind}</Txt>
                </View>
              </Row>
              <Txt v="bodyMed" style={{ marginTop: 12, lineHeight: 21 }} numberOfLines={2}>{m.name}</Txt>
              {/* o motivo é o que separa curadoria de biblioteca: sem ele o
                  card diz o que É, com ele diz por que está aqui */}
              <Txt v="micro" c={c.accent2} style={{ marginTop: 7, lineHeight: 16 }} numberOfLines={2}>{m.motivo}</Txt>
              <Txt v="micro" c={c.tx4} style={{ marginTop: 6 }}>{m.meta}</Txt>
            </View>
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );
}

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
  if (!cs) return null;

  const go = (to: string) => () => router.push(to as any);
  /* fmtDate devolve "14 ago" — dia e mês separados por espaço, não por
     barra. O bloco de calendário quer as duas metades soltas. */
  const dia = cs.data.getDate();
  const mes = (fmtDate(cs.data).split(' ')[1] ?? '').toUpperCase();

  return (
    <View style={{ marginTop: 36 }}>
      <SectionHead title="Sua próxima consulta" link="Histórico" onPress={go('/consultas')} />
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
                <Txt v="label" c={c.accent2}>Preparar com o Morphi</Txt>
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
  const dose = nf(S.profile.dose, S.profile.dose % 1 ? 1 : 0);
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
              <Txt v="title">{med.label} {dose} {med.unit}</Txt>
              <Txt v="caption" c={c.tx3} style={{ marginTop: 3 }}>
                {med.cad === 'weekly' ? '1× por semana' : 'diariamente'} · {receita?.by ?? S.profile.doctor}
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
            <Txt v="caption" c={critico ? c.cta : p.verdict.good ? c.tx3 : c.accent2}>{p.verdict.label}</Txt>
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

          {!p.verdict.good && (
            <Pressable onPress={go('/medico')} style={({ pressed }) => [{ marginTop: 18, alignSelf: 'flex-start', opacity: pressed ? 0.8 : 1 }]}>
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
function Documentos() {
  const S = useStore((s) => s.S);
  const { c } = useTheme();
  const router = useRouter();
  const docs = careDocs(S);
  if (!docs.length) return null;

  return (
    <View style={{ marginTop: 36 }}>
      <SectionHead title="Documentos" link="Exames" onPress={() => router.push('/exames' as any)} />
      <View style={{ backgroundColor: c.bg1, borderRadius: radius.lg, marginTop: 14, paddingHorizontal: 18 }}>
        {docs.map((d, i) => (
          <React.Fragment key={d.nome + d.t}>
            {i > 0 && <View style={{ height: 1, backgroundColor: c.line2 }} />}
            <Pressable onPress={() => router.push(d.to as any)} style={({ pressed }) => [{ opacity: pressed ? 0.6 : 1 }]}>
              <Row gap={14} style={{ paddingVertical: 18 }}>
                <View style={{ width: 34, height: 34, borderRadius: radius.sm, backgroundColor: c.bg2, alignItems: 'center', justifyContent: 'center' }}>
                  <Icon name={d.tipo === 'Receita' ? 'pill' : 'doc'} size={16} color={c.tx2} sw={1.9} />
                </View>
                <View style={{ flex: 1 }}>
                  <Txt v="bodyMed" numberOfLines={1}>{d.nome}</Txt>
                  {/* o tipo em selo e não em texto corrido: numa lista
                      misturando exame, resumo e receita, é ele que a pessoa
                      varre para achar o que procura */}
                  <Row gap={7} style={{ marginTop: 5 }}>
                    <View style={{ backgroundColor: c.bg2, borderRadius: radius.sm, paddingHorizontal: 7, paddingVertical: 3 }}>
                      <Txt v="micro" c={c.tx2}>{d.tipo}</Txt>
                    </View>
                    <Txt v="micro" c={c.tx3}>{relDay(new Date(d.t))}</Txt>
                  </Row>
                </View>
                <Icon name="chev" size={14} color={c.tx4} sw={2} />
              </Row>
            </Pressable>
          </React.Fragment>
        ))}
      </View>
    </View>
  );
}

/* ------------------------------------------------------------------ *
 * SEM VÍNCULO — descoberta
 *
 * O diretório real de profissionais depende de backend, que o app ainda
 * não tem. Então aqui não existe lista falsa: existe o convite e o que o
 * vínculo muda na prática.
 * ------------------------------------------------------------------ */
function Descoberta() {
  const { c } = useTheme();
  const router = useRouter();
  const pontos: [string, string, string][] = [
    ['steth', 'Especialistas credenciados', 'Médicos que acompanham tratamento com GLP-1 de perto.'],
    ['doc', 'Seus dados já organizados', 'Peso, aplicações, sintomas e exames prontos para a primeira consulta.'],
    ['companion', 'Conversa direta', 'Mensagens e retorno sem precisar remarcar consulta.'],
  ];
  return (
    <>
      <Card tint={c.accentWeak} style={{ marginTop: 24 }}>
        <IconBadge name="heart" size={48} bg={c.bg1} />
        <Txt v="h2" style={{ marginTop: 14 }}>Encontre quem acompanhe seu tratamento</Txt>
        <Txt v="note" c={c.tx2} style={{ marginTop: 8 }}>
          Você pode seguir sozinha no Morphi. Mas quem tem acompanhamento profissional
          ajusta dose e protocolo com mais segurança — e essa decisão não é sua para
          tomar sozinha.
        </Txt>
      </Card>

      <View style={{ backgroundColor: c.bg1, borderRadius: radius.lg, marginTop: 14, padding: 16 }}>
        {pontos.map(([ic, t, sub], i) => (
          <React.Fragment key={t}>
            {i > 0 && <Divider style={{ marginVertical: 14 }} />}
            <Row style={{ alignItems: 'flex-start' }}>
              <IconBadge name={ic} size={38} />
              <View style={{ flex: 1, marginLeft: 12 }}>
                <Txt v="body">{t}</Txt>
                <Txt v="caption" c={c.tx3} style={{ marginTop: 2 }}>{sub}</Txt>
              </View>
            </Row>
          </React.Fragment>
        ))}
      </View>

      <Pressable onPress={() => router.push('/perfil' as any)} style={({ pressed }) => [{ marginTop: 16, opacity: pressed ? 0.8 : 1 }]}>
        <View style={{ backgroundColor: c.accent, borderRadius: radius.pill, paddingVertical: 15, alignItems: 'center' }}>
          <Txt v="body" c={c.accentInk}>Vincular uma clínica</Txt>
        </View>
      </Pressable>
    </>
  );
}

export default function Cuidado() {
  const S = useStore((s) => s.S);
  const { c } = useTheme();
  const insets = useSafeAreaInsets();
  const linked = hasClinic(S);

  return (
    <View style={{ flex: 1, backgroundColor: c.bg }}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: PAD, paddingTop: insets.top + 20, paddingBottom: 120 }}
      >
        {/* Sem título de tela. A tab bar já diz onde a pessoa está, e
            repetir "Cuidado" no topo gasta a primeira dobra com informação
            que ela acabou de dar. O banner da especialista abre direto —
            é ele que responde por que se veio aqui.

            No estado sem vínculo o título fica, porque ali não há
            especialista para abrir a tela e a frase é o convite. */}
        {!linked && (
          <Txt v="note" c={c.tx3}>Ninguém precisa fazer isso sozinho.</Txt>
        )}

        {linked ? (
          /* Oito blocos, e cada assunto aparece em exatamente um.

             Estado (hero) → ação (Precisa de você) → compromisso
             (Consulta) → pessoas (Especialista, Equipe) → medicamento
             (Tratamento) → recursos (Materiais, Documentos).

             A regra que a iteração passada quebrou e esta restabelece:
             consulta só na Consulta, mensagem só no card da especialista,
             dose e receita só no Tratamento. Nada volta ao hero — ele
             lê o conjunto, não reexibe as partes. */
          <>
            <Topo />

            <Pendencias />
            <Consulta />
            <BannerMedica />
            <Time />
            <Tratamento />
            <Materiais />
            <Documentos />
          </>
        ) : (
          <Descoberta />
        )}
      </ScrollView>
    </View>
  );
}
