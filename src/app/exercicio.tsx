import React, { useState } from 'react';
import { View } from 'react-native';
import { useRouter } from 'expo-router';
import { useStore } from '../logic/store';
import {
  checkinToday, fontesDeMovimento, listaPt,
  diasDeForca, diasDoPeriodo, resumoDeMovimento, semanaDeMovimento,
  semanasDeMovimento, treinosRecentes,
} from '../logic/derive';
import { fmtDate, now, startOfDay, WD } from '../logic/time';
import { Txt, Row, Vazio } from '../ui/kit';
import {
  Bloco, CardCurva, CardSemana, Cartao, Chips, Grade2, Linha,
  Metrica, TiraDeDias,
} from '../ui/internas';
import { AtalhoDaCapa, CapaDeHabito, FolhaDeHabito, TelaDeHabito } from '../ui/capa';
import { Icon } from '../ui/Icon';
import { useTheme } from '../ui/useTheme';
import { radius } from '../theme';

/* ============================================================
   EXERCÍCIO

   A tela que lê `treinos`. O campo existia desde que a modalidade deixou
   de morar só no rótulo do botão, e até agora ninguém olhava para ele —
   o que faz de um dado guardado um dado morto.

   O QUE ELA MOSTRA, E POR QUÊ NESSA ORDEM

   A semana primeiro, e não o dia. Exercício é uma coisa semanal: quem
   treinou forte segunda e descansou terça não teve um dia ruim, teve uma
   terça. O número de hoje SOZINHO transforma descanso em falha.

   A capa mostra o dia, e a palavra sozinho é que segura a contradição:
   as sete barras da semana vêm logo abaixo dela, na primeira rolagem. O
   topo é o marcador de onde a pessoa está agora; a tese da tela continua
   sendo a semana, e é ela que o corpo abre.

   E o dia já estava aqui: em letra miúda, no rodapé, depois das
   integrações — "Hoje: 0 de 60 min", onde ninguém rolava para ler. A
   escolha nunca foi entre ter e não ter o dia; era entre dá-lo de frente
   ou escondê-lo no fim e chamar isso de hierarquia.

   Depois a força, porque é o que importa NESTE tratamento. Em déficit
   calórico quem só faz cardio perde massa magra junto com a gordura, e
   massa magra é justamente o que o app passa o dia tentando segurar —
   com proteína de um lado e movimento do outro. A linha relata, não
   cobra: diz quantos dias houve, e para.

   Depois o que se tem feito, por modalidade. É a única coisa que os
   minutos sozinhos não sabem dizer, e é por isso que `treinos` existe.

   Depois a lista, que é o registro em si — e de onde dá para apagar.

   A CONTRADIÇÃO QUE PRECISA SER DITA

   Os minutos e os treinos não batem, e não deveriam. Quem tem o relógio
   ligado recebe minutos que ninguém digitou, e o telefone não sabe que
   aquilo era caminhada. Um dia com 40 minutos e nenhum treino na lista
   não é erro — é movimento que chegou sozinho. Em vez de uma nota de
   rodapé pedindo desculpa pela diferença, isso virou a porta para as
   integrações: o lugar onde a diferença se explica é o mesmo onde ela se
   configura.
   ============================================================ */

/* O período governa o RESUMO e o CADERNO juntos — os dois falam do
   mesmo recorte. Um seletor que só filtrasse a lista seria enfeite; o
   que ele faz aqui é trocar a pergunta: como foi o meu mês, e não só o
   que aconteceu hoje.

   Não passa de três meses porque abaixo disso a tela já tem a curva de
   oito semanas, e acima disso a lista vira rolagem sem fim. */
const PERIODOS = [
  { id: '7', label: '7 dias', dias: 7 },
  { id: '30', label: '30 dias', dias: 30 },
  { id: '90', label: '3 meses', dias: 90 },
];

/* "6 h 20" em vez de "380 min": acima de uma hora, minuto puro obriga a
   pessoa a dividir de cabeça para saber se aquilo é muito. */
function duracao(min: number): string {
  if (min < 60) return `${min} min`;
  const h = Math.floor(min / 60);
  const m = min % 60;
  return m ? `${h} h ${m}` : `${h} h`;
}

