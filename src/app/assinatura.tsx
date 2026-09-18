import React from 'react';
import { View, Linking } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useStore } from '../logic/store';
import {
  PLANOS, assinaturaAtual, isento, reais, GESTAO_NA_LOJA, PAGAMENTO_NA_LOJA, NOME_DA_LOJA,
  tipoDaAssinatura, NOME_DO_TIPO,
} from '../logic/assinatura';
import { TEM_REDE_PARCEIRA } from '../logic/mercado';
import { TelaInterna, Cartao, Linha, Selo, Aviso } from '../ui/internas';
import { Txt, Row } from '../ui/kit';
import { useTheme } from '../ui/useTheme';
import { MO_LONG } from '../logic/time';
import { radius } from '../theme';

/* ============================================================
   SUA ASSINATURA — o que está valendo, quanto custa, onde se mexe

   ⚠️ ELA ERA UM ATALHO PARA /planos, e não é a mesma coisa. A tela de
   planos é vitrine: ela vende. Esta responde "o que eu tenho hoje e o que
   acontece se eu não fizer nada" — a pergunta que manda gente para o
   suporte em todo aplicativo de assinatura, e a única que a vitrine não
   responde. Para quem é isenta, mandá-la ao paywall era oferecer de novo
   o que ela já tem.

   ⚠️⚠️ E É UMA TELA SÓ, COM UMA ETIQUETA. ⚠️⚠️

   A primeira versão tinha três telas dentro de um arquivo: uma para quem
   é isenta, uma para quem assina, uma para quem não tem nada. Três
   desenhos para o mesmo assunto — e a pessoa isenta nunca via a forma da
   assinatura, só uma página de explicação.

   O acesso pela clínica não é outra tela: é o MESMO cartão com outros
   valores e uma etiqueta dizendo de onde vem. Quem é paciente de clínica
   parceira olha para o lugar onde os outros veem "R$ 299,00 por ano" e vê
   "sem custo", com "Isenta" ao lado. A estrutura não muda porque o
   assunto não mudou.

   Na prática: um objeto `vigente` resolve o estado, e há um render só. Se
   um dia aparecer um quarto estado — assinatura em atraso, em pausa, em
   período de carência —, ele entra como mais um caso no objeto e não como
   mais um `return`.

   ⚠️ E O QUE NÃO SE SABE NÃO APARECE. A data de renovação vem do recibo da
   loja, que ainda não é lido; ela chega nula e a linha simplesmente não é
   desenhada. Uma data bonita e inventada aqui é a pior linha possível
   numa tela de cobrança.
   ============================================================ */

const dataLonga = (t: number) => {
  const d = new Date(t);
  return `${d.getDate()} de ${MO_LONG[d.getMonth()]} de ${d.getFullYear()}`;
};

/* O menor preço por mês entre os planos. Sai da lista e não de um número
   escrito à mão: mudar preço em assinatura.ts não pode deixar uma frase
   velha viva aqui. */
const menorPorMes = () =>
  Math.min(...PLANOS.map((p) => (p.sufixo === '/mês' ? p.preco : p.outraUnidade.valor)));

