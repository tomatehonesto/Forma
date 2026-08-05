import React, { useMemo, useState } from 'react';
import { View, Pressable, ScrollView, StyleSheet, TextInput, useWindowDimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useStore } from '../../logic/store';
import {
  patterns, recommendations, companionSuggestions, recentQuestions, balanceRead,
  libraryPicks, PAT_LABEL, radar, checkins30, hasClinic, journeySummary, type PatKey,
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
   tela responde "o que isso quer dizer".

   A ordem não é arbitrária. O Companion abre porque é a porta da
   inteligência; as descobertas vêm logo depois porque são a prova de que
   essa inteligência conhece a pessoa; os padrões explicam o comportamento;
   só então vêm as ações. Renovar receita é importante, mas é tarefa — e
   tarefa não pode competir com o que faz o produto valer a pena.

   Nada aqui decide dose ou protocolo: isso é da equipe médica.
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
  const enviar = () => {
    const q = pergunta.trim();
    if (q) { setPergunta(''); router.push(`/companion?q=${encodeURIComponent(q)}` as any); }
  };

  const recentes = useMemo(() => recentQuestions(S), [S]);
  /* o que ela já perguntou sai das sugestões — a mesma frase nas duas
     listas faz o app parecer com uma resposta só */
  const sugestoes = useMemo(
    () => companionSuggestions(S).filter((q) => !recentes.includes(q)),
    [S, recentes],
  );
  const pads = useMemo(() => patterns(S), [S]);
  const recos = useMemo(() => recommendations(S), [S]);
  const eq = useMemo(() => balanceRead(S), [S]);
  const leituras = useMemo(() => libraryPicks(S), [S]);
  const r = journeySummary(S);
  const cor = (k: string) => (c as any)[k] as string;

  const destaque = pads[0];
  const restantes = pads.slice(1);
  const visiveis = filtro ? restantes.filter((p) => p.key === filtro) : restantes;
  const cats = (Object.keys(PAT_LABEL) as PatKey[]).filter((k) => restantes.some((p) => p.key === k));

  const hoje = recos.filter((x) => x.quando === 'hoje');
  const semana = recos.filter((x) => x.quando === 'semana');

  const w = S.weights.filter((x: any) => x.t >= +daysAgo(7));
  const dSem = w.length >= 2 ? w[w.length - 1].kg - w[0].kg : 0;
  const ci7 = S.checkins.filter((x: any) => x.t >= +daysAgo(7)).length;

  /* prova de que ele conhece a jornada — número, não promessa */
  const lidos = S.checkins.length + S.weights.length + S.injections.length + S.exams.length;

  return (
    <View style={{ flex: 1, backgroundColor: c.bg }}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 120, paddingHorizontal: PAD }}>

        {/* ============================================================
            O COMPANION ABRE A TELA

            Não é um card de produto anunciando um recurso — é um espaço de
            conversa parado esperando. Por isso a ordem é: quem ele é e o
            que já leu (a credencial), o campo aberto (o convite), e só
            então o que perguntar (a ajuda para quem não sabe começar).
            ============================================================ */}
        <View style={{
          marginHorizontal: -PAD, paddingHorizontal: PAD,
          paddingTop: insets.top + 24, paddingBottom: 26,
          borderBottomLeftRadius: radius.xl, borderBottomRightRadius: radius.xl, overflow: 'hidden',
        }}>
          <LinearGradient
            colors={[c.altFrom, c.altMid, c.altTo]}
            start={{ x: 0.15, y: 0 }} end={{ x: 0.9, y: 1 }}
            style={StyleSheet.absoluteFillObject}
          />

          {/* identidade fora do vidro: o Companion é a aba, não um item dentro dela */}
          <Row gap={11}>
            <View style={{ width: 34, height: 34, borderRadius: 17, backgroundColor: c.glass, borderWidth: 1, borderColor: c.glassLine, alignItems: 'center', justifyContent: 'center' }}>
              <Icon name="aura" size={18} color={c.lime} sw={1.9} />
            </View>
            {/* a contagem é a credencial: sem ela, "conheço sua jornada" é
                promessa; com ela, é fato verificável */}
            <View style={{ flex: 1 }}>
              <Txt v="bodyMed" c={c.onHero}>Companion</Txt>
              <Txt v="caption" c={c.onHero2} style={{ marginTop: 1 }}>leu {lidos} registros seus</Txt>
            </View>
            <Pressable onPress={go('/companion')} hitSlop={8} style={({ pressed }) => [{ opacity: pressed ? 0.6 : 1 }]}>
              <Row gap={6}>
                <Txt v="label" c={c.lime}>Conversa</Txt>
                <Icon name="chev" size={13} color={c.lime} sw={2.2} />
              </Row>
            </Pressable>
          </Row>

          {/* O vidro carrega um gesto só: a pergunta e o campo para respondê-la.
              Tudo que puder viver fora dele vive fora — quanto menos coisa
              dentro, mais o card parece uma conversa esperando e menos parece
              um painel. */}
          <View style={{ backgroundColor: c.glass, borderWidth: 1, borderColor: c.glassLine, borderRadius: radius.xl, padding: 22, marginTop: 22 }}>
            <Txt v="display" c={c.onHero} style={{ fontSize: 28, lineHeight: 34 }}>
              Oi, {S.profile.name.split(' ')[0]}.{'\n'}O que você quer entender?
            </Txt>

            <Row gap={10} style={{ backgroundColor: c.glass, borderWidth: 1, borderColor: c.glassLine, borderRadius: radius.pill, paddingLeft: 18, paddingRight: 6, marginTop: 20 }}>
              <TextInput
                value={pergunta} onChangeText={setPergunta}
                onSubmitEditing={enviar} returnKeyType="send"
                placeholder="Escreva sua pergunta..." placeholderTextColor={c.onHero2}
                style={{ flex: 1, paddingVertical: 15, color: c.onHero, fontFamily: font.body, fontSize: 16 }}
              />
              <Pressable onPress={enviar} hitSlop={8} disabled={!pergunta.trim()} style={({ pressed }) => [{ opacity: !pergunta.trim() ? 0.35 : pressed ? 0.6 : 1 }]}>
                <View style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: c.lime, alignItems: 'center', justifyContent: 'center' }}>
                  <Icon name="send" size={17} color={c.limeInk} sw={2} />
                </View>
              </Pressable>
            </Row>
          </View>

          {/* As sugestões saem do vidro e viram pills soltas sobre o gradiente:
              quem já sabe o que perguntar ignora; quem não sabe tem por onde
              começar. As que ela já perguntou levam a seta de volta. */}
          {/* uma faixa que rola, não uma grade que empilha: no telefone cada
              pergunta ocupa uma linha inteira, e cinco linhas de pill são a
              mesma poluição de antes, só que fora do vidro. A última pill
              vaza na borda para dizer que há mais. */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false}
            style={{ marginHorizontal: -PAD, marginTop: 18 }}
            contentContainerStyle={{ paddingHorizontal: PAD, gap: 7 }}>
            {[...recentes.map((q) => ({ q, visto: true })), ...sugestoes.map((q) => ({ q, visto: false }))]
              .slice(0, 5)
              .map(({ q, visto }) => (
                <Pressable key={q} onPress={perguntar(q)} style={({ pressed }) => [{ opacity: pressed ? 0.65 : 1 }]}>
                  <Row gap={7} style={{ backgroundColor: c.glass, borderWidth: 1, borderColor: c.glassLine, borderRadius: radius.pill, paddingHorizontal: 15, paddingVertical: 11 }}>
                    {visto && <Icon name="back" size={12} color={c.onHero2} sw={2} />}
                    <Txt v="caption" c={c.onHero}>{q}</Txt>
                  </Row>
                </Pressable>
              ))}
          </ScrollView>
        </View>

        {/* ---- descoberta da semana: a prova de que ele conhece a pessoa ---- */}
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

        {/* ---- padrões: o que explica o comportamento ---- */}
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

        {/* ---- equilíbrio: a leitura primeiro, o gráfico como ilustração ----
             Oito eixos num radar não concluem nada sozinhos. A frase conclui;
             o desenho mostra de onde ela saiu. */}
        <View style={{ marginTop: 36 }}>
          <SectionHead title="Seu equilíbrio" link="Sintomas" onPress={go('/sintomas')} />
          <View style={{ backgroundColor: c.bg1, borderRadius: radius.lg, marginTop: 14, padding: 20 }}>
            <Row gap={9}>
              <Icon name="spark" size={15} color={c.accent} sw={2} />
              <Txt v="micro" c={c.tx3} style={{ letterSpacing: 1 }}>LEITURA DO COMPANION</Txt>
            </Row>
            <Txt v="title" style={{ marginTop: 10 }}>{eq.titulo}</Txt>
            <Txt v="note" c={c.tx2} style={{ marginTop: 6 }}>{eq.texto}</Txt>

            <View style={{ alignItems: 'center', marginTop: 18 }}>
              <Radar data={radar(S)} size={Math.min(240, width - 130)} />
            </View>
            <Txt v="caption" c={c.tx3} style={{ marginTop: 8, textAlign: 'center' }}>
              Últimos 3 check-ins · {checkins30(S)} registros no mês
            </Txt>

            <Pressable onPress={perguntar(eq.q)} style={({ pressed }) => [{ opacity: pressed ? 0.6 : 1, marginTop: 16 }]}>
              <Row gap={6}>
                <Txt v="label" c={c.accent2}>Como melhorar {eq.fraco.toLowerCase()}</Txt>
                <Icon name="chev" size={13} color={c.accent2} sw={2.2} />
              </Row>
            </Pressable>
          </View>
        </View>

        {/* ---- ações: o entendimento vira tarefa ---- */}
        {(hoje.length > 0 || semana.length > 0) && (
          <View style={{ marginTop: 36 }}>
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

        {/* ---- leituras: cada uma entra por um motivo que aparece no card ----
             O segundo card do Companion morava aqui. Saiu: ele já é a porta
             da tela, e repetir a porta no fim é dizer que a primeira não
             convenceu. No lugar entra o que a IA escolheu ler com a pessoa. */}
        {leituras.length > 0 && (
          <View style={{ marginTop: 36 }}>
            <SectionHead title="Para o seu momento" link="Ver tudo" onPress={go('/biblioteca')} />
            <Txt v="note" c={c.tx3} style={{ marginTop: 4 }}>
              Escolhido pela fase do seu ciclo e pelo que você vem registrando.
            </Txt>

            <ScrollView horizontal showsHorizontalScrollIndicator={false}
              style={{ marginTop: 14, marginHorizontal: -PAD }}
              contentContainerStyle={{ paddingHorizontal: PAD, gap: 10 }}>
              {leituras.map((l) => (
                <Pressable key={l.titulo} onPress={go('/biblioteca')} style={({ pressed }) => [{ opacity: pressed ? 0.85 : 1 }]}>
                  <View style={{ width: 264, backgroundColor: c.bg1, borderRadius: radius.lg, padding: 18 }}>
                    <Row gap={8} style={{ alignItems: 'flex-start' }}>
                      <View style={{ marginTop: 1 }}>
                        <Icon name={l.ic} size={14} color={c.accent} sw={2} />
                      </View>
                      <Txt v="micro" c={c.accent} style={{ flex: 1, letterSpacing: 0.6 }}>{l.motivo.toUpperCase()}</Txt>
                    </Row>
                    <Txt v="title" style={{ marginTop: 11 }}>{l.titulo}</Txt>
                    <Txt v="caption" c={c.tx2} style={{ marginTop: 6, lineHeight: 19 }}>{l.desc}</Txt>
                    <Row gap={6} style={{ marginTop: 14 }}>
                      <Icon name="book" size={13} color={c.tx4} sw={2} />
                      <Txt v="micro" c={c.tx3}>{l.min} min de leitura</Txt>
                    </Row>
                  </View>
                </Pressable>
              ))}
            </ScrollView>
          </View>
        )}
      </ScrollView>
    </View>
  );
}
