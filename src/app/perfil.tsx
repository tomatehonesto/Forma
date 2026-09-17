import React from 'react';
import { View, Pressable } from 'react-native';
import { Image } from 'expo-image';
import * as ImagePicker from 'expo-image-picker';
import { ImageManipulator, SaveFormat } from 'expo-image-manipulator';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useStore } from '../logic/store';
import { RESTRICOES } from '../logic/restricoes';
import { MO_LONG, nf } from '../logic/time';
import {
  journeyDay, hasClinic, idadeDe, medComDose, ATIVIDADES, MOTIVOS,
  lostKg,
} from '../logic/derive';
import { Screen, Txt, Row, SectionHead, CircleBtn, ListRow } from '../ui/kit';
import { Segmentado } from '../ui/instrumentos';
import { Icon } from '../ui/Icon';
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

/* casa decimal só quando existe: "68,0 kg" para uma meta redonda finge
   uma precisão que a pessoa não definiu, e num par lado a lado com
   "82,4 kg" a simetria dos dois faz o zero parecer medido */
const kg = (n: number) => nf(n, n % 1 ? 1 : 0).replace('.', ',');

/* O que cada resposta do cadastro vira em texto de ficha. Mora aqui, e
   não solto no meio da tela, porque são seis traduções do mesmo tipo —
   um código guardado virando a palavra que a pessoa escolheu. */
const SEXO: Record<string, string> = {
  f: 'Feminino', m: 'Masculino', o: 'Outro', n: 'Prefiro não informar',
};

const dataDoPerfil = (t: number) => {
  const d = new Date(t);
  return `${d.getDate()} de ${MO_LONG[d.getMonth()]} de ${d.getFullYear()}`;
};

/** Um número da ficha, em pastilha de cor.

    TRÊS CARTÕES EM LINHA, e a linha conta uma história: de onde saiu,
    quanto andou, aonde vai. O do meio é o único que a pessoa não
    escolheu — ela conquistou —, e por isso leva a cor de feito e o corpo
    maior; os das pontas são os números que ela definiu.

    O LÁPIS DIZ O QUE DÁ PARA MUDAR. Sem ele, os três cartões pareciam a
    mesma coisa e dois deles guardavam um toque que ninguém tinha motivo
    para tentar. Ele é pequeno e no canto: a informação é "isto é seu para
    mexer", não "aperte aqui".

    A COR NÃO É DECORAÇÃO, é a que o app já deu a cada coisa: o lima é o
    alcançado, na Jornada e aqui. Nenhuma cor nova entrou para esta tela
    ficar bonita.

    Valor e unidade como dois elementos (princípio 9): a fileira alinha
    pela base do valor e o olho compara antes de ler. */
function Dado({ valor, unidade, label, fundo, destaque }: {
  valor: string; unidade?: string; label: string; fundo: string; destaque?: boolean;
}) {
  const { c } = useTheme();
  const corpo = (
    <View style={{ flex: 1, backgroundColor: fundo, borderRadius: radius.card, padding: 12, gap: 4 }}>
      {/* Uma linha só: três cartões de alturas diferentes numa fileira
          leem como desalinho, e não como rótulo comprido.

          O RÓTULO PESA MENOS E O NÚMERO PESA MAIS. Antes os dois eram o
          mesmo cinza claro, um pequeno e outro grande, e a pastilha lia
          como um bloco de texto uniforme. Agora o rótulo é médio em tinta
          de apoio e o número é display grande em tinta cheia: a distância
          entre eles é o que faz o olho cair no número primeiro. */}
      <Txt v="micro" c={c.tx2} numberOfLines={1} style={{ fontSize: 11, fontFamily: font.bodyMed }}>{label}</Txt>
      <Row gap={3} style={{ alignItems: 'baseline' }}>
        <Txt v="h1" c={c.tx} style={{ fontSize: destaque ? 28 : 23 }}>{valor}</Txt>
        {!!unidade && <Txt v="micro" c={c.tx3} style={{ fontSize: 12 }}>{unidade}</Txt>}
      </Row>
    </View>
  );
  return corpo;
}

