import React from 'react';
import { View, Pressable, ScrollView, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Defs, Ellipse, RadialGradient, Stop } from 'react-native-svg';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useStore } from '../../logic/store';
import {
  hasClinic, nextConsult, lastMessage, carePending, careDocs, penStock, M,
} from '../../logic/derive';
import { fmtDate, relDay, DOW_PT, nf, now, diffDays } from '../../logic/time';
import { Txt, Card, Row, IconBadge, SectionHead, Divider } from '../../ui/kit';
import { Icon } from '../../ui/Icon';
import { useTheme } from '../../ui/useTheme';
import { radius } from '../../theme';

/* ============================================================
   CUIDADO — a aba das pessoas

   As outras três abas são sobre dados: a Home mostra o dia, a Jornada a
   história, o Insights a interpretação. Esta é sobre quem cuida — e por
   isso é a única sem hero colorido.

   A identidade vem da ausência: fundo claro, tipografia grande e muito
   ar. Um degradê aqui poria a tela no mesmo registro das outras, e o
   assunto pede o contrário — calma, não energia. Quem abre esta aba
   normalmente está com uma dúvida ou uma pendência, não explorando.

   Duas telas dentro de uma. Com clínica vinculada, é o painel do
   acompanhamento; sem vínculo, é a porta de entrada para encontrar um
   especialista — e nesse caso nada aqui finge que já existe uma equipe.
   ============================================================ */

const PAD = 24;
const FOTO_MEDICA = require('../../../assets/images/especialista.png');

/* ------------------------------------------------------------------ *
 * COM VÍNCULO
 * ------------------------------------------------------------------ */

/** Quem cuida de você. Abre a tela porque é a resposta à pergunta que traz
    a pessoa aqui — "com quem eu falo?" — e não um cabeçalho decorativo. */
/** Inicial dentro de um bloco tingido. Substitui a foto que o app ainda não
    tem — e não finge ter: nome próprio em corpo grande identifica uma pessoa
    tão bem quanto um retrato, e melhor que um avatar genérico. */
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

