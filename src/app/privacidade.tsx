import React from 'react';
import { View } from 'react-native';
import { useRouter } from 'expo-router';
import { aparelhoDaVez } from '../logic/integracoes';
import { Txt } from '../ui/kit';
import { TelaInterna, Titulao, Bloco, Cartao, Linha, Aviso } from '../ui/internas';
import { useTheme } from '../ui/useTheme';

/* ============================================================
   PRIVACIDADE E DADOS

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

export default function Privacidade() {
  const router = useRouter();
  const go = (p: string) => () => router.push(p as any);

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
      <Bloco
        titulo="O que sai daqui"
        nota="São duas coisas, e as duas só saem com um toque seu."
      >
        <Cartao>
          <Bloquinho titulo="O que você envia para a sua equipe">
            O resumo para o médico sai quando você toca em enviar, e vira
            um documento datado no que a sua equipe tem. As mensagens saem
            quando você escreve. Nada do seu diário viaja sozinho — nem
            peso, nem sintoma, nem refeição.
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

      <Bloco titulo="O que você pode fazer agora">
        <Cartao>
          <Linha ic="doc" titulo="Exportar seus dados"
            sub="Montar um arquivo com o que você registrou" onPress={go('/exportar')} />
          <Linha ic="trend" titulo="Dispositivos e integrações"
            sub={`Ligar ou desligar o ${APP_DE_SAUDE}`} onPress={go('/integracoes')} />
          <Linha ic="doc" titulo="Resumo para o médico"
            sub="Ver exatamente o que a sua equipe recebe" onPress={go('/resumo-medico')} />
        </Cartao>
      </Bloco>

      {/* ⚠️ E O QUE AINDA NÃO EXISTE VAI DITO, em vez de ficar subentendido
          por omissão. Uma tela de privacidade sem política publicada é
          comum; uma que deixa a pessoa achar que leu a política é que não
          pode acontecer. */}
      <Aviso
        ic="info"
        titulo="Isto descreve o aplicativo, não é a política de privacidade"
        texto="Aqui está o que o programa faz com os seus dados. O documento jurídico, com as obrigações de quem opera o serviço, ainda vai ser publicado — e quando existir, aparece nesta tela."
      />

      <View />
    </TelaInterna>
  );
}
