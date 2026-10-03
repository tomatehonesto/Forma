/* ============================================================
   A PORTA PADRÃO DO ÍCONE — a MainActivity nunca se desliga

   No Android, o expo-alternate-app-icons troca o ícone ligando um
   <activity-alias> (um por paleta) e DESLIGANDO a porta pela qual a tela
   aberta entrou. No manifesto que ele deixa, essa porta, na primeira
   troca, é a própria MainActivity — e desligar a MainActivity faz duas
   coisas que ninguém quer:

   · OS LINKS MORREM. O filtro do esquema — morphi://, e o exp+morphi://
     do dev client — só existe nela; os apelidos dos ícones têm só
     MAIN/LAUNCHER. Link do expo-router, volta do login, o "a" do Metro:
     ninguém atende. É o issue #260 da biblioteca.
   · O APLICATIVO FECHA NA CARA DE QUEM USA. Quando um componente é
     desligado, o sistema encerra as atividades dele — DONT_KILL_APP poupa
     o processo, não a atividade (cleanupDisabledPackageComponentsLocked,
     no ActivityManagerService). E toda atividade aberta por apelido é,
     para o sistema, da classe do alvo: a MainActivity.

   Então a MainActivity deixa de ser porta de ícone. Ela perde o filtro
   MAIN/LAUNCHER, fica com os links e fica LIGADA PARA SEMPRE. Quem põe o
   aplicativo na tela inicial é um apelido padrão, `.MainActivityPadrao`,
   ligado de fábrica e sem ícone próprio — mostra o do aplicativo, como a
   MainActivity mostrava. Daí em diante a biblioteca só troca um apelido
   por outro, e desligar apelido não encerra atividade nenhuma.

   É o desenho do PR #267 da biblioteca, que ainda não entrou — aqui, só a
   parte do manifesto. A outra metade do problema é o código nativo dela:
   ele desliga a porta pela qual a tela ATUAL entrou, e não a que está
   ligada. Isso é contornado em src/logic/icone.ts, que só pede a troca
   quando as duas são a mesma — e nunca quando a tela entrou pela
   MainActivity, que é o que acontece quando o aplicativo abre por um link.

   ⚠️ NENHUM APELIDO DE ÍCONE PODE LEVAR FILTRO DE LINK. Com a MainActivity
   ligada, um apelido que também atendesse morphi:// faria o Android
   perguntar "abrir com: Morphi ou Morphi". A biblioteca copia para os
   apelidos o que estiver em `android.intentFilters` — por isso o aviso
   abaixo, se alguém um dia usar essa chave.

   ⚠️ "Padrao" É NOME RESERVADO. Uma paleta com esse id viraria um segundo
   apelido com o mesmo nome, a biblioteca trocaria o nosso pelo dela —
   desligado — e o aplicativo sairia da tela inicial. O plugin se recusa a
   rodar.

   ⚠️ A ORDEM EM app.json NÃO IMPORTA. Este plugin mexe no filtro de
   lançador da MainActivity, que ninguém mais escreve, e num apelido que
   ninguém mais toca; a biblioteca só troca os apelidos com os nomes dela.

   O Expo CLI procura a atividade com LAUNCHER para abrir o aplicativo, não
   acha mais, e cai na MainActivity pelo nome (resolveLaunchProps, no
   @expo/cli): `npx expo run:android` abre do mesmo jeito.
   ============================================================ */
const { AndroidConfig, WarningAggregator, withAndroidManifest } = require('expo/config-plugins');

const PADRAO = 'Padrao';
const APELIDO = `.MainActivity${PADRAO}`;
const MAIN = 'android.intent.action.MAIN';
const LAUNCHER = 'android.intent.category.LAUNCHER';

const portaDeIcone = (filtro) =>
  (filtro.action ?? []).some((a) => a.$['android:name'] === MAIN) &&
  (filtro.category ?? []).some((c) => c.$['android:name'] === LAUNCHER);

/* Os nomes da entrada da biblioteca em app.json. A comparação é sem
   caixa: a biblioteca converte "padrao" em "Padrao" antes de escrever. */
const nomesDosIcones = (config) => {
  const entrada = (config.plugins ?? []).find(
    (p) => Array.isArray(p) && p[0] === 'expo-alternate-app-icons',
  );
  return (entrada?.[1] ?? []).map((icone) =>
    typeof icone === 'string' ? icone.split(/[\\/]/).pop().replace(/\.[^.]+$/, '') : icone.name,
  );
};

const withPortaPadrao = (config) =>
  withAndroidManifest(config, (config) => {
    const app = AndroidConfig.Manifest.getMainApplicationOrThrow(config.modResults);
    const principal = AndroidConfig.Manifest.getMainActivityOrThrow(config.modResults);

    principal['intent-filter'] = (principal['intent-filter'] ?? []).filter((f) => !portaDeIcone(f));

    app['activity-alias'] = (app['activity-alias'] ?? []).filter((a) => a.$['android:name'] !== APELIDO);
    app['activity-alias'].unshift({
      $: {
        'android:name': APELIDO,
        'android:enabled': 'true',
        'android:exported': 'true',
        'android:targetActivity': '.MainActivity',
      },
      'intent-filter': [{
        action: [{ $: { 'android:name': MAIN } }],
        category: [{ $: { 'android:name': LAUNCHER } }],
      }],
    });

    return config;
  });

module.exports = (config) => {
  if (nomesDosIcones(config).some((n) => String(n).toLowerCase() === PADRAO.toLowerCase())) {
    throw new Error(
      `porta-padrao-do-icone: "${PADRAO}" é o nome da porta padrão — nenhuma paleta pode se chamar assim`,
    );
  }
  if (config.android?.intentFilters?.length) {
    WarningAggregator.addWarningAndroid(
      'porta-padrao-do-icone',
      'android.intentFilters vai para a MainActivity E para cada apelido de ícone — com a ' +
        'MainActivity sempre ligada, um link atendido pelos dois abre a pergunta "abrir com". ' +
        'Tire os filtros dos apelidos antes de usar essa chave.',
    );
  }
  return withPortaPadrao(config);
};
