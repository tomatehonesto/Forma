import React from 'react';
import { View } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useStore } from '../logic/store';
import { degrausDe } from '../logic/conquistas';
import { relDay } from '../logic/time';
import { Txt, Row, SheetScreen } from '../ui/kit';
import { Icon } from '../ui/Icon';
import { useTheme } from '../ui/useTheme';
import { radius } from '../theme';
import { T } from '../textos';

/* ============================================================
   UMA TRILHA, DEGRAU A DEGRAU

   O cartão da grade mostra o nível atual, e só. A progressão — que é
   justamente o que a trilha guarda e os cartões avulsos não guardavam —
   ficava reduzida a um número e seis bolinhas.

   Aqui ela é a lista: cada degrau com o que pede, e quando foi passado.
   "Nível 1 há setenta dias, nível 2 há trinta, nível 3 faltam doze dias"
   conta uma história que "nível 2 de 6" não conta — a de quem está
   acelerando, ou a de quem parou em março.

   O DEGRAU ATUAL É O ÚNICO EM LIMA. Os já passados são cinza com marca de
   check: eles aconteceram, e ficaram para trás. Pintar os seis de lima
   faria a lista inteira comemorar, e o que a pessoa quer achar aqui é
   onde ela está.
   ============================================================ */

export default function Trilha() {
  const S = useStore((s) => s.S);
  const { c } = useTheme();
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id?: string }>();

  const t = id ? degrausDe(S, id) : null;
  if (!t) { router.back(); return null; }

  return (
    <SheetScreen titulo={t.titulo} sub={T.conquistas.tela.nivelDeTotal(t.nivel, t.degraus.length)} onClose={() => router.back()}>
      <View style={{ marginTop: 18, gap: 10 }}>
        {t.degraus.map((d, i) => {
          const passou = d.t != null;
          const atual = i === t.nivel - 1;
          return (
            <Row
              key={i} gap={13}
              style={{
                alignItems: 'center',
                backgroundColor: atual ? c.limeSoft : c.bg1,
                borderRadius: radius.md, paddingHorizontal: 14, paddingVertical: 13,
              }}
            >
              {/* O NÚMERO DO DEGRAU, e não um ícone repetido: a trilha
                  inteira tem um ícone só, e seis cópias dele numa coluna
                  não separariam um degrau do outro. */}
              <View style={{
                width: 28, height: 28, borderRadius: 14,
                backgroundColor: passou ? (atual ? c.lime : c.bg3) : c.bg2,
                alignItems: 'center', justifyContent: 'center',
              }}>
                {passou
                  ? <Icon name="check" size={14} color={atual ? c.limeInk : c.tx3} sw={2.8} />
                  : <Txt v="micro" c={c.tx4}>{i + 1}</Txt>}
              </View>

              <View style={{ flex: 1 }}>
                <Txt v="bodyMed" c={passou ? c.tx : c.tx3}>{d.desc}</Txt>
                {/* O que falta aparece SÓ NO PRÓXIMO. Nos degraus mais
                    distantes ele seria a mesma conta somada, e uma coluna
                    de "faltam 12, faltam 62, faltam 162" transforma a
                    trilha numa fila de cobranças. */}
                {!passou && i === t.nivel ? (
                  <Txt v="micro" c={c.tx3} style={{ marginTop: 2 }}>{t.falta}</Txt>
                ) : null}
              </View>

              {passou ? <Txt v="micro" c={c.tx4}>{relDay(new Date(d.t!))}</Txt> : null}
            </Row>
          );
        })}
      </View>

      {/* A frase do pé é a mesma regra que vale para todas: o degrau conta
          pelo valor de hoje, e não pela data de ontem. */}
      <Txt v="micro" c={c.tx4} style={{ marginTop: 16, lineHeight: 17 }}>
        {T.conquistas.tela.ossoDaRegra}
      </Txt>
    </SheetScreen>
  );
}