export default function Assinatura() {
  const S = useStore((s) => s.S);
  const router = useRouter();
  const { c } = useTheme();

  /* ⚠️ PORTA DE DESENVOLVIMENTO — `?assinante=1`.

     Ninguém consegue assinar enquanto a loja não entrar, então metade
     desta tela — forma de pagamento, extrato com linhas, cancelamento —
     não tinha como ser conferida. Este parâmetro NÃO escreve nada: ele
     finge, só no desenho, uma assinatura anual que renova em um ano.

     Em produção `__DEV__` é falso, a linha some na compilação e a tela
     volta a ler só a costura. Ver PENDENCIAS.md, item 5: sai com a
     cobrança. */
  const { assinante, compra } = useLocalSearchParams<{ assinante?: string; compra?: string }>();
  const fingindoAssinante = __DEV__ && assinante === '1';
  /* `?compra=1` é o mesmo parâmetro da tela de planos, com o mesmo
     significado: finge que não há vínculo. Combinado com o de cima, dá o
     quarto estado — Individual pagando. */
  const fingindoPagante = __DEV__ && compra === '1';
  const atual = assinaturaAtual(S) ?? (fingindoAssinante
    ? { plano: 'anual' as const, renovaEm: Date.now() + 365 * 864e5, emTeste: false }
    : null);
  const ehIsenta = isento(S) && !fingindoPagante;
  const vinculo = (S.profile as any).vinculo as { desde?: number; convite?: string } | null;
  const convite = ((S.profile as any).convite as string) || vinculo?.convite || '';
  const clinica = S.profile.clinic || 'a clínica que acompanha você';
  const plano = atual ? PLANOS.find((x) => x.id === atual.plano) : undefined;

  /* ⚠️ O NOME DO CARTÃO É O TIPO, E NÃO O PLANO. Ele era "Plano anual",
     "Acesso pela clínica" e "Sem assinatura" — três nomes para três
     estados, o que é a mesma doença das três telas, agora na tipografia.

     Care e Individual não mudam quando a pessoa troca de mensal para
     anual, nem quando a assinatura vence: é o trilho em que ela está. A
     periodicidade desceu para a ficha, que é onde moram os detalhes da
     cobrança, e o estado ficou na etiqueta. */
  const tipo = tipoDaAssinatura(S);

  /* ---- o estado vigente, resolvido uma vez ---- */
  type Item = [string, string];
  const vigente: {
    nome: string;
    selo: string;
    seloTom: 'lima' | 'verde' | 'neutra';
    valor: string;
    unidade?: string;
    abaixo?: string;
    itens: Item[];
  } = atual && plano
    ? {
      /* ⚠️ CARE E ASSINANTE AO MESMO TEMPO É UM ESTADO REAL, e foi o que
         apareceu na primeira conferência: alguém assina, depois passa a se
         tratar numa clínica parceira e digita o código. O vínculo não
         cancela a assinatura da loja — ninguém tem como cancelar por ela
         —, então a pessoa fica pagando por uma coisa que já é de graça.

         O cartão mostra o que é verdade: ela É Care e a cobrança ESTÁ
         ativa. Quem resolve a contradição é o aviso logo abaixo, e não um
         desses dois campos mentindo para esconder o outro. */
      nome: NOME_DO_TIPO[tipo],
      selo: atual.emTeste ? 'Em teste' : 'Ativa',
      seloTom: atual.emTeste ? 'lima' : 'verde',
      valor: reais(plano.preco),
      unidade: plano.sufixo,
      abaixo: `${reais(plano.outraUnidade.valor)} ${plano.outraUnidade.periodo}`,
      itens: [
        ['Plano', plano.nome],
        ...(atual.renovaEm
          ? ([[atual.emTeste ? 'Primeira cobrança' : 'Próxima cobrança', dataLonga(atual.renovaEm)]] as Item[])
          : []),
        ['Cobrança pela', NOME_DA_LOJA],
      ],
    }
    : ehIsenta
      ? {
        nome: NOME_DO_TIPO[tipo],
        selo: 'Isenta',
        seloTom: 'lima',
        valor: 'Sem custo',
        abaixo: `O vínculo com ${clinica} cobre o aplicativo inteiro.`,
        itens: [
          ...(vinculo?.desde ? ([['Vinculada desde', dataLonga(vinculo.desde)]] as Item[]) : []),
          ...(convite ? ([['Código de convite', convite]] as Item[]) : []),
          ['Próxima cobrança', 'Não há'],
        ],
      }
      : {
        nome: NOME_DO_TIPO[tipo],
        selo: 'Inativa',
        seloTom: 'neutra',
        valor: 'Sem custo',
        abaixo: `O aplicativo está inteiro do jeito que está. Os planos começam em ${reais(menorPorMes())} por mês.`,
        itens: [['Próxima cobrança', 'Não há']],
      };

  return (
    <TelaInterna titulo="Sua assinatura">
      {/* ---- o cartão do que está valendo ---- */}
      <Cartao>
        <View style={{ padding: 18, gap: 4 }}>
          <Row style={{ alignItems: 'center' }}>
            <Txt v="bodyMed" c={c.tx} style={{ flex: 1 }}>{vigente.nome}</Txt>
            <Selo label={vigente.selo} tom={vigente.seloTom} />
          </Row>

          {/* ⚠️ O VALOR NO MESMO LUGAR EM TODOS OS ESTADOS, e isso é o que
              faz a etiqueta funcionar. Quem assina lê "R$ 299,00" ali;
              quem é paciente de clínica parceira lê "Sem custo" no mesmo
              ponto da tela, com o "Isenta" logo acima. A comparação é
              imediata porque o lugar é o mesmo — e é exatamente isso que
              três telas diferentes destruíam. */}
          <Row gap={3} style={{ alignItems: 'baseline', marginTop: 2 }}>
            <Txt v="display" c={c.tx} numberOfLines={1} style={{ letterSpacing: -0.6 }}>{vigente.valor}</Txt>
            {vigente.unidade ? <Txt v="note" c={c.tx3}>{vigente.unidade}</Txt> : null}
          </Row>

          {vigente.abaixo ? (
            <Txt v="caption" c={c.tx3} style={{ marginTop: 2, lineHeight: 19 }}>{vigente.abaixo}</Txt>
          ) : null}
        </View>

        {/* ⚠️ RÓTULO À ESQUERDA, VALOR À DIREITA — e não `Linha`, que é
            título e subtítulo empilhados. Uma ficha de cobrança se lê em
            coluna: o olho desce pelos rótulos e cruza para o número que
            interessa. Empilhado, cada item vira um parágrafo e a pessoa
            tem que ler os seis para achar a data. */}
        {vigente.itens.length ? (
          <View style={{ paddingHorizontal: 18, paddingVertical: 6 }}>
            {vigente.itens.map(([rotulo, valor]) => (
              <Row key={rotulo} gap={12} style={{ paddingVertical: 10, alignItems: 'center' }}>
                <Txt v="caption" c={c.tx3} style={{ flex: 1 }}>{rotulo}</Txt>
                <Txt v="label" c={c.tx}>{valor}</Txt>
              </Row>
            ))}
          </View>
        ) : null}
      </Cartao>

      {/* ⚠️ O AVISO DE QUEM ESTÁ PAGANDO SEM PRECISAR.

          Este é o único lugar do aplicativo onde a gente pede para a
          pessoa cancelar uma coisa que nos paga. Não é generosidade: ela
          já tem o acesso pelo vínculo, e cobrar por isso é cobrar duas
          vezes pela mesma entrega. Um aplicativo que sabe disso e fica
          calado está contando com o esquecimento dela.

          E o aviso diz o que ela não perde ao cancelar, porque é essa a
          dúvida que segura o dedo. */}
      {atual && ehIsenta ? (
        <Aviso
          ic="info"
          titulo="Você está pagando sem precisar"
          texto={`O vínculo com ${clinica} já cobre o aplicativo inteiro. Cancelar a assinatura não tira nada de você: tudo continua igual, e o acesso segue pelo vínculo.`}
        />
      ) : null}

      {/* ---- o plano e a cobrança ---- */}
      <Cartao>
        {/* Mudar de plano leva à mesma vitrine em qualquer estado; o que
            muda é o nome, porque quem já assina não vai "ver os planos",
            vai trocar o seu — e trocar é na loja, que é onde a assinatura
            vive. */}
        <Linha
          ic="spark"
          titulo={atual ? 'Mudar de plano' : 'Ver os planos'}
          sub={atual ? `Trocar entre mensal e anual na ${NOME_DA_LOJA}` : 'O que entra, e quanto custa'}
          onPress={atual ? () => Linking.openURL(GESTAO_NA_LOJA) : () => router.push('/planos' as any)}
        />

        {/* ⚠️ A FORMA DE PAGAMENTO É DA CONTA DELA NA LOJA, e por isso a
            linha abre a loja em vez de um formulário nosso. Não temos como
            ler o cartão nem como trocá-lo — e um "atualizar forma de
            pagamento" que abrisse um campo aqui seria pedir o número do
            cartão para uma cobrança que quem faz é outro.

            Só aparece havendo assinatura: sem cobrança, não há forma de
            pagamento a atualizar. */}
        {atual ? (
          <Linha
            ic="dose"
            titulo="Forma de pagamento"
            sub={`O cartão cadastrado na ${NOME_DA_LOJA}`}
            onPress={() => Linking.openURL(PAGAMENTO_NA_LOJA)}
          />
        ) : null}

        {/* ⚠️ O EXTRATO APARECE SEMPRE, inclusive vazio, e isso é de
            propósito. "Onde eu vejo o que já paguei" é uma pergunta que se
            faz antes de haver resposta — e uma lista vazia com uma frase
            explicando por que está vazia responde melhor do que a ausência
            da linha, que manda a pessoa procurar no lugar errado. */}
        <Linha
          ic="doc"
          titulo="Histórico de cobrança"
          sub={atual ? 'Cada cobrança, com data e valor' : 'O que já foi cobrado de você'}
          onPress={() => router.push('/cobrancas' as any)}
        />
      </Cartao>

      {/* ---- a clínica ---- */}
      {/* ⚠️ A PORTA DO CÓDIGO VALE NOS TRÊS ESTADOS, e essa é a mudança.

          Ela só existia para quem não tinha nada, o que deixava de fora os
          dois casos mais prováveis: a assinante que passa a se tratar numa
          clínica parceira — e que a partir daí não precisa mais pagar — e
          a paciente que troca de clínica. Os dois acontecem depois do
          primeiro dia, que é justamente quando a porta tinha sumido.

          O rótulo é o nome da tela que abre. Quem já tem vínculo vai para
          a folha do código, porque já sabe o que é; quem não tem vai para
          /parceiros, que explica antes de pedir. */}
      <Cartao>
        {ehIsenta ? (
          <Linha
            ic="steth"
            titulo="Código de convite"
            sub="Trocar a clínica que acompanha você"
            onPress={() => router.push('/codigo' as any)}
          />
        ) : TEM_REDE_PARCEIRA ? (
          <Linha
            ic="steth"
            titulo="Médicos parceiros"
            sub="Quem se trata numa clínica parceira não paga"
            onPress={() => router.push('/parceiros' as any)}
          />
        ) : null}
      </Cartao>

      {/* ---- cancelar ---- */}
      {/* ⚠️ O CANCELAMENTO FICA SOZINHO, e leva à loja.

          Sozinho porque é a única ação desta tela que desfaz alguma coisa:
          no meio das outras, um toque errado numa lista vira um
          cancelamento que ninguém quis.

          E que ele leve para fora não é escolha de desenho: a Apple e o
          Google exigem que a gestão da assinatura aconteça nas telas
          deles, e um "cancelar" que chamasse só a nossa API seria recusado
          na revisão — e, pior, não cancelaria nada, porque quem cobra é a
          loja. O rótulo diz para onde vai.

          ⚠️ E ELE APARECE QUANDO HÁ O QUE CANCELAR. Um botão de cancelar
          numa conta sem assinatura é a porta emparedada clássica das telas
          de conta: a pessoa toca, cai na lista vazia da loja e volta sem
          saber se cancelou. Quem é Care encerra o vínculo com a clínica, e
          não com um botão daqui.

          Hoje ele nunca aparece, porque ninguém consegue assinar — a porta
          de desenvolvimento logo abaixo existe para conferir esta tela
          inteira. */}
      {atual ? (
        <Cartao>
          <Linha
            ic="logout"
            titulo="Cancelar assinatura"
            sub={`Abre a ${NOME_DA_LOJA}, que é onde a cobrança acontece`}
            onPress={() => Linking.openURL(GESTAO_NA_LOJA)}
          />
        </Cartao>
      ) : null}

      {/* ⚠️ SÓ EM DESENVOLVIMENTO, e são duas portas porque são duas telas.

          A semente tem clínica parceira, então tudo abre no estado isento;
          e ninguém pode assinar, então o estado de assinante — que é o que
          tem forma de pagamento, extrato e cancelamento — não tinha como
          ser visto sem editar o estado à mão.

          `__DEV__` é falso na build de produção e este bloco some na
          compilação. Nenhuma das duas escreve nada: só pedem à tela que se
          desenhe como se. */}
      {__DEV__ ? (
        <Cartao>
          <Linha
            ic="bolt"
            titulo="Ver planos como pagante"
            sub="Atalho de desenvolvimento — não aparece em produção"
            onPress={() => router.push('/planos?compra=1' as any)}
          />
          <Linha
            ic="bolt"
            titulo="Ver esta tela como assinante"
            sub="Atalho de desenvolvimento — não aparece em produção"
            onPress={() => router.push('/assinatura?assinante=1&compra=1' as any)}
          />
          <Linha
            ic="bolt"
            titulo="Ver como assinante COM clínica"
            sub="Atalho de desenvolvimento — o caso de quem paga sem precisar"
            onPress={() => router.push('/assinatura?assinante=1' as any)}
          />
        </Cartao>
      ) : null}

      {/* ⚠️ A LETRA MIÚDA TAMBÉM É UMA SÓ, e diz a coisa que vale para o
          estado. Para quem é isenta, é a mesma promessa da tela de planos,
          palavra por palavra: ela é um compromisso, não uma frase de tela,
          e se as duas se afastarem uma delas vira a versão errada para
          quem leu a outra.

          Para quem não assinou, é o que a tela inteira tem de mais
          honesto: dizer "você não assinou" sem dizer que NINGUÉM pode
          assinar deixa a pessoa procurando um botão que não existe. Esta
          frase sai no dia em que a cobrança entrar. */}
      <View style={{ backgroundColor: c.bg1, borderRadius: radius.card, padding: 16 }}>
        <Txt v="caption" c={c.tx3} style={{ lineHeight: 20 }}>
          {atual && ehIsenta
            ? `A cobrança é feita pela ${NOME_DA_LOJA}, e é lá que ela se cancela. Cancelando, você continua com o aplicativo inteiro pelo vínculo com a clínica — e se o vínculo terminar um dia, avisamos antes de qualquer cobrança voltar.`
            : atual
            ? `A cobrança é feita pela ${NOME_DA_LOJA}, e é lá que ela se cancela — o aplicativo não consegue fazer isso por você. Cancelar mantém o acesso até o fim do período já pago.`
            : ehIsenta
              ? 'Se o vínculo terminar, avisamos antes de qualquer cobrança. Nada do que você registrou se perde, e o aplicativo não some do seu aparelho de um dia para o outro.'
              : 'A cobrança ainda não está ligada: esta tela existe, a assinatura ainda não. Nada foi cobrado de você, e nada vai ser sem aviso.'}
        </Txt>
      </View>
    </TelaInterna>
  );
}
