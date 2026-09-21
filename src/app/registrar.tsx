import React from 'react';
import { View, Pressable, ScrollView, StyleSheet, useWindowDimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useStore } from '../logic/store';
import {
  ATALHOS, checkinToday, checkinFeito, waterMlToday, litros, streak, temAcompanhamento,
  type QuickKey,
} from '../logic/derive';
import { Txt, Row, Divider, Rolagem } from '../ui/kit';
import { Icon } from '../ui/Icon';
import { useTheme } from '../ui/useTheme';
import { radius, ty } from '../theme';
import { useFolhaAberta, Cobertura, TocarParaFechar } from '../ui/folhas';

/* ============================================================
   REGISTRAR — o "+" da tab bar, e tudo que abre aqui é um registro.

   A tela pergunta "o que deseja registrar?" e a pessoa escolhe. Os itens
   seguem em primeira pessoa ("Acabei de me pesar"), não em nome de tela
   ("Peso"): o que ela escolhe é o acontecimento, e o formulário é
   consequência.

   Três camadas, e a ordem é a da frequência esperada:
     · check-in — o único que se espera TODO dia, e por isso tem faixa
       própria, selo e o maior peso visual do sheet
     · agora — três atalhos contextuais, que mudam com o momento do
       tratamento
     · leva um minuto — os registros que pedem mais informação
   ============================================================ */

type Item = { ic: string; titulo: string; sub?: string; to?: string; acao?: () => void };

