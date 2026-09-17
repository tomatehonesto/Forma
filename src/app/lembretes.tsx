import React from 'react';
import { View, Pressable, Switch, Linking, Platform, AppState } from 'react-native';
import { useRouter } from 'expo-router';
import { useStore } from '../logic/store';
import {
  ORDEM, TIPOS, alertasDe, proximaDe, quando, resumoDe, type Alerta, type TipoDeAlerta,
} from '../logic/alertas';
import { Txt, Row } from '../ui/kit';
import { TelaInterna, Titulao, Bloco, Cartao, Aviso } from '../ui/internas';
import { Icon } from '../ui/Icon';
import { useTheme } from '../ui/useTheme';
import { radius } from '../theme';
import { estadoDaPermissao, pedirPermissao, type Permissao } from '../logic/avisos';

/* ============================================================
   LEMBRETES — a lógica do despertador

   A tela tinha quatro interruptores, um por assunto, e cada um com um
   horário. Quem quisesse beber água de manhã E de tarde tinha um horário.
   Quem se pesa às segundas e às quintas tinha um dia. Assunto e aviso
   eram a mesma coisa, e por isso nenhum dos dois podia se repetir.

   Agora o assunto é uma SEÇÃO e o alerta é um ITEM dentro dela — quantos
   a pessoa quiser, cada um com seus horários e seus dias, cada um com a
   própria chave de ligado. É como funciona o despertador de qualquer
   celular, e não é coincidência: o problema é o mesmo, e ninguém acha
   estranho ter três alarmes de manhã.

   A CONFIGURAÇÃO SAIU DA TELA E FOI PARA UMA FOLHA. Com quatro
   interruptores, abrir as opções embaixo de cada um cabia. Com vários
   alertas por assunto, a tela viraria uma pilha de painéis abertos, e o
   que a pessoa vem fazer aqui — ver o que está ligado — sumiria no meio
   das opções. Na lista fica o alerta resumido numa linha; a folha é onde
   ele se monta. Ver src/app/alerta.tsx.
   ============================================================ */

