import React, { useEffect, useState } from 'react';
import { View, Pressable } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useStore } from '../logic/store';
import {
  M, nextSite, siteLabel, penStock, instanteDaAplicacao, rodizioDeLocais,
  dosesPorRecipiente, recipienteDaDose, faltaNaDose,
  gravarDose, dosesNoDia, doseDiaria,
} from '../logic/derive';
import { FORMAS, concordar, formaDe, faixaDaMolecula, meioDaFaixa, umOutro, oA } from '../logic/formas';
import { PerguntaDaValidade } from '../ui/recipiente';
import { now, fmtTime, doseTxt, dataComDiaDaSemana, maiuscula, startOfDay } from '../logic/time';
import { radius } from '../theme';
import { Txt, Row, SheetScreen } from '../ui/kit';
import { T } from '../textos';

/* ⚠️ É FUNÇÃO, e não constante de módulo: ela lê o catálogo, e constante
   de módulo congela o idioma no import. */
const K = () => T.tratamento.telaRegistrarAplicacao;
/* As grafias do recipiente que concordam — "nova/novo", "desta/deste". */
const KC = () => T.tratamento.telaCaneta;
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
   não escolhe onde aplicou — e o título, "Registrar dose", vale para as
   quatro formas desde 01/10/2026 (`acao` é "dose" em todas; ver
   textos/formas).

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

  /* ⚠️ A FOLHA PODE ABRIR NUM DIA QUE PASSOU (`?t=`, o dia às 00h —
     01/10/2026, parte B1). Quem toca "registrar" na folha de um dia da
     fileira de sete (app/dia) lembrou daquele dia, e não de hoje: a folha
     abria em hoje, a pessoa salvava sem conferir, e a dose ia para o dia
     errado — o dia esquecido continuava vazio e hoje ficava com duas.
     Nunca adiante: o calendário daqui não aceita futuro (ui/calendario), e
     o parâmetro também não. */
  const { t: tParam } = useLocalSearchParams<{ t?: string }>();
  const pedido = tParam != null && Number.isFinite(Number(tParam)) ? +startOfDay(new Date(Number(tParam))) : null;
  const [quandoT, setQuandoT] = useState(pedido != null && pedido <= hoje ? pedido : hoje);
  const [calAberto, setCalAberto] = useState(false);
  /* A segunda dose do mesmo dia pede confirmação — ver `salvar`. */
  const [confirmandoDupla, setConfirmandoDupla] = useState(false);
  /* Sem dose no perfil, com escada, nenhum degrau vem escolhido; sem
     escada, a régua abre no meio da faixa, como no cadastro. */
  const [dose, setDose] = useState<number>(S.profile.dose || meioDaFaixa(S.profile.med) || 0);
  const [mudandoDose, setMudandoDose] = useState(false);
  const [site, setSite] = useState(sugerido);
  const [outroRecipiente, setOutroRecipiente] = useState(false);

  /* ============================================================
     O QUE FALTA SE PREENCHE AQUI (pedido do dono, 26/09)

     ⚠️ A DOSE SE REGISTRAVA SEM MEDICAMENTO E SEM CANETA. Quem respondeu
     "ainda não sei" no cadastro via "Ainda não definido · 0 mg" e salvava
     assim; e sem recipiente registrado o campo dele dizia "1ª dose ·
     Restam 4 doses" — a conta de uma caneta que ninguém registrou —, e a
     dose saía sem caneta nenhuma.

     Agora a dose só se registra com os dois, e o que faltar se responde
     aqui mesmo, sem sair do registro: o medicamento pela lista do
     cadastro (que grava e volta para cá), a dose pela escada ou pela
     régua, e o recipiente num campo que o registra junto com a dose. O
     botão de salvar espera as respostas.
     ============================================================ */
  const semMedicamento = S.profile.med === 'indefinido';
  /* O medicamento pode mudar no meio do registro — quem chegou sem ele
     escolhe na lista e volta —, e a dose que estava na folha era a do
     medicamento de antes. */
  const [medAoAbrir] = useState(S.profile.med);
  const medMudou = S.profile.med !== medAoAbrir;
  useEffect(() => {
    if (medMudou) setDose(S.profile.dose || meioDaFaixa(S.profile.med) || 0);
  }, [S.profile.med]);
  /* Sem dose no perfil, ou com o medicamento trocado agora, a escolha
     abre sozinha: não há "mudei a dose" para quem ainda não tinha uma. */
  const escolhendoDose = !semMedicamento && (mudandoDose || medMudou || !(S.profile as any).dose);

  /* O RECIPIENTE VEM JUNTO quando ainda não há nenhum registrado — e só
     para quem injeta. A pergunta é se ele é novo, porque o primeiro
     registro pode chegar no meio de uma caneta (de quem começou antes do
     aplicativo), e contar essa como cheia seria a mesma conta inventada
     de antes. */
  const registraRecipiente = vocab.injetavel && !est.registrada && !semMedicamento;
  const porCaneta = dosesPorRecipiente(S);
  const [estadoDoRecipiente, setEstadoDoRecipiente] = useState<'novo' | 'emUso' | null>(null);
  const [jaSairam, setJaSairam] = useState<number | null>(null);
  const [validade, setValidade] = useState<number | null>(null);
  const usadasAntes = estadoDoRecipiente === 'novo' ? 0 : estadoDoRecipiente === 'emUso' ? jaSairam : null;
  /* A validade só se pergunta quando o catálogo não sabe — ver ui/recipiente. */
  const perguntaValidade = registraRecipiente && med.shelf === 0;
  const aberto = concordar(forma, KC().abertoM, KC().abertoF);
  const deste = concordar(forma, KC().desteM, KC().desteF);

  const podeSalvar = faltaNaDose(S, { dose, usadasAntes }).length === 0;

  /* Quantos recipientes havia quando a folha abriu: se a pessoa abrir
     outro daqui, é isto que diz que o último da lista é o dela. */
  const [recipientesAoAbrir] = useState((((S as any).pens ?? []) as unknown[]).length);

  /* Sem escada de bula — manipulado — a dose é um número livre, e a faixa
     vem da molécula NA MESMA VIA. Ver a nota em logic/formas. */
  const faixa = med.doses.length ? null : faixaDaMolecula(med.mol, forma);

  /* ⚠️⚠️ NA DOSE DIÁRIA, UMA SEGUNDA DOSE NO MESMO DIA PEDE CONFIRMAÇÃO
     (01/10/2026, parte B1 de docs/superpowers/specs/2026-10-01-oral-e-diario-design.md).
     Com dose todo dia, "será que já registrei a de hoje?" é a dúvida de
     sempre, e a folha não respondia: salvava a segunda, e dose dobrada
     no histórico vai para o resumo da consulta como dose dobrada. Não
     há borracha (ver a nota do histórico em app/aplicacoes), então a
     pergunta vem antes. Pode ter sido mesmo uma segunda dose — o botão
     de cima a registra. Na caneta semanal, duas no mesmo dia nunca
     foram o caso a proteger, e a folha continua como era. */
  const doDia = dosesNoDia(S, quandoT);
  const pedeConfirmacao = doseDiaria(S) && doDia.length > 0;
  const horaDoDia = quandoT === hoje && doDia.length ? fmtTime(new Date(doDia[doDia.length - 1].t)) : null;
  /* Trocar o dia desfaz a pergunta: ela era sobre o dia de antes. */
  useEffect(() => { setConfirmandoDupla(false); }, [quandoT]);

  const salvar = () => {
    if (!podeSalvar) return;
    if (pedeConfirmacao && !confirmandoDupla) {
      setConfirmandoDupla(true);
      return;
    }
    const t = instanteDaAplicacao(quandoT);
    update((s: any) => {
      if (registraRecipiente) {
        s.pens = [...(s.pens ?? []), recipienteDaDose({
          t, med: s.profile.med, dose, dosesPerPen: porCaneta,
          usadasAntes: usadasAntes ?? 0, validadeDias: validade ?? undefined,
        })];
      } else if (outroRecipiente && (s.pens?.length ?? 0) > recipientesAoAbrir) {
        /* ⚠️ O RECIPIENTE ABERTO AGORA, EM /caneta-nova, NASCEU NO TOQUE —
           e a dose pode ser de ontem. Sem isto ela cairia no recipiente
           anterior, justo o que a pessoa disse que não usou. */
        const novo = s.pens[s.pens.length - 1];
        if (novo.t > t) novo.t = t;
      }
      /* ⚠️ LOCAL SÓ NA DOSE INJETADA (01/10/2026). O estado nasce do local
         sugerido e era gravado mesmo com o campo escondido: cada comprimido
         ganhava um local de injeção inventado, que ia para o histórico e
         para o PDF do médico. Os já gravados não aparecem mais
         (logic/formas, localDaDose). */
      /* ⚠️ `gravarDose`, E NÃO `push` + `profile.dose = dose` (01/10/2026,
         conserto da parte B1 que vale para todos). A dose entra no lugar
         da data dela, e a dose do perfil só muda quando esta é a mais
         recente: registrar hoje a dose de 3 mg de duas semanas atrás,
         já em 7 mg, fazia a pessoa voltar a "estar" em 3 mg. */
      gravarDose(s, { t, med: s.profile.med, dose, site: vocab.injetavel ? site : '', note: '' });
      /* Nada a decrementar: quantas doses saíram do recipiente é quantas
         aplicações caíram na janela dele. Ver `canetas` em logic/derive. */
    });
    /* O instante vai junto: a confirmação mostra ESTA dose, e não a mais
       recente — que, num registro retroativo, é outra (app/aplicacao-ok). */
    router.replace(`/aplicacao-ok?t=${t}` as any);
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
      /* A pergunta da segunda dose mora no pé, no lugar do botão: é ali
         que o dedo está, e no corpo da folha ela ficaria abaixo da dobra. */
      rodape={confirmandoDupla ? (
        <View style={{ gap: 10 }}>
          <Txt v="bodyMed">{K().jaHaNoDia(horaDoDia)}</Txt>
          <Txt v="caption" c={c.tx2}>{K().duplaTexto}</Txt>
          <Botao label={K().registrarMaisUma} onPress={salvar} />
          <Botao
            label={K().trocarODia}
            tom="fantasma"
            onPress={() => { setConfirmandoDupla(false); setCalAberto(true); }}
          />
        </View>
      ) : <Botao label={K().salvar(vocab.acao)} onPress={salvar} desligado={!podeSalvar} />}
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
          rotulo={med.doses.length || semMedicamento ? K().medicamentoEDose : K().medicamentoEDoseDaReceita}
          ajuda={semMedicamento
            ? K().semMedicamentoAjuda
            : escolhendoDose && !med.doses.length
              ? K().manipuladoSemEscada
              : escolhendoDose && !(S.profile as any).dose
                ? K().doseDaReceita
                : undefined}
        >
          {semMedicamento ? (
            /* Sem medicamento, a lista do cadastro — a mesma de Seus
               dados —, que grava no tratamento e volta para cá. Uma lista
               de marcas em pastilhas aqui dentro seria a terceira cópia
               dela, sem a ordem por país. */
            <Pressable
              onPress={() => router.push('/cadastro?editar=medicamento' as any)}
              style={({ pressed }) => [{
                backgroundColor: c.bg2, borderRadius: radius.md,
                paddingHorizontal: 14, paddingVertical: 13,
                opacity: pressed ? 0.7 : 1,
              }]}
            >
              <Row style={{ justifyContent: 'space-between', alignItems: 'center', gap: 10 }}>
                <Txt v="bodyMed" c={c.accent}>{K().escolherMedicamento}</Txt>
                <Icon name="chev" size={14} color={c.accent} sw={2.2} />
              </Row>
            </Pressable>
          ) : (
            <Row style={{ justifyContent: 'space-between', alignItems: 'center', gap: 10 }}>
              {/* Sem dose escolhida, o nome sozinho: "· 0 mg" seria uma dose. */}
              <Txt v="bodyMed">{dose ? K().medComDose(med.label, doseTxt(dose), med.unit) : med.label}</Txt>
              {!escolhendoDose ? (
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
          )}

          {escolhendoDose ? (
            med.doses.length ? (
              <Opcoes>
                {med.doses.map((d) => (
                  <Opc
                    key={d}
                    label={`${doseTxt(d)} ${med.unit}`}
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

        {/* O RECIPIENTE QUE AINDA NÃO EXISTE entra logo abaixo do
            medicamento, e não no pé da folha, onde mora o de quem já tem
            um: é uma resposta que o botão de salvar espera, e no pé ela
            ficaria abaixo da dobra, com o botão apagado sem motivo à
            vista. */}
        {registraRecipiente ? (
          <>
            <Campo
              rotulo={maiuscula(vocab.recipiente)}
              ajuda={usadasAntes == null
                ? K().registraJunto(`${oA(forma)} ${vocab.recipiente}`, porCaneta, vocab.recipiente)
                : porCaneta - usadasAntes <= 1
                  ? K().ultimaDose(deste, vocab.recipiente)
                  : K().restamDoses(porCaneta - usadasAntes)}
            >
              <Opcoes>
                <Opc
                  label={concordar(forma, KC().novoM, KC().novoF)}
                  on={estadoDoRecipiente === 'novo'}
                  onPress={() => setEstadoDoRecipiente('novo')}
                />
                {porCaneta > 1 ? (
                  <Opc
                    label={K().jaEmUso}
                    on={estadoDoRecipiente === 'emUso'}
                    onPress={() => setEstadoDoRecipiente('emUso')}
                  />
                ) : null}
              </Opcoes>
              {/* Em uso, quantas já tinham saído — de uma até a penúltima:
                  com todas fora, esta dose não sairia dele. */}
              {estadoDoRecipiente === 'emUso' ? (
                <>
                  <Txt v="caption" c={c.tx2}>{K().quantasJaSairam(deste, vocab.recipiente)}</Txt>
                  <Opcoes>
                    {Array.from({ length: porCaneta - 1 }, (_, i) => i + 1).map((n) => (
                      <Opc key={n} label={K().doses(n)} on={jaSairam === n} onPress={() => setJaSairam(n)} />
                    ))}
                  </Opcoes>
                </>
              ) : null}
            </Campo>
            {perguntaValidade ? (
              <PerguntaDaValidade aberto={aberto} valor={validade} onMuda={setValidade} />
            ) : null}
          </>
        ) : null}

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
                está em uso e quantas doses restam nele. Sem nenhum
                registrado, ele é o campo de cima, que o registra. */}
            {est.registrada ? (
              <Campo
                rotulo={maiuscula(vocab.recipiente)}
                ajuda={est.left <= 1
                  ? K().ultimaDose(deste, vocab.recipiente)
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
            ) : null}
          </>
        ) : null}
      </View>
    </SheetScreen>
  );
}
