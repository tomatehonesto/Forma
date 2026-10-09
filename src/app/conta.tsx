import React from 'react';
import { ActivityIndicator, Animated, AppState, Platform, Pressable, StyleSheet, TextInput, View, useWindowDimensions } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import * as Clipboard from 'expo-clipboard';
import { Image } from 'expo-image';
import { setStatusBarStyle } from 'expo-status-bar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useStore } from '../logic/store';
import { estadoVazio } from '../logic/seed';
import {
  DIGITOS_DO_CODIGO, ESPERA_PARA_REENVIAR_S, VALIDADE_DO_CODIGO_MIN,
  appleDisponivel, atualizarVinculo, confirmarCodigo, contaTemDiario, entrarComApple, entrarComGoogle, googleDisponivel,
  pedirCodigo, sair, sincronia, codigoNoTexto,
  usarConvitePendente,
  type ErroDaConta,
} from '../logic/conta';
import { TelaInterna, Titulao, Botao, Aviso, Cartao, Linha, SEM_ANEL } from '../ui/internas';
import { Txt } from '../ui/kit';
import { BotaoDaApple, BotaoDoGoogle, contornoDaPorta } from '../ui/marcas';
import { Icon } from '../ui/Icon';
import { TelaDePergunta } from '../ui/pergunta';
import { useTheme } from '../ui/useTheme';
import { useAurora, PROPORCAO_DA_CAPA, PAPEL_COMECA } from '../ui/aurora';
import { ManchaDeLuz } from '../ui/mancha';
import { BrilhoNoTexto, RodaQueViraVisto, FASE_ATIVA } from '../ui/espera';
import { useMenosMovimento } from '../ui/useMenosMovimento';
import { PAPEL_DO_PLANO } from './plano';
import { ty, font, radius } from '../theme';
import { T } from '../textos';

const K = () => T.conta;

/* ============================================================
   A CONTA — criar, entrar, entrar de novo

   Três portas chegam aqui, pelo `?de=`:

     cadastro — o fim do cadastro (a saída de /planos), e a tranca da
                conta do portão para quem reabre sem conta;
     abertura — "Já tenho conta", na abertura do cadastro;
     sessao   — "Entre de novo", pela linha de estado do Perfil.

   ⚠️ SEM SAÍDA QUE NÃO SEJA CRIAR A CONTA OU ENTRAR NUMA (plano do
   Supabase, a decisão 1). Pelo cadastro, voltar leva de novo aos planos,
   que trazem de volta para cá: é o mesmo corredor. Pela abertura e pela
   sessão, a pessoa ainda não tinha diário nesta conta, ou já tem conta —
   voltar é só voltar.

   ⚠️ DEPOIS DE ENTRAR, O DIÁRIO DECIDE O CAMINHO:
     - pela sessão, a conta tem de ser a dona do diário (`S.conta`). Se
       for, nada muda no estado e a fila volta a subir; se não for, nada
       sobe — a pessoa entra com a conta dona, ou começa de novo;
     - pela abertura, a conta com diário devolve o diário inteiro, e o
       cadastro é pulado; a conta vazia volta ao cadastro, já com dono;
     - pelo cadastro, a conta vazia recebe este diário; a que já tem um
       pede uma escolha — os dois não se misturam.

   ⚠️ SEM INTERNET, A TELA ESPERA. Ela diz que criar a conta precisa de
   conexão, guarda o que já foi escrito e tenta de novo sozinha quando a
   pessoa volta para o aplicativo.
   ============================================================ */

type Porta = 'cadastro' | 'abertura' | 'sessao';
type Passo = 'escolha' | 'email' | 'codigo' | 'entrando' | 'dois-diarios' | 'outra-conta';
type Dono = { id: string; email?: string };

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

const fraseDoErro = (e: ErroDaConta) => ({
  'sem-internet': K().erro.semInternet,
  'codigo-errado': K().erro.codigoErrado,
  'muitos-pedidos': K().erro.muitosPedidos,
  apple: K().erro.apple,
  google: K().erro.google,
  cancelado: '',
  outro: K().erro.outro,
}[e]);

