import { useEffect } from 'react';
import { AppState, Platform, View } from 'react-native';
import { Stack, useRouter, useSegments } from 'expo-router';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import {
  useFonts,
  Outfit_300Light, Outfit_400Regular,
  Outfit_500Medium, Outfit_600SemiBold,
} from '@expo-google-fonts/outfit';
import { useStore } from '../logic/store';
import { nextInjectionDate } from '../logic/derive';
import { reagendar } from '../logic/avisos';
import { juntarPesagens, pesagensDoAparelho } from '../logic/saude-do-aparelho';
import { novosNiveis } from '../logic/conquistas';
import { light, APP_MAX_W } from '../theme';

/* Fundo fora da coluna, no web. Não é cor da marca e não entra na paleta:
   é a mesa sobre a qual o aparelho fica apoiado, e só existe em navegador. */
const MESA = '#DDE3F2';

/* No celular o app é a tela inteira e este componente não faz nada. No web
   ele passa a rodar numa coluna de largura de telefone, centrada.

   Sem isso o app renderiza edge-to-edge, e o preview mente: uma manchete de
   32px que domina uma tela de 390 vira uma linha perdida num hero de 1400,
   e quem avalia a tela pelo navegador conclui que a tipografia está pequena
   quando o que está errado é a proporção. */
function Moldura({ children }: { children: React.ReactNode }) {
  if (Platform.OS !== 'web') return <>{children}</>;
  return (
    <View style={{ flex: 1, backgroundColor: MESA, alignItems: 'center' }}>
      <View style={{ flex: 1, width: '100%', maxWidth: APP_MAX_W, backgroundColor: light.bg, overflow: 'hidden' }}>
        {children}
      </View>
    </View>
  );
}

/* A PORTA DE ENTRADA.

   O cadastro existia solto: dava para chegar nele por endereço, e o app
   abria direto na Home com o perfil de exemplo. Quem instalasse pela
   primeira vez entrava na vida de outra pessoa — peso, doses, histórico
   — e tinha de descobrir sozinho onde se cadastra.

   `onboardDone` já existia no estado e ninguém lia. Agora ele é a
   tranca: enquanto for falso, qualquer endereço leva ao cadastro, e ele
   só vira verdadeiro quando o plano é montado, no fim do formulário.

   NÃO É AUTENTICAÇÃO, e não finge ser: não há conta, servidor nem senha.
   É a diferença entre "este app já é seu" e "este app ainda é uma
   demonstração", que é a única coisa que o aparelho tem como saber
   sozinho. */
function Portao({ children }: { children: React.ReactNode }) {
  const ready = useStore((s) => s.ready);
  const feito = useStore((s) => s.S.onboardDone);
  const segmentos = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (!ready) return;
    const noCadastro = segmentos[0] === 'cadastro';
    if (!feito && !noCadastro) router.replace('/cadastro' as any);
  }, [ready, feito, segmentos, router]);

  return <>{children}</>;
}

/* QUEM REMARCA OS AVISOS.

   Dois dos quatro lembretes dependem de uma data que anda: a aplicação
   segue a próxima dose, que muda quando uma é registrada, e a pesagem
   semanal cai numa data nova a cada semana. Eles são agendados como data
   marcada, e alguém precisa marcar a seguinte.

   Esse alguém é este componente. Ele observa uma chave curta — as
   preferências de lembrete e a data da próxima aplicação — e remarca
   quando ela muda, o que inclui a abertura do app. Não observa o estado
   inteiro de propósito: a gravação clona tudo a cada escrita, então
   depender do objeto faria o app cancelar e reagendar quatro avisos a
   cada copo d'água registrado.

   Mora na raiz porque não é assunto de tela nenhuma: a pessoa liga um
   lembrete em Lembretes e registra a aplicação em Aplicações, e as duas
   coisas mexem no mesmo agendamento. */
function Agendador() {
  const ready = useStore((s) => s.ready);
  const S = useStore((s) => s.S);
  const chave = ready ? JSON.stringify([(S as any).alertas, +nextInjectionDate(S)]) : '';
  useEffect(() => {
    if (!ready) return;
    reagendar(useStore.getState().S);
  }, [ready, chave]);

  /* E DE NOVO AO VOLTAR PARA O APP.

     A permissão mora no sistema, não aqui: alguém que a negou, foi às
     configurações do aparelho e voltou tem lembretes ligados e nada
     agendado — porque quando eles foram ligados não havia permissão. A
     chave acima não mudou e nunca mudaria sozinha. Voltar ao foco é
     exatamente o momento em que isso pode ter acontecido. */
  useEffect(() => {
    if (!ready) return;
    const sub = AppState.addEventListener('change', (e) => {
      if (e === 'active') reagendar(useStore.getState().S);
    });
    return () => sub.remove();
  }, [ready]);

  return null;
}

