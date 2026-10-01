import React, { useEffect, useRef, useState } from 'react';
import { View, Pressable, Animated, StyleSheet } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useStore } from '../logic/store';
import {
  leituraDaSemana, leiturasGuardadas, estadoDaLeitura, leituraLigada, aceitouALeitura,
  registrarRecusaDaLeitura, registrarAceiteDaLeitura, type Leitura, type MotivoDaLeitura,
} from '../logic/leitura';
import { aceitouAIa } from '../logic/aceiteDaIa';
import { semanaLida, noCalendario } from '../logic/descobertasDaSemana';
import { numerosDaSemana, metricasDaSemana, destaquesDaSemana } from '../logic/resumoDaSemana';
import { fmtPeriodo, WD, maiuscula, now } from '../logic/time';
import { gerarLeituraDaSemana, falhouNaSemana } from '../ui/leituraDaSemana';
import { Txt, Row, RichDoc, Vazio, IconBadge } from '../ui/kit';
import { Icon } from '../ui/Icon';
import { EstrelaIA } from '../ui/marca';
import { TelaInterna, Titulao, Bloco, Cartao, Linha, Selo, Botao } from '../ui/internas';
import { MetricasDaSemana, DestaquesDaSemana } from '../ui/semanaEmNumeros';
import { useTheme } from '../ui/useTheme';
import { radius, shadowCard, font } from '../theme';
import { T } from '../textos';

const K = () => T.descobertas.semana;

/* ============================================================
   O RESUMO DA SEMANA, inteiro

   ⚠️ REFEITO EM 01/10/2026, porque o dono não gostou: era um titulão e
   três blocos de texto corrido, uma página de documento. Agora abre com
   os dados da semana num cartão — os números e a fileira dos sete dias —
   e as três partes da leitura vêm cada uma com a sua cara.

   ⚠️ SEM AURORA, E É DE PROPÓSITO. A primeira versão refeita era da
   família das telas de hábito (ui/capa), com a aurora no alto e os
   números em branco sobre ela; o dono não quis (01/10/2026). Ela é uma
   tela interna como as outras — <TelaInterna> e <Titulao> —, e o visual
   mora nos cartões.

   OS NÚMEROS SÃO DO APARELHO, e não da IA (logic/resumoDaSemana,
   `numerosDaSemana`): aparecem antes de o texto chegar e não dependem
   dele. A IA escreve; a conta é nossa.

   ⚠️ A TELA TAMBÉM GERA. Quem aceita pelo convite do carrossel cai aqui
   direto (app/aceite-ia), e a leitura da semana ainda não existe: ela é
   pedida aqui, com o "lendo" no lugar das três partes. A Home pode estar
   pedindo a mesma ao mesmo tempo — `gerarLeituraDaSemana` junta os dois
   pedidos num só (ui/leituraDaSemana).

   ⚠️ E O ERRO APARECE AQUI, com o motivo, ao contrário da Home, onde ele
   é silêncio: aqui a pessoa veio ver a leitura, e uma tela vazia sem
   explicação seria pior do que dizer o que houve.

   O botão "Conversar sobre isso" abre a Morphi Intelligence numa
   conversa nova com a leitura como a primeira mensagem dela
   (app/companion, `?leitura=`). E o "desligar" mora no fim: vale 4
   semanas (logic/leitura).
   ============================================================ */
