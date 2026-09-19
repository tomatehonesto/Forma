import React, { useState } from 'react';
import { View } from 'react-native';
import { useRouter } from 'expo-router';
import { useStore } from '../logic/store';
import { EXAM_CATS, examBy, examLast, examFirst, examStatus, examGaugeData, examExplain, examAbout } from '../logic/derive';
import { fmtDate, MO_LONG, nf } from '../logic/time';
import { Txt, Row, Rich } from '../ui/kit';
import { Icon } from '../ui/Icon';
import { AskCompanion } from '../ui/Ask';
import {
  TelaInterna, Titulao, Bloco, Cartao, Linha, Aviso, Botao, Selo, CardCurva,
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

/* A RÉGUA É PONTILHADA, e era uma barra com uma bolinha em cima.

   ⚠️ A BARRA PROMETIA PRECISÃO QUE O DADO NÃO TEM. Um trilho contínuo com
   um marcador em cima convida a ler a posição exata — e a posição exata
   não quer dizer nada: a faixa de referência é do laboratório, varia de um
   para outro, e estar em 5,5 ou 5,6 dentro dela é a mesma informação.

   Em pontos, a leitura vira contável e aproximada, que é o que ela é: "meu
   valor está aqui, perto do começo da faixa". O olho lê a POSIÇÃO no
   conjunto sem tentar ler o número, que já está grande em cima.

   ⚠️ E OS PONTOS DE FORA DA FAIXA CONTINUAM VISÍVEIS, apagados. Uma régua
   que só desenha a faixa normal esconde justamente o que a pessoa precisa
   ver quando o valor sai dela — a distância. */
const PONTOS_DA_REGUA = 29;

function Regua({ e }: { e: any }) {
  const { c } = useTheme();
  const g = examGaugeData(e);
  const dentro = g.status === 'ok';
  const col = dentro ? c.accent : c.cta;

  /* O ponto do valor é o mais próximo da posição dele, e não uma peça
     solta por cima: assim ele nunca cai entre dois e nunca some atrás da
     borda do quadro. */
  const iValor = Math.round((g.pos / 100) * (PONTOS_DA_REGUA - 1));

  return (
    <View>
      <Row style={{ justifyContent: 'space-between', alignItems: 'center' }}>
        {Array.from({ length: PONTOS_DA_REGUA }).map((_, i) => {
          const pct = (i / (PONTOS_DA_REGUA - 1)) * 100;
          const naFaixa = pct >= g.bandL && pct <= g.bandR;
          const ehValor = i === iValor;
          return (
            <View
              key={i}
              style={{
                width: ehValor ? 9 : 5,
                height: ehValor ? 9 : 5,
                borderRadius: 5,
                /* ⚠️ A FAIXA PRECISA SER VISÍVEL SEM SER LIDA. Em
                   `accentLine` ela quase não se distinguia do trilho, e a
                   régua virava uma fileira de pontos iguais com um maior
                   no meio — sem a faixa, a posição não diz nada. Em
                   accent a 30% ela aparece como região e continua atrás
                   do ponto do valor, que é quem tem que ganhar o olho. */
                backgroundColor: ehValor ? col : naFaixa ? alfa(c.accent, 0.3) : c.track,
              }}
            />
          );
        })}
      </Row>
      <Row style={{ justifyContent: 'space-between', marginTop: 10 }}>
        <Txt v="micro" c={c.tx4}>{fmtV(g.min)}</Txt>
        <Txt v="micro" c={c.tx3}>referência {e.ref} {e.unit}</Txt>
        <Txt v="micro" c={c.tx4}>{fmtV(g.max)}</Txt>
      </Row>
    </View>
  );
}

/* ------------------------------------------------------------------ */
function Detalhe({ e, onVoltar }: { e: any; onVoltar: () => void }) {
  const { c } = useTheme();
  const l = examLast(e), f = examFirst(e), st = examStatus(e);
  const sobre = examAbout(e);
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

      <Regua e={e} />

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

      {/* Mesmo desenho dos cards de Peso e Medidas, e deslizar pela curva
          mostra o valor de cada coleta com a data.

          ⚠️ O SUBTÍTULO DIZ O PERÍODO, e dizia só "N coletas". Uma queda de
          0,7 em três meses e a mesma queda em três anos são fatos
          diferentes, e o número de coletas não distingue os dois. */}
      {varios ? (
        <CardCurva
          id={`ex-${e.marker}`}
          nome={e.marker}
          sub={`${fmtDate(new Date(f.t))} a ${fmtDate(new Date(l.t))} · ${e.values.length} coletas`}
          valor={`${delta > 0 ? '+' : '−'}${fmtV(Math.abs(delta))}`}
          unidade={e.unit}
          altura={110}
          pontos={e.values.map((x: any) => ({
            v: x.v, rotulo: fmtV(x.v), quando: porExtenso(x.t),
          }))}
        />
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
