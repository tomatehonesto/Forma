import React from 'react';
import {
  View, Pressable, Animated, Easing, AppState, AccessibilityInfo, StyleSheet, useWindowDimensions,
  type StyleProp, type ViewStyle,
} from 'react-native';
import { useRouter, useIsFocused } from 'expo-router';
import { useStore } from '../logic/store';
import { estadoDaPermissao, pedirPermissao, reagendar, type Permissao } from '../logic/avisos';
import { aparelhoDaVez } from '../logic/integracoes';
import {
  passos, passosNaHome, passosParaReabrir, esconderPassos, concluirPassos, essencialPronto, type Passo,
} from '../logic/primeirosPassos';
import { Txt, Row } from './kit';
import { Icon } from './Icon';
import { useTheme } from './useTheme';
import { radius } from '../theme';
import { T } from '../textos';

/* ⚠️ É FUNÇÃO, e não constante de módulo: ela lê o catálogo, e constante
   de módulo congela o idioma no import. */
const K = () => T.home.primeirosPassos;

/* ============================================================
   OS PRIMEIROS PASSOS — o cartão da Home de quem acabou de chegar
   (docs/superpowers/specs/2026-09-26-primeiros-passos-design.md)

   A lista sai de logic/primeirosPassos; aqui mora o que é do aparelho —
   a permissão de aviso, que se lê de forma assíncrona e muda fora do app
   — e o desenho: as linhas, a comemoração e a saída.
   ============================================================ */

/* ⚠️ A PERMISSÃO É NULA ATÉ A PRIMEIRA LEITURA, e o cartão espera por ela.
   Desenhar antes seria abrir com os lembretes por fazer e trocar para o
   visto na frente da pessoa, quando a leitura chega dizendo que os avisos
   já estavam permitidos. Relê na volta ao aplicativo, que é quando ela pode ter
   mudado nos ajustes do sistema — o mesmo cuidado de app/lembretes. */
function usePassos() {
  const S = useStore((s) => s.S);
  const [permissao, setPermissao] = React.useState<Permissao | null>(null);
  React.useEffect(() => {
    let vivo = true;
    const ler = () => { estadoDaPermissao().then((p) => { if (vivo) setPermissao(p); }); };
    ler();
    const sub = AppState.addEventListener('change', (e) => { if (e === 'active') ler(); });
    return () => { vivo = false; sub.remove(); };
  }, []);
  const lista = permissao ? passos(S, { permissao, aparelho: aparelhoDaVez() }) : null;
  return { S, lista, permissao, setPermissao };
}

/** A linha do Perfil que reabre o cartão: os números dela, ou nulo quando ela não existe.

    Com o essencial cumprido enquanto o cartão estava escondido, a linha
    some: reabrir só para ver uma comemoração de algo que a pessoa fez sem
    o cartão seria ruído no Perfil. */
export function usePassosParaReabrir(): { feitos: number; total: number } | null {
  const { S, lista } = usePassos();
  if (!lista || !passosParaReabrir(S)) return null;
  const feitos = lista.filter((p) => p.pronto).length;
  return essencialPronto(lista) ? null : { feitos, total: lista.length };
}

const ESPERA_MS = 2000;       // quanto o "Tudo pronto!" fica à vista
const APAGA_MS = 260;
const RECOLHE_MS = 280;
/* O pé da janela que a barra de abas cobre, com folga: o que está atrás
   dela não conta como visto. */
const FAIXA_DAS_ABAS = 110;

