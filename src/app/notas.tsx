import React, { useState } from 'react';
import { useRouter } from 'expo-router';
import { useStore } from '../logic/store';
import { notas } from '../logic/derive';
import { MO_LONG } from '../logic/time';
import { TelaInterna, Titulao, Chips, Cartao, Linha, Aviso, Botao } from '../ui/internas';

/* ============================================================
   NOTAS PARA A CONSULTA

   O problema que esta tela resolve não é guardar texto — é chegar na
   consulta lembrando do que queria perguntar. Quinze minutos com a médica
   passam rápido, e a pergunta que ficou de fora volta em forma de mais
   três semanas de dúvida.

   Duas listas, não uma com riscado: "a conversar" é a pauta que a pessoa
   leva, e "já conversadas" é histórico. Riscar dentro da mesma lista
   deixaria a pauta mais longa a cada consulta, e o que ela precisa ver no
   dia é uma lista curta do que ainda falta.
   ============================================================ */

const dataLonga = (t: number) => { const d = new Date(t); return `${d.getDate()} de ${MO_LONG[d.getMonth()]}`; };

export default function Notas() {
  const S = useStore((s) => s.S);
  const router = useRouter();
  const [aba, setAba] = useState('abertas');

  const todas = notas(S);
  const abertas = todas.filter((n) => !n.done);
  const feitas = todas.filter((n) => n.done);
  const lista = aba === 'abertas' ? abertas : feitas;

  const consulta = new Date(S.consult.t);

  return (
    <TelaInterna
      titulo="Notas para a consulta"
      iconeAcao="plus"
      onAcao={() => router.push('/nota' as any)}
      rodape={<Botao label="Nova nota" onPress={() => router.push('/nota' as any)} />}
    >
      <Titulao
        titulo="Notas"
        lead={`Guardadas até a consulta de ${dataLonga(+consulta)}. Marque as que você já conversou.`}
      />

      <Chips
        itens={[
          { id: 'abertas', label: 'A conversar', n: abertas.length },
          { id: 'feitas', label: 'Já conversadas', n: feitas.length },
        ]}
        valor={aba}
        onChange={setAba}
      />

      {lista.length ? (
        <Cartao>
          {lista.map((n) => (
            <Linha
              key={n.t}
              titulo={`“${n.text}”`}
              sub={dataLonga(n.t)}
              onPress={() => router.push(`/nota?t=${n.t}` as any)}
            />
          ))}
        </Cartao>
      ) : (
        <Aviso
          ic="pencil"
          titulo={aba === 'abertas' ? 'Nada na pauta ainda' : 'Nenhuma conversada ainda'}
          texto={aba === 'abertas'
            ? 'O que você anotar aqui aparece junto na hora de exportar o histórico para a consulta.'
            : 'Assim que você marcar uma nota como conversada, ela sai da pauta e fica guardada aqui.'}
        />
      )}

      <Aviso
        ic="arrowup"
        titulo="As notas entram no relatório"
        texto="Ao exportar o histórico, você escolhe se as anotações vão junto."
      />
    </TelaInterna>
  );
}
