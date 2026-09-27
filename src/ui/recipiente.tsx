import React from 'react';
import { Campo, Opcoes, Opc, Regua } from './internas';
import { T } from '../textos';

/* ⚠️ É FUNÇÃO, e não constante de módulo: ela lê o catálogo, e constante
   de módulo congela o idioma no import. */
const K = () => T.tratamento.telaRecipienteNovo;

/* ============================================================
   A VALIDADE DO RECIPIENTE, QUANDO O CATÁLOGO NÃO SABE

   Mora aqui, e não numa das telas, porque são duas: a folha de nova
   caneta e a folha de registrar a dose, que registra o primeiro
   recipiente junto com ela. A mesma pergunta nas duas, com a mesma faixa.

   ⚠️⚠️ A FAIXA DA PERGUNTA DE VALIDADE É ESCOLHA MINHA, e está no
   PENDENCIAS junto com os limiares de platô.

   Sete dias porque nada desta classe se guarda aberto por menos de uma
   semana; noventa porque nada se guarda por mais de três meses. Não
   consegui derivar isso de nada: os prazos que o catálogo conhece — 14,
   21, 30 e 56 — são de produto industrializado, e um manipulado não
   herda nenhum deles.

   O ponto de partida da régua é o meio da faixa, e é só isso: o lugar
   onde o controle abre. Não é recomendação, e a régua só aparece depois
   de a pessoa dizer que TEM a informação.
   ============================================================ */
const VALIDADE_MIN = 7;
const VALIDADE_MAX = 90;
const VALIDADE_MEIO = Math.round((VALIDADE_MIN + VALIDADE_MAX) / 2);

/* ⚠️ A PERGUNTA É OPCIONAL, E COMEÇA EM "NÃO SEI".

   Quem recebe um manipulado nem sempre tem o rótulo à mão na hora de
   registrar, e travar o registro nisso seria cobrar um dado para deixar a
   pessoa guardar outro. Sem resposta, o aplicativo simplesmente não fala
   de vencimento para ela — que é melhor do que mandar descartar o que
   está bom ou autorizar o que não está.

   `null` é "não sabemos", e é o estado inicial de quem usa: nada se grava
   sem um toque. A régua só aparece depois do toque em "está no rótulo":
   assim nenhum número chega à tela antes de alguém pedir por ele. */
export function PerguntaDaValidade({ aberto, valor, onMuda }: {
  /** "aberta" ou "aberto", já concordado com o recipiente */
  aberto: string;
  valor: number | null;
  onMuda: (v: number | null) => void;
}) {
  return (
    <Campo rotulo={K().validadeRotulo(aberto)} ajuda={K().validadeAjuda}>
      <Opcoes>
        <Opc label={K().naoSei} on={valor == null} onPress={() => onMuda(null)} />
        <Opc label={K().estaNoRotulo} on={valor != null} onPress={() => onMuda(valor ?? VALIDADE_MEIO)} />
      </Opcoes>
      {valor != null ? (
        <Regua
          min={VALIDADE_MIN} max={VALIDADE_MAX} passo={1} tracoCada={7} casas={0}
          esp={7} salto={1}
          valor={valor} unidade={K().dias} onEscolhe={onMuda}
        />
      ) : null}
    </Campo>
  );
}
