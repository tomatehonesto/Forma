import React, { useMemo, useState } from 'react';
import { View } from 'react-native';
import { useRouter } from 'expo-router';
import { useStore } from '../logic/store';
import {
  INDICADORES, checkinToday, diasDeSintomas, padraoDoCiclo,
  sintomaNoCiclo, sintomasDaSemana,
} from '../logic/derive';
import { diasAnteriores, leituraDoDia, niveisDoRegistro } from '../logic/leituras';
import { daysAgo, fmtDate, nf, now, startOfDay } from '../logic/time';
import { Txt, Row } from '../ui/kit';
import {
  TelaInterna, Titulao, Bloco, Cartao, Linha, Progresso, Chips, CardCurva, Aviso, Botao,
} from '../ui/internas';
import { useTheme } from '../ui/useTheme';
import { radius } from '../theme';

/* ============================================================
   SINTOMAS

   O outro lado da dose. A caneta faz o corpo reagir, e esta é a tela que
   responde o que um dia de check-in sozinho não responde: o que apareceu
   na semana, se isso acompanha o ciclo da aplicação, e o que já dá para
   levar para a consulta.

   A VERSÃO ANTERIOR AFIRMAVA TRÊS COISAS QUE NINGUÉM TINHA CALCULADO.

   Um parágrafo fixo dizia que "seus registros de náusea concentram-se nos
   2 primeiros dias após cada aplicação" — texto escrito à mão, igual para
   todo mundo, com cara de achado sobre esta pessoa. Outro, por sintoma,
   dizia que "noites melhores aparecem associadas a menos náusea" e que
   "sono e proteína costumam andar junto com esse número". São correlações
   plausíveis, e nenhuma delas saía dos dados. Um app de tratamento que
   inventa um achado clínico é pior do que um que cala: o achado vai para
   a consulta.

   O ciclo agora é conta, e a conta às vezes responde "ainda não dá para
   dizer". Essa resposta também é informação — e é honesta.

   E AS MÉDIAS CONTAVAM SILÊNCIO COMO ZERO. `arr.reduce((s, x) => s + x[k])`
   sobre catorze dias com sete respondidos devolvia metade do valor real,
   e a tela escrevia isso como "fome média 3,5/10" — de quebra na régua de
   armazenamento, quando a pessoa tinha respondido de 1 a 5.
   ============================================================ */

const DIAS = 7;
/* O enjoo é o sintoma do ciclo. É o mais frequente com GLP-1, o que mais
   muda conduta de dose, e o único com registro em praticamente todo dia
   respondido — os outros aparecem pouco, e uma média de dois dias por
   balde não desenha padrão nenhum. */
const DO_CICLO = 'nausea';

/* Os quatro que a pessoa responde sobre si — não são sintomas, são como
   ela passou o dia. Ficam separados do bloco de cima de propósito: "tive
   náusea em 3 dias" e "durmo 7h" são duas perguntas diferentes, e
   misturá-las numa lista só foi o que produziu a tela antiga, onde um
   seletor trocava entre fome, sono e humor com uma régua só.

   O rótulo é curto e escrito aqui: o nome do indicador é a pergunta
   inteira — "Horas de sono", "Energia no dia" — e a primeira palavra dele
   não serve de apelido. Cortar em branco dava um chip escrito "Horas". */
const SENTIR: [string, string][] = [
  ['energia', 'Energia'],
  ['humor', 'Humor'],
  ['sono', 'Sono'],
  ['fome', 'Fome'],
];

/* ------------------------------------------------------------------ */
/* AS BARRAS DO CICLO.

   Sete colunas, uma por dia desde a aplicação. Três estados, e a
   diferença entre dois deles é a razão de este desenho não ser um
   gráfico de barras qualquer:

     · dia com sintoma        barra proporcional
     · dia respondido sem ele barra de piso, 3 px — "respondi, não tive"
     · dia sem resposta       calha vazia e o rótulo apagado

   Piso e calha vazia pareceriam a mesma coisa se a barra de zero
   simplesmente sumisse, e não são: uma é resposta, a outra é lacuna. */
function BarrasDoCiclo({ baldes, destaque }: {
  baldes: { dia: number; dias: number; media: number | null }[];
  destaque: number[] | null;
}) {
  const { c } = useTheme();
  const ALT = 76;
  return (
    <View style={{ gap: 8 }}>
      <Row style={{ alignItems: 'flex-end', gap: 6 }}>
        {baldes.map((b) => {
          const vazio = b.media == null;
          const forte = !destaque || destaque.includes(b.dia);
          return (
            <View key={b.dia} style={{ flex: 1, alignItems: 'center', gap: 7 }}>
              <View style={{
                width: '100%', height: ALT, justifyContent: 'flex-end',
                borderRadius: radius.sm, overflow: 'hidden',
                backgroundColor: vazio ? 'transparent' : c.track,
                borderWidth: vazio ? 1 : 0, borderColor: c.line,
                borderStyle: 'dashed',
              }}>
                {vazio ? null : (
                  <View style={{
                    height: Math.max(3, ((b.media as number) / 5) * ALT),
                    borderRadius: radius.sm,
                    backgroundColor: forte ? c.accent : c.accentLine,
                  }} />
                )}
              </View>
              <Txt v="micro" c={vazio ? c.tx4 : c.tx3}>{b.dia === 0 ? 'dose' : b.dia}</Txt>
            </View>
          );
        })}
      </Row>
    </View>
  );
}

