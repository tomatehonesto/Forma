import React from 'react';
import { View, Pressable } from 'react-native';
import { DAY, WD, fmtMesAno, startOfDay, now } from '../logic/time';
import { radius } from '../theme';
import { Txt, Row } from './kit';
import { useTheme } from './useTheme';
import { Icon } from './Icon';

/* ============================================================
   O CALENDÁRIO — uma grade de mês para escolher um dia que já passou.

   Nasceu para o "quando" do registro de aplicação, onde os atalhos de
   Hoje / Ontem / Anteontem resolvem o caso comum e falham no único caso
   em que alguém precisa de um calendário: lembrar, três semanas depois,
   do dia em que aplicou.

   Mora aqui, e não dentro daquela folha, porque a mesma pergunta aparece
   em outras capturas — refeição, exercício, exame — resolvida de jeitos
   diferentes em cada uma. Esta peça não as converte; ela só deixa de ser
   desculpa quando isso valer a pena.

   ⚠️⚠️ NÃO EXISTE FUTURO AQUI, e não é limitação: é o assunto.

   Registro de medicamento aplicado é FATO. Um fato com data adiante é uma
   promessa disfarçada de registro — e, num aplicativo que conta o ciclo da
   dose a partir da última aplicação, uma promessa dessas empurra a próxima
   dose para depois de um dia que ainda não aconteceu.

   Os dias adiante de hoje são desenhados, e não escondidos: sumir com
   metade da grade faria o mês parecer quebrado. Eles ficam apagados e não
   respondem ao toque, que é a diferença entre "isto não cabe aqui" e
   "isto não existe".

   ⚠️ E A SETA DE AVANÇAR SOME NO MÊS CORRENTE, em vez de ficar cinza. Ali
   ela não é um controle desabilitado à espera de condição: não há mês
   seguinte a visitar, e um botão que nunca vai funcionar é pior do que
   botão nenhum.
   ============================================================ */

/* A grade tem sempre seis linhas. Cinco bastariam para quase todo mês, e
   é justamente o "quase" que estraga: um mês que começa no sábado ocupa
   seis, e a folha inteira pularia de altura ao trocar de mês. Altura fixa
   custa uma linha vazia de vez em quando e paga com a folha parada. */
const LINHAS = 6;

/** Os 42 dias da grade do mês de `base`, começando no domingo anterior. */
function gradeDoMes(base: Date): number[] {
  const primeiro = new Date(base.getFullYear(), base.getMonth(), 1);
  const inicio = +startOfDay(primeiro) - primeiro.getDay() * DAY;
  return Array.from({ length: LINHAS * 7 }, (_, i) => inicio + i * DAY);
}

export function Calendario({ valor, onEscolhe }: {
  /** o dia escolhido, em milissegundos */
  valor: number;
  onEscolhe: (t: number) => void;
}) {
  const { c } = useTheme();
  const hoje = +startOfDay(now());

  /* O mês à vista começa no do dia escolhido — quem abre o calendário
     depois de ter escolhido 12 de agosto quer ver agosto, e não voltar
     para setembro para navegar de novo até lá. */
  const [mes, setMes] = React.useState(() => new Date(valor || hoje));

  const dias = gradeDoMes(mes);
  /* O mesmo `|| hoje` do estado inicial: sem ele, um valor zerado cairia
     em 1970 e o mês inteiro apareceria sem dia escolhido, sem aviso. */
  const diaEscolhido = +startOfDay(new Date(valor || hoje));
  const mesCorrente = mes.getFullYear() === new Date(hoje).getFullYear()
    && mes.getMonth() === new Date(hoje).getMonth();

  const andar = (d: number) => setMes((m) => new Date(m.getFullYear(), m.getMonth() + d, 1));

  return (
    <View style={{ gap: 10 }}>
      <Row style={{ justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 4 }}>
        <Pressable
          onPress={() => andar(-1)}
          hitSlop={12}
          style={({ pressed }) => [{ opacity: pressed ? 0.5 : 1 }]}
        >
          <Icon name="back" size={20} color={c.tx2} sw={2.2} />
        </Pressable>

        <Txt v="bodyMed">{fmtMesAno(mes)}</Txt>

        {/* Some no mês corrente — ver a nota lá em cima. O View vazio
            segura o lugar, para o nome do mês não pular para o meio. */}
        {mesCorrente ? <View style={{ width: 20 }} /> : (
          <Pressable
            onPress={() => andar(1)}
            hitSlop={12}
            style={({ pressed }) => [{ opacity: pressed ? 0.5 : 1 }]}
          >
            <Icon name="chev" size={20} color={c.tx2} sw={2.2} />
          </Pressable>
        )}
      </Row>

      <Row>
        {WD().map((d) => (
          <View key={d} style={{ flex: 1, alignItems: 'center' }}>
            <Txt v="micro" c={c.tx4}>{d}</Txt>
          </View>
        ))}
      </Row>

      <View style={{ gap: 4 }}>
        {Array.from({ length: LINHAS }, (_, li) => (
          <Row key={li}>
            {dias.slice(li * 7, li * 7 + 7).map((t) => {
              const d = new Date(t);
              const adiante = t > hoje;
              const deOutroMes = d.getMonth() !== mes.getMonth();
              const escolhido = t === diaEscolhido;
              const eHoje = t === hoje;

              /* ⚠️ TRÊS ESTADOS DE TINTA, e a ordem importa: escolhido
                 ganha de hoje, hoje ganha de dia comum, e adiante apaga
                 tudo. Sem a precedência, o dia de hoje escolhido ficaria
                 com a cor de hoje e a pessoa não veria a própria escolha. */
              const tinta = adiante ? c.tx4
                : escolhido ? c.accentInk
                  : deOutroMes ? c.tx4
                    : c.tx;

              return (
                <Pressable
                  key={t}
                  disabled={adiante}
                  onPress={() => onEscolhe(t)}
                  style={({ pressed }) => [{
                    flex: 1, aspectRatio: 1,
                    alignItems: 'center', justifyContent: 'center',
                    opacity: pressed && !adiante ? 0.6 : 1,
                  }]}
                >
                  <View style={{
                    width: 34, height: 34, borderRadius: radius.pill,
                    alignItems: 'center', justifyContent: 'center',
                    backgroundColor: escolhido ? c.accent : 'transparent',
                    /* Hoje sem escolha ganha só um contorno: ele é uma
                       referência para se localizar na grade, e não uma
                       sugestão de resposta. */
                    ...(eHoje && !escolhido
                      ? { borderWidth: 1.5, borderColor: c.accentLine }
                      : null),
                  }}>
                    <Txt v="note" c={tinta}>{String(d.getDate())}</Txt>
                  </View>
                </Pressable>
              );
            })}
          </Row>
        ))}
      </View>
    </View>
  );
}
