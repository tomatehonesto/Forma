import { useEffect, useState } from 'react';
import { AccessibilityInfo } from 'react-native';
import { Easing, useReducedMotion } from 'react-native-reanimated';

/* ============================================================
   MENOS MOVIMENTO (02/10/2026)

   Quem pediu ao sistema para reduzir o movimento não ganha entrada em
   cascata, gráfico que se desenha nem esqueleto que pulsa: a tela aparece
   pronta. É uma pergunta que toda peça que anima faz antes, e por isso
   mora num lugar só — ver `movimento`, em src/theme.ts.

   ⚠️ TRÊS FONTES, E POR QUÊ. O `useReducedMotion` do Reanimated responde na
   hora, sem esperar uma promessa — e é isso que impede o primeiro quadro de
   começar a animar para quem pediu que não. Mas ele é o valor de quando o
   aplicativo abriu, e não muda depois (a documentação do Reanimated 4 diz
   isso com essas palavras). Então:

   · a última resposta do sistema fica guardada no módulo (`pedidoAgora`),
     e vale mais que a da abertura assim que existe — quem ligar o pedido
     com o aplicativo aberto não vê a próxima tela chegar em cascata, porque
     a entrada decide no primeiro desenho, antes de qualquer efeito;
   · e cada componente escuta ao vivo, para quem já está na tela parar.

   A guarda do módulo morava na cascata (ui/cascata); subiu para cá para a
   decisão ser uma só em todas as peças.
   ============================================================ */
let pedidoAgora: boolean | null = null;
AccessibilityInfo.isReduceMotionEnabled().then((v) => { pedidoAgora = v; }).catch(() => {});
AccessibilityInfo.addEventListener('reduceMotionChanged', (v) => { pedidoAgora = v; });

/** O pedido do sistema neste instante, quando já se sabe — para quem decide
    fora de um componente. Nulo antes da primeira resposta. */
export const menosMovimentoAgora = (): boolean | null => pedidoAgora;

export function useMenosMovimento(): boolean {
  const naAbertura = useReducedMotion();
  const [menos, setMenos] = useState(() => pedidoAgora ?? naAbertura);
  useEffect(() => {
    let vivo = true;
    AccessibilityInfo.isReduceMotionEnabled().then((v) => { if (vivo) setMenos(v); }).catch(() => {});
    const sub = AccessibilityInfo.addEventListener('reduceMotionChanged', setMenos);
    return () => { vivo = false; sub.remove(); };
  }, []);
  return menos;
}

/** A curva de `movimento.curva` ('saida'), como função do Reanimated:
    sai rápido e assenta. A mesma curva em CSS é `movimento.curvaCss`. */
export const curvaDoMovimento = Easing.out(Easing.cubic);
