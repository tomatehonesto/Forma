import React from 'react';
import { View } from 'react-native';
import { useRouter, Redirect } from 'expo-router';
import { useStore } from '../logic/store';
import { cicloFases, M, doseDiaria } from '../logic/derive';
import { dataComDiaDaSemana } from '../logic/time';
import { FORMAS, formaDe, injetavelDe, nomeDaMolecula } from '../logic/formas';
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
   dose" é o fato que ela pode conferir; "descida" é a interpretação,
   e vem logo abaixo, na linha que já está aberta.

   A versão anterior tinha anel, stepper horizontal, carrossel de sintomas
   e curva de previsão — quatro instrumentos para dizer uma coisa só. Uma
   barra e quatro linhas dizem o mesmo e sobra tela para o conteúdo, que é
   o que a pessoa veio ler.

   ⚠️⚠️ NÃO É TELA DE QUEM TOMA TODO DIA (01/10/2026, parte B1 de
   docs/superpowers/specs/2026-10-01-oral-e-diario-design.md). As quatro
   fases são de um ciclo SEMANAL — sobe, estabiliza, cede até a próxima
   dose —, e com uma dose por dia o remédio fica num nível parecido de um
   dia para o outro: a tela diria todo dia "Dia 1 depois da dose", com a
   subida aberta como "agora" e a descida "em 4 dias", que nunca chega. As
   portas para cá somem para essa pessoa (a fileira e a faixa da Jornada, a
   linha "Ciclo da dose" de /aplicacoes); quem chegar mesmo assim — um
   link antigo, o histórico do navegador — vai para a tela das doses, que
   é o assunto dela.
   ============================================================ */


export default function Ciclo() {
  const S = useStore((s) => s.S);
  const diaria = doseDiaria(S);
  if (diaria) return <Redirect href={'/aplicacoes' as any} />;
  return <CicloSemanal />;
}

function CicloSemanal() {
  const S = useStore((s) => s.S);
  const { c } = useTheme();
  const router = useRouter();
  const cic = cicloFases(S);
  const med = M(S);
  const vocab = FORMAS()[formaDe(S)];
  /* ⚠️ O LOCAL SÓ PARA QUEM INJETA (01/10/2026). A tabela das fases é
     lida em logic/derive sem a forma, e a última dizia "deixar a dose e o
     local da aplicação definidos na véspera" a quem toma comprimido. A
     frase tem par no catálogo, e a escolha é daqui. */
  const injetavel = injetavelDe(S);

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
      {/* ⚠️ SEM CICLO, NEM DIA NEM PRÓXIMA DOSE. Antes da primeira aplicação
          registrada a tela dizia "Dia 1 depois da aplicação" e "Próxima
          dose: hoje" — o recuo da conta escrito como fato. As fases ficam,
          como o que ela vai viver. */}
      <Titulao
        titulo={cic.comCiclo ? K().diaDepois(cic.dayIn, vocab.acao) : T.tratamento.antesDaPrimeiraDose}
        lead={cic.comCiclo ? K().lead : K().leadSemCiclo}
      />

      {cic.comCiclo ? (
        <Progresso
          label={K().cicloAtual}
          valor={K().diaDeTotal(cic.dayIn, cic.total)}
          pct={cic.pct}
          nota={K().proximaDose(dataComDiaDaSemana(cic.nextDose))}
        />
      ) : null}

      <Bloco titulo={K().asQuatroFases}>
        <Sanfona>
          {cic.fases.map((f) => {
            const ajuda = f.key === 'baixo' && !injetavel ? T.ciclo.faseBaixoAjudaSemLocal : f.ajuda;
            const itens: [string, string][] = [[K().comum, f.comum], [K().ajuda, ajuda]];
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
