import React from 'react';
import { View, Pressable, ScrollView, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Defs, Ellipse, RadialGradient, Stop } from 'react-native-svg';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useStore } from '../../logic/store';
import {
  hasClinic, nextConsult, lastMessage, carePending, careDocs, careStatus,
  doseContext, doseCycle, nextInjectionDate, penStock, M,
} from '../../logic/derive';
import { CADENCE_DAYS } from '../../logic/meds';
import { Medidor, Glifos, Malha } from '../../ui/instrumentos';
import { fmtDate, relDay, DOW_PT, nf, now, diffDays } from '../../logic/time';
import { Txt, Card, Row, IconBadge, SectionHead, Divider } from '../../ui/kit';
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

/** Régua das semanas de tratamento.

    Um traço por semana, o de hoje em lima e mais alto. Não é gráfico —
    não há valor nos eixos — é uma linha do tempo: mostra quanto já
    andou e que a contagem continua. É o elemento que faz o card dizer
    "acompanhamento contínuo" sem escrever a palavra. */
function Regua({ semana, total = 24, sobreEscuro = false }: { semana: number; total?: number; sobreEscuro?: boolean }) {
  const { c } = useTheme();
  return (
    <Row gap={3} style={{ alignItems: 'flex-end', height: 34 }}>
      {Array.from({ length: total }, (_, i) => {
        const passada = i < semana;
        const hoje = i === semana - 1;
        /* o traço de hoje é o único cheio e em lima. O passado fica opaco
           e o futuro quase apagado — a régua conta o tempo sem prometer um
           fim, porque tratamento com GLP-1 não tem data de alta marcada */
        const cor = sobreEscuro
          ? (hoje ? c.lime : passada ? 'rgba(255,255,255,0.72)' : 'rgba(255,255,255,0.22)')
          : (hoje ? c.accent : passada ? c.accentLine : c.line);
        return (
          <View
            key={i}
            style={{
              flex: 1,
              height: hoje ? 34 : passada ? 17 : 10,
              borderRadius: 2,
              backgroundColor: cor,
            }}
          />
        );
      })}
    </Row>
  );
}

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

/** O topo.

    Antes era a ficha da médica; agora é o estado do acompanhamento. A
    inversão é de sujeito: quem abre esta aba não pergunta "quem é minha
    médica?" — sabe quem é. Pergunta "como está meu cuidado?", e a frase
    grande responde isso.

    Ela aparece só como uma linha de contexto ("acompanha você há N
    semanas"). O retrato dela está no banner, mais abaixo. */
