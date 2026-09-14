import React, { useEffect, useRef, useState } from 'react';
import { View, Pressable, Animated, ScrollView, StyleSheet } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useStore } from '../logic/store';
import { checkinToday, streak } from '../logic/derive';
import { startOfDay, now } from '../logic/time';
import { ENERGIA, SONO, HUMOR, SINTOMAS, paraTela } from '../logic/escalas';
import { lembretesDoDia, niveisDoRegistro, diasAnteriores, marcoDe, marcasDaSemana } from '../logic/leituras';
import { Txt, Row } from '../ui/kit';
import { Icon } from '../ui/Icon';
import { useTheme } from '../ui/useTheme';
import { radius, font } from '../theme';

/* ============================================================
   CHECK-IN CONCLUÍDO

   O check-in terminava em nada: a pessoa respondia dez campos e caía na
   Jornada, sem ninguém dizer que o dia tinha entrado. Um formulário que
   se fecha sozinho ensina que responder não muda coisa alguma.

   Esta é a única tela do app inteiramente sobre a aurora. As abas usam o
   fundo escuro no topo e sobem a folha branca por cima; aqui não sobe
   nada — porque esta tela não tem conteúdo para administrar, ela tem um
   momento para marcar, e o momento dura quinze segundos.

   UM HERÓI SÓ. O selo de feito e o número da sequência já brigaram por
   tamanho aqui: dois discos grandes de lima, um em cima do outro, e o
   olho sem saber onde pousar. O selo virou marca pequena, ao lado do
   título e na altura dele, e o número ficou com a tela.

   CADA COISA NO SEU FORMATO. As marcas da semana são pastilhas de lima,
   porque são frases soltas que celebram. Os sintomas são pastilhas de
   vidro, porque são uma lista de nomes de tamanho variável. E as três
   respostas fixas voltaram a ser LISTA: elas são sempre as mesmas três,
   cada uma com um rótulo e um valor, e isso é uma tabela — em pastilha,
   "Um bom dia" flutuava sem dizer que era o humor.

   O NÃO SE ESQUEÇA é resumo, não repetição. Cada aviso já apareceu por
   inteiro no formulário, grudado no campo que o provocou; aqui vira uma
   linha — assunto e a ação em poucas palavras. A exceção é o que manda
   procurar atendimento hoje: esse volta por inteiro, porque virar linha
   seria rebaixá-lo.
   ============================================================ */

const AURORA = require('../../assets/images/aurora-hero.png');
const PAD = 16;

