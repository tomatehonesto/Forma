import React, { useState } from 'react';
import { View, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { useStore } from '../logic/store';
import {
  apagarRefeicao, checkinToday, diasDeRefeicao, energiaDoDia, favoritos, metasDoDia,
  refeicoesDoDia, semanaDeProteina,
} from '../logic/derive';
import { somaDe } from '../logic/prato';
import { conselhosDaRotina } from '../logic/conselhos';
import { milhar, now, startOfDay } from '../logic/time';
import { Txt, Row, Vazio } from '../ui/kit';
import { Icon } from '../ui/Icon';
import Svg, { Defs, Ellipse, RadialGradient, Stop } from 'react-native-svg';
import {
  Bloco, CardSemana, Cartao, Linha, TiraDeDias,
} from '../ui/internas';
import { AtalhoDaCapa, CapaDeHabito, FolhaDeHabito, TelaDeHabito } from '../ui/capa';
import { Chevron } from '../ui/kit';
import { useTheme } from '../ui/useTheme';
import { font, radius, shadowCard } from '../theme';

/* ============================================================
   ALIMENTAÇÃO

   A tela do que sustenta o tratamento, e a PROTEÍNA é a régua dela: num
   tratamento de GLP-1 a fome cai sozinha, e o risco deixa de ser comer
   demais e passa a ser comer pouca proteína — que é o que segura a massa
   magra enquanto o peso desce.

   A CALORIA ENTROU, E COMO LIMITE. Por muito tempo esta tela não contava
   caloria nenhuma, e o argumento continua valendo para o dia a dia: quem
   anota cada refeição para fechar uma conta costuma parar na segunda
   semana. O que mudou é que o cadastro passou a montar uma meta de
   energia, e dela saem carboidrato, gordura e fibra, que não existem de
   outra forma. Meta que nenhuma tela lê é dívida; esta aqui lê — sem
   virar contador, e dizendo de quantas refeições a soma não fala.

   Três resoluções, e é a mesma escada da tela de exercício: o dia (o
   número que muda o que se almoça), a semana (a unidade em que a meta
   diária faz sentido) e as oito semanas (se está conseguindo manter).
   Sozinho, o dia não diz nada sobre o tratamento; sozinha, a tendência
   não diz o que fazer no almoço.

   Dois caminhos para registrar, e é a mesma decisão que a folha de
   registro já tomou: a foto para quem não sabe quantos gramas tem um
   filé, e a mão para quem prefere escrever. O botão fixo embaixo é o
   manual, porque é o que sempre funciona; o de escanear fica em cima,
   perto do número que ele move.
   ============================================================ */

/* A origem de cada refeição, pela mesma regra dos treinos: ausência quer
   dizer manual, porque manual é o que existia antes de haver origem —
   mas a tela nunca mostra ausência, mostra "por você". */
const origem = (fonte?: string) => (fonte === 'foto' ? 'pela foto' : 'por você');

/* A tira cobre trinta dias. Não há seletor de período aqui porque não há
   nada mais na tela que responda a ele: na de exercício o período governa
   também os quatro quadros do resumo, e um seletor que só encurtasse o
   calendário seria um controle a mais para aprender sem nada a decidir. */
const DIAS_DA_TIRA = 30;

export default function Alimentacao() {
  const S = useStore((s) => s.S);
  const update = useStore((s) => s.update);
  const { c } = useTheme();
  const router = useRouter();

  /* AS METAS DE COMIDA, todas do mesmo lugar: a proteína que a pessoa
     pode editar, a energia que o cadastro gravou, e os três gramas que
     saem dela. */
  const metas = metasDoDia(S);
  const energia = energiaDoDia(S, +startOfDay(now()));
  const resta = metas.kcal - energia.kcal;
  /* Zero é zero. O 70 de antes era um número inventado: quem ainda não
     tinha registrado nada abria a tela e via a barra em 78% de uma meta
     que ninguém tinha começado a cumprir. Proteína é acumulador como
     água e exercício — o dia começa vazio e isso é a verdade dele. */
  const prot = Math.round(checkinToday(S)?.prot || 0);
  const alvo = metas.prot;
  const falta = Math.max(0, alvo - prot);

  const semana = semanaDeProteina(S);
  const diasComRegistro = semana.filter((d) => d.g > 0).length;
  const mediaSemana = diasComRegistro
    ? Math.round(semana.reduce((x, d) => x + d.g, 0) / diasComRegistro)
    : 0;


  const conselhos = conselhosDaRotina(S);

  const favs = favoritos(S);

  const [diaSel, setDiaSel] = useState<number>(() => +startOfDay(now()));
  const calendario = diasDeRefeicao(S, DIAS_DA_TIRA);
  const doDia = refeicoesDoDia(S, diaSel);
  const gDoDia = doDia.reduce((x, m) => x + (m.g ?? 0), 0);

  return (
    <TelaDeHabito>
      {/* A CAPA — a mesma das outras duas telas de hábito. Ver
          src/ui/capa.tsx.

          Ela absorveu o cartão "Proteína de hoje", que dizia o número, a
          meta e a proporção logo abaixo de um titulão sobre fundo liso.
          E a foto faz o que o cartão não fazia: uma tigela de atum com
          ovo diz sobre proteína uma coisa que "63 / 90 g" não diz.

          UM BOTÃO SÓ, e não três como na água. Lá um toque completa um
          registro, porque um copo é uma quantidade inteira; aqui a
          refeição precisa do prato, e não existe atalho honesto que
          adivinhe o que a pessoa comeu. Os favoritos, que seriam os
          candidatos, têm nome derivado dos itens — "Arroz, feijão,
          frango" não cabe numa pastilha, e eles já moram logo abaixo com
          o nome inteiro. */}
      <CapaDeHabito
        foto={require('../../assets/images/alimentacao-hero.jpg')}
        titulo="Alimentação"
        linha={prot === 0
          ? `Proteína: nada registrado · meta de ${alvo} g`
          : `Proteína: ${prot} de ${alvo} g · ${falta > 0 ? `${falta} g para a meta` : 'meta alcançada'}`}
        pct={Math.round((prot / alvo) * 100)}
      >
        <AtalhoDaCapa
          titulo="Registrar uma refeição"
          cheio
          onPress={() => router.push('/medir-refeicao' as any)}
        />
      </CapaDeHabito>

      <FolhaDeHabito>

      {/* A ENERGIA DO DIA — a meta que o cadastro montou, finalmente lida.

          Ela vivia só na tela de plano: a pessoa via "1.200 kcal por dia"
          no fim do cadastro e nunca mais. Meta que nenhuma tela lê é
          dívida, não recurso.

          O NÚMERO GRANDE É O CONSUMIDO, e a meta vem pequena ao lado. É a
          mesma regra da capa: o que muda durante o dia é o que a pessoa
          fez, e a meta é a régua parada atrás dele. Os dois no mesmo
          tamanho faziam a linha ser lida como uma fração, que é a forma
          de escrever um número sem que ninguém saiba qual dos dois olhar.

          E A CONTA SÓ FALA DO QUE TEM RÓTULO. Prato montado pela tabela
          tem caloria conferida; refeição estimada pela foto responde por
          proteína, e nada mais. Em vez de somar zero pelas outras em
          silêncio, a tela diz de quantas ela não está falando. */}
      <Bloco titulo="A energia de hoje">
        <View style={{ gap: 10 }}>
          <View style={[{ backgroundColor: c.bg1, borderRadius: radius.card, padding: 16, gap: 10 }, shadowCard(c)]}>
            <Row gap={8} style={{ alignItems: 'center' }}>
              <Icon name="flame" size={15} color={c.accent} sw={1.9} />
              <Txt v="micro" c={c.accent} style={{ letterSpacing: 1 }}>CALORIAS</Txt>
            </Row>
            <Row style={{ alignItems: 'baseline', gap: 6 }}>
              <Txt v="metric">{milhar(energia.kcal)}</Txt>
              <Txt v="caption" c={c.tx3}>de {milhar(metas.kcal)} kcal</Txt>
            </Row>
            <View style={{ height: 5, borderRadius: radius.pill, backgroundColor: c.track, overflow: 'hidden' }}>
              <View style={{
                width: `${Math.max(0, Math.min(100, Math.round((energia.kcal / metas.kcal) * 100)))}%`,
                height: '100%', borderRadius: radius.pill, backgroundColor: c.accent,
              }} />
            </View>
            {/* O QUE AINDA CABE, dito como frase e não como subtração que
                a pessoa faz de cabeça. É a leitura que interessa na hora
                do jantar: o total consumido responde "como foi o dia", e
                só o que resta responde "o que eu faço agora".

                E A FRASE MUDA DE PROMESSA CONFORME A CONTA. Com o dia
                inteiro na tabela, cabem tantas calorias. Com parte do
                prato fora da conta, o que sobra é do que DÁ PARA CONTAR —
                dizer "ainda cabem 500" para quem almoçou sem registrar o
                prato seria o app autorizando um jantar que ele não tem
                como calcular.

                "ESCOLHA BEM COMO GASTAR" É O ÚNICO PEDIDO DA TELA, e ele
                cabe aqui porque é o assunto dela: num prato que encolheu,
                o que decide o tratamento não é o tamanho da sobra, é o
                que entra nela. */}
            <Txt v="note" c={c.tx2}>
              {resta > 0
                ? (energia.fora > 0
                  ? <>Sobram <Txt v="note" c={c.tx} style={{ fontFamily: font.bodySemi }}>{milhar(resta)} kcal</Txt> do que dá para contar.</>
                  : <>Ainda cabem <Txt v="note" c={c.tx} style={{ fontFamily: font.bodySemi }}>{milhar(resta)} kcal</Txt> no seu dia. Escolha bem como gastar.</>)
                : <>Você passou a meta do dia em <Txt v="note" c={c.tx} style={{ fontFamily: font.bodySemi }}>{milhar(-resta)} kcal</Txt>. Amanhã é outro dia.</>}
            </Txt>
            {energia.refeicoes === 0 || energia.fora > 0 ? (
              <Txt v="caption" c={c.tx3}>
                {energia.refeicoes === 0
                  ? 'Nada registrado hoje.'
                  : `${energia.fora} de ${energia.refeicoes} ${energia.refeicoes === 1 ? 'refeição não entra' : 'refeições não entram'} nesta conta: só o prato montado pela tabela tem rótulo conferido.`}
              </Txt>
            ) : null}
          </View>

          {/* OS TRÊS SAEM DA META DE ENERGIA, e não de um campo guardado.
              São fatia dela — guardá-los à parte seria criar números que
              divergem do quinto no dia em que alguém mexer nele. */}
          <Cartao>
            {([
              ['leaf', c.ok, c.okBg, 'Carboidrato', energia.carb, metas.carb],
              ['drop2', c.amber, c.amberBg, 'Gordura', energia.gord, metas.gord],
              ['gut', c.purple, c.purpleBg, 'Fibra', energia.fibra, metas.fibra],
            ] as [string, string, string, string, number, number][]).map(([ic, cor, fundo, nome, tem, meta]) => (
              <Row key={nome} style={{ paddingHorizontal: 16, paddingVertical: 13, gap: 12, alignItems: 'center' }}>
                <View style={{
                  width: 28, height: 28, borderRadius: 9, backgroundColor: fundo,
                  alignItems: 'center', justifyContent: 'center',
                }}>
                  <Icon name={ic} size={14} color={cor} sw={1.9} />
                </View>
                <Txt v="body" style={{ flex: 1 }}>{nome}</Txt>
                <View style={{ alignItems: 'flex-end' }}>
                  <Txt v="title" style={{ fontFamily: font.bodySemi }}>{tem} g</Txt>
                  <Txt v="micro" c={c.tx4}>de {meta} g</Txt>
                </View>
              </Row>
            ))}
          </Cartao>
        </View>
      </Bloco>

      {/* A SEMANA, e só ela.

          Aqui teve também a curva de oito semanas, igual à do exercício,
          e ela saiu. Esta tela responde "o que eu como e quanto falta
          hoje"; a tendência de dois meses responde "o tratamento está
          indo", que é pergunta de outra tela. Era a única coisa daqui
          que não mudava nenhuma decisão sobre o próximo prato, e ficava
          entre a pessoa e o diário.

          A semana fica porque ela contextualiza a meta DIÁRIA que se está
          perseguindo agora: sete barras contra a mesma linha de 90 g. */}
      <Bloco titulo="A proteína da semana">
        {/* MÉDIA POR DIA, e não total da semana. A meta com que ela se
            compara é diária: 390 g na semana não é número que alguém
            carregue na cabeça, nem se compara com 90.

            E média dos dias REGISTRADOS. Um dia sem nenhuma refeição
            anotada não é um dia de 0 g — é um dia que a pessoa não
            registrou, e dividir por sete transformaria esquecimento em
            queda de proteína. */}
        <CardSemana
          nome="Esta semana"
          sub={diasComRegistro === 0
            ? 'Nada registrado nos últimos sete dias'
            : `Média de ${diasComRegistro} ${diasComRegistro === 1 ? 'dia registrado' : 'dias registrados'}`}
          valor={String(mediaSemana)}
          unidade="g"
          dias={semana.map((d) => ({ t: d.t, v: d.g }))}
          alvo={alvo}
          rotuloMeta={`Meta: ${alvo} g`}
        />
      </Bloco>
      {/* O QUE DÁ PARA NOTAR — a única parte da tela que não é contador.

          Cada frase sai de uma contagem sobre o que a pessoa registrou nas
          últimas duas semanas, e traz o número junto. A regra está em
          src/logic/conselhos.ts: sem registro suficiente, a seção some
          inteira em vez de opinar sobre três refeições.

          POR ISSO ELA FICA DEPOIS DOS NÚMEROS. O que ela diz é leitura
          dos quadros de cima; lida antes deles, seria um app dando
          conselho sobre uma rotina que a pessoa ainda não viu. */}
      {conselhos.length ? (
        <Bloco
          titulo="O que notamos"
          nota="Da sua rotina das últimas duas semanas — e só do que você registrou."
        >
          <View style={{ gap: 10 }}>
            {conselhos.map((k) => (
              <Pressable
                key={k.id}
                onPress={() => router.push(`/companion?q=${encodeURIComponent(k.q)}` as any)}
                style={({ pressed }) => [{
                  backgroundColor: c.accentWeak, borderWidth: 1, borderColor: c.accentLine,
                  borderRadius: radius.card, padding: 16, gap: 10,
                  overflow: 'hidden', opacity: pressed ? 0.75 : 1,
                }]}
              >
                {/* SEM SOMBRA E SOBRE COR, ao contrário de todos os cards
                    acima. Os outros são superfície branca com dado em
                    cima; este é fala. A diferença de matéria diz isso
                    antes de qualquer rótulo — e o clarão lima no canto é a
                    mesma assinatura que a descoberta da semana usa na aba
                    Insights. */}
                <Svg width={200} height={150} style={{ position: 'absolute', right: -50, top: -50 }} pointerEvents="none">
                  <Defs>
                    <RadialGradient id={`brilho-${k.id}`} cx="50%" cy="50%" r="50%">
                      <Stop offset="0" stopColor={c.lime} stopOpacity={0.55} />
                      <Stop offset="0.55" stopColor={c.lime} stopOpacity={0.2} />
                      <Stop offset="1" stopColor={c.lime} stopOpacity={0} />
                    </RadialGradient>
                  </Defs>
                  <Ellipse cx={100} cy={75} rx={100} ry={75} fill={`url(#brilho-${k.id})`} />
                </Svg>

                <Row gap={8} style={{ alignItems: 'center' }}>
                  <Icon name="aura" size={14} color={c.accent} sw={2} />
                  <Txt v="micro" c={c.accent} style={{ letterSpacing: 1.2 }}>
                    {k.bom ? 'CONTINUE ASSIM' : 'UMA IDEIA'}
                  </Txt>
                </Row>
                <Txt v="bodyMed">{k.titulo}</Txt>
                <Txt v="note" c={c.tx2}>{k.texto}</Txt>

                {/* O ACHADO TERMINA NUMA CONVERSA, e não num beco.
                    A tela conta e sugere; "e agora, o que eu faço no
                    almoço de amanhã" é pergunta que só o Morphi responde,
                    e ele já abre com ela escrita. */}
                <Row gap={7} style={{ marginTop: 2, alignItems: 'center' }}>
                  <Txt v="label" c={c.accent}>Conversar sobre isso</Txt>
                  <Icon name="chev" size={13} color={c.accent} sw={2.2} />
                </Row>
              </Pressable>
            ))}
          </View>
        </Bloco>
      ) : null}

      {/* O DIÁRIO DE REFEIÇÕES — um dia por vez, como o de treino.

          A lista corrida de "registro recente" mostrava as últimas
          refeições sem nenhum recorte, e por isso não respondia a pergunta
          que se faz olhando para trás: o que eu comi TERÇA. A tira escolhe
          o dia e a lista mostra só ele; os pontos embaixo de cada número
          dizem onde há registro, sem tentativa e erro.

          Cada refeição pode ser apagada daqui. Registrar três vezes por
          dia produz engano — o almoço que entrou como jantar, a busca que
          somou dois frangos —, e sem uma saída o número do dia fica errado
          para sempre com a pessoa sabendo que está. Apagar devolve a
          proteína ao dia, não zera. */}
      <Bloco
        titulo="Diário de refeições"
        nota="Toque numa refeição para ver, corrigir ou apagar."
      >
        <View style={{ gap: 10 }}>
          <TiraDeDias
            dias={calendario.map((d) => ({ t: d.t, marcado: d.itens > 0, hoje: d.hoje }))}
            sel={diaSel}
            onEscolhe={setDiaSel}
          />

          {doDia.length ? (
            <View style={{ gap: 10 }}>
              {/* A linha ABRE a refeição, e é só isso que ela faz.

                  A lixeira morava aqui e foi para dentro da folha. Uma
                  ação irreversível ao alcance do polegar numa lista que se
                  rola é um erro esperando acontecer — e, pior, ela era a
                  ÚNICA saída: quem registrou o almoço como jantar não
                  queria apagar, queria corrigir. Na folha as duas moram
                  juntas, depois de a pessoa ver o que está prestes a
                  mexer. */}
              {/* UM CARTÃO SÓ, com fios entre as linhas. Cada refeição num
                  card próprio dava três objetos flutuando onde existe UMA
                  coisa: o dia. Fio separa sem cortar, e é o que o resto do
                  app já faz em toda lista de linhas. */}
              <Cartao>
                {doDia.map((m: any, i: number) => (
                <Pressable
                  key={`${m.t}-${i}`}
                  onPress={() => router.push(`/refeicao?t=${m.t}` as any)}
                  style={({ pressed }) => [
                    { paddingHorizontal: 16, paddingVertical: 13, opacity: pressed ? 0.6 : 1 },
                  ]}
                >
                  <Row style={{ alignItems: 'flex-start' }}>
                    <View style={{ flex: 1, paddingRight: 10 }}>
                      <Txt v="body">{m.name}</Txt>
                      {m.tag && m.tag !== m.name ? (
                        <Txt v="caption" c={c.tx3} style={{ marginTop: 2 }}>{m.tag}</Txt>
                      ) : null}
                      {/* A origem qualifica o número, como nos treinos: 30 g
                          que você escreveu e 30 g que a foto estimou não se
                          conferem do mesmo jeito.

                          A faixa ("proteína alta") saiu. Ela é DERIVADA dos
                          gramas, e mostrar as duas era o mesmo fato em duas
                          resoluções ocupando duas pastilhas. */}
                      <Txt v="micro" c={c.tx4} style={{ marginTop: 6 }}>{origem(m.fonte)}</Txt>
                    </View>
                    {/* "de proteína" escrito, e não só "g". Num app que
                        recusa contar caloria, um grama sem dono é justamente
                        a dúvida que a tela existe para não deixar: é o peso
                        do prato? é carboidrato? */}
                    <View style={{ alignItems: 'flex-end' }}>
                      <Txt v="bodyMed" c={c.accent}>~{m.g ?? 0} g</Txt>
                      <Txt v="micro" c={c.tx4}>de proteína</Txt>
                    </View>
                    <View style={{ marginLeft: 8, marginTop: 3 }}><Chevron size={15} /></View>
                  </Row>
                </Pressable>
                ))}
              </Cartao>
              {/* O total do dia embaixo da lista, e não em cima: em cima ele
                  seria um segundo cabeçalho competindo com a tira; embaixo
                  ele é o que a soma das linhas deu. */}
              <Txt v="micro" c={c.tx4} style={{ textAlign: 'center' }}>
                {doDia.length} {doDia.length === 1 ? 'refeição' : 'refeições'} · {gDoDia} g de proteína
              </Txt>
            </View>
          ) : (
            <Vazio
              ic="utensils"
              titulo="Nenhuma refeição neste dia"
              texto="O que você registrar entra na proteína do dia."
            />
          )}
        </View>
      </Bloco>

      {/* OS FAVORITOS — o atalho de quem repete a mesma comida.

          Eles abrem a folha de registro com o nome já escrito, em vez de
          gravar por conta própria. Gravando sozinhos, a refeição aparecia
          na lista e a barra do dia não andava — duas versões do mesmo dia
          na mesma tela. */}
      <Bloco
        titulo="Pratos favoritos"
        link="Cadastrar"
        onLink={() => router.push('/medir-refeicao?fav=1' as any)}
        nota="Monte o prato uma vez e ele entra no registro com um toque."
      >
        {favs.length ? (
          <View style={{ gap: 10 }}>
            {/* A linha ABRE o prato, e é só isso que ela faz. A lixeira
                morava aqui e foi para dentro da folha, pelo mesmo motivo
                da lista de refeições: apagar é irreversível, e ao alcance
                do polegar numa lista que se rola é um erro esperando
                acontecer. */}
            <Cartao>
            {favs.map((f) => {
              const g = somaDe((f.itens || []) as any);
              return (
                <Pressable
                  key={f.nome}
                  onPress={() => router.push(`/favorito?nome=${encodeURIComponent(f.nome)}` as any)}
                  style={({ pressed }) => [
                    { paddingHorizontal: 16, paddingVertical: 13, opacity: pressed ? 0.6 : 1 },
                  ]}
                >
                  <Row style={{ alignItems: 'flex-start' }}>
                    <View style={{ flex: 1, paddingRight: 10 }}>
                      <Txt v="body">{f.nome}</Txt>
                      {/* Quantos gramas o prato rende, dito aqui: é a razão
                          de ele ser favorito de quem está perseguindo uma
                          meta de proteína, e sem isso a escolha entre dois
                          favoritos é às cegas. */}
                      <Txt v="micro" c={c.tx4} style={{ marginTop: 4 }}>
                        {f.itens?.length ? `~${g} g de proteína` : 'Sem prato guardado — abre pela busca'}
                      </Txt>
                    </View>
                    <Chevron size={15} />
                  </Row>
                </Pressable>
              );
            })}
            </Cartao>
          </View>
        ) : (
          /* O vazio aponta a saída, porque aqui ela existe: o cadastro
             está no cabeçalho do bloco. */
          <Vazio
            ic="leaf"
            titulo="Nenhum prato favorito"
            texto="Cadastre um prato que você repete e ele entra com um toque."
          />
        )}
      </Bloco>

      {/* EXPLORAR, e não consultar uma tabela.

          Ela já existia inteira dentro da folha de registro, e só
          aparecia enquanto alguém montava um prato — três resultados por
          vez, cada um dizendo uma linha de proteína e sumindo em
          seguida. Quem quis saber quanta proteína tem um ovo sem estar
          registrando um ovo não tinha onde olhar.

          O convite não diz mais quantos alimentos são. Duzentos e vinte
          e quatro é um número que impressiona quem construiu e não diz
          nada a quem vai usar: ninguém abre uma tabela porque ela é
          grande, abre porque quer saber de UM alimento.

          E fica DEPOIS dos favoritos, que é a ordem do que se faz: o
          número do dia, o que eu comi, o que eu repito, e por último o
          passeio. */}
      <Bloco titulo="Explorar alimentos">
        <Cartao>
          <Linha
            ic="book"
            titulo="O que tem em cada comida"
            sub="Procure um alimento e veja a proteína, a caloria e o resto do rótulo"
            onPress={() => router.push('/alimentos' as any)}
          />
        </Cartao>
      </Bloco>
      </FolhaDeHabito>
    </TelaDeHabito>
  );
}
