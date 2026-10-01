import React from 'react';
import { View } from 'react-native';
import { Txt, Row, Metric } from './kit';
import { Icon } from './Icon';
import { useTheme } from './useTheme';
import type { WeekMetric } from '../logic/derive';

/* ============================================================
   UMA SEMANA EM NÚMEROS E DESTAQUES

   Nasceu dentro do acordeão de "Por semana", na Jornada, e saiu de lá
   quando o resumo da semana (app/leitura) pediu o mesmo conteúdo
   (01/10/2026, pedido do dono): os números da semana, cada um contra a
   semana anterior, e o que marcou a semana. As duas telas falam de
   semanas diferentes — a Jornada vai de uma aplicação à outra, o resumo
   de segunda a domingo —, mas a pergunta é a mesma, e uma cópia do
   desenho em cada uma é como as duas começariam a divergir.

   Quem chama calcula; aqui só se desenha.
   ============================================================ */

/** A grade de dois: ícone e rótulo em cima, o número e a variação
    contra a semana anterior embaixo. */
export function MetricasDaSemana({ metricas }: { metricas: WeekMetric[] }) {
  const { c } = useTheme();
  if (!metricas.length) return null;
  return (
    <Row style={{ flexWrap: 'wrap' }}>
      {metricas.map((m) => (
        <View key={m.label} style={{ width: '50%', paddingRight: 12, marginBottom: 14 }}>
          <Row gap={7}>
            <Icon name={m.ic} size={14} color={c.tx4} sw={1.9} />
            <Txt v="micro" c={c.tx3}>{m.label}</Txt>
          </Row>
          <Row gap={6} style={{ marginTop: 5, alignItems: 'baseline' }}>
            <Metric value={m.valor} v="bodyMed" />
            {m.delta && <Txt v="micro" c={m.good ? c.tx2 : c.tx4}>{m.delta}</Txt>}
          </Row>
        </View>
      ))}
    </Row>
  );
}

export type Destaque = { k: string; ic: string; cor: string; titulo: string; sub: string };

/** O que marcou a semana: um filete de cor, o ícone, o título e a linha
    de baixo. Sem caixa — mora dentro do cartão de quem chama. */
export function DestaquesDaSemana({ itens }: { itens: Destaque[] }) {
  const { c } = useTheme();
  if (!itens.length) return null;
  return (
    <View>
      {itens.map((it) => (
        <Row key={it.k} gap={12} style={{ alignItems: 'flex-start', marginTop: 12 }}>
          <View style={{ width: 3, alignSelf: 'stretch', borderRadius: 2, backgroundColor: it.cor }} />
          <Icon name={it.ic} size={15} color={c.tx3} sw={1.9} />
          <View style={{ flex: 1 }}>
            <Txt v="caption" c={c.tx}>{it.titulo}</Txt>
            <Txt v="micro" c={c.tx3} style={{ marginTop: 2 }} numberOfLines={1}>{it.sub}</Txt>
          </View>
        </Row>
      ))}
    </View>
  );
}
