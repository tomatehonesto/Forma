import React from 'react';
import { View } from 'react-native';
import { useRouter } from 'expo-router';
import { useStore } from '../logic/store';
import { clinicaConectada, temAcompanhamento } from '../logic/derive';
import { Txt } from '../ui/kit';
import { TelaInterna, Titulao, Campo, Texto, Botao, Aviso, Cartao, Linha } from '../ui/internas';
import { useTheme } from '../ui/useTheme';

/* ============================================================
   QUEM ACOMPANHA VOCÊ — o médico que não está na plataforma

   ⚠️ ISTO NÃO EXISTIA, E ERA O BURACO NO MEIO DO APLICATIVO. Nenhuma
   tela escrevia `doctor` ou `clinic`: os dois só apareciam porque a
   semente já vinha com a Dra. Helena. Quem chegava de verdade não tinha
   como ter alguém acompanhando — nunca —, e o app inteiro respondia a
   essa pessoa como se ela estivesse sozinha, inclusive quando não estava.

   A MAIORIA DE QUEM USA GLP-1 TEM MÉDICO. O que a maioria não tem é um
   médico dentro desta plataforma. Essa distinção é a razão desta tela: o
   que se registra aqui é um FATO DA VIDA DA PESSOA, e não um vínculo.
   Nada do que entra aqui manda mensagem para ninguém, e o comentário em
   src/logic/derive.ts explica os dois sinais que decidem isso.

   ⚠️ E AQUI EXISTE UM EDITOR, contra a regra de "Seus dados".

   Lá cada linha reabre a pergunta do cadastro, e por um motivo forte: a
   idade entra na equação de energia, a altura faz o IMC, o ritmo faz a
   previsão. Duas telas escrevendo o mesmo número seriam duas réguas para
   a mesma conta.

   Um nome, uma especialidade e um lugar não têm régua. Não entram em
   conta nenhuma, não têm faixa válida, não mudam número em outra tela.
   Não há o que divergir.

   O CADASTRO PERGUNTA SE HÁ ACOMPANHAMENTO, e oferece o nome ali como
   campo opcional. Esta tela é onde ele se corrige depois, e onde entram
   a especialidade e o lugar — que no cadastro seriam três campos a mais
   numa fila de treze perguntas, por um dado que ninguém precisa no
   primeiro dia.

   O QUE ESTA TELA DELIBERADAMENTE NÃO FAZ

     · não confere o nome — o app não tem como, e fingir que confere
       seria pior do que não perguntar;
     · não conecta nada — para isso existe o código de convite, que é
       outra porta e depende de servidor;
     · não guarda a data da consulta. Ela é assunto de /anotar-consulta,
       que é a porta de /consultas — aqui é quem acompanha, lá é quando.
   ============================================================ */

