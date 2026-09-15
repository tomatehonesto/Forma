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
        <Bloco titulo="O que é um protocolo">
          <Txt v="note" c={c.tx2}>
            É o combinado da semana com a sua equipe — o que manter, o que
            medir e o que resolver antes da próxima consulta. Ele muda de
            semana em semana, conforme a dose e o que os registros vêm
            mostrando.
          </Txt>
        </Bloco>

        {/* AS CINCO LINHAS, e a divisão que faz a tela ser honesta.

            Três delas o app conta sozinho, porque são exatamente o que as
            telas de água, alimentação e exercício registram o dia inteiro.
            Elas não têm caixinha: marcar "2,5 L todo dia" como cumprido
            num dia de meio litro seria deixar a pessoa contradizer o
            próprio caderno — e antes dava, porque a contagem ao lado era
            texto escrito à mão.

            As outras duas têm, porque não existe registro de onde tirar a
            resposta: o app não sabe se a dose foi aplicada nem se o exame
            foi agendado. Quem sabe é ela. */}
        <Bloco
          titulo="Esta semana"
          nota="Os três itens com contagem embaixo o app acompanha sozinho, pelos seus registros. Os outros dois são você quem marca."
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

        {/* O QUE VEM AÍ — e o que saiu daqui.

            Este bloco prometia: "vou preparar o protocolo da semana 12 com
            foco em proteína e hidratação". O app não prepara protocolo
            nenhum — quem escreve é a equipe —, e uma promessa que o
            software não cumpre é pior do que não dizer nada.

            Ficou o que é verdade e é útil: as duas datas que mexem na
            semana que vem, e o padrão do ciclo que a pessoa já vê na Home.

            Saiu também a lista de "semanas anteriores", que eram duas
            linhas cravadas no código — "Semana 9, 5 de 5 concluídos". O
            app guarda um protocolo só, o desta semana; as outras duas
            semanas eram história inventada sobre o tratamento de alguém. */}
        <Bloco titulo="O que vem aí">
          <Aviso
            ic="aura"
            destaque
            titulo={`A semana ${p.semana + 1}`}
            texto={[
              `Aplicação ${relDay(nextInjectionDate(S))}`,
              hasClinic(S) ? `consulta ${relDay(new Date(S.consult.t))}` : null,
            ].filter(Boolean).join(', ') + '. A fome costuma apertar nos primeiros dias depois da dose, e é quando a proteína e a água seguram mais.'}
            acao="A equipe revisa o protocolo na consulta. Até lá, os três itens medidos continuam contando sozinhos."
          />
        </Bloco>
      </FolhaDeHabito>
    </TelaDeHabito>
  );
}
