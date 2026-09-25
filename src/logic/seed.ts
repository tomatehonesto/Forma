/** Claro, escuro, ou o que o telefone estiver usando. */
export type Tema = 'light' | 'dark' | 'system';

/* SEED — paciente coerente (Mariana, ~semana 10 de tratamento). Porta verbatim do protótipo. */
import { daysAgo, addDays, startOfDay, now, semanaDoTratamento, DAY } from './time';
import { indicadorDe, M, doseCycle, RENOVAR_COM } from './derive';
import { nomeItem, somaDe, type ItemComida } from './prato';
import { marcarComoVistas, conquistas, feitas } from './conquistas';
import { formaDe } from './formas';
import type { Notificacao, FaseDoCiclo } from './notificacoes';
import { PALETAS } from '../theme';
import type { Forma } from './meds';
import type { Sistema } from './medidas';
import type { Local } from './local';
import { sistemaDe } from './medidas';
import { carimbar, novoRid } from './identidade';
import type { OrigemDaPergunta } from './perguntas';
import { T, NOMES_DAS_PERSONAS } from '../textos';

export const HEIGHT = 1.67;

/* O que o aplicativo sabe de quem acompanha. Com rede parceira a ficha
   vem inteira da clínica; de médico próprio, só o que a pessoa digitou —
   ver o comentário de `semente` em src/textos/pt-BR. */
type FichaDaMedica = {
  crm?: string; especialidade?: string; anos?: number; pacientes?: number;
  rating?: number; avaliacoes?: number; sobre?: string; abordagens?: string[]; formacao?: string[];
};
type FichaDaClinica = {
  especialidade?: string; cidade?: string; sobre?: string; endereco?: string; horario?: string;
  convenios?: string[]; contato?: { site?: string; email?: string };
};

/** A conta dona do diário deste aparelho, no servidor. */
export type ContaDoDiario = { id: string; email?: string };

