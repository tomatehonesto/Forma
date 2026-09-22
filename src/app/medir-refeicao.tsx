import React, { useState } from 'react';
import { View, Pressable } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useStore } from '../logic/store';
import {
  apagarRefeicao, checkinToday, editarRefeicao, favoritos, guardarFavorito,
  refeicaoEm, registrarRefeicao,
} from '../logic/derive';
import { MOMENTOS, itensDe, momentoDaHora, nomeItem, qtdPadrao, somaDe, type ItemComida } from '../logic/prato';
import { analisarFoto, RECADO } from '../logic/analise';
import { BuscaAlimento, ItemAlimento, BotaoEscanear, FotoDoPrato } from '../ui/comida';
import { CameraPrato } from '../ui/CameraPrato';
import { Txt, Row, SheetScreen } from '../ui/kit';
import { Acordeao, Botao, Grade, Linha, Opc } from '../ui/internas';
import { useTheme } from '../ui/useTheme';
import { radius } from '../theme';
import { T } from '../textos';

/* ⚠️ É FUNÇÃO, e não constante de módulo: ela lê o catálogo, e constante
   de módulo congela o idioma no import. */
const K = () => T.alimentacao.telaMedirRefeicao;

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
   olhando: quantas unidades de cada coisa tinha no prato.

   E quando a tabela não tem o prato — a receita da avó —, o item entra
   pelo nome e sem conta, dizendo isso. Perder o registro inteiro seria
   pior, e inventar um número seria voltar ao começo.

   A folha abre para UMA ação, e só para ela. A lista do que já foi
   registrado hoje morava aqui em cima e saiu: numa tela que abre três
   vezes por dia, resumo é coisa para passar por cima antes de chegar no
   que se veio fazer. O total continua na linha embaixo do título — esse
   não é histórico, é o estado do número que se está prestes a mexer.
   ============================================================ */

