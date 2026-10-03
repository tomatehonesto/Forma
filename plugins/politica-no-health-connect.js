/* ============================================================
   A POLÍTICA DE PRIVACIDADE A PARTIR DO HEALTH CONNECT

   O Google exige: quando a pessoa toca em "política de privacidade" no
   pedido de permissão do Health Connect (Android 13 e anteriores), ou no
   nosso nome dentro das permissões dele (Android 14 em diante), o
   aplicativo abre MOSTRANDO a política — a mesma que está na Play
   Console. Sem isso, o formulário de acesso ao Health Connect volta
   recusado.

   O plugin da biblioteca (react-native-health-connect) abre as duas
   portas apontando para a MainActivity, e a MainActivity não sabe por que
   foi aberta: ela vai para a Home. Este plugin SUBSTITUI o dela — por isso
   ele não está mais em app.json — e aponta as duas portas para uma
   atividade nossa, sem tela, que abre a política e sai.

   ⚠️⚠️ ONDE ELA ABRE A POLÍTICA importa, e a opção `politica` decide:

     ["./plugins/politica-no-health-connect", { "politica": "https://…" }]

   · COM O ENDEREÇO PÚBLICO, abre no navegador. É o caminho certo: o
     pedido de permissão do Health Connect fica empilhado em cima da nossa
     MainActivity, e qualquer coisa que reabra a MainActivity (ela é
     `singleTask`) desmonta o que está em cima dela — o pedido volta como
     cancelado e a chave fica desligada.
   · SEM ELE (hoje: a política ainda não está publicada), abre a rota do
     aplicativo. Mostra a política, que é o que o Google confere, mas quem
     tocar no link DE DENTRO do pedido perde o pedido e liga a chave de
     novo. Ver o item 41 das pendências.

   ⚠️ NÃO USAR OS DOIS JUNTOS. O da biblioteca põe a porta do Android 13
   também na MainActivity, e duas atividades respondendo ao mesmo pedido
   viram uma tela de "abrir com" entre o Morphi e o Morphi.

   O resto da biblioteca não depende do plugin: o registro do pedido de
   permissão vem do módulo Expo dela (android-expo), que se liga sozinho.
   E as permissões de peso e de histórico estão em app.json
   (android.permissions) — ver src/logic/saude-do-aparelho.ts.

   ⚠️ A ROTA É A DE `POLITICA`, em src/logic/consentimento.ts. Mudou lá,
   muda aqui.
   ============================================================ */
const fs = require('fs');
const path = require('path');
const { AndroidConfig, withAndroidManifest, withDangerousMod } = require('expo/config-plugins');

const ROTA = 'documento?id=privacidade';
const CLASSE = 'PoliticaDoHealthConnect';
const ATIVIDADE = `.${CLASSE}`;
/* O nome que o Health Connect procura no Android 14 em diante. */
const ALIAS = 'ViewPermissionUsageActivity';
const ACAO_ATE_O_13 = 'androidx.health.ACTION_SHOW_PERMISSIONS_RATIONALE';

const esquema = (config) => {
  const s = Array.isArray(config.scheme) ? config.scheme[0] : config.scheme;
  if (!s) throw new Error('politica-no-health-connect: falta "scheme" em app.json');
  return s;
};

/* AS DUAS PORTAS. A atividade recebe a do Android 13; o alias, a do 14 em
   diante, guardado pela permissão que só o sistema tem. O alias precisa
   vir DEPOIS da atividade-alvo no manifesto — e vem, porque a lista de
   atividades nasce antes da de aliases, com a MainActivity do modelo. */
