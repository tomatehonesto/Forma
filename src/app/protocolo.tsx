import React from 'react';
import { View } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useStore } from '../logic/store';
import { semanaDoHistorico } from '../logic/derive';
import { WD, fmtPeriodo } from '../logic/time';
import { Txt, Row, SheetScreen } from '../ui/kit';
import { Icon } from '../ui/Icon';
import { Cartao } from '../ui/internas';
import { useTheme } from '../ui/useTheme';
import { radius } from '../theme';

/* ============================================================
   UMA SEMANA DO PROTOCOLO

   A folha que abre ao tocar numa linha de "semanas anteriores". A linha
   diz 5/7 e para aí; quem toca nela quer a coisa que a fração esconde:
   QUAIS dias.

   Cinco de sete seguidos e cinco de sete alternados são a mesma fração e
   semanas diferentes — a primeira é um hábito que caiu na quinta, a
   segunda é um hábito que nunca pegou. É a mesma informação que a tira
   de dias dá nos diários, e pelo mesmo motivo: constância não cabe num
   número.

   TRÊS METAS, E SÓ ELAS. Aplicação e exame não aparecem aqui como não
   aparecem na lista: o app não guarda registro de quem marcou o quê nas
   semanas passadas, e inventar um visto seria repetir com outra roupa a
   história cravada no código que esta seção já teve.
   ============================================================ */

export default function ProtocoloDaSemana() {
  const S = useStore((s) => s.S);
  const { c } = useTheme();
  const router = useRouter();
  const { t } = useLocalSearchParams<{ t?: string }>();

  const ate = Number(t);
  const w = semanaDoHistorico(S, ate);

  return (
    <SheetScreen
      titulo={`Semana ${w.semana}`}
      sub={fmtPeriodo(new Date(w.de), new Date(w.ate))}
      onClose={() => router.back()}
    >
      <View style={{ marginTop: 18 }}>
        <Cartao>
          {w.metas.map((m) => (
            <View key={m.ic} style={{ paddingHorizontal: 16, paddingVertical: 15 }}>
              <Row style={{ alignItems: 'flex-start' }}>
                <View style={{ flex: 1, paddingRight: 10 }}>
                  <Row gap={8}>
                    <Icon name={m.ic} size={15} color={c.tx3} sw={2} />
                    <Txt v="bodyMed" style={{ flex: 1 }}>{m.texto}</Txt>
                  </Row>
                  <Txt v="caption" c={c.tx3} style={{ marginTop: 3 }}>{m.resumo}</Txt>
                </View>
                {/* A fração em tinta de meta batida ou não, igual à linha
                    da lista de onde a pessoa veio: ela precisa reconhecer
                    o número que tocou. */}
                <Txt v="bodyMed" c={m.feito >= m.alvo ? c.accent : c.tx3}>
                  {m.feito}/{m.alvo}
                </Txt>
              </Row>

              {/* OS SETE DIAS.

                  Cheio no dia em que a meta bateu, vazado no dia em que
                  não bateu, e um traço fino no dia SEM REGISTRO — porque
                  "não sei" e "não bateu" continuam sendo respostas
                  diferentes, mesmo quando as duas dão no mesmo lugar. */}
              <Row style={{ marginTop: 12 }}>
                {m.dias.map((d) => {
                  const semDado = d.valor == null;
                  return (
                    <View key={d.t} style={{ flex: 1, alignItems: 'center', gap: 6 }}>
                      <View style={{
                        width: 26, height: 26, borderRadius: radius.sm,
                        alignItems: 'center', justifyContent: 'center',
                        backgroundColor: d.ok ? c.accent : semDado ? 'transparent' : c.bg3,
                        borderWidth: semDado ? 1 : 0,
                        borderColor: c.line2,
                        borderStyle: 'dashed',
                      }}>
                        {d.ok ? <Icon name="check" size={13} color={c.accentInk} sw={2.6} /> : null}
                      </View>
                      <Txt v="micro" c={c.tx4}>{WD[new Date(d.t).getDay()]}</Txt>
                    </View>
                  );
                })}
              </Row>
            </View>
          ))}
        </Cartao>

        {/* A RESSALVA, uma vez e no fim. Ela é a mesma da lista: o app
            guarda a meta de hoje, não a história dela. */}
        <Txt v="micro" c={c.tx4} style={{ textAlign: 'center', marginTop: 14 }}>
          As metas são as de hoje, medidas nos registros desta semana.
        </Txt>
      </View>
    </SheetScreen>
  );
}
