import React, { useState } from 'react';
import { View } from 'react-native';
import { useRouter } from 'expo-router';
import { useStore } from '../logic/store';
import { checkinToday, registroDoDia } from '../logic/derive';
import { startOfDay, now } from '../logic/time';
import { ENERGIA, SONO, HUMOR, INTENSIDADE, SINTOMA, INTESTINO } from '../logic/escalas';
import { TelaInterna, Titulao, Campo, Opcoes, Opc, Escala, Texto, Aviso, Botao } from '../ui/internas';

/* ============================================================
   CHECK-IN DO DIA

   A tela tem duas partes, e a ordem delas é a resposta a "o que esta tela
   quer de mim?".

   Primeiro as PERGUNTAS FIXAS: energia, sono, humor. Todo dia tem as três
   — ninguém "teve ou não teve" humor —, então elas aparecem sempre, em
   escala, e respondê-las é um gesto de três toques. Quem só tem trinta
   segundos responde essas e sai com o dia registrado.

   Depois os SINTOMAS, que são o contrário: a pessoa é quem diz quais
   existiram. Marca o que teve, e só então aparece quanto, uma escala por
   sintoma marcado. Um dia sem sintoma nenhum não pede toque nenhum aqui.

   Elas estavam na ordem inversa, e isso fazia a tela abrir pedindo que a
   pessoa procurasse na lista de sete sintomas o que tinha sentido — a
   parte mais lenta e a mais fácil de ser "nenhum" — antes das três
   perguntas que a tela realmente faz todo dia.

   Nada nasce preenchido. Um campo em branco continua em branco no
   registro, porque ausência não é zero: quem não respondeu sono não
   dormiu zero hora.
   ============================================================ */

/* `store` é a chave numérica legada que derive.ts já lê. Os três primeiros
   sintomas têm coluna própria desde o início; os outros vivem só no mapa
   `sint` do check-in, e entram nas leituras quando ganharem derivação. */
const SINTOMAS: { id: string; label: string; store?: string }[] = [
  { id: 'nausea', label: 'Náusea', store: 'nausea' },
  { id: 'intestino', label: 'Intestino' },
  { id: 'vomito', label: 'Vômito' },
  { id: 'dor', label: 'Dor abdominal' },
  { id: 'refluxo', label: 'Refluxo', store: 'refluxo' },
  { id: 'fadiga', label: 'Fadiga' },
  { id: 'cefaleia', label: 'Dor de cabeça' },
  { id: 'tontura', label: 'Tontura' },
  { id: 'outro', label: 'Outro' },
];

/* A lista cresceu para caber o que a literatura mais registra. Faltavam
   três dos mais frequentes: vômito, dor abdominal — a queixa mais
   relatada de todas em dados de mundo real — e o lado "solto" do
   intestino, que a tela simplesmente não tinha como receber.

   E "Constipação" virou "Intestino". Prender e soltar não são sintomas
   diferentes: são as duas pontas do mesmo efeito, e apareciam quase
   empatados nos estudos. Com um sintoma só para o lado preso, quem tivesse
   diarreia não tinha onde dizer, e quem alternasse tinha que escolher
   metade da verdade.

   Isso também encerra uma divergência que já existia: "Como o corpo
   reagiu" guardava `gut` com normal/preso/solto enquanto o check-in
   guardava `constip` como intensidade. As duas telas podiam afirmar
   coisas contrárias sobre o mesmo dia. Agora as duas escrevem `gut`, da
   mesma lista de valores, e `constip` continua sendo gravado quando o
   intestino está preso — é a coluna que Ritmo, Semana e Sintomas já
   leem. */
const OUTRO = 'outro';
const GUT = 'intestino';

/* ONDE A TELA DEIXA DE SÓ ANOTAR

   Um diário que registra e cala nos pontos que importam cumpre a função
   de arquivo e falha na de acompanhamento. Mas alarme em todo sintoma
   vira alarme nenhum, então o corte é um só: o aviso existe quando a
   resposta muda o que a pessoa deveria fazer HOJE. Fadiga e dor de cabeça
   ficam de fora por isso — quase sempre vêm de comer e beber pouco, e um
   aviso ali seria ruído sobre o que já é esperado.

   Nenhum deles nomeia diagnóstico. Quem lê já está com o sintoma, e um
   nome de doença assusta sem ajudar a decidir o próximo passo.

   As faixas não são iguais porque os sintomas não são: dor e tontura
   avisam no 4, onde a pessoa já teve o dia interrompido; as contagens —
   vômito, intestino — avisam no degrau em que a graduação clínica troca
   de patamar. */
