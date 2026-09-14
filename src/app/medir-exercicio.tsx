import React, { useState } from 'react';
import { View, Pressable } from 'react-native';
import Slider from '@react-native-community/slider';
import { useRouter } from 'expo-router';
import { useStore } from '../logic/store';
import { checkinToday, registroDoDia, fonteDeMovimento } from '../logic/derive';
import { now, startOfDay } from '../logic/time';
import { Txt, Row, SheetScreen, Metric } from '../ui/kit';
import { Icon } from '../ui/Icon';
import { Opcoes, Opc, Texto } from '../ui/internas';
import { useTheme } from '../ui/useTheme';
import { radius } from '../theme';

/* ============================================================
   COMO VOCÊ SE MOVIMENTOU

   O atalho antigo somava 30 min fixos, o que dava no mesmo para uma
   caminhada curta e para uma hora de academia. Depois virou quatro
   modalidades e quatro durações — e as duas listas eram curtas demais:
   quem nada, pedala ou dança não se via ali, e quem caminhou 40 minutos
   tinha que escolher entre mentir 30 ou mentir 45.

   Agora a modalidade é uma lista larga com ícone e "Outro" por escrito, e
   o tempo é um slider de 5 em 5 até três horas. Os quatro números viraram atalhos
   que POSICIONAM o slider — diferente da água, onde os recipientes somam:
   lá a pessoa junta copos até o total do gole; aqui a duração é uma coisa
   só, e 15 + 30 não é um treino de 45.

   E a modalidade passou a ser GRAVADA. Ela existia só no rótulo do botão:
   a pessoa escolhia "Musculação", lia "Registrar 30 min de musculação" e
   o registro guardava trinta minutos de nada. Agora cada sessão entra em
   `treinos`, e a tela mostra o que já foi registrado hoje — sem leitor, o
   campo seria mais um dado morto.
   ============================================================ */

/* Cada modalidade com o seu desenho: numa lista de onze, o glifo é o que
   a pessoa encontra antes de ler. */
const TIPOS: [string, string][] = [
  ['footprints', 'Caminhada'],
  ['gauge', 'Corrida'],
  ['dumbbell', 'Musculação'],
  ['bike', 'Bike'],
  ['waves', 'Natação'],
  ['flower', 'Yoga'],
  ['person', 'Pilates'],
  ['activity', 'Funcional'],
  ['body', 'Alongamento'],
  ['more', 'Outro'],
];
const OUTRO = 'Outro';

/* Os quatro de sempre, que resolvem a maioria sem arrastar nada. */
const ATALHOS = [15, 30, 45, 60];
const MAX = 180;

