import React from 'react';
import { View, Pressable, ScrollView, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useStore } from '../logic/store';
import { fichaDaClinica } from '../logic/derive';
import { Txt, Card, Row, CircleBtn, Chevron } from '../ui/kit';
import { Icon } from '../ui/Icon';
import { RETRATOS, inicialDoNome, IMAGENS_DA_CLINICA, iniciaisDaClinica } from '../ui/retratos';
import { Cartao } from '../ui/internas';
import { useTheme } from '../ui/useTheme';
import { dataComAno } from '../logic/time';
import { radius, shadowCard, alfa } from '../theme';
import { Image } from 'expo-image';

/* ============================================================
   A CLÍNICA — quem está do outro lado, como instituição

   ⚠️ ELA EXISTE PORQUE A EQUIPE PRECISAVA DE UM LUGAR, e o carrossel do
   hub não era esse lugar.

   Havia uma fileira de três cartões com foto e nome no meio da tela de
   equipe, e ela tinha dois problemas ao mesmo tempo: gastava a largura
   toda para dizer o que cabia numa lista, e pressupunha que sempre há
   mais de uma pessoa. Quem se trata com uma médica sozinha via um
   carrossel de um item — que é uma fileira que não rola, ocupando o
   espaço de uma que rolaria.

   A equipe é da clínica. Aqui ela é uma lista, cada linha abre a ficha, e
   uma pessoa só continua sendo uma linha.

   ⚠️ E ESTA TELA SÓ EXISTE QUANDO HÁ CLÍNICA. Quem se trata com um
   profissional sem clínica nenhuma não tem a ação "Clínica" no cartão do
   hub — e a ficha dele continua completa em /especialista, porque a
   pessoa nunca dependeu da instituição para ter credencial.

   ⚠️ NÃO HÁ TELEFONE, SITE NEM INSTAGRAM. Inventá-los na semente não é
   como inventar um CRN: um CRN falso não faz nada, um telefone falso faz
   alguém ligar para a casa de um estranho. O canal que existe é a
   conversa, e ela está aqui.

   O ENDEREÇO ENTROU, e entrou como TEXTO. Saber onde fica responde a
   dúvida de quem vai à consulta, e isso um texto resolve; abrir o mapa é
   outra coisa — é mandar alguém até uma porta, e essa ação só nasce junto
   com o endereço de verdade.

   ⚠️ O CABEÇALHO É A FOTO DA CLÍNICA, quando ela existe: sangra de
   borda a borda por trás da barra de status, e o cartão com o nome sobe
   por cima dela. É o mesmo gesto de /especialista — lá é o retrato de uma
   pessoa, aqui é a recepção — e o motivo é o mesmo: a escala diz que do
   outro lado tem um lugar de verdade, não um registro.

   ⚠️ E SEM FOTO A TELA TEM OUTRO CABEÇALHO, com título e as iniciais da
   clínica. Não é uma versão degradada da primeira: é a segunda, inteira.
   Reservar 300px de cinza para uma imagem que não chegou é a tela dizendo
   que falta alguma coisa, e o que falta não é culpa de quem está lendo.

   ⚠️ E ELA VAI SERVIR PARA APRESENTAR PARCEIROS um dia — é a tela que
   alguém vê antes de decidir. Por isso o que ela diz precisa ser o que a
   clínica afirmou sobre si, e não o que o aplicativo inferiu: `sobre`,
   especialidade e cidade vêm de `clinicInfo`, e sumem inteiros quando
   ela não mandou nada.
   ============================================================ */

const PAD = 24;

/* A foto tem 300 e não 430 como o retrato de /especialista: lá a pessoa é
   o assunto da tela e ocupa quase a dobra inteira; aqui a recepção é o
   contexto, e o que a pessoa veio ler — nome, endereço, equipe — precisa
   começar acima da dobra. */
const ALTURA_DA_FOTO = 300;

