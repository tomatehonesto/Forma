import { useCallback, useRef, useState } from 'react';
import { Platform } from 'react-native';
import Constants, { ExecutionEnvironment } from 'expo-constants';

/* ============================================================
   O DITADO — falar em vez de digitar, no campo do companion.

   ⚠️⚠️ ISTO ABRIU A SEGUNDA SAÍDA DE REDE DO APLICATIVO, e está no
   PENDENCIAS. Até aqui havia exatamente UMA: a leitura da foto do prato.
   O reconhecimento de fala pode mandar áudio para os servidores da Apple
   ou do Google — e áudio de alguém falando do próprio tratamento é dado
   de saúde.

   Pedimos `requiresOnDeviceRecognition`, que é o certo para um
   aplicativo de saúde, mas a própria documentação do módulo diz "only
   enabled if the device supports it": quem não tem o modelo de pt-BR
   instalado cai no reconhecimento por rede sem que nada avise. Por isso
   o texto da permissão NÃO promete que o áudio fica no aparelho — seria
   uma promessa que o código não cumpre, e este projeto passou a semana
   tirando essas do produto.

   ⚠️ O BOTÃO SÓ APARECE ONDE FUNCIONA. Na web, sem a Web Speech API no
   navegador, `disponivel` é falso e o microfone não é desenhado. Botão
   que não faz nada é pior do que botão ausente.
   ============================================================ */

/* ⚠️⚠️ ERA UM CRASH NO EXPO GO, e a porta se fecha ANTES do require.

   `expo-speech-recognition` chama `requireNativeModule("ExpoSpeechRecognition")`
   na primeira linha do arquivo dele. No Expo Go esse módulo nativo não
   existe, então a chamada lança — e como isso acontece no IMPORT, quem
   abrisse o chat derrubava o aplicativo antes de a tela pintar. Não havia
   botão para não desenhar: o erro vinha antes do componente.

   ⚠️ E A PERGUNTA CERTA NÃO É "DEU ERRO?", É "ESTE BUILD PODE TER MÓDULO
   NATIVO?". É a lição que o HealthKit já deu nesta base — ver o
   comentário em src/logic/saude-do-aparelho.ts. Lá, um try em volta do
   require não bastou: o Nitro estoura ao ser AVALIADO, num ponto em que
   o try local já saiu do caminho. Perguntar antes é mais honesto do que
   tentar e cair, e sobrevive à próxima biblioteca que escolher outro
   jeito de explodir.

   O try continua, como segunda rede: build meio feita, versão trocada,
   aparelho antigo. Só deixou de ser a única.

   ⚠️ NA WEB NADA DISSO ACONTECE: o pacote tem um `.web.js`, o empacotador
   o resolve antes, e ele não chama requireNativeModule. Foi por isso que
   o painel do navegador não mostrou nada de errado — e é por isso que
   `noExpoGo` não pode barrar a web.

   ⚠️ E O FALLBACK DO HOOK PRECISA SER UM NO-OP, não undefined. `useDitado`
   chama `ouvirEvento` quatro vezes em toda renderização; se ele sumisse
   quando o módulo falta, a contagem de hooks mudaria entre um aparelho e
   outro. O valor é decidido uma vez, no carregamento do módulo, e nunca
   mais muda — então a ordem fica estável. */
const noExpoGo = Constants.executionEnvironment === ExecutionEnvironment.StoreClient;

let Modulo: any = null;
let ouvirEvento: (nome: string, fn: (e: any) => void) => void = () => {};
if (Platform.OS === 'web' || !noExpoGo) {
  try {
    const m = require('expo-speech-recognition');
    Modulo = m.ExpoSpeechRecognitionModule ?? null;
    if (typeof m.useSpeechRecognitionEvent === 'function') ouvirEvento = m.useSpeechRecognitionEvent;
  } catch {
    /* Build sem o prebuild do módulo: segue sem ditado. */
  }
}

