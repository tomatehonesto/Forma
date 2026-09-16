import React, { useState } from 'react';
import { View } from 'react-native';
import { useRouter } from 'expo-router';
import { useStore } from '../logic/store';
import {
  apagarGole, diasDeAgua, golesDoDia, litros, registrarAgua, semanaDeAgua, waterMlToday,
} from '../logic/derive';
import { hm, now, startOfDay } from '../logic/time';
import { Txt, Row, Vazio } from '../ui/kit';
import { Icon } from '../ui/Icon';
import {
  Bloco, CardSemana, Cartao, Linha, ItemApagavel, TiraDeDias,
} from '../ui/internas';
import { AtalhoDaCapa, CapaDeHabito, FolhaDeHabito, TelaDeHabito } from '../ui/capa';
import { useTheme } from '../ui/useTheme';
import { radius } from '../theme';

/* ============================================================
   ÁGUA

   A água era o único dos três hábitos sem tela. Alimentação e exercício
   têm a sua — o número do dia, a semana, o diário —, e a água tinha um
   botão que abria a folha de registro e mais nada: dava para BEBER e não
   dava para OLHAR. Ontem, a semana, o copo que entrou errado: nada disso
   existia em lugar nenhum.

   E a pergunta da água é uma pergunta de dias. Um copo não quer dizer
   nada sozinho; o que muda o tratamento é se a pessoa está chegando
   perto dos 2,5 L com alguma regularidade, e isso só se vê numa fileira
   de sete.

   O TOPO É A PRÓPRIA ÁGUA, e não um cartão falando dela — a capa que as
   três telas de hábito passaram a dividir. Ver src/ui/capa.tsx.

   E O PARÁGRAFO DE ABERTURA SAIU, como nas outras duas. Ele explicava
   POR QUE um app de GLP-1 tem tela de água: comendo menos, entra menos
   água pela comida, e ela é boa parte do que se bebe sem perceber —
   beber de propósito é o que cobre a diferença. O argumento continua de
   pé, e continua aqui, que é onde ele muda decisão de código; na tela
   ele era um texto lido uma vez e rolado por cima nas outras cem.
   ============================================================ */

/* Trinta dias na tira, como no diário de refeições, e pelo mesmo motivo:
   não há seletor de período porque não há mais nada na tela que responda
   a ele. */
const DIAS_DA_TIRA = 30;

/* Os recipientes que a capa oferece — os mesmos nomes que a folha de
   registro usa, para as duas telas falarem a mesma língua. O porquê de
   eles gravarem direto está na capa, onde eles são usados. */
const ATALHOS: [string, number][] = [
  ['Copo', 250],
  ['Garrafa', 500],
];

