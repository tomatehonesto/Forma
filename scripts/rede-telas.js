/* ============================================================
   A REDE DAS TELAS — o que o congelamento não alcança

   ⚠️⚠️ `congelar.ts` NÃO ABRE TELA NENHUMA. Ele chama funções puras de
   logic/, e é por isso que roda sem navegador. As 1.175 frases que ainda
   estão em src/app/ e src/ui/ passam longe dele: não há como provar que
   uma tela não mudou sem renderizar a tela.

   Esta é a rede delas. A invariante é a mesma do congelamento — o texto
   renderizado tem de ser BYTE A BYTE idêntico antes e depois da extração
   — e o método é o mais burro que funciona: navegar por todas as rotas e
   guardar o `innerText` de cada uma.

   COMO USAR. Com `npm run web` de pé, no console em localhost:8081:

     eval(await (await fetch('/rede-telas.js?v=' + Math.random())).text());
     await guardarBase();     // antes de mexer no código
     …extrai um lote…
     await comparar();        // depois

   `comparar()` devolve só as telas que mudaram, com a primeira linha
   diferente de cada uma. Diferença nenhuma é a única saída aceitável — e
   diferença é erro de extração, não melhoria de texto. Melhoria de texto
   é outro commit.

   ⚠️⚠️ DEPOIS DE UM `git stash`, RECARREGUE A PÁGINA ANTES DE COMPARAR.

   O jeito honesto de tirar a base é tirá-la do código ANTERIOR: guardar a
   extração com `git stash -u`, rodar guardarBase(), devolver com
   `stash pop`, rodar comparar().

   Só que o stash APAGA os arquivos novos do catálogo, e o Metro guarda no
   grafo dele a versão que existia enquanto eles não existiam. Ao voltar,
   a recarga a quente não refaz esse pedaço: uma chave nova vem
   `undefined` num aplicativo que compila sem um erro, a tela quebra, e a
   partir dela TODAS as rotas seguintes voltam vazias. O diff acusa
   sessenta telas e nenhuma delas mudou.

   Uma recarga completa — location.reload(), ou navegar de fora — refaz o
   grafo e resolve. Aconteceu de verdade, na primeira vez que este ciclo
   rodou.

   ⚠️ A BASE VIVE NO localStorage, e não numa variável. Salvar um arquivo
   recarrega a página pelo Metro, e uma variável de `window` morre no
   recarregamento — a base tem de sobreviver exatamente ao evento que
   torna a comparação necessária.

   ⚠️ A NAVEGAÇÃO É POR pushState, e não por location.href. Trocar o href
   recarrega a página, e recarregar perde o laço — o dump pararia na
   primeira rota. O expo-router escuta `popstate`, então empurrar o
   histórico e disparar o evento navega do lado do cliente, com o
   contexto de JS vivo do começo ao fim.

   ⚠️⚠️ E OS PARÂMETROS SAEM DO ESTADO SALVO, e não de uma lista escrita
   aqui. Sete telas não renderizam nada sem `?t=` ou `?id=`, e um carimbo
   de tempo escrito à mão envelhece na primeira vez que a semente for
   regerada — a tela voltaria vazia, a rede diria "idêntico", e o que ela
   estaria dizendo é "não testei nada". É o mesmo buraco que deixou a
   migração da concordância passar sem teste em logic/formas.

   ⚠️ O QUE ESTA REDE AINDA NÃO COBRE, e que é preciso conferir à mão:

   - `/conquista-ok`, que só aparece quando há nível novo não visto. Com a
     semente de demonstração ela nasce vazia, e enchê-la seria escrever no
     estado — coisa que uma rede de leitura não faz.
   - FOLHAS E MODAIS, que só abrem com toque. O que estiver dentro de um
     bottom sheet fechado não está no `innerText`.
   - OS ESTADOS QUE A SEMENTE NÃO PRODUZ. A semente tem clínica parceira,
     então /assinatura abre sempre no caso isento e os outros dois — quem
     assina, quem não tem nada — nunca apareciam. É o mesmo buraco de
     sempre: a rede dizia "idêntico" sobre um terço da tela. Os atalhos de
     desenvolvimento que a própria tela oferece são a porta, e por isso
     entram na lista de rotas.
   - OS PASSOS DO CADASTRO QUE NÃO SÃO ESCOLHER DE UMA LISTA NEM DIGITAR.
     Essas duas o andador faz; régua arrastada e calendário ele não sabe
     operar, e a caminhada para ali.
   ============================================================ */

/* eslint-disable no-undef */

const ESPERA = 550;
const CHAVE = 'norte.v1';

const dorme = (ms) => new Promise((s) => setTimeout(s, ms));

function estadoSalvo() {
  try {
    const cru = JSON.parse(localStorage.getItem(CHAVE));
    return cru?.state?.S ?? cru?.S ?? cru ?? {};
  } catch {
    return {};
  }
}
/* ⚠️⚠️ O CAMPO DE TEXTO NÃO ACEITA `el.value = x`. O React guarda o valor
   anterior e, vendo a propriedade mexida por fora, conclui que nada
   mudou: o `onChange` não dispara, o passo não libera o "Continuar", e o
   andador acha que chegou ao fim do cadastro no terceiro passo.

   Escrever pelo setter nativo do protótipo é o que o React enxerga. */
