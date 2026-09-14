import React, { useState } from 'react';
import { View, Pressable } from 'react-native';
import Slider from '@react-native-community/slider';
import { useRouter } from 'expo-router';
import { useStore } from '../logic/store';
import { waterMlToday, CUP_ML, registroDoDia } from '../logic/derive';
import { now, startOfDay } from '../logic/time';
import { Txt, Row, SheetScreen, Metric } from '../ui/kit';
import { Icon } from '../ui/Icon';
import { useTheme } from '../ui/useTheme';
import { radius } from '../theme';

/* ============================================================
   QUANTO VOCÊ BEBEU

   Antes o atalho somava um copo às cegas. Perguntar quanto custa um toque
   a mais e é a diferença entre registro e chute.

   As MEDIDAS COMUNS eram botões de registro: tocar em "Garrafa" gravava
   500 ml na hora. Agora elas SOMAM no slider, e quem grava é só o botão
   de baixo. A diferença aparece em quem bebeu duas coisas diferentes:
   antes eram dois registros e duas idas ao mesmo botão; agora é
   "copo + copo + garrafa", o número sobe na frente da pessoa, e ela
   confirma uma vez. O slider deixa de ser o caminho alternativo e vira o
   mostrador de todos eles.

   Por isso as três também mudaram de lugar: estavam numa seção própria lá
   embaixo, longe do número que agora alimentam.
   ============================================================ */

/* Os recipientes que existem na cozinha de qualquer um. Somam no slider,
   e por isso o rótulo traz o sinal: o que o toque faz é acrescentar. */
const MEDIDAS: [string, number][] = [
  ['Copo', 250],
  ['Garrafa', 500],
  ['Garrafão', 1000],
];

