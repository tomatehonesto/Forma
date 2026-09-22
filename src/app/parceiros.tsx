import React from 'react';
import { View } from 'react-native';
import { useStore } from '../logic/store';
import { clinicaConectada } from '../logic/derive';
import { normalizarConvite, vinculoDoConvite } from '../logic/assinatura';
import { Txt } from '../ui/kit';
import { TelaInterna, Titulao, Cartao, Linha, Aviso, Campo, Texto, Botao } from '../ui/internas';
import { useTheme } from '../ui/useTheme';

import { T } from '../textos';

/* ⚠️ É FUNÇÃO, porque lê o catálogo, e a lista abaixo é constante de
   módulo. Ver src/textos/README e scripts/idioma-congelado.mjs. */
const P = () => T.assinatura.parceiros;

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
  ['companion', P().conversaTitulo, P().conversaTexto],
  ['doc', P().resumoTitulo, P().resumoTexto],
  ['pill', P().receitaTitulo, P().receitaTexto],
  ['cal', P().agendaTitulo, P().agendaTexto],
];

export default function Parceiros() {
  const S = useStore((s) => s.S);
  const update = useStore((s) => s.update);
  const { c } = useTheme();
  const conectada = clinicaConectada(S);

  const guardado = ((S.profile as any).convite as string) || '';
  const [codigo, setCodigo] = React.useState(guardado);
  const [trocando, setTrocando] = React.useState(!guardado);

  /* ⚠️ GUARDAR O CÓDIGO NÃO ENCOSTA EM MAIS NADA.

     É a regra da casa levada ao caso que mais a tenta: virar cliente de
     uma clínica parceira muda quem paga, e é exatamente aí que um
     aplicativo se sente autorizado a "começar do zero com a equipe". Não
     começa. Peso, aplicações, check-ins, sintomas, exames, fotos e
     anotações são da pessoa, e ela chegou com eles.

     Esta função escreve DOIS campos, e nenhum deles é de ninguém mais.
     Se um dia ela crescer para além disso, a pergunta a fazer é: o que
     estou apagando de alguém que só digitou oito letras? */
  const guardar = () => {
    const v = normalizarConvite(codigo);
    update((s: any) => {
      s.profile.convite = v;
      /* ⚠️ O VÍNCULO SAI DAQUI JUNTO, e não de uma confirmação que nunca
         chega. O porquê está inteiro em assinatura.ts. */
      s.profile.vinculo = vinculoDoConvite(v);
    });
    setCodigo(v);
    setTrocando(false);
  };

  if (conectada) {
    return (
      <TelaInterna titulo={P().titulo}>
        <Titulao titulo={P().jaTemTitulo} lead={P().jaTemLead} />
        <Cartao>
          {MUDA.map(([ic, t, sub]) => <Linha key={t} ic={ic} titulo={t} sub={sub} seta={false} />)}
        </Cartao>
        <View />
      </TelaInterna>
    );
  }

  return (
    <TelaInterna titulo={P().titulo}>
      <Titulao
        titulo={P().titulo}
        lead={P().lead}
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
        titulo={P().conviteTitulo}
        texto={P().conviteTexto}
      />

      {/* ---- o código ----

          ⚠️ A PORTA PRECISA SER PERMANENTE, e até agora ela passava uma
          vez: o cadastro perguntava o código e nunca mais. Quem chegou
          por conta própria e passou a se tratar numa clínica parceira —
          que é o caminho mais comum dos que existem — não tinha por onde
          entrar com o convite depois.

          E O CAMPO LIGA NA HORA. Ele já disse "a conferência acontece
          depois", e isso era a pessoa esperando uma clínica que não tem
          nada a conferir: o código veio dela. Digitar é entrar. */}
      {guardado && !trocando ? (
        <Campo rotulo={P().codigoRotulo} ajuda={P().codigoAjudaAtual}>
          <Txt v="h2" style={{ letterSpacing: 2 }}>{guardado}</Txt>
          <Botao label={P().usarOutro} onPress={() => { setCodigo(''); setTrocando(true); }} tom="fantasma" />
        </Campo>
      ) : (
        <Campo rotulo={P().temCodigoRotulo} ajuda={P().temCodigoAjuda}>
          <Texto valor={codigo} onChange={(v) => setCodigo(v.toUpperCase())} placeholder={P().digite} linhas={1} />
          <Botao label={P().confirmar} onPress={guardar} desligado={codigo.trim().length < 4} />
        </Campo>
      )}

      <Txt v="caption" c={c.tx3} style={{ paddingHorizontal: 2, lineHeight: 20 }}>
        Sem vínculo, nada do seu diário sai do aparelho — e nada muda no que você já registra.
        Se o vínculo vier, ele também não recomeça nada: tudo o que você registrou continua aqui.
      </Txt>

      <View />
    </TelaInterna>
  );
}
