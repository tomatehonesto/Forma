import React, { useMemo, useState } from 'react';
import { View } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useStore } from '../logic/store';
import { MO_LONG, DAY, nf } from '../logic/time';
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
  /** para onde o "+" leva — cada marcador tem a sua captura */
  capturar: string;
};

const DEFS: Record<string, Def> = {
  peso: {
    nome: 'Peso', unidade: 'kg', casas: 1, nota: 'manhã',
    capturar: '/medir-peso',
    pontos: (S) => (S.weights as any[]).map((w) => ({ t: w.t, v: w.kg })),
  },
  cintura: {
    nome: 'Cintura', unidade: 'cm', casas: 0,
    capturar: '/medir-medidas',
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

  const curva = useMemo(() => {
    if (pts.length < 2) return [];
    const vs = pts.map((p) => p.v);
    const lo = Math.min(...vs), hi = Math.max(...vs), span = hi - lo || 1;
    return pts.map((p, i) => ({ x: i / (pts.length - 1), y: (p.v - lo) / span }));
  }, [pts]);

  /* Variação dentro do período escolhido nos chips. É o que o cabeçalho do
     card responde, e não se repete com o titulão: lá em cima está o valor
     de hoje contra o início do tratamento; aqui, o quanto andou nas doze
     semanas (ou três meses, ou tudo) que a pessoa acabou de selecionar. */
  const variacao = pts.length > 1 ? pts[pts.length - 1].v - pts[0].v : null;

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
      onAcao={() => router.push(def.capturar as any)}
    >
      <Titulao
        titulo={fmt(ultimo.v)}
        unidade={def.unidade}
        lead={`Registrado em ${porExtenso(ultimo.t)} · ${fmt(primeiro.v)} ${def.unidade} no início do tratamento`}
      />

      {/* Os chips saíram de dentro do card. A curva agora encosta na borda
          de baixo, então não sobra rodapé onde eles coubessem — e fora do
          card eles ficam onde já estão na Evolução, que é a tela de onde se
          chega aqui. */}
      <Chips itens={PERIODOS.map((p) => ({ id: p.id, label: p.label }))} valor={per} onChange={setPer} />

      {/* Mesmo desenho do card de evolução da Home: texto em cima, curva
          sangrando até as três bordas de baixo.

          Saíram a coluna de eixo, as marcas de mês e o ponto no último
          registro. O eixo existia para dar escala à queda, mas aqui ele
          repetia o titulão — que já diz o valor de hoje e o do início do
          tratamento, em palavras. Com a escala resolvida em texto, o que
          sobra para a curva é a única coisa que só ela sabe dizer: a FORMA.
          Onde travou, onde acelerou, onde voltou a cair.

          Sangrando, ela deixa de ser um gráfico dentro de uma caixa e vira
          o piso do card — o mesmo princípio da curva do painel da Jornada. */}
      <View style={[{ backgroundColor: c.bg1, borderRadius: radius.card, overflow: 'hidden' }, shadowCard(c)]}>
        <Row style={{ paddingHorizontal: 16, paddingTop: 16, paddingBottom: 12, alignItems: 'flex-start' }}>
          <View style={{ flex: 1 }}>
            <Txt v="body">{def.nome}</Txt>
            <Txt v="note" c={c.tx3} style={{ marginTop: 2 }}>
              {PERIODOS.find((p) => p.id === per)!.label.toLowerCase()}
              {pts.length > 1 ? ` · ${pts.length} registros` : ''}
            </Txt>
          </View>
          {variacao != null && (
            <Txt v="metric">
              {variacao > 0 ? '+' : '−'}{fmt(Math.abs(variacao))}
              <Txt v="label" c={c.tx3}>{` ${def.unidade}`}</Txt>
            </Txt>
          )}
        </Row>

        {curva.length > 1 ? (
          <AreaCurve
            pts={curva} height={120} padT={6} padB={0} padX={0} strokeW={2}
            strokeFrom={c.limeDim} strokeTo={c.limeDim} dashed={false} id="mk"
          />
        ) : (
          <Txt v="caption" c={c.tx3} style={{ paddingHorizontal: 16, paddingBottom: 24, textAlign: 'center' }}>
            Um registro só não desenha uma curva. Marque outro para ver a variação.
          </Txt>
        )}
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
