import React from 'react';
import { View, Pressable } from 'react-native';
import { Image } from 'expo-image';
import * as ImagePicker from 'expo-image-picker';
import { ImageManipulator, SaveFormat } from 'expo-image-manipulator';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useStore } from '../logic/store';
import { RESTRICOES } from '../logic/restricoes';
import { kgCurto as kg, nf, relDay } from '../logic/time';
import {
  journeyDay, hasClinic, idadeDe, medComDose, ATIVIDADES, MOTIVOS, curWeight,
  lostKg,
} from '../logic/derive';
import { Screen, Txt, Row, SectionHead, CircleBtn, ListRow, Grupo } from '../ui/kit';
import { Segmentado } from '../ui/instrumentos';
import { Icon } from '../ui/Icon';

/* A MESMA FOTO DA ABA CUIDADO. Uma pessoa, um retrato: se o app tivesse
   duas imagens da mesma médica, elas divergiriam no dia em que uma fosse
   trocada. */
const FOTO_MEDICA = require('../../assets/images/especialista.png');
import { useTheme } from '../ui/useTheme';
import { radius, font } from '../theme';

/* ============================================================
   PERFIL — a ficha e os controles

   É a última área da árvore, e a mais fácil de fazer errado: tela de
   configuração vira, por inércia, uma pilha de linhas cinzas com
   chevron. Funciona e não diz nada — e num app de tratamento ela é onde
   moram os números que TODO o resto calcula.

   Por isso a tela tem duas naturezas e as separa de propósito:

   Em cima, a ficha. Altura, peso inicial, meta, medicamento e dose não
   são preferências: são os parâmetros do tratamento, e cada gráfico do
   app é uma conta feita em cima deles. Ganham forma de dado — valor
   grande, rótulo pequeno — porque é o que são.

   Embaixo, os controles. Aí sim linha com chevron, que é a gramática
   certa para navegação e a mesma do resto do app.

   O QUE ESTA TELA NÃO FAZ

   Não pinta. A malha escura é a voz da inteligência do Morphi — hero de
   Cuidado, card do Morphi em Insights — e usá-la aqui diluiria o
   significado dela em troca de bonito. O princípio 6 diz que atmosfera é
   evento; configuração não é evento. A malha clara aparece uma vez, atrás
   da identidade, no mesmo papel que tem no banner da especialista: fundo
   de retrato, não superfície de marca.
   ============================================================ */

/** Um número da ficha, em pastilha de cor.

    TRÊS CARTÕES EM LINHA, e a linha conta uma história: de onde saiu,
    onde está, aonde vai. Os três são pesos na mesma escala, e por isso
    têm o mesmo corpo: 82,4 → 75,1 → 68 só se compara se os três números
    tiverem o mesmo tamanho. O do meio não precisa ser maior para ser o
    assunto — ele é o único em lima cheia, e é o único que carrega
    quanto a pessoa andou.

    A COR SEGUE A MARCA, e a marca tem duas: o azul e o lima. O passado
    é o azul mais lavado, o hoje é o lima cheio, e o alvo é o azul
    cheio — a fileira termina na cor com que o app age.

    O ESPAÇO É SIMÉTRICO DE PROPÓSITO. O número usava o h1 do tema, que
    vem com entrelinha de 44: com a fonte reduzida para caber, sobrava
    meia linha de ar embaixo do número e a pastilha ficava pesada para
    baixo. Aqui a entrelinha acompanha o tamanho, e o que sobra acima e
    abaixo é o mesmo padding. */
