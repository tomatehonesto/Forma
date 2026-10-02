import React from 'react';
import { View, type StyleProp, type ViewStyle } from 'react-native';
import Animated, { useAnimatedStyle, type SharedValue } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { useDesenhoDaAbertura, naJanela } from './charts';
import { useTheme } from './useTheme';
import { movimento, radius } from '../theme';

/* ============================================================
   A BARRA QUE ENCHE (02/10/2026)

   A barra de progresso do aplicativo inteiro: uma calha e o que já
   encheu dela. Ela morava desenhada à mão em sete lugares — o Progresso
   das internas, as metas da Jornada e da tela de metas, a energia da
   alimentação, a água, as conquistas e a meta do dia na Home —, cada um
   com a sua calha, a sua altura e a sua conta de largura. Sete cópias do
   mesmo desenho é como começam as divergências; uma peça só é também o
   único jeito de as sete encherem do mesmo modo.

   ⚠️ ENCHE UMA VEZ POR ABERTURA, e não a cada registro: o estado é
   clonado a cada gravação, e a barra que reenchesse a cada copo d'água
   apagaria o que a pessoa acabou de ver subir. O relógio é o dos gráficos
   (`useDesenhoDaAbertura`, em ui/charts), e o "reduzir movimento" faz a
   barra aparecer cheia. Ver docs/superpowers/specs/2026-10-02-motion-design.md,
   fase 2.

   ⚠️ A LARGURA ANIMA, E NÃO UM `scaleX`. Escala achata a ponta redonda
   enquanto a barra cresce, e o degradê da meta da Home sairia espremido;
   com a largura de verdade, a tinta é a mesma em todo quadro, só mais
   curta. Pronto o desenho, a tinta volta a ser o View (ou o degradê) de
   sempre, com a mesma largura em porcentagem que os sete desenhos tinham.

   Cheia além de 100, ela para na borda: a calha recortava o excesso de
   qualquer jeito, e uma tinta mais larga que a calha não mostra nada a
   mais.
   ============================================================ */
export function BarraQueEnche({
  pct, altura, cor, cores, trilho, raio = radius.pill, pontaReta, style,
}: {
  /** quanto encheu, de 0 a 100 */
  pct: number;
  altura: number;
  /** a tinta; por padrão, `c.accent` */
  cor?: string;
  /** degradê da esquerda para a direita no lugar da tinta chapada — a meta do dia na Home */
  cores?: readonly [string, string];
  /** a calha; por padrão, `c.track` */
  trilho?: string;
  /** o raio da calha, e o da tinta junto */
  raio?: number;
  /** a tinta sem raio próprio: quem arredonda é só a calha (as conquistas) */
  pontaReta?: boolean;
  /** a margem de quem chama, por fora da calha */
  style?: StyleProp<ViewStyle>;
}) {
  const { c } = useTheme();
  /* Conta sem meta (zero sobre zero) vira barra vazia, e não "NaN%". */
  const p = Math.max(0, Math.min(100, pct)) || 0;
  const desenho = useDesenhoDaAbertura(movimento.grafico);
  const raioDaTinta = pontaReta ? 0 : raio;
  const tinta = cor ?? c.accent;

  return (
    <View style={[{ height: altura, borderRadius: raio, backgroundColor: trilho ?? c.track, overflow: 'hidden' }, style]}>
      {desenho.desenhado ? (
        cores ? (
          <LinearGradient
            colors={cores} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
            style={{ width: `${p}%`, height: '100%', borderRadius: raioDaTinta }}
          />
        ) : (
          <View style={{ width: `${p}%`, height: '100%', borderRadius: raioDaTinta, backgroundColor: tinta }} />
        )
      ) : (
        <Enchendo t={desenho.t} total={desenho.total} p={p} raio={raioDaTinta} cor={cores ? undefined : tinta}>
          {/* O degradê ocupa a tinta inteira e é recortado por ela: no fim
              ele é o mesmo da troca, e no meio do caminho ele aperta junto. */}
          {cores ? (
            <LinearGradient colors={cores} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={{ flex: 1 }} />
          ) : null}
        </Enchendo>
      )}
    </View>
  );
}

function Enchendo({ t, total, p, raio, cor, children }: {
  t: SharedValue<number>; total: number; p: number; raio: number; cor?: string; children?: React.ReactNode;
}) {
  const enche = useAnimatedStyle(() => ({
    width: `${p * naJanela(t.value, total, 0, total)}%` as `${number}%`,
  }));
  return (
    <Animated.View style={[{ height: '100%', borderRadius: raio, backgroundColor: cor, overflow: 'hidden' }, enche]}>
      {children}
    </Animated.View>
  );
}
