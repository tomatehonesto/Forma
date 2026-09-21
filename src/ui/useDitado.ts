import { useCallback, useRef, useState } from 'react';
import { Platform } from 'react-native';
import { ExpoSpeechRecognitionModule, useSpeechRecognitionEvent } from 'expo-speech-recognition';

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

/** Há reconhecimento de fala aqui? Na web depende do navegador. */
export const ditadoDisponivel = (): boolean => {
  if (Platform.OS !== 'web') return true;
  const w = globalThis as any;
  return !!(w?.SpeechRecognition || w?.webkitSpeechRecognition);
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

export function useDitado(escrever: (texto: string) => void) {
  const [ouvindo, setOuvindo] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  /* ⚠️ O QUE JÁ ESTAVA ESCRITO NÃO SE PERDE. Quem digitou meia pergunta e
     apertou o microfone para terminar de falar esperaria a fala CONTINUAR
     a frase — e não apagá-la. O trecho ditado é acrescentado ao que havia
     quando o ditado começou. */
  const antes = useRef('');

  useSpeechRecognitionEvent('start', () => { setOuvindo(true); setErro(null); });
  useSpeechRecognitionEvent('end', () => setOuvindo(false));
  useSpeechRecognitionEvent('error', (e: any) => {
    setOuvindo(false);
    /* "aborted" é a pessoa tocando em parar: não é falha e não vira aviso. */
    if (e?.error === 'aborted') return;
    setErro(mensagemDoErro(e?.error));
  });
  useSpeechRecognitionEvent('result', (e: any) => {
    const t = e?.results?.[0]?.transcript ?? '';
    if (!t) return;
    escrever(antes.current ? `${antes.current} ${t}` : t);
  });

  const comecar = useCallback(async (jaEscrito: string) => {
    setErro(null);
    antes.current = jaEscrito.trim();
    try {
      const p = await ExpoSpeechRecognitionModule.requestPermissionsAsync();
      if (!p.granted) { setErro(MENSAGENS['not-allowed']); return; }
      ExpoSpeechRecognitionModule.start({
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
    try { ExpoSpeechRecognitionModule.stop(); } catch { setOuvindo(false); }
  }, []);

  return { ouvindo, erro, comecar, parar, limparErro: () => setErro(null) };
}
