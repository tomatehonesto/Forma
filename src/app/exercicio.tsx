import React from 'react';
import { View } from 'react-native';
import { useRouter } from 'expo-router';
import { useStore } from '../logic/store';
import {
  apagarTreino, checkinToday, fontesDeMovimento, listaPt,
  misturaDeMovimento, semanaDeMovimento, semanasDeMovimento, treinosRecentes,
} from '../logic/derive';
import { fmtDate, relDay, WD } from '../logic/time';
import { Txt, Row } from '../ui/kit';
import { TelaInterna, Titulao, Bloco, Cartao, CardCurva, Linha, ItemApagavel, Botao } from '../ui/internas';
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

export default function Exercicio() {
  const S = useStore((s) => s.S);
  const update = useStore((s) => s.update);
  const { c } = useTheme();
  const router = useRouter();

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

  const mistura = misturaDeMovimento(S, 30);
  const treinos = treinosRecentes(S, 30);
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

      {/* A SEMANA — a unidade em que exercício faz sentido */}
      <View style={{ backgroundColor: c.bg1, borderRadius: radius.card, padding: 16 }}>
        <Row style={{ justifyContent: 'space-between', alignItems: 'baseline' }}>
          <Txt v="caption" c={c.tx2}>
            {comMovimento === 0
              ? 'Nenhum dia com movimento'
              : `Em ${comMovimento} ${comMovimento === 1 ? 'dia' : 'dias'} dos sete`}
          </Txt>
          {/* Sem meta semanal. A meta do app é diária (60 min); multiplicar
              por sete inventaria uma cobrança de 420 min que nenhuma
              recomendação faz, e que deixaria toda semana normal parecendo
              fracasso. O que se conta é o que houve. */}
          <Txt v="h2">
            <Txt v="h2" c={c.accent}>{daSemana}</Txt>
            <Txt v="label" c={c.tx3}> min</Txt>
          </Txt>
        </Row>

        {/* A barra diz QUANTOS MINUTOS, e não só "teve ou não teve".

            Antes ela era um trilho cinza com um preenchimento dentro,
            escalado pelo maior dia da semana — o que fazia 20 min numa
            semana fraca parecerem tanto quanto 60 numa semana forte. Um
            gráfico assim tem altura mas não tem unidade.

            Agora cada barra carrega o número em cima dela e a linha
            tracejada marca a meta do dia. Com essas duas coisas dá para
            ler a semana sem contar barra: onde passou, onde faltou
            pouco, e quanto foi cada dia. */}
        <View style={{ marginTop: 16, height: ALT + 24 }}>
          <View
            pointerEvents="none"
            style={{
              position: 'absolute', left: 0, right: 0, bottom: Math.round((alvoDia / teto) * ALT),
              /* Em c.line2 a meta sumia dentro do cartão branco. Uma linha
                 de referência precisa ser lida de relance, senão o gráfico
                 volta a ser altura sem unidade. */
              borderTopWidth: 1, borderTopColor: c.tx4, borderStyle: 'dashed',
            }}
          />
          <Row gap={7} style={{ flex: 1, alignItems: 'flex-end' }}>
            {semana.map((d, i) => {
              const eHoje = i === semana.length - 1;
              return (
                <View key={d.t} style={{ flex: 1, alignItems: 'center' }}>
                  {d.min ? (
                    <Txt v="micro" c={eHoje ? c.tx : c.tx3} style={{ marginBottom: 4 }}>{d.min}</Txt>
                  ) : null}
                  {/* O dia parado ganha um traço na linha de base: campo
                      vazio some, e descanso não é ausência de dado. */}
                  {/* Hoje em azul cheio, os outros dias apagados. Antes
                     eram accent e accent2, dois azuis a três tons de
                     distância: no tamanho de uma barra isso não é
                     diferença, é ruído. */}
                  <View style={{
                    width: '100%',
                    height: d.min ? Math.max(5, Math.round((d.min / teto) * ALT)) : 3,
                    borderRadius: radius.sm,
                    backgroundColor: d.min ? c.accent : c.line2,
                    opacity: d.min && !eHoje ? 0.42 : 1,
                  }} />
                </View>
              );
            })}
          </Row>
        </View>

        <Row gap={7} style={{ marginTop: 7 }}>
          {semana.map((d, i) => (
            /* Três letras, não uma: sáb, seg e sex começam iguais, e a
               fileira virava "s s s" no meio da semana. */
            <View key={d.t} style={{ flex: 1, alignItems: 'center' }}>
              <Txt v="micro" c={i === semana.length - 1 ? c.tx2 : c.tx4}>{WD[new Date(d.t).getDay()]}</Txt>
            </View>
          ))}
        </Row>
        <Txt v="micro" c={c.tx4} style={{ marginTop: 9 }}>
          A linha tracejada é a meta de {alvoDia} min por dia.
        </Txt>

      </View>

      {/* A TENDÊNCIA — a pergunta que a semana isolada não alcança.

          As barras de cima dizem como foi esta semana. Esta curva diz se
          a pessoa está se mexendo mais ou menos do que estava há dois
          meses, que num tratamento de meses é a pergunta que importa e
          que nada na tela respondia.

          É o CardCurva das outras internas, com a leitura no cabeçalho em
          vez de um balão embaixo do dedo — num gráfico de celular a mão
          cobre metade do card, e a leitura não pode morar ali. */}
      {comHistorico ? (
        <View style={{ marginTop: 10 }}>
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

      {/* DE QUE É FEITO O MOVIMENTO

          Era uma tabela: modalidade, vezes, minutos, três linhas. Dizia
          tudo e não mostrava nada — quem lia tinha que fazer a divisão de
          cabeça para chegar na única pergunta que importa aqui, que é
          quanto daquilo puxa músculo.

          Agora a barra faz a divisão. Cheia é força, apagada é o resto, e
          a proporção entre as duas aparece antes de qualquer número. */}
      {mistura.total ? (
        <Bloco titulo="De que é o seu movimento" nota="Nos últimos 30 dias.">
          <View style={{ backgroundColor: c.bg1, borderRadius: radius.card, padding: 16 }}>
            {/* alignItems stretch, e não o 'center' que o Row traz: um
                segmento sem altura própria colapsa e a barra some. */}
            <Row gap={2} style={{ height: 12, alignItems: 'stretch', borderRadius: radius.pill, overflow: 'hidden' }}>
              {mistura.itens.map((m) => (
                <View
                  key={m.tipo}
                  style={{
                    flex: Math.max(1, m.min),
                    backgroundColor: c.accent,
                    opacity: m.forca ? 1 : 0.28,
                  }}
                />
              ))}
            </Row>

            <Txt v="caption" c={c.tx} style={{ marginTop: 12 }}>
              {mistura.forca === 0
                ? `Nenhum dos ${mistura.total} minutos foi treino de força.`
                : `${mistura.forca} dos ${mistura.total} minutos foram treino de força.`}
            </Txt>
            <Txt v="micro" c={c.tx3} style={{ marginTop: 5 }}>
              Musculação, pilates e funcional puxam músculo — e músculo é o que a perda
              de peso leva junto se ninguém segurar.
            </Txt>

            <View style={{ height: 1, backgroundColor: c.line, marginTop: 14, marginBottom: 12 }} />

            <View style={{ gap: 11 }}>
              {mistura.itens.map((m) => (
                <Row key={m.tipo} gap={10}>
                  <View style={{
                    width: 8, height: 8, borderRadius: 4,
                    backgroundColor: c.accent, opacity: m.forca ? 1 : 0.28,
                  }} />
                  <Icon name={m.ic} size={15} color={c.tx3} sw={1.9} />
                  <Txt v="caption" c={c.tx} style={{ flex: 1 }}>{m.tipo}</Txt>
                  <Txt v="caption" c={c.tx3}>
                    {m.vezes}× · {m.min} min
                  </Txt>
                </Row>
              ))}
            </View>
          </View>
        </Bloco>
      ) : null}

      {/* O CADERNO

          Agrupado por dia, com o desenho da modalidade na frente. Em
          lista corrida a data se repetia em toda linha e o olho tinha que
          juntar sozinho o que era do mesmo dia — aqui a data aparece uma
          vez, e embaixo dela o que aconteceu. */}
      <Bloco
        titulo="Caderno de treino"
        nota={treinos.length ? 'Toque na lixeira para apagar um registro.' : undefined}
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
                  {dia.itens.map((t) => (
                    <ItemApagavel
                      key={`${t.t}-${t.i}`}
                      pergunta={`Apagar ${t.tipo.toLowerCase()} de ${t.min} min?`}
                      onApagar={() => update((s: any) => apagarTreino(s, t.t, t.i))}
                    >
                      <Row gap={11}>
                        <View style={{
                          width: 32, height: 32, borderRadius: radius.md,
                          backgroundColor: c.accentWeak, alignItems: 'center', justifyContent: 'center',
                        }}>
                          <Icon name={t.ic} size={16} color={c.accent} sw={1.9} />
                        </View>
                        <Txt v="body" style={{ flex: 1 }}>{t.tipo}</Txt>
                        <Txt v="caption" c={c.tx2}>{t.min} min</Txt>
                      </Row>
                    </ItemApagavel>
                  ))}
                </Cartao>
              </View>
            ))}
          </View>
        ) : (
          <Cartao>
            <View style={{ paddingHorizontal: 16, paddingVertical: 16 }}>
              <Txt v="caption" c={c.tx2}>
                Nada registrado ainda. O que você registrar aparece aqui com a modalidade
                e a duração — e dá para apagar se entrar errado.
              </Txt>
            </View>
          </Cartao>
        )}
      </Bloco>

      {/* A diferença entre os minutos e a lista se explica aqui, no mesmo
          lugar onde ela se configura. */}
      <Bloco titulo="De onde vêm os minutos">
        <Cartao>
          {/* TODAS as fontes, e não a primeira. Ninguém tem só uma: quem
              usa Garmin costuma ter o Apple Saúde ligado junto, e a tela
              que dizia "Apple Saúde conectado" escondia as outras de quem
              justamente queria saber de onde os minutos vinham. */}
          <Linha
            ic="watch"
            titulo={
              fontes.length
                ? `${listaPt(fontes)} ${fontes.length === 1 ? 'conectado' : 'conectados'}`
                : 'Conectar um relógio ou app'
            }
            sub={
              fontes.length
                ? 'Os minutos chegam sozinhos, mas sem modalidade — por isso o caderno acima é mais curto que o total da semana.'
                : 'Apple Saúde, Health Connect, Garmin e outros lançam os minutos sem você digitar.'
            }
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
