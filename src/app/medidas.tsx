import React, { useMemo } from 'react';
import { View, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { useStore } from '../logic/store';
import { latestMeasure, firstMeasure } from '../logic/derive';
import { MO, nf } from '../logic/time';
import { Txt, Row } from '../ui/kit';
import { AreaCurve } from '../ui/charts';
import {
  TelaInterna, Titulao, Bloco, Grade2, Metrica, Botao, Aviso,
} from '../ui/internas';
import { useTheme } from '../ui/useTheme';
import { radius, shadowCard } from '../theme';

/* ============================================================
   MEDIDAS E COMPOSIÇÃO

   O título dizia "medidas & composição" e a tela tratava as seis linhas
   como se fossem a mesma coisa: seis cards iguais, empilhados. Não são.

     fita métrica — cintura, quadril, braço, coxa. A pessoa mede, pode
       errar, pode querer corrigir. Cada uma abre histórico em /marcador.
     balança      — gordura e massa magra. Dependem de bioimpedância; nesta
       fase são leitura, e dizer isso evita a frustração de tocar num card
       que não abre nada.

   É a mesma divisão da Evolução, e por um motivo: o que muda entre os dois
   grupos não é o assunto, é o que a pessoa PODE FAZER com o número.

   Os cards seguem o desenho do card de evolução da Home — texto em cima,
   curva sangrando até as bordas de baixo, sem eixo. A escala vive no
   próprio texto ("104 cm no início"), então a curva fica com a forma.
   ============================================================ */

const CIRC: { k: string; nome: string }[] = [
  { k: 'cintura', nome: 'Cintura' },
  { k: 'quadril', nome: 'Quadril' },
  { k: 'braco', nome: 'Braço' },
  { k: 'coxa', nome: 'Coxa' },
];

const n1 = (x: number) => nf(x, 1).replace('.', ',');
const n0 = (x: number) => nf(x, 0);
const dia = (t: number) => { const d = new Date(t); return `${d.getDate()} ${MO[d.getMonth()]}`; };

/* Card de circunferência — o mesmo desenho do marcador e da Home. */
function CardMedida({ nome, chave, onPress }: { nome: string; chave: string; onPress: () => void }) {
  const S = useStore((s) => s.S);
  const { c } = useTheme();

  const pts = (S.measures as any[]).map((m) => ({ t: m.t, v: m[chave] as number }));
  const curva = useMemo(() => {
    if (pts.length < 2) return [];
    const vs = pts.map((p) => p.v);
    const lo = Math.min(...vs), hi = Math.max(...vs), span = hi - lo || 1;
    return pts.map((p, i) => ({ x: i / (pts.length - 1), y: (p.v - lo) / span }));
  }, [S.measures, chave]);

  const primeiro = pts[0], ultimo = pts[pts.length - 1];
  const delta = ultimo.v - primeiro.v;

  return (
    <Pressable onPress={onPress} style={({ pressed }) => [{ opacity: pressed ? 0.9 : 1 }]}>
      <View style={[{ backgroundColor: c.bg1, borderRadius: radius.card, overflow: 'hidden' }, shadowCard(c)]}>
        <Row style={{ paddingHorizontal: 16, paddingTop: 16, paddingBottom: 12, alignItems: 'flex-start' }}>
          <View style={{ flex: 1 }}>
            <Txt v="body">{nome}</Txt>
            <Txt v="note" c={c.tx3} style={{ marginTop: 2 }}>
              {n0(primeiro.v)} cm no início · {n0(ultimo.v)} cm em {dia(ultimo.t)}
            </Txt>
          </View>
          <Txt v="metric">
            {delta > 0 ? '+' : '−'}{n1(Math.abs(delta))}
            <Txt v="label" c={c.tx3}> cm</Txt>
          </Txt>
        </Row>
        {curva.length > 1 ? (
          <AreaCurve
            pts={curva} height={92} padT={6} padB={0} padX={0} strokeW={2}
            strokeFrom={c.limeDim} strokeTo={c.limeDim} dashed={false} id={`md-${chave}`}
          />
        ) : (
          <Txt v="caption" c={c.tx3} style={{ paddingHorizontal: 16, paddingBottom: 20 }}>
            Uma medida só não desenha uma curva.
          </Txt>
        )}
      </View>
    </Pressable>
  );
}

export default function Medidas() {
  const S = useStore((s) => s.S);
  const router = useRouter();
  const m1: any = latestMeasure(S), m0: any = firstMeasure(S);

  const temComposicao = m1 && m0 && (m1.gordura || m1.musculo);

  return (
    <TelaInterna
      titulo="Medidas e composição"
      iconeAcao="plus"
      onAcao={() => router.push('/medir-medidas' as any)}
      rodape={<Botao label="Registrar novas medidas" onPress={() => router.push('/medir-medidas' as any)} />}
    >
      <Titulao
        titulo="Medidas"
        lead="O corpo mudando de forma, além da balança. Toque numa medida para ver o histórico e corrigir registros."
      />

      <Bloco titulo="Você registra" nota="Medido por você, com fita.">
        <View style={{ gap: 10 }}>
          {CIRC.map((r) => (
            <CardMedida
              key={r.k}
              nome={r.nome}
              chave={r.k}
              onPress={() => router.push(`/marcador?m=${r.k}` as any)}
            />
          ))}
        </View>
      </Bloco>

      {temComposicao ? (
        <Bloco
          titulo="Vem da balança"
          nota="Composição corporal precisa de bioimpedância — nesta fase, só leitura."
        >
          <Grade2>
            <Metrica
              ic="activity"
              nome="Gordura corporal"
              selo={`${m1.gordura <= m0.gordura ? '−' : '+'}${n1(Math.abs(m0.gordura - m1.gordura))} pp`}
              de={`${n1(m0.gordura)}%`}
              para={`${n1(m1.gordura)}%`}
            />
            {/* Estava rotulada em "%" e mostrava 29,0 % — o estado guarda
                massa magra em QUILOS. O número certo é 29,0 kg, e a unidade
                errada fazia a leitura inteira mentir. */}
            <Metrica
              ic="dumbbell"
              nome="Massa magra"
              selo={`${m1.musculo >= m0.musculo ? '+' : '−'}${n1(Math.abs(m1.musculo - m0.musculo))} kg`}
              de={`${n1(m0.musculo)} kg`}
              para={`${n1(m1.musculo)} kg`}
            />
          </Grade2>
        </Bloco>
      ) : null}

      <Aviso
        ic="ruler"
        titulo="Medir sempre do mesmo jeito"
        texto="Mesma hora do dia, sem roupa apertada e com a fita rente à pele, sem apertar. A comparação entre duas medidas só vale se as duas foram feitas igual."
      />

      <View />
    </TelaInterna>
  );
}
