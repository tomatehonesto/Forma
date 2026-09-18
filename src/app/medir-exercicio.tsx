import React, { useState } from 'react';
import { View, Pressable } from 'react-native';
import Slider from '@react-native-community/slider';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useStore } from '../logic/store';
import {
  apagarTreino, checkinToday, editarTreino, fontesDeMovimento, listaPt, registroDoDia, treinoEm,
} from '../logic/derive';
import { now, startOfDay } from '../logic/time';
import { Txt, Row, SheetScreen, Metric } from '../ui/kit';
import { Botao, Grade, Opc, Texto } from '../ui/internas';
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
   `treinos`.

   Esta tela chegou a listar os treinos do dia aqui em cima, e não lista
   mais: a folha abre para UMA ação, e resumo no topo é coisa para passar
   por cima antes de chegar no que se veio fazer. O total do dia fica na
   linha embaixo do título, que não é histórico — é o estado do número
   que se está prestes a mexer.

   Com isso `treinos` fica sem leitor por enquanto. É dado guardado
   esperando a tela que mostra o dia, não dado morto: a distinção é que
   alguém sabe que ele está lá, e agora está escrito.
   ============================================================ */

/* Cada modalidade com uma pessoa fazendo. Numa lista de dez o desenho é
   o que se encontra antes de ler, e o desenho tem que ser do movimento —
   pegada, velocímetro e onda diziam do rastro, do aparelho e da água, em
   vez de dizer de quem se mexeu.

   Musculação fica na barra em vez do halter que o app usa para
   "Exercício" em toda parte: o mesmo glifo para a categoria e para uma
   das modalidades dentro dela daria a impressão de que musculação é o
   exercício e o resto é outra coisa. */