function escreve(el, v) {
  const proto = el.tagName === 'TEXTAREA' ? HTMLTextAreaElement : HTMLInputElement;
  Object.getOwnPropertyDescriptor(proto.prototype, 'value').set.call(el, v);
  el.dispatchEvent(new Event('input', { bubbles: true }));
  el.dispatchEvent(new Event('change', { bubbles: true }));
}

/* ⚠️⚠️ O TOQUE NÃO É `.click()`. O React Native Web não emite `<button>`
   nem `role="button"`: um Pressable vira uma `<div>` com `tabindex="0"` e
   a classe `r-touch`. Um `click()` na folha de texto não sobe até o
   manipulador, e a tela não anda — foi assim que a primeira versão desta
   rede andou dois passos do cadastro e achou que tinha acabado.

   Então: acha a folha pelo texto, sobe até o Pressable, e dispara a
   sequência inteira de ponteiro. */
function toca(re) {
  const folha = [...document.querySelectorAll('*')]
    .filter((e) => !e.children.length && re.test((e.textContent || '').trim())).pop();
  if (!folha) return null;
  let n = folha;
  while (n && !(n.getAttribute
    && (n.getAttribute('tabindex') === '0' || /r-touch/.test(String(n.className || ''))))) {
    n = n.parentElement;
  }
  const alvo = n || folha;
  for (const tipo of ['pointerdown', 'mousedown', 'pointerup', 'mouseup', 'click']) {
    const E = tipo.startsWith('pointer') ? PointerEvent : MouseEvent;
    alvo.dispatchEvent(new E(tipo, { bubbles: true, cancelable: true, composed: true }));
  }
  return (folha.textContent || '').trim().slice(0, 40);
}

/** As rotas que só existem com parâmetro, com o parâmetro vindo do estado. */
function rotasComParametro() {
  const S = estadoSalvo();
  const prim = (lista, campo = 't') => (S?.[lista] ?? [])[0]?.[campo];
  const com = (rota, valor) => (valor === undefined || valor === '' ? null : rota + valor);
  return [
    com('/consulta?t=', prim('consultsHistory')),
    com('/prescricao?t=', prim('prescriptions')),
    com('/refeicao?t=', prim('meals')),
    com('/nota?t=', prim('notes')),
    com('/dia?t=', prim('checkins')),
    com('/favorito?nome=', encodeURIComponent((S?.favMeals ?? [])[0]?.nome ?? '')),
    '/documento?id=termos',
    '/documento?id=privacidade',
    '/alimento?id=peito-frango',
    /* ⚠️ `peso` É FAMÍLIA, E NÃO TRILHA. As trilhas são `doses`,
       `checkins`, `kg` — e `?id=peso` devolve tela vazia calada. */
    '/trilha?id=checkins',
    '/trilha?id=doses',
    '/marcador?m=peso',
    '/registro-ok?tipo=peso',
    '/meta?alvo=proteina',
    /* ⚠️ OS ATALHOS DE DESENVOLVIMENTO SÃO A ÚNICA PORTA para os estados
       que a semente não produz. A tela de assinatura tem três casos e a
       semente só monta um. */
    '/assinatura?assinante=1&compra=1',
    '/assinatura?compra=1',
    '/planos?compra=1',
  ].filter(Boolean);
}

const ROTAS_SIMPLES = ['/', '/jornada', '/cuidado', '/insights'].concat(
  ('acompanhamento,agua,ajuda,alerta,alimentacao,alimentos,anotar-consulta,aparencia,'
   + 'aplicacao-ok,aplicacao,aplicacoes,assinatura,biblioteca,cancelar,caneta-nova,'
   + 'caneta,checkin-ok,checkin,ciclo,clinica,cobrancas,codigo,companion,conquistas,consultas,'
   + 'conversa,dados,especialista,evolucao,exames,exercicio,exportar,historico,idioma,'
   + 'integracoes,lembretes,medico,medir-agua,medir-anotacao,medir-exame,medir-exercicio,'
   + 'medir-medidas,medir-peso,medir-refeicao,meta-clinica,metas,notas,notificacoes,parceiros,'
   + 'perfil,plano,planos,privacidade,protocolo,protocolos,registrar,registro,restricao,'
   + 'resumo-medico,ritmo,saude,semana,sintomas,suspenso,treino,unidades')
    .split(',').map((r) => '/' + r),
);

const AVANCA = /^(continuar|avançar|começar|próximo|próxima|pronto|concluir|entendi e concordo)$/i;

/* ⚠️⚠️ O RELÓGIO ANDA ENTRE AS DUAS EXECUÇÕES, e uma tela que mostra a
   hora atual produz diferença sem ninguém ter mexido em nada. A primeira
   comparação desta rede acusou /aplicacao porque "Fica registrada agora,
   20:50" virou "20:54".

   Hora e segundo viram máscara. A DATA não — "13 de julho de 2026" é
   texto formatado, é o que a extração pode quebrar, e mascará-la seria
   abrir o buraco que esta rede existe para fechar. */
