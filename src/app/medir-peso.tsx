import React, { useState } from 'react';
import { View } from 'react-native';
import { useRouter } from 'expo-router';
import { useStore } from '../logic/store';
import { curWeight, latestMeasure } from '../logic/derive';
import { DOW_PT, MO_LONG, now, nf } from '../logic/time';
import { Txt, Row, SheetScreen } from '../ui/kit';
import { Campo, Opcoes, Opc, Selo, Botao, Regua } from '../ui/internas';
import { useTheme } from '../ui/useTheme';

/* ============================================================
   PESO E MEDIDAS

   A captura abre com o último valor já preenchido: de um dia para o outro
   a variação é pequena, então quase sempre são dois toques no ajuste fino
   e não digitar tudo de novo. Quem voltou de uma semana fora digita, que é
   para isso que o número do meio é campo.

   As medidas entram no mesmo sheet, e opcionais. São a resposta ao platô —
   a balança trava e a cintura continua caindo —, mas exigi-las junto do
   peso transformaria a pesagem de dez segundos numa sessão com fita
   métrica, e o resultado disso é não pesar. Por isso a ajuda diz, em voz
   alta, que pesar sozinho também é uma escolha válida.

   A medição completa, com as quatro circunferências, continua em
   /medir-medidas. Aqui ficam as três que mudam entre uma sessão e outra.
   ============================================================ */

/* As faixas são as mesmas de /medir-medidas: é o mesmo corpo e a mesma
   fita, e duas telas com limites diferentes para a cintura da mesma pessoa
   é uma delas errada. */
const MEDIDAS: [string, string, number, number, number][] = [
  ['cintura', 'Cintura', 50, 180, 90],
  ['quadril', 'Quadril', 60, 190, 100],
  ['braco', 'Braço', 15, 70, 32],
];

const n1 = (x: number) => nf(x, 1).replace('.', ',');

