import React from 'react';
import { View, Pressable, ScrollView, StyleSheet, Linking } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useStore } from '../logic/store';
import { fichaDaClinica, contatosDaClinica, type FichaDaClinica } from '../logic/derive';
import { Txt, Card, Row, CircleBtn, Chevron } from '../ui/kit';
import { Icon } from '../ui/Icon';
import { RETRATOS, inicialDoNome, IMAGENS_DA_CLINICA, iniciaisDaClinica } from '../ui/retratos';
import { Cartao, Linha } from '../ui/internas';
import { useTheme } from '../ui/useTheme';
import { dataComAno } from '../logic/time';
import { radius } from '../theme';
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

   ⚠️ E ELA TEM DUAS VERSÕES: A SUA CLÍNICA E UMA PARCEIRA.

   A diferença não é de conteúdo — é de RELAÇÃO. Quem é paciente tem uma
   conversa dentro do aplicativo, e a tela termina nela. Quem assina o
   Personal e está olhando uma parceira não tem conversa nenhuma: termina
   em telefone, WhatsApp, site — os canais de quem ainda é de fora.

   Três coisas mudam, e só três:

   · o cartão do vínculo vira a nota de como a parceria funciona;
   · o botão "Escrever para a equipe" some, porque a conversa é entre uma
     clínica e SEUS pacientes — para quem não é, ele escreveria para
     ninguém;
   · a equipe deixa de abrir ficha — ver quem trabalha lá é informação,
     mas a ficha de /especialista é a de quem CUIDA DE VOCÊ, com mensagem,
     consultas e protocolos. Nenhuma dessas ações existe para quem não é
     paciente, e uma tela cheia de ações que não respondem é pior do que
     uma linha que não abre.

   Todo o resto — foto, nome, sobre, endereço, convênios e OS CANAIS DA
   CLÍNICA — é idêntico, porque a clínica é a mesma nas duas. Telefone e
   WhatsApp valem para os dois lados: ter a conversa do aplicativo não
   dispensa ninguém de remarcar uma consulta pelo telefone.

   ⚠️ A ORDEM DAS SEÇÕES É A ORDEM DAS PERGUNTAS, e não a da importância
   do texto. Duas coisas trazem alguém a esta tela — ONDE FICA e SE
   ATENDE O MEU CONVÊNIO —, e as duas são respostas de um olhar só: um
   endereço e uma fileira de nomes. Elas vêm primeiro, encostadas no
   cartão da identidade, que termina justamente na cidade.

   A apresentação da clínica vem depois. Ela é o que se lê quando a
   decisão ainda não foi tomada; endereço e convênio são o que se
   CONSULTA, inclusive por quem já é paciente e vai à consulta amanhã.

   ⚠️ ELA VAI SERVIR PARA APRESENTAR PARCEIROS — é a tela que alguém vê
   antes de decidir. Por isso o que ela diz precisa ser o que a clínica
   afirmou sobre si, e não o que o aplicativo inferiu: `sobre`,
   especialidade e cidade vêm de `clinicInfo`, e sumem inteiros quando
   ela não mandou nada.
   ============================================================ */

const PAD = 24;

/* A foto tem 260 e não 430 como o retrato de /especialista: lá a pessoa é
   o assunto da tela e ocupa quase a dobra inteira; aqui a recepção é o
   contexto, e o que a pessoa veio ler — nome, endereço, convênios —
   precisa caber acima da dobra.

   Eram 300 enquanto o cartão da identidade subia 44px sobre ela. Sem o
   cartão nada mais sobe, e os 40 que faltavam voltam para o conteúdo. */
const ALTURA_DA_FOTO = 260;

