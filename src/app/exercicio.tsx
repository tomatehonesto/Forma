import React from 'react';
import { View } from 'react-native';
import { useRouter } from 'expo-router';
import { useStore } from '../logic/store';
import {
  apagarTreino, checkinToday, diasDeForca, fonteDeMovimento,
  porModalidade, semanaDeMovimento, treinosRecentes,
} from '../logic/derive';
import { relDay, WD } from '../logic/time';
import { Txt, Row } from '../ui/kit';
import { TelaInterna, Titulao, Bloco, Cartao, Linha, ItemApagavel, Botao } from '../ui/internas';
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

  const forca = diasDeForca(S);
  const modalidades = porModalidade(S, 30);
  const treinos = treinosRecentes(S, 30);
  const fonte = fonteDeMovimento(S);
  const hoje = Math.round((checkinToday(S) as any)?.exerc || 0);

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
            {treinos.map((t) => (
              <ItemApagavel
                key={`${t.t}-${t.i}`}
                pergunta={`Apagar ${t.tipo.toLowerCase()} de ${t.min} min?`}
                onApagar={() => update((s: any) => apagarTreino(s, t.t, t.i))}
              >
                <Txt v="body">{t.tipo}</Txt>
                <Txt v="caption" c={c.tx2} style={{ marginTop: 2 }}>
                  {relDay(new Date(t.t))} · {t.min} min
                </Txt>
              </ItemApagavel>
            ))}
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
