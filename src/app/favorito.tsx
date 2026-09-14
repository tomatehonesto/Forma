import React from 'react';
import { View } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useStore } from '../logic/store';
import { apagarFavorito, favoritos } from '../logic/derive';
import { gramasItem, medidaItem, nomeItem, somaDe, type ItemComida } from '../logic/prato';
import { Txt, Row, IconBadge, SheetScreen } from '../ui/kit';
import { Cartao, Linha, Botao } from '../ui/internas';
import { useTheme } from '../ui/useTheme';

/* ============================================================
   UM PRATO FAVORITO

   A folha que abre ao tocar num prato guardado. Mesma forma da folha de
   treino e da de refeição: mostra primeiro, oferece as ações depois.

   Ela existe por causa do apagar. A lixeira morava na linha da lista, ao
   alcance do polegar numa lista que se rola — e apagar um prato guardado
   é justamente o tipo de coisa que ninguém quer fazer sem querer. Aqui
   ela fica atrás de um toque deliberado, embaixo do prato inteiro, onde
   a pessoa vê o que está prestes a perder.

   E a folha resolve outra coisa de graça: a lista só conseguia mostrar o
   nome e o total. Aqui dá para ver o prato item por item, que é o que
   diz se aquele é o favorito certo.
   ============================================================ */

export default function Favorito() {
  const S = useStore((s) => s.S);
  const update = useStore((s) => s.update);
  const { c } = useTheme();
  const router = useRouter();
  const { nome } = useLocalSearchParams<{ nome?: string }>();

  const f = favoritos(S).find((x) => x.nome === String(nome || ''));

  if (!f) {
    return (
      <SheetScreen titulo="Prato favorito" sub="Não encontrei este prato" onClose={() => router.back()}>
        <Txt v="caption" c={c.tx3} style={{ marginTop: 18 }}>
          Ele pode ter sido apagado em outra tela.
        </Txt>
      </SheetScreen>
    );
  }

  const itens = (f.itens || []) as ItemComida[];
  const g = somaDe(itens);

  const apagar = () => {
    update((s: any) => apagarFavorito(s, f.nome));
    router.back();
  };

  return (
    <SheetScreen
      titulo={f.nome}
      sub={itens.length ? `${itens.length} ${itens.length === 1 ? 'item' : 'itens'}` : 'Sem prato guardado'}
      onClose={() => router.back()}
    >
      <View style={{ marginTop: 20, gap: 10 }}>
        <Cartao>
          <Row gap={14} style={{ paddingHorizontal: 16, paddingVertical: 16 }}>
            <IconBadge name="leaf" size={52} iconSize={24} sw={1.9} />
            <View style={{ flex: 1 }}>
              <Txt v="metric">
                ~{g}
                <Txt v="label" c={c.tx3}> g de proteína</Txt>
              </Txt>
              <Txt v="caption" c={c.tx3}>cada vez que você registrar este prato</Txt>
            </View>
          </Row>
        </Cartao>

        {/* O prato item por item, com a quantidade e o quanto cada um
            entrega. É o que a linha da lista não cabia e o que decide se
            este é o favorito certo — dois pratos de frango com arroz
            diferem justamente na quantidade. */}
        {itens.length ? (
          <Cartao>
            {itens.map((it, i) => (
              <Linha
                key={`${it.id || it.nome}-${i}`}
                titulo={nomeItem(it)}
                sub={`${medidaItem(it)} · ~${gramasItem(it)} g de proteína`}
                seta={false}
              />
            ))}
          </Cartao>
        ) : null}

        <View style={{ marginTop: 8, gap: 8 }}>
          <Botao
            label="Registrar uma refeição com este prato"
            onPress={() => {
              router.back();
              router.push(`/medir-refeicao?prato=${encodeURIComponent(f.nome)}` as any);
            }}
          />
          <Botao label="Apagar dos favoritos" tom="perigo" onPress={apagar} />
        </View>

        <Txt v="caption" c={c.tx3} style={{ textAlign: 'center', marginTop: 2 }}>
          Apagar tira o prato dos favoritos. As refeições já registradas com ele ficam.
        </Txt>
      </View>
    </SheetScreen>
  );
}
