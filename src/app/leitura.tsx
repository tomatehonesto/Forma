import React, { useState } from 'react';
import { View, Pressable } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useStore } from '../logic/store';
import { leituraDaSemana, leiturasGuardadas, registrarRecusaDaLeitura } from '../logic/leitura';
import { fmtDate, DAY } from '../logic/time';
import { Txt, RichDoc } from '../ui/kit';
import { TelaInterna, Titulao, Bloco, Botao } from '../ui/internas';
import { useTheme } from '../ui/useTheme';
import { T } from '../textos';

const K = () => T.descobertas.semana;

/* ============================================================
   A LEITURA DA SEMANA, inteira

   As três partes que o servidor escreveu (servidor/api/leitura) — a
   semana, a descoberta e o teste —, e o botão "Conversar sobre isso",
   que abre a Morphi Intelligence numa conversa nova com a leitura como
   a primeira mensagem dela (app/companion, `?leitura=`).

   E o "desligar": é aqui que a pessoa diz que não quer mais. Ele vale 4
   semanas, como o "agora não" do card (logic/leitura).
   ============================================================ */
export default function LeituraDaSemana() {
  const { c } = useTheme();
  const router = useRouter();
  const S = useStore((s) => s.S);
  const update = useStore((s) => s.update);
  const { semana } = useLocalSearchParams<{ semana?: string }>();
  const l = (semana ? leituraDaSemana(S, Number(semana)) : null) ?? leiturasGuardadas(S).slice(-1)[0] ?? null;
  const [desligada, setDesligada] = useState(false);

  if (!l) {
    return <TelaInterna titulo={K().telaTitulo}><Txt v="body" c={c.tx3}>{K().poucoTexto}</Txt></TelaInterna>;
  }

  return (
    <TelaInterna
      titulo={K().telaTitulo}
      sub={`${fmtDate(new Date(l.semana))} – ${fmtDate(new Date(l.semana + 6 * DAY))}`}
      rodape={<Botao label={K().conversar} onPress={() => router.push(`/companion?leitura=${l.semana}` as any)} />}
    >
      <Titulao titulo={K().telaTitulo} />
      <Bloco titulo={K().parteSemana}><RichDoc text={l.texto.semana} /></Bloco>
      <Bloco titulo={K().parteDescoberta}><RichDoc text={l.texto.descoberta} /></Bloco>
      <Bloco titulo={K().parteTeste}><RichDoc text={l.texto.teste} /></Bloco>
      <View style={{ alignItems: 'center', marginTop: 8 }}>
        {desligada ? (
          <Txt v="caption" c={c.tx3} style={{ textAlign: 'center' }}>{K().desligada}</Txt>
        ) : (
          <Pressable hitSlop={8} onPress={() => { update((s: any) => { registrarRecusaDaLeitura(s); }); setDesligada(true); }}>
            <Txt v="caption" c={c.tx3} style={{ textDecorationLine: 'underline' }}>{K().desligar}</Txt>
          </Pressable>
        )}
      </View>
    </TelaInterna>
  );
}
