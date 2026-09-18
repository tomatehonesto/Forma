import React from 'react';
import { View, Linking } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useStore } from '../logic/store';
import {
  PLANOS, assinaturaAtual, reais, GESTAO_NA_LOJA, NOME_DA_LOJA,
} from '../logic/assinatura';
import { TEM_REDE_PARCEIRA } from '../logic/mercado';
import { TelaInterna, Titulao, Cartao, Linha, Grade, Opc, Botao } from '../ui/internas';
import { Txt } from '../ui/kit';
import { useTheme } from '../ui/useTheme';

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

const MOTIVOS: [Motivo, string][] = [
  ['caro', 'Está caro'],
  ['pouco-uso', 'Não estou usando'],
  ['clinica', 'Me trato numa clínica parceira'],
  ['faltou', 'Faltou alguma coisa'],
  ['outro', 'Outro motivo'],
];

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
        titulo: `No plano anual sai ${reais(anual.outraUnidade.valor)} por mês`,
        texto: `São ${reais(anual.preco)} uma vez por ano, em vez de ${reais(plano.preco)} todo mês. A troca é feita na ${NOME_DA_LOJA}, na mesma tela do cancelamento.`,
        rotulo: 'Mudar de plano',
        acao: irParaLoja,
      };
    }
    if (motivo === 'clinica' && TEM_REDE_PARCEIRA) {
      return {
        titulo: 'Pacientes de clínicas parceiras não pagam',
        texto: 'Se a sua clínica é parceira, o código que ela te passou libera o aplicativo — e aí cancelar a assinatura é o caminho certo mesmo, sem perder nada.',
        rotulo: 'Inserir código',
        acao: () => router.push('/codigo' as any),
      };
    }
    if (motivo === 'pouco-uso') {
      return {
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
        /* ⚠️ SEMPRE LIGADO, E SEMPRE AQUI. Ele não espera resposta, não
           muda de rótulo e não fica cinza: é a razão de a pessoa ter
           aberto a tela. */
        <Botao label={`Continuar para a ${NOME_DA_LOJA}`} onPress={irParaLoja} tom="fantasma" />
      }
    >
      <Titulao
        titulo="Antes de ir, uma pergunta"
        lead="Responder é opcional, e não muda nada no cancelamento — ele continua a um toque, no botão lá embaixo."
      />

      <Grade cols={1}>
        {MOTIVOS.map(([id, label]) => (
          <Opc key={id} label={label} cheia on={motivo === id} onPress={() => escolher(id)} />
        ))}
      </Grade>

      {oferta ? (
        <Cartao>
          <View style={{ padding: 18, gap: 6 }}>
            <Txt v="bodyMed" c={c.tx}>{oferta.titulo}</Txt>
            <Txt v="caption" c={c.tx3} style={{ lineHeight: 20 }}>{oferta.texto}</Txt>
          </View>
          <Linha ic="spark" titulo={oferta.rotulo} onPress={oferta.acao} />
        </Cartao>
      ) : motivo ? (
        /* ⚠️ SEM OFERTA, A RESPOSTA É UM AGRADECIMENTO E NÃO UM SILÊNCIO.
           Escolher "outro motivo" e não acontecer nada faz a pergunta
           inteira parecer um pedágio — e faz a pessoa se perguntar o que
           ela deixou de ganhar por ter respondido a opção errada. */
        <Cartao>
          <View style={{ padding: 18, gap: 6 }}>
            <Txt v="bodyMed" c={c.tx}>Obrigado por dizer</Txt>
            <Txt v="caption" c={c.tx3} style={{ lineHeight: 20 }}>
              Não temos uma alternativa melhor para esse caso — o que a gente faz com isso é
              melhorar o aplicativo.
            </Txt>
          </View>
        </Cartao>
      ) : null}

      {/* ⚠️ O QUE ACONTECE DEPOIS, DITO ANTES. "Cancelei e perdi tudo" é o
          medo que faz gente adiar o cancelamento e depois reclamar da
          cobrança seguinte. Nada aqui se perde: os registros são dela e
          continuam no aparelho, com ou sem assinatura. */}
      <Txt v="caption" c={c.tx3} style={{ paddingHorizontal: 2, lineHeight: 20 }}>
        O cancelamento é feito na {NOME_DA_LOJA} — o aplicativo não consegue fazer isso por você.
        O acesso continua até o fim do período já pago, e nada do que você registrou se perde.
      </Txt>
    </TelaInterna>
  );
}