function Dado({ valor, unidade, label, fundo, tinta, tintaRotulo, delta, largo }: {
  valor: string; unidade?: string; label: string;
  fundo: string; tinta: string; tintaRotulo: string; delta?: string; largo?: boolean;
}) {
  return (
    /* O DO MEIO É UM POUCO MAIS LARGO porque carrega uma coisa a mais: o
       rótulo dele divide a linha com o selo. Em três colunas iguais o
       selo não cabia com a unidade junto, e a saída seria encolher a
       letra do selo — largura é mais barata que legibilidade. */
    <View style={{ flex: largo ? 1.16 : 1, backgroundColor: fundo, borderRadius: radius.card, padding: 12, gap: 5 }}>
      {/* Uma linha só: três cartões de alturas diferentes numa fileira
          leem como desalinho, e não como rótulo comprido. A palavra
          "peso" saiu dos três — numa fileira de quilos, repeti-la três
          vezes gasta a largura que o rótulo precisa para crescer. */}
      <Row gap={5} style={{ alignItems: 'center' }}>
        <Txt v="micro" numberOfLines={1} c={tintaRotulo} style={{ fontFamily: font.bodyMed }}>{label}</Txt>
        {/* O QUANTO ANDOU, colado no rótulo do hoje. Era um cartão
            inteiro ("Já perdeu 7,3"), e um número de diferença no meio de
            uma fileira de pesos quebrava a comparação: o olho lia 82,4 →
            7,3 → 68. Como selo, ele diz a mesma coisa sem ocupar o lugar
            de um peso. */}
        {!!delta && (
          <View style={{ backgroundColor: 'rgba(10,10,10,0.10)', borderRadius: radius.pill, paddingHorizontal: 6, paddingVertical: 1 }}>
            <Txt v="micro" c={tinta} style={{ fontSize: 11, fontFamily: font.bodyMed }}>{delta}</Txt>
          </View>
        )}
      </Row>
      <Row gap={3} style={{ alignItems: 'baseline' }}>
        <Txt v="h1" c={tinta} style={{ fontSize: 24, lineHeight: 28 }}>{valor}</Txt>
        {!!unidade && <Txt v="micro" c={tintaRotulo} style={{ fontSize: 12 }}>{unidade}</Txt>}
      </Row>
    </View>
  );
}