const AVISOS: Record<string, { min: number; titulo: string; texto: string }> = {
  dor: {
    min: 4,
    titulo: 'Essa dor não espera a próxima consulta',
    texto: 'Dor abdominal forte ou que não passa é a que a bula pede para relatar na hora. Registre aqui e fale com sua equipe hoje.',
  },
  vomito: {
    min: 4,
    titulo: 'Vomitar muito desidrata rápido',
    texto: 'Junto com a água vai o sal, e você fica sem segurar comida nem remédio. Beba em goles pequenos e frequentes — e se não conseguir segurar nem água, fale com sua equipe hoje.',
  },
  tontura: {
    min: 4,
    titulo: 'Tontura assim costuma ter causa',
    texto: 'Na caneta ela costuma vir de desidratação ou de açúcar baixo, e quem usa insulina ou sulfonilureia junto tem mais risco. Beba água, coma alguma coisa, e avise sua equipe se repetir.',
  },
};

/* Os dois lados do intestino têm o seu, e ficam fora do mapa acima porque
   não são medidos em `grau` — um conta dias sem ir, o outro idas no dia. */
const AVISO_PRESO = {
  min: 5,
  titulo: 'Quatro dias sem ir pede ação',
  texto: 'Água ao longo do dia, fibra e movimento costumam resolver. Se vier junto com dor forte na barriga e vômito, não espere pela consulta — procure atendimento.',
};

const AVISO_SOLTO = {
  min: 5,
  titulo: 'Nesse ritmo, o risco é desidratar',
  texto: 'Sete ou mais idas num dia tiram mais água e sal do que a sede consegue repor. Beba ao longo do dia, sem esperar sede, e avise sua equipe se amanhã continuar assim.',
};

/* AVISOS POR COMBINAÇÃO — o que nenhum sintoma sozinho consegue dizer.

   Dor forte é uma coisa; dor forte COM vômito é outra, e a bula trata as
   duas de maneiras diferentes. Até aqui cada campo só sabia de si, e o
   quadro que mais importa era justamente o que nenhum deles enxergava.

   A ordem é a da urgência, e só o primeiro que bate aparece: dois avisos
   graves ao mesmo tempo dividem a atenção em vez de somá-la.

   Quando uma combinação aparece, os avisos de campo somem. Eles dizem
   "converse com sua equipe" sobre um sintoma; a combinação diz "vá agora"
   sobre o conjunto, e manter os dois na tela é deixar o menos urgente
   discutir com o mais urgente. */
type Niveis = { nausea: number; dor: number; vomito: number; tontura: number; preso: number; solto: number };

const COMBINACOES: { quando: (n: Niveis) => boolean; titulo: string; texto: string }[] = [
  {
    /* Intestino parado há dias + dor forte + vômito. */
    quando: (n) => n.preso >= 4 && n.dor >= 4 && n.vomito >= 1,
    titulo: 'Essa combinação pede atendimento agora',
    texto: 'Intestino parado há dias, dor forte e vômito juntos podem ser sinal de que algo travou no caminho. Não espere a consulta nem a melhora: procure um pronto atendimento e diga que está em uso da caneta.',
  },
  {
    /* Dor abdominal intensa com vômito — o quadro que toda bula de GLP-1
       manda relatar de imediato. */
    quando: (n) => n.dor >= 4 && n.vomito >= 3,
    titulo: 'Dor forte com vômito não espera',
    texto: 'Dor abdominal intensa junto de vômito, às vezes irradiando para as costas, é o quadro que a bula manda relatar imediatamente. Procure sua equipe ou um atendimento hoje, e diga que usa a caneta.',
  },
  {
    /* Perda de líquido dos dois lados, ou muita de um, com tontura. */
    quando: (n) => (n.vomito >= 3 || n.solto >= 4) && n.tontura >= 3,
    titulo: 'Tontura junto disso é sinal de desidratação',
    texto: 'Perder líquido rápido e sentir tontura costumam andar juntos. Beba em goles ao longo do dia, com soro ou um pouco de sal, e avise sua equipe se não melhorar até amanhã.',
  },
];

