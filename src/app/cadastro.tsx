import React, { useMemo, useState } from 'react';
import { View, Pressable, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useStore } from '../logic/store';
import { MEDS } from '../logic/meds';
import { MO, MO_LONG, now, startOfDay, nf } from '../logic/time';
import { Txt, Row, CircleBtn } from '../ui/kit';
import { Icon } from '../ui/Icon';
import { Botao, Stepper } from '../ui/internas';
import { useTheme } from '../ui/useTheme';
import { radius } from '../theme';

/* ============================================================
   CADASTRO — as seis perguntas antes da primeira tela

   O app inteiro pressupõe um perfil: qual caneta, qual dose, quanto a
   pessoa pesa, onde ela quer chegar e desde quando está nisso. Sem essas
   cinco coisas não existe "semana 11", não existe próxima aplicação e não
   existe meta — e até aqui elas vinham da semente, ou seja, de ninguém.

   TODAS SÃO OBRIGATÓRIAS, e isso é decisão de produto. A versão que
   recebi abria dizendo "7 perguntas rápidas — todas opcionais" e punha
   "Pular esta pergunta" no pé de cada uma, além de "Pular tudo" no topo.
   É simpático e é uma armadilha: quem pula chega numa Home que não sabe
   dizer nada sobre ele, e a primeira impressão do app vira um painel de
   traços. Seis perguntas curtas, respondidas uma vez, valem mais do que a
   liberdade de não responder nenhuma.

   O QUE MUDOU DO DESENHO ORIGINAL, e por quê:

   · A pergunta da FREQUÊNCIA saiu. O app já sabe: MEDS diz se a caneta é
     semanal ou diária, e CADENCE_DAYS lê dali. Perguntar de novo só cria
     a chance de a resposta discordar do catálogo — e aí duas partes do
     app passam a contar dias diferentes.

   · A lista de DOSES agora depende do medicamento. Era fixa em 2,5 a 15
     mg, que é a escada do Mounjaro; quem usa Ozempic ia de 0,25 a 2, e
     quem usa Saxenda nunca viu 15 mg na vida. Oferecer dose que não
     existe naquela caneta é a primeira coisa que faz alguém desconfiar.

   · O "Outro / ainda não sei" do medicamento saiu junto. Não é
     preciosismo: o modelo do app pendura meia-vida, escada de doses,
     cadência e validade da caneta no id do medicamento, e um id que não
     está no catálogo derruba a leitura inteira. Com a resposta
     obrigatória, aceitar "não sei" seria gravar um estado que nenhuma
     tela consegue ler.

   · Victoza entrou. Estava no catálogo do app e faltava na lista.

   · A META virou só peso, a pedido. A tela de metas continua sendo o
     lugar de "vestir uma roupa" e das metas pessoais — o cadastro fica
     com o número que a Home e a Jornada leem todo dia.

   · O "Prefiro não dizer agora" sumiu das duas perguntas onde aparecia.
     É pular com outro nome.
   ============================================================ */

/* As seis, na ordem. O texto do começo é o mesmo para as duas situações;
   o que muda entre "já apliquei" e "vou começar" está em `futuro`. */
type Id = 'tratamento' | 'medicamento' | 'dose' | 'peso' | 'meta' | 'inicio';
const PASSOS: Id[] = ['tratamento', 'medicamento', 'dose', 'peso', 'meta', 'inicio'];

type Respostas = {
  emTratamento: boolean | null;
  med: string | null;
  dose: number | null;
  peso: number;
  meta: number;
  inicio: number | null;
};

const VAZIO: Respostas = {
  emTratamento: null, med: null, dose: null,
  /* Peso e meta nascem com um número porque o controle deles é um
     stepper: ele precisa de uma posição de partida para a pessoa subir ou
     descer a partir dali. 80 e 70 não são recomendação nenhuma — são o
     meio da régua, e a pessoa move nos dois sentidos. */
  peso: 80, meta: 70,
  inicio: null,
};

