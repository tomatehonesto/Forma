import React, { useState } from 'react';
import { View } from 'react-native';
import { useRouter } from 'expo-router';
import { useStore } from '../logic/store';
import {
  EXAM_CATS, examBy, examLast, examFirst, examStatus, examGaugeData,
  examExplain, examAbout, examInfluences, SOBRE_A_REFERENCIA,
} from '../logic/derive';
import { fmtDate, MO_LONG, nf } from '../logic/time';
import { Txt, Row, Rich } from '../ui/kit';
import { Icon } from '../ui/Icon';
import { AskCompanion } from '../ui/Ask';
import {
  TelaInterna, Titulao, Bloco, Cartao, Linha, Aviso, Botao, Selo,
} from '../ui/internas';
import { useTheme } from '../ui/useTheme';
import { radius, shadowCard, alfa } from '../theme';

/* ============================================================
   EXAMES

   Duas telas em uma: a lista de marcadores por categoria e o detalhe de um
   deles. O detalhe é estado, não rota — por isso a seta de voltar dele
   desfaz a seleção em vez de desempilhar. Sem isso, fechar um marcador
   jogaria a pessoa para fora de Exames inteiro.

   A régua (Gauge) é a peça que justifica esta tela existir. Um resultado de
   exame sozinho não diz nada a quem não é médico: 5,6% é bom ou ruim? A
   régua responde mostrando ONDE o valor caiu dentro da faixa de referência,
   que é a única leitura que a pessoa consegue fazer sem formação.
   ============================================================ */

const fmtV = (v: number) => nf(v, v % 1 ? 1 : 0);
const porExtenso = (t: number) => { const d = new Date(t); return `${d.getDate()} de ${MO_LONG[d.getMonth()]}`; };

/* A RÉGUA RESPONDE DUAS COISAS DE UMA VEZ: ONDE EU PRECISO ESTAR, E
   ONDE EU ESTOU.

   ⚠️ E ELA JÁ FOI UMA BARRA, DEPOIS UM PONTILHADO CHAPADO, e as duas
   respondiam só a segunda.

   A barra prometia precisão que o dado não tem — trilho contínuo com um
   marcador convida a ler a posição exata, e a posição exata não quer
   dizer nada: a faixa é do laboratório, varia de um para outro, e estar
   em 5,5 ou 5,6 dentro dela é a mesma informação.

   O pontilhado chapado consertou isso e parou no meio do caminho: a
   faixa virava uma região de um tom só, que diz "dentro ou fora" e mais
   nada. Mas estar dentro tem graus — encostado no limite não é a mesma
   coisa que no meio da faixa, e essa é justamente a diferença que a
   pessoa quer ver quando volta a olhar o exame três meses depois.

   ⚠️ ENTÃO A INTENSIDADE É A DISTÂNCIA ATÉ O LIMITE MAIS PRÓXIMO. Ponto
   mais forte é ponto mais longe da borda do normal. Isso NÃO é uma
   opinião sobre qual lado da faixa é melhor — é a geometria da própria
   faixa, e vale igual para creatinina, TSH e ferritina, que não declaram
   lado nenhum.

   ⚠️ E O QUE É LIMITE DE VERDADE VEM DA REFERÊNCIA, não do desenho. Numa
   "< 5,7" só existe a borda de cima: a de baixo é o zero que o quadro
   precisou inventar. Contar esse zero como limite faria o ponto mais
   forte cair em 2,8% — o aplicativo afirmando que metade do normal é o
   ideal. Com `temMin`/`temMax`, a rampa só corre a partir das bordas que
   alguém escreveu.

   ⚠️ OS NÚMEROS FICAM SOB AS BORDAS, e ficavam nas pontas do quadro. Nas
   pontas eles descreviam a moldura; sob as bordas eles respondem a
   pergunta — "de 13,5 a 18" é o intervalo, e é isso que a pessoa
   precisa levar embora. */
const PONTOS_DA_REGUA = 33;

