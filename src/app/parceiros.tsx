import React from 'react';
import { View } from 'react-native';
import { useStore } from '../logic/store';
import { clinicaConectada } from '../logic/derive';
import { Txt } from '../ui/kit';
import { TelaInterna, Titulao, Cartao, Linha, Aviso } from '../ui/internas';
import { useTheme } from '../ui/useTheme';

/* ============================================================
   MÉDICOS PARCEIROS — o que muda, e como se entra

   ⚠️ ESTA TELA NÃO É A VITRINE DE VOLTA.

   A vitrine antiga era a aba Cuidado inteira de quem não tinha médico:
   um anúncio no lugar do tratamento, com três promessas e nenhuma porta.
   Aqui é o contrário — a pessoa já viu a aba dela funcionando e veio
   parar neste lugar porque quis saber o que existe além. A diferença
   entre oferta e obstrução é essa: quem chega aqui escolheu chegar.

   ⚠️ E NÃO HÁ LISTA DE MÉDICOS, porque não há de onde tirá-la. Um
   diretório de clínicas é dado de servidor, e inventar três nomes de
   exemplo numa tela de saúde seria o pior tipo de mentira: a que a pessoa
   pode tentar ligar. O que dá para dizer com verdade é o que muda com o
   vínculo e por onde ele começa — que é pela clínica, e não por aqui.

   O QUE ELA DELIBERADAMENTE NÃO DIZ é preço. Os Termos já descrevem a
   isenção de quem chega por profissional parceiro, mas a assinatura não
   existe no código (PENDENCIAS.md, item 5): anunciar "sem custo" hoje
   implica um custo que ninguém cobra ainda. Entra junto com a cobrança.
   ============================================================ */

const MUDA: [string, string, string][] = [
  ['companion', 'Conversa com a equipe', 'Mensagens entre as consultas, sem precisar remarcar para tirar uma dúvida.'],
  ['doc', 'O seu resumo chega lá', 'Um toque envia peso, adesão, sintomas e exames — organizados, do jeito que a consulta usa.'],
  ['pill', 'Receita e protocolo', 'Pedir renovação e receber o protocolo da semana dentro do aplicativo.'],
  ['cal', 'A agenda vem pronta', 'As consultas aparecem aqui sem você precisar anotar nada.'],
];

export default function Parceiros() {
  const S = useStore((s) => s.S);
  const { c } = useTheme();
  const conectada = clinicaConectada(S);

  if (conectada) {
    return (
      <TelaInterna titulo="Médicos parceiros">
        <Titulao titulo="Você já está com uma clínica parceira" lead="Tudo o que está nesta lista já vale para você." />
        <Cartao>
          {MUDA.map(([ic, t, sub]) => <Linha key={t} ic={ic} titulo={t} sub={sub} seta={false} />)}
        </Cartao>
        <View />
      </TelaInterna>
    );
  }

  return (
    <TelaInterna titulo="Médicos parceiros">
      <Titulao
        titulo="Médicos parceiros"
        lead="Algumas clínicas acompanham o tratamento por aqui junto com você. O aplicativo funciona inteiro sem isso — o que muda é o que passa a ser possível com a sua equipe dentro dele."
      />

      <Cartao>
        {MUDA.map(([ic, t, sub]) => <Linha key={t} ic={ic} titulo={t} sub={sub} seta={false} />)}
      </Cartao>

      {/* ⚠️ A DIREÇÃO IMPORTA, e é o contrário do que um botão sugeriria.
          Não existe busca de clínica aqui dentro: quem começa o vínculo é
          a clínica, com um código. Uma tela que desse a entender que a
          pessoa procura e escolhe prometeria um diretório que não existe
          — e mandaria embora, frustrada, quem tocasse. */}
      <Aviso
        ic="info"
        titulo="O convite vem da clínica"
        texto="Não dá para procurar uma clínica por aqui. Quem já se trata numa clínica parceira recebe dela um código, e é ele que liga as duas pontas. Se a sua clínica ainda não usa o aplicativo, vale comentar com ela."
      />

      <Txt v="caption" c={c.tx3} style={{ paddingHorizontal: 2, lineHeight: 20 }}>
        Sem vínculo, nada do seu diário sai do aparelho — e nada muda no que você já registra.
      </Txt>

      <View />
    </TelaInterna>
  );
}