export default function MedirRefeicao() {
  const S = useStore((s) => s.S);
  const update = useStore((s) => s.update);
  const { c } = useTheme();
  const router = useRouter();
  /* Os favoritos de /alimentacao entram por aqui, com o nome já escrito.
     Antes eles gravavam por conta própria e não mexiam na proteína do
     dia: a refeição aparecia na lista e a barra não andava. */
  /* `cam=1` abre a folha já com a câmera no ar. É por onde entra o botão
     de escanear de /alimentacao: sem isto ele teria de abrir o registro e
     pedir um segundo toque para a coisa que a pessoa já tinha escolhido. */
  const {
    oque: oqueParam, cam: camParam, t: tParam, fav: favParam, prato: pratoParam,
  } = useLocalSearchParams<{ oque?: string; cam?: string; t?: string; fav?: string; prato?: string }>();

  /* TRÊS MODOS NA MESMA FOLHA, e todos montam um prato.

     Registrar é o normal. Corrigir chega com `t` e troca a refeição
     daquele instante em vez de somar outra. Cadastrar favorito chega com
     `fav=1`, monta o prato e não registra nada — guarda o prato para os
     próximos dias.

     Três telas para isso significaria três cópias da busca de alimento,
     da grade de momentos e do stepper de porção — e é exatamente aí que
     uma ganha um alimento novo e as outras não. */
  const editando = tParam != null;
  const cadastrando = favParam === '1';
  const tEdit = Number(tParam);
  const original = editando ? refeicaoEm(S, tEdit) : null;

  const hora = new Date().getHours();
  /* ⚠️ A RÉGUA É A DE `momentoDaHora`, e não uma segunda escrita aqui.
     Esta tela tinha a sua, com os quatro nomes em duro e com cortes
     diferentes: às 18h30 ela sugeria "Jantar" e o resto do aplicativo
     dizia "Lanche". O momento é chave e rótulo ao mesmo tempo — é ele que
     fica gravado —, então duas réguas eram duas verdades. */
  const sugerido = momentoDaHora(hora);

  const [quando, setQuando] = useState(original?.name || sugerido);
  const [busca, setBusca] = useState(String(oqueParam || ''));
  /* Tres origens para o prato inicial, e so uma vale por vez: a refeicao
     que se corrige, o favorito que se escolheu na lista, ou vazio. */
  const [itens, setItens] = useState<ItemComida[]>(() => {
    if (original?.itens) return original.itens as ItemComida[];
    if (pratoParam) {
      const f = favoritos(S).find((x) => x.nome === String(pratoParam));
      if (f?.itens) return f.itens as ItemComida[];
    }
    return [];
  });

  const [camera, setCamera] = useState(camParam === '1');
  const [foto, setFoto] = useState<string | null>(null);
  const [lendo, setLendo] = useState(false);
  const [recado, setRecado] = useState<string | null>(null);

  const ci: any = checkinToday(S);
  const alvo = (S.profile as any).targets.prot as number;
  const hojeProt = Math.round(ci?.prot || 0);

  /* Só os que têm prato: um favorito sem itens não tem o que acrescentar
     aqui. */
  const favs = favoritos(S).filter((f) => (f.itens || []).length > 0);

  const g = somaDe(itens);
  const semConta = itensDe(itens, 'sem-conta');
  const estimados = itensDe(itens, 'estimado');
  const pronto = itens.length > 0;

  const apagar = () => {
    update((s: any) => apagarRefeicao(s, tEdit, original?.g ?? 0));
    router.back();
  };

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
      setRecado(RECADO()[r.motivo]);
    }
  };

  const salvar = () => {
    if (!pronto) return;
    const nomes = itens.map(nomeItem).filter(Boolean);

    if (cadastrando) {
      update((s: any) => guardarFavorito(s, { nome: nomes.join(', '), itens }));
      router.back();
      return;
    }

    if (editando) {
      update((s: any) => editarRefeicao(s, tEdit, {
        name: quando, g, tag: nomes.join(', '), itens, fonte: foto ? 'foto' : original?.fonte,
      }));
      router.back();
      return;
    }

    /* Gravar mora em derive, e não aqui: a hidratação também cria
       refeições — um copo de leite é bebida e comida —, e duas cópias da
       mesma regra divergem na primeira vez que alguém mexer numa delas.

       De onde veio o número vai junto. A foto some do registro — a imagem
       em si não é guardada enquanto não houver decisão sobre armazenar
       foto de comida de alguém —, mas o fato de ter havido uma fica. */
    update((s: any) => registrarRefeicao(s, {
      name: quando, g, tag: nomes.join(', '), itens, fonte: foto ? 'foto' : 'manual',
    }));
    /* Só o registro novo confirma. Editar e cadastrar favorito voltam
       como sempre voltaram: nenhum dos dois é um acontecimento do dia, e
       uma folha dizendo "refeição registrada" depois de corrigir a de
       ontem afirmaria uma coisa que não houve. */
    router.replace('/registro-ok?tipo=refeicao' as any);
  };

  if (camera) {
    return <CameraPrato onFoto={receberFoto} onFechar={() => setCamera(false)} />;
  }

  return (
    <SheetScreen
      titulo={cadastrando ? K().favorito : editando ? K().corrigir : K().oQueComeu}
      /* Ao corrigir e ao cadastrar, o total do dia não cabe: quem está
         consertando uma linha precisa da linha, e quem está guardando um
         prato para amanhã não está mexendo em hoje. */
      sub={cadastrando
        ? K().favoritoSub
        : editando
          ? K().corrigirSub
          : K().proteinaHoje(hojeProt, alvo)}
      onClose={() => router.back()}
      rodape={(
        <Pressable onPress={salvar} disabled={!pronto} style={({ pressed }) => [{ opacity: pressed ? 0.8 : 1 }]}>
          <View style={{
            backgroundColor: pronto ? c.accent : c.bg2,
            borderRadius: radius.pill, paddingVertical: 15, alignItems: 'center',
          }}>
            <Txt v="body" c={pronto ? c.accentInk : c.tx4}>
              {!pronto
                ? K().digaOQueTinha
                : cadastrando ? K().guardarNosFavoritos
                  : editando ? K().salvarCorrecao
                    : K().registrarMomento(T.comum.noMeio(quando))}
            </Txt>
          </View>
        </Pressable>
      )}
    >
      {/* O momento não cabe no cadastro de favorito: um prato guardado
          não é de um horário, é de uma rotina — a mesma marmita serve de
          almoço num dia e de jantar no outro, e o momento é escolhido na
          hora de registrar. */}
      {cadastrando ? null : (
        <>
          <Txt v="micro" c={c.tx3} style={{ letterSpacing: 1, marginTop: 20, marginBottom: 10 }}>{K().quando}</Txt>
          <Grade>
            {MOMENTOS().map(([ic, h]) => (
              <Opc key={h} cheia ic={ic} label={h} on={quando === h} onPress={() => setQuando(h)} />
            ))}
          </Grade>
        </>
      )}

      {/* O rótulo da seção e o atalho da câmera na mesma linha. A foto é
          um caminho, não O caminho — como cartão de largura inteira ela
          empurrava a busca para baixo, e é a busca que a maioria usa. */}
      <Row style={{ justifyContent: 'space-between', alignItems: 'center', marginTop: 22, marginBottom: 10 }}>
        <Txt v="micro" c={c.tx3} style={{ letterSpacing: 1 }}>{K().oQueTinhaNoPrato}</Txt>
        {foto ? null : <BotaoEscanear onPress={() => setCamera(true)} />}
      </Row>

      {/* Com foto tirada, ela toma o lugar do atalho e mostra o que está
          acontecendo com a leitura. */}
      {foto ? (
        <View style={{ marginBottom: 8 }}>
          <FotoDoPrato
            uri={foto}
            lendo={lendo}
            recado={recado || undefined}
            onRemover={() => { setFoto(null); setRecado(null); }}
          />
        </View>
      ) : null}

      {/* OS FAVORITOS, fechados e DEPOIS da busca.

          Quem come marmita ou tem rotina repete o mesmo prato — e sem
          isto remontava item por item, com a mesma quantidade, todo dia.
          O toque ACRESCENTA ao prato em vez de substituir: almoço de
          favorito mais uma sobremesa digitada é um caso comum, e
          substituir apagaria o que já estava ali.

          Acordeão e não fileira de chips: com o nome do prato inteiro em
          cada chip — "Peito de frango grelhado, Arroz integral, Salada
          de folhas" — a fileira virava uma parede de texto rolando por
          cima da busca, que é o caminho que a maioria usa. Fechado, ele
          é uma linha; aberto, é a lista com o que cada prato rende.

          E sem cartão: dentro de um, ele competia com o campo de busca
          logo acima, dois blocos brancos de peso igual disputando o
          primeiro toque. Nu, entre dois fios, ele lê como o que é — um
          atalho pendurado embaixo da busca.

          Só aparece quando existe favorito com prato guardado. Os
          antigos, que só têm nome, continuam entrando por /alimentacao
          com o nome escrito na busca — aqui eles não teriam o que
          acrescentar. */}
      <View>
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
      {/* O PRATO VEM ANTES DO ATALHO, assim que tem alguma coisa nele.

          Os favoritos moravam aqui em cima o tempo todo, e isso estava
          certo enquanto o prato estava vazio: ali eles são o caminho
          curto para quem repete a mesma comida. Depois do primeiro
          ingrediente eles viram interrupção — a pessoa está montando um
          prato e tem de rolar por cima de uma lista de outros pratos
          para ver o que já escolheu, ajustar a quantidade e conferir a
          soma. O que está sendo feito agora manda na ordem da tela. */}
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
            <Txt v="caption" c={c.tx3}>{K().proteinaDestaRefeicao}</Txt>
            {/* Um traço, e não "~0 g", quando nada do prato entrou na
                conta: zero é um resultado, e aqui não houve resultado. */}
            {g === 0 && semConta.length ? (
              <Txt v="label" c={c.tx4}>—</Txt>
            ) : (
              <Txt v="label" c={c.accent}>{K().gramas(g)}</Txt>
            )}
          </Row>

          {/* O que ficou de fora da soma, dito embaixo dela. A linha do
              item já avisa, mas é a SOMA que vira o número do dia — e é
              nela que a ressalva precisa aparecer para ser lida. */}
          {semConta.length ? (
            <Txt v="micro" c={c.tx4} style={{ paddingHorizontal: 2 }}>
              {semConta.length === 1
                ? K().semContaUm(nomeItem(semConta[0]))
                : K().semContaVarios(semConta.length)}
            </Txt>
          ) : null}

          {estimados.length ? (
            <Txt v="micro" c={c.tx4} style={{ paddingHorizontal: 2 }}>
              {K().estimadoPelaFoto}
            </Txt>
          ) : null}
        </View>
      ) : null}

      {!cadastrando && favs.length ? (
        <View style={{ marginTop: 14 }}>
          <Acordeao
            nu
            ic="star"
            titulo={K().pratosFavoritos}
            sub={K().pratosGuardados(favs.length)}
          >
            {favs.map((f) => (
              <Linha
                key={f.nome}
                titulo={f.nome}
                sub={K().favoritoProteina(somaDe((f.itens || []) as ItemComida[]))}
                seta={false}
                onPress={() => setItens((v) => [...v, ...((f.itens || []) as ItemComida[])])}
              />
            ))}
          </Acordeao>
        </View>
      ) : null}

      {/* Longe do salvar, e no fim: apagar é o que se faz depois de olhar
          o registro inteiro e concluir que ele não devia existir. */}
      {editando ? (
        <View style={{ marginTop: 22 }}>
          <Botao label={K().apagar} tom="perigo" onPress={apagar} />
        </View>
      ) : null}
    </SheetScreen>
  );
}
