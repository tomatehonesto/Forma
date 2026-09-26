import React from 'react';
import { View, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { useStore } from '../logic/store';
import { clinicaConectada, temAcompanhamento } from '../logic/derive';
import { temConsulta } from '../logic/derive';
import { startOfDay, now, maiuscula, dataComDiaDaSemana, dataComAno, diasDaSemana } from '../logic/time';
import { formato } from '../logic/local';
import { radius } from '../theme';
import { Txt, Row } from '../ui/kit';
import { TelaInterna, Titulao, Campo, Botao, Aviso, Opcoes, Opc } from '../ui/internas';
import { Calendario } from '../ui/calendario';
import { Icon } from '../ui/Icon';
import { useTheme } from '../ui/useTheme';
import { T } from '../textos';

/* ⚠️ É FUNÇÃO, e não constante de módulo: ela lê o catálogo, e constante
   de módulo congela o idioma no import. */
const K = () => T.cuidado.telaAnotarConsulta;

/* ============================================================
   ANOTAR CONSULTA — a data que faltava

   ⚠️ NENHUMA TELA DO APLICATIVO MARCAVA CONSULTA. `/consultas` só sabia
   ler, e o único jeito de existir uma data era a semente trazê-la. Isso
   passou despercebido enquanto ter médico e ter plataforma eram a mesma
   coisa: a agenda era da clínica, e a clínica era imaginária.

   Com a ficha de quem acompanha, a conta ficou visível — seis pontos do
   app perguntam `temConsulta` (aviso de consulta hoje, preparo de
   perguntas, o quadro do Cuidado, a leitura de "como aproveitar a
   consulta") e nenhum deles podia ser verdade para quem anotou o próprio
   médico. Não era dado faltando: era porta faltando.

   ANOTAR NÃO É MARCAR, e o nome da tela diz isso. O aplicativo não fala
   com agenda de consultório nenhum: quem marcou foi a pessoa, por
   telefone ou na recepção, e aqui ela escreve o que combinou. Chamar de
   "marcar consulta" prometeria um agendamento que não existe.

   ⚠️ COM VÍNCULO, ESTA TELA NÃO SE ABRE. A agenda é da clínica, e uma
   data digitada aqui seria sobrescrita pela sincronização seguinte — ou,
   pior, divergiria em silêncio da agenda de verdade. O caminho que leva
   aqui só aparece sem plataforma; a porta trancada é a última linha de
   defesa, para quem chegar por link.
   ============================================================ */

/* ⚠️ ERA CONSTANTE DE MÓDULO com as três palavras escritas, e elas são
   chave E rótulo ao mesmo tempo: é o que fica gravado em
   `S.consult.type`. Mesma família do momento da refeição — traduzir não
   quebra registro novo, e registro antigo aparece com o nome que foi
   gravado. */
const TIPOS = () => [
  T.cuidado.telaAnotarConsulta.tipos.presencial,
  T.cuidado.telaAnotarConsulta.tipos.teleconsulta,
  T.cuidado.telaAnotarConsulta.tipos.retorno,
];

/* Dezoito meses para a frente e nenhum dia para trás. Consulta é
   compromisso futuro: um campo que aceita o ano passado convida ao erro
   de toque que depois vira "consulta há 300 dias" na Home. */
const MESES_A_FRENTE = 18;

/* ⚠️ O ANO SÓ APARECE QUANDO NÃO É ESTE. A consulta alcança dezoito
   meses, e "sexta, 5 de março" sem ano não diz se é daqui a cinco meses
   ou a dezessete; no ano corrente, ele seria ruído. */
const dataDaConsulta = (t: number) => {
  const d = new Date(t);
  if (d.getFullYear() === now().getFullYear()) return dataComDiaDaSemana(d);
  return formato().comDiaDaSemana(diasDaSemana()[d.getDay()], dataComAno(d));
};

export default function AnotarConsulta() {
  const S = useStore((s) => s.S);
  const update = useStore((s) => s.update);
  const router = useRouter();
  const { c } = useTheme();

  const conectada = clinicaConectada(S);
  const jaTem = temConsulta(S);
  const atual = jaTem ? new Date(S.consult.t) : null;

  const hoje = startOfDay(now());
  const limite = new Date(hoje.getFullYear(), hoje.getMonth() + MESES_A_FRENTE, hoje.getDate());

  const inicial = atual && +atual >= +hoje ? atual : hoje;
  const [quando, setQuando] = React.useState(+startOfDay(inicial));
  const [tipo, setTipo] = React.useState(S.consult.type || TIPOS()[0]);
  /* A grade já vem aberta para quem ainda não tem consulta: a data é o
     que essa pessoa veio fazer aqui. Quem já tem abre a tela para mudar
     outra coisa tanto quanto a data, e a encontra fechada, escrita. */
  const [calAberto, setCalAberto] = React.useState(!jaTem);

  const salvar = () => {
    update((s: any) => {
      s.consult = { t: quando, type: tipo, doctor: s.profile.doctor };
    });
    router.back();
  };

  /* ⚠️ TIRAR A CONSULTA NÃO APAGA A DO PASSADO. O histórico é outra
     lista, e ela não é tocada aqui: o que sai é só o compromisso que
     ainda não aconteceu. Consulta desmarcada é coisa da vida, e o app
     não devia cobrar explicação por isso. */
  const tirar = () => {
    update((s: any) => { s.consult = { t: 0, type: '', doctor: '' }; });
    router.back();
  };

  if (conectada) {
    return (
      <TelaInterna titulo={K().titulo}>
        <Titulao titulo={K().quemMarca} lead={K().quemMarcaLead} />
        <Aviso
          ic="cal"
          titulo={K().datasChegam}
          texto={K().datasChegamTexto}
        />
        <View />
      </TelaInterna>
    );
  }

  return (
    <TelaInterna titulo={K().titulo}>
      <Titulao
        titulo={jaTem ? K().proximaConsulta : K().anoteSuaConsulta}
        lead={K().lead}
      />

      {/* ⚠️ O CALENDÁRIO, E NÃO A RODA (26/09/2026, pedido do dono). A
          consulta é marcada pela semana — "terça que vem", "dia 5, uma
          segunda" —, e a grade mostra o dia da semana e os dias em volta
          de uma vez; a roda serve a data longe, como a de nascimento, em
          que o dia da semana não importa e os anos são muitos.

          O MESMO CAMPO DA APLICAÇÃO: a data escrita por extenso, e a
          grade embaixo dela. Escolher fecha a grade, porque a data
          aparece escrita no campo, que é onde ela fica — e um toque nele
          abre de novo. Os limites são os da consulta: de hoje até
          dezoito meses. */}
      <Campo rotulo={K().quando}>
        <Pressable
          onPress={() => setCalAberto((x) => !x)}
          style={({ pressed }) => [{
            backgroundColor: c.bg2, borderRadius: radius.md,
            paddingHorizontal: 14, paddingVertical: 13,
            opacity: pressed ? 0.7 : 1,
          }]}
        >
          <Row style={{ justifyContent: 'space-between', alignItems: 'center', gap: 10 }}>
            <Txt v="bodyMed" style={{ flex: 1 }}>{maiuscula(dataDaConsulta(quando))}</Txt>
            <Icon name={calAberto ? 'chevup' : 'chevdown'} size={16} color={c.tx3} sw={2.2} />
          </Row>
        </Pressable>
        {calAberto ? (
          <Calendario
            valor={quando}
            de={+hoje}
            ate={+limite}
            onEscolhe={(t) => { setQuando(t); setCalAberto(false); }}
          />
        ) : null}
      </Campo>

      <Campo rotulo={K().comoVaiSer}>
        <Opcoes>
          {TIPOS().map((t) => (
            <Opc key={t} label={t} on={tipo === t} onPress={() => setTipo(t)} />
          ))}
        </Opcoes>
      </Campo>

      {temAcompanhamento(S) ? (
        <Txt v="caption" c={c.tx3} style={{ paddingHorizontal: 2 }}>
          {K().comQuem(S.profile.doctor || S.profile.clinic)}
        </Txt>
      ) : null}

      {/* A expectativa, dita antes do botão: isto não avisa ninguém do
          outro lado, e não aparece em agenda nenhuma além desta. */}
      <Aviso
        ic="shield"
        titulo={K().dataFicaComVoce}
        texto={K().dataFicaComVoceTexto}
      />

      <Botao label={jaTem ? K().salvar : K().anotar} onPress={salvar} />

      {jaTem ? <Botao label={K().naoTenho} onPress={tirar} tom="fantasma" /> : null}

      <View />
    </TelaInterna>
  );
}
