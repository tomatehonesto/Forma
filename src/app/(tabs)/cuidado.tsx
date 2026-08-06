import React from 'react';
import { View, Pressable, ScrollView, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Defs, Ellipse, RadialGradient, Stop } from 'react-native-svg';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useStore } from '../../logic/store';
import {
  hasClinic, nextConsult, lastMessage, carePending, careDocs, careStatus, penStock, M,
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
/** Recorte circular do retrato. A foto é de corpo, com o rosto no terço
    superior — para virar avatar ela entra grande e deslocada dentro de uma
    máscara redonda, em vez de encolhida (o que mostraria mais jaleco que
    pessoa). */
function Avatar({ size = 44 }: { size?: number }) {
  const { c } = useTheme();
  const escala = size * 3.1;
  return (
    <View style={{ width: size, height: size, borderRadius: size / 2, overflow: 'hidden', backgroundColor: c.bluePale }}>
      <Image
        source={FOTO_MEDICA}
        style={{ width: escala, height: escala * 1.5, marginLeft: -(escala - size) / 2, marginTop: -escala * 0.30 }}
        contentFit="cover"
      />
    </View>
  );
}

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

    Antes era a ficha da médica; agora é o estado do acompanhamento, com
    ela dentro dele. A inversão é de sujeito: quem abre esta aba não
    pergunta "quem é minha médica?" — sabe quem é. Pergunta "como está meu
    cuidado?". A frase grande responde isso, e o retrato aparece como a
    resposta a uma segunda pergunta, "quem está cuidando", que vem depois.

    O retrato encolheu para caber nessa nova ordem: de banner de 196 px a
    um avatar de 44. Perdeu presença de propósito — presença demais ali
    faria a tela voltar a ser sobre ela. */
function Topo() {
  const S = useStore((s) => s.S);
  const { c } = useTheme();
  const router = useRouter();
  const go = (to: string) => () => router.push(to as any);
  const st = careStatus(S);

  return (
    <View style={{ borderRadius: radius.xl, overflow: 'hidden' }}>
      <LinearGradient
        colors={[c.bg1, c.bg1, c.bluePale]}
        locations={[0, 0.45, 1]}
        start={{ x: 0, y: 0.1 }} end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFillObject}
      />
      {/* clarão frio no canto: dá profundidade sem trazer cor de alerta —
          esta é a tela que precisa acalmar, não avisar */}
      <Svg width={230} height={190} style={{ position: 'absolute', right: -50, top: -50 }} pointerEvents="none">
        <Defs>
          <RadialGradient id="brilhoCuidado" cx="50%" cy="50%" r="50%">
            <Stop offset="0" stopColor={c.accent} stopOpacity={0.15} />
            <Stop offset="0.6" stopColor={c.accent} stopOpacity={0.05} />
            <Stop offset="1" stopColor={c.accent} stopOpacity={0} />
          </RadialGradient>
        </Defs>
        <Ellipse cx={115} cy={95} rx={115} ry={95} fill="url(#brilhoCuidado)" />
      </Svg>

      <View style={{ padding: 22 }}>
        <Row gap={8}>
          <View style={{ width: 7, height: 7, borderRadius: 4, backgroundColor: st.quantos ? c.accent : c.teal }} />
          <Txt v="micro" c={c.tx3} style={{ letterSpacing: 1.1 }}>SEU ACOMPANHAMENTO</Txt>
        </Row>
        <Txt v="display" c={c.tx} style={{ fontSize: 25, lineHeight: 32, marginTop: 12 }}>
          {st.titulo}
        </Txt>

        <Pressable onPress={go('/especialista')} style={({ pressed }) => [{ marginTop: 20, opacity: pressed ? 0.65 : 1 }]}>
          <Row gap={12} style={{ backgroundColor: 'rgba(255,255,255,0.7)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.9)', borderRadius: radius.pill, padding: 8 }}>
            <Avatar size={38} />
            <View style={{ flex: 1 }}>
              <Txt v="caption" c={c.tx}>{S.profile.doctor}</Txt>
              <Txt v="micro" c={c.tx3} style={{ marginTop: 1 }}>{st.sub.replace(`${S.profile.doctor} `, '')}</Txt>
            </View>
            <View style={{ paddingRight: 10 }}>
              <Icon name="chev" size={15} color={c.tx3} sw={2} />
            </View>
          </Row>
        </Pressable>
      </View>
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
      <Row gap={8} style={{ flexWrap: 'wrap', marginTop: 14 }}>
        {st.tiles.map((t) => (
          <Pressable key={t.label} onPress={() => router.push(t.to as any)} style={({ pressed }) => [{ width: '48.4%', opacity: pressed ? 0.65 : 1 }]}>
            <View style={{ backgroundColor: c.bg1, borderRadius: radius.lg, padding: 16, marginBottom: 8 }}>
              <Row style={{ justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <Icon name={t.ic} size={17} color={t.atencao ? c.accent : c.tx3} sw={1.9} />
                {t.atencao && <View style={{ width: 7, height: 7, borderRadius: 4, backgroundColor: c.accent, marginTop: 4 }} />}
              </Row>
              <Txt v="micro" c={c.tx3} style={{ marginTop: 14 }}>{t.label}</Txt>
              <Txt v="bodyMed" c={t.atencao ? c.tx : c.tx2} style={{ marginTop: 2 }} numberOfLines={1}>{t.valor}</Txt>
            </View>
          </Pressable>
        ))}
      </Row>
    </View>
  );
}

/** Os quatro destinos mais usados. "Sobre" saiu — é uma tela que se visita
    uma vez, e atalho existe para o que se repete. Entrou Tratamento, que
    é onde se olha a dose e o estoque toda semana. */
function Atalhos() {
  const { c } = useTheme();
  const router = useRouter();
  const itens: [string, string, string][] = [
    ['companion', 'Mensagens', '/medico'],
    ['cal', 'Consultas', '/consultas'],
    ['chart', 'Exames', '/exames'],
    ['syringe', 'Tratamento', '/aplicacoes'],
  ];
  return (
    <Row gap={8} style={{ marginTop: 10 }}>
      {itens.map(([ic, label, to]) => (
        <Pressable key={label} onPress={() => router.push(to as any)} style={({ pressed }) => [{ flex: 1, opacity: pressed ? 0.6 : 1 }]}>
          <View style={{ backgroundColor: c.bg1, borderRadius: radius.md, paddingVertical: 14, alignItems: 'center' }}>
            <Icon name={ic} size={18} color={c.tx} sw={1.8} />
            <Txt v="micro" c={c.tx2} style={{ marginTop: 6 }}>{label}</Txt>
          </View>
        </Pressable>
      ))}
    </Row>
  );
}

/** A última mensagem, em três linhas.

    A versão anterior desenhava o thread inteiro — balão, avatar, campo de
    resposta. Ficou parecendo a tela de Mensagens em miniatura, e ocupava
    o espaço de uma. O trabalho desta seção é só provar que a conversa está
    viva; ler tudo é na outra tela. */
function UltimaMensagem() {
  const S = useStore((s) => s.S);
  const { c } = useTheme();
  const router = useRouter();
  const msg = lastMessage(S);
  if (!msg) return null;

  return (
    <Pressable onPress={() => router.push('/medico' as any)} style={({ pressed }) => [{ marginTop: 10, opacity: pressed ? 0.7 : 1 }]}>
      <View style={{ backgroundColor: c.bg1, borderRadius: radius.lg, padding: 18 }}>
        <Row gap={8}>
          <Txt v="micro" c={c.tx3} style={{ letterSpacing: 0.8, flex: 1 }}>ÚLTIMA MENSAGEM</Txt>
          {S.unread > 0 && msg.daEquipe && (
            <Row gap={5}>
              <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: c.accent }} />
              <Txt v="micro" c={c.accent2}>não lida</Txt>
            </Row>
          )}
        </Row>
        {/* aspas e itálico: sinalizam citação, e é isso que a frase é —
            um trecho, não o conteúdo inteiro */}
        <Txt v="body" c={c.tx} style={{ marginTop: 10, lineHeight: 24, fontStyle: 'italic' }} numberOfLines={2}>
          “{msg.text}”
        </Txt>
        <Row style={{ marginTop: 12 }}>
          <Txt v="micro" c={c.tx3} style={{ flex: 1 }}>
            {msg.daEquipe ? S.profile.doctor.split(' ').slice(0, 2).join(' ') : 'Você'} · {msg.quando}
          </Txt>
          <Row gap={6}>
            <Txt v="label" c={c.accent2}>Responder</Txt>
            <Icon name="chev" size={13} color={c.accent2} sw={2.2} />
          </Row>
        </Row>
      </View>
    </Pressable>
  );
}

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
        <View style={{ flex: 1 }}>
          <Txt v="bodyMed">Sua equipe de apoio</Txt>
          <Txt v="caption" c={c.tx3} style={{ marginTop: 2 }} numberOfLines={1}>
            {time.map((p) => p.role).join(' · ')}
          </Txt>
        </View>
        <Icon name="chev" size={15} color={c.tx4} sw={2} />
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
  const mats = ((S as any).materials ?? []) as { name: string; kind: string; meta: string; ic: string }[];
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
            <View style={{ width: 164, backgroundColor: c.bg1, borderRadius: radius.lg, padding: 16 }}>
              {/* o ícone diz o formato antes do rótulo dizer: vídeo, guia e
                  checklist se consomem de maneiras diferentes, e saber isso
                  antes de tocar evita abrir a coisa errada com pressa */}
              <View style={{ width: 36, height: 36, borderRadius: radius.sm, backgroundColor: c.limeWeak, alignItems: 'center', justifyContent: 'center' }}>
                <Icon name={m.ic} size={17} color={c.tx} sw={1.9} />
              </View>
              <Txt v="bodyMed" style={{ marginTop: 12, lineHeight: 21 }} numberOfLines={2}>{m.name}</Txt>
              <Row gap={6} style={{ marginTop: 6 }}>
                <View style={{ backgroundColor: c.bg2, borderRadius: radius.sm, paddingHorizontal: 7, paddingVertical: 3 }}>
                  <Txt v="micro" c={c.tx2}>{m.kind}</Txt>
                </View>
                <Txt v="micro" c={c.tx3}>{m.meta}</Txt>
              </Row>
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
            <Atalhos />
            <CuidadoHoje />
            <Pendencias />
            <Consulta />
            <UltimaMensagem />
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
