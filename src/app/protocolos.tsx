import React from 'react';
import { View, Pressable } from 'react-native';
import { useAurora } from '../ui/aurora';
import { useRouter } from 'expo-router';
import { useStore } from '../logic/store';
import {
  clinicaConectada, historicoDeProtocolos, marcarTarefa, nextInjectionDate, protocoloDaSemana,
  temConsulta,
} from '../logic/derive';
import { fmtPeriodo, relDay } from '../logic/time';
import { Txt, Row, Chevron } from '../ui/kit';
import { Icon } from '../ui/Icon';
import { Bloco, Cartao, Aviso, Selo } from '../ui/internas';
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


/* A CAIXA É A MESMA NAS CINCO — E QUATRO DELAS NÃO SÃO SUAS PARA MARCAR.

   ⚠️ A LISTA JÁ TEVE AS CINCO IGUAIS E JÁ TEVE DUAS FORMAS, e nenhuma das
   duas estava certa.

   Iguais e todas tocáveis: a pessoa marcava "beber 2,5 L todo dia" com um
   toque, e o "3 de 5 cumpridas" do topo passava a dizer que a semana foi
   cumprida porque alguém tocou, e não porque alguma coisa aconteceu.

   Duas formas — quadrado para marcar, redondo para ler: resolvia o
   engano e criava outro. A meta da água TEM conclusão, e ela é tão
   binária quanto a do exame; o redondo a transformava em medidor, como
   se ela nunca fechasse. Quem cumpre sete dias de proteína merece o
   mesmo visto de quem agendou o exame.

   ⚠️ ENTÃO A CAIXA FICA, E O QUE MUDA É DE QUEM ELA É. A do exame é da
   pessoa: vazia com borda, convidando o toque. As quatro medidas são do
   aplicativo: vazias, elas são uma caixa CHAPADA e sem borda — o desenho
   de controle desligado, que não pede toque. Cheias, as cinco são
   idênticas, porque cumprida é cumprida e a origem da conclusão não muda
   o que ela vale.

   A de baixo acende sozinha quando os registros da semana fecham a meta.
   Não há como marcá-la à mão, e não deveria haver: o que ela afirma é um
   fato, e fato não se digita. */
function Marcador({ feita, desligado }: { feita: boolean; desligado?: boolean }) {
  const { c } = useTheme();
  return (
    <View style={{
      width: 26, height: 26, borderRadius: 9,
      alignItems: 'center', justifyContent: 'center',
      backgroundColor: feita ? c.accent : desligado ? c.bg3 : 'transparent',
      borderWidth: feita || desligado ? 0 : 1.6,
      borderColor: c.line2,
    }}>
      {feita ? <Icon name="check" size={15} color={c.accentInk} sw={2.4} /> : null}
    </View>
  );
}

