import React, { useMemo, useState } from 'react';
import { View } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useStore } from '../logic/store';
import { MO, MO_LONG, DAY, nf } from '../logic/time';
import { Txt, Row } from '../ui/kit';
import { AreaCurve } from '../ui/charts';
import {
  TelaInterna, Titulao, Bloco, Chips, Cartao, Linha,
} from '../ui/internas';
import { useTheme } from '../ui/useTheme';
import { radius, shadowCard } from '../theme';

/* ============================================================
   DETALHE DO MARCADOR

   O gráfico responde "como foi indo"; a lista embaixo existe para outra
   coisa: CORRIGIR. É a única tela do app onde a pessoa apaga um número
   que ela mesma registrou, e por isso a frase do bloco diz, sem rodeio,
   que aquilo vai para o relatório do médico — apagar aqui tem
   consequência fora do app.

   Serve peso e cintura com o mesmo desenho. São marcadores que a pessoa
   produz, medidos numa unidade só, com histórico corrigível: fazer duas
   telas quase iguais para isso só multiplicaria manutenção.
   ============================================================ */

const PERIODOS = [
  { id: '12s', label: '12 semanas', dias: 84 },
  { id: '3m', label: '3 meses', dias: 91 },
  { id: 'tudo', label: 'Tudo', dias: Infinity },
];

type Def = {
  nome: string; unidade: string; casas: number;
  pontos: (S: any) => { t: number; v: number }[];
  /** "manhã" para peso; medidas não têm hora do dia */
  nota?: string;
};

const DEFS: Record<string, Def> = {
  peso: {
    nome: 'Peso', unidade: 'kg', casas: 1, nota: 'manhã',
    pontos: (S) => (S.weights as any[]).map((w) => ({ t: w.t, v: w.kg })),
  },
  cintura: {
    nome: 'Cintura', unidade: 'cm', casas: 0,
    pontos: (S) => (S.measures as any[]).map((m) => ({ t: m.t, v: m.cintura })),
  },
};

const porExtenso = (t: number) => { const d = new Date(t); return `${d.getDate()} de ${MO_LONG[d.getMonth()]}`; };

export default function Marcador() {
  const S = useStore((s) => s.S);
  const { c } = useTheme();
  const router = useRouter();
  const { m } = useLocalSearchParams<{ m?: string }>();
  const def = DEFS[m ?? 'peso'] ?? DEFS.peso;
  const [per, setPer] = useState('12s');

  const todos = def.pontos(S);
  const corte = PERIODOS.find((p) => p.id === per)!.dias;
  const desde = corte === Infinity ? -Infinity : Date.now() - corte * DAY;
  const pts = todos.filter((p) => p.t >= desde);

  const fmt = (v: number) => nf(v, def.casas).replace('.', ',');
  const ultimo = todos[todos.length - 1];
  const primeiro = todos[0];

  const { curva, ticks, meses } = useMemo(() => {
    if (pts.length < 2) return { curva: [], ticks: [] as number[], meses: [] as string[] };
    const vs = pts.map((p) => p.v);
    const lo = Math.min(...vs), hi = Math.max(...vs), span = hi - lo || 1;
    /* Quatro marcas de eixo, do topo para a base. Elas existem para dar
       ESCALA à queda: sem elas, uma perda de 7 kg e uma de 700 g desenham
       exatamente a mesma curva. */
    const ticks = [hi, hi - span / 3, hi - (2 * span) / 3, lo];
    const ms: string[] = [];
    for (const p of pts) { const r = MO[new Date(p.t).getMonth()]; if (ms[ms.length - 1] !== r) ms.push(r); }
    return {
      curva: pts.map((p, i) => ({ x: i / (pts.length - 1), y: (p.v - lo) / span })),
      ticks, meses: ms,
    };
  }, [pts]);

  /* Lista do mais recente para o mais antigo, com a variação contra o
     registro anterior. O mais antigo do período não ganha selo: não há
     contra o que comparar, e inventar "—" como número seria pior. */
  const registros = todos
    .map((p, i) => ({ ...p, delta: i > 0 ? p.v - todos[i - 1].v : null }))
    .slice()
    .reverse();

  return (
    <TelaInterna
      titulo={def.nome}
      iconeAcao="plus"
      onAcao={() => router.push('/medir-peso' as any)}
    >
      <Titulao
        titulo={fmt(ultimo.v)}
        unidade={def.unidade}
        lead={`Registrado em ${porExtenso(ultimo.t)} · ${fmt(primeiro.v)} ${def.unidade} no início do tratamento`}
      />

      <View style={[{ backgroundColor: c.bg1, borderRadius: radius.card, paddingTop: 16, paddingBottom: 12, paddingHorizontal: 12, gap: 10 }, shadowCard(c)]}>
        {curva.length > 1 ? (
          <View>
            <Row style={{ alignItems: 'stretch' }}>
              <View style={{ width: 28, height: 150, justifyContent: 'space-between', paddingVertical: 14 }}>
                {ticks.map((t, i) => (
                  <Txt key={i} v="micro" c={c.tx4}>{nf(t, def.casas === 1 ? 0 : 0)}</Txt>
                ))}
              </View>
              <View style={{ flex: 1 }}>
                <AreaCurve
                  pts={curva} height={150} padT={14} padB={14} padX={6} strokeW={2.5}
                  strokeFrom={c.accent} strokeTo={c.accent} dashed={false}
                  marker={curva.length - 1} id="mk" nodes={curva.length <= 14}
                />
              </View>
            </Row>
            <Row style={{ justifyContent: 'space-between', paddingLeft: 28, paddingRight: 6, marginTop: 2 }}>
              {meses.map((r, i) => <Txt key={r + i} v="micro" c={c.tx4}>{r}</Txt>)}
            </Row>
          </View>
        ) : (
          <Txt v="caption" c={c.tx3} style={{ paddingVertical: 24, textAlign: 'center' }}>
            Um registro só não desenha uma curva. Marque outro para ver a variação.
          </Txt>
        )}
        <Chips itens={PERIODOS.map((p) => ({ id: p.id, label: p.label }))} valor={per} onChange={setPer} />
      </View>

      <Bloco
        titulo="Registros"
        nota="Toque para corrigir ou apagar. O que estiver aqui vai para o relatório do seu médico."
      >
        <Cartao>
          {registros.map((r) => (
            <Linha
              key={r.t}
              titulo={`${fmt(r.v)} ${def.unidade}`}
              sub={`${porExtenso(r.t)}${def.nota ? ` · ${def.nota}` : ''}`}
              selo={r.delta == null ? '—' : `${r.delta > 0 ? '+' : '−'}${fmt(Math.abs(r.delta))} ${def.unidade}`}
              seloTom={r.delta == null ? 'neutra' : 'lima'}
              seta={false}
              onPress={() => router.push(`/registro?m=${m ?? 'peso'}&t=${r.t}` as any)}
            />
          ))}
        </Cartao>
      </Bloco>
    </TelaInterna>
  );
}
