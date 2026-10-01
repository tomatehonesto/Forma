import { useEffect, useState } from 'react';
import { AppState } from 'react-native';
import { useIsFocused } from 'expo-router';
import { useStore } from '../logic/store';
import { estadoDaLeitura, pedirLeitura, guardarLeitura, type EstadoDaLeitura, type MotivoDaLeitura } from '../logic/leitura';

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

   ⚠️ ERRO É SILÊNCIO NA HOME, como era no card: sem rede, cota cheia ou
   servidor fora, nada aparece nesta abertura. A tela do resumo
   (app/leitura, e o Insights leva a ela) é que mostra o erro e oferece
   tentar de novo.

   Ver docs/superpowers/specs/2026-10-01-leitura-da-semana-design.md.
   ============================================================ */

/* ⚠️ UM PEDIDO POR SEMANA DE CADA VEZ (01/10/2026). A Home e a tela do
   resumo geram a mesma leitura — quem aceita pelo convite cai direto na
   tela, com a Home atrás —, e dois pedidos ao mesmo tempo gastariam duas
   leituras da cota de duas por dia. O segundo a pedir recebe a promessa
   do primeiro. */
let emAndamento: { semana: number; promessa: Promise<boolean> } | null = null;
/* A semana que falhou, por quê e quando: a Home não insiste enquanto a
   falha vale; a tela diz o motivo e pode tentar de novo, a pedido da
   pessoa.

   ⚠️ A FALHA EXPIRA (achado da revisão de 01/10/2026). Ela vivia no
   módulo até o processo morrer — e um iPhone só suspende o app, então
   uma falha sem rede na terça segurava a leitura a semana inteira, e o
   "amanhã eu leio a sua semana" do limite nunca se cumpria. Agora:

     · LIMITE vale até virar o dia DA COTA, que é o UTC (consumir_cota_da_ia,
       como diaUtc em logic/conversa): no Brasil ela volta às 21h, e não à
       meia-noite;
     · POUCO REGISTRO vale até virar o dia de quem usa: um registro a mais
       (que a pessoa pode lançar no dia certo, depois) só muda a semana com
       tempo;
     · os outros — sem rede, sem conta, servidor fora — valem 2 minutos:
       o bastante para a Home não repetir o pedido a cada troca de aba, e
       pouco para quem acabou de reconectar ou entrar na conta. */
const falhas = new Map<number, { motivo: MotivoDaLeitura; em: number }>();
const MINUTOS_DA_FALHA_PASSAGEIRA = 2;
const mesmoDiaLocal = (a: number, b: number) => new Date(a).toDateString() === new Date(b).toDateString();
const mesmoDiaUtc = (a: number, b: number) => new Date(a).toISOString().slice(0, 10) === new Date(b).toISOString().slice(0, 10);
const valeAinda = (f: { motivo: MotivoDaLeitura; em: number }, agora: number) =>
  f.motivo === 'limite' || f.motivo === 'limite-do-mes' ? mesmoDiaUtc(f.em, agora)
    : f.motivo === 'pouco-registro' ? mesmoDiaLocal(f.em, agora)
      : agora - f.em < MINUTOS_DA_FALHA_PASSAGEIRA * 60_000;

export function gerarLeituraDaSemana(semana: number): Promise<boolean> {
  if (emAndamento?.semana === semana) return emAndamento.promessa;
  const promessa = pedirLeitura(useStore.getState().S)
    .then((r) => {
      if (r.ok) {
        useStore.getState().update((s: any) => { guardarLeitura(s, r.leitura); });
        falhas.delete(semana);
        return true;
      }
      falhas.set(semana, { motivo: r.motivo, em: Date.now() });
      return false;
    })
    .catch(() => { falhas.set(semana, { motivo: 'sem-rede', em: Date.now() }); return false; })
    .finally(() => { emAndamento = null; });
  emAndamento = { semana, promessa };
  return promessa;
}

/** O motivo da falha da semana, enquanto ela vale; depois, nada. */
export function falhouNaSemana(semana: number): MotivoDaLeitura | null {
  const f = falhas.get(semana);
  if (!f) return null;
  if (valeAinda(f, Date.now())) return f.motivo;
  falhas.delete(semana);
  return null;
}

export function useLeituraDaSemana(): EstadoDaLeitura {
  const focada = useIsFocused();
  const S = useStore((s) => s.S);
  const estado = estadoDaLeitura(S);
  const semana = estado.tipo === 'gerar' ? estado.semana : null;

  /* A volta do app ao primeiro plano conta como abrir a Home de novo: é
     ali que uma falha vencida (a rede voltou, o dia virou) é tentada. */
  const [voltas, setVoltas] = useState(0);
  useEffect(() => {
    const sub = AppState.addEventListener('change', (e) => { if (e === 'active') setVoltas((v) => v + 1); });
    return () => sub.remove();
  }, []);

  useEffect(() => {
    if (!focada || semana == null || falhouNaSemana(semana)) return;
    gerarLeituraDaSemana(semana);
  }, [focada, semana, voltas]);

  return estado;
}
