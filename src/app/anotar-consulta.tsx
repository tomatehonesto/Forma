import React from 'react';
import { View } from 'react-native';
import { useRouter } from 'expo-router';
import { useStore } from '../logic/store';
import { clinicaConectada, temAcompanhamento } from '../logic/derive';
import { temConsulta } from '../logic/derive';
import { MO_LONG, startOfDay, now } from '../logic/time';
import { Txt, Row } from '../ui/kit';
import { TelaInterna, Titulao, Campo, Roda, Botao, Aviso, Opcoes, Opc } from '../ui/internas';
import { useTheme } from '../ui/useTheme';

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

const TIPOS = ['Presencial', 'Teleconsulta', 'Retorno'];

/* Dezoito meses para a frente e nenhum dia para trás. Consulta é
   compromisso futuro: uma roda que aceita o ano passado convida ao erro
   de digitação que depois vira "consulta há 300 dias" na Home. */
const MESES_A_FRENTE = 18;

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
  const [dia, setDia] = React.useState(inicial.getDate());
  const [mes, setMes] = React.useState(inicial.getMonth());
  const [ano, setAno] = React.useState(inicial.getFullYear());
  const [tipo, setTipo] = React.useState(S.consult.type || TIPOS[0]);

  /* As três rodas se limitam entre si: num mês de trinta dias o 31 não
     existe, e no mês de hoje os dias que já passaram também não. Sem
     isso, a roda oferece uma data que o botão depois recusa — que é o
     jeito mais irritante de um formulário dizer não. */
  const primeiroDoMes = ano === hoje.getFullYear() && mes === hoje.getMonth() ? hoje.getDate() : 1;
  const ultimoDoMes = new Date(ano, mes + 1, 0).getDate();
  const noLimite = ano === limite.getFullYear() && mes === limite.getMonth();
  const maiorDia = noLimite ? Math.min(ultimoDoMes, limite.getDate()) : ultimoDoMes;

  const dias = Array.from(
    { length: Math.max(1, maiorDia - primeiroDoMes + 1) },
    (_, k) => ({ v: primeiroDoMes + k, label: String(primeiroDoMes + k) }),
  );
  const meses = MO_LONG
    .map((m, k) => ({ v: k, label: m }))
    .filter((x) => {
      const depoisDeHoje = ano > hoje.getFullYear() || x.v >= hoje.getMonth();
      const antesDoLimite = ano < limite.getFullYear() || x.v <= limite.getMonth();
      return depoisDeHoje && antesDoLimite;
    });
  const anos = Array.from(
    { length: limite.getFullYear() - hoje.getFullYear() + 1 },
    (_, k) => ({ v: hoje.getFullYear() + k, label: String(hoje.getFullYear() + k) }),
  );

  const salvar = () => {
    update((s: any) => {
      s.consult = { t: +startOfDay(new Date(ano, mes, dia)), type: tipo, doctor: s.profile.doctor };
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
      <TelaInterna titulo="Anotar consulta">
        <Titulao titulo="Quem marca é a clínica" lead="A sua agenda vem da equipe que acompanha o seu tratamento." />
        <Aviso
          ic="cal"
          titulo="As datas chegam da clínica"
          texto="Para remarcar ou desmarcar, fale com a equipe — o que mudar lá aparece aqui."
        />
        <View />
      </TelaInterna>
    );
  }

  return (
    <TelaInterna titulo="Anotar consulta">
      <Titulao
        titulo={jaTem ? 'A sua próxima consulta' : 'Anote a sua consulta'}
        lead="Com a data aqui, avisamos quando ela estiver perto e deixamos o resumo pronto para você levar."
      />

      <Campo rotulo="Quando">
        <Row gap={10}>
          <Roda largura={78} itens={dias} valor={Math.min(Math.max(dia, primeiroDoMes), maiorDia)} onEscolhe={setDia} />
          <Roda
            largura={142} itens={meses} valor={mes}
            onEscolhe={(v) => {
              setMes(v);
              setDia((d) => Math.min(d, new Date(ano, v + 1, 0).getDate()));
            }}
          />
          <Roda
            largura={90} itens={anos} valor={ano}
            onEscolhe={(v) => {
              setAno(v);
              setMes((m) => (v === hoje.getFullYear() ? Math.max(m, hoje.getMonth()) : m));
            }}
          />
        </Row>
      </Campo>

      <Campo rotulo="Como vai ser">
        <Opcoes>
          {TIPOS.map((t) => (
            <Opc key={t} label={t} on={tipo === t} onPress={() => setTipo(t)} />
          ))}
        </Opcoes>
      </Campo>

      {temAcompanhamento(S) ? (
        <Txt v="caption" c={c.tx3} style={{ paddingHorizontal: 2 }}>
          Com {S.profile.doctor || S.profile.clinic}.
        </Txt>
      ) : null}

      {/* A expectativa, dita antes do botão: isto não avisa ninguém do
          outro lado, e não aparece em agenda nenhuma além desta. */}
      <Aviso
        ic="shield"
        titulo="A data fica com você"
        texto="Anotar aqui não avisa o consultório nem entra no calendário do telefone. Somos nós que passamos a saber que a consulta está chegando."
      />

      <Botao label={jaTem ? 'Salvar' : 'Anotar consulta'} onPress={salvar} />

      {jaTem ? <Botao label="Não tenho consulta marcada" onPress={tirar} tom="fantasma" /> : null}

      <View />
    </TelaInterna>
  );
}
