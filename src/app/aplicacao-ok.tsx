import React from 'react';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useStore } from '../logic/store';
import { M, lastInjection, siteLabel, penStock, nextInjectionDate, doseDiaria } from '../logic/derive';
import { diffDays, now, doseTxt, dataComDiaDaSemana, maiuscula } from '../logic/time';
import { FORMAS, formaDe, umOutro, oA, localDaDose } from '../logic/formas';
import { SheetScreen } from '../ui/kit';
import { Confirmacao, Cartao, Linha, Botao } from '../ui/internas';
import { T } from '../textos';

/* ⚠️ É FUNÇÃO, e não constante de módulo: ela lê o catálogo, e constante
   de módulo congela o idioma no import. */
const K = () => T.tratamento.telaAplicacaoOk;

/* ============================================================
   DOSE REGISTRADA

   A folha de fim de fluxo. O que ela NÃO faz é comemorar: aplicar a dose
   é obrigação da semana, não conquista, e um confete aqui envelhece na
   terceira vez.

   ⚠️ ERA TELA CHEIA. Ela abre logo depois de uma folha fechar, e uma
   folha que dá lugar a uma tela cheia é a pessoa saindo do contexto para
   ler "pronto" — o /registro-ok, que faz o mesmo trabalho para as outras
   capturas, já era folha.

   O que ela faz é responder as duas perguntas que vêm logo depois de
   apertar salvar — quando é a próxima e se a caneta aguenta — e devolver
   a pessoa para a Jornada. Na dose diária, só a segunda, e só na dose
   injetada: a próxima é sempre amanhã (ver `diaria`, logo abaixo).

   O caminho de volta é `dismissTo` nas abas: o formulário sai da pilha,
   então o botão de voltar do sistema não reabre um registro que já foi
   salvo.

   ⚠️ E NÃO `replace`. As abas já estão embaixo destas folhas; `replace`
   trocava a folha por um SEGUNDO conjunto de abas em cima do primeiro, e
   o gesto de voltar levava de uma Home a outra Home. `dismissTo` desce
   até as abas que já existem — e, quando não há nenhuma na pilha (quem
   chega do cadastro), faz o mesmo que o `replace` fazia.
   ============================================================ */

