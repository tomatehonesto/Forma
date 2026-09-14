import React, { useState } from 'react';
import { View } from 'react-native';
import { useRouter } from 'expo-router';
import { useStore } from '../logic/store';
import {
  checkinToday, fontesDeMovimento, listaPt,
  diasDeForca, resumoDeMovimento, semanaDeMovimento, semanasDeMovimento, treinosRecentes,
} from '../logic/derive';
import { fmtDate, relDay, WD } from '../logic/time';
import { Txt, Row } from '../ui/kit';
import {
  TelaInterna, Titulao, Bloco, Cartao, CardCurva, Chips, Grade2, Linha, Metrica, Botao,
} from '../ui/internas';
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
   terça. O número de hoje sozinho transforma descanso em falha.

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

  const alvoDia = (S.profile as any).targets.exercMin as number;
  const semana = semanaDeMovimento(S);
  const daSemana = semana.reduce((s, d) => s + d.min, 0);
  const comMovimento = semana.filter((d) => d.min > 0).length;
  /* O teto da barra é a meta do dia, ou o maior dia se ele passou dela —
     assim um dia de 60 min enche a barra e um de 90 não sai da caixa. */
  const teto = Math.max(alvoDia, ...semana.map((d) => d.min));
  const ALT = 64;

  /* A curva só aparece quando há mais de uma semana com movimento: duas
     semanas vazias e uma cheia não formam tendência, formam um degrau. */
  const semanas = semanasDeMovimento(S, 8);
  const comHistorico = semanas.filter((w) => w.min > 0).length >= 2;
  const mediaSemanal = Math.round(semanas.reduce((x, w) => x + w.min, 0) / semanas.length);

  const forca = diasDeForca(S);
  const treinos = treinosRecentes(S, dias);
  const resumo = resumoDeMovimento(S, dias);
  const fontes = fontesDeMovimento(S);
  const hoje = Math.round((checkinToday(S) as any)?.exerc || 0);

  /* O registro agrupado por dia, que é como um caderno de treino se lê:
     a data uma vez, e embaixo o que aconteceu nela. Em lista corrida, a
     mesma data se repetia em toda linha e o olho tinha que juntar. */
  const porDia = treinos.reduce<{ t: number; itens: typeof treinos }[]>((fora, tr) => {
    const ultimo = fora[fora.length - 1];
    if (ultimo && ultimo.t === tr.t) ultimo.itens.push(tr);
    else fora.push({ t: tr.t, itens: [tr] });
    return fora;
  }, []);

  return (
    /* Sem "+" no topo: o rodapé fixo é o mesmo gesto, e dois botões para
       a mesma ação na mesma tela fazem a pessoa procurar a diferença
       entre eles. */
    <TelaInterna
      titulo="Exercício"
      rodape={<Botao label="Registrar um treino" onPress={() => router.push('/medir-exercicio' as any)} />}
    >
      <Titulao
        titulo="Exercício"
        lead="Junto com a proteína, é o que segura a massa magra durante a perda de peso."
      />

      {/* Os dois gráficos são UM grupo: a semana e a tendência dela.

          Como filhos diretos da TelaInterna eles caíam nos 26 px que
          separam SEÇÕES, e ficavam tão longe um do outro quanto do
          caderno — como se fossem três assuntos. Dentro de um View com
          gap 10, que é a distância de cartões irmãos no resto do app,
          eles leem como duas vistas da mesma coisa. */}
      <View style={{ gap: 10 }}>
      {/* A SEMANA — a unidade em que exercício faz sentido.

          Mesmo desenho do cartão de baixo, e não um próprio: cabeçalho
          com nome e contexto à esquerda, o número grande à direita, e o
          gráfico ocupando a largura inteira embaixo. Dois cartões de
          gráfico um em cima do outro com gramáticas diferentes fazem o
          olho procurar a diferença entre eles em vez de ler os dois. */}
      <View style={{ backgroundColor: c.bg1, borderRadius: radius.card, overflow: 'hidden' }}>
        <Row style={{ paddingHorizontal: 16, paddingTop: 16, paddingBottom: 14, alignItems: 'flex-start' }}>
          <View style={{ flex: 1 }}>
            <Txt v="body">Esta semana</Txt>
            <Txt v="note" c={c.tx3} style={{ marginTop: 2 }}>
              {comMovimento === 0
                ? 'Nenhum dia com movimento'
                : `Em ${comMovimento} ${comMovimento === 1 ? 'dia' : 'dias'} dos sete`}
            </Txt>
          </View>
          {/* Sem meta semanal. A meta do app é diária (60 min); multiplicar
              por sete inventaria uma cobrança de 420 min que nenhuma
              recomendação faz, e que deixaria toda semana normal parecendo
              fracasso. O que se conta é o que houve. */}
          <Txt v="metric">
            {daSemana}
            <Txt v="label" c={c.tx3}> min</Txt>
          </Txt>
        </Row>

        {/* A barra diz QUANTOS MINUTOS, e não só "teve ou não teve": cada
            uma carrega o número em cima, e a tracejada marca a meta do
            dia. Barra estreita e redonda porque a de antes ocupava a
            coluna inteira — sete blocos colados viram parede, não
            gráfico. */}
        <View style={{ paddingHorizontal: 16 }}>
          <View style={{ height: ALT + 24 }}>
            <View
              pointerEvents="none"
              style={{
                position: 'absolute', left: 0, right: 0, bottom: Math.round((alvoDia / teto) * ALT),
                /* Em c.line2 a meta some dentro do cartão branco. Linha
                   de referência precisa ser lida de relance, senão o
                   gráfico volta a ser altura sem unidade. */
                borderTopWidth: 1, borderTopColor: c.tx4, borderStyle: 'dashed',
              }}
            />
            <Row style={{ flex: 1, alignItems: 'flex-end' }}>
              {semana.map((d, i) => {
                const eHoje = i === semana.length - 1;
                return (
                  <View key={d.t} style={{ flex: 1, alignItems: 'center' }}>
                    {d.min ? (
                      /* Fundo do cartão atrás do número: a tracejada da
                         meta passa na altura dos rótulos dos dias curtos e
                         cruzava os dígitos. */
                      <Txt
                        v="micro"
                        c={eHoje ? c.tx : c.tx4}
                        style={{ marginBottom: 5, backgroundColor: c.bg1, paddingHorizontal: 3 }}
                      >{d.min}</Txt>
                    ) : null}
                    {/* O dia parado ganha um ponto na linha de base: coluna
                        vazia some, e descanso não é ausência de dado. */}
                    <View style={{
                      width: d.min ? 16 : 5,
                      height: d.min ? Math.max(8, Math.round((d.min / teto) * ALT)) : 5,
                      borderRadius: radius.pill,
                      backgroundColor: d.min ? c.accent : c.line,
                      opacity: d.min && !eHoje ? 0.34 : 1,
                    }} />
                  </View>
                );
              })}
            </Row>
          </View>

          <Row style={{ marginTop: 8 }}>
            {semana.map((d, i) => (
              /* Três letras, não uma: sáb, seg e sex começam iguais, e a
                 fileira virava "s s s" no meio da semana. */
              <View key={d.t} style={{ flex: 1, alignItems: 'center' }}>
                <Txt v="micro" c={i === semana.length - 1 ? c.tx2 : c.tx4}>{WD[new Date(d.t).getDay()]}</Txt>
              </View>
            ))}
          </Row>
        </View>

        {/* Uma linha, e não um cartão. A proporção de força já teve barra,
            legenda e minutos por modalidade aqui — resumo bonito que não
            mudava nenhuma decisão. O fato importa e cabe numa frase. */}
        <View style={{ height: 1, backgroundColor: c.line, marginTop: 16 }} />
        <Row gap={8} style={{ paddingHorizontal: 16, paddingVertical: 14 }}>
          <Icon name="shield" size={15} color={forca ? c.ok : c.tx4} sw={2} />
          <Txt v="caption" c={c.tx2} style={{ flex: 1 }}>
            {forca === 0
              ? 'Nenhum treino de força nesta semana. Musculação, pilates e funcional são o que segura o músculo.'
              : `${forca} ${forca === 1 ? 'dia' : 'dias'} com treino de força — é o que segura o músculo enquanto o peso cai.`}
          </Txt>
        </Row>
      </View>

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
            altura={110}
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
          <Chips itens={PERIODOS.map((x) => ({ id: x.id, label: x.label }))} valor={per} onChange={setPer} />
          {resumo.treinos ? (
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
          ) : (
            <Cartao>
              <View style={{ paddingHorizontal: 16, paddingVertical: 16 }}>
                <Txt v="caption" c={c.tx2}>Nenhum treino registrado neste período.</Txt>
              </View>
            </Cartao>
          )}
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
        {porDia.length ? (
          <View style={{ gap: 14 }}>
            {porDia.map((dia) => (
              <View key={dia.t} style={{ gap: 7 }}>
                <Row style={{ justifyContent: 'space-between', paddingHorizontal: 4 }}>
                  <Txt v="micro" c={c.tx3} style={{ letterSpacing: 1 }}>
                    {relDay(new Date(dia.t)).toUpperCase()}
                  </Txt>
                  <Txt v="micro" c={c.tx4}>
                    {dia.itens.reduce((x, t) => x + t.min, 0)} min · {fmtDate(new Date(dia.t))}
                  </Txt>
                </Row>
                <Cartao>
                  {/* A seta abre a folha do treino: ela MOSTRA, e só depois
                      oferece corrigir e apagar. Abrir o formulário direto
                      era rápido e errado — quem toca num treino ainda não
                      decidiu mexer nele, pode estar só conferindo o que foi
                      aquele dia. */}
                  {dia.itens.map((t) => (
                    <Linha
                      key={`${t.t}-${t.i}`}
                      ic={t.ic}
                      titulo={t.tipo}
                      sub={`${t.min} min`}
                      onPress={() => router.push(`/treino?t=${t.t}&i=${t.i}` as any)}
                    />
                  ))}
                </Cartao>
              </View>
            ))}
          </View>
        ) : (
          <Cartao>
            <View style={{ paddingHorizontal: 16, paddingVertical: 16 }}>
              <Txt v="caption" c={c.tx2}>
                Nada registrado neste período. O que você registrar aparece aqui com a
                modalidade e a duração.
              </Txt>
            </View>
          </Cartao>
        )}
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

      {/* O dia, pequeno e no fim: é o detalhe, e a semana é a história. */}
      <Txt v="micro" c={c.tx4} style={{ paddingHorizontal: 2 }}>
        Hoje: {hoje} de {alvoDia} min.
      </Txt>
    </TelaInterna>
  );
}