export function buildSeed() {
  const med = 'mounjaro';
  /* ⚠️⚠️ A PERSONA SAI DO CATÁLOGO, e é lida uma vez, aqui. Cada idioma
     tem a sua — a Mariana é a brasileira; a alemã é a Julia, com médica
     própria em outra cidade. Ver src/textos/pt-BR/semente.ts e o item 27
     do PENDENCIAS.

     ⚠️ A CÓPIA PROFUNDA É DE PROPÓSITO. O estado não pode guardar os
     mesmos arrays do catálogo: a primeira edição de uma nota ou de um
     sintoma escreveria dentro do módulo de textos, e a próxima semente
     nasceria com ela. */
  const P = JSON.parse(JSON.stringify(T.semente)) as typeof T.semente;
  const comRede = P.redeParceira;
  /* Refeição e treino são gravados com o rótulo do catálogo, como o
     aplicativo grava um registro novo — ver medir-refeicao e
     logic/modalidades. */
  const MOM = T.alimentacao.prato;
  const MOD = T.aviso.modalidades;
  const RELOGIO = T.aviso.appleSaude;
  /* Pesos: 82,4 -> 75,1 em ~70 dias.
     A curva tem platô e duas semanas de leve ganho de propósito. Perda com
     GLP-1 não é linear, e um seed em linha reta contradiz o que o próprio
     app diz à paciente sobre semanas paradas. */
  const wpts = [[70, 82.4], [63, 81.2], [56, 80.3], [49, 80.9], [42, 79.6], [35, 78.8], [28, 79.5], [21, 78.1], [14, 77.0], [10, 77.7], [7, 76.3], [3, 75.5], [0, 75.1]];
  const weights = wpts.map(([d, k]) => ({ t: +daysAgo(d), kg: k }));
  // aplicações semanais: 4×2.5mg depois 5mg; última há 4 dias
  const injDays = [67, 60, 53, 46, 39, 32, 25, 18, 11, 4];
  const sites = ['abd-e', 'abd-d', 'coxa-e', 'coxa-d', 'braco-e', 'braco-d'];
  const injections = injDays.map((d, i) => ({ t: +daysAgo(d), med, dose: i < 4 ? 2.5 : 5, site: sites[i % 6], note: '' }));
  /* Check-ins dos últimos 13 dias — hoje fica pendente de propósito,
     para a home abrir com o convite de responder.

     Mas HOJE tem um registro mesmo assim, só com os acumuladores: o
     almoço da semente é de hoje, e refeição registrada move a proteína
     do dia. Sem esta linha a tela de refeição abria dizendo "0 de 90 g"
     com uma pastilha de 30 g do lado — duas versões do mesmo dia na
     mesma tela. Um registro só com agua/prot/exerc não conta como
     check-in respondido (ver respostaNoDia), então o convite continua
     de pé. */
  /* O CARDÁPIO — as refeições de cada dia, e a proteína que vem delas.

     A semente tinha TRÊS refeições ao todo, todas nos dois últimos dias.
     Com isso o caderno de alimentação abria com um dia cheio e vinte e
     nove vazios, e a proteína do dia era um número solto no check-in que
     não batia com refeição nenhuma — duas versões do mesmo dia.

     Aqui a ordem se inverte: o dia tem refeições, e `prot` é a SOMA
     delas. Uma fonte por campo, inclusive na semente. */
  const CARDAPIO: { name: string; itens: ItemComida[]; h: number }[] = [
    { name: MOM.cafeDaManha, h: 8, itens: [{ id: 'ovo-frito', qtd: 2 }, { id: 'pao-integral', qtd: 2 }] },
    { name: MOM.cafeDaManha, h: 8, itens: [{ id: 'iogurte', qtd: 1 }, { id: 'whey', qtd: 1 }] },
    { name: MOM.almoco, h: 12.5, itens: [{ id: 'peito-frango', qtd: 1 }, { id: 'arroz-integral', qtd: 4 }, { id: 'salada-folhas', qtd: 1 }] },
    { name: MOM.almoco, h: 12.5, itens: [{ id: 'patinho', qtd: 1 }, { id: 'arroz', qtd: 4 }, { id: 'legumes', qtd: 1 }] },
    { name: MOM.jantar, h: 19.5, itens: [{ id: 'salmao', qtd: 1 }, { id: 'brocolis', qtd: 1 }] },
    { name: MOM.jantar, h: 19.5, itens: [{ id: 'omelete', qtd: 1 }, { id: 'queijo-minas', qtd: 1 }] },
    { name: MOM.lanche, h: 16, itens: [{ id: 'queijo-minas', qtd: 1 }] },
  ];

  /* Hoje entra pela metade de propósito: um dia em andamento é o estado
     em que a tela é aberta, e é o único que mostra o "faltam X g". */
  const refeicoesDe = (d: number) => {
    if (d === 0) return [CARDAPIO[0], CARDAPIO[2]];
    const r = [CARDAPIO[d % 2]];
    if (d % 7 !== 3) r.push(CARDAPIO[2 + (d % 2)]);
    if (d % 5 !== 1) r.push(CARDAPIO[4 + (d % 2)]);
    if (d % 4 === 0) r.push(CARDAPIO[6]);
    return r;
  };
  /* Os gramas saem dos ITENS, pela mesma tabela que a tela usa. Um número
     fixo ao lado da lista seria um segundo lugar dizendo quanta proteína
     o prato tem, e ele divergiria no dia em que a TACO fosse corrigida. */
  const protDoDia = (d: number) => refeicoesDe(d).reduce((x, m) => x + somaDe(m.itens), 0);

  /* Da mais recente para a mais antiga, que é a ordem em que a lista lê
     e a mesma em que o registro novo entra (unshift). */
  const meals: any[] = [];
  for (let d = 0; d <= 55; d++) {
    const base = +startOfDay(daysAgo(d));
    refeicoesDe(d)
      .slice()
      .reverse()
      .forEach((m, k) => {
        meals.push({
          t: base + Math.round(m.h * 3600000),
          name: m.name,
          tag: m.itens.map(nomeItem).filter(Boolean).join(', '),
          g: somaDe(m.itens),
          /* Com os itens guardados, corrigir a refeição abre o prato do
             jeito que ele foi montado em vez de uma folha em branco. */
          itens: m.itens,
          /* Uma em cada quatro veio da câmera: sem a mistura, a linha de
             origem só existiria numa das duas formas. */
          fonte: (d + k) % 4 === 0 ? 'foto' : 'manual',
        });
      });
  }
  /* ⚠️ E DE FATO NA ORDEM, dentro do dia também. O cardápio não está em
     ordem de hora — o lanche das 16h vem depois do jantar das 19h30 —, e
     inverter o dia deixava o lanche antes do jantar. É a ordem que a
     sincronia usa para pôr no lugar uma refeição que chega de outro
     aparelho (ver logic/traducao), e a semente tem de estar nela. */
  meals.sort((a, b) => b.t - a.t);

  /* A ÁGUA, GOLE A GOLE.

     A semente escrevia só o total do dia — "7 copos" — e era exatamente o
     formato antigo que golesDoDia existe para tolerar: o caderno de água
     abriria com uma linha sem hora em todos os treze dias, contando a
     história de um app que ainda não guardava goles. Semente não é dado
     legado; ela é o app funcionando.

     QUATRO DIAS POSSÍVEIS, do mais seco ao que bate a meta. O dia de
     semana bebe melhor que o fim de semana — sem a garrafa da mesa de
     trabalho, bebe-se menos e mais tarde. */
  const AGUA: Record<string, [number, number][]> = {
    seco: [[9.7, 250], [13.2, 500], [19, 250]],                                              // 1 L
    meio: [[10.3, 250], [13.5, 500], [17, 250], [21, 250]],                                  // 1,25 L
    bom: [[7.3, 250], [9.8, 250], [12.5, 500], [15.7, 250], [18.3, 250], [21.2, 250]],       // 1,75 L
    otimo: [[7.2, 250], [9.5, 250], [11.8, 500], [14.3, 250], [16.5, 500], [18.6, 250], [21, 500]], // 2,5 L
  };
  const ESCALA = ['seco', 'meio', 'bom', 'otimo'];
  /* COMO CADA SEMANA FOI, da atual para trás. Não é uma linha reta: tem
     semana boa, semana de viagem e semana em que ninguém lembrou de
     encher a garrafa — que é como hidratação funciona de verdade, e é o
     que dá o que mostrar no histórico do protocolo. Uma semente que
     repetisse o mesmo dia cinquenta vezes faria a tela de semanas
     anteriores parecer quebrada. */
  const NIVEL_DA_SEMANA = ['bom', 'bom', 'otimo', 'meio', 'bom', 'otimo', 'seco', 'meio', 'bom'];
  const golesDe = (d: number) => {
    const wd = daysAgo(d).getDay();
    const base = NIVEL_DA_SEMANA[Math.min(Math.floor(d / 7), NIVEL_DA_SEMANA.length - 1)];
    const i = Math.max(0, ESCALA.indexOf(base) - (wd === 0 || wd === 6 ? 1 : 0));
    return AGUA[ESCALA[i]];
  };
  /* Hoje entra pela metade: dois copos da manhã, e o resto do dia por
     acontecer. Zerado, o caderno de água abriria vazio no único dia em
     que a pessoa vai olhar primeiro. */
  const GOLES_HOJE: [number, number][] = [[7.5, 250], [10.2, 250]];
  /* A lista é que manda, e o total sai dela. Escrever os dois à mão faria
     a barra do dia discordar do caderno na primeira vez que alguém
     mexesse num horário. Um copo são 250 ml — o mesmo CUP_ML que derive
     usa para traduzir copos em litros. */
  const emGoles = (base: number, gs: [number, number][]) =>
    gs.map(([h, ml]) => ({ t: base + Math.round(h * 3600000), ml }));
  const coposDe = (gs: [number, number][]) => gs.reduce((x, [, ml]) => x + ml, 0) / 250;

  const checkins: any[] = [
    {
      t: +startOfDay(daysAgo(0)),
      agua: coposDe(GOLES_HOJE), aguas: emGoles(+startOfDay(daysAgo(0)), GOLES_HOJE),
      prot: protDoDia(0), exerc: 0,
    },
  ];

  /* AS SESSÕES DE EXERCÍCIO — por dias atrás.

     Antes o exercício da semente era `30 min` em seis dias fixos, sem
     modalidade e sem origem, e só nas duas últimas semanas. Isso deixava
     duas telas mentindo sobre si mesmas: o caderno de treino abria
     sempre vazio, e a curva de oito semanas era seis semanas em zero
     seguidas de dois degraus iguais — uma rampa, não um histórico. Quem
     treina de verdade tem semana boa, semana fraca e semana de viagem, e
     é essa variação que a curva existe para mostrar.

     A origem também é da semente: sem uma mistura de registro manual e
     integração, a linha "de onde veio" nunca aparece nas duas formas. */
  /* ⚠️ O NOME É O DA TABELA DE MODALIDADES, lido do catálogo. Era
     "Bicicleta" escrito aqui enquanto a tabela diz "Bike" — o treino não
     casava com modalidade nenhuma e saía com o ícone genérico. */
  const SESSOES: Record<number, { tipo: string; min: number; fonte?: string }[]> = {
    55: [{ tipo: MOD.musculacao, min: 45 }],
    53: [{ tipo: MOD.corrida, min: 30, fonte: RELOGIO }],
    50: [{ tipo: MOD.musculacao, min: 45 }],
    47: [{ tipo: MOD.caminhada, min: 35, fonte: RELOGIO }],
    44: [{ tipo: MOD.musculacao, min: 30 }],
    41: [{ tipo: MOD.musculacao, min: 50 }],
    39: [{ tipo: MOD.bike, min: 40, fonte: RELOGIO }],
    37: [{ tipo: MOD.musculacao, min: 40 }],
    35: [{ tipo: MOD.caminhada, min: 20, fonte: RELOGIO }],
    33: [{ tipo: MOD.corrida, min: 35, fonte: RELOGIO }],
    30: [{ tipo: MOD.musculacao, min: 60 }],
    27: [{ tipo: MOD.musculacao, min: 55 }],
    25: [{ tipo: MOD.natacao, min: 45 }],
    23: [{ tipo: MOD.corrida, min: 35, fonte: RELOGIO }],
    21: [{ tipo: MOD.musculacao, min: 40 }],
    19: [{ tipo: MOD.musculacao, min: 50 }],
    17: [{ tipo: MOD.caminhada, min: 25, fonte: RELOGIO }],
    15: [{ tipo: MOD.pilates, min: 35 }],
    12: [{ tipo: MOD.musculacao, min: 40 }],
    10: [{ tipo: MOD.caminhada, min: 30, fonte: RELOGIO }],
    8: [{ tipo: MOD.corrida, min: 35, fonte: RELOGIO }],
    5: [{ tipo: MOD.musculacao, min: 80 }],
    3: [{ tipo: MOD.pilates, min: 40 }],
    1: [{ tipo: MOD.corrida, min: 30, fonte: RELOGIO }],
  };
  const minDoDia = (d: number) => (SESSOES[d] || []).reduce((x, tr) => x + tr.min, 0);

  /* OS DIAS LOGO APÓS APLICAR, contados a partir das aplicações de verdade.

     A lista era escrita à mão — [3, 4, 5, 10, 11, 12] — e não batia com
     injDays: o dia 12 e o dia 5 caem no SEXTO dia depois da aplicação,
     que é o vale do ciclo, e mesmo assim recebiam enjoo de dia de dose.
     Enquanto ninguém cruzava as duas colunas, o erro não aparecia; a
     tela de sintomas cruza, e passaria a dizer que o enjoo desta pessoa
     pesa no fim da semana. Semente que contradiz a própria história é o
     mesmo que dado inventado — só que mais difícil de achar. */
  const desdeAplicacao = (d: number) => {
    const antes = injDays.filter((x) => x >= d);
    return antes.length ? Math.min(...antes) - d : 99;
  };

  for (let d = 13; d >= 1; d--) {
    const date = daysAgo(d); const wd = date.getDay();
    const postInj = desdeAplicacao(d) <= 2;
    checkins.push({
      t: +startOfDay(date),
      mood: 3 + (13 - d > 6 ? 1 : 0) + (wd === 0 ? -1 : 0),
      fome: postInj ? 3 : (d % 7 < 2 ? 7 : 5),
      nausea: postInj ? 4 : 1,
      sono: wd === 0 || wd === 6 ? 7.5 : (d % 3 === 0 ? 6 : 7),
      gut: postInj ? 'preso' : 'normal',
      energia: postInj ? 5 : 7,
      agua: coposDe(golesDe(d)),
      aguas: emGoles(+startOfDay(date), golesDe(d)),
      prot: protDoDia(d),
      exerc: minDoDia(d),
      treinos: SESSOES[d],
      /* Sem `ansiedade`: o check-in não pergunta isso em lugar nenhum, e
         a coluna só existia porque a tela de sintomas a mostrava. Semente
         é retrato do que o app coleta — coluna que nenhuma tela escreve é
         dado que nenhum usuário vai ter. */
      refluxo: postInj ? 1 : 0, constip: postInj ? 2 : 0,
    });
  }
  /* As semanas anteriores entram só com ACUMULADORES — nem humor, nem
     sono, nem fome. Um registro que tem apenas acumuladores não conta
     como check-in respondido, então a sequência e a contagem do mês
     continuam falando das duas semanas que a pessoa de fato preencheu.
     Inventar dois meses de check-in completo para encher um gráfico seria
     pagar a curva com um histórico falso em cinco outras telas.

     E a água entra junto, que antes não entrava. Ela é acumulador como
     proteína e exercício, e ficava de fora sem motivo: quarenta e dois
     dias com prato e treino registrados e nenhuma gota d'água é retrato
     de ninguém. Era também o que deixava o caderno de água vazio antes de
     duas semanas atrás, e o histórico do protocolo sem o que contar. */
  for (let d = 55; d >= 14; d--) {
    const base = +startOfDay(daysAgo(d));
    checkins.push({
      t: base,
      agua: coposDe(golesDe(d)),
      aguas: emGoles(base, golesDe(d)),
      prot: protDoDia(d),
      exerc: minDoDia(d),
      treinos: SESSOES[d],
    });
  }

  /* EM ORDEM, DO MAIS ANTIGO PARA HOJE — e isto conserta oito lugares
     de uma vez.

     O array nascia embaralhado: hoje primeiro, depois as duas últimas
     semanas, depois os quarenta dias anteriores. E meia dúzia de funções
     escreve `checkins.slice(-14)` querendo dizer "os catorze dias mais
     recentes" — o radar, as metas, o resumo médico, o ritmo, os
     sintomas, a série de equilíbrio. Todas pegavam o rabo do array, que
     era o bloco MAIS ANTIGO.

     O efeito era visível e mudo: a tela de metas dizia "sem noites
     registradas ainda" com treze noites registradas, porque as catorze
     linhas do fim são justamente as que só têm acumulador.

     Dava para corrigir as oito chamadas. Ordenar aqui é melhor: o array
     passa a ser o que todo mundo já achava que ele era, e um registro
     novo — que é sempre de hoje — continua entrando no fim, no lugar
     certo. */
  checkins.sort((a, b) => a.t - b.t);

  return {
    profile: {
      name: P.nome, med, dose: 5, startWeight: 82.4, goalWeight: 68, height: HEIGHT,
      startT: +daysAgo(70), doctor: P.medica, clinic: P.clinica,
      /* ⚠️ EM QUE FORMA ELA APLICA — e a semente NÃO responde, de
         propósito.

         Quem já usava o aplicativo antes disto existir também não tem o
         campo, e não vai ser levado de volta ao cadastro para ganhar um.
         Deixando a semente sem resposta, o caminho de quem não respondeu
         é o caminho padrão do desenvolvimento — e não um caso de borda
         que ninguém exercita e que quebra na primeira pessoa real.

         Quem lê isto lê por `formaDe(S)`, em logic/formas, que cai no que
         o catálogo diz do medicamento. O tipo precisa do campo; o valor,
         não. */
      forma: undefined as Forma | undefined,
      /* ⚠️ EM QUE UNIDADES ELA LÊ — e a semente também não responde, pelo
         mesmo motivo do campo acima: o caminho de quem não respondeu é o
         caminho padrão do desenvolvimento, e não um caso de borda que
         ninguém exercita. Quem lê usa `sistemaDe(S)`, em logic/medidas,
         que cai em métrico. */
      sistema: undefined as Sistema | undefined,
      /* ⚠️ EM QUE IDIOMA ELA LÊ — e a semente também não responde. Sem
         resposta, quem manda é o aparelho, e depois dele o mercado do
         build. Ver logic/local. */
      idioma: undefined as Local | undefined,
      /* O VÍNCULO, que nasce junto com o código e não depois dele.

         `convite` é o que a pessoa escreveu; `vinculo` é o que o
         aplicativo fez com isso. Os dois se criam no mesmo toque, porque
         quem tem o código recebeu o código da clínica — não há nada para
         a clínica confirmar depois. Ver src/logic/assinatura.ts, em
         `vinculoDoConvite`, e MODOS.md.

         A semente não passou por essa porta: ela chega com o vínculo
         pronto, de setenta dias atrás, e por isso não tem `convite`. É de
         propósito — os dois campos precisam saber viver um sem o outro.

         ⚠️ E SÓ A PERSONA BRASILEIRA TEM. A rede parceira não existe fora
         do Brasil; as outras se tratam com médico próprio, e sem vínculo
         as doze telas que perguntam `clinicaConectada` caem sozinhas no
         caminho de quem não tem plataforma do outro lado. */
      vinculo: (comRede ? { desde: +daysAgo(70) } : null) as { desde: number } | null,
      /* ⚠️ A FICHA DA CLÍNICA, e ela é OPCIONAL de ponta a ponta.

         `clinic` guarda o nome e já existia; isto é o resto — o que a
         clínica diria de si para alguém que chega por ela. Nenhum campo é
         obrigatório, porque o aplicativo também serve quem se trata com
         um profissional sozinho, sem clínica nenhuma.

         ⚠️ E NÃO HÁ TELEFONE, SITE NEM ENDEREÇO. Inventar um CRN na
         semente é inofensivo; inventar um telefone é fazer alguém ligar
         para a casa de um estranho. Contato entra quando a clínica
         mandar. */
      /* Só com rede parceira: a ficha é o que a clínica diz de si. Fora
         dela não há clínica do outro lado, e a ficha fica vazia. */
      clinicInfo: (comRede ? {
        especialidade: P.clinicaInfo.especialidade,
        cidade: P.clinicaInfo.cidade,
        sobre: P.clinicaInfo.sobre,
        endereco: P.clinicaInfo.endereco,
        horario: P.clinicaInfo.horario,
        /* ⚠️ "PARTICULAR" É UM ITEM DA LISTA, e não a ausência dela. Clínica
           que não atende convênio nenhum tem uma lista com um item, e não
           uma seção vazia — e quem lê precisa saber a diferença entre "não
           informou" e "só atende particular". */
        convenios: P.clinicaInfo.convenios,
        /* ⚠️ SEM TELEFONE E SEM WHATSAPP, DE PROPÓSITO. O campo existe e a
           tela sabe desenhá-lo; o que não existe é um número inventado.
           Um CRM falso não faz nada, um telefone falso faz alguém ligar
           para a casa de um estranho — e este aqui ficaria a um toque de
           distância numa linha que disca sozinha.

           Site e e-mail podem: `.example` é TLD reservado (RFC 2606) e
           nunca vai pertencer a ninguém. Para telefone não há reserva
           equivalente, então não há semente. */
        contato: { site: P.clinicaInfo.site, email: P.clinicaInfo.email },
      } : {}) as FichaDaClinica,
      /* COMO ESTA PESSOA SE TRATA — respondido no cadastro, e não
         deduzido de haver um nome guardado.

         'proprio'   alguém acompanha o tratamento desta pessoa
         'nenhum'    escolheu conduzir o tratamento por conta própria

         ⚠️ NÃO EXISTE 'parceiro' AQUI. Chegar por uma clínica da rede é
         outra pergunta do cadastro, e mora em `convite` e `vinculo` —
         quem entra por lá tem acompanhamento por consequência, e
         `temAcompanhamento` resolve isso lendo os dois.

         ⚠️ A TERCEIRA NÃO É A AUSÊNCIA DAS OUTRAS DUAS. Deduzir "não tem
         médico" de "não há nome gravado" junta quem decidiu se tratar
         sozinha com quem só não preencheu o campo — e para a primeira,
         cada menção a consulta e a especialista é o app insistindo numa
         escolha que ela já fez. */
      acompanhamento: 'proprio' as 'proprio' | 'nenhum',
      /* Horizonte do plano que a equipe traçou até a dose de manutenção.
         Não é alta: é até onde a titulação foi programada, e é o número
         que dá sentido a "você está na semana 11". */
      nutri: P.nutri,
      /* A DATA, e não a idade: idade muda sozinha todo aniversário, e um
         número guardado envelhece errado. Quem precisa dela usa idadeDe. */
      nascimento: +new Date(1988, 4, 12),
      /* Como a pessoa se identifica. Não é sexo biológico, e por isso não
         alimenta faixa de exame nem meta de gordura corporal. */
      identidade: 'f',
      /* Vazio quando a aplicação segue a cadência do catálogo. Só quem
         aplica em outro intervalo tem número aqui. */
      intervalo: null as number | null,
      motivacao: 'saude',
      /* kg por semana — o ritmo que a pessoa escolheu perseguir. */
      ritmo: 0.5,
      /* O código de convite de quem chegou por um profissional parceiro.
         Vazio na semente: a Mariana não veio por indicação, e inventar um
         código daria ao app um dado comercial que ninguém emitiu. */
      convite: '',
      /* Ficha da especialista. CRM e tempo de formação não são enfeite: são
         o que separa "alguém está te acompanhando" de "alguém habilitado
         está te acompanhando", e num app que não prescreve nada essa
         distinção é o produto inteiro.

         ⚠️ E ELA INTEIRA SÓ EXISTE COM REDE PARCEIRA. De médico próprio o
         aplicativo sabe o que a pessoa digitou em /acompanhamento — nome,
         especialidade e onde é atendida —, e registro, biografia, anos de
         prática e nota de avaliação seriam números que ninguém forneceu. */
      doctorInfo: (comRede ? {
        crm: P.medicaInfo.registro,
        especialidade: P.medicaInfo.especialidade,
        anos: 12,
        pacientes: 2400,
        rating: 4.9,
        avaliacoes: 128,
        sobre: P.medicaInfo.sobre,
        abordagens: P.medicaInfo.abordagens,
        /* A formação é a parte verificável da ficha, e é ela que separa
           "alguém está te acompanhando" de "alguém habilitado está". */
        formacao: P.medicaInfo.formacao,
      } : { especialidade: P.medicaInfo.especialidade }) as FichaDaMedica,
      /* metas diárias — antes ficavam espalhadas como número fixo no
         código (proteína 90 g em derive, água na constante GOAL_WATER).
         Hoje as três saem daqui, e derive lê o perfil.
         A Home nova trata as três como alvo configurável. */
      /* Sem restrição alimentar — ver src/logic/restricoes.ts. Lista vazia
         quer dizer "come de tudo". */
      restricoes: [],
      targets: { prot: 90, waterMl: 2500, exercMin: 60, bodyFat: 28 },
    },
    weights, injections, checkins,
    /* ============================================================
       A FOTO DE PROGRESSO SAIU DO APLICATIVO — por ora.

       Saíram as duas telas (a de captura e a de antes-e-depois com a
       comparação escrita), o atalho de registrar, a porta na Jornada, a
       confirmação depois de salvar, a trilha de conquista, o evento da
       linha do tempo e o item do filtro.

       ⚠️ O CAMPO FICA, E VAZIO. `S.photos` continua no estado por dois
       motivos: quem já guardou fotos não as perde quando o recurso
       voltar, e nada no aplicativo lê o campo hoje — um array parado não
       custa nada e é o que torna a volta um commit revertido em vez de
       uma migração.

       ⚠️ E A POLÍTICA DE PRIVACIDADE FOI JUNTO. Ela listava "as fotos de
       progresso que você guarda" entre os dados coletados, e documento
       que afirma coletar o que o aplicativo não coleta mais é falso na
       direção que mais importa.
       ============================================================ */
    photos: [],
    /* ONDE QUERO CHEGAR — as metas de vida, e só elas.

       O PESO SAIU DAQUI. Ele era a primeira da lista, numa tela que se
       chamava "metas além do peso" — e continua no app, no lugar certo:
       é o número grande da capa e uma linha dos alvos, onde dá para
       mudar. Na lista ele aparecia uma terceira vez.

       E A PESSOAL PERDEU O "prog: 60". Não existe sessenta por cento de
       caber numa calça: era precisão inventada, parada para sempre num
       número que ninguém tinha como mexer. Ela é o que sempre foi —
       ainda não, ou conseguiu em tal dia. */
    goals: [
      /* ⚠️ ERA UMA META DE SONO, e ela não se cria mais: a folha de nova
         meta virou o lugar das que o aplicativo não mede. A semente é o
         retrato do que ele oferece, então as três aqui são do tipo que
         ainda nasce — e uma delas já conquistada, que é um estado que
         nenhuma outra tela demonstra. */
      /* ⚠️ ERAM TRÊS, e a terceira já foi "Energia 4 ou mais" e depois
         "Comer 90 g de proteína". As duas saíram pelo mesmo motivo: a
         semente é o retrato do que o aplicativo oferece, e nenhuma das
         duas se cria mais na tela de nova meta — energia é coisa que se
         sente, e proteína se ajusta em Os números do dia. */
      { id: 'g3', ic: 'ruler', label: P.metas[0], indicador: null, feita: false, em: null },
      { id: 'g5', ic: 'sun', label: P.metas[1], indicador: null, feita: false, em: null },
      { id: 'g6', ic: 'leaf', label: P.metas[2], indicador: null, feita: true, em: +daysAgo(21) },
    ],
    /* O PROTOCOLO DA SEMANA — cinco itens, duas naturezas.

       Os MEDIDOS trazem só a métrica e o alvo: o texto sai da meta do
       perfil e a contagem sai dos registros. Antes eles vinham com o
       número escrito à mão aqui — "5 de 7 dias" — ao lado de um caderno
       de água que sabia a resposta, e com a meta de 2 L enquanto o perfil
       pedia 2,5 L. Semente não é lugar de guardar conta feita.

       Os MANUAIS trazem o texto, porque não há registro de onde tirar a
       resposta: o app não sabe se a dose foi aplicada nem se o exame foi
       agendado. */
    protocol: {
      /* ONZE, E NÃO DEZ. A Mariana começou há setenta dias, o que dá dia
         71 e semana 11 — o número guardado aqui discordava do que todo o
         resto do app calcula, e a virada de semana abaixo iria corrigi-lo
         no primeiro carregamento, zerando os checks dela de brinde. */
      /* ⚠️⚠️ A META DE PESO DA EQUIPE, E ELA NÃO CHEGA SOZINHA.

         Não existe servidor: nada do lado da clínica transmite para cá —
         é o item 6 do PENDENCIAS, e vale aqui inteiro. Este número é o
         que a PESSOA ANOTOU do que a equipe dela disse, e é por isso que
         ele guarda `em` e `por` junto: sem a data e sem o nome, seria um
         número afirmando uma procedência que ninguém tem como conferir.

         Toda tela que o mostra mostra a procedência na mesma frase. O dia
         em que houver servidor, o campo é o mesmo e passa a ser
         preenchido do outro lado — o que muda é a frase, não o formato.

         ⚠️ MORA NO `protocol`, e não em `profile.targets`, de propósito.
         `targets` é o que a pessoa edita em "Os números do dia"; `protocol`
         é o que vem da clínica. Um número da equipe dentro da gaveta que
         a pessoa mexe seria os dois se misturando no primeiro toque. */
      metas: {
        peso: { valor: 72, em: +daysAgo(34), por: P.medica },
        /* ⚠️ 90, E NÃO UM NÚMERO DIFERENTE DO CALCULADO. A semente é o
           retrato do estado normal, e o normal é a profissional
           CONFIRMANDO a conta do cadastro — 1,2 g por quilo dá 90 para a
           Mariana, e a nutricionista concordou.

           Um valor diferente aqui faria a tela abrir em "Alterada por
           você" para alguém que nunca alterou nada: o terceiro estado da
           tag existe para quando a pessoa sobrescreve de fato, e uma
           semente que já nasce nele ensina o estado errado a quem for
           mexer nesta tela depois. */
        /* Sem equipe não há nutricionista: a meta de proteína foi anotada
           da própria médica. */
        prot: { valor: 90, em: +daysAgo(34), por: P.nutri || P.medica },
      } as Record<string, { valor: number; em: number; por: string }>,
      /* ⚠️ A TAREFA DE EXAME SÓ EXISTE COM EQUIPE, pela mesma razão que sai
         no modo "sem clínica parceira" de logic/store: das cinco linhas da
         semana, quatro são contas que o aplicativo faz, e a quinta é a
         única clinicamente autoral. Sem clínica, seria uma ordem de exame
         que ninguém deu. */
      week: 11, tasks: [
        { metrica: 'aplicacao', alvo: 1 },
        { metrica: 'agua', alvo: 7 },
        { metrica: 'prot', alvo: 7 },
        { metrica: 'exerc', alvo: 3 },
        ...(comRede ? [{ t: P.tarefaExame, done: false }] : []),
      ],
    },
    /* A conversa com a equipe — só existe com plataforma do outro lado. */
    messages: (comRede ? P.mensagens : []).map((m) => ({ t: +daysAgo(m.dias), from: m.de, text: m.texto })),
    unread: comRede ? 1 : 0,
    /* ⚠️ O `heroSeen` MORAVA AQUI, e era `{ milestone, insight, replay }`.

       Ele foi escrito para guardar qual descoberta a Home já tinha
       mostrado — o slot `insight` é literalmente isso. Nunca foi lido: um
       `grep` acha três atribuições e uma reinicialização, e nenhuma
       leitura. A Home mostrava a mesma frase para sempre porque ninguém
       nunca perguntou a este campo o que já tinha passado por lá.

       `descobertasVistas` é o campo vivo que ele queria ser. O formato
       segue o do `vistoEmConquistas`, que é o único outro "já mostrei
       isso" do aplicativo: mapa por id, lido com `?? {}`, escrito
       preguiçosamente. Ver src/logic/descobertas.ts. */
    descobertasVistas: {} as Record<string, { em: number; vezes: number }>,
    /* A apresentação da rede parceira, que o cartão da aba Cuidado abre só
       na primeira vez — mesmo formato, e o valor é quando ela foi vista.
       Ver `viuApresentacaoDaRede`, em logic/rede. */
    apresentacoesVistas: {} as Record<string, number>,
    /* O `kind` é chave — 'exame' ou 'resumo' —, e o rótulo sai de
       `tipoDoDocumento` na hora de mostrar.

       Do mais recente para o mais antigo: é onde o documento novo entra
       (`registrarEnvio` põe na frente), e a Área médica lista na ordem
       gravada. A semente vinha ao contrário, e o resumo que a pessoa
       mandasse hoje aparecia em cima do exame de quarenta dias atrás, que
       aparecia em cima do resumo de catorze. */
    documents: P.documentos
      .map((d) => ({ t: +daysAgo(d.dias), name: d.nome, kind: d.tipo }))
      .sort((a, b) => b.t - a.t),
    consult: { t: +addDays(startOfDay(now()), 9), type: P.tipoDaConsulta, doctor: P.medica },
    consultsHistory: P.consultasAnteriores.map((c) => ({ t: +daysAgo(c.dias), type: c.tipo, note: c.nota })),
    measures: [
      { t: +daysAgo(70), cintura: 104, quadril: 118, braco: 36, coxa: 64, gordura: 42, musculo: 29.0 },
      { t: +daysAgo(35), cintura: 100, quadril: 115, braco: 34.5, coxa: 62, gordura: 39, musculo: 29.4 },
      { t: +daysAgo(14), cintura: 96, quadril: 112, braco: 33, coxa: 60, gordura: 37, musculo: 30.0 },
    ],
    vitals: {
      pa: [{ t: +daysAgo(40), sys: 138, dia: 88 }, { t: +daysAgo(18), sys: 132, dia: 85 }, { t: +daysAgo(3), sys: 127, dia: 82 }],
      fc: [{ t: +daysAgo(18), v: 78 }, { t: +daysAgo(3), v: 71 }],
      glic: [{ t: +daysAgo(40), v: 112 }, { t: +daysAgo(14), v: 103 }, { t: +daysAgo(3), v: 96 }],
      spo2: [{ t: +daysAgo(3), v: 98 }],
      fr: [{ t: +daysAgo(3), v: 16 }],
    },
    exams: [
      { marker: 'HbA1c', unit: '%', ref: '< 5,7', good: 'down', values: [{ t: +daysAgo(120), v: 6.3 }, { t: +daysAgo(40), v: 5.9 }, { t: +daysAgo(3), v: 5.6 }] },
      { marker: 'Glicemia jejum', unit: 'mg/dL', ref: '70–99', good: 'down', values: [{ t: +daysAgo(120), v: 118 }, { t: +daysAgo(40), v: 104 }, { t: +daysAgo(3), v: 96 }] },
      { marker: 'Insulina', unit: 'µUI/mL', ref: '2,6–24,9', good: 'down', values: [{ t: +daysAgo(120), v: 22 }, { t: +daysAgo(3), v: 12 }] },
      { marker: 'Colesterol total', unit: 'mg/dL', ref: '< 190', good: 'down', values: [{ t: +daysAgo(120), v: 214 }, { t: +daysAgo(3), v: 188 }] },
      { marker: 'HDL', unit: 'mg/dL', ref: '> 40', good: 'up', values: [{ t: +daysAgo(120), v: 44 }, { t: +daysAgo(3), v: 52 }] },
      { marker: 'LDL', unit: 'mg/dL', ref: '< 130', good: 'down', values: [{ t: +daysAgo(120), v: 142 }, { t: +daysAgo(3), v: 118 }] },
      { marker: 'Triglicerídeos', unit: 'mg/dL', ref: '< 150', good: 'down', values: [{ t: +daysAgo(120), v: 180 }, { t: +daysAgo(3), v: 132 }] },
      { marker: 'Creatinina', unit: 'mg/dL', ref: '0,6–1,1', good: '', values: [{ t: +daysAgo(3), v: 0.8 }] },
      { marker: 'TGO', unit: 'U/L', ref: '< 32', good: '', values: [{ t: +daysAgo(3), v: 26 }] },
      { marker: 'TGP', unit: 'U/L', ref: '< 33', good: '', values: [{ t: +daysAgo(3), v: 29 }] },
      { marker: 'TSH', unit: 'µUI/mL', ref: '0,4–4,0', good: '', values: [{ t: +daysAgo(3), v: 2.1 }] },
      { marker: 'T4 livre', unit: 'ng/dL', ref: '0,9–1,7', good: '', values: [{ t: +daysAgo(3), v: 1.2 }] },
      { marker: 'Vitamina D', unit: 'ng/mL', ref: '> 30', good: 'up', values: [{ t: +daysAgo(120), v: 24 }, { t: +daysAgo(3), v: 33 }] },
      { marker: 'Vitamina B12', unit: 'pg/mL', ref: '> 300', good: 'up', values: [{ t: +daysAgo(3), v: 410 }] },
      { marker: 'Ferritina', unit: 'ng/mL', ref: '15–150', good: '', values: [{ t: +daysAgo(3), v: 88 }] },
    ],
    examBundles: [
      { t: +daysAgo(3), name: P.arquivosDeExame[0], n: 12, source: 'PDF', shared: true },
      { t: +daysAgo(120), name: P.arquivosDeExame[1], n: 8, source: 'foto', shared: true },
    ],
    /* Receitas que a equipe mandou — só com plataforma do outro lado. */
    prescriptions: (comRede ? P.receitas : []).map((r) => ({ t: +daysAgo(70), name: r.nome, detail: r.detalhe, by: r.por })),
    meals,
    /* Favoritos são PRATOS, com os itens e as quantidades. O nome sai
       deles na hora de mostrar, então não há um segundo lugar guardando
       como o prato se chama. */
    favMeals: [
      { itens: [{ id: 'peito-frango', qtd: 1 }, { id: 'arroz-integral', qtd: 4 }, { id: 'salada-folhas', qtd: 1 }] },
      { itens: [{ id: 'patinho', qtd: 1 }, { id: 'arroz', qtd: 4 }] },
      { itens: [{ id: 'ovo-frito', qtd: 2 }, { id: 'iogurte', qtd: 1 }] },
    ],
    /* Nascem vazias e são preenchidas logo depois, dos registros desta
       mesma semente — ver `comNotificacoesDeExemplo`, logo abaixo. */
    notifications: [] as Notificacao[],
    /* Só o que dá para ligar de verdade — ver src/logic/integracoes.ts.
       O Apple Saúde ligado é o que explica a Mariana ter minutos de
       movimento que ela não digitou; a Withings é a balança dela, e é de
       onde vem o peso sem pesagem manual. */
    integrations: { appleHealth: true, healthConnect: false, garmin: false, fitbit: false, withings: true },
    history: { conditions: P.historico.condicoes, allergies: P.historico.alergias, meds: P.historico.remedios },
    customSyms: P.sintomasProprios,
    /* OS ALERTAS, e não mais quatro interruptores fixos.

       Cada assunto pode ter quantos alertas a pessoa quiser, com vários
       horários e vários dias em cada um — ver src/logic/alertas.ts. O
       perfil de exemplo começa com um só, o da aplicação, porque é o
       único que o tratamento pede por si; os outros três são escolha de
       rotina, e ligá-los por conta própria seria o app decidindo a rotina
       de alguém. */
    alertas: [
      { id: 'al-dose', tipo: 'dose', on: true, modo: 'horas', horas: [9], cada: 2, de: 8, ate: 20, dias: [] as number[], lead: 1 },
    ],
    /* ⚠️⚠️ OS RECIPIENTES SÃO REGISTRO, E ERAM UM CONTADOR.

       O estado guardava `pen: { dosesLeft }` — quantas doses sobravam no
       que está aberto — e mais nada. O histórico de canetas era
       RECONSTRUÍDO fatiando as aplicações de trás para frente em blocos
       de quatro, e a conta mentia de dois jeitos ao mesmo tempo: rotulava
       cada bloco com a ÚLTIMA dose dele, de modo que uma caneta que
       entregou três doses de 2,5 mg e uma de 5 aparecia como "caneta de 5
       mg"; e o resto da divisão virava uma caneta fantasma de "1 de 4
       doses", afirmando três doses jogadas fora que ninguém jogou.

       Caneta de 2,5 e caneta de 5 são produtos diferentes. Dizer à pessoa
       que ela usou uma que não usou, num histórico de medicamento, não é
       erro de desenho.

       Agora cada abertura é uma linha: quando, qual medicamento, qual
       concentração, quantas doses cabem e — quando ela responde — quantos
       dias dura depois de aberta. As aplicações entre uma abertura e a
       seguinte são as doses daquele recipiente, e o que sobra é contado,
       não adivinhado.

       ⚠️ E O CONTADOR SAI JUNTO. `dosesLeft` era um número gravado que
       descia a cada registro — dois lugares afirmando a mesma coisa, e
       nada garantindo que concordassem. Quantas doses saíram é quantas
       aplicações caíram na janela; quantas sobram é a subtração.

       A semente abre três: a de 2,5 mg no primeiro dia, e duas de 5 mg —
       a segunda ainda em uso, com duas doses dadas.

       ⚠️ A VALIDADE MORA NO RECIPIENTE, e não no catálogo, quando o
       catálogo não sabe. Um manipulado não tem prazo de bula: quem define
       é a farmácia que preparou, e cada frasco que chega tem o seu.

       A semente não responde — ela usa Mounjaro, cujo prazo o catálogo
       sabe. O caminho de quem não respondeu é o que o desenvolvimento
       exercita todo dia. */
    /* ⚠️ A ABERTURA É O INSTANTE DA PRIMEIRA DOSE DELA, lido do próprio
       array de aplicações — e não um `daysAgo` novo. `daysAgo` chama
       `Date.now()` a cada chamada, então dois cálculos do mesmo dia saem
       com milissegundos diferentes: a janela da caneta fecharia do lado
       errado da primeira dose e a deixaria órfã. */
    pens: [0, 4, 8].map((i) => ({
      t: injections[i].t,
      med,
      dose: injections[i].dose,
      dosesPerPen: 4,
      validadeDias: undefined as number | undefined,
    })),
    /* A equipe além da médica. Cada pessoa tem um papel distinto no
       tratamento — não é lista de contatos, é quem faz o quê.

       ⚠️ E CADA UMA TEM FICHA, e não só nome e papel. Elas ganharam tela
       própria — /especialista?id= —, e uma tela de profissional de saúde
       com duas linhas dentro é pior do que nenhuma: a pessoa toca
       esperando saber quem cuida dela e encontra o que já estava na
       lista.

       `id` é explícito, e não derivado do nome: é ele que vai na URL do
       perfil, e um nome corrigido não pode quebrar um link guardado.

       ⚠️ ISTO É FICÇÃO DE SEMENTE, como o resto dela. Registro, formação
       e áreas são plausíveis e inventados; quando a clínica existir, quem
       manda essa ficha é ela. */
    team: comRede ? P.equipe : [],

    /* Material que a clínica mandou para você — diferente de `documents`,
       que é o que saiu de você para a clínica. A direção importa: um é
       orientação recebida, o outro é prova enviada. */
    /* `motivo` é o que separa curadoria de biblioteca: cada material diz
       por que ELE foi escolhido para esta pessoa neste momento. */
    materials: (comRede ? P.materiais : []).map(({ dias, ...m }) => ({ t: +daysAgo(dias), ...m })),

    /* Perguntas feitas ao Morphi. Guarda só o texto e a hora — a
       resposta é sempre recalculada sobre o estado atual, então
       persistir a thread inteira envelheceria o dado.

       E de onde a pergunta veio: 'digitada' pela pessoa ou 'sugerida'
       pelo aplicativo (ver logic/perguntas). As feitas antes de a origem
       existir não têm, e continuam sem. */
    asked: [] as { t: number; q: string; origem?: OrigemDaPergunta }[],
    /* ⚠️ SE A PESSOA DEIXOU A GENTE LER AS PERGUNTAS, para entender o uso
       do aplicativo — a decisão 2 do plano do Supabase. Nasce desligada, e
       é uma escolha só dela, separada do consentimento geral: a pergunta
       costuma falar de sintoma, de dose e de medo. Desligada, as perguntas
       ficam só no aparelho; ligada, sobem para uma tabela que a clínica
       não lê. */
    perguntasParaUso: false as boolean,
    consultNotes: '',

    /* Notas para a consulta. Cada uma guarda QUANDO foi anotada e se já
       foi conversada: sem a data, a nota chega na consulta sem o contexto
       que a explica ('isso foi antes ou depois de subir a dose?'). */
    notes: P.notas.map((n) => ({ t: +daysAgo(n.dias), text: n.texto, done: n.feita })),
    onboardDone: true,
    /* ⚠️ A MARCA DA SEMENTE. Tudo o que está aqui é inventado — a Mariana
       e as outras cinco personas —, e um estado com esta marca nunca pede
       conta e nunca sobe para o servidor (plano do Supabase, a decisão 1).
       `estadoVazio` a desliga de forma explícita, porque parte daqui e
       herdaria o verdadeiro. */
    semente: true as boolean,
    /* O dono deste diário no servidor — nulo enquanto não há conta. Mora
       no estado, e não na sessão: é o que o portão lê para saber se o
       diário tem dono, sem esperar a sessão nem a rede. */
    conta: null as ContaDoDiario | null,
    /* A IDENTIDADE DESTE DIÁRIO NESTE APARELHO. Nasce com ele — na
       semente, no estado vazio, no cadastro que recomeça — e não muda
       mais. A sincronia amarra a base dela a este número: um diário novo
       nunca é comparado com o que o anterior tinha no servidor, o que
       faria de tudo o que falta um "apagado" (ver logic/sincronia). Não
       sobe: cada aparelho tem o seu. */
    diario: novoRid() as string,
    /* SISTEMA É O PADRÃO, e não claro. Quem instala o app já escolheu
       claro ou escuro uma vez, nos ajustes do telefone — repetir a
       pergunta é ignorar a resposta que a pessoa já deu. */
    theme: 'system' as Tema,
    /* A cor de ação. 'azul' é o que o Figma desenhou, e quem não escolher
       nada continua vendo exatamente aquilo — ver CORES em src/theme.ts. */
    /* A paleta: a cor que age, a que celebra e a aurora do fundo, num
       conjunto só. 'original' é o azul com o lima do Figma. */
    paleta: 'original' as string,
    lastReplaySeen: 0,
  };
}

