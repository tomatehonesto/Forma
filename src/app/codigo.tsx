import React from 'react';
import { View, TextInput, Pressable, Keyboard, StyleSheet, Linking } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Image } from 'expo-image';
import { useStore } from '../logic/store';
import {
  normalizarConvite, vinculoDoConvite, assinaturaAtual, GESTAO_NA_LOJA, NOME_DA_LOJA,
} from '../logic/assinatura';
import { contaLigada } from '../logic/nuvem';
import { VERSAO_DO_COMPARTILHAMENTO, oQueAEquipeVe } from '../logic/compartilhamento';
import {
  conferirConvite, gravarConviteDaRede, gravarVinculo, usarConvite, codigosDeExemplo,
  especialidadesDaClinica, nomeDaEspecialidade, registroTxt,
  type ConviteDaRede,
} from '../logic/rede';
import { SheetScreen, Txt, Row } from '../ui/kit';
import { Botao } from '../ui/internas';
import { fotoDaRede, focoDaRede, imagensDaRede, iniciaisDaClinica, inicialDoNome } from '../ui/retratos';
import { useTheme } from '../ui/useTheme';
import { ty, radius } from '../theme';

import { T } from '../textos';

const P = () => T.assinatura.parceiros;
const K = () => T.assinatura.codigo;

/* ============================================================
   O CÓDIGO DE CONVITE — a folha

   ⚠️ ELE JÁ FOI UM CAMPO DENTRO DA BARRA DE PLANOS, e o problema não era
   o campo: era onde ele abria. A barra é a área de decisão, ancorada no
   pé da tela, e o teclado sobe exatamente por cima dela — a pessoa
   digitava com o botão de assinar encostado no dedo e o preço sumindo
   atrás do teclado. Duas ações do mesmo tamanho no mesmo lugar.

   Numa folha, o código tem a tela inteira por um instante: o teclado
   empurra a folha em vez de cobrir o que importa, e fechar devolve a
   pessoa exatamente onde ela estava.

   ⚠️ E ELA SEGUE O TEMA DO APARELHO, mesmo abrindo por cima do paywall,
   que é escuro à força. Chegou a ser escura junto com ele, e a conta não
   fechou: esta folha também abre pelo Perfil, no meio do aplicativo, e
   ali o escuro seria a folha desobedecendo ao que a pessoa escolheu no
   telefone. Entre uma emenda de cor por um segundo e uma tela que ignora
   a preferência dela, a emenda é o preço mais barato.

   ⚠️ E ELA NÃO EXPLICA A PARCERIA. Quem chega aqui já tem o código na
   mão; a explicação do que o vínculo muda mora na apresentação da rede e
   em /parceiros, que são para quem ainda não tem. Uma folha que ensina
   antes de deixar digitar é a mesma fricção que tirar o campo do lugar.

   ⚠️ E CONFIRMAR CONFERE, QUANDO HÁ COMO. Com o portal — hoje, a lista
   de exemplo —, o código é perguntado antes de ligar, e a folha mostra de
   quem ele é: a clínica e quem atende, com "Conectar" e "Não é essa
   clínica". Um erro de digitação que caísse no código de outra clínica
   ligaria a pessoa a uma equipe que não é a dela; com os dois nomes na
   tela, ela percebe antes. Sem portal, não há a quem perguntar, e
   confirmar liga na hora, como sempre ligou — o porquê de não esperar a
   clínica está em assinatura.ts, em `vinculoDoConvite`.

   ⚠️ E QUEM JÁ PAGA PELA LOJA GANHA UM TERCEIRO PASSO. Conectar isenta,
   mas a assinatura na loja continua cobrando até a pessoa cancelar lá —
   a Apple não deixa ninguém cancelar por ela. Então, conectada, a folha
   diz que o vínculo já garante o acesso e oferece a gestão de
   assinaturas da loja; "Fazer isso depois" fecha, e a tela de Assinatura
   continua avisando. Sem cobrança ligada, `assinaturaAtual` devolve nulo
   e o passo não aparece — em desenvolvimento, `?assinante=1` finge um
   assinante, como na tela de Assinatura.

   ⚠️ E DE ONDE ELA ABRIU MUDA O FIM. Pelo paywall ou pelo Perfil, fechar
   devolve a pessoa onde ela estava, e é a própria tela que diz que foi
   resolvido. Pela rede (`?de=rede`), voltar para a vitrine não diria
   nada: a pessoa acabou de ganhar uma equipe, e a vitrine é para quem
   procura uma. Ela volta para as abas, e a equipe está na aba Cuidado.
   ============================================================ */

