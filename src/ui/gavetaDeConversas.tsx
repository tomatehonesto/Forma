import React, { useEffect, useMemo, useRef, useState } from 'react';
import { View, Pressable, StyleSheet, Animated, BackHandler, useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useStore } from '../logic/store';
import { conversas, conversaAtual, abrirConversa, apagarConversa, recomecarConversa, type Conversa } from '../logic/conversa';
import { now, startOfDay, fmtDate, fmtTime, DAY } from '../logic/time';
import { Txt, Row, Rolagem } from './kit';
import { Botao } from './internas';
import { Icon } from './Icon';
import { useTheme } from './useTheme';
import { radius, font } from '../theme';
import { T } from '../textos';

const K = () => T.companion.telaConversa;

/* ============================================================
   A GAVETA DAS CONVERSAS DA MORPHI INTELLIGENCE

   Desliza da esquerda por cima da conversa (/companion), pelo menu do
   canto esquerdo — o lugar em que os apps de conversa guardam as
   conversas. Era uma folha de baixo; a gaveta é o gesto que a pessoa já
   conhece, e deixa a conversa visível ao lado, que é para onde ela volta.

   Mais simples que a dos apps grandes: "Nova conversa" no alto, porque é
   o gesto mais comum, e embaixo as conversas, agrupadas como a pessoa
   lembra — hoje, a última semana, antes. Sem pastas, sem busca: são até
   trinta conversas, e o título da primeira pergunta basta para achar.

   ⚠️ FECHA POR TRÊS CAMINHOS: a sombra à direita, o voltar do Android e
   qualquer escolha dentro dela (abrir, nova). Aberta, o voltar do Android
   fecha a gaveta, e não a tela.

   ⚠️ APAGAR PERGUNTA ANTES. Não tem volta — a conversa só existe no
   aparelho —, então a linha vira a pergunta, com "Apagar" e "Cancelar".
   ============================================================ */
export function GavetaDeConversas({ aberta, onFechar }: { aberta: boolean; onFechar: () => void }) {
  const { c } = useTheme();
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const S = useStore((s) => s.S);
  const update = useStore((s) => s.update);
  const [apagando, setApagando] = useState<string | null>(null);

  const largura = Math.min(width * 0.84, 360);
  const anda = useRef(new Animated.Value(0)).current;
  const [montada, setMontada] = useState(aberta);

  useEffect(() => {
    if (aberta) setMontada(true);
    Animated.timing(anda, { toValue: aberta ? 1 : 0, duration: aberta ? 240 : 200, useNativeDriver: true })
      .start(({ finished }) => { if (finished && !aberta) { setMontada(false); setApagando(null); } });
  }, [aberta]);

  useEffect(() => {
    if (!aberta) return;
    const sub = BackHandler.addEventListener('hardwareBackPress', () => { onFechar(); return true; });
    return () => sub.remove();
  }, [aberta]);

  const lista = useMemo(() => conversas(S), [S]);
  const atual = conversaAtual(S)?.id;

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

  if (!montada) return null;

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents={aberta ? 'auto' : 'none'}>
      <Animated.View style={[StyleSheet.absoluteFill, { backgroundColor: 'rgba(0,0,0,0.5)', opacity: anda }]}>
        <Pressable style={StyleSheet.absoluteFill} onPress={onFechar} accessibilityLabel={K().fechar} />
      </Animated.View>

      <Animated.View style={{
        position: 'absolute', top: 0, bottom: 0, left: 0, width: largura,
        backgroundColor: c.bg, borderRightWidth: StyleSheet.hairlineWidth, borderRightColor: c.line,
        paddingTop: insets.top + 14,
        transform: [{ translateX: anda.interpolate({ inputRange: [0, 1], outputRange: [-largura, 0] }) }],
      }}>
        <View style={{ paddingHorizontal: 20 }}>
          <Txt v="title" style={{ fontSize: 24, lineHeight: 30 }}>{K().historicoTitulo}</Txt>
          <Pressable
            onPress={() => { update((s: any) => { recomecarConversa(s); }); onFechar(); }}
            style={({ pressed }) => [{ opacity: pressed ? 0.75 : 1, marginTop: 18 }]}
          >
            <Row gap={10} style={{ alignItems: 'center', alignSelf: 'flex-start', backgroundColor: c.accent, borderRadius: radius.pill, paddingLeft: 14, paddingRight: 18, paddingVertical: 11 }}>
              <Icon name="pencil" size={16} color={c.accentInk} sw={2.1} />
              <Txt v="label" c={c.accentInk} style={{ fontFamily: font.bodySemi }}>{K().novaConversa}</Txt>
            </Row>
          </Pressable>
        </View>

        <Rolagem style={{ flex: 1, marginTop: 22 }} contentContainerStyle={{ paddingHorizontal: 12, paddingBottom: insets.bottom + 24 }} showsVerticalScrollIndicator={false}>
          {!lista.length ? (
            <Txt v="caption" c={c.tx3} style={{ paddingHorizontal: 8, lineHeight: 20 }}>{K().historicoVazio}</Txt>
          ) : grupos.map((g) => (
            <View key={g.titulo} style={{ marginBottom: 18 }}>
              <Txt v="micro" c={c.tx3} style={{ paddingHorizontal: 8, marginBottom: 6, letterSpacing: 0.6, textTransform: 'uppercase' }}>{g.titulo}</Txt>
              {g.itens.map((x) => (apagando === x.id ? (
                <View key={x.id} style={{ backgroundColor: c.bg1, borderRadius: radius.md, padding: 12, gap: 10, marginBottom: 4 }}>
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
                /* A aberta tem o fundo tingido: é para onde fechar volta. */
                <Row key={x.id} style={{ alignItems: 'center', borderRadius: radius.md, backgroundColor: x.id === atual ? c.bg1 : 'transparent', marginBottom: 2 }}>
                  <Pressable
                    onPress={() => { update((s: any) => { abrirConversa(s, x.id); }); onFechar(); }}
                    style={({ pressed }) => [{ flex: 1, paddingHorizontal: 8, paddingVertical: 10, opacity: pressed ? 0.6 : 1 }]}
                  >
                    <Txt v="body" numberOfLines={1}>{x.titulo}</Txt>
                    <Txt v="micro" c={c.tx3} style={{ marginTop: 2 }}>{`${quando(x.atualizada)} · ${K().mensagens(x.msgs.length)}`}</Txt>
                  </Pressable>
                  <Pressable
                    onPress={() => setApagando(x.id)}
                    accessibilityLabel={K().apagar} hitSlop={6}
                    style={({ pressed }) => [{ paddingHorizontal: 10, paddingVertical: 10, opacity: pressed ? 0.5 : 1 }]}
                  >
                    <Icon name="trash" size={15} color={c.tx4} sw={1.9} />
                  </Pressable>
                </Row>
              )))}
            </View>
          ))}
        </Rolagem>
      </Animated.View>
    </View>
  );
}