export default function Clinica() {
  const S = useStore((s) => s.S);
  const { c } = useTheme();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const go = (to: string) => () => router.push(to as any);

  /* ⚠️ PORTA DE DESENVOLVIMENTO, e está listada em PENDENCIAS.

     A versão de parceira não tem entrada: para chegar nela é preciso um
     diretório de clínicas, que não existe. Enquanto não existir, `?parceira=1`
     é como se olha para ela — e é `__DEV__` porque uma porta que mostra a
     tela errada da clínica de alguém é exatamente o tipo de coisa que não
     pode sair daqui. */
  const { parceira } = useLocalSearchParams<{ parceira?: string }>();
  const vinculada = !(__DEV__ && parceira === '1');

  const f = fichaDaClinica(S);
  const contatos = contatosDaClinica(f?.contato);
  const abrir = (url: string) => () => { Linking.openURL(url).catch(() => {}); };
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
          Você não tem clínica vinculada. Quem acompanha o seu tratamento aparece na área médica.
        </Txt>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: c.bg }}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 60 }}>
        {/* ---- o cabeçalho ----

            ⚠️ A IDENTIDADE SAIU DO CARTÃO, e ficava num cartão branco que
            subia 44px sobre a foto. O cartão fazia duas coisas ao mesmo
            tempo: costurava o nome à imagem e encaixotava o conteúdo. Só a
            primeira era necessária, e a queda da foto para `c.bg` já faz
            essa costura sozinha — a imagem não termina num corte, ela
            dissolve no fundo da página, e o nome começa do outro lado da
            dissolução.

            O que o cartão custava: uma caixa branca sobre outro fundo
            claro, uma sombra, um segundo raio de canto, e um respiro de 20
            que estreitava o endereço a ponto de "Jardim Modelo" quebrar
            sozinho numa linha. Nada disso dizia nada.

            ⚠️ E AGORA OS DOIS CABEÇALHOS TERMINAM NO MESMO BLOCO. Com foto
            ou sem, o que vem depois é a mesma identidade na mesma posição:
            marca, nome, especialidade, onde fica. A foto é um cabeçalho
            diferente, não uma tela diferente — e antes eram duas estruturas
            paralelas que precisavam ser mantidas juntas na mão. */}
        {imagens.foto ? (
          <View style={{ height: ALTURA_DA_FOTO }}>
            {/* A imagem sobe até o topo do aparelho, POR TRÁS da barra de
                status, e não começa depois dela. Uma foto que respeita a
                safe area vira um cartão com uma faixa de fundo em cima; uma
                que a atravessa vira o cabeçalho. */}
            <Image
              source={imagens.foto}
              style={StyleSheet.absoluteFill}
              contentFit="cover"
              contentPosition="center"
            />
            {/* ⚠️ O VÉU ESCURO NO ALTO NÃO É ESTILO. O botão de voltar fica
                sobre a foto, e a foto é da clínica: pode ser uma recepção
                clara com a janela estourada. Sem o véu, o botão desaparece
                exatamente nas fotos mais comuns — e é o único jeito de sair
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
          <View style={{ paddingHorizontal: PAD, paddingTop: insets.top + 20 }}>
            <Row style={{ marginTop: 4 }} gap={12}>
              <CircleBtn name="back" onPress={() => router.back()} />
              <Txt v="title" style={{ flex: 1 }}>Clínica</Txt>
            </Row>
          </View>
        )}

        {/* ---- a página, montada sobre a foto ----

            ⚠️ ABA COM CANTO, E NÃO DEGRADÊ — a mesma troca de /especialista,
            e pelo mesmo motivo. A foto dissolvia no fundo por uma queda de
            120px, e uma dissolução gasta 120px de foto para esconder uma
            emenda. Aqui a emenda deixa de ser escondida e passa a ser
            DESENHADA: a página é uma superfície com canto que sobe 26px
            sobre a imagem, e a foto termina inteira, no corte reto, atrás
            dela.

            É mais honesto com foto ruim também. A queda empurrava a cor do
            fundo para dentro da imagem e, numa recepção escura, a faixa de
            baixo virava mancha; o canto não toca a foto, só a cobre. */}
        <View style={{
          backgroundColor: c.bg,
          borderTopLeftRadius: imagens.foto ? 28 : 0,
          borderTopRightRadius: imagens.foto ? 28 : 0,
          marginTop: imagens.foto ? -26 : 0,
          paddingTop: imagens.foto ? 24 : 0,
        }}>

        {/* ---- a identidade ----

            ⚠️ A MARCA SÓ APARECE QUANDO É A MARCA. Com logo, ele entra nos
            dois casos. Sem logo, as iniciais entram só quando NÃO há foto —
            com foto, a imagem já disse de quem é a tela, e um quadrado com
            duas letras embaixo dela seria um segundo emblema para a mesma
            clínica.

            ⚠️ O QUADRADO DAS INICIAIS SUBSTITUIU UM CORAÇÃO. Um ícone
            genérico no lugar da marca é a pior reserva possível numa tela
            cujo propósito é APRESENTAR a clínica — um coração que não é
            dela diz menos do que duas letras que são. */}
        <View style={{ paddingHorizontal: PAD, marginTop: imagens.foto ? 0 : 20 }}>
          {imagens.logo ? (
            <Image
              source={imagens.logo}
              style={{ width: 56, height: 56, borderRadius: radius.md, marginBottom: 16, backgroundColor: c.bg1 }}
              contentFit="contain"
            />
          ) : !imagens.foto ? (
            <View style={{
              width: 56, height: 56, borderRadius: radius.md, marginBottom: 16,
              backgroundColor: c.accentWeak, alignItems: 'center', justifyContent: 'center',
            }}>
              <Txt v="h2" c={c.accent}>{iniciaisDaClinica(f.nome)}</Txt>
            </View>
          ) : null}
          <Txt v="h1" style={{ fontSize: 28 }}>{f.nome}</Txt>
          {!!f.especialidade && (
            <Txt v="caption" c={c.tx2} style={{ marginTop: 6 }}>{f.especialidade}</Txt>
          )}
          <Local f={f} />
        </View>

        <View style={{ paddingHorizontal: PAD }}>
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
          <View style={{ marginTop: 26 }}>
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

        {/* ---- sobre ----

            ⚠️ ELE DESCEU, e era a primeira coisa depois do nome. Seis
            linhas de texto corrido entre a identidade e o endereço
            empurravam para baixo da dobra justamente as duas perguntas que
            trazem alguém a esta tela: onde fica e se atende o meu
            convênio. Quem quer ler a apresentação rola; quem quer o
            endereço não deveria ter que rolar.

            ⚠️ E GANHOU TÍTULO POR CAUSA DA MUDANÇA. Um parágrafo sem
            cabeçalho funcionava colado no nome — era a continuação dele.
            Entre duas seções tituladas, ele passaria a ler como sobra. */}
        {!!f.sobre && (
          <View style={{ marginTop: 30 }}>
            <Txt v="h2">Sobre</Txt>
            <Txt v="body" c={c.tx2} style={{ marginTop: 12, lineHeight: 26 }}>{f.sobre}</Txt>
          </View>
        )}

        {/* ---- os canais da clínica ----

            ⚠️ APARECE NAS DUAS VERSÕES, e por um tempo só apareceu em uma.
            O raciocínio era que quem é paciente tem a conversa do
            aplicativo e não precisa do telefone — e isso confunde "o
            melhor canal para o tratamento" com "todos os canais". Remarcar
            uma consulta, avisar que está no estacionamento, perguntar se a
            recepção atende no feriado: nada disso é assunto de prontuário,
            e mandar para uma conversa clínica o que é da recepção atrapalha
            os dois lados.

            ⚠️ O QUE MUDA É O TÍTULO, E ELE RANQUEIA. Para quem é paciente
            estes são OUTROS canais — o primeiro é a conversa, que fica
            registrada e chega à equipe inteira. Para quem não é, são OS
            canais. Chamar de "Entre em contato" na tela de quem já tem
            conversa colocaria o telefone acima dela, e o telefone não
            guarda nada.

            ⚠️ E CADA LINHA SÓ EXISTE COM O DADO DELA. "Telefone —" numa
            lista de contatos é a tela prometendo um canal que não existe;
            a clínica que só tem WhatsApp mandou só o WhatsApp, e a seção
            inteira some quando ela não mandou nada.

            ⚠️ ESTA LISTA FICA SEPARADA DE "ONDE FICA" de propósito, mesmo
            as duas sendo o bloco prático da clínica. Lá são duas linhas de
            leitura; aqui são cinco portas que saem do aplicativo. Misturar
            o que se lê com o que se toca num cartão só é o defeito que
            saiu das prescrições em /medico. */}
        {!!contatos.length && (
          <View style={{ marginTop: 30 }}>
            <Txt v="h2">{vinculada ? 'Outros canais' : 'Entre em contato'}</Txt>
            <Txt v="caption" c={c.tx3} style={{ marginTop: 6, marginBottom: 12, lineHeight: 21 }}>
              {vinculada
                ? 'Para falar com a recepção. O que é do tratamento fica melhor na conversa do aplicativo, que chega à equipe inteira.'
                : 'Fale com a clínica para saber como começar o acompanhamento.'}
            </Txt>
            <Cartao>
              {contatos.map((ct) => (
                <Linha key={ct.titulo} ic={ct.ic} titulo={ct.titulo} sub={ct.sub} onPress={abrir(ct.url)} />
              ))}
            </Cartao>
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
                /* ⚠️ SEM VÍNCULO, A LINHA NÃO É BOTÃO — e não ganha seta.
                    É a mesma regra das prescrições em /medico: duas listas
                    quase idênticas, uma que abre e outra que não, só se
                    distinguem se a diferença estiver desenhada. A seta é a
                    diferença. */
                <Pressable
                  key={m.id}
                  onPress={vinculada ? go(`/especialista?id=${m.id}`) : undefined}
                  disabled={!vinculada}
                  style={({ pressed }) => [{ opacity: pressed && vinculada ? 0.6 : 1 }]}
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
                    {vinculada ? <Chevron /> : null}
                  </Row>
                </Pressable>
              ))}
            </Cartao>
          </View>
        ) : null}

        {/* ---- o vínculo ---- */}
        {vinculada && !!f.desde && (
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

        {/* ---- como funciona a parceria ----

            ⚠️ AQUI O DINHEIRO ENTRA, e na outra versão ele sai. Para quem
            já é paciente, falar de custo numa tela sobre quem cuida dela é
            ruído — /assinatura já diz. Para quem está olhando de fora, é a
            informação mais útil da tela: é a diferença entre "uma clínica"
            e "uma clínica que muda o que eu pago aqui". */}
        {!vinculada && (
          <View style={{ marginTop: 30, backgroundColor: c.bg1, borderRadius: radius.lg, padding: 18 }}>
            <Row gap={10} style={{ alignItems: 'flex-start' }}>
              <View style={{ marginTop: 2 }}>
                <Icon name="check" size={16} color={c.lime} sw={2.4} />
              </View>
              <Txt v="caption" c={c.tx3} style={{ flex: 1, lineHeight: 20 }}>
                Pacientes de clínicas parceiras não pagam pelo aplicativo. Ao iniciar tratamento
                aqui, a clínica passa um código e a sua assinatura deixa de ser cobrada.
              </Txt>
            </Row>
          </View>
        )}

        {/* ---- a conversa ----

            ⚠️ SÓ COM VÍNCULO, e não é uma restrição: é que ela não existe
            do outro lado. A conversa do aplicativo é melhor do que
            qualquer telefone — fica registrada, chega à equipe inteira e
            não depende de ninguém ter o número certo —, mas ela é entre
            uma clínica e SEUS pacientes. Oferecê-la a quem não é seria um
            botão que escreve para ninguém.

            Quem não tem vínculo tem os canais da clínica, logo acima, que
            é o que existe para quem ainda é de fora. */}
        {vinculada && (
          <Pressable onPress={go('/conversa')} style={({ pressed }) => [{ marginTop: 26, opacity: pressed ? 0.85 : 1 }]}>
            <Row gap={8} style={{ backgroundColor: c.accent, borderRadius: radius.pill, paddingVertical: 15, justifyContent: 'center' }}>
              <Icon name="companion" size={18} color={c.accentInk} sw={1.9} />
              <Txt v="body" c={c.accentInk}>Escrever para a equipe</Txt>
            </Row>
          </Pressable>
        )}
        </View>
        </View>
      </ScrollView>
    </View>
  );
}

