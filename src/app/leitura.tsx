import React, { useEffect, useMemo, useRef, useState } from 'react';
import { View, Pressable, Animated, StyleSheet } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useStore } from '../logic/store';
import {
  leituraDaSemana, leiturasGuardadas, leituraQueCobre, estadoDaLeitura, leituraLigada, aceitouALeitura,
  registrarRecusaDaLeitura, registrarAceiteDaLeitura, type Leitura, type MotivoDaLeitura,
} from '../logic/leitura';
import { aceitouAIa } from '../logic/aceiteDaIa';
import { semanaLida, noCalendario } from '../logic/descobertasDaSemana';
import {
  metricasDaSemana, destaquesDaSemana, destaquesDoPeriodo, diasDoPeriodo, janelaDoCiclo, eventosDoPeriodo, cicloQueCobre,
} from '../logic/resumoDaSemana';
import { timelineWeeks, sintomasEm, INDICADORES, notas, temAcompanhamento, type JourneyWeek, type WeekMetric } from '../logic/derive';
import { fmtPeriodo, fmtDate, diasDaSemana, WD, maiuscula, nf, now, startOfDay } from '../logic/time';
import { gerarLeituraDaSemana, falhouNaSemana } from '../ui/leituraDaSemana';
import { Txt, Row, RichDoc, Vazio, IconBadge } from '../ui/kit';
import { Icon } from '../ui/Icon';
import { EstrelaIA } from '../ui/marca';
import { TelaInterna, Titulao, Bloco, Cartao, Linha, Selo, Botao, Progresso, Sanfona, SanfonaLinha } from '../ui/internas';
import { MetricasDaSemana, DestaquesDaSemana, type Destaque } from '../ui/semanaEmNumeros';
import { useTheme } from '../ui/useTheme';
import { radius, shadowCard, font } from '../theme';
import { T } from '../textos';

const K = () => T.descobertas.semana;
/* ⚠️ É FUNÇÃO, e não constante de módulo: ela lê o catálogo, e constante
   de módulo congela o idioma no import. */
const KS = () => T.home.telaSemana;

/* ============================================================
   O RESUMO DA SEMANA — uma tela só, e uma semana só

   ⚠️ ERAM DUAS TELAS, E VIRARAM UMA (01/10/2026, pedido do dono). O
   "Resumo da semana" do Insights abria esta, com a leitura da IA; o "Ver
   detalhes" de cada semana na Jornada abria a "Semana N" (app/semana, que
   saiu), com como a pessoa se sentiu, o dia a dia e a nota da consulta. A
   mesma pergunta — como foi a minha semana — tinha duas respostas em dois
   desenhos. Agora a tela tem tudo: o resumão (os números do acordeão, os
   dias e os destaques), a leitura da IA, como você se sentiu, o dia a dia
   e a nota.

   ⚠️ E A SEMANA É A DA JORNADA, por qualquer porta (mesmo dia). A primeira
   versão da tela única abria a semana de segunda a domingo pelo Insights e
   o ciclo pela Jornada — e o dono viu duas telas: datas, números e
   destaques diferentes para "a mesma semana". A semana agora é sempre o
   ciclo da Jornada, de uma aplicação à outra (timelineWeeks), com os
   mesmos números do acordeão:

     · pela Jornada e pelo histórico (`?s=N`), o ciclo N;
     · pelo Insights, pelo aceite e pela Home (sem parâmetro), a semana do
       topo da Jornada — a atual, a primeira da lista. É a mesma tela que o
       "Ver detalhes" dela abre;
     · `?semana=` (uma leitura antiga), o ciclo que mais a cobre.

   A LEITURA DA IA CONTINUA DE SEGUNDA A DOMINGO — é como ela é pedida e
   guardada (logic/leitura). A mais recente mora na semana do topo, com as
   datas dela escritas: é ali que a tela a gera, mostra o "lendo", o erro e
   o desligar, e o cartão "A semana" está sempre na primeira semana que a
   pessoa abre. As outras aparecem no ciclo que cobre a maior parte da
   semana delas (leituraQueCobre).

   SEM CICLO QUE COBRE 4 DIAS DA SEMANA DA IA, a semana é a de segunda a
   domingo: sem aplicação registrada (a Jornada também não tem semanas), ou
   na primeira semana de tratamento, quando o único ciclo ainda não cobre
   quatro dias dela (cicloQueCobre).

   ⚠️ A MEDICAÇÃO DIÁRIA ESTAVA NESTA LISTA, E SAIU (01/10/2026, parte B2
   de docs/superpowers/specs/2026-10-01-oral-e-diario-design.md). Os
   "ciclos" dela eram de um dia — um por dose —, nenhum cobria 4 dias, e
   o Insights abria a semana de segunda a domingo enquanto a Jornada abria
   "Semana 90" de um dia só. Agora a semana de quem toma todo dia é o bloco
   de 7 dias do tratamento (`timelineWeeks`), numerado como o painel: dois
   blocos seguidos sempre dão 4 dias a um deles, e o diário abre o bloco do
   topo por qualquer porta, como a caneta abre o ciclo do topo.

   ⚠️ A AÇÃO "EXPORTAR" DA BARRA, QUE A "SEMANA N" TINHA, NÃO VEIO. O
   rótulo dela era "Uma cópia dos seus dados" e ela abria o resumo para a
   consulta — o texto prometia uma coisa e o toque fazia outra. O resumo
   para a consulta está a uma linha de distância, nos Resumos do Insights.

   ⚠️ SEM AURORA, E É DE PROPÓSITO. Uma versão anterior era da família das
   telas de hábito (ui/capa), com a aurora no alto; o dono não quis. É uma
   tela interna como as outras — <TelaInterna> e <Titulao> —, e o visual
   mora nos cartões.

   OS NÚMEROS SÃO DO APARELHO, e não da IA: aparecem antes de o texto
   chegar e não dependem dele. A IA escreve; a conta é nossa.

   ⚠️ A TELA TAMBÉM GERA. Quem aceita pelo convite do carrossel cai aqui
   direto (app/aceite-ia), e a leitura da semana ainda não existe: ela é
   pedida aqui, com o "lendo" no lugar das três partes. A Home pode estar
   pedindo a mesma ao mesmo tempo — `gerarLeituraDaSemana` junta os dois
   pedidos num só. E o erro aparece aqui, com o motivo: na Home ele é
   silêncio, e aqui a pessoa veio ver a leitura.

   O botão "Conversar sobre isso" abre a Morphi Intelligence numa conversa
   nova com a leitura como a primeira mensagem dela (app/companion,
   `?leitura=`). E o "desligar" mora no fim: vale 4 semanas.
   ============================================================ */