/* PERSISTÊNCIA — a outra coisa que um dia sozinho não diz.

   Enjoo hoje é o esperado de quem começou ou acabou de subir a dose.
   Enjoo em quatro dos últimos sete dias é outra frase: é o que separa
   "efeito da dose subindo" de "isso não está passando", e é exatamente o
   que muda a conduta na consulta. Até aqui a tela lia só o dia de hoje, e
   quem se acostuma com um sintoma para de achar que vale contar.

   Por isso o aviso traz o NÚMERO de dias: "quatro dos últimos sete" é um
   fato que a pessoa leva para a consulta, "você tem enjoo com frequência"
   é uma impressão que ela já tinha.

   O intestino preso aparece nas duas leituras, e não é repetição: a régua
   do campo conta dias seguidos sem ir — um episódio —, e aqui conta dias
   da semana com o intestino lento, que é o padrão de quem vai a cada três
   dias sem nunca ficar quatro sem ir.

   A ordem é a da urgência, e só o primeiro que bate aparece. */
const SEMANA = 7;

const PERSISTENCIA: {
  dias: number;
  noDia: (c: any) => boolean;
  hoje: (n: Niveis) => boolean;
  titulo: string;
  texto: (n: number) => string;
}[] = [
  {
    dias: 3,
    noDia: (c) => ((c?.sint?.vomito ?? 0) as number) >= 1,
    hoje: (n) => n.vomito >= 1,
    titulo: 'Vômito em dias repetidos',
    texto: (n) => `${n} dos últimos sete dias com vômito atrapalha segurar comida, líquido e a própria medicação. Não espere a consulta marcada: fale com sua equipe esta semana.`,
  },
  {
    dias: 3,
    noDia: (c) => c?.gut === 'solto',
    hoje: (n) => n.solto >= 1,
    titulo: 'O intestino está solto há dias',
    texto: (n) => `${n} dos últimos sete dias assim já pesa na hidratação e nos sais. Beba mais do que a sede pede e conte para sua equipe — pode ser a dose, pode ser o que mudou na alimentação.`,
  },
  {
    dias: 4,
    /* 6 na régua de armazenamento é o 3 da tela — enjoo que incomodou. */
    noDia: (c) => ((c?.nausea ?? 0) as number) >= 6,
    hoje: (n) => n.nausea >= 3,
    titulo: 'O enjoo não está passando',
    texto: (n) => `${n} dos últimos sete dias com enjoo é o tipo de coisa que costuma mudar com a dose ou com a velocidade do aumento. Leve esse número para a próxima consulta — é uma conversa que existe.`,
  },
  {
    dias: 5,
    noDia: (c) => c?.gut === 'preso',
    hoje: (n) => n.preso >= 1,
    titulo: 'O intestino está lento a semana toda',
    texto: (n) => `${n} dos últimos sete dias com o intestino preso. Água ao longo do dia, fibra e caminhada ajudam, mas nesse ritmo vale contar para sua equipe — às vezes é a dose, às vezes é o quanto você está comendo.`,
  },
];

/* "Outro" não tem régua, e não podia ter: a escala mede quanto pesou um
   sintoma que a tela sabe nomear, e aqui a tela não sabe qual é.
   Perguntar a intensidade antes do nome é pedir o adjetivo sem o
   substantivo — então ele abre um campo de escrever, e o que a pessoa
   digitar é o registro. Vive em `outroTexto`, fora do mapa `sint`, que
   continua só com números. */

/* Armazenamento é 0–10; a tela fala 1–5. A conversão mora na fronteira,
   nos dois sentidos, e é a mesma de medir-sintomas. Vale para os sintomas
   e para a energia, que também é lida em 0–10 pelo radar, pelas metas e
   pela série do balanço. */
