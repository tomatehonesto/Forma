import React from 'react';
import { View } from 'react-native';
import { useRouter } from 'expo-router';
import { useStore } from '../logic/store';
import { canetaAtual, siteLabel, M } from '../logic/derive';
import { MO, MO_LONG, DOW_PT, nf } from '../logic/time';
import {
  TelaInterna, Titulao, Bloco, Progresso, Grade2, Metrica, Aviso,
  Sanfona, SanfonaLinha, Botao,
} from '../ui/internas';

/* ============================================================
   CANETA E RECEITA

   Duas contagens diferentes moram aqui, e confundi-las é o erro clássico
   deste tipo de tela:

     doses da caneta — quantas aplicações ainda cabem no dispositivo
     validade        — quantos dias a caneta dura depois de aberta

   Uma caneta pode ter dose sobrando e estar vencida. A grade de dois
   coloca as duas lado a lado justamente para que a pessoa leia as duas.

   A terceira contagem é a receita, e ela é a única que exige AÇÃO fora do
   app: pedir renovação leva dias. Por isso ela vira aviso com texto, e não
   mais um número na grade.
   ============================================================ */

const n1 = (x: number) => nf(x, 1).replace('.', ',');
const curto = (t: number | Date) => { const d = new Date(t); return `${d.getDate()} ${MO[d.getMonth()]}`; };
const longo = (t: number | Date) => { const d = new Date(t); return `${d.getDate()} de ${MO_LONG[d.getMonth()]}`; };
const porExtenso = (d: Date) => `${DOW_PT[d.getDay()]}, ${d.getDate()} de ${MO_LONG[d.getMonth()]}`;

export default function Caneta() {
  const S = useStore((s) => s.S);
  const router = useRouter();
  const k = canetaAtual(S);
  const med = M(S);
  const atual = k.atual;

  const usadas = atual?.usadas ?? 0;
  const total = atual?.total ?? 4;
  const dose = atual?.dose ?? S.profile.dose;

  return (
    <TelaInterna
      titulo="Caneta e receita"
      acao="Nova"
      onAcao={() => router.push('/caneta-nova' as any)}
      rodape={<Botao label="Lembrar de renovar" onPress={() => router.push('/lembretes' as any)} />}
    >
      <Titulao
        titulo={`${med.label} ${n1(dose)} ${med.unit}`}
        lead={atual?.abertaEm
          ? `Caneta aberta em ${longo(atual.abertaEm)} · ${total} doses por caneta`
          : `Nenhuma caneta aberta · ${total} doses por caneta`}
      />

      <Progresso
        label="Doses usadas"
        valor={`${usadas} de ${total}`}
        pct={(usadas / total) * 100}
        nota={`Última dose desta caneta: ${porExtenso(k.cobreAte)}`}
      />

      <Grade2>
        <Metrica
          ic="clock"
          nome="Validade após aberta"
          selo={`${k.validadeDias} dias`}
          seloTom="neutra"
          para={k.vence ? `vence ${curto(k.vence)}` : '—'}
        />
        <Metrica
          ic="pill"
          nome="Receita atual"
          selo={`${Math.round(k.semanas)} semanas`}
          para={`cobre até ${curto(k.cobreAte)}`}
        />
      </Grade2>

      {!k.verdict.good ? (
        <Aviso
          ic="pill"
          titulo="Momento de pedir a renovação"
          texto={`Sua receita cobre cerca de ${Math.round(k.semanas)} ${Math.round(k.semanas) === 1 ? 'semana' : 'semanas'}. Pedir agora evita ficar sem a caneta entre uma consulta e outra.`}
        />
      ) : null}

      <Bloco titulo="Histórico de canetas">
        <Sanfona>
          {k.lista.map((p) => (
            <SanfonaLinha
              key={p.id}
              titulo={`${p.label} ${n1(p.dose)} ${p.unit}`}
              selo={p.estado === 'uso' ? 'em uso' : 'encerrada'}
              seloTom="neutra"
              sub={p.estado === 'uso'
                ? `Aberta em ${curto(p.abertaEm!)} · ${p.usadas} de ${p.total} doses`
                : `${curto(p.abertaEm!)} a ${curto(p.ultimaEm!)} · ${p.usadas} de ${p.total} doses`}
              itens={p.aplicacoes.map((a) => [curto(a.t), siteLabel(a.site).toLowerCase()] as [string, string])}
            />
          ))}
        </Sanfona>
      </Bloco>

      {/* Espaço para o rodapé não cobrir a última linha da sanfona aberta. */}
      <View />
    </TelaInterna>
  );
}