export type State = ReturnType<typeof buildSeed>;

/* ============================================================
   AS NOTIFICAÇÕES DE EXEMPLO — tiradas dos registros da semente

   ⚠️⚠️ ERAM SEIS FRASES EM PORTUGUÊS ESCRITAS À MÃO, e três desmentiam a
   própria semente: "Aplicação em 3 dias · quinta" para uma dose de
   domingo; "Restam 3 doses na caneta" datado de um dia em que restavam
   duas; e "Dra. Helena respondeu" um dia depois da mensagem, que era de
   dois. A sexta, "Dez semanas de tratamento — seu corpo vem respondendo
   de forma constante", afirmava uma coisa que conta nenhuma fez, e saiu.

   Agora cada uma sai de um registro que existe, e concorda com o resto
   do aplicativo por construção: o aviso da véspera da última dose, na
   hora do alerta; o dia em que a caneta cruzou a linha de renovar; a
   última mensagem da médica; o último exame importado; o último nível
   de conquista; a manchete do ciclo de hoje. E são guardadas como fato,
   não como frase — ver logic/notificacoes.

   ⚠️ NÃO RODA DENTRO DE `buildSeed` porque precisa das contas do
   aplicativo — ciclo, conquistas —, e elas recebem o `State`, que é o
   tipo que `buildSeed` define. Roda logo depois, em store.ts.
   ============================================================ */
