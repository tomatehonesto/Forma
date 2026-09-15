import React, { useState } from 'react';
import { View, ScrollView, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { Image } from 'expo-image';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useStore } from '../logic/store';
import {
  apagarGole, diasDeAgua, golesDoDia, litros, registrarAgua, semanaDeAgua, waterMlToday,
} from '../logic/derive';
import { hm, now, startOfDay } from '../logic/time';
import { Txt, Row, Vazio } from '../ui/kit';
import { Icon } from '../ui/Icon';
import {
  Bloco, CardSemana, Cartao, Linha, ItemApagavel, TiraDeDias,
} from '../ui/internas';
import { VidroDegrade } from '../ui/vidro';
import { useTheme } from '../ui/useTheme';
import { radius } from '../theme';

/* ============================================================
   ÁGUA

   A água era o único dos três hábitos sem tela. Alimentação e exercício
   têm a sua — o número do dia, a semana, o caderno —, e a água tinha um
   botão que abria a folha de registro e mais nada: dava para BEBER e não
   dava para OLHAR. Ontem, a semana, o copo que entrou errado: nada disso
   existia em lugar nenhum.

   E a pergunta da água é uma pergunta de dias. Um copo não quer dizer
   nada sozinho; o que muda o tratamento é se a pessoa está chegando
   perto dos 2,5 L com alguma regularidade, e isso só se vê numa fileira
   de sete.

   O TOPO É A PRÓPRIA ÁGUA, e não um cartão falando dela. Das quatro
   telas de hábito, esta é a que tem a matéria mais fotografável — e a
   foto faz o trabalho que um cartão branco não faz: dá vontade de beber.
   É o mesmo movimento do topo de /alimento, com o mesmo vidro.

   O cartão "Água de hoje" que morava logo abaixo saiu: o topo já diz o
   número, a meta e a proporção. Eram duas versões do mesmo dia numa
   rolagem de dez centímetros.
   ============================================================ */

/* Trinta dias na tira, como no caderno de refeições, e pelo mesmo motivo:
   não há seletor de período porque não há mais nada na tela que responda
   a ele. */
const DIAS_DA_TIRA = 30;

/* OS ATALHOS DO TOPO — e a decisão que eles revertem.

   Na folha de registro, tocar em "Garrafa" NÃO grava: soma no montador,
   e quem grava é o botão de baixo. Isso foi de propósito, e continua
   certo lá: lá a pessoa está compondo uma quantidade, e um toque que
   gravasse sozinho atrapalharia quem bebeu um copo e meio.

   Aqui é o contrário. O toque É a interação inteira — não há montador
   para alimentar, e cobrar duas telas de quem bebeu um copo é cobrar o
   preço de um formulário por um gesto de dois segundos.

   E o que tornava isso arriscado deixou de existir: agora cada gole é um
   registro com hora e lixeira no caderno logo abaixo. O medo de um toque
   errado era o medo de um toque IRREVERSÍVEL. */
const ATALHOS: [string, number][] = [
  ['Copo', 250],
  ['Garrafa', 500],
];

