import React, { useMemo, useState } from 'react';
import { View, Pressable, ScrollView, StyleSheet, TextInput, useWindowDimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useStore } from '../../logic/store';
import {
  patterns, recommendations, companionSuggestions, PAT_LABEL, radar, checkins30,
  hasClinic, journeySummary, type PatKey,
} from '../../logic/derive';
import { daysAgo, nf } from '../../logic/time';
import { Txt, Row, SectionHead, ListRow, Divider } from '../../ui/kit';
import { Icon } from '../../ui/Icon';
import { Radar } from '../../ui/charts';
import { useTheme } from '../../ui/useTheme';
import { useLightStatusBar } from '../../ui/useLightStatusBar';
import { radius, font } from '../../theme';

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
  const [pergunta, setPergunta] = useState('');
  const sugestoes = useMemo(() => companionSuggestions(S), [S]);
  const enviar = () => {
    const q = pergunta.trim();
    if (q) router.push(`/companion?q=${encodeURIComponent(q)}` as any);
  };
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

        {/* ---- o Companion abre a tela ----
             Aqui a IA deixa de ser um item da lista e vira a porta de
             entrada: campo de pergunta, sugestões que mudam com o momento
             do tratamento e um caminho para a conversa inteira. Sem hero
             grande — as outras duas abas já têm um, e esta precisa de
             personalidade própria: conversa, não painel. */}
        <View style={{
          marginHorizontal: -PAD, paddingHorizontal: PAD,
          paddingTop: insets.top + 26, paddingBottom: 26,
          borderBottomLeftRadius: radius.xl, borderBottomRightRadius: radius.xl, overflow: 'hidden',
        }}>
          <LinearGradient
            colors={[c.altFrom, c.altMid, c.altTo]}
            start={{ x: 0.15, y: 0 }} end={{ x: 0.9, y: 1 }}
            style={StyleSheet.absoluteFillObject}
          />

          {/* card em vidro sobre o gradiente — mesmo tratamento da faixa
              de check-in da Home */}
          <View style={{ backgroundColor: c.glass, borderWidth: 1, borderColor: c.glassLine, borderRadius: radius.xl, padding: 20 }}>
            <Row gap={8}>
              <Icon name="spark" size={15} color={c.lime} sw={2.1} />
              <Txt v="micro" c={c.lime} style={{ letterSpacing: 1.1 }}>COMPANION</Txt>
            </Row>
            <Txt v="h2" c={c.onHero} style={{ marginTop: 12 }}>O que você quer entender?</Txt>
            <Txt v="note" c={c.onHero2} style={{ marginTop: 4 }}>
              Ele conhece seus registros, seus exames e a fase do seu ciclo.
            </Txt>

            <Row gap={10} style={{ backgroundColor: c.glass, borderWidth: 1, borderColor: c.glassLine, borderRadius: radius.pill, paddingHorizontal: 16, marginTop: 16 }}>
              <TextInput
                value={pergunta} onChangeText={setPergunta}
                onSubmitEditing={enviar} returnKeyType="send"
                placeholder="Pergunte sobre seu tratamento..." placeholderTextColor={c.onHero2}
                style={{ flex: 1, paddingVertical: 14, color: c.onHero, fontFamily: font.body, fontSize: 16 }}
              />
              <Pressable onPress={enviar} hitSlop={8} disabled={!pergunta.trim()} style={({ pressed }) => [{ opacity: !pergunta.trim() ? 0.35 : pressed ? 0.6 : 1 }]}>
                <View style={{ width: 34, height: 34, borderRadius: 17, backgroundColor: c.lime, alignItems: 'center', justifyContent: 'center' }}>
                  <Icon name="send" size={16} color={c.limeInk} sw={2} />
                </View>
              </Pressable>
            </Row>

            <Row gap={6} style={{ flexWrap: 'wrap', marginTop: 14 }}>
              {sugestoes.map((q) => (
                <Pressable key={q} onPress={perguntar(q)} style={({ pressed }) => [{ opacity: pressed ? 0.65 : 1 }]}>
                  <View style={{ backgroundColor: c.glass, borderWidth: 1, borderColor: c.glassLine, borderRadius: radius.pill, paddingHorizontal: 13, paddingVertical: 9, marginBottom: 6 }}>
                    <Txt v="caption" c={c.onHero}>{q}</Txt>
                  </View>
                </Pressable>
              ))}
            </Row>

            <Pressable onPress={go('/companion')} style={({ pressed }) => [{ marginTop: 8, opacity: pressed ? 0.6 : 1 }]}>
              <Row gap={6}>
                <Txt v="label" c={c.lime}>Abrir conversa</Txt>
                <Icon name="chev" size={13} color={c.lime} sw={2.2} />
              </Row>
            </Pressable>
          </View>
        </View>

        {/* ---- descoberta da semana, agora em registro editorial ---- */}
        {destaque && (
          <Pressable onPress={perguntar(destaque.q)} style={({ pressed }) => [{ marginTop: 34, opacity: pressed ? 0.85 : 1 }]}>
            <View style={{ backgroundColor: c.bg1, borderRadius: radius.lg, padding: 20 }}>
              <Row gap={9}>
                <Icon name={destaque.ic} size={15} color={cor(destaque.cor)} sw={2} />
                <Txt v="micro" c={c.tx3} style={{ letterSpacing: 1 }}>DESCOBERTA DA SEMANA</Txt>
              </Row>
              <Txt v="h2" style={{ marginTop: 12 }}>{destaque.titulo}</Txt>
              <Txt v="note" c={c.tx2} style={{ marginTop: 8 }}>{destaque.texto}</Txt>
              <Row gap={6} style={{ marginTop: 16 }}>
                <Txt v="label" c={c.accent2}>Entender melhor</Txt>
                <Icon name="chev" size={13} color={c.accent2} sw={2.2} />
              </Row>
            </View>
          </Pressable>
        )}

        {/* ---- recomendações ---- */}
        {(hoje.length > 0 || semana.length > 0) && (
          <View style={{ marginTop: 34 }}>
            <SectionHead title="Próximas ações" />
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
