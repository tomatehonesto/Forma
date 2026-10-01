import { useEffect, useRef, useState } from 'react';
import { useIsFocused } from 'expo-router';
import { useStore } from '../logic/store';
import { estadoDaLeitura, pedirLeitura, guardarLeitura, type EstadoDaLeitura } from '../logic/leitura';

/* ============================================================
   A LEITURA DA SEMANA NA HOME — no carrossel do topo, e não num card

   Era um card próprio no alto da folha da Home, e o dono achou grande
   demais — e ele repetia a semana que o carrossel já mostrava em "A semana
   que passou" (01/10/2026). Agora a leitura vive no carrossel
   (app/(tabs)/index): o convite é um slide, a leitura pronta toma o lugar
   do resumo da semana, e o resto não aparece.

   Este hook é o que sobrou do card: a geração. Na primeira abertura da
   Home na semana, com a Home em foco, ele pede a leitura ao servidor e a
   guarda. Enquanto escreve, não há slide de "lendo" — ele aparece pronto.

   ⚠️ ERRO É SILÊNCIO, como era no card: sem rede, cota cheia ou servidor
   fora, nada aparece nesta abertura e ele tenta de novo na próxima.

   Ver docs/superpowers/specs/2026-10-01-leitura-da-semana-design.md.
   ============================================================ */
export function useLeituraDaSemana(): EstadoDaLeitura {
  const focada = useIsFocused();
  const S = useStore((s) => s.S);
  const update = useStore((s) => s.update);
  const estado = estadoDaLeitura(S);
  const [falhou, setFalhou] = useState(false);
  const pedindo = useRef(false);

  useEffect(() => {
    if (!focada || estado.tipo !== 'gerar' || pedindo.current || falhou) return;
    pedindo.current = true;
    pedirLeitura(useStore.getState().S).then((r) => {
      pedindo.current = false;
      if (r.ok) update((s: any) => { guardarLeitura(s, r.leitura); });
      else setFalhou(true);
    });
  }, [focada, estado.tipo, falhou]);

  return estado;
}
