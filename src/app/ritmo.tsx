import React from 'react';
import { View } from 'react-native';
import { useRouter } from 'expo-router';
import { useStore } from '../logic/store';
import { semanasDaGrade, journeySummary, cadenciaDias } from '../logic/derive';
import { DAY } from '../logic/time';
import { SheetScreen } from '../ui/kit';
import { Cartao, Linha, Aviso, Botao } from '../ui/internas';
import { T } from '../textos';

/* ⚠️ É FUNÇÃO, e não constante de módulo: ela lê o catálogo, e constante
   de módulo congela o idioma no import. */
const K = () => T.home.telaRitmo;

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

  const { vividas, aplicadas } = semanasDaGrade(S);
  const r = journeySummary(S);

  /* Maior intervalo entre duas aplicações seguidas contra a cadência do
     medicamento. Um atraso de um dia não é notícia; três semanas são. */
  const injs = (S.injections as any[]).slice().sort((a, b) => a.t - b.t);
  const cad = cadenciaDias(S);
  let maior = cad;
  for (let i = 1; i < injs.length; i++) maior = Math.max(maior, Math.round((injs[i].t - injs[i - 1].t) / DAY));
  const pontual = maior <= cad + 2;

  const recentes = (S.checkins as any[]).slice(-14);
  const pico = recentes.reduce((m, c) => Math.max(m, c.nausea || 0, c.constip || 0, c.diarreia || 0, c.refluxo || 0), 0);
  const sintomas = pico <= 2 ? K().sintomasLeves : pico <= 5 ? K().sintomasModerados : K().sintomasFortes;

  return (
    <SheetScreen
      titulo={K().titulo}
      sub={K().sub}
      onClose={() => router.back()}
    >
      <View style={{ marginTop: 18, gap: 10 }}>
        <Cartao>
          <Linha
            titulo={K().aplicacoes}
            sub={K().aplicacoesSub(aplicadas, vividas)}
            selo={aplicadas >= vividas - 1 ? K().seloOk : K().seloAtencao}
            seloTom={aplicadas >= vividas - 1 ? 'verde' : 'neutra'}
            seta={false}
          />
          <Linha
            titulo={K().intervalo}
            sub={pontual ? K().intervaloEmDia(cad) : K().intervaloMaior(maior)}
            selo={pontual ? K().seloOk : K().seloIrregular}
            seloTom={pontual ? 'verde' : 'neutra'}
            seta={false}
          />
          <Linha
            titulo={K().sintomas}
            sub={sintomas}
            selo={pico <= 5 ? K().seloEstavel : K().seloEmAlta}
            seloTom="neutra"
            seta={false}
          />
        </Cartao>

        <Aviso
          titulo={K().avisoTitulo}
          texto={K().avisoTexto(T.comum.noMeio(r.verdict.label))}
        />

        <Botao label={K().entendi} tom="fantasma" onPress={() => router.back()} />
      </View>
    </SheetScreen>
  );
}
