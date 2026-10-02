import React, { useMemo, useState } from 'react';
import { View, Pressable, ScrollView, StyleSheet, useWindowDimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useStore } from '../../logic/store';

import {
  journeySummary, journeyChanges, journeyGoals, metaDePeso, timelineWeeks, timelineEvents, timelineCounts, weightSeries,
  startWeight, curWeight, temEvolucao,
  doseCycle, penStock, nextInjectionDate, coberturaDoEstoque,
  waterMlToday, litros, checkinToday, protocoloDaSemana, weekGrid, last7Days, M,
  sintomasDaSemana, diasDeSintomas, type Change, type TLEvent, type TLKind, type WeekMetric,
  diasAteAplicar, semanasDaGrade, temCiclo, diaDoTratamento, temHistoria,
  doseDiaria, temFasesDoCiclo, diasComDoseNaSemana, semanaDoTratamentoEm,
} from '../../logic/derive';
import { now, fmtDate, relDay, nf, quandoEm, startOfDay } from '../../logic/time';
import { destaquesDoPeriodo } from '../../logic/resumoDaSemana';
import { Txt, Row, SectionHead, Divider, ListRow, Metric, Vazio, Rolagem } from '../../ui/kit';
import { MetricasDaSemana, DestaquesDaSemana } from '../../ui/semanaEmNumeros';
import { Icon } from '../../ui/Icon';
import { AreaCurve } from '../../ui/charts';

import { useTheme } from '../../ui/useTheme';
import { useLarguraApp } from '../../ui/useLarguraApp';
import { useLightStatusBar } from '../../ui/useLightStatusBar';
import { radius, alfa, RESPIRO_ABAS } from '../../theme';
import { aguaTxt, pesoN, pesoTxt, pesoU } from '../../logic/medidas';
import { formaAtual, iconeDaDose } from '../../logic/formas';
import { T } from '../../textos';

/* ⚠️ É FUNÇÃO, e não constante de módulo: ela lê o catálogo, e constante
   de módulo congela o idioma no import. */
const K = () => T.home.telaJornada;

/* ============================================================
   JORNADA

   A Home é o painel do carro; esta tela é o álbum da viagem. Mas álbum
   não é desculpa para deixar de ser funcional: o bloco de cima responde
   "onde estou" de relance, e só depois a tela vira narrativa.

   O que dá coesão aqui é o CONTRASTE entre blocos, não a repetição de
   um mesmo cartão. A tela alterna, de propósito:
     painel sangrado  →  grade densa  →  fita horizontal  →  destaque

   O histórico completo NÃO mora aqui: quem abre a Jornada quer saber
   como vai, não auditar registros. A tela mostra o que o ciclo atual
   rendeu; a lista linha por linha fica em app/historico. */

const PAD = 24;
const FEED_SEMANAS = 3;

/* ------------------------------------------------------------------ */
/* Painel — sangra até as bordas e é o único bloco que quebra a margem,
   por isso ancora a tela inteira. */
