import React from 'react';
import { View, Linking } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useStore } from '../logic/store';
import {
  PLANOS, assinaturaAtual, preco, resgatarDesconto, DESCONTO_DE_RETENCAO,
  GESTAO_NA_LOJA, NOME_DA_LOJA,
} from '../logic/assinatura';
import { TelaInterna, Titulao, Cartao, Bloco, Botao, Texto, Opcoes, Opc } from '../ui/internas';
import { dataComAno } from '../logic/time';
import { T } from '../textos';

/* ⚠️ É FUNÇÃO, porque lê o catálogo e MOTIVOS é constante de módulo. */
const K = () => T.assinatura.saida;
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

   ⚠️ E AS RESPOSTAS SÃO CONDICIONAIS, PORQUE SENÃO VIRAM MENTIRA. O
   desconto só aparece para quem tem assinatura para descontar; a conta do
   anual, só para quem está no mensal. Uma alternativa que não se aplica
   ao caso é publicidade travestida de ajuda, e custa mais caro do que não
   oferecer nada.

   ⚠️ "ME TRATO NUMA CLÍNICA PARCEIRA" NÃO ESTÁ NA LISTA, e saiu de
   propósito: não é motivo para cancelar, é motivo para não estar pagando.
   Quem tem código resolve isso em /assinatura, na linha "Inserir código",
   e sai de lá sem assinatura nenhuma. Oferecer isso aqui era transformar
   uma correção de cobrança num motivo de saída.

   ⚠️ O MOTIVO FICA GUARDADO E NÃO VAI A LUGAR NENHUM — ainda. Não há
   servidor para receber, nem o motivo nem o texto que a pessoa escrever.
   Os dois são gravados no perfil com a data, para serem enviados quando o
   Supabase entrar, e é só isso que se pode prometer hoje. A tela NÃO diz
   "vamos responder", porque não há para onde responder. Ver
   PENDENCIAS.md, item 5.

   ⚠️ E O APLICATIVO NÃO CANCELA NADA AQUI. Quem cobra é a loja e é lá que
   se cancela — esta tela conversa e abre a porta.
   ============================================================ */

type Motivo = 'caro' | 'esqueco' | 'terminei' | 'problema' | 'faltou' | 'outro';

/* ⚠️ OS MOTIVOS SÃO PEÇAS LADO A LADO, e não uma lista empilhada.

   Empilhados, os seis ocupavam a tela inteira: escolher um empurrava a
   resposta para baixo da dobra, e a pessoa tocava sem ver que tinha
   acontecido alguma coisa. Numa tela que oferece alternativa, a
   alternativa precisa aparecer no mesmo gesto — senão ela não existe.

   ⚠️⚠️ E TODO MOTIVO TEM ÍCONE PARA QUE A FILA NÃO SE MEXA. ⚠️⚠️

   Sem ícone, `Opc` põe um check ao marcar — e um check é largura: a peça
   escolhida crescia uns vinte pixels e empurrava a vizinha para a linha
   de baixo. Tocar em "Terminei o tratamento" fazia "Problemas no
   aplicativo" pular sozinho, e a tela inteira parecia ter se
   reorganizado por causa de um toque.

   Com ícone, o check não entra: a largura é a mesma marcada ou não, e a
   fila fica onde está. A cor cheia já diz qual está escolhida — é a mesma
   regra que a <Grade> usa, e pelo mesmo motivo.

   ⚠️⚠️ E OS RÓTULOS SÃO MEDIDOS, NÃO ESCOLHIDOS. ⚠️⚠️

   Com 335 px de linha e 8 de vão, cada fileira comporta 327 px de peça.
   As seis fecham em TRÊS fileiras, e fecham por pouco:

       Está caro 119 + Não estou usando 178 = 297
       Já terminei 132 + Faltou algo 131    = 263
       Deu problema 153 + Outro motivo 147  = 300

   Foi isso que encurtou "Terminei o tratamento" para "Já terminei" e
   "Problemas no aplicativo" para "Deu problema": nos rótulos longos as
   mesmas seis peças pediam quatro fileiras, e a fileira a mais empurrava
   o cartão de resposta para fora da dobra — que é o defeito que esta fila
   veio consertar. Uma palavra a mais aqui custa uma fileira inteira.

   As duas frases perderam o complemento e não perderam o sentido, porque
   a pergunta acima já o dá: sob "por que você está cancelando?", "já
   terminei" é o tratamento e "deu problema" é o que ela vai descrever no
   campo que abre.

   ⚠️ E A ORDEM NÃO É SOLTA: os três primeiros têm resposta, os três
   últimos têm campo de texto, e "Outro motivo" é sempre o último. Quem lê
   encontra a alternativa antes do formulário, e a saída genérica depois
   de todas as específicas — senão ela vira a resposta de quem não quis
   procurar a sua. */
