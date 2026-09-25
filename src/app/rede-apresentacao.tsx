import React, { useEffect, useState } from 'react';
import { View, Pressable, StyleSheet } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useStore } from '../logic/store';
import { marcarApresentacaoDaRede, viuApresentacaoDaRede } from '../logic/rede';
import { Txt, Row, Rolagem } from '../ui/kit';
import { Selo, Botao } from '../ui/internas';
import { BarraQueColapsa } from '../ui/capa';
import { useTheme } from '../ui/useTheme';
import { radius, font } from '../theme';
import { T } from '../textos';

const A = () => T.rede.apresentacao;
const PAD = 24;

/* ============================================================
   A APRESENTAÇÃO DA REDE PARCEIRA — /rede-apresentacao

   Na primeira vez que a pessoa toca no cartão da rede, na aba Cuidado,
   ela chega aqui, e não na vitrine: uma foto, o que é a rede, os quatro
   passos de como se entra nela e um botão só. Nas vezes seguintes o
   cartão vai direto à vitrine (ver `viuApresentacaoDaRede`), e a vitrine
   tem "Como funciona" no alto para voltar.

   ⚠️ OS PASSOS SÃO O CAMINHO, E NÃO AS VANTAGENS. As vantagens — conversa,
   resumo, receita, agenda — estão em /parceiros, e aqui cabem numa frase
   do subtítulo. O que ninguém sabe antes de abrir a vitrine é o que
   acontece DEPOIS de escolher uma clínica: que o contato é direto com
   ela, que o código vem dela, e que nada do que a pessoa registrou
   recomeça. É isso que a tela responde.

   ⚠️ A FOTO É ILUSTRATIVA: não tem nome nem registro, e não é de ninguém
   da rede. Quem atende de verdade aparece na vitrine, com o registro ao
   lado do nome, e é lá que a pessoa confere.
   ============================================================ */

/* ⚠️ 1800 × 1200, E O ORIGINAL TINHA 6720 × 4480 E 14 MB. Decodificada, a
   foto grande ocuparia uns 120 MB de memória para desenhar um retângulo
   de 375 pontos. Esta é a que cabe numa tela de 3x com folga. De onde
   ela veio está em assets/images/CREDITOS.txt. */
const FOTO = require('../../assets/images/rede-hero.jpg');

/* A foto sobe por trás da barra de status, e a parte visível abaixo dela
   tem a mesma altura em qualquer aparelho. */
const ALTURA_VISIVEL = 280;