export default function MedirPeso() {
  const S = useStore((s) => s.S);
  const update = useStore((s) => s.update);
  const { c } = useTheme();
  const router = useRouter();

  const ultimo = curWeight(S);
  const ultima: any = latestMeasure(S);

  const [peso, setPeso] = useState(ultimo);
  const [abertas, setAbertas] = useState<string[]>([]);
  const [tocadas, setTocadas] = useState<string[]>([]);
  const [medidas, setMedidas] = useState<Record<string, number>>(
    Object.fromEntries(MEDIDAS.map(([k, , , , padrao]) => [k, ultima?.[k] || padrao])),
  );


  const alterna = (k: string) =>
    setAbertas((a) => (a.includes(k) ? a.filter((x) => x !== k) : [...a, k]));
  const mexer = (k: string, v: number) => {
    setMedidas((m) => ({ ...m, [k]: v }));
    setTocadas((t) => (t.includes(k) ? t : [...t, k]));
  };

  const delta = peso - ultimo;
  const hoje = now();
  const dow = DOW_PT[hoje.getDay()];

  const salvar = () => {
    update((s: any) => {
      s.weights.push({ t: +now(), kg: peso });
      /* Só grava medida se alguma foi aberta. Um registro com os valores
         da última sessão repetidos entraria no gráfico como se a pessoa
         tivesse medido de novo e não mudado nada — que é uma afirmação
         diferente de não ter medido. */
      /* ⚠️ E QUEM NUNCA MEDIU PRECISA TER MEXIDO.

         Abrir o chip é a afirmação, e isso continua valendo — mas só
         afirma um número que existe. Sem medição anterior, a régua abre
         num ponto de partida escolhido pelo controle, não pela pessoa: o
         chip aberto e intocado gravaria noventa centímetros de cintura
         que ninguém passou a fita para saber. */
      const gravaveis = abertas.filter((k) => ultima || tocadas.includes(k));
      if (gravaveis.length) {
        const base = ultima || { cintura: 0, quadril: 0, braco: 0, coxa: 0, gordura: 0, musculo: 0 };
        s.measures.push({
          ...base,
          t: +now(),
          ...Object.fromEntries(gravaveis.map((k) => [k, medidas[k]])),
        });
      }
    });
    router.replace('/registro-ok?tipo=peso' as any);
  };

  return (
    <SheetScreen
      titulo="Peso e medidas"
      sub={`${dow.charAt(0).toUpperCase()}${dow.slice(1)}, ${hoje.getDate()} de ${MO_LONG[hoje.getMonth()]}`}
      onClose={() => router.back()}
    >
      <View style={{ marginTop: 18, gap: 10 }}>
        {/* ⚠️ A RÉGUA, E ERA O <Stepper>.

            Mais e menos servem para corrigir um passo; não servem para
            dizer quanto alguém pesa. E é a MESMA pergunta que o cadastro
            faz na primeira abertura do aplicativo, onde ela sempre teve
            régua — a pessoa aprendia a mexer no próprio peso de um jeito
            no primeiro dia e de outro em todos os seguintes.

            A faixa é mais larga que a do cadastro (30 a 250, e não 40 a
            180): ali é o cadastro sugerindo uma faixa plausível para quem
            está começando; aqui é o registro de um número que já existe, e
            um limite apertado viraria um valor que não entra. */}
        <Campo rotulo="Peso">
          <Regua
            min={30} max={250} passo={0.1} tracoCada={0.5} casas={1} esp={5} salto={0.1}
            valor={peso} unidade="kg" onEscolhe={setPeso}
          />
          {Math.abs(delta) >= 0.05 ? (
            <Row style={{ justifyContent: 'center' }}>
              <Selo
                label={`${delta < 0 ? '−' : '+'}${n1(Math.abs(delta))} kg desde o último`}
                tom={delta < 0 ? 'lima' : 'neutra'}
              />
            </Row>
          ) : null}
        </Campo>

        <Campo
          rotulo="Medidas · opcional"
          ajuda="Nenhuma medida é obrigatória. Pesar quando você quiser também é uma escolha válida."
        >
          <Opcoes>
            {MEDIDAS.map(([k, label]) => (
              <Opc key={k} label={label} on={abertas.includes(k)} onPress={() => alterna(k)} />
            ))}
          </Opcoes>

          {/* ⚠️ RÉGUA AQUI TAMBÉM, e o peso logo acima já tinha uma.

              Três controles para três circunferências, no mesmo sheet em
              que o peso se arrasta, é a mesma inconsistência que acabou de
              sair dali — só que a dois centímetros de distância. E elas
              abrem uma de cada vez, por escolha da pessoa: a altura extra
              da régua só chega para quem pediu aquela medida. */}
          {abertas.map((k) => {
            const campo = MEDIDAS.find(([id]) => id === k)!;
            return (
              <View key={k} style={{ gap: 10 }}>
                {/* O RÓTULO SÓ APARECE QUANDO HÁ MAIS DE UMA RÉGUA ABERTA.

                    Com uma só, o chip aceso logo acima já diz qual é — e
                    "Cintura", "Cintura", "96,0" em três linhas seguidas é a
                    tela repetindo a palavra que a pessoa acabou de tocar.
                    Com duas ou mais ele deixa de ser eco: passa a ser o que
                    diz qual régua é qual. */}
                {abertas.length > 1 ? <Txt v="caption" c={c.tx3}>{campo[1]}</Txt> : null}
                <Regua
                  min={campo[2]} max={campo[3]} passo={0.5} tracoCada={1} casas={1} esp={9} salto={0.5}
                  valor={medidas[k]} unidade="cm" onEscolhe={(v) => mexer(k, v)}
                />
              </View>
            );
          })}
        </Campo>

        <Botao label={`Salvar ${n1(peso)} kg`} onPress={salvar} />
      </View>
    </SheetScreen>
  );
}