/* ------------------------------------------------------------------ */
/* A ESCOLHA — o cartão de uma alternativa.

   `Opc`, do vocabulário, é de uma linha só, e aqui quase toda opção tem
   duas: "Mounjaro" precisa da molécula embaixo, "Já apliquei alguma dose"
   precisa do que aquilo quer dizer. Mora nesta tela porque é o único
   lugar do app onde a lista de alternativas é a tela inteira. */
function Escolha({ ic, titulo, sub, on, onPress }: {
  ic: string; titulo: string; sub?: string; on?: boolean; onPress: () => void;
}) {
  const { c } = useTheme();
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [{
        flex: 1, minWidth: 0,
        backgroundColor: on ? c.accentWeak : c.bg1,
        borderRadius: radius.card, borderWidth: 1.5,
        borderColor: on ? c.accent : c.line,
        padding: 14, gap: 10, opacity: pressed ? 0.85 : 1,
      }]}
    >
      <Row style={{ justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <View style={{
          width: 32, height: 32, borderRadius: radius.sm,
          backgroundColor: on ? c.accent : c.bg2,
          alignItems: 'center', justifyContent: 'center',
        }}>
          <Icon name={ic} size={16} color={on ? c.accentInk : c.tx3} sw={1.9} />
        </View>
        {/* A marca do escolhido em lima, que é a cor do feito no app
            inteiro. Ela existe porque a lavagem azul sozinha pede
            comparação com os vizinhos para se ler como "este". */}
        {on ? (
          <View style={{
            width: 20, height: 20, borderRadius: 10, backgroundColor: c.lime,
            alignItems: 'center', justifyContent: 'center',
          }}>
            <Icon name="check" size={12} color={c.limeInk} sw={2.8} />
          </View>
        ) : null}
      </Row>
      <View>
        <Txt v="bodyMed" numberOfLines={2}>{titulo}</Txt>
        {sub ? <Txt v="caption" c={c.tx3} style={{ marginTop: 2 }} numberOfLines={2}>{sub}</Txt> : null}
      </View>
    </Pressable>
  );
}

/* Duas colunas de largura igual. Ímpar no fim ocupa a linha inteira, e
   não meia: sobrar um vão do lado direito faz a última opção parecer o
   resto de alguma coisa. */
function Duplas({ children }: { children: React.ReactNode }) {
  const itens = React.Children.toArray(children).filter(Boolean);
  const linhas: React.ReactNode[][] = [];
  for (let i = 0; i < itens.length; i += 2) linhas.push(itens.slice(i, i + 2));
  return (
    <View style={{ gap: 10 }}>
      {linhas.map((l, i) => (
        <Row key={i} style={{ gap: 10, alignItems: 'stretch' }}>{l}</Row>
      ))}
    </View>
  );
}

/* ------------------------------------------------------------------ */
/* O CALENDÁRIO — mês na tira, dia na grade.

   A versão que recebi usava roda de três colunas (dia / mês / ano). Roda
   é controle de sistema operacional: fora dele, ela vira uma lista que
   rola sem dizer onde termina, e no navegador não rola direito. Aqui o
   mês é uma tira horizontal e o dia é uma grade de sete colunas — dois
   toques, e a pessoa vê o mês inteiro de uma vez.

   Os dias impossíveis ficam apagados e não respondem: quem já começou não
   começou amanhã, e quem vai começar não vai começar ontem. */
const SIGLAS = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'];