export default function ResumoDaSemana() {
  const S = useStore((s) => s.S);
  const { s, semana } = useLocalSearchParams<{ s?: string; semana?: string }>();
  const semanas = useMemo(() => timelineWeeks(S), [S]);
  const atual = semanaLida(now()).de;
  /* ⚠️ SEM PARÂMETRO, A SEMANA DO TOPO DA JORNADA — a atual, a primeira
     que a pessoa toca em "Seu tratamento" (01/10/2026, pedido do dono).
     Abria o ciclo que a semana da IA cobre, que é o anterior: pela Jornada
     a pessoa tocava a semana de cima e não achava o cartão "A semana" que
     via pelo Insights. Agora é a mesma, e a leitura mais recente mora nela
     (DoCiclo, daLeituraAtual).

     Só quando algum ciclo cobre 4 dias da semana da IA (cicloQueCobre) —
     senão a semana é a de segunda a domingo (DaSemanaLida). Na medicação
     diária os ciclos são os blocos de 7 dias do tratamento desde a parte
     B2 (01/10/2026), e um dos dois que dividem a semana sempre cobre 4. */
  const cicloDoTopo = cicloQueCobre(semanas, atual) ? semanas[0] : null;
  /* Um ciclo que não existe mais (a aplicação foi apagada) abre o mais
     recente, como a "Semana N" fazia. */
  const ciclo = s
    ? (semanas.find((x) => x.semana === Number(s)) ?? semanas[0] ?? null)
    : semana ? cicloQueCobre(semanas, Number(semana)) : cicloDoTopo;
  /* `?semana=` também escolhe A LEITURA: num ciclo com duas semanas da IA
     (aplicação a cada 14 dias, dose atrasada), é ela que mostra a outra. */
  const pedida = !s && semana ? leituraDaSemana(S, Number(semana)) : null;
  return ciclo
    ? <DoCiclo key={`${ciclo.semana}-${pedida?.semana ?? ''}`} ciclo={ciclo} semanas={semanas} daLeituraAtual={!!cicloDoTopo && ciclo === cicloDoTopo} pedida={pedida} />
    : <DaSemanaLida />;
}

