import React from 'react';
import { View, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { useStore } from '../logic/store';
import {
  M, adesao, canetaAtual, cicloFases, constanciaDaGrade, injCalendar,
  nextInjectionDate, nextSite, pharmaSeries, siteLabel,
  cadenciaTexto,
  doseDoPerfil,
  diasAteAplicar,
} from '../logic/derive';
import { now, diffDays, fmtDate, relDay, doseTxt, quandoEm, maiuscula, dataComDiaDaSemana } from '../logic/time';
import { formaDe, nesteNesta, nomeDaMolecula } from '../logic/formas';
import { T } from '../textos';

/* ⚠️ É FUNÇÃO, e não constante de módulo: ela lê o catálogo, e constante
   de módulo congela o idioma no import. */
const K = () => T.tratamento.telaAplicacoes;
import { Txt, Row } from '../ui/kit';
import { alertasDe, proximaDe, quando, inicialDoDia } from '../logic/alertas';
import { Icon } from '../ui/Icon';
import { AreaCurve } from '../ui/charts';
import {
  TelaInterna, Titulao, Bloco, Cartao, Linha, Botao,
} from '../ui/internas';
import { useTheme } from '../ui/useTheme';
import { radius, shadowCard } from '../theme';

/* ============================================================
   APLICAÇÕES

   A tela da caneta — e agora ela é a única. O assunto morava em quatro
   telas que não se falavam:

     /aplicacoes          próxima dose, constância, curva, histórico
     /proxima-aplicacao   a mesma próxima dose, com outro desenho
     /ciclo               as quatro fases do efeito
     /caneta              doses, validade e receita

   /PROXIMA-APLICACAO FOI ABSORVIDA E APAGADA. Dela, o contador já existia
   aqui; o carrossel de fases era uma segunda versão do que /ciclo conta
   melhor — e com número diferente, cinco fases lá contra quatro lá; os
   três cartões de "preparar agora" eram proteína, água e sono escritos no
   código, com seta de navegação e nenhum destino; e fechava com um
   cartão de marketing sobre privacidade. Sobrava um botão de informação
   no cabeçalho que não abria nada.

   /CICLO E /CANETA FICAM, porque têm conteúdo próprio de verdade — e
   passam a ter porta fixa daqui. A da caneta era condicional: só aparecia
   na Jornada quando o estoque estava baixo, então quem quisesse conferir
   a validade com a caneta cheia não tinha como chegar lá.

   E O ESTOQUE AQUI ERA INVENTADO: "validade jun/2026 · lote 2K4F1" e "3
   doses" escritos à mão, ao lado de um canetaAtual() que sabe as três
   coisas de verdade. O app nunca perguntou lote nem validade a ninguém.
   ============================================================ */

export default function Aplicacoes() {
  const S = useStore((s) => s.S);
  const { c } = useTheme();
  const router = useRouter();

  const med = M(S);
  const nd = nextInjectionDate(S);
  const ndDays = diasAteAplicar(S);
  const site = nextSite(S);
  const cal = injCalendar(S);
  const k = canetaAtual(S);
  const cic = cicloFases(S);
  /* OS ALERTAS DE DOSE, e não mais "o lembrete". Agora podem ser
     vários: a linha conta quantos estão ligados e quando toca o primeiro
     deles — que é o que interessa a quem está olhando o ciclo. */
  const alertasDaDose = alertasDe(S, 'dose').filter((a) => a.on);
  const rem = quando(alertasDaDose.map((a) => proximaDe(S, a)).filter(Boolean).sort((x, y) => +x! - +y!)[0] ?? null);

  /* A fração da constância, e ela fala DA GRADE — não do tratamento
     inteiro. Era "88% em dia", e "em dia" fala de PONTUALIDADE, que esta
     conta não mede: quem aplicou as dez doses sempre com três dias de
     atraso também dava 100%. Virou fração, e a fração contava dez semanas
     debaixo de uma grade de seis. Agora as duas contam o mesmo período, e
     o número de semanas vem da mesma linha que desenha as células. */
  const constancia = constanciaDaGrade(S);

  const ph = pharmaSeries(S);
  const t0 = ph.pts[0].t, t1 = ph.pts[ph.pts.length - 1].t;
  const phPts = ph.pts.map((p) => ({ x: (p.t - t0) / (t1 - t0), y: p.n }));
  const tNow = +now();
  let mkIdx = 0; ph.pts.forEach((p, i) => { if (Math.abs(p.t - tNow) < Math.abs(ph.pts[mkIdx].t - tNow)) mkIdx = i; });

  /* ⚠️⚠️ SEM NENHUMA APLICAÇÃO, TRÊS COISAS DESTA TELA FALAM DE UM
     PASSADO QUE NÃO EXISTE.

     "Nível no corpo" desenha uma curva farmacológica que, sem dose
     nenhuma no passado, é uma reta no zero — e embaixo dela uma frase
     explicando o ponto mais baixo de uma descida que não acontece. O
     mesmo zero já tinha causado estrago na Home: ver a nota em
     `pharmaSeries`, em logic/derive, sobre o vale de mentira.

     "Histórico" abre com a próxima dose e fecha sem nenhuma linha
     embaixo — um cartão com um item só, que é justamente o item que o
     cartão de cima da tela já anuncia em letra grande.

     E a fração da constância sai "0 de 0 doses previstas", que é a
     conta certa para uma pergunta que ainda não foi feita. A GRADE
     FICA: ela mostra a próxima dose tracejada e os dias da semana, e
     isso vale para quem ainda vai aplicar a primeira.

     O que sobra é uma tela coerente de quem está começando — quando é a
     próxima, o ciclo, o medicamento, os alertas, e o botão de registrar
     no rodapé. */
  const semAplicacao = !S.injections.length;

  const doseStr = doseDoPerfil(S);

  return (
    <TelaInterna
      titulo={K().titulo}
      rodape={<Botao label={K().registrar} onPress={() => router.push('/aplicacao' as any)} />}
    >
      <Titulao
        titulo={K().titulo}
        lead={K().lead(med.label, nomeDaMolecula(med.mol), cadenciaTexto(S))}
      />

      {/* A PRÓXIMA DOSE, e agora ela tem o cartão inteiro.

          ⚠️⚠️ O ANEL SAIU. Ele desenhava a volta da semana com "5/7" no
          meio, e a fração era o dia do ciclo — mas nada no cartão dizia
          isso. Um anel ao lado de "Em 3 dias" pede para ser lido como a
          contagem que está do lado dele, e não era: um descia de 7 para
          0 e o outro subia de 1 para 7, no mesmo cartão, sem rótulo que
          os separasse.

          E o assunto já tem lugar próprio três centímetros abaixo: a
          linha "Ciclo da dose" diz "Dia 5 de 7" com a palavra na frente
          e ainda explica a fase — "efeito cedendo, fome voltando aos
          poucos". Duas leituras do mesmo número, e a de baixo é a que se
          entende sozinha.

          Sem o anel, o cartão é o que ele sempre quis ser: uma pergunta e
          a resposta dela, em três linhas de largura inteira. A data
          passa a vir do formatador da casa, por extenso, em vez de duas
          chamadas coladas com uma vírgula escrita à mão — que em inglês
          saía "Sat, Sep 27" com a vírgula do português.

          E o botão de registrar saiu daqui para o rodapé. Ele gravava na
          hora — hora de agora, local sugerido, dose atual —, pulando o
          formulário que existe ao lado e que faz tudo isso com escolha.
          Duas portas para a mesma sala, e a de dentro do cartão fazia
          menos. */}
      <View style={{ backgroundColor: c.accentWeak, borderRadius: radius.card, padding: 18 }}>
        <Txt v="micro" c={c.accent} style={{ letterSpacing: 1 }}>{K().proximaAplicacao}</Txt>
        <Txt v="display" style={{ fontSize: 30, lineHeight: 36, marginTop: 6 }}>
          {maiuscula(quandoEm(ndDays).label)}
        </Txt>
        <Txt v="caption" c={c.tx2} style={{ marginTop: 3 }}>
          {maiuscula(dataComDiaDaSemana(nd))} · {doseStr}
        </Txt>
      </View>

      {/* AS OUTRAS DUAS TELAS DO ASSUNTO, com porta fixa.

          A da caneta era condicional: só aparecia na Jornada quando o
          estoque estava baixo. Quem quisesse conferir a validade com a
          caneta cheia não tinha como chegar lá — uma tela que só existe
          quando dá problema. */}
      <Cartao>
        {/* A FASE PELO QUE ELA CAUSA, e não pelo título dela. O título da
            fase é "Dias 5–6 · descida", que ao lado de "Dia 5 de 7" diz o
            intervalo duas vezes e a palavra nova só no fim. O sub da fase
            é a frase que explica: "efeito cedendo, fome voltando aos
            poucos". */}
        <Linha
          ic="waves"
          titulo={K().cicloDaDose}
          sub={K().cicloSub(cic.dayIn, cic.total, cic.fases.find((f) => f.estado === 'agora')?.sub ?? K().emCurso)}
          onPress={() => router.push('/ciclo' as any)}
        />
        {/* O ESTOQUE SAI DE canetaAtual(), e não do código. Aqui havia
            "Validade jun/2026 · lote 2K4F1" e uma pastilha "3 doses"
            escritos à mão — o app nunca perguntou lote nem validade a
            ninguém, e o número de doses estava a uma chamada de função de
            distância. */}
        {/* O VEREDITO ENTRA NO TEXTO, e não numa pastilha ao lado. Em
            pastilha, "Vale renovar a receita" espremia o título em duas
            linhas e o sub em três — a linha ficava mais alta que as duas
            vizinhas somadas para dizer a mesma coisa. */}
        <Linha
          ic="pill"
          titulo={K().medicamento}
          /* ⚠️ O QUE RESTA, E NÃO O QUE FOI USADO. Dizia "0 de 4 doses
             usadas" para quem abriu o recipiente e ainda não aplicou
             nada — uma contagem que obriga a subtrair para responder a
             única pergunta que interessa ali: dá para esperar até a
             próxima consulta? */
          sub={k.verdict.good
            ? K().dosesRestantesNo(k.left, nesteNesta(formaDe(S)))
            : K().cobreSemanas(k.verdict.label, Math.round(k.semanas))}
          onPress={() => router.push('/caneta' as any)}
        />
        <Linha
          ic="bell"
          titulo={alertasDaDose.length ? K().alertasDeDose(alertasDaDose.length) : K().nenhumAlerta}
          sub={rem ? K().tocaEm(rem) : K().avisoAntes}
          onPress={() => router.push('/lembretes' as any)}
        />
      </Cartao>

      {/* ⚠️ O MAPA DO RODÍZIO SAIU DAQUI, e com ele a silhueta.

          Ele desenhava os seis locais por tom de descanso, com legenda
          de duas linhas e o contorno tracejado no próximo da rotação —
          e era o único bloco desta tela que não falava da dose.

          A ROTAÇÃO CONTINUA, no lugar em que ela decide alguma coisa:
          /aplicacao traz a região sugerida já marcada e, embaixo do
          lado, escreve há quanto tempo aquele ponto descansa e se ele é
          o próximo. O histórico daqui, mais abaixo, continua dizendo o
          local de cada aplicação.

          `rodizioDeLocais`, em logic/derive, fica — é o formulário que
          a chama. A silhueta não: ui/corpo perdeu as duas telas que a
          usavam e foi apagada. Está no histórico do git. */}

      {/* A CONSTÂNCIA — seis semanas, sem punição por dia perdido. */}
      <Bloco
        titulo={K().constancia}
        nota={semAplicacao
          ? undefined
          : K().constanciaNota(constancia.feitas, constancia.previstas, constancia.semanas)}
      >
        <View style={[{ backgroundColor: c.bg1, borderRadius: radius.card, padding: 16 }, shadowCard(c)]}>
          <Row style={{ flexWrap: 'wrap' }}>
            {/* ⚠️ AS SETE INICIAIS ESTAVAM ESCRITAS À MÃO em português —
                D S T Q Q S S —, e em alemão a fileira saía assim mesmo.
                `inicialDoDia` já existia em logic/alertas, e devolve a
                inicial no idioma de quem lê. */}
            {[0, 1, 2, 3, 4, 5, 6].map((wd) => inicialDoDia(wd)).map((d, i) => (
              <View key={`h${i}`} style={{ width: '14.28%', alignItems: 'center', paddingVertical: 4 }}>
                <Txt v="micro" c={c.tx4}>{d}</Txt>
              </View>
            ))}
            {cal.map((cell, i) => (
              <View key={i} style={{ width: '14.28%', alignItems: 'center', paddingVertical: 3 }}>
                <View style={{
                  width: 30, height: 30, borderRadius: 10, alignItems: 'center', justifyContent: 'center',
                  backgroundColor: cell.applied ? c.accentWeak : 'transparent',
                  borderWidth: cell.applied || cell.planned || cell.today ? 1.2 : 0,
                  borderColor: cell.applied ? c.accentLine : cell.planned ? c.tx4 : c.accent2,
                  borderStyle: cell.planned ? 'dashed' : 'solid',
                }}>
                  <Txt v="micro" c={cell.applied ? c.accent : cell.today ? c.accent2 : c.tx3}>{cell.day}</Txt>
                </View>
              </View>
            ))}
          </Row>
          <Row gap={16} style={{ marginTop: 10 }}>
            <Row gap={5}>
              <View style={{ width: 10, height: 10, borderRadius: 3, backgroundColor: c.accentWeak, borderWidth: 1, borderColor: c.accentLine }} />
              <Txt v="micro" c={c.tx3}>{K().aplicada}</Txt>
            </Row>
            <Row gap={5}>
              <View style={{ width: 10, height: 10, borderRadius: 3, borderWidth: 1, borderColor: c.tx4, borderStyle: 'dashed' }} />
              <Txt v="micro" c={c.tx3}>{K().proxima}</Txt>
            </Row>
          </Row>
          <Txt v="micro" c={c.tx3} style={{ marginTop: 10, lineHeight: 16 }}>
            {K().semCulpa}
          </Txt>
        </View>
      </Bloco>

      {/* A CURVA — a única coisa da tela que explica o que se sente. */}
      {semAplicacao ? null : (
      <Bloco titulo={K().nivelNoCorpo}>
        <View style={[{ backgroundColor: c.bg1, borderRadius: radius.card, padding: 16 }, shadowCard(c)]}>
          <AreaCurve pts={phPts} height={130} marker={mkIdx} id="ph" />
          <Txt v="caption" c={c.tx3} style={{ marginTop: 8, lineHeight: 18 }}>
            {K().nivelTexto(
              T.comum.noMeio(nomeDaMolecula(med.mol)),
              med.hl >= 1 ? K().meiaVidaDias(med.hl) : K().meiaVidaHoras,
            )}
          </Txt>
        </View>
      </Bloco>
      )}

      {/* O HISTÓRICO NÃO SE APAGA, e isso é decisão de produto.

          Cheguei a pôr a lixeira aqui, pela mesma regra da água e do
          treino: o que o app deixa criar, ele tem de deixar desfazer. Mas
          uma aplicação não é um copo d'água. Ela é registro de
          medicamento injetado — o que a equipe lê na consulta, o que
          conta a história do tratamento — e um toque errado apagando uma
          dose da semana passada some com um fato clínico.

          Fica a lista, e só. Quem registrou errado corrige com quem
          acompanha; o app não tem por que oferecer a borracha. */}
      {semAplicacao ? null : (
      <Bloco titulo={K().historico}>
        <Cartao>
          <Row gap={12} style={{ paddingHorizontal: 16, paddingVertical: 13 }}>
            <View style={{
              width: 30, height: 30, borderRadius: 15, borderWidth: 1.4, borderColor: c.accent2,
              borderStyle: 'dashed', alignItems: 'center', justifyContent: 'center',
            }}>
              <Icon name="syringe" size={14} color={c.accent2} sw={2} />
            </View>
            <View style={{ flex: 1 }}>
              <Txt v="body" c={c.tx3}>{K().proximaEmLocal(siteLabel(site))}</Txt>
              <Txt v="caption" c={c.tx4} style={{ marginTop: 1 }}>
                {maiuscula(relDay(nd))} · {fmtDate(nd)}
              </Txt>
            </View>
          </Row>
          {S.injections.slice().reverse().map((i: any) => (
            <Row key={i.t} gap={12} style={{ paddingHorizontal: 16, paddingVertical: 13 }}>
              <View style={{
                width: 30, height: 30, borderRadius: 15, backgroundColor: c.accentWeak,
                alignItems: 'center', justifyContent: 'center',
              }}>
                <Icon name="check" size={14} color={c.accent} sw={2.4} />
              </View>
              <View style={{ flex: 1 }}>
                <Txt v="body">{doseTxt(i.dose)} {med.unit} · {siteLabel(i.site)}</Txt>
                <Txt v="caption" c={c.tx3} style={{ marginTop: 1 }}>
                  {fmtDate(new Date(i.t))} · {relDay(new Date(i.t))}
                </Txt>
              </View>
            </Row>
          ))}
        </Cartao>
      </Bloco>
      )}
    </TelaInterna>
  );
}
