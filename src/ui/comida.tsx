import React from 'react';
import { View, Pressable, TextInput, StyleSheet } from 'react-native';
import { ALIMENTOS, PORCOES, buscarAlimento, gramasDe, type Alimento, type Porcao } from '../logic/alimentos';
import { Txt, Row } from './kit';
import { Icon } from './Icon';
import { useTheme } from './useTheme';
import { radius, ty } from '../theme';

/* ============================================================
   A COMIDA NA TELA

   Duas peças, e as duas servem os dois caminhos de registro: o que a
   pessoa digita hoje e o que a câmera vai propor depois. A foto devolve
   exatamente isto — uma lista de alimentos com porção —, então a tela da
   foto não vai precisar inventar nada: recebe os itens já escolhidos e
   mostra a mesma lista, aberta para conserto.

   É por isso que elas nascem fora da tela de refeição.
   ============================================================ */

export type ItemComida = { id: string; porcao: Porcao };

/** O alimento de um item, ou null se o id não existir mais na tabela. */
export function alimentoDe(id: string): Alimento | null {
  return ALIMENTOS.find((a) => a.id === id) || null;
}

/** Proteína de uma lista de itens. */
export function somaDe(itens: ItemComida[]): number {
  return itens.reduce((s, it) => {
    const a = alimentoDe(it.id);
    return a ? s + gramasDe(a, it.porcao) : s;
  }, 0);
}

/* ------------------------------------------------------------------ */

/** Campo de texto que sugere alimentos enquanto se digita. */
export function BuscaAlimento({ valor, onChange, onEscolher, jaTem }: {
  valor: string;
  onChange: (v: string) => void;
  onEscolher: (a: Alimento) => void;
  /** Ids já na lista — some das sugestões para não entrar duas vezes. */
  jaTem?: string[];
}) {
  const { c } = useTheme();
  const achados = buscarAlimento(valor).filter((a) => !jaTem?.includes(a.id));

  return (
    <View>
      <TextInput
        value={valor}
        onChangeText={onChange}
        placeholder="Frango, arroz, ovo…"
        placeholderTextColor={c.tx4}
        style={[ty.body, {
          color: c.tx, backgroundColor: c.bg1, borderWidth: 1, borderColor: c.line,
          borderRadius: radius.md, paddingHorizontal: 13, paddingVertical: 12,
        }]}
      />

      {/* As sugestões já trazem o número. Escolher "Peito de frango" sem
          saber que aquilo vale 38 g é o mesmo buraco de antes, só que
          com outro nome em cima. */}
      {achados.length ? (
        <View style={{
          marginTop: 6, backgroundColor: c.bg1, borderWidth: 1, borderColor: c.line,
          borderRadius: radius.md, overflow: 'hidden',
        }}>
          {achados.map((a, i) => (
            <Pressable key={a.id} onPress={() => onEscolher(a)} style={({ pressed }) => [{ opacity: pressed ? 0.6 : 1 }]}>
              <Row
                gap={10}
                style={{
                  paddingHorizontal: 13, paddingVertical: 10,
                  borderTopWidth: i ? StyleSheet.hairlineWidth : 0, borderTopColor: c.line,
                }}
              >
                <View style={{ flex: 1 }}>
                  <Txt v="label" numberOfLines={1}>{a.nome}</Txt>
                  <Txt v="micro" c={c.tx4}>{a.medida} · ~{gramasDe(a, 'normal')} g de proteína</Txt>
                </View>
                <Icon name="plus" size={16} color={c.accent} sw={2.4} />
              </Row>
            </Pressable>
          ))}
        </View>
      ) : null}
    </View>
  );
}

/* ------------------------------------------------------------------ */

/** Um alimento escolhido, com o tamanho da porção e o que ele soma. */
export function ItemAlimento({ item, onPorcao, onRemover }: {
  item: ItemComida;
  onPorcao: (p: Porcao) => void;
  onRemover: () => void;
}) {
  const { c } = useTheme();
  const a = alimentoDe(item.id);
  if (!a) return null;

  return (
    <View style={{
      backgroundColor: c.bg1, borderWidth: 1, borderColor: c.line,
      borderRadius: radius.md, paddingHorizontal: 13, paddingVertical: 11, gap: 9,
    }}>
      <Row gap={10}>
        <View style={{ flex: 1 }}>
          <Txt v="label" numberOfLines={1}>{a.nome}</Txt>
          <Txt v="micro" c={c.tx4}>{a.medida}</Txt>
        </View>
        <Pressable onPress={onRemover} hitSlop={10} style={({ pressed }) => [{ opacity: pressed ? 0.5 : 1 }]}>
          <Icon name="x" size={15} color={c.tx4} sw={2.2} />
        </Pressable>
      </Row>

      {/* A pergunta que a pessoa consegue responder. Ninguém sabe quantos
          gramas de proteína tem um filé; todo mundo sabe se o pedaço foi
          grande ou pequeno. A conta difícil fica com a tabela. */}
      <Row gap={6}>
        {PORCOES.map((p) => {
          const on = item.porcao === p.id;
          return (
            <Pressable key={p.id} onPress={() => onPorcao(p.id)} style={({ pressed }) => [{ flex: 1, opacity: pressed ? 0.7 : 1 }]}>
              <View style={{
                backgroundColor: on ? c.accentWeak : c.bg2,
                borderWidth: 1, borderColor: on ? c.accentLine : 'transparent',
                borderRadius: radius.sm, paddingVertical: 7, alignItems: 'center',
              }}>
                <Txt v="tag" c={on ? c.accent : c.tx3}>{p.label}</Txt>
              </View>
            </Pressable>
          );
        })}
        <View style={{ width: 52, alignItems: 'flex-end', justifyContent: 'center' }}>
          <Txt v="tag" c={c.tx2}>~{gramasDe(a, item.porcao)} g</Txt>
        </View>
      </Row>
    </View>
  );
}
