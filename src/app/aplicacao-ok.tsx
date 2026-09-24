import React from 'react';
import { useRouter } from 'expo-router';
import { useStore } from '../logic/store';
import { M, lastInjection, siteLabel, penStock, nextInjectionDate } from '../logic/derive';
import { diffDays, now, doseTxt, dataComDiaDaSemana, maiuscula } from '../logic/time';
import { FORMAS, formaDe, umOutro } from '../logic/formas';
import { SheetScreen } from '../ui/kit';
import { Confirmacao, Cartao, Linha, Botao } from '../ui/internas';
import { T } from '../textos';

/* ⚠️ É FUNÇÃO, e não constante de módulo: ela lê o catálogo, e constante
   de módulo congela o idioma no import. */
const K = () => T.tratamento.telaAplicacaoOk;

/* ============================================================
   APLICAÇÃO REGISTRADA

   A folha de fim de fluxo. O que ela NÃO faz é comemorar: aplicar a dose
   é obrigação da semana, não conquista, e um confete aqui envelhece na
   terceira vez.

   ⚠️ ERA TELA CHEIA. Ela abre logo depois de uma folha fechar, e uma
   folha que dá lugar a uma tela cheia é a pessoa saindo do contexto para
   ler "pronto" — o /registro-ok, que faz o mesmo trabalho para as outras
   capturas, já era folha.

   O que ela faz é responder as duas perguntas que vêm logo depois de
   apertar salvar — quando é a próxima e se a caneta aguenta — e devolver
   a pessoa para a Jornada. O caminho de volta é `replace` na origem: o
   formulário sai da pilha, então o botão de voltar do sistema não
   reabre um registro que já foi salvo.
   ============================================================ */

export default function AplicacaoOk() {
  const S = useStore((s) => s.S);
  const router = useRouter();

  const med = M(S);
  const li = lastInjection(S);
  const est = penStock(S);
  const prox = nextInjectionDate(S);
  const dias = Math.max(0, diffDays(prox, now()));

  const d = li ? new Date(li.t) : now();
  const quando = maiuscula(dataComDiaDaSemana(d));

  const acabou = est.left <= 0;
  const vocab = FORMAS()[formaDe(S)];
  /* "outra caneta", "another pen" — quem concorda é o idioma, e o inglês
     devolve "another" sem olhar o gênero. As palavras estavam aqui, em
     português, dentro de `concordar(forma, 'novo', 'nova')`. */
  const outro = `${umOutro(formaDe(S))} ${vocab.recipiente}`;

  return (
    <SheetScreen
      /* Sem título no cabeçalho: a Confirmacao logo abaixo já diz
         "Dose registrada" em h2, centralizado, embaixo do visto. Dois
         títulos iguais a dois centímetros um do outro é o cabeçalho
         cobrando espaço para não acrescentar nada. */
      onClose={() => router.replace('/(tabs)/jornada' as any)}
      rodape={
        <>
          <Botao label={K().voltarParaJornada} onPress={() => router.replace('/(tabs)/jornada' as any)} />
          {acabou && vocab.injetavel
            ? <Botao label={K().registrarOutro(outro)} tom="fantasma" onPress={() => router.push('/caneta-nova' as any)} />
            : null}
        </>
      }
    >
      <Confirmacao
        /* ⚠️ ESTA LINHA SAÍA METADE EM CADA IDIOMA: "Shot registrada". O
           substantivo vinha de FORMAS, traduzido, e o particípio estava
           escrito aqui, em português. */
        titulo={K().registrada(maiuscula(vocab.acao))}
        /* O local só entra na frase de quem injeta — ver logic/formas. */
        texto={`${quando} · ${med.label} ${doseTxt(li?.dose ?? S.profile.dose)} ${med.unit}${vocab.injetavel && li ? ` · ${siteLabel(li.site).toLowerCase()}` : ''}.`}
      >
        <Cartao>
          <Linha
            titulo={K().proximaDose}
            /* A HORA DO LEMBRETE SAIU DAQUI. Havia um horário só por
              assunto, e esta linha o citava; agora podem ser vários
              alertas de dose, com horas diferentes, e escolher um deles
              para escrever aqui seria inventar. A data da próxima
              aplicação é o que esta confirmação tem a dizer. */
            sub={maiuscula(dataComDiaDaSemana(prox))}
            /* ⚠️ "1 dias" era raro e virou rotina: com medicamento oral a
               cadência é DIÁRIA, e a próxima dose é sempre amanhã. */
            selo={dias === 0 ? K().hoje : K().emDias(dias)}
            seloTom="neutra"
            seta={false}
          />
          {vocab.injetavel ? (
            <Linha
              titulo={maiuscula(vocab.recipiente)}
              /* ⚠️ O QUE RESTA, e não o que foi usado — a mesma conta da
                 linha do medicamento em /aplicacoes. E sem selo: ele
                 dizia "restam 2" ao lado de um sub que dizia "2 de 4
                 doses usadas", duas versões do mesmo número na mesma
                 linha. */
              sub={acabou ? K().acabou(outro) : K().restamDoses(est.left)}
              selo={acabou ? K().seloFim : undefined}
              seloTom="neutra"
              seta={false}
            />
          ) : null}
        </Cartao>
      </Confirmacao>
    </SheetScreen>
  );
}