export default function Clinica() {
  const S = useStore((s) => s.S);
  const { c } = useTheme();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const go = (to: string) => () => router.push(to as any);

  const f = fichaDaClinica(S);
  /* Vazio enquanto a clínica não mandar logo nem foto — e vazio é um
     estado inteiro, não um estado degradado: a faixa não aparece e o
     quadrado mostra as iniciais. */
  const imagens = (f && IMAGENS_DA_CLINICA[f.nome]) || {};

  if (!f) {
    return (
      <View style={{ flex: 1, backgroundColor: c.bg, paddingTop: insets.top + 20, paddingHorizontal: PAD }}>
        <Row style={{ marginTop: 4 }} gap={12}>
          <CircleBtn name="back" onPress={() => router.back()} />
          <Txt v="title" style={{ flex: 1 }}>Clínica</Txt>
        </Row>
        <Txt v="note" c={c.tx3} style={{ marginTop: 28, lineHeight: 23 }}>
          Você não tem clínica vinculada. Quem acompanha o seu tratamento aparece em Sua equipe.
        </Txt>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: c.bg }}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 60 }}>
        {imagens.foto ? (
          <>
            {/* ---- cabeçalho com foto ----

                A imagem sobe até o topo do aparelho, POR TRÁS da barra de
                status, e não começa depois dela. Uma foto que respeita a
                safe area vira um cartão com uma faixa de fundo em cima; uma
                que a atravessa vira o cabeçalho.

                ⚠️ O VÉU ESCURO NO ALTO NÃO É ESTILO. O botão de voltar fica
                sobre a foto, e a foto é da clínica: pode ser uma recepção
                clara com a janela estourada. Sem o véu, o botão desaparece
                exatamente nas fotos mais comuns — e é o único jeito de
                sair da tela. */}
            <View style={{ height: ALTURA_DA_FOTO }}>
              <Image
                source={imagens.foto}
                style={StyleSheet.absoluteFill}
                contentFit="cover"
                contentPosition="center"
              />
              <LinearGradient
                colors={['rgba(0,0,0,0.38)', 'rgba(0,0,0,0.12)', 'rgba(0,0,0,0)']}
                locations={[0, 0.55, 1]}
                style={{ position: 'absolute', left: 0, right: 0, top: 0, height: insets.top + 96 }}
                pointerEvents="none"
              />
              {/* ⚠️ E A QUEDA NO PÉ USA `c.bg`, como em /especialista. Sem ela
                  a foto termina num corte reto a meia altura do cartão que
                  sobe — e o cartão passa a parecer colado, e não apoiado. */}
              <LinearGradient
                colors={[alfa(c.bg, 0), alfa(c.bg, 0.5), c.bg]}
                locations={[0, 0.62, 1]}
                style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: 96 }}
                pointerEvents="none"
              />
              <View style={{ paddingHorizontal: PAD, paddingTop: insets.top + 12 }}>
                <Row>
                  {/* Fundo branco fixo: `c.bg2` sobre foto some no claro. */}
                  <CircleBtn name="back" onPress={() => router.back()} bg="#FFFFFF" color="#1A1D23" />
                </Row>
              </View>
            </View>

            {/* ⚠️ O CARTÃO SOBE 44px SOBRE A FOTO, e não encosta nela. A
                sobreposição é o que costura os dois: o nome pertence à
                imagem, e empilhados eles viravam duas peças com uma emenda
                no meio. O logo fica na quina de cima, meio dentro e meio
                fora, que é onde uma marca se apoia. */}
            <View style={{ paddingHorizontal: PAD, marginTop: -44 }}>
              <View style={[{ backgroundColor: c.bg1, borderRadius: radius.card, padding: 20 }, shadowCard(c)]}>
                {imagens.logo ? (
                  <Image
                    source={imagens.logo}
                    style={{ width: 52, height: 52, borderRadius: radius.md, marginBottom: 14, backgroundColor: c.bg }}
                    contentFit="contain"
                  />
                ) : null}
                <Txt v="h1" style={{ fontSize: 26 }}>{f.nome}</Txt>
                {!!f.especialidade && (
                  <Txt v="caption" c={c.tx2} style={{ marginTop: 6 }}>{f.especialidade}</Txt>
                )}
                {!!f.cidade && (
                  <Row gap={5} style={{ alignItems: 'center', marginTop: 3 }}>
                    <Icon name="pin" size={13} color={c.tx4} sw={1.9} />
                    <Txt v="caption" c={c.tx3}>{f.cidade}</Txt>
                  </Row>
                )}
              </View>
            </View>
          </>
        ) : (
          /* ---- cabeçalho sem foto ----

              ⚠️ O QUADRADO MOSTRA AS INICIAIS, e mostrava um coração. Um
              ícone genérico no lugar da marca é a pior reserva possível
              numa tela cujo propósito é APRESENTAR a clínica — um coração
              que não é dela diz menos do que duas letras que são. */
          <View style={{ paddingHorizontal: PAD, paddingTop: insets.top + 20 }}>
            <Row style={{ marginTop: 4 }} gap={12}>
              <CircleBtn name="back" onPress={() => router.back()} />
              <Txt v="title" style={{ flex: 1 }}>Clínica</Txt>
            </Row>
            <View style={{ marginTop: 20 }}>
              {imagens.logo ? (
                <Image
                  source={imagens.logo}
                  style={{ width: 56, height: 56, borderRadius: radius.md, backgroundColor: c.bg1 }}
                  contentFit="contain"
                />
              ) : (
                <View style={{
                  width: 56, height: 56, borderRadius: radius.md,
                  backgroundColor: c.accentWeak, alignItems: 'center', justifyContent: 'center',
                }}>
                  <Txt v="h2" c={c.accent}>{iniciaisDaClinica(f.nome)}</Txt>
                </View>
              )}
              <Txt v="h1" style={{ fontSize: 28, marginTop: 16 }}>{f.nome}</Txt>
              {!!f.especialidade && (
                <Txt v="caption" c={c.tx2} style={{ marginTop: 6 }}>{f.especialidade}</Txt>
              )}
              {!!f.cidade && (
                <Row gap={5} style={{ alignItems: 'center', marginTop: 3 }}>
                  {/* O ícone `pin` entrou no jogo para isto. Estava aqui o
                      `target`, que no resto do aplicativo é a mira das
                      metas — dois significados para o mesmo desenho é o
                      começo de nenhum. */}
                  <Icon name="pin" size={13} color={c.tx4} sw={1.9} />
                  <Txt v="caption" c={c.tx3}>{f.cidade}</Txt>
                </Row>
              )}
            </View>
          </View>
        )}

        <View style={{ paddingHorizontal: PAD }}>
        {!!f.sobre && (
          <Txt v="body" c={c.tx2} style={{ marginTop: 22, lineHeight: 26 }}>{f.sobre}</Txt>
        )}

        {/* ---- onde fica ----

            ⚠️ O ENDEREÇO NÃO ABRE O MAPA, e é texto de propósito: ele vem de
            semente, e um endereço clicável falso manda alguém até a porta de
            um estranho. A ação entra junto com o dado de verdade.

            A cidade se repete aqui embaixo da rua, e não é engano: no alto
            ela é identidade ("esta clínica é de São Paulo"), aqui ela é a
            segunda linha de um endereço. Quem lê um endereço espera a cidade
            nele. */}
        {(!!f.endereco || !!f.horario) && (
          <View style={{ marginTop: 30 }}>
            <Txt v="h2" style={{ marginBottom: 10 }}>Onde fica</Txt>
            <Card style={{ gap: 14 }}>
              {!!f.endereco && (
                <Row gap={13} style={{ alignItems: 'flex-start' }}>
                  <View style={{ width: 20, alignItems: 'center', marginTop: 1 }}>
                    <Icon name="pin" size={18} color={c.accent} sw={1.9} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Txt v="body" style={{ lineHeight: 23 }}>{f.endereco}</Txt>
                    {!!f.cidade && <Txt v="caption" c={c.tx3} style={{ marginTop: 2 }}>{f.cidade}</Txt>}
                  </View>
                </Row>
              )}
              {!!f.horario && (
                <Row gap={13} style={{ alignItems: 'center' }}>
                  <View style={{ width: 20, alignItems: 'center' }}>
                    <Icon name="clock" size={18} color={c.accent} sw={1.9} />
                  </View>
                  <Txt v="body" style={{ flex: 1 }}>{f.horario}</Txt>
                </Row>
              )}
            </Card>
          </View>
        )}

        {/* ---- convênios ----

            ⚠️ EM CHIPS, E NÃO EM LISTA. Convênio é um conjunto que se VARRE:
            a pessoa procura o nome do dela e não lê os outros. Numa lista,
            cada um vira uma linha de mesmo peso e ela lê todas para achar
            uma. É o mesmo desenho das áreas de atuação na ficha de quem
            atende, e pelo mesmo motivo.

            ⚠️ E A SEÇÃO SOME QUANDO A CLÍNICA NÃO INFORMOU. "Não informou" e
            "só atende particular" são coisas diferentes, e a tela não tem
            como saber qual é — então ela não chuta. Quem atende só
            particular manda uma lista de um item. */}
        {!!f.convenios?.length && (
          <View style={{ marginTop: 30 }}>
            <Txt v="h2" style={{ marginBottom: 12 }}>Convênios atendidos</Txt>
            <Row gap={8} style={{ flexWrap: 'wrap' }}>
              {f.convenios.map((v) => (
                <View
                  key={v}
                  style={{
                    borderWidth: 1, borderColor: c.line, borderRadius: radius.pill,
                    paddingHorizontal: 14, paddingVertical: 9, marginBottom: 8,
                  }}
                >
                  <Txt v="caption" c={c.tx2}>{v}</Txt>
                </View>
              ))}
            </Row>
          </View>
        )}

        {/* ---- a equipe ----

            ⚠️ LISTA, E NÃO CARROSSEL. A lista serve uma pessoa e serve seis;
            o carrossel só serve três ou mais, e com menos vira uma fileira
            que não rola ocupando o espaço de uma que rolaria.

            A responsável entra junto, e não separada: aqui a pergunta é
            "quem trabalha nesta clínica", e ela é a primeira resposta. */}
        {f.equipe.length ? (
          <View style={{ marginTop: 30 }}>
            <Txt v="h2" style={{ marginBottom: 10 }}>
              {f.equipe.length === 1 ? 'Quem acompanha você' : 'A equipe'}
            </Txt>
            {/* ⚠️ É O <Cartao> DA CASA, e era um <Card> com as linhas e os
                fios escritos aqui. O <Card> tem 20 de respiro; as listas do
                aplicativo têm 16, e é com 16 que os fios entram sozinhos,
                sem o `i > 0` e sem o <Divider> com margem calculada à mão.

                Os 8px que isso devolve são o que faz "Endocrinologista"
                caber ao lado do selo — medido: a coluna de texto tinha 201 e
                o par pedia 210. */}
            <Cartao>
              {f.equipe.map((m) => (
                <Pressable
                  key={m.id}
                  onPress={go(`/especialista?id=${m.id}`)}
                  style={({ pressed }) => [{ opacity: pressed ? 0.6 : 1 }]}
                >
                  <Row gap={12} style={{ paddingHorizontal: 16, paddingVertical: 12, alignItems: 'center' }}>
                    <Avatar ficha={m} />
                    {/* ⚠️ "RESPONSÁVEL" VEM PRIMEIRO, e vinha por último.
                        Era "Endocrinologista · responsável", que em 213px de
                        coluna quebrava em duas linhas: a primeira da lista
                        ficava mais alta que as outras três, e uma lista com um
                        item desalinhado lê como erro antes de ler como
                        hierarquia.

                        ⚠️ E NÃO VIROU SELO, que foi a primeira tentativa e não
                        cabe. Medido: a etiqueta ocupa 99px e "Endocrinologista"
                        pede 120 — 225 numa coluna de 213, e nenhum respiro que
                        se aperte devolve os 12 que faltam. Encolher a etiqueta
                        ou o subtítulo resolveria a régua e quebraria a escala:
                        as listas desta casa são 19 no título e 16 no subtítulo,
                        em todas as telas.

                        Invertida, a palavra que importa é a que nunca é
                        cortada — se algum dia faltar espaço, sobra
                        "Responsável · Endocrinolog…", e essa é a ordem certa
                        de perder informação. O papel inteiro está na ficha, a
                        um toque. */}
                    <View style={{ flex: 1 }}>
                      <Txt v="bodyMed" numberOfLines={1}>{m.nome}</Txt>
                      <Txt v="caption" c={c.tx3} numberOfLines={1} style={{ marginTop: 2 }}>
                        {[m.responsavel ? 'Responsável' : null, m.papel].filter(Boolean).join(' · ')}
                      </Txt>
                    </View>
                    <Chevron />
                  </Row>
                </Pressable>
              ))}
            </Cartao>
          </View>
        ) : null}

        {/* ---- o vínculo ---- */}
        {!!f.desde && (
          <View style={{ marginTop: 26, backgroundColor: c.bg1, borderRadius: radius.lg, padding: 18 }}>
            <Row gap={10} style={{ alignItems: 'flex-start' }}>
              <View style={{ marginTop: 2 }}>
                <Icon name="check" size={16} color={c.lime} sw={2.4} />
              </View>
              {/* ⚠️ SEM A PARTE DA COBRANÇA. A frase dizia "e é esse vínculo
                  que cobre o aplicativo para você" — o que é verdade e tem
                  casa: /assinatura diz isso em corpo grande, com a etiqueta
                  Care e o "Sem custo". Repetido aqui, espalha o assunto do
                  dinheiro por uma tela que é sobre quem cuida de você. */}
              <Txt v="caption" c={c.tx3} style={{ flex: 1, lineHeight: 20 }}>
                Você está vinculada a esta clínica desde {dataComAno(f.desde)}.
              </Txt>
            </Row>
          </View>
        )}

        {/* ⚠️ UMA AÇÃO, E ELA É A QUE EXISTE. O desenho de referência tem
            quatro — WhatsApp, telefone, site e Instagram — e nenhuma das
            quatro tem dado no estado. Uma que abre vale mais do que quatro
            que param. */}
        <Pressable onPress={go('/conversa')} style={({ pressed }) => [{ marginTop: 26, opacity: pressed ? 0.85 : 1 }]}>
          <Row gap={8} style={{ backgroundColor: c.accent, borderRadius: radius.pill, paddingVertical: 15, justifyContent: 'center' }}>
            <Icon name="companion" size={18} color={c.accentInk} sw={1.9} />
            <Txt v="body" c={c.accentInk}>Escrever para a equipe</Txt>
          </Row>
          </Pressable>
        </View>
      </ScrollView>
    </View>
  );
}

/* O mesmo quadrado de canto redondo da tela de equipe — é a mesma pessoa
   nas duas telas, e ela não pode mudar de forma no caminho. */
function Avatar({ ficha }: { ficha: { id: string; nome: string } }) {
  const { c } = useTheme();
  const foto = RETRATOS[ficha.id];
  const lado = 48;
  if (foto) {
    return (
      <Image
        source={foto}
        style={{ width: lado, height: lado, borderRadius: radius.sm, backgroundColor: c.bg2 }}
        contentFit="cover"
        contentPosition="top center"
      />
    );
  }
  return (
    <View style={{
      width: lado, height: lado, borderRadius: radius.sm,
      backgroundColor: c.accentWeak, alignItems: 'center', justifyContent: 'center',
    }}>
      <Txt v="bodyMed" c={c.accent}>{inicialDoNome(ficha.nome)}</Txt>
    </View>
  );
}
