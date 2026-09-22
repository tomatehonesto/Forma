import React from 'react';
import { View } from 'react-native';
import { useRouter } from 'expo-router';
import { useStore } from '../logic/store';
import { vitalLast } from '../logic/derive';
import { fmtDate } from '../logic/time';
import { Txt, Row } from '../ui/kit';
import { Icon } from '../ui/Icon';
import {
  TelaInterna, Titulao, Bloco, Cartao, Linha, Aviso, Selo, Grade2, CardCurva,
} from '../ui/internas';
import { useTheme } from '../ui/useTheme';
import { radius, shadowCard } from '../theme';
import { T } from '../textos';

/* ⚠️ É FUNÇÃO, e não constante de módulo: ela lê o catálogo, e constante
   de módulo congela o idioma no import. */
const K = () => T.medidas.telaSinaisVitais;

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
    { k: 'fc', label: K().pontuais.fc, val: `${fc.v}`, u: 'bpm', num: fc.v, ic: 'activity' },
    { k: 'spo2', label: K().pontuais.spo2, val: `${sp.v}`, u: '%', num: sp.v, ic: 'drop2' },
    { k: 'fr', label: K().pontuais.fr, val: `${fr.v}`, u: 'rpm', num: fr.v, ic: 'waves' },
    { k: 'glic', label: K().pontuais.glic, val: `${gl.v}`, u: 'mg/dL', num: gl.v, ic: 'water' },
  ];

  return (
    <TelaInterna titulo={K().titulo}>
      <Titulao titulo={K().titulo} lead={K().lead} />

      <Bloco titulo={K().aoLongoDoTempo}>
        <View style={{ gap: 10 }}>
          {/* A leitura ao deslizar mostra a sistólica de cada medição com a
              data. A curva é da sistólica sozinha — é ela que carrega a
              tendência; a diastólica acompanha e caberia mal numa linha. */}
          <CardCurva
            id="pa"
            nome={K().pressaoArterial}
            sub={K().pressaoSub(`${pa0.sys}/${pa0.dia}`, paSerie.length)}
            valor={`${pa.sys}/${pa.dia}`}
            unidade="mmHg"
            pontos={(S.vitals.pa as any[]).map((x) => ({
              v: x.sys, rotulo: `${x.sys}/${x.dia}`, quando: fmtDate(x.t),
            }))}
          />
          <CardCurva
            id="gl"
            nome={K().glicemiaDeJejum}
            sub={K().glicemiaSub(gl0.v, glSerie.length)}
            valor={`${gl.v}`}
            unidade="mg/dL"
            pontos={(S.vitals.glic as any[]).map((x) => ({
              v: x.v, rotulo: `${x.v}`, quando: fmtDate(x.t),
            }))}
          />
        </View>
      </Bloco>

      <Bloco
        titulo={K().ultimaLeitura}
        nota={K().ultimaLeituraNota}
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
                  <Selo label={ok ? K().seloNormal : t.num < lo ? K().seloBaixo : K().seloAlto} tom={ok ? 'verde' : 'neutra'} />
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

      {/* ⚠️⚠️ AQUI DIZIA "WITHINGS CONECTADA", e nada estava conectado.

          A linha era texto fixo — não lia `S.integrations` nem coisa
          nenhuma — afirmando uma balança ligada e um peso que chega
          sozinho. E o próprio integracoes.ts diz, num comentário, que
          Garmin, Fitbit e Withings são "o que cada uma traria, no dia em
          que houver servidor": a linha prometia justamente a coisa que o
          módulo da promessa marca como inexistente.

          Status falso é pior que status nenhum. Quem lê "conectada" e não
          vê o peso aparecer conclui que o aplicativo está quebrado — e
          quem lê e acredita para de pesar. */}
      <Bloco titulo={K().deOndeVem}>
        <Cartao>
          <Linha
            ic="trend"
            titulo={K().aparelhosEContas}
            sub={K().aparelhosEContasSub}
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
        titulo={K().naoSeDigitam}
        /* ⚠️ E ELES TAMBÉM NÃO CHEGAM, ainda. O texto dizia que pressão,
           saturação e frequência "chegam do aparelho conectado", no
           presente: a leitura do aparelho traz só PESO, e as contas que
           trariam pressão dependem de um servidor que não existe. Nada,
           hoje, escreve um sinal vital — só a semente. Dizer de onde eles
           virão é honesto; dizer que já vêm não é. */
        texto={K().naoSeDigitamTexto}
      />

      <View />
    </TelaInterna>
  );
}
