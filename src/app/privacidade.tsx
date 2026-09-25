import React from 'react';
import { View, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { useStore } from '../logic/store';
import { aparelhoDaVez } from '../logic/integracoes';
import { temIdentificacao, TERMOS, PRIVACIDADE } from '../logic/documentos';
import { Txt, Row } from '../ui/kit';
import { TelaInterna, Titulao, Bloco, Cartao, Linha, Aviso } from '../ui/internas';
import { Icon } from '../ui/Icon';
import { useTheme } from '../ui/useTheme';
import { apagarConta } from '../logic/conta';
import { tirarDiarioDoTelefone } from '../ui/conta';
import { T } from '../textos';

/* ⚠️ É FUNÇÃO, e não constante de módulo: ela lê o catálogo, e constante
   de módulo congela o idioma no import. */
const K = () => T.aviso.telaPrivacidade;

/* ============================================================
   PRIVACIDADE E DADOS

   ⚠️⚠️ O SUPABASE VAI DERRUBAR METADE DISTO. ⚠️⚠️

   O aplicativo vai passar a ter conta, autenticação e banco. Hoje não
   tem, e por isso o que está escrito aqui é verdade: um app sem
   servidor, sem login e sem cópia. No dia em que o Supabase entrar,
   cada frase sobre "fica no seu aparelho" vira declaração falsa numa
   política de privacidade — que é o pior lugar possível para uma.

   Não reescreva antes: descrever tratamento que ainda não acontece é o
   erro simétrico. A lista frase por frase está em PENDENCIAS.md, item 10
   — junto com a região já escolhida, São Paulo (sa-east-1), que mantém o
   histórico de saúde no Brasil e poupa a seção de transferência
   internacional.

   ⚠️ O APP JÁ TEVE UMA LINHA SOBRE ISSO E ELA FOI REMOVIDA, com razão:
   dizia "seus dados ficam no seu aparelho" no meio de uma lista de
   configurações, e vendia enclausuramento como vantagem num aplicativo
   cujo ponto é o contrário — há uma equipe do outro lado, e o valor de
   registrar sintoma é que ele chegue a quem acompanha.

   O erro não era a frase ser falsa. Era ela ser MEIA: uma linha de lista
   não tem espaço para dizer o que sai, quando sai e por quê, então ela
   dizia a metade tranquilizadora e calava o resto.

   Esta tela é a outra metade. Ela existe para responder, sem eufemismo,
   três perguntas: onde ficam os meus registros, o que sai daqui, e o que
   o aplicativo lê de fora. Cada resposta é uma regra que está escrita no
   código — store.ts, resumo.ts, saude-do-aparelho.ts, analise.ts.

   O QUE ELA NÃO É. Não é política de privacidade: documento jurídico
   descreve obrigações de uma empresa, e ainda não há um. Esta tela
   descreve o comportamento do programa. Quando a política existir, ela
   entra aqui embaixo como documento, e não no lugar disto.
   ============================================================ */

/* O NOME DO DEPÓSITO MUDA COM O APARELHO, e citar o errado faria a
   pessoa procurar nos ajustes uma coisa que não existe ali. Quem sabe
   qual é o desta vez é o catálogo de integrações — a mesma fonte que a
   tela de Integrações lê, para as duas não discordarem no nome. */
/* ⚠️ É FUNÇÃO, e era constante de módulo. Ela tem um recuo escrito —
   "aplicativo de saúde do celular" — e constante de módulo é lida uma vez
   no import: o recuo ficava em português nos cinco idiomas, e o nome do
   depósito congelava no primeiro aparelho que o aplicativo viu. */
const appDeSaude = () => aparelhoDaVez()?.nome ?? K().appDeSaudePadrao;

function Bloquinho({ titulo, children }: { titulo: string; children: React.ReactNode }) {
  const { c } = useTheme();
  return (
    <View style={{ paddingHorizontal: 16, paddingVertical: 14, gap: 6 }}>
      <Txt v="bodyMed">{titulo}</Txt>
      <Txt v="caption" c={c.tx2} style={{ lineHeight: 21 }}>{children}</Txt>
    </View>
  );
}

/** Apagar tudo — a linha que se arma antes de agir.

    Duas perguntas, e não uma. A primeira é o toque na linha; a segunda é
    a frase que diz o que vai embora e que não há cópia em lugar nenhum.
    "Tem certeza?" é a pergunta que não informa nada, e é exatamente a que
    as pessoas respondem "sim" no automático.

    O desarmado não usa vermelho: a cor de erro deste app significa coisa
    clínica — sintoma grave, exame fora da faixa. Ele aparece no "Apagar"
    da confirmação, que é onde de fato há perigo.

    MUDOU DE TELA. Estava no perfil, ao lado de tema e ajuda; agora mora
    aqui, junto da explicação do que some — que é a informação que a
    segunda pergunta precisa ter por trás. */
function Apagar({ comConta, onApagar }: {
  comConta: boolean;
  /** devolve a frase do que deu errado, ou nulo se apagou */
  onApagar: () => Promise<string | null>;
}) {
  const { c } = useTheme();
  const [armado, setArmado] = React.useState(false);
  const [apagando, setApagando] = React.useState(false);
  const [erro, setErro] = React.useState<string | null>(null);
  const C = T.conta.apagarConta;

  if (apagando) {
    return (
      <Row gap={12} style={{ paddingHorizontal: 16, paddingVertical: 14 }}>
        <Txt v="caption" c={c.tx2}>{C.apagando}</Txt>
      </Row>
    );
  }

  if (armado) {
    return (
      <Row gap={12} style={{ alignItems: 'center', paddingHorizontal: 16, paddingVertical: 14 }}>
        <Txt v="caption" c={c.tx2} style={{ flex: 1 }}>{comConta ? C.pergunta : K().apagarPergunta}</Txt>
        <Pressable onPress={() => setArmado(false)} hitSlop={8} style={({ pressed }) => [{ opacity: pressed ? 0.6 : 1 }]}>
          <Txt v="label" c={c.tx3}>{K().cancelar}</Txt>
        </Pressable>
        <Pressable
          onPress={async () => {
            setApagando(true);
            const falha = await onApagar();
            setApagando(false);
            setArmado(false);
            setErro(falha);
          }}
          hitSlop={8}
          style={({ pressed }) => [{ opacity: pressed ? 0.6 : 1 }]}
        >
          <Txt v="label" c={c.cta}>{K().apagarConfirma}</Txt>
        </Pressable>
      </Row>
    );
  }

  return (
    <Pressable onPress={() => setArmado(true)} style={({ pressed }) => [{ opacity: pressed ? 0.6 : 1 }]}>
      <Row gap={12} style={{ paddingHorizontal: 16, paddingVertical: 14 }}>
        <View style={{ width: 34, alignItems: 'center', justifyContent: 'center' }}>
          <Icon name="trash" size={20} color={c.accent} sw={1.9} />
        </View>
        <View style={{ flex: 1 }}>
          <Txt v="body">{K().apagar}</Txt>
          <Txt v="caption" c={erro ? c.cta : c.tx2} style={{ marginTop: 2 }}>{erro ?? (comConta ? C.sub : K().apagarSub)}</Txt>
        </View>
      </Row>
    </Pressable>
  );
}

export default function Privacidade() {
  const router = useRouter();
  const go = (p: string) => () => router.push(p as any);
  const reset = useStore((s) => s.reset);
  const conta = useStore((s) => (s.S as any).conta);
  /* ⚠️ SEM DONO (a semente, ou o diário que ainda não tem conta), apagar
     é local, sem rede e sem função, como sempre foi.

     ⚠️ COM DONO, APAGA NO SERVIDOR, e o aparelho só é limpo DEPOIS de a
     função responder que apagou: se ela falhar, nada muda, e a linha diz
     por quê. Precisa de conexão. A cascata do banco leva o perfil, os
     registros, as perguntas e o resto que é da pessoa (ver
     supabase/functions/apagar-conta). */
  const apagarTudo = async (): Promise<string | null> => {
    if (!conta) {
      reset();
      router.replace('/cadastro' as any);
      return null;
    }
    const r = await apagarConta();
    if (!r.ok) return r.erro === 'sem-internet' ? T.conta.apagarConta.semInternet : T.conta.apagarConta.falhou;
    await tirarDiarioDoTelefone();
    router.replace('/cadastro' as any);
    return null;
  };

  return (
    <TelaInterna titulo={K().titulo}>
      <Titulao titulo={K().titulo} lead={K().lead} />

      <Bloco titulo={K().ondeFicam}>
        <Cartao>
          <Bloquinho titulo={K().noAparelho}>{K().noAparelhoTexto}</Bloquinho>
          <Bloquinho titulo={K().desinstalar}>{K().desinstalarTexto}</Bloquinho>
        </Cartao>
      </Bloco>

      {/* A SEÇÃO MAIS IMPORTANTE DA TELA, e a que um app costuma
          esconder. Ela lista TUDO que atravessa para fora do aparelho —
          são duas coisas —, e diz o gesto exato que faz cada uma sair. */}
      {/* ⚠️⚠️ O PRIMEIRO BLOQUINHO DESCREVIA UM ENVIO QUE NÃO ACONTECE.

          Ele dizia, no presente, que o resumo "sai quando você toca em
          enviar e vira um documento datado no que a sua equipe tem" e que
          as mensagens "saem quando você escreve". Não saem: o aplicativo
          inteiro tem UMA chamada de rede, a da leitura da foto do prato em
          analise.ts, e nenhuma para clínica nenhuma. O resumo se monta no
          aparelho e as mensagens ficam guardadas aqui.

          Numa tela de privacidade essa é a frase que menos pode estar
          errada — é onde a pessoa vai conferir o que sai do aparelho
          dela. O erro é para o lado seguro (promete mais saída do que
          existe), e mesmo assim é erro: quem acredita pode deixar de
          registrar um sintoma por achar que ele já foi para alguém.

          E repare no vizinho de baixo: a foto do prato é verdade, e está
          escrita com a mesma confiança. Uma tela com uma afirmação
          verdadeira e uma falsa lado a lado não tem como a pessoa
          distinguir qual é qual.

          A garantia que a seção existe para dar continua inteira, e agora
          é mais forte do que era: nada viaja sozinho porque, para a
          clínica, nada viaja. Ver PENDENCIAS, item 6. */}
      <Bloco titulo={K().oQueSai} nota={K().oQueSaiNota}>
        <Cartao>
          <Bloquinho titulo={K().paraEquipe}>{K().paraEquipeTexto}</Bloquinho>
          <Bloquinho titulo={K().fotoDoPrato}>{K().fotoDoPratoTexto}</Bloquinho>
        </Cartao>
      </Bloco>

      <Bloco titulo={K().leDeFora}>
        <Cartao>
          {/* ⚠️ DIZIA "o app lê as pesagens... Ele só lê". Duas vezes o
              aplicativo falando de si em terceira pessoa, numa tela cuja
              pergunta é justamente quem faz o quê. Quem lê somos nós. */}
          <Bloquinho titulo={K().soOPeso(appDeSaude())}>{K().soOPesoTexto(appDeSaude())}</Bloquinho>
          <Bloquinho titulo={K().permissao}>{K().permissaoTexto}</Bloquinho>
        </Cartao>
      </Bloco>

      {/* ⚠️ AS CINCO PORTAS DOS DADOS MORAM AQUI, e não espalhadas pelo
          perfil. Exportar, apagar e os dois documentos estavam listados
          lá fora, ao lado de tema e ajuda — cinco linhas de um assunto só,
          longe da tela que explica esse assunto.

          Quem abre "Privacidade e dados" quer saber o que acontece com os
          seus dados E poder agir sobre eles. Ler a explicação e ter de
          voltar para achar o botão é a tela dizendo o que fazer sem
          deixar fazer. */}
      <Bloco titulo={K().podeFazer}>
        <Cartao>
          <Linha ic="doc" titulo={T.ajuda.exportar}
            sub={T.ajuda.exportarSub} onPress={go('/exportar')} />
          <Linha ic="trend" titulo={T.perfil.dispositivos}
            sub={K().integracoesSub(appDeSaude())} onPress={go('/integracoes')} />
          {/* ⚠️ "O QUE A SUA EQUIPE RECEBE", no presente, e ela não recebe
              nada: a transmissão para a clínica não existe no código (ver
              PENDENCIAS, item 6). Numa tela de privacidade, essa é a frase
              que menos pode estar errada — é justamente onde a pessoa vai
              conferir o que sai daqui. O resumo é o que ela LEVA. */}
          <Linha ic="doc" titulo={K().resumo}
            sub={K().resumoSub} onPress={go('/resumo-medico')} />
          <Apagar comConta={!!conta} onApagar={apagarTudo} />
        </Cartao>
      </Bloco>

      {/* ESTA TELA É O RESUMO; OS DOCUMENTOS SÃO O INTEIRO. Ela descreve
          o comportamento do programa em linguagem de quem usa; eles
          descrevem as obrigações de quem opera o serviço. As duas coisas
          precisam existir, e uma não substitui a outra — por isso o
          caminho para eles fica aqui embaixo, e não no lugar disto. */}
      {temIdentificacao() ? (
        <Bloco titulo={K().documentos}>
          <Cartao>
            <Linha ic="doc" titulo={PRIVACIDADE().titulo}
              sub={K().politicaSub} onPress={go('/documento?id=privacidade')} />
            {/* ⚠️ "O QUE O MORPHI É" VIROU "O QUE SOMOS": o nome do produto
                serve de rótulo, mas não pode ter verbo pendurado nele. */}
            <Linha ic="doc" titulo={TERMOS().titulo}
              sub={K().termosSub} onPress={go('/documento?id=termos')} />
          </Cartao>
        </Bloco>
      ) : (
        /* ⚠️ E O QUE AINDA NÃO EXISTE VAI DITO, em vez de ficar
           subentendido por omissão. Uma tela de privacidade sem política
           publicada é comum; uma que deixa a pessoa achar que leu a
           política é que não pode acontecer. */
        <Aviso ic="info" titulo={K().semPoliticaTitulo} texto={K().semPoliticaTexto} />
      )}

      <View />
    </TelaInterna>
  );
}
