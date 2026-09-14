import React, { useState } from 'react';
import { View, Pressable } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useStore } from '../logic/store';
import { checkinToday, registroDoDia } from '../logic/derive';
import { PROTEINA, proteinaDe, faixaDe } from '../logic/escalas';
import { type Porcao } from '../logic/alimentos';
import { nomeItem, somaDe, temEstimativa, type ItemComida } from '../logic/prato';
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
   "faltam 36 g". Durante muito tempo ela escondia esse número — as faixas
   viravam 30, 18 e 8 g em silêncio —, depois passou a mostrar a conta, e
   então deixou de PEDIR a conta.

   Quem come não sabe quantos gramas de proteína tem um filé de frango.
   Essa informação não está ao alcance de quem responde, e pedir mesmo
   assim só produz palpite com cara de dado. Mas todo mundo sabe dizer o
   que comeu, e sabe se o pedaço foi grande ou pequeno.

   TRÊS PORTAS, UMA LISTA

   A foto propõe os itens, a busca acha os itens, a faixa responde por
   alto quando nada disso alcança — comida de festa, receita de família,
   o prato que ninguém sabe nomear. As três chegam no mesmo lugar: uma
   lista de itens com porção, e uma soma só.

   É por isso que a foto não abre outra tela. Ela preenche esta, e o que
   ela preencheu fica aberto para conserto — porque foto acerta o que é e
   erra o quanto tem.
   ============================================================ */

const HORARIOS = ['Café da manhã', 'Almoço', 'Lanche', 'Jantar'];

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
  const [faixa, setFaixa] = useState<string | null>(null);

  const [camera, setCamera] = useState(false);
  const [foto, setFoto] = useState<string | null>(null);
  const [lendo, setLendo] = useState(false);
  const [recado, setRecado] = useState<string | null>(null);

  const ci: any = checkinToday(S);
  const alvo = (S.profile as any).targets.prot as number;
  const hojeProt = Math.round(ci?.prot || 0);

  const t0 = +startOfDay(now());
  const doDia = (S.meals as any[]).filter((m) => +startOfDay(new Date(m.t)) === t0);

  /* A lista manda. A faixa só vale enquanto nada foi encontrado — dois
     números para a mesma refeição seria a divergência que esta tela
     passou o mês inteiro tirando de si mesma. */
  const porAlto = proteinaDe(faixa);
  const g = itens.length ? somaDe(itens) : porAlto?.g ?? 0;
  const pronto = itens.length > 0 || !!porAlto;

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
      setFaixa(null);
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
        /* Gramas é a verdade; a faixa virou rótulo derivado dela. Era o
           contrário, e por isso a foto não teria onde escrever: ela chega
           com gramas, nunca com "bastante". */
        g,
        prot: faixaDe(g),
        tag: nomes.length ? nomes.join(', ') : busca.trim(),
        /* De onde veio o número. A foto some do registro — a imagem em si
           não é guardada enquanto não houver decisão sobre armazenar foto
           de comida de alguém —, mas o fato de ter havido uma fica. */
        fonte: foto && itens.length ? 'foto' : 'manual',
        itens: itens.length ? itens : undefined,
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
              <Txt v="tag" c={c.tx2}>{m.name} · {m.g ?? proteinaDe(m.prot)?.g ?? 0} g</Txt>
            </View>
          ))}
        </View>
      ) : null}

      <Txt v="micro" c={c.tx3} style={{ letterSpacing: 1, marginTop: 20, marginBottom: 10 }}>QUANDO</Txt>
      <Grade>
        {HORARIOS.map((h) => (
          <Opc key={h} cheia label={h} on={quando === h} onPress={() => setQuando(h)} />
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
            setItens((v) => [...v, { id: a.id, porcao: 'normal' }]);
            setBusca('');
            /* Achar o alimento desliga o palpite: quem encontrou não
               precisa mais responder por alto, e a faixa marcada ficaria
               de pé como uma segunda resposta. */
            setFaixa(null);
          }}
        />
      </View>

      {itens.length ? (
        <View style={{ gap: 7, marginTop: 8 }}>
          {itens.map((it, i) => (
            <ItemAlimento
              key={`${it.id || it.nome}-${i}`}
              item={it}
              onPorcao={(p: Porcao) => setItens((v) => v.map((x, j) => (j === i ? { ...x, porcao: p } : x)))}
              onRemover={() => setItens((v) => v.filter((_, j) => j !== i))}
            />
          ))}

          <Row style={{ justifyContent: 'space-between', paddingHorizontal: 2, marginTop: 3 }}>
            <Txt v="caption" c={c.tx3}>Proteína desta refeição</Txt>
            <Txt v="label" c={c.accent}>~{g} g</Txt>
          </Row>

          {/* Quando algum item não tem par na tabela, o total inteiro
              carrega um palpite dentro. Dizer isso uma vez embaixo da
              soma é mais honesto do que deixar a linha do item explicando
              sozinha, porque é a soma que vai virar o número do dia. */}
          {temEstimativa(itens) ? (
            <Txt v="micro" c={c.tx4} style={{ paddingHorizontal: 2 }}>
              Parte deste total foi estimada pela foto, sem tabela por trás.
            </Txt>
          ) : null}
        </View>
      ) : null}

      {/* O caminho de pouca informação, para o que nem a foto nem a
          tabela alcançam. Some quando a lista tem itens. */}
      {!itens.length ? (
        <>
          <Txt v="micro" c={c.tx3} style={{ letterSpacing: 1, marginTop: 22, marginBottom: 10 }}>OU DIGA POR ALTO</Txt>
          <Grade cols={1}>
            {PROTEINA.map((p) => (
              <Opc
                key={p.id} cheia label={p.label} dir={`~${p.g} g`}
                on={faixa === p.id} onPress={() => setFaixa(p.id)}
              />
            ))}
          </Grade>
          {porAlto ? (
            <Txt v="caption" c={c.tx3} style={{ marginTop: 10 }}>{porAlto.legenda}</Txt>
          ) : null}
        </>
      ) : null}
    </SheetScreen>
  );
}
