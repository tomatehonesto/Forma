import React from 'react';
import { View, Linking } from 'react-native';
import { useStore } from '../logic/store';
import {
  PLANOS, historicoDeCobranca, assinaturaAtual, isento, reais, HISTORICO_NA_LOJA, NOME_DA_LOJA,
} from '../logic/assinatura';
import { TelaInterna, Cartao, Linha } from '../ui/internas';
import { Txt, Vazio } from '../ui/kit';
import { useTheme } from '../ui/useTheme';
import { MO_LONG } from '../logic/time';

/* ============================================================
   HISTÓRICO DE COBRANÇA — o extrato

   ⚠️ ELE É CÓPIA, E NÃO DOCUMENTO. Quem emite recibo é a App Store ou o
   Google Play; esta lista é a leitura dos recibos deles, mostrada aqui
   porque ninguém quer sair do aplicativo para saber quanto pagou no mês
   passado. A tela diz de onde vem o número e leva até a fonte.

   Um aplicativo que apresenta a própria lista como se fosse a fatura cria
   a discussão mais cara que existe: a pessoa comparando dois números que
   vieram de lugares diferentes e acreditando no errado.

   ⚠️ E HOJE ELE ESTÁ VAZIO, PORQUE NÃO HÁ COBRANÇA. `historicoDeCobranca`
   devolve uma lista vazia enquanto não houver recibo para ler, e a tela
   mostra o vazio — que é verdade. Três linhas de exemplo aqui seriam a
   pior mentira possível: um extrato falso.

   ⚠️ O VAZIO TEM DOIS MOTIVOS, e eles não são a mesma coisa. Quem é Care
   nunca vai ter cobrança nenhuma, e dizer "ainda" a ela é prometer uma
   fatura que não vem. Quem é Personal ainda não tem, e o "ainda" é a
   palavra certa.
   ============================================================ */

const dataLonga = (t: number) => {
  const d = new Date(t);
  return `${d.getDate()} de ${MO_LONG[d.getMonth()]} de ${d.getFullYear()}`;
};

export default function Cobrancas() {
  const S = useStore((s) => s.S);
  const { c } = useTheme();

  const linhas = historicoDeCobranca(S);
  /* ⚠️ "Nunca" e "ainda não" não são a mesma frase, e quem decide qual
     vale é a existência de uma assinatura, não só o vínculo: alguém pode
     ser Care E estar pagando — assinou antes, entrou na clínica depois. A
     essa pessoa, dizer que vínculo não gera cobrança seria negar a
     cobrança que ela tem. */
  const ehIsenta = isento(S) && !assinaturaAtual(S);

  return (
    <TelaInterna titulo="Histórico de cobrança">
      {linhas.length === 0 ? (
        <Cartao>
          <Vazio
            ic="doc"
            titulo={ehIsenta ? 'Nenhuma cobrança' : 'Nenhuma cobrança ainda'}
            texto={ehIsenta
              ? 'O acesso vem do vínculo com a clínica, e vínculo não gera cobrança. Se um dia ele terminar, avisamos antes de qualquer valor aparecer aqui.'
              : 'Quando a assinatura começar, cada cobrança aparece aqui com a data e o valor.'}
          />
        </Cartao>
      ) : (
        <Cartao>
          {linhas.map((l) => {
            const plano = PLANOS.find((x) => x.id === l.plano);
            return (
              <Linha
                key={l.t}
                titulo={l.estado === 'teste' ? 'Início do teste grátis' : reais(l.valor)}
                sub={`${dataLonga(l.t)}${plano ? ` · plano ${plano.nome.toLowerCase()}` : ''}`}
                selo={l.estado === 'reembolsada' ? 'Reembolsada' : undefined}
                seloTom="neutra"
                seta={false}
              />
            );
          })}
        </Cartao>
      )}

      {/* ⚠️ A FONTE FICA DITA, e a porta para ela também. Mesmo com a lista
          cheia, o recibo que vale é o da loja — e é lá que se pede
          reembolso, se contesta um valor e se tira a nota. Esconder isso
          transformaria esta tela no lugar onde a pessoa vem reclamar de
          uma cobrança que o aplicativo não fez. */}
      <Cartao>
        <Linha
          ic="send"
          titulo={`Recibos na ${NOME_DA_LOJA}`}
          sub="O comprovante oficial de cada cobrança"
          onPress={() => Linking.openURL(HISTORICO_NA_LOJA)}
        />
      </Cartao>

      <Txt v="caption" c={c.tx3} style={{ paddingHorizontal: 2, lineHeight: 20 }}>
        A cobrança é feita pela {NOME_DA_LOJA}, e o recibo é dela. O que aparece aqui é a leitura
        desses recibos — se algum valor não bater, o que vale é o da loja.
      </Txt>
    </TelaInterna>
  );
}