const HORA = 36e5;

export function comNotificacoesDeExemplo(S: State): State {
  const lista: Notificacao[] = [];
  const med = M(S);
  const forma = formaDe(S);
  /* ⚠️ TUDO COM `?? []`, porque esta função também roda na migração de
     `ensureDefaults`, sobre um estado gravado que pode não ter cada lista.
     Ver o fim de `ensureDefaults`. */
  const injs = [...((S.injections as any[]) ?? [])].sort((a, b) => a.t - b.t);
  const ultima = injs[injs.length - 1];

  /* o aviso da véspera, na hora e com a antecedência do alerta de dose */
  const al = ((S as any).alertas as any[] ?? []).find((a) => a.tipo === 'dose' && a.on);
  if (ultima && al && med) {
    const lead = al.lead ?? 0;
    lista.push({
      t: +startOfDay(new Date(ultima.t)) - lead * DAY + (al.horas?.[0] ?? 9) * HORA,
      tipo: 'dose', dias: lead, med: med.label, dose: ultima.dose, unidade: med.unit, forma,
    });
  }

  /* a manchete do ciclo de hoje, às oito — ou agora, se ainda não deu.
     Sem aplicação não há ciclo, e a manchete não inventa um. */
  if (ultima) {
    lista.push({
      t: Math.min(+now(), +startOfDay(now()) + 8 * HORA),
      tipo: 'ciclo', fase: doseCycle(S).phase.key as FaseDoCiclo,
    });
  }

  /* a última palavra da médica, com a data dela */
  const doc = [...((S.messages as any[]) ?? [])].reverse().find((m) => m.from === 'doc');
  if (doc) lista.push({ t: doc.t, tipo: 'mensagem', autor: S.profile.doctor, texto: doc.text });

  /* o dia em que a caneta aberta cruzou a linha de renovar */
  const aberturas = (S.pens as any[]) ?? [];
  const ab = aberturas[aberturas.length - 1];
  if (ab) {
    const doPen = injs.filter((i) => i.t >= ab.t);
    const k = doPen.findIndex((_, i) => ab.dosesPerPen - (i + 1) <= RENOVAR_COM);
    if (k >= 0) lista.push({ t: doPen[k].t + 15 * 60e3, tipo: 'estoque', restam: ab.dosesPerPen - (k + 1), forma });
  }

  /* o último exame importado */
  const exame = [...((S as any).examBundles as any[] ?? [])].sort((a, b) => b.t - a.t)[0];
  if (exame) lista.push({ t: exame.t, tipo: 'exames', nome: exame.name, marcadores: exame.n });

  /* o último nível de conquista, com o que faltava no dia em que chegou */
  const q = feitas(conquistas(S))[0];
  if (q && q.t != null && q.alvo != null) {
    lista.push({
      t: q.t, tipo: 'conquista', trilha: q.id, nivel: q.nivel, alvo: q.alvo,
      proximo: q.proximo, resta: q.proximo == null ? null : q.proximo - q.alvo,
    });
  }

  S.notifications = lista.sort((a, b) => b.t - a.t);
  return S;
}

