import React, { useState } from 'react';
import { View, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { useStore } from '../logic/store';
import {
  apagarRefeicao, checkinToday, diasDeRefeicao, favoritos, refeicoesDoDia,
  semanaDeProteina,
} from '../logic/derive';
import { somaDe } from '../logic/prato';
import { now, startOfDay } from '../logic/time';
import { Txt, Row, Vazio } from '../ui/kit';
import {
  Bloco, CardSemana, Cartao, Linha, TiraDeDias,
} from '../ui/internas';
import { AtalhoDaCapa, CapaDeHabito, FolhaDeHabito, TelaDeHabito } from '../ui/capa';
import { Chevron } from '../ui/kit';
import { useTheme } from '../ui/useTheme';
import { radius, shadowCard } from '../theme';

/* ============================================================
   ALIMENTAÇÃO

   A tela do que sustenta o tratamento. Ela não conta caloria de
   propósito: num tratamento de GLP-1 a fome cai sozinha, e o risco
   deixa de ser comer demais e passa a ser comer pouca PROTEÍNA — que é
   o que segura a massa magra enquanto o peso desce.

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

  /* Zero é zero. O 70 de antes era um número inventado: quem ainda não
     tinha registrado nada abria a tela e via a barra em 78% de uma meta
     que ninguém tinha começado a cumprir. Proteína é acumulador como
     água e exercício — o dia começa vazio e isso é a verdade dele. */
  const prot = Math.round(checkinToday(S)?.prot || 0);
  const alvo = (S.profile as any).targets.prot as number;
  const falta = Math.max(0, alvo - prot);

  const semana = semanaDeProteina(S);
  const diasComRegistro = semana.filter((d) => d.g > 0).length;
  const mediaSemana = diasComRegistro
    ? Math.round(semana.reduce((x, d) => x + d.g, 0) / diasComRegistro)
    : 0;

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
          ? `Hoje: nada registrado · meta de ${alvo} g`
          : `Hoje: ${prot} de ${alvo} g · ${falta > 0 ? `faltam ${falta} g` : 'meta alcançada'}`}
        pct={Math.round((prot / alvo) * 100)}
      >
        <AtalhoDaCapa
          titulo="Registrar uma refeição"
          cheio
          onPress={() => router.push('/medir-refeicao' as any)}
        />
      </CapaDeHabito>

      <FolhaDeHabito>
        {/* Por que um app de GLP-1 não conta caloria. */}
        <Txt v="note" c={c.tx2} style={{ paddingHorizontal: 2 }}>
          Aqui não se conta caloria. O que o tratamento pede é proteína, que
          é o que segura a massa magra enquanto o peso desce.
        </Txt>

      {/* A SEMANA, e só ela.

          Aqui teve também a curva de oito semanas, igual à do exercício,
          e ela saiu. Esta tela responde "o que eu como e quanto falta
          hoje"; a tendência de dois meses responde "o tratamento está
          indo", que é pergunta de outra tela. Era a única coisa daqui
          que não mudava nenhuma decisão sobre o próximo prato, e ficava
          entre a pessoa e o caderno.

          A semana fica porque ela contextualiza a meta DIÁRIA que se está
          perseguindo agora: sete barras contra a mesma linha de 90 g. */}
      <View>
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

      </View>

      {/* O CADERNO DE REFEIÇÕES — um dia por vez, como o de treino.

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
        titulo="Caderno de refeições"
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
              {doDia.map((m: any, i: number) => (
                <Pressable
                  key={`${m.t}-${i}`}
                  onPress={() => router.push(`/refeicao?t=${m.t}` as any)}
                  style={({ pressed }) => [
                    { backgroundColor: c.bg1, borderRadius: radius.card, paddingHorizontal: 16, paddingVertical: 13, opacity: pressed ? 0.6 : 1 },
                    shadowCard(c),
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
            {favs.map((f) => {
              const g = somaDe((f.itens || []) as any);
              return (
                <Pressable
                  key={f.nome}
                  onPress={() => router.push(`/favorito?nome=${encodeURIComponent(f.nome)}` as any)}
                  style={({ pressed }) => [
                    { backgroundColor: c.bg1, borderRadius: radius.card, paddingHorizontal: 16, paddingVertical: 13, opacity: pressed ? 0.6 : 1 },
                    shadowCard(c),
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