/* ------------------------------------------------------------------ */
/* O CICLO N — a semana da Jornada, por qualquer porta. */
function DoCiclo({ ciclo, semanas, daLeituraAtual, pedida }: {
  ciclo: JourneyWeek; semanas: JourneyWeek[]; daLeituraAtual: boolean; pedida: Leitura | null;
}) {
  const { c } = useTheme();
  const router = useRouter();
  const S = useStore((s) => s.S);
  const { ini, fim, ultimoDia } = janelaDoCiclo(semanas, ciclo);
  const periodo = fmtPeriodo(new Date(ini), new Date(ultimoDia));
  /* ⚠️ NA SEMANA DO TOPO, A LEITURA DE AGORA — ou os estados dela (gerar,
     lendo, erro, vazios) —, mesmo que ela seja da semana de antes: é a
     leitura mais recente, e o cartão "A semana" tem de estar na semana que
     a pessoa abre primeiro (as datas dela aparecem em "Leitura de"). Uma
     leitura antiga que também caísse aqui (ciclo de 14 dias) não toma o
     lugar dela; fica em "Outras leituras desta semana". Nos outros ciclos,
     a que o cobre (leituraQueCobre). */
  const l = pedida ?? (daLeituraAtual ? leituraDaSemana(S, semanaLida(now()).de) : leituraQueCobre(S, ini, fim));
  const { ia, pe, rodape } = useIaDaSemana(l, daLeituraAtual && !pedida);
  /* ⚠️ TODA LEITURA GUARDADA TEM UMA PORTA. A lista "Semanas anteriores"
     mora na semana de calendário; aqui, cada leitura é do ciclo que a cobre
     (cicloQueCobre), e as que não são a de cima aparecem nesta lista —
     senão, num ciclo de 14 dias, uma em cada duas sumia (achado da
     revisão de 01/10/2026). */
  const outras = leiturasGuardadas(S)
    .filter((x) => x.semana !== l?.semana && cicloQueCobre(semanas, x.semana) === ciclo)
    .reverse();
  const datasDaLeitura = l && +startOfDay(l.semana + 12 * 3600e3) !== ini
    ? fmtPeriodo(new Date(l.semana), new Date(noCalendario(l.semana, 6)))
    : null;

  return (
    <Resumo
      /* a aplicação do cadastro não tem local: a pergunta foi só a data.
         Na dose diária, o bloco diz quantos dias tiveram dose — "6 de 7
         doses", como o cabeçalho dele na Jornada (01/10/2026, parte B2). */
      lead={[KS().semanaN(ciclo.semana), periodo, ciclo.dosesTexto, ciclo.dose, ciclo.site].filter(Boolean).join(' · ')}
      sub={`${KS().semanaN(ciclo.semana)} · ${periodo}`}
      metricas={ciclo.metricas}
      dias={diasDoPeriodo(S, ini, noCalendario(ultimoDia, 1))}
      /* sem a aplicação: ela abre o ciclo e já está no título */
      destaques={destaquesDoPeriodo(S, ini, fim, false)}
      ini={ini}
      fim={fim}
      ia={ia && datasDaLeitura ? (
        <View style={{ gap: 10 }}>
          <Txt v="caption" c={c.tx3} style={{ marginLeft: 2 }}>{K().leituraDe(datasDaLeitura)}</Txt>
          {ia}
        </View>
      ) : ia}
      rodape={rodape}
      pe={(
        <>
          {outras.length ? (
            <Bloco titulo={K().outrasLeituras}>
              <Cartao>
                {outras.map((x) => (
                  <Linha
                    key={x.semana}
                    ic={ICONE_DA_AREA[x.descoberta.area] ?? 'spark'}
                    titulo={K().leituraDe(fmtPeriodo(new Date(x.semana), new Date(noCalendario(x.semana, 6))))}
                    seta
                    onPress={() => router.push(`/leitura?semana=${x.semana}` as any)}
                  />
                ))}
              </Cartao>
            </Bloco>
          ) : null}
          {pe}
        </>
      )}
    />
  );
}

/* ------------------------------------------------------------------ */
/* SEM CICLO: a semana de segunda a domingo que a IA leu. */
function DaSemanaLida() {
  const router = useRouter();
  const S = useStore((s) => s.S);
  const { semana } = useLocalSearchParams<{ semana?: string }>();

  /* A semana pedida pelo link, se ela ainda está guardada; senão, a semana
     que acabou de fechar — que é a que esta tela gera. */
  const atual = semanaLida(now()).de;
  const pedida = semana ? leituraDaSemana(S, Number(semana)) : null;
  const l: Leitura | null = pedida ?? leituraDaSemana(S, atual);
  const alvo = l?.semana ?? atual;
  const { ia, pe, rodape } = useIaDaSemana(l, alvo === atual);

  /* ⚠️ SÓ AS DE ANTES, e não "todas menos esta": aberta a de 14/09, a
     lista mostrava 28/09 e 21/09 sob "Semanas anteriores", e tocar numa
     delas empilhava outra cópia de uma tela que já estava atrás (achado
     da revisão de 01/10/2026). Indo só para trás, voltar desfaz o
     caminho. Com ciclo, a lista de semanas é a da Jornada. */
  const anteriores = leiturasGuardadas(S).filter((x) => x.semana < alvo).reverse();

  const de = +startOfDay(alvo + 12 * 3600e3);
  const ate = noCalendario(de, 7);
  const periodo = fmtPeriodo(new Date(de), new Date(noCalendario(de, 6)));
  return (
    <Resumo
      lead={periodo}
      sub={periodo}
      metricas={metricasDaSemana(S, alvo)}
      dias={diasDoPeriodo(S, de, ate)}
      destaques={destaquesDaSemana(S, alvo)}
      ini={de}
      fim={ate}
      ia={ia}
      rodape={rodape}
      pe={(
        <>
          {anteriores.length ? (
            <Bloco titulo={K().anteriores}>
              <Cartao>
                {anteriores.map((x) => (
                  <Linha
                    key={x.semana}
                    ic={ICONE_DA_AREA[x.descoberta.area] ?? 'spark'}
                    titulo={fmtPeriodo(new Date(x.semana), new Date(noCalendario(x.semana, 6)))}
                    seta
                    onPress={() => router.push(`/leitura?semana=${x.semana}` as any)}
                  />
                ))}
              </Cartao>
            </Bloco>
          ) : null}
          {pe}
        </>
      )}
    />
  );
}