function Equipe() {
  const S = useStore((s) => s.S);
  const { c } = useTheme();
  const router = useRouter();
  const go = (to: string) => () => router.push(to as any);

  const info: any = (S.profile as any).doctorInfo ?? {};
  const msg = lastMessage(S);
  const semanasJuntas = Math.max(1, Math.floor(diffDays(now(), new Date(S.profile.startT)) / 7));

  /* Mensagem saiu daqui e virou o botão do banner. O que sobra são os
     quatro destinos que a pessoa procura depois de já ter decidido não
     escrever: quando é, o que foi orientado, o que foi medido, e quem é
     ela. */
  const acoes: [string, string, string][] = [
    ['cal', 'Consultas', '/consultas'],
    ['doc', 'Protocolos', '/protocolos'],
    ['chart', 'Exames', '/exames'],
    ['info', 'Sobre', '/especialista'],
  ];

  return (
    <View>
      {/* O banner da especialista, seguindo o frame 173:1674.

          Duas mudanças em relação à versão anterior mudam tudo. A primeira
          é a foto: recorte em PNG com transparência, e não retrato com
          fundo de estúdio. Foto recortada não tem emenda para disfarçar —
          ela pousa sobre o degradê, e a pessoa fica DENTRO do card em vez
          de colada nele.

          A segunda é onde o lima está. Antes ele tingia o card inteiro, o
          que gastava a cor mais forte da marca num fundo; agora o fundo é
          um azul lavanda quase branco e o lima fica só no botão — que é o
          que a pessoa vem fazer aqui. Cor de energia em superfície é
          decoração; em botão é chamada. */}
      <View style={{ height: 196, borderRadius: radius.xl, overflow: 'hidden' }}>
        <LinearGradient
          colors={[c.bg1, c.bg1, c.bluePale]}
          locations={[0, 0.42, 1]}
          start={{ x: 0, y: 0.15 }} end={{ x: 1, y: 0.9 }}
          style={StyleSheet.absoluteFillObject}
        />
        <Svg width={230} height={190} style={{ position: 'absolute', right: -40, top: -40 }} pointerEvents="none">
          <Defs>
            <RadialGradient id="brilhoMedica" cx="50%" cy="50%" r="50%">
              <Stop offset="0" stopColor={c.accent} stopOpacity={0.16} />
              <Stop offset="0.6" stopColor={c.accent} stopOpacity={0.05} />
              <Stop offset="1" stopColor={c.accent} stopOpacity={0} />
            </RadialGradient>
          </Defs>
          <Ellipse cx={115} cy={95} rx={115} ry={95} fill="url(#brilhoMedica)" />
        </Svg>

        {/* alinhada pela base: a foto encosta no rodapé do card, como no
            frame — retrato flutuando no meio parece adesivo */}
        <Image
          source={FOTO_MEDICA}
          style={{ position: 'absolute', right: -6, bottom: 0, width: 132, height: 188 }}
          contentFit="contain"
          contentPosition="bottom center"
        />

        <View style={{ flex: 1, padding: 20, justifyContent: 'center' }}>
          <Txt v="micro" c={c.tx3} style={{ letterSpacing: 1.1 }}>SUA ESPECIALISTA</Txt>
          <Txt v="h2" style={{ marginTop: 7, maxWidth: '68%' }}>{S.profile.doctor}</Txt>
          <Row gap={6} style={{ marginTop: 5 }}>
            <Icon name="heart" size={13} color={c.tx3} sw={1.9} />
            <Txt v="caption" c={c.tx2}>{S.profile.clinic}</Txt>
          </Row>

          <Pressable onPress={go('/medico')} style={({ pressed }) => [{ marginTop: 16, alignSelf: 'flex-start', opacity: pressed ? 0.82 : 1 }]}>
            <Row gap={10} style={{ backgroundColor: c.lime, borderRadius: radius.pill, paddingLeft: 8, paddingRight: 20, paddingVertical: 8 }}>
              <View style={{ width: 30, height: 30, borderRadius: 15, backgroundColor: 'rgba(255,255,255,0.55)', alignItems: 'center', justifyContent: 'center' }}>
                <Icon name="companion" size={16} color={c.limeInk} sw={2} />
              </View>
              <Txt v="bodyMed" c={c.limeInk}>Enviar mensagem</Txt>
              {S.unread > 0 && (
                <View style={{ width: 18, height: 18, borderRadius: 9, backgroundColor: c.limeInk, alignItems: 'center', justifyContent: 'center' }}>
                  <Txt v="micro" c={c.lime} style={{ fontSize: 10 }}>{S.unread}</Txt>
                </View>
              )}
            </Row>
          </Pressable>
        </View>
      </View>

      {/* atalhos que saíram do banner: lá dentro competiam com o botão, e
          o botão é a ação principal */}
      <Row gap={8} style={{ marginTop: 10 }}>
        {acoes.map(([ic, label, to]) => (
          <Pressable key={label} onPress={go(to)} style={({ pressed }) => [{ flex: 1, opacity: pressed ? 0.6 : 1 }]}>
            <View style={{ backgroundColor: c.bg1, borderRadius: radius.md, paddingVertical: 14, alignItems: 'center' }}>
              <Icon name={ic} size={18} color={c.tx} sw={1.8} />
              <Txt v="micro" c={c.tx2} style={{ marginTop: 6 }}>{label}</Txt>
            </View>
          </Pressable>
        ))}
      </Row>

      {/* Credenciais em faixa. Não é vaidade da clínica: num app que não
          prescreve nada, saber quem prescreve é a informação que sustenta a
          confiança no tratamento inteiro. */}
      {!!info.anos && (
        <Row style={{ backgroundColor: c.bg1, borderRadius: radius.lg, marginTop: 10, paddingVertical: 16 }}>
          {[
            ['shield', `${info.anos} anos`, 'de experiência'],
            ['user', `${(info.pacientes / 1000).toFixed(1).replace('.', ',')}k+`, 'pacientes'],
            /* a terceira não é credencial dela, é da relação: repetir
               "Endocrinologista" aqui só ecoaria o cabeçalho, e o que o
               cabeçalho não diz é há quanto tempo vocês estão juntas */
            ['cal', `${semanasJuntas} sem`, 'acompanhando você'],
          ].map(([ic, valor, label], i) => (
            <React.Fragment key={label}>
              {i > 0 && <View style={{ width: 1, backgroundColor: c.line2, marginVertical: 2 }} />}
              <View style={{ flex: 1, alignItems: 'center' }}>
                <Icon name={ic} size={16} color={c.accent} sw={1.9} />
                <Txt v="bodyMed" style={{ marginTop: 6 }} numberOfLines={1}>{valor}</Txt>
                <Txt v="micro" c={c.tx3} style={{ marginTop: 1 }}>{label}</Txt>
              </View>
            </React.Fragment>
          ))}
        </Row>
      )}

      {/* A última mensagem, desenhada como mensagem.

          Antes era um card com overline e parágrafo — a mesma forma dos
          outros seis cards da tela, e por isso não lia como conversa. Agora
          tem o que uma conversa tem: quem falou à esquerda, o balão com o
          canto quebrado do lado de quem enviou, a hora embaixo. O balão
          vindo dela é cinza e alinhado à esquerda; o seu seria azul e à
          direita, exatamente como no thread.

          A caixa de escrever no rodapé não escreve — leva para o thread.
          É isca deliberada: a forma do campo diz "dá para responder" mais
          rápido do que qualquer rótulo diria. */}
      {!!msg && (
        <Pressable onPress={go('/medico')} style={({ pressed }) => [{ marginTop: 10, opacity: pressed ? 0.75 : 1 }]}>
          <View style={{ backgroundColor: c.bg1, borderRadius: radius.lg, padding: 16 }}>
            <Row gap={10} style={{ alignItems: 'flex-end' }}>
              <Retrato nome={msg.daEquipe ? S.profile.doctor : S.profile.name} size={30} />
              <View style={{ flex: 1 }}>
                <View style={{
                  backgroundColor: msg.daEquipe ? c.bg2 : c.accentWeak,
                  borderRadius: radius.lg, borderBottomLeftRadius: msg.daEquipe ? 5 : radius.lg,
                  borderBottomRightRadius: msg.daEquipe ? radius.lg : 5,
                  paddingHorizontal: 14, paddingVertical: 12,
                }}>
                  <Txt v="caption" c={c.tx} style={{ lineHeight: 21 }} numberOfLines={3}>{msg.text}</Txt>
                </View>
                <Row gap={7} style={{ marginTop: 6, paddingLeft: 4 }}>
                  <Txt v="micro" c={c.tx4}>
                    {msg.daEquipe ? S.profile.doctor.split(' ').slice(0, 2).join(' ') : 'Você'} · {msg.quando}
                  </Txt>
                  {S.unread > 0 && msg.daEquipe && (
                    <Row gap={4}>
                      <View style={{ width: 5, height: 5, borderRadius: 3, backgroundColor: c.accent }} />
                      <Txt v="micro" c={c.accent2}>não lida</Txt>
                    </Row>
                  )}
                </Row>
              </View>
            </Row>

            <Row gap={10} style={{ marginTop: 14, backgroundColor: c.bg2, borderRadius: radius.pill, paddingLeft: 16, paddingRight: 6, paddingVertical: 6 }}>
              <Txt v="caption" c={c.tx4} style={{ flex: 1 }}>Responder…</Txt>
              <View style={{ width: 32, height: 32, borderRadius: 16, backgroundColor: c.accent, alignItems: 'center', justifyContent: 'center' }}>
                <Icon name="send" size={15} color={c.accentInk} sw={2} />
              </View>
            </Row>
          </View>
        </Pressable>
      )}
    </View>
  );
}