export default function Lembretes() {
  const S = useStore((s) => s.S);
  const update = useStore((s) => s.update);
  const { c } = useTheme();
  const router = useRouter();

  /* A PERMISSÃO DO SISTEMA É PARTE DO ESTADO DESTA TELA.

     Um alerta ligado aqui e bloqueado no aparelho é uma chave verde que
     não faz nada — e a pessoa só descobre no dia em que o aviso não vem.
     Reconsultar ao voltar do foco cobre o caminho mais provável: sair
     daqui para as configurações do aparelho, mudar lá, e voltar. */
  const [permissao, setPermissao] = React.useState<Permissao>('concedida');
  React.useEffect(() => {
    const conferir = () => { estadoDaPermissao().then(setPermissao); };
    conferir();
    const sub = AppState.addEventListener('change', (e) => { if (e === 'active') conferir(); });
    return () => sub.remove();
  }, []);

  /* LIGAR UM ALERTA É PEDIR PERMISSÃO NA HORA CERTA. O sistema só
     pergunta uma vez, e um "não" dado antes de a pessoa querer aviso
     nenhum não tem volta de dentro do app. Negado, a chave não liga:
     guardar "ligado" para algo que o sistema vai engolir seria a tela
     mentindo em silêncio. */
  const alternar = async (a: Alerta, v: boolean) => {
    if (!v) { update((s: any) => { const x = s.alertas.find((y: Alerta) => y.id === a.id); if (x) x.on = false; }); return; }
    const p = permissao === 'concedida' ? 'concedida' : await pedirPermissao();
    setPermissao(p);
    if (p === 'negada') return;
    update((s: any) => { const x = s.alertas.find((y: Alerta) => y.id === a.id); if (x) x.on = true; });
  };

  const todos = ((S as any).alertas as Alerta[]) ?? [];
  const bloqueado = permissao === 'negada' && todos.some((a) => a.on);
  const semSuporte = permissao === 'indisponivel' && todos.some((a) => a.on);

  const Linha = ({ a }: { a: Alerta }) => {
    /* Ligado é a vontade da pessoa; avisar mesmo depende do aparelho. */
    const avisa = a.on && permissao === 'concedida';
    const prox = avisa ? quando(proximaDe(S, a)) : null;
    return (
      <Row gap={12} style={{ paddingHorizontal: 16, paddingVertical: 13, alignItems: 'center' }}>
        {/* O TOQUE ABRE A FOLHA, e a chave fica de fora dele. São duas
            ações diferentes no mesmo item — uma edita, a outra liga —, e é
            assim que o despertador do celular faz: o alarme inteiro abre,
            menos o pedaço onde mora a chave. */}
        <Pressable
          onPress={() => router.push(`/alerta?id=${a.id}` as any)}
          style={({ pressed }) => [{ flex: 1, opacity: pressed ? 0.6 : 1 }]}
        >
          {/* O RESUMO É O TÍTULO. Numa seção que já se chama "Pesagem",
              repetir "pesagem" em cada linha gasta a linha inteira para
              não dizer nada. O que muda de um alerta para o outro é
              quando ele toca — e é isso que vem em corpo de título. */}
          <Txt v="bodyMed" c={a.on ? c.tx : c.tx3}>{resumoDe(a)}</Txt>
          <Txt v="micro" c={c.tx4} style={{ marginTop: 2 }}>
            {prox ? `Próximo: ${prox}`
              : !a.on ? 'Desligado'
                : permissao === 'indisponivel' ? 'Guardado — os avisos saem pelo celular'
                  : 'Sem aviso enquanto estiver bloqueado'}
          </Txt>
        </Pressable>
        <Switch
          value={a.on} onValueChange={(v) => alternar(a, v)}
          trackColor={{ false: c.track, true: c.accent }} thumbColor="#fff"
        />
      </Row>
    );
  };

  /* UMA SEÇÃO POR ASSUNTO, e o mais leve que ela consegue ser.

     A versão anterior dava a cada assunto um título, um parágrafo de
     descrição e um cartão com a linha de "criar" dentro. Com três dos
     quatro vazios, a tela era quatro blocos de moldura para uma única
     linha de conteúdo — separação demais para o que há a separar.

     Agora o criar mora no cabeçalho, à direita, como o "ver tudo" das
     seções da Home. E a descrição só aparece quando NÃO há alerta: ela
     existe para ajudar a decidir se vale criar um, e quem já criou não
     precisa que o app explique de novo para que serve. Com alertas, o
     cartão fica só com eles; sem nenhum, não há cartão. */
  const Secao = ({ tipo }: { tipo: TipoDeAlerta }) => {
    const t = TIPOS[tipo];
    const lista = alertasDe(S, tipo);
    return (
      <Bloco
        titulo={t.titulo}
        link="Criar alerta"
        onLink={() => router.push(`/alerta?tipo=${tipo}` as any)}
        nota={lista.length ? undefined : t.desc}
      >
        {lista.length ? (
          <Cartao>{lista.map((a) => <Linha key={a.id} a={a} />)}</Cartao>
        ) : null}
      </Bloco>
    );
  };

  return (
    <TelaInterna titulo="Lembretes">
      <Titulao titulo="Lembretes" lead="Crie quantos alertas quiser, cada um no seu horário." />

      {/* O QUE O APARELHO TEM A DIZER. Nas duas situações em que o aviso
          não sai — permissão negada no sistema, ou app aberto no
          navegador —, a tela conta antes de a pessoa descobrir pelo
          silêncio. Só aparece com algum alerta ligado: sem nenhum, não há
          promessa a desmentir. */}
      {bloqueado || semSuporte ? (
        <Row gap={11} style={{
          alignItems: 'flex-start', backgroundColor: c.amberBg,
          borderRadius: radius.card, padding: 16,
        }}>
          <Icon name="bell" size={18} color={c.amber} sw={1.9} />
          <View style={{ flex: 1 }}>
            <Txt v="bodyMed">{bloqueado ? 'Os avisos estão bloqueados' : 'No navegador não dá para avisar'}</Txt>
            <Txt v="caption" c={c.tx2} style={{ marginTop: 3, lineHeight: 20 }}>
              {bloqueado
                ? 'O aparelho está barrando as notificações deste app. Enquanto estiver assim, nada do que você ligar aqui vai chegar.'
                : 'O que você criar fica guardado e passa a valer quando abrir o app no celular.'}
            </Txt>
            {bloqueado && Platform.OS !== 'web' ? (
              <Pressable onPress={() => Linking.openSettings()} style={({ pressed }) => [{ marginTop: 10, opacity: pressed ? 0.6 : 1 }]}>
                <Row gap={6}>
                  <Txt v="label" c={c.accent2}>Abrir as configurações</Txt>
                  <Icon name="chev" size={13} color={c.accent2} sw={2.2} />
                </Row>
              </Pressable>
            ) : null}
          </View>
        </Row>
      ) : null}

      {ORDEM.map((tipo) => <Secao key={tipo} tipo={tipo} />)}

      {/* "DÁ PARA ADIAR" SAIU: não existe adiar. O aviso chega na tela de
          bloqueio e se dispensa como qualquer outro, e prometer uma
          soneca que não está lá é a mesma espécie de promessa que esta
          tela deixou de fazer quando os avisos passaram a existir. */}
      <Aviso ic="info" texto="Um aviso é um convite, não uma cobrança. Se um dia passar, nada aqui vira atraso." />
    </TelaInterna>
  );
}