/* ------------------------------------------------------------------ */
/* A LEITURA DA IA NA TELA — o que mostrar no lugar dela, o pé e o botão
   de conversar. Um gancho só para os dois jeitos de abrir, para o ciclo e
   a semana de calendário nunca divergirem no que dizem.

   `daLeituraAtual` diz se esta é a semana em que a leitura de agora mora:
   só nela a tela gera, mostra o "lendo", o erro e os vazios. Num ciclo
   antigo sem leitura, o lugar dela simplesmente não aparece. */
function useIaDaSemana(l: Leitura | null, daLeituraAtual: boolean) {
  const { c } = useTheme();
  const router = useRouter();
  const S = useStore((s) => s.S);
  const update = useStore((s) => s.update);
  const atual = semanaLida(now()).de;
  const estado = estadoDaLeitura(S);
  const podeGerar = daLeituraAtual && !l && estado.tipo === 'gerar';

  const [pedindo, setPedindo] = useState(false);
  /* "Desliguei" só logo depois do toque: o "daqui a 4 semanas" é verdade
     naquela hora, e voltando dias depois a frase já não é. */
  const [acabouDeDesligar, setAcabouDeDesligar] = useState(false);
  const [motivo, setMotivo] = useState<MotivoDaLeitura | null>(() => falhouNaSemana(atual));
  const gerar = () => {
    setMotivo(null);
    setPedindo(true);
    gerarLeituraDaSemana(atual).then((ok) => {
      setPedindo(false);
      if (!ok) setMotivo(falhouNaSemana(atual) ?? 'sem-rede');
    });
  };
  /* Pede sozinha uma vez, ao abrir. Depois de uma falha, só a pedido da
     pessoa — o botão do erro. */
  useEffect(() => {
    if (podeGerar && !falhouNaSemana(atual)) gerar();
  }, [podeGerar, atual]);

  const ligar = () => {
    if (aceitouAIa(S)) update((s: any) => { registrarAceiteDaLeitura(s); });
    else router.push('/aceite-ia?leitura=aqui' as any);
  };

  /* ⚠️ "POUCO REGISTRO" TAMBÉM VEM DO PEDIDO, e não só do estado: a
     semana pode ter o mínimo e nenhuma descoberta que se sustente
     (logic/leitura, `escolherDaSemana`). Aí não é erro, e tentar de novo
     daria no mesmo. E NÃO É O VAZIO DE QUEM REGISTROU POUCO: esse pede
     três check-ins, e a pessoa já fez (achado da revisão de 01/10/2026). */
  const semDescoberta = podeGerar && motivo === 'pouco-registro';
  let ia: React.ReactNode = null;
  if (l) ia = <Partes l={l} daSemanaAtual={l.semana === atual} />;
  else if (!daLeituraAtual) ia = null;
  else if (podeGerar && motivo && !pedindo && !semDescoberta) ia = <Falha motivo={motivo} onTentar={gerar} />;
  else if (podeGerar && !semDescoberta) ia = <Lendo />;
  else if (semDescoberta) ia = <Vazio ic="spark" titulo={K().semDescobertaTitulo} texto={K().semDescobertaTexto} />;
  else if (estado.tipo === 'poucoRegistro') {
    ia = (
      <Vazio
        ic="cal"
        titulo={K().poucoTitulo}
        texto={K().poucoTexto}
        acao={K().fazerCheckin}
        onAcao={() => router.push('/checkin' as any)}
      />
    );
  } else if (leituraLigada()) {
    ia = <Vazio ic="spark" titulo={K().desligadoTitulo} texto={K().desligadoTexto} acao={K().ligar} onAcao={ligar} />;
  }
  /* Sem o servidor da leitura, o lugar dela some — como some a linha do
     Insights e o convite da Home. Era um bloco "indisponível" sem ação
     nenhuma no meio do detalhe de uma semana (achado da revisão). */

  /* ⚠️ DESLIGADO, O PÉ OFERECE RELIGAR. A linha do Insights abre esta tela
     como o lugar de religar, e aqui só havia o aviso de que daqui a 4
     semanas o convite voltaria (achado da revisão de 01/10/2026). */
  const pe = l ? (
    <View style={{ alignItems: 'center', marginTop: 4 }}>
      {acabouDeDesligar ? (
        <Txt v="caption" c={c.tx3} style={{ textAlign: 'center' }}>{K().desligada}</Txt>
      ) : aceitouALeitura(S) ? (
        <Pressable hitSlop={8} onPress={() => { update((s: any) => { registrarRecusaDaLeitura(s); }); setAcabouDeDesligar(true); }}>
          <Txt v="caption" c={c.tx3} style={{ textDecorationLine: 'underline' }}>{K().desligar}</Txt>
        </Pressable>
      ) : (
        <Pressable hitSlop={8} onPress={ligar}>
          <Txt v="caption" c={c.tx3} style={{ textDecorationLine: 'underline' }}>{K().ligar}</Txt>
        </Pressable>
      )}
    </View>
  ) : null;

  const rodape = l ? <Botao label={K().conversar} onPress={() => router.push(`/companion?leitura=${l.semana}` as any)} /> : undefined;
  return { ia, pe, rodape };
}