export default function Acompanhamento() {
  const S = useStore((s) => s.S);
  const update = useStore((s) => s.update);
  const router = useRouter();
  const { c } = useTheme();

  const p: any = S.profile;
  const conectada = clinicaConectada(S);
  const tinha = temAcompanhamento(S);

  const [nome, setNome] = React.useState<string>(p.doctor ?? '');
  const [esp, setEsp] = React.useState<string>(p.doctorInfo?.especialidade ?? '');
  const [onde, setOnde] = React.useState<string>(p.clinic ?? '');
  const [apagando, setApagando] = React.useState(false);

  /* Duas letras é o piso do que é um nome. Abaixo disso o campo está
     sendo preenchido, e não respondido. */
  const vale = nome.trim().length >= 2;

  const salvar = () => {
    update((s: any) => {
      s.profile.doctor = nome.trim();
      s.profile.clinic = onde.trim();
      s.profile.doctorInfo = { ...(s.profile.doctorInfo ?? {}), especialidade: esp.trim() };
    });
    router.back();
  };

  /* ⚠️ TIRAR O MÉDICO NÃO É APAGAR NADA. É a regra da casa: nenhuma
     atualização das informações limpa registro. O que sai são três
     campos de identificação — peso, aplicações, sintomas, exames e
     anotações continuam exatamente onde estavam, e o resumo continua
     saindo. Por isso o botão é "fantasma" e não "perigo": deixar de ser
     acompanhada é uma mudança de vida legítima, não uma destruição. */
  const remover = () => {
    update((s: any) => {
      s.profile.doctor = '';
      s.profile.clinic = '';
      s.profile.doctorInfo = { ...(s.profile.doctorInfo ?? {}), especialidade: '' };
    });
    router.back();
  };

  /* ---- com vínculo, isto é leitura ----

     Quem veio por uma clínica credenciada tem estes campos vindos de
     lá. Deixar o formulário aberto criaria a situação em que a pessoa
     corrige o nome da própria médica e o servidor sobrescreve na
     sincronização seguinte — uma edição que o app aceita e depois
     desfaz sozinho é pior do que uma que ele não oferece. */
  if (conectada) {
    return (
      <TelaInterna titulo="Quem acompanha você">
        <Titulao
          titulo="Quem acompanha você"
          lead="Estes dados vêm da clínica que acompanha o seu tratamento."
        />
        <Cartao>
          <Linha ic="steth" titulo={p.doctor || 'Especialista'} sub={p.doctorInfo?.especialidade || undefined} />
          {p.clinic ? <Linha ic="home" titulo={p.clinic} sub="Onde você é atendida" /> : null}
        </Cartao>
        <Aviso
          ic="info"
          titulo="Quem corrige é a clínica"
          texto="Se algum dado estiver errado, fale com a equipe — é ela que mantém esta ficha, e o que for corrigido lá chega aqui."
        />
        <View />
      </TelaInterna>
    );
  }

  return (
    <TelaInterna titulo="Quem acompanha você">
      <Titulao
        titulo="Quem acompanha você"
        lead="Se você se trata com alguém, anote aqui. É o que faz o resumo sair pronto para a consulta e o preparo de perguntas aparecer na hora certa."
      />

      <Campo rotulo="Nome" ajuda="Como você chama essa pessoa. Pode ser o nome do consultório, se preferir.">
        <Texto valor={nome} onChange={setNome} placeholder="Digite o nome" linhas={1} />
      </Campo>

      <Campo rotulo="Especialidade" ajuda="Opcional.">
        <Texto valor={esp} onChange={setEsp} placeholder="Endocrinologista" linhas={1} />
      </Campo>

      <Campo rotulo="Onde atende" ajuda="Opcional — clínica, hospital ou consultório.">
        <Texto valor={onde} onChange={setOnde} placeholder="Digite a clínica ou consultório" linhas={1} />
      </Campo>

      {/* ⚠️ A FRASE QUE EVITA A EXPECTATIVA ERRADA. Sem ela, uma tela que
          pede o nome do médico numa seção chamada "Quem acompanha você"
          faz qualquer pessoa esperar que ele receba alguma coisa. Vem
          antes do botão de propósito: é informação para decidir, e não
          aviso depois do fato. */}
      <Aviso
        ic="shield"
        titulo="Nada disto é enviado a ninguém"
        texto="O nome fica no aplicativo, com você. Para que a sua equipe receba os seus dados é preciso um código de convite da clínica — e aí quem passa a cuidar desta ficha é ela."
      />

      <Botao label="Salvar" onPress={salvar} desligado={!vale} />

      {tinha ? (
        apagando ? (
          <Aviso
            ic="info"
            titulo="Tirar quem acompanha?"
            texto="Os seus registros continuam todos aqui — peso, aplicações, sintomas, exames e anotações. O que sai é só o nome."
          >
            <Botao label="Sim, tirar" onPress={remover} tom="perigo" />
            <Botao label="Cancelar" onPress={() => setApagando(false)} tom="fantasma" />
          </Aviso>
        ) : (
          <Botao label="Não tenho mais acompanhamento" onPress={() => setApagando(true)} tom="fantasma" />
        )
      ) : null}

      <View />
    </TelaInterna>
  );
}
