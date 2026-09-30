import React, { useEffect, useMemo, useRef, useState } from 'react';
import { View, Pressable, ScrollView, TextInput, KeyboardAvoidingView, Platform, StyleSheet, Share, useWindowDimensions } from 'react-native';
import { useRouter, useLocalSearchParams, useFocusEffect } from 'expo-router';
import * as Clipboard from 'expo-clipboard';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useStore } from '../logic/store';
import {
  acrescentarPergunta, origemDoEndereco, type OrigemDaPergunta, type PerguntaFeita,
} from '../logic/perguntas';
import { companionSuggestions, companionMemoria } from '../logic/derive';
import {
  aceitouAConversa, conversaGuardada, guardarNaConversa,
  recomecarConversa, conversaLigada, conversaParada, destinosDe, semLinks, perguntarAoMorphi, type MotivoDaConversa,
} from '../logic/conversa';
import { Txt, Row, CircleBtn, RichDoc, Rolagem } from '../ui/kit';
import { EstrelaIA } from '../ui/marca';
import { Icon } from '../ui/Icon';
import { useTheme } from '../ui/useTheme';
import { useDitado, estadoDoDitado } from '../ui/useDitado';
import { radius, font } from '../theme';
import { T } from '../textos';

const K = () => T.companion.telaConversa;

/* ============================================================
   MORPHI — a tela para onde tudo aponta

   Insights abre com ele, a Jornada oferece "perguntar", Cuidado prepara
   a consulta com ele. Era a única peça central ainda na linguagem antiga:
   balões com contorno cinza, chips genéricas, cabeçalho de lista de
   contatos.

   A IDENTIDADE

   O cabeçalho é a mesma peça do hero do Insights, com o mesmo orbe no
   mesmo lugar da composição. Lá ele é a única marca do Morphi na tela e
   tocá-lo abre esta; aqui ele reaparece idêntico, então o toque deixa de
   ser navegação e vira aproximação — a tela não abre outra coisa, abre
   mais perto da mesma coisa.

   A conversa acontece sobre a folha clara que sobe por cima da imagem,
   com o mesmo raio e a mesma sobreposição de 36 px da Home e do Insights.

   Escuro só no alto, e não na tela toda, por uma razão de leitura: fio
   de conversa é texto longo, e texto longo em branco sobre escuro cansa.
   A cor marca quem está falando; a folha é onde se lê.

   O LIMITE

   O app não prescreve. Isso não é rodapé jurídico, é o produto: a linha
   "não substitui sua equipe" fica no cabeçalho, visível o tempo inteiro,
   e não numa tela de termos. Quem confunde as duas coisas está desenhando
   outro produto.

   A CONVERSA DE VERDADE (29/09/2026)

   Aqui morava `companionReply`, uma cadeia de if/else sobre
   palavras-chave EM PORTUGUÊS: quem escrevesse "e se eu parar?", ou
   qualquer coisa em alemão, caía na resposta genérica. Agora a pergunta
   vai ao servidor com o resumo da jornada (logic/conversa e
   logic/resumoDaJornada), e a resposta volta no idioma da pessoa. Ver
   docs/superpowers/specs/2026-09-29-morphi-intelligence-design.md.

   ⚠️ SEM O ACEITE, NADA SAI DO APARELHO. A abertura mostra o aceite no
   lugar das sugestões, e a pergunta feita antes dele espera (`pendente`)
   e segue sozinha depois do "concordo".

   ⚠️ O AVISO NÃO ENTRA NA CONVERSA. "Sem rede" e "limite do dia" são
   falas da tela, e não do Morphi: guardadas, iriam para o modelo como
   histórico na próxima pergunta.
   ============================================================ */

const PAD = 24;

/** O que cada destino sugerido vira no botão: ícone e rótulo. As rotas
    são as de TELAS_DA_CONVERSA (logic/conversa). */
const DESTINOS: Record<string, { ic: string; rotulo: () => string }> = {
  '/evolucao': { ic: 'scale', rotulo: () => K().irEvolucao },
  '/sintomas': { ic: 'aura', rotulo: () => K().irSintomas },
  '/aplicacoes': { ic: 'syringe', rotulo: () => K().irAplicacoes },
  '/alimentacao': { ic: 'cutlery', rotulo: () => K().irAlimentacao },
  '/agua': { ic: 'water', rotulo: () => K().irAgua },
  '/exames': { ic: 'doc', rotulo: () => K().irExames },
  '/resumo-medico': { ic: 'steth', rotulo: () => K().irResumo },
  '/checkin': { ic: 'check', rotulo: () => K().irCheckin },
};

