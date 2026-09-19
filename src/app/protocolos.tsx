import React from 'react';
import { View, Pressable } from 'react-native';
import { useAurora } from '../ui/aurora';
import { useRouter } from 'expo-router';
import { useStore } from '../logic/store';
import {
  clinicaConectada, historicoDeProtocolos, marcarTarefa, nextInjectionDate, protocoloDaSemana,
} from '../logic/derive';
import { fmtPeriodo, relDay } from '../logic/time';
import { Txt, Row, Chevron } from '../ui/kit';
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
           inventar um prazo que ninguém combinou.

           ⚠️ E O PRAZO ENTROU AQUI, vindo de um cartão que morava no pé da
           tela. Lá ele era um bloco com título "Semana 12" e duas datas
           que não abriam nada — a peça mais formal da tela dizendo a coisa
           menos acionável dela, depois de tudo. A data da próxima
           aplicação pertence à linha que já conta a semana: é o quando da
           mesma frase que diz o quanto. */
        linha={[
          `Semana ${p.semana}`,
          faltam === 0 ? 'tudo cumprido' : `${p.feitas} de ${p.total} cumpridas`,
          `aplicação ${relDay(nextInjectionDate(S))}`,
        ].join(' · ')}
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
          /* ⚠️ SEM NOTA, e ela já foi duas: a mecânica das caixas e, depois,
              o enquadramento inteiro da lista.

              Nenhuma das duas cabia aqui. Um parágrafo entre o título e a
              primeira linha atrasa a lista — e esta lista tem cinco itens
              curtos que se explicam com a contagem embaixo de cada um. O
              que precisava ser dito virou o cartão logo abaixo dela, onde
              ele é leitura e não pedágio. */
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
                    {/* ⚠️ A ETIQUETA SAIU — "Hidratação", "Aplicações". Ela
                        nasceu para dizer que a linha não era da pessoa para
                        marcar, e esse trabalho passou para a caixa
                        desligada, que diz a mesma coisa sem ocupar largura
                        nem pedir leitura. O que sobrava dela era o nome da
                        tela de destino, e para isso já existe a seta.

                        Cinco etiquetas cinzas empilhadas à direita também
                        eram uma coluna de ruído numa lista de cinco linhas:
                        o olho lia dez coisas onde havia cinco. */}
                    {t.nota ? (
                      <Txt v="caption" c={c.tx3} style={{ marginTop: 3 }}>{t.nota}</Txt>
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

        {/* ---- o enquadramento, depois da lista ----

            ⚠️ CINCO CAIXAS DE MARCAR NUMA TELA QUE VEIO DA CLÍNICA LEEM
            COMO COBRANÇA. Quem abre e vê "0 de 7 dias" na água sente que
            falhou com alguém — e não é isso: quem conduz o tratamento é a
            dose e o acompanhamento, e estas metas são o que ajuda em
            volta.

            ⚠️ E ELE FICA DEPOIS DA LISTA, e por um tempo esteve antes. Em
            cima ele era um parágrafo entre o título e a primeira linha —
            um pedágio para chegar ao que a pessoa veio ver. Embaixo, ele
            responde o que a lista acabou de provocar, que é quando a
            frase tem para quem falar.

            ⚠️ "RECOMEÇA NA PRÓXIMA" É FATO, E NÃO AFAGO: os manuais
            resetam na virada da semana e as métricas contam os registros
            da semana corrente. Consolo que não se sustenta em mecanismo
            vira promessa, e esta tela não faz promessa. */}
        <Aviso
          ic="bulb"
          titulo="Não fechar tudo está tudo bem"
          texto="Estas metas são jeitos de tirar mais do tratamento, e não uma lista de cobranças — quem conduz é a dose e o acompanhamento. O que não fechar recomeça na semana que vem, e as contagens acendem sozinhas pelos seus registros."
        />

        {/* ⚠️ O CARTÃO "SEMANA 12" SAIU DAQUI, e ele já tinha sido bloco de
            conselho, depois aviso de duas datas, e agora nada.

            O que restava dele era o prazo — a data da próxima aplicação —,
            e ele estava no pior lugar possível: a peça mais formal da
            tela, no pé, depois de tudo, dizendo a coisa menos acionável
            dela. Não abria nada, não pedia nada, e o título "Semana 12"
            nomeava uma semana que ainda não existe.

            O prazo subiu para a linha da capa, junto do "Semana 11 · 3 de
            5 cumpridas": é o QUANDO da mesma frase que já diz o QUANTO. A
            consulta não foi junto de propósito — ela tem tela própria, o
            cartão da aba Cuidado e a contagem do preparo, e repeti-la aqui
            seria a quarta cópia da mesma data. */}

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