export default function MedirAgua() {
  const S = useStore((s) => s.S);
  const update = useStore((s) => s.update);
  const { c } = useTheme();
  const router = useRouter();
  const [somado, setSomado] = useState(0);
  /* Começa em ZERO. Começando em 250 a tela já tinha uma resposta pronta
     antes da pergunta, e "+ Copo" somava em cima dela: quem tocou uma vez
     no copo registrava dois. Em zero, cada toque vale o que diz. */
  const [escolhido, setEscolhido] = useState(0);

  const alvo = (S.profile as any).targets.waterMl as number;
  const atual = waterMlToday(S);
  const pct = Math.max(0, Math.min(1, atual / alvo));
  /* LITROS em toda a tela, e uma casa decimal só quando ela existe: 1 L,
     1,5 L, 0,25 L. Sem zero à toa no fim, como se escreve à mão.

     A meta é em litros, o número grande do progresso é em litros, e o
     montador falava em mililitros — a mesma tela dizia "de 2,5 L hoje" e
     "2.750 ml" a dois centímetros de distância, e quem lia fazia a conta
     de cabeça para saber se tinha chegado perto. A unidade do alvo é que
     manda: é ela que a pessoa está tentando alcançar.

     Por dentro tudo continua em ml, que é onde o passo de 50 vive e o que
     o armazenamento entende. Litro é como a tela fala. */
  const L = (ml: number) => (ml / 1000).toFixed(2).replace(/\.?0+$/, '').replace('.', ',');

  /* O teto é meia meta acima da meta, e sai dela — não de um número fixo:
     quem tem 3 L de meta merece a mesma folga de quem tem 2.

     Parar na meta exata seria transformar o fim da régua em regra. Quem
     bebeu mais do que devia num dia quente precisa conseguir dizer isso;
     um limite que corta a verdade em nome do alvo faz o registro mentir
     justo no dia em que a pessoa acertou por excesso. */
  const max = Math.round((alvo * 1.5) / 50) * 50;

  const somar = (ml: number) => setEscolhido((v) => Math.min(max, v + ml));

  const beber = (ml: number) => {
    update((s: any) => {
      const t = +startOfDay(now());
      /* Registrar água diz uma coisa só: quanta água. Antes, criar o
         registro do dia aqui afirmava junto sono 7, humor 3 e fome 5 —
         estado que ninguém perguntou. registroDoDia traz só o recipiente. */
      const ci = registroDoDia(s, t);
      ci.agua = (ci.agua || 0) + ml / CUP_ML;
    });
    setSomado((v) => v + ml);
  };

  return (
    <SheetScreen
      titulo="Quanto você bebeu?"
      sub="Toque quantas vezes precisar"
      onClose={() => router.back()}
      rodape={(
        /* Em zero não há o que gravar, e o botão diz o que falta em vez de
           oferecer um "adicionar 0 ml" que não faz nada. */
        <Pressable
          onPress={() => beber(escolhido)}
          disabled={escolhido === 0}
          style={({ pressed }) => [{ opacity: pressed ? 0.8 : 1 }]}
        >
          <View style={{
            backgroundColor: escolhido === 0 ? c.bg2 : c.accent,
            borderRadius: radius.pill, paddingVertical: 15, alignItems: 'center',
          }}>
            {/* A mesma unidade do número lá em cima, e da meta no cartão
                de progresso: a tela inteira fala em litros. */}
            <Txt v="body" c={escolhido === 0 ? c.tx4 : c.accentInk}>
              {escolhido === 0 ? 'Escolha a quantidade' : `Adicionar ${L(escolhido)} L`}
            </Txt>
          </View>
        </Pressable>
      )}
    >
      {/* onde está agora */}
      <View style={{ backgroundColor: c.bg1, borderRadius: radius.lg, padding: 18, marginTop: 18 }}>
        <Row style={{ alignItems: 'flex-end' }}>
          <Metric value={L(atual)} unit="L" />
          <View style={{ flex: 1 }} />
          <Txt v="note" c={c.tx3}>de {L(alvo)} L hoje</Txt>
        </Row>
        <View style={{ height: 6, borderRadius: radius.pill, backgroundColor: c.bg2, overflow: 'hidden', marginTop: 14 }}>
          <View style={{ width: `${Math.max(2, pct * 100)}%`, height: 6, borderRadius: radius.pill, backgroundColor: c.accent }} />
        </View>
        {somado > 0 && (
          <Row gap={7} style={{ marginTop: 12 }}>
            <Icon name="check" size={14} color={c.accent} sw={2.4} />
            <Txt v="caption" c={c.accent}>+{L(somado)} L agora</Txt>
          </Row>
        )}
      </View>

      {/* O montador. Tudo que compõe a quantidade mora aqui — inclusive o
          meio copo e a garrafa e meia, que os recipientes não cobrem. Quem
          grava é o botão do rodapé, fora da rolagem: ele é o mesmo em toda
          a tela, e o cartão é só onde o número se forma. */}
      <View style={{ backgroundColor: c.bg1, borderRadius: radius.lg, padding: 18, marginTop: 7 }}>
        <Row style={{ justifyContent: 'space-between', alignItems: 'baseline' }}>
          <Txt v="caption" c={c.tx3}>Quantidade</Txt>
          <Metric value={L(escolhido)} unit="L" v="h2" />
        </Row>
        <Slider
          value={escolhido}
          minimumValue={0} maximumValue={max} step={50}
          onValueChange={setEscolhido}
          minimumTrackTintColor={c.accent}
          maximumTrackTintColor={c.bg2}
          thumbTintColor={c.accent}
          style={{ marginTop: 8, marginHorizontal: -6 }}
        />
        <Row style={{ justifyContent: 'space-between' }}>
          <Txt v="micro" c={c.tx4}>0 L</Txt>
          <Txt v="micro" c={c.tx4}>{L(max)} L</Txt>
        </Row>

        <Row gap={7} style={{ marginTop: 16, alignItems: 'stretch' }}>
          {MEDIDAS.map(([nome, ml]) => (
            <Pressable key={nome} onPress={() => somar(ml)} style={({ pressed }) => [{ flex: 1, opacity: pressed ? 0.7 : 1 }]}>
              <View style={{
                flex: 1, backgroundColor: c.bg2, borderRadius: radius.md,
                paddingVertical: 11, alignItems: 'center', gap: 1,
              }}>
                <Txt v="caption" c={c.tx}>+ {nome}</Txt>
                <Txt v="micro" c={c.tx3}>{L(ml)} L</Txt>
              </View>
            </Pressable>
          ))}
        </Row>
      </View>
    </SheetScreen>
  );
}
