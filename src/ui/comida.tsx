import React from 'react';
import { View, Pressable, TextInput, StyleSheet, ActivityIndicator } from 'react-native';
import { Image } from 'expo-image';
import { buscarAlimento, gramasDe, medidaDe, type Alimento } from '../logic/alimentos';
import { gramasItem, medidaItem, nomeItem, ressalvaItem, origemDe, type ItemComida } from '../logic/prato';
import { Txt, Row } from './kit';
import { Icon } from './Icon';
import { useTheme } from './useTheme';
import { font, radius, ty } from '../theme';

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
      {/* Instrução, e não exemplos. Uma lista de comidas soltas só repete
          o que o rótulo acima já disse; o que a pessoa não sabe é que
          além de ingrediente dá para escrever o prato inteiro, e isso
          precisa estar dito com essas palavras. */}
      <TextInput
        value={valor}
        onChangeText={onChange}
        placeholder="Busque um alimento ou um prato"
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
                  {/* A marca na frente da porção, quando existe — a mesma
                      linha da tela de alimentos. Ver o tipo em
                      logic/alimentos: ela saiu do nome, e é aqui que
                      separa os dois "Cheeseburger". */}
                  <Txt v="micro" c={c.tx4}>
                    {a.marca ? a.marca + " · " : ""}{medidaDe(a, a.qtd)} · ~{gramasDe(a, a.qtd)} g de proteína
                  </Txt>
                </View>
                <Icon name="plus" size={16} color={c.accent} sw={2.4} />
              </Row>
            </Pressable>
          ))}
        </View>
      ) : null}

      {/* A tabela tem 144 alimentos e o Brasil tem mais. Sem esta saída,
          quem comeu uma receita de família ficava sem registrar a
          refeição — e perder o registro inteiro é pior do que registrar
          sem o número. Entra com nome e sem conta, dito com todas as
          letras. */}
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

const MAX = 20;

function Passo({ nome, on, onPress }: { nome: string; on: boolean; onPress: () => void }) {
  const { c } = useTheme();
  return (
    <Pressable onPress={on ? onPress : undefined} hitSlop={6} style={({ pressed }) => [{ opacity: pressed && on ? 0.6 : 1 }]}>
      <View style={{
        width: 30, height: 30, borderRadius: radius.sm,
        backgroundColor: c.bg2, alignItems: 'center', justifyContent: 'center',
      }}>
        <Icon name={nome} size={15} color={on ? c.tx2 : c.tx4} sw={2.4} />
      </View>
    </Pressable>
  );
}

/** Um item do prato, com quantas unidades e o que ele soma. */
export function ItemAlimento({ item, onQtd, onRemover }: {
  item: ItemComida;
  onQtd: (q: number) => void;
  onRemover: () => void;
}) {
  const { c } = useTheme();
  const nome = nomeItem(item);
  const ressalva = ressalvaItem(item);
  const conta = origemDe(item) !== 'sem-conta';
  if (!nome) return null;

  return (
    <View style={{
      backgroundColor: c.bg1, borderWidth: 1, borderColor: c.line,
      borderRadius: radius.md, paddingHorizontal: 13, paddingVertical: 11, gap: 9,
    }}>
      <Row gap={10}>
        <View style={{ flex: 1 }}>
          <Txt v="label" numberOfLines={1}>{nome}</Txt>
          {/* Só o que foge do normal se anuncia. Escrever "da tabela" em
              toda linha seria avisar em todas para alertar sobre nenhuma. */}
          {ressalva ? <Txt v="micro" c={c.tx4}>{ressalva}</Txt> : null}
        </View>
        <Pressable onPress={onRemover} hitSlop={10} style={({ pressed }) => [{ opacity: pressed ? 0.5 : 1 }]}>
          <Icon name="x" size={15} color={c.tx4} sw={2.2} />
        </Pressable>
      </Row>

      {/* Contar unidades, e não escolher um tamanho de porção. "Quantas
          colheres de arroz?" é uma pergunta sobre o que aconteceu no
          prato; "a porção foi normal?" era uma pergunta sobre uma régua
          que a pessoa nunca viu.

          Sem número por trás, o contador nem aparece: multiplicar zero
          por três continua dando zero, e pedir isso seria pedir à toa. */}
      {conta ? (
        <Row gap={8}>
          <Passo nome="minus" on={item.qtd > 1} onPress={() => onQtd(item.qtd - 1)} />
          <View style={{ minWidth: 92, alignItems: 'center' }}>
            <Txt v="caption" c={c.tx}>{medidaItem(item)}</Txt>
          </View>
          <Passo nome="plus" on={item.qtd < MAX} onPress={() => onQtd(item.qtd + 1)} />
          <View style={{ flex: 1, alignItems: 'flex-end', justifyContent: 'center' }}>
            <Txt v="tag" c={c.tx2}>~{gramasItem(item)} g</Txt>
          </View>
        </Row>
      ) : null}
    </View>
  );
}

/* ------------------------------------------------------------------ */

/* O convite para fotografar, do tamanho de um atalho e na linha do
   rótulo da seção.

   Ele já foi um cartão de largura inteira com duas linhas de texto, e
   isso empurrava a busca para baixo da dobra numa tela que abre três
   vezes por dia. A foto é um caminho, não O caminho: quem fotografa
   acha o botão de qualquer tamanho, e quem digita não precisa passar
   por cima dele. */
export function BotaoEscanear({ onPress }: { onPress: () => void }) {
  const { c } = useTheme();
  return (
    <Pressable onPress={onPress} hitSlop={10} style={({ pressed }) => [{ opacity: pressed ? 0.6 : 1 }]}>
      <Row gap={6}>
        <Icon name="photoSpark" size={16} color={c.accent} sw={1.9} />
        <Txt v="tag" c={c.accent} style={{ fontFamily: font.bodySemi }}>Escanear</Txt>
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
