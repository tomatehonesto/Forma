import React from 'react';
import { ActivityIndicator, AppState, Platform, TextInput, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import * as AppleAuthentication from 'expo-apple-authentication';
import { useStore } from '../logic/store';
import { estadoVazio } from '../logic/seed';
import {
  DIGITOS_DO_CODIGO, ESPERA_PARA_REENVIAR_S, VALIDADE_DO_CODIGO_MIN,
  appleDisponivel, confirmarCodigo, contaTemDiario, entrarComApple, pedirCodigo, sair, sincronia,
  type ErroDaConta,
} from '../logic/conta';
import { TelaInterna, Titulao, Botao, Aviso, Cartao, Linha, SEM_ANEL } from '../ui/internas';
import { Txt } from '../ui/kit';
import { useTheme } from '../ui/useTheme';
import { ty, radius } from '../theme';
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
    await m?.trocarDeDiario(() => {
      useStore.getState().update((s: any) => {
        Object.assign(s, estadoVazio());
        s.conta = quem;
      });
    });
    /* Aqui não dá para entrar sem o diário: ele ainda não desceu. A tela
       diz, e oferece tentar de novo — e tenta sozinha na volta ao
       aplicativo. */
    if (!(await sincronizar())) return falhou('sem-internet', () => trazerDaConta(quem));
    /* Quem tem diário na conta já passou pelo cadastro — em outro
       aparelho. O portão não pode mandá-la responder tudo de novo. */
    update((s: any) => { s.onboardDone = true; });
    router.replace('/(tabs)' as any);
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

  if (passo === 'email') {
    const valido = EMAIL.test(email.trim());
    return (
      <TelaInterna
        titulo={K().emailTitulo}
        onVoltar={voltar}
        rodape={<Botao label={K().enviarCodigo} pilula desligado={!valido || ocupado} onPress={mandar} />}
      >
        <Titulao titulo={K().emailTitulo} lead={K().emailLead(DIGITOS_DO_CODIGO)} />
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
          style={[ty.body, SEM_ANEL, {
            color: c.tx, backgroundColor: c.bg1, borderWidth: 1, borderColor: c.line,
            borderRadius: radius.md, paddingHorizontal: 14, paddingVertical: 14,
          }]}
        />
        {email.length > 5 && !valido && !email.endsWith('@') ? (
          <Txt v="caption" c={c.tx3}>{K().emailIncompleto}</Txt>
        ) : null}
        {aviso}
      </TelaInterna>
    );
  }

  if (passo === 'codigo') {
    return (
      <TelaInterna
        titulo={K().codigoTitulo}
        onVoltar={voltar}
        rodape={<Botao label={K().entrar} pilula desligado={codigo.length !== DIGITOS_DO_CODIGO || ocupado} onPress={() => confirmar()} />}
      >
        <Titulao titulo={K().codigoTitulo} lead={K().codigoLead(email.trim(), VALIDADE_DO_CODIGO_MIN)} />
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
          style={[ty.display, SEM_ANEL, {
            color: c.tx, backgroundColor: c.bg1, borderWidth: 1, borderColor: c.line,
            borderRadius: radius.md, paddingHorizontal: 14, paddingVertical: 12,
            letterSpacing: 10, textAlign: 'center',
          }]}
        />
        {aviso}
        <View style={{ gap: 8 }}>
          <Botao
            label={espera > 0 ? K().reenviarEm(espera) : K().reenviar}
            tom="fantasma"
            desligado={espera > 0 || ocupado}
            onPress={mandar}
          />
          <Botao label={K().outroEmail} tom="fantasma" onPress={() => { limpar(); setPasso('email'); }} />
        </View>
      </TelaInterna>
    );
  }

  /* ---- a escolha ---- */
  return (
    <TelaInterna titulo={K().titulo[porta]} onVoltar={voltar}>
      <Titulao titulo={K().titulo[porta]} lead={K().lead[porta]} />
      {aviso}
      <View style={{ gap: 10 }}>
        {apple ? (
          <AppleAuthentication.AppleAuthenticationButton
            buttonType={AppleAuthentication.AppleAuthenticationButtonType.CONTINUE}
            buttonStyle={isDark ? AppleAuthentication.AppleAuthenticationButtonStyle.WHITE : AppleAuthentication.AppleAuthenticationButtonStyle.BLACK}
            cornerRadius={radius.pill}
            style={{ height: 56 }}
            onPress={viaApple}
          />
        ) : null}
        <Botao label={K().comEmail} pilula tom={apple ? 'fantasma' : 'cheio'} onPress={() => { limpar(); setPasso('email'); }} />
        <Txt v="caption" c={c.tx3} style={{ textAlign: 'center', marginTop: 4 }}>{K().semSenha}</Txt>
      </View>
    </TelaInterna>
  );
}