/* QUEM TRAZ AS PESAGENS DO APARELHO.

   O depósito de saúde não avisa ninguém: a balança de wi-fi escreve lá e
   o número fica esperando alguém ler. Se a leitura só acontecesse na tela
   de integrações, a pessoa se pesaria de manhã e o ponto apareceria na
   curva no dia em que ela lembrasse de visitar uma tela de configuração.

   Então ele lê quando o app abre e quando volta para o foco — os dois
   momentos em que alguém vai olhar a curva. Uma vez por abertura, e não
   em laço: ler o depósito é uma chamada nativa com permissão por trás, e
   repeti-la a cada render não traria nada que a primeira já não tivesse.

   SÓ COM A CHAVE LIGADA. A permissão do sistema é do sistema, mas a
   decisão de trazer é da pessoa, e ela está em Integrações. Sem a chave,
   este componente não toca no assunto.

   O QUE ENTRA NÃO SOBRESCREVE NADA: a junção respeita o que já existe
   naquele dia. Ver juntarPesagens em src/logic/saude-do-aparelho.ts. */
function SaudeDoAparelho() {
  const ready = useStore((s) => s.ready);
  const ligado = useStore((s) => {
    const i: any = (s.S as any).integrations ?? {};
    return !!(Platform.OS === 'ios' ? i.appleHealth : Platform.OS === 'android' ? i.healthConnect : false);
  });

  useEffect(() => {
    if (!ready || !ligado) return;
    let vivo = true;
    const ler = async () => {
      const pesagens = await pesagensDoAparelho();
      if (!vivo || !pesagens.length) return;
      useStore.getState().update((s: any) => {
        s.weights = juntarPesagens(s.weights ?? [], pesagens).lista;
      });
    };
    /* Promessa sem rede num efeito vira rejeição não tratada, e no
       desenvolvimento isso é uma tela vermelha por cima do app inteiro —
       por uma leitura de peso que simplesmente não veio. */
    const tentar = () => { ler().catch(() => {}); };
    tentar();
    const sub = AppState.addEventListener('change', (e) => { if (e === 'active') tentar(); });
    return () => { vivo = false; sub.remove(); };
  }, [ready, ligado]);

  return null;
}

/* QUEM PERCEBE QUE UMA CONQUISTA CHEGOU.

   As conquistas são calculadas: elas passam a ser verdade no instante em
   que o registro entra, sem nenhum código dizendo "aconteceu agora". Para
   o app contar, alguém precisa reparar — e esse alguém está aqui, e não
   nas telas de registro.

   NA RAIZ PORQUE O REGISTRO ENTRA POR TODA PARTE. Check-in, pesagem,
   água, refeição, treino, foto, aplicação: são dez folhas diferentes, e
   qualquer uma delas pode fechar uma trilha. Pôr a verificação em cada
   uma seria dez cópias da mesma regra — e a décima primeira, criada no
   mês que vem, nasceria sem ela.

   ESPERA A FOLHA FECHAR. O nível chega no mesmo instante em que a folha
   de registro grava, e ela ainda está saindo de cena. Sem o respiro, a
   comemoração subiria por cima de uma folha em movimento. Meio segundo é
   o bastante para a animação de saída terminar.

   E NÃO INTERROMPE O CADASTRO. Quem está respondendo as quinze perguntas
   iniciais não quer uma tela cheia de lima no meio — e o cadastro grava
   peso e aplicação, que fechariam trilha na hora. */
function VigiaDeConquistas() {
  const ready = useStore((s) => s.ready);
  const S = useStore((s) => s.S);
  const segmentos = useSegments();
  const router = useRouter();

  /* A chave é quantos níveis existem, e não o estado inteiro: `update`
     clona tudo a cada gravação, e depender do objeto faria este efeito
     rodar a cada toque em qualquer lugar do app. */
  const quantas = ready ? novosNiveis(S).length : 0;
  const segs = segmentos as unknown as string[];
  const ocupado = segs[0] === 'cadastro' || segs[0] === 'conquista-ok';

  useEffect(() => {
    if (!ready || !quantas || ocupado) return;
    const t = setTimeout(() => router.push('/conquista-ok' as any), 500);
    return () => clearTimeout(t);
  }, [ready, quantas, ocupado, router]);

  return null;
}

