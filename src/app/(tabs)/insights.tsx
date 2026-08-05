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
import Svg, { Circle, Defs, Ellipse, RadialGradient, LinearGradient as SvgGrad, Stop } from 'react-native-svg';
import { radius, font, shadowSoft, type Palette } from '../../theme';

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

/* Duas linhas de chips, centradas. Quatro perguntas bastam: a nuvem existe
   para quem não sabe começar, e uma nuvem grande demais volta a ser o menu
   que ela deveria substituir. */
const CHIP_LINHAS = 2;
const CHIPS_MAX = 4;

/* ============================================================
   ORBE — a presença do Companion

   Dois círculos opacos empilhados não fazem halo, fazem alvo: a borda
   de cada um aparece e o brilho vira anel. Glow de verdade precisa de
   queda contínua até zero, e isso só existe em gradiente radial — daí o
   SVG. Os anéis orbitais em volta são o que dá a leitura de instrumento
   em vez de bolinha colorida.
   ============================================================ */
function Orbe({ c, size = 132 }: { c: Palette; size?: number }) {
  const meio = size / 2;
  const r = size * 0.225;
  return (
    <Svg width={size} height={size}>
      <Defs>
        <RadialGradient id="orbGlow" cx="50%" cy="50%" r="50%">
          <Stop offset="0.30" stopColor={c.teal} stopOpacity={0.42} />
          <Stop offset="0.52" stopColor={c.accent} stopOpacity={0.26} />
          <Stop offset="0.78" stopColor={c.accent} stopOpacity={0.07} />
          <Stop offset="1" stopColor={c.accent} stopOpacity={0} />
        </RadialGradient>
        <SvgGrad id="orbCorpo" x1="0.12" y1="0" x2="0.88" y2="1">
          <Stop offset="0" stopColor={c.lime} />
          <Stop offset="0.42" stopColor={c.teal} />
          <Stop offset="1" stopColor={c.accent} />
        </SvgGrad>
        <SvgGrad id="orbBrilho" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0" stopColor="#FFFFFF" stopOpacity={0.7} />
          <Stop offset="1" stopColor="#FFFFFF" stopOpacity={0} />
        </SvgGrad>
      </Defs>

      {/* o brilho ocupa a tela inteira do svg e morre em zero — sem borda
          para o olho encontrar */}
      <Circle cx={meio} cy={meio} r={meio} fill="url(#orbGlow)" />

      {/* anéis orbitais, cada vez mais tênues */}
      <Circle cx={meio} cy={meio} r={r + 11} fill="none" stroke={c.onHeroLine} strokeWidth={1} />
      <Circle cx={meio} cy={meio} r={r + 24} fill="none" stroke={c.onHeroWeak} strokeWidth={1} />

      <Circle cx={meio} cy={meio} r={r} fill="url(#orbCorpo)" />
      {/* reflexo alto: é ele que faz o disco virar esfera */}
      <Ellipse cx={meio} cy={meio - r * 0.44} rx={r * 0.6} ry={r * 0.28} fill="url(#orbBrilho)" />
    </Svg>
  );
}

/* O ícone sai do assunto da pergunta. Não há campo para isso porque as
   perguntas são geradas por heurística, não escolhidas de um catálogo —
   e um ícone genérico em todas tiraria justamente a leitura rápida que
   ele existe para dar. */
function iconePergunta(q: string) {
  const t = q.toLowerCase();
  if (/enjoo|náusea|nausea|sintoma/.test(t)) return 'waves';
  if (/fome|apetite|saciedade/.test(t)) return 'flame';
  if (/exame|hba1c|colesterol/.test(t)) return 'doc';
  if (/consulta|médic|medic/.test(t)) return 'cal';
  if (/aplica|dose|caneta|ciclo/.test(t)) return 'syringe';
  if (/água|agua|hidrat/.test(t)) return 'water';
  if (/proteína|proteina|refeiç/.test(t)) return 'leaf';
  if (/dorm|sono|noite/.test(t)) return 'moon';
  if (/progresso|evolu|peso|ritmo/.test(t)) return 'trend';
  if (/fim de semana|semana/.test(t)) return 'journey';
  return 'spark';
}

/* Quebra as perguntas em linhas por largura ESTIMADA — a medida real só
   existe depois do layout, e esperar por ela faria a nuvem montar em dois
   quadros, com salto visível. A estimativa erra por alguns pixels; como
   as linhas vazam de propósito, o erro não aparece. */
