import React from 'react';
import { useRouter } from 'expo-router';
import { useStore } from '../logic/store';
import { M, lastInjection, siteLabel, penStock, nextInjectionDate } from '../logic/derive';
import { MO_LONG, DOW_PT, diffDays, now, nf } from '../logic/time';
import { TelaInterna, Confirmacao, Cartao, Linha, Botao } from '../ui/internas';

/* ============================================================
   APLICAÇÃO REGISTRADA

   A tela de fim de fluxo. O que ela NÃO faz é comemorar: aplicar a caneta
   é obrigação semanal, não conquista, e um confete aqui envelhece na
   terceira semana.

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
  const dow = DOW_PT[d.getDay()];
  const quando = `${dow.charAt(0).toUpperCase()}${dow.slice(1)}, ${d.getDate()} de ${MO_LONG[d.getMonth()]}`;
  const dowProx = DOW_PT[prox.getDay()];

  const acabou = est.left <= 0;

  return (
    <TelaInterna
      titulo="Aplicação"
      rodape={
        <>
          <Botao label="Voltar para a Jornada" onPress={() => router.replace('/(tabs)/jornada' as any)} />
          {acabou ? <Botao label="Registrar nova caneta" tom="fantasma" onPress={() => router.push('/caneta-nova' as any)} /> : null}
        </>
      }
    >
      <Confirmacao
        titulo="Aplicação registrada"
        texto={`${quando} · ${med.label} ${nf(li?.dose ?? S.profile.dose, 1).replace('.', ',')} ${med.unit} · ${li ? siteLabel(li.site).toLowerCase() : '—'}.`}
      >
        <Cartao>
          <Linha
            titulo="Próxima dose"
            sub={`${dowProx.charAt(0).toUpperCase()}${dowProx.slice(1)}, ${prox.getDate()} de ${MO_LONG[prox.getMonth()]} · lembrete às ${S.reminders?.dose?.hour ?? 9}h`}
            selo={dias === 0 ? 'hoje' : `${dias} dias`}
            seloTom="neutra"
            seta={false}
          />
          <Linha
            titulo="Caneta"
            sub={acabou
              ? `${est.total} de ${est.total} doses usadas · abrir a próxima`
              : `${est.total - est.left} de ${est.total} doses usadas`}
            selo={acabou ? 'fim' : `restam ${est.left}`}
            seloTom="neutra"
            seta={false}
          />
        </Cartao>
      </Confirmacao>
    </TelaInterna>
  );
}
