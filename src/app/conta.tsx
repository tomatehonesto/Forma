import React from 'react';
import { ActivityIndicator, AppState, Platform, Pressable, StyleSheet, TextInput, View, useWindowDimensions } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import * as AppleAuthentication from 'expo-apple-authentication';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { setStatusBarStyle } from 'expo-status-bar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useStore } from '../logic/store';
import { estadoVazio } from '../logic/seed';
import {
  DIGITOS_DO_CODIGO, ESPERA_PARA_REENVIAR_S, VALIDADE_DO_CODIGO_MIN,
  appleDisponivel, atualizarVinculo, confirmarCodigo, contaTemDiario, entrarComApple, pedirCodigo, sair, sincronia,
  usarConvitePendente,
  type ErroDaConta,
} from '../logic/conta';
import { TelaInterna, Titulao, Botao, Aviso, Cartao, Linha, SEM_ANEL } from '../ui/internas';
import { Txt } from '../ui/kit';
import { Icon } from '../ui/Icon';
import { TelaDePergunta } from '../ui/pergunta';
import { useAurora } from '../ui/aurora';
import { useTheme } from '../ui/useTheme';
import { ty, radius, alfa } from '../theme';
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
  cancelado: '',
  outro: K().erro.outro,
}[e]);

export default function Conta() {
  const router = useRouter();
  const { c, isDark } = useTheme();
  const update = useStore((s) => s.update);
  const { de } = useLocalSearchParams<{ de?: string }>();
  const porta: Porta = de === 'abertura' || de === 'sessao' ? de : 'cadastro';

  const [passo, setPasso] = React.useState<Passo>('escolha');
  const [email, setEmail] = React.useState('');
  const [codigo, setCodigo] = React.useState('');
  const [erro, setErro] = React.useState<ErroDaConta | null>(null);
  const [ocupado, setOcupado] = React.useState(false);
  const [apple, setApple] = React.useState(false);
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
    setOcupado(true);
    limpar();
    const r = await pedirCodigo(email);
    setOcupado(false);
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
      return falhou(r.erro);
    }
    await entrou({ id: r.id, ...(r.email ? { email: r.email } : {}) });
  };

  const viaApple = async () => {
    limpar();
    const r = await entrarComApple();
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
    router.replace('/(tabs)' as any);
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
    router.replace('/(tabs)' as any);
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
      router.replace('/(tabs)' as any);
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
      else router.replace('/(tabs)' as any);
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
    else router.replace('/(tabs)' as any);
  };

  /* ---------------- a tela ---------------- */
  const aviso = erro ? <Aviso ic="info" texto={fraseDoErro(erro)} /> : null;

  if (passo === 'entrando') {
    return (
      <TelaInterna titulo={K().titulo[porta]} onVoltar={() => {}}>
        {erro ? (
          <View style={{ gap: 12, paddingTop: 40 }}>
            {aviso}
            {repetir.current ? (
              <Botao label={K().tentarDeNovo} onPress={() => { const r = repetir.current; limpar(); r?.(); }} />
            ) : null}
          </View>
        ) : (
          <View style={{ alignItems: 'center', gap: 16, paddingTop: 80 }}>
            <ActivityIndicator color={c.accent} />
            <Txt v="body" c={c.tx2}>{porta === 'cadastro' ? K().guardando : K().trazendo}</Txt>
          </View>
        )}
      </TelaInterna>
    );
  }

  if (passo === 'dois-diarios' && dono) {
    const D = K().doisDiarios;
    return (
      <TelaInterna titulo={D.titulo} onVoltar={voltar}>
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
      <TelaInterna titulo={O.titulo} onVoltar={voltar}>
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
    return (
      <TelaDePergunta
        titulo={K().codigoTitulo}
        lead={K().codigoLead(email.trim(), VALIDADE_DO_CODIGO_MIN)}
        onVoltar={voltar}
        rodape={<Botao label={K().entrar} pilula desligado={codigo.length !== DIGITOS_DO_CODIGO || ocupado} onPress={() => confirmar()} />}
      >
        <TextInput
          value={codigo}
          onChangeText={(v) => {
            const so = v.replace(/\D/g, '').slice(0, DIGITOS_DO_CODIGO);
            setCodigo(so);
            /* Colado ou digitado até o fim, entra sozinho. */
            if (so.length === DIGITOS_DO_CODIGO) confirmar(so);
          }}
          placeholder={'•'.repeat(DIGITOS_DO_CODIGO)}
          placeholderTextColor={c.tx4}
          autoFocus
          keyboardType="number-pad"
          inputMode="numeric"
          textContentType="oneTimeCode"
          autoComplete={Platform.OS === 'android' ? 'sms-otp' : 'one-time-code'}
          maxLength={DIGITOS_DO_CODIGO}
          style={[ty.hero, SEM_ANEL, { color: c.tx, paddingVertical: 0, letterSpacing: 12 }]}
        />
        {aviso ? <View style={{ marginTop: 20 }}>{aviso}</View> : null}
        {/* ⚠️ AS DUAS SAÍDAS SÃO TEXTO, e não botão. Eram dois botões do
            tamanho do principal, empilhados logo abaixo do código, e a
            tela parecia perguntar três coisas; o que ela pergunta é uma
            só. Reenviar e trocar o e-mail são a porta de quem teve um
            problema, e ficam do tamanho de uma porta lateral. */}
        <View style={{ gap: 18, marginTop: 32, alignItems: 'flex-start' }}>
          <Pressable
            onPress={podeReenviar ? mandar : undefined}
            hitSlop={10}
            style={({ pressed }) => [{ opacity: pressed && podeReenviar ? 0.6 : 1 }]}
          >
            <Txt v="label" c={podeReenviar ? c.accent : c.tx4}>
              {espera > 0 ? K().reenviarEm(espera) : K().reenviar}
            </Txt>
          </Pressable>
          <Pressable
            onPress={() => { limpar(); setPasso('email'); }}
            hitSlop={10}
            style={({ pressed }) => [{ opacity: pressed ? 0.6 : 1 }]}
          >
            <Txt v="label" c={c.accent}>{K().outroEmail}</Txt>
          </Pressable>
        </View>
      </TelaDePergunta>
    );
  }

  /* ---- a escolha ---- */
  return (
    <CapaDaConta titulo={K().titulo[porta]} lead={K().lead[porta]} onVoltar={voltar}>
      {aviso}
      {/* ⚠️ O BOTÃO DA APPLE É O DELA, e não um desenhado aqui: a revisão
          da loja confere o desenho do "Continuar com a Apple", e o botão
          do sistema já sai certo em qualquer idioma. A altura é a da
          pílula do app, para as portas empilhadas terem o mesmo tamanho.

          O GOOGLE ENTRA AQUI, com o mesmo desenho do e-mail, quando a
          entrada dele existir (fase 5 do plano do Supabase). Até lá, sem
          botão: porta que não abre é pior que porta nenhuma. */}
      {apple ? (
        <AppleAuthentication.AppleAuthenticationButton
          buttonType={AppleAuthentication.AppleAuthenticationButtonType.CONTINUE}
          buttonStyle={isDark ? AppleAuthentication.AppleAuthenticationButtonStyle.WHITE : AppleAuthentication.AppleAuthenticationButtonStyle.BLACK}
          cornerRadius={radius.pill}
          style={{ height: 64 }}
          onPress={viaApple}
        />
      ) : null}
      <Botao label={K().comEmail} pilula tom={apple ? 'fantasma' : 'cheio'} onPress={() => { limpar(); setPasso('email'); }} />
      <Txt v="caption" c={c.tx3} style={{ textAlign: 'center', marginTop: 6 }}>{K().semSenha}</Txt>
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

   ⚠️ A FOLHA CLARA SOBE POR CIMA DA AURORA, como na Home, e a aurora não
   se desfaz no fundo. Desfeita, ela passava pelo cinza: o pé da imagem é
   azul-noite, e azul-noite misturado com o fundo claro é uma faixa suja
   no meio da tela. A folha arredondada é o jeito que o aplicativo já tem
   de pôr o claro sobre a aurora, e os cantos só aparecem porque ela sobe
   por cima da imagem — por isso o `SOBE`.

   AS PORTAS FICAM EMBAIXO, perto do polegar. A folha tem uma altura
   mínima para a aurora não tomar a tela inteira onde há uma porta só, e
   a sobra de altura é da aurora: é ela que a tela tem para mostrar. */
/* ------------------------------------------------------------------ */
const SOBE = radius.lg;

function CapaDaConta({ titulo, lead, onVoltar, children }: {
  titulo: string; lead: string; onVoltar: () => void; children: React.ReactNode;
}) {
  const { c } = useTheme();
  const aurora = useAurora();
  const insets = useSafeAreaInsets();
  const { height } = useWindowDimensions();

  return (
    <View style={{ flex: 1, backgroundColor: c.veu }}>
      <View style={{ flex: 1 }}>
        <Image source={aurora.hero} style={StyleSheet.absoluteFill} contentFit="cover" contentPosition="top" />
        {/* O VÉU: mais pesado no alto, onde moram a seta e o relógio em
            corpo pequeno, e mais leve onde a frase está. */}
        <LinearGradient
          colors={[alfa(c.veu, 0.6), alfa(c.veu, 0.28)]}
          style={StyleSheet.absoluteFill}
          pointerEvents="none"
        />

        <View style={{ position: 'absolute', top: insets.top + 12, left: 16, zIndex: 1 }}>
          <Pressable onPress={onVoltar} hitSlop={14} style={({ pressed }) => [{ opacity: pressed ? 0.5 : 1 }]}>
            <Icon name="back" size={26} color={c.onHero} sw={2} />
          </Pressable>
        </View>

        <View style={{
          flex: 1, paddingHorizontal: 28,
          paddingTop: insets.top + 48, paddingBottom: SOBE + 24,
          alignItems: 'center', justifyContent: 'center', gap: 12,
        }}>
          <Txt v="h1" c={c.onHero} style={{ textAlign: 'center' }}>{titulo}</Txt>
          <Txt v="note" c={c.onHero2} style={{ textAlign: 'center', lineHeight: 23 }}>{lead}</Txt>
        </View>
      </View>

      <View style={{
        backgroundColor: c.bg,
        borderTopLeftRadius: radius.lg, borderTopRightRadius: radius.lg,
        marginTop: -SOBE, minHeight: Math.round(height * 0.4),
        paddingTop: 28, paddingHorizontal: 20, paddingBottom: insets.bottom + 20,
        justifyContent: 'flex-end', gap: 10,
      }}>
        {children}
      </View>
    </View>
  );
}
