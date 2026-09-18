import React from 'react';
import { View, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useStore } from '../logic/store';
import { PLANOS, reais } from '../logic/assinatura';
import { Txt, Row } from '../ui/kit';
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

  const FATOS: [string, string][] = [
    ['shield', 'Nada foi apagado. Peso, aplicações, sintomas, exames e fotos continuam no seu aparelho.'],
    ['wallet', 'Nada foi cobrado de você, e nada vai ser sem você escolher assinar.'],
    ['reset', 'Assinando, o aplicativo volta exatamente como estava — nenhum registro se perdeu no caminho.'],
  ];

  return (
    <View style={{ flex: 1, backgroundColor: c.bg, paddingTop: insets.top + 32, paddingHorizontal: 20 }}>
      <View style={{ flex: 1 }}>
        {/* O cadeado é o único desenho da tela. Um ícone grande diz o
            estado antes da primeira palavra, e evita que a pessoa leia o
            título procurando o que deu errado. */}
        <View style={{
          width: 56, height: 56, borderRadius: 28, backgroundColor: c.bg2,
          alignItems: 'center', justifyContent: 'center',
        }}>
          <Icon name="lock" size={24} color={c.tx2} sw={1.9} />
        </View>

        <Txt v="display" c={c.tx} style={{ marginTop: 20, letterSpacing: -0.6 }}>
          O seu acesso está suspenso
        </Txt>
        <Txt v="note" c={c.tx3} style={{ marginTop: 10, lineHeight: 23 }}>
          {clinica} informou que o vínculo de tratamento foi encerrado — e era ele que cobria o
          aplicativo para você.
        </Txt>

        <View style={{ backgroundColor: c.bg1, borderRadius: radius.card, padding: 18, gap: 14, marginTop: 24 }}>
          <Txt v="micro" c={c.accent} style={{ letterSpacing: 1 }}>É BOM VOCÊ SABER</Txt>
          {FATOS.map(([ic, t]) => (
            <Row key={t} gap={12} style={{ alignItems: 'flex-start' }}>
              <View style={{ marginTop: 1 }}>
                <Icon name={ic} size={16} color={c.tx3} sw={1.9} />
              </View>
              <Txt v="caption" c={c.tx3} style={{ flex: 1, lineHeight: 20 }}>{t}</Txt>
            </Row>
          ))}
        </View>
      </View>

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