export default function CheckinOk() {
  const S = useStore((s) => s.S);
  const { c } = useTheme();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { de } = useLocalSearchParams<{ de?: string }>();

  const registro: any = checkinToday(S);
  const hoje = +startOfDay(now());
  const atual = streak(S);
  const anterior = Number(de ?? atual) || 0;
  const subiu = atual > anterior;

  /* O número começa no de ontem e vira o de hoje meio segundo depois. O
     atraso é de propósito: a pessoa precisa ver o número velho antes para
     a troca significar alguma coisa. Quem edita um dia já respondido vê o
     número parado — não houve festa, e fingir que houve estragaria as que
     são de verdade. */
  const [n, setN] = useState(subiu ? anterior : atual);
  const entrada = useRef(new Animated.Value(0)).current;
  const sobe = useRef(new Animated.Value(0)).current;
  const pulo = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.stagger(90, [
      Animated.spring(entrada, { toValue: 1, friction: 6, tension: 90, useNativeDriver: true }),
      Animated.timing(sobe, { toValue: 1, duration: 380, useNativeDriver: true }),
    ]).start();

    if (!subiu) return;
    const t = setTimeout(() => {
      setN(atual);
      Animated.sequence([
        Animated.timing(pulo, { toValue: 1.24, duration: 140, useNativeDriver: true }),
        Animated.spring(pulo, { toValue: 1, friction: 4, useNativeDriver: true }),
      ]).start();
    }, 560);
    return () => clearTimeout(t);
  }, []);

  const marcas = marcasDaSemana(S.checkins as any[], hoje, subiu ? marcoDe(atual) : undefined);

  /* As respostas fixas, em palavras. Quem respondeu escolheu "Com
     disposição", não "4" — e quem não respondeu não vira pastilha: aqui a
     tela confirma o que foi dito, não preenche o que ficou em branco. */
  const energia = paraTela(registro?.energia);
  const sono = typeof registro?.sono === 'number' && registro.sono >= 5 && registro.sono <= 9
    ? registro.sono : null;
  const humor = typeof registro?.mood === 'number' && registro.mood >= 1 && registro.mood <= 5
    ? registro.mood : null;

  /* Sempre as três, com traço no lugar do valor quando não foi
     respondida: a lista é das perguntas que a tela faz todo dia, e some-
     -las esconderia o que ficou em branco. */
  const respostas: [string, string | null][] = [
    ['Energia', energia ? ENERGIA[energia - 1] : null],
    ['Sono', sono != null ? SONO[sono - 5] : null],
    ['Humor', humor != null ? HUMOR[humor - 1] : null],
  ];

  /* Os sintomas, pelo nome. Cada um tem a sua prova de existência: coluna
     própria, entrada no mapa `sint`, `gut` fora do normal ou texto livre. */
  const sintomas = SINTOMAS.filter((x) => {
    if (x.id === 'intestino') return !!registro?.gut && registro.gut !== 'normal';
    if (x.id === 'outro') return !!String(registro?.outroTexto || '').trim();
    if (x.store) return (registro?.[x.store] ?? 0) > 0;
    return (registro?.sint?.[x.id] ?? 0) > 0;
  }).map((x) => x.label);

  const lembretes = registro
    ? lembretesDoDia(diasAnteriores(S.checkins as any[], hoje), niveisDoRegistro(registro))
    : [];
  const urgente = lembretes.find((l) => l.urgente);

  const sair = () => router.replace('/(tabs)/jornada' as any);

  const subindo = {
    opacity: sobe,
    transform: [{ translateY: sobe.interpolate({ inputRange: [0, 1], outputRange: [16, 0] }) }],
  };

  /* Pastilha em dois tons, e a diferença é o que ela faz.

     MARCA celebra, e é verde CHAPADO — o mesmo par que o app usa para
     'concluído'. Em lavagem de lima ela era mais um vidro na tela: três
     peças translúcidas embaixo de um número de lima, e o que devia ser
     conquista lia como legenda. Chapada, ela é objeto.

     VIDRO confirma, e continua vidro: aquilo não comemora nada, só diz o
     que foi respondido. */
  const Pastilha = ({ label, marca }: { label: string; marca?: boolean }) => (
    <View style={{
      backgroundColor: marca ? c.okBg : c.glass,
      borderWidth: marca ? 0 : 1, borderColor: c.glassLine,
      borderRadius: radius.pill,
      paddingHorizontal: 13, paddingVertical: marca ? 8 : 7,
    }}>
      <Txt v="tag" c={marca ? c.ok : c.onHero}>{label}</Txt>
    </View>
  );

  /* Só o rótulo, sem o fio que ia até a borda. Com três seções na tela o
     fio virava três réguas paralelas competindo com os fios internos da
     lista, e o que ele separava já estava separado pelo espaço. */
  const Secao = ({ titulo }: { titulo: string }) => (
    <Txt v="micro" c={c.onHero2} style={{ letterSpacing: 1.2, paddingHorizontal: 2 }}>{titulo}</Txt>
  );

  return (
    <View style={{ flex: 1, backgroundColor: c.altTo }}>
      {/* A aurora parada. Na Home ela deriva devagar, e ali o movimento é
          ambiente; aqui o que se move é o número, e duas coisas em
          movimento disputam o mesmo olhar. */}
      <Image source={AURORA} style={StyleSheet.absoluteFill} contentFit="cover" />
      <LinearGradient
        colors={['rgba(3,10,38,0.42)', 'rgba(3,10,38,0.54)', 'rgba(3,10,38,0.88)']}
        locations={[0, 0.38, 1]}
        style={StyleSheet.absoluteFill}
        pointerEvents="none"
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: PAD,
          paddingTop: insets.top + 44,
          paddingBottom: 170,
          gap: 28,
        }}
      >
        <View style={{ alignItems: 'center', gap: 22 }}>
          {/* O selo à esquerda do título, na altura dele: marca e frase são
              a mesma afirmação, e separadas em duas linhas viravam duas. */}
          <Row gap={10}>
            <Animated.View
              style={{
                opacity: entrada,
                transform: [{ scale: entrada }],
                width: 30, height: 30, borderRadius: 15,
                backgroundColor: c.lime, alignItems: 'center', justifyContent: 'center',
              }}
            >
              <Icon name="check" size={16} color={c.limeInk} sw={2.8} />
            </Animated.View>
            <Animated.View style={subindo}>
              <Txt v="h2" c={c.onHero}>Check-in concluído</Txt>
            </Animated.View>
          </Row>

          <Animated.View style={[subindo, { alignItems: 'center', gap: 22 }]}>

            {/* O placar. Número sozinho na linha e a frase como legenda
                embaixo, em micro espaçado — na Home a sequência é uma
                pastilha de canto, e repetir aquele arranjo faria esta tela
                parecer um pedaço da Home que escapou. */}
            <View style={{ alignItems: 'center' }}>
              <Animated.View style={{ transform: [{ scale: pulo }] }}>
                <Txt v="hero" c={c.lime} style={{ fontSize: 76, lineHeight: 82 }}>{n}</Txt>
              </Animated.View>
              <Txt v="micro" c={c.onHero2} style={{ letterSpacing: 2, marginTop: 2 }}>
                {n === 1 ? 'DIA SEGUIDO DE CHECK-IN' : 'DIAS SEGUIDOS DE CHECK-IN'}
              </Txt>
            </View>

            {/* As marcas da semana, em lima. Elas dizem por que a sequência
                vale: dormir sete horas em cinco dias é um fato tão real
                quanto o enjoo, e ninguém contava esse. */}
            {marcas.length ? (
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 7, justifyContent: 'center' }}>
                {marcas.map((m) => <Pastilha key={m} label={m} marca />)}
              </View>
            ) : null}
          </Animated.View>
        </View>

        <Animated.View style={[subindo, { gap: 10 }]}>
          <Secao titulo="COMO FOI O DIA" />
          {/* Lista dentro de um cartão de vidro: rótulo à esquerda,
              resposta à direita. São sempre as mesmas três perguntas, e
              uma tabela é o formato de quem lê pares — o cartão é o que
              segura as três como um bloco só, agora que o fio do título
              não faz mais esse trabalho. */}
          <View style={{
            backgroundColor: c.glass, borderWidth: 1, borderColor: c.glassLine,
            borderRadius: radius.lg, paddingHorizontal: PAD, paddingVertical: 3,
          }}>
            {respostas.map(([rotulo, valor], i) => (
              <View key={rotulo}>
                {i > 0 ? <View style={{ height: 1, backgroundColor: c.onHeroLine }} /> : null}
                <Row gap={12} style={{ paddingVertical: 12, paddingHorizontal: 2, alignItems: 'flex-start' }}>
                  <Txt v="caption" c={c.onHero2} style={{ width: 78 }}>{rotulo}</Txt>
                  <Txt
                    v="caption"
                    c={valor ? c.onHero : c.onHero2}
                    style={{ flex: 1, textAlign: 'right', opacity: valor ? 1 : 0.55 }}
                  >
                    {valor ?? '—'}
                  </Txt>
                </Row>
              </View>
            ))}
          </View>
        </Animated.View>

        <Animated.View style={[subindo, { gap: 10 }]}>
          <Secao titulo="SINTOMAS" />
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 7 }}>
            {sintomas.length
              ? sintomas.map((s) => <Pastilha key={s} label={s} />)
              : <Pastilha label="Nenhum hoje" />}
          </View>
        </Animated.View>

        {lembretes.length ? (
          <Animated.View style={[subindo, { gap: 12 }]}>
            <Secao titulo="NÃO SE ESQUEÇA" />

            {urgente ? (
              /* O que manda procurar atendimento hoje não vira linha. */
              <View style={{
                backgroundColor: c.glass, borderWidth: 1, borderColor: c.glassLine,
                borderRadius: radius.lg, padding: PAD, gap: 5,
              }}>
                <Row gap={8} style={{ alignItems: 'center' }}>
                  <Icon name="aura" size={15} color={c.lime} sw={2} />
                  <Txt v="tag" c={c.lime} style={{ flex: 1 }}>{urgente.sobre}</Txt>
                </Row>
                <Txt v="label" c={c.onHero} style={{ marginTop: 1 }}>{urgente.titulo}</Txt>
                <Txt v="tag" c={c.onHero2}>{urgente.texto}</Txt>
                <View style={{ gap: 3, marginTop: 3 }}>
                  <Txt v="micro" c={c.lime} style={{ letterSpacing: 1 }}>O QUE FAZER</Txt>
                  <Txt v="tag" c={c.onHero}>{urgente.acao}</Txt>
                </View>
              </View>
            ) : (
              <View style={{ gap: 11, paddingHorizontal: 2 }}>
                {lembretes.map((l) => (
                  <Row key={l.titulo} gap={9} style={{ alignItems: 'flex-start' }}>
                    <View style={{ marginTop: 3 }}>
                      <Icon name="aura" size={13} color={c.lime} sw={2} />
                    </View>
                    <Txt v="tag" c={c.onHero2} style={{ flex: 1 }}>
                      <Txt v="tag" c={c.onHero} style={{ fontFamily: font.bodyMed }}>{l.sobre}</Txt>
                      {'  ·  '}{l.curto}
                    </Txt>
                  </Row>
                ))}
              </View>
            )}
          </Animated.View>
        ) : null}
      </ScrollView>

      <View style={{
        position: 'absolute', left: 0, right: 0, bottom: 0,
        paddingHorizontal: PAD, paddingTop: 16,
        paddingBottom: (insets.bottom || 12) + 16,
      }}>
        <LinearGradient
          colors={['rgba(3,10,38,0)', 'rgba(3,10,38,0.92)']}
          style={StyleSheet.absoluteFill}
          pointerEvents="none"
        />
        {/* Em lima, como o "Fazer check-in" da Home: é o mesmo par de
            cores fechando o que aquele botão abriu. */}
        <Pressable onPress={sair} style={({ pressed }) => [{ opacity: pressed ? 0.85 : 1 }]}>
          <View style={{ backgroundColor: c.lime, borderRadius: radius.pill, paddingVertical: 16, alignItems: 'center' }}>
            <Txt v="bodyMed" c={c.limeInk}>Ver minha jornada</Txt>
          </View>
        </Pressable>
      </View>
    </View>
  );
}
