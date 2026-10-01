import React, { useEffect, useRef, useState } from 'react';
import { View, Pressable, ActivityIndicator, type StyleProp, type ViewStyle } from 'react-native';
import { useRouter, useIsFocused } from 'expo-router';
import { useStore } from '../logic/store';
import { estadoDaLeitura, pedirLeitura, guardarLeitura, registrarRecusaDaLeitura } from '../logic/leitura';
import { Txt, Row, Card, RichDoc } from './kit';
import { Botao } from './internas';
import { EstrelaIA } from './marca';
import { Icon } from './Icon';
import { useTheme } from './useTheme';
import { font } from '../theme';
import { T } from '../textos';

const K = () => T.descobertas.semana;

/* ============================================================
   O CARD "SUA SEMANA" — a leitura de segunda, no alto da folha da Home

   Os estados vêm de `estadoDaLeitura` (logic/leitura):
     · pedir o aceite — o card é o convite, e o "Quero" abre a folha
       (app/aceite-leitura); o "Agora não" responde por 4 semanas;
     · pouco registro — não há o que ler; o card diz o que falta, e o
       servidor não é chamado;
     · gerar — "Lendo a sua semana…" enquanto o servidor escreve, uma vez
       por abertura da Home;
     · pronta — a descoberta, que é o gancho, e o toque abre /leitura.

   ⚠️ ERRO É SILÊNCIO. Sem rede, cota cheia ou servidor fora, o card some
   nesta abertura e tenta de novo na próxima: um card de erro toda segunda
   seria o app reclamando de si mesmo no lugar mais visível da Home.

   Ver docs/superpowers/specs/2026-10-01-leitura-da-semana-design.md.
   ============================================================ */
export function CartaoDaSemana({ style }: { style?: StyleProp<ViewStyle> }) {
  const { c } = useTheme();
  const router = useRouter();
  const focada = useIsFocused();
  const S = useStore((s) => s.S);
  const update = useStore((s) => s.update);
  const estado = estadoDaLeitura(S);
  const [falhou, setFalhou] = useState(false);
  const pedindo = useRef(false);

  useEffect(() => {
    if (!focada || estado.tipo !== 'gerar' || pedindo.current || falhou) return;
    pedindo.current = true;
    pedirLeitura(useStore.getState().S).then((r) => {
      pedindo.current = false;
      if (r.ok) update((s: any) => { guardarLeitura(s, r.leitura); });
      else setFalhou(true);
    });
  }, [focada, estado.tipo, falhou]);

  if (estado.tipo === 'oculto' || (estado.tipo === 'gerar' && falhou)) return null;

  const cabeca = (
    <Row gap={8} style={{ alignItems: 'center', marginBottom: 10 }}>
      <EstrelaIA size={16} />
      <Txt v="micro" c={c.accent2} style={{ letterSpacing: 1, fontFamily: font.bodySemi }}>{K().chapeu}</Txt>
    </Row>
  );

  if (estado.tipo === 'pedirAceite') {
    return (
      <Card style={style}>
        {cabeca}
        <Txt v="title">{K().pedirTitulo}</Txt>
        <Txt v="body" c={c.tx2} style={{ marginTop: 6, lineHeight: 22 }}>{K().pedirTexto}</Txt>
        <View style={{ marginTop: 14, gap: 4 }}>
          <Botao label={K().pedirSim} onPress={() => router.push('/aceite-leitura' as any)} />
          <Botao label={K().pedirNao} tom="fantasma" onPress={() => update((s: any) => { registrarRecusaDaLeitura(s); })} />
        </View>
      </Card>
    );
  }

  if (estado.tipo === 'poucoRegistro') {
    return (
      <Card style={style}>
        {cabeca}
        <Txt v="bodyMed">{K().poucoTitulo}</Txt>
        <Txt v="caption" c={c.tx3} style={{ marginTop: 4, lineHeight: 20 }}>{K().poucoTexto}</Txt>
      </Card>
    );
  }

  if (estado.tipo === 'gerar') {
    return (
      <Card style={style}>
        {cabeca}
        <Row gap={10} style={{ alignItems: 'center', paddingVertical: 6 }}>
          <ActivityIndicator size="small" color={c.accent2} />
          <Txt v="body" c={c.tx2}>{K().lendo}</Txt>
        </Row>
      </Card>
    );
  }

  /* pronta: a descoberta é o gancho; a leitura inteira abre num toque */
  const l = estado.leitura;
  return (
    <Card style={style} onPress={() => router.push(`/leitura?semana=${l.semana}` as any)}>
      {cabeca}
      <Txt v="label" c={c.tx3}>{K().parteDescoberta}</Txt>
      <RichDoc text={l.texto.descoberta} style={{ marginTop: 4 }} />
      <Pressable onPress={() => router.push(`/leitura?semana=${l.semana}` as any)} hitSlop={8} style={{ alignSelf: 'flex-start', marginTop: 12 }}>
        <Row gap={6} style={{ alignItems: 'center' }}>
          <Txt v="label" c={c.accent2}>{K().lerInteira}</Txt>
          <Icon name="chev" size={12} color={c.accent2} sw={2.2} />
        </Row>
      </Pressable>
    </Card>
  );
}
