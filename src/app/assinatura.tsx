import React from 'react';
import { Linking } from 'react-native';
import { useRouter } from 'expo-router';
import { useStore } from '../logic/store';
import {
  PLANOS, assinaturaAtual, isento, reais, GESTAO_NA_LOJA, NOME_DA_LOJA,
} from '../logic/assinatura';
import { TEM_REDE_PARCEIRA } from '../logic/mercado';
import { TelaInterna, Titulao, Cartao, Linha, Aviso, Bloco } from '../ui/internas';
import { Txt } from '../ui/kit';
import { useTheme } from '../ui/useTheme';
import { MO_LONG } from '../logic/time';

/* ============================================================
   SUA ASSINATURA — o que você tem, quanto custa, e onde se mexe

   ⚠️ ELA EXISTIA COMO UM ATALHO PARA /planos, e não é a mesma coisa.

   A tela de planos é uma vitrine: ela vende. Esta responde "o que eu
   tenho hoje e o que acontece se eu não fizer nada" — que é a pergunta
   que manda gente para o suporte em todo aplicativo de assinatura, e a
   única que a vitrine não responde. Mandar a pessoa para o paywall para
   descobrir o próprio estado é oferecer de novo o que ela já tem.

   ⚠️ TRÊS ESTADOS, E DOIS DELES SÃO ALCANÇÁVEIS HOJE.

   · isenta — tem vínculo com clínica parceira e não paga;
   · sem assinatura — nem vínculo nem assinatura;
   · assinante — impossível por enquanto, porque `assinar()` recusa.

   O terceiro está desenhado assim mesmo, e lê de `assinaturaAtual()`, que
   devolve nulo até a loja entrar. Não é tela de mentira: é a forma que
   recebe o dado no dia em que ele existir, sem nenhuma outra mudar. O que
   ela NÃO faz é inventar o dado — data de renovação vem como nulo e a
   linha some, em vez de mostrar uma data bonita e falsa.

   ⚠️ E NÃO HÁ BOTÃO DE CANCELAR. A razão está inteira em
   src/logic/assinatura.ts: quem cobra é a loja, e é lá que se cancela. O
   que esta tela faz é abrir a porta certa e dizer de quem ela é.
   ============================================================ */

const dataLonga = (t: number) => {
  const d = new Date(t);
  return `${d.getDate()} de ${MO_LONG[d.getMonth()]} de ${d.getFullYear()}`;
};