export default function LeituraDaSemana() {
  const { c } = useTheme();
  const router = useRouter();
  const S = useStore((s) => s.S);
  const update = useStore((s) => s.update);
  const { semana } = useLocalSearchParams<{ semana?: string }>();

  /* A semana pedida pelo link, se ela ainda está guardada; senão, a semana
     que acabou de fechar — que é a que esta tela gera. */
  const atual = semanaLida(now()).de;
  const pedida = semana ? leituraDaSemana(S, Number(semana)) : null;
  const l: Leitura | null = pedida ?? leituraDaSemana(S, atual);
  const alvo = l?.semana ?? atual;
  const estado = estadoDaLeitura(S);
  const podeGerar = !l && estado.tipo === 'gerar';

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

  const n = numerosDaSemana(S, alvo);
  /* ⚠️ SÓ AS DE ANTES, e não "todas menos esta": aberta a de 14/09, a
     lista mostrava 28/09 e 21/09 sob "Semanas anteriores", e tocar numa
     delas empilhava outra cópia de uma tela que já estava atrás (achado
     da revisão de 01/10/2026). Indo só para trás, voltar desfaz o
     caminho. */
  const anteriores = leiturasGuardadas(S).filter((x) => x.semana < alvo).reverse();

  /* ⚠️ "POUCO REGISTRO" TAMBÉM VEM DO PEDIDO, e não só do estado: a
     semana pode ter o mínimo e nenhuma descoberta que se sustente
     (logic/leitura, `escolherDaSemana`). Aí não é erro, e tentar de novo
     daria no mesmo. E NÃO É O VAZIO DE QUEM REGISTROU POUCO: esse pede
     três check-ins, e a pessoa já fez (achado da revisão de 01/10/2026). */
  const semDescoberta = podeGerar && motivo === 'pouco-registro';
  let corpo: React.ReactNode;
  if (l) corpo = <Partes l={l} daSemanaAtual={l.semana === atual} />;
  else if (podeGerar && motivo && !pedindo && !semDescoberta) corpo = <Falha motivo={motivo} onTentar={gerar} />;
  else if (podeGerar && !semDescoberta) corpo = <Lendo />;
  else if (semDescoberta) corpo = <Vazio ic="spark" titulo={K().semDescobertaTitulo} texto={K().semDescobertaTexto} />;
  else if (estado.tipo === 'poucoRegistro') {
    corpo = (
      <Vazio
        ic="cal"
        titulo={K().poucoTitulo}
        texto={K().poucoTexto}
        acao={K().fazerCheckin}
        onAcao={() => router.push('/checkin' as any)}
      />
    );
  } else if (leituraLigada()) {
    corpo = <Vazio ic="spark" titulo={K().desligadoTitulo} texto={K().desligadoTexto} acao={K().ligar} onAcao={ligar} />;
  } else {
    corpo = <Vazio ic="spark" titulo={K().indisponivel} />;
  }

  const periodo = fmtPeriodo(new Date(alvo), new Date(noCalendario(alvo, 6)));
  return (
    <TelaInterna
      titulo={K().telaTitulo}
      sub={periodo}
      rodape={l ? <Botao label={K().conversar} onPress={() => router.push(`/companion?leitura=${l.semana}` as any)} /> : undefined}
    >
      <Titulao titulo={K().telaTitulo} lead={periodo} />
      <DadosDaSemana semana={alvo} n={n} />
      <View style={{ gap: 26 }}>
        {corpo}

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

        {l ? (
          <View style={{ alignItems: 'center', marginTop: 4 }}>
            {/* ⚠️ DESLIGADO, O PÉ OFERECE RELIGAR. A linha do Insights abre
                esta tela como o lugar de religar, e aqui só havia o aviso de
                que daqui a 4 semanas o convite voltaria (achado da revisão
                de 01/10/2026). */}
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
        ) : null}
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
/* OS DADOS DA SEMANA, num cartão: os números, os sete dias e o que
   marcou a semana.

   ⚠️ OS NÚMEROS E OS DESTAQUES SÃO OS DO ACORDEÃO DA JORNADA (01/10/2026,
   pedido do dono): peso, hidratação, proteína e exercício, cada um contra
   a semana anterior, e as conquistas, aplicações, consultas e exames da
   semana — o mesmo desenho (ui/semanaEmNumeros) e os mesmos rótulos, com
   as contas de segunda a domingo (logic/resumoDaSemana). Eram três
   números grandes e duas barras contra a meta, e a pessoa via a semana de
   um jeito aqui e de outro na Jornada.

   OS SETE DIAS — de segunda a domingo, a semana que a leitura leu. A
   bola diz se houve check-in; embaixo dela, um ícone por treino e por
   pesagem. É a mesma pergunta da tira de dias do diário (ui/internas,
   TiraDeDias) — o ritmo, que nem número nem texto mostram — sem a
   navegação, porque aqui não há um dia para abrir.

   ⚠️ CADA PARTE SÓ COM O QUE HOUVE, E O CARTÃO SOME SEM NADA (regra das
   seções vazias). */
function DadosDaSemana({ semana, n }: { semana: number; n: ReturnType<typeof numerosDaSemana> }) {
  const { c } = useTheme();
  const S = useStore((s) => s.S);
  const metricas = metricasDaSemana(S, semana);
  const destaques = destaquesDaSemana(S, semana).map((d) => ({ ...d, cor: (c as any)[d.cor] ?? c.accent }));
  const temDias = n.dias.some((d) => d.checkin || d.treino || d.pesagem);
  if (!metricas.length && !temDias && !destaques.length) return null;

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
      {temDias ? <SeteDias dias={n.dias} /> : null}
      {destaques.length && (metricas.length || temDias) ? fio : null}
      {destaques.length ? (
        <View style={{ paddingHorizontal: 18, paddingTop: 4, paddingBottom: 18 }}>
          <DestaquesDaSemana itens={destaques} />
        </View>
      ) : null}
    </View>
  );
}

function SeteDias({ dias }: { dias: ReturnType<typeof numerosDaSemana>['dias'] }) {
  const { c } = useTheme();
  const temTreino = dias.some((d) => d.treino);
  const temPesagem = dias.some((d) => d.pesagem);

  return (
    <View style={{ paddingVertical: 16, paddingHorizontal: 12, gap: 14 }}>
      <Row style={{ justifyContent: 'space-between' }}>
        {dias.map((d) => {
          const dia = new Date(d.t);
          return (
            <View key={d.t} style={{ flex: 1, alignItems: 'center', gap: 6 }}>
              <Txt v="micro" c={c.tx3}>{maiuscula(WD()[dia.getDay()].replace('.', ''))}</Txt>
              <View style={{
                width: 32, height: 32, borderRadius: 16,
                alignItems: 'center', justifyContent: 'center',
                backgroundColor: d.checkin ? c.accent : c.bg2,
              }}>
                {d.checkin
                  ? <Icon name="check" size={15} color={c.accentInk} sw={2.4} />
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
/* AS TRÊS PARTES, cada uma com a sua cara, para o olho achar cada uma
   sem ler o título: a semana no cartão de sempre, com a estrela da IA; a
   descoberta no azul fraco, com o ícone da área e o selo do nível; e o
   teste no lima, que é a cor do "faça isto" no app. */
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
