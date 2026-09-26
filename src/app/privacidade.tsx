import React from 'react';
import { View, Pressable, Switch } from 'react-native';
import { useRouter } from 'expo-router';
import { useStore } from '../logic/store';
import { aparelhoDaVez } from '../logic/integracoes';
import { temIdentificacao, TERMOS, PRIVACIDADE, DIAS_DAS_COPIAS_DE_SEGURANCA } from '../logic/documentos';
import { contaLigada } from '../logic/nuvem';
import { LEITURA_DAS_PERGUNTAS } from '../logic/consentimento';
import { Txt, Row } from '../ui/kit';
import { TelaInterna, Titulao, Bloco, Cartao, Linha, Aviso } from '../ui/internas';
import { Icon } from '../ui/Icon';
import { useTheme } from '../ui/useTheme';
import { apagarConta, useEstadoDaSincronia } from '../logic/conta';
import { clinicaConectada } from '../logic/derive';
import { tirarDiarioDoTelefone, fraseDoEstado } from '../ui/conta';
import { radius } from '../theme';
import { T } from '../textos';

/* ⚠️ É FUNÇÃO, e não constante de módulo: ela lê o catálogo, e constante
   de módulo congela o idioma no import. */
const K = () => T.aviso.telaPrivacidade;

/* ============================================================
   PRIVACIDADE E DADOS

   ⚠️⚠️ A VERSÃO 2 DESCREVE A CONTA (fase 8 do plano do Supabase). ⚠️⚠️

   A primeira descrevia um app sem servidor, sem login e sem cópia, e era
   verdade até a nuvem ser ligada para todos. Esta diz o que existe: o
   diário no aparelho e na conta, o que a clínica conectada vê e o ditado
   (PENDENCIAS, item 14). A escolha das perguntas mora aqui também, mas
   está parada com a leitura desligada (`LEITURA_DAS_PERGUNTAS`, em
   logic/consentimento): as perguntas ficam no aparelho.

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
const maiuscula = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

/* ============================================================
   ⚠️ ELA ERA UMA LISTA DE PERGUNTAS E RESPOSTAS (pedido do dono,
   26/09/2026: "tá quase parecendo uma FAQ"). Blocos de título com um
   parágrafo embaixo, um atrás do outro — a informação certa, no formato
   de quem vai ler tudo, e ninguém lê tudo.

   Agora a tela responde primeiro o que a pessoa veio saber, em uma
   linha cada: o estado do diário no alto, e cada saída com o seu nome e
   quando ela acontece. O parágrafo continua lá, e abre no toque — quem
   quer o porquê encontra, e quem só queria conferir não precisa ler.
   ============================================================ */

/** O estado do diário, no alto: guardado na conta, ou só neste aparelho. */
function CartaoDoEstado() {
  const { c } = useTheme();
  const conta = useStore((s) => (s.S as any).conta);
  const estado = useEstadoDaSincronia();
  const temConta = !!conta && contaLigada();
  /* a frase da sincronia só aparece quando ela diz alguma coisa além de
     "guardado" — esperando conexão, entre de novo, a conta apagada */
  const recado = temConta && estado !== 'guardado' ? fraseDoEstado(estado) : null;
  return (
    <Row gap={14} style={{
      alignItems: 'flex-start', backgroundColor: c.accentWeak, borderRadius: radius.lg,
      paddingHorizontal: 16, paddingVertical: 16,
    }}>
      <View style={{
        width: 40, height: 40, borderRadius: 20, backgroundColor: c.bg1,
        alignItems: 'center', justifyContent: 'center',
      }}>
        <Icon name="lock" size={19} color={c.accent} sw={1.9} />
      </View>
      <View style={{ flex: 1, gap: 4 }}>
        <Txt v="bodyMed">{temConta ? K().statusGuardadoTitulo : K().statusAquiTitulo}</Txt>
        <Txt v="caption" c={c.tx2} style={{ lineHeight: 20 }}>
          {temConta ? K().statusGuardadoTexto : K().statusAquiTexto}
        </Txt>
        {recado ? <Txt v="caption" c={c.tx3} style={{ marginTop: 2 }}>{recado}</Txt> : null}
      </View>
    </Row>
  );
}

/** Uma saída (ou uma entrada): o nome, quando acontece, e o porquê, que
    abre no toque. */
function LinhaQueAbre({ ic, titulo, resumo, texto }: {
  ic: string; titulo: string; resumo: string; texto: string;
}) {
  const { c } = useTheme();
  const [aberta, setAberta] = React.useState(false);
  return (
    <Pressable onPress={() => setAberta((a) => !a)} style={({ pressed }) => [{ opacity: pressed ? 0.75 : 1 }]}>
      <View style={{ paddingHorizontal: 16, paddingVertical: 13 }}>
        <Row gap={12} style={{ alignItems: 'center' }}>
          <View style={{
            width: 34, height: 34, borderRadius: 17, backgroundColor: c.bg3,
            alignItems: 'center', justifyContent: 'center',
          }}>
            <Icon name={ic} size={16} color={c.accent} sw={1.9} />
          </View>
          <View style={{ flex: 1 }}>
            <Txt v="bodyMed">{titulo}</Txt>
            <Txt v="caption" c={c.tx3} style={{ marginTop: 1 }}>{resumo}</Txt>
          </View>
          <Icon name={aberta ? 'chevup' : 'chevdown'} size={14} color={c.tx4} sw={2} />
        </Row>
        {aberta ? (
          <Txt v="caption" c={c.tx2} style={{ lineHeight: 21, marginTop: 10, marginLeft: 46 }}>{texto}</Txt>
        ) : null}
      </View>
    </Pressable>
  );
}