function Regua({ e }: { e: any }) {
  const { c } = useTheme();
  const g = examGaugeData(e);
  const dentro = g.status === 'ok';
  const col = dentro ? c.accent : c.cta;
  const iValor = Math.round((g.pos / 100) * (PONTOS_DA_REGUA - 1));

  /* Quanto este ponto está longe da borda mais próxima da faixa, de 0
     (encostado) a 1 (o mais longe que dá dentro dela). */
  const profundidade = (pct: number) => {
    const distL = g.temMin ? pct - g.bandL : Infinity;
    const distR = g.temMax ? g.bandR - pct : Infinity;
    const dist = Math.min(distL, distR);
    if (!isFinite(dist)) return 1;
    /* A escala da profundidade é metade da faixa quando ela tem as duas
       bordas, e a faixa inteira quando só tem uma — nos dois casos, o
       ponto mais fundo chega a 1. */
    const alcance = (g.temMin && g.temMax)
      ? Math.max(1, (g.bandR - g.bandL) / 2)
      : Math.max(1, g.bandR - g.bandL);
    return Math.min(1, Math.max(0, dist / alcance));
  };

  return (
    <View>
      <Row style={{ justifyContent: 'space-between', alignItems: 'center', height: 14 }}>
        {Array.from({ length: PONTOS_DA_REGUA }).map((_, i) => {
          const pct = (i / (PONTOS_DA_REGUA - 1)) * 100;
          const naFaixa = pct >= g.bandL && pct <= g.bandR;
          const ehValor = i === iValor;

          if (ehValor) {
            /* O anel é o que separa "este é o seu" de "este é mais um da
               faixa". Sem ele, um valor bem no fundo da faixa some entre
               os vizinhos, que ali são quase da mesma cor. */
            return (
              <View key={i} style={{
                width: 14, height: 14, borderRadius: 7,
                alignItems: 'center', justifyContent: 'center',
                backgroundColor: alfa(col, 0.22),
              }}>
                <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: col }} />
              </View>
            );
          }
          return (
            <View
              key={i}
              style={{
                width: 5, height: 5, borderRadius: 3,
                backgroundColor: naFaixa ? alfa(c.accent, 0.16 + profundidade(pct) * 0.62) : c.track,
              }}
            />
          );
        })}
      </Row>

      {/* Os limites, cada um na sua altura. `left` em porcentagem com meia
          largura de recuo centraliza o número sob o ponto da borda. */}
      <View style={{ height: 18, marginTop: 8 }}>
        {g.temMin ? (
          <View style={{ position: 'absolute', left: `${g.bandL}%`, width: 60, marginLeft: -30, alignItems: 'center' }}>
            <Txt v="micro" c={c.tx3}>{fmtV(g.limMin)}</Txt>
          </View>
        ) : null}
        {g.temMax ? (
          <View style={{ position: 'absolute', left: `${g.bandR}%`, width: 60, marginLeft: -30, alignItems: 'center' }}>
            <Txt v="micro" c={c.tx3}>{fmtV(g.limMax)}</Txt>
          </View>
        ) : null}
      </View>

      <Txt v="micro" c={c.tx4} style={{ textAlign: 'center' }}>
        {g.temMin && g.temMax ? 'faixa de referência' : g.temMax ? 'abaixo daqui é o esperado' : 'acima daqui é o esperado'} · {e.ref} {e.unit}
      </Txt>
    </View>
  );
}

/* ============================================================
   O HISTÓRICO EM PONTOS — e antes era a curva da casa

   ⚠️ UMA LINHA ENTRE DUAS COLETAS DESENHA DADO QUE NÃO EXISTE.

   A curva contínua é a peça certa para peso: a pessoa se pesa toda
   semana, e o traço entre dois pontos descreve um caminho que de fato
   foi percorrido. Exame é o contrário — três coletas em cinco meses —, e
   ligar uma à outra afirma por onde o valor passou nos quatro meses em
   que ninguém mediu nada. Não passou por lugar nenhum: não se sabe.

   Em pontos soltos, cada coleta é o que ela é: um fato isolado, numa
   data, com um valor. O olho junta os três sozinho, e o que ele junta é
   uma tendência — que é exatamente o grau de certeza que o dado permite.

   ⚠️ A FAIXA DE REFERÊNCIA ATRAVESSA O QUADRO, e é a mesma da régua de
   cima, na mesma escala. É o que amarra as duas peças: a faixa que a
   pessoa acabou de ver como uma fileira de pontos reaparece aqui como
   uma região, e a pergunta "sempre estive dentro?" se responde sem
   número nenhum.

   ⚠️ E A MALHA DE FUNDO NÃO É ENFEITE. Sem ela, três pontos soltos num
   retângulo vazio não têm escala: não dá para dizer se a diferença entre
   eles é muita ou pouca. A malha dá a régua, e apagada ela não disputa
   com os pontos que importam.
   ============================================================ */