type Etapa = { tipo: 'codigo' } | { tipo: 'conferir'; convite: ConviteDaRede } | { tipo: 'assinatura' };

export default function Codigo() {
  const S = useStore((s) => s.S);
  const update = useStore((s) => s.update);
  const router = useRouter();
  const { c } = useTheme();
  const { de, assinante } = useLocalSearchParams<{ de?: string; assinante?: string }>();
  /* Quem paga pela loja: a costura que vai ler o recibo, e a mesma porta
     de desenvolvimento da tela de Assinatura (`?assinante=1`), que não
     escreve nada — só finge, no desenho, que há uma assinatura. */
  const pagando = !!assinaturaAtual(S) || (__DEV__ && assinante === '1');

  /* ⚠️ O CAMPO NASCE COM O QUE JÁ EXISTE, e o vínculo é a segunda fonte
     porque a primeira pode estar vazia: quem chegou com o vínculo pronto
     — a semente, e quem vier de uma migração — tem `vinculo.convite` e não
     tem `profile.convite`. Lendo só o primeiro, a folha abria em branco
     para quem tem código, e quem veio TROCAR de clínica não tinha como
     saber qual era o atual. */
  const vinculo = (S.profile as any).vinculo as { convite?: string } | null;
  const guardado = ((S.profile as any).convite as string) || vinculo?.convite || '';
  const [codigo, setCodigo] = React.useState(guardado);
  const limpo = normalizarConvite(codigo);
  const vale = limpo.length >= 4;
  /* ⚠️ O AVISO ESPERA O DEDO SAIR DO CAMPO.

     Ele aparecia na primeira tecla, e quem digita um código de oito
     letras passava pelo "faltam caracteres" quatro vezes antes de chegar
     ao fim — o aplicativo reclamando de alguém que está no meio da
     palavra. Um aviso que nasce enquanto a pessoa ainda escreve não é
     ajuda, é interrupção.

     Fora do foco, a frase vale: ela parou, e o que ela parou não serve. */
  const [focado, setFocado] = React.useState(true);
  const [etapa, setEtapa] = React.useState<Etapa>({ tipo: 'codigo' });
  const [conferindo, setConferindo] = React.useState(false);
  const [naoAchou, setNaoAchou] = React.useState(false);
  /* o que deu errado ao conferir ou ao conectar, quando não é "não achamos" */
  const [aviso, setAviso] = React.useState<string | null>(null);

  const concluir = () => {
    if (de !== 'rede') { router.back(); return; }
    if (router.canDismiss()) router.dismissAll();
    else router.replace('/cuidado' as any);
  };

  /* O mesmo código de agora não muda nada — e religar zeraria o "desde"
     do vínculo, que a tela da clínica mostra. */
  const jaLigado = !!vinculo && vinculo.convite === limpo;

  /* A normalização é a de assinatura.ts, e não uma cópia: "abc123 " e
     "ABC123" precisam virar o mesmo convite em todas as telas que o
     pedem.

     ⚠️ E FECHAR A FOLHA É A CONFIRMAÇÃO, sem tela de parabéns no meio. A
     pessoa volta para onde a folha abriu, e é a própria tela de lá que diz
     que deu certo: o paywall deixa de pedir dinheiro, e a aba Cuidado
     mostra a equipe. */
  const confirmar = async () => {
    if (jaLigado) { router.back(); return; }
    setNaoAchou(false);
    setConferindo(true);
    const r = await conferirConvite(limpo);
    setConferindo(false);
    if (r.tipo === 'achou') {
      Keyboard.dismiss();
      setEtapa({ tipo: 'conferir', convite: r.convite });
      return;
    }
    if (r.tipo === 'nao-achou') { setNaoAchou(true); return; }
    if (r.tipo === 'sem-internet') { setAviso(T.rede.vinculo.semInternet); return; }
    update((st: any) => {
      st.profile.convite = limpo;
      st.profile.vinculo = vinculoDoConvite(limpo);
    });
    depoisDeConectar();
  };

  /* ⚠️ CONECTAR É ACEITAR O COMPARTILHAMENTO que a etapa de cima lista
     (logic/compartilhamento), e o vínculo nasce no servidor, com a versão
     desse texto (`usar_convite`). A cópia no aparelho sai da resposta.

     Três caminhos, conforme o diário:
       - com dono e sessão: liga na hora;
       - sem dono (o caminho do cadastro, antes da conta): o código e a
         versão ficam guardados, a clínica ainda não aparece como
         conectada — ela liga quando a conta nascer (logic/conta) —, e a
         pessoa segue direto para criar a conta;
       - com dono e a sessão caída: guarda do mesmo jeito, e pede para
         entrar de novo.
     Sem a conta ligada (uma build sem as variáveis do projeto), o código liga no
     aparelho, como sempre ligou. */
  const conectar = async (v: ConviteDaRede) => {
    if (!contaLigada()) {
      update((st) => { gravarConviteDaRede(st, v); });
      depoisDeConectar();
      return;
    }
    const pendente = { codigo: v.codigo, versao: VERSAO_DO_COMPARTILHAMENTO };
    /* ⚠️ SEM CONTA, O PASSO SEGUINTE É A CONTA (26/09/2026, pedido do
       dono). Quem chega aqui sem dono está no fim do cadastro, e o código
       só vira vínculo quando a conta nascer. Voltar para os planos
       mostrava de novo a tela de preço, e dali a única saída era o X do
       canto — que lê como "fechar", e não como "seguir". A folha fecha e
       os planos dão lugar à conta: é para lá que a pessoa ia de qualquer
       jeito, e a clínica liga no instante em que ela entrar. */
    if (!(S as any).conta) {
      update((st: any) => { st.convitePendente = pendente; st.profile.convite = v.codigo; });
      if (router.canGoBack()) router.back();
      router.replace('/conta?de=cadastro' as any);
      return;
    }
    setAviso(null);
    setConferindo(true);
    const r = await usarConvite(v.codigo, VERSAO_DO_COMPARTILHAMENTO);
    setConferindo(false);
    if (r.ok) {
      update((st: any) => { gravarVinculo(st, r.vinculo); st.convitePendente = null; });
      depoisDeConectar();
      return;
    }
    if (r.erro === 'sem-sessao') {
      update((st: any) => { st.convitePendente = pendente; });
      router.replace('/conta?de=sessao' as any);
      return;
    }
    setAviso(r.erro === 'sem-internet' ? T.rede.vinculo.semInternet : T.rede.vinculo.naoValeuAgora);
  };

  /* Conectada, quem paga pela loja ainda ouve que pode cancelar; quem não
     paga sai direto. */
  const depoisDeConectar = () => {
    if (pagando) { Keyboard.dismiss(); setEtapa({ tipo: 'assinatura' }); return; }
    concluir();
  };

  /* ---- conectada, e ainda pagando pela loja ----
     A clínica já está ligada quando esta etapa aparece: fechar por
     qualquer caminho é o mesmo que "Fazer isso depois". */
  if (etapa.tipo === 'assinatura') {
    return (
      <SheetScreen
        titulo={K().cancelarTitulo}
        onClose={concluir}
        rodape={
          <View>
            {/* Cancelar é na loja, e não aqui (ver GESTAO_NA_LOJA, em
                logic/assinatura). A folha fecha junto: a pessoa volta da
                loja já com a clínica conectada. */}
            <Botao
              label={K().cancelarNaLoja(NOME_DA_LOJA)}
              onPress={() => { Linking.openURL(GESTAO_NA_LOJA).catch(() => {}); concluir(); }}
            />
            <Pressable
              onPress={concluir}
              style={({ pressed }) => [{ alignItems: 'center', paddingTop: 14, paddingBottom: 2, opacity: pressed ? 0.6 : 1 }]}
            >
              <Txt v="label" c={c.accent}>{K().depois}</Txt>
            </Pressable>
          </View>
        }
      >
        <Txt v="note" c={c.tx2} style={{ marginTop: 10, lineHeight: 24 }}>{K().cancelarTexto(NOME_DA_LOJA)}</Txt>
      </SheetScreen>
    );
  }

  /* ---- a conferência: de quem é o código ---- */
  if (etapa.tipo === 'conferir') {
    const v = etapa.convite;
    return (
      <SheetScreen
        titulo={K().conferirTitulo}
        sub={K().conferirSub}
        onClose={() => router.back()}
        rodape={
          <View>
            <Botao label={conferindo ? K().conferindo : K().conectar} desligado={conferindo} onPress={() => conectar(v)} />
            {/* Volta ao campo com o código ainda escrito: o erro mais
                provável é uma letra, e não o código inteiro. */}
            <Pressable
              onPress={() => setEtapa({ tipo: 'codigo' })}
              style={({ pressed }) => [{ alignItems: 'center', paddingTop: 14, paddingBottom: 2, opacity: pressed ? 0.6 : 1 }]}
            >
              <Txt v="label" c={c.accent}>{K().naoEEssa}</Txt>
            </Pressable>
          </View>
        }
      >
        <CartaoDoConvite v={v} />
        {contaLigada() ? <OQueAClinicaVe /> : (
          <Txt v="caption" c={c.tx3} style={{ marginTop: 14, lineHeight: 20 }}>{K().conectarTexto}</Txt>
        )}
        {aviso ? <Txt v="caption" c={c.cta} style={{ marginTop: 12, lineHeight: 20 }}>{aviso}</Txt> : null}
      </SheetScreen>
    );
  }

  const exemplos = codigosDeExemplo();

  return (
    <SheetScreen
      titulo={P().codigoRotulo}
      sub={P().codigoSub}
      onClose={() => router.back()}
      rodape={
        <Botao
          label={conferindo ? K().conferindo : P().confirmar}
          onPress={confirmar}
          desligado={!vale || conferindo}
        />
      }
    >
      {/* ⚠️ O CAMPO SÓ VESTE O CORPO GRANDE QUANDO EXISTE O QUE VESTIR, e
          isso não é enfeite: no React Native o texto de exemplo não tem
          estilo próprio, ele herda o do campo. Com o corpo do código —
          grande, seminegrito, com dois pontos de rastro entre as letras —
          um simples "Digite o código" saía espaçado e duro, parecendo já
          um código digitado em vez de um convite para digitar.

          A altura é fixa nos dois estados, senão a folha daria um pulo na
          primeira tecla. */}
      <TextInput
        value={codigo}
        onChangeText={(v) => { setCodigo(v.toUpperCase()); setNaoAchou(false); setAviso(null); }}
        placeholder={P().digite}
        placeholderTextColor={c.tx4}
        autoFocus
        onFocus={() => setFocado(true)}
        onBlur={() => setFocado(false)}
        autoCapitalize="characters"
        autoCorrect={false}
        autoComplete="off"
        /* Um convite não é senha nem nome próprio: sem sugestão do
           teclado, sem corretor, e com teto — um campo sem limite aceita
           um parágrafo colado sem avisar que aquilo não é um código. */
        maxLength={24}
        /* outlineStyle é do react-native-web: sem ele o navegador desenha
           o anel de foco dele por cima da borda desenhada aqui. No
           aparelho não existe e não custa nada. */
        style={[
          codigo ? ty.h2 : ty.body,
          { outlineStyle: 'none' } as any,
          {
            marginTop: 18, height: 62, letterSpacing: codigo ? 2 : 0,
            color: c.tx, backgroundColor: c.bg1,
            borderWidth: 1, borderColor: naoAchou ? c.ctaLine : vale ? c.accentLine : c.line,
            borderRadius: radius.lg, paddingHorizontal: 18,
          },
        ]}
      />

      {/* ⚠️ O PISO DE QUATRO É DESTE CAMPO, E A FRASE DIZ ISSO. Ninguém
          aqui sabe como são os códigos da rede — o portal ainda não
          existe —, então prometer "os códigos têm quatro letras" seria
          inventar uma regra alheia. O que se pode afirmar é o que este
          campo faz.

          E ela espera o campo perder o foco, além de precisar de algo
          escrito: nascer com um aviso de erro é repreender quem não fez
          nada, e aparecer no meio da digitação é repreender quem está
          fazendo. */}
      {!focado && codigo.length > 0 && !vale ? (
        <Txt v="micro" c={c.tx4} style={{ marginTop: 8 }}>{K().minimo}</Txt>
      ) : null}

      {/* ⚠️ "NÃO ENCONTRAMOS" SÓ APARECE QUANDO HOUVE A QUEM PERGUNTAR —
          ver `conferirConvite`. E ele diz o que fazer, e não só o que deu
          errado: quem tem o código é a clínica. */}
      {naoAchou ? (
        <Txt v="caption" c={c.cta} style={{ marginTop: 8, lineHeight: 20 }}>{K().naoAchou}</Txt>
      ) : null}
      {aviso ? (
        <Txt v="caption" c={c.cta} style={{ marginTop: 8, lineHeight: 20 }}>{aviso}</Txt>
      ) : null}

      {/* ⚠️ DUAS FRASES, E CADA UMA RESPONDE UM MEDO DIFERENTE.

          A primeira é "vou ter que esperar?", que é a pergunta de quem
          digita um código à noite. A segunda é a regra da casa, e ela
          precisa estar dita AQUI: mudar de clínica, ou entrar numa, é
          exatamente o momento em que um aplicativo se sente autorizado a
          "começar do zero com a equipe". Não começa. Peso, aplicações,
          check-ins, sintomas, exames e fotos são dela, e ela chegou com
          eles.

          Duas frases anteriores morreram nesta linha: "o código fica
          guardado com você", que soava a consolo, e "quem confirma é a
          clínica", que mandava esperar quem não tinha o que esperar. */}
      <Txt v="caption" c={c.tx3} style={{ marginTop: 14, lineHeight: 20 }}>{K().liberaNaHora}</Txt>

      {/* Os códigos inventados, só com a lista de exemplo — sem eles não
          havia como ver a conferência sem abrir o código-fonte. */}
      {exemplos.length ? (
        <Txt v="micro" c={c.tx4} style={{ marginTop: 10, lineHeight: 17 }}>{K().exemplo(exemplos.join(', '))}</Txt>
      ) : null}
    </SheetScreen>
  );
}

