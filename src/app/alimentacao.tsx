import React, { useState } from 'react';
import { View, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useStore } from '../logic/store';
import {
  apagarRefeicao, checkinToday, diasDeRefeicao, refeicoesDoDia,
  semanaDeProteina, semanasDeProteina,
} from '../logic/derive';
import { fmtDate, now, relDay, startOfDay } from '../logic/time';
import { Txt, Row, Vazio } from '../ui/kit';
import {
  TelaInterna, Titulao, Bloco, CardCurva, CardSemana, Cartao, Linha, Botao,
  ItemApagavel, TiraDeDias,
} from '../ui/internas';
import { Icon } from '../ui/Icon';
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

  /* A curva só aparece com mais de uma semana registrada: duas semanas
     vazias e uma cheia não formam tendência, formam um degrau. */
  const semanas = semanasDeProteina(S, 8);
  const comHistorico = semanas.filter((w) => w.g > 0).length >= 2;
  const mediaGeral = (() => {
    const cheias = semanas.filter((w) => w.g > 0);
    return cheias.length ? Math.round(cheias.reduce((x, w) => x + w.g, 0) / cheias.length) : 0;
  })();

  const [diaSel, setDiaSel] = useState<number>(() => +startOfDay(now()));
  const calendario = diasDeRefeicao(S, DIAS_DA_TIRA);
  const doDia = refeicoesDoDia(S, diaSel);
  const gDoDia = doDia.reduce((x, m) => x + (m.g ?? 0), 0);

  return (
    <TelaInterna
      titulo="Alimentação"
      rodape={<Botao label="Registrar uma refeição" onPress={() => router.push('/medir-refeicao' as any)} />}
    >
      <Titulao
        titulo="Alimentação"
        lead="Aqui não se conta caloria. O que o tratamento pede é proteína, que é o que segura a massa magra enquanto o peso desce."
      />

      <View style={{ gap: 10 }}>
        {/* O NÚMERO DO DIA, e o que ainda falta dele.

            A barra sozinha dizia a proporção e deixava a conta para a
            pessoa. "Faltam 34 g" é a mesma informação já resolvida, e é
            ela que muda o que se almoça. */}
        <View style={[{ backgroundColor: c.bg1, borderRadius: radius.card, padding: 16 }, shadowCard(c)]}>
          <Row style={{ alignItems: 'flex-start' }}>
            <View style={{ flex: 1 }}>
              <Txt v="body">Proteína de hoje</Txt>
              <Txt v="note" c={c.tx3} style={{ marginTop: 2 }}>
                {prot === 0
                  ? `Meta de ${alvo} g`
                  : falta > 0 ? `Faltam ${falta} g para a meta` : 'Meta do dia alcançada'}
              </Txt>
            </View>
            <Txt v="metric">
              {prot}
              <Txt v="label" c={c.tx3}>{` / ${alvo} g`}</Txt>
            </Txt>
          </Row>
          <View style={{ height: 8, borderRadius: 4, backgroundColor: c.track, marginTop: 14, overflow: 'hidden' }}>
            <LinearGradient
              colors={[c.gradFrom, c.gradTo]}
              start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
              style={{ width: `${Math.min(100, (prot / alvo) * 100)}%`, height: '100%' }}
            />
          </View>
        </View>

        {/* O caminho da foto. Ele tinha esta mesma cara e NENHUM onPress:
            um botão em gradiente, com ícone de câmera, que não fazia nada
            ao ser tocado. Agora abre a folha de registro com a câmera já
            no ar — que é onde ele sempre devia ter ido. */}
        <Pressable
          onPress={() => router.push('/medir-refeicao?cam=1' as any)}
          style={({ pressed }) => [{ transform: [{ scale: pressed ? 0.98 : 1 }] }]}
        >
          <LinearGradient
            colors={[c.gradFrom, c.gradTo]}
            start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
            style={{ borderRadius: radius.pill, paddingVertical: 14, alignItems: 'center', flexDirection: 'row', justifyContent: 'center', gap: 8 }}
          >
            <Icon name="camera" size={16} color={c.onHero} sw={2} />
            <Txt v="title" c={c.onHero}>Escanear uma refeição</Txt>
          </LinearGradient>
        </Pressable>
      </View>

      {/* A SEMANA E A TENDÊNCIA — os dois gráficos são um grupo só, com o
          respiro de cartões irmãos. Separados pelos 26 px que dividem
          seções eles leriam como dois assuntos. */}
      <View style={{ gap: 10 }}>
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

        {comHistorico ? (
          <CardCurva
            id="prot"
            nome="Proteína por semana"
            /* Curto porque o número grande come a largura: "Média por dia,
               nas últimas 8 semanas" chegava truncado em "8 sema…". */
            sub="Média por dia, 8 semanas"
            valor={String(mediaGeral)}
            unidade="g"
            altura={140}
            pontos={semanas.map((w) => ({
              v: w.g,
              rotulo: String(w.g),
              quando: `semana de ${fmtDate(new Date(w.t))}`,
            }))}
          />
        ) : null}
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
        nota="Toque na lixeira para apagar uma refeição que entrou errada."
      >
        <View style={{ gap: 10 }}>
          <TiraDeDias
            dias={calendario.map((d) => ({ t: d.t, marcado: d.itens > 0, hoje: d.hoje }))}
            sel={diaSel}
            onEscolhe={setDiaSel}
          />

          {doDia.length ? (
            <View style={{ gap: 10 }}>
              {doDia.map((m: any, i: number) => (
                <View key={`${m.t}-${i}`} style={[{ backgroundColor: c.bg1, borderRadius: radius.card }, shadowCard(c)]}>
                  <ItemApagavel
                    pergunta={`Apagar ${String(m.name).toLowerCase()} de ${relDay(new Date(m.t))}?`}
                    onApagar={() => update((s: any) => apagarRefeicao(s, m.t, m.g ?? 0))}
                  >
                    <Row style={{ alignItems: 'flex-start' }}>
                      <View style={{ flex: 1, paddingRight: 10 }}>
                        <Txt v="body">{m.name}</Txt>
                        {m.tag && m.tag !== m.name ? (
                          <Txt v="caption" c={c.tx3} style={{ marginTop: 2 }}>{m.tag}</Txt>
                        ) : null}
                        {/* A origem qualifica o número, como nos treinos:
                            30 g que você escreveu e 30 g que a foto estimou
                            não se conferem do mesmo jeito.

                            A faixa ("proteína alta") saiu. Ela é DERIVADA
                            dos gramas, e mostrar as duas era o mesmo fato em
                            duas resoluções ocupando duas pastilhas. */}
                        <Txt v="micro" c={c.tx4} style={{ marginTop: 6 }}>{origem(m.fonte)}</Txt>
                      </View>
                      <Txt v="bodyMed" c={c.accent}>~{m.g ?? 0} g</Txt>
                    </Row>
                  </ItemApagavel>
                </View>
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
        titulo="Favoritos"
        nota={S.favMeals.length ? 'Abrem o registro com o prato já escrito.' : undefined}
      >
        {S.favMeals.length ? (
          <Cartao>
            {S.favMeals.map((f: string) => (
              <Linha
                key={f}
                ic="leaf"
                titulo={f}
                onPress={() => router.push(`/medir-refeicao?oque=${encodeURIComponent(f)}` as any)}
              />
            ))}
          </Cartao>
        ) : (
          <Vazio ic="leaf" titulo="Nenhum favorito ainda" />
        )}
      </Bloco>
    </TelaInterna>
  );
}