const COLS = 19;
const LINS = 9;

function HistoricoEmPontos({ e }: { e: any }) {
  const { c } = useTheme();
  const g = examGaugeData(e);
  const vals = (e.values as any[]).slice().sort((a, b) => a.t - b.t);

  const t0 = vals[0].t, t1 = vals[vals.length - 1].t;
  const spanT = Math.max(1, t1 - t0);
  const spanV = Math.max(1e-9, g.max - g.min);

  /* Cada coleta vira uma coordenada na malha: a coluna pela DATA de
     verdade, e não pela ordem — duas coletas em semanas seguidas ficam
     coladas, e um intervalo de dois anos fica largo, que é o que
     aconteceu. */
  const marcas = vals.map((x) => ({
    col: Math.round(((x.t - t0) / spanT) * (COLS - 1)),
    lin: (LINS - 1) - Math.round(Math.min(1, Math.max(0, (x.v - g.min) / spanV)) * (LINS - 1)),
    v: x.v,
    t: x.t,
    dentro: x.v >= g.bandL / 100 * spanV + g.min && x.v <= g.bandR / 100 * spanV + g.min,
  }));
  const ultima = marcas[marcas.length - 1];

  const linDe = (pct: number) => (LINS - 1) - (pct / 100) * (LINS - 1);
  const linBandaTopo = linDe(g.bandR);
  const linBandaBase = linDe(g.bandL);

  return (
    <View style={{ gap: 10 }}>
      <Row gap={10} style={{ alignItems: 'stretch' }}>
        {/* ⚠️ A ESCALA MOSTRA OS LIMITES DA REFERÊNCIA, e mostrava as
            pontas do quadro. As pontas são um número inventado pelo
            desenho — a moldura que `examGaugeData` calcula para caber o
            valor com folga —, e ninguém precisa saber que o eixo vai até
            9,7. Os números que importam são os que separam o esperado do
            não esperado, e são esses que ficam, na altura em que a faixa
            começa e termina. */}
        <View style={{ width: 30 }}>
          {Array.from({ length: LINS }).map((_, lin) => {
            const topo = lin === Math.round(linBandaTopo);
            const base = lin === Math.round(linBandaBase);
            const mostra = topo || base;
            const valor = topo ? g.min + (g.bandR / 100) * spanV : g.min + (g.bandL / 100) * spanV;
            return (
              <View key={lin} style={{ height: 4, marginBottom: lin === LINS - 1 ? 0 : 9, justifyContent: 'center' }}>
                {mostra ? <Txt v="micro" c={c.tx3}>{fmtV(valor)}</Txt> : null}
              </View>
            );
          })}
        </View>

        <View style={{ flex: 1, gap: 9 }}>
          {Array.from({ length: LINS }).map((_, lin) => {
            const naFaixa = lin >= Math.floor(linBandaTopo) && lin <= Math.ceil(linBandaBase);
            return (
              <Row key={lin} style={{ justifyContent: 'space-between', alignItems: 'center' }}>
                {Array.from({ length: COLS }).map((__, col) => {
                  const marca = marcas.find((m) => m.col === col && m.lin === lin);
                  if (marca) {
                    const ehUltima = marca === ultima;
                    const cor = marca.dentro ? c.accent : c.cta;
                    return (
                      <View
                        key={col}
                        style={{
                          width: ehUltima ? 10 : 8, height: ehUltima ? 10 : 8,
                          borderRadius: 5, backgroundColor: cor,
                          borderWidth: ehUltima ? 2 : 0, borderColor: c.bg1,
                        }}
                      />
                    );
                  }
                  return (
                    <View
                      key={col}
                      style={{
                        width: 4, height: 4, borderRadius: 2,
                        backgroundColor: naFaixa ? alfa(c.accent, 0.28) : c.track,
                      }}
                    />
                  );
                })}
              </Row>
            );
          })}
        </View>
      </Row>

      <Row style={{ justifyContent: 'space-between', paddingLeft: 40 }}>
        <Txt v="micro" c={c.tx4}>{fmtDate(new Date(t0))}</Txt>
        <Txt v="micro" c={c.tx4}>{fmtDate(new Date(t1))}</Txt>
      </Row>
    </View>
  );
}