/* migra estados salvos antes das novas áreas (mutação in-place). */
export function ensureDefaults(S: any) {
  /* OS QUATRO INTERRUPTORES VIRAM UMA LISTA DE ALERTAS.

     O formato antigo guardava um lembrete por assunto, com um horário
     cada. Cada um vira um alerta com um horário só na lista — o mesmo
     comportamento que a pessoa tinha, agora num formato que aceita o
     segundo. A frequência semanal da pesagem vira o dia escolhido; a
     diária vira lista de dias vazia, que é como o novo formato diz
     "todo dia".

     Depois disso `reminders` sai do estado: deixá-lo ali seria manter
     uma segunda cópia de uma coisa que já mudou de lugar, e é dessa
     cópia que sai a divergência no dia em que alguém ler a errada. */
  if (!Array.isArray((S as any).alertas)) {
    const R = S.reminders || {};
    const lista: any[] = [];
    const veio = (tipo: string, r: any, extra: any) => {
      if (!r) return;
      lista.push({ id: `al-${tipo}`, tipo, on: !!r.on, modo: 'horas', horas: [r.hour ?? extra.hora], cada: 2, de: 8, ate: 20, dias: extra.dias ?? [], ...(extra.lead != null ? { lead: extra.lead } : {}) });
    };
    veio('dose', R.dose ?? { on: true, hour: 9 }, { hora: 9, lead: R.dose?.lead ?? 1 });
    veio('peso', R.peso, { hora: 8, dias: R.peso?.freq === 'diaria' ? [] : [R.peso?.dow ?? 1] });
    veio('agua', R.agua, { hora: 15 });
    veio('proteina', R.proteina, { hora: 12 });
    (S as any).alertas = lista;
  }
  delete S.reminders;
  /* AS CONQUISTAS DEIXARAM DE SER GUARDADAS. Eram uma lista com
     `done: true` escrito à mão — cinco marcadas como feitas desde o
     primeiro segundo do app, uma delas para uma marca que a pessoa ainda
     não tinha alcançado. Agora são calculadas dos registros, em
     src/logic/conquistas.ts, e a lista velha só serviria para divergir. */
  delete S.achievements;
  /* A MARCA D'ÁGUA DAS CONQUISTAS NASCE NO NÍVEL DE AGORA. Sem isto,
     quem já usa o app abriria uma vez e receberia trinta e nove
     comemorações de coisas que aconteceram há meses. O que ela guarda é
     o que a pessoa já sabe, e ela já sabe de tudo que está na tela.

     Só na primeira vez: depois disso quem escreve é a tela de conquista
     alcançada, quando a pessoa a fecha. */
  if (!(S as any).vistoEmConquistas) { (S as any).vistoEmConquistas = {}; marcarComoVistas(S); }
  /* AS INTEGRAÇÕES QUE SAÍRAM DO CATÁLOGO SAEM DO ESTADO. Google Fit
     fechou para novos cadastros; "balança inteligente" e "smartwatch"
     nunca foram serviços, e sim aparelhos que escrevem no app de saúde do
     celular. Deixá-las gravadas faria a lista de fontes de movimento
     continuar citando um smartwatch que nenhuma tela sabe ligar. */
  if (S.integrations) {
    delete S.integrations.googleFit;
    delete S.integrations.scale;
    delete S.integrations.watch;
  }
  /* OS CAMPOS DO INTERVALO CHEGARAM DEPOIS DOS ALERTAS. Quem gravou um
     alerta na primeira versão tem lista de horas e mais nada; sem estes
     padrões, abrir a folha dele e tocar em "de tempos em tempos" leria
     NaN como hora de início. O modo continua sendo o que já era — quem
     escolheu horas a dedo não passa a ter intervalo por causa disto. */
  for (const a of ((S as any).alertas ?? []) as any[]) {
    if (a.modo !== 'intervalo') a.modo = 'horas';
    if (!Array.isArray(a.horas)) a.horas = [9];
    if (typeof a.cada !== 'number') a.cada = 2;
    if (typeof a.de !== 'number') a.de = 8;
    if (typeof a.ate !== 'number') a.ate = 20;
    if (!Array.isArray(a.dias)) a.dias = [];
  }
  if (!Array.isArray(S.asked)) S.asked = [];
  if (!Array.isArray(S.team)) S.team = buildSeed().team;
  if (!Array.isArray(S.materials)) S.materials = buildSeed().materials;
  /* ============================================================
     AS FICHAS DA SEMENTE CRESCEM COM O APLICATIVO

     ⚠️ ELAS NASCIAM VAZIAS E FICAVAM VAZIAS PARA SEMPRE, e isso só
     aparecia no aparelho.

     A linha antiga era `if (!clinicInfo) clinicInfo = {}`. Quem instalou o
     aplicativo ANTES de `clinicInfo` existir na semente recebeu o objeto
     vazio uma vez — e `{}` é verdadeiro, então a condição nunca mais se
     cumpriu. Endereço, horário, convênios, contato e até o "sobre"
     entraram na semente depois disso e nunca chegaram a esses aparelhos:
     a tela da clínica abria mostrando só a equipe, porque `S.team` tem
     migração e `clinicInfo` não tinha.

     No navegador isso passava batido porque a base é limpa a cada teste;
     no telefone, que guarda de verdade, é a única coisa que se vê.

     ⚠️ O MERGE É COM O GUARDADO POR CIMA, e não o contrário. O que já
     está no aparelho vence a semente sempre: migração completa o que
     falta e não desfaz o que existe — a regra desta casa é que atualizar
     informação nunca apaga registro.

     ⚠️ E SÓ QUANDO O NOME BATE COM O DA SEMENTE. É o que separa "repor a
     ficha de demonstração" de "inventar o endereço da clínica de
     alguém": se a pessoa se trata na Clínica Bom Jesus, ela não pode
     receber a rua, o horário e os convênios da Clínica Vitalis por
     migração. Sem o nome batendo, o campo continua vazio e a tela
     esconde as seções — que é o comportamento honesto até um servidor
     preencher.
     ============================================================ */
  if (S.profile) {
    const semente = buildSeed().profile as any;
    const perfil = S.profile as any;

    if (perfil.doctor && perfil.doctor === semente.doctor) {
      perfil.doctorInfo = { ...semente.doctorInfo, ...(perfil.doctorInfo || {}) };
    } else if (!perfil.doctorInfo) {
      perfil.doctorInfo = {};
    }

    if (perfil.clinic && perfil.clinic === semente.clinic) {
      perfil.clinicInfo = { ...semente.clinicInfo, ...(perfil.clinicInfo || {}) };
    } else if (!perfil.clinicInfo) {
      perfil.clinicInfo = {};
    }
  }
  if (typeof S.consultNotes !== 'string') S.consultNotes = '';
  /* Migração do texto corrido para a lista: cada linha do campo antigo
     vira uma nota, datada de hoje porque a data original nunca existiu.
     Depois disso a lista é a fonte, e consultNotes deixa de ser lido. */
  if (!Array.isArray(S.notes)) {
    const linhas = String(S.consultNotes || '')
      .split('\n')
      .map((l) => l.replace(/^[•\-\s]+/, '').trim())
      .filter(Boolean);
    S.notes = linhas.length
      ? linhas.map((text) => ({ t: +startOfDay(now()), text, done: false }))
      : buildSeed().notes;
  }
  if (typeof S.onboardDone !== 'boolean') S.onboardDone = true;
  /* Aditivo, e o `heroSeen` some de quem já o tinha: ele nunca guardou
     nada que alguém lesse, então não há registro para perder. */
  if (!S.descobertasVistas) S.descobertasVistas = {};
  /* Aditivo também: quem já usava o aplicativo vê a apresentação da rede
     na primeira vez que tocar no cartão, como quem chega agora. */
  if (!S.apresentacoesVistas) S.apresentacoesVistas = {};
  /* Aditivo: quem não anotou nada continua sem meta clínica, e null é a
     resposta certa para "a sua equipe ainda não definiu um número aqui". */
  if (S.protocol && !(S.protocol as any).metas) (S.protocol as any).metas = {};
  /* ⚠️ A META DE PESO DA EQUIPE NASCEU SOZINHA, num campo só dela, e virou
     uma das quatro. Quem anotou a dela antes disso não a perde aqui: o
     formato antigo entra no mapa novo e só então some. */
  const mp = (S.protocol as any)?.metaPeso;
  if (mp && typeof mp.kg === 'number') {
    (S.protocol as any).metas.peso = { valor: mp.kg, em: mp.em, por: mp.por };
  }
  if (S.protocol) delete (S.protocol as any).metaPeso;
  delete S.heroSeen;
  if (!S.theme) S.theme = 'light';
  /* bodyFat sai daqui quando a meta virar campo do perfil — o valor certo
     depende da pessoa, e um padrão fixo não serve para todo mundo. */
  if (S.profile) S.profile.targets = Object.assign({ prot: 90, waterMl: 2500, exercMin: 60, bodyFat: 28 }, S.profile.targets || {});
  /* Quem gravou o perfil antes desta pergunta existir não tem a lista, e
     ausente quer dizer "nenhuma" — o comportamento que o app já tinha. */
  if (S.profile && !(S.profile as any).restricoes) (S.profile as any).restricoes = [];
  /* ⚠️ O VÍNCULO NASCE UMA VEZ, E NUNCA MAIS. A condição é `=== undefined`
     de propósito: quem gravou antes de o campo existir e tinha médica
     tinha, por construção, a plataforma imaginária junto — então herda um
     vínculo. Depois disso o campo existe (objeto ou null) e esta linha
     não volta a tocar nele.

     Escrever a regra como "tem médico, logo tem vínculo" seria recriar o
     sinal único: bastaria alguém digitar o nome do médico dela para o app
     decidir, no carregamento seguinte, que existe uma clínica conectada —
     que é exatamente a mentira que a separação veio desfazer. */
  /* ⚠️ E DAÍ SAI A FORMA DE SE TRATAR, uma vez só. Quem gravou antes
     desta pergunta existir responde pelo que tinha: vínculo é parceiro,
     nome sem vínculo é próprio, nada é nenhum. Depois disso o campo
     existe e a dedução não volta a rodar — senão apagar o nome do médico
     jogaria a pessoa para "por conta própria" sem ela ter dito isso. */
  if (S.profile && (S.profile as any).acompanhamento === undefined) {
    (S.profile as any).acompanhamento =
      ((S.profile as any).vinculo || S.profile.doctor || S.profile.clinic) ? 'proprio' : 'nenhum';
  }
  /* ⚠️ VÍNCULO CONFIRMADO SOBRESCREVE A RESPOSTA, e isto roda sempre —
     não é migração. Quem respondeu "por conta própria" no cadastro e
     depois teve um código confirmado por uma clínica passou a ter
     acompanhamento, ponto: a resposta declarada era sobre o dia em que
     ela respondeu, e o vínculo é um fato posterior.

     A regra tem uma direção só. Vínculo implica acompanhamento; perder o
     nome do médico NÃO implica perder o acompanhamento — é por isso que a
     dedução de baixo continua sendo de uma vez só, e esta é de todas. */
  if (S.profile && (S.profile as any).vinculo) (S.profile as any).acompanhamento = 'proprio';
  if (S.profile && (S.profile as any).vinculo === undefined) {
    (S.profile as any).vinculo =
      (S.profile.doctor || S.profile.clinic) ? { desde: S.profile.startT || +now() } : null;
  }
  /* ⚠️ QUEM JÁ TINHA CÓDIGO GANHA O VÍNCULO, uma vez.

     O aplicativo guardava o convite e esperava uma confirmação que nunca
     vinha — quem digitou o código na versão anterior ficou com `convite`
     preenchido e `vinculo` nulo, que sob a regra nova é um estado que
     não existe mais: ter o código É ter o vínculo.

     Esta linha é de mão única, como as outras daqui: ela dá, nunca tira.
     Ninguém perde acesso por causa de uma migração. */
  if (S.profile && (S.profile as any).convite && !(S.profile as any).vinculo) {
    (S.profile as any).vinculo = {
      desde: S.profile.startT || +now(),
      convite: (S.profile as any).convite,
    };
  }
  /* ⚠️⚠️ O CONTADOR DE DOSES VIRA UMA LISTA DE ABERTURAS. Ver a nota na
     semente, em `pens`.

     O que o estado antigo afirmava de verdade era UMA coisa: o recipiente
     em uso e quantas doses já saíram dele. É isso que esta linha salva —
     uma abertura só, datada na aplicação que teria sido a primeira dela.
     As aplicações mais antigas ficam sem recipiente, e é o certo: o
     aplicativo nunca perguntou por eles, e inventá-los era o defeito.

     Quem chega agora sem nenhuma aplicação não ganha abertura nenhuma:
     `penStock` lê a lista vazia como recipiente cheio ainda por abrir, e
     nenhuma tela afirma que uma dose já saiu. */
  if (!Array.isArray(S.pens)) {
    const porPen = S.pen?.dosesPerPen || 4;
    const usadas = Math.max(0, Math.min(porPen, porPen - (S.pen?.dosesLeft ?? porPen)));
    const injs = ((S.injections ?? []) as any[]).slice().sort((a, b) => a.t - b.t);
    const primeira = usadas > 0 && injs.length >= usadas ? injs[injs.length - usadas] : null;
    S.pens = primeira
      ? [{
        t: primeira.t,
        med: S.profile?.med ?? 'mounjaro',
        dose: primeira.dose ?? S.profile?.dose ?? 0,
        dosesPerPen: porPen,
        validadeDias: S.pen?.validadeDias,
      }]
      : [];
    delete S.pen;
  }
  /* ============================================================
     A SEMANA DO PROTOCOLO VIRA SOZINHA

     ⚠️ ELA ESTAVA CONGELADA. `protocol.week` era gravado uma vez, no
     estado vazio, e nada no aplicativo inteiro voltava a tocá-lo — a
     busca por atribuições encontrava exatamente uma. A tela de
     Protocolos dizia "Semana 1" para sempre, o companion e a área médica
     repetiam o mesmo número, e o histórico, que monta as semanas
     anteriores como `week - k`, chegava a semana zero e a semanas
     negativas.

     O NÚMERO AGORA É DERIVADO, da mesma conta que o resto do app usa:
     dia da jornada dividido por sete. O que fica guardado deixa de ser
     "em que semana a pessoa está" e passa a ser DE QUE SEMANA SÃO OS
     CHECKS — e é isso que permite virá-los.

     OS CHECKS RESETAM na virada, e só os manuais: as três métricas —
     água, proteína, movimento — não têm `done`, são contadas dos
     registros da semana corrente e viram sozinhas. Um "Aplicação da
     semana" que ficasse marcado para sempre transformaria a única lista
     do app que pergunta "e esta semana?" numa lista que já respondeu.

     ⚠️ E O QUE FOI CUMPRIDO NÃO SE PERDE onde ele é lido:
     `historicoDeProtocolos` remonta cada semana passada dos check-ins,
     e não destes campos. O que some é o estado de marcação de uma semana
     que acabou, que é exatamente o que devia sumir.

     Quem ainda não começou fica na semana 1: sem data de início não há
     jornada, e dividir por sete uma data que é zero devolveria a semana
     em que o mundo começou a contar o tempo.
     ============================================================ */
  /* ============================================================
     AS TAREFAS DO PROTOCOLO PODEM SER DO FORMATO ANTIGO

     ⚠️ E NESSE FORMATO TODAS SÃO MARCÁVEIS, inclusive as que o
     aplicativo conta sozinho.

     A lista nasceu como texto puro — `{ t: 'Beber 2,5 L todo dia', done }`
     — e depois ganhou `metrica`, que é o que liga a linha ao registro e
     faz `marcarTarefa` recusar o toque. Quem instalou antes disso continua
     com as cinco em texto: as cinco viram caixa de marcar, e a pessoa
     pode "cumprir" dois litros de água tocando num quadrado.

     Não é só cosmético. A linha marcada à mão conta para o "3 de 5
     cumpridas" do topo e para o histórico das semanas — o protocolo
     passa a dizer que a semana foi cumprida porque alguém tocou, e não
     porque alguma coisa aconteceu. É o oposto do que esta tela existe
     para fazer.

     ⚠️ A CONDIÇÃO É O FORMATO, E NÃO O CONTEÚDO: só migra quando NENHUMA
     tarefa tem `metrica` e todas são `{t, done}` puros, que é a assinatura
     exata da lista velha. Uma lista que já tenha uma métrica qualquer
     ficou como está.

     ⚠️ E O QUE FOI MARCADO À MÃO SOBREVIVE onde ainda faz sentido: o
     `done` das tarefas manuais é reaproveitado pelo texto. O das que
     viraram métrica é descartado de propósito — aquele "cumprido" nunca
     foi um fato, era um toque.

     ⚠️ ISTO SAI QUANDO A CLÍNICA MANDAR PROTOCOLO DE VERDADE. Aí a lista
     deixa de vir da semente e esta migração passa a ter opinião sobre
     dado de outra pessoa. Está em PENDENCIAS.
     ============================================================ */
  if (S.protocol && Array.isArray(S.protocol.tasks)) {
    const tarefas = S.protocol.tasks as any[];
    const formatoAntigo = tarefas.length > 0
      && tarefas.every((t) => typeof t?.t === 'string' && t.metrica == null);
    if (formatoAntigo) {
      const feito = new Map(tarefas.map((t) => [String(t.t).trim().toLowerCase(), !!t.done]));
      S.protocol.tasks = (buildSeed().protocol.tasks as any[]).map((t) =>
        (t.t ? { ...t, done: feito.get(String(t.t).trim().toLowerCase()) ?? false } : { ...t }));
    }
  }

  /* ============================================================
     A META DO NÚMERO DO DIA LARGA A CÓPIA DO ALVO

     ⚠️ ELA GUARDAVA UM SEGUNDO NÚMERO. A meta de proteína nascia com uma
     cópia de `targets.prot` e ficava independente: mudar o alvo para 110 g
     deixava a meta contando 90, e as duas telas — Alimentação e Metas —
     passavam a cobrar números diferentes da mesma proteína no mesmo dia.

     Apagar a cópia não perde nada: sem `alvo`, a conta cai no alvo do
     perfil, que é de onde a cópia tinha saído. O rótulo vai junto, porque
     "Comer 90 g" gravado viraria mentira na primeira mudança do alvo.

     Só os indicadores que TÊM alvo no perfil. Sono guarda o seu, e é o
     único número que ele tem. ============================================================ */
  if (Array.isArray(S.goals)) {
    for (const g of S.goals as any[]) {
      const ind = indicadorDe(g?.indicador);
      if (ind?.doPerfil && (g.alvo != null || g.label != null)) {
        delete g.alvo;
        delete g.label;
      }
    }
  }

  if (S.protocol) {
    const semanaAgora = semanaDoTratamento(now(), S.profile?.startT ?? 0);
    if (S.protocol.week !== semanaAgora) {
      S.protocol.week = semanaAgora;
      S.protocol.tasks = (S.protocol.tasks as any[])
        .map((t) => (t.t ? { ...t, done: false } : t));
    }
  }
  /* Quem gravou o estado antes de a cor existir fica com o azul, que é o
     aplicativo que essa pessoa já conhece. */
  /* Quem gravou antes das paletas existirem fica com a original, que é o
     aplicativo que essa pessoa já conhece. As chaves antigas — uma cor de
     ação e uma de alcançado soltas — saem: duas escolhas que viraram uma
     não podem ficar guardadas ao lado da nova, ou a divergência começa no
     primeiro mês. */
  /* ⚠️ E PALETA REMOVIDA VOLTA PARA A ORIGINAL. Eram doze e ficaram
     cinco; quem tinha escolhido Menta ficou com um id que não existe
     mais. Sem esta linha o aplicativo ainda abriria — `paletaDe` e
     `useAurora` caem no padrão sozinhos —, mas a tela de Aparência
     mostraria as cinco bolinhas com nenhuma marcada, e o valor errado
     continuaria guardado esperando confundir a próxima migração. */
  /* E FRAMBOESA VIROU PITAIA — mesma cor, nome novo, porque o antigo
     não cabia na fileira. Quem tinha escolhido continua com ela; sem
     esta linha a regra acima jogaria essa pessoa de volta para o azul,
     que é perder uma escolha por causa de uma troca de rótulo. */
  if ((S as any).paleta === 'framboesa') (S as any).paleta = 'pitaia';
  if (!PALETAS.some((p) => p.id === (S as any).paleta)) (S as any).paleta = 'original';
  delete (S as any).cor;
  delete (S as any).destaque;
  /* E o tema ganhou 'system'. Quem tinha claro ou escuro escolhido
     continua com ele — foi escolha, não padrão. */
  if (!['light', 'dark', 'system'].includes((S as any).theme)) (S as any).theme = 'system';
  /* Favorito virou prato. Os que existirem como string continuam
     valendo — viram { nome } e seguem abrindo o registro com o nome na
     busca, que é o que sempre fizeram. */
  if (Array.isArray((S as any).favMeals)) {
    (S as any).favMeals = ((S as any).favMeals as any[])
      .map((f) => (typeof f === 'string' ? { nome: f } : f));
  }
  /* ⚠️⚠️ AS NOTIFICAÇÕES DE EXEMPLO ANTIGAS ERAM FRASE PRONTA, EM
     PORTUGUÊS, e continuavam assim em qualquer idioma. A semente de antes
     gravava seis — "Aplicação em 3 dias", "Estoque acabando"… — com
     `title` e `body` escritos, e o estado de quem já tinha aberto o
     aplicativo ficou com elas depois que a lista passou a guardar o fato
     (ver logic/notificacoes). Trocar para o alemão mudava a tela inteira
     e deixava a lista em português.

     Elas se reconhecem pelo título exato, e só a semente as escreveu:
     quem começa pelo cadastro nasce com a lista vazia. Então saem as
     seis e entram as de exemplo de agora, tiradas dos registros deste
     mesmo estado. O resto da lista — uma conquista gravada como frase
     antes disto — fica como estava: frase pronta não se desfaz de volta
     em números.

     Roda por último porque as contas que usa (estoque, ciclo,
     conquistas) dependem das migrações acima. E não pode derrubar a
     abertura: num estado que a conta não entenda, a lista fica como
     estava. */
  const ANTIGAS = ['Aplicação em 3 dias', 'Novo insight', 'Dra. Helena respondeu', 'Estoque acabando', 'Exames importados', 'Dez semanas de tratamento'];
  const daSementeAntiga = (n: any) => !n?.tipo && ANTIGAS.includes(n?.title);
  if (Array.isArray(S.notifications) && S.notifications.some(daSementeAntiga)) {
    const antes = S.notifications;
    try {
      const resto = (antes as any[]).filter((n) => !daSementeAntiga(n));
      comNotificacoesDeExemplo(S);
      S.notifications = [...resto, ...S.notifications].sort((a: any, b: any) => b.t - a.t);
    } catch {
      S.notifications = antes;
    }
  }
  /* ⚠️ A MARCA DA SEMENTE, em quem gravou antes de ela existir.

     A semente nasce marcada (ver buildSeed). Um estado gravado antes da
     marca é a semente só se as duas coisas forem verdade: não há
     consentimento guardado, e o nome é o de uma das seis personas. Só a
     falta de consentimento não basta — o cadastro já trancava a porta
     antes de gravar o consentimento (16 e 18/09/2026), e quem se
     cadastrou nesse intervalo seria tomado pela demonstração: nunca
     pediria conta, e o diário nunca subiria. */
  if (typeof S.semente !== 'boolean') {
    S.semente = !S.profile?.consentimento && NOMES_DAS_PERSONAS.includes(S.profile?.name);
  }
  if (S.conta === undefined) S.conta = null;
  if (typeof S.diario !== 'string' || !S.diario) S.diario = novoRid();
  /* Quem gravou antes da escolha existir não escolheu: fica desligada. */
  if (typeof S.perguntasParaUso !== 'boolean') S.perguntasParaUso = false;
  /* A identidade de cada item do diário — por último, porque algumas
     migrações acima criam itens. Ver logic/identidade. */
  carimbar(S);
  return S;
}

