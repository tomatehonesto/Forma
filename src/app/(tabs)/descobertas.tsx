import React from 'react';
import { View, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { useStore } from '../../logic/store';
import { insights, hungerForecast, adesao, radar, checkins30, streak, hasClinic, GOAL_WATER } from '../../logic/derive';
import { daysAgo, nf, kg } from '../../logic/time';
import { Screen, Txt, Card, Row, IconBadge, Chevron, Pill, Rich } from '../../ui/kit';
import { Icon } from '../../ui/Icon';
import { AskCompanion } from '../../ui/Ask';
import { Radar } from '../../ui/charts';
import { useTheme } from '../../ui/useTheme';

/* Descobertas — não é um dashboard. É o que o Forma aprendeu sobre o seu corpo,
   contado em linguagem humana. Cada descoberta se aprofunda pelo Companion. */
export default function Descobertas() {
  const S = useStore((s) => s.S);
  const { c } = useTheme();
  const router = useRouter();

  const ins = insights(S);
  const hf = hungerForecast(S);
  const ade = adesao(S);

  // replay da semana — números reais dos últimos 7 dias
  const wk = S.weights.filter((x: any) => x.t >= +daysAgo(7));
  const wkDelta = wk.length >= 2 ? wk[wk.length - 1].kg - wk[0].kg : 0;
  const ci7 = S.checkins.filter((x: any) => x.t >= +daysAgo(7)).length;

  type Disc = { ic: string; color: string; bg: string; tag: string; text: string; q: string; cta: string };
  const feed: Disc[] = [];
  feed.push({ ic: 'moon', color: c.purple, bg: c.purpleBg, tag: 'Sono e fome', text: 'Nas noites em que você dorme <b>7h ou mais</b>, sua fome e seus registros de náusea no dia seguinte são menores.', q: 'O que registrar antes de dormir?', cta: 'Explicar esse padrão' });
  if (hf) feed.push({ ic: 'waves', color: c.accent, bg: c.accentWeak, tag: 'Ciclo da medicação', text: `Sua fome tende a voltar <b>${hf.inDays <= 0 ? 'nestes dias' : `em ${hf.inDays} dias`}</b>, quando o nível da medicação chega ao ponto mais baixo antes da próxima dose.`, q: 'Por que sinto mais fome?', cta: 'Entender melhor' });
  const water = ins.find((i) => i.ic === 'water');
  if (water) feed.push({ ic: 'water', color: c.water, bg: c.waterBg, tag: 'Hidratação', text: water.text, q: 'Como está minha água?', cta: 'Entender melhor' });
  feed.push({ ic: 'bolt', color: c.amber, bg: c.amberBg, tag: 'Energia', text: 'Sua energia costuma <b>subir nos dias de pico de efeito</b> da medicação, um a dois dias após a aplicação.', q: 'Quando tenho mais energia?', cta: 'O que isso significa?' });
  const prot = ins.find((i) => i.ic === 'flame');
  if (prot) feed.push({ ic: 'flame', color: c.accent, bg: c.accentWeak, tag: 'Proteína', text: prot.text, q: 'Como está minha proteína?', cta: 'Entender melhor' });

  return (
    <Screen>
      <View style={{ marginTop: 8 }}>
        <Txt v="display">Descobertas</Txt>
        <Txt v="bodyMed" c={c.tx3} style={{ marginTop: 6 }}>O que o Forma aprendeu sobre o seu corpo.</Txt>
      </View>

      {/* descoberta principal */}
      <Card tint={c.accentWeak} style={{ marginTop: 18, overflow: 'hidden' }}>
        <View style={{ position: 'absolute', right: -10, top: 10, opacity: 0.16 }}><Icon name="heart" size={140} color={c.accent} sw={1.2} /></View>
        <Row gap={7}><Icon name="spark" size={16} color={c.accent} sw={2} /><Txt v="micro" c={c.accent} style={{ letterSpacing: 1 }}>DESCOBERTA DA SEMANA</Txt></Row>
        <Txt v="h1" style={{ marginTop: 12, fontSize: 23, lineHeight: 30, maxWidth: '86%' }}>
          Dormir mais de <Txt v="h1" c={c.accent} style={{ fontSize: 23, lineHeight: 30 }}>7 horas</Txt> costuma reduzir sua <Txt v="h1" c={c.accent2} style={{ fontSize: 23, lineHeight: 30 }}>fome</Txt> no dia seguinte.
        </Txt>
        <Txt v="bodyMed" c={c.tx2} style={{ marginTop: 10, maxWidth: '88%' }}>Seu corpo responde ao conjunto — sono, proteína e ritmo da medicação andam juntos.</Txt>
        <AskCompanion q="O que registrar antes de dormir?" label="Explicar esse padrão" style={{ marginTop: 14 }} />
      </Card>

      {/* replay da semana */}
      <Card style={{ marginTop: 14 }}>
        <Row gap={7}><Icon name="play" size={15} color={c.accent2} sw={2} /><Txt v="micro" c={c.accent2} style={{ letterSpacing: 1 }}>REPLAY DA SEMANA</Txt></Row>
        <Row style={{ marginTop: 12 }}>
          {[[`${wkDelta <= 0 ? '−' : '+'}${kg(Math.abs(wkDelta))} kg`, 'na semana', wkDelta <= 0 ? c.accent : c.tx], [`${ci7}`, 'check-ins', c.tx], [`${ade}%`, 'adesão às doses', c.tx]].map(([v, l, col], i) => (
            <View key={l as string} style={{ flex: 1, alignItems: 'center', borderLeftWidth: i ? 1 : 0, borderLeftColor: c.line }}>
              <Txt v="h2" c={col as string}>{v as string}</Txt>
              <Txt v="micro" c={c.tx3} style={{ marginTop: 2, textAlign: 'center' }}>{l as string}</Txt>
            </View>
          ))}
        </Row>
        <Txt v="bodyMed" c={c.tx2} style={{ marginTop: 12 }}>Uma semana constante — o ritmo certo é o que se sustenta.</Txt>
        <Row style={{ marginTop: 10, justifyContent: 'space-between' }}>
          <AskCompanion q="Como está minha evolução?" label="Resumir minha semana" />
          <Pressable onPress={() => router.push('/evolucao' as any)} style={({ pressed }) => [{ opacity: pressed ? 0.6 : 1, paddingVertical: 9 }]}>
            <Row gap={4}><Txt v="label" c={c.tx3}>Ver evolução</Txt><Chevron size={15} /></Row>
          </Pressable>
        </Row>
      </Card>

      {/* feed de padrões */}
      <Txt v="h2" style={{ marginTop: 22, marginBottom: 4 }}>Padrões encontrados</Txt>
      {feed.map((d, i) => (
        <Card key={i} style={{ marginTop: 12 }}>
          <Row style={{ alignItems: 'flex-start' }}>
            <IconBadge name={d.ic} size={42} color={d.color} bg={d.bg} />
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Txt v="micro" c={c.tx3} style={{ letterSpacing: 0.8 }}>{d.tag.toUpperCase()}</Txt>
              <Rich v="bodyMed" base={c.tx} bold={d.color} style={{ marginTop: 4, lineHeight: 21 }} text={d.text} />
            </View>
          </Row>
          <AskCompanion q={d.q} label={d.cta} style={{ marginTop: 12, marginLeft: 54 }} />
        </Card>
      ))}

      {/* aderência */}
      <Card style={{ marginTop: 12 }}>
        <Row>
          <IconBadge name="syringe" size={42} />
          <View style={{ flex: 1, marginLeft: 12 }}>
            <Txt v="title">{ade}% das aplicações em dia</Txt>
            <Txt v="caption" c={c.tx3} style={{ marginTop: 2 }}>Constância é o que faz a medicação trabalhar a seu favor.</Txt>
          </View>
          <Pill label={`${streak(S)} dias seguidos`} />
        </Row>
      </Card>

      {/* equilíbrio → sintomas & radar */}
      <Txt v="h2" style={{ marginTop: 22, marginBottom: 10 }}>Seu equilíbrio</Txt>
      <Card style={{ alignItems: 'center' }} onPress={() => router.push('/sintomas' as any)}>
        <Radar data={radar(S)} size={228} />
        <Row style={{ justifyContent: 'space-between', alignSelf: 'stretch', marginTop: 4 }}>
          <Txt v="caption" c={c.tx3}>Últimos 3 dias de check-in · {checkins30(S)} registros no mês</Txt>
          <Chevron size={16} />
        </Row>
      </Card>

      {/* levar à consulta + conteúdo */}
      <View style={{ marginTop: 14, gap: 12 }}>
        <Card onPress={() => router.push('/resumo-medico' as any)}>
          <Row>
            <IconBadge name="doc" size={42} />
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Txt v="title">Leve suas descobertas à consulta</Txt>
              <Txt v="caption" c={c.tx3} style={{ marginTop: 2 }}>{hasClinic(S) ? 'Resumo pronto pra enviar à sua equipe' : 'Resumo do tratamento, pronto pra compartilhar'}</Txt>
            </View>
            <Chevron />
          </Row>
        </Card>
        <Card onPress={() => router.push('/biblioteca' as any)}>
          <Row>
            <IconBadge name="book" size={42} color={c.accent2} bg={c.waterBg} />
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Txt v="title">Pra ler agora</Txt>
              <Txt v="caption" c={c.tx3} style={{ marginTop: 2 }}>Conteúdo escolhido pro seu momento do tratamento</Txt>
            </View>
            <Chevron />
          </Row>
        </Card>
      </View>
    </Screen>
  );
}
