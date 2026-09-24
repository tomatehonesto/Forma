import React, { useState } from 'react';
import { View, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { useStore } from '../logic/store';
import {
  M, nextSite, siteLabel, penStock, instanteDaAplicacao, rodizioDeLocais,
} from '../logic/derive';
import { FORMAS, concordar, formaDe, faixaDaMolecula, umOutro } from '../logic/formas';
import { now, fmtTime, nf, dataComDiaDaSemana, maiuscula, startOfDay } from '../logic/time';
import { radius } from '../theme';
import { Txt, Row, SheetScreen } from '../ui/kit';
import { T } from '../textos';

/* ⚠️ É FUNÇÃO, e não constante de módulo: ela lê o catálogo, e constante
   de módulo congela o idioma no import. */
const K = () => T.tratamento.telaRegistrarAplicacao;
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

   ⚠️ O DESENHO DO CORPO SAIU DAQUI. Como SELETOR ele cobrava mira:
   alvos pequenos numa silhueta de 200 px, para uma escolha entre coisas
   que têm nome. Por um tempo ele sobreviveu em /aplicacoes, desenhando
   o rodízio; esse mapa também saiu, e a silhueta foi apagada com ele.

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

   O id continua sendo o mesmo par: nada muda no que se grava, nem no
   descanso que `rodizioDeLocais` calcula a partir disso.
   ============================================================ */
const REGIOES = (): [string, string][] => [
  ['braco', K().regioes.braco],
  ['abd', K().regioes.abd],
  ['coxa', K().regioes.coxa],
];
const LADOS = (): [string, string][] => [['e', K().lados.e], ['d', K().lados.d]];

const regiaoDe = (site: string) => site.split('-')[0];
const ladoDe = (site: string) => site.split('-')[1];

export default function Aplicacao() {
  const S = useStore((s) => s.S);
  const update = useStore((s) => s.update);
  const { c } = useTheme();
  const router = useRouter();

  const med = M(S);
  const forma = formaDe(S);
  const vocab = FORMAS()[forma];
  const sugerido = nextSite(S);
  const rod = rodizioDeLocais(S);
  const est = penStock(S);

  const hoje = +startOfDay(now());

  const [quandoT, setQuandoT] = useState(hoje);
  const [calAberto, setCalAberto] = useState(false);
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
    if (!l || l.semanas == null) return K().naoUsado;
    if (l.semanas === 0) return K().usadoEstaSemana;
    return K().descansandoHa(l.semanas);
  })();

  return (
    <SheetScreen
      titulo={K().registrar(vocab.acao)}
      /* Sem subtítulo: a data agora tem campo próprio, e o cabeçalho
         escrevia a mesma frase três centímetros acima dele. */
      onClose={() => router.back()}
      rodape={<Botao label={K().salvar(vocab.acao)} onPress={salvar} />}
    >
      <View style={{ marginTop: 18, gap: 10 }}>
        {/* ⚠️⚠️ A DATA É UM CAMPO QUE ABRE O CALENDÁRIO — e este campo já
            foi três coisas.

            Primeiro foram sete pastilhas: Hoje, Ontem, Anteontem, três
            dias com nome e "Outro dia", que abria a grade. O defeito era
            de tradução — quem quer registrar a aplicação de terça precisa
            converter "terça" em pastilha, e contar dias para trás de
            cabeça é justamente o que se erra.

            Depois o calendário veio aberto, sem pastilha nenhuma. Acertou
            a tradução e errou o tamanho: duzentos e oitenta pixels no topo
            empurravam dose, local e recipiente para baixo da dobra em
            TODO registro, inclusive nos nove de dez em que a data é hoje e
            ninguém encosta nela.

            Agora o campo mostra a data por extenso — "Segunda, 21 de
            setembro" — e a grade abre no toque. É a leitura sem conta de
            cabeça, sem cobrar a altura de quem não precisa dela.

            ⚠️ O VALOR FICA À VISTA MESMO FECHADO, e é isso que separa
            deste campo da primeira versão: lá, fechado, a tela mostrava
            uma pastilha acesa e a pessoa tinha de saber o que "Anteontem"
            queria dizer. Aqui ela lê a data.

            "Outro horário" nunca voltou. A hora de uma aplicação não
            aparece em lugar nenhum do aplicativo: o histórico mostra data,
            o calendário conta por dia, a curva farmacológica trabalha em
            dias. */}
        <Campo
          rotulo={K().quando}
          ajuda={quandoT === hoje ? K().ficaRegistradaAgora(fmtTime(now())) : K().registrarDepois}
        >
          <Pressable
            onPress={() => setCalAberto((x) => !x)}
            style={({ pressed }) => [{
              backgroundColor: c.bg2, borderRadius: radius.md,
              paddingHorizontal: 14, paddingVertical: 13,
              opacity: pressed ? 0.7 : 1,
            }]}
          >
            <Row style={{ justifyContent: 'space-between', alignItems: 'center', gap: 10 }}>
              <Txt v="bodyMed">{maiuscula(dataComDiaDaSemana(new Date(quandoT)))}</Txt>
              {/* A seta aponta para baixo quando há grade para abrir, e
                  para cima quando ela já está aberta: é o mesmo controle
                  nos dois sentidos, e a direção diz qual deles. */}
              <Icon name={calAberto ? 'chevup' : 'chevdown'} size={16} color={c.tx3} sw={2.2} />
            </Row>
          </Pressable>
          {/* Escolher FECHA a grade. É o que confirma o valor — a data
              escolhida aparece no campo, que é onde ela vai ficar — e é o
              que devolve os duzentos e oitenta pixels para o resto do
              formulário. Quem errou o dia toca de novo. */}
          {calAberto ? (
            <Calendario
              valor={quandoT}
              onEscolhe={(t) => { setQuandoT(t); setCalAberto(false); }}
            />
          ) : null}
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
          rotulo={med.doses.length ? K().medicamentoEDose : K().medicamentoEDoseDaReceita}
          ajuda={mudandoDose && !med.doses.length
            ? K().manipuladoSemEscada
            : undefined}
        >
          <Row style={{ justifyContent: 'space-between', alignItems: 'center', gap: 10 }}>
            <Txt v="bodyMed">{K().medComDose(med.label, nf(dose, 1), med.unit)}</Txt>
            {!mudandoDose ? (
              <Pressable
                onPress={() => setMudandoDose(true)}
                hitSlop={8}
                style={({ pressed }) => [{ opacity: pressed ? 0.6 : 1 }]}
              >
                <Row gap={4} style={{ alignItems: 'center' }}>
                  <Txt v="label" c={c.accent}>{K().mudeiADose}</Txt>
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
              <Txt v="note" c={c.tx3}>{K().semFaixa}</Txt>
            )
          ) : null}
        </Campo>

        {vocab.injetavel ? (
          <>
            <Campo
              rotulo={K().localDaAplicacao}
              ajuda={K().localAjuda}
            >
              <Opcoes>
                {REGIOES().map(([id, nome]) => (
                  <Opc
                    key={id}
                    /* O "sugerido" marca a REGIÃO, e o lado dele já vem
                       escolhido — a rotação sugere um ponto, não uma
                       metade do corpo. */
                    label={regiaoDe(sugerido) === id ? K().sugerido(nome) : nome}
                    on={regiaoDe(site) === id}
                    onPress={() => setSite(`${id}-${ladoDe(site)}`)}
                  />
                ))}
              </Opcoes>
            </Campo>

            <Campo rotulo={K().lado}>
              <Opcoes>
                {LADOS().map(([id, nome]) => (
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
                <Txt v="caption" c={c.tx2}>{K().localComDescanso(siteLabel(site), descanso)}</Txt>
                <Txt v="caption" c={site === sugerido ? c.accent : c.tx3}>
                  {site === sugerido
                    ? K().eOProximo
                    : K().foraDaRotacao}
                </Txt>
              </View>
            </Campo>

            {/* O medicamento saiu deste rótulo: ele agora é dito uma vez
                só, lá em cima. O que é DESTE campo é o recipiente — qual
                está em uso e quantas doses restam nele. */}
            <Campo
              rotulo={maiuscula(vocab.recipiente)}
              ajuda={est.left <= 1
                ? K().ultimaDose(
                  concordar(forma, T.tratamento.telaCaneta.desteM, T.tratamento.telaCaneta.desteF),
                  vocab.recipiente,
                )
                : K().restamDoses(est.left)}
            >
              <Opcoes>
                <Opc
                  label={K().enesimaDose(est.total - est.left + 1)}
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
