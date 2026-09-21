import React from 'react';
import { View, Pressable, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useStore } from '../logic/store';
import { PLANOS, reais } from '../logic/assinatura';
import { Txt, Row, Rolagem } from '../ui/kit';
import { Icon } from '../ui/Icon';
import { Botao } from '../ui/internas';
import { useTheme } from '../ui/useTheme';
import { radius } from '../theme';

/* ============================================================
   SUSPENSO — a tela de quem perdeu o vínculo

   ⚠️ ELA É UM PORTÃO, E PORTÃO NÃO TEM BOTÃO DE VOLTAR. Quem chega aqui
   não chega navegando: o aplicativo a traz, porque a clínica informou que
   o vínculo de tratamento acabou e o acesso vinha dele. Um "‹" no canto
   faria a pessoa tentar escapar de uma tela que não é escapável, e
   descobrir isso empurrando a porta três vezes.

   ⚠️⚠️ MAS UM PORTÃO SEM SAÍDA É UMA PRISÃO, E ESTE TEM TRÊS. ⚠️⚠️

   Assinar, exportar os próprios registros, e entrar com o código de outra
   clínica — o caminho de quem simplesmente trocou de médico, que é o caso
   mais provável de todos.

   ⚠️ E A EXPORTAÇÃO É INEGOCIÁVEL. Isto é um diário de tratamento: peso,
   aplicações, sintomas, exames, fotos. Trancar alguém do lado de fora dos
   próprios dados de saúde para forçar uma assinatura é a coisa mais feia
   que este aplicativo poderia fazer, e está prometido o contrário na
   seção 7 dos Termos. Se um dia alguém "simplificar" esta tela, é esta
   linha que não pode sair.

   ⚠️ O QUE ESTÁ SUSPENSO É A ASSINATURA, E NÃO A CONTA. Nada foi apagado,
   nada foi cobrado, e assinar devolve a tela exatamente como ela estava —
   os registros nunca saíram do aparelho. A tela diz as três coisas porque
   as três são o que a pessoa pergunta, nessa ordem.

   ⚠️ E O PORTÃO AINDA NÃO SE FECHA SOZINHO. Não há canal pelo qual a
   clínica informe o fim do vínculo, nem estado de "suspenso" guardado:
   esta tela existe, desenhada e pronta, e quem a liga é a integração com
   o Supabase. Ver PENDENCIAS.md.
   ============================================================ */

const menorPorMes = () =>
  Math.min(...PLANOS.map((p) => (p.sufixo === '/mês' ? p.preco : p.outraUnidade.valor)));