/* ------------------------------------------------------------------ */
/* O DESENHO, o mesmo pelas duas portas: o resumão, a leitura da IA, como
   você se sentiu, o dia a dia e a nota — nessa ordem, que é a das
   perguntas de quem volta a uma semana: como foi, o que isso quer dizer,
   como eu estava, o que aconteceu, o que eu quis levar à consulta. Cada
   bloco some quando não tem o que mostrar. */
function Resumo({ lead, sub, metricas, dias, destaques, ini, fim, ia, rodape, pe }: {
  lead: string; sub: string;
  metricas: WeekMetric[];
  dias: ReturnType<typeof diasDoPeriodo>;
  destaques: Destaque[];
  ini: number; fim: number;
  ia: React.ReactNode;
  rodape?: React.ReactNode;
  pe?: React.ReactNode;
}) {
  return (
    <TelaInterna titulo={K().telaTitulo} sub={sub} rodape={rodape}>
      <Titulao titulo={K().telaTitulo} lead={lead} />
      <Resumao metricas={metricas} dias={dias} destaques={destaques} />
      <View style={{ gap: 26 }}>
        {ia}
        <ComoSeSentiu ini={ini} fim={fim} dias={dias} />
        <DiaADia ini={ini} fim={fim} />
        <NotaDaSemana ini={ini} fim={fim} />
        {pe}
      </View>
    </TelaInterna>
  );
}

/* O ícone de cada área de descoberta (logic/descobertasDaSemana). */
const ICONE_DA_AREA: Record<string, string> = {
  habitos: 'cutlery',
  ritmo: 'clock',
  exames: 'doc',
  exercicio: 'run',
  sintomas: 'gut',
  pesoSemanal: 'scale',
  medidas: 'ruler',
  constancia: 'cal',
};

/* O nível da descoberta, como selo. O tom da leitura já segue o nível (o
   padrão forte é afirmado, o começo diz que é cedo); o selo diz o mesmo
   antes de a pessoa ler, e diz sem precisar de número. */
const NIVEL = (): Record<string, [string, 'lima' | 'neutra']> => ({
  forte: [K().nivelForte, 'lima'],
  comeco: [K().nivelComeco, 'neutra'],
  retrato: [K().nivelRetrato, 'neutra'],
});

/* ------------------------------------------------------------------ */
/* O RESUMÃO, num cartão: os números, os dias e o que marcou a semana.

   ⚠️ OS NÚMEROS E OS DESTAQUES SÃO OS DO ACORDEÃO DA JORNADA (01/10/2026,
   pedido do dono): peso, hidratação, proteína e exercício, cada um contra
   a semana anterior, e as conquistas, consultas e exames — o mesmo
   desenho (ui/semanaEmNumeros) e os mesmos rótulos. No ciclo, são os
   números do próprio acordeão; na semana de segunda a domingo, as mesmas
   contas nessa janela (logic/resumoDaSemana).

   OS DIAS — a semana que a leitura leu, ou o ciclo. A bola diz se houve
   check-in; embaixo dela, um ícone por treino e por pesagem. É a mesma
   pergunta da tira de dias do diário (ui/internas, TiraDeDias) — o ritmo,
   que nem número nem texto mostram — sem a navegação, porque aqui não há
   um dia para abrir.

   ⚠️ CADA PARTE SÓ COM O QUE HOUVE, E O CARTÃO SOME SEM NADA (regra das
   seções vazias). */
function Resumao({ metricas, dias, destaques }: {
  metricas: WeekMetric[]; dias: ReturnType<typeof diasDoPeriodo>; destaques: Destaque[];
}) {
  const { c } = useTheme();
  /* a cor do destaque vem como nome de token (logic/resumoDaSemana) */
  const itens = destaques.map((d) => ({ ...d, cor: (c as any)[d.cor] ?? c.accent }));
  const temDias = dias.some((d) => d.checkin || d.treino || d.pesagem);
  if (!metricas.length && !temDias && !itens.length) return null;

  const fio = <View style={{ height: StyleSheet.hairlineWidth, backgroundColor: c.line, marginHorizontal: 16 }} />;
  return (
    <View style={[{ backgroundColor: c.bg1, borderRadius: radius.card, overflow: 'hidden' }, shadowCard(c)]}>
      {metricas.length ? (
        /* a grade traz a própria folga embaixo de cada linha */
        <View style={{ paddingHorizontal: 18, paddingTop: 18, paddingBottom: 4 }}>
          <MetricasDaSemana metricas={metricas} />
        </View>
      ) : null}
      {metricas.length && temDias ? fio : null}
      {temDias ? <FileiraDeDias dias={dias} /> : null}
      {itens.length && (metricas.length || temDias) ? fio : null}
      {itens.length ? (
        <View style={{ paddingHorizontal: 18, paddingTop: 4, paddingBottom: 18 }}>
          <DestaquesDaSemana itens={itens} />
        </View>
      ) : null}
    </View>
  );
}

