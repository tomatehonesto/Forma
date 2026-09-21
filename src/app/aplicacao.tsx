import React, { useState } from 'react';
import { View, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { useStore } from '../logic/store';
import {
  M, nextSite, siteLabel, penStock, instanteDaAplicacao, rodizioDeLocais,
} from '../logic/derive';
import { FORMAS, formaDe, faixaDaMolecula, umOutro } from '../logic/formas';
import { now, fmtTime, nf, dataComDiaDaSemana, maiuscula, startOfDay } from '../logic/time';
import { Txt, Row, SheetScreen } from '../ui/kit';
import { Campo, Opcoes, Opc, Regua, Botao } from '../ui/internas';
import { Calendario } from '../ui/calendario';
import { Icon } from '../ui/Icon';
import { useTheme } from '../ui/useTheme';

/* ============================================================
   REGISTRAR A DOSE

   O formulário mais importante do aplicativo, e o que mais precisa sair
   da frente: quem está com a caneta na mão quer terminar isso em
   segundos.

   ⚠️⚠️ E É POR ISSO QUE QUASE NADA AQUI É UMA PERGUNTA. Dia, dose, local
   e recipiente chegam respondidos; cada campo existe para o caso de a
   pessoa querer discordar. Um formulário de toda semana que cobra quatro
   decisões toda semana é um formulário que se deixa de preencher.

   ⚠️⚠️ E METADE DELE SÓ EXISTE PARA QUEM INJETA.

   O aplicativo passou a conhecer medicamento que não é caneta — ver
   logic/formas. Local de aplicação e rodízio não são detalhes de um
   comprimido: são perguntas que não existem. Quem toma semaglutida oral
   não escolhe onde aplicou, e o título nem chama isso de aplicação.

   ⚠️ O DESENHO DO CORPO SAIU DAQUI, e não morreu. Ele continua em
   /aplicacoes, onde mostra o rodízio — que é o que ele sempre fez
   melhor. Como SELETOR ele cobrava mira: alvos pequenos numa silhueta de
   200 px, para uma escolha entre coisas que têm nome.

   ⚠️ E NÃO HÁ MAIS ROLAGEM HORIZONTAL NESTA TELA. Todo controle é o mesmo
   `Opc` — a lista inteira cabe empilhada, e o que está fora da tela não
   existe para quem não sabe que ele está lá.
   ============================================================ */

/* ============================================================
   O LOCAL SÃO DUAS PERGUNTAS, E ERA UMA LISTA DE SEIS.

   Os seis locais do rodízio são três regiões vezes dois lados —
   `abd-e`, `abd-d`, `coxa-e`… —, e apresentá-los como seis opções soltas
   fazia a pessoa ler "Abdômen" três vezes para achar o lado que queria.
   Separado, são três alvos e depois dois.

   O id continua sendo o mesmo par: nada muda no que se grava, nem nos
   seis gráficos de rodízio que leem isso.
   ============================================================ */
const REGIOES: [string, string][] = [
  ['braco', 'Braço'],
  ['abd', 'Abdômen'],
  ['coxa', 'Coxa'],
];
const LADOS: [string, string][] = [['e', 'Esquerdo'], ['d', 'Direito']];

const regiaoDe = (site: string) => site.split('-')[0];
const ladoDe = (site: string) => site.split('-')[1];

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

  const [quandoT, setQuandoT] = useState(hoje);
  const [dose, setDose] = useState<number>(S.profile.dose);
  const [mudandoDose, setMudandoDose] = useState(false);
  const [site, setSite] = useState(sugerido);
  const [outroRecipiente, setOutroRecipiente] = useState(false);

  /* Sem escada de bula — manipulado — a dose é um número livre, e a faixa
     vem da molécula NA MESMA VIA. Ver a nota em logic/formas. */
  const faixa = med.doses.length ? null : faixaDaMolecula(med.mol, forma);

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
        {/* ⚠️⚠️ O CALENDÁRIO VEM ABERTO, E ERAM CHIPS QUE O ABRIAM.

            Havia sete atalhos — Hoje, Ontem, Anteontem, três dias com
            nome, e "Outro dia" que abria a grade. Parecia menos trabalho e
            era mais: quem quer registrar a aplicação de terça precisa
            traduzir "terça" para um chip, e nem todo mundo faz essa conta
            de cabeça. Data é a coisa que as pessoas mais erram quando
            obrigadas a contar para trás.

            Com a grade aberta, o caso comum ficou em ZERO toque — hoje já
            vem marcado — e o caso difícil ficou em um. Os chips
            economizavam um toque que ninguém dava.

            ⚠️ O PREÇO É ALTURA: são uns 280 px no topo, e o resto da folha
            nasce abaixo da dobra. Pôr o calendário por último resolveria,
            e foi descartado — a folha abriria na dose, que é a pergunta
            que quase nunca muda.

            "Outro horário" nunca voltou. A hora de uma aplicação não
            aparece em lugar nenhum do aplicativo: o histórico mostra data,
            o calendário conta por dia, a curva farmacológica trabalha em
            dias. */}
        <Campo
          rotulo="Quando"
          ajuda={quandoT === hoje
            ? `Fica registrada agora, ${fmtTime(now())}.`
            : 'Registrar depois não muda nada além da data — a contagem da próxima dose sai daqui.'}
        >
          <Calendario valor={quandoT} onEscolhe={setQuandoT} />
        </Campo>

        {/* ⚠️⚠️ A DOSE É UM FATO, E ERA UMA PERGUNTA TODA SEMANA.

            Ela muda na titulação: uma vez por mês no começo, e quase nunca
            depois que a manutenção chega. Seis degraus na tela toda semana
            é uma escolha que se responde sozinha em nove de dez registros
            — e o próprio arquivo já dizia, sobre outro campo, que um
            controle cujo valor ninguém muda é uma pergunta respondida à
            toa.

            Agora o que está na tela é o que está cadastrado, e a escada só
            aparece para quem disser que mudou. O medicamento entra na
            mesma linha: ele estava repetido embaixo, no campo do
            recipiente, e agora é dito uma vez só. */}
        <Campo
          rotulo={`Medicamento e ${med.doses.length ? 'dose' : 'dose da receita'}`}
          ajuda={mudandoDose && !med.doses.length
            ? 'Manipulado não tem escada de bula — o número é o da sua receita.'
            : undefined}
        >
          <Row style={{ justifyContent: 'space-between', alignItems: 'center', gap: 10 }}>
            <Txt v="bodyMed">{`${med.label} · ${nf(dose, 1)} ${med.unit}`}</Txt>
            {!mudandoDose ? (
              <Pressable
                onPress={() => setMudandoDose(true)}
                hitSlop={8}
                style={({ pressed }) => [{ opacity: pressed ? 0.6 : 1 }]}
              >
                <Row gap={4} style={{ alignItems: 'center' }}>
                  <Txt v="label" c={c.accent}>Mudei a dose</Txt>
                  <Icon name="chev" size={12} color={c.accent} sw={2.2} />
                </Row>
              </Pressable>
            ) : null}
          </Row>

          {mudandoDose ? (
            med.doses.length ? (
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
                 naquela via de onde derivar um limite. Dizer isso é melhor
                 do que abrir uma régua de 0 a 100. */
              <Txt v="note" c={c.tx3}>
                Não temos faixa de referência para este medicamento. A dose fica
                a do seu último registro.
              </Txt>
            )
          ) : null}
        </Campo>

        {vocab.injetavel ? (
          <>
            <Campo
              rotulo="Local da aplicação"
              ajuda="Alternar o local a cada semana ajuda a evitar irritação e nódulos na pele."
            >
              <Opcoes>
                {REGIOES.map(([id, nome]) => (
                  <Opc
                    key={id}
                    /* O "sugerido" marca a REGIÃO, e o lado dele já vem
                       escolhido — a rotação sugere um ponto, não uma
                       metade do corpo. */
                    label={regiaoDe(sugerido) === id ? `${nome} · sugerido` : nome}
                    on={regiaoDe(site) === id}
                    onPress={() => setSite(`${id}-${ladoDe(site)}`)}
                  />
                ))}
              </Opcoes>
            </Campo>

            <Campo rotulo="Lado">
              <Opcoes>
                {LADOS.map(([id, nome]) => (
                  <Opc
                    key={id}
                    label={nome}
                    on={ladoDe(site) === id}
                    onPress={() => setSite(`${regiaoDe(site)}-${id}`)}
                  />
                ))}
              </Opcoes>
              {/* ⚠️ AS DUAS LINHAS SÃO A RAZÃO DE A ROTAÇÃO EXISTIR, e por
                  isso ficam embaixo do LADO, e não da região: elas falam
                  do ponto escolhido, que só existe depois das duas
                  respostas. Sem elas, o sugerido seria uma ordem sem
                  motivo — e é o motivo que deixa a pessoa discordar com
                  conhecimento de causa. */}
              <View style={{ gap: 4 }}>
                <Txt v="caption" c={c.tx2}>{`${siteLabel(site)} · ${descanso}`}</Txt>
                <Txt v="caption" c={site === sugerido ? c.accent : c.tx3}>
                  {site === sugerido
                    ? 'É o próximo da rotação.'
                    : 'Fora da rotação sugerida — sem problema, é só um lembrete.'}
                </Txt>
              </View>
            </Campo>

            {/* O medicamento saiu deste rótulo: ele agora é dito uma vez
                só, lá em cima. O que é DESTE campo é o recipiente — qual
                está em uso e quantas doses restam nele. */}
            <Campo
              rotulo={maiuscula(vocab.recipiente)}
              ajuda={est.left <= 1
                ? `Esta é a última dose ${vocab.genero === 'f' ? 'desta' : 'deste'} ${vocab.recipiente}.`
                : `Restam ${est.left} doses.`}
            >
              <Opcoes>
                <Opc
                  label={`${est.total - est.left + 1}ª dose`}
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
