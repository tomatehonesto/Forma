import React from 'react';
import { View, ScrollView, Pressable } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Image } from 'expo-image';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { VidroDegrade } from '../ui/vidro';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { alimentoDe, insightDe, origemDoAlimento } from '../logic/prato';
import { medidaDe, porUnidadeDe } from '../logic/alimentos';
import { massaTxt } from '../logic/medidas';
import { numeroEnxuto } from '../logic/local';
import { useStore } from '../logic/store';
import { Txt, Row, CircleBtn, Rolagem } from '../ui/kit';
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

/** "1,3" em português, "1.3" em inglês — e "—" quando o nutriente não
    foi analisado.

    ⚠️ A VÍRGULA ERA POSTA AQUI, À MÃO. Em inglês a linha escreveria
    "1,3 g" de proteína numa tela onde tudo o mais usa ponto, e ninguém
    veria: um separador trocado não parece erro, parece número. */
const n1 = (v: number | null) =>
  v == null ? '—' : numeroEnxuto(v, 1);

export default function Alimento() {
  const { c } = useTheme();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams<{ id?: string }>();
  /* ⚠️ O PESO DA PORÇÃO SEGUE O SISTEMA DA PESSOA — ver massaTxt em
     logic/medidas, que explica por que o peso vira onça e o nutriente
     continua em grama. */
  const S = useStore((st) => st.S);
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
  /* ⚠️ O QUE A COLUNA DA ESQUERDA DIZ MUDA COM A FONTE. Alimento de
     tabela traz 100 g e a porção se calcula; produto de rede já traz a
     porção, e não há 100 g para converter. */
  const naPorcao = (v: number | null) =>
    (v == null ? null
      : porUnidadeDe(a) ? Math.round(v * a.qtd * 10) / 10
        : Math.round((v / 100) * (a.gUn ?? 0) * a.qtd * 10) / 10);

  /* Até onde o vidro desce: a barra, a pílula e a frase, mais um dedo
     de folga para a transição não encostar na última linha de texto. */
  const alturaVidro = insets.top + 216;

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
        {/* ⚠️ A MARCA NO LUGAR DA PRATELEIRA, quando existe: "Burger
            King" diz mais do que "Lanches de rede" numa tela que já é
            sobre um produto de rede — e é o que identifica o
            "Cheeseburger" que está aberto, já que o nome sozinho não
            distingue mais. */}
        <Txt v="label" c={c.onHero}>{a.marca ?? a.onde}</Txt>
        <View style={{ width: 36 }} />
      </Row>

      {/* A pílula de vidro, como a da referência: um pedaço da própria
          imagem desfocado, com um fio branco de borda. Aqui o corte é
          desejado — pílula É uma forma fechada. */}
      <BlurView
        intensity={40}
        tint="light"
        style={{
          alignSelf: 'flex-start', marginTop: 40, overflow: 'hidden',
          borderRadius: radius.pill, borderWidth: 1, borderColor: 'rgba(255,255,255,0.35)',
        }}
      >
        <Txt v="caption" c={c.onHero} style={{ paddingHorizontal: 13, paddingVertical: 6 }}>
          {porUnidadeDe(a) ? `Porção: ${medidaDe(a, a.qtd)}` : 'Porção de 100 g'}
        </Txt>
      </BlurView>

      {/* TUDO NESTA LINHA É SOBRE O DESTAQUE.

          A caloria morava aqui, embaixo do valor do nutriente, e criava
          uma dúvida legítima: os "25% do que se recomenda por dia" eram
          sobre a vitamina ou sobre as calorias? Eram sobre a vitamina —
          e a resposta certa não é explicar melhor, é tirar a caloria
          daqui. Ela já está no cartão, ao lado do nome, uma vez só. */}
      {/* O VALOR NA LINHA DO TÍTULO, e a explicação numa linha só dela.

          Os três estavam em duas colunas, e a frase da esquerda acabava
          exatamente onde o número da direita começava — encostados, num
          texto que já é branco sobre foto. Na referência o número divide
          a linha com o título e o texto miúdo corre por baixo dos dois,
          com a largura inteira. */}
      <Row style={{ marginTop: 12, alignItems: 'flex-end' }}>
        <Txt v="display" c={c.onHero} style={{ flex: 1, paddingRight: 12, fontSize: 28, lineHeight: 34 }}>
          {d ? `Muita ${nutriente}` : a.nome}
        </Txt>
        {d ? <Txt v="h2" c={c.onHero}>{n1(d.valor)}{d.un}</Txt> : null}
      </Row>
      <Txt v="caption" c={c.onHero2} style={{ marginTop: 4 }}>
        {d ? `${d.pct}% do que uma pessoa precisa por dia`
          : porUnidadeDe(a) ? `Valores de ${medidaDe(a, a.qtd)}` : 'Valores por 100 g'}
      </Txt>
    </View>
  );

  return (
    <View style={{ flex: 1, backgroundColor: c.bg1 }}>
      <Rolagem showsVerticalScrollIndicator={false} contentContainerStyle={{ flexGrow: 1 }}>
        {/* O DESFOQUE NO LUGAR DO VÉU.

            Antes era um degradê preto por cima da foto inteira, que dava
            leitura ao custo de escurecer a comida — e a comida é o motivo
            de a foto existir. Na referência só a FAIXA DE CIMA é
            desfocada, e a metade de baixo fica nítida: o texto ganha um
            fundo uniforme sem que a imagem perca o brilho.

            E o vidro não termina: ele se desfaz. Uma faixa de desfoque
            com altura fixa deixa um corte reto atravessando a foto, que
            é a coisa que mais denuncia que existe uma camada ali. Ver
            VidroDegrade logo acima.

            QUEM ESTICA É O TOPO, E O TEXTO FICA NO ALTO DELE.

            Duas correções em cima da mesma coisa. A primeira: quem
            crescia para encostar na base era o CARTÃO, e sobrava uma
            faixa branca morta embaixo do botão. Quem ocupa a sobra tem
            de ser a imagem, porque o conteúdo do cartão tem tamanho e a
            foto não tem.

            A segunda: ao esticar o topo eu empurrei o cabeçalho junto,
            para baixo. Na referência ele está no ALTO — barra, pílula e
            a frase —, e a imagem continua embaixo disso, vazia, até
            encontrar o cartão. É essa faixa livre de imagem que faz a
            tela parecer uma foto de comida e não um banner com legenda.

            `flexGrow` faz o topo comer o que sobrar, e `minHeight`
            impede que ele desapareça quando o conteúdo é longo demais e
            a tela vira rolagem. */}
        {foto ? (
          <View style={{ flexGrow: 1, minHeight: 260 }}>
            <Image source={foto} style={{ position: 'absolute', left: 0, right: 0, top: 0, bottom: 0 }} contentFit="cover" />
            {/* A faixa vai bem além da última linha de texto: a passagem
                precisa de espaço para deixar de ser um corte. */}
            <VidroDegrade altura={alturaVidro + 140} />
            {/* Uma sombra a mais, curta e fraca, só atrás do texto. O
                vidro já escurece — mas ele escurece para dar MATÉRIA, e
                numa foto clara o branco do texto ainda encosta no branco
                do fundo. */}
            <LinearGradient
              colors={['rgba(0,0,0,0.26)', 'rgba(0,0,0,0.12)', 'rgba(0,0,0,0)']}
              locations={[0, 0.6, 1]}
              start={{ x: 0, y: 0 }} end={{ x: 0, y: 1 }}
              style={{ position: 'absolute', left: 0, right: 0, top: 0, height: alturaVidro }}
            />
            {cabecalho}
          </View>
        ) : (
          <LinearGradient
            colors={[de, para]}
            start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
            style={{ flexGrow: 1, minHeight: 260 }}
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
          {/* TEXTO CORRIDO, embaixo do nome, como a descrição da
              referência — e não um banner com selo.

              Ele já foi um cartão em tom fraco com a marca do Morphi em
              caixa alta. Chamava mais atenção que o nome do alimento
              logo acima e que os números logo abaixo, para dizer a coisa
              menos exata das três. Como parágrafo ele vira o que é: uma
              orientação, lida no caminho entre o nome e a tabela. */}
          {insight ? (
            <Txt v="caption" c={c.tx2} style={{ marginTop: 6, lineHeight: 22 }}>
              {insight.texto}
            </Txt>
          ) : null}

          {/* AS TRÊS BARRAS */}
          <Row gap={10} style={{ marginTop: 16, alignItems: 'stretch' }}>
            {macros.map(([nome, v]) => (
              <View key={nome} style={{ flex: 1 }}>
                {/* A altura máxima da barra para ANTES do rótulo. Sem o
                    teto, o macro mais alto subia até em cima e cobria a
                    própria palavra que dizia qual macro era. */}
                {/* Mais baixo do que já foi: cada pixel que o gráfico
                    devolve é um pixel a mais de foto lá em cima, e a
                    barra continua legível — o que ela compara são três
                    números, não uma série. */}
                <View style={{
                  height: 148, borderRadius: radius.md, backgroundColor: c.bg2,
                  overflow: 'hidden', justifyContent: 'flex-end',
                }}>
                  <Txt v="micro" c={c.tx3} style={{ position: 'absolute', top: 12, left: 0, right: 0, textAlign: 'center' }}>
                    {nome}
                  </Txt>
                  <LinearGradient
                    colors={[c.bluePale, c.accentWeak]}
                    style={{ height: v == null ? 0 : Math.max(46, (v / teto) * 100), borderRadius: radius.md }}
                  />
                  <Txt v="bodyMed" style={{ position: 'absolute', bottom: 11, left: 0, right: 0, textAlign: 'center' }}>
                    {n1(v)}{v == null ? '' : ' g'}
                  </Txt>
                </View>
              </View>
            ))}
          </Row>

          {/* A fibra fica fora das barras: ela não compete com as três que
              somam a energia, e nem sempre foi analisada. */}
          <Row style={{ marginTop: 16, justifyContent: 'space-between' }}>
            <Txt v="caption" c={c.tx3}>{porUnidadeDe(a) ? `Fibra em ${medidaDe(a, a.qtd)}` : 'Fibra por 100 g'}</Txt>
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
            {/* ⚠️ SEM PESO PUBLICADO A FRASE NÃO INVENTA UM. A tabela
                diz quanto a porção pesa; a rede diz o que ela TEM, e
                "pesa perto de 0 g" seria pior do que não dizer nada. De
                que porção os números são, quem conta é a procedência. */}
            {a.gUn != null ? `${medidaDe(a, a.qtd)} pesa perto de ${massaTxt(S, a.gUn * a.qtd)}. ` : ''}
            {origemDoAlimento(a)}
          </Txt>

          <View style={{ marginTop: 20 }}>
            <Botao
              label="Registrar uma refeição com isto"
              onPress={() => router.push(`/medir-refeicao?oque=${encodeURIComponent(a.nome)}` as any)}
            />
          </View>
        </View>
      </Rolagem>
    </View>
  );
}
