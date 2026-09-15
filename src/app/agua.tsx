import React, { useState } from 'react';
import { View } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useStore } from '../logic/store';
import {
  apagarGole, diasDeAgua, golesDoDia, litros, semanaDeAgua, waterMlToday,
} from '../logic/derive';
import { hm, now, startOfDay } from '../logic/time';
import { Txt, Row, Vazio } from '../ui/kit';
import { Icon } from '../ui/Icon';
import {
  TelaInterna, Titulao, Bloco, CardSemana, Cartao, Linha, Botao, ItemApagavel, TiraDeDias,
} from '../ui/internas';
import { useTheme } from '../ui/useTheme';
import { radius, shadowCard } from '../theme';

/* ============================================================
   ÁGUA

   A água era o único dos três hábitos sem tela. Alimentação e exercício
   têm a sua — o número do dia, a semana, o caderno —, e a água tinha um
   botão que abria a folha de registro e mais nada: dava para BEBER e não
   dava para OLHAR. Ontem, a semana, o copo que entrou errado: nada disso
   existia em lugar nenhum.

   E a pergunta da água é justamente uma pergunta de dias. Um copo não
   quer dizer nada sozinho; o que muda o tratamento é se a pessoa está
   chegando perto dos 2,5 L com alguma regularidade, e isso só se vê numa
   fileira de sete.

   A mesma escada das outras duas, pela mesma razão: o dia (que ainda dá
   para corrigir), a semana (onde a meta diária faz sentido) e o caderno
   (o que de fato aconteceu, com hora).
   ============================================================ */

/* Trinta dias na tira, como no caderno de refeições, e pelo mesmo motivo:
   não há seletor de período porque não há mais nada na tela que responda
   a ele. */
const DIAS_DA_TIRA = 30;