export default function AplicacaoOk() {
  const S = useStore((s) => s.S);
  const router = useRouter();

  const med = M(S);
  /* ⚠️ A DOSE QUE ACABOU DE SER SALVA, PELO INSTANTE DELA (`?t=`), e não
     a "última" (01/10/2026). `lastInjection` passou a ser a de data mais
     recente (logic/derive, parte B1) — e, depois de um registro
     retroativo, a mais recente é outra: a folha confirmava "Segunda, 28"
     para quem acabou de registrar a quinta passada. O registro manda o
     instante que gravou; sem ele (quem chega do cadastro), a mais
     recente, como sempre foi. */
  const { t } = useLocalSearchParams<{ t?: string }>();
  const li = (t != null && (S.injections as any[]).find((i) => i.t === Number(t))) || lastInjection(S);
  const est = penStock(S);
  const prox = nextInjectionDate(S);
  const dias = Math.max(0, diffDays(prox, now()));

  const d = li ? new Date(li.t) : now();
  const quando = maiuscula(dataComDiaDaSemana(d));

  const acabou = est.left <= 0;
  const vocab = FORMAS()[formaDe(S)];
  /* O local pela DOSE, e não pela forma de agora nem pelo campo gravado:
     é vazio quando ela não foi injetada (logic/formas). */
  const local = localDaDose(S, li);
  /* "outra caneta", "another pen" — quem concorda é o idioma, e o inglês
     devolve "another" sem olhar o gênero. As palavras estavam aqui, em
     português, dentro de `concordar(forma, 'novo', 'nova')`. */
  const outro = `${umOutro(formaDe(S))} ${vocab.recipiente}`;
  /* ⚠️ NA DOSE DIÁRIA NÃO HÁ "PRÓXIMA DOSE" (01/10/2026, achado da
     revisão). Seria "Amanhã · em 1 dia" depois de toda dose — a contagem
     regressiva que a parte B tira de quem toma todo dia, e que sobrou
     aqui. E com ela fora, o cartão de quem toma comprimido ficaria vazio
     (a linha do recipiente é só da dose injetada): o cartão só existe
     quando tem uma linha. */
  const diaria = doseDiaria(S);
  const temCartao = !diaria || vocab.injetavel;

  return (
    <SheetScreen
      /* Sem título no cabeçalho: a Confirmacao logo abaixo já diz
         "Dose registrada" em h2, centralizado, embaixo do visto. Dois
         títulos iguais a dois centímetros um do outro é o cabeçalho
         cobrando espaço para não acrescentar nada. */
      onClose={() => router.dismissTo('/(tabs)/jornada' as any)}
      rodape={
        <>
          <Botao label={K().voltarParaJornada(T.comum.abas.jornada)} onPress={() => router.dismissTo('/(tabs)/jornada' as any)} />
          {acabou && vocab.injetavel
            ? <Botao label={K().registrarOutro(outro)} tom="fantasma" onPress={() => router.push('/caneta-nova' as any)} />
            : null}
        </>
      }
    >
      <Confirmacao
        /* ⚠️ ESTA LINHA SAÍA METADE EM CADA IDIOMA: "Shot registrada". O
           substantivo vinha de FORMAS, traduzido, e o particípio estava
           escrito aqui, em português.

           ⚠️ E É "DOSE REGISTRADA" PARA TODO MUNDO (01/10/2026): `acao`
           passou a ser "dose" nas quatro formas — ver textos/formas. */
        titulo={K().registrada(maiuscula(vocab.acao))}
        /* O local só entra na frase da dose injetada — ver logic/formas,
           `localDaDose`. Ele lia `li.site` cru, guardado pela forma de
           agora; a regra passou a ser a mesma de toda tela que mostra o
           local de uma dose gravada: decide a dose, pelo `med` dela.

           ⚠️ E ELE NÃO DESCE PARA MINÚSCULA À MÃO. O `.toLowerCase()` que
           morava aqui escrevia "oberschenkel (re.)" em alemão, onde todo
           substantivo é maiúsculo. `comum.noMeio` é quem sabe: minúscula
           em português, o nome intacto em alemão. */
        texto={`${quando} · ${med.label} ${doseTxt(li?.dose ?? S.profile.dose)} ${med.unit}${local ? ` · ${T.comum.noMeio(siteLabel(local))}` : ''}.`}
      >
        {temCartao ? (
        <Cartao>
          {!diaria ? (
          <Linha
            titulo={K().proximaDose}
            /* A HORA DO LEMBRETE SAIU DAQUI. Havia um horário só por
              assunto, e esta linha o citava; agora podem ser vários
              alertas de dose, com horas diferentes, e escolher um deles
              para escrever aqui seria inventar. A data da próxima
              aplicação é o que esta confirmação tem a dizer. */
            sub={maiuscula(dataComDiaDaSemana(prox))}
            /* ⚠️ "1 dias" era raro e virou rotina: com medicamento oral a
               cadência é DIÁRIA, e a próxima dose é sempre amanhã. Desde
               01/10/2026 a dose diária nem chega aqui (ver `diaria`), mas
               uma dose registrada com atraso ainda pode deixar a próxima a
               um dia. */
            selo={dias === 0 ? K().hoje : K().emDias(dias)}
            seloTom="neutra"
            seta={false}
          />
          ) : null}
          {vocab.injetavel ? (
            <Linha
              titulo={maiuscula(vocab.recipiente)}
              /* ⚠️ O QUE RESTA, e não o que foi usado — a mesma conta da
                 linha do medicamento em /aplicacoes. E sem selo: ele
                 dizia "restam 2" ao lado de um sub que dizia "2 de 4
                 doses usadas", duas versões do mesmo número na mesma
                 linha. */
              /* ⚠️ SEM RECIPIENTE REGISTRADO, "RESTAM 4 DOSES" ERA O RECUO
                 DA CONTA escrito como fato — logo depois de uma dose. A
                 linha pede o registro, e o toque leva a ele. */
              sub={!est.registrada
                ? T.tratamento.registreORecipiente(`${oA(formaDe(S))} ${vocab.recipiente}`)
                : acabou ? K().acabou(outro) : K().restamDoses(est.left)}
              selo={est.registrada && acabou ? K().seloFim : undefined}
              seloTom="neutra"
              seta={!est.registrada}
              onPress={!est.registrada ? () => router.push('/caneta-nova' as any) : undefined}
            />
          ) : null}
        </Cartao>
        ) : null}
      </Confirmacao>
    </SheetScreen>
  );
}