/* ⚠️ É FUNÇÃO, porque lê o catálogo. Ver scripts/idioma-congelado.mjs. */
const MOTIVOS = (): [Motivo, string, string][] => [
  ['caro', 'wallet', K().motivoCaro],
  ['esqueco', 'moon', K().motivoEsqueco],
  ['terminei', 'journey', K().motivoTerminei],
  ['faltou', 'bulb', K().motivoFaltou],
  ['problema', 'alerta', K().motivoProblema],
  ['outro', 'more', K().motivoOutro],
];

export default function Cancelar() {
  const S = useStore((s) => s.S);
  const update = useStore((s) => s.update);
  const router = useRouter();
  const { c } = useTheme();

  const [motivo, setMotivo] = React.useState<Motivo | null>(null);
  const [detalhe, setDetalhe] = React.useState('');
  const [recusa, setRecusa] = React.useState(false);

  /* ⚠️ PORTA DE DESENVOLVIMENTO — o mesmo `?assinante=1` de /assinatura,
     pelo mesmo motivo: sem assinatura não há plano, e sem plano as duas
     respostas condicionais desta tela nunca aparecem para ser conferidas.
     `?assinante=anual` finge o outro plano, que é o que tem a resposta
     mais diferente — a do ano já pago. Em produção `__DEV__` é falso e o
     bloco some na compilação. */
  const { assinante } = useLocalSearchParams<{ assinante?: string }>();
  const atual = assinaturaAtual(S) ?? (__DEV__ && (assinante === '1' || assinante === 'anual')
    ? assinante === 'anual'
      ? { plano: 'anual' as const, renovaEm: Date.now() + 250 * 864e5, emTeste: false }
      : { plano: 'mensal' as const, renovaEm: Date.now() + 20 * 864e5, emTeste: false }
    : null);
  const plano = atual ? PLANOS().find((x) => x.id === atual.plano) : undefined;
  const anual = PLANOS().find((x) => x.id === 'anual')!;

  /* A resposta é gravada no toque, e não num botão de enviar: quem
     responde e fecha a tela pelo gesto de voltar também respondeu. */
  const gravar = (m: Motivo, d: string) => {
    update((st: any) => { st.profile.cancelamento = { motivo: m, detalhe: d.trim(), t: Date.now() }; });
  };
  const escolher = (m: Motivo) => {
    setMotivo(m);
    setRecusa(false);
    gravar(m, detalhe);
  };
  const escrever = (v: string) => {
    setDetalhe(v);
    if (motivo) gravar(motivo, v);
  };

  const irParaLoja = () => Linking.openURL(GESTAO_NA_LOJA);

  const aceitarDesconto = async () => {
    const r = await resgatarDesconto();
    if (!r.ok) setRecusa(true);
  };

  /* ---- a resposta, quando há uma ---- */
  const resposta = (() => {
    if (motivo === 'caro' && plano) {
      const comDesconto = plano.preco * (1 - DESCONTO_DE_RETENCAO.porcento / 100);

      /* ⚠️ NO ANUAL, O DESCONTO NÃO É A NOTÍCIA — A DATA É.

         Quem paga por ano e diz que está caro não tem cobrança chegando:
         ela já pagou, e a próxima é daqui a meses. Oferecer "desconto na
         próxima cobrança" a essa pessoa é responder uma pergunta que ela
         não fez, e ainda por cima com um alívio que só chega no ano que
         vem.

         O que muda a decisão dela é o que ninguém disse ainda: o ano está
         pago, cancelar agora NÃO devolve o dinheiro, e o aplicativo
         continua até a data. Quem descobre isso costuma adiar a decisão em
         vez de cancelar — e adiar aqui é honesto, porque é a informação
         que estava faltando, não uma barreira.

         ⚠️ E O REEMBOLSO É DITO, mesmo custando. A pessoa que quer o
         dinheiro de volta vai procurar de qualquer jeito; ficar calado só
         garante que ela procure irritada, e no lugar errado. Quem devolve
         é a loja, e é lá que se pede.

         O desconto continua oferecido — na renovação, com esse nome. */
      if (plano.id === 'anual') {
        return {
          ic: 'wallet',
          titulo: K().anoPagoTitulo,
          texto: [
            atual?.renovaEm
              ? K().anoPagoComData(dataComAno(atual.renovaEm))
              : K().anoPagoSemData,
            K().anoPagoReembolso(NOME_DA_LOJA, preco(comDesconto), preco(plano.preco)),
          ].join(' '),
          rotulo: K().querDescontoRenovacao,
          acao: aceitarDesconto,
        };
      }

      return {
        ic: 'wallet',
        titulo: K().descontoTitulo(DESCONTO_DE_RETENCAO.porcento),
        texto: K().descontoTexto(preco(comDesconto), preco(plano.preco), preco(anual.outraUnidade.valor)),
        rotulo: K().querDesconto,
        acao: aceitarDesconto,
      };
    }
    if (motivo === 'esqueco') {
      return {
        ic: 'bell',
        titulo: K().lembretesTitulo,
        texto: K().lembretesTexto,
        rotulo: K().configurarLembretes,
        acao: () => router.push('/lembretes' as any),
      };
    }
    if (motivo === 'terminei') {
      /* ⚠️ AQUI A TELA PARA DE VENDER E DÁ PARABÉNS.

         É o único motivo da lista em que sair é o desfecho certo: a
         pessoa terminou o que veio fazer. Oferecer desconto a quem
         concluiu o tratamento é não ter lido a resposta que ela acabou de
         dar — e é o momento em que uma tela de retenção fica indecente.

         ⚠️ E O PARABÉNS É CONDICIONAL, de propósito. "Esperamos que você
         tenha alcançado" e não "você conseguiu": nem todo tratamento que
         termina termina bem, e este aplicativo não tem como saber qual
         dos dois foi. Afirmar a vitória para quem parou por efeito
         colateral, por custo ou por desistência é a frase mais cruel que
         a tela poderia ter. */
      return {
        ic: 'journey',
        titulo: K().parabensTitulo,
        texto: K().parabensTexto,
        rotulo: null,
        acao: null,
      };
    }
    return null;
  })();

  /* Os motivos sem resposta ganham a palavra. É a troca justa: a gente não
     tem nada a oferecer, então ouve. */
  const pedeTexto = motivo === 'problema' || motivo === 'faltou' || motivo === 'outro';

  const rotuloDoCampo =
    motivo === 'problema' ? K().campoProblema
      : motivo === 'faltou' ? K().campoFaltou
        : K().campoOutro;

  return (
    <TelaInterna
      titulo={K().titulo}
      rodape={
        /* ⚠️ SEMPRE LIGADO, SEMPRE AQUI, E CHEIO. Não espera resposta, não
           muda de rótulo, não fica cinza: é a razão de a pessoa ter aberto
           a tela, e o peso visual segue a intenção dela. */
        <Botao label={K().continuarParaLoja(NOME_DA_LOJA)} onPress={irParaLoja} pilula />
      }
    >
      <Titulao
        titulo={K().perguntaTitulo}
        lead={K().perguntaLead}
      />

      {/* `Opcoes` e `Opc` são os da casa, e é por isso que estão aqui: o
          preenchido, o check e o raio já existem em treze telas, e ter um
          segundo jeito de dizer "esta é a sua escolha" é o tipo de
          diferença que ninguém descreve e todo mundo sente. */}
      <Bloco titulo={K().porQue}>
        <Opcoes>
          {MOTIVOS().map(([id, ic, label]) => (
            <Opc key={id} ic={ic} label={label} on={motivo === id} onPress={() => escolher(id)} />
          ))}
        </Opcoes>
      </Bloco>

      {resposta ? (
        <Cartao>
          <View style={{ padding: 18, gap: 10 }}>
            <Row gap={10} style={{ alignItems: 'center' }}>
              {/* ⚠️ AZUL, E NÃO LIMA. O lima aqui é a cor do alcançado —
                  a meta batida, o check-in feito —, e nada nestes cartões
                  foi alcançado: são propostas. Usada onde não houve
                  conquista, ela vira decoração e deixa de significar
                  alguma coisa nas telas onde significa. */}
              <Icon name={resposta.ic} size={19} color={c.accent} sw={1.9} />
              <Txt v="bodyMed" c={c.tx} style={{ flex: 1 }}>{resposta.titulo}</Txt>
            </Row>
            <Txt v="caption" c={c.tx3} style={{ lineHeight: 20 }}>{resposta.texto}</Txt>

            {/* ⚠️ A RECUSA HONESTA, igual à da tela de planos: enquanto a
                loja não está ligada, nenhum desconto pode ser concedido, e
                o botão diz isso em vez de fingir que deu certo.

                Uma pessoa que aceitou desconto para NÃO cancelar e é
                cobrada inteira no mês seguinte é a pior versão desta tela
                que dá para imaginar. */}
            {recusa ? (
              <View style={{ backgroundColor: c.bg2, borderRadius: radius.md, padding: 14, gap: 4 }}>
                <Txt v="label" c={c.tx}>{K().recusaTitulo}</Txt>
                <Txt v="caption" c={c.tx3} style={{ lineHeight: 19 }}>{K().recusaTexto}</Txt>
              </View>
            ) : resposta.rotulo && resposta.acao ? (
              /* Fantasma, e não cheio: a alternativa não pode pesar mais do
                 que a saída. Ver o segundo aviso do cabeçalho. */
              <View style={{ marginTop: 2 }}>
                <Botao label={resposta.rotulo} onPress={resposta.acao} tom="fantasma" />
              </View>
            ) : null}
          </View>
        </Cartao>
      ) : pedeTexto ? (
        <Cartao>
          <View style={{ padding: 18, gap: 10 }}>
            <Row gap={10} style={{ alignItems: 'center' }}>
              <Icon name="companion" size={19} color={c.accent} sw={1.9} />
              <Txt v="bodyMed" c={c.tx} style={{ flex: 1 }}>{rotuloDoCampo}</Txt>
            </Row>
            {/* ⚠️ E A FRASE NÃO PROMETE RESPOSTA. Não há para onde esse
                texto ir ainda, e mesmo depois não haverá caixa de entrada
                ligada a ele. "Vamos te responder" seria a promessa mais
                fácil e mais cara desta tela. */}
            <Txt v="caption" c={c.tx3} style={{ lineHeight: 20 }}>{K().campoAviso}</Txt>
            <Texto
              valor={detalhe}
              onChange={escrever}
              placeholder={motivo === 'problema' ? K().campoDicaProblema : K().campoDicaOutro}
              linhas={3}
            />
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
          {/* ⚠️ O TÍTULO É O RESUMO DOS TRÊS, e não um rótulo de seção. As
              três linhas respondem a mesma pergunta — "o que eu perco?" —,
              e quem está com o dedo no botão de cancelar lê a primeira
              palavra antes de ler o resto. Se ela for "FIQUE TRANQUILO", o
              resto vira confirmação em vez de descoberta. */}
          <Txt v="micro" c={c.accent} style={{ letterSpacing: 1, marginBottom: 2 }}>{K().tranquiloTitulo}</Txt>
          {([
            ['cal', K().tranquiloAcesso],
            ['shield', K().tranquiloDados],
            ['send', K().tranquiloLoja(NOME_DA_LOJA)],
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
