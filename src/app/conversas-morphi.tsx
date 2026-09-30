import React, { useMemo, useState } from 'react';
import { View, Pressable, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useStore } from '../logic/store';
import { conversas, conversaAtual, abrirConversa, apagarConversa, recomecarConversa, type Conversa } from '../logic/conversa';
import { now, startOfDay, fmtDate, fmtTime, DAY } from '../logic/time';
import { Txt, Row, SheetScreen } from '../ui/kit';
import { Botao } from '../ui/internas';
import { Icon } from '../ui/Icon';
import { useTheme } from '../ui/useTheme';
import { radius, font } from '../theme';
import { T } from '../textos';

const K = () => T.companion.telaConversa;

/* ============================================================
   AS CONVERSAS ANTERIORES DA MORPHI INTELLIGENCE

   A folha que abre por cima da conversa (/companion), pelo menu do
   canto esquerdo — o mesmo lugar em que os apps de conversa guardam as
   conversas e o "novo". "Nova conversa" vem primeiro, porque é o gesto
   mais comum. Cada conversa leva o título da primeira pergunta; tocar
   reabre e continua de onde parou. Ver logic/conversa, "As conversas
   guardadas".

   Os grupos são os que a pessoa usa para lembrar — hoje, a última
   semana, antes —, e não um calendário: ninguém procura uma conversa
   pela data exata.

   ⚠️ APAGAR PERGUNTA ANTES. Não tem volta — a conversa só existe no
   aparelho —, então a linha vira a pergunta, com "Apagar" e "Cancelar",
   em vez de sumir no primeiro toque.
   ============================================================ */
export default function ConversasMorphi() {
  const { c } = useTheme();
  const router = useRouter();
  const S = useStore((s) => s.S);
  const update = useStore((s) => s.update);
  const [apagando, setApagando] = useState<string | null>(null);

  const lista = useMemo(() => conversas(S), [S]);
  const aberta = conversaAtual(S)?.id;

  const grupos = useMemo(() => {
    const hoje = +startOfDay(now());
    const semana = hoje - 6 * DAY;
    const g: { titulo: string; itens: Conversa[] }[] = [
      { titulo: K().grupoHoje, itens: lista.filter((x) => x.atualizada >= hoje) },
      { titulo: K().grupoSemana, itens: lista.filter((x) => x.atualizada < hoje && x.atualizada >= semana) },
      { titulo: K().grupoAntes, itens: lista.filter((x) => x.atualizada < semana) },
    ];
    return g.filter((x) => x.itens.length);
  }, [lista]);

  const quando = (t: number) => (t >= +startOfDay(now()) ? fmtTime(new Date(t)) : fmtDate(t));

  return (
    <SheetScreen titulo={K().historicoTitulo} onClose={() => router.back()}>
      <Pressable
        onPress={() => { update((s: any) => { recomecarConversa(s); }); router.back(); }}
        style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1, marginTop: 4, marginBottom: 20 }]}
      >
        <Row gap={12} style={{ alignItems: 'center', backgroundColor: c.bg1, borderRadius: radius.lg, paddingHorizontal: 16, paddingVertical: 14 }}>
          <View style={{ width: 30, height: 30, borderRadius: 15, backgroundColor: c.accent, alignItems: 'center', justifyContent: 'center' }}>
            <Icon name="plus" size={16} color={c.accentInk} sw={2.2} />
          </View>
          <Txt v="label" style={{ flex: 1, fontFamily: font.bodySemi }}>{K().novaConversa}</Txt>
        </Row>
      </Pressable>
      {!lista.length ? (
        <Txt v="body" c={c.tx2} style={{ marginTop: 8, lineHeight: 23 }}>{K().historicoVazio}</Txt>
      ) : (
        <View style={{ marginTop: 4, gap: 20 }}>
          {grupos.map((g) => (
            <View key={g.titulo} style={{ gap: 8 }}>
              <Txt v="micro" c={c.tx3} style={{ letterSpacing: 0.6, textTransform: 'uppercase' }}>{g.titulo}</Txt>
              <View style={{ backgroundColor: c.bg1, borderRadius: radius.lg, overflow: 'hidden' }}>
                {g.itens.map((x, i) => (
                  <View key={x.id} style={i ? { borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: c.line } : undefined}>
                    {apagando === x.id ? (
                      <View style={{ padding: 16, gap: 10 }}>
                        <Txt v="label">{K().apagarPergunta}</Txt>
                        <Row gap={8}>
                          <View style={{ flex: 1 }}>
                            <Botao label={K().apagar} tom="perigo" onPress={() => { update((s: any) => { apagarConversa(s, x.id); }); setApagando(null); }} />
                          </View>
                          <View style={{ flex: 1 }}>
                            <Botao label={K().cancelar} tom="fantasma" onPress={() => setApagando(null)} />
                          </View>
                        </Row>
                      </View>
                    ) : (
                      <Row style={{ alignItems: 'center' }}>
                        <Pressable
                          onPress={() => { update((s: any) => { abrirConversa(s, x.id); }); router.back(); }}
                          style={({ pressed }) => [{ flex: 1, opacity: pressed ? 0.65 : 1 }]}
                        >
                          <Row gap={12} style={{ paddingLeft: 16, paddingVertical: 14, alignItems: 'center' }}>
                            {/* A que está aberta leva o ponto: é para onde
                                fechar a folha volta. */}
                            <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: x.id === aberta ? c.accent : 'transparent' }} />
                            <View style={{ flex: 1, gap: 3 }}>
                              <Txt v="label" numberOfLines={2} style={{ fontFamily: font.bodySemi }}>{x.titulo}</Txt>
                              <Txt v="micro" c={c.tx3}>{`${quando(x.atualizada)} · ${K().mensagens(x.msgs.length)}`}</Txt>
                            </View>
                          </Row>
                        </Pressable>
                        <Pressable
                          onPress={() => setApagando(x.id)}
                          accessibilityLabel={K().apagar} hitSlop={8}
                          style={({ pressed }) => [{ paddingHorizontal: 16, paddingVertical: 14, opacity: pressed ? 0.5 : 1 }]}
                        >
                          <Icon name="trash" size={16} color={c.tx4} sw={1.9} />
                        </Pressable>
                      </Row>
                    )}
                  </View>
                ))}
              </View>
            </View>
          ))}
        </View>
      )}
    </SheetScreen>
  );
}
