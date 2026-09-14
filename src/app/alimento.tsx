import React from 'react';
import { View, ScrollView, Pressable } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { alimentoDe, insightDe, origemDoAlimento } from '../logic/prato';
import { medidaDe } from '../logic/alimentos';
import { Txt, Row, CircleBtn } from '../ui/kit';
import { Botao } from '../ui/internas';
import { Icon } from '../ui/Icon';
import { fotoDoAlimento } from '../ui/fotosAlimento';
import { useTheme } from '../ui/useTheme';
import { radius, shadowCard } from '../theme';

/* ============================================================
   O RÓTULO DE UM ALIMENTO

   A tela de consulta: o que tem dentro de 100 g, e o que isso vira na
   porção que a pessoa come.

   O DESENHO. Uma imagem sangrando do topo, com a frase que resume o
   alimento por cima dela, e um cartão branco subindo por cima da imagem
   com os números. É a composição de um rótulo de embalagem: a alegação
   em cima, a tabela embaixo.

   A FOTO É DAQUELE ALIMENTO, quando existe uma. Ela sai de
   assets/images/alimentos/<id>.jpg, e o mapa é gerado do que está no
   disco — ver scripts/gerar-fotos.mjs.

   Sem a foto do alimento, a da PRATELEIRA cobre o corredor inteiro: uma
   imagem de carne enquanto o peito de frango não tem a dele. E sem
   nenhuma das duas, o lugar é um painel de cor — a cor vem do DESTAQUE,
   o nutriente em que aquele alimento mais se sobressai, então verde é
   fibra, âmbar é vitamina C, azul é proteína.

   Os três degraus existem porque uma tabela de 224 alimentos não ganha
   224 fotos de uma vez: ela ganha as primeiras vinte, e as outras
   duzentas precisam continuar abrindo bonitas nesse meio-tempo.

   A FRASE DO TOPO diz o percentual e para por aí. Ela já disse "fonte
   de" e "alto teor de", que são alegações REGULADAS — com condições que
   dependem da porção, do estado do alimento e, no caso da proteína, do
   escore químico dela. O app não rotula embalagem: ele mostra uma conta
   e diz que conta é.
   ============================================================ */

/* A cor de cada destaque, para quando não há foto. Sem destaque, o
   painel fica no azul do app — neutro, e não uma quarta cor querendo
   dizer alguma coisa. */
const TINTA: Record<string, (c: any) => [string, string]> = {
  'proteína': (c) => [c.gradFrom, c.gradTo],
  'fibra': (c) => [c.ok, '#24491B'],
  'vitamina C': (c) => [c.amber, '#7A5C00'],
  'vitamina A': (c) => [c.amber, '#8A4B00'],
  'cálcio': (c) => [c.teal, '#0A7F70'],
  'ferro': (c) => [c.rose, '#8E1E48'],
  'magnésio': (c) => [c.purple, '#3E2BA8'],
  'zinco': (c) => [c.purple, '#3E2BA8'],
  'fósforo': (c) => [c.teal, '#0A7F70'],
  'niacina': (c) => [c.rose, '#8E1E48'],
  'tiamina': (c) => [c.rose, '#8E1E48'],
  'riboflavina': (c) => [c.rose, '#8E1E48'],
};

/** "1,3" em vez de "1.3", e "—" quando o nutriente não foi analisado. */
const n1 = (v: number | null) =>
  v == null ? '—' : String(Math.round(v * 10) / 10).replace('.', ',');

