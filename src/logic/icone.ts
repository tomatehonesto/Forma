import { Platform } from 'react-native';
import Constants, { ExecutionEnvironment } from 'expo-constants';

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

/* O NOME DO ÍCONE É O ID DA PALETA, e isso não é coincidência: o
   gerador escreve o arquivo com esse nome, o plugin o declara com esse
   nome, e o sistema o procura por esse nome. Uma tradução no meio seria
   um terceiro lugar para errar. */

/** Se este aparelho troca de ícone. Falso no navegador e no Expo Go. */
export function suportaIcone(): boolean {
  try {
    const m = modulo();
    return !!m?.supportsAlternateIcons;
  } catch {
    return false;
  }
}

/* TROCA E ESQUECE. Devolve se deu certo, para quem quiser saber — e a
   tela de aparência não quer: ela já mudou a cor, que é o que a pessoa
   pediu. O ícone é o extra que acontece quando dá. */
export async function trocarIcone(paleta: string): Promise<boolean> {
  try {
    const m = modulo();
    if (!m?.supportsAlternateIcons) return false;
    await m.setAlternateAppIcon(paleta);
    return true;
  } catch {
    return false;
  }
}
