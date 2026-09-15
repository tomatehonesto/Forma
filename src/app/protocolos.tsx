import React from 'react';
import { View, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { useStore } from '../logic/store';
import { hasClinic, marcarTarefa, nextInjectionDate, protocoloDaSemana } from '../logic/derive';
import { relDay } from '../logic/time';
import { Txt, Row } from '../ui/kit';
import { Icon } from '../ui/Icon';
import { Bloco, Cartao, Aviso } from '../ui/internas';
import { AtalhoDaCapa, CapaDeHabito, FolhaDeHabito, TelaDeHabito } from '../ui/capa';
import { useTheme } from '../ui/useTheme';

/* ============================================================
   PROTOCOLOS

   O quarto item da lista de hábitos da Jornada, e o único que não é um
   hábito: os outros três são coisas que se faz, este é o combinado de
   fazê-las. É a semana traduzida em cinco linhas.

   A CAPA NÃO É FOTO, É A AURORA. As outras três abrem com a matéria do
   hábito — água, prato, movimento —, e um protocolo não tem matéria. A
   foto possível seria um caderno de papel com uma caneta ao lado, que é
   enfeite de banco de imagem: não diz nada que "1 de 5" não diga.

   A aurora diz. Ela já é, no resto do app, a cara do que o app e a
   equipe produzem — abre a Home, fecha o check-in, veste as descobertas.
   Usá-la aqui coloca o protocolo do lado certo da divisão: ele não é uma
   coisa do mundo que a pessoa registra, é um plano que alguém escreveu
   para ela.

   E A DIFERENÇA CARREGA SENTIDO, que é a única razão de uma exceção
   valer a pena numa família de telas.
   ============================================================ */

const AURORA = require('../../assets/images/aurora-hero.png');

export default function Protocolos() {
  const S = useStore((s) => s.S);
  const update = useStore((s) => s.update);
  const { c } = useTheme();
  const router = useRouter();

  const p = protocoloDaSemana(S);
  const faltam = p.total - p.feitas;

  return (
    <TelaDeHabito>
      <CapaDeHabito
        foto={AURORA}
        titulo="Protocolos"
        /* A SEMANA, e não o dia. As outras três capas contam hoje porque
           água, proteína e movimento se refazem todo dia; um protocolo é
           um acordo de sete dias, e cobrar dele um número diário seria
           inventar um prazo que ninguém combinou. */
        linha={faltam === 0
          ? `Semana ${p.semana} · tudo cumprido`
          : `Semana ${p.semana} · ${p.feitas} de ${p.total} cumpridas`}
        pct={p.pct}
      >
        {/* O atalho leva a quem escreveu o protocolo. É a única ação que
            esta tela tem além de marcar as linhas — e ela existe porque a
            pergunta que sobra depois de ler os cinco itens costuma ser
            para a equipe, não para o app. */}
        {hasClinic(S) ? (
          <AtalhoDaCapa
            titulo="Falar com a equipe"
            cheio
            onPress={() => router.push('/medico' as any)}
          />
        ) : null}
      </CapaDeHabito>

      <FolhaDeHabito>
        {/* SEM O PARÁGRAFO DE ABERTURA que as outras três telas têm.

            Lá ele explica por que um app de GLP-1 conta água, proteína e
            movimento — que é uma afirmação de tratamento, e precisa ser
            dita. Aqui ele explicava o que é uma lista de tarefas
            combinada com a médica. A tela é uma lista de cinco linhas: ou
            ela se explica sozinha, ou não é o texto que vai salvá-la. */}

        {/* AS CINCO LINHAS, e a divisão que faz a tela ser honesta.

            Três delas o app conta sozinho, porque são exatamente o que as
            telas de água, alimentação e exercício registram o dia inteiro.
            Elas não têm caixinha: marcar "2,5 L todo dia" como cumprido
            num dia de meio litro seria deixar a pessoa contradizer o
            próprio caderno — e antes dava, porque a contagem ao lado era
            texto escrito à mão.

            As outras duas têm, porque não existe registro de onde tirar a
            resposta: o app não sabe se a dose foi aplicada nem se o exame
            foi agendado. Quem sabe é ela.

            A NOTA SOBROU DE DUAS FRASES PARA MEIA. A regra inteira estava
            escrita ali — quais contam sozinhos, quais você marca —, e a
            tela já mostra as duas coisas: o que tem contagem embaixo não
            tem caixinha. A frase que resta existe só para ninguém ficar
            tocando na linha da água esperando que ela acenda. */}
        <Bloco
          titulo="Esta semana"
          nota="O que tem contagem vem dos seus registros."
        >
          <Cartao>
            {p.tarefas.map((t) => {
              const corpo = (
                <Row gap={12} style={{ paddingHorizontal: 16, paddingVertical: 14, alignItems: 'flex-start' }}>
                  {t.medida ? (
                    /* REDONDO, e não quadrado: caixa quadrada pede toque, e
                       esta linha não aceita nenhum — ela se cumpre bebendo,
                       comendo e andando. A forma é a única diferença que
                       sobrevive ao item cumprido, quando os dois ficam
                       azuis com um visto dentro. */
                    <View style={{
                      width: 26, height: 26, borderRadius: 13,
                      alignItems: 'center', justifyContent: 'center',
                      backgroundColor: t.feita ? c.accent : c.accentWeak,
                    }}>
                      <Icon
                        name={t.feita ? 'check' : 'barchart'}
                        size={14}
                        color={t.feita ? c.accentInk : c.accent}
                        sw={2.2}
                      />
                    </View>
                  ) : (
                    <View style={{
                      width: 26, height: 26, borderRadius: 9,
                      borderWidth: 1.6, borderColor: t.feita ? c.accent : c.line2,
                      backgroundColor: t.feita ? c.accent : 'transparent',
                      alignItems: 'center', justifyContent: 'center',
                    }}>
                      {t.feita ? <Icon name="check" size={15} color={c.accentInk} sw={2.4} /> : null}
                    </View>
                  )}
                  <View style={{ flex: 1 }}>
                    {/* Sem risco em cima do texto cumprido. O risco diz
                        "isto saiu da lista", e numa meta que se refaz toda
                        semana ela não sai de lugar nenhum — ela foi
                        alcançada, que é outra coisa. */}
                    <Txt v="body" c={t.feita ? c.tx3 : c.tx}>{t.texto}</Txt>
                    {t.nota ? (
                      <Txt v="caption" c={c.tx3} style={{ marginTop: 2 }}>{t.nota}</Txt>
                    ) : null}
                  </View>
                </Row>
              );
              if (t.medida) return <View key={t.i}>{corpo}</View>;
              return (
                <Pressable
                  key={t.i}
                  onPress={() => update((s: any) => marcarTarefa(s, t.i))}
                  style={({ pressed }) => [{ opacity: pressed ? 0.6 : 1 }]}
                >
                  {corpo}
                </Pressable>
              );
            })}
          </Cartao>
        </Bloco>

        {/* O QUE VEM AÍ — uma linha, e não um cartão de conselho.

            Aqui houve um bloco com título, três linhas de texto e um "o
            que fazer". Dele só as duas datas mudavam alguma coisa: o
            resto era a fome perto da dose, que a Home diz todo dia, e uma
            frase dizendo que a equipe revisa o protocolo na consulta —
            explicação de como o app funciona, vestida de conselho.

            Antes disso, o mesmo bloco prometia "vou preparar o protocolo
            da semana 12", que o app não faz. Cada volta tirou uma camada;
            o que restou é o que a semana tem de concreto. */}
        <Aviso
          ic="cal"
          titulo={`Semana ${p.semana + 1}`}
          texto={[
            `Aplicação ${relDay(nextInjectionDate(S))}`,
            hasClinic(S) ? `consulta ${relDay(new Date(S.consult.t))}` : null,
          ].filter(Boolean).join(', ') + '.'}
        />
      </FolhaDeHabito>
    </TelaDeHabito>
  );
}