export default function Alimento() {
  const { c } = useTheme();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams<{ id?: string }>();
  const a = alimentoDe(String(id || ''));

  if (!a) {
    return (
      <View style={{ flex: 1, backgroundColor: c.bg, paddingTop: insets.top + 20, paddingHorizontal: 16 }}>
        <Row gap={12}>
          <CircleBtn name="back" onPress={() => router.back()} />
          <Txt v="h2">Alimento</Txt>
        </Row>
        <Txt v="caption" c={c.tx3} style={{ marginTop: 18 }}>Não encontrei este alimento.</Txt>
      </View>
    );
  }

  const d = a.destaque;
  const [de, para] = (d && TINTA[d.nome] ? TINTA[d.nome] : TINTA['proteína'])(c);
  const foto = fotoDoAlimento(a.id, a.onde);
  /* Espaço duro dentro do nome do nutriente: sem ele "vitamina C"
     quebrava com o C sozinho na segunda linha. */
  const nutriente = d ? d.nome.replace(/ /g, ' ') : '';
  const insight = insightDe(a);

  /* As três barras são comparadas entre si, e não com uma meta: o que
     elas mostram é a FORMA do alimento — se ele é sobretudo proteína,
     sobretudo carboidrato, ou repartido. */
  const macros: [string, number | null][] = [
    ['Proteína', a.p],
    ['Carboidrato', a.carb],
    ['Gordura', a.gord],
  ];
  const teto = Math.max(...macros.map(([, v]) => v ?? 0), 0.1);
  const naPorcao = (v: number | null) =>
    v == null ? null : Math.round((v / 100) * a.gUn * a.qtd * 10) / 10;

  const cabecalho = (
    <View style={{ paddingTop: insets.top + 12, paddingHorizontal: 20, paddingBottom: 56 }}>
      <Row style={{ justifyContent: 'space-between' }}>
        <Pressable onPress={() => router.back()} hitSlop={10} style={({ pressed }) => [{ opacity: pressed ? 0.6 : 1 }]}>
          <View style={{
            width: 36, height: 36, borderRadius: 18,
            backgroundColor: c.onHeroLine, alignItems: 'center', justifyContent: 'center',
          }}>
            <Icon name="back" size={16} color={c.onHero} sw={2.2} />
          </View>
        </Pressable>
        <Txt v="label" c={c.onHero}>{a.onde}</Txt>
        <View style={{ width: 36 }} />
      </Row>

      <View style={{
        alignSelf: 'flex-start', marginTop: 40,
        backgroundColor: c.onHeroLine, borderRadius: radius.pill,
        paddingHorizontal: 12, paddingVertical: 6,
      }}>
        <Txt v="caption" c={c.onHero}>por 100 g</Txt>
      </View>

      <Row style={{ marginTop: 12, alignItems: 'flex-end' }}>
        <View style={{ flex: 1, paddingRight: 12 }}>
          <Txt v="display" c={c.onHero} style={{ fontSize: 28, lineHeight: 34 }}>
            {d ? `Muita ${nutriente}` : a.nome}
          </Txt>
          <Txt v="caption" c={c.onHero2} style={{ marginTop: 4 }}>
            {d ? `${d.pct}% do que se recomenda por dia` : 'Valores por 100 g'}
          </Txt>
        </View>
        <View style={{ alignItems: 'flex-end' }}>
          {d ? <Txt v="h2" c={c.onHero}>{n1(d.valor)}{d.un}</Txt> : null}
          <Txt v="caption" c={c.onHero2} style={{ marginTop: 2 }}>
            {a.kcal == null ? 'sem caloria medida' : `${a.kcal} kcal`}
          </Txt>
        </View>
      </Row>
    </View>
  );

  return (
    <View style={{ flex: 1, backgroundColor: c.bg1 }}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ flexGrow: 1 }}>
        {/* O TOPO: foto quando a prateleira tem uma, painel de cor quando
            não tem. O véu escuro por cima da foto não é estilo — sem ele
            o texto branco some num tomate claro. */}
        {/* QUEM ESTICA É O TOPO.

            Antes era o cartão: ele crescia para encostar na base e
            deixava uma faixa branca morta embaixo do botão, do tamanho
            do que sobrava da tela. Na referência quem ocupa a sobra é a
            imagem, e o cartão é uma folha de altura própria encostada na
            base — que é o certo, porque o conteúdo do cartão tem um
            tamanho e a foto não tem.

            `flexGrow` faz o topo comer o que sobrar, e `minHeight`
            impede que ele desapareça quando o conteúdo é longo demais e
            a tela vira rolagem. */}
        {foto ? (
          <View style={{ flexGrow: 1, minHeight: 260 }}>
            <Image source={foto} style={{ position: 'absolute', left: 0, right: 0, top: 0, bottom: 0 }} contentFit="cover" />
            <LinearGradient
              colors={['rgba(0,0,0,0.25)', 'rgba(0,0,0,0.30)', 'rgba(0,0,0,0.68)']}
              locations={[0, 0.45, 1]}
              start={{ x: 0, y: 0 }} end={{ x: 0, y: 1 }}
              style={{ position: 'absolute', left: 0, right: 0, top: 0, bottom: 0 }}
            />
            <View style={{ marginTop: 'auto' }}>{cabecalho}</View>
          </View>
        ) : (
          <LinearGradient
            colors={[de, para]}
            start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
            style={{ flexGrow: 1, minHeight: 260, justifyContent: 'flex-end' }}
          >
            {cabecalho}
          </LinearGradient>
        )}

        {/* O CARTÃO tem a altura do que ele diz, e encosta na base. */}
        <View style={[{
          backgroundColor: c.bg1, marginTop: -24,
          borderTopLeftRadius: radius.xl, borderTopRightRadius: radius.xl,
          paddingHorizontal: 20, paddingTop: 22,
          paddingBottom: insets.bottom + 22,
        }, shadowCard(c)]}>
          <Row style={{ alignItems: 'flex-start' }}>
            <Txt v="title" style={{ flex: 1, paddingRight: 12 }}>{a.nome}</Txt>
            <Txt v="title" c={c.tx3}>{a.kcal == null ? '—' : `${a.kcal} kcal`}</Txt>
          </Row>

          {/* O QUE ISSO QUER DIZER PARA QUEM ESTÁ EM TRATAMENTO.

              Calculado dos números, e não escrito à mão para cada
              alimento — ver insightDe. Quando não há o que dizer, a linha
              não aparece: sem frase é melhor do que "delicioso e
              nutritivo". */}
          {insight ? (
            <View style={{
              marginTop: 14, borderRadius: radius.md, padding: 14,
              backgroundColor: insight.bom ? c.accentWeak : c.amberBg,
            }}>
              <Row gap={7}>
                <Icon
                  name="aura"
                  size={14}
                  color={insight.bom ? c.accent : c.amber}
                  sw={2}
                />
                <Txt
                  v="micro"
                  c={insight.bom ? c.accent : c.amber}
                  style={{ letterSpacing: 1 }}
                >
                  {insight.bom ? 'O MORPHI LEU' : 'O MORPHI RESSALVA'}
                </Txt>
              </Row>
              <Txt v="caption" c={c.tx2} style={{ marginTop: 8, lineHeight: 21 }}>{insight.texto}</Txt>
            </View>
          ) : null}

          {/* AS TRÊS BARRAS */}
          <Row gap={10} style={{ marginTop: 18, alignItems: 'stretch' }}>
            {macros.map(([nome, v]) => (
              <View key={nome} style={{ flex: 1 }}>
                {/* A altura máxima da barra para ANTES do rótulo. Sem o
                    teto, o macro mais alto subia até em cima e cobria a
                    própria palavra que dizia qual macro era. */}
                <View style={{
                  height: 200, borderRadius: radius.md, backgroundColor: c.bg2,
                  overflow: 'hidden', justifyContent: 'flex-end',
                }}>
                  <Txt v="caption" c={c.tx3} style={{ position: 'absolute', top: 13, left: 0, right: 0, textAlign: 'center' }}>
                    {nome}
                  </Txt>
                  <LinearGradient
                    colors={[c.bluePale, c.accentWeak]}
                    style={{ height: v == null ? 0 : Math.max(54, (v / teto) * 144), borderRadius: radius.md }}
                  />
                  <Txt v="bodyMed" style={{ position: 'absolute', bottom: 13, left: 0, right: 0, textAlign: 'center' }}>
                    {n1(v)}{v == null ? '' : ' g'}
                  </Txt>
                </View>
              </View>
            ))}
          </Row>

          {/* A fibra fica fora das barras: ela não compete com as três que
              somam a energia, e nem sempre foi analisada. */}
          <Row style={{ marginTop: 16, justifyContent: 'space-between' }}>
            <Txt v="caption" c={c.tx3}>Fibra por 100 g</Txt>
            <Txt v="caption" c={a.fibra == null ? c.tx4 : c.tx2}>
              {a.fibra == null ? 'não medida' : `${n1(a.fibra)} g`}
            </Txt>
          </Row>
          <Row style={{ marginTop: 8, justifyContent: 'space-between' }}>
            <Txt v="caption" c={c.tx3}>Proteína em {medidaDe(a, a.qtd)}</Txt>
            <Txt v="caption" c={c.accent}>~{n1(naPorcao(a.p))} g</Txt>
          </Row>

          {/* DE ONDE VEIO O NÚMERO, dito para gente e não em sigla. */}
          <Txt v="micro" c={c.tx4} style={{ marginTop: 16, lineHeight: 18 }}>
            {medidaDe(a, a.qtd)} pesa perto de {a.gUn * a.qtd} g. {origemDoAlimento(a)}
          </Txt>

          <View style={{ marginTop: 20 }}>
            <Botao
              label="Registrar uma refeição com isto"
              onPress={() => router.push(`/medir-refeicao?oque=${encodeURIComponent(a.nome)}` as any)}
            />
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
