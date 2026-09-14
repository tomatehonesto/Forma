import React, { useState } from 'react';
import { View, Pressable } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useStore } from '../logic/store';
import { checkinToday, registroDoDia } from '../logic/derive';
import { faixaDe, gramasDaFaixa } from '../logic/escalas';
import { itensDe, nomeItem, qtdPadrao, somaDe, type ItemComida } from '../logic/prato';
import { analisarFoto, RECADO } from '../logic/analise';
import { BuscaAlimento, ItemAlimento, BotaoEscanear, FotoDoPrato } from '../ui/comida';
import { CameraPrato } from '../ui/CameraPrato';
import { now, startOfDay } from '../logic/time';
import { Txt, Row, SheetScreen } from '../ui/kit';
import { Grade, Opc } from '../ui/internas';
import { useTheme } from '../ui/useTheme';
import { radius } from '../theme';

/* ============================================================
   O QUE VOCÊ COMEU

   Esta tela alimenta UM número: a proteína do dia, que a home cobra como
   "faltam 36 g". Ela já escondeu esse número, depois mostrou a conta,
   depois pediu a conta — e agora parou de pedir.

   A pergunta "quanta proteína tinha?" pedia o que quem comeu não tem
   como saber. Ninguém sabe quantas gramas um filé de frango carrega, e
   perguntar assim mesmo só produz palpite com cara de dado. O que a
   pessoa sabe, e sabe sem pensar, é O QUE ESTAVA NO PRATO.

   Então essa virou a única entrada da tela. O prato entra digitado ou
   fotografado; o número sai calculado. Quem soma é a tabela da TACO, que
   é o lado da conta onde cabe uma tabela.

   Sobra uma coisa para a pessoa, e é a única que a tabela não pode saber
   olhando: se a porção foi pouca, normal ou bastante.

   E quando a tabela não tem o prato — lasanha, a receita da avó —, o
   item entra pelo nome e sem conta, dizendo isso. Perder o registro
   inteiro seria pior, e inventar um número seria voltar ao começo.
   ============================================================ */

/* Cada refeição pelo que se come nela: a xícara, o talher, o sanduíche.

   Menos o jantar, que fica na lua — e não por descuido. Jantar no Brasil
   é quase sempre a mesma comida do almoço, então nenhum desenho de prato
   separa um do outro: a única coisa que distingue o jantar é ser de
   noite. Desenhar uma tigela ali fingiria uma diferença de comida que
   não existe. */
const HORARIOS: [string, string][] = [
  ['coffee', 'Café da manhã'],
  ['cutlery', 'Almoço'],
  ['sandwich', 'Lanche'],
  ['moon', 'Jantar'],
];