/* ⚠️ A FILEIRA NÃO TEM SEMPRE SETE DIAS: o ciclo vai de uma aplicação à
   outra. Até nove dias, uma linha só, com a bola um pouco menor acima de
   sete; um ciclo maior (dose atrasada, intervalo de 14 dias, pausa)
   quebra em linhas de sete, com a coluna fixa num sétimo — senão as bolas
   se sobrepunham (achado da revisão de 01/10/2026), e a última linha,
   incompleta, fica alinhada sob as de cima. */
function FileiraDeDias({ dias }: { dias: ReturnType<typeof diasDoPeriodo> }) {
  const { c } = useTheme();
  const temTreino = dias.some((d) => d.treino);
  const temPesagem = dias.some((d) => d.pesagem);
  const porLinha = dias.length <= 9 ? dias.length : 7;
  const tam = porLinha <= 7 ? 32 : 28;
  const linhas: (typeof dias)[] = [];
  for (let i = 0; i < dias.length; i += porLinha) linhas.push(dias.slice(i, i + porLinha));

  return (
    <View style={{ paddingVertical: 16, paddingHorizontal: 12, gap: 14 }}>
      {linhas.map((linha) => (
      <Row key={linha[0].t}>
        {linha.map((d) => {
          const dia = new Date(d.t);
          const nome = maiuscula(WD()[dia.getDay()].replace('.', ''));
          return (
            <View key={d.t} style={{ width: `${100 / porLinha}%`, alignItems: 'center', gap: 6 }}>
              <Txt v="micro" c={c.tx3}>{nome}</Txt>
              <View style={{
                width: tam, height: tam, borderRadius: tam / 2,
                alignItems: 'center', justifyContent: 'center',
                backgroundColor: d.checkin ? c.accent : c.bg2,
              }}>
                {d.checkin
                  ? <Icon name="check" size={Math.round(tam * 0.47)} color={c.accentInk} sw={2.4} />
                  : <Txt v="micro" c={c.tx4}>{dia.getDate()}</Txt>}
              </View>
              <View style={{ height: 14, flexDirection: 'row', gap: 2 }}>
                {d.treino ? <Icon name="run" size={13} color={c.tx2} sw={2} /> : null}
                {d.pesagem ? <Icon name="scale" size={13} color={c.tx2} sw={2} /> : null}
              </View>
            </View>
          );
        })}
      </Row>
      ))}
      <Row gap={14} style={{ justifyContent: 'center', flexWrap: 'wrap' }}>
        <Legenda cor={c.accent} rotulo={K().legendaCheckin} />
        {temTreino ? <Legenda ic="run" rotulo={K().legendaTreino} /> : null}
        {temPesagem ? <Legenda ic="scale" rotulo={K().legendaPesagem} /> : null}
      </Row>
    </View>
  );
}

function Legenda({ cor, ic, rotulo }: { cor?: string; ic?: string; rotulo: string }) {
  const { c } = useTheme();
  return (
    <Row gap={5}>
      {ic
        ? <Icon name={ic} size={12} color={c.tx3} sw={2} />
        : <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: cor }} />}
      <Txt v="micro" c={c.tx3}>{rotulo}</Txt>
    </Row>
  );
}

/* ------------------------------------------------------------------ */
/* COMO VOCÊ SE SENTIU — veio da "Semana N", como estava.

   OS SINTOMAS SAEM DA LEITURA COMPARTILHADA (sintomasEm, em derive): a
   régua é a mesma da tela de sintomas, e a palavra do grau é a que a
   pessoa leu ao responder. Viram barra porque "náusea leve por 2 dias" é
   uma quantidade, e quantidade se compara de relance entre linhas.

   O "de N dias" conta os dias do período que já passaram — eram sete
   escritos no texto, e um ciclo de dez dias respondido inteiro dizia
   "10 de 7". */
