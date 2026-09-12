import React, { useMemo } from 'react';
import { View } from 'react-native';
import { useRouter } from 'expo-router';
import { useStore } from '../logic/store';
import { vitalLast } from '../logic/derive';
import { Txt, Row } from '../ui/kit';
import { Icon } from '../ui/Icon';
import { AreaCurve } from '../ui/charts';
import {
  TelaInterna, Titulao, Bloco, Cartao, Linha, Aviso, Selo, Grade2,
} from '../ui/internas';
import { useTheme } from '../ui/useTheme';
import { radius, shadowCard } from '../theme';

/* ============================================================
   SINAIS VITAIS

   Pressão e glicemia melhoram junto com o peso, e essa é a notícia que a
   tela existe para dar: o tratamento mexe em coisas que a balança não
   mostra. Por isso as duas ganham curva — a forma da queda é o argumento.

   Os outros quatro sinais são leitura pontual, não série: uma saturação de
   98% não conta história, ela está dentro ou fora. Ficam na grade, cada um
   com a régua da própria faixa normal.

   Nada aqui se digita. Os valores chegam da balança e do aparelho
   conectados, e a tela diz isso em vez de oferecer um botão de registrar
   que não teria para onde levar.
   ============================================================ */

/* Faixas de referência: [mínimo da escala, máximo, normal de, normal até] */
const FAIXA: Record<string, [number, number, number, number]> = {
  fc: [45, 120, 60, 100], spo2: [85, 100, 94, 100], fr: [8, 28, 12, 20], glic: [60, 140, 70, 99],
};

function Regua({ k, num }: { k: string; num: number }) {
  const { c } = useTheme();
  const [min, max, lo, hi] = FAIXA[k];
  const pos = (x: number) => Math.max(3, Math.min(97, ((x - min) / (max - min)) * 100));
  const ok = num >= lo && num <= hi;
  return (
    <View style={{ height: 6, borderRadius: 3, backgroundColor: c.track, marginTop: 12 }}>
      <View style={{ position: 'absolute', left: `${pos(lo)}%`, width: `${pos(hi) - pos(lo)}%`, top: 0, bottom: 0, borderRadius: 3, backgroundColor: c.accentWeak, borderWidth: 1, borderColor: c.accentLine }} />
      <View style={{ position: 'absolute', left: `${pos(num)}%`, top: -2.5, width: 11, height: 11, marginLeft: -5.5, borderRadius: 6, backgroundColor: ok ? c.accent : c.cta, borderWidth: 2.5, borderColor: c.bg1 }} />
    </View>
  );
}

/* Card de série — o mesmo desenho de Peso, Medidas e Exames. */
function CardSerie({ nome, sub, valor, unidade, pts, id }: {
  nome: string; sub: string; valor: string; unidade: string; pts: number[]; id: string;
}) {
  const { c } = useTheme();
  const curva = useMemo(() => {
    if (pts.length < 2) return [];
    const lo = Math.min(...pts), hi = Math.max(...pts), span = hi - lo || 1;
    return pts.map((v, i) => ({ x: i / (pts.length - 1), y: (v - lo) / span }));
  }, [pts]);

  return (
    <View style={[{ backgroundColor: c.bg1, borderRadius: radius.card, overflow: 'hidden' }, shadowCard(c)]}>
      <Row style={{ paddingHorizontal: 16, paddingTop: 16, paddingBottom: 12, alignItems: 'flex-start' }}>
        <View style={{ flex: 1 }}>
          <Txt v="body">{nome}</Txt>
          <Txt v="note" c={c.tx3} style={{ marginTop: 2 }}>{sub}</Txt>
        </View>
        <Txt v="metric">
          {valor}
          <Txt v="label" c={c.tx3}>{` ${unidade}`}</Txt>
        </Txt>
      </Row>
      {curva.length > 1 ? (
        <AreaCurve
          pts={curva} height={100} padT={6} padB={0} padX={0} strokeW={2}
          strokeFrom={c.limeDim} strokeTo={c.limeDim} dashed={false} id={id}
        />
      ) : null}
    </View>
  );
}

