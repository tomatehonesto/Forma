import React from 'react';
import { View, Pressable, StyleSheet, useWindowDimensions } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useStore } from '../logic/store';
import { confirmacaoDe, type TipoDeRegistro } from '../logic/confirmacoes';
import { Txt, Row } from '../ui/kit';
import { Cartao, Linha } from '../ui/internas';
import { Icon } from '../ui/Icon';
import { useTheme } from '../ui/useTheme';
import { useTrocarDeTela } from '../ui/useTrocarDeTela';
import { radius } from '../theme';

/* ============================================================
   REGISTRADO — a folha que fecha uma captura

   ⚠️ OITO CAPTURAS TERMINAVAM EM `router.back()`. A folha sumia, a tela
   de trás voltava exatamente igual, e a pessoa não tinha como saber se o
   número entrou. O check-in e a aplicação já tinham tela de fim; as
   outras oito, não — e são justamente as que se registram no meio do
   dia, com o aparelho na mão e sem tempo de conferir depois.

   ELA É FOLHA, E NÃO TELA CHEIA. A captura veio de baixo, como bottom
   sheet; a confirmação continua de baixo, no mesmo lugar, e sai pelo
   mesmo gesto. Trocar para uma tela inteira faria o app parecer que
   mudou de assunto quando ele só terminou uma frase.

   E ELA NÃO É SÓ UM "PRONTO". Um selo verde com um botão embaixo custa
   um toque e não devolve nada — depois da terceira vez vira a tela que a
   pessoa fecha sem ler. Aqui o cartão responde o que se pergunta logo
   depois de salvar: quanto mudou desde a última vez, quanto falta para a
   meta, se o exame está na faixa. Quem monta essa resposta é
   src/logic/confirmacoes.ts.

   O LIMA TEM DONO. O disco é neutro quando o registro só entrou, e vira
   lima quando ele fechou uma meta do dia — o mesmo par do check-in
   concluído e dos atalhos do registrar. Um verde de sucesso em todo
   salvamento gastaria a cor que este app reserva para o alcançado.
   ============================================================ */

export default function RegistroOk() {
  const S = useStore((s) => s.S);
  const { c } = useTheme();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { height } = useWindowDimensions();
  const { tipo, ref } = useLocalSearchParams<{ tipo?: string; ref?: string }>();

  if (!tipo) { router.back(); return null; }
  const info = confirmacaoDe(S, tipo as TipoDeRegistro, ref);
  const festa = !!info.lima;

  /* Fechar volta para onde a pessoa estava. A captura saiu da pilha no
     `replace`, então aqui embaixo está a tela de origem — e não um
     formulário já salvo que o botão de voltar do sistema reabriria. */
  const sair = () => router.back();
  const seguir = useTrocarDeTela();

  return (
    <View style={{ height, justifyContent: 'flex-end' }}>
      <Pressable onPress={sair} style={[StyleSheet.absoluteFill, { backgroundColor: c.scrim }]} />

      <View style={{
        backgroundColor: c.bg, maxHeight: height * 0.86,
        borderTopLeftRadius: radius.xl, borderTopRightRadius: radius.xl,
        paddingHorizontal: 24,
        paddingTop: 26,
        paddingBottom: (insets.bottom || 12) + 16,
        alignItems: 'center',
      }}>
        {/* Sem grabber e sem X no topo: a folha tem um caminho de saída só,
            e ele é o botão embaixo. Três jeitos de fechar a mesma coisa
            fazem a pessoa procurar qual deles é o certo. */}
        <View style={{
          width: 64, height: 64, borderRadius: 32,
          backgroundColor: festa ? c.lime : c.okBg,
          alignItems: 'center', justifyContent: 'center',
        }}>
          <Icon name="check" size={30} color={festa ? c.limeInk : c.ok} sw={2.8} />
        </View>

        <Txt v="h2" style={{ marginTop: 16, textAlign: 'center' }}>{info.titulo}</Txt>
        <Txt v="note" c={c.tx2} style={{ marginTop: 6, textAlign: 'center' }}>{info.texto}</Txt>

        {info.festa ? (
          <View style={{
            marginTop: 12, backgroundColor: c.limeSoft,
            borderRadius: radius.pill, paddingHorizontal: 13, paddingVertical: 6,
          }}>
            <Txt v="tag" c={c.limeSoftInk}>{info.festa}</Txt>
          </View>
        ) : null}

        {info.linhas.length ? (
          <View style={{ alignSelf: 'stretch', marginTop: 20 }}>
            <Cartao>
              {info.linhas.map((l) => (
                <Linha key={l.titulo} titulo={l.titulo} sub={l.sub} selo={l.selo} seloTom={l.seloTom} seta={false} />
              ))}
            </Cartao>
          </View>
        ) : null}

        <View style={{ alignSelf: 'stretch', marginTop: 20, gap: 10 }}>
          <Pressable onPress={sair} style={({ pressed }) => [{ opacity: pressed ? 0.85 : 1 }]}>
            <View style={{ backgroundColor: c.accent, borderRadius: radius.pill, paddingVertical: 15, alignItems: 'center' }}>
              <Txt v="body" c={c.accentInk}>Pronto</Txt>
            </View>
          </Pressable>

          {/* O segundo caminho é discreto de propósito: quem registrou já
              terminou o que veio fazer, e este é um convite, não o fim do
              fluxo. */}
          {info.caminho ? (
            <Pressable onPress={() => seguir(info.caminho!.to)} style={({ pressed }) => [{ opacity: pressed ? 0.6 : 1 }]}>
              <Row gap={5} style={{ justifyContent: 'center', paddingVertical: 8 }}>
                <Txt v="label" c={c.accent}>{info.caminho.label}</Txt>
                <Icon name="chev" size={12} color={c.accent} sw={2.2} />
              </Row>
            </Pressable>
          ) : null}
        </View>
      </View>
    </View>
  );
}