function Topo() {
  const S = useStore((s) => s.S);
  const { c } = useTheme();
  const st = careStatus(S);

  const semanas = Math.max(1, Math.floor(diffDays(now(), new Date(S.profile.startT)) / 7));

  const cs = nextConsult(S);
  const desde = fmtDate(new Date(S.profile.startT));

  /* Ocupa metade da dobra. Card pequeno com malha pálida virava papel de
     parede: a cor não tinha área para acontecer e o texto escuro puxava
     tudo de volta para o registro clínico. Grande e saturado, com texto
     branco, ele deixa de ser um cabeçalho e passa a ser a primeira coisa
     que a tela É. */
  return (
    <View style={{ height: 396, borderRadius: radius.xl, overflow: 'hidden', backgroundColor: c.altMid }}>
      <Malha id="cuidadoTopo" forca={1} escura />

      <View style={{ flex: 1, padding: 24, justifyContent: 'space-between' }}>
        <View>
          <Row gap={8}>
            <View style={{ width: 7, height: 7, borderRadius: 4, backgroundColor: c.lime }} />
            <Txt v="micro" c={c.onHero2} style={{ letterSpacing: 1.1 }}>SEU ACOMPANHAMENTO</Txt>
          </Row>

          {/* A frase de estado é a manchete, e vem antes de qualquer
              pendência: a pessoa precisa saber que está indo bem antes de
              saber o que falta. Invertido, a tela vira aviso. */}
          <Txt v="display" c={c.onHero} style={{ fontSize: 31, lineHeight: 39, marginTop: 16 }}>
            {st.titulo}
          </Txt>
          <Txt v="caption" c={c.onHero2} style={{ marginTop: 10, lineHeight: 21, maxWidth: '92%' }}>
            {st.sub}
          </Txt>
        </View>

        <View>
          {/* A régua responde "há quanto tempo alguém olha isso", que é a
              prova de continuidade que a aba precisa dar de cara. Semana é
              a unidade certa: dia é curto demais para mostrar constância,
              mês é longo demais para mostrar ritmo. */}
          <Regua semana={semanas} sobreEscuro />
          <Row style={{ marginTop: 10 }}>
            <Txt v="micro" c={c.onHero2} style={{ flex: 1 }}>desde {desde}</Txt>
            <Txt v="micro" c={c.lime}>semana {semanas}</Txt>
          </Row>
        </View>

        {/* Em vidro, dentro do card: o próximo contato é a informação mais
            tranquilizadora que existe aqui — não o que falta fazer, mas
            quando alguém vai olhar de novo. */}
        {!!cs && (
          <Row gap={12} style={{ backgroundColor: c.glass, borderWidth: 1, borderColor: c.glassLine, borderRadius: radius.lg, padding: 14 }}>
            <View style={{ width: 38, height: 38, borderRadius: 19, backgroundColor: 'rgba(255,255,255,0.16)', alignItems: 'center', justifyContent: 'center' }}>
              <Icon name="cal" size={17} color={c.onHero} sw={1.9} />
            </View>
            <View style={{ flex: 1 }}>
              <Txt v="micro" c={c.onHero2}>PRÓXIMO CONTATO</Txt>
              <Txt v="caption" c={c.onHero} style={{ marginTop: 2 }}>
                {cs.tipo} {cs.label} · {fmtDate(cs.data)}
              </Txt>
            </View>
          </Row>
        )}
      </View>
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

/** As quatro dimensões do cuidado, com o estado de cada uma.

    Convive com "Precisa de você" sem repeti-la porque responde outra
    pergunta. Aqui aparecem TODAS, inclusive as que estão bem — e é
    justamente "Receita: vence em 3 semanas" quando não há nada a fazer
    que dá a sensação de acompanhamento contínuo. A lista de baixo diz o
    que fazer; esta diz como está. */
function CuidadoHoje() {
  const S = useStore((s) => s.S);
  const { c } = useTheme();
  const router = useRouter();
  const st = careStatus(S);

  return (
    <View style={{ marginTop: 30 }}>
      <SectionHead title="Seu cuidado hoje" />
      {/* Um ponto de estado por card, em três níveis.

          Cor pequena e saturada em vez de card inteiro tingido: o ponto se
          lê de relance e não muda o peso do bloco, então os quatro
          continuam iguais em importância enquanto dizem coisas diferentes.
          Tingir o card do exame pendente faria dele o assunto da seção,
          quando o assunto é o conjunto.

          Três níveis, porque dois não bastam: receita vencendo em três
          semanas e exame já atrasado não pedem a mesma reação, e igualá-los
          ensina a ignorar os dois. */}
      <Row gap={8} style={{ flexWrap: 'wrap', marginTop: 14 }}>
        {st.tiles.map((t) => {
          const cor = t.nivel === 'acao' ? c.cta : t.nivel === 'atencao' ? c.amber : c.teal;
          return (
            <Pressable key={t.label} onPress={() => router.push(t.to as any)} style={({ pressed }) => [{ width: '48.4%', opacity: pressed ? 0.65 : 1 }]}>
              <View style={{ backgroundColor: c.bg1, borderRadius: radius.lg, padding: 16, marginBottom: 8 }}>
                <Row style={{ justifyContent: 'space-between', alignItems: 'center' }}>
                  <Icon name={t.ic} size={17} color={c.tx3} sw={1.9} />
                  <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: cor }} />
                </Row>
                <Txt v="micro" c={c.tx3} style={{ marginTop: 14 }}>{t.label}</Txt>
                <Txt v="bodyMed" style={{ marginTop: 2 }} numberOfLines={1}>{t.valor}</Txt>
              </View>
            </Pressable>
          );
        })}
      </Row>
    </View>
  );
}

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

