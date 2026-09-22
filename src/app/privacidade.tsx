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
const APP_DE_SAUDE = aparelhoDaVez()?.nome ?? 'aplicativo de saúde do celular';

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
function Apagar({ onApagar }: { onApagar: () => void }) {
  const { c } = useTheme();
  const [armado, setArmado] = React.useState(false);

  if (armado) {
    return (
      <Row gap={12} style={{ alignItems: 'center', paddingHorizontal: 16, paddingVertical: 14 }}>
        <Txt v="caption" c={c.tx2} style={{ flex: 1 }}>
          Apagar tudo? Não há cópia em lugar nenhum.
        </Txt>
        <Pressable onPress={() => setArmado(false)} hitSlop={8} style={({ pressed }) => [{ opacity: pressed ? 0.6 : 1 }]}>
          <Txt v="label" c={c.tx3}>Cancelar</Txt>
        </Pressable>
        <Pressable onPress={onApagar} hitSlop={8} style={({ pressed }) => [{ opacity: pressed ? 0.6 : 1 }]}>
          <Txt v="label" c={c.cta}>Apagar</Txt>
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
          <Txt v="body">Apagar meus dados</Txt>
          <Txt v="caption" c={c.tx2} style={{ marginTop: 2 }}>
            Tudo que você registrou, sem volta
          </Txt>
        </View>
      </Row>
    </Pressable>
  );
}

export default function Privacidade() {
  const router = useRouter();
  const go = (p: string) => () => router.push(p as any);
  const reset = useStore((s) => s.reset);
  const apagarTudo = () => { reset(); router.replace('/cadastro' as any); };

  return (
    <TelaInterna titulo="Privacidade e dados">
      <Titulao
        titulo="Privacidade e dados"
        lead="Onde os seus registros ficam, o que sai daqui e o que o aplicativo lê de fora."
      />

      <Bloco titulo="Onde os seus registros ficam">
        <Cartao>
          <Bloquinho titulo="No aparelho, dentro do aplicativo">
            Peso, medidas, aplicações, check-ins, exames, fotos e anotações
            são gravados no armazenamento do próprio app, neste aparelho.
            Não há conta nem senha aqui: ninguém entra nos seus dados com
            um login, porque não existe login.
          </Bloquinho>
          <Bloquinho titulo="Desinstalar leva tudo junto">
            Como não há cópia em servidor nenhum, apagar o aplicativo apaga
            os registros. Não é possível recuperá-los depois.
          </Bloquinho>
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
      <Bloco
        titulo="O que sai daqui"
        nota="Nada sai daqui sem um gesto seu."
      >
        <Cartao>
          <Bloquinho titulo="O que vai para a sua equipe">
            Por enquanto, nada. O resumo para consulta se monta no seu
            aparelho e é você que mostra ou exporta; as mensagens ficam
            guardadas aqui. Quando a ligação com a clínica existir, as duas
            só vão sair com um toque seu — e nada do seu diário viaja
            sozinho, nem peso, nem sintoma, nem refeição.
          </Bloquinho>
          <Bloquinho titulo="A foto do prato, quando você usa a leitura por foto">
            Ela é reduzida no aparelho e enviada para ser lida por um
            modelo, que devolve os itens do prato. A imagem não fica
            guardada: nem no seu registro da refeição, nem no servidor que
            faz a ponte. Registrar a refeição à mão não envia nada.
          </Bloquinho>
        </Cartao>
      </Bloco>

      <Bloco titulo="O que o aplicativo lê de fora">
        <Cartao>
          <Bloquinho titulo={`${APP_DE_SAUDE}, e só o peso`}>
            Com a sua permissão, o app lê as pesagens que a sua balança, o
            seu relógio ou outro aplicativo escreveram lá. Ele só lê:
            nunca escreve nada no {APP_DE_SAUDE}. E lê só peso — sono,
            passos e batimentos ficam de fora.
          </Bloquinho>
          <Bloquinho titulo="A permissão é sua, e se tira quando quiser">
            Ela é dada nos ajustes do sistema e revogada no mesmo lugar.
            Sem ela, o app continua inteiro: o peso passa a entrar como
            entrou até aqui, digitado por você.
          </Bloquinho>
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
      <Bloco titulo="O que você pode fazer agora">
        <Cartao>
          <Linha ic="doc" titulo="Exportar seus dados"
            sub="Montar um arquivo com o que você registrou" onPress={go('/exportar')} />
          <Linha ic="trend" titulo="Dispositivos e integrações"
            sub={`Ligar ou desligar o ${APP_DE_SAUDE}`} onPress={go('/integracoes')} />
          {/* ⚠️ "O QUE A SUA EQUIPE RECEBE", no presente, e ela não recebe
              nada: a transmissão para a clínica não existe no código (ver
              PENDENCIAS, item 6). Numa tela de privacidade, essa é a frase
              que menos pode estar errada — é justamente onde a pessoa vai
              conferir o que sai daqui. O resumo é o que ela LEVA. */}
          <Linha ic="doc" titulo="Resumo para consulta"
            sub="Ver tudo o que entra no resumo da consulta" onPress={go('/resumo-medico')} />
          <Apagar onApagar={apagarTudo} />
        </Cartao>
      </Bloco>

      {/* ESTA TELA É O RESUMO; OS DOCUMENTOS SÃO O INTEIRO. Ela descreve
          o comportamento do programa em linguagem de quem usa; eles
          descrevem as obrigações de quem opera o serviço. As duas coisas
          precisam existir, e uma não substitui a outra — por isso o
          caminho para eles fica aqui embaixo, e não no lugar disto. */}
      {temIdentificacao() ? (
        <Bloco titulo="Os documentos">
          <Cartao>
            <Linha ic="doc" titulo={PRIVACIDADE().titulo}
              sub="O documento completo, com base legal e prazos" onPress={go('/documento?id=privacidade')} />
            <Linha ic="doc" titulo={TERMOS().titulo}
              sub="O que o Morphi é, o que não é, e o que cada lado pode esperar" onPress={go('/documento?id=termos')} />
          </Cartao>
        </Bloco>
      ) : (
        /* ⚠️ E O QUE AINDA NÃO EXISTE VAI DITO, em vez de ficar
           subentendido por omissão. Uma tela de privacidade sem política
           publicada é comum; uma que deixa a pessoa achar que leu a
           política é que não pode acontecer. */
        <Aviso
          ic="info"
          titulo="Isto descreve o aplicativo, não é a política de privacidade"
          texto="Aqui está o que o programa faz com os seus dados. O documento jurídico, com as obrigações de quem opera o serviço, ainda vai ser publicado — e quando existir, aparece nesta tela."
        />
      )}

      <View />
    </TelaInterna>
  );
}