export default function Assinatura() {
  const S = useStore((s) => s.S);
  const router = useRouter();
  const { c } = useTheme();

  const go = (to: string) => () => router.push(to as any);

  const ehIsenta = isento(S);
  const atual = assinaturaAtual(S);
  const vinculo = (S.profile as any).vinculo as { desde?: number; convite?: string } | null;
  const convite = ((S.profile as any).convite as string) || vinculo?.convite || '';
  const clinica = S.profile.clinic || 'a clínica que acompanha você';

  /* ---------------------------------------------------------- */
  /* ISENTA — o acesso vem do vínculo                            */
  /* ---------------------------------------------------------- */
  if (ehIsenta) {
    return (
      <TelaInterna titulo="Sua assinatura">
        <Titulao
          titulo="Você não paga pelo aplicativo"
          lead={`O acesso vem do seu vínculo com ${clinica}, e vale enquanto ele durar.`}
        />

        <Cartao>
          <Linha
            ic="steth"
            titulo={clinica}
            sub={vinculo?.desde ? `Vinculada desde ${dataLonga(vinculo.desde)}` : 'Clínica parceira'}
            selo="Ativo"
            seloTom="lima"
            seta={false}
          />
          {/* O código só aparece se existir. A semente tem vínculo sem
              convite — ela não passou por essa porta —, e uma linha
              "Código " com o campo vazio seria o app mostrando a falta de
              um dado como se fosse um dado. */}
          {convite ? (
            <Linha ic="lock" titulo={convite} sub="O convite que ligou as duas pontas" seta={false} />
          ) : null}
        </Cartao>

        {/* A MESMA PROMESSA DA TELA DE PLANOS, PALAVRA POR PALAVRA. Ela é
            um compromisso, não uma frase de tela: se as duas se
            afastarem, uma delas vira a versão errada para quem leu a
            outra. */}
        <Aviso
          ic="info"
          titulo="Se o vínculo terminar"
          texto="Avisamos antes de qualquer cobrança. Nada do que você registrou se perde, e o aplicativo não some do seu aparelho de um dia para o outro."
        />

        <Bloco titulo="O que custaria">
          <Cartao>
            <Linha
              ic="spark"
              titulo="Ver os planos"
              sub={`De ${reais(menorPorMes())} por mês, se um dia você precisar assinar`}
              onPress={go('/planos')}
            />
          </Cartao>
        </Bloco>
      </TelaInterna>
    );
  }

  /* ---------------------------------------------------------- */
  /* ASSINANTE — hoje inalcançável; a forma espera o recibo      */
  /* ---------------------------------------------------------- */
  if (atual) {
    const plano = PLANOS.find((x) => x.id === atual.plano)!;
    return (
      <TelaInterna titulo="Sua assinatura">
        <Titulao
          titulo={`Plano ${plano.nome.toLowerCase()}`}
          lead={`${reais(plano.preco)} ${plano.periodo}.`}
        />

        <Cartao>
          {atual.emTeste ? (
            <Linha
              ic="spark"
              titulo="Você está no teste grátis"
              sub={atual.renovaEm ? `A primeira cobrança é em ${dataLonga(atual.renovaEm)}` : undefined}
              selo="Grátis"
              seloTom="lima"
              seta={false}
            />
          ) : null}
          {atual.renovaEm ? (
            <Linha
              ic="cal"
              titulo={atual.emTeste ? 'Primeira cobrança' : 'Renova em'}
              sub={dataLonga(atual.renovaEm)}
              seta={false}
            />
          ) : null}
        </Cartao>

        <Cartao>
          <Linha
            ic="send"
            titulo={`Gerenciar na ${NOME_DA_LOJA}`}
            sub="Cancelar, trocar de plano ou ver a fatura"
            onPress={() => Linking.openURL(GESTAO_NA_LOJA)}
          />
        </Cartao>

        <Txt v="caption" c={c.tx3} style={{ paddingHorizontal: 2, lineHeight: 20 }}>
          A cobrança é feita pela {NOME_DA_LOJA}, e é lá que ela se cancela — o aplicativo não
          consegue fazer isso por você. Cancelar mantém o acesso até o fim do período já pago.
        </Txt>
      </TelaInterna>
    );
  }

  /* ---------------------------------------------------------- */
  /* SEM NADA — nem vínculo, nem assinatura                      */
  /* ---------------------------------------------------------- */
  return (
    <TelaInterna titulo="Sua assinatura">
      <Titulao
        titulo="Você ainda não assinou"
        lead="O aplicativo está inteiro do jeito que está. Quando a assinatura existir, é por aqui que ela aparece."
      />

      {/* ⚠️ ESTA FRASE É A TELA INTEIRA SENDO HONESTA, e ela sai no dia em
          que a cobrança entrar. Dizer "você ainda não assinou" sem dizer
          que ninguém pode assinar deixa a pessoa procurando o botão que
          não existe — e a resposta "a cobrança não está ligada" é melhor
          do que qualquer tela de erro que ela encontraria tentando. */}
      <Aviso
        ic="info"
        titulo="A cobrança ainda não está ligada"
        texto="Esta tela existe, a assinatura ainda não. Nada foi cobrado de você, e nada vai ser sem aviso."
      />

      <Bloco titulo="O que existe hoje">
        <Cartao>
          <Linha
            ic="spark"
            titulo="Ver os planos"
            sub={`O que entra, e quanto vai custar — a partir de ${reais(menorPorMes())} por mês`}
            onPress={go('/planos')}
          />
          {TEM_REDE_PARCEIRA ? (
            <Linha
              ic="steth"
              titulo="Tenho um código de convite"
              sub="Quem se trata numa clínica parceira não paga"
              onPress={go('/parceiros')}
            />
          ) : null}
        </Cartao>
      </Bloco>
    </TelaInterna>
  );
}

/* O menor preço por mês entre os planos — é o número que responde "quanto
   custa" sem obrigar a pessoa a abrir a vitrine para descobrir. Sai da
   lista e não de uma constante escrita à mão: mudar preço em
   assinatura.ts não pode deixar uma frase velha viva aqui. */
function menorPorMes() {
  return Math.min(...PLANOS.map((p) => (p.sufixo === '/mês' ? p.preco : p.outraUnidade.valor)));
}
