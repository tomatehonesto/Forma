import React from 'react';
import { useRouter } from 'expo-router';
import { useStore } from '../logic/store';
import { M, lastInjection, siteLabel, penStock, nextInjectionDate } from '../logic/derive';
import { diffDays, now, nf, dataComDiaDaSemana, maiuscula } from '../logic/time';
import { FORMAS, concordar, formaDe, oA } from '../logic/formas';
import { SheetScreen } from '../ui/kit';
import { Confirmacao, Cartao, Linha, Botao } from '../ui/internas';

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

  return (
    <SheetScreen
      /* Sem título no cabeçalho: a Confirmacao logo abaixo já diz
         "Dose registrada" em h2, centralizado, embaixo do visto. Dois
         títulos iguais a dois centímetros um do outro é o cabeçalho
         cobrando espaço para não acrescentar nada. */
      onClose={() => router.replace('/(tabs)/jornada' as any)}
      rodape={
        <>
          <Botao label="Voltar para a Jornada" onPress={() => router.replace('/(tabs)/jornada' as any)} />
          {acabou && vocab.injetavel
            ? <Botao label={`Registrar ${concordar(formaDe(S), 'novo', 'nova')} ${vocab.recipiente}`} tom="fantasma" onPress={() => router.push('/caneta-nova' as any)} />
            : null}
        </>
      }
    >
      <Confirmacao
        titulo={`${maiuscula(vocab.acao)} registrada`}
        /* O local só entra na frase de quem injeta — ver logic/formas. */
        texto={`${quando} · ${med.label} ${nf(li?.dose ?? S.profile.dose, 1)} ${med.unit}${vocab.injetavel && li ? ` · ${siteLabel(li.site).toLowerCase()}` : ''}.`}
      >
        <Cartao>
          <Linha
            titulo="Próxima dose"
            /* A HORA DO LEMBRETE SAIU DAQUI. Havia um horário só por
              assunto, e esta linha o citava; agora podem ser vários
              alertas de dose, com horas diferentes, e escolher um deles
              para escrever aqui seria inventar. A data da próxima
              aplicação é o que esta confirmação tem a dizer. */
            sub={maiuscula(dataComDiaDaSemana(prox))}
            /* ⚠️ "1 dias" era raro e virou rotina: com medicamento oral a
               cadência é DIÁRIA, e a próxima dose é sempre amanhã. */
            selo={dias === 0 ? 'hoje' : dias === 1 ? '1 dia' : `${dias} dias`}
            seloTom="neutra"
            seta={false}
          />
          {vocab.injetavel ? (
            <Linha
              titulo={maiuscula(vocab.recipiente)}
              sub={acabou
                ? `${est.total} de ${est.total} doses usadas · abrir ${oA(formaDe(S))} ${concordar(formaDe(S), 'próximo', 'próxima')}`
                : `${est.total - est.left} de ${est.total} doses usadas`}
              selo={acabou ? 'fim' : `restam ${est.left}`}
              seloTom="neutra"
              seta={false}
            />
          ) : null}
        </Cartao>
      </Confirmacao>
    </SheetScreen>
  );
}