function Calendario({ valor, onEscolhe, futuro }: {
  valor: number | null; onEscolhe: (t: number) => void; futuro: boolean;
}) {
  const { c } = useTheme();
  const hoje = startOfDay(now());

  /* Doze meses para trás, ou este e os dois seguintes. Ninguém começou um
     tratamento em 2019 e vem cadastrar hoje — e se veio, o perfil resolve
     depois com o número exato. */
  const meses = useMemo(() => {
    const fora: { ano: number; mes: number }[] = [];
    const n = futuro ? 3 : 12;
    for (let i = 0; i < n; i++) {
      const d = new Date(hoje.getFullYear(), hoje.getMonth() + (futuro ? i : -i), 1);
      fora.push({ ano: d.getFullYear(), mes: d.getMonth() });
    }
    return futuro ? fora : fora.reverse();
  }, [futuro, +hoje]);

  const doValor = valor != null ? new Date(valor) : null;
  const [sel, setSel] = useState(() => {
    const i = doValor
      ? meses.findIndex((m) => m.ano === doValor.getFullYear() && m.mes === doValor.getMonth())
      : -1;
    return i >= 0 ? i : (futuro ? 0 : meses.length - 1);
  });

  const m = meses[Math.min(sel, meses.length - 1)];
  const primeiro = new Date(m.ano, m.mes, 1);
  const dias = new Date(m.ano, m.mes + 1, 0).getDate();
  const vao = primeiro.getDay();

  const podeDia = (d: number) => {
    const t = +new Date(m.ano, m.mes, d);
    return futuro ? t >= +hoje : t <= +hoje;
  };

  /* A TIRA ABRE NO MÊS ESCOLHIDO, e não no começo dela.

     Doze meses não cabem na largura de um telefone, e quem já começou o
     tratamento começou perto de hoje — o mês certo é quase sempre o
     último da fila. Sem isto, a tira abria em outubro do ano passado
     enquanto a grade embaixo mostrava setembro deste: a pessoa via um
     calendário sem nenhuma pastilha marcada.

     Dois gatilhos porque conteúdo e caixa são medidos em ordens
     diferentes conforme a plataforma. Quem vai começar não precisa: o mês
     dele é o primeiro. */
  const tira = React.useRef<ScrollView>(null);
  const aoFim = () => { if (!futuro) tira.current?.scrollToEnd({ animated: false }); };

  return (
    <View style={{ gap: 14 }}>
      <ScrollView
        ref={tira}
        horizontal
        showsHorizontalScrollIndicator={false}
        onContentSizeChange={aoFim}
        onLayout={aoFim}
        contentContainerStyle={{ gap: 7 }}
      >
        {meses.map((x, i) => {
          const on = i === sel;
          return (
            <Pressable
              key={`${x.ano}-${x.mes}`}
              onPress={() => setSel(i)}
              style={({ pressed }) => [{
                paddingHorizontal: 14, paddingVertical: 8, borderRadius: radius.pill,
                borderWidth: 1, borderColor: on ? c.tx : c.line,
                backgroundColor: on ? c.tx : c.bg1, opacity: pressed ? 0.7 : 1,
              }]}
            >
              <Txt v="label" c={on ? c.bg1 : c.tx2}>
                {MO[x.mes]}{x.ano !== hoje.getFullYear() ? ` ${String(x.ano).slice(2)}` : ''}
              </Txt>
            </Pressable>
          );
        })}
      </ScrollView>

      <View style={{ backgroundColor: c.bg1, borderRadius: radius.card, padding: 12, gap: 6 }}>
        <Row>
          {SIGLAS.map((s, i) => (
            <View key={i} style={{ flex: 1, alignItems: 'center' }}>
              <Txt v="micro" c={c.tx4}>{s}</Txt>
            </View>
          ))}
        </Row>
        {Array.from({ length: Math.ceil((vao + dias) / 7) }, (_, semana) => (
          <Row key={semana}>
            {Array.from({ length: 7 }, (_, col) => {
              const d = semana * 7 + col - vao + 1;
              if (d < 1 || d > dias) return <View key={col} style={{ flex: 1, height: 38 }} />;
              const t = +new Date(m.ano, m.mes, d);
              const on = valor != null && +startOfDay(new Date(valor)) === t;
              const pode = podeDia(d);
              return (
                <Pressable
                  key={col}
                  onPress={pode ? () => onEscolhe(t) : undefined}
                  style={({ pressed }) => [{
                    flex: 1, height: 38, alignItems: 'center', justifyContent: 'center',
                    opacity: pressed && pode ? 0.6 : 1,
                  }]}
                >
                  <View style={{
                    width: 34, height: 34, borderRadius: 17,
                    alignItems: 'center', justifyContent: 'center',
                    backgroundColor: on ? c.accent : 'transparent',
                  }}>
                    <Txt v="caption" c={on ? c.accentInk : pode ? c.tx : c.tx4}>{d}</Txt>
                  </View>
                </Pressable>
              );
            })}
          </Row>
        ))}
      </View>
    </View>
  );
}