export default function Exercicio() {
  const S = useStore((s) => s.S);
  const update = useStore((s) => s.update);
  const { c } = useTheme();
  const router = useRouter();
  const [per, setPer] = useState('30');
  const dias = PERIODOS.find((x) => x.id === per)!.dias;
  /* O DIA ESCOLHIDO — sempre há um, e começa em hoje.

     A tira nasceu como filtro opcional: sem escolha, o caderno listava o
     período inteiro. Duas coisas na mesma seção dizendo coisas
     diferentes — um seletor de data em cima e, embaixo, tudo. Ou o
     seletor manda, ou ele é enfeite.

     Agora ele manda. Tocar num dia troca o dia; não existe "soltar" para
     voltar a ver tudo, porque ver tudo é justamente o que contradizia o
     seletor. Quem procura um treino antigo usa a tira, que é para isso —
     e os pontos embaixo de cada número dizem onde procurar sem tentativa
     e erro.

     Trocar de período volta para hoje: um 12 de setembro escolhido não
     existe mais dentro de "7 dias". */
  const [diaSel, setDiaSel] = useState<number>(() => +startOfDay(now()));
  const escolhePeriodo = (id: string) => { setPer(id); setDiaSel(+startOfDay(now())); };

  const alvoDia = (S.profile as any).targets.exercMin as number;
  const semana = semanaDeMovimento(S);
  const daSemana = semana.reduce((s, d) => s + d.min, 0);
  const comMovimento = semana.filter((d) => d.min > 0).length;

  /* A curva só aparece quando há mais de uma semana com movimento: duas
     semanas vazias e uma cheia não formam tendência, formam um degrau. */
  const semanas = semanasDeMovimento(S, 8);
  const comHistorico = semanas.filter((w) => w.min > 0).length >= 2;
  const mediaSemanal = Math.round(semanas.reduce((x, w) => x + w.min, 0) / semanas.length);

  const forca = diasDeForca(S);
  const treinos = treinosRecentes(S, dias);
  const resumo = resumoDeMovimento(S, dias);
  /* A tira termina em hoje. Chegou a ter o dia seguinte, tracejado, para
     não parecer cortada — mas um caderno registra o que foi feito, e o
     amanhã ali só ocupava espaço com uma casa que ninguém pode abrir. */
  const calendario = diasDoPeriodo(S, dias);
  const fontes = fontesDeMovimento(S);
  const hoje = Math.round((checkinToday(S) as any)?.exerc || 0);

  /* Uma lista simples, do dia escolhido.

     Ela já foi agrupada por data, com um cabeçalho por dia — fazia
     sentido enquanto o caderno listava o período inteiro e a mesma data
     se repetia em toda linha. Com um dia por vez o cabeçalho passou a
     repetir o que a tira logo acima já diz, e um agrupamento de um grupo
     só é estrutura sem trabalho. */
  const doDia = treinos.filter((tr) => tr.t === diaSel);

  return (
    <TelaDeHabito>
      {/* A CAPA — a mesma das outras duas telas de hábito. Ver
          src/ui/capa.tsx.

          A FOTO É UMA ESCADA SENDO SUBIDA — pernas e tênis, sem rosto e
          sem torso. Movimento de verdade, e não um corpo em exposição:
          num app de perda de peso a diferença entre as duas coisas é a
          diferença entre convidar e cobrar. E subir escada é exercício
          que não pede academia nem roupa própria.

          UM BOTÃO SÓ, e não três como na água. Lá um toque completa um
          registro, porque um copo é uma quantidade inteira; aqui a sessão
          precisa do TEMPO, e uma pastilha "Caminhada" que gravasse
          sozinha teria de inventar trinta minutos que ninguém disse. */}
      <CapaDeHabito
        foto={require('../../assets/images/exercicio-hero.jpg')}
        titulo="Exercício"
        /* EM ZERO A LINHA FALA DA SEMANA, e não do que falta hoje.

           "0 de 60 min · faltam 60 min" diz a mesma coisa duas vezes, e
           diz só a pior metade: num hábito em que descansar faz parte, a
           resposta útil para um dia ainda vazio é quanto a semana já tem.
           E "sem treino ainda" em vez de "descanso" porque ausência de
           registro não é descanso — é ausência de registro. */
        linha={hoje === 0
          ? `Hoje: sem treino ainda · ${daSemana} min nesta semana`
          : `Hoje: ${hoje} de ${alvoDia} min · ${hoje >= alvoDia ? 'meta alcançada' : `faltam ${alvoDia - hoje} min`}`}
        pct={Math.round((hoje / alvoDia) * 100)}
      >
        <AtalhoDaCapa
          titulo="Registrar um treino"
          cheio
          onPress={() => router.push('/medir-exercicio' as any)}
        />
      </CapaDeHabito>

      <FolhaDeHabito>
        {/* Por que um app de GLP-1 tem tela de exercício. */}
        <Txt v="note" c={c.tx2} style={{ paddingHorizontal: 2 }}>
          Junto com a proteína, é o que segura a massa magra durante a perda
          de peso.
        </Txt>

      {/* Os dois gráficos são UM grupo: a semana e a tendência dela.

          Como filhos diretos da TelaInterna eles caíam nos 26 px que
          separam SEÇÕES, e ficavam tão longe um do outro quanto do
          caderno — como se fossem três assuntos. Dentro de um View com
          gap 10, que é a distância de cartões irmãos no resto do app,
          eles leem como duas vistas da mesma coisa. */}
      <View style={{ gap: 10 }}>
      {/* A SEMANA — a unidade em que exercício faz sentido.

          O desenho inteiro deste cartão morava aqui solto, e virou
          componente quando a alimentação pediu a mesma leitura com
          gramas no lugar de minutos. O rodapé é o que sobrou de
          específico: a linha de treino de força.

          Sem meta semanal no número grande. A meta do app é diária (60
          min); multiplicar por sete inventaria uma cobrança de 420 min
          que nenhuma recomendação faz, e que deixaria toda semana normal
          parecendo fracasso. O que se conta é o que houve. */}
      <CardSemana
        nome="Esta semana"
        sub={comMovimento === 0
          ? 'Nenhum dia com movimento'
          : `Em ${comMovimento} ${comMovimento === 1 ? 'dia' : 'dias'} dos sete`}
        valor={String(daSemana)}
        unidade="min"
        dias={semana.map((d) => ({ t: d.t, v: d.min }))}
        alvo={alvoDia}
        rotuloMeta={`Meta: ${alvoDia} min`}
        rodape={(
          /* Uma linha, e não um cartão. A proporção de força já teve
             barra, legenda e minutos por modalidade aqui — resumo bonito
             que não mudava nenhuma decisão. O fato importa e cabe numa
             frase. */
          <Row gap={8} style={{ paddingHorizontal: 16, paddingVertical: 14 }}>
            <Icon name="shield" size={15} color={forca ? c.ok : c.tx4} sw={2} />
            <Txt v="caption" c={c.tx2} style={{ flex: 1 }}>
              {forca === 0
                ? 'Nenhum treino de força nesta semana. Musculação, pilates e funcional são o que segura o músculo.'
                : `${forca} ${forca === 1 ? 'dia' : 'dias'} com treino de força — é o que segura o músculo enquanto o peso cai.`}
            </Txt>
          </Row>
        )}
      />

      {/* A TENDÊNCIA — a pergunta que a semana isolada não alcança.

          As barras de cima dizem como foi esta semana. Esta curva diz se
          a pessoa está se mexendo mais ou menos do que estava há dois
          meses, que num tratamento de meses é a pergunta que importa e
          que nada na tela respondia. */}
      {comHistorico ? (
        <View>
          <CardCurva
            id="ex"
            nome="Minutos por semana"
            sub="Média das últimas 8 semanas"
            valor={String(mediaSemanal)}
            unidade="min"
            /* Mais alta que o padrão porque é a única coisa nesta tela que
               olha para trás de verdade — as barras de cima cobrem sete
               dias, e sete dias não dizem se a pessoa está se mexendo mais
               do que há dois meses. Altura é o que separa a resposta
               principal da nota de rodapé. */
            altura={140}
            pontos={semanas.map((w) => ({
              v: w.min,
              rotulo: String(w.min),
              quando: `semana de ${fmtDate(new Date(w.t))}`,
            }))}
          />
        </View>
      ) : null}
      </View>

      {/* OS DESTAQUES DO PERÍODO

          Quatro números que a lista não dá de graça: quantos treinos,
          quanto tempo ao todo, qual foi o maior, e quanto daquilo puxou
          músculo. Eles e o caderno respondem ao mesmo seletor, porque
          são a mesma pergunta em duas resoluções — o resumo e o detalhe.

          Tudo aqui conta só o que foi registrado nesta tela. Somar o que
          o relógio trouxe faria o resumo dizer 12 h sobre uma lista que
          mostra 6 h. */}
      <Bloco titulo="No período" nota="Só o que foi registrado aqui — o que vem do relógio não tem modalidade.">
        <View style={{ gap: 10 }}>
          <Chips itens={PERIODOS.map((x) => ({ id: x.id, label: x.label }))} valor={per} onChange={escolhePeriodo} />
          {/* Os quatro aparecem SEMPRE, zerados quando não houve nada.

              Trocar os quadros por uma frase de "nenhum registro" fazia a
              tela mudar de forma conforme o conteúdo: quem abre num
              período vazio nunca descobre que ali moram quatro números, e
              quem registra o primeiro treino vê o layout inteiro pular.

              Zero é um resultado, e é a mesma regra que já vale para água,
              proteína e exercício no resto do app: o dia começa vazio e
              isso é a verdade dele, não a ausência dela. */}
          <View style={{ gap: 10 }}>
            <Grade2>
              <Metrica ic="dumbbell" nome="Treinos" para={String(resumo.treinos)} />
              <Metrica ic="clock" nome="Tempo" para={duracao(resumo.min)} />
            </Grade2>
            <Grade2>
              <Metrica ic="run" nome="Mais longo" para={duracao(resumo.maisLongo)} />
              <Metrica
                ic="shield"
                nome="De força"
                para={duracao(resumo.forca)}
                selo={resumo.forca ? `${Math.round((resumo.forca / resumo.min) * 100)}%` : undefined}
                seloTom="verde"
              />
            </Grade2>
          </View>
        </View>
      </Bloco>

      {/* O CADERNO

          Agrupado por dia, com o desenho da modalidade na frente. Em
          lista corrida a data se repetia em toda linha e o olho tinha que
          juntar sozinho o que era do mesmo dia — aqui a data aparece uma
          vez, e embaixo dela o que aconteceu. */}
      <Bloco
        titulo="Caderno de treino"
        nota={treinos.length ? 'Toque num treino para ver, corrigir ou apagar.' : undefined}
      >
        {/* A tira e o dia que ela escolhe no mesmo empilhamento, com o
            mesmo respiro que separa os chips dos quadros no bloco de
            cima: são controle e conteúdo, não duas seções. */}
        <View style={{ gap: 10 }}>
          <TiraDeDias
            dias={calendario.map((d) => ({ t: d.t, marcado: d.itens > 0, hoje: d.hoje }))}
            sel={diaSel}
            onEscolhe={setDiaSel}
          />

          {doDia.length ? (
            <Cartao>
              {/* A seta abre a folha do treino: ela MOSTRA, e só depois
                  oferece corrigir e apagar. Abrir o formulário direto era
                  rápido e errado — quem toca num treino ainda não decidiu
                  mexer nele, pode estar só conferindo o que foi aquele dia. */}
              {doDia.map((t) => (
                <Linha
                  key={`${t.t}-${t.i}`}
                  ic={t.ic}
                  titulo={t.tipo}
                  /* A origem entra aqui e não numa segunda linha: ela
                     qualifica a duração — 50 min que você digitou e 50 min
                     que o relógio contou não se conferem do mesmo jeito — e
                     é ao lado do número que ela é lida. */
                  sub={`${t.min} min · ${t.fonte}`}
                  onPress={() => router.push(`/treino?t=${t.t}&i=${t.i}` as any)}
                />
              ))}
            </Cartao>
          ) : (
            /* Dia sem treino não é falha: pode ter sido descanso, e
               descanso faz parte de treinar. Uma frase só, e curta — quem
               escolheu um dia na tira já sabe qual dia é, e a explicação
               de por que o total da semana pode ser maior que esta lista
               mora na nota do bloco de cima, que é onde ela qualifica um
               número de verdade. */
            <Vazio
              ic="dumbbell"
              titulo="Nenhum treino neste dia"
              texto="Descanso também faz parte."
            />
          )}
        </View>
      </Bloco>

      {/* Um atalho, e não uma explicação. Este bloco chegou a se chamar
          "De onde vêm os minutos" e gastava três linhas justificando por
          que o caderno é mais curto que o total — uma diferença que quem
          está aqui provavelmente nem notou. O que serve é a porta.

          TODAS as fontes, e não a primeira: ninguém tem só uma, e quem
          usa Garmin costuma ter o Apple Saúde ligado junto. */}
      <Bloco titulo="Integrações">
        <Cartao>
          <Linha
            ic="watch"
            titulo={fontes.length ? listaPt(fontes) : 'Conectar um relógio ou app'}
            sub={fontes.length ? 'Lançam os minutos sozinhos' : 'Apple Saúde, Health Connect, Garmin e outros'}
            onPress={() => router.push('/integracoes' as any)}
          />
        </Cartao>
      </Bloco>

      </FolhaDeHabito>
    </TelaDeHabito>
  );
}
