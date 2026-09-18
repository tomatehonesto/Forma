import React from 'react';
import { View, Pressable, Linking } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useStore } from '../logic/store';
import {
  PLANOS, assinaturaAtual, reais, GESTAO_NA_LOJA, NOME_DA_LOJA,
} from '../logic/assinatura';
import { TEM_REDE_PARCEIRA } from '../logic/mercado';
import { TelaInterna, Titulao, Cartao, Bloco, Botao } from '../ui/internas';
import { Txt, Row } from '../ui/kit';
import { Icon } from '../ui/Icon';
import { useTheme } from '../ui/useTheme';
import { radius } from '../theme';

/* ============================================================
   CANCELAR — a pergunta antes da porta

   ⚠️ ESTA TELA TEM UM CONFLITO DE INTERESSE, E A REGRA QUE O RESOLVE É
   UMA SÓ: A SAÍDA NUNCA FICA ATRÁS DA PERGUNTA.

   O botão que leva à loja está no rodapé fixo, ligado, desde o primeiro
   instante, e não depende de responder nada. Quem abriu esta tela já
   decidiu; o que a gente pode fazer é perguntar por quê e mostrar uma
   alternativa quando ela EXISTE — não segurar a porta.

   É a diferença entre uma tela de retenção e um padrão escuro, e ela não
   é de opinião: é de quantos toques separam a pessoa do cancelamento. Um.
   Se algum dia esta tela pedir dois, ela virou outra coisa.

   ⚠️⚠️ E A SAÍDA É O BOTÃO CHEIO, enquanto a alternativa é o fantasma.
   Isso é o contrário do que uma tela de retenção costuma fazer, e é de
   propósito: o peso visual tem que seguir a intenção de quem está na
   tela, não a nossa. Inverter os dois tons é a forma mais barata de
   transformar esta tela num funil — se alguém fizer isso um dia, terá que
   apagar este parágrafo antes.

   ⚠️ E AS OFERTAS SÃO CONDICIONAIS, PORQUE SENÃO VIRAM MENTIRA. Quem já
   está no anual não recebe "o anual é mais barato"; quem não tem rede
   parceira no mercado dela não recebe a linha do código. Uma alternativa
   que não se aplica ao caso é publicidade travestida de ajuda, e custa
   mais caro do que não oferecer nada.

   ⚠️ O MOTIVO FICA GUARDADO E NÃO VAI A LUGAR NENHUM — ainda. Não há
   servidor para receber. Ele é escrito no perfil com a data, para ser
   enviado quando o Supabase entrar, e é só isso que se pode prometer
   hoje. Ver PENDENCIAS.md, item 5.

   ⚠️ E O APLICATIVO NÃO CANCELA NADA AQUI. Quem cobra é a loja e é lá que
   se cancela — esta tela conversa e abre a porta. Um botão "cancelar" que
   parecesse cancelar, e não cancelasse, seria a pior porta emparedada que
   este projeto poderia ter.
   ============================================================ */

type Motivo = 'caro' | 'pouco-uso' | 'clinica' | 'faltou' | 'outro';

/* ⚠️ CADA MOTIVO TEM ÍCONE, e não é enfeite: cinco pílulas iguais
   empilhadas são cinco retângulos que só se diferenciam lendo, e esta é
   uma tela que ninguém quer ler. O desenho dá um ponto de entrada para
   cada linha e deixa a lista se varrer em vez de se ler.

   Solto, sem pastilha de cor, que é a regra da casa em lista. */
const MOTIVOS: [Motivo, string, string][] = [
  ['caro', 'wallet', 'Está caro'],
  ['pouco-uso', 'moon', 'Não estou usando'],
  ['clinica', 'steth', 'Me trato numa clínica parceira'],
  ['faltou', 'bulb', 'Faltou alguma coisa'],
  ['outro', 'more', 'Outro motivo'],
];

