import React, { useMemo, useState } from 'react';
import { View, Pressable, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { useStore } from '../logic/store';
import { timelineEvents, timelineCounts, type TLKind } from '../logic/derive';
import { relDay } from '../logic/time';
import { Screen, Txt, Row, CircleBtn, Divider } from '../ui/kit';
import { Icon } from '../ui/Icon';
import { useTheme } from '../ui/useTheme';
import { radius } from '../theme';

const MES = ['janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho', 'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'];

/* Histórico linha por linha — o registro completo, para quem veio conferir
   algo específico. A Jornada mostra o que importa; aqui está tudo.
   É por isso que os filtros por tipo moram nesta tela, e não lá. */
export default function Historico() {
  const S = useStore((s) => s.S);
  const { c } = useTheme();
  const router = useRouter();
  const [filtro, setFiltro] = useState<TLKind | null>(null);

  const eventos = useMemo(() => timelineEvents(S), [S]);
  const contagens = useMemo(() => timelineCounts(S), [S]);
  const cor = (k: string) => (c as any)[k] as string;

  const feed = filtro ? eventos.filter((e) => e.kind === filtro) : eventos;

  /* agrupado por mês — sem isso vira rolagem infinita sem referência */
  const paginas = useMemo(() => {
    const g: { titulo: string; eventos: typeof feed }[] = [];
    for (const ev of feed) {
      const d = new Date(ev.day);
      const titulo = `${MES[d.getMonth()]} de ${d.getFullYear()}`;
      const ultima = g[g.length - 1];
      if (ultima && ultima.titulo === titulo) ultima.eventos.push(ev);
      else g.push({ titulo, eventos: [ev] });
    }
    return g;
  }, [feed]);

  return (
    <Screen>
      <Row style={{ justifyContent: 'space-between', alignItems: 'flex-start', marginTop: 8 }}>
        <View style={{ flex: 1 }}>
          <Txt v="h1">Histórico</Txt>
          <Txt v="note" c={c.tx3} style={{ marginTop: 4 }}>
            {eventos.length} registros desde o início do tratamento.
          </Txt>
        </View>
        <CircleBtn name="back" onPress={() => router.back()} />
      </Row>

      <ScrollView horizontal showsHorizontalScrollIndicator={false}
        style={{ marginTop: 18, marginHorizontal: -24 }}
        contentContainerStyle={{ paddingHorizontal: 24, gap: 6 }}>
        <Pressable onPress={() => setFiltro(null)}>
          <Row gap={6} style={{ backgroundColor: filtro === null ? c.tx : c.bg1, paddingHorizontal: 14, paddingVertical: 9, borderRadius: radius.pill }}>
            <Txt v="label" c={filtro === null ? c.onHero : c.tx2}>Tudo</Txt>
            <Txt v="micro" c={filtro === null ? c.lime : c.tx4}>{eventos.length}</Txt>
          </Row>
        </Pressable>
        {contagens.map((f) => {
          const on = filtro === f.kind;
          return (
            <Pressable key={f.kind} onPress={() => setFiltro(on ? null : f.kind)}>
              <Row gap={6} style={{ backgroundColor: on ? c.tx : c.bg1, paddingHorizontal: 14, paddingVertical: 9, borderRadius: radius.pill }}>
                <Txt v="label" c={on ? c.onHero : c.tx2}>{f.label}</Txt>
                <Txt v="micro" c={on ? c.lime : c.tx4}>{f.n}</Txt>
              </Row>
            </Pressable>
          );
        })}
      </ScrollView>

      {paginas.map((pag) => (
        <View key={pag.titulo} style={{ marginTop: 26 }}>
          <Row gap={10} style={{ marginBottom: 12 }}>
            <Txt v="micro" c={c.tx3} style={{ letterSpacing: 1, textTransform: 'uppercase' }}>{pag.titulo}</Txt>
            <View style={{ flex: 1, height: 1, backgroundColor: c.line }} />
          </Row>

          <View style={{ backgroundColor: c.bg1, borderRadius: radius.lg, paddingHorizontal: 16, paddingVertical: 4 }}>
            {pag.eventos.map((ev, i) => (
              <React.Fragment key={ev.key}>
                {i > 0 && <Divider />}
                <Row style={{ alignItems: 'flex-start', paddingVertical: 13 }}>
                  <View style={{ width: 30, height: 30, borderRadius: 15, backgroundColor: cor(ev.color) + '1F', alignItems: 'center', justifyContent: 'center' }}>
                    <Icon name={ev.ic} size={14} color={cor(ev.color)} sw={1.9} />
                  </View>
                  <View style={{ flex: 1, marginLeft: 12 }}>
                    <Row style={{ justifyContent: 'space-between' }}>
                      <Txt v="body" style={{ flex: 1, marginRight: 8 }}>{ev.title}</Txt>
                      {ev.value ? <Txt v="micro" c={ev.valueColor ? cor(ev.valueColor) : c.tx4}>{ev.value}</Txt> : null}
                    </Row>
                    <Txt v="caption" c={c.tx3} style={{ marginTop: 2 }} numberOfLines={2}>{ev.sub}</Txt>
                    <Txt v="micro" c={c.tx4} style={{ marginTop: 3, textTransform: 'capitalize' }}>{relDay(new Date(ev.day))}</Txt>
                  </View>
                </Row>
              </React.Fragment>
            ))}
          </View>
        </View>
      ))}

      {feed.length === 0 && (
        <Txt v="note" c={c.tx3} style={{ paddingVertical: 30, textAlign: 'center' }}>
          Nada registrado neste tipo ainda.
        </Txt>
      )}
    </Screen>
  );
}
