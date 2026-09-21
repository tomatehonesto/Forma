import React, { useState } from 'react';
import { View, Pressable, TextInput } from 'react-native';
import Slider from '@react-native-community/slider';
import { useRouter } from 'expo-router';
import { useStore } from '../logic/store';
import { waterMlToday, litros, registrarAgua } from '../logic/derive';
import { BEBIDAS, BEBIDA_PADRAO, bebidaDe, medidasDe } from '../logic/bebidas';
import { somaDe } from '../logic/prato';
import { Txt, Row, SheetScreen, Metric } from '../ui/kit';
import { Icon } from '../ui/Icon';
import { useTheme } from '../ui/useTheme';
import { font, radius } from '../theme';
import { sistemaDe } from '../logic/medidas';

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

export default function MedirAgua() {
  const S = useStore((s) => s.S);
  const update = useStore((s) => s.update);
  const { c } = useTheme();
  const router = useRouter();
  /* Começa em ZERO. Começando em 250 a tela já tinha uma resposta pronta
     antes da pergunta, e "+ Copo" somava em cima dela: quem tocou uma vez
     no copo registrava dois. Em zero, cada toque vale o que diz. */
  const [escolhido, setEscolhido] = useState(0);
  /* Água começa escolhida: é a resposta certa na maioria das vezes, e a
     única que o app registrava até aqui. */
  const [bebidaId, setBebidaId] = useState(BEBIDA_PADRAO);
  const bebida = bebidaDe(bebidaId);
  /* Uma dose é o palpite certo para quem escolheu shake, e zero é uma
     resposta válida: tem gente que bate a fruta sem whey nenhum. */
  const [doses, setDoses] = useState(1);
  const [nome, setNome] = useState('');

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
  const L = litros;

  /* O teto é meia meta acima da meta, e sai dela — não de um número fixo:
     quem tem 3 L de meta merece a mesma folga de quem tem 2.

     Parar na meta exata seria transformar o fim da régua em regra. Quem
     bebeu mais do que devia num dia quente precisa conseguir dizer isso;
     um limite que corta a verdade em nome do alvo faz o registro mentir
     justo no dia em que a pessoa acertou por excesso. */
  const max = Math.round((alvo * 1.5) / 50) * 50;

  const somar = (ml: number) => setEscolhido((v) => Math.min(max, v + ml));

  /* Gravar é uma linha porque a regra não mora mais aqui. Este botão
     somava direto no acumulador do dia e não guardava nada sobre o gole —
     era por isso que beber virava a única coisa do app que não se podia
     desfazer. registrarAgua escreve os dois: o gole no diário e o total
     do dia. */
  /* A FOLHA FECHA E A CONFIRMAÇÃO ABRE, como em toda captura do app.

     Os toques que a tela pede — "toque quantas vezes precisar" — são os
     das medidas, que SOMAM no mostrador antes de gravar; gravar continua
     sendo um toque só, no botão de baixo, e é ele que fecha a folha.

     Por isso o "+0,3 L agora" saiu junto: ele confirmava dentro de uma
     tela que agora sai de cena no mesmo instante, e ficaria escrito para
     ninguém. Quem dá essa resposta é a folha de confirmação, com o total
     do dia e o quanto falta. */
  const beber = (ml: number) => {
    update((s: any) => registrarAgua(s, ml, bebidaId, { doses, nome: nome.trim() }));
    router.replace('/registro-ok?tipo=agua' as any);
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
              {escolhido === 0
                ? 'Escolha a quantidade'
                : `Adicionar ${L(escolhido)} L${bebida.id === BEBIDA_PADRAO ? '' : ` de ${bebida.nome.toLowerCase()}`}`}
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
      </View>

      {/* O QUE VOCÊ BEBEU, antes de quanto.

          A tela contava só água pura, e media isso contra uma meta de
          líquido total — ver o porquê em src/logic/bebidas.ts. Quem tomou
          três cafés via meio litro e estava devendo um litro já bebido.

          AS PASTILHAS VÊM ANTES DO MONTADOR porque elas mudam o que ele
          oferece: a xícara só existe para café e chá, e a lata só para o
          que vem em lata. Um "+ Garrafão" ao lado de café seria atalho
          para uma coisa que ninguém faz. */}
      <View style={{ backgroundColor: c.bg1, borderRadius: radius.lg, padding: 18, marginTop: 7, gap: 12 }}>
        <Txt v="caption" c={c.tx3}>O que você bebeu</Txt>
        <Row style={{ flexWrap: 'wrap', gap: 7 }}>
          {BEBIDAS.map((b) => {
            const on = b.id === bebida.id;
            return (
              <Pressable key={b.id} onPress={() => setBebidaId(b.id)} style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1 }]}>
                <Row gap={6} style={{
                  backgroundColor: on ? c.accent : c.bg2,
                  borderRadius: radius.pill, paddingHorizontal: 12, paddingVertical: 9,
                }}>
                  <Icon name={b.ic} size={14} color={on ? c.accentInk : c.tx2} sw={1.9} />
                  <Txt v="caption" c={on ? c.accentInk : c.tx}>{b.nome}</Txt>
                </Row>
              </Pressable>
            );
          })}
        </Row>
        {/* A RESSALVA APARECE COM A ESCOLHA, e não como nota de rodapé
            permanente. O álcool continua podendo ser registrado — o
            diário é da pessoa —, e o que ele não faz é somar. Dizer isso
            aqui é melhor do que a pessoa gravar e o número não andar. */}
        {bebida.nota ? <Txt v="caption" c={c.tx3}>{bebida.nota}</Txt> : null}

        {/* O SEGUNDO CAMPO, só para quem precisa dele.

            O shake é o único em que o volume não responde pela comida:
            300 ml com uma dose dão 24 g de proteína e com duas dão 48. A
            dose aparece porque foi escolhida; para leite e suco ela não
            existe, porque o copo já responde. */}
        {bebida.porDose ? (
          <View style={{ gap: 9 }}>
            <Row style={{ justifyContent: 'space-between', alignItems: 'baseline' }}>
              <Txt v="caption" c={c.tx3}>Quantas doses de proteína</Txt>
              <Txt v="caption" c={c.tx3}>
                {doses === 0 ? 'nenhuma' : `~${somaDe([{ id: bebida.porDose, qtd: doses }])} g`}
              </Txt>
            </Row>
            <Row gap={7}>
              {[0, 1, 2].map((d) => (
                <Pressable key={d} onPress={() => setDoses(d)} style={({ pressed }) => [{ flex: 1, opacity: pressed ? 0.7 : 1 }]}>
                  <View style={{
                    backgroundColor: doses === d ? c.accent : c.bg2,
                    borderRadius: radius.md, paddingVertical: 11, alignItems: 'center',
                  }}>
                    <Txt v="caption" c={doses === d ? c.accentInk : c.tx}>
                      {d === 0 ? 'Sem whey' : `${d} ${d === 1 ? 'dose' : 'doses'}`}
                    </Txt>
                  </View>
                </Pressable>
              ))}
            </Row>
          </View>
        ) : null}

        {/* O CAMPO ABERTO, para o que a lista não tem. O nome entra no
            diário no lugar de "Outro"; o que tem dentro, o app não
            adivinha — e não finge que adivinha. */}
        {bebida.livre ? (
          <TextInput
            value={nome}
            onChangeText={setNome}
            placeholder="Kombucha, isotônico, caldo de cana…"
            placeholderTextColor={c.tx4}
            style={{
              backgroundColor: c.bg2, borderRadius: radius.md,
              paddingHorizontal: 14, paddingVertical: 12,
              fontFamily: font.body, fontSize: 15, color: c.tx,
            }}
          />
        ) : null}
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
          {medidasDe(bebida, sistemaDe(S)).map(([nome, ml]) => (
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