export default function RootLayout() {
  const hydrate = useStore((s) => s.hydrate);
  const ready = useStore((s) => s.ready);
  const [loaded] = useFonts({
    Outfit_300Light, Outfit_400Regular,
    Outfit_500Medium, Outfit_600SemiBold,
  });

  useEffect(() => { hydrate(); }, [hydrate]);
  if (!loaded || !ready) return null;

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <StatusBar style="dark" />
        <Agendador />
        <SaudeDoAparelho />
        <VigiaDeConquistas />
        <Moldura>
        <Portao>
        <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: light.bg }, animation: 'slide_from_right' }}>
          <Stack.Screen name="(tabs)" />
          {/* O cadastro não se fecha pelo lado. Ele é o único fluxo do app
              em que sair pela metade deixa o perfil sem medicamento ou sem
              dose — e com isso a Home sem o que dizer. O caminho de volta é
              o botão de cada passo, que preserva o que já foi respondido. */}
          <Stack.Screen name="cadastro" options={{ gestureEnabled: false }} />
          {/* O check-in era folha modal. Virou tela: ele tem três escalas
              fixas, a lista de sintomas e um cartão por sintoma marcado —
              conteúdo que rola, e folha que rola muito é tela com menos
              espaço e um gesto de fechar a mais. */}
          <Stack.Screen name="checkin" />
          {/* Confirmação do check-in. Em fade porque ela não é o próximo
              passo de um fluxo, é o mesmo assunto mudando de estado. */}
          <Stack.Screen name="checkin-ok" options={{ animation: 'fade' }} />
          {/* A conquista sobe por cima do que estiver aberto, e em fade:
              ela não é o próximo passo de um fluxo, é um recado que
              aparece. */}
          <Stack.Screen name="conquista-ok" options={{ animation: 'fade', gestureEnabled: false }} />
          <Stack.Screen name="ciclo" />
          <Stack.Screen name="evolucao" />
          <Stack.Screen name="historico" />
          <Stack.Screen name="perfil" />
          <Stack.Screen name="aplicacoes" />
          <Stack.Screen name="exames" />
          <Stack.Screen name="notificacoes" />
          <Stack.Screen name="saude" />
          <Stack.Screen name="medidas" />
          <Stack.Screen name="fotos" />
          <Stack.Screen name="sintomas" />
          <Stack.Screen name="medico" />
          <Stack.Screen name="consultas" />
          <Stack.Screen name="protocolos" />
          <Stack.Screen name="metas" />
          <Stack.Screen name="conquistas" />
          <Stack.Screen name="companion" />
          <Stack.Screen name="lembretes" />
          <Stack.Screen name="alimentacao" />
          <Stack.Screen name="integracoes" />
          <Stack.Screen name="biblioteca" />
          <Stack.Screen name="resumo-medico" />
          {/* telas internas da primeira leva — desenho em ui/internas */}
          <Stack.Screen name="marcador" />
          <Stack.Screen name="caneta" />
          <Stack.Screen name="semana" />
          <Stack.Screen name="notas" />
          <Stack.Screen name="exportar" />
          <Stack.Screen name="aplicacao" />
          <Stack.Screen name="aplicacao-ok" />
          {/* Registrar é um bottom sheet montado à mão, não o formSheet
              nativo: aquele só existe em iOS/Android e virava tela cheia na
              web, sem sequer um jeito de fechar. transparentModal deixa o
              scrim e o painel por conta da própria tela, e o comportamento
              fica igual em todo lugar. */}
          <Stack.Screen
            name="registrar"
            options={{
              presentation: 'transparentModal',
              animation: 'slide_from_bottom',
              contentStyle: { backgroundColor: 'transparent' },
            }}
          />
          {/* capturas dedicadas — mesma apresentação do registrar */}
          {['medir-agua','medir-exercicio','medir-refeicao','medir-peso','medir-medidas','medir-foto','medir-exame','medir-anotacao',
           'registro','nota','caneta-nova','ritmo','dia',
           /* As folhas de DETALHE entram aqui pelo mesmo motivo das de
              captura: elas se desenham como bottom sheet, com scrim
              próprio, e sem esta apresentação o scrim cobria a tela
              inteira em cinza opaco em vez de deixar ver o que está
              atrás. */
           'treino','refeicao','favorito','protocolo','meta','alerta','trilha'].map((n) => (
            <Stack.Screen
              key={n}
              name={n}
              options={{ presentation: 'transparentModal', animation: 'slide_from_bottom', contentStyle: { backgroundColor: 'transparent' } }}
            />
          ))}
        </Stack>
        </Portao>
        </Moldura>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