export default function Protocolos() {
  const aurora = useAurora();
  const S = useStore((s) => s.S);
  const update = useStore((s) => s.update);
  const { c } = useTheme();
  const router = useRouter();

  const p = protocoloDaSemana(S);
  const faltam = p.total - p.feitas;
  const historico = historicoDeProtocolos(S);

  return (
    <TelaDeHabito>
      <CapaDeHabito
        foto={aurora.hero}
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
        {/* FALAR COM A EQUIPE PRECISA DE EQUIPE DO OUTRO LADO — é a
            conversa, e não o fato de ter médico. Quem se trata com alguém
            fora da plataforma não tem para onde este botão ir. */}
        {clinicaConectada(S) ? (
          <AtalhoDaCapa
            titulo="Falar com a equipe"
            cheio
            onPress={() => router.push('/conversa' as any)}
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
            próprio diário — e antes dava, porque a contagem ao lado era
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
          nota="As caixas apagadas acendem sozinhas, pelos seus registros."
        >
          <Cartao>
            {p.tarefas.map((t) => {
              const corpo = (
                <Row gap={12} style={{ paddingHorizontal: 16, paddingVertical: 14, alignItems: 'flex-start' }}>
                  <Marcador feita={t.feita} desligado={t.medida} />
                  <View style={{ flex: 1 }}>
                    {/* Sem risco em cima do texto cumprido. O risco diz
                        "isto saiu da lista", e numa meta que se refaz toda
                        semana ela não sai de lugar nenhum — ela foi
                        alcançada, que é outra coisa. */}
                    <Txt v="body" c={t.feita ? c.tx3 : c.tx}>{t.texto}</Txt>
                    {/* A ETIQUETA DIVIDE A LINHA COM A CONTAGEM, e não com
                        o título. À direita do título ela roubava metade da
                        largura e quebrava "Beber 2,5 L todo dia" no meio;
                        aqui embaixo ela fica no mesmo lugar do olho — a
                        direita da linha — e o texto respira.

                        E as duas dizem a mesma coisa em ordens diferentes:
                        a contagem é o quanto já foi, a etiqueta é onde
                        isso acontece. */}
                    {t.nota || t.origem ? (
                      <Row style={{ marginTop: 3, alignItems: 'center', gap: 8 }}>
                        <Txt v="caption" c={c.tx3} style={{ flex: 1 }}>{t.nota}</Txt>
                        {t.medida && t.origem ? <Selo label={t.origem} tom="neutra" /> : null}
                      </Row>
                    ) : null}
                  </View>
                  {/* ⚠️ A SETA SÓ NA LINHA QUE LEVA A ALGUM LUGAR. A linha
                      manual se resolve aqui mesmo, com o toque na própria
                      caixa; a derivada se resolve em outra tela, e a seta é
                      o que diz isso. Duas linhas que respondem ao toque de
                      maneiras diferentes precisam parecer diferentes. */}
                  {t.medida ? <View style={{ marginTop: 3 }}><Chevron /></View> : null}
                </Row>
              );
              /* A MEDIDA NÃO SE MARCA, MAS LEVA A ALGUM LUGAR. Antes ela
                 era um bloco morto: tocar não fazia nada, e a pessoa
                 ficava sem saber onde aquilo acontece. Agora o toque abre
                 a tela que alimenta a contagem. */
              if (t.medida) {
                return (
                  <Pressable
                    key={t.i}
                    onPress={() => router.push((t.para ?? '/') as any)}
                    style={({ pressed }) => [{ opacity: pressed ? 0.6 : 1 }]}
                  >
                    {corpo}
                  </Pressable>
                );
              }
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
            temConsulta(S) ? `consulta ${relDay(new Date(S.consult.t))}` : null,
          ].filter(Boolean).join(', ') + '.'}
        />

        {/* AS SEMANAS ANTERIORES — três números por semana, sem uma linha
            de texto.

            O app guarda um protocolo só, o desta semana; o que sobrevive
            das anteriores são os REGISTROS, e deles saem as três metas que
            ele mede. Aplicação e exame ficam de fora porque não há registro
            de quem marcou o quê — e um "cumprido" sem lastro aqui seria a
            mesma história inventada que esta seção já teve uma vez.

            Os ícones são os das três telas de hábito, na mesma ordem da
            lista de cima: quem viu a lista lê a fileira sem legenda. */}
        {historico.length ? (
          <Bloco
            titulo="Semanas anteriores"
            nota="As metas de hoje, medidas nos registros de cada semana."
          >
            <Cartao>
              {historico.map((w) => (
                <Pressable
                  key={w.semana}
                  onPress={() => router.push(`/protocolo?t=${w.ate}` as any)}
                  style={({ pressed }) => [{ opacity: pressed ? 0.6 : 1 }]}
                >
                <Row style={{ paddingHorizontal: 16, paddingVertical: 13 }}>
                  <View style={{ flex: 1 }}>
                    <Txt v="body">Semana {w.semana}</Txt>
                    <Txt v="micro" c={c.tx4} style={{ marginTop: 2 }}>
                      {fmtPeriodo(new Date(w.de), new Date(w.ate))}
                    </Txt>
                  </View>
                  <Row gap={13}>
                    {w.metas.map((m) => {
                      const bateu = m.feito >= m.alvo;
                      return (
                        <Row key={m.ic} gap={4}>
                          <Icon name={m.ic} size={13} color={bateu ? c.accent : c.tx4} sw={2} />
                          <Txt v="micro" c={bateu ? c.accent : c.tx3}>{m.feito}/{m.alvo}</Txt>
                        </Row>
                      );
                    })}
                  </Row>
                  {/* A seta diz que a linha abre. Sem ela, três números
                      alinhados à direita parecem o fim da linha — e a
                      semana que dá para abrir some dentro do resumo que
                      ela deveria estar prometendo. */}
                  <View style={{ marginLeft: 10 }}><Chevron size={14} /></View>
                </Row>
                </Pressable>
              ))}
            </Cartao>
          </Bloco>
        ) : null}
      </FolhaDeHabito>
    </TelaDeHabito>
  );
}