/* ⚠️ TRÊS ESTADOS, E NÃO UM BOOLEANO — o mesmo desenho do
   `EstadoDaSaude` em src/logic/saude-do-aparelho.ts, pela mesma razão:
   "não dá" tem mais de um motivo, e os motivos pedem telas diferentes.

   · `pronto`        o microfone funciona e é desenhado.

   · `indisponivel`  navegador sem Web Speech API, ou build de produção
                    em que o módulo não entrou. O microfone NÃO é
                    desenhado: para quem usa o aplicativo, botão que não
                    faz nada é pior do que botão ausente.

   · `no-expo-go`    ⚠️ AQUI A REGRA SE INVERTE, e vale explicar.

                    A regra do botão ausente protege o USUÁRIO. No Expo Go
                    não existe usuário — existe quem está construindo o
                    aplicativo, olhando a tela para decidir se ela está
                    boa. Esconder o microfone dessa pessoa não protege
                    ninguém: faz a ferramenta mentir sobre como o
                    aplicativo é, e some com um recurso que existe.

                    Então lá o botão aparece, e o toque explica por que
                    ele não grava. Isso nunca chega a uma loja: o Expo Go
                    é um aplicativo de desenvolvimento, e a build que
                    alguém instala sempre tem o módulo.

                    A base já tem precedente para isto — a tela de
                    assinatura carrega atalhos marcados como "não aparece
                    em produção". */
export type EstadoDoDitado = 'pronto' | 'no-expo-go' | 'indisponivel';

export const estadoDoDitado = (): EstadoDoDitado => {
  if (Platform.OS !== 'web' && noExpoGo) return 'no-expo-go';
  if (!Modulo) return 'indisponivel';
  if (Platform.OS !== 'web') return 'pronto';
  const w = globalThis as any;
  return (w?.SpeechRecognition || w?.webkitSpeechRecognition) ? 'pronto' : 'indisponivel';
};

/* As falhas que a pessoa pode resolver ganham frase própria; o resto cai
   na genérica, que oferece a saída que sempre existiu — escrever. */
const MENSAGENS: Record<string, string> = {
  'not-allowed': 'Precisamos da sua permissão para usar o microfone.',
  'service-not-allowed': 'O seu aparelho não liberou o reconhecimento de fala.',
  'no-speech': 'Não ouvi nada. Pode falar de novo.',
  'network': 'Sem conexão para transcrever agora.',
  'audio-capture': 'Não consegui usar o microfone agora.',
};
const mensagemDoErro = (code?: string) =>
  (code && MENSAGENS[code]) || 'Não consegui ouvir agora — dá para escrever também.';

/* Texto de desenvolvimento, e ele diz isso de si. Só aparece no Expo Go. */
const AVISO_EXPO_GO = 'O ditado precisa de uma build de desenvolvimento — no Expo Go o módulo de voz não existe. Aqui o botão está só para a tela ficar completa.';

export function useDitado(escrever: (texto: string) => void) {
  const [ouvindo, setOuvindo] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  /* ⚠️ O QUE JÁ ESTAVA ESCRITO NÃO SE PERDE. Quem digitou meia pergunta e
     apertou o microfone para terminar de falar esperaria a fala CONTINUAR
     a frase — e não apagá-la. O trecho ditado é acrescentado ao que havia
     quando o ditado começou. */
  const antes = useRef('');

  ouvirEvento('start', () => { setOuvindo(true); setErro(null); });
  ouvirEvento('end', () => setOuvindo(false));
  ouvirEvento('error', (e: any) => {
    setOuvindo(false);
    /* "aborted" é a pessoa tocando em parar: não é falha e não vira aviso. */
    if (e?.error === 'aborted') return;
    setErro(mensagemDoErro(e?.error));
  });
  ouvirEvento('result', (e: any) => {
    const t = e?.results?.[0]?.transcript ?? '';
    if (!t) return;
    escrever(antes.current ? `${antes.current} ${t}` : t);
  });

  const comecar = useCallback(async (jaEscrito: string) => {
    setErro(null);
    antes.current = jaEscrito.trim();
    if (estadoDoDitado() === 'no-expo-go') { setErro(AVISO_EXPO_GO); return; }
    if (!Modulo) { setErro(mensagemDoErro()); return; }
    try {
      const p = await Modulo.requestPermissionsAsync();
      if (!p.granted) { setErro(MENSAGENS['not-allowed']); return; }
      Modulo.start({
        lang: 'pt-BR',
        /* O texto aparece enquanto ela fala, e não só no fim: sem isso o
           campo fica parado por segundos e o ditado parece travado. */
        interimResults: true,
        /* Uma pergunta por vez. Contínuo deixaria o microfone aberto
           esperando, e microfone aberto sem motivo é outra coisa. */
        continuous: false,
        /* Melhor esforço — ver o aviso no alto do arquivo. */
        requiresOnDeviceRecognition: true,
      });
    } catch {
      setErro(mensagemDoErro());
      setOuvindo(false);
    }
  }, []);

  const parar = useCallback(() => {
    try { Modulo?.stop(); } catch { setOuvindo(false); }
  }, []);

  return { ouvindo, erro, comecar, parar, limparErro: () => setErro(null) };
}
