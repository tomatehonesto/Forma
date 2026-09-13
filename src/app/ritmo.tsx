import React from 'react';
import { View } from 'react-native';
import { useRouter } from 'expo-router';
import { useStore } from '../logic/store';
import { weekGrid, journeySummary } from '../logic/derive';
import { CADENCE_DAYS } from '../logic/meds';
import { DAY } from '../logic/time';
import { SheetScreen } from '../ui/kit';
import { Cartao, Linha, Aviso, Botao } from '../ui/internas';

/* ============================================================
   COMO LEMOS O SEU RITMO

   A etiqueta do topo da Jornada ("Em ritmo saudável") é a frase mais
   arriscada do app: ela emite um juízo, e quem a lê numa semana ruim
   precisa poder conferir de onde ela saiu.

   Este sheet abre a conta. E o mais importante que ele diz é o que a
   etiqueta NÃO olha: velocidade de perda de peso. Ela mede constância do
   tratamento — aplicações em dia, intervalo entre doses, sintomas sob
   controle. Uma semana de −0,1 kg não a derruba, e é isso que o aviso no
   pé afirma, sem rodeio: não existe versão dela que diga que a semana foi
   ruim.
   ============================================================ */

export default function Ritmo() {
  const S = useStore((s) => s.S);
  const router = useRouter();

  const grade = weekGrid(S, 0);
  const vividas = grade.filter((g) => !g.futura).length;
  const aplicadas = grade.filter((g) => !g.futura && g.aplicou).length;
  const r = journeySummary(S);

  /* Maior intervalo entre duas aplicações seguidas contra a cadência do
     medicamento. Um atraso de um dia não é notícia; três semanas são. */
  const injs = (S.injections as any[]).slice().sort((a, b) => a.t - b.t);
  const cad = CADENCE_DAYS(S.profile.med);
  let maior = cad;
  for (let i = 1; i < injs.length; i++) maior = Math.max(maior, Math.round((injs[i].t - injs[i - 1].t) / DAY));
  const pontual = maior <= cad + 2;

  const recentes = (S.checkins as any[]).slice(-14);
  const pico = recentes.reduce((m, c) => Math.max(m, c.nausea || 0, c.constip || 0, c.refluxo || 0), 0);
  const sintomas = pico <= 2 ? 'Leves' : pico <= 5 ? 'Leves a moderados' : 'Moderados a fortes';

  return (
    <SheetScreen
      titulo="Como lemos o seu ritmo"
      sub="A etiqueta olha para a constância do tratamento, não para a velocidade da perda de peso."
      onClose={() => router.back()}
    >
      <View style={{ marginTop: 18, gap: 10 }}>
        <Cartao>
          <Linha
            titulo="Aplicações em dia"
            sub={`${aplicadas} de ${vividas} semanas`}
            selo={aplicadas >= vividas - 1 ? 'ok' : 'atenção'}
            seloTom={aplicadas >= vividas - 1 ? 'verde' : 'neutra'}
            seta={false}
          />
          <Linha
            titulo="Intervalo entre doses"
            sub={pontual ? `${cad} dias, sem atrasos longos` : `maior intervalo: ${maior} dias`}
            selo={pontual ? 'ok' : 'irregular'}
            seloTom={pontual ? 'verde' : 'neutra'}
            seta={false}
          />
          <Linha
            titulo="Sintomas relatados"
            sub={sintomas}
            selo={pico <= 5 ? 'estável' : 'em alta'}
            seloTom="neutra"
            seta={false}
          />
        </Cartao>

        <Aviso
          titulo="Uma semana diferente não muda a etiqueta"
          texto={`Ela não sobe nem desce por quanto você perdeu, e não existe versão dela que diga que a semana foi ruim. Hoje ela lê “${r.verdict.label.toLowerCase()}”.`}
        />

        <Botao label="Entendi" tom="fantasma" onPress={() => router.back()} />
      </View>
    </SheetScreen>
  );
}
