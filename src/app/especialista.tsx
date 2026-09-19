import React from 'react';
import { View, Pressable, ScrollView, StyleSheet } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useStore } from '../logic/store';
import { fichaDe, type FichaDaEquipe } from '../logic/derive';
import { Txt, Row, CircleBtn } from '../ui/kit';
import { Icon } from '../ui/Icon';
import { useTheme } from '../ui/useTheme';
import { radius } from '../theme';
import { fotoDe, focoDe, inicialDoNome } from '../ui/retratos';

/* ============================================================
   A FICHA DE QUEM CUIDA DE VOCÊ

   Existe por uma razão específica: o aplicativo não prescreve nada. Dose,
   protocolo e ajuste são decisão médica, e ele repete isso em todas as
   telas. Então a pergunta "quem é essa pessoa que decide?" precisa ter
   uma resposta, e ela precisa ser verificável — registro, formação, tempo
   de atuação — e não só um nome no topo de um card.

   ⚠️ ELA ERA SÓ DA MÉDICA, E AGORA É DE QUALQUER UM DA EQUIPE.

   A nutricionista, a enfermeira e o psicólogo apareciam como duas linhas
   numa lista, sem nada por trás. Quem quisesse saber quem é a enfermeira
   que orienta a aplicação da caneta tinha onde ler o nome e mais nada.

   Fazer uma segunda tela para eles manteria dois desenhos para a mesma
   pergunta. Esta aceita `?id=`: sem id, a responsável — que é o
   comportamento antigo —, com id, o integrante. Os dados vêm de
   `fichaDe`, que é o único lugar que sabe juntar as duas casas do estado.

   ⚠️ E CADA SEÇÃO SOME QUANDO NÃO TEM DADO. Registro, formação, áreas,
   números e avaliação são todos opcionais: quem vier da clínica um dia
   pode não ter nenhum deles. Cabeçalho de seção vazio é pior do que seção
   nenhuma — diz que falta alguma coisa sem dizer o quê.

   ⚠️ A AVALIAÇÃO APARECE AQUI E NÃO NA ABA. Nota serve para escolher;
   depois de escolhida, vira ruído sobre alguém em quem você já decidiu
   confiar. Quem abre esta tela está avaliando; quem abre a aba está sendo
   cuidado.
   ============================================================ */

const PAD = 24;

/* 330, e a conta é a do rosto: a foto entra `cover` com a largura da tela,
   a queda ocupa os 130 de baixo, e o que sobra limpo são os 200 do alto.
   Mais que isso empurra o nome para fora da dobra; menos vira uma faixa. */
const ALTURA_DO_RETRATO = 330;

