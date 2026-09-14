import React from 'react';
import { View } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useStore } from '../logic/store';
import { apagarTreino, ehManual, origemDoTreino, treinoEm } from '../logic/derive';
import { ehForca } from '../logic/modalidades';
import { MO_LONG, DOW_PT, diffDays } from '../logic/time';
import { Txt, SheetScreen } from '../ui/kit';
import { Cartao, Linha, Botao } from '../ui/internas';
import { useTheme } from '../ui/useTheme';

/* ============================================================
   UM TREINO

   A folha que abre ao tocar numa linha do caderno. Ela mostra, e só
   depois oferece as duas ações.

   Antes o toque abria direto o formulário de registro carregado — o que
   é rápido e errado pelo mesmo motivo: a pessoa que toca num treino
   ainda não decidiu mexer nele. Pode estar só conferindo o que foi
   aquele dia. Abrir o formulário já assume a edição e coloca campos
   editáveis na frente de quem veio ler.

   É a mesma forma de /registro, que faz isso para peso e medidas desde
   antes: os dados primeiro, corrigir e apagar depois, e a consequência
   escrita embaixo do apagar em vez de depois do toque.
   ============================================================ */

export default function Treino() {
  const S = useStore((s) => s.S);
  const update = useStore((s) => s.update);
  const { c } = useTheme();
  const router = useRouter();
  const { t, i } = useLocalSearchParams<{ t?: string; i?: string }>();

  const dia = Number(t);
  const idx = Number(i);
  const treino = treinoEm(S, dia, idx);

  const d = new Date(dia);
  const dataLonga = `${DOW_PT[d.getDay()]}, ${d.getDate()} de ${MO_LONG[d.getMonth()]}`;
  const semana = Math.max(1, Math.ceil((diffDays(d, new Date(S.profile.startT)) + 1) / 7));

  const apagar = () => {
    update((s: any) => apagarTreino(s, dia, idx));
    router.back();
  };

  if (!treino) {
    return (
      <SheetScreen titulo="Treino" sub="Não encontrei este registro" onClose={() => router.back()}>
        <Txt v="caption" c={c.tx3} style={{ marginTop: 18 }}>
          Ele pode ter sido apagado em outra tela.
        </Txt>
      </SheetScreen>
    );
  }

  return (
    <SheetScreen
      titulo={treino.tipo}
      sub={`${treino.min} min · ${dataLonga}`}
      onClose={() => router.back()}
    >
      <View style={{ marginTop: 18, gap: 8 }}>
        <Cartao>
          <Linha titulo="Modalidade" sub={treino.tipo} seta={false} />
          <Linha titulo="Duração" sub={`${treino.min} min`} seta={false} />
          {/* Quem registrou. Numa tela cujas duas ações são corrigir e
              apagar, saber se o número foi você que escreveu ou se ele
              chegou do relógio é o que decide se "está errado" é um erro
              de digitação ou o relógio chamando caminhada de corrida. */}
          <Linha
            titulo="Origem"
            sub={ehManual(origemDoTreino(treino))
              ? 'Você — registrado nesta tela'
              : `${origemDoTreino(treino)} — chegou pela integração`}
            seta={false}
          />
          <Linha titulo="Quando" sub={dataLonga} seta={false} />
          <Linha titulo="Semana" sub={`Semana ${semana} do tratamento`} seta={false} />
          {/* A marca de força aparece aqui porque é a única propriedade do
              treino que o app usa para outra coisa — e quem abre para
              conferir merece ver por que aquele dia contou (ou não). */}
          <Linha
            titulo="Conta como força"
            sub={ehForca(treino.tipo)
              ? 'Sim — puxa músculo'
              : 'Não — musculação, pilates e funcional é que contam'}
            seta={false}
          />
        </Cartao>

        <View style={{ marginTop: 8, gap: 8 }}>
          <Botao
            label="Corrigir"
            tom="fantasma"
            onPress={() => { router.back(); router.push(`/medir-exercicio?t=${dia}&i=${idx}` as any); }}
          />
          <Botao label="Apagar" tom="perigo" onPress={apagar} />
        </View>

        <Txt v="caption" c={c.tx3} style={{ textAlign: 'center', marginTop: 2 }}>
          Apagar tira os {treino.min} min do total daquele dia.
        </Txt>
      </View>
    </SheetScreen>
  );
}