export default function Conta() {
  const router = useRouter();
  const { c, isDark } = useTheme();
  const update = useStore((s) => s.update);
  const { de, passo: passoDoLink } = useLocalSearchParams<{ de?: string; passo?: string }>();
  const porta: Porta = de === 'abertura' || de === 'sessao' ? de : 'cadastro';

  /* `?passo=email` abre direto no e-mail — o atalho dos testes (a entrada
     e a criação da conta sem passar pela escolha). O voltar ainda leva à
     escolha, como no caminho normal. */
  const [passo, setPasso] = React.useState<Passo>(passoDoLink === 'email' ? 'email' : 'escolha');
  const [email, setEmail] = React.useState('');
  const [codigo, setCodigo] = React.useState('');
  const [erro, setErro] = React.useState<ErroDaConta | null>(null);
  const [ocupado, setOcupado] = React.useState(false);
  /* O reenvio tem espera própria: ela mora no botão, e não na roda do meio,
     que é a da conferência do código (pedido do dono). */
  const [reenviando, setReenviando] = React.useState(false);
  const [apple, setApple] = React.useState(false);
  /* Síncrono: o módulo nativo e os IDs estão ou não estão — ver logic/conta. */
  const [google] = React.useState(googleDisponivel);
  /* ⚠️ A PRÉVIA DAS DUAS PORTAS (27/09/2026, pedido do dono): em
     desenvolvimento, a Apple e o Google aparecem mesmo onde não abrem — o
     Expo Go e a web —, para o desenho ser visto com as três portas. O
     toque explica por que não entra. Fora do desenvolvimento, continua a
     regra de sempre: porta que não abre não aparece. */
  const previaDasPortas = __DEV__;
  const [previa, setPrevia] = React.useState(false);
  const [nadaParaColar, setNadaParaColar] = React.useState(false);
  const primeiroNome = useStore((s) => ((s.S.profile.name ?? '') as string).trim().split(/\s+/)[0] ?? '');
  const [espera, setEspera] = React.useState(0);
  /* quem entrou, enquanto o caminho do diário não termina */
  const [dono, setDono] = React.useState<Dono | null>(null);
  const [confirmando, setConfirmando] = React.useState(false);
  /* o que tentar de novo quando a conexão voltar */
  const repetir = React.useRef<(() => void) | null>(null);

  React.useEffect(() => { appleDisponivel().then(setApple); }, []);

  /* ⚠️ A BARRA DE STATUS SEGUE O PASSO, e não a rota. A escolha abre sobre
     a aurora, escura, e pede o relógio claro; o e-mail e o código abrem
     sobre a lavagem, clara, e pedem o escuro — e os três são a mesma
     tela. O `useLightStatusBar` das outras telas acende no foco da rota
     e não veria a troca de passo. Ao sair, volta o padrão do app. */
  React.useEffect(() => { setStatusBarStyle(passo === 'escolha' ? 'light' : 'dark'); }, [passo]);
  React.useEffect(() => () => setStatusBarStyle('dark'), []);

  React.useEffect(() => {
    if (espera <= 0) return;
    const t = setTimeout(() => setEspera((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [espera]);

  /* Voltar para o aplicativo é o momento em que a conexão pode ter
     voltado — e é quando a tela tenta de novo o que falhou por ela. */
  React.useEffect(() => {
    const sub = AppState.addEventListener('change', (e) => {
      if (e === 'active' && repetir.current) repetir.current();
    });
    return () => sub.remove();
  }, []);

  const falhou = (e: ErroDaConta, deNovo?: () => void) => {
    setErro(e === 'cancelado' ? null : e);
    repetir.current = e === 'sem-internet' && deNovo ? deNovo : null;
  };
  const limpar = () => { setErro(null); repetir.current = null; };

  /* ---------------- o e-mail e o código ---------------- */
  const mandar = async () => {
    if (!EMAIL.test(email.trim())) return;
    const deNovo = passo === 'codigo';
    setOcupado(true);
    setReenviando(deNovo);
    limpar();
    const r = await pedirCodigo(email);
    setOcupado(false);
    setReenviando(false);
    if (!r.ok) return falhou(r.erro, mandar);
    setCodigo('');
    setPasso('codigo');
    setEspera(ESPERA_PARA_REENVIAR_S);
  };

  const confirmar = async (valor = codigo) => {
    if (valor.length !== DIGITOS_DO_CODIGO || ocupado) return;
    setOcupado(true);
    limpar();
    const r = await confirmarCodigo(email, valor);
    setOcupado(false);
    if (!r.ok) {
      if (r.erro === 'codigo-errado') setCodigo('');
      /* Sem conexão, o código continua valendo: ele fica nas casas, e a
         conferência se repete na volta ao aplicativo ou no "Tentar de
         novo" — o botão Entrar, que servia para isso, não existe mais. */
      return falhou(r.erro, () => confirmar(valor));
    }
    await entrou({ id: r.id, ...(r.email ? { email: r.email } : {}) });
  };

  const viaApple = async () => {
    limpar();
    const r = await entrarComApple();
    if (!r.ok) return falhou(r.erro);
    await entrou({ id: r.id, ...(r.email ? { email: r.email } : {}) });
  };

  const viaGoogle = async () => {
    limpar();
    const r = await entrarComGoogle();
    if (!r.ok) return falhou(r.erro);
    await entrou({ id: r.id, ...(r.email ? { email: r.email } : {}) });
  };

  /* ---------------- depois de entrar ---------------- */

  /** A volta inteira, e se ela chegou ao servidor. */
  const sincronizar = async () => {
    const m = sincronia();
    if (!m) return false;
    m.iniciar();
    await m.sincronizar({ baixar: true });
    return !['sem-internet', 'entrar-de-novo', 'outra-conta', 'conta-apagada'].includes(m.estado());
  };

  /** O diário da conta desce, e o deste telefone sai. */
  const trazerDaConta = async (quem: Dono) => {
    setPasso('entrando');
    const m = sincronia();
    /* O código de clínica guardado atravessa: ele é da pessoa, e não do
       diário que sai. */
    const pendente = (useStore.getState().S as any).convitePendente ?? null;
    await m?.trocarDeDiario(() => {
      useStore.getState().update((s: any) => {
        Object.assign(s, estadoVazio());
        s.conta = quem;
        s.convitePendente = pendente;
      });
    });
    /* Aqui não dá para entrar sem o diário: ele ainda não desceu. A tela
       diz, e oferece tentar de novo — e tenta sozinha na volta ao
       aplicativo. */
    if (!(await sincronizar())) return falhou('sem-internet', () => trazerDaConta(quem));
    /* Quem tem diário na conta já passou pelo cadastro — em outro
       aparelho. O portão não pode mandá-la responder tudo de novo. */
    update((s: any) => { s.onboardDone = true; });
    await depoisDeEntrar();
    router.dismissTo('/(tabs)' as any);
  };

  /** Com a conta nascida ou a sessão de volta: o código de clínica
      guardado vira vínculo, e a cópia do vínculo segue o servidor. */
  const depoisDeEntrar = async () => {
    await usarConvitePendente();
    await atualizarVinculo();
  };

  /** Este diário ganha dono e sobe.

      ⚠️ SE A CONEXÃO CAIR AQUI, A PESSOA ENTRA MESMO ASSIM: o diário já
      tem dono, e a subida é da sincronia, que tenta de novo sozinha — a
      linha do Perfil diz "guardamos quando a conexão voltar". Segurar a
      pessoa numa tela girando seria trancá-la fora do próprio diário. */
  const levarParaAConta = async (quem: Dono) => {
    setPasso('entrando');
    update((s: any) => { s.conta = quem; });
    await sincronizar();
    await depoisDeEntrar();
    router.dismissTo('/(tabs)' as any);
  };

  /** "Ficar com o deste telefone": o da conta sai, e este sobe no lugar. */
  const ficarComEste = async (quem: Dono) => {
    setPasso('entrando');
    update((s: any) => { s.conta = quem; });
    const m = sincronia();
    try {
      await m?.substituirNoServidor();
      m?.iniciar();
      await depoisDeEntrar();
      router.dismissTo('/(tabs)' as any);
    } catch {
      update((s: any) => { s.conta = null; });
      setPasso('dois-diarios');
      falhou('sem-internet');
    }
  };

  const decidir = async (quem: Dono) => {
    setDono(quem);
    setPasso('entrando');
    limpar();

    if (porta === 'sessao') {
      const S: any = useStore.getState().S;
      if (S.conta?.id !== quem.id) { setPasso('outra-conta'); return; }
      /* A dona de volta: o estado não muda, e a fila volta a subir. */
      await sincronizar();
      await depoisDeEntrar();
      if (router.canGoBack()) router.back();
      else router.dismissTo('/(tabs)' as any);
      return;
    }

    const tem = await contaTemDiario();
    if (tem === null) {
      setPasso('escolha');
      return falhou('sem-internet', () => decidir(quem));
    }
    if (porta === 'abertura') {
      if (tem) return trazerDaConta(quem);
      /* Conta vazia: o cadastro segue, já com dono. */
      update((s: any) => { s.conta = quem; });
      sincronia()?.iniciar();
      if (router.canGoBack()) router.back();
      else router.replace('/cadastro' as any);
      return;
    }
    if (tem) { setPasso('dois-diarios'); return; }
    await levarParaAConta(quem);
  };
  const entrou = (quem: Dono) => decidir(quem);

  /* ---------------- o voltar ---------------- */
  const voltar = () => {
    limpar();
    if (passo === 'codigo') return setPasso('email');
    if (passo === 'email') return setPasso('escolha');
    if (passo === 'dois-diarios' || passo === 'outra-conta') {
      sair();
      setDono(null);
      setConfirmando(false);
      return setPasso('escolha');
    }
    if (porta === 'cadastro') return router.replace('/planos?de=cadastro' as any);
    if (router.canGoBack()) router.back();
    else router.dismissTo('/(tabs)' as any);
  };

  /* ---------------- a tela ---------------- */
  const aviso = erro ? <Aviso ic="info" texto={fraseDoErro(erro)} /> : null;

  /* ⚠️ SÓ EM DESENVOLVIMENTO: `?passo=entrando` mostra a espera parada, para
     o desenho ser visto sem entrar numa conta de verdade. */
  if (__DEV__ && passoDoLink === 'entrando') {
    return <EsperaDaConta titulo={K().titulo[porta]} frase={porta === 'cadastro' ? K().guardando : K().trazendo} />;
  }
  /* ⚠️ AS TRÊS TELAS INTERNAS DAQUI NÃO ENTRAM EM CASCATA (02/10/2026): a
     conta tem coreografia própria — a espera que sobe, a frase com o
     brilho, a roda que vira visto —, e uma cascata nos passos do meio
     seria uma segunda língua de movimento dentro do mesmo fluxo. Ver a
     fase 1 de docs/superpowers/specs/2026-10-02-motion-design.md. */
  if (passo === 'entrando' && erro) {
    return (
      <TelaInterna titulo={K().titulo[porta]} onVoltar={() => {}} semCascata>
        {erro ? (
          <View style={{ gap: 12, paddingTop: 40 }}>
            {aviso}
            {repetir.current ? (
              <Botao label={K().tentarDeNovo} onPress={() => { const r = repetir.current; limpar(); r?.(); }} />
            ) : null}
          </View>
        ) : null}
      </TelaInterna>
    );
  }
  if (passo === 'entrando') {
    return <EsperaDaConta titulo={K().titulo[porta]} frase={porta === 'cadastro' ? K().guardando : K().trazendo} />;
  }

  if (passo === 'dois-diarios' && dono) {
    const D = K().doisDiarios;
    return (
      <TelaInterna titulo={D.titulo} onVoltar={voltar} semCascata>
        <Titulao titulo={D.titulo} lead={D.lead} />
        {aviso}
        <Cartao>
          <Linha ic="arrowdown" titulo={D.daConta} sub={D.daContaSub} onPress={() => trazerDaConta(dono)} />
          <Linha ic="arrowup" titulo={D.desteTelefone} sub={D.desteTelefoneSub} onPress={() => setConfirmando(true)} />
        </Cartao>
        {confirmando ? (
          <Aviso ic="info" titulo={D.confirmar}>
            <View style={{ gap: 8, marginTop: 12 }}>
              <Botao label={D.confirmarSim} tom="perigo" onPress={() => ficarComEste(dono)} />
              <Botao label={D.cancelar} tom="fantasma" onPress={() => setConfirmando(false)} />
            </View>
          </Aviso>
        ) : null}
      </TelaInterna>
    );
  }

  if (passo === 'outra-conta') {
    const O = K().outraConta;
    return (
      <TelaInterna titulo={O.titulo} onVoltar={voltar} semCascata>
        <Titulao titulo={O.titulo} lead={O.lead} />
        <Cartao>
          <Linha ic="user" titulo={O.entrarComADona} onPress={voltar} />
          <Linha ic="reset" titulo={O.comecarDeNovo} onPress={() => setConfirmando(true)} />
        </Cartao>
        {confirmando ? (
          <Aviso ic="info" titulo={O.comecarPergunta}>
            <View style={{ gap: 8, marginTop: 12 }}>
              <Botao
                label={O.comecarSim}
                tom="perigo"
                onPress={async () => {
                  const m = sincronia();
                  const recomecar = async () => { await sair(); useStore.getState().reset(); };
                  if (m) await m.trocarDeDiario(recomecar);
                  else await recomecar();
                  router.replace('/cadastro' as any);
                }}
              />
              <Botao label={K().doisDiarios.cancelar} tom="fantasma" onPress={() => setConfirmando(false)} />
            </View>
          </Aviso>
        ) : null}
      </TelaInterna>
    );
  }

  /* O E-MAIL E O CÓDIGO SÃO PERGUNTAS DO CADASTRO, e têm o desenho delas
     (ver ui/pergunta): a resposta escrita na tela, sem caixa em volta, e
     o botão subindo com o teclado. A caixa de formulário existe para
     separar um campo dos outros, e aqui não há outros. */
  if (passo === 'email') {
    const valido = EMAIL.test(email.trim());
    return (
      <TelaDePergunta
        titulo={K().emailTitulo}
        lead={K().emailLead(DIGITOS_DO_CODIGO)}
        onVoltar={voltar}
        rodape={<Botao label={K().enviarCodigo} pilula desligado={!valido || ocupado} onPress={mandar} />}
      >
        <TextInput
          value={email}
          onChangeText={setEmail}
          onSubmitEditing={mandar}
          placeholder={K().emailCampo}
          placeholderTextColor={c.tx4}
          autoFocus
          autoCapitalize="none"
          autoCorrect={false}
          autoComplete="email"
          keyboardType="email-address"
          textContentType="emailAddress"
          inputMode="email"
          returnKeyType="send"
          /* Menor que o nome, que usa o tamanho de manchete: e-mail é
             comprido, e no tamanho do nome metade dele sumia para a
             esquerda antes do arroba. */
          style={[ty.display, SEM_ANEL, { color: c.tx, paddingVertical: 0, letterSpacing: -0.5 }]}
        />
        {email.length > 5 && !valido && !email.endsWith('@') ? (
          <Txt v="caption" c={c.tx3} style={{ marginTop: 12 }}>{K().emailIncompleto}</Txt>
        ) : null}
        {aviso ? <View style={{ marginTop: 20 }}>{aviso}</View> : null}
      </TelaDePergunta>
    );
  }

  if (passo === 'codigo') {
    const podeReenviar = espera <= 0 && !ocupado;
    const deNovo = erro === 'sem-internet' && repetir.current;
    return (
      /* ⚠️ SEM BOTÃO DE ENTRAR (26/09/2026, pedido do dono): o sexto número
         confere sozinho, e um "Entrar" depois disso só repetiria o que já
         aconteceu. O teclado abre junto com a tela. */
      <TelaDePergunta
        titulo={K().codigoTitulo}
        lead={K().codigoLead(email.trim(), VALIDADE_DO_CODIGO_MIN)}
        onVoltar={voltar}
        /* ⚠️ AS SAÍDAS FICAM NO PÉ, EM PÍLULA (27/09/2026, pedido do dono).
           Eram textos soltos logo abaixo das casas, e a espera do reenvio
           era uma frase cinza que se lia como aviso. Agora o reenviar é o
           botão principal, apagado com a contagem enquanto o servidor não
           aceita outro pedido — o número diz quando ele acende —, e trocar
           o e-mail é o fantasma embaixo. Sem internet, o principal vira
           "Tentar de novo". Os dois sobem com o teclado. */
        rodape={
          <View style={{ gap: 10 }}>
            <Botao
              pilula
              label={reenviando ? K().reenviando : deNovo ? K().tentarDeNovo : espera > 0 ? K().reenviarEm(espera) : K().reenviar}
              carregando={reenviando}
              desligado={ocupado || (!deNovo && !podeReenviar)}
              onPress={deNovo ? () => { const r = repetir.current; limpar(); r?.(); } : mandar}
            />
            <Botao
              pilula tom="fantasma" label={K().outroEmail}
              desligado={ocupado}
              onPress={() => { limpar(); setPasso('email'); }}
            />
          </View>
        }
      >
        <CasasDoCodigo
          valor={codigo}
          onMuda={(so) => {
            setCodigo(so);
            setNadaParaColar(false);
            /* Colado ou digitado até o fim, entra sozinho. */
            if (so.length === DIGITOS_DO_CODIGO) confirmar(so);
          }}
        />
        {/* COLAR O CÓDIGO (27/09/2026, pedido do dono): quem copiou o código
            do e-mail — ou o e-mail inteiro — cola com um toque, e o código
            confere sozinho. Some quando já há número digitado. */}
        {!codigo && (!ocupado || reenviando) ? (
          <View style={{ marginTop: 16, alignItems: 'flex-start', gap: 10 }}>
            <BotaoDeColar
              onTexto={(texto) => {
                const so = codigoNoTexto(texto);
                if (!so) return setNadaParaColar(true);
                setNadaParaColar(false);
                setCodigo(so);
                confirmar(so);
              }}
            />
            {nadaParaColar ? (
              <Txt v="caption" c={c.tx3}>{K().colarNada(DIGITOS_DO_CODIGO)}</Txt>
            ) : null}
          </View>
        ) : null}
        {aviso ? <View style={{ marginTop: 20 }}>{aviso}</View> : null}
        {/* Enquanto o código é conferido, a roda de espera: sem botão de
            entrar, é ela que diz que o sexto número foi ouvido. */}
        {ocupado && !reenviando ? <View style={{ marginTop: 28 }}><ActivityIndicator color={c.accent} /></View> : null}
      </TelaDePergunta>
    );
  }

  /* ---- a escolha ---- */
  return (
    <CapaDaConta
      /* No fim do cadastro, o título comemora com o primeiro nome; na sessão
         encerrada, chama por ele. Quem entra num celular novo ainda não tem. */
      titulo={porta === 'cadastro' ? K().tituloDoFim(primeiroNome)
        : porta === 'sessao' ? K().tituloDaSessao(primeiroNome)
        : K().titulo[porta]}
      lead={K().lead[porta]} onVoltar={voltar}
    >
      {aviso}
      {/* ⚠️ O BOTÃO DA APPLE É DESENHADO AQUI (ui/marcas), e não o do
          sistema: o do sistema calcula a letra pela altura, e na altura da
          pílula ela saía muito maior que a das outras portas (visto no
          iPhone em 09/10/2026). O desenho segue a diretriz da Apple para
          botão próprio — ver o alto de ui/marcas, porque a revisão da loja
          confere. A altura é a da pílula do app, para as portas empilhadas
          terem o mesmo tamanho.

          O GOOGLE VEM LOGO DEPOIS, com o "G" e as cores da marca (ui/marcas),
          e só onde ele abre: na build com o módulo nativo e com os IDs do
          Google Cloud (ver logic/conta). Fora do desenvolvimento, no Expo
          Go e sem os IDs, não há botão — ver `previaDasPortas`.

          E O E-MAIL LEVA O ENVELOPE, para as três portas terem um desenho
          à esquerda do texto, e não duas marcas e uma linha só de letra — e
          o contorno do Google, para as duas portas de linha serem iguais. */}
      {apple || previaDasPortas ? (
        <BotaoDaApple label={K().comApple} escuro={isDark} onPress={apple ? viaApple : () => setPrevia(true)} />
      ) : null}
      {google || previaDasPortas ? (
        <BotaoDoGoogle label={K().comGoogle} escuro={isDark} onPress={google ? viaGoogle : () => setPrevia(true)} />
      ) : null}
      <Botao
        label={K().comEmail} pilula icone="mail" contorno={contornoDaPorta(isDark)}
        tom={apple || google || previaDasPortas ? 'fantasma' : 'cheio'}
        onPress={() => { limpar(); setPrevia(false); setPasso('email'); }}
      />
      <Txt v="caption" c={previa ? c.tx2 : c.tx3} style={{ textAlign: 'center', marginTop: 6 }}>
        {previa ? K().previaSoNaBuild : K().semSenha}
      </Txt>
    </CapaDaConta>
  );
}

/* ------------------------------------------------------------------ */
/* A CAPA DA CONTA — a aurora no alto, as portas embaixo.

   ⚠️ O DESENHO VEIO DE UMA REFERÊNCIA DO DONO (26/09/2026): o alto da tela
   colorido, a frase no meio da cor, e as opções no claro. A cor é a
   aurora da paleta — a mesma da Home e da abertura do cadastro —, e não
   um degradê desenhado para cá: é ela que diz que isto é o Morphi, e ela
   troca junto quando a pessoa troca a paleta.

   ⚠️⚠️ A AURORA VIRA LUZ ANTES DE VIRAR PAPEL. Foram duas tentativas até
   aqui. A primeira desfazia a imagem direto no fundo claro e passava pelo
   cinza: o pé da aurora é azul-noite, e azul-noite misturado com branco
   é uma faixa suja. A segunda punha por cima a folha arredondada da Home,
   e o dono achou o corte seco — a referência não tem borda, tem uma luz
   que se abre no branco. Então, antes do fundo, entra a cor de ação
   clareada (a mesma "tinta" da névoa da rede): o escuro clareia na cor
   da paleta, e só então se desfaz no papel. No tema escuro não há luz a
   acender — o fundo já é escuro, e a aurora se desfaz direto nele.

   A FRASE FICA ACIMA DA LUZ. Letra branca na parte que clareia some no
   claro — então ela mora no trecho em que a aurora ainda é aurora.

   AS PORTAS FICAM EMBAIXO, perto do polegar. */
/* ------------------------------------------------------------------ */
function CapaDaConta({ titulo, lead, onVoltar, children }: {
  titulo: string; lead: string; onVoltar: () => void; children: React.ReactNode;
}) {
  const { c, isDark } = useTheme();
  const aurora = useAurora();
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  /* ⚠️ A CAPA É UMA IMAGEM SÓ, UMA PARA CADA TEMA (27/09/2026, imagens do
     dono): a aurora que se desfaz no branco puro, no claro, e a faixa de
     luz que se desfaz no preto puro, no escuro. O fundo da tela é o
     branco ou o preto em que ela termina, e não o fundo do app. As duas
     giram com a paleta, como as outras auroras (ui/aurora).

     ⚠️ E O TEXTO DESCEU PARA JUNTO DAS PORTAS (28/09/2026, pedido do dono,
     com referências). A frase centrada no alto deixava meia tela vazia
     entre ela e os botões, e o cartão de três pontos que tentou preencher
     isso virou lista. Agora a aurora fica com o alto inteiro, e embaixo,
     alinhados à esquerda, vêm o título e a frase, e logo as portas.

     O texto mora no papel, e não na luz: a imagem sobe até o branco (ou o
     preto) começar um pouco acima do título, medido depois de o texto se
     desenhar. O que sai pelo alto é a parte mais escura da aurora; até a
     medida chegar, a imagem espera invisível, para não dar um pulo. */
  const papel = isDark ? '#000000' : '#FFFFFF';
  const [topoDoTexto, setTopoDoTexto] = React.useState<number | null>(null);
  const alturaDaImagem = width * PROPORCAO_DA_CAPA;
  const papelNaImagem = alturaDaImagem * PAPEL_COMECA[isDark ? 'escuro' : 'claro'];
  const sobe = topoDoTexto == null ? 0 : Math.max(0, papelNaImagem - (topoDoTexto - 36));

  return (
    <View style={{ flex: 1, backgroundColor: papel }}>
      <Image
        source={isDark ? aurora.contaEscuro : aurora.contaClaro}
        style={{
          position: 'absolute', left: 0, width, top: -sobe, height: alturaDaImagem,
          opacity: topoDoTexto == null ? 0 : 1,
        }}
        contentFit="cover"
        contentPosition="top"
      />
      <View style={{ position: 'absolute', top: insets.top + 12, left: 16, zIndex: 1 }}>
        <Pressable onPress={onVoltar} hitSlop={14} style={({ pressed }) => [{ opacity: pressed ? 0.5 : 1 }]}>
          <Icon name="back" size={26} color={c.onHero} sw={2} />
        </Pressable>
      </View>

      <View style={{
        flex: 1, justifyContent: 'flex-end',
        paddingHorizontal: 24, paddingBottom: insets.bottom + 20, gap: 10,
      }}>
        <View
          onLayout={(e) => setTopoDoTexto(e.nativeEvent.layout.y)}
          /* SEM A MARCA (28/09/2026, pedido do dono): o M lima não se lia
             sobre o branco, e o título já abre a tela sozinho. */
          style={{ gap: 10, marginBottom: 22 }}
        >
          <Txt v="h1">{titulo}</Txt>
          <Txt v="note" c={c.tx2} style={{ lineHeight: 23 }}>{lead}</Txt>
        </View>
        {children}
      </View>
    </View>
  );
}

/* ------------------------------------------------------------------ */
/* A ESPERA DA CONTA — enquanto o diário desce da conta (ou sobe para ela).

   ⚠️ A MESMA LÍNGUA DA ESPERA DO PLANO (28/09/2026, pedido do dono: o
   carregador pequeno e cinza embaixo do cabeçalho estava feio). A luz em
   repouso no pé da tela, derivando devagar; no alto, o cumprimento e a
   frase da vez grande, com o brilho passando; a roda embaixo dela. Não
   há visto no fim: quem decide quando acaba é a sincronia, e a tela
   seguinte entra no lugar desta. As peças são as mesmas da espera do
   plano (ui/espera, ui/mancha). */
const REPOUSO = new Animated.Value(0);
function EsperaDaConta({ titulo, frase }: { titulo: string; frase: string }) {
  const { c } = useTheme();
  const insets = useSafeAreaInsets();
  const { width, height } = useWindowDimensions();
  const chega = React.useRef(new Animated.Value(0)).current;
  React.useEffect(() => {
    Animated.timing(chega, { toValue: 1, duration: 520, useNativeDriver: true }).start();
  }, []);
  const sobe = (de: number) => ({
    opacity: chega.interpolate({ inputRange: [de, Math.min(1, de + 0.6)], outputRange: [0, 1], extrapolate: 'clamp' }),
    transform: [{ translateY: chega.interpolate({ inputRange: [de, Math.min(1, de + 0.6)], outputRange: [16, 0], extrapolate: 'clamp' }) }],
  });
  return (
    <View style={{ flex: 1, backgroundColor: c.bg, overflow: 'hidden' }}>
      <ManchaDeLuz p={REPOUSO} largura={width} altura={height} papel={insets.top + PAPEL_DO_PLANO} viva />
      <View accessibilityLiveRegion="polite" style={{ paddingTop: insets.top + 72, paddingHorizontal: 28, gap: 14 }}>
        <Animated.View style={sobe(0)}>
          <Txt v="h1">{titulo}</Txt>
        </Animated.View>
        <Animated.View style={sobe(0.25)}>
          <Txt style={{ ...FASE_ATIVA, fontFamily: font.body, color: c.tx2 }}>{frase}</Txt>
          <BrilhoNoTexto texto={frase} estilo={{ ...FASE_ATIVA, fontFamily: font.body }} cor={c.tx4} />
        </Animated.View>
        <Animated.View style={[{ marginTop: 6 }, sobe(0.4)]}>
          <RodaQueViraVisto pronto={false} cor={c.accent} />
        </Animated.View>
      </View>
    </View>
  );
}

/* ------------------------------------------------------------------ */
/* O BOTÃO DE COLAR

   ⚠️ É O NOSSO EM TODO LUGAR (28/09/2026, pedido do dono). No iPhone era o
   botão do sistema (`ClipboardPasteButton`), que não pede licença para
   ler — o toque nele já é a permissão —, mas a palavra dele vem do
   idioma que o aplicativo declara, e no Expo Go ele dizia "Paste" numa
   tela toda em português. O preço do nosso: o iOS pergunta "Permitir
   colar?" quando o aplicativo lê a área de transferência sozinho, até a
   pessoa liberar nos ajustes. Vale pela palavra certa — e o código ainda
   chega sem colar, pela sugestão do teclado (`oneTimeCode`). */
function BotaoDeColar({ onTexto }: { onTexto: (texto: string) => void }) {
  const { c } = useTheme();
  return (
    <Pressable
      onPress={async () => onTexto(await Clipboard.getStringAsync().catch(() => ''))}
      accessibilityRole="button"
      hitSlop={10}
      /* Só o ícone e o texto, sem chip (pedido do dono), como as outras
         ações de texto da casa. */
      style={({ pressed }) => [{ flexDirection: 'row', alignItems: 'center', gap: 6, opacity: pressed ? 0.6 : 1 }]}
    >
      <Icon name="colar" size={16} color={c.accent} sw={2} />
      <Txt v="label" c={c.accent}>{K().colarCodigo}</Txt>
    </Pressable>
  );
}

/* ------------------------------------------------------------------ */
/* AS CASAS DO CÓDIGO — uma por número (26/09/2026, pedido do dono, com
   referência).

   ⚠️ QUEM RECEBE O QUE SE DIGITA É UM CAMPO SÓ, invisível, esticado por
   cima das casas; elas só desenham o que ele tem. Seis campos de verdade
   quebrariam o que o sistema faz sozinho: colar o código inteiro, o
   iPhone oferecer acima do teclado o código que chegou no e-mail, e o
   apagar voltar de casa em casa. Com um campo só, tudo isso continua
   dele — e o toque em qualquer casa cai nele.

   METADE E METADE, com um traço no meio: seis números seguidos se leem
   como um número só, e em duas metades o olho confere cada uma de uma
   vez.

   A CASA DA VEZ tem a borda da cor de ação e um cursor piscando: é onde o
   próximo número vai cair. Sem o campo em foco, nenhuma casa é da vez. */
/* ------------------------------------------------------------------ */
function CasasDoCodigo({ valor, onMuda }: { valor: string; onMuda: (so: string) => void }) {
  const { c } = useTheme();
  const [focado, setFocado] = React.useState(true);
  const pisca = React.useRef(new Animated.Value(1)).current;
  /* ⚠️ COM "REDUZIR MOVIMENTO", O CURSOR PARA ACESO (02/10/2026, fase 4 de
     docs/superpowers/specs/2026-10-02-motion-design.md). O laço piscava
     para sempre, para quem pediu ao sistema que nada piscasse; parado e
     aceso, ele continua dizendo onde o próximo número cai. */
  const menos = useMenosMovimento();
  React.useEffect(() => {
    if (menos) { pisca.setValue(1); return; }
    const laco = Animated.loop(Animated.sequence([
      Animated.timing(pisca, { toValue: 0, duration: 420, delay: 380, useNativeDriver: true }),
      Animated.timing(pisca, { toValue: 1, duration: 160, useNativeDriver: true }),
    ]));
    laco.start();
    return () => laco.stop();
  }, [pisca, menos]);

  const meio = Math.ceil(DIGITOS_DO_CODIGO / 2);
  const casa = (i: number) => {
    const n = valor[i];
    const daVez = focado && i === valor.length;
    return (
      <View
        key={i}
        style={{
          flex: 1, height: 58, borderRadius: radius.md,
          backgroundColor: c.bg1,
          borderWidth: daVez ? 2 : 1, borderColor: daVez ? c.accent : c.line,
          alignItems: 'center', justifyContent: 'center',
        }}
      >
        {n ? (
          <Txt style={{ fontFamily: font.body, fontSize: 28, lineHeight: 34 }}>{n}</Txt>
        ) : daVez ? (
          <Animated.View style={{ width: 2, height: 26, borderRadius: 1, backgroundColor: c.accent, opacity: pisca }} />
        ) : null}
      </View>
    );
  };

  return (
    <View>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
        {Array.from({ length: meio }, (_, i) => casa(i))}
        <View style={{ width: 10, height: 2, borderRadius: 1, backgroundColor: c.tx4 }} />
        {Array.from({ length: DIGITOS_DO_CODIGO - meio }, (_, i) => casa(meio + i))}
      </View>
      <TextInput
        value={valor}
        onChangeText={(v) => onMuda(v.replace(/\D/g, '').slice(0, DIGITOS_DO_CODIGO))}
        autoFocus
        onFocus={() => setFocado(true)}
        onBlur={() => setFocado(false)}
        keyboardType="number-pad"
        inputMode="numeric"
        textContentType="oneTimeCode"
        autoComplete={Platform.OS === 'android' ? 'sms-otp' : 'one-time-code'}
        maxLength={DIGITOS_DO_CODIGO}
        caretHidden
        selectionColor="transparent"
        accessibilityLabel={K().codigoTitulo}
        style={[StyleSheet.absoluteFill, SEM_ANEL, { color: 'transparent', opacity: 0 }]}
      />
    </View>
  );
}