export function PrimeirosPassos({ style }: { style?: StyleProp<ViewStyle> }) {
  const { c } = useTheme();
  const router = useRouter();
  const update = useStore((s) => s.update);
  const focada = useIsFocused();
  const { S, lista, permissao, setPermissao } = usePassos();

  const naHome = passosNaHome(S);
  /* O CARTÃO SE CONCLUI COM O ESSENCIAL, e não com todos: os opcionais (o
     aviso e o app de saúde) não seguram ninguém — ver logic/primeirosPassos.
     Com tudo feito, a comemoração diz "tudo"; com só o essencial, diz o
     essencial, e que o resto fica no Perfil. */
  const tudo = !!lista && essencialPronto(lista);
  const completo = !!lista && lista.every((p) => p.pronto);

  /* ⚠️ A BARRA E O "2 DE 5" SAÍRAM (decisão do dono, 26/09). Os vistos de
     cada linha já contam o progresso, e o canto de cima passou a ser o
     lugar de fechar — que ficava no pé, em texto pequeno, depois da lista
     inteira. */

  /* A SAÍDA — apaga e depois recolhe a altura, para o que vem embaixo
     subir sem salto. Serve às duas: a comemoração e o "esconder".

     ⚠️ A MARCA É GRAVADA NO FIM, e não no começo: quem sai do aplicativo
     no meio da animação reencontra o cartão na próxima abertura, em vez de
     perdê-lo sem ter visto. E com "reduzir movimento" não há animação —
     a marca vai direto. */
  const opacidade = React.useRef(new Animated.Value(1)).current;
  const recolhe = React.useRef(new Animated.Value(0)).current;
  const [altura, setAltura] = React.useState<number | null>(null);
  const [saindo, setSaindo] = React.useState(false);
  const sair = React.useCallback((marcar: () => void) => {
    AccessibilityInfo.isReduceMotionEnabled().then((reduzir) => {
      if (reduzir) { marcar(); return; }
      setSaindo(true);
      Animated.sequence([
        Animated.timing(opacidade, { toValue: 0, duration: APAGA_MS, easing: Easing.out(Easing.quad), useNativeDriver: false }),
        Animated.timing(recolhe, { toValue: 1, duration: RECOLHE_MS, easing: Easing.inOut(Easing.quad), useNativeDriver: false }),
      ]).start(({ finished }) => {
        if (!finished) return;
        marcar();
        /* A Home não desmonta: o cartão escondido e reaberto pelo Perfil
           é esta mesma instância, e precisa voltar inteiro. */
        opacidade.setValue(1);
        recolhe.setValue(0);
        setSaindo(false);
      });
    });
  }, []);

  /* A COMEMORAÇÃO ESPERA SER VISTA — e isso são duas esperas.

     A da Home em foco: os itens se cumprem em outras telas — a aplicação,
     o check-in, os aparelhos —, e a Home, que é aba, continua montada por
     baixo delas. Sem esperar o foco, os dois segundos passariam enquanto a
     pessoa ainda está na outra tela.

     E a do cartão na tela: ele mora abaixo da aurora, e quem volta para a
     Home chega no alto dela, com o cartão fora da vista. Por isso, só
     enquanto há comemoração pendente, o cartão confere onde está na
     janela; os dois segundos correm com o "Tudo pronto!" à vista e
     recomeçam se a pessoa rolar para longe antes do fim. */
  const celebra = React.useRef<View>(null);
  const { height: alturaDaJanela } = useWindowDimensions();
  const [vista, setVista] = React.useState(false);
  React.useEffect(() => {
    if (!tudo || !naHome || !focada || saindo) { setVista(false); return; }
    const olhar = () => celebra.current?.measureInWindow((_x, y, _w, h) => {
      const meio = y + h / 2;
      setVista(h > 0 && meio > 0 && meio < alturaDaJanela - FAIXA_DAS_ABAS);
    });
    olhar();
    const t = setInterval(olhar, 250);
    return () => clearInterval(t);
  }, [tudo, naHome, focada, saindo, alturaDaJanela]);
  React.useEffect(() => {
    if (!vista || saindo) return;
    const t = setTimeout(() => sair(() => update(concluirPassos)), ESPERA_MS);
    return () => clearTimeout(t);
  }, [vista, saindo]);

  if (!lista || !naHome) return null;

  /* ⚠️ OS LEMBRETES PEDEM A PERMISSÃO NO PRÓPRIO TOQUE. A regra de
     logic/avisos é pedir quando a pessoa quer o aviso, e "Permita os
     lembretes" é exatamente esse querer — o subtítulo acabou de dizer
     para quê. Levar para /lembretes seria mandá-la a uma lista em que o
     alerta da dose já aparece ligado e não há o que tocar.

     Negada, o sistema não pergunta mais; o toque seguinte leva a
     /lembretes, que mostra o caminho dos ajustes do aparelho. */
  const tocar = async (p: Passo) => {
    if (p.id === 'lembretes' && permissao === 'nao-perguntada') {
      const nova = await pedirPermissao();
      setPermissao(nova);
      if (nova === 'concedida') reagendar(useStore.getState().S);
      return;
    }
    if (p.to) router.navigate(p.to as any);
  };

  const recolhendo = saindo && altura != null ? {
    height: recolhe.interpolate({ inputRange: [0, 1], outputRange: [altura, 0] }),
    marginBottom: recolhe.interpolate({ inputRange: [0, 1], outputRange: [(StyleSheet.flatten(style)?.marginBottom as number) ?? 0, 0] }),
    overflow: 'hidden' as const,
  } : null;

  return (
    <Animated.View
      style={[style, { opacity: opacidade }, recolhendo]}
      onLayout={(e) => { if (!saindo) setAltura(e.nativeEvent.layout.height); }}
    >
      <Row style={{ justifyContent: 'space-between', alignItems: 'center' }}>
        <Txt v="h2">{K().titulo}</Txt>
        {/* "FECHAR", NO LUGAR DO LINK DE SEÇÃO: é onde a Home põe a ação de
            cada bloco. Não pede confirmação — o Perfil reabre. Some na
            comemoração, que se fecha sozinha. */}
        {!tudo ? (
          <Pressable
            onPress={() => sair(() => update(esconderPassos))}
            hitSlop={10}
            accessibilityRole="button"
            style={({ pressed }) => [{ opacity: pressed ? 0.6 : 1 }]}
          >
            <Txt v="label" c={c.accent2}>{K().fechar}</Txt>
          </Pressable>
        ) : null}
      </Row>

      <View style={{ backgroundColor: c.bg1, borderRadius: radius.lg, marginTop: 16, overflow: 'hidden' }}>
        {tudo ? (
          /* "TUDO PRONTO!" — o visto em lima, a cor do feito, como na
             confirmação que fecha um registro (ui/internas, Confirmacao). */
          <View
            ref={celebra}
            collapsable={false}
            style={{ alignItems: 'center', paddingVertical: 26, paddingHorizontal: 20, gap: 10 }}
            accessibilityLiveRegion="polite"
          >
            <View style={{ width: 52, height: 52, borderRadius: 26, backgroundColor: c.lime, alignItems: 'center', justifyContent: 'center' }}>
              <Icon name="check" size={24} color={c.limeInk} sw={2.6} />
            </View>
            <Txt v="h2" style={{ textAlign: 'center' }}>{completo ? K().tudoPronto : K().essencialPronto}</Txt>
            <Txt v="note" c={c.tx2} style={{ textAlign: 'center', maxWidth: 290 }}>
              {completo ? K().tudoProntoTexto : K().essencialProntoTexto}
            </Txt>
          </View>
        ) : (
          <>
            {lista.map((p, i) => (
              <View key={p.id}>
                {i > 0 ? <View style={{ height: StyleSheet.hairlineWidth, backgroundColor: c.line, marginLeft: 64 }} /> : null}
                <Linha p={p} onPress={p.pronto || !p.to ? undefined : () => tocar(p)} />
              </View>
            ))}
          </>
        )}
      </View>
    </Animated.View>
  );
}

