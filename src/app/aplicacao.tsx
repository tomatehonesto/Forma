import React, { useState } from 'react';
import { View } from 'react-native';
import { useRouter } from 'expo-router';
import { useStore } from '../logic/store';
import {
  M, nextSite, siteLabel, penStock, diasParaAplicar, instanteDaAplicacao, rodizioDeLocais,
} from '../logic/derive';
import { FORMAS, formaDe, faixaDaMolecula, umOutro, oA } from '../logic/formas';
import { now, fmtTime, nf, dataComDiaDaSemana, maiuscula, startOfDay } from '../logic/time';
import { Txt, SheetScreen } from '../ui/kit';
import { Campo, Chips, Opcoes, Opc, Regua, Botao } from '../ui/internas';
import { Calendario } from '../ui/calendario';
import { ZONAS } from '../ui/corpo';
import { useTheme } from '../ui/useTheme';

/* ============================================================
   REGISTRAR A DOSE

   O formulário mais importante do aplicativo, e o que mais precisa sair
   da frente: quem está com a caneta na mão quer terminar isso em
   segundos. Por isso tudo chega preenchido — dia de hoje, dose atual,
   recipiente em uso, local sugerido pela rotação — e cada campo existe só
   para o caso de a pessoa querer discordar do padrão.

   ⚠️⚠️ ERA TELA CHEIA, E VIROU FOLHA. Todas as outras capturas do
   aplicativo são folha; esta era a exceção, e exceção em captura é a
   pessoa reaprendendo o gesto de fechar a cada registro.

   ⚠️⚠️ E METADE DELA SÓ EXISTE PARA QUEM INJETA.

   O aplicativo passou a conhecer medicamento que não é caneta — ver
   logic/formas. Local de aplicação e rodízio não são detalhes de um
   comprimido: são perguntas que não existem. Quem toma semaglutida oral
   não escolhe onde aplicou, e o título nem chama isso de aplicação.

   Por isso as duas últimas seções ficam atrás de `injetavel`, e não atrás
   de um texto trocado. Esconder o rótulo e manter o campo seria o
   aplicativo guardando uma resposta sem sentido.

   ⚠️ O DESENHO DO CORPO SAIU DAQUI, e não morreu. Ele continua em
   /aplicacoes, onde mostra o rodízio — que é o que ele sempre fez
   melhor. Como SELETOR ele cobrava mira: seis alvos pequenos numa
   silhueta de 200 px, para uma escolha entre seis coisas que têm nome. O
   nome cabe num chip, e chip não erra o toque.
   ============================================================ */

