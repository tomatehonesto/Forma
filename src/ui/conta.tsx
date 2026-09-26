/* ============================================================
   A CONTA NAS TELAS — a linha do Perfil, o sair, e a faixa da Home

   Três peças pequenas que leem o mesmo estado: quem é o dono do diário
   (`S.conta`) e o que a sincronia diz agora (logic/conta). Moram juntas
   porque são irmãs: a frase da linha, a da faixa e a do sair falam da
   mesma coisa, e mudar uma é procurar as outras (textos/<local>/conta).

   ⚠️ TUDO ATRÁS DE `contaLigada()`, menos o rótulo do sair: sem dono, em
   qualquer build, o botão não diz "Sair da conta" — não há conta de que
   sair.
   ============================================================ */
import React from 'react';
import { Pressable, View, type StyleProp, type ViewStyle } from 'react-native';
import { useRouter } from 'expo-router';
import { useStore } from '../logic/store';
import { contaLigada } from '../logic/nuvem';
import { sair, sincronia, useEstadoDaSincronia } from '../logic/conta';
import type { EstadoDaSincronia } from '../logic/sincronia';
import { Txt, Row } from './kit';
import { Botao, Bloco, Cartao, Linha } from './internas';
import { Icon } from './Icon';
import { useTheme } from './useTheme';
import { radius } from '../theme';
import { T } from '../textos';

const K = () => T.conta;

/** A frase da linha de estado. As cinco do desenho, e a da conta apagada. */
export function fraseDoEstado(e: EstadoDaSincronia): string | null {
  const L = K().linha;
  switch (e) {
    case 'guardado': return L.guardado;
    case 'guardando': return L.guardando;
    case 'sem-internet': return L.semInternet;
    case 'entrar-de-novo':
    case 'outra-conta': return L.entrarDeNovo;
    case 'sem-conta': return L.semConta;
    case 'conta-apagada': return L.contaApagada;
    default: return null;
  }
}

/** O diário sai deste telefone — sair da conta, a conta apagada, "Apagar
    meus dados". Para a sincronia, apaga a base, sai, e só então o estado
    vazio: nessa ordem (ver `trocarDeDiario`). */
export async function tirarDiarioDoTelefone() {
  const recomecar = async () => {
    await sair();
    useStore.getState().reset();
  };
  const m = sincronia();
  if (m) await m.trocarDeDiario(recomecar);
  else await recomecar();
}

/* ============================================================
   A CONTA, EM "SEUS DADOS"

   ⚠️ ERA UM GRUPO PRÓPRIO NO ALTO DO PERFIL ("Sua conta"), e o dono pediu
   o e-mail junto dos outros dados da pessoa (26/09/2026): o e-mail é um
   dado dela, como o nome e o nascimento. Mora no alto de /dados, com a
   frase do estado da sincronia — e o que precisa de atenção (entrar de
   novo, a conta apagada, a conta que ainda não nasceu) também aparece na
   faixa da Home, que leva para cá (`FaixaDaConta`, abaixo).

   ⚠️ NA SEMENTE ELA NÃO APARECE: a Mariana não tem conta, e nunca vai
   ter. Sem dono, depois do cadastro, ela diz que a conta nasce quando a
   conexão voltar — é o único jeito de estar ali sem conta, porque com
   conexão o portão já teria levado à conta.
   ============================================================ */
export function BlocoDaConta() {
  const router = useRouter();
  const conta = useStore((s) => (s.S as any).conta as { id: string; email?: string } | null);
  const semente = useStore((s) => !!(s.S as any).semente);
  const feito = useStore((s) => s.S.onboardDone);
  const estado = useEstadoDaSincronia();
  const [limpando, setLimpando] = React.useState(false);

  if (!contaLigada() || semente) return null;

  if (!conta) {
    if (!feito) return null;
    return (
      <Bloco titulo={K().linha.titulo}>
        <Cartao>
          <Linha ic="mail" titulo={K().linha.titulo} sub={K().linha.semConta}
            onPress={() => router.push('/conta?de=cadastro' as any)} />
        </Cartao>
      </Bloco>
    );
  }

  const frase = fraseDoEstado(estado);
  const entrar = estado === 'entrar-de-novo' || estado === 'outra-conta';
  const apagada = estado === 'conta-apagada';
  return (
    <Bloco titulo={K().linha.titulo}>
      <Cartao>
        <Linha
          ic="mail"
          titulo={conta.email ?? K().linha.titulo}
          sub={frase ?? undefined}
          seta={entrar || apagada}
          onPress={entrar ? () => router.push('/conta?de=sessao' as any) : apagada ? () => setLimpando(true) : undefined}
        />
      </Cartao>
      {apagada && limpando ? (
        <View style={{ gap: 8 }}>
          <Txt v="caption">{K().apagada.lead}</Txt>
          <Botao
            label={K().apagada.limpar}
            tom="perigo"
            onPress={async () => { await tirarDiarioDoTelefone(); router.replace('/cadastro' as any); }}
          />
        </View>
      ) : null}
    </Bloco>
  );
}