/* ============================================================
   ONDE FICA — dentro do cabeçalho, e não numa seção própria

   ⚠️ ERA UMA SEÇÃO COM TÍTULO E CARTÃO BRANCO, e o cartão era o problema.
   Duas linhas de texto dentro de uma caixa com respiro de 20 pesam como
   um cartão de conteúdo e carregam o conteúdo de uma legenda — e ele
   ficava logo abaixo do cartão da identidade, que é branco, do mesmo
   tamanho e da mesma forma. Duas caixas iguais empilhadas com um título
   no meio, a segunda quase vazia.

   ⚠️ E A CIDADE JÁ ESTAVA NO CABEÇALHO, três linhas acima, com o mesmo
   pino. O endereço era a continuação dela separada por um título.

   Aqui os dois viram o que são: a parte de baixo da identidade. Quem é a
   clínica, e onde ela está — separados por um fio. Some um título, some
   uma caixa, e o dado mais consultado da tela passa a morar no lugar mais
   visível dela.

   ⚠️ O ENDEREÇO CONTINUA SEM ABRIR MAPA. Ele vem de semente, e um
   endereço clicável falso manda alguém até a porta de um estranho. A ação
   entra junto com o dado de verdade.

   ⚠️ E SEM ENDEREÇO NEM HORÁRIO ELE VOLTA A SER A LINHA DA CIDADE, sem
   fio e sem coluna de ícones: uma régua de alinhamento para um item só é
   desenho a mais para informação a menos.
   ============================================================ */
