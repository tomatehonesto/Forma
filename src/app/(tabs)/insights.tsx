import React, { useMemo, useState } from 'react';
import { View, Pressable, ScrollView, StyleSheet, useWindowDimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useStore } from '../../logic/store';
import {
  patterns, recommendations, PAT_LABEL, radar, checkins30, adesao,
  hasClinic, journeySummary, type PatKey,
} from '../../logic/derive';
import { daysAgo, nf } from '../../logic/time';
import { Txt, Row, SectionHead, ListRow, Divider } from '../../ui/kit';
import { Icon } from '../../ui/Icon';
import { Radar } from '../../ui/charts';
import { useTheme } from '../../ui/useTheme';
import { useLightStatusBar } from '../../ui/useLightStatusBar';
import { radius } from '../../theme';

/* ============================================================
   INSIGHTS — a camada de interpretação.

   A Home responde "como estou hoje", a Jornada "por onde passei". Esta
   tela responde "o que isso quer dizer": o que o app entendeu dos
   registros e o que fazer com isso.

   Cada padrão termina numa pergunta ao Companion, porque descoberta sem
   caminho de aprofundamento é curiosidade, não ajuda. E nenhum texto aqui
   decide dose ou protocolo — isso é da equipe médica.
   ============================================================ */

const PAD = 24;