/* ------------------------------------------------------------------
   O QUE A CLÍNICA PASSA A VER — o consentimento de compartilhar

   ⚠️ A LISTA NÃO É ESCRITA AQUI: sai de logic/compartilhamento, que a
   tira da tabela de tradução. E as quatro frases dizem o que a lista não
   diz sozinha: que entra o que veio antes, que as perguntas ao Morphi não
   entram, que dura enquanto a conexão durar, e que o prontuário fica.
------------------------------------------------------------------ */
function OQueAClinicaVe() {
  const { c } = useTheme();
  const V = T.rede.vinculo;
  return (
    <View style={{ marginTop: 18, gap: 8 }}>
      <Txt v="bodyMed">{V.titulo}</Txt>
      <View style={{ gap: 4 }}>
        {oQueAEquipeVe().map((item) => (
          <Row key={item} gap={8} style={{ alignItems: 'flex-start' }}>
            <Txt v="caption" c={c.tx3}>•</Txt>
            <Txt v="caption" c={c.tx2} style={{ flex: 1, lineHeight: 20 }}>{item}</Txt>
          </Row>
        ))}
      </View>
      {[V.antes, V.perguntas, V.dura, V.guarda].map((f) => (
        <Txt key={f} v="caption" c={c.tx3} style={{ lineHeight: 20 }}>{f}</Txt>
      ))}
      <Txt v="caption" c={c.tx2} style={{ lineHeight: 20, marginTop: 4 }}>{V.aceitar}</Txt>
    </View>
  );
}

