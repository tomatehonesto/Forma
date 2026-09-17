import React from 'react';
import { View, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useStore } from '../logic/store';
import { RESTRICOES } from '../logic/restricoes';
import { MO_LONG, milhar, nf } from '../logic/time';
import {
  journeyDay, hasClinic, penStock, M, idadeDe, cadenciaCurta, medComDose, ATIVIDADES, MOTIVOS,
  metasDoDia,
} from '../logic/derive';
import { Screen, Txt, Row, SectionHead, CircleBtn, ListRow } from '../ui/kit';
import { Malha, Segmentado } from '../ui/instrumentos';
import { Icon } from '../ui/Icon';
import { useTheme } from '../ui/useTheme';
import { radius } from '../theme';

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

    TRÊS CARTÕES COLORIDOS EM LINHA, e não quatro brancos em grade. Em
    branco eles eram do mesmo material do resto da tela e se perdiam
    entre as listas; a cor os separa como o que são — os números que o
    tratamento inteiro usa —, e a fileira única cabe numa olhada.

    A COR NÃO É DECORAÇÃO, é a do significado que o app já deu a cada um:
    o peso inicial é passado e fica neutro; a meta é alvo e usa o lima,
    que é a cor do alcançado na Jornada; a energia do dia é meta ativa e
    usa o azul, que é a cor de ação em todas as telas. Nenhuma cor nova
    entrou para esta tela ficar bonita.

    Valor e unidade como dois elementos (princípio 9): a fileira alinha
    pela base do valor e o olho compara antes de ler. */
