import React from 'react';
import { View, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { useStore } from '../logic/store';
import {
  M, adesao, apagarAplicacao, canetaAtual, cicloFases, doseReminderDate, injCalendar,
  nextInjectionDate, nextSite, pharmaSeries, reminderWhen, siteLabel,
} from '../logic/derive';
import { now, diffDays, fmtWD, fmtDate, relDay, nf } from '../logic/time';
import { Txt, Row } from '../ui/kit';
import { Icon } from '../ui/Icon';
import { AreaCurve } from '../ui/charts';
import {
  TelaInterna, Titulao, Bloco, Cartao, Linha, Botao, ItemApagavel,
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
  const update = useStore((s) => s.update);
  const { c } = useTheme();
  const router = useRouter();

  const med = M(S);
  const nd = nextInjectionDate(S);
  const ndDays = diffDays(nd, now());
  const site = nextSite(S);
  const cal = injCalendar(S);
  const k = canetaAtual(S);
  const cic = cicloFases(S);
  const rem = reminderWhen(doseReminderDate(S));

  /* Quantas doses o tratamento previa até hoje, e quantas foram
     registradas. Era "88% em dia" — e "em dia" fala de PONTUALIDADE,
     que é coisa que esta conta não mede: quem aplicou as dez doses
     sempre com três dias de atraso também dava 100%. A fração diz o que
     a conta de fato sabe. */
  const previstas = Math.round((S.injections.length * 100) / Math.max(1, adesao(S)));

  const ph = pharmaSeries(S);
  const t0 = ph.pts[0].t, t1 = ph.pts[ph.pts.length - 1].t;
  const phPts = ph.pts.map((p) => ({ x: (p.t - t0) / (t1 - t0), y: p.n }));
  const tNow = +now();
  let mkIdx = 0; ph.pts.forEach((p, i) => { if (Math.abs(p.t - tNow) < Math.abs(ph.pts[mkIdx].t - tNow)) mkIdx = i; });

  const doseStr = nf(S.profile.dose, S.profile.dose % 1 ? 1 : 0);

  return (
    <TelaInterna
      titulo="Aplicações"
      rodape={<Botao label="Registrar aplicação" onPress={() => router.push('/aplicacao' as any)} />}
    >
      <Titulao
        titulo="Aplicações"
        lead={`${med.label} · ${med.mol} · ${med.cad === 'weekly' ? 'uma vez por semana' : 'uso diário'}`}
      />

      {/* A PRÓXIMA DOSE.

          O botão de registrar saiu daqui e foi para o rodapé. Ele gravava
          na hora — hora de agora, local sugerido, dose atual —, pulando o
          formulário que existe ao lado e que faz tudo isso com escolha:
          dia, dose, mapa do corpo, caneta. Duas portas para a mesma sala,
          e a de dentro do cartão fazia menos. */}
      <View style={[{ backgroundColor: c.bg1, borderRadius: radius.card, padding: 16 }, shadowCard(c)]}>
        <Row style={{ alignItems: 'flex-start' }}>
          <View style={{ flex: 1 }}>
            <Txt v="body">Próxima aplicação</Txt>
            <Txt v="note" c={c.tx3} style={{ marginTop: 2 }}>
              {fmtWD(nd)}, {fmtDate(nd)} · {doseStr} {med.unit}
            </Txt>
          </View>
          <Txt v="metric">
            {ndDays <= 0 ? 'Hoje' : ndDays}
            {ndDays > 0 ? <Txt v="label" c={c.tx3}>{ndDays === 1 ? ' dia' : ' dias'}</Txt> : null}
          </Txt>
        </Row>
        <Row gap={8} style={{ marginTop: 14 }}>
          <Icon name="syringe" size={15} color={c.accent} sw={2} />
          <Txt v="caption" c={c.tx2} style={{ flex: 1 }}>
            {siteLabel(site)} — é o próximo da rotação, para a pele descansar.
          </Txt>
        </Row>
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
          titulo="Ciclo da dose"
          sub={`Dia ${cic.dayIn} de ${cic.total} · ${(cic.fases.find((f) => f.estado === 'agora')?.sub ?? 'em curso').toLowerCase()}`}
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
          titulo="Caneta e receita"
          sub={k.verdict.good
            ? `${k.atual?.usadas ?? 0} de ${k.atual?.total ?? 4} doses usadas nesta caneta`
            : `${k.verdict.label} — cobre cerca de ${Math.round(k.semanas)} ${Math.round(k.semanas) === 1 ? 'semana' : 'semanas'}`}
          onPress={() => router.push('/caneta' as any)}
        />
        <Linha
          ic="bell"
          titulo={S.reminders.dose.on ? 'Lembrete ligado' : 'Lembrete desligado'}
          sub={S.reminders.dose.on ? `Próximo: ${rem || 'quando chegar o dia'}` : 'Um aviso antes da dose, na hora que você escolher'}
          onPress={() => router.push('/lembretes' as any)}
        />
      </Cartao>

      {/* A CONSTÂNCIA — seis semanas, sem punição por dia perdido. */}
      <Bloco
        titulo="Constância"
        nota={`${S.injections.length} de ${previstas} doses previstas desde o começo do tratamento.`}
      >
        <View style={[{ backgroundColor: c.bg1, borderRadius: radius.card, padding: 16 }, shadowCard(c)]}>
          <Row style={{ flexWrap: 'wrap' }}>
            {['D', 'S', 'T', 'Q', 'Q', 'S', 'S'].map((d, i) => (
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
              <Txt v="micro" c={c.tx3}>aplicada</Txt>
            </Row>
            <Row gap={5}>
              <View style={{ width: 10, height: 10, borderRadius: 3, borderWidth: 1, borderColor: c.tx4, borderStyle: 'dashed' }} />
              <Txt v="micro" c={c.tx3}>próxima</Txt>
            </Row>
          </Row>
          <Txt v="micro" c={c.tx3} style={{ marginTop: 10, lineHeight: 16 }}>
            Sem culpa por um dia que passou — o que conta é retomar. Dá para registrar uma aplicação
            anterior a qualquer momento, no botão lá embaixo.
          </Txt>
        </View>
      </Bloco>

      {/* A CURVA — a única coisa da tela que explica o que se sente. */}
      <Bloco titulo="Nível no corpo">
        <View style={[{ backgroundColor: c.bg1, borderRadius: radius.card, padding: 16 }, shadowCard(c)]}>
          <AreaCurve pts={phPts} height={130} marker={mkIdx} id="ph" />
          <Txt v="caption" c={c.tx3} style={{ marginTop: 8, lineHeight: 18 }}>
            Estimativa de {med.mol.toLowerCase()} no corpo, com meia-vida de
            {med.hl >= 1 ? ` ${med.hl} dias` : ' cerca de 13 horas'}. O ponto mais baixo, antes da
            próxima dose, costuma ser quando a fome aumenta.
          </Txt>
        </View>
      </Bloco>

      {/* O HISTÓRICO, e a saída que ele não tinha.

          Aplicar era irreversível: um toque no antigo botão de registrar
          gravava uma dose que não dava para tirar de lugar nenhum — e ela
          mexe na data da próxima e no estoque da caneta. Apagar devolve a
          dose à caneta, que é o inverso exato do que salvar fez. */}
      <Bloco titulo="Histórico" nota="Apague o que tiver entrado errado — a dose volta para a caneta.">
        <Cartao>
          <Row gap={12} style={{ paddingHorizontal: 16, paddingVertical: 13 }}>
            <View style={{
              width: 30, height: 30, borderRadius: 15, borderWidth: 1.4, borderColor: c.accent2,
              borderStyle: 'dashed', alignItems: 'center', justifyContent: 'center',
            }}>
              <Icon name="syringe" size={14} color={c.accent2} sw={2} />
            </View>
            <View style={{ flex: 1 }}>
              <Txt v="body" c={c.tx3}>Próxima · {siteLabel(site)}</Txt>
              <Txt v="caption" c={c.tx4} style={{ marginTop: 1 }}>
                {relDay(nd).charAt(0).toUpperCase() + relDay(nd).slice(1)} · {fmtDate(nd)}
              </Txt>
            </View>
          </Row>
          {S.injections.slice().reverse().map((i: any) => (
            <ItemApagavel
              key={i.t}
              pergunta={`Apagar a aplicação de ${fmtDate(new Date(i.t))}?`}
              onApagar={() => update((s: any) => apagarAplicacao(s, i.t))}
            >
              <Row gap={12}>
                <View style={{
                  width: 30, height: 30, borderRadius: 15, backgroundColor: c.accentWeak,
                  alignItems: 'center', justifyContent: 'center',
                }}>
                  <Icon name="check" size={14} color={c.accent} sw={2.4} />
                </View>
                <View style={{ flex: 1 }}>
                  <Txt v="body">{nf(i.dose, i.dose % 1 ? 1 : 0)} {med.unit} · {siteLabel(i.site)}</Txt>
                  <Txt v="caption" c={c.tx3} style={{ marginTop: 1 }}>
                    {fmtDate(new Date(i.t))} · {relDay(new Date(i.t))}
                  </Txt>
                </View>
              </Row>
            </ItemApagavel>
          ))}
        </Cartao>
      </Bloco>
    </TelaInterna>
  );
}
