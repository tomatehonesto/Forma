import React, { useState } from 'react';
import { View } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useStore } from '../logic/store';
import { notas, temConsulta } from '../logic/derive';
import { now, dataLonga } from '../logic/time';
import { SheetScreen } from '../ui/kit';
import { Campo, Texto, Botao } from '../ui/internas';
import { T } from '../textos';

/* ⚠️ É FUNÇÃO, porque lê o catálogo. Ver src/textos/README. */
const K = () => T.tratamento.telaNotas;

/* ============================================================
   UMA NOTA

   O mesmo sheet escreve e edita. Quando chega sem parâmetro é uma nota
   nova; com `t`, é a nota daquele instante.

   O botão "Já conversei isso" existe aqui, e não como um toque rápido na
   lista, por um motivo: marcar como conversada tira a nota da pauta, e
   isso é o tipo de coisa que a pessoa faz sem querer ao rolar a tela no
   ônibus. Dentro do sheet, o gesto é deliberado.
   ============================================================ */


export default function Nota() {
  const S = useStore((s) => s.S);
  const update = useStore((s) => s.update);
  const router = useRouter();
  const { t } = useLocalSearchParams<{ t?: string }>();

  const quando = t ? Number(t) : null;
  const existente = quando ? notas(S).find((n) => n.t === quando) : null;
  const [texto, setTexto] = useState(existente?.text ?? '');

  /* Sem consulta marcada não há "até quando", e inventar uma data aqui
     seria o app marcando consulta por conta própria. */
  const ate = temConsulta(S) ? dataLonga(S.consult.t) : null;

  const guardar = () => {
    const v = texto.trim();
    if (!v) return;
    update((s: any) => {
      if (quando) s.notes = (s.notes || []).map((n: any) => (n.t === quando ? { ...n, text: v } : n));
      else s.notes = [{ t: +now(), text: v, done: false }, ...(s.notes || [])];
    });
    router.back();
  };

  const marcar = () => {
    update((s: any) => {
      s.notes = (s.notes || []).map((n: any) => (n.t === quando ? { ...n, done: !n.done } : n));
    });
    router.back();
  };

  const apagar = () => {
    update((s: any) => { s.notes = (s.notes || []).filter((n: any) => n.t !== quando); });
    router.back();
  };

  return (
    <SheetScreen
      titulo={K().notaTitulo}
      sub={K().guardadaAte(ate)}
      onClose={() => router.back()}
    >
      <View style={{ marginTop: 18, gap: 10 }}>
        <Campo ajuda={K().soEntraNoRelatorio}>
          <Texto
            valor={texto}
            onChange={setTexto}
            placeholder={K().notaPlaceholder}
            linhas={4}
          />
        </Campo>

        <Botao label={K().guardarNota} onPress={guardar} />

        {existente ? (
          <>
            <Botao
              label={existente.done ? K().voltarParaPauta : K().jaConversei}
              tom="fantasma"
              onPress={marcar}
            />
            <Botao label={K().apagar} tom="perigo" onPress={apagar} />
          </>
        ) : null}
      </View>
    </SheetScreen>
  );
}