export default function Registrar() {
  const S = useStore((s) => s.S);
  const { c } = useTheme();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { height: alturaJanela } = useWindowDimensions();

  const fechar = () => router.back();
  /* fecha antes de navegar: tela empilhada sobre sheet prende a pessoa em
     duas camadas de volta */
  const irPara = (to: string) => () => { router.back(); setTimeout(() => router.push(to as any), 60); };

  /* `ci` é o registro do dia, e serve para ler o exercício acumulado.
     Se o check-in foi respondido é outra pergunta, e quem responde é
     `checkinFeito`: antes, um copo d'água já pintava o banner de verde. */
  const ci = checkinToday(S);
  const fez = checkinFeito(S);
  const stk = streak(S);

  /* Tinta e véu do banner do check-in. Sobre o azul saturado a tinta é
     branca; sobre o lima, a tinta quase preta do par — o mesmo par do
     botão "Fazer check-in" da Home e do número da sequência. O véu das
     pastilhas é a tinta diluída, e não uma terceira cor.

     O concluído era uma lavagem verde, escolhida para recuar. Virou lima
     chapado: no app inteiro o lima é a cor do que foi conquistado, e o
     check-in feito é a conquista diária. Recuar era a leitura certa
     enquanto ele era só um estado; comemorar é a certa agora que existe
     uma tela inteira comemorando o mesmo fato. */
  const tinta = fez ? c.limeInk : c.accentInk;
  const veu = fez ? 'rgba(0,0,0,0.10)' : 'rgba(255,255,255,0.18)';
  const alvos = (S.profile as any).targets;
  const protHoje = Math.round((ci as any)?.prot || 0);
  const alvoProt = alvos.prot as number;
  const exercHoje = Math.round((ci as any)?.exerc || 0);
  const alvoExerc = alvos.exercMin as number;
  const mlHoje = waterMlToday(S);
  /* O mesmo formatador das telas de água: aqui era toFixed(1), e o card
     escrevia 1,8 L do lado de um diário que registrou 1,75 L. */
  const bebido = litros(mlHoje);
  const alvoL = litros(alvos.waterMl);
  const acoes = ATALHOS;

  /* O CHECK DO ATALHO É A META DO DIA BATIDA, e não "registrei alguma
     coisa". Um copo d'água não fecha a hidratação do dia, e um atalho que
     ficasse verde no primeiro copo estaria comemorando o começo — no app
     inteiro o lima é a cor do alcançado, e alcançado aqui é o alvo que a
     própria pessoa definiu no perfil.

     Ele passou um bom tempo sem aparecer: o estado dependia de um
     `piscar` de 1,6 s que nenhuma linha chamava — sobra da época em que a
     água salvava com um toque aqui dentro. E o lampejo não poderia voltar
     como era: hoje o atalho fecha a folha e abre a tela de registro, e a
     comemoração aconteceria atrás de um sheet que já saiu.

     Isto não pisca. É o estado do dia, e continua lá na próxima vez que a
     folha abrir. */
  const batida: Record<QuickKey, boolean> = {
    agua: mlHoje >= alvos.waterMl,
    refeicao: protHoje >= alvoProt,
    exercicio: exercHoje >= alvoExerc,
  };

  /* A aplicação era o único item que salvava aqui dentro, num toque, com
     dose e local no automático. Deixou de ser: ela é o registro que mais
     pede escolha (local da rotação, dose, qual caneta) e o único que mexe
     na contagem de doses — salvar no escuro deixava o estoque errado e
     tirava da pessoa a decisão de onde aplicar. Agora abre /aplicacao,
     que já chega com tudo preenchido para quem só quer confirmar. */

  /* Catálogo em primeira pessoa. O que a pessoa lê é o acontecimento; o
     nome da funcionalidade fica para a tela de destino.

     Os dois títulos de duas palavras quebram na mão, depois do "Me".
     "Fiz uma refeição" já ocupava as duas linhas reservadas, e os outros
     dois cabiam numa — as três pastilhas ficavam com o texto começando em
     alturas diferentes. Quebrando aqui, os três abrem com uma palavra
     curta na primeira linha e o verbo na segunda. */
  /* ⚠️ O CATÁLOGO TINHA SETE ITENS PARA TRÊS LUGARES. Os outros quatro
     eram herança dos atalhos que giravam com o dia — e como `ATALHOS`
     virou uma lista fixa de três, nenhuma tela chegava a desenhá-los.
     Três eram inofensivos, porque check-in tem banner próprio e aplicação
     e exame estão na lista de baixo. O quarto não: a anotação da consulta
     só existia aqui, e com isso `/medir-anotacao` ficou sem uma porta no
     app inteiro. Ela agora está em "leva um minuto", que é onde ela
     sempre coube. */
  const CATALOGO: Record<QuickKey, Item> = {
    agua: { ic: 'water', titulo: `Me${'\n'}hidratei`, sub: `${bebido} de ${alvoL} L`, to: '/medir-agua' },
    /* "0 min hoje" não dizia contra o quê. Os três comparam com o alvo do
       perfil agora, que é o mesmo número que acende o lima. */
    exercicio: { ic: 'dumbbell', titulo: `Me${'\n'}exercitei`, sub: `${exercHoje} de ${alvoExerc} min`, to: '/medir-exercicio' },
    /* A proteína do dia, como a água e o exercício. "12 registradas" era
       o total desde que o app foi instalado — não responde nada que se
       pergunte antes de comer. */
    refeicao: { ic: 'utensils', titulo: 'Fiz uma refeição', sub: `${protHoje} de ${alvoProt} g`, to: '/medir-refeicao' },
  };

  /* Registros completos — o que não coube nos atalhos de agora. Peso fica
     sempre aqui: pede um número, mas resolve sem sair do sheet.

     A aplicação abre a lista e está sempre presente. O filtro de baixo
     tira a duplicata quando ela também aparece nos atalhos de cima.

     "Meu corpo reagiu" saiu daqui. Esta lista é de EVENTOS: peso, medidas,
     exame, foto e aplicação criam um registro novo a cada vez, e registrar
     duas vezes é registrar duas coisas. Aquela tela escrevia dentro do
     registro de HOJE, sobrescrevendo — era estado do dia, não evento, e
     estava na lista pelo critério errado (esforço). Suas três perguntas
     agora vivem no check-in, que é onde o dia se descreve.

     ⚠️ AQUI NÃO HÁ SUBTÍTULO, e nos atalhos de cima há. A diferença não é
     de capricho: lá embaixo do rótulo vem o número que DECIDE — "0,5 de
     2,5 L" é o que faz alguém tocar em "me hidratei" ou deixar para
     depois. Aqui o verbo já decide sozinho: quem acabou de se pesar não
     precisa saber o peso anterior para escolher a linha do peso.

     As seis linhas tinham subtítulo assim mesmo, e o que eles diziam era
     uma de duas coisas: o próprio título de novo ("Recebi um exame —
     anotar o resultado") ou uma prévia da tela seguinte ("Abdômen
     (esq.)", "último: 75,1 kg"), que a tela seguinte mostra de novo duas
     linhas depois. Seis linhas de leitura para zero decisão, e cento e
     vinte pixels de altura num sheet que já não cabia na tela. */
  const completos: Item[] = [
    { ic: 'syringe', titulo: 'Apliquei a dose', to: '/aplicacao' },
    { ic: 'scale', titulo: 'Acabei de me pesar', to: '/medir-peso' },
    { ic: 'utensils', titulo: 'Fiz uma refeição', to: '/medir-refeicao' },
    { ic: 'ruler', titulo: 'Medi meu corpo', to: '/medir-medidas' },
    { ic: 'doc', titulo: 'Recebi um exame', to: '/medir-exame' },
    /* A ANOTAÇÃO É EVENTO como as outras desta lista: cada uma é um
       registro novo, e anotar duas vezes é anotar duas coisas.

       Ela fica por último porque é a única que não tem número — as de
       cima produzem um dado que o app soma, e esta produz uma frase que
       só a pessoa lê. E vem em primeira pessoa, como as vizinhas: o que
       acontece não é "abrir as notas", é lembrar de uma coisa.

       Um item só para os dois momentos, e não dois. Sair da consulta com
       uma orientação e lembrar de uma pergunta na terça são a mesma
       lista — a que vira a pauta do resumo do médico. Dois itens aqui
       seriam duas portas para o mesmo lugar, com nomes diferentes. */
    /* ⚠️ E ELE SÓ EXISTE PARA QUEM TEM PARA QUEM ANOTAR. Nota de
       consulta é pauta: ela nasce para ser dita a alguém, e o resumo a
       carrega até lá. Quem respondeu que conduz o tratamento por conta
       própria não tem esse alguém — e a linha, para ela, é o app
       oferecendo guardar perguntas que ninguém vai responder. */
    ...(temAcompanhamento(S)
      ? [{ ic: 'pencil', titulo: 'Anotei algo para a consulta', to: '/medir-anotacao' }]
      : []),
  ].filter((it) => !acoes.some((k) => CATALOGO[k].titulo === it.titulo));

  const coberta = useFolhaAberta();

  return (
    <View style={{ height: alturaJanela, justifyContent: 'flex-end' }}>
      <TocarParaFechar onPress={fechar} />

      {/* Ancorado na base, cobrindo a tab bar — padrão de bottom sheet. */}
      <View style={{
        backgroundColor: c.bg, maxHeight: alturaJanela * 0.92,
        borderTopLeftRadius: radius.xl, borderTopRightRadius: radius.xl,
        paddingBottom: (insets.bottom || 12) + 16,
      }}>
        <Pressable onPress={fechar} style={{ alignItems: 'center', paddingTop: 10, paddingBottom: 14 }}>
          <View style={{ width: 40, height: 4, borderRadius: radius.pill, backgroundColor: c.bg3 }} />
        </Pressable>

        <Rolagem
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 8 }}
          keyboardShouldPersistTaps="handled"
        >
          {/* A pergunta é o comando da tela. Saiu a linha de contexto que
              vinha embaixo ("um dia comum de tratamento"): ela comentava o
              momento em vez de ajudar a escolher, e o sheet abre para
              escolher. */}
          <Row style={{ alignItems: 'flex-start' }}>
            <View style={{ flex: 1 }}>
              <Txt v="h2">O que deseja registrar?</Txt>
            </View>
            <Pressable onPress={fechar} hitSlop={10} style={({ pressed }) => [{ opacity: pressed ? 0.6 : 1, marginTop: 2 }]}>
              <View style={{ width: 32, height: 32, borderRadius: 16, backgroundColor: c.bg2, alignItems: 'center', justifyContent: 'center' }}>
                <Icon name="x" size={16} color={c.tx2} sw={2.2} />
              </View>
            </Pressable>
          </Row>

          {/* --- check-in: banner fixo, nunca sai da tela ---
              Sai da rotação dos atalhos e ganha lugar próprio: é o registro
              que alimenta insights, radar e streak, e some-lo quando já foi
              feito tirava a confirmação de que o dia está em dia. Feito, ele
              vira comprovante com opção de ajustar. */}
          {/* A cor carrega o estado, e os dois estados querem volumes
              diferentes de atenção.

              Pendente é azul saturado — a cor de ação do app —, porque é
              uma coisa por fazer e deve puxar o olho. Concluído é a lavagem
              verde: já resolvido, então recua. Manter os dois no mesmo lima
              obrigava a LER para saber em qual deles se está; agora a cor
              responde antes do texto.

              A tinta acompanha o fundo, e o véu da pastilha é a própria
              tinta a 12%, não uma cor nova.

              Só UMA pastilha no banner, e ela é o "Editar". Antes havia
              duas iguais — "Check-in diário" e "Editar" — com a mesma
              forma, a mesma cor e o mesmo tamanho, mas só uma delas
              significando um toque. Forma de botão é promessa de botão.

              "CHECK-IN DIÁRIO" virou sobrelinha do título, que é o que ele
              sempre foi: o nome do que está ali, no mesmo papel do "LEVA UM
              MINUTO" mais abaixo. E como a sobrelinha já diz a palavra,
              concluído virou "Concluído hoje" em vez de repetir "Check-in"
              duas linhas seguidas. */}
          <Pressable onPress={irPara('/checkin')} style={({ pressed }) => [{ opacity: pressed ? 0.85 : 1, marginTop: 18 }]}>
            <View style={{ backgroundColor: fez ? c.lime : c.accent, borderRadius: radius.lg, padding: 18 }}>
              <Row gap={14}>
                <View style={{ width: 48, height: 48, borderRadius: 24, backgroundColor: veu, alignItems: 'center', justifyContent: 'center' }}>
                  {/* Pendente pergunta como foi o dia, e o rosto é o ícone
                      que faz essa pergunta. A folha de antes falava de
                      saúde em geral, não de como a pessoa esteve. */}
                  <Icon name={fez ? 'check' : 'mood'} size={24} color={tinta} sw={2.2} />
                </View>
                <View style={{ flex: 1 }}>
                  <Txt v="micro" c={tinta} style={{ letterSpacing: 1, opacity: 0.8 }}>CHECK-IN DIÁRIO</Txt>
                  <Txt v="title" c={tinta} style={{ marginTop: 3 }}>
                    {fez ? 'Concluído hoje' : 'Como foi o seu dia?'}
                  </Txt>
                  {/* O streak é a única linha de apoio que sobrou. "Menos de
                      30s" saiu: prometia rapidez para quem ainda não sabe o
                      que vai encontrar, e quem faz todo dia já sabe. */}
                  {stk > 0 ? (
                    <Txt v="caption" c={tinta} style={{ marginTop: 3, opacity: 0.75 }}>
                      {stk} {stk === 1 ? 'dia seguido' : 'dias seguidos'}
                    </Txt>
                  ) : null}
                </View>
                {/* O mesmo lugar, os dois estados: a seta diz "abre para
                    preencher", a pastilha diz "abre para mudar". */}
                {fez ? (
                  <View style={{ backgroundColor: veu, borderRadius: radius.pill, paddingHorizontal: 12, paddingVertical: 5 }}>
                    <Txt v="tag" c={tinta}>Editar</Txt>
                  </View>
                ) : (
                  <Icon name="chev" size={17} color={tinta} sw={2.2} />
                )}
              </Row>
            </View>
          </Pressable>

          {/* --- agora: três atalhos que mudam com o momento --- */}
          <Row gap={7} style={{ marginTop: 7, alignItems: 'stretch' }}>
            {acoes.map((k) => {
              const it = CATALOGO[k];
              /* O mesmo par do banner logo acima: lima cheio e marca de
                 check. O ícone do assunto dá lugar ao check porque o
                 rótulo fica logo abaixo e continua dizendo qual é qual. */
              const ok = batida[k];
              return (
                <Pressable
                  key={k}
                  onPress={it.acao ?? irPara(it.to!)}
                  style={({ pressed }) => [{ flex: 1, opacity: pressed ? 0.75 : 1 }]}
                >
                  {/* Duas linhas de título para os três, sempre.

                      "Me hidratei" cabe em uma linha; "Fiz uma refeição"
                      precisa de duas. Deixando cada rótulo ocupar o que
                      pede, os tiles saíam de alturas diferentes e o
                      subtítulo de cada um parava numa altura sua.

                      A caixa do título tem altura de duas linhas nos três, e
                      o rótulo fica centrado nela: o curto não cola no ícone
                      nem abre buraco embaixo, e os três subtítulos caem na
                      mesma linha. */}
                  <View style={{ flex: 1, backgroundColor: ok ? c.lime : c.bg1, borderRadius: radius.lg, paddingHorizontal: 10, paddingVertical: 12, alignItems: 'center' }}>
                    <Icon name={ok ? 'check' : it.ic} size={19} color={ok ? c.limeInk : c.accent} sw={ok ? 2.6 : 2} />
                    <View style={{ height: ty.caption.lineHeight * 2, marginTop: 8, justifyContent: 'center' }}>
                      <Txt v="caption" c={ok ? c.limeInk : c.tx} style={{ textAlign: 'center' }} numberOfLines={2}>
                        {it.titulo}
                      </Txt>
                    </View>
                    {/* O número fica, e é ele que explica o lima: "2,6 de
                        2,5 L" mostra de onde veio o check, em vez de pedir
                        que a cor seja acreditada. */}
                    <Txt v="micro" c={ok ? c.limeInk : c.tx3} style={{ textAlign: 'center', opacity: ok ? 0.75 : 1 }} numberOfLines={1}>{it.sub}</Txt>
                  </View>
                </Pressable>
              );
            })}
          </Row>

          {/* --- separação pelo esforço, não por categoria --- */}
          <Row gap={10} style={{ marginTop: 18, marginBottom: 10 }}>
            <Txt v="micro" c={c.tx3} style={{ letterSpacing: 1 }}>LEVA UM MINUTO</Txt>
            <View style={{ flex: 1, height: 1, backgroundColor: c.line }} />
          </Row>

          <View style={{ backgroundColor: c.bg1, borderRadius: radius.lg, paddingHorizontal: 16 }}>
            {/* peso é sempre a primeira linha, então todas as seguintes
                vêm precedidas de divisor */}
            {completos.map((it) => (
              <React.Fragment key={it.titulo}>
                <Divider />
                <Pressable onPress={irPara(it.to!)} style={({ pressed }) => [{ opacity: pressed ? 0.6 : 1 }]}>
                  <Row style={{ paddingVertical: 14 }}>
                    {/* O ÍCONE SOLTO, como em toda lista do app. A pastilha
                        cinza aqui era a última que restava — e era ela que
                        fixava o piso de altura da linha em 32 px, mesmo
                        sem nada para mostrar além do desenho. */}
                    <View style={{ width: 34, alignItems: 'center' }}>
                      <Icon name={it.ic} size={20} color={c.accent} sw={1.9} />
                    </View>
                    <View style={{ flex: 1, marginLeft: 10 }}>
                      <Txt v="body">{it.titulo}</Txt>
                    </View>
                    <Icon name="chev" size={15} color={c.tx4} sw={2} />
                  </Row>
                </Pressable>
              </React.Fragment>
            ))}
          </View>
        </Rolagem>
      </View>
      <Cobertura coberta={coberta} />
    </View>
  );
}
