import React from 'react';
import { View, Pressable, Switch, Linking, Platform, AppState, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useStore } from '../logic/store';
import {
  ORDEM, TIPOS, proximaDe, quando, resumoDe, type Alerta,
} from '../logic/alertas';
import { Txt, Row, Vazio } from '../ui/kit';
import { TelaInterna, Titulao, Cartao, Aviso, Botao } from '../ui/internas';
import { Icon } from '../ui/Icon';
import { useTheme } from '../ui/useTheme';
import { radius } from '../theme';
import { estadoDaPermissao, pedirPermissao, type Permissao } from '../logic/avisos';

/* ============================================================
   LEMBRETES — uma lista, e o assunto é do alerta

   Esta tela já foi quatro interruptores, depois quatro cartões e depois
   quatro seções com o criar no cabeçalho. As três versões erravam a mesma
   coisa: davam ao ASSUNTO o peso de uma estrutura. Quatro títulos, quatro
   descrições e quatro molduras existiam mesmo quando havia um alerta no
   total — e a tela era sobretudo o desenho das divisórias.

   O assunto virou uma propriedade do alerta, e a tela virou o que ela é:
   a lista do que vai tocar. Um cartão, uma linha por alerta, o ícone do
   assunto à esquerda e a chave à direita. É o despertador do celular, que
   também não tem uma seção para cada motivo de acordar.

   E O CRIAR VIROU BOTÃO FIXO NO PÉ. Ele não pertence a nenhum assunto —
   pertence à tela —, e no pé ele está sempre à mão, inclusive com a lista
   grande e rolada. A escolha do assunto passou para dentro da folha, que
   é onde as outras escolhas do alerta já moram.
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
    const grava = (on: boolean) => update((s: any) => {
      const x = (s.alertas ?? []).find((y: Alerta) => y.id === a.id);
      if (x) x.on = on;
    });
    if (!v) { grava(false); return; }
    const p = permissao === 'concedida' ? 'concedida' : await pedirPermissao();
    setPermissao(p);
    if (p === 'negada') return;
    grava(true);
  };

  /* DENTRO DO GRUPO, O QUE TOCA ANTES VEM ANTES. Entre grupos quem manda
     é a ordem dos assuntos, que a montagem abaixo respeita. */
  const alertas = [...(((S as any).alertas as Alerta[]) ?? [])].sort(
    (x, y) => (+proximaDe(S, { ...x, on: true })! || 0) - (+proximaDe(S, { ...y, on: true })! || 0),
  );

  const bloqueado = permissao === 'negada' && alertas.some((a) => a.on);
  const semSuporte = permissao === 'indisponivel' && alertas.some((a) => a.on);

  /* AGRUPADOS POR ASSUNTO, dentro do mesmo cartão.

     Sem agrupar, dois alertas de hidratação e um de dose viravam um
     listão em que cada linha repetia o assunto para se identificar, e
     quem quisesse conferir "como está a minha hidratação" tinha de varrer
     a lista inteira procurando o mesmo ícone.

     O assunto subiu para um rótulo de grupo, e a linha ficou com o que
     muda de um alerta para o outro: quando ele toca. A moldura continua
     sendo uma só — o que separa os grupos é o fio que o cartão já põe
     entre os filhos dele, e o que separa as linhas de um grupo é um fio
     recuado, mais leve. Agrupar não custou uma divisória nova.

     Assunto sem nenhum alerta não aparece: aqui é a lista do que foi
     criado, e não o catálogo do que dá para criar — esse mora na folha,
     na primeira pergunta. */
  const grupos = ORDEM
    .map((tipo) => ({ tipo, itens: alertas.filter((a) => a.tipo === tipo) }))
    .filter((g) => g.itens.length);

  const Linha = ({ a, primeiro }: { a: Alerta; primeiro: boolean }) => {
    /* Ligado é a vontade da pessoa; avisar mesmo depende do aparelho. */
    const avisa = a.on && permissao === 'concedida';
    const prox = avisa ? quando(proximaDe(S, a)) : null;
    return (
      <View>
        {!primeiro ? <View style={{ height: StyleSheet.hairlineWidth, backgroundColor: c.line, marginLeft: 16 }} /> : null}
        <Row gap={12} style={{ paddingHorizontal: 16, paddingVertical: 12, alignItems: 'center' }}>
          {/* O TOQUE ABRE A FOLHA, e a chave fica de fora dele. São duas
              ações diferentes no mesmo item — uma edita, a outra liga —, e
              é assim que o despertador do celular faz: o alarme inteiro
              abre, menos o pedaço onde mora a chave. */}
          <Pressable
            onPress={() => router.push(`/alerta?id=${a.id}` as any)}
            style={({ pressed }) => [{ flex: 1, opacity: pressed ? 0.6 : 1 }]}
          >
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
      </View>
    );
  };

  return (
    <TelaInterna
      titulo="Lembretes"
      /* O CRIAR NO PÉ, fixo e fora da rolagem: ele não é o fim da lista,
         é a ação da tela — e com a lista grande, um botão no fim do rolo
         só existe para quem já rolou até lá. */
      rodape={<Botao label="Criar alerta" onPress={() => router.push('/alerta' as any)} />}
    >
      <Titulao titulo="Lembretes" lead="Os avisos que você criar aparecem aqui, na ordem em que tocam." />

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
                ? 'O aparelho está barrando as notificações deste aplicativo. Enquanto estiver assim, nada do que você ligar aqui vai chegar.'
                : 'O que você criar fica guardado e passa a valer quando abrir o aplicativo no celular.'}
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

      {grupos.length ? (
        <Cartao>
          {grupos.map((g) => (
            <View key={g.tipo}>
              <Row gap={9} style={{ paddingHorizontal: 16, paddingTop: 14, paddingBottom: 4, alignItems: 'center' }}>
                <Icon name={TIPOS[g.tipo].ic} size={15} color={c.tx3} sw={2} />
                <Txt v="micro" c={c.tx3} style={{ letterSpacing: 1 }}>{TIPOS[g.tipo].titulo.toUpperCase()}</Txt>
              </Row>
              {g.itens.map((a, i) => <Linha key={a.id} a={a} primeiro={i === 0} />)}
            </View>
          ))}
        </Cartao>
      ) : (
        /* O vazio não explica o que é um lembrete: diz que não há nenhum e
           aponta para o botão que está logo abaixo, à vista. */
        <Vazio
          ic="bell"
          titulo="Nenhum alerta ainda"
          texto="Dose, pesagem, hidratação e proteína — crie os que fizerem sentido para a sua rotina."
        />
      )}

      {/* "DÁ PARA ADIAR" SAIU: não existe adiar. O aviso chega na tela de
          bloqueio e se dispensa como qualquer outro, e prometer uma
          soneca que não está lá é a mesma espécie de promessa que esta
          tela deixou de fazer quando os avisos passaram a existir. */}
      <Aviso ic="info" texto="Um aviso é um convite, não uma cobrança. Se um dia passar, nada aqui vira atraso." />
    </TelaInterna>
  );
}