export default function MedirExercicio() {
  const S = useStore((s) => s.S);
  const update = useStore((s) => s.update);
  const { c } = useTheme();
  const router = useRouter();

  const [tipo, setTipo] = useState('Caminhada');
  const [outro, setOutro] = useState('');
  const [min, setMin] = useState(30);

  const fonte = fonteDeMovimento(S);
  const ci: any = checkinToday(S);
  const alvo = (S.profile as any).targets.exercMin as number;
  const hoje = ci?.exerc || 0;
  const treinos: { tipo: string; min: number }[] = ci?.treinos ?? [];

  /* "Outro" só vale com nome. Sem isso o registro guardaria a palavra
     "Outro", que não diz mais do que não ter escolhido nada. */
  const nome = tipo === OUTRO ? outro.trim() : tipo;
  const pronto = min > 0 && !!nome;

  const salvar = () => {
    if (!pronto) return;
    update((s: any) => {
      const c2 = registroDoDia(s, +startOfDay(now()));
      c2.exerc = (c2.exerc || 0) + min;
      c2.treinos = [...(c2.treinos || []), { tipo: nome, min }];
    });
    router.back();
  };

  return (
    <SheetScreen
      titulo="Como você se movimentou?"
      sub={`${hoje} de ${alvo} min hoje`}
      onClose={() => router.back()}
      rodape={(
        <Pressable onPress={salvar} disabled={!pronto} style={({ pressed }) => [{ opacity: pressed ? 0.8 : 1 }]}>
          <View style={{
            backgroundColor: pronto ? c.accent : c.bg2,
            borderRadius: radius.pill, paddingVertical: 15, alignItems: 'center',
          }}>
            <Txt v="body" c={pronto ? c.accentInk : c.tx4}>
              {!nome ? 'Diga o que você fez' : `Registrar ${min} min de ${nome.toLowerCase()}`}
            </Txt>
          </View>
        </Pressable>
      )}
    >
      {/* O que já entrou hoje. É a prova de que a modalidade foi guardada,
          e o lembrete de quem se mexeu duas vezes e não lembra. */}
      {treinos.length ? (
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: 18 }}>
          {treinos.map((t, i) => (
            <View
              key={`${t.tipo}-${i}`}
              style={{ backgroundColor: c.bg2, borderRadius: radius.pill, paddingHorizontal: 12, paddingVertical: 6 }}
            >
              <Txt v="tag" c={c.tx2}>{t.tipo} · {t.min} min</Txt>
            </View>
          ))}
        </View>
      ) : null}

      {/* Quando já existe uma fonte automática, a tela diz isso ANTES do
          formulário. Sem esse aviso a pessoa registra o que o telefone já
          contou, e o dia fecha com o dobro do que aconteceu — o erro mais
          caro aqui não é esquecer, é somar duas vezes. */}
      {fonte ? (
        <View style={{
          backgroundColor: c.accentWeak, borderRadius: radius.lg,
          padding: 16, marginTop: 18, gap: 5,
        }}>
          <Row gap={8}>
            <Icon name="reset" size={15} color={c.accent} sw={2} />
            <Txt v="label" c={c.accent} style={{ flex: 1 }}>O {fonte} já registra por você</Txt>
          </Row>
          <Txt v="caption" c={c.tx2}>
            Os treinos chegam sozinhos, e o número aí em cima já conta com eles. O que você
            registrar aqui soma por cima.
          </Txt>
        </View>
      ) : null}

      <Txt v="micro" c={c.tx3} style={{ letterSpacing: 1, marginTop: 20, marginBottom: 10 }}>
        {fonte ? 'ADICIONAR À MÃO' : 'O QUE VOCÊ FEZ'}
      </Txt>
      <Opcoes>
        {TIPOS.map(([ic, t]) => (
          <Opc key={t} ic={ic} label={t} on={tipo === t} onPress={() => setTipo(t)} />
        ))}
      </Opcoes>

      {tipo === OUTRO ? (
        <View style={{ marginTop: 10 }}>
          <Texto valor={outro} onChange={setOutro} placeholder="Qual? Ex.: vôlei, escalada, jiu-jitsu" linhas={1} />
        </View>
      ) : null}

      <Txt v="micro" c={c.tx3} style={{ letterSpacing: 1, marginTop: 22 }}>POR QUANTO TEMPO</Txt>
      <View style={{ backgroundColor: c.bg1, borderRadius: radius.lg, padding: 18, marginTop: 10 }}>
        <Row style={{ justifyContent: 'space-between', alignItems: 'baseline' }}>
          <Txt v="caption" c={c.tx3}>Duração</Txt>
          <Metric value={`${min}`} unit="min" v="h2" />
        </Row>
        <Slider
          value={min}
          minimumValue={0} maximumValue={MAX} step={5}
          onValueChange={setMin}
          minimumTrackTintColor={c.accent}
          maximumTrackTintColor={c.bg2}
          thumbTintColor={c.accent}
          style={{ marginTop: 8, marginHorizontal: -6 }}
        />
        <Row style={{ justifyContent: 'space-between' }}>
          <Txt v="micro" c={c.tx4}>0 min</Txt>
          <Txt v="micro" c={c.tx4}>{MAX} min</Txt>
        </Row>

        {/* Atalhos que POSICIONAM, não somam: a duração é uma coisa só, e
            15 + 30 não é um treino de 45. */}
        <Row gap={7} style={{ marginTop: 16, alignItems: 'stretch' }}>
          {ATALHOS.map((m) => {
            const on = min === m;
            return (
              <Pressable key={m} onPress={() => setMin(m)} style={({ pressed }) => [{ flex: 1, opacity: pressed ? 0.7 : 1 }]}>
                <View style={{
                  flex: 1, backgroundColor: on ? c.accentWeak : c.bg2,
                  borderWidth: 1, borderColor: on ? c.accentLine : 'transparent',
                  borderRadius: radius.md, paddingVertical: 11, alignItems: 'center',
                }}>
                  <Txt v="caption" c={on ? c.accent : c.tx}>{m} min</Txt>
                </View>
              </Pressable>
            );
          })}
        </Row>
      </View>
    </SheetScreen>
  );
}
