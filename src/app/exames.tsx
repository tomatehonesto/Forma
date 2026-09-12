import React, { useMemo, useState } from 'react';
import { View } from 'react-native';
import { useRouter } from 'expo-router';
import { useStore } from '../logic/store';
import { EXAM_CATS, examBy, examLast, examFirst, examStatus, examGaugeData, examExplain } from '../logic/derive';
import { fmtDate, MO_LONG, nf } from '../logic/time';
import { Txt, Row, Rich } from '../ui/kit';
import { AreaCurve } from '../ui/charts';
import { AskCompanion } from '../ui/Ask';
import {
  TelaInterna, Titulao, Bloco, Cartao, Linha, Aviso, Botao, Selo,
} from '../ui/internas';
import { useTheme } from '../ui/useTheme';
import { radius, shadowCard } from '../theme';

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

/* Régua de referência — faixa normal em lavagem azul, valor como marcador.
   Fora da faixa o marcador fica vermelho: aqui o alarme é legítimo, porque
   é a única leitura da tela que pode pedir médico. */
function Regua({ e }: { e: any }) {
  const { c } = useTheme();
  const g = examGaugeData(e);
  const col = g.status === 'ok' ? c.accent : c.cta;
  return (
    <View>
      <View style={{ height: 10, borderRadius: 5, backgroundColor: c.track }}>
        <View style={{ position: 'absolute', left: `${g.bandL}%`, width: `${Math.max(3, g.bandR - g.bandL)}%`, top: 0, bottom: 0, borderRadius: 5, backgroundColor: c.accentWeak, borderWidth: 1, borderColor: c.accentLine }} />
        <View style={{ position: 'absolute', left: `${g.pos}%`, top: -3, width: 16, height: 16, marginLeft: -8, borderRadius: 8, backgroundColor: col, borderWidth: 3, borderColor: c.bg1 }} />
      </View>
      <Row style={{ justifyContent: 'space-between', marginTop: 8 }}>
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
  const varios = e.values.length > 1;
  const delta = l.v - f.v;
  const bom = e.good === 'up' ? delta > 0 : delta < 0;

  const curva = useMemo(() => {
    if (!varios) return [];
    const vs = e.values.map((y: any) => y.v);
    const lo = Math.min(...vs), hi = Math.max(...vs), span = hi - lo || 1;
    return e.values.map((x: any, i: number) => ({ x: i / (e.values.length - 1), y: (x.v - lo) / span }));
  }, [e]);

  return (
    <TelaInterna titulo={e.marker} onVoltar={onVoltar}>
      <Titulao
        titulo={fmtV(l.v)}
        unidade={e.unit}
        lead={`Colhido em ${porExtenso(l.t)} · referência ${e.ref} ${e.unit}`}
      />

      <View style={[{ backgroundColor: c.bg1, borderRadius: radius.card, padding: 16, gap: 14 }, shadowCard(c)]}>
        <Row style={{ justifyContent: 'space-between', gap: 10 }}>
          <Selo
            label={st === 'ok' ? 'Na referência' : `Fora da referência — ${st}`}
            tom={st === 'ok' ? 'verde' : 'neutra'}
          />
          {varios ? <Selo label={`${delta > 0 ? '+' : '−'}${fmtV(Math.abs(delta))} ${e.unit}`} tom={bom ? 'lima' : 'neutra'} /> : null}
        </Row>
        <Regua e={e} />
      </View>

      {/* Mesmo desenho dos cards de Peso e Medidas: texto em cima, curva
          sangrando até as bordas de baixo. */}
      {varios ? (
        <View style={[{ backgroundColor: c.bg1, borderRadius: radius.card, overflow: 'hidden' }, shadowCard(c)]}>
          <Row style={{ paddingHorizontal: 16, paddingTop: 16, paddingBottom: 12, alignItems: 'flex-start' }}>
            <View style={{ flex: 1 }}>
              <Txt v="body">{e.marker}</Txt>
              <Txt v="note" c={c.tx3} style={{ marginTop: 2 }}>
                {fmtV(f.v)} {e.unit} no primeiro exame · {e.values.length} coletas
              </Txt>
            </View>
          </Row>
          <AreaCurve
            pts={curva} height={110} padT={6} padB={0} padX={0} strokeW={2}
            strokeFrom={c.limeDim} strokeTo={c.limeDim} dashed={false} id={`ex-${e.marker}`}
          />
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

      <Aviso ic="spark" titulo="O que isso significa">
        <Txt v="caption" c={c.tx2}>{examExplain(e)}</Txt>
        <AskCompanion q={`Explique meu exame de ${e.marker}`} label="Perguntar ao Morphi" style={{ marginTop: 12 }} />
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