export default function Agua() {
  const S = useStore((s) => s.S);
  const update = useStore((s) => s.update);
  const { c } = useTheme();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const alvo = (S.profile as any).targets.waterMl as number;
  const hoje = waterMlToday(S);
  const pct = Math.round((hoje / alvo) * 100);

  const semana = semanaDeAgua(S);
  const diasComRegistro = semana.filter((d) => d.ml > 0).length;
  /* Média dos dias REGISTRADOS, como na proteína. Dividir por sete
     transformaria um dia esquecido num dia de sede. */
  const media = diasComRegistro
    ? Math.round(semana.reduce((x, d) => x + d.ml, 0) / diasComRegistro)
    : 0;

  const [diaSel, setDiaSel] = useState<number>(() => +startOfDay(now()));
  const calendario = diasDeAgua(S, DIAS_DA_TIRA);
  const doDia = golesDoDia(S, diaSel);
  const mlDoDia = doDia.reduce((x, g) => x + g.ml, 0);

  const lembrete = (S as any).reminders?.agua;

  /* Até onde o vidro desce: a barra de voltar, o título e a linha do
     número. Abaixo disso a foto fica limpa, que é onde a porcentagem
     grande mora. */
  const alturaVidro = insets.top + 122;
  const alturaTopo = insets.top + 398;

  return (
    <View style={{ flex: 1, backgroundColor: c.bg }}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: insets.bottom + 28 }}>
        <View style={{ height: alturaTopo }}>
          <Image
            source={require('../../assets/images/agua-hero.jpg')}
            style={{ position: 'absolute', left: 0, right: 0, top: 0, bottom: 0 }}
            contentFit="cover"
          />
          {/* A faixa vai além da última linha de texto: a passagem precisa
              de espaço para deixar de ser um corte. */}
          <VidroDegrade altura={alturaVidro + 120} />
          {/* Uma sombra curta e fraca só atrás do texto. O vidro escurece
              para dar MATÉRIA; esta garante a leitura do branco. */}
          <LinearGradient
            colors={['rgba(0,0,0,0.20)', 'rgba(0,0,0,0.09)', 'rgba(0,0,0,0)']}
            locations={[0, 0.6, 1]}
            start={{ x: 0, y: 0 }} end={{ x: 0, y: 1 }}
            style={{ position: 'absolute', left: 0, right: 0, top: 0, height: alturaVidro }}
          />

          <View style={{ flex: 1, paddingTop: insets.top + 12, paddingHorizontal: 20, paddingBottom: 46 }}>
            <Pressable onPress={() => router.back()} hitSlop={10} style={({ pressed }) => [{ alignSelf: 'flex-start', opacity: pressed ? 0.6 : 1 }]}>
              <View style={{
                width: 36, height: 36, borderRadius: 18,
                backgroundColor: c.onHeroLine, alignItems: 'center', justifyContent: 'center',
              }}>
                <Icon name="back" size={16} color={c.onHero} sw={2.2} />
              </View>
            </Pressable>

            {/* O TÍTULO E O NÚMERO, um embaixo do outro, como na
                referência: "Água" e, em peso leve, quanto de quanto. */}
            <Txt v="display" c={c.onHero} style={{ marginTop: 22 }}>Água</Txt>
            <Txt v="note" c={c.onHero2} style={{ marginTop: 2 }}>
              Hoje: {litros(hoje)} de {litros(alvo)} L
            </Txt>

            {/* A PORCENTAGEM GRANDE, em água.

                Ela não repete a linha de cima: aquela diz a QUANTIDADE,
                esta diz o quanto do dia já foi. É o trabalho de uma barra
                de progresso, feito por um número que cabe na foto — e uma
                barra fininha por cima de água fotografada seria a única
                coisa da tela a parecer formulário.

                Em branco translúcido para ficar no plano da imagem. Sólida
                ela viraria o assunto da tela, e o assunto é a água. */}
            <View style={{ flex: 1, justifyContent: 'center' }}>
              <Txt
                v="display"
                c="rgba(255,255,255,0.46)"
                style={{ fontSize: 84, lineHeight: 92, letterSpacing: -2 }}
              >
                {pct}
                <Txt v="display" c="rgba(255,255,255,0.34)" style={{ fontSize: 40, lineHeight: 92 }}>%</Txt>
              </Txt>
            </View>

            {/* OS ATALHOS. Dois recipientes e uma saída para o resto —
                meio copo, garrafa e meia, o que os dois não cobrem. */}
            <Row gap={8}>
              {ATALHOS.map(([nome, ml]) => (
                <Pressable
                  key={nome}
                  onPress={() => update((s: any) => registrarAgua(s, ml))}
                  style={({ pressed }) => [{ flex: 1, opacity: pressed ? 0.7 : 1 }]}
                >
                  <BlurView
                    intensity={36}
                    tint="light"
                    style={{
                      overflow: 'hidden', borderRadius: radius.pill,
                      borderWidth: 1, borderColor: 'rgba(255,255,255,0.35)',
                      alignItems: 'center', paddingVertical: 9, gap: 1,
                    }}
                  >
                    <Txt v="caption" c={c.onHero}>+ {nome}</Txt>
                    <Txt v="micro" c={c.onHero2}>{litros(ml)} L</Txt>
                  </BlurView>
                </Pressable>
              ))}
              <Pressable
                onPress={() => router.push('/medir-agua' as any)}
                style={({ pressed }) => [{ flex: 1, opacity: pressed ? 0.7 : 1 }]}
              >
                <View style={{
                  backgroundColor: c.onHero, borderRadius: radius.pill,
                  alignItems: 'center', paddingVertical: 10, gap: 1,
                }}>
                  <Txt v="caption" c="#0B1220">Outra</Txt>
                  <Txt v="micro" c="rgba(11,18,32,0.55)">quantidade</Txt>
                </View>
              </Pressable>
            </Row>
          </View>
        </View>

        {/* A FOLHA sobe um dedo por cima da foto, e o resto da tela é o
            fundo de sempre — os cartões de dentro precisam dele para
            continuarem sendo cartões. */}
        <View style={{
          backgroundColor: c.bg, marginTop: -26,
          borderTopLeftRadius: radius.xl, borderTopRightRadius: radius.xl,
          paddingHorizontal: 16, paddingTop: 22, gap: 22,
        }}>
          {/* Por que um app de GLP-1 tem tela de água. As outras duas
              telas de hábito abrem com a mesma frase, embaixo do titulão;
              aqui o titulão está na foto, e sobra a frase sozinha. */}
          <Txt v="note" c={c.tx2} style={{ paddingHorizontal: 2 }}>
            Comendo menos, entra menos água pela comida — e ela é boa parte
            do que se bebe sem perceber. Beber de propósito é o que cobre a
            diferença.
          </Txt>

          {/* A SEMANA.

              As barras chegam em MILILITROS, que é a unidade em que a
              altura e a meta se comparam sem arredondar nada; quem traduz
              para litro é o rótulo. */}
          <CardSemana
            nome="Esta semana"
            sub={diasComRegistro === 0
              ? 'Nada registrado nos últimos sete dias'
              : `Média de ${diasComRegistro} ${diasComRegistro === 1 ? 'dia registrado' : 'dias registrados'}`}
            valor={litros(media)}
            unidade="L"
            dias={semana.map((d) => ({ t: d.t, v: d.ml }))}
            alvo={alvo}
            rotuloMeta={`Meta: ${litros(alvo)} L`}
            rotulo={litros}
          />

          {/* O CADERNO DE ÁGUA — e a saída que a água não tinha.

              Beber era a única coisa deste app sem volta: um toque errado
              em "Garrafão" somava um litro para sempre, e a pessoa via o
              número errado sabendo que estava errado. Aqui cada gole tem
              hora e lixeira, e apagar devolve ao dia só o que aquele gole
              somou.

              A hora não é enfeite: é ela que identifica o registro para
              quem está procurando qual apagar. Entre dois copos de
              0,25 L, o que diferencia um do outro é "às 7:18". */}
          <Bloco
            titulo="Caderno de água"
            nota="Cada registro com a hora em que entrou. Apague o que tiver entrado errado."
          >
            <View style={{ gap: 10 }}>
              <TiraDeDias
                dias={calendario.map((d) => ({ t: d.t, marcado: d.itens > 0, hoje: d.hoje }))}
                sel={diaSel}
                onEscolhe={setDiaSel}
              />

              {doDia.length ? (
                <View style={{ gap: 10 }}>
                  <Cartao>
                    {doDia.map((g) => (
                      <ItemApagavel
                        key={g.t ?? 'dia'}
                        pergunta={g.t == null
                          ? 'Apagar a água deste dia?'
                          : `Apagar ${litros(g.ml)} L das ${hm(new Date(g.t).getHours(), new Date(g.t).getMinutes())}?`}
                        onApagar={() => update((s: any) => apagarGole(s, diaSel, g.t))}
                      >
                        <Row gap={12}>
                          {/* Um glifo, e não o número em mililitros. O selo
                              trazia "250" ao lado de "0,25 L" — o mesmo fato
                              duas vezes em duas unidades, e sem dizer de qual
                              delas eram os 250. */}
                          <View style={{
                            width: 34, height: 34, borderRadius: radius.md,
                            backgroundColor: c.accentWeak, alignItems: 'center', justifyContent: 'center',
                          }}>
                            <Icon name="water" size={17} color={c.accent} sw={1.9} />
                          </View>
                          <View style={{ flex: 1 }}>
                            <Txt v="body">{litros(g.ml)} L</Txt>
                            {/* O DIA SEM HORA é dito, e não maquiado. Um
                                registro de antes de o caderno existir sabe o
                                total e não sabe quando: inventar "08:00" para
                                preencher a linha seria escrever no diário da
                                pessoa uma coisa que ela não escreveu. */}
                            <Txt v="caption" c={c.tx3} style={{ marginTop: 2 }}>
                              {g.t == null
                                ? 'Total do dia, sem registro de horário'
                                : `às ${hm(new Date(g.t).getHours(), new Date(g.t).getMinutes())}`}
                            </Txt>
                          </View>
                        </Row>
                      </ItemApagavel>
                    ))}
                  </Cartao>
                  {/* O total embaixo, que é o que a soma das linhas deu. */}
                  <Txt v="micro" c={c.tx4} style={{ textAlign: 'center' }}>
                    {doDia.length} {doDia.length === 1 ? 'registro' : 'registros'} · {litros(mlDoDia)} L
                  </Txt>
                </View>
              ) : (
                <Vazio
                  ic="water"
                  titulo="Nada registrado neste dia"
                  texto="O que você anotar entra no total do dia."
                />
              )}
            </View>
          </Bloco>

          {/* O LEMBRETE.

              É a única coisa que muda o comportamento da água e não é um
              número: quem esquece de beber não esquece por não saber
              quanto falta, esquece por estar fazendo outra coisa. O ajuste
              mora em Lembretes com os outros; aqui fica o atalho e o
              estado atual, porque "desligado" é a resposta que explica uma
              semana fraca. */}
          <Bloco titulo="Lembrete">
            <Cartao>
              <Linha
                ic="bell"
                titulo={lembrete?.on ? 'Lembrete ligado' : 'Lembrete desligado'}
                sub={lembrete?.on
                  ? `Todo dia às ${hm(lembrete.hour ?? 0, lembrete.min ?? 0)}`
                  : 'Um toque por dia, na hora que você escolher'}
                onPress={() => router.push('/lembretes' as any)}
              />
            </Cartao>
          </Bloco>
        </View>
      </ScrollView>
    </View>
  );
}