function montarLinhas(itens: { q: string; visto: boolean }[], larguraTela: number) {
  const largura = (q: string) => q.length * 7.1 + 52;
  /* teto acima da largura da tela: é o que faz caber uma segunda chip por
     linha, mesmo que o par vaze um pouco nas duas bordas. Com teto justo,
     cada pergunta ocupa uma linha inteira e a nuvem vira lista. */
  const teto = larguraTela * 1.35;
  const linhas: { q: string; visto: boolean }[][] = [];
  let atual: { q: string; visto: boolean }[] = [];
  let soma = 0;

  for (const it of itens) {
    const w = largura(it.q) + 8;
    if (atual.length && soma + w > teto) {
      linhas.push(atual);
      if (linhas.length === CHIP_LINHAS) return linhas;
      atual = []; soma = 0;
    }
    atual.push(it); soma += w;
  }
  if (atual.length) linhas.push(atual);
  return linhas.slice(0, CHIP_LINHAS);
}

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
  /* o que ela já perguntou vem na frente: retomar é mais provável que começar */
  const chipLines = useMemo(
    () => montarLinhas(
      [...recentes.map((q) => ({ q, visto: true })), ...sugestoes.map((q) => ({ q, visto: false }))].slice(0, CHIPS_MAX),
      width,
    ),
    [recentes, sugestoes, width],
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

  return (
    <View style={{ flex: 1, backgroundColor: c.bg }}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 120, paddingHorizontal: PAD }}>

        {/* ============================================================
            O COMPANION ABRE A TELA

            Sem card. A cor entra escura no topo e morre em branco onde o
            conteúdo começa — o hero não tem borda, tem fim. Card definido
            recorta a IA como mais um bloco da tela; um banho de cor diz que
            ela é o ambiente em que a tela acontece.

            O vidro sobrou para uma coisa só: o campo. É o único elemento
            que a pessoa vai tocar aqui, então é o único que ganha matéria.
            ============================================================ */}
        <View style={{
          marginHorizontal: -PAD, paddingHorizontal: PAD,
          /* a barra de baixo não é respiro: é o comprimento que a cor precisa
             para chegar ao fundo da tela sem degrau. Sem ela o degradê termina
             seco, e o corte aparece como uma linha atravessando a tela */
          paddingTop: insets.top + 22, paddingBottom: 96, overflow: 'hidden',
        }}>
          <LinearGradient
            colors={[c.altTo, c.altMid, c.altFrom, c.bluePale, c.bg]}
            /* a cor segura a saturação até a metade e só então lava, num
               último quarto inteiro dedicado à queda — o campo e as chips
               precisam de fundo com peso, e um degradê que clareia cedo
               demais entrega texto branco sobre quase-branco */
            locations={[0, 0.24, 0.56, 0.8, 1]}
            start={{ x: 0.25, y: 0 }} end={{ x: 0.75, y: 1 }}
            style={StyleSheet.absoluteFillObject}
          />

          {/* O orbe é a única marca do Companion aqui. Substitui a linha de
              nome, contagem e link que ocupava o topo: três elementos de
              interface para dizer o que uma presença diz sozinha. Tocá-lo
              abre a conversa inteira — o caminho continua existindo, só
              deixou de ocupar espaço. */}
          <Pressable onPress={go('/companion')} style={({ pressed }) => [{ alignSelf: 'center', opacity: pressed ? 0.8 : 1 }]}>
            <Orbe c={c} />
          </Pressable>

          {/* a pergunta solta na cor, centrada, sem moldura */}
          <Txt v="note" c={c.onHero2} style={{ marginTop: 4, textAlign: 'center' }}>
            Oi, {S.profile.name.split(' ')[0]}
          </Txt>
          <Txt v="display" c={c.onHero} style={{ fontSize: 30, lineHeight: 37, marginTop: 4, textAlign: 'center' }}>
            O que você quer{'\n'}entender hoje?
          </Txt>

          {/* o campo é o vidro — e fica na faixa ainda saturada do gradiente,
              porque vidro sobre branco não é vidro, é contorno */}
          <Row gap={10} style={{ backgroundColor: c.glass, borderWidth: 1, borderColor: c.glassLine, borderRadius: radius.pill, paddingLeft: 18, paddingRight: 6, marginTop: 24 }}>
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

          {/* Nuvem de chips: linhas com deslocamentos diferentes que vazam nas
              duas bordas. Não é enfeite — é o que diz "há mais do que cabe"
              sem precisar de carrossel nem de reticências. Cada linha é
              montada por largura estimada, então o desenho se refaz sozinho
              quando as perguntas mudam com o momento do tratamento. */}
          <View style={{ marginHorizontal: -PAD, marginTop: 22 }}>
            {chipLines.map((linha, i) => (
              <Row key={i} gap={8} style={{ justifyContent: 'center', marginBottom: 8 }}>
                {linha.map(({ q, visto }) => (
                  <Pressable key={q} onPress={perguntar(q)} style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1 }]}>
                    <Row gap={8} style={{ backgroundColor: c.bg1, borderRadius: radius.pill, paddingHorizontal: 15, paddingVertical: 11, ...shadowSoft(c) }}>
                      <Icon name={visto ? 'back' : iconePergunta(q)} size={14} color={visto ? c.tx4 : c.accent} sw={2} />
                      <Txt v="caption" c={c.tx}>{q}</Txt>
                    </Row>
                  </Pressable>
                ))}
              </Row>
            ))}
          </View>
        </View>

        {/* ---- descoberta da semana: a prova de que ele conhece a pessoa ----
             A margem é pequena de propósito: a cauda do degradê já é o
             respiro, e somar espaço aqui abriria um vão branco onde antes
             havia a borda do card. */}
        {destaque && (
          <Pressable onPress={perguntar(destaque.q)} style={({ pressed }) => [{ marginTop: 6, opacity: pressed ? 0.85 : 1 }]}>
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