/* A frase do padrão. Mora aqui, e não no cálculo, porque é redação: o
   cálculo devolve quais dias pesam, e quantos deles seguidos, que é o que
   uma tela em outra língua também usaria. */
function fraseDoCiclo(p: ReturnType<typeof padraoDoCiclo>, cad: number) {
  if (!p.pode) {
    return p.motivo === 'parecido'
      ? 'Nos dias respondidos até agora, o enjoo aparece parecido ao longo de todo o ciclo — ele não está seguindo a dose.'
      : 'Ainda são poucos dias respondidos para dizer se o enjoo acompanha o ciclo. Respondendo mais dias, essa conta fica de pé.';
  }
  const n = p.dias.length;
  if (p.doInicio) {
    return n === 1
      ? 'O enjoo pesa mais no dia da aplicação.'
      : `O enjoo pesa mais nos ${n} primeiros dias depois da aplicação.`;
  }
  if (p.doFim) {
    return n === 1
      ? 'O enjoo pesa mais na véspera da próxima aplicação.'
      : `O enjoo pesa mais nos ${n} dias que antecedem a próxima aplicação.`;
  }
  const quais = p.dias.map((d) => (d === 0 ? 'no dia da aplicação' : `no ${d}º dia depois`));
  const lista = quais.length === 1 ? quais[0]
    : `${quais.slice(0, -1).join(', ')} e ${quais[quais.length - 1]}`;
  return `O enjoo pesa mais ${lista}.`;
}