/** A resposta sem a marcação da tela: negrito vira texto, e o termo com
    link fica só com o termo. É o que vai para a área de transferência. */
const textoPuro = (t: string) =>
  t.replace(/<\/?b>/g, '').replace(/\[([^\]]+)\]\([^)]*\)/g, '$1');

/* ⚠️ MORAVAM AQUI a sobreposição de 36 px e a fração 0,504 — a altura que
   a folha clara subia por cima da imagem escura, e onde a base da esfera
   caía na peça de 853×1844. As duas foram embora com o cabeçalho do orbe,
   que é o hero do Insights e não desta tela. Quem for reconstruir aquele
   desenho encontra a conta no histórico deste arquivo. */

/** Os três pontos da espera.

    Existiam 450 ms de silêncio entre a pergunta e a resposta, sem nada na
    tela — e silêncio sem sinal não lê como processamento, lê como falha.
    O balão vazio no lugar certo do fio resolve isso sem prometer mais do
    que acontece: ele ocupa a posição da resposta que vem. */
function Pensando() {
  const { c } = useTheme();
  return (
    <Row gap={5} style={{ backgroundColor: c.bg1, borderRadius: radius.lg, borderBottomLeftRadius: 6, paddingHorizontal: 16, paddingVertical: 15, alignSelf: 'flex-start' }}>
      {[0, 1, 2].map((i) => (
        <View key={i} style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: c.tx4, opacity: 1 - i * 0.25 }} />
      ))}
    </Row>
  );
}

