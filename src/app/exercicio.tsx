import React from 'react';
import { View } from 'react-native';
import { useRouter } from 'expo-router';
import { useStore } from '../logic/store';
import {
  checkinToday, diasDeForca, fonteDeMovimento, porModalidade,
  semanaDeMovimento, treinosRecentes,
} from '../logic/derive';
import { relDay, WD } from '../logic/time';
import { Screen, Txt, Card, Row, CircleBtn, Divider } from '../ui/kit';
import { Icon } from '../ui/Icon';
import { useTheme } from '../ui/useTheme';
import { radius } from '../theme';

/* ============================================================
   EXERCÍCIO

   A tela que lê `treinos`. O campo existia desde que a modalidade passou
   a ser gravada, e até agora ninguém olhava para ele — o que faz de um
   dado guardado um dado morto.

   O QUE ELA MOSTRA, E POR QUÊ NESSA ORDEM

   A semana primeiro, e não o dia. Exercício é uma coisa semanal: quem
   treinou forte segunda e descansou terça não teve um dia ruim, teve uma
   terça. O número de hoje sozinho transforma descanso em falha.

   Depois a força, porque é o que importa NESTE tratamento. Em déficit
   calórico quem só faz cardio perde massa magra junto com a gordura, e
   massa magra é justamente o que o app passa o dia inteiro tentando
   segurar — com proteína de um lado e movimento do outro. A linha
   relata, não cobra: diz quantos dias houve, e para.

   Depois o que se tem feito, por modalidade. É a única coisa que os
   minutos sozinhos não sabem dizer, e é por isso que `treinos` existe.

   E por último a lista, que é o registro em si.

   A CONTRADIÇÃO QUE PRECISA SER DITA

   Os minutos e os treinos não batem, e não deveriam mesmo. Quem tem
   Apple Saúde ligado recebe minutos que ninguém digitou, e o telefone
   não sabe que aquilo era caminhada. Um dia com 40 minutos e nenhum
   treino na lista não é erro — é movimento que chegou sozinho. A tela
   diz isso onde a diferença aparece, em vez de deixar quem lê achar que
   perdeu um registro.
   ============================================================ */

