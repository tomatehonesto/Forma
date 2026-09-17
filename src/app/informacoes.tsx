import React from 'react';
import { useRouter } from 'expo-router';
import { useStore } from '../logic/store';
import { RESTRICOES } from '../logic/restricoes';
import { MO_LONG, nf, kgCurto as kg } from '../logic/time';
import { idadeDe, ATIVIDADES, MOTIVOS } from '../logic/derive';
import { Screen, Txt, Row, CircleBtn, ListRow, Grupo } from '../ui/kit';
import { useTheme } from '../ui/useTheme';

/* ============================================================
   MINHAS INFORMAÇÕES — o que o cadastro perguntou, e onde se corrige

   Esta lista morava aberta no meio do Perfil. Eram nove linhas de
   configuração entre o retrato e a clínica — altura, pesos, ritmo, nome,
   sexo, nascimento, atividade, restrições e motivo —, todas coisas que
   se mexem uma vez por ano, empurrando para baixo o que a pessoa vem ver
   naquela tela. Aqui elas são o assunto, e lá viraram uma porta.

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
   ============================================================ */

const SEXO: Record<string, string> = {
  f: 'Feminino', m: 'Masculino', o: 'Outro', n: 'Prefiro não informar',
};

const dataDoPerfil = (t: number) => {
  const d = new Date(t);
  return `${d.getDate()} de ${MO_LONG[d.getMonth()]} de ${d.getFullYear()}`;
};

export default function Informacoes() {
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
  const emTratamento = (S.injections?.length ?? 0) > 0 || !!S.profile.startT;
  const passoDoPesoInicial = emTratamento ? 'inicio' : 'corpo';

  const atividade = ATIVIDADES.find((x) => x.id === (S.profile as any).atividade)?.titulo ?? 'Não informado';
  const motivo = MOTIVOS.find((x) => x.id === (S.profile as any).motivacao)?.titulo ?? 'Não informado';
  const restricoes = (((S.profile as any).restricoes ?? []) as string[])
    .map((x) => RESTRICOES.find((y) => y.id === x)?.titulo ?? x)
    .join(', ') || 'Nenhuma';

  return (
    <Screen>
      <Row style={{ marginTop: 4 }} gap={12}>
        <CircleBtn name="back" onPress={() => router.back()} />
        <Txt v="h1" style={{ flex: 1 }}>Minhas informações</Txt>
      </Row>

      <Txt v="caption" c={c.tx3} style={{ marginTop: 14 }}>
        São as respostas do seu cadastro, e é delas que saem o seu IMC, as
        suas metas do dia e a previsão do plano. Mexer aqui refaz esses
        números.
      </Txt>

      {/* O CORPO E O RITMO primeiro: são os quatro que entram em conta
          todo dia, e os únicos que a pessoa costuma voltar para mudar. */}
      <Grupo title="Corpo e ritmo">
        <ListRow ic="ruler" title="Altura" sub={`${nf(S.profile.height, 2).replace('.', ',')} m`} onPress={corrige('corpo')} />
        <ListRow ic="scale" title="Peso inicial" sub={`${kg(S.profile.startWeight)} kg`} onPress={corrige(passoDoPesoInicial)} />
        <ListRow ic="target" title="Meta de peso" sub={`${kg(S.profile.goalWeight)} kg`} onPress={corrige('meta')} />
        <ListRow
          ic="trend" title="Ritmo escolhido"
          sub={S.profile.ritmo ? `${nf(S.profile.ritmo, 1).replace('.', ',')} kg por semana` : 'Sem peso a perder'}
          onPress={corrige('ritmo')}
        />
      </Grupo>

      <Grupo title="Sobre você">
        <ListRow ic="user" title="Nome" sub={S.profile.name} onPress={corrige('nome')} />
        <ListRow ic="heart" title="Sexo" sub={SEXO[S.profile.identidade as string] ?? 'Não informado'} onPress={corrige('identidade')} />
        <ListRow
          ic="cal" title="Nascimento"
          sub={S.profile.nascimento
            ? `${dataDoPerfil(S.profile.nascimento)}${idade != null ? ` · ${idade} anos` : ''}`
            : 'Não informado'}
          onPress={corrige('nascimento')}
        />
        <ListRow ic="dumbbell" title="Atividade física" sub={atividade} onPress={corrige('atividade')} />
        <ListRow ic="leaf" title="Restrições alimentares" sub={restricoes} onPress={go('/restricao')} />
        <ListRow ic="bolt" title="O que te trouxe" sub={motivo} onPress={corrige('motivacao')} />
      </Grupo>
    </Screen>
  );
}