/** O interruptor da leitura das perguntas (a decisão 2 do plano). */
function EscolhaDasPerguntas() {
  const { c } = useTheme();
  const ligada = useStore((s) => (s.S as any).perguntasParaUso === true);
  const update = useStore((s) => s.update);
  return (
    <Row gap={12} style={{ alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12 }}>
      <Txt v="label" style={{ flex: 1 }}>{T.aviso.perguntasEscolha}</Txt>
      <Switch
        value={ligada}
        onValueChange={(v) => update((s: any) => { s.perguntasParaUso = v; })}
        trackColor={{ false: c.track, true: c.accent }}
        thumbColor="#fff"
      />
    </Row>
  );
}

/** Apagar tudo — a linha que se arma antes de agir.

    Duas perguntas, e não uma. A primeira é o toque na linha; a segunda é
    a frase que diz o que vai embora de verdade — o banco, este aparelho,
    as cópias de segurança em até N dias e o outro aparelho.
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
        <Txt v="caption" c={c.tx2} style={{ flex: 1 }}>{comConta ? C.pergunta(DIAS_DAS_COPIAS_DE_SEGURANCA) : K().apagarPergunta}</Txt>
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
  const clinica = useStore((s) => clinicaConectada(s.S));
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

      <CartaoDoEstado />

      {/* A SEÇÃO MAIS IMPORTANTE DA TELA, e a que um app costuma
          esconder. Ela lista TUDO que atravessa para fora do aparelho, e
          diz o gesto exato que faz cada coisa sair. O primeiro item é o
          único que vai sozinho — e por isso vem primeiro, e a nota diz.

          ⚠️ NUMA TELA DE PRIVACIDADE, A FRASE ERRADA PARA O LADO SEGURO
          TAMBÉM É ERRO. Ela já prometeu envio à equipe que não existia;
          hoje a clínica VÊ o diário (fase 6), e não recebe nada que a
          pessoa mande — mensagem e receita são da fase 7, adiada.

          ⚠️ E A LINHA DA CLÍNICA DIZ O ESTADO DE VERDADE: nenhuma, ou
          conectada. É a pergunta que a pessoa vem fazer a esta tela. */}
      <Bloco titulo={K().oQueSai} nota={K().oQueSaiNota}>
        <Cartao>
          <LinhaQueAbre ic="user" titulo={K().saiConta} resumo={K().saiContaResumo} texto={K().paraContaTexto} />
          <LinhaQueAbre
            ic="steth"
            titulo={K().saiClinica}
            resumo={clinica ? K().saiClinicaConectada : K().saiClinicaNenhuma}
            texto={K().paraEquipeTexto}
          />
          <LinhaQueAbre ic="camera" titulo={K().saiFoto} resumo={K().saiFotoResumo} texto={K().fotoDoPratoTexto} />
          <LinhaQueAbre ic="mic" titulo={K().saiMicrofone} resumo={K().saiMicrofoneResumo} texto={K().ditadoTexto} />
          {/* ⚠️ COM A LEITURA DESLIGADA (`LEITURA_DAS_PERGUNTAS`), AS
              PERGUNTAS FICAM AQUI, e a linha diz isso. Ligada, ela volta a
              ser a da escolha, com o interruptor embaixo — consentimento
              que não se revoga no mesmo lugar em que se lê não é livre
              (LGPD, art. 8º, § 5º). */}
          <LinhaQueAbre
            ic="companion"
            titulo={K().saiPerguntas}
            resumo={LEITURA_DAS_PERGUNTAS ? K().perguntas : K().saiPerguntasResumo}
            texto={LEITURA_DAS_PERGUNTAS ? K().perguntasTexto : K().saiPerguntasTexto}
          />
          {LEITURA_DAS_PERGUNTAS && contaLigada() ? <EscolhaDasPerguntas /> : null}
        </Cartao>
      </Bloco>

      <Bloco titulo={K().leDeFora}>
        <Cartao>
          {/* ⚠️ DIZIA "o app lê as pesagens... Ele só lê". Duas vezes o
              aplicativo falando de si em terceira pessoa, numa tela cuja
              pergunta é justamente quem faz o quê. Quem lê somos nós. */}
          <LinhaQueAbre
            ic="heart"
            titulo={maiuscula(appDeSaude())}
            resumo={K().leSaudeResumo}
            texto={`${K().soOPesoTexto(appDeSaude())} ${K().permissaoTexto}`}
          />
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