/** Grupo de linhas dentro de um card, com fio entre elas.

    OS FIOS SANGRAM ATÉ A BORDA DIREITA, e começam alinhados com o texto.
    Antes o card tinha padding de 16 e o fio vivia dentro dele, recuado
    dos dois lados: a lista virava uma pilha de blocos separados por
    traços flutuantes, e o toque só valia em cima da linha, não na faixa
    inteira. É o mesmo desenho do Cartao das internas, que é o vocabulário
    de lista mais novo do app — e ter dois jeitos de desenhar a mesma coisa
    em telas vizinhas é o que faz um app parecer montado por duas pessoas
    que não se falaram. */
function Grupo({ title, children }: { title: string; children: React.ReactNode }) {
  const { c } = useTheme();
  const linhas = React.Children.toArray(children).filter(Boolean);
  return (
    <View style={{ marginTop: 32 }}>
      <SectionHead title={title} />
      <View style={{
        backgroundColor: c.bg1, borderRadius: radius.lg, marginTop: 14, overflow: 'hidden',
      }}>
        {linhas.map((l, i) => (
          <React.Fragment key={i}>
            {i > 0 && <View style={{ height: 1, backgroundColor: c.line, marginLeft: 16 }} />}
            <View style={{ paddingHorizontal: 16, paddingVertical: 14 }}>{l}</View>
          </React.Fragment>
        ))}
      </View>
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
              pessoa tem e um perfil comum não tem.

              E É UM FATO SÓ: o dia da jornada já é a data de início
              contada de outro jeito, então "por aqui desde julho de 2026"
              saiu daqui. */}
          <Txt v="micro" c={c.tx3} numberOfLines={1}>Dia {journeyDay(S)} da sua jornada</Txt>

          {/* O MEDICAMENTO VIRA TAG, e deixa de ser card.

              Como card ele tinha o peso de uma seção inteira para dizer
              um nome e uma dose — e ficava entre o retrato e a primeira
              lista, cortando a cabeça da tela em duas. Encostado no nome,
              ele lê pelo que é: o rótulo do tratamento desta pessoa.

              O toque continua indo para as aplicações, que é onde ele tem
              conteúdo próprio. O que ficou para trás foi "3 de 4 doses na
              caneta", que já vive na Jornada e no Cuidado — e uma tag não
              é lugar de estoque. */}
          <Pressable onPress={go('/aplicacoes')} style={({ pressed }) => [{ alignSelf: 'flex-start', opacity: pressed ? 0.7 : 1 }]}>
            <Row gap={6} style={{
              backgroundColor: c.accentWeak, borderRadius: radius.pill,
              paddingLeft: 9, paddingRight: 11, paddingVertical: 6, alignItems: 'center',
            }}>
              <Icon name="syringe" size={13} color={c.accent} sw={2} />
              <Txt v="micro" c={c.accent} style={{ fontFamily: font.bodyMed }}>{dose}</Txt>
            </Row>
          </Pressable>
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
        <Dado valor={kg(S.profile.startWeight)} unidade="kg" label="Peso inicial" fundo={c.bg3} />
        <Dado
          valor={kg(Math.abs(perdeu))} unidade="kg"
          label={perdeu >= 0 ? 'Já perdeu' : 'Ganhou'}
          fundo={c.limeSoft} destaque
        />
        <Dado valor={kg(S.profile.goalWeight)} unidade="kg" label="Meta" fundo={c.bluePale} />
      </Row>

      {/* ---- as respostas ----

          O resto do que o cadastro perguntou. Não são números de tela —
          são as premissas das contas: a idade e o sexo entram na equação
          de energia, o nível de atividade multiplica o gasto, a restrição
          filtra o que o app sugere, e o motivo é o que a pessoa disse que
          a trouxe. Todos mudam com a vida, e nenhum tinha porta. */}
      <Grupo title="Suas respostas">
        <ListRow ic="ruler" title="Altura" sub={`${nf(S.profile.height, 2).replace('.', ',')} m`} onPress={corrige('corpo')} />
        {/* AS DUAS PONTAS DA FICHA, aqui e não em cima. As pastilhas do
            cabeçalho são para bater o olho; mudar número é coisa de
            lista, no mesmo lugar onde altura, ritmo e nascimento já se
            corrigem. O peso inicial abre a tela que o escreveu, que não é
            sempre a mesma: quem já estava em tratamento respondeu o peso
            daquela época em "Comecei em"; quem ia começar não tem essa
            distinção, e o peso de hoje é também o de partida. */}
        <ListRow ic="scale" title="Peso inicial" sub={`${kg(S.profile.startWeight)} kg`} onPress={corrige(passoDoPesoInicial)} />
        <ListRow ic="target" title="Meta de peso" sub={`${kg(S.profile.goalWeight)} kg`} onPress={corrige('meta')} />
        <ListRow
          ic="trend" title="Ritmo escolhido"
          sub={S.profile.ritmo ? `${nf(S.profile.ritmo, 1).replace('.', ',')} kg por semana` : 'Sem peso a perder'}
          onPress={corrige('ritmo')}
        />
        <ListRow ic="user" title="Nome" sub={S.profile.name} onPress={corrige('nome')} />
        <ListRow ic="heart" title="Sexo" sub={SEXO[S.profile.identidade as string] ?? 'Não informado'} onPress={corrige('identidade')} />
        <ListRow
          ic="cal" title="Nascimento"
          sub={S.profile.nascimento
            ? `${dataDoPerfil(S.profile.nascimento)}${idade != null ? ` · ${idade} anos` : ''}`
            : 'Não informado'}
          onPress={corrige('nascimento')}
        />
        <ListRow ic="dumbbell" title="Atividade física" sub={atividade} onPress={corrige('atividade')} />
        <ListRow ic="leaf" title="Restrições alimentares" sub={restricoes} onPress={go('/restricao')} />
        <ListRow ic="bolt" title="O que te trouxe" sub={motivo} onPress={corrige('motivacao')} />
      </Grupo>

      {/* ---- clínica ----
          Ganha camada própria só quando há vínculo. Sem ele, o card é
          convite e não item de configuração — por isso o texto explica o
          que muda em vez de nomear uma tela. */}
      <View style={{ marginTop: 32 }}>
        <SectionHead title="Sua clínica" />
        <Pressable onPress={linked ? go('/medico') : undefined} style={({ pressed }) => [{ marginTop: 14, opacity: pressed && linked ? 0.7 : 1 }]}>
          <Row gap={14} style={{ backgroundColor: linked ? c.bg1 : c.accentWeak, borderRadius: radius.lg, padding: 18 }}>
            <View style={{ width: 42, height: 42, borderRadius: 21, backgroundColor: linked ? c.bg2 : c.bg1, alignItems: 'center', justifyContent: 'center' }}>
              <Icon name="steth" size={19} color={linked ? c.tx2 : c.accent} sw={1.8} />
            </View>
            <View style={{ flex: 1 }}>
              <Txt v="bodyMed">{linked ? S.profile.clinic : 'Conectar a uma clínica'}</Txt>
              <Txt v="micro" c={c.tx3} style={{ marginTop: 3, lineHeight: 17 }}>
                {linked
                  ? `${S.profile.doctor} · mensagens, consultas e equipe`
                  : 'Opcional — o app funciona completo sem vínculo.'}
              </Txt>
            </View>
            {linked && <Icon name="chev" size={14} color={c.tx4} sw={2} />}
          </Row>
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

      <Grupo title="Seus registros">
        <ListRow ic="ruler" title="Histórico completo"
          sub="Tudo o que você registrou, dia a dia" onPress={go('/historico')} />
        <ListRow ic="trophy" title="Conquistas"
          sub="O que você já alcançou no tratamento" onPress={go('/conquistas')} />
        <ListRow ic="doc" title="Resumo para o médico"
          sub="Documento com a evolução completa" onPress={go('/resumo-medico')} />
      </Grupo>

      {/* ---- o aplicativo ----

          Aqui estavam três seções: "Aparência" com uma linha, "Privacidade"
          com duas, e a versão pendurada no fim de uma delas. Três títulos
          para três coisas que respondem à mesma pergunta — o que este app
          faz com o que é meu, e como ele se comporta — numa tela que já
          tinha sete seções e virou um rolo depois que a ficha cresceu.

          O TEMA NÃO É UMA SEÇÃO. Ele é uma preferência, e preferência mora
          onde moram as preferências. O que ele mantém é o desenho:
          segmentado, e não linha que alterna ao toque — a linha escondia o
          estado atrás da ação, e para saber em que tema se estava era
          preciso ler o subtítulo.

          A PRIVACIDADE NÃO NAVEGA, e é decisão e não pendência: o que ela
          tem a dizer cabe na própria linha. Chevron que não leva a lugar
          nenhum é a pior linha de uma lista — promete conteúdo e cobra um
          toque para revelar que não há. O texto é literal e verificável:
          não existe backend, então os dados estão de fato só no aparelho.
          No dia em que houver sincronização, esta frase muda antes do
          código. */}
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

        <Row gap={12} style={{ alignItems: 'flex-start' }}>
          <View style={{ width: 32, alignItems: 'center', justifyContent: 'center', paddingTop: 1 }}>
            <Icon name="lock" size={20} color={c.tx2} sw={1.8} />
          </View>
          <View style={{ flex: 1 }}>
            <Txt v="body">Seus dados ficam no seu aparelho</Txt>
            <Txt v="caption" c={c.tx3} style={{ marginTop: 3, lineHeight: 19 }}>
              Peso, sintomas, aplicações e fotos não saem daqui. Nada é enviado
              para a clínica sem você tocar em enviar.
            </Txt>
          </View>
        </Row>

        <Row gap={12}>
          <View style={{ width: 32, alignItems: 'center', justifyContent: 'center' }}>
            <Icon name="info" size={20} color={c.tx2} sw={1.8} />
          </View>
          <Txt v="body" style={{ flex: 1 }}>Morphi</Txt>
          <Txt v="caption" c={c.tx3}>versão 1.0.0</Txt>
        </Row>
      </Grupo>

      {/* Sair em texto e não em card tingido de vermelho. O card vermelho
          dava a "sair da conta" o peso visual de um alerta clínico, que é o
          que a cor de erro precisa continuar significando neste app —
          sintoma grave, exame fora da faixa. Sair é reversível: você
          entra de novo.

          E AGORA ELE LEVA A ALGUM LUGAR. O botão era decorativo: tocava e
          nada acontecia. Sair destranca a porta de entrada — `onboardDone`
          volta a ser falso — e devolve a pessoa à abertura do cadastro,
          que é onde o app começa.

          O QUE FOI REGISTRADO FICA. Não há conta nem servidor aqui: sair é
          voltar para a porta, e não apagar a vida de alguém do aparelho.
          Quem entrar de novo refaz o cadastro por cima do que já existe —
          e apagar o histórico de tratamento de alguém por causa de um
          toque num botão cinza seria o tipo de dano que não se desfaz. */}
      <Pressable
        onPress={() => {
          update((s: any) => { s.onboardDone = false; });
          router.replace('/cadastro' as any);
        }}
        style={({ pressed }) => [{ marginTop: 32, alignSelf: 'center', opacity: pressed ? 0.6 : 1 }]}
      >
        <Row gap={9}>
          <Icon name="logout" size={17} color={c.tx3} sw={1.9} />
          <Txt v="bodyMed" c={c.tx3}>Sair da conta</Txt>
        </Row>
      </Pressable>
    </Screen>
  );
}
