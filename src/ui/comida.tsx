import React from 'react';
import { View, Pressable, TextInput, StyleSheet, ActivityIndicator } from 'react-native';
import { Image } from 'expo-image';
import { PORCOES, buscarAlimento, gramasDe, type Alimento, type Porcao } from '../logic/alimentos';
import { gramasItem, medidaItem, nomeItem, origemDe, type ItemComida } from '../logic/prato';
import { Txt, Row } from './kit';
import { Icon } from './Icon';
import { useTheme } from './useTheme';
import { radius, ty } from '../theme';

/* ============================================================
   A COMIDA NA TELA

   As peças servem os dois caminhos de registro: o que a pessoa digita e o
   que a câmera propõe. A foto devolve exatamente o mesmo tipo de item
   que a busca monta, então a tela da foto não é outra tela — é esta,
   preenchida por outra porta.
   ============================================================ */

/* ------------------------------------------------------------------ */

/** Campo de texto que sugere alimentos enquanto se digita. */
export function BuscaAlimento({ valor, onChange, onEscolher, onLivre, jaTem }: {
  valor: string;
  onChange: (v: string) => void;
  onEscolher: (a: Alimento) => void;
  /** Guardar o que foi digitado, quando a tabela não tem. */
  onLivre: (nome: string) => void;
  /** Ids já na lista — somem das sugestões para não entrar duas vezes. */
  jaTem?: string[];
}) {
  const { c } = useTheme();
  const achados = buscarAlimento(valor).filter((a) => !jaTem?.includes(a.id));
  const escrito = valor.trim();
  const semPar = escrito.length >= 2 && achados.length === 0;

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

      {/* A tabela tem 124 alimentos e o Brasil tem mais. Sem esta saída,
          quem comeu lasanha ficava sem registrar a refeição — e perder o
          registro inteiro é pior do que registrar sem o número. Entra com
          nome e sem conta, dito com todas as letras. */}
      {semPar ? (
        <Pressable onPress={() => onLivre(escrito)} style={({ pressed }) => [{ opacity: pressed ? 0.6 : 1 }]}>
          <Row gap={10} style={{
            marginTop: 6, backgroundColor: c.bg1, borderWidth: 1, borderColor: c.line,
            borderRadius: radius.md, paddingHorizontal: 13, paddingVertical: 10,
          }}>
            <View style={{ flex: 1 }}>
              <Txt v="label" numberOfLines={1}>Anotar “{escrito}”</Txt>
              <Txt v="micro" c={c.tx4}>Não tenho a proteína desse ainda</Txt>
            </View>
            <Icon name="plus" size={16} color={c.tx3} sw={2.4} />
          </Row>
        </Pressable>
      ) : null}
    </View>
  );
}

/* ------------------------------------------------------------------ */

/** Um item do prato, com o tamanho da porção e o que ele soma. */
export function ItemAlimento({ item, onPorcao, onRemover }: {
  item: ItemComida;
  onPorcao: (p: Porcao) => void;
  onRemover: () => void;
}) {
  const { c } = useTheme();
  const nome = nomeItem(item);
  const origem = origemDe(item);
  if (!nome) return null;

  return (
    <View style={{
      backgroundColor: c.bg1, borderWidth: 1, borderColor: c.line,
      borderRadius: radius.md, paddingHorizontal: 13, paddingVertical: 11, gap: 9,
    }}>
      <Row gap={10}>
        <View style={{ flex: 1 }}>
          <Txt v="label" numberOfLines={1}>{nome}</Txt>
          {/* Ou a medida caseira, ou a confissão de que o número saiu da
              foto e não da tabela. As duas coisas cabem na mesma linha
              porque são a mesma pergunta: de onde veio isso. */}
          <Txt v="micro" c={c.tx4}>{medidaItem(item)}</Txt>
        </View>
        <Pressable onPress={onRemover} hitSlop={10} style={({ pressed }) => [{ opacity: pressed ? 0.5 : 1 }]}>
          <Icon name="x" size={15} color={c.tx4} sw={2.2} />
        </Pressable>
      </Row>

      {/* A pergunta que a pessoa consegue responder. Ninguém sabe quantos
          gramas de proteína tem um filé; todo mundo sabe se o pedaço foi
          grande ou pequeno. A conta difícil fica com a tabela.

          Sem número por trás, a porção não muda nada — então ela nem
          aparece. Pedir "pouca ou bastante" de uma coisa que vale zero
          seria pedir à toa. */}
      {origem === 'sem-conta' ? null : (
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
          <Txt v="tag" c={c.tx2}>~{gramasItem(item)} g</Txt>
        </View>
      </Row>
      )}
    </View>
  );
}

/* ------------------------------------------------------------------ */

/** O convite para fotografar, quando ainda não há foto. */
export function BotaoEscanear({ onPress }: { onPress: () => void }) {
  const { c } = useTheme();
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [{ opacity: pressed ? 0.75 : 1 }]}>
      <Row gap={11} style={{
        backgroundColor: c.accentWeak, borderWidth: 1, borderColor: c.accentLine,
        borderRadius: radius.md, paddingHorizontal: 14, paddingVertical: 13,
      }}>
        <Icon name="camera" size={18} color={c.accent} sw={1.9} />
        <View style={{ flex: 1 }}>
          <Txt v="label" c={c.accent}>Escanear o prato</Txt>
          <Txt v="micro" c={c.tx3}>Uma foto e o app monta a lista</Txt>
        </View>
      </Row>
    </Pressable>
  );
}

/** A foto tirada, e o que está acontecendo com ela. */
export function FotoDoPrato({ uri, lendo, recado, onRemover }: {
  uri: string;
  lendo: boolean;
  /** O que impediu a leitura, quando impediu. */
  recado?: string;
  onRemover: () => void;
}) {
  const { c } = useTheme();
  return (
    <Row gap={12} style={{
      backgroundColor: c.bg1, borderWidth: 1, borderColor: c.line,
      borderRadius: radius.md, padding: 10,
    }}>
      <Image
        source={{ uri }}
        style={{ width: 62, height: 62, borderRadius: radius.sm, backgroundColor: c.bg2 }}
        contentFit="cover"
      />
      <View style={{ flex: 1, gap: 3 }}>
        {lendo ? (
          <Row gap={8}>
            <ActivityIndicator size="small" color={c.accent} />
            <Txt v="label" c={c.accent}>Lendo o prato…</Txt>
          </Row>
        ) : (
          /* Quando não deu, o recado já aponta para o caminho que
             funciona: um erro que só diz "falhou" deixa a pessoa parada
             com a refeição por registrar. */
          <Txt v="caption" c={c.tx3}>{recado || 'Confira a lista abaixo e ajuste o que precisar.'}</Txt>
        )}
      </View>
      <Pressable onPress={onRemover} hitSlop={10} style={({ pressed }) => [{ opacity: pressed ? 0.5 : 1 }]}>
        <Icon name="x" size={15} color={c.tx4} sw={2.2} />
      </Pressable>
    </Row>
  );
}
