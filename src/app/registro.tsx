import React from 'react';
import { View } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useStore } from '../logic/store';
import { MO_LONG, diffDays, fmtTime, nf } from '../logic/time';
import { Txt, SheetScreen } from '../ui/kit';
import { Cartao, Linha, Botao } from '../ui/internas';
import { useTheme } from '../ui/useTheme';

/* ============================================================
   UM REGISTRO

   O sheet que abre quando a pessoa toca numa linha do histórico de um
   marcador. Ele existe por um motivo só: deixar corrigir e apagar.

   Por isso a ordem é valor, data, semana — e não um resumo bonito. São os
   três campos que ela precisa conferir antes de decidir se aquele número
   está errado. E a frase embaixo do botão de apagar diz a consequência
   real: o registro sai do gráfico E do relatório do médico. Avisar depois
   do toque seria tarde.
   ============================================================ */

export default function Registro() {
  const S = useStore((s) => s.S);
  const update = useStore((s) => s.update);
  const { c } = useTheme();
  const router = useRouter();
  const { m, t } = useLocalSearchParams<{ m?: string; t?: string }>();

  const quando = Number(t);
  const marcador = m ?? 'peso';
  const d = new Date(quando);
  const semana = Math.max(1, Math.ceil((diffDays(d, new Date(S.profile.startT)) + 1) / 7));

  const ponto: any = marcador === 'cintura'
    ? (S.measures as any[]).find((x) => x.t === quando)
    : (S.weights as any[]).find((x) => x.t === quando);

  const valor = marcador === 'cintura'
    ? (ponto ? `${ponto.cintura} cm` : '—')
    : (ponto ? `${nf(ponto.kg, 1).replace('.', ',')} kg` : '—');

  const dataLonga = `${d.getDate()} de ${MO_LONG[d.getMonth()]}`;

  const apagar = () => {
    update((s: any) => {
      if (marcador === 'cintura') s.measures = s.measures.filter((x: any) => x.t !== quando);
      else s.weights = s.weights.filter((x: any) => x.t !== quando);
    });
    router.back();
  };

  return (
    <SheetScreen
      titulo={valor}
      sub={`${dataLonga}, manhã · registrado por você`}
      onClose={() => router.back()}
    >
      <View style={{ marginTop: 18, gap: 8 }}>
        <Cartao>
          <Linha titulo="Valor" sub={valor} seta={false} />
          <Linha titulo="Data e hora" sub={`${dataLonga}, ${fmtTime(d)}`} seta={false} />
          <Linha titulo="Semana" sub={`Semana ${semana} do tratamento`} seta={false} />
        </Cartao>

        <View style={{ marginTop: 8, gap: 8 }}>
          <Botao
            label="Corrigir registro"
            tom="fantasma"
            onPress={() => { router.back(); router.push((marcador === 'cintura' ? '/medir-medidas' : '/medir-peso') as any); }}
          />
          <Botao label="Apagar" tom="perigo" onPress={apagar} />
        </View>

        <Txt v="caption" c={c.tx3} style={{ textAlign: 'center', marginTop: 2 }}>
          Apagar tira o registro do gráfico e do relatório do seu médico.
        </Txt>
      </View>
    </SheetScreen>
  );
}