export default function Saude() {
  const S = useStore((s) => s.S);
  const { c } = useTheme();
  const router = useRouter();

  const pa = vitalLast(S, 'pa'), fc = vitalLast(S, 'fc');
  const gl = vitalLast(S, 'glic'), sp = vitalLast(S, 'spo2'), fr = vitalLast(S, 'fr');

  const paSerie = (S.vitals.pa as any[]).map((x) => x.sys);
  const glSerie = (S.vitals.glic as any[]).map((x) => x.v);
  const pa0 = (S.vitals.pa as any[])[0];
  const gl0 = (S.vitals.glic as any[])[0];

  const pontuais = [
    { k: 'fc', label: 'Freq. cardíaca', val: `${fc.v}`, u: 'bpm', num: fc.v, ic: 'activity' },
    { k: 'spo2', label: 'Saturação O₂', val: `${sp.v}`, u: '%', num: sp.v, ic: 'drop2' },
    { k: 'fr', label: 'Freq. respiratória', val: `${fr.v}`, u: 'rpm', num: fr.v, ic: 'waves' },
    { k: 'glic', label: 'Glicemia', val: `${gl.v}`, u: 'mg/dL', num: gl.v, ic: 'water' },
  ];

  return (
    <TelaInterna titulo="Sinais vitais">
      <Titulao
        titulo="Sinais vitais"
        lead="Indicadores que melhoram junto com o peso — e que a balança sozinha não mostra."
      />

      <Bloco titulo="Acompanhados ao longo do tempo">
        <View style={{ gap: 10 }}>
          <CardSerie
            id="pa"
            nome="Pressão arterial"
            sub={`${pa0.sys}/${pa0.dia} no início · ${paSerie.length} medições`}
            valor={`${pa.sys}/${pa.dia}`}
            unidade="mmHg"
            pts={paSerie}
          />
          <CardSerie
            id="gl"
            nome="Glicemia de jejum"
            sub={`${gl0.v} mg/dL no início · ${glSerie.length} medições`}
            valor={`${gl.v}`}
            unidade="mg/dL"
            pts={glSerie}
          />
        </View>
      </Bloco>

      <Bloco
        titulo="Última leitura"
        nota="Medida pontual: estes números dizem se você está dentro da faixa, não para onde está indo."
      >
        <Grade2>
          {pontuais.map((t) => {
            const [, , lo, hi] = FAIXA[t.k];
            const ok = t.num >= lo && t.num <= hi;
            return (
              <View
                key={t.k}
                style={[{ flex: 1, backgroundColor: c.bg1, borderRadius: radius.card, paddingHorizontal: 14, paddingVertical: 13 }, shadowCard(c)]}
              >
                <Row style={{ justifyContent: 'space-between', gap: 8 }}>
                  <Icon name={t.ic} size={17} color={c.tx2} sw={1.8} />
                  <Selo label={ok ? 'normal' : t.num < lo ? 'baixo' : 'alto'} tom={ok ? 'verde' : 'neutra'} />
                </Row>
                <Txt v="title" style={{ marginTop: 9 }}>
                  {t.val}
                  <Txt v="caption" c={c.tx3}>{` ${t.u}`}</Txt>
                </Txt>
                <Txt v="caption" c={c.tx3} style={{ marginTop: 1 }}>{t.label}</Txt>
                <Regua k={t.k} num={t.num} />
              </View>
            );
          })}
        </Grade2>
      </Bloco>

      <Bloco titulo="De onde vêm">
        <Cartao>
          <Linha
            ic="check"
            titulo="Withings conectada"
            sub="Peso e pressão sincronizam sozinhos, sem você digitar nada"
            onPress={() => router.push('/integracoes' as any)}
          />
        </Cartao>
      </Bloco>

      {/* A tela não tem botão de registrar, e isso é deliberado: não existe
          captura de sinais vitais no app. Um botão aqui prometeria uma tela
          que não existe — a mesma armadilha que "Registrar novas medidas"
          era em Medidas, onde o Pressable não tinha onPress. */}
      <Aviso
        ic="info"
        titulo="Estes números não se digitam"
        texto="Pressão, saturação e frequência chegam do aparelho conectado. Para acrescentar um resultado de laboratório, use Exames."
      />

      <View />
    </TelaInterna>
  );
}
