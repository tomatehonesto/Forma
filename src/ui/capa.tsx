import React from 'react';
import { View, Pressable, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Image } from 'expo-image';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Txt, Row } from './kit';
import { Icon } from './Icon';
import { VidroDegrade } from './vidro';
import { useTheme } from './useTheme';
import { radius } from '../theme';

/* ============================================================
   A CAPA DE UM HÁBITO

   Os três hábitos que se registram todo dia — água, comida, movimento —
   passaram a abrir do mesmo jeito: a matéria do hábito em foto ocupando
   o alto da tela, o nome, quanto de quanto, a proporção em número grande
   e a ação logo ali.

   O QUE ISSO SUBSTITUI. Cada uma dessas telas abria com um titulão sobre
   fundo liso e, logo abaixo, um cartão branco com o número do dia e uma
   barrinha. A capa faz o trabalho dos dois de uma vez — e faz mais um,
   que o cartão não fazia: dá vontade. Uma tigela de atum com ovo diz
   sobre proteína uma coisa que "63 / 90 g" não diz.

   O CARTÃO DO DIA SAI JUNTO, nas telas que tinham um. Mantê-lo seria
   duas versões do mesmo dia a dez centímetros de rolagem uma da outra.

   E O RODAPÉ FIXO TAMBÉM. A ação mora na capa agora; um botão fixo
   embaixo seria a segunda porta para a mesma sala, com a de baixo mais
   chamativa que a principal. O custo é real e é aceito: rolando até o
   caderno, a ação fica para trás.

   O NÚMERO GRANDE É SEMPRE A PROPORÇÃO DO DIA, e nunca a quantidade — a
   quantidade já está escrita por extenso na linha de cima, com a unidade
   e a meta. São as duas resoluções da mesma coisa, que é o que um topo
   faz: o quanto, e o quão longe.

   Em branco translúcido para ficar no plano da imagem. Sólido, ele
   viraria o assunto da tela — e o assunto é a água, o prato, a trilha.
   ============================================================ */
export function CapaDeHabito({ foto, titulo, linha, pct, children }: {
  foto: any;
  titulo: string;
  /** "Hoje: 0,5 de 2,5 L" — a quantidade por extenso, com a meta */
  linha: string;
  /** a proporção do dia, já arredondada */
  pct: number;
  /** os atalhos, no pé da foto */
  children?: React.ReactNode;
}) {
  const { c } = useTheme();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  /* Até onde o vidro desce: a barra de voltar, o título e a linha do
     número. Abaixo disso a foto fica limpa, que é onde o número grande
     mora. */
  const alturaVidro = insets.top + 122;
  const altura = insets.top + 398;

  return (
    <View style={{ height: altura }}>
      <Image
        source={foto}
        style={{ position: 'absolute', left: 0, right: 0, top: 0, bottom: 0 }}
        contentFit="cover"
      />
      {/* A faixa vai além da última linha de texto: a passagem precisa de
          espaço para deixar de ser um corte. */}
      <VidroDegrade altura={alturaVidro + 120} />
      {/* Uma sombra curta e fraca só atrás do texto. O vidro escurece para
          dar MATÉRIA; esta garante a leitura do branco. */}
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

        <Txt v="display" c={c.onHero} style={{ marginTop: 22 }}>{titulo}</Txt>
        <Txt v="note" c={c.onHero2} style={{ marginTop: 2 }}>{linha}</Txt>

        {/* A SOMBRA DIFUSA É O QUE FAZ O NÚMERO FUNCIONAR EM QUALQUER FOTO.

            Translúcido sobre a água ele lia bem: a foto é lisa e escura
            no meio, e o branco tinha onde encostar. Sobre a tigela de
            atum — grão-de-bico claro, ovo amarelo, folha verde, tudo com
            textura — o mesmo branco a 46% sumiu.

            Subir a opacidade resolveria a leitura e estragaria o efeito:
            sólido, o número vira o assunto da tela, e o assunto é o
            prato. A sombra larga e fraca separa o número da imagem sem
            pesar sobre ela, e não precisa saber nada sobre a foto que
            está embaixo. */}
        <View style={{ flex: 1, justifyContent: 'center' }}>
          <Txt
            v="display"
            c="rgba(255,255,255,0.60)"
            style={{
              fontSize: 84, lineHeight: 92, letterSpacing: -2,
              textShadowColor: 'rgba(0,0,0,0.34)', textShadowRadius: 24,
              textShadowOffset: { width: 0, height: 2 },
            }}
          >
            {pct}
            <Txt v="display" c="rgba(255,255,255,0.48)" style={{ fontSize: 40, lineHeight: 92 }}>%</Txt>
          </Txt>
        </View>

        {children ? <Row gap={8}>{children}</Row> : null}
      </View>
    </View>
  );
}

/* UM ATALHO NO PÉ DA CAPA.

   Vidro quando é um entre vários — um pedaço da própria foto desfocado,
   com um fio branco de borda —, sólido quando é a ação principal ou a
   única. O sólido é branco e não azul: sobre foto, o azul da marca some
   em metade das imagens, e o branco funciona em todas. */
export function AtalhoDaCapa({ titulo, sub, cheio, onPress }: {
  titulo: string; sub?: string; cheio?: boolean; onPress: () => void;
}) {
  const { c } = useTheme();
  const corpo = (
    <>
      <Txt v="caption" c={cheio ? '#0B1220' : c.onHero}>{titulo}</Txt>
      {sub ? <Txt v="micro" c={cheio ? 'rgba(11,18,32,0.55)' : c.onHero2}>{sub}</Txt> : null}
    </>
  );

  return (
    <Pressable onPress={onPress} style={({ pressed }) => [{ flex: 1, opacity: pressed ? 0.7 : 1 }]}>
      {cheio ? (
        <View style={{
          backgroundColor: c.onHero, borderRadius: radius.pill,
          alignItems: 'center', paddingVertical: sub ? 10 : 13, gap: 1,
        }}>
          {corpo}
        </View>
      ) : (
        <BlurView
          intensity={36}
          tint="light"
          style={{
            overflow: 'hidden', borderRadius: radius.pill,
            borderWidth: 1, borderColor: 'rgba(255,255,255,0.35)',
            alignItems: 'center', paddingVertical: sub ? 9 : 12, gap: 1,
          }}
        >
          {corpo}
        </BlurView>
      )}
    </Pressable>
  );
}

/* A FOLHA que sobe por cima da foto e leva o resto da tela.

   O fundo é o `bg` de sempre, e não o branco dos cartões: os Blocos e
   Cartões que moram dentro dela precisam do fundo para continuarem
   parecendo cartões. */
export function FolhaDeHabito({ children }: { children: React.ReactNode }) {
  const { c } = useTheme();
  return (
    <View style={{
      backgroundColor: c.bg, marginTop: -26,
      borderTopLeftRadius: radius.xl, borderTopRightRadius: radius.xl,
      paddingHorizontal: 16, paddingTop: 22, gap: 22,
    }}>
      {children}
    </View>
  );
}

/* A rolagem inteira de uma tela de hábito: capa, folha, e a folga de
   baixo que o aparelho pede. */
export function TelaDeHabito({ children }: { children: React.ReactNode }) {
  const { c } = useTheme();
  const insets = useSafeAreaInsets();
  return (
    <View style={{ flex: 1, backgroundColor: c.bg }}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: insets.bottom + 28 }}>
        {children}
      </ScrollView>
    </View>
  );
}
