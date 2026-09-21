import React from 'react';
import { View } from 'react-native';
import { useRouter } from 'expo-router';
import { useStore } from '../logic/store';
import { canetaAtual, siteLabel, M } from '../logic/derive';
import { FORMAS, formaDe, concordar, oA } from '../logic/formas';
import { nf, fmtDate, dataComDiaDaSemana, dataLonga, maiuscula } from '../logic/time';
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


export default function Caneta() {
  const S = useStore((s) => s.S);
  const router = useRouter();
  const k = canetaAtual(S);
  /* ⚠️ ESTA TELA FALAVA "CANETA" TREZE VEZES, para quem pode estar usando
     um frasco. Ela foi tocada na fase da validade, e "o que se toca, se
     conserta" — deixar o cabeçalho dizendo "Caneta aberta em" na mesma
     tela onde acabei de ensinar o aplicativo a perguntar o prazo de um
     frasco seria incoerência na distância de dois centímetros.

     O resto do aplicativo ainda diz "caneta" em trinta e poucos arquivos.
     Está no PENDENCIAS, e é varredura própria. */
  const forma = formaDe(S);
  const vocab = FORMAS[forma];
  const aberto = concordar(forma, 'aberto', 'aberta');
  const med = M(S);
  const atual = k.atual;

  const usadas = atual?.usadas ?? 0;
  const total = atual?.total ?? 4;
  const dose = atual?.dose ?? S.profile.dose;

  return (
    <TelaInterna
      titulo={`${maiuscula(vocab.recipiente)} e receita`}
      acao="Nova"
      onAcao={() => router.push('/caneta-nova' as any)}
      rodape={<Botao label="Lembrar de renovar" onPress={() => router.push('/lembretes' as any)} />}
    >
      <Titulao
        titulo={`${med.label} ${nf(dose, 1)} ${med.unit}`}
        lead={atual?.abertaEm
          ? `${maiuscula(vocab.recipiente)} ${aberto} em ${dataLonga(atual.abertaEm)} · ${total} doses por ${vocab.recipiente}`
          : `${concordar(forma, 'Nenhum', 'Nenhuma')} ${vocab.recipiente} ${aberto} · ${total} doses por ${vocab.recipiente}`}
      />

      <Progresso
        label="Doses usadas"
        valor={`${usadas} de ${total}`}
        pct={(usadas / total) * 100}
        nota={`Última dose ${concordar(forma, 'deste', 'desta')} ${vocab.recipiente}: ${dataComDiaDaSemana(k.cobreAte)}`}
      />

      <Grade2>
        {/* ⚠️ "NÃO INFORMADA" É UM ESTADO, e não um vazio. Manipulado não
            tem prazo de bula, e quem não respondeu no registro do
            recipiente fica sem — o cartão diz isso com todas as letras em
            vez de mostrar "0 dias", que seria o aplicativo afirmando que a
            coisa venceu no dia em que foi aberta. */}
        <Metrica
          ic="clock"
          nome={`Validade após ${aberto}`}
          selo={k.validadeDias ? `${k.validadeDias} dias` : 'não informada'}
          seloTom="neutra"
          para={k.vence ? `vence ${fmtDate(k.vence)}` : 'quem prepara define o prazo'}
        />
        <Metrica
          ic="pill"
          nome="Receita atual"
          selo={`${Math.round(k.semanas)} semanas`}
          para={`cobre até ${fmtDate(k.cobreAte)}`}
        />
      </Grade2>

      {/* A caneta pode vencer antes de a última dose sair dela — com 14 dias
          de validade e quatro doses semanais, isso é a regra, não a exceção.
          O aviso constata e para por aí: o que fazer com a dose que sobra é
          conversa de médico, não decisão de app. */}
      {k.venceAntesDoFim ? (
        <Aviso
          ic="clock"
          titulo={`${maiuscula(oA(forma))} ${vocab.recipiente} vence antes de acabar`}
          /* Só chega aqui com `vence` preenchido, e `vence` exige
             `validadeDias` — mas o tipo não sabe disso. */
          texto={`${med.label} dura ${k.validadeDias ?? 0} dias depois de aberta, e nesse prazo não cabem as ${total} doses. Vale confirmar com quem acompanha você o que fazer com o que sobrar.`}
        />
      ) : null}

      {!k.verdict.good ? (
        <Aviso
          ic="pill"
          titulo="Momento de pedir a renovação"
          texto={`Sua receita cobre cerca de ${Math.round(k.semanas)} ${Math.round(k.semanas) === 1 ? 'semana' : 'semanas'}. Pedir agora evita ficar sem ${oA(forma)} ${vocab.recipiente} entre uma consulta e outra.`}
        />
      ) : null}

      <Bloco titulo={`Histórico de ${vocab.plural}`}>
        <Sanfona>
          {k.lista.map((p) => (
            <SanfonaLinha
              key={p.id}
              titulo={`${p.label} ${nf(p.dose, 1)} ${p.unit}`}
              selo={p.estado === 'uso' ? 'em uso' : 'encerrada'}
              seloTom="neutra"
              sub={p.estado === 'uso'
                ? `${maiuscula(aberto)} em ${fmtDate(p.abertaEm!)} · ${p.usadas} de ${p.total} doses`
                : `${fmtDate(p.abertaEm!)} a ${fmtDate(p.ultimaEm!)} · ${p.usadas} de ${p.total} doses`}
              itens={p.aplicacoes.map((a) => [fmtDate(a.t), siteLabel(a.site).toLowerCase()] as [string, string])}
            />
          ))}
        </Sanfona>
      </Bloco>

      {/* Espaço para o rodapé não cobrir a última linha da sanfona aberta. */}
      <View />
    </TelaInterna>
  );
}