export default function Exercicio() {
  const S = useStore((s) => s.S);
  const { c } = useTheme();
  const router = useRouter();

  const alvoDia = (S.profile as any).targets.exercMin as number;
  const semana = semanaDeMovimento(S);
  const daSemana = semana.reduce((s, d) => s + d.min, 0);
  const diasComMovimento = semana.filter((d) => d.min > 0).length;
  /* O teto da barra é a meta do dia, ou o maior dia se ele passou dela —
     assim um dia de 60 min enche a barra e um de 90 não sai da caixa. */
  const teto = Math.max(alvoDia, ...semana.map((d) => d.min));

  const forca = diasDeForca(S);
  const modalidades = porModalidade(S, 30);
  const treinos = treinosRecentes(S, 30);
  const fonte = fonteDeMovimento(S);
  const hoje = Math.round((checkinToday(S) as any)?.exerc || 0);

  return (
    <Screen>
      <Row style={{ marginTop: 4 }} gap={12}>
        <CircleBtn name="back" onPress={() => router.back()} />
        <View style={{ flex: 1 }}>
          <Txt v="h1">Exercício</Txt>
          <Txt v="caption" c={c.tx3} style={{ marginTop: 2 }}>
            Junto com a proteína, é o que segura a massa magra
          </Txt>
        </View>
      </Row>

      {/* A SEMANA — a unidade em que exercício faz sentido */}
      <Card style={{ marginTop: 18 }}>
        <Row style={{ justifyContent: 'space-between' }}>
          <Row gap={6}>
            <Icon name="dumbbell" size={14} color={c.teal} sw={2} />
            <Txt v="micro" c={c.tx3} style={{ letterSpacing: 1 }}>ESTES SETE DIAS</Txt>
          </Row>
          {/* Sem meta semanal. A meta do app é diária (60 min);
             multiplicar por sete inventaria uma cobrança de 420 min que
             nenhuma recomendação faz e que deixaria toda semana normal
             parecendo fracasso. O que se conta é o que houve. */}
          <Txt v="h2">
            <Txt v="h2" c={c.accent}>{daSemana}</Txt>
            <Txt v="label" c={c.tx3}> min</Txt>
          </Txt>
        </Row>
        <Txt v="caption" c={c.tx3} style={{ marginTop: 2 }}>
          {diasComMovimento === 0
            ? 'Nenhum dia com movimento.'
            : `Em ${diasComMovimento} ${diasComMovimento === 1 ? 'dia' : 'dias'} dos sete.`}
        </Txt>

        {/* Cada dia tem um trilho inteiro, sempre visível, e a barra sobe
             de baixo dentro dele. Sem o trilho, o dia sem movimento virava
             um fiapo de 3 px que some — e dia de descanso não é ausência
             de dado, é descanso. */}
        <Row gap={7} style={{ marginTop: 14, alignItems: 'flex-end' }}>
          {semana.map((d, i) => {
            const eHoje = i === semana.length - 1;
            const alt = d.min ? Math.max(6, Math.round((d.min / teto) * 54)) : 0;
            return (
              <View key={d.t} style={{ flex: 1, alignItems: 'center', gap: 7 }}>
                <View style={{
                  width: '100%', height: 54, borderRadius: radius.sm,
                  backgroundColor: c.track, justifyContent: 'flex-end', overflow: 'hidden',
                }}>
                  <View style={{ height: alt, backgroundColor: eHoje ? c.accent : c.accent2 }} />
                </View>
                {/* Três letras, não uma: sáb, seg e sex começam iguais, e
                    a fileira virava "s s s" no meio da semana. */}
                <Txt v="micro" c={eHoje ? c.tx2 : c.tx4}>{WD[new Date(d.t).getDay()]}</Txt>
              </View>
            );
          })}
        </Row>

        <Divider style={{ marginTop: 14 }} />
        {/* Relata, não cobra. Quantos dias houve, e ponto — transformar
            isso numa meta seria inventar uma cobrança que o tratamento
            não pediu. */}
        <Row gap={7} style={{ marginTop: 12 }}>
          <Icon name="shield" size={14} color={forca ? c.ok : c.tx4} sw={2} />
          <Txt v="caption" c={c.tx2} style={{ flex: 1 }}>
            {forca === 0
              ? 'Nenhum treino de força nesta semana.'
              : `${forca} ${forca === 1 ? 'dia' : 'dias'} com treino de força.`}
          </Txt>
        </Row>
        <Txt v="micro" c={c.tx4} style={{ marginTop: 5 }}>
          Musculação, pilates e funcional. É a parte do movimento que puxa músculo —
          e músculo é o que a perda de peso leva junto se ninguém segurar.
        </Txt>
      </Card>

      {/* HOJE — pequeno, porque o dia é o detalhe e a semana é a história */}
      <Card style={{ marginTop: 10, paddingVertical: 14 }} onPress={() => router.push('/medir-exercicio' as any)}>
        <Row style={{ justifyContent: 'space-between' }}>
          <Row gap={9}>
            <Icon name="plus" size={16} color={c.accent} sw={2.4} />
            <Txt v="label" c={c.accent}>Registrar um treino</Txt>
          </Row>
          <Txt v="caption" c={c.tx3}>{hoje} de {alvoDia} min hoje</Txt>
        </Row>
      </Card>

      {modalidades.length ? (
        <>
          <Txt v="h2" style={{ marginTop: 24, marginBottom: 10 }}>O que você tem feito</Txt>
          <Card style={{ paddingVertical: 4 }}>
            {modalidades.map((m, i) => (
              <View key={m.tipo}>
                {i > 0 && <Divider />}
                <Row style={{ paddingVertical: 12, justifyContent: 'space-between' }}>
                  <Txt v="title">{m.tipo}</Txt>
                  <Txt v="caption" c={c.tx3}>
                    {m.vezes}× · {m.min} min
                  </Txt>
                </Row>
              </View>
            ))}
          </Card>
          <Txt v="micro" c={c.tx4} style={{ marginTop: 7, paddingHorizontal: 2 }}>Nos últimos 30 dias.</Txt>
        </>
      ) : null}

      <Txt v="h2" style={{ marginTop: 24, marginBottom: 10 }}>Treinos registrados</Txt>
      {treinos.length ? (
        <View style={{ gap: 8 }}>
          {treinos.map((t, i) => (
            <Card key={`${t.t}-${i}`} style={{ paddingVertical: 13 }}>
              <Row style={{ justifyContent: 'space-between' }}>
                <Txt v="title">{t.tipo}</Txt>
                <Txt v="caption" c={c.tx3}>{t.min} min</Txt>
              </Row>
              <Txt v="micro" c={c.tx4} style={{ marginTop: 2 }}>{relDay(new Date(t.t))}</Txt>
            </Card>
          ))}
        </View>
      ) : (
        <Card>
          <Txt v="caption" c={c.tx3}>
            Nenhum treino registrado ainda. O que você registrar aparece aqui com a
            modalidade e a duração.
          </Txt>
        </Card>
      )}

      {/* Onde a diferença aparece, a explicação dela. Sem isto, um dia com
          minutos e sem treino na lista parece registro perdido. */}
      {fonte || (daSemana > 0 && !treinos.length) ? (
        <Txt v="micro" c={c.tx4} style={{ marginTop: 10, paddingHorizontal: 2 }}>
          {fonte
            ? `Os minutos lá em cima incluem o que vem do ${fonte}, que chega sem modalidade — por isso a lista aqui é mais curta que o total.`
            : 'Minutos registrados antes desta tela não guardaram a modalidade, então não aparecem na lista.'}
        </Txt>
      ) : null}
    </Screen>
  );
}
