import React from 'react';
import { View, Linking } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useStore } from '../logic/store';
import {
  PLANOS, assinaturaAtual, reais, resgatarDesconto, DESCONTO_DE_RETENCAO,
  GESTAO_NA_LOJA, NOME_DA_LOJA,
} from '../logic/assinatura';
import { TelaInterna, Titulao, Cartao, Bloco, Botao, Texto, Opcoes, Opc } from '../ui/internas';
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

   ⚠️ E OS RÓTULOS ENCOLHERAM PARA CABER, o que é o custo desta escolha:
   "Tive problemas no aplicativo" virou "Problemas no aplicativo". Peça
   que quebra em duas linhas desmonta a fila, então rótulo novo aqui se
   mede antes de entrar.

   Os três primeiros são os que têm resposta e os três últimos são os que
   têm campo de texto — a ordem continua valendo, mesmo em fila: quem lê
   encontra a alternativa antes do formulário. */
const MOTIVOS: [Motivo, string][] = [
  ['caro', 'Está caro'],
  ['esqueco', 'Não estou usando'],
  ['terminei', 'Terminei o tratamento'],
  ['problema', 'Problemas no aplicativo'],
  ['faltou', 'Faltou alguma coisa'],
  ['outro', 'Outro motivo'],
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
     Em produção `__DEV__` é falso e some na compilação. */
  const { assinante } = useLocalSearchParams<{ assinante?: string }>();
  const atual = assinaturaAtual(S) ?? (__DEV__ && assinante === '1'
    ? { plano: 'mensal' as const, renovaEm: Date.now() + 20 * 864e5, emTeste: false }
    : null);
  const plano = atual ? PLANOS.find((x) => x.id === atual.plano) : undefined;
  const anual = PLANOS.find((x) => x.id === 'anual')!;

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
      return {
        ic: 'wallet',
        titulo: `${DESCONTO_DE_RETENCAO.porcento}% de desconto no próximo mês`,
        texto: plano.id === 'mensal'
          ? `A próxima cobrança sai por ${reais(comDesconto)} em vez de ${reais(plano.preco)}. E se o mensal for o problema, o anual fica em ${reais(anual.outraUnidade.valor)} por mês.`
          : `O próximo período sai por ${reais(comDesconto)} em vez de ${reais(plano.preco)}.`,
        rotulo: 'Quero o desconto',
        acao: aceitarDesconto,
      };
    }
    if (motivo === 'esqueco') {
      return {
        ic: 'bell',
        titulo: 'Se o problema é esquecer, dá para avisar',
        texto: 'Dose, pesagem, água e proteína têm lembrete, no horário que você escolher. Dá para ligar só o que faz falta e desligar o resto.',
        rotulo: 'Configurar lembretes',
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
        titulo: 'Parabéns por chegar até aqui',
        texto: 'Esperamos que você tenha alcançado o que buscava quando começou. Obrigado por ter feito esse caminho com a gente — e por ter confiado à gente o registro dele.',
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
    motivo === 'problema' ? 'O que aconteceu?'
      : motivo === 'faltou' ? 'O que faltou?'
        : 'Conta pra gente';

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

      {/* `Opcoes` e `Opc` são os da casa, e é por isso que estão aqui: o
          preenchido, o check e o raio já existem em treze telas, e ter um
          segundo jeito de dizer "esta é a sua escolha" é o tipo de
          diferença que ninguém descreve e todo mundo sente. */}
      <Bloco titulo="Por que você está cancelando?">
        <Opcoes>
          {MOTIVOS.map(([id, label]) => (
            <Opc key={id} label={label} on={motivo === id} onPress={() => escolher(id)} />
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
                <Txt v="label" c={c.tx}>O desconto ainda não pode ser aplicado</Txt>
                <Txt v="caption" c={c.tx3} style={{ lineHeight: 19 }}>
                  A cobrança não está ligada nesta versão, então não há o que descontar. Nada
                  mudou na sua assinatura.
                </Txt>
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
            <Txt v="caption" c={c.tx3} style={{ lineHeight: 20 }}>
              Escrever é opcional, e ninguém vai te responder por aqui — isso vira lista de
              conserto, e é assim que a gente decide o que arrumar primeiro.
            </Txt>
            <Texto
              valor={detalhe}
              onChange={escrever}
              placeholder={motivo === 'problema' ? 'Onde travou, o que deu errado…' : 'Pode escrever à vontade'}
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
          <Txt v="micro" c={c.accent} style={{ letterSpacing: 1, marginBottom: 2 }}>FIQUE TRANQUILO</Txt>
          {([
            ['cal', 'O acesso continua até o fim do período já pago.'],
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