export default function Insights() {
  const S = useStore((s) => s.S);
  const { c } = useTheme();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  useLightStatusBar();

  const go = (to: string) => () => router.push(to as any);
  const perguntar = (q: string) => () => router.push(`/companion?q=${encodeURIComponent(q)}` as any);

  const [filtro, setFiltro] = useState<PatKey | null>(null);
  const pads = useMemo(() => patterns(S), [S]);
  const recos = useMemo(() => recommendations(S), [S]);
  const r = journeySummary(S);
  const cor = (k: string) => (c as any)[k] as string;

  const destaque = pads[0];
  const restantes = pads.slice(1);
  const visiveis = filtro ? restantes.filter((p) => p.key === filtro) : restantes;

  /* só categorias que de fato têm padrão — chip vazio é promessa quebrada */
  const cats = (Object.keys(PAT_LABEL) as PatKey[]).filter((k) => restantes.some((p) => p.key === k));

  const hoje = recos.filter((x) => x.quando === 'hoje');
  const semana = recos.filter((x) => x.quando === 'semana');

  const w = S.weights.filter((x: any) => x.t >= +daysAgo(7));
  const dSem = w.length >= 2 ? w[w.length - 1].kg - w[0].kg : 0;
  const ci7 = S.checkins.filter((x: any) => x.t >= +daysAgo(7)).length;

  return (
    <View style={{ flex: 1, backgroundColor: c.bg }}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 120, paddingHorizontal: PAD }}>

        {/* ---- descoberta da semana: o único bloco escuro, sangrado ---- */}
        <View style={{
          marginHorizontal: -PAD, paddingHorizontal: PAD, paddingTop: insets.top + 26,
          borderBottomLeftRadius: radius.xl, borderBottomRightRadius: radius.xl, overflow: 'hidden',
        }}>
          <LinearGradient
            colors={[c.panelFrom, c.panelMid, c.panelTo]}
            start={{ x: 0, y: 0 }} end={{ x: 0.85, y: 1 }}
            style={StyleSheet.absoluteFillObject}
          />
          <Txt v="micro" c={c.onHero2} style={{ letterSpacing: 1.2 }}>DESCOBERTA DA SEMANA</Txt>

          {destaque ? (
            <>
              <Txt v="display" c={c.onHero} style={{ marginTop: 14 }}>{destaque.titulo}</Txt>
              <Txt v="body" c={c.onHero2} style={{ marginTop: 12 }}>{destaque.texto}</Txt>
              <Pressable onPress={perguntar(destaque.q)} style={({ pressed }) => [{ alignSelf: 'flex-start', marginTop: 18, opacity: pressed ? 0.75 : 1 }]}>
                <Row gap={8} style={{ backgroundColor: c.lime, borderRadius: radius.pill, paddingHorizontal: 16, paddingVertical: 10 }}>
                  <Icon name="spark" size={15} color={c.limeInk} sw={2} />
                  <Txt v="label" c={c.limeInk}>Entender melhor</Txt>
                </Row>
              </Pressable>
            </>
          ) : (
            <Txt v="body" c={c.onHero} style={{ marginTop: 14 }}>
              Ainda não há registros suficientes para encontrar padrões.
            </Txt>
          )}

          <Row style={{ marginTop: 28, paddingBottom: 24 }}>
            {[
              [`${dSem <= 0 ? '−' : '+'}${nf(Math.abs(dSem), 1).replace('.', ',')} kg`, 'na semana'],
              [`${ci7}`, ci7 === 1 ? 'check-in' : 'check-ins'],
              [`${adesao(S)}%`, 'adesão'],
            ].map(([v, l]) => (
              <View key={l} style={{ flex: 1 }}>
                <Txt v="h2" c={c.onHero}>{v}</Txt>
                <Txt v="micro" c={c.onHero2} style={{ marginTop: 3 }}>{l}</Txt>
              </View>
            ))}
          </Row>
        </View>

        {/* ---- recomendações ---- */}
        {(hoje.length > 0 || semana.length > 0) && (
          <View style={{ marginTop: 34 }}>
            <SectionHead title="O que fazer com isso" />
            <Txt v="note" c={c.tx3} style={{ marginTop: 4 }}>
              Sai dos seus registros e da fase do ciclo — nunca de dose ou protocolo.
            </Txt>

            {hoje.length > 0 && (
              <>
                <Txt v="micro" c={c.tx3} style={{ letterSpacing: 1, marginTop: 18, marginBottom: 10 }}>HOJE</Txt>
                <View style={{ backgroundColor: c.bg1, borderRadius: radius.lg, paddingHorizontal: 16 }}>
                  {hoje.map((x, i) => (
                    <React.Fragment key={x.texto}>
                      {i > 0 && <Divider />}
                      <ListRow ic={x.ic} title={x.texto} onPress={go(x.to)} />
                    </React.Fragment>
                  ))}
                </View>
              </>
            )}

            {semana.length > 0 && (
              <>
                <Txt v="micro" c={c.tx3} style={{ letterSpacing: 1, marginTop: 20, marginBottom: 10 }}>PRÓXIMA SEMANA</Txt>
                <View style={{ backgroundColor: c.bg1, borderRadius: radius.lg, paddingHorizontal: 16 }}>
                  {semana.map((x, i) => (
                    <React.Fragment key={x.texto}>
                      {i > 0 && <Divider />}
                      <ListRow ic={x.ic} title={x.texto} onPress={go(x.to)} />
                    </React.Fragment>
                  ))}
                </View>
              </>
            )}
          </View>
        )}

        {/* ---- padrões encontrados ---- */}
        {restantes.length > 0 && (
          <View style={{ marginTop: 36 }}>
            <SectionHead title="Padrões encontrados" />
            <Txt v="note" c={c.tx3} style={{ marginTop: 4 }}>
              {restantes.length} no que você registrou até agora.
            </Txt>

            <ScrollView horizontal showsHorizontalScrollIndicator={false}
              style={{ marginTop: 14, marginHorizontal: -PAD }}
              contentContainerStyle={{ paddingHorizontal: PAD, gap: 6 }}>
              <Pressable onPress={() => setFiltro(null)}>
                <Row gap={6} style={{ backgroundColor: filtro === null ? c.tx : c.bg1, paddingHorizontal: 14, paddingVertical: 9, borderRadius: radius.pill }}>
                  <Txt v="label" c={filtro === null ? c.onHero : c.tx2}>Tudo</Txt>
                  <Txt v="micro" c={filtro === null ? c.lime : c.tx4}>{restantes.length}</Txt>
                </Row>
              </Pressable>
              {cats.map((k) => {
                const on = filtro === k;
                const n = restantes.filter((p) => p.key === k).length;
                return (
                  <Pressable key={k} onPress={() => setFiltro(on ? null : k)}>
                    <Row gap={6} style={{ backgroundColor: on ? c.tx : c.bg1, paddingHorizontal: 14, paddingVertical: 9, borderRadius: radius.pill }}>
                      <Txt v="label" c={on ? c.onHero : c.tx2}>{PAT_LABEL[k]}</Txt>
                      <Txt v="micro" c={on ? c.lime : c.tx4}>{n}</Txt>
                    </Row>
                  </Pressable>
                );
              })}
            </ScrollView>

            {visiveis.map((p) => (
              <Pressable key={p.titulo} onPress={perguntar(p.q)} style={({ pressed }) => [{ opacity: pressed ? 0.85 : 1 }]}>
                <View style={{ backgroundColor: c.bg1, borderRadius: radius.lg, padding: 18, marginTop: 7 }}>
                  <Row gap={9}>
                    <Icon name={p.ic} size={15} color={cor(p.cor)} sw={2} />
                    <Txt v="micro" c={c.tx3} style={{ letterSpacing: 0.8 }}>{p.cat.toUpperCase()}</Txt>
                  </Row>
                  <Txt v="title" style={{ marginTop: 10 }}>{p.titulo}</Txt>
                  <Txt v="note" c={c.tx2} style={{ marginTop: 6 }}>{p.texto}</Txt>
                  <Row gap={6} style={{ marginTop: 14 }}>
                    <Txt v="label" c={c.accent2}>Entender melhor</Txt>
                    <Icon name="chev" size={13} color={c.accent2} sw={2.2} />
                  </Row>
                </View>
              </Pressable>
            ))}
          </View>
        )}

        {/* ---- equilíbrio ---- */}
        <View style={{ marginTop: 36 }}>
          <SectionHead title="Seu equilíbrio" link="Sintomas" onPress={go('/sintomas')} />
          <View style={{ backgroundColor: c.bg1, borderRadius: radius.lg, marginTop: 14, paddingVertical: 18, alignItems: 'center' }}>
            <Radar data={radar(S)} size={Math.min(250, width - 100)} />
            <Txt v="caption" c={c.tx3} style={{ marginTop: 6 }}>
              Últimos 3 check-ins · {checkins30(S)} registros no mês
            </Txt>
          </View>
        </View>

        {/* ---- resumos ---- */}
        <View style={{ marginTop: 36 }}>
          <SectionHead title="Resumos" />
          <Txt v="note" c={c.tx3} style={{ marginTop: 4 }}>
            Seus dados organizados para levar a alguém.
          </Txt>
          <View style={{ backgroundColor: c.bg1, borderRadius: radius.lg, marginTop: 14, paddingHorizontal: 16 }}>
            <ListRow ic="chart" title="Resumo da semana"
              sub={`semana ${r.semana} · ${ci7} check-ins, ${nf(Math.abs(dSem), 1).replace('.', ',')} kg`}
              onPress={perguntar('Como está minha evolução?')} />
            <Divider />
            <ListRow ic="cal" title="Resumo para a consulta"
              sub={hasClinic(S) ? 'peso, adesão, sintomas e perguntas' : 'pronto para compartilhar'}
              onPress={perguntar('Prepare minha consulta')} />
            <Divider />
            <ListRow ic="doc" title="Resumo para o médico"
              sub="documento com a evolução completa" onPress={go('/resumo-medico')} />
          </View>
        </View>

        {/* ---- companion e biblioteca ---- */}
        <View style={{ marginTop: 36 }}>
          <Pressable onPress={go('/companion')} style={({ pressed }) => [{ opacity: pressed ? 0.85 : 1 }]}>
            <Row gap={14} style={{ backgroundColor: c.accentWeak, borderRadius: radius.lg, padding: 18 }}>
              <View style={{ width: 42, height: 42, borderRadius: 21, backgroundColor: c.bg1, alignItems: 'center', justifyContent: 'center' }}>
                <Icon name="companion" size={20} color={c.accent} sw={1.9} />
              </View>
              <View style={{ flex: 1 }}>
                <Txt v="title" c={c.accent}>Conversar com o Companion</Txt>
                <Txt v="caption" c={c.tx2} style={{ marginTop: 2 }}>Pergunte qualquer coisa sobre sua jornada</Txt>
              </View>
              <Icon name="chev" size={17} color={c.accent} sw={2.2} />
            </Row>
          </Pressable>

          <View style={{ backgroundColor: c.bg1, borderRadius: radius.lg, marginTop: 7, paddingHorizontal: 16 }}>
            <ListRow ic="book" title="Biblioteca"
              sub="conteúdo escolhido para o seu momento do tratamento" onPress={go('/biblioteca')} />
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