/* ============================================================
   O SAIR

   Com dono, sai de verdade: o diário sai deste telefone e continua na
   conta. Antes, a pergunta — e o aviso do que ainda não subiu, se houver.

   Sem dono, faz o que sempre fez (volta ao cadastro, com o que foi
   registrado), e o rótulo diz isso (PENDENCIAS, item 30).
   ============================================================ */
export function BotaoDeSair({ refazer }: { refazer: () => void }) {
  const { c } = useTheme();
  const router = useRouter();
  const conta = useStore((s) => (s.S as any).conta);
  const [armado, setArmado] = React.useState(false);
  const [pendentes, setPendentes] = React.useState(0);

  const tocar = async () => {
    if (!conta) return refazer();
    setPendentes((await sincronia()?.pendentes()) ?? 0);
    setArmado(true);
  };

  return (
    <View style={{ marginTop: 32, gap: 10 }}>
      <Pressable onPress={tocar} style={({ pressed }) => [{ opacity: pressed ? 0.75 : 1 }]}>
        <Row gap={9} style={{
          justifyContent: 'center', backgroundColor: c.bg1,
          borderWidth: 1, borderColor: c.line, borderRadius: radius.pill,
          paddingVertical: 15,
        }}>
          <Icon name="logout" size={18} color={c.tx2} sw={1.9} />
          <Txt v="bodyMed" c={c.tx2}>{conta ? K().sair.rotulo : K().sair.semConta}</Txt>
        </Row>
      </Pressable>
      {armado ? (
        <View style={{ gap: 8, paddingHorizontal: 4 }}>
          <Txt v="caption" c={c.tx2}>{K().sair.pergunta}</Txt>
          {pendentes > 0 ? <Txt v="caption" c={c.cta}>{K().sair.pendente}</Txt> : null}
          <Botao
            label={K().sair.confirmar}
            tom={pendentes > 0 ? 'perigo' : 'cheio'}
            onPress={async () => { await tirarDiarioDoTelefone(); router.replace('/cadastro' as any); }}
          />
          <Botao label={K().sair.cancelar} tom="fantasma" onPress={() => setArmado(false)} />
        </View>
      ) : null}
    </View>
  );
}

/* ============================================================
   A FAIXA DA HOME

   Aparece nos estados em que o diário não está a salvo: depois do
   cadastro, sem conta porque não havia conexão; com a conta apagada em
   outro aparelho; e com a sessão caída ("entre de novo"). Toque leva a
   Seus dados, onde está a linha da conta (`BlocoDaConta`).

   ⚠️ O "ENTRE DE NOVO" ENTROU AQUI quando a conta saiu do alto do Perfil
   para dentro de Seus dados: lá ele fica um nível abaixo, e uma sessão
   caída para a subida do diário — não pode depender de a pessoa ir
   procurar. */
export function FaixaDaConta({ style }: { style?: StyleProp<ViewStyle> }) {
  const { c } = useTheme();
  const router = useRouter();
  const conta = useStore((s) => (s.S as any).conta);
  const semente = useStore((s) => !!(s.S as any).semente);
  const feito = useStore((s) => s.S.onboardDone);
  const estado = useEstadoDaSincronia();
  if (!contaLigada() || semente || !feito) return null;
  const frase = !conta ? K().linha.semConta
    : estado === 'conta-apagada' ? K().linha.contaApagada
      : estado === 'entrar-de-novo' || estado === 'outra-conta' ? K().linha.entrarDeNovo
        : null;
  if (!frase) return null;
  return (
    <Pressable onPress={() => router.push('/dados' as any)} style={({ pressed }) => [style, { opacity: pressed ? 0.8 : 1 }]}>
      <Row gap={10} style={{
        backgroundColor: c.bg1, borderWidth: 1, borderColor: c.line, borderRadius: radius.lg,
        paddingHorizontal: 14, paddingVertical: 12,
      }}>
        <Icon name="info" size={17} color={c.tx2} sw={1.9} />
        <Txt v="caption" c={c.tx2} style={{ flex: 1 }}>{frase}</Txt>
      </Row>
    </Pressable>
  );
}