export default function Suspenso() {
  const S = useStore((s) => s.S);
  const router = useRouter();
  const { c } = useTheme();
  const insets = useSafeAreaInsets();

  const clinica = S.profile.clinic || 'a clínica que acompanhava você';

  /* ⚠️ AS TRÊS FRASES ENCOLHERAM PARA O CORPO PODER CRESCER, e essa foi
     a troca: em `note`, com o título em três linhas, as versões longas
     empurravam o terceiro item para debaixo do botão — e o terceiro é
     justamente o que diz que dá para voltar.

     Duas coisas saíram e nenhuma fazia falta. "de você" e "assinar" na
     segunda: quem lê "nada foi cobrado" numa tela sua não pensa em outra
     pessoa. E o complemento da terceira repetia a primeira — "nenhum
     registro se perdeu" já estava dito em "nada foi apagado".

     A enumeração da primeira fica. Ela é a que acalma, e acalma justamente
     por nomear: "os seus registros" é abstrato, "peso, aplicações,
     sintomas, exames e fotos" é a pessoa reconhecendo o que é dela. */
  const FATOS: [string, string][] = [
    ['shield', 'Nada foi apagado. Peso, aplicações, sintomas, exames e fotos continuam no seu aparelho.'],
    ['wallet', 'Nada foi cobrado, e nada vai ser sem você escolher.'],
    ['reset', 'Assinando, tudo volta exatamente como estava.'],
  ];

  return (
    <View style={{ flex: 1, backgroundColor: c.bg, paddingTop: insets.top + 16, paddingHorizontal: 20 }}>
      {/* ⚠️ O BLOCO DESCE E ENCOSTA NO BOTÃO, e o espaço vazio vai para
          cima. Alinhado ao alto, sobrava um vão grande entre o cartão e o
          botão — e vão no meio de uma tela de aviso lê como coisa
          faltando, como se algo não tivesse carregado. Empurrado para
          baixo, o vazio fica acima do cadeado, onde vazio é respiro.

          Os 24 px do `paddingBottom` SÃO a distância até o botão: o rodapé
          é irmão seguinte e não tem folga própria. Mexer num mexe no outro.

          ⚠️ E ROLA, numa tela que caberia. Num telefone de 812 px ela sobra
          — mas com a fonte do sistema aumentada, num aparelho curto ou com
          o nome de uma clínica comprido, não sobra mais. E o que sai
          primeiro pelo fundo é justamente o cartão que acalma. Numa tela
          normal isso seria acabamento; nesta, que não tem como voltar,
          conteúdo cortado vira pessoa presa sem ler o motivo.

          Com o conteúdo maior que a caixa, o `justifyContent` para de
          valer sozinho e a rolagem assume — é por isso que os dois
          convivem. */}
      <Rolagem
        style={{ flex: 1 }}
        contentContainerStyle={{ flexGrow: 1, justifyContent: 'flex-end', paddingBottom: 24 }}
        showsVerticalScrollIndicator={false}
      >
        {/* O cadeado é o único desenho da tela. Um ícone grande diz o
            estado antes da primeira palavra, e evita que a pessoa leia o
            título procurando o que deu errado.

            ⚠️ E ELE É NEUTRO, E NÃO COLORIDO. Tentei um véu de lima com a
            tinta azul, com o argumento de que a cor do resolvido suavizaria
            a notícia. Na tela virou uma bolinha amarelada no alto de uma
            página séria: a cor pedia atenção para o desenho, que é a única
            parte da tela sem nada a dizer.

            O cinza deixa o cadeado marcar o estado e sair da frente. Quem
            acalma aqui é o cartão, e ele já faz isso com palavras. */}
        <View style={{
          width: 52, height: 52, borderRadius: 26, backgroundColor: c.bg2,
          alignItems: 'center', justifyContent: 'center',
        }}>
          <Icon name="lock" size={22} color={c.tx2} sw={1.9} />
        </View>

        {/* ⚠️ "TEMPORARIAMENTE" É A PALAVRA QUE MUDA A TELA. Sem ela o
            título lê como conta encerrada, e a pessoa vai embora antes de
            descobrir que basta um código de outra clínica ou uma
            assinatura para tudo voltar. É uma palavra comprida e ela custa
            uma linha inteira do título; a linha é o preço de não parecer
            uma porta fechada. */}
        <Txt v="display" c={c.tx} style={{ marginTop: 16, letterSpacing: -0.6 }}>
          O seu acesso está temporariamente suspenso
        </Txt>
        <Txt v="note" c={c.tx3} style={{ marginTop: 8, lineHeight: 23 }}>
          {clinica} informou que o vínculo de tratamento foi encerrado — e era ele que cobria o
          aplicativo para você.
        </Txt>

        {/* ⚠️ OS TRÊS ITENS SÃO CORPO DE TEXTO, E NÃO LETRA MIÚDA.

            Estavam em `caption` na cor mais apagada — o tamanho de quem
            escreve rodapé. Mas esta tela é um susto, e as três frases são
            a resposta ao susto: que nada foi apagado, que nada foi
            cobrado, e que assinar devolve tudo. Quem acabou de ler
            "suspenso" não vai apertar os olhos para achar o consolo.

            Em `note` e na tinta de conteúdo elas ficam do tamanho do que
            dizem, que é o mesmo tamanho da frase que explica o problema. */}
        <View style={{ backgroundColor: c.bg1, borderRadius: radius.card, padding: 18, gap: 16, marginTop: 20 }}>
          {/* O MESMO RÓTULO DE /cancelar, e de propósito. Os dois cartões
              fazem o mesmo trabalho — responder "o que eu perco?" antes de
              a pessoa perguntar — e dois nomes para a mesma peça é o tipo
              de diferença que ninguém descreve e todo mundo sente. */}
          <Txt v="micro" c={c.accent} style={{ letterSpacing: 1 }}>FIQUE TRANQUILO</Txt>
          {FATOS.map(([ic, t]) => (
            <Row key={t} gap={13} style={{ alignItems: 'flex-start' }}>
              <View style={{ marginTop: 2 }}>
                <Icon name={ic} size={19} color={c.accent} sw={1.9} />
              </View>
              <Txt v="note" c={c.tx2} style={{ flex: 1, lineHeight: 23 }}>{t}</Txt>
            </Row>
          ))}
        </View>
      </Rolagem>

      {/* ---- as saídas ---- */}
      <View style={{ paddingBottom: insets.bottom + 16, gap: 14 }}>
        <Botao label="Ver os planos" onPress={() => router.push('/planos' as any)} pilula />

        {/* ⚠️ AS DUAS DE BAIXO SÃO DISCRETAS E NÃO ESCONDIDAS, e a diferença
            é essa: elas não competem com o botão, mas estão na mesma dobra,
            em texto legível, sem precisar rolar. Esconder a exportação
            atrás de um menu seria cumprir a promessa dos Termos na letra e
            quebrá-la no gesto. */}
        <Row gap={20} style={{ justifyContent: 'center', alignItems: 'center' }}>
          <Pressable onPress={() => router.push('/exportar' as any)} hitSlop={10} style={({ pressed }) => [{ opacity: pressed ? 0.6 : 1 }]}>
            <Row gap={7} style={{ alignItems: 'center' }}>
              <Icon name="doc" size={14} color={c.tx2} sw={1.9} />
              <Txt v="label" c={c.tx2}>Exportar registros</Txt>
            </Row>
          </Pressable>
          <Pressable onPress={() => router.push('/codigo' as any)} hitSlop={10} style={({ pressed }) => [{ opacity: pressed ? 0.6 : 1 }]}>
            <Row gap={7} style={{ alignItems: 'center' }}>
              <Icon name="steth" size={14} color={c.tx2} sw={1.9} />
              <Txt v="label" c={c.tx2}>Tenho outro código</Txt>
            </Row>
          </Pressable>
        </Row>

        <Txt v="micro" c={c.tx4} style={{ textAlign: 'center', lineHeight: 17 }}>
          Os planos começam em {reais(menorPorMes())} por mês.
        </Txt>

        {/* ⚠️ SÓ EM DESENVOLVIMENTO, e existe porque o portão ainda não se
            fecha sozinho: sem isto, a única forma de conferir esta tela
            seria abri-la pela URL e ficar sem como sair dela.

            `__DEV__` é falso em produção e esta saída some na compilação —
            junto com a única maneira de escapar do portão sem resolver o
            que ele pede. */}
        {__DEV__ ? (
          <Pressable onPress={() => router.back()} hitSlop={10} style={({ pressed }) => [{ opacity: pressed ? 0.6 : 1 }]}>
            <Txt v="micro" c={c.tx4} style={{ textAlign: 'center' }}>
              Voltar — atalho de desenvolvimento, não aparece em produção
            </Txt>
          </Pressable>
        ) : null}
      </View>
    </View>
  );
}
