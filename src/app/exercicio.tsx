import React, { useState } from 'react';
import { View, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { useStore } from '../logic/store';
import {
  apagarTreino, checkinToday, diasDeForca, fonteDeMovimento,
  porModalidade, semanaDeMovimento, treinosRecentes,
} from '../logic/derive';
import { relDay, WD } from '../logic/time';
import { Txt, Row } from '../ui/kit';
import { TelaInterna, Titulao, Bloco, Cartao, Linha, Botao } from '../ui/internas';
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

  /* Qual sessão está com a pergunta de apagar aberta. Uma de cada vez: a
     lixeira arma, o segundo toque confirma. Sem esse passo, um deslize
     num cartão pequeno apaga registro de tratamento. */
  const [armado, setArmado] = useState<string | null>(null);

  const alvoDia = (S.profile as any).targets.exercMin as number;
  const semana = semanaDeMovimento(S);
  const daSemana = semana.reduce((s, d) => s + d.min, 0);
  const comMovimento = semana.filter((d) => d.min > 0).length;
  /* O teto da barra é a meta do dia, ou o maior dia se ele passou dela —
     assim um dia de 60 min enche a barra e um de 90 não sai da caixa. */
  const teto = Math.max(alvoDia, ...semana.map((d) => d.min));

  const forca = diasDeForca(S);
  const modalidades = porModalidade(S, 30);
  const treinos = treinosRecentes(S, 30);
  const fonte = fonteDeMovimento(S);
  const hoje = Math.round((checkinToday(S) as any)?.exerc || 0);

  const apagar = (t: number, i: number) => {
    update((s: any) => apagarTreino(s, t, i));
    setArmado(null);
  };

  return (
    <TelaInterna
      titulo="Exercício"
      iconeAcao="plus"
      onAcao={() => router.push('/medir-exercicio' as any)}
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

        {/* Cada dia tem um trilho inteiro, sempre visível, e a barra sobe
            de baixo dentro dele. Sem o trilho, o dia parado virava um
            fiapo que some — e descanso não é ausência de dado. */}
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

        {/* Relata, não cobra. Quantos dias houve, e ponto — virar meta
            seria inventar uma cobrança que o tratamento não pediu. */}
        <View style={{ height: 1, backgroundColor: c.line, marginTop: 15, marginBottom: 13 }} />
        <Row gap={8}>
          <Icon name="shield" size={15} color={forca ? c.ok : c.tx4} sw={2} />
          <Txt v="caption" c={c.tx} style={{ flex: 1 }}>
            {forca === 0
              ? 'Nenhum treino de força nesta semana'
              : `${forca} ${forca === 1 ? 'dia' : 'dias'} com treino de força`}
          </Txt>
        </Row>
        <Txt v="micro" c={c.tx3} style={{ marginTop: 6 }}>
          Musculação, pilates e funcional. É a parte do movimento que puxa músculo — e
          músculo é o que a perda de peso leva junto se ninguém segurar.
        </Txt>
      </View>

      {modalidades.length ? (
        <Bloco titulo="O que você tem feito" nota="Nos últimos 30 dias.">
          <Cartao>
            {modalidades.map((m) => (
              <Linha
                key={m.tipo}
                titulo={m.tipo}
                sub={`${m.vezes} ${m.vezes === 1 ? 'vez' : 'vezes'}`}
                selo={`${m.min} min`}
                seloTom="neutra"
                seta={false}
              />
            ))}
          </Cartao>
        </Bloco>
      ) : null}

      <Bloco
        titulo="Treinos registrados"
        nota={treinos.length ? 'Toque na lixeira para apagar um registro.' : undefined}
      >
        {treinos.length ? (
          <Cartao>
            {treinos.map((t) => {
              const chave = `${t.t}-${t.i}`;
              const perguntando = armado === chave;
              return (
                <View key={chave} style={{ paddingHorizontal: 16, paddingVertical: 13 }}>
                  {perguntando ? (
                    /* A pergunta ocupa a própria linha do treino, e não um
                       modal: o que vai sumir continua à vista enquanto se
                       decide. */
                    <Row gap={10}>
                      <Txt v="caption" c={c.tx2} style={{ flex: 1 }}>
                        Apagar {t.tipo.toLowerCase()} de {t.min} min?
                      </Txt>
                      <Pressable onPress={() => setArmado(null)} hitSlop={8} style={({ pressed }) => [{ opacity: pressed ? 0.6 : 1 }]}>
                        <Txt v="label" c={c.tx3}>Cancelar</Txt>
                      </Pressable>
                      <Pressable onPress={() => apagar(t.t, t.i)} hitSlop={8} style={({ pressed }) => [{ opacity: pressed ? 0.6 : 1 }]}>
                        <Txt v="label" c={c.cta}>Apagar</Txt>
                      </Pressable>
                    </Row>
                  ) : (
                    <Row gap={12}>
                      <View style={{ flex: 1 }}>
                        <Txt v="body">{t.tipo}</Txt>
                        <Txt v="caption" c={c.tx2} style={{ marginTop: 2 }}>
                          {relDay(new Date(t.t))} · {t.min} min
                        </Txt>
                      </View>
                      <Pressable onPress={() => setArmado(chave)} hitSlop={10} style={({ pressed }) => [{ opacity: pressed ? 0.5 : 1 }]}>
                        <Icon name="trash" size={16} color={c.tx4} sw={1.9} />
                      </Pressable>
                    </Row>
                  )}
                </View>
              );
            })}
          </Cartao>
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
          <Linha
            ic="watch"
            titulo={fonte ? `${fonte} conectado` : 'Conectar um relógio ou app'}
            sub={
              fonte
                ? 'Os treinos chegam sozinhos, mas sem modalidade — por isso a lista acima é mais curta que o total da semana.'
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