function Painel() {
  const S = useStore((s) => s.S);
  const { c } = useTheme();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const largura = useLarguraApp();
  const r = journeySummary(S);
  /* ⚠️ TRÊS TONS, E NÃO DOIS. O par verde/vermelho não tem onde pôr
     "acelerado": perder mais de 1,5 kg por semana não é fracasso nem
     sucesso, é assunto para a equipe. Vermelho cobra; âmbar chama.

     ⚠️ E O TERCEIRO NÃO É VERMELHO, e chegou a ser. Vermelho cheio, do
     tamanho da etiqueta e em cima do hero, é a tela acusando alguém: a
     pessoa abre a Jornada para ver como vai, e a primeira cor que ela
     encontra diz que errou. Estar acima do peso inicial é um fato do
     período, não uma falta — e quem trata obesidade sabe que a semana em
     que a balança sobe é a semana em que as pessoas desistem.

     O teal não absolve nem acusa: ele é a única cor viva da paleta que
     não carrega juízo, e por isso é a que sobra para dizer "olha isto"
     sem dizer "você falhou".

     A tinta é o bg1 nos dois primeiros: no tema claro ela é branca sobre
     o verde e o âmbar escuros, no escuro é quase preta sobre os claros. O
     teal é a mesma cor nos dois temas, então a dele é o limeInk, que é a
     tinta escura fixa das superfícies acesas. */
  const tomDoVeredito = r.verdict.tom ?? (r.verdict.good ? 'bom' : 'ruim');
  /* ⚠️ A ETIQUETA VIROU VIDRO COM UM PONTO (28/09/2026, pedido do dono). A
     pastilha cheia em verde, âmbar ou teal era uma terceira cor saturada
     em cima do azul, disputando com o número. Vidro é o material das
     outras peças que se tocam neste painel; o tom mora num ponto, como a
     marca da aplicação sob os dias: lima quando é o ritmo escolhido,
     âmbar quando pede conversa, teal acima do início, e sem cor quando é
     só um fato. */
  const pontoDoVeredito =
    tomDoVeredito === 'bom' ? c.lime
      : tomDoVeredito === 'atencao' ? c.amber
        : tomDoVeredito === 'ruim' ? c.teal
          : null;
  const evoluiu = temEvolucao(S);
  const cyc = doseCycle(S);
  const serie = weightSeries(S);
  const nd = nextInjectionDate(S);
  const ndDays = diasAteAplicar(S);
  const dias = last7Days(S);
  const feitos = dias.filter((d) => d.feito).length;
  /* os dias que contam: os de antes da entrada no app não são falta */
  const diasVividos = dias.filter((d) => !d.antes).length;
  /* a contagem de semanas continua, agora só como frase: o número diz
     a constância longa que sete dias não alcançam */
  const { vividas, aplicadas } = semanasDaGrade(S);
  /* ⚠️ SEM CICLO, O PAINEL NÃO CONTA DOSE. Antes da primeira aplicação
     registrada a próxima é "hoje" por recuo (ver `temCiclo`), e o painel
     dizia "dose hoje", "0 de 1 semanas com aplicação" e "o efeito começa a
     subir nas próximas horas" a quem ainda não começou. */
  const comCiclo = temCiclo(S);
  const dia = diaDoTratamento(S);

  /* ============================================================
     O PAINEL DE QUEM TOMA TODO DIA (01/10/2026, partes B1 e B2 de
     docs/superpowers/specs/2026-10-01-oral-e-diario-design.md)

     ⚠️ A CONSTÂNCIA É DE DIAS, E NÃO DE SEMANAS. "4 de 4 semanas com
     dose" contava como cumprida a semana com um comprimido em sete — e
     afirmava isso a quem tinha perdido vinte de vinte e oito doses. Para
     quem toma todo dia a linha diz quantos dias DESTA SEMANA DO
     TRATAMENTO tiveram dose ("5 de 7 dias com dose"): a semana do
     "SEMANA N" logo acima, a mesma dos blocos de "Seu tratamento". Os dias
     contam até hoje, e hoje só depois da dose dele (`diasComDoseNaSemana`);
     no primeiro dia de uma semana, antes da dose, não há o que contar, e
     a linha fala só do check-in.

     ⚠️ O NÚMERO DA SEMANA É O DE AGORA, e não o `protocol.week` gravado:
     aquele só se refaz quando o aplicativo abre (logic/seed), e os blocos
     de "Seu tratamento" contam pelo relógio. Na virada da semana com o
     aplicativo aberto, o painel diria "SEMANA 4" em cima de um bloco
     "Semana 5". Para quem toma por semana, o mesmo de sempre.

     ⚠️ E O CICLO SEMANAL SAI: a faixa da fase ("Dia 1 depois da dose",
     todo dia), a porta para /ciclo e o "dose amanhã" da fileira, que
     seria a contagem regressiva de todo dia. A faixa de quem ainda não
     registrou a primeira dose fica — ela é o convite, e não uma fase. */
  const diaria = doseDiaria(S);
  const fases = temFasesDoCiclo(S);
  const semanaDoPainel = diaria ? semanaDoTratamentoEm(S, +now()) : r.semana;
  const doDiario = diaria && comCiclo ? diasComDoseNaSemana(S) : null;
  const linhaDosDias = doDiario
    ? (doDiario.dias > 0
      ? K().diasComCheckinEDose(feitos, diasVividos, doDiario.feitos, doDiario.dias)
      : K().diasComCheckinSo(feitos, diasVividos))
    : comCiclo ? K().diasComCheckin(feitos, diasVividos, aplicadas, vividas) : K().diasComCheckinSo(feitos, diasVividos);
  /* A faixa: a da fase, só no ciclo semanal; a do convite, sem ciclo. */
  const mostraFaixa = !comCiclo || fases;

  return (
    /* Sobe até o topo da tela: o rótulo da aba já diz "Jornada", então o
       espaço vira conteúdo. A safe area entra como padding interno.

       Azul saturado em gradiente. O app inteiro é claro, então a superfície
       de ênfase precisa se separar por SATURAÇÃO — lavagem clara sobre
       branco sumia no fundo e deixava de ler como card. O lima pontua os
       itens dentro: veredito, barra, curva e ciclo. */
    <View style={{ marginHorizontal: -PAD, paddingHorizontal: PAD, paddingTop: insets.top + 26, borderBottomLeftRadius: radius.xl, borderBottomRightRadius: radius.xl, overflow: 'hidden' }}>
      <LinearGradient
        colors={[c.panelFrom, c.panelMid, c.panelTo]}
        start={{ x: 0, y: 0 }} end={{ x: 0.85, y: 1 }}
        style={StyleSheet.absoluteFill}
      />
      {/* ---- peso: o número que a pessoa veio buscar ---- */}
      {/* Antes da primeira dose não há semana nem dia de tratamento: a
          linha diz o mesmo que a Home diz embaixo do nome. */}
      <Txt v="micro" c={c.onHero2} style={{ letterSpacing: 1.2 }}>
        {dia.antes ? dia.texto.toUpperCase() : K().semanaEDia(semanaDoPainel, r.dia)}
      </Txt>

      <Row style={{ alignItems: 'center', marginTop: 12 }}>
        {/* número inteiro em branco puro — é o destaque da tela, e recuar a
            fração aqui só enfraquecia o que mais importa */}
        {/* ⚠️ COM UMA PESAGEM, O PESO DE HOJE (28/09/2026). A variação dava
            "0,0 kg" em destaque, e a linha de baixo repetia o mesmo peso
            como início e como hoje — três vezes o mesmo número. Até a
            segunda pesagem, o destaque é o peso que existe. */}
        {evoluiu
          ? <Metric value={r.lostLabel} unit={pesoU(S)} v="hero" tone={c.onHero} dim={c.onHero} />
          : <Metric value={pesoN(S, curWeight(S))} unit={pesoU(S)} v="hero" tone={c.onHero} dim={c.onHero} />}
        <View style={{ flex: 1 }} />
        {/* A etiqueta emite um juízo, então precisa poder ser auditada: o
            toque abre /ritmo, que mostra de onde ela saiu e — mais
            importante — o que ela NÃO mede. */}
        {/* ⚠️ SÓ COM RITMO. Com uma pesagem, a conta dava zero quilo por
            semana e a etiqueta dizia "Ritmo mais lento" no primeiro dia.
            Ver `temRitmo`, em derive. */}
        {r.temRitmo ? (
        <Pressable onPress={() => router.push('/ritmo' as any)} hitSlop={6} style={({ pressed }) => [{ opacity: pressed ? 0.75 : 1 }]}>
          {/* A ETIQUETA É CHEIA, e era lima ou vidro.

              Sobre o gradiente azul não existe versão LAVADA de verde ou
              vermelho: o okBg some no azul e o ctaWeak, com oito por cento
              de tinta, é invisível. E o par lima/vidro que estava aqui
              dizia boa notícia com a cor de "alcançado" da casa e má
              notícia com ausência de cor — que lê como desligado, não como
              alerta.

              Cheia, a pastilha carrega o mesmo verde e vermelho das
              pastilhas la embaixo, e o marcador para de mudar de
              vocabulário dentro da mesma tela.

              A tinta é o bg1 e não um branco cravado: no tema claro ele é
              branco sobre o verde escuro, e no escuro é quase preto sobre
              o verde claro. Uma cor só, que vira duas onde precisa. */}
          <Row gap={7} style={{ backgroundColor: c.glass, borderWidth: 1, borderColor: c.glassLine, paddingLeft: pontoDoVeredito ? 11 : 13, paddingRight: 10, paddingVertical: 7, borderRadius: radius.pill }}>
            {pontoDoVeredito ? <View style={{ width: 7, height: 7, borderRadius: 4, backgroundColor: pontoDoVeredito }} /> : null}
            <Txt v="tag" c={c.onHero}>{r.verdict.label}</Txt>
            <Icon name="chev" size={11} color={c.onHero2} sw={2.4} />
          </Row>
        </Pressable>
        ) : null}
      </Row>

      {/* A curva vem colada no número — é a mesma informação em outra
          forma: quanto perdeu (número) e como perdeu (formato). A barra de
          progresso saiu; três gráficos num card era demais, e o que ela
          dizia cabe em texto. */}
      {/* Altura generosa de propósito: a variação semanal é de menos de
          1 kg contra uma amplitude de 7, então num gráfico baixo os platôs
          e as retomadas viram um pixel e a curva parece uma reta. */}
      {serie.length > 1 && (
        <View style={{ marginHorizontal: -PAD, marginTop: 16 }}>
          {/* padX 0: a curva encosta nas duas bordas da tela, como a de
              peso na Home. Com respiro lateral ela lia como gráfico dentro
              de um card — objeto sobre superfície. Sangrando, ela vira a
              própria superfície: o painel não CONTÉM a curva, ele É a
              curva com texto por cima. */}
          <AreaCurve pts={serie} height={84} width={largura} padT={6} padB={0} padX={0} strokeW={2}
            strokeFrom={c.lime} strokeTo={c.lime} id="jp" dashed={false} />
        </View>
      )}
      {/* Em 375 px os dois lados se encostavam ("hojefaltam 10,0 kg"): com
          vão e quebra, o "faltam" desce para a linha de baixo quando não
          cabe, em vez de colar no "hoje". */}
      <Row style={{ justifyContent: 'space-between', marginTop: 10, alignItems: 'baseline', flexWrap: 'wrap', columnGap: 12, rowGap: 2 }}>
        <Row gap={5} style={{ alignItems: 'baseline' }}>
          {/* ⚠️ O "kg" ESTAVA PREGADO NAS TRÊS LINHAS, e quem lê em libra
              via o número convertido com a unidade errada. `pesoTxt`
              escreve o valor e a unidade juntos — é o que o resto do
              aplicativo já usa. */}
          {evoluiu ? (
            <>
              <Txt v="caption" c={c.onHero2}>{K().noInicio(pesoTxt(S, startWeight(S)))}</Txt>
              <Txt v="caption" c={c.onHero2}>·</Txt>
              {/* o peso de hoje é o outro número que importa: fica em branco */}
              <Txt v="bodyMed" c={c.onHero}>{pesoTxt(S, curWeight(S))}</Txt>
              <Txt v="caption" c={c.onHero2}>{K().hoje}</Txt>
            </>
          ) : (
            <Txt v="caption" c={c.onHero2}>{K().primeiraPesagem}</Txt>
          )}
        </Row>
        <Txt v="caption" c={c.onHero2}>{K().faltam(`${r.faltamLabel} ${pesoU(S)}`)}</Txt>
      </Row>

      {/* ---- o calendário do tratamento ----

          Aqui morava o medidor do ciclo da dose: 56 riscos finos que
          enchiam da esquerda para a direita conforme os dias passavam.
          Ele estava tecnicamente correto e era a peça errada para esta
          aba. O ciclo da dose é um dado de HOJE — dura sete dias e
          zera —, e Jornada é a aba do ao longo do tempo. Um instrumento
          que reinicia toda semana não tem nada a dizer sobre uma
          história de dez.

          A primeira tentativa foi uma grade de todas as semanas do
          tratamento, sete por linha. Ela tinha o problema oposto: onze
          células cheias e três em branco viravam um bloco, e bloco não
          é leitura. Numa grade longa a célula de anteontem e a de três
          semanas atrás pesam igual — e só uma delas ainda pode ser
          corrigida hoje.

          Agora são sete dias, uma linha, ancorados em hoje à direita. A
          semana é a unidade em que a pessoa se lembra do que fez, e o
          check é a marca certa: ele não mede quanto, diz FEITO. Quem
          registrou vê a fileira marcada; quem falhou vê exatamente qual
          dia, e ainda dá tempo.

          O ciclo da dose não sumiu do app: ele continua em /ciclo, que é
          para onde este bloco leva.

          ⚠️ MENOS NA DOSE DIÁRIA (01/10/2026): sem cinco fases a contar, o
          bloco não leva a lugar nenhum — cada dia continua abrindo o seu. */}
      <Pressable
        onPress={() => router.push('/ciclo' as any)}
        disabled={diaria}
        style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1 }]}
      >
        <View style={{ marginTop: 40 }}>
          <Row style={{ justifyContent: 'space-between' }}>
            <Txt v="micro" c={c.onHero2} style={{ letterSpacing: 1 }}>
              {K().ultimos7}
            </Txt>
            {comCiclo && !diaria ? (
              <Txt v="tag" c={c.onHero}>
                {K().doseEm(quandoEm(ndDays).label)}
              </Txt>
            ) : null}
          </Row>

          <Row gap={7} style={{ marginTop: 14 }}>
            {/* Cada célula abre o dia dela; o resto da faixa continua
                levando a /ciclo. O caso que isto resolve é o mais comum de
                todos: lembrar na quarta que esqueceu de registrar a terça. */}
            {dias.map((d) => d.antes ? (
              /* Antes da entrada no aplicativo: a casa guarda o lugar, para a
                 fileira continuar ancorada em hoje, e não tem data nem toque. */
              <View key={d.t} style={{ flex: 1, alignItems: 'center' }}>
                <Txt v="micro" c={c.onHero2} style={{ marginBottom: 6, opacity: 0.35 }}>{d.dow}</Txt>
                <View style={{ width: '100%', aspectRatio: 1, borderRadius: 12, borderWidth: 1, borderColor: c.onHeroLine, borderStyle: 'dashed', opacity: 0.6 }} />
                <View style={{ height: 8 }} />
              </View>
            ) : (
              <Pressable
                key={d.t}
                onPress={() => router.push(`/dia?t=${d.t}` as any)}
                style={({ pressed }) => [{ flex: 1, alignItems: 'center', opacity: pressed ? 0.7 : 1 }]}
              >
                <Txt v="micro" c={c.onHero2} style={{ marginBottom: 6, opacity: d.hoje ? 1 : 0.7 }}>{d.dow}</Txt>
                <View
                  style={{
                    width: '100%', aspectRatio: 1, borderRadius: 12,
                    alignItems: 'center', justifyContent: 'center',
                    backgroundColor: d.feito ? c.lime : c.onHeroLine,
                    /* só hoje ganha contorno. Aqui a borda não separa
                       superfícies (princípio 4): aponta uma célula dentro
                       de uma fileira de iguais. */
                    ...(d.hoje && !d.feito ? { borderWidth: 1.5, borderColor: 'rgba(255,255,255,0.6)' } : null),
                  }}
                >
                  {d.feito
                    ? <Icon name="check" size={16} color={c.limeInk} sw={2.6} />
                    : <Txt v="micro" c={c.onHero2} style={{ opacity: 0.8 }}>{d.dia}</Txt>}
                </View>
                {/* a aplicação da semana é um ponto sob o dia, não outra
                    cor na célula: são dois fatos diferentes no mesmo dia,
                    e misturá-los na mesma marca apagaria os dois */}
                <View style={{ height: 8, justifyContent: 'center' }}>
                  {d.aplicou && <View style={{ width: 4, height: 4, borderRadius: 2, backgroundColor: c.onHero }} />}
                </View>
              </Pressable>
            ))}
          </Row>

          <Txt v="caption" c={c.onHero} style={{ marginTop: 8 }}>
            {linhaDosDias}
          </Txt>
        </View>
      </Pressable>

      {/* A dica da fase, no mesmo desenho da faixa de vidro do hero de
          Cuidado: círculo de 36 com o ícone, kicker em micro, frase em
          caption e chevron à direita. Eram dois cartões com a mesma
          função — a inteligência do app falando de dentro do hero — em
          dois desenhos diferentes, e isso obriga a pessoa a reconhecer
          duas vezes a mesma coisa.

          Levava ao Morphi com a pergunta da fase já digitada, e isso fazia
          sentido enquanto /ciclo não respondia: perguntar a uma IA era o
          caminho mais curto para "por que a fome voltou?". Agora a tela de
          ciclo abre nas quatro fases, com a de agora já expandida — a
          faixa leva para lá, que é a resposta direta em vez do caminho até
          ela. */}
      {/* Sem ciclo não há fase: a faixa diz de onde ele vai começar a
          contar, e o toque leva ao registro da primeira dose. */}
      {/* ⚠️ NA DOSE DIÁRIA COM DOSE REGISTRADA, A FAIXA NÃO EXISTE
          (01/10/2026, parte B1): a fase seria a mesma todo dia e a porta
          levaria a /ciclo, que é de uma semana. O pé do painel guarda o
          mesmo respiro que ela deixava embaixo. */}
      {mostraFaixa ? (
      <Pressable
        onPress={() => router.push((comCiclo ? '/ciclo' : '/aplicacao') as any)}
        style={({ pressed }) => [{ opacity: pressed ? 0.75 : 1, marginTop: 22, marginBottom: 26 }]}
      >
        <Row gap={12} style={{ backgroundColor: c.glass, borderWidth: 1, borderColor: c.glassLine, borderRadius: radius.lg, padding: 14 }}>
          <View style={{ width: 36, height: 36, borderRadius: 18, backgroundColor: 'rgba(255,255,255,0.16)', alignItems: 'center', justifyContent: 'center' }}>
            <Icon name="aura" size={16} color={c.onHero} sw={1.9} />
          </View>
          <View style={{ flex: 1 }}>
            <Txt v="micro" c={c.onHero2}>{(comCiclo ? cyc.phase.label : K().primeiraDose).toUpperCase()}</Txt>
            <Txt v="caption" c={c.onHero} style={{ marginTop: 2 }}>{comCiclo ? cyc.phase.hint : K().primeiraDoseTexto}</Txt>
          </View>
          <Icon name="chev" size={15} color={c.onHero2} sw={2} />
        </Row>
      </Pressable>
      ) : <View style={{ height: 26 }} />}

    </View>
  );
}