/* ------------------------------------------------------------------ */
/* A DOSE SE ESCREVE COM AS CASAS QUE ELA TEM.

   O formatador do app arredonda para uma casa, e com isso os 0,25 mg do
   Ozempic viravam "0,3 mg" — dose que não existe em caneta nenhuma, logo
   na tela em que a pessoa está escolhendo a dela. */
const doseTxt = (d: number) => nf(d, d % 1 === 0 ? 0 : Math.round(d * 10) === d * 10 ? 1 : 2);

const dataPorExtenso = (t: number) => {
  const d = new Date(t);
  return `${d.getDate()} de ${MO_LONG[d.getMonth()]} de ${d.getFullYear()}`;
};

export default function Cadastro() {
  const update = useStore((s) => s.update);
  const { c } = useTheme();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  /* -1 é a abertura, 0..5 são as perguntas, 6 é o resumo e 7 é o fim. */
  const [n, setN] = useState(-1);
  const [r, setR] = useState<Respostas>(VAZIO);
  /* QUEM ENTROU PELO LÁPIS VOLTA PELO LÁPIS.

     O resumo promete "toque no lápis para mudar qualquer resposta", e
     mudar uma resposta não devia obrigar a atravessar as outras de novo.
     Sem isto, quem corrigia a dose no passo 3 tinha que passar por peso,
     meta e data outra vez para reencontrar o resumo. */
  const [doResumo, setDoResumo] = useState(false);
  const aoResumo = () => { setDoResumo(false); setN(6); };
  const p = (x: Partial<Respostas>) => setR((v) => ({ ...v, ...x }));

  const futuro = r.emTratamento === false;
  const med = r.med ? MEDS[r.med] : null;

  /* A PERGUNTA RESPONDIDA, uma por passo. É ela que liga o botão: sem a
     resposta o "Continuar" fica desligado, e é assim que "obrigatória"
     se diz sem precisar de mensagem de erro. */
  const respondida = [
    r.emTratamento != null,
    r.med != null,
    r.dose != null,
    true,
    true,
    r.inicio != null,
  ];

  const salvar = () => {
    update((s: any) => {
      s.profile.med = r.med;
      s.profile.dose = r.dose;
      s.profile.startWeight = r.peso;
      s.profile.goalWeight = r.meta;
      s.profile.startT = r.inicio;
      /* O peso de hoje entra como PESAGEM, e não só como número do perfil:
         a curva de evolução, o "de → para" da Jornada e a meta leem a
         lista de pesagens. Sem esta linha a pessoa acabaria o cadastro
         dizendo que pesa 80 kg e o app abriria dizendo que não sabe. */
      const t = +startOfDay(now());
      /* Desduplica por DIA, e não por instante: pesagem gravada às três da
         tarde tem hora no carimbo, e comparar timestamps crus deixaria
         dois pesos de hoje na lista — um deles o que a pessoa acabou de
         dizer, o outro o que a curva ia continuar lendo. */
      const resto = (s.weights || []).filter((w: any) => +startOfDay(new Date(w.t)) !== t);
      s.weights = [...resto, { t, kg: r.peso }].sort((a: any, b: any) => a.t - b.t);
    });
    setN(7);
  };

  /* ---------- abertura ---------- */
  if (n === -1) {
    return (
      <View style={{ flex: 1, backgroundColor: c.bg, paddingTop: insets.top, paddingHorizontal: 20 }}>
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', gap: 18 }}>
          <View style={{
            width: 56, height: 56, borderRadius: radius.card, backgroundColor: c.bg1,
            alignItems: 'center', justifyContent: 'center',
          }}>
            <Icon name="heart" size={26} color={c.accent} sw={1.8} />
          </View>
          <Txt v="h1" style={{ textAlign: 'center' }}>Vamos conhecer{'\n'}seu tratamento</Txt>
          {/* A promessa mudou junto com a regra: onde o texto dizia "todas
              opcionais, você pode pular", ele agora diz quanto custa e o
              que muda depois. Prometer que dá para pular e depois não
              deixar seria pior do que nunca ter prometido. */}
          <Txt v="caption" c={c.tx2} style={{ textAlign: 'center', maxWidth: 280 }}>
            São seis perguntas curtas. É com elas que o Morphi monta a sua Home — e
            qualquer uma pode ser mudada depois, no seu perfil.
          </Txt>
        </View>
        <View style={{ paddingBottom: insets.bottom + 20 }}>
          <Botao label="Começar" onPress={() => setN(0)} />
        </View>
      </View>
    );
  }

  /* ---------- fim ---------- */
  if (n === 7) {
    return (
      <View style={{ flex: 1, backgroundColor: c.accent, paddingTop: insets.top, paddingHorizontal: 24 }}>
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', gap: 20 }}>
          <View style={{
            width: 72, height: 72, borderRadius: 36, backgroundColor: c.lime,
            alignItems: 'center', justifyContent: 'center',
          }}>
            <Icon name="check" size={34} color={c.limeInk} sw={2.6} />
          </View>
          <Txt v="h1" c={c.accentInk} style={{ textAlign: 'center' }}>Tudo certo por aqui</Txt>
          <Txt v="caption" c="rgba(255,255,255,0.82)" style={{ textAlign: 'center', maxWidth: 290 }}>
            {futuro
              ? `O Morphi já está configurado. Sua primeira aplicação é ${dataPorExtenso(r.inicio as number)} — daqui até lá, dá para ir conhecendo o app.`
              : 'O Morphi já está configurado com o que você contou. A partir daqui, é um registro de cada vez.'}
          </Txt>
        </View>
        <View style={{ paddingBottom: insets.bottom + 20 }}>
          <Pressable
            onPress={() => router.replace('/(tabs)' as any)}
            style={({ pressed }) => [{
              borderRadius: radius.md + 3, backgroundColor: c.bg1,
              paddingVertical: 16, alignItems: 'center', opacity: pressed ? 0.85 : 1,
            }]}
          >
            <Txt v="bodyMed" c={c.accent}>Ir para a minha Home</Txt>
          </Pressable>
        </View>
      </View>
    );
  }

  /* ---------- resumo ---------- */
  if (n === 6) {
    const cartoes: [string, string, string, number][] = [
      ['spark', 'SITUAÇÃO', futuro ? 'Vou começar' : 'Já em tratamento', 0],
      ['pill', 'MEDICAMENTO', med?.label ?? '—', 1],
      ['syringe', 'DOSE', `${doseTxt(r.dose ?? 0)} ${med?.unit ?? 'mg'}`, 2],
      ['scale', 'PESO DE HOJE', `${nf(r.peso, 1)} kg`, 3],
      ['target', 'META', `${nf(r.meta, 1)} kg`, 4],
      ['cal', futuro ? 'PRIMEIRA DOSE' : 'INÍCIO', r.inicio ? dataPorExtenso(r.inicio) : '—', 5],
    ];
    return (
      <View style={{ flex: 1, backgroundColor: c.bg, paddingTop: insets.top }}>
        <ScrollView contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 28, paddingBottom: 24 }}>
          <Txt v="h1" style={{ textAlign: 'center' }}>Prontinho</Txt>
          <Txt v="caption" c={c.tx2} style={{ textAlign: 'center', marginTop: 6, marginBottom: 24 }}>
            Toque no lápis para mudar qualquer resposta.
          </Txt>
          <Duplas>
            {cartoes.map(([ic, rotulo, valor, passo]) => (
              <View
                key={rotulo}
                style={{ flex: 1, backgroundColor: c.bg1, borderRadius: radius.card, padding: 14, gap: 10 }}
              >
                <Row style={{ justifyContent: 'space-between', alignItems: 'center' }}>
                  <Icon name={ic} size={16} color={c.tx3} sw={1.9} />
                  <Pressable onPress={() => { setDoResumo(true); setN(passo); }} hitSlop={10} style={({ pressed }) => [{ opacity: pressed ? 0.6 : 1 }]}>
                    <Icon name="pencil" size={15} color={c.accent} sw={1.9} />
                  </Pressable>
                </Row>
                <View>
                  <Txt v="micro" c={c.tx4} style={{ letterSpacing: 1 }}>{rotulo}</Txt>
                  <Txt v="bodyMed" style={{ marginTop: 3 }} numberOfLines={2}>{valor}</Txt>
                </View>
              </View>
            ))}
          </Duplas>
        </ScrollView>
        {/* ARRASTAR PARA CONFIRMAR VIROU BOTÃO.

            O arraste é o gesto de quem vai fazer algo que não dá para
            desfazer — apagar, enviar, pagar. Aqui ele guardava a porta da
            Home, e tudo o que está atrás dela pode ser mudado no perfil a
            qualquer hora. Gesto difícil sem risco do outro lado é atrito
            cobrado à toa. */}
        <View style={{ paddingHorizontal: 20, paddingBottom: insets.bottom + 20, gap: 12 }}>
          <Botao label="Confirmar" onPress={salvar} />
          <Pressable onPress={() => setN(5)} style={({ pressed }) => [{ alignItems: 'center', opacity: pressed ? 0.6 : 1 }]}>
            <Txt v="label" c={c.tx3}>Voltar</Txt>
          </Pressable>
        </View>
      </View>
    );
  }

  /* ---------- as seis perguntas ---------- */
  const id = PASSOS[n];
  const titulos: Record<Id, string> = {
    tratamento: 'Você já está em tratamento?',
    medicamento: 'Qual medicamento você usa?',
    dose: futuro ? 'Com qual dose você vai começar?' : 'Qual é a sua dose atual?',
    peso: 'Qual é o seu peso hoje?',
    meta: 'Aonde você quer chegar?',
    inicio: futuro ? 'Quando você vai começar?' : 'Quando você começou?',
  };
  const subs: Record<Id, string> = {
    tratamento: 'Sem julgamento — é só para saber onde você está agora.',
    medicamento: 'Cada caneta tem a sua escada de doses, e é ela que a próxima pergunta usa.',
    dose: med
      ? `As doses aparecem na ordem da titulação do ${med.label}.`
      : 'As doses aparecem na ordem da titulação.',
    peso: 'Fica registrado como a sua primeira pesagem.',
    meta: 'Só um número de referência. As outras metas — vestir uma roupa, voltar a um esporte — ficam na tela de metas.',
    inicio: 'Aproximado está bom: isso serve para contar a sua semana de tratamento.',
  };

  return (
    <View style={{ flex: 1, backgroundColor: c.bg, paddingTop: insets.top }}>
      {/* O TOPO diz onde a pessoa está e não oferece saída. "Pular tudo"
          ficava aqui; com as perguntas obrigatórias, o que sobra é a
          barra, a contagem e o voltar. */}
      <View style={{ paddingHorizontal: 20, paddingTop: 10, gap: 16 }}>
        <Row gap={12}>
          <CircleBtn name="back" size={36} onPress={() => (doResumo ? aoResumo() : setN(n - 1))} />
          <View style={{ flex: 1, height: 4, borderRadius: 2, backgroundColor: c.bg3, overflow: 'hidden' }}>
            <View style={{
              width: `${((n + 1) / PASSOS.length) * 100}%`,
              height: '100%', borderRadius: 2, backgroundColor: c.accent,
            }} />
          </View>
          <Txt v="micro" c={c.tx3}>{n + 1} de {PASSOS.length}</Txt>
        </Row>
      </View>

      <ScrollView contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 26, paddingBottom: 24 }}>
        <Txt v="h1">{titulos[id]}</Txt>
        <Txt v="caption" c={c.tx2} style={{ marginTop: 8, marginBottom: 22 }}>{subs[id]}</Txt>

        {id === 'tratamento' ? (
          <Duplas>
            <Escolha
              ic="syringe" titulo="Já apliquei alguma dose" sub="Em tratamento agora"
              on={r.emTratamento === true}
              onPress={() => p({ emTratamento: true })}
            />
            <Escolha
              ic="cal" titulo="Vou começar em breve" sub="Ainda não apliquei"
              on={r.emTratamento === false}
              onPress={() => p({ emTratamento: false })}
            />
          </Duplas>
        ) : null}

        {id === 'medicamento' ? (
          <Duplas>
            {Object.entries(MEDS).map(([k, m]) => (
              <Escolha
                key={k} ic="pill" titulo={m.label} sub={m.mol}
                on={r.med === k}
                /* Trocar de caneta zera a dose: a escada é outra, e manter
                   5 mg ao pular de Mounjaro para Ozempic gravaria uma dose
                   que aquela caneta não tem. */
                onPress={() => p({ med: k, dose: r.med === k ? r.dose : null })}
              />
            ))}
          </Duplas>
        ) : null}

        {id === 'dose' && med ? (
          <Duplas>
            {med.doses.map((d, i) => (
              <Escolha
                key={d} ic="syringe"
                titulo={`${doseTxt(d)} ${med.unit}`}
                sub={i === 0 ? 'dose de início' : i === med.doses.length - 1 ? 'dose máxima' : undefined}
                on={r.dose === d}
                onPress={() => p({ dose: d })}
              />
            ))}
          </Duplas>
        ) : null}

        {id === 'peso' ? (
          <View style={{ backgroundColor: c.bg1, borderRadius: radius.card, padding: 18 }}>
            <Stepper
              valor={nf(r.peso, 1)}
              unidade="kg"
              onMenos={() => p({ peso: Math.max(35, Math.round((r.peso - 0.1) * 10) / 10) })}
              onMais={() => p({ peso: Math.min(300, Math.round((r.peso + 0.1) * 10) / 10) })}
              onDigitar={(v) => {
                const x = parseFloat(v.replace(',', '.'));
                if (!Number.isNaN(x)) p({ peso: Math.min(300, Math.max(35, x)) });
              }}
            />
          </View>
        ) : null}

        {id === 'meta' ? (
          <View style={{ gap: 12 }}>
            <View style={{ backgroundColor: c.bg1, borderRadius: radius.card, padding: 18 }}>
              <Stepper
                valor={nf(r.meta, 1)}
                unidade="kg"
                onMenos={() => p({ meta: Math.max(35, Math.round((r.meta - 0.5) * 10) / 10) })}
                onMais={() => p({ meta: Math.min(300, Math.round((r.meta + 0.5) * 10) / 10) })}
                onDigitar={(v) => {
                  const x = parseFloat(v.replace(',', '.'));
                  if (!Number.isNaN(x)) p({ meta: Math.min(300, Math.max(35, x)) });
                }}
              />
            </View>
            {/* A distância dita em quilos, porque é ela que a pessoa está
                escolhendo — e porque uma meta ACIMA do peso de hoje é
                escolha legítima de quem está subindo de volta, não erro
                para bloquear. O app só não finge que não viu. */}
            <Txt v="caption" c={c.tx3} style={{ textAlign: 'center' }}>
              {r.meta === r.peso
                ? 'Mesmo peso de hoje — manter também é meta.'
                : `${nf(Math.abs(r.peso - r.meta), 1)} kg ${r.meta < r.peso ? 'abaixo' : 'acima'} do seu peso de hoje.`}
            </Txt>
          </View>
        ) : null}

        {id === 'inicio' ? (
          <Calendario valor={r.inicio} onEscolhe={(t) => p({ inicio: t })} futuro={futuro} />
        ) : null}
      </ScrollView>

      <View style={{ paddingHorizontal: 20, paddingBottom: insets.bottom + 20 }}>
        <Botao
          label={doResumo || n === PASSOS.length - 1 ? 'Ver o resumo' : 'Continuar'}
          desligado={!respondida[n]}
          onPress={() => (doResumo ? aoResumo() : setN(n + 1))}
        />
      </View>
    </View>
  );
}
