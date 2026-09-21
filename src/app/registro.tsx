import React from 'react';
import { View } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useStore } from '../logic/store';
import { fmtTime, nf, semanaDoTratamento, dataLonga } from '../logic/time';
import { Txt, SheetScreen } from '../ui/kit';
import { Cartao, Linha, Botao } from '../ui/internas';
import { useTheme } from '../ui/useTheme';
import { pesoTxt, compTxt } from '../logic/medidas';

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

/* ⚠️⚠️ SÃO QUATRO CIRCUNFERÊNCIAS, E AQUI SÓ A CINTURA CONTAVA.

   O arquivo testava `marcador === 'cintura'` em quatro lugares — achar o
   ponto, escrever o valor, escolher a tela de correção e apagar. Quadril,
   braço e coxa caíam no outro lado de todos eles e eram tratados como
   PESO.

   O estrago era real e silencioso. A folha de pesagem gravava o peso e a
   medida no mesmo instante, com o mesmo carimbo em milissegundos; então
   uma linha de quadril encontrava a PESAGEM daquele dia, se intitulava
   "78,2 kg", e "Apagar" apagava a pesagem — enquanto o quadril ficava.
   Aconteceu de as duas chamadas caírem no mesmo milissegundo, o que fazia
   o defeito ser intermitente, e não raro.

   Tirar as medidas da folha de pesagem separou os carimbos e desarmou o
   estrago por acidente. Esta constante o desarma de propósito: as quatro
   vêm da mesma fita, moram no mesmo array e se corrigem na mesma tela.

   Gordura e massa magra também moram nesse array, mas não entram aqui:
   elas vêm da bioimpedância, não da mão da pessoa, e por isso o histórico
   delas não oferece esta tela. */
const DA_FITA = ['cintura', 'quadril', 'braco', 'coxa'];

export default function Registro() {
  const S = useStore((s) => s.S);
  const update = useStore((s) => s.update);
  const { c } = useTheme();
  const router = useRouter();
  const { m, t } = useLocalSearchParams<{ m?: string; t?: string }>();

  const quando = Number(t);
  const marcador = m ?? 'peso';
  const d = new Date(quando);
  const semana = semanaDoTratamento(d, S.profile.startT);

  const daFita = DA_FITA.includes(marcador);

  const ponto: any = daFita
    ? (S.measures as any[]).find((x) => x.t === quando)
    : (S.weights as any[]).find((x) => x.t === quando);

  const valor = daFita
    ? (ponto ? compTxt(S, ponto[marcador], 0) : '—')
    : (ponto ? `${pesoTxt(S, ponto.kg)}` : '—');

  const data = dataLonga(d);

  const apagar = () => {
    update((s: any) => {
      if (daFita) s.measures = s.measures.filter((x: any) => x.t !== quando);
      else s.weights = s.weights.filter((x: any) => x.t !== quando);
    });
    router.back();
  };

  return (
    <SheetScreen
      titulo={valor}
      sub={`${data}, manhã · registrado por você`}
      onClose={() => router.back()}
    >
      <View style={{ marginTop: 18, gap: 8 }}>
        <Cartao>
          <Linha titulo="Valor" sub={valor} seta={false} />
          <Linha titulo="Data e hora" sub={`${data}, ${fmtTime(d)}`} seta={false} />
          <Linha titulo="Semana" sub={`Semana ${semana} do tratamento`} seta={false} />
        </Cartao>

        <View style={{ marginTop: 8, gap: 8 }}>
          <Botao
            label="Corrigir registro"
            tom="fantasma"
            onPress={() => { router.back(); router.push((daFita ? '/medir-medidas' : '/medir-peso') as any); }}
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