const semRelogio = (txt) => txt.replace(/\b\d{1,2}:\d{2}(:\d{2})?\b/g, 'HH:MM');

async function vai(rota) {
  history.pushState({}, '', rota);
  window.dispatchEvent(new PopStateEvent('popstate', { state: {} }));
  await dorme(ESPERA);
}

/* ⚠️⚠️ O CADASTRO RENDERIZA UM PASSO POR VEZ, e é a maior tela do
   aplicativo — noventa e quatro frases. Sem andar por ele, a rede cobre
   um catorze avos dela e diz que está tudo bem.

   Anda respondendo: em cada passo toca no primeiro Pressable que não seja
   o de avançar, e depois no de avançar. Para quando o texto repete, que é
   o sinal de que o passo pediu algo que esta rede não sabe dar. */
async function passosDoCadastro(max = 20) {
  const passos = {};
  await vai('/cadastro');
  let anterior = '';
  for (let i = 0; i < max; i += 1) {
    const txt = semRelogio(document.body.innerText);
    if (txt === anterior) break;
    passos['/cadastro#' + String(i).padStart(2, '0')] = txt;
    anterior = txt;

    for (const campo of document.querySelectorAll('input, textarea')) {
      if (campo.value) continue;
      const num = campo.type === 'number' || campo.inputMode === 'numeric' || campo.inputMode === 'decimal';
      escreve(campo, num ? '70' : 'Teste');
    }

    const opcoes = [...document.querySelectorAll('[tabindex="0"]')]
      .map((e) => (e.textContent || '').trim())
      .filter((t) => t && !AVANCA.test(t));
    if (opcoes.length) toca(new RegExp('^' + opcoes[0].replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '$'));
    await dorme(180);

    if (!toca(AVANCA)) break;
    await dorme(ESPERA);
  }
  return passos;
}

/* ⚠️⚠️ ANDAR NO CADASTRO ESCREVE NO ESTADO, e o estado é a semente de que
   todas as outras telas dependem. Sem guardar e devolver, a segunda
   execução da rede leria um aplicativo diferente do da primeira, e o
   diff acusaria diferença em telas que ninguém tocou.

   Guarda a string crua — não o objeto —, porque é ela que o aplicativo
   lê de volta. */
async function redeDeTelas() {
  const salvo = localStorage.getItem(CHAVE);
  const dump = {};
  try {
    const rotas = ROTAS_SIMPLES.concat(rotasComParametro()).sort();
    for (const r of rotas) {
      await vai(r);
      dump[r] = semRelogio(document.body.innerText);
    }
    Object.assign(dump, await passosDoCadastro());
  } finally {
    if (salvo !== null) localStorage.setItem(CHAVE, salvo);
  }
  window.__NET = dump;
  const vazias = Object.entries(dump).filter(([, t]) => t.length < 60).map(([r]) => r);
  console.log(`${Object.keys(dump).length} telas · ${JSON.stringify(dump).length} caracteres`);
  if (vazias.length) console.warn('VAZIAS, e uma rede que não vê não é rede:', vazias);
  return dump;
}

/* ⚠️ A BASE NÃO MORA EM `norte.v1`. Chave própria, para a rede não
   escrever no estado que ela mesma está medindo. */
const BASE = '__rede.base';

async function guardarBase() {
  const d = await redeDeTelas();
  localStorage.setItem(BASE, JSON.stringify(d));
  console.log('base guardada:', Object.keys(d).length, 'telas');
  return Object.keys(d).length;
}

/* ⚠️⚠️ DEVOLVE A PRIMEIRA LINHA DIFERENTE, e não o texto inteiro. Uma tela
   grande são três mil caracteres, e ler oitenta e nove delas para achar
   uma vírgula é o que faz alguém parar de rodar a rede. O que interessa
   no diff é onde ele começa. */
async function comparar() {
  const antes = JSON.parse(localStorage.getItem(BASE) || '{}');
  if (!Object.keys(antes).length) return 'sem base — rode guardarBase() primeiro';
  const depois = await redeDeTelas();

  const mudou = [];
  for (const rota of new Set([...Object.keys(antes), ...Object.keys(depois)])) {
    const a = antes[rota];
    const b = depois[rota];
    if (a === b) continue;
    if (a === undefined) { mudou.push({ rota, nota: 'rota nova na rede' }); continue; }
    if (b === undefined) { mudou.push({ rota, nota: 'rota sumiu da rede' }); continue; }
    const la = a.split('\n');
    const lb = b.split('\n');
    const i = la.findIndex((l, k) => l !== lb[k]);
    mudou.push({ rota, linha: i, antes: la[i], depois: lb[i] });
  }
  console.log(mudou.length ? mudou : 'IDÊNTICO — ' + Object.keys(depois).length + ' telas');
  return mudou.length ? mudou : 'IDÊNTICO';
}

window.toca = toca;
window.redeDeTelas = redeDeTelas;
window.guardarBase = guardarBase;
window.comparar = comparar;