export default function Especialista() {
  const S = useStore((s) => s.S);
  const { c } = useTheme();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const go = (to: string) => () => router.push(to as any);

  /* Um id que não existe cai na responsável em vez de numa tela vazia: o
     link pode ter sido guardado antes de alguém sair da equipe. */
  const { id } = useLocalSearchParams<{ id?: string }>();
  const f: FichaDaEquipe | undefined = fichaDe(S, id) ?? fichaDe(S);

  if (!f) {
    return (
      <View style={{ flex: 1, backgroundColor: c.bg, paddingTop: insets.top + 12, paddingHorizontal: PAD }}>
        <Row><CircleBtn name="back" onPress={() => router.back()} /></Row>
        <Txt v="h2" style={{ marginTop: 28 }}>Sem equipe por aqui</Txt>
        <Txt v="note" c={c.tx3} style={{ marginTop: 8, lineHeight: 23 }}>
          Quando a sua clínica ligar a equipe, as fichas de quem acompanha você aparecem aqui.
        </Txt>
      </View>
    );
  }

  const retrato = fotoDe(f.id);

  /* ⚠️ AS AÇÕES SEGUEM O PAPEL, e não a tela. Consultas e Protocolos são
     da responsável — a nutricionista não marca consulta nem assina
     protocolo, e oferecer isso na ficha dela seria dizer que sim.
     Mensagem e Equipe valem para todo mundo. */
  const acoes: [string, string, string][] = f.responsavel
    ? [
      ['companion', 'Mensagem', '/conversa'],
      ['cal', 'Consultas', '/consultas'],
      ['doc', 'Protocolos', '/protocolos'],
      ...(S.profile.clinic ? [['clinica', 'Clínica', '/clinica'] as [string, string, string]] : []),
    ]
    : [
      ['companion', 'Mensagem', '/conversa'],
      ...(S.profile.clinic ? [['clinica', 'Clínica', '/clinica'] as [string, string, string]] : []),
    ];

  return (
    <View style={{ flex: 1, backgroundColor: c.bg }}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        /* insets.bottom: ver a nota em clinica.tsx — 60 cravado encosta na
           barra de gestos do aparelho, onde o inset não é zero. */
        contentContainerStyle={{ paddingBottom: insets.bottom + 48 }}
      >
        {/* ---- o retrato ----

            ⚠️ ELE DEIXOU DE SER UM RECORTE, e com isso o cabeçalho inteiro
            mudou de regra.

            Antes: PNG com fundo transparente, `contain` encostado embaixo,
            um degradê azul atrás da pessoa e o nome escrito POR CIMA da
            imagem. Funcionava porque o rodapé do quadro era o degradê — o
            texto nunca caía sobre a foto de verdade.

            Ninguém manda recorte. Chega a foto que a assessoria tirou:
            pessoa fora do centro, poltrona verde, janela estourada. Escrever
            por cima disso é sortear a legibilidade a cada clínica nova.

            Agora: `cover` de borda a borda, a foto DISSOLVE no fundo da
            página, e o nome começa do outro lado da dissolução — em `c.bg`
            sólido, sempre legível, com qualquer foto. É o mesmo cabeçalho
            de /clinica, e agora as duas telas têm a mesma estrutura: uma
            imagem que se desfaz, e a identidade embaixo dela.

            ⚠️ O CORTE É PELO CENTRO, e não pelo topo. Medido nesta foto: o
            rosto está a 39% da altura do arquivo; com `top center` ele cai
            a 51% do cabeçalho, dentro da faixa que a dissolução já come.
            Pelo centro ele sobe para 31% e fica limpo. `center` também é a
            aposta mais segura para foto desconhecida — as pessoas se
            enquadram no meio do quadro.

            ⚠️ E ISSO AINDA É UMA APOSTA. A saída certa é a foto trazer um
            ponto de foco junto, e não a tela adivinhar. Está anotado em
            PENDENCIAS.

            ⚠️ SEM RETRATO NÃO HÁ CABEÇALHO DE IMAGEM. Não é a versão
            degradada desta: é a outra, inteira — voltar, título e o círculo
            com a inicial. Reservar 330px de degradê para uma foto que não
            chegou é a tela dizendo que falta alguma coisa. */}
        {retrato ? (
          <View style={{ height: ALTURA_DO_RETRATO }}>
            <Image
              source={retrato}
              style={StyleSheet.absoluteFill}
              contentFit="cover"
              contentPosition={focoDe(f.id)}
            />
            {/* O botão de voltar fica sobre a foto, e a foto pode ser uma
                sala clara com a janela estourada. Sem o véu ele desaparece
                justamente nas fotos mais comuns — e é o único jeito de sair
                da tela. */}
            <LinearGradient
              colors={['rgba(0,0,0,0.38)', 'rgba(0,0,0,0.12)', 'rgba(0,0,0,0)']}
              locations={[0, 0.55, 1]}
              style={{ position: 'absolute', left: 0, right: 0, top: 0, height: insets.top + 96 }}
              pointerEvents="none"
            />
            <View style={{ paddingHorizontal: PAD, paddingTop: insets.top + 12 }}>
              <Row>
                {/* Fundo branco fixo: `c.bg2` sobre foto some no claro. */}
                <CircleBtn name="back" onPress={() => router.back()} bg="#FFFFFF" color="#1A1D23" />
              </Row>
            </View>
          </View>
        ) : (
          <View style={{ paddingHorizontal: PAD, paddingTop: insets.top + 12 }}>
            <Row>
              <CircleBtn name="back" onPress={() => router.back()} />
            </Row>
          </View>
        )}

        {/* ---- a página, montada sobre a foto ----

            ⚠️ ABA COM CANTO, E NÃO DEGRADÊ. A foto dissolvia no fundo por
            uma queda de 130px — e uma dissolução gasta 130px de foto para
            esconder uma emenda. Aqui a emenda deixa de ser escondida e
            passa a ser DESENHADA: a página é uma superfície com canto
            arredondado que sobe 26px sobre a imagem, e a foto termina
            inteira, no corte reto, atrás dela.

            É mais honesto com fotos ruins também. A queda empurrava a cor
            do fundo para dentro da imagem e, numa foto escura, o terço de
            baixo virava uma mancha; o canto arredondado não toca a foto,
            só a cobre. */}
        <View style={{
          backgroundColor: c.bg,
          borderTopLeftRadius: retrato ? 28 : 0,
          borderTopRightRadius: retrato ? 28 : 0,
          marginTop: retrato ? -26 : 0,
          paddingTop: retrato ? 24 : 0,
        }}>
        <View style={{ paddingHorizontal: PAD, marginTop: retrato ? 0 : 22 }}>
          {/* Sem retrato, o círculo com a inicial ocupa o lugar dele — o
              mesmo desenho da lista da clínica, para a pessoa reconhecer
              que chegou na ficha de quem tocou. */}
          {!retrato ? (
            <View style={{
              width: 72, height: 72, borderRadius: 36, marginBottom: 18,
              backgroundColor: c.accentWeak, alignItems: 'center', justifyContent: 'center',
            }}>
              <Txt v="h1" c={c.accent} style={{ fontSize: 30 }}>{inicialDoNome(f.nome)}</Txt>
            </View>
          ) : null}

          {/* ⚠️ A NOTA SAIU DA TELA, e com ela a contagem de avaliações.

              Nota serve para ESCOLHER, e esta tela não é de escolha: quem
              a abre já é paciente de quem está nela. Depois de escolhida,
              a estrela vira ruído sobre alguém em quem a pessoa já decidiu
              confiar — e, pior, insinua um mecanismo de avaliação que o
              aplicativo não tem. Ninguém avalia ninguém aqui.

              No dia em que houver diretório de parceiros, ela volta — lá,
              onde a pergunta é "qual deles?" e o número tem uma origem. */}
          <Txt v="h1" style={{ fontSize: 28 }}>{f.nome}</Txt>
          <Txt v="caption" c={c.tx2} style={{ marginTop: 6 }}>
            {[f.papel, f.registro].filter(Boolean).join(' · ')}
          </Txt>
          {!!S.profile.clinic && (
            <Txt v="caption" c={c.tx3} style={{ marginTop: 2 }}>{S.profile.clinic}</Txt>
          )}
        </View>

        {/* ---- as ações ----

            ⚠️ SEM CARTÃO, e elas moravam num. O cartão de vidro existia
            para costurar a foto com a página, montado na divisa entre as
            duas; quando a aba assumiu a costura, ele virou uma caixa em
            volta de quatro botões que já se leem como quatro botões. É a
            mesma regra dos ícones soltos nas listas do aplicativo — a
            moldura é a única parte da peça que não diz nada.

            ⚠️ E O CÍRCULO GANHOU COR. Era `c.bg2`, o cinza de superfície, o
            que fazia quatro ações de verdade parecerem quatro lugares
            desativados. Em `accentWeak` com o ícone em `accent` elas leem
            como o que são, e acompanham a paleta que a pessoa escolheu em
            vez de um cinza fixo.

            Uma cor por ação seria um arco-íris: são quatro caminhos para a
            mesma pessoa, e uma família só de cor é o que diz isso. */}
        <View style={{ paddingHorizontal: PAD, marginTop: 22 }}>
          <Row gap={8}>
            {acoes.map(([ic, label, to]) => (
              <Pressable key={label} onPress={go(to)} style={({ pressed }) => [{ flex: 1, opacity: pressed ? 0.6 : 1 }]}>
                <View style={{ alignItems: 'center' }}>
                  <View style={{ width: 52, height: 52, borderRadius: 26, backgroundColor: c.accentWeak, alignItems: 'center', justifyContent: 'center' }}>
                    <Icon name={ic} size={21} color={c.accent} sw={1.9} />
                  </View>
                  <Txt v="micro" c={c.tx2} style={{ marginTop: 8 }}>{label}</Txt>
                </View>
              </Pressable>
            ))}
          </Row>
        </View>

        <View style={{ paddingHorizontal: PAD }}>
          {/* ---- os números que sustentam a credencial ----

              ⚠️ DOIS, E ERAM TRÊS. "Avaliações" saiu junto com a nota: uma
              contagem de avaliações sem avaliação nenhuma no aplicativo é
              um número que não tem de onde vir.

              ⚠️ E CADA UM GANHOU ÍCONE. Sem eles a fileira era dois pares
              de texto separados por um fio — tempo e volume, duas grandezas
              diferentes lidas com o mesmo peso. O relógio e as pessoas
              dizem de que espécie é cada número antes de alguém ler o
              número. */}
          {!!f.anos && !!f.pacientes && (
            <Row style={{ backgroundColor: c.bg1, borderRadius: radius.lg, marginTop: 18, paddingVertical: 18 }}>
              {([
                ['clock', `${f.anos} anos`, 'de experiência'],
                ['user', `${(f.pacientes / 1000).toFixed(1).replace('.', ',')}k+`, 'pacientes atendidos'],
              ] as [string, string, string][]).map(([ic, valor, label], i) => (
                <React.Fragment key={label}>
                  {i > 0 && <View style={{ width: 1, backgroundColor: c.line2, marginVertical: 2 }} />}
                  <View style={{ flex: 1, alignItems: 'center', paddingHorizontal: 6 }}>
                    <Icon name={ic} size={19} color={c.accent} sw={1.9} />
                    <Txt v="h2" style={{ marginTop: 8 }}>{valor}</Txt>
                    <Txt v="micro" c={c.tx3} style={{ marginTop: 3, textAlign: 'center' }}>{label}</Txt>
                  </View>
                </React.Fragment>
              ))}
            </Row>
          )}

          {!!f.sobre && (
            <View style={{ marginTop: 32 }}>
              <Txt v="h2">Sobre</Txt>
              <Txt v="body" c={c.tx2} style={{ marginTop: 12, lineHeight: 26 }}>{f.sobre}</Txt>
            </View>
          )}

          {/* ⚠️ FORMAÇÃO É A PARTE VERIFICÁVEL, e é ela que separa "alguém
              está te acompanhando" de "alguém habilitado está". Num app que
              não prescreve nada, essa distinção é o produto inteiro — e ela
              estava faltando na única tela que existe para respondê-la. */}
          {!!f.formacao?.length && (
            <View style={{ marginTop: 30 }}>
              <Txt v="h2">Formação</Txt>
              <View style={{ marginTop: 14, gap: 10 }}>
                {f.formacao.map((l) => (
                  <Row key={l} gap={10} style={{ alignItems: 'flex-start' }}>
                    <View style={{ marginTop: 7, width: 4, height: 4, borderRadius: 2, backgroundColor: c.tx4 }} />
                    <Txt v="caption" c={c.tx2} style={{ flex: 1, lineHeight: 22 }}>{l}</Txt>
                  </Row>
                ))}
              </View>
            </View>
          )}

          {!!f.areas?.length && (
            <View style={{ marginTop: 30 }}>
              <Txt v="h2">{f.responsavel ? 'Abordagens' : 'Áreas'}</Txt>
              <Row gap={8} style={{ flexWrap: 'wrap', marginTop: 14 }}>
                {/* ⚠️ PREENCHIDAS, E ERAM CONTORNO CINZA. O contorno é o
                    desenho de chip de FILTRO — uma coisa que se liga e se
                    desliga —, e aqui nada se liga: são afirmações da
                    pessoa sobre o trabalho dela. Preenchidas em accentWeak
                    elas param de pedir toque e passam a ler como
                    etiquetas, que é o que são.

                    ⚠️ E ISSO AS SEPARA DOS CONVÊNIOS DE /clinica, que
                    continuam em contorno de propósito: lá é uma lista que
                    se varre à procura do nome do seu plano, aqui é um
                    punhado de atributos de quem cuida de você. */}
                {f.areas.map((a) => (
                  <View key={a} style={{ backgroundColor: c.accentWeak, borderRadius: radius.pill, paddingHorizontal: 14, paddingVertical: 9, marginBottom: 8 }}>
                    <Txt v="caption" c={c.accent}>{a}</Txt>
                  </View>
                ))}
              </Row>
            </View>
          )}

          {/* O limite dito na cara. Não é rodapé legal: é a fronteira que dá
              sentido ao resto do app — a IA observa e organiza, esta pessoa
              decide.

              ⚠️ E SÓ NA FICHA DE QUEM DECIDE. Dose e protocolo são da
              responsável; repetir isso na ficha da nutricionista diria que
              ela também decide o tratamento, que é o contrário do que a
              frase existe para dizer. */}
          {f.responsavel && (
            <View style={{ marginTop: 32, backgroundColor: c.bg1, borderRadius: radius.lg, padding: 18 }}>
              <Row gap={10} style={{ alignItems: 'flex-start' }}>
                <View style={{ marginTop: 2 }}>
                  <Icon name="shield" size={17} color={c.tx3} sw={1.9} />
                </View>
                <Txt v="caption" c={c.tx3} style={{ flex: 1, lineHeight: 20 }}>
                  Dose, protocolo e qualquer ajuste no tratamento são decisão de {f.nome}.
                  A gente organiza os seus registros e prepara o que levar — não prescreve.
                </Txt>
              </Row>
            </View>
          )}

          {/* ⚠️ O BOTÃO DO RODAPÉ SAIU, e ele dizia "Escrever para a
              equipe". Era a mesma ação de "Mensagem", que está lá em cima
              na fileira, com outro nome e outro peso — e a fileira de ações
              é o lugar dela: logo abaixo de quem a pessoa é, antes de todo
              o texto. Repetida no fim, ela pedia de novo o que já tinha
              sido oferecido, e obrigava quem só queria ler a ficha a rolar
              por cima de um botão azul.

              A tela termina no limite: dose e protocolo são decisão de quem
              está nela. É um fecho melhor do que uma chamada para ação. */}
        </View>
        </View>
      </ScrollView>
    </View>
  );
}