/* ------------------------------------------------------------------ */
export default function Sintomas() {
  const S = useStore((s) => s.S);
  const { c } = useTheme();
  const router = useRouter();
  const [qual, setQual] = useState('energia');

  const hoje = +startOfDay(now());
  const desde = +startOfDay(daysAgo(DIAS - 1));

  const lista = useMemo(() => sintomasDaSemana(S, DIAS), [S]);
  const respondidos = useMemo(() => diasDeSintomas(S, DIAS), [S]);

  /* A MESMA LEITURA QUE O CHECK-IN MOSTRA, e não uma segunda opinião.

     "Quatro dos últimos sete dias com enjoo" é a frase que muda a
     conversa na consulta, e ela já existe em leituras.ts, lida pelo
     formulário e pela confirmação. Escrever aqui uma terceira versão do
     mesmo juízo é como o app volta a divergir de si mesmo. */
  const leitura = useMemo(
    () => leituraDoDia(diasAnteriores(S.checkins, hoje), niveisDoRegistro(checkinToday(S))),
    [S, hoje],
  );

  const baldes = useMemo(() => sintomaNoCiclo(S, DO_CICLO), [S]);
  const padrao = useMemo(() => padraoDoCiclo(S, DO_CICLO), [S]);
  const diasNoCiclo = baldes.reduce((a, b) => a + b.dias, 0);

  /* O que a pessoa escreveu em "Outro". Não tem régua nem gráfico — é
     texto que ela digitou porque a lista não tinha o que ela sentiu, e
     some da tela se ninguém o mostrar. */
  const outros = (S.checkins as any[])
    .filter((x) => x.t >= desde && String(x.outroTexto || '').trim())
    .sort((a, b) => b.t - a.t);

  const ind = INDICADORES.find((x) => x.id === qual)!;
  const serie = useMemo(() => {
    return (S.checkins as any[])
      .slice(-14)
      .map((x) => ({ t: x.t, v: ind.leitura(x) }))
      .filter((p): p is { t: number; v: number } => p.v != null)
      .map((p) => ({ v: p.v, rotulo: ind.escreve(p.v, S), quando: fmtDate(new Date(p.t)) }));
  }, [S, ind]);
  const media = serie.length ? serie.reduce((a, p) => a + p.v, 0) / serie.length : null;

  return (
    <TelaInterna titulo="Sintomas">
      <Titulao
        titulo="Sintomas"
        lead={respondidos
          ? `${respondidos} ${respondidos === 1 ? 'dia respondido' : 'dias respondidos'} nos últimos ${DIAS}`
          : `Nenhum dia respondido nos últimos ${DIAS}`}
      />

      {/* A leitura da semana abre a tela quando existe: ela é a conclusão,
          e o resto é a conta que levou até ela. */}
      {leitura ? (
        <View style={{ marginBottom: 26 }}>
          <Aviso destaque titulo={leitura.titulo} texto={leitura.texto} acao={leitura.acao} />
        </View>
      ) : null}

      <Bloco titulo="Nesta semana">
        {respondidos === 0 ? (
          <Cartao>
            <View style={{ padding: 16, gap: 12 }}>
              <Txt v="caption" c={c.tx2}>
                Você ainda não respondeu sobre sintomas nesta semana. É no check-in que eles entram.
              </Txt>
              <Botao label="Fazer o check-in" onPress={() => router.push('/checkin' as any)} />
            </View>
          </Cartao>
        ) : lista.length === 0 ? (
          <Cartao>
            <Linha
              ic="check"
              titulo="Nenhum sintoma nesta semana"
              sub={`${respondidos} ${respondidos === 1 ? 'dia respondido' : 'dias respondidos'}, nenhum com queixa.`}
              seta={false}
            />
          </Cartao>
        ) : (
          <View style={{ gap: 8 }}>
            {lista.map((s) => (
              <Progresso
                key={s.id}
                label={s.label}
                valor={`${s.dias} de ${respondidos} ${respondidos === 1 ? 'dia' : 'dias'}`}
                /* A barra é a MÉDIA dos dias em que apareceu, e o texto
                   embaixo guarda o pior. Barra pelo pior faria um único dia
                   ruim desenhar a semana inteira. */
                pct={(s.media / 5) * 100}
                nota={s.legenda ? `No pior dia: ${s.legenda.toLowerCase()}` : undefined}
              />
            ))}
            {outros.map((x) => (
              <Cartao key={x.t}>
                <Linha
                  ic="note"
                  titulo={`“${String(x.outroTexto).trim()}”`}
                  sub={`Você escreveu em ${fmtDate(new Date(x.t))}`}
                  seta={false}
                />
              </Cartao>
            ))}
          </View>
        )}
      </Bloco>

      {/* O CICLO — a pergunta que só a série responde.

          Só aparece quando há dias contados: sem aplicação registrada ou
          sem sintoma respondido, as sete colunas seriam sete calhas
          vazias com uma legenda explicando o vazio. */}
      {diasNoCiclo > 0 ? (
        <View style={{ marginTop: 26 }}>
          <Bloco
            titulo="Ao longo do ciclo"
            nota={`Média do enjoo em cada dia depois da aplicação, de ${diasNoCiclo} ${diasNoCiclo === 1 ? 'dia respondido' : 'dias respondidos'}.`}
          >
            <Cartao>
              <View style={{ padding: 16, gap: 14 }}>
                <BarrasDoCiclo baldes={baldes} destaque={padrao.pode ? padrao.dias : null} />
                <Txt v="caption" c={c.tx2}>{fraseDoCiclo(padrao, baldes.length)}</Txt>
              </View>
            </Cartao>
          </Bloco>
        </View>
      ) : null}

      {/* COMO VOCÊ SE SENTIU — o que não é sintoma.

          Cada indicador tem a régua dele, e por isso o número e a legenda
          saem de INDICADORES, a mesma lista que as metas usam: energia e
          fome moram de 0 a 10 no banco e de 1 a 5 na tela, e é a leitura
          de lá que faz a conversão. A tela antiga fazia a sua, e escrevia
          "/10" embaixo de uma pergunta de 1 a 5. */}
      <View style={{ marginTop: 26 }}>
        <Bloco titulo="Como você se sentiu">
          <View style={{ gap: 12 }}>
            <Chips
              itens={SENTIR.map(([id, label]) => ({ id, label }))}
              valor={qual}
              onChange={setQual}
            />
            {serie.length ? (
              <CardCurva
                id={`sy-${qual}`}
                nome={ind.nome}
                sub={`${serie.length} ${serie.length === 1 ? 'resposta' : 'respostas'} em 14 dias`}
                valor={nf(media as number, 1)}
                unidade={ind.un}
                pontos={serie}
              />
            ) : (
              <Cartao>
                <Linha titulo="Sem respostas ainda" sub={ind.origem} seta={false} />
              </Cartao>
            )}
          </View>
        </Bloco>
      </View>

      {/* O RADAR DAS OITO FRENTES SAIU DAQUI.

          Ele fechava a tela com sono, energia, humor, saciedade, água,
          exercício, proteína e adesão numa figura só. As quatro primeiras
          são desta tela; as quatro últimas são o que a pessoa FEZ, e
          nenhum dos oito eixos é sintoma. Ele respondia bem uma pergunta
          que ninguém tinha feito aqui — e, fechando a tela, era a última
          coisa que ficava da visita.

          A leitura escrita dele continua nos Insights, que é onde a
          pergunta "onde o tratamento está apoiado" é feita. */}
    </TelaInterna>
  );
}