/* UMA LINHA POR ITEM. O ícone é o assunto, e fica mesmo depois de
   cumprido; o que muda é o fim da linha — a seta vira o visto em lima — e
   o subtítulo, que sai: o porquê só serve a quem ainda vai fazer. O item
   cumprido fica na lista até o cartão sair, para a pessoa ver o que já
   fez, e não se toca de novo. */
function Linha({ p, onPress }: { p: Passo; onPress?: () => void }) {
  const { c } = useTheme();
  return (
    <Pressable
      onPress={onPress}
      disabled={!onPress}
      accessibilityRole={onPress ? 'button' : undefined}
      /* O visto é desenho, e o leitor de tela não o vê: o item cumprido
         diz "feito" depois do título, que continua no imperativo. */
      accessibilityLabel={p.pronto ? `${p.titulo}. ${K().feito}` : undefined}
      style={({ pressed }) => [{ opacity: pressed ? 0.6 : 1 }]}
    >
      <Row gap={12} style={{ paddingHorizontal: 16, paddingVertical: 13 }}>
        <View style={{ width: 36, height: 36, borderRadius: 18, backgroundColor: c.bg, alignItems: 'center', justifyContent: 'center' }}>
          <Icon name={p.ic} size={18} color={p.pronto ? c.tx3 : c.tx2} sw={1.9} />
        </View>
        <View style={{ flex: 1 }}>
          <Txt v="body" c={p.pronto ? c.tx3 : c.tx}>{p.titulo}</Txt>
          {/* O opcional se diz opcional, para ninguém se sentir devendo o
              que pode deixar de lado. */}
          {!p.pronto && p.sub ? (
            <Txt v="caption" c={c.tx3} style={{ marginTop: 1 }}>{p.opcional ? K().opcional(p.sub) : p.sub}</Txt>
          ) : null}
        </View>
        {p.pronto ? (
          <View style={{ width: 24, height: 24, borderRadius: 12, backgroundColor: c.lime, alignItems: 'center', justifyContent: 'center' }}>
            <Icon name="check" size={13} color={c.limeInk} sw={2.6} />
          </View>
        ) : onPress ? (
          <Icon name="chev" size={15} color={c.tx3} sw={2} />
        ) : null}
      </Row>
    </Pressable>
  );
}