/* ============================================================
   O ESTADO VAZIO — de onde parte quem chega agora

   ⚠️ ELE NÃO EXISTIA, E ISSO ERA UM PROBLEMA MAIOR DO QUE PARECIA.

   O cadastro escrevia POR CIMA da semente: mexia em `profile`,
   `integrations`, `onboardDone` e nas pesagens de hoje, e em mais nada.
   Quem instalasse o aplicativo e respondesse tudo abria a Jornada com
   setenta e um dias de tratamento, dez aplicações, quinze exames e uma
   conversa com uma médica que nunca viu — os registros da pessoa de
   exemplo, agora com o nome de quem acabou de chegar.

   E a mesma falta travava o outro lado: `reset()` devolvia a semente, o
   que faz de "apagar meus dados" um botão que REPÕE dados. Sem um estado
   vazio de verdade, apagar não tinha para onde apagar.

   O QUE É ZERADO AQUI É REGISTRO E É IDENTIDADE. Tudo que a pessoa
   produz — pesagens, aplicações, check-ins, exames, fotos, notas,
   mensagens, documentos — nasce lista vazia; e o nome, a equipe e a
   consulta nascem em branco, porque são de outra pessoa.

   O QUE FICA É ESTRUTURA E CATÁLOGO: as metas diárias padrão, os alertas
   que todo mundo começa com, o estoque da caneta, a biblioteca. Nada
   disso é registro de ninguém.

   ⚠️ CAMPO NOVO NO ESTADO ENTRA AQUI TAMBÉM. Um campo que guarde
   registro e não apareça nesta função volta a vazar a pessoa de exemplo
   para quem se cadastrar — que é exatamente o defeito que esta função
   existe para fechar.
   ============================================================ */
