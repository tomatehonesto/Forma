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

const SEXO: Record<string, string> = {
  f: 'Feminino', m: 'Masculino', o: 'Outro', n: 'Prefiro não informar',
};


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

  const atividade = ATIVIDADES().find((x) => x.id === (S.profile as any).atividade)?.titulo ?? 'Não informado';
  const motivo = MOTIVOS().find((x) => x.id === (S.profile as any).motivacao)?.titulo ?? 'Não informado';
  const restricoes = (((S.profile as any).restricoes ?? []) as string[])
    .map((x) => RESTRICOES().find((y) => y.id === x)?.titulo ?? x)
    .join(', ') || 'Nenhuma';

  return (
    <TelaInterna titulo="Seus dados">
      <Titulao
        titulo="Seus dados"
        lead="São as respostas do seu cadastro, e é delas que saem o seu IMC, as suas metas do dia e a previsão do plano. Mexer aqui refaz esses números."
      />

      {/* O TRATAMENTO PRIMEIRO: é o que muda mais, e o que muda mais
          rápido. Numa titulação, a dose sobe a cada poucas semanas. */}
      <Bloco titulo="Tratamento">
        <Cartao>
          <Linha ic="syringe" titulo="Medicamento" sub={med.label} onPress={corrige('medicamento')} />
          {comDose ? (
            <Linha
              ic="dose" titulo="Dose"
              sub={`${nf(S.profile.dose, S.profile.dose % 1 ? 1 : 0)} ${med.unit}`}
              onPress={corrige('dose')}
            />
          ) : null}
          {comDose ? (
            <Linha ic="clock" titulo="Frequência" sub={cadenciaCurta(S)} onPress={corrige('frequencia')} />
          ) : null}
        </Cartao>
      </Bloco>

      {/* O CORPO E O RITMO: os quatro que entram em conta todo dia. */}
      <Bloco titulo="Corpo e ritmo">
        <Cartao>
          <Linha ic="ruler" titulo="Altura" sub={alturaTxt(S, S.profile.height)} onPress={corrige('corpo')} />
          <Linha ic="scale" titulo="Peso inicial" sub={`${pesoTxt(S, S.profile.startWeight)}`} onPress={corrige(passoDoPesoInicial)} />
          <Linha ic="target" titulo="Meta de peso" sub={`${pesoTxt(S, S.profile.goalWeight)}`} onPress={corrige('meta')} />
          <Linha
            ic="trend" titulo="Ritmo escolhido"
            sub={S.profile.ritmo ? `${pesoTxt(S, S.profile.ritmo)} por semana` : 'Sem peso a perder'}
            onPress={corrige('ritmo')}
          />
        </Cartao>
      </Bloco>

      <Bloco titulo="Sobre você">
        <Cartao>
          <Linha ic="user" titulo="Nome" sub={S.profile.name} onPress={corrige('nome')} />
          <Linha ic="heart" titulo="Sexo" sub={SEXO[S.profile.identidade as string] ?? 'Não informado'} onPress={corrige('identidade')} />
          <Linha
            ic="cal" titulo="Nascimento"
            sub={S.profile.nascimento
              ? `${dataComAno(S.profile.nascimento)}${idade != null ? ` · ${idade} anos` : ''}`
              : 'Não informado'}
            onPress={corrige('nascimento')}
          />
          <Linha ic="dumbbell" titulo="Atividade física" sub={atividade} onPress={corrige('atividade')} />
          <Linha ic="leaf" titulo="Restrições alimentares" sub={restricoes} onPress={go('/restricao')} />
          <Linha ic="bolt" titulo="O que te trouxe" sub={motivo} onPress={corrige('motivacao')} />
        </Cartao>
      </Bloco>

      {/* O peso de hoje não está aqui de propósito: ele não é uma
          resposta de cadastro, é um registro — muda toda semana e tem
          tela própria para isso. Corrigir a altura é raro; subir na
          balança é rotina, e as duas não moram no mesmo lugar. */}
      <Txt v="micro" c={c.tx4} style={{ textAlign: 'center', lineHeight: 17 }}>
        Para registrar uma pesagem nova, use o botão de registrar.
      </Txt>
    </TelaInterna>
  );
}