const withPortas = (config) =>
  withAndroidManifest(config, (config) => {
    const app = AndroidConfig.Manifest.getMainApplicationOrThrow(config.modResults);
    const principal = AndroidConfig.Manifest.getMainActivityOrThrow(config.modResults);

    /* A porta do 13 sai da MainActivity, se alguém a pôs lá — o filtro que
       só tem essa ação, que é como o plugin da biblioteca o escreve. */
    principal['intent-filter'] = (principal['intent-filter'] ?? []).filter((f) => {
      const acoes = (f.action ?? []).map((a) => a.$['android:name']);
      return !(acoes.length === 1 && acoes[0] === ACAO_ATE_O_13);
    });

    app.activity = (app.activity ?? []).filter((a) => a.$['android:name'] !== ATIVIDADE);
    app.activity.push({
      $: {
        'android:name': ATIVIDADE,
        'android:exported': 'true',
        'android:excludeFromRecents': 'true',
        'android:noHistory': 'true',
        'android:theme': '@android:style/Theme.Translucent.NoTitleBar',
      },
      'intent-filter': [{ action: [{ $: { 'android:name': ACAO_ATE_O_13 } }] }],
    });

    app['activity-alias'] = (app['activity-alias'] ?? []).filter((a) => a.$['android:name'] !== ALIAS);
    app['activity-alias'].push({
      $: {
        'android:name': ALIAS,
        'android:exported': 'true',
        'android:targetActivity': ATIVIDADE,
        'android:permission': 'android.permission.START_VIEW_PERMISSION_USAGE',
      },
      'intent-filter': [{
        action: [{ $: { 'android:name': 'android.intent.action.VIEW_PERMISSION_USAGE' } }],
        category: [{ $: { 'android:name': 'android.intent.category.HEALTH_PERMISSIONS' } }],
      }],
    });

    return config;
  });

/* A ATIVIDADE SEM TELA — abre a política e sai. As duas formas de abrir:

   · NO NAVEGADOR, quando há endereço público (ver o cabeçalho).
   · PELA ROTA DO APLICATIVO, quando não há. Ela entra pela porta de
     entrada que estiver LIGADA, e não pela MainActivity pelo nome: com um
     ícone alternativo escolhido, o expo-alternate-app-icons desliga a
     MainActivity e deixa só o alias do ícone — e um link procurado pelo
     filtro dela não acharia ninguém. O expo-router leva à rota, e a rota
     do documento passa pelas trancas do _layout mesmo antes do cadastro. */
const comoAbrir = (endereco) =>
  endereco.startsWith('https://')
    ? `Intent(Intent.ACTION_VIEW, Uri.parse("${endereco}"))
      .addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)`
    : `(packageManager.getLaunchIntentForPackage(packageName) ?: Intent().setPackage(packageName))
      .setAction(Intent.ACTION_VIEW)
      .setData(Uri.parse("${endereco}"))
      .addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)`;

const kotlin = (pacote, endereco) => `package ${pacote}

import android.app.Activity
import android.content.Intent
import android.net.Uri
import android.os.Bundle

// Gerado por plugins/politica-no-health-connect.js. Não editar aqui: a
// pasta android/ é refeita a cada prebuild.
class ${CLASSE} : Activity() {
  override fun onCreate(savedInstanceState: Bundle?) {
    super.onCreate(savedInstanceState)
    val politica = ${comoAbrir(endereco)}
    try {
      startActivity(politica)
    } catch (e: Exception) {
      // Sem quem abra o endereço, sai sem nada — melhor que derrubar o app.
    }
    finish()
  }
}
`;

const withAtividade = (config, politica) =>
  withDangerousMod(config, [
    'android',
    async (config) => {
      const pacote = config.android?.package;
      if (!pacote) throw new Error('politica-no-health-connect: falta android.package em app.json');
      const pasta = path.join(
        config.modRequest.platformProjectRoot, 'app', 'src', 'main', 'java', ...pacote.split('.'),
      );
      fs.mkdirSync(pasta, { recursive: true });
      fs.writeFileSync(
        path.join(pasta, `${CLASSE}.kt`),
        kotlin(pacote, politica || `${esquema(config)}://${ROTA}`),
      );
      return config;
    },
  ]);

module.exports = (config, opcoes = {}) => {
  const politica = opcoes.politica;
  if (politica && !/^https:\/\/[^"\\\s]+$/.test(politica)) {
    throw new Error('politica-no-health-connect: "politica" precisa ser um endereço https');
  }
  return withAtividade(withPortas(config), politica);
};
