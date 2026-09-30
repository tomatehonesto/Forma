import React, { useEffect, useMemo, useRef, useState } from 'react';
import { View, Pressable, StyleSheet, Animated, BackHandler, useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useStore } from '../logic/store';
import { conversas, conversaAtual, abrirConversa, apagarConversa, recomecarConversa, type Conversa } from '../logic/conversa';
import { now, startOfDay, fmtDate, fmtTime, DAY } from '../logic/time';
import { Txt, Row, Rolagem, CircleBtn } from './kit';
import { Botao } from './internas';
import { Icon } from './Icon';
import { useTheme } from './useTheme';
import { radius, font } from '../theme';
import { T } from '../textos';

const K = () => T.companion.telaConversa;

/* ============================================================
   A GAVETA DAS CONVERSAS DA MORPHI INTELLIGENCE

   Abre pelo menu do canto esquerdo da conversa (/companion) — o lugar em
   que os apps de conversa guardam as conversas — e EMPURRA a conversa
   para a direita, em vez de cobri-la: a gaveta mora embaixo da tela, e é
   a tela que anda. A borda da conversa continua à vista, escurecida, e é
   para lá que a pessoa volta.

   Mais simples que a dos apps grandes: "Nova conversa" no alto, porque é
   o gesto mais comum, e embaixo as conversas, agrupadas como a pessoa
   lembra — hoje, a última semana, antes. Sem pastas, sem busca: são até
   trinta conversas, e o título da primeira pergunta basta para achar.

   ⚠️ FECHA POR QUATRO CAMINHOS: o X dela, a borda escurecida da conversa,
   o voltar do Android e qualquer escolha dentro dela (abrir, nova).
   Aberta, o voltar do Android fecha a gaveta, e não a tela.

   ⚠️ APAGAR PERGUNTA ANTES. Não tem volta — a conversa só existe no
   aparelho —, então a linha vira a pergunta, com "Apagar" e "Cancelar".
   ============================================================ */
export function GavetaDeConversas({ aberta, onFechar, children }: {
  aberta: boolean; onFechar: () => void; children: React.ReactNode;
}) {
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

  return (
    <View style={{ flex: 1, backgroundColor: c.bg, overflow: 'hidden' }}>
      {montada ? (
        <Animated.View style={{
          position: 'absolute', top: 0, bottom: 0, left: 0, width: largura,
          backgroundColor: c.bg, paddingTop: insets.top + 10,
          /* A gaveta anda um pouco menos que a tela: entra de trás dela,
             e não ao lado, como uma camada de baixo. */
          transform: [{ translateX: anda.interpolate({ inputRange: [0, 1], outputRange: [-largura * 0.3, 0] }) }],
        }}>
          <Row style={{ paddingLeft: 20, paddingRight: 12, alignItems: 'center' }}>
            <Txt v="title" style={{ flex: 1, fontSize: 24, lineHeight: 30 }}>{K().historicoTitulo}</Txt>
            <View accessibilityLabel={K().fecharMenu}>
              <CircleBtn name="x" onPress={onFechar} />
            </View>
          </Row>
          {/* "Nova conversa" é texto e ícone na cor de destaque, sem fundo:
              é a primeira linha da lista, e não um botão que disputa com
              ela. */}
          <Pressable
            onPress={() => { update((s: any) => { recomecarConversa(s); }); onFechar(); }}
            style={({ pressed }) => [{ opacity: pressed ? 0.6 : 1, marginTop: 14, paddingHorizontal: 20, paddingVertical: 10 }]}
          >
            <Row gap={10} style={{ alignItems: 'center' }}>
              <Icon name="pencil" size={18} color={c.accent} sw={2} />
              <Txt v="bodyMed" c={c.accent} style={{ fontFamily: font.bodySemi }}>{K().novaConversa}</Txt>
            </Row>
          </Pressable>

          <Rolagem style={{ flex: 1, marginTop: 14 }} contentContainerStyle={{ paddingHorizontal: 12, paddingBottom: insets.bottom + 24 }} showsVerticalScrollIndicator={false}>
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
      ) : null}

      {/* A tela da conversa, que anda para a direita com a gaveta aberta.
          A borda que sobra à vista escurece, e tocá-la fecha. */}
      <Animated.View style={{
        flex: 1,
        transform: [{ translateX: anda.interpolate({ inputRange: [0, 1], outputRange: [0, largura] }) }],
        shadowColor: '#000', shadowOpacity: 0.25, shadowRadius: 16, shadowOffset: { width: -4, height: 0 }, elevation: 12,
      }}>
        {children}
        {montada ? (
          <Animated.View
            pointerEvents={aberta ? 'auto' : 'none'}
            style={[StyleSheet.absoluteFill, { backgroundColor: 'rgba(0,0,0,0.45)', opacity: anda }]}
          >
            <Pressable style={StyleSheet.absoluteFill} onPress={onFechar} accessibilityLabel={K().fecharMenu} />
          </Animated.View>
        ) : null}
      </Animated.View>
    </View>
  );
}