export default function Agua() {
  const S = useStore((s) => s.S);
  const update = useStore((s) => s.update);
  const { c } = useTheme();
  const router = useRouter();

  const alvo = (S.profile as any).targets.waterMl as number;
  const hoje = waterMlToday(S);
  const falta = Math.max(0, alvo - hoje);
  const pct = Math.round((hoje / alvo) * 100);

  const semana = semanaDeAgua(S);
  const diasComRegistro = semana.filter((d) => d.ml > 0).length;
  /* Média dos dias REGISTRADOS, como na proteína. Dividir por sete
     transformaria um dia esquecido num dia de sede. */
  const media = diasComRegistro
    ? Math.round(semana.reduce((x, d) => x + d.ml, 0) / diasComRegistro)
    : 0;

  const [diaSel, setDiaSel] = useState<number>(() => +startOfDay(now()));
  const calendario = diasDeAgua(S, DIAS_DA_TIRA);
  const doDia = golesDoDia(S, diaSel);
  const mlDoDia = doDia.reduce((x, g) => x + g.ml, 0);

  const lembrete = (S as any).reminders?.agua;

  return (
    <TelaDeHabito>
      {/* A CAPA. O número grande é a proporção do dia; a linha de cima é
          a quantidade por extenso. Ver src/ui/capa.tsx. */}
      <CapaDeHabito
        foto={require('../../assets/images/agua-hero.jpg')}
        titulo="Água"
        /* O QUE FALTA, e não só o quanto já foi. É a mesma informação
           resolvida: "faltam 2 L" é o que decide se vale encher a
           garrafa agora, e era o que o cartão do dia dizia antes de a
           capa absorvê-lo. */
        linha={hoje === 0
          ? `Hoje: nada registrado · meta de ${litros(alvo)} L`
          : `Hoje: ${litros(hoje)} de ${litros(alvo)} L · ${falta > 0 ? `faltam ${litros(falta)} L` : 'meta alcançada'}`}
        pct={pct}
      >
        {/* OS ATALHOS, e a decisão que eles revertem.

            Na folha de registro, tocar em "Garrafa" NÃO grava: soma no
            montador, e quem grava é o botão de baixo. Isso foi de
            propósito, e continua certo lá — lá a pessoa está compondo uma
            quantidade, e um toque que gravasse sozinho atrapalharia quem
            bebeu um copo e meio.

            Aqui é o contrário: o toque É a interação inteira. Não há
            montador para alimentar, e cobrar duas telas de quem bebeu um
            copo é cobrar o preço de um formulário por um gesto de dois
            segundos.

            E o que tornava isso arriscado deixou de existir: agora cada
            gole é um registro com hora e lixeira no diário logo abaixo.
            O medo de um toque errado era o medo de um toque IRREVERSÍVEL.

            A água é o único dos três hábitos em que um toque completa um
            registro — um copo é uma quantidade inteira. Refeição precisa
            do prato, treino precisa do tempo, e por isso as capas delas
            têm um botão só, que abre a folha. */}
        {ATALHOS.map(([nome, ml]) => (
          <AtalhoDaCapa
            key={nome}
            titulo={`+ ${nome}`}
            sub={`${litros(ml)} L`}
            onPress={() => update((s: any) => registrarAgua(s, ml))}
          />
        ))}
        <AtalhoDaCapa
          titulo="Outra"
          sub="quantidade"
          cheio
          onPress={() => router.push('/medir-agua' as any)}
        />
      </CapaDeHabito>

      <FolhaDeHabito>
          {/* A SEMANA.

              As barras chegam em MILILITROS, que é a unidade em que a
              altura e a meta se comparam sem arredondar nada; quem traduz
              para litro é o rótulo. */}
          <Bloco titulo="A água da semana">
          <CardSemana
            nome="Esta semana"
            sub={diasComRegistro === 0
              ? 'Nada registrado nos últimos sete dias'
              : `Média de ${diasComRegistro} ${diasComRegistro === 1 ? 'dia registrado' : 'dias registrados'}`}
            valor={litros(media)}
            unidade="L"
            dias={semana.map((d) => ({ t: d.t, v: d.ml }))}
            alvo={alvo}
            rotuloMeta={`Meta: ${litros(alvo)} L`}
            rotulo={litros}
          />
          </Bloco>

          {/* O DIÁRIO DE ÁGUA — e a saída que a água não tinha.

              Beber era a única coisa deste app sem volta: um toque errado
              em "Garrafão" somava um litro para sempre, e a pessoa via o
              número errado sabendo que estava errado. Aqui cada gole tem
              hora e lixeira, e apagar devolve ao dia só o que aquele gole
              somou.

              A hora não é enfeite: é ela que identifica o registro para
              quem está procurando qual apagar. Entre dois copos de
              0,25 L, o que diferencia um do outro é "às 7:18". */}
          <Bloco
            titulo="Diário de água"
            nota="Cada registro com a hora em que entrou. Apague o que tiver entrado errado."
          >
            <View style={{ gap: 10 }}>
              <TiraDeDias
                dias={calendario.map((d) => ({ t: d.t, marcado: d.itens > 0, hoje: d.hoje }))}
                sel={diaSel}
                onEscolhe={setDiaSel}
              />

              {doDia.length ? (
                <View style={{ gap: 10 }}>
                  <Cartao>
                    {doDia.map((g) => (
                      <ItemApagavel
                        key={g.t ?? 'dia'}
                        pergunta={g.t == null
                          ? 'Apagar a água deste dia?'
                          : `Apagar ${litros(g.ml)} L das ${hm(new Date(g.t).getHours(), new Date(g.t).getMinutes())}?`}
                        onApagar={() => update((s: any) => apagarGole(s, diaSel, g.t))}
                      >
                        <Row gap={12}>
                          {/* Um glifo, e não o número em mililitros. O selo
                              trazia "250" ao lado de "0,25 L" — o mesmo fato
                              duas vezes em duas unidades, e sem dizer de qual
                              delas eram os 250. */}
                          <View style={{
                            width: 34, height: 34, borderRadius: radius.md,
                            backgroundColor: c.accentWeak, alignItems: 'center', justifyContent: 'center',
                          }}>
                            <Icon name="water" size={17} color={c.accent} sw={1.9} />
                          </View>
                          <View style={{ flex: 1 }}>
                            <Txt v="body">{litros(g.ml)} L</Txt>
                            {/* O DIA SEM HORA é dito, e não maquiado. Um
                                registro de antes de o diário existir sabe o
                                total e não sabe quando: inventar "08:00" para
                                preencher a linha seria escrever no diário da
                                pessoa uma coisa que ela não escreveu. */}
                            <Txt v="caption" c={c.tx3} style={{ marginTop: 2 }}>
                              {g.t == null
                                ? 'Total do dia, sem registro de horário'
                                : `às ${hm(new Date(g.t).getHours(), new Date(g.t).getMinutes())}`}
                            </Txt>
                          </View>
                        </Row>
                      </ItemApagavel>
                    ))}
                  </Cartao>
                  {/* O total embaixo, que é o que a soma das linhas deu. */}
                  <Txt v="micro" c={c.tx4} style={{ textAlign: 'center' }}>
                    {doDia.length} {doDia.length === 1 ? 'registro' : 'registros'} · {litros(mlDoDia)} L
                  </Txt>
                </View>
              ) : (
                <Vazio
                  ic="water"
                  titulo="Nada registrado neste dia"
                  texto="O que você anotar entra no total do dia."
                />
              )}
            </View>
          </Bloco>

          {/* O LEMBRETE.

              É a única coisa que muda o comportamento da água e não é um
              número: quem esquece de beber não esquece por não saber
              quanto falta, esquece por estar fazendo outra coisa. O ajuste
              mora em Lembretes com os outros; aqui fica o atalho e o
              estado atual, porque "desligado" é a resposta que explica uma
              semana fraca. */}
          <Bloco titulo="Lembrete">
            <Cartao>
              <Linha
                ic="bell"
                titulo={lembrete?.on ? 'Lembrete ligado' : 'Lembrete desligado'}
                sub={lembrete?.on
                  ? `Todo dia às ${hm(lembrete.hour ?? 0, lembrete.min ?? 0)}`
                  : 'Um toque por dia, na hora que você escolher'}
                onPress={() => router.push('/lembretes' as any)}
              />
            </Cartao>
          </Bloco>
      </FolhaDeHabito>
    </TelaDeHabito>
  );
}