export default function MedirRefeicao() {
  const S = useStore((s) => s.S);
  const update = useStore((s) => s.update);
  const { c } = useTheme();
  const router = useRouter();
  /* Os favoritos de /alimentacao entram por aqui, com o nome já escrito.
     Antes eles gravavam por conta própria e não mexiam na proteína do
     dia: a refeição aparecia na lista e a barra não andava. */
  const { oque: oqueParam } = useLocalSearchParams<{ oque?: string }>();

  const hora = new Date().getHours();
  const sugerido = hora < 10 ? 'Café da manhã' : hora < 15 ? 'Almoço' : hora < 18 ? 'Lanche' : 'Jantar';

  const [quando, setQuando] = useState(sugerido);
  const [busca, setBusca] = useState(String(oqueParam || ''));
  const [itens, setItens] = useState<ItemComida[]>([]);

  const [camera, setCamera] = useState(false);
  const [foto, setFoto] = useState<string | null>(null);
  const [lendo, setLendo] = useState(false);
  const [recado, setRecado] = useState<string | null>(null);

  const ci: any = checkinToday(S);
  const alvo = (S.profile as any).targets.prot as number;
  const hojeProt = Math.round(ci?.prot || 0);

  const t0 = +startOfDay(now());
  const doDia = (S.meals as any[]).filter((m) => +startOfDay(new Date(m.t)) === t0);

  const g = somaDe(itens);
  const semConta = itensDe(itens, 'sem-conta');
  const estimados = itensDe(itens, 'estimado');
  const pronto = itens.length > 0;

  const receberFoto = async (uri: string) => {
    setCamera(false);
    setFoto(uri);
    setRecado(null);
    setLendo(true);
    const r = await analisarFoto(uri);
    setLendo(false);
    if (r.ok) {
      /* O que a foto viu ENTRA na lista em vez de substituir: quem já
         tinha digitado o que o prato não mostrava não perde isso. */
      setItens((v) => [...v, ...r.itens]);
    } else {
      setRecado(RECADO[r.motivo]);
    }
  };

  const salvar = () => {
    if (!pronto) return;
    const nomes = itens.map(nomeItem).filter(Boolean);
    update((s: any) => {
      s.meals.unshift({
        t: +now(), name: quando,
        /* Gramas é a verdade; a faixa virou rótulo derivado dela. */
        g,
        prot: faixaDe(g),
        tag: nomes.join(', '),
        /* De onde veio o número. A foto some do registro — a imagem em si
           não é guardada enquanto não houver decisão sobre armazenar foto
           de comida de alguém —, mas o fato de ter havido uma fica. */
        fonte: foto ? 'foto' : 'manual',
        itens,
      });
      const ci2 = registroDoDia(s, +startOfDay(now()));
      ci2.prot = (ci2.prot || 0) + g;
    });
    router.back();
  };

  if (camera) {
    return <CameraPrato onFoto={receberFoto} onFechar={() => setCamera(false)} />;
  }

  return (
    <SheetScreen
      titulo="O que você comeu?"
      sub={`${hojeProt} de ${alvo} g de proteína hoje`}
      onClose={() => router.back()}
      rodape={(
        <Pressable onPress={salvar} disabled={!pronto} style={({ pressed }) => [{ opacity: pressed ? 0.8 : 1 }]}>
          <View style={{
            backgroundColor: pronto ? c.accent : c.bg2,
            borderRadius: radius.pill, paddingVertical: 15, alignItems: 'center',
          }}>
            <Txt v="body" c={pronto ? c.accentInk : c.tx4}>
              {pronto ? `Registrar ${quando.toLowerCase()}` : 'Diga o que tinha no prato'}
            </Txt>
          </View>
        </Pressable>
      )}
    >
      {doDia.length ? (
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: 18 }}>
          {doDia.map((m, i) => (
            <View
              key={`${m.t}-${i}`}
              style={{ backgroundColor: c.bg2, borderRadius: radius.pill, paddingHorizontal: 12, paddingVertical: 6 }}
            >
              <Txt v="tag" c={c.tx2}>{m.name} · {m.g ?? gramasDaFaixa(m.prot) ?? 0} g</Txt>
            </View>
          ))}
        </View>
      ) : null}

      <Txt v="micro" c={c.tx3} style={{ letterSpacing: 1, marginTop: 20, marginBottom: 10 }}>QUANDO</Txt>
      <Grade>
        {HORARIOS.map(([ic, h]) => (
          <Opc key={h} cheia ic={ic} label={h} on={quando === h} onPress={() => setQuando(h)} />
        ))}
      </Grade>

      <Txt v="micro" c={c.tx3} style={{ letterSpacing: 1, marginTop: 22, marginBottom: 10 }}>O QUE TINHA NO PRATO</Txt>

      {/* A foto primeiro, porque é o caminho curto: uma foto e a lista
          vem montada. Quando ela não dá conta, a busca está logo abaixo,
          no mesmo lugar de sempre. */}
      {foto ? (
        <FotoDoPrato
          uri={foto}
          lendo={lendo}
          recado={recado || undefined}
          onRemover={() => { setFoto(null); setRecado(null); }}
        />
      ) : (
        <BotaoEscanear onPress={() => setCamera(true)} />
      )}

      <View style={{ marginTop: 8 }}>
        <BuscaAlimento
          valor={busca}
          onChange={setBusca}
          jaTem={itens.map((it) => it.id).filter(Boolean) as string[]}
          onEscolher={(a) => {
            setItens((v) => [...v, { id: a.id, qtd: qtdPadrao(a.id) }]);
            setBusca('');
          }}
          onLivre={(nome) => {
            setItens((v) => [...v, { nome, qtd: 1 }]);
            setBusca('');
          }}
        />
      </View>

      {itens.length ? (
        <View style={{ gap: 7, marginTop: 8 }}>
          {itens.map((it, i) => (
            <ItemAlimento
              key={`${it.id || it.nome}-${i}`}
              item={it}
              onQtd={(q: number) => setItens((v) => v.map((x, j) => (j === i ? { ...x, qtd: q } : x)))}
              onRemover={() => setItens((v) => v.filter((_, j) => j !== i))}
            />
          ))}

          <Row style={{ justifyContent: 'space-between', paddingHorizontal: 2, marginTop: 3 }}>
            <Txt v="caption" c={c.tx3}>Proteína desta refeição</Txt>
            {/* Um traço, e não "~0 g", quando nada do prato entrou na
                conta: zero é um resultado, e aqui não houve resultado. */}
            {g === 0 && semConta.length ? (
              <Txt v="label" c={c.tx4}>—</Txt>
            ) : (
              <Txt v="label" c={c.accent}>~{g} g</Txt>
            )}
          </Row>

          {/* O que ficou de fora da soma, dito embaixo dela. A linha do
              item já avisa, mas é a SOMA que vira o número do dia — e é
              nela que a ressalva precisa aparecer para ser lida. */}
          {semConta.length ? (
            <Txt v="micro" c={c.tx4} style={{ paddingHorizontal: 2 }}>
              {semConta.length === 1
                ? `${nomeItem(semConta[0])} não entra nessa conta — ainda não tenho a proteína desse prato.`
                : `${semConta.length} itens não entram nessa conta — ainda não tenho a proteína deles.`}
            </Txt>
          ) : null}

          {estimados.length ? (
            <Txt v="micro" c={c.tx4} style={{ paddingHorizontal: 2 }}>
              Parte deste total foi estimada pela foto, sem tabela por trás.
            </Txt>
          ) : null}
        </View>
      ) : null}
    </SheetScreen>
  );
}