export function estadoVazio(): State {
  /* Parte da semente para herdar a FORMA — todo campo existe, com o tipo
     certo — e depois esvazia o que é conteúdo. Montar um objeto do zero
     daria o mesmo resultado hoje e perderia um campo no dia em que a
     semente ganhasse um. */
  const S: any = buildSeed();

  /* a pessoa: o cadastro escreve por cima, mas o que não for perguntado
     não pode sobrar da Mariana */
  S.profile.name = '';
  S.profile.startWeight = 0;
  S.profile.goalWeight = 0;
  S.profile.startT = 0;
  S.profile.convite = '';
  /* A EQUIPE É DE QUEM TEM EQUIPE. Estes dois campos guardam o nome de
     quem acompanha, e `temAcompanhamento` lê os dois — o app inteiro já
     sabe viver sem ninguém do outro lado.

     E o vínculo sai junto: quem chega agora não tem plataforma
     resolvida, e o código que ela porventura digite fica em `convite`
     esperando um servidor que o traduza. */
  S.profile.doctor = '';
  S.profile.clinic = '';
  (S.profile as any).vinculo = null;
  /* Nasce em branco, e não em 'nenhum': quem ainda não respondeu não
     escolheu nada. O cadastro escreve a resposta antes de a primeira
     tela abrir. */
  (S.profile as any).acompanhamento = 'nenhum';
  /* ⚠️ E A FICHA DA MÉDICA TAMBÉM. `doctorInfo` guarda CRM, formação e
     especialidade da Dra. Helena, e ficava de pé: quem chegava agora
     herdava a carteira profissional de outra pessoa. Passava despercebido
     porque só telas com vínculo liam o campo — mas a de "Quem acompanha
     você" lê a especialidade para preencher o formulário, e alguém sem
     médico nenhum abriria a tela com "Endocrinologista" já escrito.

     Objeto vazio, e não `delete`: `ensureDefaults` repõe a ficha da
     semente quando o campo falta, e um campo apagado voltaria cheio no
     carregamento seguinte. */
  (S.profile as any).doctorInfo = {};
  /* E a ficha da clínica, pelo mesmo motivo: endereço, horário, convênios
     e contato da Clínica Vitalis ficavam no perfil de quem acabou de
     chegar. Nenhuma tela os mostrava — `fichaDaClinica` pergunta o nome
     antes, e ele sai em branco acima —, e foi por isso que a sobra passou:
     o diário novo carregava a ficha de uma clínica de mentira. */
  (S.profile as any).clinicInfo = {};
  S.profile.nutri = '';
  S.profile.restricoes = [];

  /* os registros */
  S.weights = [];
  S.injections = [];
  /* Sem abertura nenhuma: ninguém registrou recipiente ainda, e é o que
     a lista vazia diz. */
  S.pens = [];
  S.checkins = [];
  S.photos = [];
  S.measures = [];
  /* ⚠️ OS SINAIS VITAIS FICAVAM, e eram os da Mariana: três pressões, duas
     frequências, três glicemias. Nada no aplicativo escreve um sinal vital
     — só a semente —, então quem se cadastrava carregava para sempre a
     pressão de outra pessoa na tela de Saúde, e a sincronia os subiria
     como medições dela. A forma fica (as cinco listas), vazias. */
  S.vitals = { pa: [], fc: [], glic: [], spo2: [], fr: [] };
  S.exams = [];
  S.examBundles = [];
  S.prescriptions = [];
  S.meals = [];
  S.favMeals = [];
  S.notes = [];
  S.consultNotes = '';
  S.consultsHistory = [];
  S.documents = [];
  S.goals = [];
  S.asked = [];
  S.notifications = [];
  S.customSyms = [];
  S.history = { conditions: [], allergies: [], meds: [] };

  /* a conversa com a equipe */
  S.messages = [];
  S.unread = 0;
  S.team = [];
  /* E o que a clínica preparou: guia, vídeo e plano alimentar da Clínica
     Vitalis, com "enviado pela enfermeira" no motivo. A Área médica só os
     mostra com clínica conectada, e por isso a sobra não se via — até a
     pessoa se vincular a uma clínica de verdade e receber os materiais da
     de mentira. */
  S.materials = [];

  /* A CONSULTA NASCE SEM DATA, e zero é a resposta honesta: quem lê deve
     perguntar antes se existe uma. Ver `temConsulta`. */
  S.consult = { t: 0, type: '', doctor: '' };

  /* O PROTOCOLO COMEÇA NA PRIMEIRA SEMANA, SEM NADA CUMPRIDO.

     ⚠️ E SEM A TAREFA QUE A CLÍNICA DA SEMENTE ESCREVEU. As cinco linhas
     não têm todas a mesma origem: três são métricas que o próprio app
     conta — água, proteína e movimento, contra as metas que o cadastro
     calculou — e "Aplicação da semana" é a agenda de dose que o app já
     mantém. Essas quatro se sustentam sozinhas, para qualquer pessoa.

     "Agendar exame de sangue" é a única clinicamente autoral, e vinha de
     graça para todo mundo: quem chegava sem médico nenhum encontrava, na
     primeira semana, uma ordem de exame que ninguém deu. Um aplicativo
     que não prescreve também não pede exame.

     Sai para todo mundo que chega, sem condição: ninguém nasce com
     vínculo — ele vem de um servidor que ainda não existe —, e quando
     ele existir é a clínica que escreve as tarefas dela, e não a
     semente. Uma clínica de mentira não deixa herança. */
  S.protocol = {
    week: 1,
    /* Nem as metas da equipe: elas são o que a pessoa anotou da equipe
       DELA, e uma clínica de mentira não deixa herança. */
    metas: {},
    tasks: (S.protocol?.tasks ?? [])
      .filter((t: any) => !(t.t && /exame/i.test(t.t)))
      .map((t: any) => (t.t ? { ...t, done: false } : t)),
  };

  /* a porta se destranca: sem cadastro, o app não abre */
  S.onboardDone = false;
  S.lastReplaySeen = 0;

  /* A MARCA D'ÁGUA DAS CONQUISTAS VOLTA A ZERO, e não é detalhe: sem
     isto, quem apagou tudo e recomeçou passaria pelo primeiro check-in
     sem a comemoração — a marca ainda diria que ele já foi visto. */
  S.vistoEmConquistas = {};

  /* as integrações são permissões, e permissão não se herda */
  S.integrations = { appleHealth: false, healthConnect: false, garmin: false, fitbit: false, withings: false };

  /* ⚠️ A MARCA DA SEMENTE SE DESLIGA AQUI, de forma explícita: este
     estado parte de buildSeed e herdaria o verdadeiro — e um diário
     marcado como semente nunca pede conta nem sobe. Vale para todo
     caminho que passa por aqui: o cadastro, "Apagar meus dados", "Sair da
     conta" e "Já tenho conta". E o diário vazio ainda não tem dono. */
  S.semente = false;
  S.conta = null;
  /* E é um diário novo: a identidade de antes, que também veio da
     semente, fica com ela. */
  S.diario = novoRid();
  S.perguntasParaUso = false;

  return ensureDefaults(S) as State;
}

/* ============================================================
   O CADASTRO RECOMEÇA DO ZERO — MAS NÃO DE DONO

   O cadastro escreve por cima do estado vazio (ver `salvar`, em
   app/cadastro). Quem entrou por "Já tenho conta" numa conta ainda vazia
   chega ao cadastro já com dono, e perdê-lo aqui faria o diário novo
   nascer sem conta: a tranca pediria de novo a conta que a pessoa
   acabou de abrir.
   ============================================================ */
export function recomecarDoZero(s: any) {
  const conta = s.conta ?? null;
  Object.assign(s, estadoVazio());
  s.conta = conta;
}
