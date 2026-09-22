import React from 'react';
import { useRouter } from 'expo-router';
import { useStore } from '../logic/store';
import { RESTRICOES } from '../logic/restricoes';
import { MO_LONG, nf, kgTxt as kg, dataComAno } from '../logic/time';
import { M, cadenciaCurta, idadeDe, temDose, ATIVIDADES, MOTIVOS, emTratamento } from '../logic/derive';
import { Txt } from '../ui/kit';
import { TelaInterna, Titulao, Bloco, Cartao, Linha } from '../ui/internas';
import { useTheme } from '../ui/useTheme';
import { pesoTxt, alturaTxt } from '../logic/medidas';
import { T } from '../textos';

/* ⚠️ É FUNÇÃO, e não constante de módulo: ela lê o catálogo, e constante
   de módulo congela o idioma no import. */
const K = () => T.cadastro.telaDados;

/* ============================================================
   SEUS DADOS — o que o cadastro perguntou, e onde se corrige

   Esta lista morava aberta no meio do Perfil. Eram nove linhas de
   configuração entre o retrato e a clínica — todas coisas que se mexem
   uma vez por ano, empurrando para baixo o que a pessoa vem ver naquela
   tela. Aqui elas são o assunto, e lá viraram uma porta.

   O NOME DA TELA É O NOME DA PORTA. Ela se chamava "Minhas informações"
   e era aberta por uma linha chamada "Seus dados" — dois nomes para o
   mesmo lugar fazem a pessoa achar que chegou noutro. É a mesma correção
   que "Histórico completo" recebeu quando abria "Seu tratamento".

   NÃO EXISTE SEGUNDO EDITOR. Cada linha reabre a pergunta original do
   cadastro, com a mesma régua e a mesma validação que escreveram o valor
   da primeira vez — ver o modo de edição em src/app/cadastro.tsx. Uma
   tela de perfil que monta seus próprios campos é como um app passa a
   ter duas regras para o mesmo número.

   NÃO SÃO PREFERÊNCIAS, são as premissas das contas: a idade e o sexo
   entram na equação de energia, o nível de atividade multiplica o gasto,
   a altura faz o IMC, o ritmo faz a previsão, e a restrição filtra o que
   o app sugere. Por isso a frase do alto avisa que mexer aqui refaz
   número em outras telas — e não é ameaça, é o que de fato acontece.

   E O TRATAMENTO GANHOU PORTA. O cadastro pergunta caneta, dose e
   frequência, e nenhuma das três tinha por onde ser corrigida aqui: a
   dose só mudava ao registrar uma aplicação, e a frequência não mudava
   em lugar nenhum do app. Numa terapia em que a dose SOBE por protocolo
   e o intervalo é o que o médico ajusta, faltava justamente o que mais
   muda.
   ============================================================ */

/* ⚠️ OS QUATRO RÓTULOS JÁ EXISTIAM em `cadastro`, que é quem faz a
   pergunta. Esta era a quinta cópia das mesmas palavras — e a única que
   ficava em português nos cinco idiomas, porque a rede de congelamento
   procura constante que LÊ o catálogo, e aqui eram literais soltos. */
const SEXO = (): Record<string, string> => ({
  f: T.cadastro.feminino,
  m: T.cadastro.masculino,
  o: T.cadastro.outro,
  n: T.cadastro.prefiroNaoInformar,
});