const TIPOS: [string, string][] = [
  ['walk', 'Caminhada'],
  ['run', 'Corrida'],
  ['barbell', 'Musculação'],
  ['bike', 'Bike'],
  ['swim', 'Natação'],
  ['yoga', 'Yoga'],
  ['gymnastics', 'Pilates'],
  ['lunge', 'Funcional'],
  ['stretch', 'Alongamento'],
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

  /* A MESMA folha registra e corrige.

     Com `t` e `i` na URL ela abre carregada com aquela sessão, o botão
     passa a salvar em vez de somar, e ganha o apagar embaixo. Fazer uma
     segunda tela para corrigir significaria manter duas cópias da grade
     de modalidades e do controle de duração — e é exatamente aí que um
     vira nove modalidades e o outro continua com oito. */
  const { t: tParam, i: iParam } = useLocalSearchParams<{ t?: string; i?: string }>();
  const editando = tParam != null && iParam != null;
  const diaEdit = Number(tParam);
  const idxEdit = Number(iParam);
  const original = editando ? treinoEm(S, diaEdit, idxEdit) : null;

  const [tipo, setTipo] = useState(() => {
    const t = original?.tipo;
    return t && TIPOS.some(([, nome]) => nome === t) ? t : (t ? OUTRO : 'Caminhada');
  });
  const [outro, setOutro] = useState(() =>
    original && !TIPOS.some(([, nome]) => nome === original.tipo) ? original.tipo : '');
  const [min, setMin] = useState(original?.min ?? 30);

  /* No plural: quem tem Garmin costuma ter o Apple Saúde junto, e dizer
     só o primeiro esconde de onde metade dos minutos veio. */
  const fontes = fontesDeMovimento(S);
  const fonte = fontes.length ? listaPt(fontes) : null;
  const ci: any = checkinToday(S);
  const alvo = (S.profile as any).targets.exercMin as number;
  const hoje = ci?.exerc || 0;

  /* "Outro" só vale com nome. Sem isso o registro guardaria a palavra
     "Outro", que não diz mais do que não ter escolhido nada. */
  const nome = tipo === OUTRO ? outro.trim() : tipo;
  const pronto = min > 0 && !!nome;

  const salvar = () => {
    if (!pronto) return;
    update((s: any) => {
      if (editando) return editarTreino(s, diaEdit, idxEdit, nome, min);
      const c2 = registroDoDia(s, +startOfDay(now()));
      c2.exerc = (c2.exerc || 0) + min;
      c2.treinos = [...(c2.treinos || []), { tipo: nome, min }];
    });
    /* Corrigir um treino de outro dia não é registrar um treino hoje, e a
       confirmação fala do dia de hoje. */
    if (editando) { router.back(); return; }
    router.replace('/registro-ok?tipo=exercicio' as any);
  };

  const apagar = () => {
    update((s: any) => apagarTreino(s, diaEdit, idxEdit));
    router.back();
  };

  return (
    <SheetScreen
      titulo={editando ? 'Corrigir o treino' : 'Como você se movimentou?'}
      /* A fonte automática qualifica o NÚMERO, então mora junto dele. Ao
         corrigir ela não vem: quem está consertando uma linha não precisa
         do total do dia, precisa da linha. */
      sub={editando
        ? 'O que ficou errado no registro'
        : `${hoje} de ${alvo} min hoje${fonte ? ` · já com ${fontes.length === 1 ? 'o ' : ''}${fonte}` : ''}`}
      onClose={() => router.back()}
      rodape={(
        <Pressable onPress={salvar} disabled={!pronto} style={({ pressed }) => [{ opacity: pressed ? 0.8 : 1 }]}>
          <View style={{
            backgroundColor: pronto ? c.accent : c.bg2,
            borderRadius: radius.pill, paddingVertical: 15, alignItems: 'center',
          }}>
            <Txt v="body" c={pronto ? c.accentInk : c.tx4}>
              {!nome
                ? 'Diga o que você fez'
                : editando
                  ? 'Salvar a correção'
                  : `Registrar ${min} min de ${nome.toLowerCase()}`}
            </Txt>
          </View>
        </Pressable>
      )}
    >
      {/* Uma linha, e não um cartão.

          O que precisa ser dito é curto: o que a pessoa digitar aqui
          ENTRA SOMANDO, e quem tem o telefone contando sozinho pode
          fechar o dia com o dobro do que aconteceu. Mas ícone, título em
          negrito e parágrafo dentro de uma caixa arredondada são a
          anatomia de um cartão de insight — a forma diz "o app concluiu
          algo sobre você" antes de o texto dizer qualquer coisa, e isso
          aqui é só um fato da configuração dela.

          Sem caixa, sem ícone, sem título: uma frase logo abaixo do
          número que ela explica. */}
      {fonte && !editando ? (
        <Txt v="caption" c={c.tx3} style={{ marginTop: 10 }}>
          O que você registrar aqui soma ao que {fontes.length === 1 ? 'ele já contou' : 'eles já contaram'}.
        </Txt>
      ) : null}

      {/* O mesmo título com fonte ou sem ela. A versão de antes trocava
          para "ADICIONAR À MÃO", que separa o mundo entre o automático e o
          que se faz com a mão — e chama de mão o que muita gente faz de
          outro jeito. O banner acima já disse o que precisava ser dito. */}
      <Txt v="micro" c={c.tx3} style={{ letterSpacing: 1, marginTop: 20, marginBottom: 10 }}>O QUE VOCÊ FEZ</Txt>
      <Grade>
        {TIPOS.map(([ic, t]) => (
          <Opc key={t} ic={ic} cheia label={t} on={tipo === t} onPress={() => setTipo(t)} />
        ))}
      </Grade>

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

      {/* Longe do salvar, e no fim: apagar é o que se faz depois de olhar
          o registro inteiro e concluir que ele não devia existir. */}
      {editando ? (
        <View style={{ marginTop: 22 }}>
          <Botao label="Apagar este treino" tom="perigo" onPress={apagar} />
        </View>
      ) : null}
    </SheetScreen>
  );
}