export default function Aplicacao() {
  const S = useStore((s) => s.S);
  const update = useStore((s) => s.update);
  const { c } = useTheme();
  const router = useRouter();

  const med = M(S);
  const forma = formaDe(S);
  const vocab = FORMAS[forma];
  const sugerido = nextSite(S);
  const rod = rodizioDeLocais(S);
  const est = penStock(S);

  const hoje = +startOfDay(now());
  const dias = diasParaAplicar(S);

  /* ⚠️ O DIA É UM INSTANTE, E ERA UM ÍNDICE DE CHIP. Com índice, o
     calendário não teria como responder — ele devolve uma data, não uma
     posição numa lista de sete. */
  const [quandoT, setQuandoT] = useState(hoje);
  const [calAberto, setCalAberto] = useState(false);

  const [dose, setDose] = useState<number>(S.profile.dose);
  const [site, setSite] = useState(sugerido);
  const [outroRecipiente, setOutroRecipiente] = useState(false);

  /* Sem escada de bula — manipulado — a dose é um número livre, e a faixa
     vem da molécula NA MESMA VIA. Ver a nota em logic/formas. */
  const faixa = med.doses.length ? null : faixaDaMolecula(med.mol, forma);

  const noCurto = dias.find((d) => d.t === quandoT);
  /* A grade aparece quando a pessoa pediu, ou quando a data escolhida não
     cabe em nenhum atalho — reabrir a folha num 12 de agosto sem mostrar
     agosto seria esconder a própria resposta. */
  const mostraCalendario = calAberto || !noCurto;

  const salvar = () => {
    update((s: any) => {
      s.injections.push({ t: instanteDaAplicacao(quandoT), med: s.profile.med, dose, site, note: '' });
      s.profile.dose = dose;
      if (s.pen) s.pen.dosesLeft = Math.max(0, s.pen.dosesLeft - 1);
    });
    router.replace('/aplicacao-ok' as any);
  };

  const descanso = (() => {
    const l = rod.find((x) => x.id === site);
    if (!l || l.semanas == null) return 'Ainda não usado neste tratamento.';
    if (l.semanas === 0) return 'Usado esta semana.';
    return `Descansando há ${l.semanas} ${l.semanas === 1 ? 'semana' : 'semanas'}.`;
  })();

  return (
    <SheetScreen
      titulo={`Registrar ${vocab.acao}`}
      sub={maiuscula(dataComDiaDaSemana(new Date(quandoT)))}
      onClose={() => router.back()}
      rodape={<Botao label={`Salvar ${vocab.acao}`} onPress={salvar} />}
    >
      <View style={{ marginTop: 18, gap: 10 }}>
        {/* O DIA, e só ele.

            Eram três opções — Agora, Outro horário, Outro dia — e as três
            gravavam a hora de AGORA: a escolha era lida na tela e jogada
            fora no salvar. Quem aplicou na sexta e registrou no domingo
            ficava com uma aplicação de domingo, e a próxima data saía dois
            dias errada.

            "Outro horário" não voltou. A hora de uma aplicação não aparece
            em lugar nenhum do aplicativo — o histórico mostra data, o
            calendário conta por dia, a curva farmacológica trabalha em
            dias. Um controle cujo valor ninguém lê é uma pergunta
            respondida à toa.

            ⚠️ E "OUTRO DIA" DEIXOU DE SER UM ATALHO A MAIS: ele abre a
            grade do mês. Os sete chips resolvem o caso comum em um toque e
            falham justamente no caso em que alguém precisa de calendário —
            lembrar, três semanas depois, do dia em que aplicou. */}
        <Campo
          rotulo="Quando"
          ajuda={quandoT === hoje
            ? `Fica registrada agora, ${fmtTime(now())}.`
            : 'Registrar depois não muda nada além da data — a contagem da próxima dose sai daqui.'}
        >
          <Chips
            itens={[...dias, { id: 'outro', label: 'Outro dia' }]}
            valor={mostraCalendario ? 'outro' : (noCurto?.id ?? '0')}
            onChange={(id) => {
              if (id === 'outro') { setCalAberto(true); return; }
              setCalAberto(false);
              setQuandoT(dias.find((d) => d.id === id)?.t ?? hoje);
            }}
          />
          {mostraCalendario ? (
            <Calendario valor={quandoT} onEscolhe={setQuandoT} />
          ) : null}
        </Campo>

        {/* ⚠️ DOIS CONTROLES, PORQUE SÃO DUAS NATUREZAS DE NÚMERO.

            Com escada de bula, a dose é uma escolha entre degraus com
            nome, e são quatro a seis — cabem todos na tela de uma vez.
            Isto substituiu um Stepper de mais e menos, que fazia percorrer
            a escada às cegas, um degrau por toque, sem nunca mostrar
            quantos existem nem onde a pessoa está neles.

            Sem escada — manipulado —, o número é livre: quem o define é a
            receita. Aí o controle é a régua, que é o mesmo gesto do peso e
            das medidas.

            ⚠️ E A RÉGUA NÃO SERVE PARA A ESCADA. Ela anda com passo
            UNIFORME: a do Mounjaro é uniforme (2,5 em 2,5), mas a do
            Ozempic não é — 0,25 · 0,5 · 1 · 2. Traços igualmente espaçados
            para degraus que não são mentiriam sobre onde eles estão. */}
        <Campo rotulo="Dose" ajuda={med.doses.length
          ? `Sua dose atual é ${nf(S.profile.dose, 1)} ${med.unit}.`
          : 'Manipulado não tem escada de bula — o número é o da sua receita.'}
        >
          {med.doses.length ? (
            <Opcoes>
              {med.doses.map((d) => (
                <Opc
                  key={d}
                  label={`${nf(d, 1)} ${med.unit}`}
                  on={dose === d}
                  onPress={() => setDose(d)}
                />
              ))}
            </Opcoes>
          ) : faixa ? (
            <Regua
              min={faixa.min} max={faixa.max} passo={0.05} tracoCada={0.5} casas={2}
              esp={7} salto={0.05}
              valor={dose || faixa.min} unidade={med.unit} onEscolhe={setDose}
            />
          ) : (
            /* Sem escada E sem faixa: não há marca com aquela molécula
               naquela via de onde derivar um limite. Dizer isso é melhor do
               que abrir uma régua de 0 a 100. */
            <Txt v="note" c={c.tx3}>
              Não temos faixa de referência para este medicamento. A dose fica
              a do seu último registro.
            </Txt>
          )}
        </Campo>

        {vocab.injetavel ? (
          <>
            {/* ⚠️ CHIPS, E ERA UM DESENHO DO CORPO.

                Seis locais com nome, escolhidos entre seis — é uma lista, e
                lista se resolve com chip. A silhueta cobrava mira: seis
                alvos pequenos num desenho de 200 px de largura, e errar o
                toque num formulário de medicamento é trocar o registro do
                braço pelo do abdômen.

                ⚠️ O QUE ESTÁ EMBAIXO É A RAZÃO DE A ROTAÇÃO EXISTIR, e
                continua igual: HÁ QUANTO TEMPO aquele local descansa, e se
                ele é o próximo da rotação. Sem isso, o sugerido seria uma
                ordem sem motivo — e é justamente o motivo que deixa a
                pessoa discordar com conhecimento de causa. */}
            <Campo
              rotulo="Local da aplicação"
              ajuda="Alternar o local a cada semana ajuda a evitar irritação e nódulos na pele."
            >
              <Chips
                itens={ZONAS.map((z) => ({
                  id: z.id,
                  label: siteLabel(z.id),
                  nota: z.id === sugerido ? 'sugerido' : undefined,
                }))}
                valor={site}
                onChange={setSite}
              />
              <View style={{ gap: 4 }}>
                <Txt v="caption" c={c.tx2}>{descanso}</Txt>
                <Txt v="caption" c={site === sugerido ? c.accent : c.tx3}>
                  {site === sugerido
                    ? 'É o próximo da rotação.'
                    : 'Fora da rotação sugerida — sem problema, é só um lembrete.'}
                </Txt>
              </View>
            </Campo>

            {/* ⚠️ A DOSE SAIU DAQUI, e era duplicação pura: o rótulo desta
                opção repetia o número que o campo logo acima acabou de
                perguntar. Uma tela que pergunta a dose e a repete dois
                campos abaixo faz a pessoa conferir se são a mesma coisa.

                O que é DESTE campo é o recipiente: qual está em uso e
                quantas doses restam nele. */}
            <Campo
              rotulo={maiuscula(vocab.recipiente)}
              ajuda={est.left <= 1
                ? `Esta é a última dose ${vocab.genero === 'f' ? 'desta' : 'deste'} ${vocab.recipiente}.`
                : `Restam ${est.left} doses.`}
            >
              <Opcoes>
                <Opc
                  label={`${med.label} · ${est.total - est.left + 1}ª dose`}
                  on={!outroRecipiente}
                  onPress={() => setOutroRecipiente(false)}
                />
                <Opc
                  label={`${umOutro(forma, true)} ${vocab.recipiente}`}
                  on={outroRecipiente}
                  onPress={() => { setOutroRecipiente(true); router.push('/caneta-nova' as any); }}
                />
              </Opcoes>
            </Campo>
          </>
        ) : null}
      </View>
    </SheetScreen>
  );
}