/* ------------------------------------------------------------------
   DE QUEM É O CÓDIGO — a clínica e quem atende

   ⚠️ OS DOIS NOMES SÃO A CONFERÊNCIA. A pessoa sabe em qual clínica se
   consultou e com quem; é batendo esses dois nomes que ela percebe um
   código digitado errado. O registro vai junto, porque é o que distingue
   duas pessoas de mesmo nome — e é o mesmo que a vitrine mostra.
------------------------------------------------------------------ */
function CartaoDoConvite({ v }: { v: ConviteDaRede }) {
  const { c } = useTheme();
  const { clinica: cl, profissional: p } = v;
  const fotoDaClinica = imagensDaRede(cl).foto;
  const rosto = fotoDaRede(p);
  const onde = [cl.bairro ? `${cl.bairro}, ${cl.cidade}` : cl.cidade, cl.presencial ? null : T.rede.soTeleconsulta]
    .filter(Boolean)
    .join(' · ');

  return (
    <View style={{
      marginTop: 18, backgroundColor: c.bg1, borderRadius: radius.lg,
      borderWidth: 1, borderColor: c.line, overflow: 'hidden',
    }}>
      <Row gap={14} style={{ padding: 16 }}>
        <View style={{
          width: 56, height: 56, borderRadius: radius.md, overflow: 'hidden',
          backgroundColor: c.accentWeak, alignItems: 'center', justifyContent: 'center',
        }}>
          {fotoDaClinica ? (
            <Image source={fotoDaClinica} style={StyleSheet.absoluteFill} contentFit="cover" />
          ) : (
            <Txt v="label" c={c.accent}>{iniciaisDaClinica(cl.nome)}</Txt>
          )}
        </View>
        <View style={{ flex: 1 }}>
          <Txt v="bodyMed">{cl.nome}</Txt>
          <Txt v="caption" c={c.tx2} style={{ marginTop: 2 }}>{especialidadesDaClinica(cl)}</Txt>
          {onde ? <Txt v="micro" c={c.tx3} style={{ marginTop: 3 }}>{onde}</Txt> : null}
        </View>
      </Row>

      <View style={{ height: StyleSheet.hairlineWidth, backgroundColor: c.line }} />

      <Row gap={14} style={{ padding: 16 }}>
        <View style={{ width: 56, alignItems: 'center' }}>
          <View style={{
            width: 44, height: 44, borderRadius: 22, overflow: 'hidden',
            backgroundColor: c.accentWeak, alignItems: 'center', justifyContent: 'center',
          }}>
            {rosto ? (
              <Image source={rosto} style={{ width: 44, height: 44 }} contentFit="cover" contentPosition={focoDaRede(p)} />
            ) : (
              <Txt v="label" c={c.accent}>{inicialDoNome(p.nome)}</Txt>
            )}
          </View>
        </View>
        <View style={{ flex: 1 }}>
          <Txt v="bodyMed">{p.nome}</Txt>
          <Txt v="caption" c={c.tx2} style={{ marginTop: 2 }}>{p.especialidades.map(nomeDaEspecialidade).join(' · ')}</Txt>
          <Txt v="micro" c={c.tx3} style={{ marginTop: 3 }}>{registroTxt(p)}</Txt>
        </View>
      </Row>
    </View>
  );
}