const paraTela = (v: any) => (typeof v === 'number' && v > 0 ? Math.round(v / 2) : null);

export default function Checkin() {
  const S = useStore((s) => s.S);
  const update = useStore((s) => s.update);
  const router = useRouter();

  /* A tela abre com o que já foi registrado hoje. Sem isso, "Editar" — que
     o sheet de registrar oferece quando o dia já tem check-in — abria em
     branco e o segundo salvamento apagava o primeiro.

     Cada sintoma tem UMA fonte, nunca duas. Os três com coluna própria
     (enjoo, constipação, refluxo) são lidos da coluna; os outros quatro,
     que só existem aqui, do mapa `sint`.

     Guardar os três nos dois lugares era o que eu tinha feito antes, e
     quebrou na primeira vez que medir-sintomas mexeu no enjoo: a coluna ia
     para 4 e o `sint` continuava em 4 da régua antiga, dizendo coisas
     diferentes sobre o mesmo sintoma. Uma fonte por campo elimina a
     possibilidade da divergência em vez de tentar sincronizá-la. */
  const hoje: any = checkinToday(S);
  const inicial = (() => {
    const g: Record<string, number> = {};
    const m: string[] = [];
    /* Percorre SINTOMAS, e não as chaves do registro, para os marcados
       saírem na mesma ordem dos chips. Os dois especiais têm cada um a
       sua prova de existência: "Outro" é o texto, e o intestino é `gut`
       fora do normal — `normal` gravado é uma resposta ("foi bem"), não
       um sintoma, e deixa o chip desmarcado como o zero de náusea faz. */
    for (const x of SINTOMAS) {
      if (x.id === OUTRO) {
        if (String(hoje?.outroTexto || '').trim()) m.push(OUTRO);
        continue;
      }
      if (x.id === GUT) {
        if (hoje?.gut && hoje.gut !== 'normal') m.push(GUT);
        continue;
      }
      const v = x.store ? paraTela(hoje?.[x.store]) : (hoje?.sint?.[x.id] ?? null);
      if (v == null) continue;
      m.push(x.id); g[x.id] = v;
    }
    return { marcados: m, grau: g };
  })();

  const [marcados, setMarcados] = useState<string[]>(inicial.marcados);
  const [grau, setGrau] = useState<Record<string, number>>(inicial.grau);
  /* null = ainda não respondido. Voltar a um valor padrão aqui reinventaria
     o problema que essas telas acabaram de deixar de ter: gravar como
     resposta um número que ninguém deu. */
  const [energia, setEnergia] = useState<number | null>(paraTela(hoje?.energia));
  const [sono, setSono] = useState<number | null>(hoje?.sono ?? null);
  const [humor, setHumor] = useState<number | null>(hoje?.mood ?? null);
  const [outro, setOutro] = useState<string>(hoje?.outroTexto ?? '');
  const [gut, setGut] = useState<string | null>(
    hoje?.gut && hoje.gut !== 'normal' ? hoje.gut : null,
  );
  /* Os dois lados do eixo se medem, e em unidades diferentes: preso conta
     DIAS sem ir, solto conta IDAS no dia. Por isso são dois estados, e não
     um número que troca de significado — trocar de lado não devia carregar
     o número do lado anterior. Alternar não se conta em nenhuma das duas. */
  const [dias, setDias] = useState<number | null>(paraTela(hoje?.constip));
  const [vezes, setVezes] = useState<number | null>(paraTela(hoje?.diarreia));

  /* Marcar um sintoma já grava 3 — o meio da régua — em vez de deixar a
     intensidade em branco. Aqui o vazio não cabe: o sintoma só está na
     lista porque a pessoa disse que teve, e salvar mandava 3 de qualquer
     jeito. Com a escala nascendo em branco, a tela dizia "ainda não
     respondi" e guardava "incomodou" — duas coisas diferentes sobre o
     mesmo campo. Agora ela mostra o que vai salvar, e a pessoa ajusta. */
  const alterna = (id: string) => {
    const tinha = marcados.includes(id);
    setMarcados((m) => (tinha ? m.filter((x) => x !== id) : [...m, id]));
    if (!tinha && id !== OUTRO && id !== GUT) setGrau((g) => (g[id] == null ? { ...g, [id]: 3 } : g));
  };

  /* Escolher um lado já põe a contagem no meio, pelo mesmo motivo que
     marcar um sintoma já põe a intensidade em 3: a tela mostra o que vai
     salvar. */
  const escolheGut = (k: string) => {
    setGut(k);
    if (k === 'preso') setDias((d) => (d == null ? 3 : d));
    if (k === 'solto') setVezes((v) => (v == null ? 3 : v));
  };

  /* Zero quando o sintoma não está marcado: as leituras enxergam o dia
     como ele foi respondido, não o que ficou guardado no estado de um chip
     que a pessoa desmarcou. */
  const nivel = (id: string) => (marcados.includes(id) ? (grau[id] ?? 3) : 0);
  const noGut = marcados.includes(GUT);
  const niveis: Niveis = {
    nausea: nivel('nausea'),
    dor: nivel('dor'),
    vomito: nivel('vomito'),
    tontura: nivel('tontura'),
    preso: noGut && gut === 'preso' ? (dias ?? 3) : 0,
    solto: noGut && gut === 'solto' ? (vezes ?? 3) : 0,
  };

  const combinado = COMBINACOES.find((x) => x.quando(niveis)) ?? null;

  /* Os dias ANTERIORES, sem o de hoje: o registro salvo de hoje pode estar
     atrás do que a pessoa acabou de marcar na tela, e contaria o dia com o
     valor velho. Hoje entra pela resposta que está na tela agora, então a
     conta muda enquanto ela responde. */
  const anteriores = React.useMemo(() => {
    const t = +startOfDay(now());
    const desde = t - SEMANA * 24 * 3600 * 1000;
    return (S.checkins as any[]).filter((c) => c.t < t && c.t >= desde);
  }, [S.checkins]);

  const persistente = (() => {
    for (const r of PERSISTENCIA) {
      const n = anteriores.filter(r.noDia).length + (r.hoje(niveis) ? 1 : 0);
      if (n >= r.dias) return { titulo: r.titulo, texto: r.texto(n) };
    }
    return null;
  })();

  /* Uma mensagem por vez no cartão de baixo. A combinação fala do agora e
     manda agir hoje; a persistência fala da semana e manda levar para a
     consulta — as duas juntas competem, e a do agora ganha. */
  const leitura = combinado ?? persistente;

  const salvar = () => {
    update((s: any) => {
      const t = +startOfDay(now());

      /* Escreve DENTRO do registro do dia, em vez de apagar e recriar. A
         versão anterior filtrava o dia fora da lista e empurrava um objeto
         novo — e levava junto a água e a proteína que a pessoa já tinha
         registrado antes do check-in. Fazer check-in apagava o copo d'água
         das dez da manhã. */
      const c = registroDoDia(s, t);

      /* A escala da tela é 1–5; as colunas legadas são 0–10. Dobrar mantém
         as duas leituras coerentes sem reescrever quem já consome. */
      for (const x of SINTOMAS) {
        if (!x.store) continue;
        c[x.store] = marcados.includes(x.id) ? (grau[x.id] ?? 3) * 2 : 0;
      }

      /* `sint` guarda SÓ os sintomas sem coluna própria. Os três com coluna
         vivem na coluna e em lugar nenhum além dela. */
      c.sint = Object.fromEntries(
        marcados
          .filter((id) => id !== OUTRO && id !== GUT && !SINTOMAS.find((x) => x.id === id)?.store)
          .map((id) => [id, grau[id] ?? 3]),
      );

      /* INTESTINO — um eixo, gravado em dois lugares com papéis distintos.

         `gut` diz a DIREÇÃO e é o campo que "como o corpo reagiu" também
         escreve. `constip` continua sendo a coluna numérica de quantos
         dias sem ir, porque Ritmo, Semana e Sintomas leem dali; ela só
         tem valor quando o intestino está preso.

         Chip desmarcado grava `normal`, do mesmo jeito que um sintoma não
         marcado grava zero: é a pessoa dizendo que o intestino foi bem,
         não uma lacuna. Marcado sem escolher o estado é o único caso que
         não afirma nada — ela disse que teve algo e não disse o quê, e
         inventar um lado seria pior do que deixar como estava. */
      const marcouGut = marcados.includes(GUT);
      if (!marcouGut) { c.gut = 'normal'; c.constip = 0; c.diarreia = 0; }
      else if (gut) {
        c.gut = gut;
        c.constip = gut === 'preso' ? (dias ?? 3) * 2 : 0;
        c.diarreia = gut === 'solto' ? (vezes ?? 3) * 2 : 0;
      }

      /* Desmarcar "Outro" apaga o texto: ele é a única prova de que o
         sintoma existiu, e deixá-lo para trás faria a pessoa desmarcar na
         tela e continuar registrada no arquivo. */
      if (marcados.includes(OUTRO) && outro.trim()) c.outroTexto = outro.trim();
      else delete c.outroTexto;
      /* Só o que foi respondido é gravado. Deixar uma escala em branco
         mantém o campo ausente, e ausente continua sendo diferente de
         zero para quem lê. */
      if (energia != null) c.energia = energia * 2;
      if (sono != null) c.sono = sono;
      if (humor != null) c.mood = humor;

      /* Fome fica em medir-sintomas, junto de intestino: as duas telas não
         perguntam a mesma coisa. A anotação livre saiu por ora; `c.note`
         não é mais escrito aqui, e por isso o que já estiver gravado
         continua onde está em vez de ser apagado por um campo ausente. */

      s.heroSeen = { milestone: 0, insight: null, replay: null };
    });
    router.replace('/(tabs)/jornada' as any);
  };

  return (
    /* Sem ação no topo. O "Salvar" morava ali E no rodapé fixo, e duas
       portas para a mesma saída só fazem a pessoa decidir qual delas é a
       de verdade — ainda mais quando uma é um link pequeno e a outra um
       botão de largura inteira, que é o que a tela quer que se aperte. */
    <TelaInterna
      titulo="Check-in"
      fechar
      rodape={<Botao label="Salvar check-in" onPress={salvar} />}
    >
      <Titulao
        titulo="Como foi o seu dia?"
        lead="Responda o que fizer sentido. Deixar em branco também é uma resposta."
      />

      {/* As três quase se tocam, como os cartões de "Sua evolução" na
          Home. Elas são um bloco só — as perguntas que a tela faz todo
          dia —, e o ar de antes entre uma e outra as fazia parecer três
          assuntos empilhados por acaso. O respiro maior fica para as
          quebras que existem de verdade: o titulão e os sintomas. */}
      <View style={{ gap: 4 }}>
        <Campo rotulo="Energia">
          <Escala
            valores={[1, 2, 3, 4, 5]}
            valor={energia}
            onChange={(v) => setEnergia(Number(v))}
            onLimpar={() => setEnergia(null)}
            legendas={ENERGIA}
          />
        </Campo>

        <Campo rotulo="Sono">
          <Escala
            valores={[5, 6, 7, 8, 9]}
            valor={sono}
            onChange={(v) => setSono(Number(v))}
            onLimpar={() => setSono(null)}
            legendas={SONO}
          />
        </Campo>

        <Campo rotulo="Humor">
          <Escala
            valores={[1, 2, 3, 4, 5]}
            valor={humor}
            onChange={(v) => setHumor(Number(v))}
            onLimpar={() => setHumor(null)}
            legendas={HUMOR}
          />
        </Campo>
      </View>

      {/* Daqui para baixo é a parte que a pessoa descreve. Nada aqui é
          obrigatório, e um dia sem sintoma nenhum passa direto.

          A escolha fica FORA do cartão. Ela não é um formulário, é uma
          pergunta com respostas soltas na tela; embrulhada num cartão
          igual aos de cima, virava mais um painel numa pilha de painéis.
          Cartão só aparece depois, e um por sintoma marcado — o que dá à
          tela a forma do dia que a pessoa teve, em vez de uma grade fixa
          esperando ser preenchida. */}
      <View style={{ gap: 14 }}>
        <Campo rotulo="Teve algum sintoma?" nu>
          <Opcoes>
            {SINTOMAS.map((x) => (
              <Opc key={x.id} label={x.label} on={marcados.includes(x.id)} onPress={() => alterna(x.id)} />
            ))}
          </Opcoes>
        </Campo>

        {/* Os cartões dos sintomas são a continuação da escolha de cima,
            então ficam colados entre si e perto dela.

            Cada um traz a régua do SEU sintoma: o 5 da náusea é vomitar, o
            da constipação é o quarto dia sem ir ao banheiro. Sem escala
            aqui — quem quer desfazer desmarca o chip, que é de onde o
            cartão veio. */}
        <View style={{ gap: 4 }}>
          {/* Os cartões seguem a ordem dos chips, não a ordem em que foram
              tocados: a lista não se reembaralha conforme a pessoa marca,
              e o que ela vê embaixo tem a mesma sequência do que está em
              cima. */}
          {SINTOMAS.filter((x) => marcados.includes(x.id)).map((s) => {
            const id = s.id;

            if (id === GUT) {
              /* A saia do intestino atende os dois lados — só um deles
                 pode estar escolhido de cada vez. */
              const avGut = !combinado && gut === 'preso' && (dias ?? 0) >= AVISO_PRESO.min ? AVISO_PRESO
                : !combinado && gut === 'solto' && (vezes ?? 0) >= AVISO_SOLTO.min ? AVISO_SOLTO
                : null;
              return (
                <Campo
                  key={id}
                  rotulo="Como foi o intestino?"
                  saia={avGut ? <Aviso dentro ic="aura" titulo={avGut.titulo} texto={avGut.texto} /> : undefined}
                >
                  <Opcoes>
                    {INTESTINO.filter(([k]) => k !== 'normal').map(([k, rotulo]) => (
                      <Opc key={k} label={rotulo} on={gut === k} onPress={() => escolheGut(k)} />
                    ))}
                  </Opcoes>
                  {/* Uma régua por lado, cada uma na sua unidade: dias sem
                      ir de um lado, idas no dia do outro. Alternar fica sem
                      contagem — dizer quantas vezes num dia que teve os dois
                      pede uma resposta que ninguém tem na ponta da língua. */}
                  {gut === 'preso' ? (
                    <Escala
                      suave
                      valores={[1, 2, 3, 4, 5]}
                      valor={dias}
                      onChange={(v) => setDias(Number(v))}
                      onLimpar={() => setDias(null)}
                      legendas={SINTOMA.constip}
                    />
                  ) : null}

                  {gut === 'solto' ? (
                    <Escala
                      suave
                      valores={[1, 2, 3, 4, 5]}
                      valor={vezes}
                      onChange={(v) => setVezes(Number(v))}
                      onLimpar={() => setVezes(null)}
                      legendas={SINTOMA.diarreia}
                    />
                  ) : null}

                </Campo>
              );
            }

            if (id === OUTRO) {
              return (
                <Campo key={id} rotulo="Qual foi o outro sintoma?">
                  <Texto
                    valor={outro}
                    onChange={setOutro}
                    placeholder="Ex.: gosto metálico na boca"
                    linhas={1}
                  />
                </Campo>
              );
            }

            const av = AVISOS[id];
            const mostra = !combinado && av && (grau[id] ?? 0) >= av.min;
            return (
              <Campo
                key={id}
                rotulo={`${s.label} · intensidade`}
                saia={mostra ? <Aviso dentro ic="aura" titulo={av!.titulo} texto={av!.texto} /> : undefined}
              >
                <Escala
                  suave
                  valores={[1, 2, 3, 4, 5]}
                  valor={grau[id] ?? null}
                  onChange={(v) => setGrau((g) => ({ ...g, [id]: Number(v) }))}
                  legendas={SINTOMA[id] ?? INTENSIDADE}
                />
              </Campo>
            );
          })}
        </View>

        {/* Fecha o bloco dos sintomas: é a leitura do conjunto — dos
            sintomas de hoje entre si, ou dos últimos sete dias —, e por
            isso vem depois de todos eles e não dentro de nenhum. */}
        {leitura ? (
          <Aviso destaque ic="aura" titulo={leitura.titulo} texto={leitura.texto} />
        ) : null}
      </View>

      <View />
    </TelaInterna>
  );
}