/* Tile de mudança — grade densa de 2 colunas. Forma diferente das linhas
   de lista, de propósito: quebra a monotonia entre blocos. */
/* ⚠️ A PASTILHA É VERDE, VERMELHA OU CINZA, e era lima ou cinza.

   Lima é a cor de "alcançado" da casa — ela marca meta batida, streak,
   check-in feito. Aqui o que a pastilha carrega não é conquista: é o
   estado de um marcador do corpo, que é a mesma pergunta que os exames
   respondem duas telas adiante. Verde e vermelho são o par que aquela
   tela já usa, e um marcador não pode mudar de vocabulário quando muda
   de tela.

   E o cinza continua existindo para o terceiro caso, que é o que o par
   verde/vermelho sozinho não sabe dizer: o número que não se mexeu. */
function ChangeTile({ ch, onPress }: { ch: Change; onPress: () => void }) {
  const { c } = useTheme();
  /* ⚠️ O TOM CONTINUA SE CHAMANDO 'ruim', E A COR NÃO É VERMELHA.

     O nome é do FATO — a notícia é má —, e a cor é de como se conta. O
     vermelho saiu da Jornada inteira pelo mesmo motivo que saiu do hero:
     ele acusa, e a semana em que a balança sobe é a semana em que as
     pessoas desistem. O teal marca sem cobrar.

     O par tem token — `tealBg`/`tealInk` —, e por um commit foi montado
     aqui na mão. Virou token quando o mesmo par apareceu na segunda tela:
     duas cópias de uma conta de cor é como começam as divergências. */
  const [fundo, tinta] = ch.tom === 'bom' ? [c.okBg, c.ok]
    : ch.tom === 'ruim' ? [c.tealBg, c.tealInk]
      : [c.bg2, c.tx3];
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [{ width: '49%', opacity: pressed ? 0.7 : 1 }]}>
      <View style={{ backgroundColor: c.bg1, borderRadius: radius.lg, padding: 18, marginBottom: 7 }}>
        <Row style={{ justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <Icon name={ch.ic} size={17} color={c.tx3} sw={1.8} />
          <View style={{ backgroundColor: fundo, paddingHorizontal: 8, paddingVertical: 3, borderRadius: radius.pill }}>
            <Txt v="tag" c={tinta}>{ch.delta}</Txt>
          </View>
        </Row>
        <Txt v="caption" c={c.tx3} style={{ marginTop: 20 }} numberOfLines={1}>{ch.label}</Txt>
        <Row gap={5} style={{ marginTop: 6, alignItems: 'baseline' }}>
          <Txt v="caption" c={c.tx4}>{ch.from}</Txt>
          <Icon name="chev" size={9} color={c.tx4} sw={2.6} />
          {/* peso regular, como nos demais cards — o destaque vem do
              tamanho e da pílula de variação, não do negrito */}
          <Metric value={ch.to} v="title" />
        </Row>
      </View>
    </Pressable>
  );
}

