import { AppState, Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants, { ExecutionEnvironment } from 'expo-constants';
import { PALETAS, PALETA_QUE_SAIU } from '../theme';

/* ============================================================
   O ÍCONE DO APLICATIVO — a escolha que sai da tela

   A paleta escolhida na aparência vai até a tela inicial do telefone.
   Não é pintura em tempo de execução: o sistema só troca entre ícones que
   já estavam no pacote, declarados antes da compilação. Os dez são
   gerados por scripts/gerar-icones.mjs, do mesmo caminho que a marca usa
   dentro do app.

   ⚠️ A PORTA SE FECHA ANTES DO REQUIRE, e não depois.

   É a lição que o HealthKit já deu nesta base: módulo nativo ausente não
   estoura no try em volta da CHAMADA — ele estoura ao ser AVALIADO, num
   ponto em que o try local já não está no caminho. A tela de integrações
   abria e quebrava por isso.

   Então a pergunta é feita antes: este build pode ter módulo nativo? O
   Expo Go não pode, o navegador não pode, e os dois se identificam. Sem
   isso, trocar de cor derrubaria o aplicativo de quem está rodando no
   Expo Go — que é como ele roda no desenvolvimento todo dia.

   E TROCAR O ÍCONE NÃO PODE FALHAR ALTO. Se o sistema recusar — iPad com
   restrição, versão antiga, aparelho que simplesmente não suporta —, a
   cor do app muda do mesmo jeito e o ícone fica o que era. Ninguém
   escolhe uma paleta para ver um erro.
   ============================================================ */

const nativoPossivel =
  Platform.OS !== 'web' &&
  Constants.executionEnvironment !== ExecutionEnvironment.StoreClient;

const modulo = () => {
  if (!nativoPossivel) return null;
  try {
    return require('expo-alternate-app-icons');
  } catch {
    return null;
  }
};

/* ⚠️ O NOME DO ÍCONE É O ID DA PALETA EM PASCALCASE — "amora" vira
   "Amora" (achado de 02/10/2026, lendo a biblioteca: a troca nunca tinha
   rodado num aparelho).

   O plugin do expo-alternate-app-icons converte o nome de todo ícone que
   começa em minúscula, e nas DUAS plataformas: no Android o apelido nasce
   `.MainActivityAmora`; no iOS, o appiconset e a lista do
   ASSETCATALOG_COMPILER_ALTERNATE_APPICON_NAMES nascem `Amora`. O código
   nativo não converte nada: o Android monta "MainActivity" + o que
   recebe, e o iOS procura a chave exata em CFBundleAlternateIcons.
   Pedindo "amora", o Android estourava atrás de uma porta que não existe,
   o iOS não achava a chave — e o erro, engolido aqui, passava por
   "aparelho que não suporta".

   Então o app.json escreve "Amora", e esta função é a conversão da
   biblioteca (`toPascalCase`, em plugin/src/utils.ts) — a mesma de
   scripts/gerar-icones.mjs. Os arquivos continuam com o id: o plugin os
   acha pelo caminho, e não pelo nome. */
export const nomeDoIcone = (paleta: string): string => paleta
  .replace(/[\s\-_]+/g, ' ')
  .replace(/([A-Z])/g, ' $1')
  .replace(/\w+/g, (p) => p[0].toUpperCase() + p.slice(1).toLowerCase())
  .replace(/\s+/g, '');

/* ⚠️ NÃO EXISTE MAIS UM `suportaIcone` PARA A TELA PERGUNTAR.

   Ele existia para a Aparência avisar, num aviso, que ali o ícone não
   trocava — o que é verdade no navegador e no Expo Go, e não é verdade
   em nenhum telefone com o aplicativo instalado. Era um aviso sobre o
   ambiente de desenvolvimento aparecendo para quem usa o produto.

   A troca continua sendo silenciosa quando não dá, que é o comportamento
   certo: a paleta muda do mesmo jeito, e ninguém escolhe uma cor para ler
   sobre limitações de build. */

/* TROCA E ESQUECE. Devolve se deu certo, para quem quiser saber — e a
   tela de aparência não quer: ela já mudou a cor, que é o que a pessoa
   pediu. O ícone é o extra que acontece quando dá.

   No Android, "deu certo" quer dizer que a escolha foi guardada: a troca
   acontece quando o aplicativo sai da tela — ver logo abaixo. */
export async function trocarIcone(paleta: string): Promise<boolean> {
  try {
    const m = modulo();
    if (!m?.supportsAlternateIcons) return false;
    if (Platform.OS === 'android') {
      await AsyncStorage.setItem(PEDIDO, paleta);
      return true;
    }
    const nome = nomeDoIcone(paleta);
    if (m.getAppIconName() === nome) return true;
    await m.setAlternateAppIcon(nome);
    return true;
  } catch {
    return false;
  }
}

/* ============================================================
   NO ANDROID, O ÍCONE TROCA QUANDO O APLICATIVO SAI DA TELA

   Cada ícone é uma porta do aplicativo — um apelido da MainActivity, ver
   plugins/porta-padrao-do-icone.js —, e trocar é ligar uma porta e
   desligar outra. A biblioteca desliga a porta pela qual a tela ATUAL
   entrou, e é a própria tela quem diz qual foi. Isso só está certo na
   primeira troca de cada tela aberta: depois dela, a tela continua
   dizendo que entrou pela porta velha — já desligada —, e uma segunda
   troca desligaria a velha de novo e deixaria a anterior acesa. Dois
   ícones do Morphi na gaveta, os dois abrindo o aplicativo, e nenhum jeito
   de apagar um deles daqui. O PR #267 da biblioteca conserta isso no
   código nativo; enquanto ele não entra, o conserto é não pedir.

   · A ESCOLHA É GUARDADA, e não aplicada. A Aparência troca a paleta a
     cada toque — quem está experimentando cores toca em cinco —, e só a
     última importa. Ela vale quando o aplicativo vai para o fundo, que é
     o primeiro momento em que alguém vê a tela inicial.
   · SÓ SE PEDE A TROCA QUANDO A PORTA DA TELA É A ACESA. Sabemos qual está
     acesa porque fomos nós que acendemos (`ligado`); antes da primeira
     troca da execução, é a da tela — ela acabou de entrar por uma porta, e
     só a acesa deixa entrar. Se as duas não batem, a tela é velha, e a
     escolha espera uma tela nova: o aplicativo aberto do zero, ou de novo
     depois de sair pelo voltar.
   · E NUNCA QUANDO A TELA ENTROU PELA MAINACTIVITY. Aberto por um link, o
     aplicativo entra por ela, e a biblioteca a desligaria — levando junto
     os links e a própria tela aberta. A escolha espera.

   O iOS não tem nada disso: o sistema sabe qual ícone está posto, a troca
   é na hora e é ele quem avisa a pessoa.
   ============================================================ */

const PEDIDO = 'norte.icone.pedido.v1';
const LIGADO_NO_DESENVOLVIMENTO = 'norte.icone.ligado.dev.v1';

let ligado: string | undefined;
let fila: Promise<void> = Promise.resolve();

async function aplicarPedido(): Promise<void> {
  const m = modulo();
  if (!m?.supportsAlternateIcons) return;
  const pedido = await AsyncStorage.getItem(PEDIDO);
  if (!pedido) return;
  /* Uma paleta que saiu da lista leva à sucessora, como em `ensureDefaults`. */
  const id = PALETA_QUE_SAIU[pedido] ?? pedido;
  if (!PALETAS.some((p) => p.id === id)) return;
  const alvo = nomeDoIcone(id);

  const entrada: string | null = m.getAppIconName();
  if (!entrada) return;

  /* ⚠️ NO DESENVOLVIMENTO, A MEMÓRIA SOBREVIVE AO "r" DO METRO. Recarregar
     troca o JavaScript e deixa a tela — e uma tela velha com a memória
     zerada é exatamente o caso desta trava. Em produção não há
     recarregar: JavaScript novo é processo novo, a tela é nova, e a porta
     dela é a acesa. Fora do desenvolvimento não se guarda de propósito: o
     backup do Android devolve o armazenamento num aparelho novo, onde a
     porta acesa é a padrão, e a lembrança velha travaria a troca. */
  if (ligado === undefined) {
    ligado = (__DEV__ && (await AsyncStorage.getItem(LIGADO_NO_DESENVOLVIMENTO))) || entrada;
  }
  if (entrada !== ligado || entrada === alvo) return;

  await m.setAlternateAppIcon(alvo);
  ligado = alvo;
  if (__DEV__) await AsyncStorage.setItem(LIGADO_NO_DESENVOLVIMENTO, alvo);
}

/** Liga a troca do Android à saída do aplicativo. Devolve o desligar. */
export function trocarIconeAoSair(): () => void {
  if (Platform.OS !== 'android' || !nativoPossivel) return () => {};
  const sub = AppState.addEventListener('change', (e) => {
    if (e !== 'background') return;
    /* Em fila: duas saídas seguidas não pedem duas trocas ao mesmo tempo. */
    fila = fila.then(aplicarPedido).catch(() => {});
  });
  return () => sub.remove();
}