/** O que está esperando você. Só aparece quando há algo — seção vazia com
    "nada pendente" é um lembrete de olhar para o nada. */
function Pendencias() {
  const S = useStore((s) => s.S);
  const { c } = useTheme();
  const router = useRouter();
  const itens = carePending(S);
  if (!itens.length) return null;

  return (
    <View style={{ marginTop: 36 }}>
      <SectionHead title="Precisa de você" />
      <View style={{ marginTop: 14 }}>
        {itens.map((it, i) => (
          <Pressable key={it.texto} onPress={() => router.push(it.to as any)} style={({ pressed }) => [{ opacity: pressed ? 0.6 : 1 }]}>
            <Row gap={14} style={{ paddingVertical: 15, borderTopWidth: i === 0 ? 0 : 1, borderTopColor: c.line }}>
              {/* destaque em azul, não em vermelho: nada nesta lista é
                  emergência — é o que precisa de um toque seu, e o vermelho
                  fica reservado para o que é clinicamente grave */}
              <View style={{ width: 34, height: 34, borderRadius: 17, backgroundColor: it.urgente ? c.accentWeak : c.bg2, alignItems: 'center', justifyContent: 'center' }}>
                <Icon name={it.ic} size={16} color={it.urgente ? c.accent : c.tx2} sw={1.9} />
              </View>
              <Txt v="bodyMed" style={{ flex: 1, lineHeight: 22 }}>{it.texto}</Txt>
              <Icon name="chev" size={15} color={c.tx4} sw={2} />
            </Row>
          </Pressable>
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
            <Pressable onPress={go('/companion?q=Prepare%20minha%20consulta')} style={({ pressed }) => [{ marginTop: 14, alignSelf: 'flex-start', opacity: pressed ? 0.8 : 1 }]}>
              <Row gap={8} style={{ borderWidth: 1, borderColor: c.line, borderRadius: radius.pill, paddingHorizontal: 16, paddingVertical: 11 }}>
                <Icon name="aura" size={15} color={c.accent} sw={1.9} />
                <Txt v="label" c={c.accent2}>Preparar com o Companion</Txt>
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
  const ciclo = doseCycle(S);
  /* posição entre a última aplicação e a próxima, em 0..1 */
  const cad = CADENCE_DAYS(S.profile.med);
  const faltam = diffDays(nextInjectionDate(S), now());
  const posCiclo = Math.max(0, Math.min(1, (cad - faltam) / cad));

  return (
    <View style={{ marginTop: 36 }}>
      <SectionHead title="Seu tratamento" link="Aplicações" onPress={go('/aplicacoes')} />

      {/* Card escuro com malha, e não branco.

          Os instrumentos só existem com luz: uma cápsula que emite lima e
          um marcador com fulgor precisam de escuro atrás para acender. Em
          card branco eles viram gráfico de barras colorido — que é
          exatamente o que a tela tinha antes.

          E há uma razão de conteúdo: este é o único card da aba que fala
          da substância no corpo da pessoa. Escuro, ele se destaca dos
          brancos ao redor como assunto de outra natureza. */}
      <View style={{ borderRadius: radius.xl, marginTop: 14, overflow: 'hidden', backgroundColor: c.altTo }}>
        <Malha id="cuidadoTratamento" forca={0.9} escura />

        <View style={{ padding: 22 }}>
          <Row gap={14}>
            <View style={{ width: 44, height: 44, borderRadius: 22, backgroundColor: c.glass, borderWidth: 1, borderColor: c.glassLine, alignItems: 'center', justifyContent: 'center' }}>
              <Icon name="syringe" size={20} color={c.onHero} sw={1.8} />
            </View>
            <View style={{ flex: 1 }}>
              <Txt v="title" c={c.onHero}>{med.label} {dose} {med.unit}</Txt>
              <Txt v="caption" c={c.onHero2} style={{ marginTop: 3 }}>
                {med.cad === 'weekly' ? '1× por semana' : 'diariamente'} · {receita?.by ?? S.profile.doctor}
              </Txt>
            </View>
          </Row>

          {/* Três frases curtas em vidro. Cada uma é um tempo diferente do
              mesmo tratamento — o que vem, o que dura, o que será revisto. */}
          <Row gap={7} style={{ flexWrap: 'wrap', marginTop: 18 }}>
            {[ctx.proxima, ctx.naDose, ctx.revisao].filter(Boolean).map((frase) => (
              <View key={frase as string} style={{ backgroundColor: c.glass, borderWidth: 1, borderColor: c.glassLine, borderRadius: radius.pill, paddingHorizontal: 11, paddingVertical: 6, marginBottom: 3 }}>
                <Txt v="micro" c={c.onHero}>{frase}</Txt>
              </View>
            ))}
          </Row>

          <View style={{ height: 1, backgroundColor: c.glassLine, marginVertical: 20 }} />

          {/* Onde estou no ciclo desta dose.

              Nenhum número diz isso: "aplicou há 4 dias" é dado, mas a
              posição entre uma aplicação e a próxima é o que explica por
              que a fome muda ao longo da semana. A escala tem direção — do
              pico ao vale — então os traços vão do teal ao lima, e o
              marcador acende no ponto de hoje. */}
          <Row style={{ marginBottom: 6 }}>
            <Txt v="caption" c={c.onHero2} style={{ flex: 1 }}>Onde você está no ciclo</Txt>
            <Txt v="micro" c={c.lime}>{ciclo.phase.label}</Txt>
          </Row>
          <Medidor pct={posCiclo} cor={c.lime} escala={[c.teal, c.accent2]} altura={30} sobreEscuro />

          <View style={{ height: 1, backgroundColor: c.glassLine, marginVertical: 20 }} />

          {/* Doses como cápsulas acesas, não como barra segmentada.

              Uma dose é contável e são só quatro — então cada uma pode ter
              corpo próprio, com degradê e fulgor. A que falta fica em
              contorno vazado: dose gasta não é dose apagada, é dose
              ausente, e ausência se desenha com o vazio. "3 de 4" deixa de
              precisar ser lido.

              Vermelho só quando resta uma dose ou menos. "Vale renovar a
              receita" é lembrete com semanas de antecedência, e pintá-lo de
              vermelho o iguala a um problema clínico — que é o que a cor de
              alerta precisa continuar significando neste app. */}
          <Row>
            <Txt v="caption" c={c.onHero2} style={{ flex: 1 }}>Doses na caneta</Txt>
            <Txt v="caption" c={critico ? c.cta2 : p.verdict.good ? c.onHero2 : c.lime}>{p.verdict.label}</Txt>
          </Row>
          <View style={{ marginTop: 14 }}>
            <Glifos
              total={p.total} cheios={p.left}
              de={critico ? c.cta2 : c.lime} para={critico ? c.cta : c.teal}
              altura={34} sobreEscuro
            />
          </View>
          <Txt v="caption" c={c.onHero2} style={{ marginTop: 12 }}>
            {p.left} de {p.total} · cerca de {p.semanas} {p.semanas === 1 ? 'semana' : 'semanas'}
          </Txt>

          {!p.verdict.good && (
            <Pressable onPress={go('/medico')} style={({ pressed }) => [{ marginTop: 18, alignSelf: 'flex-start', opacity: pressed ? 0.8 : 1 }]}>
              <Row gap={8} style={{ backgroundColor: c.lime, borderRadius: radius.pill, paddingHorizontal: 18, paddingVertical: 11 }}>
                <Txt v="label" c={c.limeInk}>Pedir renovação</Txt>
                <Icon name="chev" size={13} color={c.limeInk} sw={2.2} />
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
          Você pode seguir sozinha no Forma. Mas quem tem acompanhamento profissional
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
          /* A ordem responde, nesta sequência: como está o cuidado, o que
             precisa de mim, quando é o próximo contato, o que existe de
             comunicação, quem mais cuida, o que estou tomando, o que
             prepararam, o que já foi trocado. Do estado à ação, da ação ao
             calendário, e só então ao arquivo. */
          <>
            <Topo />

            <CuidadoHoje />
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
