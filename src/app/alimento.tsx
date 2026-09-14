import React from 'react';
import { View, ScrollView, Pressable } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { alimentoDe } from '../logic/prato';
import { medidaDe } from '../logic/alimentos';
import { Txt, Row, CircleBtn } from '../ui/kit';
import { Icon } from '../ui/Icon';
import { Botao } from '../ui/internas';
import { useTheme } from '../ui/useTheme';
import { radius, shadowCard } from '../theme';

/* ============================================================
   O RÓTULO DE UM ALIMENTO

   A tela de consulta: o que tem dentro de 100 g, e o que isso vira na
   porção que a pessoa come.

   O DESENHO. Um painel de cor sangrando do topo, com a frase que resume
   o alimento, e um cartão branco subindo por cima dele com os números.
   É a composição de um rótulo de embalagem: a alegação em cima, a
   tabela embaixo.

   A COR NÃO É ENFEITE. Ela vem do DESTAQUE — o nutriente em que aquele
   alimento mais se sobressai —, então verde é fibra, âmbar é vitamina C,
   azul é proteína. Quem abre dez alimentos seguidos aprende a ler a cor
   antes de ler a frase.

   E não há foto. Duzentas e vinte e quatro fotos de comida seriam
   duzentas e vinte e quatro licenças e vinte megabytes de bundle para
   um app que não é de receitas — e uma foto genérica de banco de imagem
   diz menos que a cor que significa alguma coisa.

   A FRASE DO TOPO é a alegação que a regra brasileira de rotulagem
   autoriza: acima de 15% da IDR em 100 g, "fonte de"; acima de 30%,
   "alto teor". Abaixo disso a tela não diz nada, porque não há o que
   dizer — e inventar "rico em sabor" seria exatamente o tipo de frase
   que este app não escreve.
   ============================================================ */

/* A cor de cada destaque. Sem destaque, o painel fica no azul do app —
   neutro, e não uma quarta cor querendo dizer alguma coisa. */
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
  const alegacao = d ? (d.pct >= 30 ? 'Alto teor de' : 'Fonte de') : null;
  /* Espaço duro dentro do nome do nutriente: sem ele "vitamina C"
     quebrava com o C sozinho na segunda linha, que é a quebra mais feia
     que um título pode dar. */
  const nutriente = d ? d.nome.replace(/ /g, ' ') : '';

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

  return (
    <View style={{ flex: 1, backgroundColor: c.bg }}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: insets.bottom + 28 }}
      >
        {/* O PAINEL */}
        <LinearGradient colors={[de, para]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
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
              <Txt v="label" c={c.onHero}>Alimentos</Txt>
              <View style={{ width: 36 }} />
            </Row>

            <View style={{
              alignSelf: 'flex-start', marginTop: 40,
              backgroundColor: c.onHeroWeak, borderRadius: radius.pill,
              paddingHorizontal: 12, paddingVertical: 6,
            }}>
              <Txt v="caption" c={c.onHero}>por 100 g</Txt>
            </View>

            <Row style={{ marginTop: 12, alignItems: 'flex-end' }}>
              <View style={{ flex: 1, paddingRight: 12 }}>
                <Txt v="display" c={c.onHero} style={{ fontSize: 28, lineHeight: 34 }}>
                  {alegacao ? `${alegacao} ${nutriente}` : a.nome}
                </Txt>
                <Txt v="caption" c={c.onHero2} style={{ marginTop: 4 }}>
                  {d ? `${d.pct}% do que se recomenda por dia` : 'Valores por 100 g'}
                </Txt>
              </View>
              <View style={{ alignItems: 'flex-end' }}>
                {d ? (
                  <Txt v="h2" c={c.onHero}>{n1(d.valor)}{d.un}</Txt>
                ) : null}
                <Txt v="caption" c={c.onHero2} style={{ marginTop: 2 }}>
                  {a.kcal == null ? 'kcal não analisada' : `${a.kcal} kcal`}
                </Txt>
              </View>
            </Row>
          </View>
        </LinearGradient>

        {/* O CARTÃO, subindo por cima do painel */}
        <View style={[{
          backgroundColor: c.bg1, marginTop: -24,
          borderTopLeftRadius: radius.xl, borderTopRightRadius: radius.xl,
          paddingHorizontal: 20, paddingTop: 22, paddingBottom: 22,
        }, shadowCard(c)]}>
          <Row style={{ alignItems: 'flex-start' }}>
            <Txt v="title" style={{ flex: 1, paddingRight: 12 }}>{a.nome}</Txt>
            <Txt v="title" c={c.tx3}>{a.kcal == null ? '—' : `${a.kcal} kcal`}</Txt>
          </Row>

          {/* A PROCEDÊNCIA, e não uma descrição inventada.

              O reference que inspirou esta tela tem um parágrafo bonito
              sobre a framboesa. Escrever um desses para 224 alimentos
              seria escrever 224 textos que ninguém conferiu — e num app
              de tratamento, texto sobre comida sem fonte é exatamente o
              que não pode existir. O que esta linha diz é verificável:
              de onde o número veio e quanto pesa a porção. */}
          <Txt v="caption" c={c.tx3} style={{ marginTop: 6, lineHeight: 21 }}>
            {medidaDe(a, a.qtd)} pesa perto de {a.gUn * a.qtd} g.{' '}
            {a.taco
              ? `Os valores vêm da TACO, linha ${a.taco}.`
              : `Origem: ${a.fonte}.`}
          </Txt>

          {/* AS TRÊS BARRAS */}
          <Row gap={10} style={{ marginTop: 20, alignItems: 'stretch' }}>
            {macros.map(([nome, v]) => (
              <View key={nome} style={{ flex: 1 }}>
                {/* A altura máxima da barra para ANTES do rótulo. Sem o
                    teto, o macro mais alto do prato subia até em cima e
                    cobria a própria palavra que dizia qual macro era. */}
                <View style={{
                  height: 210, borderRadius: radius.md, backgroundColor: c.bg2,
                  overflow: 'hidden', justifyContent: 'flex-end',
                }}>
                  <Txt v="caption" c={c.tx3} style={{ position: 'absolute', top: 14, left: 0, right: 0, textAlign: 'center' }}>
                    {nome}
                  </Txt>
                  <LinearGradient
                    colors={[c.bluePale, c.accentWeak]}
                    style={{ height: v == null ? 0 : Math.max(56, (v / teto) * 152), borderRadius: radius.md }}
                  />
                  <Txt v="bodyMed" style={{ position: 'absolute', bottom: 14, left: 0, right: 0, textAlign: 'center' }}>
                    {n1(v)}{v == null ? '' : ' g'}
                  </Txt>
                </View>
              </View>
            ))}
          </Row>

          {/* A fibra fica fora das barras: ela não compete com as três
              que somam a energia, e nem sempre foi analisada. */}
          <Row style={{ marginTop: 16, justifyContent: 'space-between' }}>
            <Txt v="caption" c={c.tx3}>Fibra por 100 g</Txt>
            <Txt v="caption" c={a.fibra == null ? c.tx4 : c.tx2}>
              {a.fibra == null ? 'não analisada' : `${n1(a.fibra)} g`}
            </Txt>
          </Row>
          <Row style={{ marginTop: 8, justifyContent: 'space-between' }}>
            <Txt v="caption" c={c.tx3}>Proteína em {medidaDe(a, a.qtd)}</Txt>
            <Txt v="caption" c={c.accent}>~{n1(naPorcao(a.p))} g</Txt>
          </Row>

          <View style={{ marginTop: 22 }}>
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
