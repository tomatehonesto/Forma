import React from 'react';
import { useRouter } from 'expo-router';
import { useStore } from '../logic/store';
import { M, lastInjection, siteLabel, penStock, nextInjectionDate } from '../logic/derive';
import { diffDays, now, nf, dataComDiaDaSemana, maiuscula } from '../logic/time';
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
  const quando = maiuscula(dataComDiaDaSemana(d));

  const acabou = est.left <= 0;

  return (
    <TelaInterna
      titulo="Aplicação"
      /* Sem Titulão: aqui a barra é o único lugar onde a tela se nomeia. */
      tituloFixo
      rodape={
        <>
          <Botao label="Voltar para a Jornada" onPress={() => router.replace('/(tabs)/jornada' as any)} />
          {acabou ? <Botao label="Registrar nova caneta" tom="fantasma" onPress={() => router.push('/caneta-nova' as any)} /> : null}
        </>
      }
    >
      <Confirmacao
        titulo="Aplicação registrada"
        texto={`${quando} · ${med.label} ${nf(li?.dose ?? S.profile.dose, 1)} ${med.unit} · ${li ? siteLabel(li.site).toLowerCase() : '—'}.`}
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