function Dado({ valor, unidade, label, fundo, tinta, onPress }: {
  valor: string; unidade?: string; label: string;
  fundo: string; tinta: string; onPress?: () => void;
}) {
  const { c } = useTheme();
  const corpo = (
    <View style={{ flex: 1, backgroundColor: fundo, borderRadius: radius.lg, padding: 14, gap: 6 }}>
      {/* Uma linha só: três cartões de alturas diferentes numa fileira
          leem como desalinho, e não como rótulo comprido. */}
      <Txt v="micro" c={c.tx3} numberOfLines={1}>{label}</Txt>
      <Row gap={3} style={{ alignItems: 'baseline' }}>
        <Txt v="h1" c={tinta} style={{ fontSize: 22 }}>{valor}</Txt>
        {!!unidade && <Txt v="micro" c={c.tx3}>{unidade}</Txt>}
      </Row>
    </View>
  );
  if (!onPress) return corpo;
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [{ flex: 1, opacity: pressed ? 0.7 : 1 }]}>
      {corpo}
    </Pressable>
  );
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
  const metas = metasDoDia(S);
  const corrige = (passo: string) => () => router.push(`/cadastro?editar=${passo}` as any);
  const atividade = ATIVIDADES.find((x) => x.id === (S.profile as any).atividade)?.titulo ?? 'Não informado';
  const motivo = MOTIVOS.find((x) => x.id === (S.profile as any).motivacao)?.titulo ?? 'Não informado';
  const restricoes = (((S.profile as any).restricoes ?? []) as string[])
    .map((x) => RESTRICOES.find((y) => y.id === x)?.titulo ?? x)
    .join(', ') || 'Nenhuma';
  const { c, isDark } = useTheme();
  const router = useRouter();
  const go = (p: string) => () => router.push(p as any);

  const startD = new Date(S.profile.startT);
  /* mês por extenso: "membro desde Jun de 2026" tem o corte de abreviação
     no meio de uma frase corrida, e abreviar economiza quatro letras num
     lugar onde não falta espaço */
  const desde = `${MO_LONG[startD.getMonth()]} de ${startD.getFullYear()}`;
  const linked = hasClinic(S);
  const med = M(S);
  const p = penStock(S);
  const dose = medComDose(S);

  return (
    <Screen>
      <Row style={{ marginTop: 4 }} gap={12}>
        <CircleBtn name="back" onPress={() => router.back()} />
        <Txt v="h1" style={{ flex: 1 }}>Perfil</Txt>
      </Row>

      {/* ---- identidade ----

          Card único e alto em vez de linha de avatar com texto ao lado. A
          diferença é de assunto: linha apresenta um item de lista, card
          apresenta uma pessoa — e esta tela é sobre ela.

          A malha entra em meia força, atrás. É a mesma peça do banner da
          especialista em Cuidado, no mesmo papel: dar corpo a um retrato
          sem virar superfície de marca. */}
      <View style={{ borderRadius: radius.xl, overflow: 'hidden', marginTop: 20, backgroundColor: c.bg1 }}>
        <Malha id="perfilIdent" forca={0.5} />
        <View style={{ padding: 22 }}>
          <Row gap={16}>
            <View>
              {/* Inicial em degradê, não foto. Não existe upload de avatar
                  no app, e boneco genérico é pior que ausência: ele ocupa o
                  lugar da pessoa com uma que não é ela. A inicial em corpo
                  grande identifica sem fingir. */}
              <LinearGradient
                colors={[c.accent, c.accent2]}
                start={{ x: 0.1, y: 0 }} end={{ x: 0.9, y: 1 }}
                /* REDONDO, e não quadrado de cantos macios. O quadrado é a
                   forma de ícone de app, e num cabeçalho de perfil ele lia
                   como logotipo; o círculo é a forma de retrato em todo
                   aparelho que a pessoa já usou. */
                style={{ width: 64, height: 64, borderRadius: 32, alignItems: 'center', justifyContent: 'center' }}
              >
                <Txt v="h1" c={c.accentInk} style={{ fontSize: 28 }}>{S.profile.name[0]}</Txt>
              </LinearGradient>
            </View>
            <View style={{ flex: 1 }}>
              <Txt v="h2">{S.profile.name}</Txt>
              {/* O E-MAIL SAIU, e com ele a única linha desta tela que era
                  ficção.

                  Ele existia só na semente: não há conta, não há login, e
                  o cadastro nunca pergunta e-mail — num perfil de verdade
                  aquela linha vinha vazia. Uma tela de conta sem conta
                  imita o que outros apps têm em vez de dizer o que este é.

                  O que fica é o que o app sabe de verdade: quem é a
                  pessoa, a idade que ela informou e desde quando ela está
                  aqui. */}
              <Txt v="micro" c={c.tx3} style={{ marginTop: 6 }}>
                {idade != null ? idade + ' anos · ' : ''}por aqui desde {desde}
              </Txt>
            </View>
          </Row>

          {/* A linha de continuidade. Ela é o que transforma a ficha em
              relação: "dia 71" diz há quanto tempo esta pessoa aparece, e é
              a informação que uma tela de conta normalmente não dá. */}
          <Row gap={7} style={{ marginTop: 18, alignSelf: 'flex-start', backgroundColor: c.limeWeak, borderRadius: radius.pill, paddingHorizontal: 12, paddingVertical: 7 }}>
            <Icon name="spark" size={13} color={c.tx} sw={2} />
            {/* Só o dia. A semana também estava aqui e vinha de
                journeySummary, que a lê de protocol.week — uma terceira
                definição de "semana atual", diferente da que a régua de
                Cuidado usa. Duas contagens da mesma coisa em telas
                vizinhas é pior que uma contagem a menos. */}
            <Txt v="micro" c={c.tx}>Dia {journeyDay(S)} da sua jornada</Txt>
          </Row>
        </View>
      </View>

      {/* ---- a ficha ----

          Estes números não são configuração, são o tratamento. Peso
          inicial define a perda; a meta define o quanto falta; a altura
          define o IMC e a meta de energia; medicamento e dose definem a
          cadência, o ciclo e o estoque. Trocar qualquer um redesenha
          metade do app.

          E AGORA TODOS TÊM CAMINHO DE VOLTA. O cadastro grava catorze
          respostas e esta tela deixava corrigir três: quem digitou 1,70
          no lugar de 1,60 ficava com o IMC e a meta de caloria errados
          para sempre, sem nenhuma porta. Cada linha daqui reabre a
          pergunta original — mesma régua, mesma validação —, e salvar
          refaz o plano inteiro com o número novo.

          O "PLANO DA EQUIPE" SAIU. Ele mostrava 16 semanas, e as 16
          vinham de um `?? 16` na semente: nenhuma equipe combinou aquilo,
          o cadastro nunca escreveu aquele campo, e o número estava ali
          desde sempre com cara de fato. */}
      <View style={{ marginTop: 32 }}>
        <SectionHead title="Sua ficha" />
        <Txt v="note" c={c.tx3} style={{ marginTop: 4 }}>
          Os números que usamos para calcular tudo o que a gente te mostra. Toque para corrigir.
        </Txt>

        <Row gap={10} style={{ marginTop: 14 }}>
          <Dado
            valor={kg(S.profile.startWeight)} unidade="kg" label="Peso inicial"
            fundo={c.bg1} tinta={c.tx} onPress={corrige('corpo')}
          />
          <Dado
            valor={kg(S.profile.goalWeight)} unidade="kg" label="Meta"
            fundo={c.limeWeak} tinta={c.tx} onPress={corrige('meta')}
          />
          <Dado
            valor={milhar(metas.kcal)} unidade="kcal" label="Energia"
            fundo={c.accentWeak} tinta={c.accent} onPress={go('/metas')}
          />
        </Row>

        {/* O medicamento sai da grade e vira linha inteira: ele não é um
            número entre outros, é o que dá nome ao tratamento. O toque
            abre as aplicações, que é onde ele tem conteúdo próprio; para
            trocar a caneta ou a dose, a linha de baixo. */}
        <Pressable onPress={go('/aplicacoes')} style={({ pressed }) => [{ marginTop: 10, opacity: pressed ? 0.7 : 1 }]}>
          <Row gap={14} style={{ backgroundColor: c.bg1, borderRadius: radius.lg, padding: 16 }}>
            <View style={{ width: 42, height: 42, borderRadius: 21, backgroundColor: c.accentWeak, alignItems: 'center', justifyContent: 'center' }}>
              <Icon name="syringe" size={19} color={c.accent} sw={1.8} />
            </View>
            <View style={{ flex: 1 }}>
              <Txt v="bodyMed">{dose}</Txt>
              <Txt v="micro" c={c.tx3} style={{ marginTop: 3 }}>
                {cadenciaCurta(S)} · {p.left} de {p.total} doses na caneta
              </Txt>
            </View>
            <Icon name="chev" size={14} color={c.tx4} sw={2} />
          </Row>
        </Pressable>
      </View>

      {/* ---- as respostas ----

          O resto do que o cadastro perguntou. Não são números de tela —
          são as premissas das contas: a idade e o sexo entram na equação
          de energia, o nível de atividade multiplica o gasto, a restrição
          filtra o que o app sugere, e o motivo é o que a pessoa disse que
          a trouxe. Todos mudam com a vida, e nenhum tinha porta. */}
      <Grupo title="Suas respostas">
        <ListRow ic="ruler" title="Altura" sub={`${nf(S.profile.height, 2).replace('.', ',')} m`} onPress={corrige('corpo')} />
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