/* ⚠️ A ESCOLHA É UM CHECK, E NÃO UM BLOCO PREENCHIDO.

   O componente de opção da casa acende em azul cheio, e funciona onde
   funciona: no cadastro, escolher é avançar. Aqui escolher é dizer um
   motivo para ir embora — um retângulo azul comemorando a resposta soa
   errado, e cinco deles numa tela de cancelamento soam pior.

   O selecionado ganha o fundo lavado, o fio na cor de ação e um check.
   Três sinais fracos, que juntos dizem a mesma coisa que um forte sem
   levantar a voz. */
function Escolha({ ic, label, on, onPress }: {
  ic: string; label: string; on: boolean; onPress: () => void;
}) {
  const { c } = useTheme();
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1 }]}>
      <Row
        gap={12}
        style={{
          alignItems: 'center',
          paddingHorizontal: 16, paddingVertical: 15,
          borderRadius: radius.lg, borderWidth: 1.5,
          backgroundColor: on ? c.accentWeak : c.bg1,
          borderColor: on ? c.accent : 'transparent',
        }}
      >
        <Icon name={ic} size={19} color={on ? c.accent : c.tx3} sw={1.9} />
        <Txt v="body" c={on ? c.tx : c.tx2} style={{ flex: 1 }}>{label}</Txt>
        <View style={{
          width: 22, height: 22, borderRadius: 11,
          alignItems: 'center', justifyContent: 'center',
          backgroundColor: on ? c.accent : 'transparent',
          borderWidth: on ? 0 : 1.5, borderColor: c.line,
        }}>
          {on ? <Icon name="check" size={13} color={c.accentInk} sw={2.8} /> : null}
        </View>
      </Row>
    </Pressable>
  );
}