/* ------------------------------------------------------------------ */
function Detalhe({ e, onVoltar }: { e: any; onVoltar: () => void }) {
  const { c } = useTheme();
  const l = examLast(e), f = examFirst(e), st = examStatus(e);
  const sobre = examAbout(e);
  const mexe = examInfluences(e);
  const varios = e.values.length > 1;
  const delta = l.v - f.v;
  const bom = e.good === 'up' ? delta > 0 : delta < 0;

  return (
    /* ⚠️ `tituloFixo` PORQUE NÃO HÁ MANCHETE. A barra da casa só mostra o
       nome depois que o titulão sobe — e aqui o titulão virou o número.
       Sem isto a tela abre dizendo "5,6 %" e mais nada: o marcador só se
       identificaria depois de rolar, e um valor de exame sem o nome do
       exame não é informação, é um número solto. */
    <TelaInterna titulo={e.marker} onVoltar={onVoltar} tituloFixo>
      {/* ---- o resultado ----

          ⚠️ O NÚMERO É A TELA, e ele estava numa manchete alinhada à
          esquerda como qualquer outro título. Quem abre um marcador de
          exame vem por um número só, e a pergunta seguinte é sempre a
          mesma: está bom? Centrado, com a unidade ao lado e o veredito
          logo abaixo, as duas respostas chegam juntas e sem leitura.

          ⚠️ E O CARTÃO SUMIU DAQUI. A superfície branca em volta fazia do
          resultado um dos blocos da tela; sem ela ele é a abertura dela.
          A régua vem logo abaixo porque é a mesma frase — o valor, e onde
          ele cai. */}
      <View style={{ alignItems: 'center', gap: 14 }}>
        <Row style={{ alignItems: 'baseline', justifyContent: 'center' }} gap={7}>
          <Txt v="display" style={{ fontSize: 56, lineHeight: 62, letterSpacing: -1.5 }}>{fmtV(l.v)}</Txt>
          <Txt v="h2" c={c.tx3}>{e.unit}</Txt>
        </Row>
        {/* O <Selo> tem `alignSelf: 'flex-start'` embutido — ele nasceu
            para etiquetar linhas de lista, onde encostar à esquerda é o
            certo. Aqui ele é o veredito do número, e veredito fica sob o
            número. O invólucro é o que desfaz o alinhamento de origem sem
            mexer na peça compartilhada. */}
        <View style={{ alignItems: 'center' }}>
          <Selo
            label={st === 'ok' ? 'Na referência' : `Fora da referência — ${st}`}
            tom={st === 'ok' ? 'verde' : 'neutra'}
          />
        </View>
        {/* ⚠️ A DATA DA COLETA VOLTOU. Ela morava no lead da manchete, que
            saiu junto com ela — e um resultado sem data é um resultado sem
            validade: ninguém sabe se está olhando o exame de ontem ou o de
            dois anos atrás. */}
        <Txt v="caption" c={c.tx3}>Colhido em {porExtenso(l.t)}</Txt>
      </View>

      <View style={{ gap: 12 }}>
        <Regua e={e} />
        {/* ⚠️ O QUE É UMA FAIXA DE REFERÊNCIA — a frase mais útil da tela,
            e ela não existia. O aplicativo mostrava "referência 15–150" e
            deixava a pessoa concluir sozinha que fora dali é doença. Não
            é: a faixa é onde cai a maioria das pessoas saudáveis testadas
            naquele laboratório, com o método dele — e por construção,
            algumas pessoas saudáveis caem fora.

            Fica logo abaixo da régua porque é a legenda dela, e não um
            aviso: quem entendeu a régua já parou de ler. */}
        <Txt v="micro" c={c.tx3} style={{ lineHeight: 19 }}>{SOBRE_A_REFERENCIA}</Txt>
      </View>

      {/* ---- sobre o marcador ----

          ⚠️ O QUE A COISA É, e não o que o SEU resultado quer dizer. As
          duas perguntas viviam no mesmo parágrafo lá embaixo, e só a
          segunda aparecia — quem nunca ouviu falar de ferritina lia a
          leitura de um número sem saber do que ele era.

          Vem antes da evolução de propósito: não dá para acompanhar a
          curva de uma coisa que ainda não se sabe o que é. */}
      {sobre ? (
        <View style={[{ backgroundColor: c.bg1, borderRadius: radius.card, padding: 18, gap: 8 }, shadowCard(c)]}>
          <Row gap={7}>
            <Icon name="book" size={13} color={c.tx4} sw={2} />
            <Txt v="micro" c={c.tx4} style={{ letterSpacing: 1 }}>SOBRE</Txt>
          </Row>
          <Txt v="body" style={{ lineHeight: 25 }}>{sobre.oQueE}</Txt>
          <Txt v="caption" c={c.tx3} style={{ lineHeight: 21 }}>{sobre.porQue}</Txt>
        </View>
      ) : null}

      {/* ---- a evolução ---- */}
      {varios ? (
        <View style={[{ backgroundColor: c.bg1, borderRadius: radius.card, padding: 18, gap: 16 }, shadowCard(c)]}>
          <Row style={{ justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <View style={{ flex: 1 }}>
              <Row gap={7}>
                <Icon name="trend" size={13} color={c.tx4} sw={2} />
                <Txt v="micro" c={c.tx4} style={{ letterSpacing: 1 }}>EVOLUÇÃO</Txt>
              </Row>
              {/* ⚠️ A FRASE DIZ O QUE MUDOU E EM QUANTO TEMPO, e o cartão
                  antigo dizia só o número de coletas. "Caiu 0,7 em quatro
                  meses" e "caiu 0,7 em quatro anos" são fatos diferentes,
                  e três coletas não distinguem os dois. */}
              <Txt v="body" style={{ marginTop: 7 }}>
                {delta === 0 ? 'Sem mudança' : `${delta > 0 ? 'Subiu' : 'Caiu'} ${fmtV(Math.abs(delta))} ${e.unit}`}
              </Txt>
              <Txt v="caption" c={c.tx3} style={{ marginTop: 2 }}>
                em {e.values.length} coletas, desde {porExtenso(f.t)}
              </Txt>
            </View>
            {/* A seta só aparece quando o marcador declara qual lado é o
                bom. Sem isso ela seria uma opinião sobre a direção. */}
            {e.good && delta !== 0 ? (
              <Row gap={5} style={{ alignItems: 'center', backgroundColor: bom ? c.okBg : c.bg2, borderRadius: radius.pill, paddingHorizontal: 10, paddingVertical: 5 }}>
                <Icon name={delta > 0 ? 'arrowup' : 'arrowdown'} size={13} color={bom ? c.ok : c.tx3} sw={2.4} />
                <Txt v="micro" c={bom ? c.ok : c.tx3}>{bom ? 'na direção esperada' : 'na direção oposta'}</Txt>
              </Row>
            ) : null}
          </Row>

          <HistoricoEmPontos e={e} />
        </View>
      ) : null}

      {varios ? (
        <Bloco titulo="Coletas">
          <Cartao>
            {e.values.slice().reverse().map((x: any) => (
              <Linha
                key={x.t}
                titulo={`${fmtV(x.v)} ${e.unit}`}
                sub={fmtDate(new Date(x.t))}
                seta={false}
              />
            ))}
          </Cartao>
        </Bloco>
      ) : null}

      {/* ---- o que mexe neste número ----

          ⚠️ É A SEÇÃO QUE TRANSFORMA O EXAME EM COISA COMPREENSÍVEL.
          Saber que ferritina é o estoque de ferro ajuda a ler a palavra;
          não ajuda a entender por que ela mudou — e "por que mudou" é a
          pergunta que a pessoa leva da tela para a vida. Um número de
          exame sem causas é um veredito; com causas, vira uma coisa que
          tem história e que ela reconhece.

          ⚠️ E NENHUM ITEM DIZ O QUE FAZER. "Álcool nos dias anteriores" é
          um fato sobre o marcador; "pare de beber" seria conduta, e
          conduta é de quem acompanha a pessoa. A linha entre educar e
          prescrever passa exatamente aqui.

          ⚠️ O PONTO É SOLTO, e não numerado. Numerar sugere ordem de
          importância, e não há: são causas comuns, não um ranking. */}
      {mexe.length ? (
        <View style={[{ backgroundColor: c.bg1, borderRadius: radius.card, padding: 18, gap: 12 }, shadowCard(c)]}>
          <Row gap={7}>
            <Icon name="bulb" size={13} color={c.tx4} sw={2} />
            <Txt v="micro" c={c.tx4} style={{ letterSpacing: 1 }}>O QUE MEXE NESTE NÚMERO</Txt>
          </Row>
          <View style={{ gap: 10 }}>
            {mexe.map((x) => (
              <Row key={x} gap={10} style={{ alignItems: 'flex-start' }}>
                <View style={{ marginTop: 8, width: 5, height: 5, borderRadius: 3, backgroundColor: c.accent }} />
                <Txt v="caption" c={c.tx2} style={{ flex: 1, lineHeight: 22 }}>{x}</Txt>
              </Row>
            ))}
          </View>
          <Txt v="micro" c={c.tx4} style={{ lineHeight: 18 }}>
            São as causas mais comuns, e não a lista inteira. O que vale para o seu caso é
            quem lê o conjunto que diz.
          </Txt>
        </View>
      ) : null}

      <Aviso ic="spark" titulo="O que isso significa">
        <Txt v="caption" c={c.tx2}>{examExplain(e)}</Txt>
        <AskCompanion q={`Explique meu exame de ${e.marker}`} label="Perguntar sobre este exame" style={{ marginTop: 12 }} />
      </Aviso>

      <View />
    </TelaInterna>
  );
}

/* ------------------------------------------------------------------ */
export default function Exames() {
  const S = useStore((s) => s.S);
  const { c } = useTheme();
  const router = useRouter();
  const [sel, setSel] = useState<string | null>(null);

  if (sel) {
    const e = examBy(S, sel);
    if (e) return <Detalhe e={e} onVoltar={() => setSel(null)} />;
  }

  return (
    <TelaInterna
      titulo="Exames"
      iconeAcao="plus"
      onAcao={() => router.push('/medir-exame' as any)}
      rodape={
        <>
          <Botao label="Importar exame" onPress={() => router.push('/medir-exame' as any)} />
          <Botao label="Enviar ao médico" tom="fantasma" onPress={() => router.push('/exportar' as any)} />
        </>
      }
    >
      <Titulao
        titulo="Exames"
        lead="Importados, organizados por sistema e explicados em português. Toque num marcador para ver a faixa de referência e o histórico."
      />

      <Aviso ic="spark" titulo="Resumo da IA">
        <Rich
          v="caption"
          base={c.tx2}
          bold={c.tx}
          text="Seus marcadores metabólicos <b>melhoraram de forma consistente</b>: HbA1c 6,3 → 5,6%, triglicerídeos e LDL em queda, HDL e vitamina D em alta. Evolução alinhada com a perda de peso e o tratamento."
        />
      </Aviso>

      {EXAM_CATS.map(([cat, ms]) => (
        <Bloco key={cat} titulo={cat}>
          <Cartao>
            {ms.map((mk) => {
              const e = examBy(S, mk);
              if (!e) return null;
              const l = examLast(e), st = examStatus(e);
              const varios = e.values.length > 1;
              const delta = varios ? l.v - examFirst(e).v : 0;
              const bom = e.good === 'up' ? delta > 0 : delta < 0;
              return (
                <Linha
                  key={mk}
                  titulo={mk}
                  sub={`${fmtV(l.v)} ${e.unit} · ref ${e.ref}`}
                  selo={varios
                    ? `${delta > 0 ? '+' : '−'}${fmtV(Math.abs(delta))}`
                    : (st === 'ok' ? 'normal' : st)}
                  seloTom={varios ? (bom ? 'lima' : 'neutra') : (st === 'ok' ? 'verde' : 'neutra')}
                  onPress={() => setSel(mk)}
                />
              );
            })}
          </Cartao>
        </Bloco>
      ))}

      <Bloco titulo="Arquivos importados">
        <Cartao>
          {(S.examBundles as any[]).map((b) => (
            <Linha
              key={b.t}
              ic={b.source === 'PDF' ? 'doc' : 'photo'}
              titulo={b.name}
              sub={`${b.n} marcadores · ${b.source} · ${fmtDate(new Date(b.t))}`}
              selo={b.shared ? 'enviado' : undefined}
              seloTom="neutra"
              seta={false}
            />
          ))}
        </Cartao>
      </Bloco>

      <View />
    </TelaInterna>
  );
}
