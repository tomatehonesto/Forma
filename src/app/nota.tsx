import React, { useState } from 'react';
import { View } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useStore } from '../logic/store';
import { notas } from '../logic/derive';
import { MO_LONG, now } from '../logic/time';
import { SheetScreen } from '../ui/kit';
import { Campo, Texto, Botao } from '../ui/internas';

/* ============================================================
   UMA NOTA

   O mesmo sheet escreve e edita. Quando chega sem parâmetro é uma nota
   nova; com `t`, é a nota daquele instante.

   O botão "Já conversei isso" existe aqui, e não como um toque rápido na
   lista, por um motivo: marcar como conversada tira a nota da pauta, e
   isso é o tipo de coisa que a pessoa faz sem querer ao rolar a tela no
   ônibus. Dentro do sheet, o gesto é deliberado.
   ============================================================ */

const dataLonga = (t: number) => { const d = new Date(t); return `${d.getDate()} de ${MO_LONG[d.getMonth()]}`; };

export default function Nota() {
  const S = useStore((s) => s.S);
  const update = useStore((s) => s.update);
  const router = useRouter();
  const { t } = useLocalSearchParams<{ t?: string }>();

  const quando = t ? Number(t) : null;
  const existente = quando ? notas(S).find((n) => n.t === quando) : null;
  const [texto, setTexto] = useState(existente?.text ?? '');

  const consulta = new Date(S.consult.t);

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
      titulo="Nota para a consulta"
      sub={`Fica guardada até a consulta de ${dataLonga(+consulta)}.`}
      onClose={() => router.back()}
    >
      <View style={{ marginTop: 18, gap: 10 }}>
        <Campo ajuda="Só entra no relatório se você marcar as notas na hora de exportar.">
          <Texto
            valor={texto}
            onChange={setTexto}
            placeholder="O que você quer lembrar de falar?"
            linhas={4}
          />
        </Campo>

        <Botao label="Guardar nota" onPress={guardar} />

        {existente ? (
          <>
            <Botao
              label={existente.done ? 'Voltar para a pauta' : 'Já conversei isso'}
              tom="fantasma"
              onPress={marcar}
            />
            <Botao label="Apagar" tom="perigo" onPress={apagar} />
          </>
        ) : null}
      </View>
    </SheetScreen>
  );
}
