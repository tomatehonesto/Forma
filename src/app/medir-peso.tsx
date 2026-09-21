import React, { useState } from 'react';
import { View } from 'react-native';
import { useRouter } from 'expo-router';
import { useStore } from '../logic/store';
import { curWeight } from '../logic/derive';
import { now, nf, dataComDiaDaSemana, maiuscula } from '../logic/time';
import { Row, SheetScreen } from '../ui/kit';
import { Campo, Selo, Botao, Regua } from '../ui/internas';

/* ============================================================
   A PESAGEM, E SÓ A PESAGEM.

   A captura abre com o último valor já preenchido: de um dia para o outro
   a variação é pequena, então quase sempre são dois toques no ajuste fino
   e não digitar tudo de novo. Quem voltou de uma semana fora digita, que é
   para isso que o número do meio é campo.

   ⚠️⚠️ AS TRÊS CIRCUNFERÊNCIAS SAÍRAM DAQUI, e a razão de fundo é que o
   menu de registrar oferecia "Acabei de me pesar" e "Medi meu corpo" lado
   a lado, sendo que o primeiro também media. Quem queria registrar a
   cintura tinha duas respostas certas e nenhuma pista de qual. Agora cada
   linha faz exatamente o que o nome diz.

   A justificativa antiga era que as medidas são "a resposta ao platô" — a
   balança trava e a cintura continua caindo. A intenção estava certa e a
   entrega nunca existiu: o cartão de platô (logic/etapa) não menciona
   fita, e o único convite do aplicativo que liga fita a platô
   (logic/descobertas) é travado em quem tem no máximo uma medição, ou
   seja, é convite de primeiro uso. Os chips aqui eram disponibilidade
   passiva — úteis só para quem já sabia por que mediria.

   ⚠️ E A SAÍDA CONSERTOU DOIS DEFEITOS DE DADO, que é o que torna esta
   remoção mais do que arrumação de menu:

   · O objeto gravado copiava a medição anterior inteira antes de
     sobrescrever o que a pessoa tinha aberto. Quem subia na balança e
     abria só o chip de cintura plantava, no mesmo dia, um ponto no
     gráfico de coxa e dois de bioimpedância — sem ter passado fita na
     coxa nem pisado numa balança de bioimpedância.

   · O peso e a medida eram gravados no mesmo instante, com o mesmo
     carimbo de tempo em milissegundos. Em tela/registro, quadril e braço
     procuram o ponto pelo carimbo dentro das PESAGENS — e achavam. Tocar
     em "Apagar" num registro de quadril apagava a pesagem daquele dia.
     (A rota certa dessa tela também foi consertada, em app/registro.)

   A medição continua inteira em /medir-medidas, com as quatro
   circunferências.
   ============================================================ */

export default function MedirPeso() {
  const S = useStore((s) => s.S);
  const update = useStore((s) => s.update);
  const router = useRouter();

  const ultimo = curWeight(S);
  const [peso, setPeso] = useState(ultimo);

  const delta = peso - ultimo;
  const hoje = now();

  const salvar = () => {
    update((s: any) => {
      s.weights.push({ t: +now(), kg: peso });
    });
    router.replace('/registro-ok?tipo=peso' as any);
  };

  return (
    <SheetScreen
      titulo="Quanto você está pesando?"
      sub={maiuscula(dataComDiaDaSemana(hoje))}
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
                label={`${delta < 0 ? '−' : '+'}${nf(Math.abs(delta), 1)} kg desde o último`}
                tom={delta < 0 ? 'lima' : 'neutra'}
              />
            </Row>
          ) : null}
        </Campo>

        <Botao label={`Salvar ${nf(peso, 1)} kg`} onPress={salvar} />
      </View>
    </SheetScreen>
  );
}