function ComoSeSentiu({ ini, fim, dias }: { ini: number; fim: number; dias: ReturnType<typeof diasDoPeriodo> }) {
  const S = useStore((s) => s.S);
  const cs = (S.checkins as any[]).filter((x) => x.t >= ini && x.t < fim);
  const sintomas = sintomasEm(cs);
  const respondidos = cs.filter((x: any) => typeof x?.nausea === 'number' || x?.gut != null).length;
  const decorridos = dias.filter((d) => d.t <= +startOfDay(now())).length;
  /* Energia pela leitura do indicador, que é quem sabe que a coluna mora
     de 0 a 10 e a pergunta foi de 1 a 5. */
  const energia = INDICADORES().find((x) => x.id === 'energia')!;
  const ens = cs.map((x: any) => energia.leitura(x)).filter((v): v is number => v != null);
  const mediaEnergia = ens.length ? ens.reduce((a, b) => a + b, 0) / ens.length : null;
  if (!sintomas.length && mediaEnergia == null) return null;

  return (
    <Bloco
      titulo={KS().comoSeSentiu}
      nota={respondidos ? KS().diasRespondidos(respondidos, Math.max(decorridos, respondidos)) : undefined}
    >
      <View style={{ gap: 8 }}>
        {sintomas.map((x) => (
          <Progresso
            key={x.id}
            label={x.label}
            valor={KS().sintomaDias(T.comum.noMeio(x.legenda), x.dias)}
            pct={(x.media / 5) * 100}
          />
        ))}
        {mediaEnergia != null ? (
          <Progresso
            /* ⚠️ O RÓTULO É O DESTA TELA, e não o do indicador. O nome
               dele é "Energia no dia", e aqui a barra mostra a MÉDIA da
               semana — o dia ficaria sobrando na frase. */
            label={KS().energia}
            valor={KS().energiaDe5(nf(mediaEnergia, 1))}
            pct={(mediaEnergia / 5) * 100}
          />
        ) : null}
      </View>
    </Bloco>
  );
}

/* ⚠️ ERA UMA CONSTANTE DE MÓDULO COM AS SETE PALAVRAS ESCRITAS, e por
   isso ficava em português nos cinco idiomas. `home.tipos` é o plural com
   inicial maiúscula, porque nasceu para rotular FILTROS; o selo é o
   singular em caixa baixa, porque qualifica UM dia — e o alemão escreve
   as duas com maiúscula, que é o tipo de coisa que só o catálogo sabe. */
const diaSemana = (t: number) => {
  const d = new Date(t);
  return KS().diaComData(maiuscula(diasDaSemana()[d.getDay()]), fmtDate(t));
};

/* O DIA A DIA — o que aconteceu, em ordem. Some quando o período só teve
   a aplicação: ela já está no topo, e a sanfona ficava vazia. */
function DiaADia({ ini, fim }: { ini: number; fim: number }) {
  const router = useRouter();
  const S = useStore((s) => s.S);
  const eventos = eventosDoPeriodo(S, ini, fim);
  if (!eventos.length) return null;
  return (
    <Bloco titulo={KS().diaADia}>
      <Sanfona>
        {eventos.map((e) => (
          <SanfonaLinha
            key={e.key}
            titulo={diaSemana(e.day)}
            selo={(KS().selo as Record<string, string>)[e.kind] ?? e.kind}
            seloTom="neutra"
            /* Sem a hora: ela nunca foi registrada — ver ordemNoDia em
               TLEvent, no derive. */
            sub={[e.title, e.sub].filter(Boolean).join(' · ')}
            onPress={e.kind === 'peso' ? () => router.push(`/registro?m=peso&t=${e.day}` as any) : undefined}
          />
        ))}
      </Sanfona>
    </Bloco>
  );
}

/* A NOTA PARA A CONSULTA — a que pertence a ESTE período, e não a mais
   recente do app: uma nota de três semanas depois entraria aqui como se
   tivesse sido escrita na época. Sem ninguém para quem levar, a pauta da
   consulta não é um bloco em branco a preencher — é um assunto que não é
   dela, e o bloco não aparece. */
function NotaDaSemana({ ini, fim }: { ini: number; fim: number }) {
  const router = useRouter();
  const S = useStore((s) => s.S);
  if (!temAcompanhamento(S)) return null;
  const nota = notas(S).find((n) => n.t >= ini && n.t < fim) ?? null;
  return (
    <Bloco titulo={KS().nota} link={KS().verTodas} onLink={() => router.push('/notas' as any)}>
      <Cartao>
        {/* ⚠️ AS ASPAS SÃO DE CADA IDIOMA — “ ” no português, „ “ no
            alemão, « » no francês (T.comum.citacao). */}
        <Linha
          titulo={nota ? T.comum.citacao(nota.text) : KS().nenhumaNota}
          sub={nota ? KS().anotadaEm(fmtDate(nota.t)) : KS().toqueParaEscrever}
          onPress={() => router.push(nota ? `/nota?t=${nota.t}` as any : '/nota' as any)}
        />
      </Cartao>
    </Bloco>
  );
}

/* ------------------------------------------------------------------ */
/* AS TRÊS PARTES DA LEITURA, cada uma com a sua cara, para o olho achar
   cada uma sem ler o título: a semana no cartão de sempre, com a estrela
   da IA; a descoberta no azul fraco, com o ícone da área e o selo do
   nível; e o teste no lima, que é a cor do "faça isto" no app. */
