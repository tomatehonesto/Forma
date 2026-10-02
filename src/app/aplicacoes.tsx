import React, { useState } from 'react';
import { View, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { useStore } from '../logic/store';
import {
  M, adesao, canetaAtual, cicloFases, constanciaDaGrade, injCalendar,
  nextInjectionDate, nextSite, pharmaSeries, siteLabel,
  cadenciaTexto,
  doseDoPerfil,
  diasAteAplicar, temCiclo,
  doseDiaria, doseDeHoje, inicioDoTratamento, diasComDose, gravarDose, instanteDaAplicacao, faltaNaDose, doseEmUsoNoDia,
  dosesEmOrdem, doseEhDiaria, coberturaDoEstoque,
} from '../logic/derive';
import {
  now, diffDays, fmtDate, relDay, doseTxt, quandoEm, maiuscula, dataComDiaDaSemana, ordemDaSemana, startOfDay, fmtTime,
} from '../logic/time';
import {
  formaDe, nesteNesta, nomeDaMolecula, oA, FORMAS, injetavelDe, iconeDaDose, localDaDose, remedioDaDose,
} from '../logic/formas';
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
   DOSES (a rota continua /aplicacoes)

   ⚠️⚠️ ELA SE CHAMAVA "APLICAÇÕES", E NÃO É SÓ DE QUEM INJETA (01/10/2026).
   Quem toma comprimido abria uma tela de injeção: título, "PRÓXIMA
   APLICAÇÃO", uma seringa e um "Próxima · Abdômen (esq.)" no histórico, e
   cada dose com um local que ninguém escolheu. "Dose" é o substantivo de
   todo mundo (decisão do dono); o local e a seringa seguem a forma — a de
   agora para a próxima dose, a de cada dose para o histórico
   (logic/formas). O nome da rota e do arquivo é interno, e fica.

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
  const ndDays = diasAteAplicar(S);
  /* `nextSite` devolve um local para qualquer pessoa — o registro precisa
     de um valor inicial —, e por isso a pergunta da forma vem antes de
     mostrá-lo. */
  const injetavel = injetavelDe(S);
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
     FICA, com os dias da semana — sem "próxima": sem aplicação
     registrada, a próxima dose era hoje por recuo, e a tela a anunciava
     em letra grande ("PRÓXIMA DOSE · Hoje"). A primeira não tem
     data; ela é quando for registrada. Ver `temCiclo`, em derive.

     O que sobra é uma tela coerente de quem está começando — a primeira
     dose, o ciclo que ela vai abrir, o medicamento, os alertas, e o botão
     de registrar no rodapé. */
  const semAplicacao = !S.injections.length;
  const comCiclo = temCiclo(S);

  const doseStr = doseDoPerfil(S);

  /* ============================================================
     A DOSE DIÁRIA NESTA TELA (01/10/2026, parte B1 de
     docs/superpowers/specs/2026-10-01-oral-e-diario-design.md)

     Para quem toma todo dia, o que era do ciclo semanal sai: o cartão de
     cima deixa de contar a próxima dose ("Amanhã", todo dia) e diz a dose
     de hoje, como a faixa da Home; a linha "Ciclo da dose" some com a tela
     de ciclo (/ciclo é de cinco fases de uma semana); a "próxima" tracejada
     sai da grade e do histórico; e a frase da curva para de prometer um
     vale antes da próxima dose.

     ⚠️⚠️ E A GRADE PASSA A MARCAR DIAS ESQUECIDOS, VÁRIOS DE UMA VEZ.
     Quem toma todo dia e passou a semana sem registrar não vai abrir a
     folha cinco vezes: toca nos dias vazios e confirma. Só dias que já
     passaram — hoje tem o toque da Home, com a hora real, e futuro não é
     registro —, só dias do tratamento (antes do início não há dose a
     esquecer) e nunca um dia que já tem dose. Cada um entra ao meio-dia
     (`instanteDaAplicacao`) e sem local: ninguém sabe mais onde aplicou na
     terça passada, e "não informado" é a verdade. Nada se apaga — vale a
     nota do histórico, lá embaixo.

     ⚠️ E COM A DOSE QUE ESTAVA EM USO NAQUELE DIA, e não a do perfil
     (01/10/2026, achado da revisão): quem subiu de 3 para 7 mg ontem e
     marcava a semana passada gravava 7 mg em dias de 3 mg — um degrau de
     titulação inventado, que a semana da Jornada mostrava como "dose
     ajustada" e o resumo levava ao médico. Ver `doseEmUsoNoDia`.

     ⚠️ E SÓ QUANDO A DOSE PODE SER REGISTRADA (01/10/2026, achado da
     revisão): a mesma pergunta do toque da Home e da folha, `faltaNaDose`
     — sem caneta registrada, a injeção diária saía de caneta nenhuma por
     este caminho, e só por ele. Enquanto falta, a grade não marca nada e
     a dica não aparece.
     ============================================================ */
  const diaria = doseDiaria(S);
  const cartaoDeHoje = diaria && comCiclo;
  const hojeDose = doseDeHoje(S);
  const DH = T.tratamento.doseDeHoje;
  const hoje0 = +startOfDay(now());
  const inicio = inicioDoTratamento(S);
  const [selecao, setSelecao] = useState<number[]>([]);
  const podeRegistrar = !faltaNaDose(S, { dose: (S.profile as any).dose, usadasAntes: null }).length;
  /* ⚠️ E NUNCA UM DIA DA ÉPOCA DA CANETA (01/10/2026, achado da revisão):
     quem trocou de semanal para diário via os dias vazios entre duas canetas
     como "esqueceu de registrar?". Só depois da última dose não diária. */
  const ultimaNaoDiaria = [...dosesEmOrdem(S)].reverse().find((i) => !doseEhDiaria(S, i));
  const corteDaCaneta = ultimaNaoDiaria ? +startOfDay(new Date(ultimaNaoDiaria.t)) : -Infinity;
  const marcavel = (cell: { t: number; applied: boolean }) =>
    diaria && podeRegistrar && !cell.applied && cell.t < hoje0 && cell.t > corteDaCaneta
    && (inicio == null || cell.t >= inicio);
  const temMarcavel = cal.some(marcavel);
  /* Só valem os que continuam marcáveis: um dia que ganhou dose depois do
     toque (pela folha, ou de outro aparelho) sai da conta do botão. */
  const marcados = selecao.filter((t) => cal.some((cell) => cell.t === t && marcavel(cell)));
  const alternar = (t: number) =>
    setSelecao((m) => (m.includes(t) ? m.filter((x) => x !== t) : [...m, t]));
  const registrarMarcados = () => {
    /* Lido na hora do toque: um dia que ganhou dose entre a marcação e a
       confirmação (outro aparelho, a sincronia) não ganha a segunda. */
    const atual = useStore.getState().S;
    /* A pergunta da dose de novo, no estado de agora — o mesmo que o
       `registrarHoje` da Home faz: se algo faltar (a caneta foi apagada
       de outro aparelho), a folha pergunta, e nada é gravado aqui. */
    if (faltaNaDose(atual, { dose: (atual.profile as any).dose, usadasAntes: null }).length) {
      setSelecao([]);
      router.push('/aplicacao' as any);
      return;
    }
    const ja = new Set(diasComDose(atual));
    const hojeAgora = +startOfDay(now());
    const dias = marcados.filter((t) => !ja.has(t) && t < hojeAgora).sort((a, b) => a - b);
    setSelecao([]);
    if (!dias.length) return;
    /* A dose de cada dia sai do diário de antes da gravação: um dia recém
       marcado não vira referência para o vizinho. */
    const emUso = dias.map((d) => doseEmUsoNoDia(atual, d));
    update((s: any) => {
      dias.forEach((d, k) => {
        gravarDose(s, { t: instanteDaAplicacao(d), med: emUso[k].med, dose: emUso[k].dose, site: '', note: '' });
      });
    });
  };

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
      {/* Na dose diária, a dose de HOJE — feita, e a que horas, ou ainda
          não registrada —, e não a próxima (ver o bloco acima). */}
      <View style={{ backgroundColor: c.accentWeak, borderRadius: radius.card, padding: 18 }}>
        <Txt v="micro" c={c.accent} style={{ letterSpacing: 1 }}>
          {cartaoDeHoje ? DH.chapeu : comCiclo ? K().proximaAplicacao : K().primeiraDose}
        </Txt>
        <Txt v="display" style={{ fontSize: 30, lineHeight: 36, marginTop: 6 }}>
          {cartaoDeHoje
            ? (hojeDose.feita && hojeDose.t != null ? DH.feitaAs(fmtTime(new Date(hojeDose.t))) : DH.aindaNaoRegistrada)
            : comCiclo ? maiuscula(quandoEm(ndDays).label) : K().aindaNaoRegistrada}
        </Txt>
        <Txt v="caption" c={c.tx2} style={{ marginTop: 3 }}>
          {comCiclo && !cartaoDeHoje ? `${maiuscula(dataComDiaDaSemana(nd))} · ${doseStr}` : doseStr}
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
        {/* Sem "Ciclo da dose" na dose diária: as fases são de uma semana,
            e /ciclo não abre para quem toma todo dia (01/10/2026). */}
        {!diaria ? (
          <Linha
            ic="waves"
            titulo={K().cicloDaDose}
            sub={comCiclo
              ? K().cicloSub(cic.dayIn, cic.total, cic.fases.find((f) => f.estado === 'agora')?.sub ?? K().emCurso)
              : K().cicloSemDose}
            onPress={() => router.push('/ciclo' as any)}
          />
        ) : null}
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
          /* Sem recipiente registrado, "restam 4 doses" era o recuo da
             conta; a linha pede o registro (`penStock().registrada`). */
          sub={!k.registrada
            ? T.tratamento.registreORecipiente(`${oA(formaDe(S))} ${FORMAS()[formaDe(S)].recipiente}`)
            : k.verdict.good
              ? K().dosesRestantesNo(k.left, nesteNesta(formaDe(S)))
              /* em dias ou semanas (02/10/2026, parte B3) — ver
                 `coberturaDoEstoque`, em logic/derive */
              : K().cobre(k.verdict.label, coberturaDoEstoque(S, k))}
          onPress={() => router.push('/caneta' as any)}
        />
        <Linha
          ic="bell"
          titulo={alertasDaDose.length ? K().alertasDeDose(alertasDaDose.length) : K().nenhumAlerta}
          /* ⚠️ "Um aviso antes da dose" é a antecedência do semanal; para
             quem toma todo dia o convite é o aviso de todo dia (parte B4,
             02/10/2026). */
          sub={rem ? K().tocaEm(rem) : diaria ? K().avisoDiario : K().avisoAntes}
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

      {/* A CONSTÂNCIA — seis semanas, sem punição por dia perdido.

          ⚠️ SÓ DEPOIS DA PRIMEIRA APLICAÇÃO (28/09/2026). Antes dela, a
          grade eram seis semanas de dias sem nada, e embaixo "Sem culpa por
          um dia perdido" — consolo por uma falta que não houve. */}
      {semAplicacao ? null : (
      <Bloco
        titulo={K().constancia}
        /* Na dose diária, as previstas podem ser zero com dose registrada
           — trocou de remédio e ainda não registrou o novo (ver
           `inicioDoDiario`) —, e "0 de 0 doses previstas" é conta sem
           pergunta (01/10/2026). Sem previstas, sem nota. */
        nota={semAplicacao || (diaria && !constancia.previstas)
          ? undefined
          : K().constanciaNota(constancia.feitas, constancia.previstas, constancia.semanas)}
      >
        <View style={[{ backgroundColor: c.bg1, borderRadius: radius.card, padding: 16 }, shadowCard(c)]}>
          <Row style={{ flexWrap: 'wrap' }}>
            {/* ⚠️ AS SETE INICIAIS ESTAVAM ESCRITAS À MÃO em português —
                D S T Q Q S S —, e em alemão a fileira saía assim mesmo.
                `inicialDoDia` já existia em logic/alertas, e devolve a
                inicial no idioma de quem lê.

                E A ORDEM É A DA SEMANA DE QUEM LÊ: em alemão a fileira
                começa na segunda, e a grade embaixo (`injGrade`) termina
                no domingo pelo mesmo motivo. */}
            {ordemDaSemana().map((wd) => inicialDoDia(wd)).map((d, i) => (
              <View key={`h${i}`} style={{ width: '14.28%', alignItems: 'center', paddingVertical: 4 }}>
                <Txt v="micro" c={c.tx4}>{d}</Txt>
              </View>
            ))}
            {cal.map((cell, i) => {
              /* Na dose diária não há "próxima" tracejada: seria sempre
                 amanhã. Um dia marcado para registrar fica cheio, na cor de
                 ação — diferente do lavado de quem já tem dose. */
              const planned = cell.planned && !diaria;
              const marcado = marcados.includes(cell.t);
              const casa = (
                <View style={{
                  width: 30, height: 30, borderRadius: 10, alignItems: 'center', justifyContent: 'center',
                  backgroundColor: marcado ? c.accent : cell.applied ? c.accentWeak : 'transparent',
                  borderWidth: marcado ? 0 : cell.applied || planned || cell.today ? 1.2 : 0,
                  borderColor: cell.applied ? c.accentLine : planned ? c.tx4 : c.accent2,
                  borderStyle: planned ? 'dashed' : 'solid',
                }}>
                  <Txt v="micro" c={marcado ? c.accentInk : cell.applied ? c.accent : cell.today ? c.accent2 : c.tx3}>{cell.day}</Txt>
                </View>
              );
              return marcavel(cell) ? (
                <Pressable
                  key={i}
                  onPress={() => alternar(cell.t)}
                  hitSlop={2}
                  accessibilityRole="checkbox"
                  accessibilityState={{ checked: marcado }}
                  accessibilityLabel={maiuscula(dataComDiaDaSemana(new Date(cell.t)))}
                  style={({ pressed }) => [{ width: '14.28%', alignItems: 'center', paddingVertical: 3, opacity: pressed ? 0.6 : 1 }]}
                >
                  {casa}
                </Pressable>
              ) : (
                <View key={i} style={{ width: '14.28%', alignItems: 'center', paddingVertical: 3 }}>
                  {casa}
                </View>
              );
            })}
          </Row>
          <Row gap={16} style={{ marginTop: 10 }}>
            <Row gap={5}>
              <View style={{ width: 10, height: 10, borderRadius: 3, backgroundColor: c.accentWeak, borderWidth: 1, borderColor: c.accentLine }} />
              <Txt v="micro" c={c.tx3}>{K().aplicada}</Txt>
            </Row>
            {comCiclo && !diaria ? (
              <Row gap={5}>
                <View style={{ width: 10, height: 10, borderRadius: 3, borderWidth: 1, borderColor: c.tx4, borderStyle: 'dashed' }} />
                <Txt v="micro" c={c.tx3}>{K().proxima}</Txt>
              </Row>
            ) : null}
          </Row>
          <Txt v="micro" c={c.tx3} style={{ marginTop: 10, lineHeight: 16 }}>
            {K().semCulpa}
          </Txt>
          {/* Os dias esquecidos, de uma vez — só na dose diária (ver o
              bloco "A DOSE DIÁRIA NESTA TELA"). Sem dia marcado, a dica;
              com algum, a confirmação, que diz o que vai ser gravado. */}
          {marcados.length ? (
            <View style={{ marginTop: 14, gap: 8 }}>
              <Botao label={K().registrarDias(marcados.length)} onPress={registrarMarcados} />
              <Botao label={K().desmarcar} tom="fantasma" onPress={() => setSelecao([])} />
              <Txt v="micro" c={c.tx3} style={{ lineHeight: 16 }}>
                {K().marcarDiasNota(injetavel)}
              </Txt>
            </View>
          ) : temMarcavel ? (
            <Txt v="micro" c={c.tx2} style={{ marginTop: 8, lineHeight: 16 }}>
              {K().marcarDias}
            </Txt>
          ) : null}
        </View>
      </Bloco>
      )}

      {/* A CURVA — a única coisa da tela que explica o que se sente. */}
      {semAplicacao ? null : (
      <Bloco titulo={K().nivelNoCorpo}>
        <View style={[{ backgroundColor: c.bg1, borderRadius: radius.card, padding: 16 }, shadowCard(c)]}>
          <AreaCurve pts={phPts} height={130} marker={mkIdx} id="ph" />
          <Txt v="caption" c={c.tx3} style={{ marginTop: 8, lineHeight: 18 }}>
            {/* sem o "ponto mais baixo antes da próxima dose" na dose diária */}
            {(diaria ? K().nivelTextoDiario : K().nivelTexto)(
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
          uma dose não é um copo d'água. Ela é registro de
          medicamento tomado — o que a equipe lê na consulta, o que
          conta a história do tratamento — e um toque errado apagando uma
          dose da semana passada some com um fato clínico.

          Fica a lista, e só. Quem registrou errado corrige com quem
          acompanha; o app não tem por que oferecer a borracha. */}
      {semAplicacao ? null : (
      <Bloco titulo={K().historico}>
        <Cartao>
          {/* ⚠️ A PRÓXIMA SEGUE A FORMA DE AGORA (01/10/2026): seringa e
              local sugerido para quem injeta; comprimido e só a data para
              quem toma. Era a seringa e o local para todo mundo.

              ⚠️ E NÃO EXISTE NA DOSE DIÁRIA (01/10/2026, parte B1): seria
              "amanhã" no topo de todo histórico. A dose de hoje está no
              cartão do alto. */}
          {!diaria ? (
          <Row gap={12} style={{ paddingHorizontal: 16, paddingVertical: 13 }}>
            <View style={{
              width: 30, height: 30, borderRadius: 15, borderWidth: 1.4, borderColor: c.accent2,
              borderStyle: 'dashed', alignItems: 'center', justifyContent: 'center',
            }}>
              <Icon name={iconeDaDose(S)} size={14} color={c.accent2} sw={2} />
            </View>
            <View style={{ flex: 1 }}>
              <Txt v="body" c={c.tx3}>{injetavel ? K().proximaEmLocal(siteLabel(site)) : K().proximaSemLocal}</Txt>
              <Txt v="caption" c={c.tx4} style={{ marginTop: 1 }}>
                {maiuscula(relDay(nd))} · {fmtDate(nd)}
              </Txt>
            </View>
          </Row>
          ) : null}
          {S.injections.slice().reverse().map((i: any) => {
            /* ⚠️ O LOCAL PELA DOSE, E NÃO O GRAVADO (01/10/2026). Até esta
               data o registro gravava um local inventado em cada
               comprimido; `localDaDose` só devolve o de dose injetada, sem
               apagar nada do diário. */
            const local = localDaDose(S, i);
            /* A unidade é a do remédio DA DOSE, e o nome dele só aparece
               quando não é o de hoje — quem trocou de remédio vê de qual
               era cada dose antiga, sem repetir o nome em toda linha. */
            const rem = remedioDaDose(S, i);
            return (
            <Row key={i.t} gap={12} style={{ paddingHorizontal: 16, paddingVertical: 13 }}>
              <View style={{
                width: 30, height: 30, borderRadius: 15, backgroundColor: c.accentWeak,
                alignItems: 'center', justifyContent: 'center',
              }}>
                <Icon name="check" size={14} color={c.accent} sw={2.4} />
              </View>
              <View style={{ flex: 1 }}>
                <Txt v="body">{rem !== med ? `${rem.label} ` : ''}{doseTxt(i.dose)} {rem.unit}{local ? ` · ${siteLabel(local)}` : ''}</Txt>
                <Txt v="caption" c={c.tx3} style={{ marginTop: 1 }}>
                  {fmtDate(new Date(i.t))} · {relDay(new Date(i.t))}
                </Txt>
              </View>
            </Row>
            );
          })}
        </Cartao>
      </Bloco>
      )}
    </TelaInterna>
  );
}