/** O resto da equipe, em carrossel. Cada um com o papel embaixo do nome:
    quem lê "Nutricionista" sabe para quem mandar a dúvida do prato sem
    precisar abrir e descobrir. */
function Time() {
  const S = useStore((s) => s.S);
  const { c } = useTheme();
  const router = useRouter();
  const time = ((S as any).team ?? []) as { name: string; role: string; sobre: string }[];
  if (!time.length) return null;

  return (
    <View style={{ marginTop: 36 }}>
      <SectionHead title="Sua equipe" link="Clínica" onPress={() => router.push('/medico' as any)} />
      <ScrollView
        horizontal showsHorizontalScrollIndicator={false}
        style={{ marginTop: 14, marginHorizontal: -PAD }}
        contentContainerStyle={{ paddingHorizontal: PAD, gap: 10 }}
      >
        {time.map((p) => (
          <Pressable key={p.name} onPress={() => router.push('/medico' as any)} style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1 }]}>
            <View style={{ width: 150, backgroundColor: c.bg1, borderRadius: radius.lg, padding: 16 }}>
              <Row style={{ justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <Retrato nome={p.name} size={48} />
                <View style={{ width: 26, height: 26, borderRadius: 13, backgroundColor: c.bg2, alignItems: 'center', justifyContent: 'center' }}>
                  <Icon name="companion" size={13} color={c.tx2} sw={1.9} />
                </View>
              </Row>
              <Txt v="bodyMed" style={{ marginTop: 12 }} numberOfLines={1}>{p.name}</Txt>
              <Txt v="micro" c={c.tx3} style={{ marginTop: 2 }}>{p.role}</Txt>
            </View>
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );
}

/** O que a clínica mandou para você — orientação recebida, não prova
    enviada. Por isso não se mistura com Documentos. */
function Materiais() {
  const S = useStore((s) => s.S);
  const { c } = useTheme();
  const router = useRouter();
  const mats = ((S as any).materials ?? []) as { name: string; kind: string; size: string }[];
  if (!mats.length) return null;

  return (
    <View style={{ marginTop: 36 }}>
      <SectionHead title="Materiais da clínica" />
      <Txt v="note" c={c.tx3} style={{ marginTop: 4 }}>O que sua equipe preparou para você.</Txt>
      <ScrollView
        horizontal showsHorizontalScrollIndicator={false}
        style={{ marginTop: 14, marginHorizontal: -PAD }}
        contentContainerStyle={{ paddingHorizontal: PAD, gap: 10 }}
      >
        {mats.map((m) => (
          <Pressable key={m.name} onPress={() => router.push('/protocolos' as any)} style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1 }]}>
            <View style={{ width: 160, backgroundColor: c.bg1, borderRadius: radius.lg, padding: 16 }}>
              <View style={{ width: 36, height: 36, borderRadius: radius.sm, backgroundColor: c.limeWeak, alignItems: 'center', justifyContent: 'center' }}>
                <Icon name="doc" size={17} color={c.tx} sw={1.9} />
              </View>
              <Txt v="bodyMed" style={{ marginTop: 12, lineHeight: 21 }} numberOfLines={2}>{m.name}</Txt>
              <Txt v="micro" c={c.tx3} style={{ marginTop: 4 }}>{m.kind} · {m.size}</Txt>
            </View>
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );
}

/** Fecho da aba: se nada acima resolveu, fala com gente. */
function FalarComClinica() {
  const { c } = useTheme();
  const router = useRouter();
  return (
    <Pressable onPress={() => router.push('/medico' as any)} style={({ pressed }) => [{ marginTop: 36, opacity: pressed ? 0.85 : 1 }]}>
      <Row gap={14} style={{ backgroundColor: c.limeWeak, borderRadius: radius.lg, padding: 18 }}>
        <View style={{ flex: 1 }}>
          <Txt v="title">Converse com sua clínica</Txt>
          <Txt v="caption" c={c.tx2} style={{ marginTop: 3 }}>Tire dúvidas e receba orientações.</Txt>
        </View>
        <View style={{ width: 44, height: 44, borderRadius: 22, backgroundColor: c.lime, alignItems: 'center', justifyContent: 'center' }}>
          <Icon name="companion" size={20} color={c.limeInk} sw={2} />
        </View>
      </Row>
    </Pressable>
  );
}

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

  return (
    <View style={{ marginTop: 36 }}>
      <SectionHead title="Seu tratamento" link="Aplicações" onPress={go('/aplicacoes')} />
      <View style={{ backgroundColor: c.bg1, borderRadius: radius.lg, marginTop: 14, padding: 20 }}>
        <Row gap={16}>
          <IconBadge name="syringe" size={44} />
          <View style={{ flex: 1 }}>
            <Txt v="title">{med.label} {dose} {med.unit}</Txt>
            <Txt v="caption" c={c.tx3} style={{ marginTop: 3 }}>
              {med.cad === 'weekly' ? '1× por semana' : 'diariamente'} · prescrito por {receita?.by ?? S.profile.doctor}
            </Txt>
          </View>
        </Row>

        <Divider style={{ marginVertical: 18 }} />

        {/* Estoque em barra: "3 doses" não diz se é muito ou pouco; a barra
            contra o total da caneta diz na hora.

            Vermelho só quando resta uma dose ou menos. "Vale renovar a
            receita" é lembrete com semanas de antecedência, e pintá-lo de
            vermelho o iguala a um problema clínico — que é o que a cor de
            alerta precisa continuar significando neste app. */}
        <Row>
          <Txt v="caption" c={c.tx2} style={{ flex: 1 }}>Doses na caneta</Txt>
          <Txt v="caption" c={critico ? c.cta : p.verdict.good ? c.tx3 : c.accent2}>{p.verdict.label}</Txt>
        </Row>
        <Row gap={5} style={{ marginTop: 10 }}>
          {Array.from({ length: p.total }, (_, i) => (
            <View
              key={i}
              style={{
                flex: 1, height: 6, borderRadius: 3,
                backgroundColor: i < p.left ? (critico ? c.cta : c.accent) : c.bg3,
              }}
            />
          ))}
        </Row>
        <Txt v="caption" c={c.tx3} style={{ marginTop: 8 }}>
          {p.left} de {p.total} · cerca de {p.semanas} {p.semanas === 1 ? 'semana' : 'semanas'}
        </Txt>

        {!p.verdict.good && (
          <Pressable onPress={go('/medico')} style={({ pressed }) => [{ marginTop: 16, alignSelf: 'flex-start', opacity: pressed ? 0.8 : 1 }]}>
            <Row gap={7} style={{ backgroundColor: c.accentWeak, borderRadius: radius.pill, paddingHorizontal: 16, paddingVertical: 11 }}>
              <Txt v="label" c={c.accent2}>Pedir renovação</Txt>
              <Icon name="chev" size={13} color={c.accent2} sw={2.2} />
            </Row>
          </Pressable>
        )}
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
                  <Txt v="caption" c={c.tx3} style={{ marginTop: 2 }}>
                    {d.tipo} · {relDay(new Date(d.t))}
                  </Txt>
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
          <>
            <Equipe />
            <Pendencias />
            <Consulta />
            <Time />
            <Tratamento />
            <Materiais />
            <Documentos />
            <FalarComClinica />
          </>
        ) : (
          <Descoberta />
        )}
      </ScrollView>
    </View>
  );
}
