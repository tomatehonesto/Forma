import React from 'react';
import { View } from 'react-native';
import { useRouter } from 'expo-router';
import { useStore } from '../logic/store';
import { cicloFases, M } from '../logic/derive';
import { dataComDiaDaSemana } from '../logic/time';
import { FORMAS, formaDe, nomeDaMolecula } from '../logic/formas';
import { T } from '../textos';
import { Txt } from '../ui/kit';
import {
  TelaInterna, Titulao, Bloco, Progresso, Sanfona, SanfonaLinha, Aviso, Botao,
} from '../ui/internas';
import { useTheme } from '../ui/useTheme';

/* ⚠️ É FUNÇÃO, e não constante de módulo: ela lê o catálogo, e constante
   de módulo congela o idioma no import. */
const K = () => T.ciclo.tela;

/* ============================================================
   CICLO DA DOSE

   A tela responde uma pergunta que a pessoa faz por volta do quinto dia:
   "por que a fome voltou?". A resposta é que o ciclo tem forma — sobe,
   estabiliza, cede — e que o ponto em que ela está é o ponto em que isso
   acontece com todo mundo.

   Por isso a tela abre dizendo o DIA, não a fase: "Dia 5 depois da
   aplicação" é o fato que ela pode conferir; "descida" é a interpretação,
   e vem logo abaixo, na linha que já está aberta.

   A versão anterior tinha anel, stepper horizontal, carrossel de sintomas
   e curva de previsão — quatro instrumentos para dizer uma coisa só. Uma
   barra e quatro linhas dizem o mesmo e sobra tela para o conteúdo, que é
   o que a pessoa veio ler.
   ============================================================ */


export default function Ciclo() {
  const S = useStore((s) => s.S);
  const { c } = useTheme();
  const router = useRouter();
  const cic = cicloFases(S);
  const med = M(S);
  const vocab = FORMAS()[formaDe(S)];

  return (
    <TelaInterna
      titulo={K().titulo}
      rodape={(
        <Botao
          label={T.tratamento.telaRegistrarAplicacao.registrar(vocab.acao)}
          onPress={() => router.push('/aplicacao' as any)}
        />
      )}
    >
      <Titulao
        titulo={K().diaDepois(cic.dayIn, vocab.acao)}
        lead={K().lead}
      />

      <Progresso
        label={K().cicloAtual}
        valor={K().diaDeTotal(cic.dayIn, cic.total)}
        pct={cic.pct}
        nota={K().proximaDose(dataComDiaDaSemana(cic.nextDose))}
      />

      <Bloco titulo={K().asQuatroFases}>
        <Sanfona>
          {cic.fases.map((f) => {
            const itens: [string, string][] = [[K().comum, f.comum], [K().ajuda, f.ajuda]];
            if (f.atencao) itens.push([K().atencao, f.atencao]);
            return (
              <SanfonaLinha
                key={f.key}
                titulo={f.titulo}
                sub={f.sub}
                selo={f.selo}
                seloTom={f.estado === 'agora' ? 'verde' : 'neutra'}
                /* a fase de agora já vem aberta: é a única que a pessoa
                   abriu o app para ler, e fazê-la tocar para descobrir isso
                   é cobrar um gesto pelo conteúdo principal da tela */
                aberta={f.estado === 'agora'}
                itens={itens}
              />
            );
          })}
        </Sanfona>
      </Bloco>

      <Aviso
        titulo={K().conteudoGeral}
        texto={K().conteudoGeralTexto}
      />

      {/* Rodapé do conteúdo, não da tela: diz de qual medicamento a leitura
          acima está falando, sem ocupar o topo com isso. */}
      <View style={{ alignItems: 'center', marginTop: -10 }}>
        <Txt v="caption" c={c.tx4}>
          {K().baseadoEm(T.comum.noMeio(nomeDaMolecula(med.mol)))}
        </Txt>
      </View>
    </TelaInterna>
  );
}