export default function Agua() {
  const S = useStore((s) => s.S);
  const update = useStore((s) => s.update);
  const { c } = useTheme();
  const router = useRouter();

  const alvo = (S.profile as any).targets.waterMl as number;
  const hoje = waterMlToday(S);
  const falta = Math.max(0, alvo - hoje);

  const semana = semanaDeAgua(S);
  const diasComRegistro = semana.filter((d) => d.ml > 0).length;
  /* Média dos dias REGISTRADOS, como na proteína. Dividir por sete
     transformaria um dia esquecido num dia de sede. */
  const media = diasComRegistro
    ? Math.round(semana.reduce((x, d) => x + d.ml, 0) / diasComRegistro)
    : 0;

  const [diaSel, setDiaSel] = useState<number>(() => +startOfDay(now()));
  const calendario = diasDeAgua(S, DIAS_DA_TIRA);
  const doDia = golesDoDia(S, diaSel);
  const mlDoDia = doDia.reduce((x, g) => x + g.ml, 0);

  const lembrete = (S as any).reminders?.agua;

  return (
    <TelaInterna
      titulo="Água"
      rodape={<Botao label="Registrar água" onPress={() => router.push('/medir-agua' as any)} />}
    >
      <Titulao
        titulo="Água"
        lead="Comendo menos, entra menos água pela comida — e ela é boa parte do que se bebe sem perceber. Beber de propósito é o que cobre a diferença."
      />

      {/* O NÚMERO DO DIA, e o que falta dele.

          "Faltam 2 L" é a mesma informação da barra já resolvida, e é ela
          que decide se vale encher a garrafa agora. */}
      <View style={[{ backgroundColor: c.bg1, borderRadius: radius.card, padding: 16 }, shadowCard(c)]}>
        <Row style={{ alignItems: 'flex-start' }}>
          <View style={{ flex: 1 }}>
            <Txt v="body">Água de hoje</Txt>
            <Txt v="note" c={c.tx3} style={{ marginTop: 2 }}>
              {hoje === 0
                ? `Meta de ${litros(alvo)} L`
                : falta > 0 ? `Faltam ${litros(falta)} L para a meta` : 'Meta do dia alcançada'}
            </Txt>
          </View>
          <Txt v="metric">
            {litros(hoje)}
            <Txt v="label" c={c.tx3}>{` / ${litros(alvo)} L`}</Txt>
          </Txt>
        </Row>
        <View style={{ height: 8, borderRadius: 4, backgroundColor: c.track, marginTop: 14, overflow: 'hidden' }}>
          <LinearGradient
            colors={[c.gradFrom, c.gradTo]}
            start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
            style={{ width: `${Math.min(100, (hoje / alvo) * 100)}%`, height: '100%' }}
          />
        </View>
      </View>

      {/* A SEMANA.

          As barras chegam em MILILITROS, que é a unidade em que a altura
          e a meta se comparam sem arredondar nada; quem traduz para litro
          é o rótulo. A tela inteira fala em litros, inclusive esta. */}
      <CardSemana
        nome="Esta semana"
        sub={diasComRegistro === 0
          ? 'Nada registrado nos últimos sete dias'
          : `Média de ${diasComRegistro} ${diasComRegistro === 1 ? 'dia registrado' : 'dias registrados'}`}
        valor={litros(media)}
        unidade="L"
        dias={semana.map((d) => ({ t: d.t, v: d.ml }))}
        alvo={alvo}
        rotuloMeta={`Meta: ${litros(alvo)} L`}
        rotulo={litros}
      />

      {/* O CADERNO DE ÁGUA — e a saída que a água não tinha.

          Beber era a única coisa deste app sem volta: um toque errado em
          "Garrafão" somava um litro para sempre, e a pessoa via o número
          errado sabendo que estava errado. Aqui cada gole tem hora e
          lixeira, e apagar devolve ao dia só o que aquele gole somou.

          A hora não é enfeite: é ela que identifica o registro para quem
          está procurando qual apagar. Entre dois copos de 0,25 L, o que
          diferencia um do outro é "às 7:18". */}
      <Bloco
        titulo="Caderno de água"
        nota="Cada registro com a hora em que entrou. Apague o que tiver entrado errado."
      >
        <View style={{ gap: 10 }}>
          <TiraDeDias
            dias={calendario.map((d) => ({ t: d.t, marcado: d.itens > 0, hoje: d.hoje }))}
            sel={diaSel}
            onEscolhe={setDiaSel}
          />

          {doDia.length ? (
            <View style={{ gap: 10 }}>
              <Cartao>
                {doDia.map((g) => (
                  <ItemApagavel
                    key={g.t ?? 'dia'}
                    pergunta={g.t == null
                      ? `Apagar a água deste dia?`
                      : `Apagar ${litros(g.ml)} L das ${hm(new Date(g.t).getHours(), new Date(g.t).getMinutes())}?`}
                    onApagar={() => update((s: any) => apagarGole(s, diaSel, g.t))}
                  >
                    <Row gap={12}>
                      {/* Um glifo, e não o número em mililitros. O selo
                          trazia "250" ao lado de "0,25 L" — o mesmo fato
                          duas vezes em duas unidades, e sem dizer de qual
                          delas eram os 250. */}
                      <View style={{
                        width: 34, height: 34, borderRadius: radius.md,
                        backgroundColor: c.accentWeak, alignItems: 'center', justifyContent: 'center',
                      }}>
                        <Icon name="water" size={17} color={c.accent} sw={1.9} />
                      </View>
                      <View style={{ flex: 1 }}>
                        <Txt v="body">{litros(g.ml)} L</Txt>
                        {/* O DIA SEM HORA é dito, e não maquiado. Um registro
                            de antes de o caderno existir sabe o total e não
                            sabe quando: inventar "08:00" para preencher a
                            linha seria escrever no diário da pessoa uma coisa
                            que ela não escreveu. */}
                        <Txt v="caption" c={c.tx3} style={{ marginTop: 2 }}>
                          {g.t == null
                            ? 'Total do dia, sem registro de horário'
                            : `às ${hm(new Date(g.t).getHours(), new Date(g.t).getMinutes())}`}
                        </Txt>
                      </View>
                    </Row>
                  </ItemApagavel>
                ))}
              </Cartao>
              {/* O total embaixo, que é o que a soma das linhas deu. */}
              <Txt v="micro" c={c.tx4} style={{ textAlign: 'center' }}>
                {doDia.length} {doDia.length === 1 ? 'registro' : 'registros'} · {litros(mlDoDia)} L
              </Txt>
            </View>
          ) : (
            <Vazio
              ic="water"
              titulo="Nada registrado neste dia"
              texto="O que você anotar entra no total do dia."
            />
          )}
        </View>
      </Bloco>

      {/* O LEMBRETE.

          É a única coisa que muda o comportamento da água e não é um
          número: quem esquece de beber não esquece por não saber quanto
          falta, esquece por estar fazendo outra coisa. O ajuste mora em
          Lembretes com os outros; aqui fica o atalho e o estado atual,
          porque "desligado" é a resposta que explica uma semana fraca. */}
      <Bloco titulo="Lembrete">
        <Cartao>
          <Linha
            ic="bell"
            titulo={lembrete?.on ? 'Lembrete ligado' : 'Lembrete desligado'}
            sub={lembrete?.on
              ? `Todo dia às ${hm(lembrete.hour ?? 0, lembrete.min ?? 0)}`
              : 'Um toque por dia, na hora que você escolher'}
            onPress={() => router.push('/lembretes' as any)}
          />
        </Cartao>
      </Bloco>
    </TelaInterna>
  );
}