export default function RedeApresentacao() {
  const S = useStore((s) => s.S);
  const update = useStore((s) => s.update);
  const { c } = useTheme();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { de } = useLocalSearchParams<{ de?: string }>();
  const [passou, setPassou] = useState(false);

  /* ⚠️ VISTA É VISTA: a marca entra quando a tela abre, e não no botão.
     Quem leu e voltou sem tocar em nada já sabe como funciona; mostrar de
     novo a cada toque no cartão transformaria a apresentação num pedágio
     na frente da vitrine. */
  const vista = viuApresentacaoDaRede(S);
  useEffect(() => {
    if (!vista) update((s) => { marcarApresentacaoDaRede(s); });
  }, [vista, update]);

  /* Aberta pela aba Cuidado, ela dá lugar à vitrine — e o voltar de lá
     leva à aba, e não de novo para cá. Aberta pela vitrine, o botão volta
     para ela; e sem histórico (a página recarregada no navegador), não há
     para onde voltar, e ela dá lugar à vitrine do mesmo jeito. */
  const conhecer = () => (de === 'rede' && router.canGoBack() ? router.back() : router.replace('/rede' as any));

  const altura = insets.top + ALTURA_VISIVEL;
  /* A barra ganha fundo quando a folha encosta nela: a folha sobe 26
     sobre a foto, e a barra ocupa o alto do aparelho mais 60. */
  const limiar = altura - 26 - (insets.top + 60);

  return (
    <View style={{ flex: 1, backgroundColor: c.bg }}>
      <Rolagem
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 28 }}
        scrollEventThrottle={16}
        onScroll={(ev) => setPassou(ev.nativeEvent.contentOffset.y > limiar)}
      >
        {/* ---- a foto ----
            O rosto do médico fica a uns 43% da largura. Na tela estreita o
            corte é dos lados, e é ele que precisa ficar; na larga, o corte
            é de cima e de baixo, e o rosto mora no terço de cima. */}
        <View style={{ height: altura }}>
          <Image
            source={FOTO}
            style={StyleSheet.absoluteFill}
            contentFit="cover"
            contentPosition={{ top: '25%', left: '42%' }}
          />
          {/* O mesmo véu de /clinica: o botão de voltar mora sobre a foto,
              e o alto dela é uma janela clara. */}
          <LinearGradient
            colors={['rgba(0,0,0,0.38)', 'rgba(0,0,0,0.12)', 'rgba(0,0,0,0)']}
            locations={[0, 0.55, 1]}
            style={{ position: 'absolute', left: 0, right: 0, top: 0, height: insets.top + 96 }}
            pointerEvents="none"
          />
        </View>

        {/* ---- a folha, com canto, subindo sobre a foto ----
            A mesma de /clinica e das capas de hábito: a emenda é desenhada,
            e não escondida num degradê. */}
        <View style={{
          backgroundColor: c.bg,
          borderTopLeftRadius: radius.xl, borderTopRightRadius: radius.xl,
          marginTop: -26, paddingTop: 26, paddingHorizontal: PAD,
        }}>
          <Selo label={A().tag} />
          <Txt v="display" style={{ marginTop: 14, letterSpacing: -0.6 }}>{A().titulo}</Txt>
          <Txt v="note" c={c.tx2} style={{ marginTop: 10 }}>{A().subtitulo}</Txt>

          <Txt v="h2" style={{ marginTop: 32 }}>{A().comoFunciona}</Txt>
          <View style={{ marginTop: 18 }}>
            {A().passos.map((p, i, todos) => (
              <Passo key={p.titulo} n={i + 1} titulo={p.titulo} texto={p.texto} ultimo={i === todos.length - 1} />
            ))}
          </View>
        </View>
      </Rolagem>

      {/* ---- o pé ----
          FIXO E OPACO, como o do cadastro: a ação da tela é uma só, e ela
          não pode depender de rolar até o último passo. */}
      <View style={{
        paddingHorizontal: 20, paddingTop: 14,
        paddingBottom: insets.bottom + 16,
        backgroundColor: c.bg,
        borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: c.line,
      }}>
        <Botao pilula label={A().conhecer} onPress={conhecer} />
        {/* A porta de quem já chegou pela clínica: o código é o terceiro
            passo, e quem já o tem não precisa passar pela vitrine. */}
        <Pressable
          onPress={() => router.push('/parceiros' as any)}
          style={({ pressed }) => [{ alignItems: 'center', paddingTop: 14, paddingBottom: 2, opacity: pressed ? 0.6 : 1 }]}
        >
          <Txt v="label" c={c.accent}>{T.rede.jaTenhoCodigo}</Txt>
        </Pressable>
      </View>

      <BarraQueColapsa titulo={T.rede.titulo} passou={passou} repouso="branco" />
    </View>
  );
}

/* ------------------------------------------------------------------
   UM PASSO — o número, o fio até o próximo, o título e a frase

   ⚠️ O FIO É O QUE FAZ QUATRO LINHAS LEREM COMO UM CAMINHO. Sem ele são
   quatro vantagens numa lista, e a ordem — escolher antes de marcar,
   marcar antes do código — é a informação principal da tela.
------------------------------------------------------------------ */
function Passo({ n, titulo, texto, ultimo }: { n: number; titulo: string; texto: string; ultimo: boolean }) {
  const { c } = useTheme();
  return (
    <Row gap={14} style={{ alignItems: 'stretch' }}>
      <View style={{ width: 30, alignItems: 'center' }}>
        <View style={{
          width: 30, height: 30, borderRadius: 15,
          backgroundColor: c.accentWeak, alignItems: 'center', justifyContent: 'center',
        }}>
          <Txt v="label" c={c.accent} style={{ fontFamily: font.bodyMed }}>{n}</Txt>
        </View>
        {ultimo ? null : (
          <View style={{ flex: 1, width: 2, borderRadius: 1, backgroundColor: c.line, marginVertical: 6 }} />
        )}
      </View>
      <View style={{ flex: 1, paddingTop: 4, paddingBottom: ultimo ? 0 : 22 }}>
        <Txt v="bodyMed">{titulo}</Txt>
        <Txt v="caption" c={c.tx2} style={{ marginTop: 3, lineHeight: 20 }}>{texto}</Txt>
      </View>
    </Row>
  );
}