export default function Cancelar() {
  const S = useStore((s) => s.S);
  const update = useStore((s) => s.update);
  const router = useRouter();
  const { c } = useTheme();

  const [motivo, setMotivo] = React.useState<Motivo | null>(null);

  /* ⚠️ PORTA DE DESENVOLVIMENTO — o mesmo `?assinante=1` de /assinatura,
     pelo mesmo motivo: sem assinatura não há plano, e sem plano a oferta
     do anual — que é a única condicional desta tela — nunca aparece para
     ser conferida. Em produção `__DEV__` é falso e some na compilação. */
  const { assinante } = useLocalSearchParams<{ assinante?: string }>();
  const atual = assinaturaAtual(S) ?? (__DEV__ && assinante === '1'
    ? { plano: 'mensal' as const, renovaEm: Date.now() + 20 * 864e5, emTeste: false }
    : null);
  const plano = atual ? PLANOS.find((x) => x.id === atual.plano) : undefined;
  const anual = PLANOS.find((x) => x.id === 'anual')!;

  /* O motivo é gravado no toque, e não no botão de sair: quem responde e
     fecha a tela pelo gesto de voltar também respondeu. */
  const escolher = (m: Motivo) => {
    setMotivo(m);
    update((st: any) => { st.profile.cancelamento = { motivo: m, t: Date.now() }; });
  };

  const irParaLoja = () => Linking.openURL(GESTAO_NA_LOJA);

  /* ---- a alternativa, quando existe ---- */
  const oferta = (() => {
    if (motivo === 'caro' && plano?.id === 'mensal') {
      return {
        ic: 'wallet',
        titulo: `No anual sai ${reais(anual.outraUnidade.valor)} por mês`,
        texto: `São ${reais(anual.preco)} uma vez por ano, em vez de ${reais(plano.preco)} todo mês. A troca é feita na ${NOME_DA_LOJA}, na mesma tela do cancelamento.`,
        rotulo: 'Mudar de plano',
        acao: irParaLoja,
      };
    }
    if (motivo === 'clinica' && TEM_REDE_PARCEIRA) {
      return {
        ic: 'steth',
        titulo: 'Pacientes de clínicas parceiras não pagam',
        texto: 'Se a sua clínica é parceira, o código que ela te passou libera o aplicativo — e aí cancelar a assinatura é o caminho certo mesmo, sem perder nada.',
        rotulo: 'Inserir código',
        acao: () => router.push('/codigo' as any),
      };
    }
    if (motivo === 'pouco-uso') {
      return {
        ic: 'bell',
        titulo: 'Os lembretes existem para isso',
        texto: 'Dose, pesagem, água e proteína no horário que você escolher. É o que costuma faltar quando o registro para.',
        rotulo: 'Lembretes',
        acao: () => router.push('/lembretes' as any),
      };
    }
    return null;
  })();

  return (
    <TelaInterna
      titulo="Cancelar assinatura"
      rodape={
        /* ⚠️ SEMPRE LIGADO, SEMPRE AQUI, E CHEIO. Não espera resposta, não
           muda de rótulo, não fica cinza: é a razão de a pessoa ter aberto
           a tela, e o peso visual segue a intenção dela. */
        <Botao label={`Continuar para a ${NOME_DA_LOJA}`} onPress={irParaLoja} pilula />
      }
    >
      <Titulao
        titulo="Antes de ir, uma pergunta"
        lead="Responder é opcional e não muda nada: o cancelamento continua a um toque, no botão lá embaixo."
      />

      <Bloco titulo="Por que você está cancelando?">
        <View style={{ gap: 8 }}>
          {MOTIVOS.map(([id, ic, label]) => (
            <Escolha key={id} ic={ic} label={label} on={motivo === id} onPress={() => escolher(id)} />
          ))}
        </View>
      </Bloco>

      {/* ⚠️ A RESPOSTA VEM SEMPRE, com oferta ou sem. Escolher um motivo e
          não acontecer nada faz a pergunta inteira parecer pedágio — e faz
          a pessoa se perguntar o que deixou de ganhar por ter respondido a
          opção errada. */}
      {motivo ? (
        <Cartao style={oferta ? { borderWidth: 1, borderColor: c.limeWeak } : undefined}>
          <View style={{ padding: 18, gap: 10 }}>
            <Row gap={10} style={{ alignItems: 'center' }}>
              <Icon name={oferta ? oferta.ic : 'heart'} size={19} color={c.lime} sw={1.9} />
              <Txt v="bodyMed" c={c.tx} style={{ flex: 1 }}>
                {oferta ? oferta.titulo : 'Obrigado por dizer'}
              </Txt>
            </Row>
            <Txt v="caption" c={c.tx3} style={{ lineHeight: 20 }}>
              {oferta
                ? oferta.texto
                : 'Não temos uma alternativa melhor para esse caso — o que a gente faz com isso é melhorar o aplicativo.'}
            </Txt>
            {oferta ? (
              /* Fantasma, e não cheio: a alternativa não pode pesar mais do
                 que a saída. Ver o segundo aviso do cabeçalho. */
              <View style={{ marginTop: 2 }}>
                <Botao label={oferta.rotulo} onPress={oferta.acao} tom="fantasma" />
              </View>
            ) : null}
          </View>
        </Cartao>
      ) : null}

      {/* ⚠️ O QUE ACONTECE DEPOIS, DITO ANTES. "Cancelei e perdi tudo" é o
          medo que faz gente adiar o cancelamento e depois reclamar da
          cobrança seguinte. Nada aqui se perde: os registros são dela e
          continuam no aparelho, com ou sem assinatura.

          Em cartão, e não solto no fundo: são três fatos que a pessoa pode
          querer reler antes de tocar no botão, e um parágrafo cinza no
          meio do vão é a primeira coisa que o olho pula. */}
      <Cartao>
        <View style={{ padding: 18, gap: 12 }}>
          {([
            ['cal', `O acesso continua até o fim do período já pago.`],
            ['shield', 'Nada do que você registrou se perde — tudo continua no aparelho.'],
            ['send', `O cancelamento é feito na ${NOME_DA_LOJA}: o aplicativo não consegue fazer isso por você.`],
          ] as [string, string][]).map(([ic, t]) => (
            <Row key={t} gap={12} style={{ alignItems: 'flex-start' }}>
              <View style={{ marginTop: 1 }}>
                <Icon name={ic} size={16} color={c.tx3} sw={1.9} />
              </View>
              <Txt v="caption" c={c.tx3} style={{ flex: 1, lineHeight: 20 }}>{t}</Txt>
            </Row>
          ))}
        </View>
      </Cartao>
    </TelaInterna>
  );
}