function Local({ f }: { f: FichaDaClinica }) {
  const { c } = useTheme();
  const detalhado = !!f.endereco || !!f.horario;

  if (!detalhado) {
    if (!f.cidade) return null;
    return (
      <Row gap={5} style={{ alignItems: 'center', marginTop: 3 }}>
        {/* O ícone `pin` entrou no jogo para isto. Estava aqui o `target`,
            que no resto do aplicativo é a mira das metas — dois
            significados para o mesmo desenho é o começo de nenhum. */}
        <Icon name="pin" size={13} color={c.tx4} sw={1.9} />
        <Txt v="caption" c={c.tx3}>{f.cidade}</Txt>
      </Row>
    );
  }

  return (
    <View style={{
      marginTop: 16, paddingTop: 16, gap: 12,
      borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: c.line,
    }}>
      {!!f.endereco && (
        <Row gap={11} style={{ alignItems: 'flex-start' }}>
          <View style={{ width: 18, alignItems: 'center', marginTop: 2 }}>
            <Icon name="pin" size={16} color={c.accent} sw={1.9} />
          </View>
          <View style={{ flex: 1 }}>
            <Txt v="caption" style={{ lineHeight: 22 }}>{f.endereco}</Txt>
            {!!f.cidade && <Txt v="caption" c={c.tx3}>{f.cidade}</Txt>}
          </View>
        </Row>
      )}
      {!!f.horario && (
        <Row gap={11} style={{ alignItems: 'center' }}>
          <View style={{ width: 18, alignItems: 'center' }}>
            <Icon name="clock" size={16} color={c.accent} sw={1.9} />
          </View>
          <Txt v="caption" style={{ flex: 1 }}>{f.horario}</Txt>
        </Row>
      )}
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
        contentPosition="center"
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