export default function Dados() {
  const S = useStore((s) => s.S);
  const { c } = useTheme();
  const router = useRouter();
  const go = (p: string) => () => router.push(p as any);
  const corrige = (passo: string) => () => router.push(`/cadastro?editar=${passo}` as any);

  /* Contada do ano de nascimento, e não guardada: idade guardada
     envelhece errado — o perfil diria 38 anos para sempre. */
  const idade = idadeDe(S);

  /* Onde mora o peso inicial depende de quando a pessoa começou. Quem já
     estava em tratamento respondeu o peso daquela época na tela "Comecei
     em"; quem ainda vai começar não tem essa distinção, e o peso de hoje
     é também o de partida. A linha precisa abrir a tela que escreveu o
     número, e não a régua do peso de hoje, que é outro número. */
  const passoDoPesoInicial = emTratamento(S) ? 'inicio' : 'corpo';

  /* DOSE E FREQUÊNCIA SÓ EXISTEM COM CANETA ESCOLHIDA. Quem respondeu
     "ainda não sei" no cadastro não viu essas duas perguntas — a escada
     de dose é do medicamento —, e oferecer aqui a correção de uma
     resposta que ninguém deu abriria um formulário no vazio. */
  const comDose = temDose(S);
  const med = M(S);

  const atividade = ATIVIDADES().find((x) => x.id === (S.profile as any).atividade)?.titulo ?? T.perfil.naoInformado;
  const motivo = MOTIVOS().find((x) => x.id === (S.profile as any).motivacao)?.titulo ?? T.perfil.naoInformado;
  const restricoes = (((S.profile as any).restricoes ?? []) as string[])
    .map((x) => RESTRICOES().find((y) => y.id === x)?.titulo ?? x)
    .join(', ') || T.perfil.nenhuma;

  return (
    <TelaInterna titulo={K().titulo}>
      <Titulao titulo={K().titulo} lead={K().lead} />

      {/* O TRATAMENTO PRIMEIRO: é o que muda mais, e o que muda mais
          rápido. Numa titulação, a dose sobe a cada poucas semanas. */}
      <Bloco titulo={K().tratamento}>
        <Cartao>
          <Linha ic="syringe" titulo={K().medicamento} sub={med.label} onPress={corrige('medicamento')} />
          {comDose ? (
            <Linha
              ic="dose" titulo={K().dose}
              sub={K().doseSub(nf(S.profile.dose, S.profile.dose % 1 ? 1 : 0), med.unit)}
              onPress={corrige('dose')}
            />
          ) : null}
          {comDose ? (
            <Linha ic="clock" titulo={K().frequencia} sub={cadenciaCurta(S)} onPress={corrige('frequencia')} />
          ) : null}
        </Cartao>
      </Bloco>

      {/* O CORPO E O RITMO: os quatro que entram em conta todo dia. */}
      <Bloco titulo={K().corpoERitmo}>
        <Cartao>
          <Linha ic="ruler" titulo={K().altura} sub={alturaTxt(S, S.profile.height)} onPress={corrige('corpo')} />
          <Linha ic="scale" titulo={K().pesoInicial} sub={pesoTxt(S, S.profile.startWeight)} onPress={corrige(passoDoPesoInicial)} />
          <Linha ic="target" titulo={K().metaDePeso} sub={pesoTxt(S, S.profile.goalWeight)} onPress={corrige('meta')} />
          <Linha
            ic="trend" titulo={K().ritmoEscolhido}
            sub={S.profile.ritmo ? K().porSemana(pesoTxt(S, S.profile.ritmo)) : K().semPesoAPerder}
            onPress={corrige('ritmo')}
          />
        </Cartao>
      </Bloco>

      <Bloco titulo={T.perfil.sobreVoce}>
        <Cartao>
          <Linha ic="user" titulo={K().nome} sub={S.profile.name} onPress={corrige('nome')} />
          <Linha ic="heart" titulo={K().sexo} sub={SEXO()[S.profile.identidade as string] ?? T.perfil.naoInformado} onPress={corrige('identidade')} />
          <Linha
            ic="cal" titulo={K().nascimento}
            sub={S.profile.nascimento
              ? (idade != null
                ? K().nascimentoSub(dataComAno(S.profile.nascimento), idade)
                : dataComAno(S.profile.nascimento))
              : T.perfil.naoInformado}
            onPress={corrige('nascimento')}
          />
          <Linha ic="dumbbell" titulo={K().atividadeFisica} sub={atividade} onPress={corrige('atividade')} />
          <Linha ic="leaf" titulo={K().restricoesAlimentares} sub={restricoes} onPress={go('/restricao')} />
          <Linha ic="bolt" titulo={K().oQueTeTrouxe} sub={motivo} onPress={corrige('motivacao')} />
        </Cartao>
      </Bloco>

      {/* O peso de hoje não está aqui de propósito: ele não é uma
          resposta de cadastro, é um registro — muda toda semana e tem
          tela própria para isso. Corrigir a altura é raro; subir na
          balança é rotina, e as duas não moram no mesmo lugar. */}
      <Txt v="micro" c={c.tx4} style={{ textAlign: 'center', lineHeight: 17 }}>{K().rodape}</Txt>
    </TelaInterna>
  );
}