function Partes({ l, daSemanaAtual }: { l: Leitura; daSemanaAtual: boolean }) {
  const { c } = useTheme();
  const nivel = NIVEL()[l.descoberta.nivel];
  return (
    <View style={{ gap: 12 }}>
      <Parte fundo={c.bg1} sombra>
        <Chapeu cor={c.accent} rotulo={K().parteSemana}><EstrelaIA size={15} /></Chapeu>
        <RichDoc text={l.texto.semana} />
      </Parte>

      <Parte fundo={c.accentWeak} borda={c.accentLine}>
        <Row style={{ justifyContent: 'space-between', gap: 8 }}>
          <Chapeu cor={c.accent} rotulo={K().parteDescoberta}>
            <IconBadge name={ICONE_DA_AREA[l.descoberta.area] ?? 'bulb'} size={28} iconSize={14} bg={c.bg1} />
          </Chapeu>
          {nivel ? <Selo label={nivel[0]} tom={nivel[1]} /> : null}
        </Row>
        <RichDoc text={l.texto.descoberta} />
      </Parte>

      <Parte fundo={c.limeSoft}>
        {/* ⚠️ "NESTA SEMANA" SÓ NA LEITURA DESTA SEMANA. Numa antiga, o
            teste era para uma semana que já passou, e o rótulo ficaria
            falso — e é o neutro que vai para a conversa (app/companion),
            onde a mensagem fica guardada. */}
        <Chapeu cor={c.limeSoftInk} rotulo={daSemanaAtual ? K().parteTesteAgora : K().parteTeste}>
          <Icon name="target" size={16} color={c.limeSoftInk} sw={2} />
        </Chapeu>
        <RichDoc text={l.texto.teste} />
      </Parte>
    </View>
  );
}

function Parte({ fundo, borda, sombra, children }: { fundo: string; borda?: string; sombra?: boolean; children: React.ReactNode }) {
  const { c } = useTheme();
  return (
    <View style={[
      { backgroundColor: fundo, borderRadius: radius.card, padding: 18, gap: 10 },
      borda ? { borderWidth: 1, borderColor: borda } : null,
      sombra ? shadowCard(c) : null,
    ]}>
      {children}
    </View>
  );
}

function Chapeu({ cor, rotulo, children }: { cor: string; rotulo: string; children?: React.ReactNode }) {
  return (
    <Row gap={8} style={{ flexShrink: 1 }}>
      {children}
      <Txt v="micro" c={cor} style={{ fontFamily: font.bodyMed, letterSpacing: 1, flexShrink: 1 }}>{rotulo.toUpperCase()}</Txt>
    </Row>
  );
}

/* ------------------------------------------------------------------ */
/* ENQUANTO ESCREVE: a estrela, a frase e três linhas que pulsam no lugar
   do texto — o desenho do que vem, e não uma roda girando no vazio. */
function Lendo() {
  const { c } = useTheme();
  const pulso = useRef(new Animated.Value(0.45)).current;
  useEffect(() => {
    const laco = Animated.loop(Animated.sequence([
      Animated.timing(pulso, { toValue: 1, duration: 700, useNativeDriver: true }),
      Animated.timing(pulso, { toValue: 0.45, duration: 700, useNativeDriver: true }),
    ]));
    laco.start();
    return () => laco.stop();
  }, [pulso]);

  return (
    <Parte fundo={c.bg1} sombra>
      <Chapeu cor={c.accent} rotulo={K().lendo}><EstrelaIA size={15} /></Chapeu>
      <Animated.View style={{ gap: 9, opacity: pulso }}>
        {[100, 92, 64].map((w) => (
          <View key={w} style={{ width: `${w}%`, height: 12, borderRadius: 6, backgroundColor: c.bg2 }} />
        ))}
      </Animated.View>
    </Parte>
  );
}

/* QUANDO NÃO VEIO: o motivo, e tentar de novo quando tentar adianta. No
   limite do dia, o botão só gastaria um toque — amanhã a leitura sai. */
function Falha({ motivo, onTentar }: { motivo: MotivoDaLeitura; onTentar: () => void }) {
  const { c } = useTheme();
  const limite = motivo === 'limite' || motivo === 'limite-do-mes';
  const texto = limite ? K().erroLimite : motivo === 'sem-conta' ? K().erroConta : K().erro;
  /* ⚠️ SEM CONTA TAMBÉM TENTA DE NOVO: era um beco — sem botão, e a tela
     não refazia o pedido depois de a pessoa entrar. O servidor recusa
     antes de gastar a cota, então tentar não custa nada. */
  return (
    <Parte fundo={c.bg1} sombra>
      <Chapeu cor={c.tx3} rotulo={K().parteSemana}><EstrelaIA size={15} /></Chapeu>
      <Txt v="body" c={c.tx2}>{texto}</Txt>
      {limite ? null : <Botao label={K().tentarDeNovo} tom="fantasma" onPress={onTentar} />}
    </Parte>
  );
}