/* Destaques da semana — o que esta semana rendeu, não tudo que aconteceu.

   O histórico linha por linha existe, mas mora em tela própria: quem abre
   a Jornada quer saber como vai, não auditar registros. */
function Semana({ w, proxT, filtro, aberto, onToggle }: { w: any; proxT: number; filtro: TLKind | null; aberto: boolean; onToggle: () => void }) {
  const S = useStore((s) => s.S);
  const { c } = useTheme();
  const router = useRouter();
  const perdeu = w.deltaPeso?.startsWith('−');

  /* Aberta, a semana mostra o que os NÚMEROS daquele ciclo dizem —
     hidratação, proteína, exercício, peso — cada um comparado com a semana
     anterior, mais os acontecimentos que marcaram. Registro a registro
     fica em /historico.

     Com um tipo escolhido nos chips a semana não vira accordion: os
     registros daquele tipo aparecem direto, porque são poucos e é isso
     que a pessoa foi buscar. */
  /* ⚠️ OS DESTAQUES SAEM DA MESMA FONTE QUE A TELA DA SEMANA
     (destaquesDoPeriodo, em logic/resumoDaSemana), com a mesma janela por
     dia e a mesma ordem: o "Ver detalhes" abre essa tela, e o acordeão e
     ela mostravam destaques diferentes para o mesmo ciclo (achado da
     revisão de 01/10/2026). Nos filtros de tipo, a lista é de registros. */
  const destaques = filtro ? [] : destaquesDoPeriodo(S, +startOfDay(w.t), Number.isFinite(proxT) ? +startOfDay(proxT) : Infinity, false);
  const notaveis = filtro ? (w.eventos as TLEvent[]).filter((e) => e.kind === filtro) : [];
  const metricas: WeekMetric[] = filtro ? [] : w.metricas;
  const cor = (k: string) => (c as any)[k] as string;
  const expandido = filtro ? true : aberto;

  const Cabecalho = (
    <>
      <Row style={{ alignItems: 'center' }}>
        <Txt v="bodyMed" style={{ marginRight: 8 }}>{K().semana(w.semana)}</Txt>
        {!filtro && w.mudouDose && (
          <View style={{ backgroundColor: c.accentWeak, paddingHorizontal: 8, paddingVertical: 3, borderRadius: radius.pill, marginRight: 6 }}>
            <Txt v="tag" c={c.accent}>{K().doseAjustada}</Txt>
          </View>
        )}
        <View style={{ flex: 1 }} />
        {!filtro && w.deltaPeso && (
          <View style={{ backgroundColor: perdeu ? c.limeWeak : c.bg2, paddingHorizontal: 9, paddingVertical: 3, borderRadius: radius.pill }}>
            <Txt v="tag" c={perdeu ? c.limeInk : c.tx3}>{w.deltaPeso}</Txt>
          </View>
        )}
        {!filtro && (
          <View style={{ marginLeft: 10 }}>
            <Icon name={aberto ? 'chevup' : 'chevdown'} size={15} color={c.tx4} sw={2} />
          </View>
        )}
      </Row>
      {/* ⚠️ NA DOSE DIÁRIA, O CABEÇALHO CONTA OS DIAS COM DOSE (01/10/2026,
          parte B2): a semana é um bloco de 7 dias do tratamento, e a linha
          diz "6 de 7 doses · Rybelsus 7 mg" no lugar de "dose · local" —
          que seriam sete (logic/derive, `timelineWeeks`). A contagem só
          existe no bloco diário; na semana semanal, e na semana de caneta
          de quem trocou para o comprimido, a linha é a de sempre. */}
      <Txt v="caption" c={c.tx3} style={{ marginTop: 5 }}>
        {filtro ? fmtDate(new Date(w.t)) : [w.dosesTexto, w.dose, w.site].filter(Boolean).join(' · ')}
      </Txt>
      {!filtro && <Txt v="caption" c={c.tx4} style={{ marginTop: 3 }} numberOfLines={1}>{w.resumo}</Txt>}
    </>
  );

  /* Sem caixas dentro de caixa: o conteúdo aberto respira no próprio card
     da lista, separado por espaço e por um filete à esquerda. A grade e os
     destaques moram em ui/semanaEmNumeros, porque o resumo da semana
     (app/leitura) mostra o mesmo. */
  const Corpo = (
    <View style={{ marginTop: 14 }}>
      <MetricasDaSemana metricas={metricas} />

      <DestaquesDaSemana itens={[
        ...destaques.map((d) => ({ ...d, cor: cor(d.cor) })),
        ...notaveis.map((ev) => ({ k: ev.key, ic: ev.ic, cor: cor(ev.color), titulo: ev.title, sub: ev.sub })),
      ]} />

      {metricas.length === 0 && destaques.length === 0 && notaveis.length === 0 && (
        <Txt v="caption" c={c.tx4}>{K().semRegistrosNaSemana}</Txt>
      )}

    </View>
  );

  if (filtro) {
    return <View style={{ paddingVertical: 16 }}>{Cabecalho}{Corpo}</View>;
  }
  /* ⚠️ O ACORDEÃO É O RESUMO, E O RESUMO DA SEMANA É O DETALHE (01/10/2026,
     pedido do dono). "Ver detalhes" abre a mesma tela do "Resumo da
     semana" do Insights (app/leitura), no ciclo N (`?s=`): os números
     deste acordeão, os dias, os destaques, como se sentiu, o dia a dia e
     a nota da consulta. Nos filtros de tipo ele não aparece: ali a lista
     é de registros.

     ⚠️ O LINK MORA FORA DO ALVO QUE ABRE E FECHA. Dentro dele, o iOS faz
     do cartão inteiro um elemento só para o VoiceOver, e o link sumia: o
     toque duplo só fechava a semana (achado da revisão de 01/10/2026). É
     o mesmo arranjo de ui/termosDoAceite. */
  return (
    <View style={{ paddingVertical: 16 }}>
      <Pressable
        onPress={onToggle}
        accessibilityRole="button"
        accessibilityState={{ expanded: aberto }}
        style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1 }]}
      >
        {Cabecalho}
        {expandido && Corpo}
      </Pressable>
      {expandido ? (
        <Pressable
          onPress={() => router.push(`/leitura?s=${w.semana}` as any)}
          hitSlop={8}
          accessibilityRole="link"
          style={({ pressed }) => [{ alignSelf: 'flex-start', marginTop: 14, opacity: pressed ? 0.6 : 1 }]}
        >
          <Row gap={4}>
            <Txt v="label" c={c.accent2}>{K().verDetalhes}</Txt>
            <Icon name="chev" size={13} color={c.accent2} sw={2.2} />
          </Row>
        </Pressable>
      ) : null}
    </View>
  );
}