export default function Perfil() {
  const S = useStore((s) => s.S);
  /* Contada do ano de nascimento, e não guardada: idade guardada
     envelhece errado — o perfil diria 38 anos para sempre. */
  const idade = idadeDe(S);
  const setTheme = useStore((s) => s.setTheme);
  const update = useStore((s) => s.update);
  /* Corrigir é reabrir a pergunta original, e não um segundo editor com
     uma segunda régua. Ver o modo de edição em src/app/cadastro.tsx. */
  /* O que ela já andou: começo menos hoje. Negativo quando o peso subiu,
     e aí o rótulo muda — "já perdeu −2,1 kg" seria o app corrigindo a
     pessoa com um sinal de menos. */
  const perdeu = lostKg(S);
  const corrige = (passo: string) => () => router.push(`/cadastro?editar=${passo}` as any);

  /* ONDE MORA O PESO INICIAL depende de quando a pessoa começou.

     O cadastro escreve `startWeight` de dois lugares: quem já estava em
     tratamento responde o peso daquela época na tela "Comecei em"; quem
     ainda vai começar não tem essa distinção, e o peso de hoje é também
     o de partida. O lápis daqui precisa abrir a MESMA tela que escreveu
     o número — mandar todo mundo para "medidas atuais" fazia o lápis
     prometer corrigir o peso inicial e entregar a régua do peso de
     hoje, que é outro número. */
  const emTratamento = (S.injections?.length ?? 0) > 0 || !!S.profile.startT;
  const passoDoPesoInicial = emTratamento ? 'inicio' : 'corpo';
  const atividade = ATIVIDADES.find((x) => x.id === (S.profile as any).atividade)?.titulo ?? 'Não informado';
  const motivo = MOTIVOS.find((x) => x.id === (S.profile as any).motivacao)?.titulo ?? 'Não informado';
  const restricoes = (((S.profile as any).restricoes ?? []) as string[])
    .map((x) => RESTRICOES.find((y) => y.id === x)?.titulo ?? x)
    .join(', ') || 'Nenhuma';
  const { c, isDark } = useTheme();
  const router = useRouter();
  const go = (p: string) => () => router.push(p as any);

  /* ---- a foto do perfil ----

     Guardada como data URI dentro do próprio estado, e não como caminho
     de arquivo: o caminho que a galeria devolve é de um arquivo
     temporário, e no dia seguinte ele pode não existir mais — o retrato
     viraria um quadrado vazio sem ninguém ter mexido em nada.

     E ela encolhe para 256 px antes de entrar. O estado inteiro é
     serializado e regravado a cada alteração, então tudo que mora nele é
     copiado o dia todo; uma foto crua de celular ali dentro é megabyte
     indo e voltando a cada toque. */
  const foto = (S.profile as any).foto as string | undefined;
  const [ocupado, setOcupado] = React.useState(false);

  const escolherFoto = async () => {
    if (ocupado) return;
    setOcupado(true);
    try {
      const r = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'], allowsEditing: true, aspect: [1, 1], quality: 0.9,
      });
      if (r.canceled || !r.assets?.[0]) return;
      const ctx = ImageManipulator.manipulate(r.assets[0].uri);
      ctx.resize({ width: 256 });
      const render = await ctx.renderAsync();
      const saida = await render.saveAsync({ format: SaveFormat.JPEG, compress: 0.8, base64: true });
      if (!saida.base64) return;
      update((st) => { (st.profile as any).foto = `data:image/jpeg;base64,${saida.base64}`; });
    } catch {
      /* Galeria negada ou imagem que não abre: o retrato continua sendo a
         inicial, que é um estado completo. Alerta aqui seria barulho em
         cima de uma coisa que a pessoa pode simplesmente tentar de novo. */
    } finally {
      setOcupado(false);
    }
  };

  const linked = hasClinic(S);
  /* A especialidade vem do perfil do profissional, e não de um texto
     fixo: no dia em que quem acompanha for nutricionista, o card diz
     nutricionista. Sem ela, a linha fica só com a clínica. */
  const especialidade = (S.profile as any).doctorInfo?.especialidade ?? 'Especialista';
  const dose = medComDose(S);

  return (
    <Screen>
      {/* ---- identidade ----

          SEM TÍTULO "PERFIL". O rótulo dizia à pessoa em que tela ela
          está, e logo abaixo dele havia um retrato com o nome dela: o
          nome é o título, e um título por cima do nome era a mesma
          informação duas vezes. Fica só a seta, que é o que a barra de
          cima precisa ter. */}
      <Row style={{ marginTop: 4 }} gap={12}>
        <CircleBtn name="back" onPress={() => router.back()} />
      </Row>

      <Row gap={14} style={{ marginTop: 18, alignItems: 'center' }}>
        {/* O RETRATO É UM BOTÃO, e o lápis no canto é o que diz isso.

            A inicial em degradê continua sendo o estado sem foto — não
            existe boneco genérico aqui, que ocupa o lugar da pessoa com
            uma que não é ela. Mas agora ela é o convite: um toque abre a
            galeria, a foto escolhida entra recortada em quadrado e passa
            a ser o retrato. Tocar de novo troca.

            A FOTO ENCOLHE ANTES DE SER GUARDADA. O estado inteiro vira
            uma string no armazenamento a cada alteração, e uma foto de
            celular crua ali dentro é megabyte copiado a cada toque no
            app. 256 px é mais do que um círculo de 72 precisa. */}
        <Pressable onPress={escolherFoto} disabled={ocupado}>
          <View style={{
            width: 72, height: 72, borderRadius: 36, overflow: 'hidden',
            backgroundColor: c.bg2, alignItems: 'center', justifyContent: 'center',
          }}>
            {foto ? (
              <Image source={{ uri: foto }} style={{ width: 72, height: 72 }} contentFit="cover" />
            ) : (
              <LinearGradient
                colors={[c.accent, c.accent2]}
                start={{ x: 0.1, y: 0 }} end={{ x: 0.9, y: 1 }}
                style={{ width: 72, height: 72, alignItems: 'center', justifyContent: 'center' }}
              >
                <Txt v="h1" c={c.accentInk} style={{ fontSize: 28 }}>{S.profile.name[0]}</Txt>
              </LinearGradient>
            )}
          </View>
          {/* O selo do lápis encosta na borda do círculo e usa o fundo da
              tela como anel: sem esse anel ele vira uma mancha grudada no
              retrato, e não um botão sobre ele. */}
          <View style={{
            position: 'absolute', right: -2, bottom: -2,
            width: 26, height: 26, borderRadius: 13,
            backgroundColor: c.bg1, borderWidth: 2, borderColor: c.bg,
            alignItems: 'center', justifyContent: 'center',
          }}>
            <Icon name="pencil" size={12} color={c.tx2} sw={2} />
          </View>
        </Pressable>

        <View style={{ flex: 1, gap: 5 }}>
          <Txt v="h2">{S.profile.name}</Txt>
          {/* NO LUGAR DA CIDADE, O TRATAMENTO — é a única coisa que esta
              pessoa tem e um perfil comum não tem. E ele cabe em duas
              tags na mesma linha: o que ela toma e há quantos dias.

              O DIA DEIXOU DE SER FRASE. "Dia 71 da sua jornada" era uma
              linha corrida de texto cinza embaixo do nome, no lugar onde
              um perfil comum põe a cidade — ocupava largura inteira para
              dizer um número. Como tag ao lado do medicamento, é o mesmo
              fato lido de relance, e a cabeça da tela perde uma linha.

              O MEDICAMENTO VIRA TAG, e deixa de ser card. Como card ele
              tinha o peso de uma seção inteira para dizer um nome e uma
              dose, e ficava entre o retrato e a primeira lista, cortando
              a cabeça da tela em duas. O toque continua indo para as
              aplicações, que é onde ele tem conteúdo próprio. O que ficou
              para trás foi "3 de 4 doses na caneta", que já vive na
              Jornada e no Cuidado — tag não é lugar de estoque. */}
          <Row gap={6} style={{ flexWrap: 'wrap' }}>
            <Pressable onPress={go('/aplicacoes')} style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1 }]}>
              <Row gap={6} style={{
                backgroundColor: c.accentWeak, borderRadius: radius.pill,
                paddingLeft: 9, paddingRight: 11, paddingVertical: 6, alignItems: 'center',
              }}>
                <Icon name="syringe" size={13} color={c.accent} sw={2} />
                <Txt v="micro" c={c.accent} style={{ fontFamily: font.bodyMed }}>{dose}</Txt>
              </Row>
            </Pressable>
            <Row gap={5} style={{
              backgroundColor: c.bg2, borderRadius: radius.pill,
              paddingLeft: 9, paddingRight: 11, paddingVertical: 6, alignItems: 'center',
            }}>
              <Icon name="spark" size={12} color={c.tx2} sw={2} />
              <Txt v="micro" c={c.tx2} style={{ fontFamily: font.bodyMed }}>Dia {journeyDay(S)}</Txt>
            </Row>
          </Row>
        </View>
      </Row>

      {/* A FICHA: de onde saiu, quanto andou, aonde vai.

          TRÊS PASTILHAS CHEIAS, encostadas no retrato, na fileira que a
          referência usa para peso, meta e caloria. A cor não é decoração,
          e nenhuma nova entrou: o cinza é o passado, que não é conquista
          nem alvo; o lima é o alcançado, a mesma regra da Jornada e das
          metas; o azul é para onde o app aponta.

          O do meio é o assunto — é a única coisa desta tela que a pessoa
          não escolheu, ela conquistou —, e por isso tem o corpo maior.

          O LÁPIS SAIU DAS PASTILHAS. Ele prometia edição num lugar que é
          de leitura: três números para bater o olho, com um alvo de toque
          de doze pixels no canto de cada um. Peso inicial e meta entraram
          na lista de respostas logo abaixo, que é onde todo o resto do
          que o cadastro perguntou já se corrige — um caminho só para
          mudar coisa, e não um por cartão. */}
      <Row gap={8} style={{ marginTop: 20 }}>
        <Dado
          label="Inicial" valor={kg(S.profile.startWeight)} unidade="kg"
          fundo={c.bluePale} tinta={c.tx} tintaRotulo={c.tx2}
        />
        {/* O DO MEIO PASSOU A SER O PESO DE HOJE, e não o quanto já foi
            perdido. Os três são pesos na mesma escala, e a diferença
            entrava no lugar de um deles: a fileira dizia 82,4 → 7,3 → 68,
            três números que não se comparam. Agora ela diz onde a pessoa
            começou, onde está e aonde vai, e o quanto andou vem no selo.

            O SINAL SEGUE O QUE ACONTECEU. Subiu, o selo mostra "+2,1" —
            o app não tem por que esconder, e "já perdeu −2,1" seria ele
            corrigindo a pessoa com um sinal de menos. */}
        <Dado
          label="Atual" valor={kg(curWeight(S))} unidade="kg"
          delta={`${perdeu >= 0 ? '−' : '+'}${kg(Math.abs(perdeu))} kg`}
          fundo={c.lime} tinta={c.limeInk} tintaRotulo="rgba(10,10,10,0.62)" largo
        />
        <Dado
          label="Meta" valor={kg(S.profile.goalWeight)} unidade="kg"
          fundo={c.accent} tinta={c.accentInk}
          tintaRotulo={isDark ? 'rgba(4,16,43,0.70)' : 'rgba(255,255,255,0.80)'}
        />
      </Row>

      {/* ---- quem te acompanha ----

          CLÍNICA OU ESPECIALISTA? O especialista.

          A seção se chamava "Sua clínica" e mostrava o nome da clínica em
          cima, com o nome da médica na legenda. Mas o vínculo que esta
          pessoa tem não é com uma razão social: é com quem responde a
          mensagem dela, quem ajusta a dose, quem marca a consulta. A tela
          do outro lado se chama "Meu médico", e a aba Cuidado apresenta
          "Sua especialista" com foto e nome. Este card era o único lugar
          do app que invertia a ordem.

          A clínica não some — ela é o contexto, e vai na mesma linha da
          especialidade: onde a pessoa atende, ao lado do que ela faz.

          E O CARD PASSOU A DIZER O QUE TEM LÁ DENTRO. Antes, "mensagens,
          consultas e equipe" era o índice de um menu — três substantivos
          sem número, que não mudam nunca. A faixa de baixo traz os dois
          fatos com prazo: quando é a próxima consulta e se há recado sem
          ler. É o que faz alguém tocar, e é a diferença entre um atalho e
          um card que sabe de alguma coisa. */}
      <View style={{ marginTop: 32 }}>
        <SectionHead title="Quem te acompanha" />
        <Pressable onPress={linked ? go('/medico') : undefined} style={({ pressed }) => [{ marginTop: 14, opacity: pressed && linked ? 0.7 : 1 }]}>
          <View style={{ backgroundColor: linked ? c.bg1 : c.accentWeak, borderRadius: radius.lg, overflow: 'hidden' }}>
            <Row gap={14} style={{ padding: 16 }}>
              {/* O RETRATO DELA, e não um ícone de estetoscópio. A foto já
                  existe e já é usada na Home e na aba Cuidado.

                  QUADRADO DE CANTO MACIO, E NÃO CÍRCULO: é a moldura que a
                  Home já dá a esta mesma foto. Duas formas para o mesmo
                  retrato em duas telas é o tipo de diferença que ninguém
                  descreve e todo mundo sente. O recorte também é o mesmo —
                  cobrir pelo topo, que é onde fica o rosto num busto.

                  O fundo tingido existe porque a imagem é PNG transparente:
                  sem ele o recorte flutuaria sobre o branco do card. */}
              <View style={{
                width: 56, height: 56, borderRadius: radius.md, overflow: 'hidden',
                backgroundColor: c.accentWeak,
                alignItems: 'center', justifyContent: 'center',
              }}>
                {linked ? (
                  <Image
                    source={FOTO_MEDICA}
                    style={{ width: '100%', height: '100%' }}
                    contentFit="cover"
                    contentPosition="top center"
                  />
                ) : (
                  <Icon name="steth" size={22} color={c.accent} sw={1.8} />
                )}
              </View>
              <View style={{ flex: 1 }}>
                <Txt v="bodyMed">{linked ? S.profile.doctor : 'Conectar a um especialista'}</Txt>
                <Txt v="micro" c={c.tx3} style={{ marginTop: 3, lineHeight: 17 }}>
                  {linked
                    ? `${especialidade} · ${S.profile.clinic}`
                    : 'Opcional — o app funciona completo sem vínculo.'}
                </Txt>
              </View>
              {linked && <Icon name="chev" size={14} color={c.tx4} sw={2} />}
            </Row>

            {linked && (
              <>
                <View style={{ height: 1, backgroundColor: c.line }} />
                <Row gap={16} style={{ paddingHorizontal: 16, paddingVertical: 12 }}>
                  <Row gap={7} style={{ alignItems: 'center' }}>
                    <Icon name="cal" size={14} color={c.tx3} sw={1.9} />
                    <Txt v="micro" c={c.tx2}>Consulta {relDay(new Date(S.consult.t))}</Txt>
                  </Row>
                  {/* O recado sem ler só aparece quando existe: "0 não
                      lidas" é o app puxando assunto sobre nada. */}
                  {S.unread > 0 && (
                    <Row gap={7} style={{ alignItems: 'center' }}>
                      <View style={{ width: 7, height: 7, borderRadius: 4, backgroundColor: c.bad }} />
                      <Txt v="micro" c={c.tx2}>
                        {S.unread} {S.unread === 1 ? 'não lida' : 'não lidas'}
                      </Txt>
                    </Row>
                  )}
                </Row>
              </>
            )}
          </View>
        </Pressable>
      </View>

      <Grupo title="Acompanhamento">
        <ListRow ic="target" title="Metas diárias"
          sub={`${S.profile.targets.prot} g de proteína · ${nf(S.profile.targets.waterMl / 1000, 1).replace('.', ',')} L de água`}
          onPress={go('/metas')} />
        <ListRow ic="clock" title="Lembretes"
          sub="Dose, pesagem, água e proteína" onPress={go('/lembretes')} />
        <ListRow ic="bell" title="Notificações" dot={S.notifications.length > 0}
          sub={`${S.notifications.length} ${S.notifications.length === 1 ? 'aviso recente' : 'avisos recentes'}`}
          onPress={go('/notificacoes')} />
        <ListRow ic="trend" title="Dispositivos e integrações"
          sub="Apple Health, Withings e mais" onPress={go('/integracoes')} />
      </Grupo>

      {/* ---- sobre você ----

          O GRUPO DEIXOU DE SER "SEUS REGISTROS" porque passou a guardar
          mais do que registro: a ficha entrou aqui, e ficha não é registro
          — é quem a pessoa é. O que os quatro têm em comum é o assunto,
          e o assunto é ela. Acompanhamento é como o app ajuda; O
          aplicativo é como o app se comporta; aqui é o paciente.

          A PORTA DA FICHA ESTAVA LOGO ABAIXO DO RETRATO, sozinha, antes
          de qualquer seção. Ali ela tinha o destaque de uma coisa que se
          faz todo dia, e ninguém edita altura todo dia. Ela desceu para a
          lista, junto do resto que fala da pessoa.

          E NÃO SE CHAMA MAIS "RESPOSTAS DO CADASTRO": metade do que está
          lá dentro pode já ter sido corrigido depois, e chamar de
          resposta o que a pessoa mudou ontem é o app se lembrando de uma
          conversa que ela já refez. */}
      <Grupo title="Sobre você">
        <ListRow ic="user" title="Seus dados"
          sub="Altura, peso, ritmo e mais" onPress={go('/dados')} />
        {/* O NOME DO LINK É O NOME DO DESTINO. Esta linha se chamava
            "Histórico completo" e abria uma tela chamada "Seu tratamento";
            a Jornada, que leva ao mesmo lugar, já chamava de "Seu
            tratamento". Dois nomes para uma porta fazem a pessoa achar que
            chegou noutro lugar — e o nome certo é o da tela, porque ali não
            há log de auditoria: há o tratamento contado por semana. */}
        <ListRow ic="ruler" title="Seu tratamento"
          sub="Tudo o que você registrou, semana a semana" onPress={go('/historico')} />
        <ListRow ic="trophy" title="Conquistas"
          sub="O que você já alcançou no tratamento" onPress={go('/conquistas')} />
        <ListRow ic="doc" title="Resumo para o médico"
          sub="Documento com a evolução completa" onPress={go('/resumo-medico')} />
      </Grupo>

      {/* ---- o aplicativo ----

          É a seção de como o app se comporta, e não do que ele sabe. As
          outras duas dividem o resto: Acompanhamento é como ele ajuda,
          Sobre você é o paciente.

          SAIU DAQUI "SEUS DADOS FICAM NO SEU APARELHO". A frase era
          verdadeira e ainda assim dizia a coisa errada: prometia
          isolamento num app cujo ponto é o contrário — a pessoa tem uma
          equipe do outro lado, e o valor de registrar sintoma é
          justamente que ele chegue a quem acompanha quando precisar de
          atenção. Vender enclausuramento como vantagem competiria com o
          que o app tem de melhor. Quando houver a política de verdade,
          ela entra como documento, e não como consolo numa linha de
          lista.

          O TEMA NÃO É UMA SEÇÃO. Ele é uma preferência, e preferência
          mora onde moram as preferências. O que ele mantém é o desenho:
          segmentado, e não linha que alterna ao toque — a linha escondia
          o estado atrás da ação, e para saber em que tema se estava era
          preciso ler o subtítulo.

          E A VERSÃO SAIU DA LISTA. "Morphi · versão 1.0.0" ocupava uma
          linha inteira, com ícone e tudo, ao lado de coisas que se toca:
          parecia um item e não era, e o dedo passava por ele toda vez.
          Número de versão é rodapé — serve para citar num suporte, e não
          para escolher nada. Foi para o fim da tela, em letra pequena. */}
      <Grupo title="O aplicativo">
        <Row gap={12}>
          <View style={{ width: 32, alignItems: 'center', justifyContent: 'center' }}>
            <Icon name={isDark ? 'moonToggle' : 'sun'} size={20} color={c.tx2} sw={1.8} />
          </View>
          <Txt v="body" style={{ flex: 1 }}>Tema</Txt>
          <Segmentado
            opcoes={['Claro', 'Escuro']}
            valor={isDark ? 'Escuro' : 'Claro'}
            onChange={(v) => setTheme(v === 'Escuro' ? 'dark' : 'light')}
          />
        </Row>

      </Grupo>

      {/* SAIR VIROU BOTÃO. Era texto cinza solto no fim do rolo, do
          tamanho de uma legenda e sem nada em volta — a única ação
          irreversível-ish da tela parecia um rodapé, e um toque errado
          nela devolve a pessoa ao formulário.

          CONTINUA SEM VERMELHO. O card vermelho dava a "sair" o peso de
          um alerta clínico, que é o que a cor de erro precisa continuar
          significando neste app — sintoma grave, exame fora da faixa.
          Sair é reversível: você entra de novo. O que ele ganhou foi
          corpo e contorno: superfície de card, fio de um pixel e alvo de
          toque de largura inteira.

          E LEVA A ALGUM LUGAR: destranca a porta de entrada —
          onboardDone volta a ser falso — e devolve a pessoa à abertura
          do cadastro, que é onde o app começa.

          O QUE FOI REGISTRADO FICA. Não há conta nem servidor aqui: sair
          é voltar para a porta, e não apagar a vida de alguém do
          aparelho. Quem entrar de novo refaz o cadastro por cima do que
          já existe — e apagar o histórico de tratamento de alguém por
          causa de um toque num botão cinza seria o tipo de dano que não
          se desfaz. */}
      <Pressable
        onPress={() => {
          update((s: any) => { s.onboardDone = false; });
          router.replace('/cadastro' as any);
        }}
        style={({ pressed }) => [{ marginTop: 32, opacity: pressed ? 0.75 : 1 }]}
      >
        <Row gap={9} style={{
          justifyContent: 'center', backgroundColor: c.bg1,
          borderWidth: 1, borderColor: c.line, borderRadius: radius.pill,
          paddingVertical: 15,
        }}>
          <Icon name="logout" size={18} color={c.tx2} sw={1.9} />
          <Txt v="bodyMed" c={c.tx2}>Sair da conta</Txt>
        </Row>
      </Pressable>

      {/* A VERSÃO COMO RODAPÉ. Ela existe para ser citada num suporte, e
          não para escolher nada: fora da lista, em letra pequena e no fim
          de tudo, ela para de se parecer com um item tocável. */}
      <Txt v="micro" c={c.tx4} style={{ marginTop: 22, textAlign: 'center' }}>
        Morphi · versão 1.0.0
      </Txt>
    </Screen>
  );
}