export default function Companion() {
  const S = useStore((s) => s.S);
  const update = useStore((s) => s.update);
  const { c } = useTheme();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const scrollRef = useRef<ScrollView>(null);
  /* A conversa mora no estado (S.conversa), e não na tela: sair e voltar
     encontra a conversa onde ela parou. Ver logic/conversa. */
  const msgs = useMemo(() => conversaGuardada(S), [S]);

  /* Voltar depois de horas abre uma conversa nova; a anterior fica no
     histórico (logic/conversa, CONVERSA_PARADA_MS). Só na entrada da
     tela: no meio de uma conversa, o relógio não a corta. */
  useEffect(() => {
    if (conversaParada(useStore.getState().S, Date.now())) update((s: any) => { recomecarConversa(s); });
  }, []);
  const aceitou = aceitouAConversa(S);
  const [pensando, setPensando] = useState(false);
  /* A resposta enquanto chega: o texto parcial, que cresce a cada trecho
     (ver servidor/api/conversa). Nulo quando não há resposta chegando. */
  const [escrevendo, setEscrevendo] = useState<string | null>(null);
  /* O aviso da tela — sem rede, limite, sem conta. Não é fala do Morphi,
     e por isso não entra na conversa guardada (ver o alto do arquivo). */
  const [aviso, setAviso] = useState<MotivoDaConversa | null>(null);
  /* A pergunta feita antes do aceite, esperando por ele. */
  const [pendente, setPendente] = useState<{ t: string; de: OrigemDaPergunta | undefined } | null>(null);
  const [input, setInput] = useState('');
  /* O ditado escreve no mesmo campo que o teclado escreve — não há um
     segundo lugar onde a fala vira texto, e é por isso que dá para
     começar digitando e terminar falando. */
  /* Desenha o microfone quando ele funciona E no Expo Go, onde ele
     explica por que não funciona — ver o comentário em useDitado. */
  const temDitado = useMemo(() => estadoDoDitado() !== 'indisponivel', []);
  const { ouvindo, erro: erroDoDitado, comecar: comecarDitado, parar: pararDitado, limparErro } = useDitado(setInput);

  /* As sugestões vêm do estado, não de uma constante.

     A lista fixa oferecia "Por que sinto mais fome?" no dia da aplicação,
     quando a fome é o menor dos problemas. companionSuggestions lê a fase
     do ciclo, o enjoo de hoje e a proximidade da dose — as mesmas
     perguntas que o Insights oferece, o que faz as duas telas parecerem a
     mesma inteligência em vez de dois menus. */
  const sugestoes = useMemo(() => companionSuggestions(S).slice(0, 4), [S]);
  const memoria = useMemo(() => companionMemoria(S), [S]);
  const vazio = msgs.length === 0;

  /* A pergunta que chega pelo endereço traz a origem junto — ver
     logic/perguntas: sem nada, é uma sugestão nossa. */
  const { q, origem, escrever } = useLocalSearchParams<{ q?: string; origem?: string; escrever?: string }>();
  /* Quem chega pelo campo do Insights veio para escrever: o teclado já
     abre. O atraso deixa a transição da tela terminar antes — focado no
     meio dela, o teclado sobe junto e a animação engasga. */
  const campoRef = useRef<TextInput>(null);
  useEffect(() => {
    if (escrever !== '1' || q) return;
    const t = setTimeout(() => campoRef.current?.focus(), 350);
    return () => clearTimeout(t);
  }, [escrever]);
  const askedRef = useRef(false);
  useEffect(() => {
    if (q && !askedRef.current) {
      askedRef.current = true;
      const texto = String(q);
      const de = origemDoEndereco(((S as any).asked ?? []) as PerguntaFeita[], texto, origem);
      setTimeout(() => ask(texto, de), 380);
    }
  }, [q]);

  /* O retorno de uma ação: ícone sem rótulo precisa dizer, em palavras,
     o que acabou de acontecer — "Copiado", "Guardada para a consulta" —,
     por dois segundos, ao lado dos ícones. */
  const [feito, setFeito] = useState<{ i: number; texto: string } | null>(null);
  const avisar = (i: number, texto: string) => {
    setFeito({ i, texto });
    setTimeout(() => setFeito((x) => (x?.i === i && x.texto === texto ? null : x)), 2000);
  };
  const copiar = async (texto: string, i: number) => {
    await Clipboard.setStringAsync(texto).catch(() => {});
    avisar(i, K().copiado);
  };
  /* Compartilhar abre a folha do sistema (WhatsApp, e-mail…). Onde ela não
     existe — o navegador, às vezes —, copia. */
  const compartilhar = async (texto: string, i: number) => {
    try { await Share.share({ message: texto }); } catch { await copiar(texto, i); }
  };
  /* ⚠️ LEVAR PARA A CONSULTA GUARDA A PERGUNTA, E NÃO A RESPOSTA. A pauta
     da consulta (S.notes) é o que a pessoa quer perguntar ao médico; e as
     notas sobem para a conta e a clínica conectada as vê. A resposta da
     Morphi Intelligence continua só no aparelho, como o resto da
     conversa. */
  const perguntaDe = (i: number) => {
    for (let k = i - 1; k >= 0; k--) if (msgs[k].who === 'me') return msgs[k].text.trim();
    return '';
  };
  const naPauta = (p: string) => !!p && ((S as any).notes ?? []).some((n: any) => !n.done && n.text === p);
  const levarParaConsulta = (i: number) => {
    const p = perguntaDe(i);
    if (!p) return;
    if (!naPauta(p)) update((s: any) => { s.notes = [{ t: Date.now(), text: p, done: false }, ...(s.notes || [])]; });
    avisar(i, K().naPauta);
  };

  const rolarParaOFim = () => setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 90);

  const enviar = async (t: string, de: OrigemDaPergunta | undefined) => {
    /* As anteriores saem do estado ANTES da pergunta entrar: é o
       histórico, e a pergunta vai no campo dela. */
    const anteriores = conversaGuardada(useStore.getState().S);
    /* guarda a pergunta para o Insights poder oferecer "continue de onde
       parou" — sem isso, cada visita à aba recomeça do zero */
    update((s: any) => {
      s.asked = acrescentarPergunta(s.asked || [], t, de, Date.now());
      guardarNaConversa(s, { who: 'me', text: t, t: Date.now() });
    });
    setAviso(null);
    setPensando(true);
    rolarParaOFim();
    const r = await perguntarAoMorphi(useStore.getState().S, t, anteriores, (parcial) => {
      setPensando(false);
      setEscrevendo(parcial);
    });
    setPensando(false);
    setEscrevendo(null);
    if (r.ok) update((s: any) => { guardarNaConversa(s, { who: 'ai', text: r.texto, t: Date.now() }); });
    else setAviso(r.motivo);
    rolarParaOFim();
  };

  const ask = (text: string, de: OrigemDaPergunta | undefined) => {
    const t = text.trim(); if (!t || pensando || escrevendo != null) return;
    setInput('');
    if (!conversaLigada()) { setAviso('sem-servidor'); return; }
    /* Sem o aceite, a pergunta espera: a folha do termo está aberta, e
       o aceite manda a pergunta sozinho. */
    if (!aceitouAConversa(useStore.getState().S)) { setPendente({ t, de }); return; }
    void enviar(t, de);
  };

  /* ⚠️ O TERMO É UMA FOLHA POR CIMA DA CONVERSA (app/aceite-ia), e esta
     tela é quem decide o que a volta dela quer dizer. Na primeira vez
     em foco sem o aceite, abre a folha; ao voltar ao foco AINDA sem o
     aceite, a folha foi fechada sem aceitar — pelo "Agora não", pelo X,
     pela sombra ou pelo voltar do Android — e a conversa fecha junto.
     Recusar é não usar a IA. */
  const pediuAceite = useRef(false);
  useFocusEffect(React.useCallback(() => {
    if (aceitouAConversa(useStore.getState().S)) return;
    if (!pediuAceite.current) {
      pediuAceite.current = true;
      /* O atraso deixa a entrada da tela terminar: aberta no meio dela,
         a folha sobe junto com a animação da conversa. */
      const t = setTimeout(() => router.push('/aceite-ia' as any), 320);
      return () => clearTimeout(t);
    }
    router.back();
  }, []));

  /* A pergunta que esperava o aceite segue sozinha quando ele chega. */
  useEffect(() => {
    if (!aceitou || !pendente) return;
    const p = pendente;
    setPendente(null);
    void enviar(p.t, p.de);
  }, [aceitou]);

  const textoDoAviso = (m: MotivoDaConversa) =>
    m === 'sem-servidor' ? K().semServidor
      : m === 'sem-conta' ? K().semConta
        : m === 'limite' ? K().limiteDoDia
          : K().semRede;

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1, backgroundColor: c.bg }}>
      {/* ---- o cabeçalho ----

          ⚠️⚠️ A ESFERA E O "PODE PERGUNTAR" SAÍRAM DAQUI, e eram a coisa
          mais bonita da tela.

          Eles são o hero do INSIGHTS: lá o orbe é a marca do produto na
          aba, ocupa meia dobra e convida — é uma capa. Repetido aqui, a
          conversa começava com 40% da tela ocupados por uma apresentação
          de quem a pessoa acabou de escolher abrir. Quem entra para
          perguntar já sabe com quem vai falar; o que ela quer é o campo.

          Pior no uso repetido: cada volta à tela reapresentava o
          personagem, e cada volta empurrava a primeira resposta para
          baixo da dobra.

          Agora é o cabeçalho de um chat, e ele é CENTRADO de propósito —
          o da conversa com a equipe é alinhado à esquerda com o nome da
          clínica, porque lá a pergunta que volta é "com quem estou
          falando". Aqui não há quem: há o quê. Duas telas de conversa,
          dois cabeçalhos que não se confundem.

          O limite ("não substitui sua equipe médica") não sumiu — desceu
          para a abertura, que é onde alguém o lê antes da primeira
          pergunta, em vez de ficar pendurado em toda volta. */}
      <View style={{
        paddingTop: insets.top + 8, paddingHorizontal: PAD, paddingBottom: 12,
        borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: c.line,
      }}>
        <Row style={{ alignItems: 'center' }}>
          {/* Os dois lados têm a mesma largura (dois botões), para o
              título centrar na tela com ou sem os botões da direita. */}
          {/* ⚠️ MENU À ESQUERDA, FECHAR À DIREITA (30/09/2026). As conversas
              e o "nova conversa" moram no menu, como nos apps de conversa
              que a pessoa já usa; o X fecha a tela. Antes eram o voltar,
              um relógio e um "+" disputando o canto direito. Sem a
              permissão não há conversa, e o menu não aparece. */}
          <Row style={{ width: 44 }}>
            {aceitou ? (
              <Pressable
                onPress={() => router.push('/conversas-morphi' as any)}
                accessibilityLabel={K().menu} hitSlop={6}
                style={({ pressed }) => [{ width: 40, height: 40, alignItems: 'center', justifyContent: 'center', opacity: pressed ? 0.6 : 1 }]}
              >
                <Icon name="menu" size={21} color={c.tx} sw={2} />
              </Pressable>
            ) : null}
          </Row>
          {/* O título centra na TELA, e não no vão que sobra: sem o
              espaçador do mesmo tamanho do botão à direita, ele ficaria
              deslocado 44 px para a esquerda e o olho lê como desalinho.

              ⚠️ "MORPHI" AQUI NÃO FERE A REGRA DA TERCEIRA PESSOA, e uma
              varredura de texto vai tropeçar nele. A regra é sobre o
              aplicativo FALAR DE SI — "o Morphi guarda", "o Morphi
              avisa" —, que transforma o produto num objeto que observa a
              pessoa. Isto é um rótulo de tela: um nome, não uma frase.
              Nenhum verbo depende dele.

              ⚠️ E É PROVISÓRIO, por decisão do produto. Era "Perguntas",
              que dizia o que a tela faz e não tinha dono; depois "Morphi
              IA"; agora "Morphi Intelligence". Nenhum link do aplicativo
              rotula esta tela — todos são toque em alguma coisa —, então
              trocar o nome é trocar esta linha e mais nada. */}
          {/* A estrela VEM ANTES DO NOME, como marca antes de letreiro —
              e o par inteiro é que centra, não o texto sozinho. */}
          <Row gap={7} style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <EstrelaIA size={21} />
            <Txt v="title">Morphi Intelligence</Txt>
          </Row>
          <Row style={{ width: 44, justifyContent: 'flex-end' }}>
            <CircleBtn name="x" onPress={() => router.back()} />
          </Row>
        </Row>
      </View>

      {/* ---- onde se lê ----
          O raio no topo e os 36 px de sobreposição saíram junto com o
          cabeçalho escuro: eles existiam para a folha clara subir por cima
          da imagem. Sem imagem embaixo, um canto arredondado no meio de
          duas superfícies da mesma cor é um detalhe que não separa nada. */}
      <View style={{ flex: 1, backgroundColor: c.bg }}>
        <Rolagem
          ref={scrollRef} style={{ flex: 1 }}
          contentContainerStyle={{ paddingHorizontal: PAD, paddingTop: 26, paddingBottom: 24 }}
          showsVerticalScrollIndicator={false}
          onContentSizeChange={() => scrollRef.current?.scrollToEnd({ animated: false })}
        >
          {/* ---- abertura ----

              Antes a saudação era a primeira mensagem do fio: um balão de
              IA com cinco linhas listando o que ela sabe fazer. Isso é
              menu disfarçado de conversa — e pior, deixa o fio começando
              com alguém falando sozinho.

              Agora a abertura é estado da tela, não mensagem. A memória diz
              que ele lembra da última vez, e as perguntas são o convite.
              Quando a conversa começa, tudo isso sai de cena em vez de
              ficar rolado para cima como um primeiro balão sem valor.

              A onda que abria este bloco saiu junto. Ela era a presença do
              Morphi enquanto o cabeçalho tinha só um ícone; com o orbe no
              alto, ter as duas era mostrar o mesmo personagem duas vezes
              na mesma dobra, em desenhos diferentes — e a de baixo era a
              mais fraca. */}
          {vazio || !aceitou ? (
            <View style={{ alignItems: 'center', paddingTop: 8 }}>
              <Txt v="display" style={{ fontSize: 26, lineHeight: 33, textAlign: 'center' }}>
                {K().ola(S.profile.name.split(' ')[0])}
              </Txt>
              {/* A memória é o que separa assistente de buscador: ela prova
                  que a conversa anterior aconteceu. É a mesma frase que
                  abre o Insights, de propósito — uma voz só. */}
              <Txt v="caption" c={c.tx3} style={{ marginTop: 8, textAlign: 'center', lineHeight: 21, maxWidth: 300 }}>
                {memoria}
              </Txt>
              {/* ⚠️ O LIMITE MORAVA NO CABEÇALHO, embaixo do "Pode
                  perguntar", e veio junto quando aquele bloco saiu.

                  Ele não podia simplesmente sumir: é a frase que diz o
                  que esta tela NÃO é, num aplicativo de saúde. Aqui ela
                  fica melhor do que ficava — é lida uma vez, antes da
                  primeira pergunta, em vez de ficar pendurada no alto em
                  toda volta à conversa. */}
              <Txt v="micro" c={c.tx4} style={{ marginTop: 10, textAlign: 'center' }}>
                {K().limite}
              </Txt>

              {/* Sem o aceite, as sugestões não aparecem: o termo está na
                  folha por cima (app/aceite-ia), e uma sugestão tocada
                  atrás dela não teria para onde ir. */}
              {!aceitou ? null : (
              <View style={{ marginTop: 32, alignSelf: 'stretch', gap: 8 }}>
                {sugestoes.map((s) => (
                  <Pressable key={s} onPress={() => ask(s, 'sugerida')} style={({ pressed }) => [{ opacity: pressed ? 0.65 : 1 }]}>
                    <Row gap={12} style={{ backgroundColor: c.bg1, borderRadius: radius.lg, paddingHorizontal: 16, paddingVertical: 15 }}>
                      <Icon name="aura" size={15} color={c.accent} sw={1.9} />
                      <Txt v="body" style={{ flex: 1 }}>{s}</Txt>
                      <Icon name="chev" size={14} color={c.tx4} sw={2} />
                    </Row>
                  </Pressable>
                ))}
              </View>
              )}
            </View>
          ) : null}

          {/* ⚠️ O RESPIRO É DA MENSAGEM, E NÃO DA ROLAGEM (30/09/2026). Um gap
              de 12 igual para tudo colava a pergunta na resposta anterior
              e a resposta na pergunta dela, e o fio lia como um bloco só.
              Agora cada troca começa longe da anterior (32) e a resposta
              fica perto da pergunta que a puxou (18): o olho separa as
              trocas antes de ler. */}
          {msgs.map((m, i) => m.who === 'me' ? (
            <Pressable
              key={i}
              onLongPress={() => copiar(m.text, i)}
              style={{ alignSelf: 'flex-end', maxWidth: '84%', marginTop: i === 0 ? 0 : 32 }}
            >
              <View style={{ backgroundColor: c.accent, borderRadius: radius.lg, borderBottomRightRadius: 6, paddingHorizontal: 16, paddingVertical: 12 }}>
                <Txt v="bodyMed" c={c.accentInk} style={{ lineHeight: 22 }}>{m.text}</Txt>
              </View>
            </Pressable>
          ) : (
            /* ⚠️⚠️ A RESPOSTA PERDEU O BALÃO, e esta é a mudança que separa
               esta tela da conversa com a equipe.

               O balão foi encolhendo aqui por partes — perdeu o contorno,
               perdeu o avatar repetido, ganhou 94% de largura — e cada
               passo foi na mesma direção sem chegar no fim dela. O fim é
               este: a resposta da IA não é uma fala, é um TEXTO. Tem
               manchete, tem parágrafo, tem lista.

               Balão é o desenho certo para uma pessoa falando: diz quem é
               pela posição e pela cor, e uma frase de duas linhas cabe
               nele sem esforço. É por isso que a conversa com a equipe,
               em /conversa, continua com balões dos dois lados — lá são
               duas pessoas.

               Aqui o balão vestia um documento de recado: a lista não
               tinha onde recuar, o título ficava do tamanho do corpo, e
               o texto longo quebrava numa coluna estreita com o canto
               mordido embaixo. Sem ele, a resposta ocupa a página e passa
               a ser lida como o que é — e a tela inteira muda de gênero
               sem precisar de um rótulo dizendo "isto aqui é a IA".

               A pergunta DELA continua em balão, e isso não é descuido:
               ela é uma fala, curta, de uma pessoa. O contraste entre os
               dois lados passou a ser o assunto em vez de ser decoração. */
            <View key={i} style={{ alignSelf: 'stretch', marginTop: i === 0 ? 0 : 18 }}>
              {/* A marca antes da resposta diz quem fala sem balão e sem
                  avatar repetido: uma linha pequena, e o texto começa
                  abaixo dela. */}
              <Row gap={7} style={{ alignItems: 'center', marginBottom: 10 }}>
                <EstrelaIA size={15} />
                <Txt v="micro" c={c.tx3}>Morphi Intelligence</Txt>
              </Row>
              {/* Parágrafos mais afastados que o padrão do RichDoc: a
                  resposta é lida no celular, de uma vez, e parágrafo
                  colado em parágrafo vira parede. */}
              <RichDoc text={semLinks(m.text)} style={{ gap: 16 }} />
              {/* ⚠️ O DESTINO É UM BOTÃO, E NÃO UM LINK NO MEIO DO TEXTO
                  (30/09/2026). Sublinhado no meio da frase, ele disputava
                  com a leitura e era fácil de não ver; embaixo, é o passo
                  seguinte, do tamanho de um toque. O rótulo é nosso, e não
                  o do modelo: o mesmo destino se chama sempre igual. */}
              {destinosDe(m.text).map((rota) => (
                <Pressable key={rota} onPress={() => router.push(rota as any)}
                  style={({ pressed }) => [{ marginTop: 14, opacity: pressed ? 0.7 : 1 }]}>
                  <Row gap={12} style={{ alignItems: 'center', backgroundColor: c.bg1, borderRadius: radius.lg, paddingHorizontal: 14, paddingVertical: 12 }}>
                    <View style={{ width: 32, height: 32, borderRadius: 16, backgroundColor: c.bg2, alignItems: 'center', justifyContent: 'center' }}>
                      <Icon name={DESTINOS[rota]?.ic ?? 'chev'} size={16} color={c.accent} sw={1.9} />
                    </View>
                    <Txt v="label" style={{ flex: 1 }}>{DESTINOS[rota]?.rotulo() ?? rota}</Txt>
                    <Icon name="chev" size={14} color={c.tx3} sw={2} />
                  </Row>
                </Pressable>
              ))}
              {/* ⚠️ AS AÇÕES SÃO ÍCONES, E O RETORNO É TEXTO (30/09/2026).
                  Copiar e compartilhar têm desenho que todo mundo
                  reconhece; "levar para a consulta" não tem, e por isso o
                  toque responde em palavras ao lado ("Guardada para a
                  consulta"). Cada ícone tem rótulo para o leitor de tela.
                  Copiar e compartilhar levam o texto limpo, sem marcação. */}
              <Row gap={4} style={{ alignItems: 'center', marginTop: 12, marginLeft: -8 }}>
                {[
                  { ic: 'copiar', rotulo: K().copiar, fazer: () => copiar(textoPuro(m.text), i) },
                  { ic: 'compartilhar', rotulo: K().compartilhar, fazer: () => compartilhar(textoPuro(m.text), i) },
                  ...(perguntaDe(i) ? [{
                    ic: naPauta(perguntaDe(i)) ? 'check' : 'steth', rotulo: K().levarConsulta, fazer: () => levarParaConsulta(i),
                  }] : []),
                ].map((a) => (
                  <Pressable
                    key={a.rotulo} onPress={a.fazer} accessibilityRole="button" accessibilityLabel={a.rotulo} hitSlop={4}
                    style={({ pressed }) => [{ width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center', backgroundColor: pressed ? c.bg1 : 'transparent' }]}
                  >
                    <Icon name={a.ic} size={17} color={c.tx3} sw={1.9} />
                  </Pressable>
                ))}
                {feito?.i === i ? (
                  <Row gap={5} style={{ alignItems: 'center', marginLeft: 4 }}>
                    <Icon name="check" size={13} color={c.accent} sw={2.2} />
                    <Txt v="micro" c={c.tx2}>{feito.texto}</Txt>
                  </Row>
                ) : null}
              </Row>
            </View>
          ))}

          {pensando ? <View style={{ marginTop: 18 }}><Pensando /></View> : null}
          {escrevendo != null ? (
            <View style={{ alignSelf: 'stretch', marginTop: 18 }}>
              <Row gap={7} style={{ alignItems: 'center', marginBottom: 10 }}>
                <EstrelaIA size={15} />
                <Txt v="micro" c={c.tx3}>Morphi Intelligence</Txt>
              </Row>
              <RichDoc text={escrevendo} style={{ gap: 16 }} />
            </View>
          ) : null}
          {aviso ? (
            <Row gap={10} style={{ marginTop: 18, backgroundColor: c.bg1, borderRadius: radius.md, paddingHorizontal: 14, paddingVertical: 12, alignItems: 'flex-start' }}>
              <Icon name="info" size={15} color={c.tx3} sw={1.9} />
              <Txt v="caption" c={c.tx2} style={{ flex: 1, lineHeight: 20 }}>{textoDoAviso(aviso)}</Txt>
            </Row>
          ) : null}
        </Rolagem>

        {/* ---- o campo ----

            As chips horizontais que moravam aqui saíram. Elas repetiam as
            perguntas da abertura num carrossel cortado na borda, e ficavam
            na tela durante a conversa inteira oferecendo recomeçar quando
            a pessoa já está no meio de um assunto. O convite pertence ao
            começo; depois dele, o que se quer é escrever.

            ⚠️ E SEM O ACEITE NÃO HÁ CAMPO. O aceite é o termo de uso da
            IA: recusado, a conversa fica desligada, e um campo aberto
            prometeria uma resposta que não vem. A pergunta que chega pelo
            endereço (do Insights) espera o aceite em `pendente`. */}
        {aceitou ? (
        <View style={{ paddingHorizontal: PAD, paddingTop: 10, paddingBottom: (insets.bottom || 10) + 10, backgroundColor: c.bg }}>
          {/* ⚠️ O AVISO DO DITADO FICA ACIMA DO CAMPO, e não dentro dele.

              Dentro, ele empurraria o campo para baixo no meio do teclado
              aberto; e "não ouvi nada" não é um estado do campo, é uma
              resposta a um gesto que a pessoa acabou de fazer. */}
          {erroDoDitado ? (
            <Pressable onPress={limparErro} style={({ pressed }) => [{ opacity: pressed ? 0.6 : 1, marginBottom: 8 }]}>
              <Row gap={8} style={{ backgroundColor: c.bg1, borderRadius: radius.md, paddingHorizontal: 14, paddingVertical: 10 }}>
                <Icon name="mic" size={14} color={c.tx3} sw={1.9} />
                <Txt v="caption" c={c.tx2} style={{ flex: 1 }}>{erroDoDitado}</Txt>
              </Row>
            </Pressable>
          ) : null}
          <Row gap={10}>
            <Row gap={10} style={{ flex: 1, backgroundColor: c.bg1, borderRadius: radius.pill, paddingLeft: 18, paddingRight: 8, paddingVertical: 4 }}>
              <TextInput
                ref={campoRef}
                value={input} onChangeText={setInput} onSubmitEditing={() => ask(input, 'digitada')}
                /* ⚠️ O TEXTO ENCURTOU PORQUE O CAMPO ENCURTOU. Com o
                   microfone dentro da pílula, 'Pergunte sobre sua jornada'
                   passou a ser cortado no meio — e placeholder cortado lê
                   como defeito, não como texto longo. O novo diz as duas
                   formas de responder, e só promete a fala onde ela existe. */
                placeholder={ouvindo ? K().ouvindo : temDitado ? K().escrevaOuFale : K().pergunte} placeholderTextColor={c.tx4}
                /* ⚠️ minWidth 0 PORQUE flex:1 NÃO BASTA. Na web o <input> tem
                   largura intrínseca, e um filho flex não encolhe abaixo dela
                   sem isto — o campo empurrava o microfone para fora da
                   pílula, em cima do botão de enviar. No nativo é inócuo. */
                style={{ flex: 1, minWidth: 0, paddingVertical: 12, color: c.tx, fontFamily: font.body, fontSize: 19 }}
              />
              {/* ⚠️ O MICROFONE MORA DENTRO DO CAMPO, e o enviar fica fora.

                  São gestos de naturezas diferentes: ditar é uma forma de
                  ESCREVER, e por isso pertence ao campo em que se escreve;
                  enviar é o que se faz depois de escrever. Lado a lado,
                  fora do campo, os dois viravam dois botões redondos
                  competindo pelo mesmo canto.

                  ⚠️ E ELE SÓ EXISTE ONDE FUNCIONA, com uma exceção que
                  vale a pena: no Expo Go ele aparece e explica por que não
                  grava. Ver estadoDoDitado, em ui/useDitado. */}
              {temDitado ? (
                <Pressable
                  onPress={() => (ouvindo ? pararDitado() : comecarDitado(input))}
                  hitSlop={8}
                  style={({ pressed }) => [{ opacity: pressed ? 0.6 : 1 }]}
                >
                  <View style={{
                    width: 36, height: 36, borderRadius: 18,
                    backgroundColor: ouvindo ? c.accent : 'transparent',
                    alignItems: 'center', justifyContent: 'center',
                  }}>
                    <Icon
                      name={ouvindo ? 'ondas' : 'mic'}
                      size={19}
                      color={ouvindo ? c.accentInk : c.tx3}
                      sw={1.9}
                    />
                  </View>
                </Pressable>
              ) : null}
            </Row>
            {/* o botão só acende quando há o que enviar: cheio e apagado
                dizem, antes do toque, se o gesto vai levar a algo */}
            <Pressable onPress={() => ask(input, 'digitada')} disabled={!input.trim() || pensando} style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1 }]}>
              <View style={{ width: 48, height: 48, borderRadius: 24, backgroundColor: input.trim() ? c.accent : c.bg2, alignItems: 'center', justifyContent: 'center' }}>
                <Icon name="send" size={19} color={input.trim() ? c.accentInk : c.tx4} sw={2} />
              </View>
            </Pressable>
          </Row>
        </View>
        ) : <View style={{ height: insets.bottom || 10 }} />}
      </View>
    </KeyboardAvoidingView>
  );
}