/* ------------------------------------------------------------------ */
export default function Jornada() {
  const S = useStore((s) => s.S);
  const { c } = useTheme();
  const router = useRouter();
  const go = (to: string) => () => router.push(to as any);

  useLightStatusBar();
  const [filtro, setFiltro] = useState<TLKind | null>(null);
  const [abertas, setAbertas] = useState<Record<number, boolean>>({});
  const [todasSemanas, setTodasSemanas] = useState(false);

  const r = journeySummary(S);
  const changes = journeyChanges(S);
  const semanas = useMemo(() => timelineWeeks(S), [S]);
  /* A de peso vem primeiro porque é a que traz a pessoa para cá. Ela
     mora fora de `journeyGoals` — ver a nota lá — e cada tela decide se
     a mostra; a de Metas não mostra, porque já a tem na capa. */
  const metas = [metaDePeso(S), ...journeyGoals(S)].filter(Boolean) as ReturnType<typeof journeyGoals>;
  const eventos = useMemo(() => timelineEvents(S), [S]);
  /* ⚠️ CONSULTA NÃO VIRA FILTRO AQUI, e o evento continua existindo.

     "Seu tratamento" filtra o que se REPETE: check-in, refeição,
     aplicação, pesagem — dezenas de linhas cada, e é isso que faz um
     filtro valer. Consulta são duas em três meses, e a aba abria uma lista
     de dois itens que a pessoa já tinha visto na semana onde eles caíram.

     E ela tem tela própria: /consultas, com preparo, resumo e receita.
     Uma segunda porta menor, no meio de uma fila de chips, é a
     desimportância dizendo o contrário do que a outra tela diz.

     O evento fica na linha do tempo: dentro de "Por semana" ele é um
     destaque do ciclo, que é onde consulta pertence. */
  const contagens = useMemo(
    () => timelineCounts(S).filter((f) => f.kind !== 'consulta'),
    [S],
  );
  const cor = (k: string) => (c as any)[k] as string;

  const semanasVisiveis = todasSemanas ? semanas : semanas.slice(0, FEED_SEMANAS);
  const filtrados = filtro ? eventos.filter((e) => e.kind === filtro) : [];
  const pen = penStock(S);
  const ci = checkinToday(S);
  const mlHoje = waterMlToday(S);
  const proto = protocoloDaSemana(S);

  /* SINTOMAS ENTRA NA LISTA, e por isso ela não se chama mais só de
     hábitos.

     A tela existia, estava registrada no Stack e NENHUMA outra empurrava
     para ela: dava para chegar lá digitando a rota. É metade do
     tratamento — o que a caneta causa — sem porta, enquanto água e
     exercício têm a sua nesta mesma lista.

     O subtítulo diz o sintoma mais presente da semana, e distingue os
     dois silêncios: quem não respondeu lê 'sem registro', quem respondeu
     e não teve nada lê 'sem queixas'. */
  const sint = sintomasDaSemana(S);
  const diasSint = diasDeSintomas(S);
  /* Quais eventos da lista filtrada estão abertos. Mora aqui e não no
     item porque a lista se remonta a cada troca de filtro, e estado
     dentro de um item que some não sobrevive à volta dele. */
  const [eventosAbertos, setEventosAbertos] = useState<Record<string, boolean>>({});
  const vitais = ['pa', 'glic', 'fc', 'spo2', 'fr']
    .filter((k) => (((S.vitals as any)?.[k] ?? []) as any[]).length).length;
  const temas: [string, string, string, string][] = [
    ['utensils', T.alimentacao.tela.titulo, K().refeicoesContadas(S.meals.length), '/alimentacao'],
    /* A água ia para o MENU de registros enquanto as vizinhas iam para a
       tela do próprio hábito: era a única linha desta lista que não
       levava a lugar nenhum sobre si mesma. E o número usava um
       formatador próprio, que escrevia 1,8 L onde a tela de água escreve
       1,75 L. */
    /* ⚠️ A CONDIÇÃO ERA `ci`, E O NÚMERO É OUTRA CONTA.

       `ci` só diz que EXISTE linha de hoje, e a linha nasce em qualquer
       registro — uma refeição, um treino, um copo. O volume vem de
       `waterMlToday`, que lê os goles e a água da comida. Duas contas
       diferentes decidindo uma frase só: quem registrou o almoço e não
       bebeu nada lia "0 L hoje", que é o aplicativo AFIRMANDO zero sobre
       um dia em que ele não sabe de nada.

       A vizinha de baixo já fazia certo — `ci && ci.exerc` —, e o
       comentário de Sintomas, vinte linhas acima, escreve a regra com
       todas as letras: distinguir os dois silêncios. Agora quem decide é
       o mesmo número que aparece. */
    ['water', T.home.semana.hidratacao, mlHoje > 0 ? K().aguaHoje(aguaTxt(S, mlHoje)) : K().semRegistro, '/agua'],
    ['dumbbell', T.tratamento.telaExercicio.titulo, ci && ci.exerc ? K().minutosHoje(ci.exerc) : K().semRegistro, '/exercicio'],
    ['waves', T.resumo.sintomas, !diasSint ? K().semRegistro
      : !sint.length ? K().semQueixas
      : K().sintomaEmDias(sint[0].label, sint[0].dias), '/sintomas'],
    /* Contado por protocoloDaSemana, e não somando os `done`: os itens
       medidos não têm esse campo — eles se cumprem pelos registros. */
    ['target', K().protocolos, K().feitasDeTotal(proto.feitas, proto.total), '/protocolos'],
    /* ⚠️ SAÚDE E FOTOS ENTRARAM PORQUE NÃO TINHAM PORTA NENHUMA.

       /saude era alcançável por um lugar só — a pastilha de Pressão em "O
       que já mudou" —, e ela só existe com duas medidas guardadas. Quem
       nunca registrou pressão não tinha como chegar na tela que serve
       justamente para registrar a primeira.

       É o mesmo defeito que /exames tinha, e a razão de ele se repetir é
       sempre a mesma: a porta nasce no fluxo que produz o dado, e o fluxo
       que produz o dado só roda para quem já tem o dado.

       (A porta de /fotos morava aqui também, e saiu junto com a foto de
       progresso — ver a nota do recurso, em seed.ts.) */
    /* ⚠️ O CARTÃO SE CHAMA COMO A TELA QUE ELE ABRE, e se chamava
       "Saúde" — um nome largo demais para um app em que tudo é saúde. A
       tela é "Sinais vitais", e o nome dela diz o que tem lá dentro.

       ⚠️ E O SUBTÍTULO DEIXOU DE SER A PRESSÃO. "127/82 mmHg" solto num
       cartão chamado Saúde não diz de que número se trata nem se ele
       está bom — é um dado clínico sem a régua ao lado, que é
       exatamente o que esta tela toda evita. A contagem de indicadores
       diz o que a pessoa vai encontrar, que é o trabalho de um
       subtítulo de porta. */
    ['heart', K().sinaisVitais, vitais ? K().indicadores(vitais) : K().semRegistro, '/saude'],
  ];

  return (
    <View style={{ flex: 1, backgroundColor: c.bg }}>
      <Rolagem showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: RESPIRO_ABAS, paddingHorizontal: PAD }}>
        <Painel />

        {/* Estoque: é lembrete de reposição, não emergência clínica. Em
            vermelho parecia alarme grave — fica em azul, que é a cor de
            ação do app. O vermelho continua reservado para o que de fato
            precisa de atenção imediata. */}
        {!pen.verdict.good && (
          <Pressable onPress={go('/caneta')} style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1 }]}>
            <Row gap={12} style={{ backgroundColor: c.bg1, borderRadius: radius.lg, padding: 16, marginTop: 20 }}>
              <View style={{ width: 34, height: 34, borderRadius: radius.sm, backgroundColor: c.accentWeak, alignItems: 'center', justifyContent: 'center' }}>
                <Icon name="pill" size={17} color={c.accent} sw={1.9} />
              </View>
              <View style={{ flex: 1 }}>
                <Txt v="body">{pen.verdict.label}</Txt>
                <Txt v="caption" c={c.tx3} style={{ marginTop: 1 }}>
                  {/* em dias ou semanas — "cerca de 0 semanas" para três
                      comprimidos era o que se lia aqui (02/10/2026) */}
                  {K().dosesRestantes(pen.left, coberturaDoEstoque(S, pen))}
                </Txt>
              </View>
              <Icon name="chev" size={14} color={c.tx4} sw={2} />
            </Row>
          </Pressable>
        )}

        {/* ---------- O QUE JÁ MUDOU — grade densa ---------- */}
        <View style={{ marginTop: 34 }}>
          <SectionHead title={K().oQueJaMudou} link={K().evolucao} onPress={go('/evolucao')} />
          {/* Sem o que comparar, a seção diz quando passa a ter — e o
              link do cabeçalho continua levando a Evolução, onde moram
              fotos e medidas. */}
          {changes.length ? (
            <Row style={{ flexWrap: 'wrap', justifyContent: 'space-between', marginTop: 14 }}>
              {changes.map((ch) => <ChangeTile key={ch.label} ch={ch} onPress={go(ch.to_)} />)}
            </Row>
          ) : (
            <Txt v="caption" c={c.tx3} style={{ marginTop: 12 }}>{K().oQueJaMudouVazio}</Txt>
          )}
          {/* Aqui havia três atalhos (Fotos, Metas, Saúde). Tentei como
              pílula e como linha de navegação, e nenhum dos dois assentou:
              o problema não era o estilo, era a redundância. Os três moram
              em Evolução, que já é o link do cabeçalho desta seção — e a
              pressão arterial já aparece como tile, levando a Saúde. */}
        </View>

        {/* ---------- METAS — a linha de chegada ----------
            As outras seções olham para trás. Esta é a única que aponta
            para onde a pessoa quer chegar, e por isso vem logo depois do
            que já mudou: passado e destino lado a lado. */}
        <View style={{ marginTop: 34 }}>
          {/* O LINK DIZ O NOME DO DESTINO, e dizia "Ver todas" — que é uma
              instrução, não um lugar. É a mesma regra que tirou o "Ir para"
              dos botões da Home. E o título ganhou o possessivo das
              vizinhas: "O que já mudou", "Seu tratamento", "Suas metas". */}
          <SectionHead title={K().suasMetas} link={K().metas} onPress={go('/metas')} />

          {/* ⚠️ FILEIRA DE CARTÕES, E ERA UMA LISTA EMPILHADA.

              Quatro metas em linhas de 16 px de respiro, cada uma com
              rótulo, porcentagem, barra e dica, ocupavam quase uma dobra
              inteira da aba — e a Jornada é a tela mais longa do
              aplicativo, com o que já mudou, o tratamento, o dia a dia e
              a história ainda por baixo.

              O que a seção precisa responder de relance é "como vão as
              minhas metas", e isso cabe num cartão pequeno: o nome, o
              número e a barra. A dica — "9 de 13 noites registradas" —
              some daqui e continua na tela de Metas, que é onde se olha
              uma meta de perto.

              ⚠️ E A FILEIRA ROLA, EM VEZ DE QUEBRAR EM GRADE. Meta é lista
              aberta: são três hoje e podem ser seis depois de a pessoa
              criar as suas. Em grade de dois, seis metas viram três
              fileiras e a seção volta a ocupar a dobra que ela acabou de
              devolver. Rolando, seis custam o mesmo que três. */}
          <Rolagem
            horizontal
            showsHorizontalScrollIndicator={false}
            style={{ marginTop: 14, marginHorizontal: -PAD }}
            contentContainerStyle={{ paddingHorizontal: PAD, gap: 10 }}
          >
            {/* ⚠️ SEM META NENHUMA, UM CONVITE (01/10/2026). Quem quer manter o
                peso não tem meta de peso, e uma conta nova não tem as suas:
                sobrava o título e uma fileira vazia. A seção é porta para
                /metas, então o lugar do primeiro cartão vira o convite. */}
            {!metas.length ? (
              <Pressable onPress={go('/metas')} style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1 }]}>
                <View style={{ width: 200, backgroundColor: c.bg1, borderRadius: radius.lg, padding: 15, gap: 8 }}>
                  <Icon name="plus" size={16} sw={2.2} color={c.accent} />
                  <Txt v="label" c={c.accent}>{K().metasVaziasTitulo}</Txt>
                  <Txt v="micro" c={c.tx3} style={{ lineHeight: 16 }}>{K().metasVaziasTexto}</Txt>
                </View>
              </Pressable>
            ) : null}
            {metas.map((m) => {
              const feita = !!(m as any).feita;
              const pessoal = !!(m as any).pessoal;
              const cheia = m.pct >= 100;
              return (
                <View
                  key={m.id}
                  style={{ width: 142, backgroundColor: c.bg1, borderRadius: radius.lg, padding: 15, gap: 10 }}
                >
                  <Row style={{ justifyContent: 'space-between', alignItems: 'center' }}>
                    <Icon
                      name={feita ? 'check' : m.ic} size={16} sw={1.9}
                      /* ⚠️ META CUMPRIDA SAI EM LIMA, e saía em azul. Azul é
                         a cor de AÇÃO deste app — é o que leva a algum
                         lugar —, e uma meta fechada não leva a lugar
                         nenhum: ela já aconteceu. */
                      color={feita || cheia ? c.limeSoftInk : c.tx3}
                    />
                    {/* A PESSOAL NÃO TEM PORCENTAGEM. Ela é uma coisa que
                        acontece num dia: 0% ou 100% seria a caixinha dita
                        em número. No lugar dela vai o estado, em palavra. */}
                    <Txt v="micro" c={feita || cheia ? c.limeSoftInk : c.tx3}>
                      {pessoal ? (feita ? K().metaFeita : K().metaAberta) : `${Math.round(m.pct)}%`}
                    </Txt>
                  </Row>

                  {/* Duas linhas de altura fixa: sem isso "Vestir a calça
                      jeans antiga" empurra a barra dele para baixo da dos
                      vizinhos, e a fileira fica com os cartões desalinhados
                      por dentro. */}
                  <Txt v="caption" numberOfLines={2} style={{ minHeight: 42, lineHeight: 21 }}>{m.label}</Txt>

                  {/* A barra some na pessoal, e não vira uma barra vazia:
                      não existe sessenta por cento de caber numa calça. */}
                  {pessoal ? null : (
                    <View style={{ height: 5, borderRadius: radius.pill, backgroundColor: c.bg2, overflow: 'hidden' }}>
                      <View style={{ width: `${Math.max(2, m.pct)}%`, height: 5, borderRadius: radius.pill, backgroundColor: cheia ? c.lime : c.accent }} />
                    </View>
                  )}
                </View>
              );
            })}
          </Rolagem>
        </View>

        {/* ---------- O DIA A DIA — uma porta por assunto ----------

             Chamava-se "Hábitos", e o link do cabeçalho levava a
             Protocolos — que é um dos tiles logo abaixo. Duas portas para
             a mesma sala, a de cima escrita menor. Com Sintomas na lista o
             título também deixou de valer: o que a caneta causa não é
             hábito de ninguém. */}
        <View style={{ marginTop: 34 }}>
          <SectionHead title={K().oDiaADia} />
          <Row style={{ flexWrap: 'wrap', justifyContent: 'space-between', marginTop: 14 }}>
            {temas.map(([ic, t, sub, to]) => (
              <Pressable key={t} onPress={go(to)} style={({ pressed }) => [{ width: '49%', opacity: pressed ? 0.7 : 1 }]}>
                <View style={{ backgroundColor: c.bg1, borderRadius: radius.lg, padding: 18, marginBottom: 7 }}>
                  <Icon name={ic} size={17} color={c.tx3} sw={1.8} />
                  <Txt v="bodyMed" style={{ marginTop: 18 }}>{t}</Txt>
                  <Txt v="micro" c={c.tx3} style={{ marginTop: 4 }} numberOfLines={1}>{sub}</Txt>
                </View>
              </Pressable>
            ))}
          </Row>
        </View>

        {/* ⚠️ A FITA DE MARCOS SAIU DAQUI, e ela era a seção entre as metas
            e a história.

            Dois motivos, e o segundo é o que decide.

            A parte de CONQUISTA não combinava com esta aba. A Jornada
            responde "como vai o meu tratamento", e uma fita de troféus é
            outro registro: ela premia, e o resto da tela mede. Foi para o
            perfil, que é onde a pessoa vai olhar para si e não para o
            tratamento.

            E o que sobrava depois de tirar as conquistas era quase tudo
            duplicata do que vem logo abaixo: consulta, exame e mudança de
            dose já estão em "Seu tratamento", com filtro por tipo e com o
            check-in abrindo. Dois desenhos da mesma lista, um deles sem
            filtro e sem abrir, separados por trinta pixels.

            Sobravam dois marcos que a linha do tempo não tem — o início do
            tratamento e os 5% do peso. Eles continuam existindo:
            `milestones` segue alimentando os destaques de cada semana,
            dentro do acordeão de "Por semana". */}

        {/* ---------- A HISTÓRIA — por semana, com destaques ----------
            Só com uma semana para contar — ver `temHistoria`. */}
        {temHistoria(S) ? (
        <View style={{ marginTop: 34 }}>
          <SectionHead title={K().seuTratamento} link={K().verTudo} onPress={go('/historico')} />
          <Txt v="note" c={c.tx3} style={{ marginTop: 4 }}>
            {K().semanaASemana}
          </Txt>

          {/* ⚠️ A TINTA DA ESCOLHIDA É `bg1`, E ERA `onHero`.

              A pastilha escolhida é a superfície invertida: no claro ela
              é preta, no escuro é branca — `c.tx` é a cor do TEXTO, e no
              escuro o texto é branco. `onHero` é branco fixo, porque
              existe para escrever sobre a aurora, que é escura nos dois
              temas. Sobre a pastilha invertida isso dava branco no branco:
              no escuro a aba escolhida ficava ilegível, e só a contagem
              em lima aparecia — mal, que lima sobre branco é quase nada.

              `bg1` é o par natural de `tx`: a superfície contra a qual
              aquela tinta foi escolhida para ler. Ela se inverte junto, e
              é o que o balão da régua de exames já usava. A contagem é a
              mesma tinta a 70%, como o balão faz com a unidade e a data.

              ⚠️ ISSO TIRA A LIMA DA CONTAGEM TAMBÉM NO CLARO. A lima é a
              cor do ALCANÇADO — sequência, barra de proteína, "PARA
              HOJE" —, e quantos check-ins existem não é conquista
              nenhuma. Ela não tinha par no escuro porque não tinha
              trabalho a fazer em nenhum dos dois. */}
          <Rolagem horizontal showsHorizontalScrollIndicator={false}
            style={{ marginTop: 14, marginHorizontal: -PAD }}
            contentContainerStyle={{ paddingHorizontal: PAD, gap: 6 }}>
            <Pressable onPress={() => setFiltro(null)}>
              <Row gap={6} style={{ backgroundColor: filtro === null ? c.tx : c.bg1, paddingHorizontal: 14, paddingVertical: 9, borderRadius: radius.pill }}>
                <Txt v="label" c={filtro === null ? c.bg1 : c.tx2}>{K().porSemana}</Txt>
                <Txt v="micro" c={filtro === null ? alfa(c.bg1, 0.7) : c.tx4}>{semanas.length}</Txt>
              </Row>
            </Pressable>
            {contagens.map((f) => {
              const on = filtro === f.kind;
              return (
                <Pressable key={f.kind} onPress={() => setFiltro(on ? null : f.kind)}>
                  <Row gap={6} style={{ backgroundColor: on ? c.tx : c.bg1, paddingHorizontal: 14, paddingVertical: 9, borderRadius: radius.pill }}>
                    <Txt v="label" c={on ? c.bg1 : c.tx2}>{f.label}</Txt>
                    <Txt v="micro" c={on ? alfa(c.bg1, 0.7) : c.tx4}>{f.n}</Txt>
                  </Row>
                </Pressable>
              );
            })}
          </Rolagem>

          {filtro === null && !semanas.length ? (
            /* ⚠️ SEM APLICAÇÃO, NÃO HÁ SEMANA (01/10/2026). A seção abre com
               check-ins ou refeições (`temHistoria`), mas as semanas contam
               de uma aplicação à outra: sem nenhuma, sobrava "Por semana 0"
               e um cartão em branco. É porta de entrada, então explica e
               leva a registrar.

               ⚠️ O DESENHO E O BOTÃO SEGUEM A FORMA (01/10/2026): era uma
               seringa e "Registrar aplicação" escrito à mão. O botão é o
               título da folha que ele abre ("Registrar dose"). */
            <View style={{ backgroundColor: c.bg1, borderRadius: radius.lg, marginTop: 14 }}>
              <Vazio ic={iconeDaDose(S)} titulo={K().semanasVaziasTitulo} texto={K().semanasVaziasTexto}
                acao={T.tratamento.telaRegistrarAplicacao.registrar(formaAtual(S).acao)} onAcao={go('/aplicacao')} />
            </View>
          ) : filtro === null ? (
            /* "Por semana" é a única aba que agrupa por ciclo — é o que
               dá sentido a ela existir como aba própria. */
            <>
              <View style={{ backgroundColor: c.bg1, borderRadius: radius.lg, marginTop: 14, paddingHorizontal: 18, paddingVertical: 2 }}>
                {semanasVisiveis.map((w, i) => (
                  <React.Fragment key={w.semana}>
                    {i > 0 && <Divider />}
                    <Semana w={w} proxT={semanas[semanas.indexOf(w) - 1]?.t ?? Infinity}
                      filtro={null}
                      aberto={!!abertas[w.semana]}
                      onToggle={() => setAbertas((a) => ({ ...a, [w.semana]: !a[w.semana] }))} />
                  </React.Fragment>
                ))}
              </View>
              {!todasSemanas && semanas.length > FEED_SEMANAS && (
                <Pressable onPress={() => setTodasSemanas(true)} style={({ pressed }) => [{ opacity: pressed ? 0.6 : 1 }]}>
                  <Row gap={6} style={{ justifyContent: 'center', paddingVertical: 16 }}>
                    <Txt v="label" c={c.accent2}>{K().verAsSemanas(semanas.length)}</Txt>
                    <Icon name="chevdown" size={14} color={c.accent2} sw={2.2} />
                  </Row>
                </Pressable>
              )}
            </>
          ) : (
            filtrados.length === 0 ? (
            /* Sem o cartão, e não com o cartão vazio por dentro: um
               retângulo branco com uma frase cinza no meio parece a lista
               que não carregou. */
            <Vazio ic="filter" titulo={K().nadaNesteTipo} />
          ) : (
            /* Nos filtros de tipo o ciclo não é a unidade — a leitura é
               cronológica, do mais recente para trás. */
            <View style={{ backgroundColor: c.bg1, borderRadius: radius.lg, marginTop: 14, paddingHorizontal: 16, paddingVertical: 4 }}>
              {/* ⚠️ O EVENTO COM RESPOSTA ABRE, e nenhum abria.

                  O check-in mostrava três acumuladores e uma palavra de
                  humor. O resto do que a pessoa respondeu — enjoo, fome,
                  energia, intestino, o sintoma que ela digitou — estava
                  guardado e sem tela nenhuma: ela respondeu e nunca mais
                  viu. Num aplicativo que pede registro todo dia, isso é o
                  contrato quebrado do lado de cá.

                  Só quem TEM o que mostrar vira botão. Peso, refeição e
                  aplicação continuam linhas de leitura, sem seta e sem
                  toque — seta que abre o vazio é pior do que linha
                  parada. */}
              {filtrados.slice(0, 30).map((ev, i) => {
                const temResposta = !!ev.respostas?.length;
                const aberto = !!eventosAbertos[ev.key];
                const corpo = (
                  <>
                    <Row style={{ alignItems: 'flex-start', paddingTop: 14, paddingBottom: aberto ? 10 : 14 }}>
                      <View style={{ width: 32, height: 32, borderRadius: 16, backgroundColor: cor(ev.color) + '1F', alignItems: 'center', justifyContent: 'center' }}>
                        <Icon name={ev.ic} size={15} color={cor(ev.color)} sw={1.9} />
                      </View>
                      <View style={{ flex: 1, marginLeft: 12 }}>
                        <Row style={{ justifyContent: 'space-between' }}>
                          <Txt v="body" style={{ flex: 1, marginRight: 8 }}>{ev.title}</Txt>
                          {ev.value ? <Txt v="micro" c={ev.valueColor ? cor(ev.valueColor) : c.tx4}>{ev.value}</Txt> : null}
                          {temResposta ? (
                            <Icon name={aberto ? 'chevup' : 'chevdown'} size={14} color={c.tx4} sw={2} />
                          ) : null}
                        </Row>
                        <Txt v="caption" c={c.tx3} style={{ marginTop: 2 }} numberOfLines={1}>{ev.sub}</Txt>
                        <Txt v="micro" c={c.tx4} style={{ marginTop: 4, textTransform: 'capitalize' }}>{relDay(new Date(ev.day))}</Txt>
                      </View>
                    </Row>
                    {aberto && temResposta ? (
                      /* Recuado até a coluna do título: aberto, o bloco é
                         continuação daquela linha, e não um item novo. */
                      <View style={{ marginLeft: 44, paddingBottom: 14, gap: 7 }}>
                        {ev.respostas!.map((r) => (
                          <Row key={r.k} style={{ justifyContent: 'space-between', alignItems: 'flex-start' }} gap={12}>
                            <Txt v="micro" c={c.tx4}>{r.k}</Txt>
                            <Txt v="micro" c={c.tx2} style={{ flex: 1, textAlign: 'right' }}>{r.v}</Txt>
                          </Row>
                        ))}
                      </View>
                    ) : null}
                  </>
                );
                return (
                  <React.Fragment key={ev.key}>
                    {i > 0 && <Divider />}
                    {temResposta ? (
                      <Pressable
                        onPress={() => setEventosAbertos((a) => ({ ...a, [ev.key]: !a[ev.key] }))}
                        style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1 }]}
                      >
                        {corpo}
                      </Pressable>
                    ) : corpo}
                  </React.Fragment>
                );
              })}
            </View>
          ))}
        </View>
        ) : null}

      </Rolagem>
    </View>
  );
}
