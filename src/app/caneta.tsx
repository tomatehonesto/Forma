import React from 'react';
import { View } from 'react-native';
import { useRouter } from 'expo-router';
import { useStore } from '../logic/store';
import { canetaAtual, siteLabel, M } from '../logic/derive';
import { FORMAS, formaDe, concordar, oA } from '../logic/formas';
import { doseTxt, fmtDate, fmtPeriodo, dataComDiaDaSemana, dataLonga, maiuscula } from '../logic/time';
import {
  TelaInterna, Titulao, Bloco, Progresso, Grade2, Metrica, Aviso,
  Sanfona, SanfonaLinha, Botao,
} from '../ui/internas';
import { T } from '../textos';

/* ⚠️ É FUNÇÃO, e não constante de módulo: ela lê o catálogo, e constante
   de módulo congela o idioma no import. */
const K = () => T.tratamento.telaCaneta;

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
  const vocab = FORMAS()[forma];
  const aberto = concordar(forma, K().abertoM, K().abertoF);
  const med = M(S);
  const atual = k.atual;

  const usadas = atual?.usadas ?? 0;
  const total = atual?.total ?? 4;
  const dose = atual?.dose ?? S.profile.dose;

  return (
    <TelaInterna
      titulo={T.tratamento.telaAplicacoes.medicamento}
      acao={concordar(forma, K().novoM, K().novoF)}
      onAcao={() => router.push('/caneta-nova' as any)}
      rodape={<Botao label={K().lembrarRenovar} onPress={() => router.push('/lembretes' as any)} />}
    >
      <Titulao
        titulo={K().tituloDose(med.label, doseTxt(dose), med.unit)}
        lead={atual?.abertaEm
          ? K().leadAberto(maiuscula(vocab.recipiente), aberto, dataLonga(atual.abertaEm), total, vocab.recipiente)
          : K().leadSemAberto(concordar(forma, K().nenhumM, K().nenhumF), vocab.recipiente, aberto, total)}
      />

      <Progresso
        label={K().dosesUsadas}
        valor={K().usadasDe(usadas, total)}
        pct={(usadas / total) * 100}
        nota={K().ultimaDose(concordar(forma, K().desteM, K().desteF), vocab.recipiente, dataComDiaDaSemana(k.cobreAte))}
      />

      <Grade2>
        {/* ⚠️ "NÃO INFORMADA" É UM ESTADO, e não um vazio. Manipulado não
            tem prazo de bula, e quem não respondeu no registro do
            recipiente fica sem — o cartão diz isso com todas as letras em
            vez de mostrar "0 dias", que seria o aplicativo afirmando que a
            coisa venceu no dia em que foi aberta. */}
        {/* ⚠️⚠️ OS DOIS CARTÕES SÃO SOBRE DATAS, e escreviam frases.

            `para` sai em semibold e corpo de título — é o lugar do VALOR.
            Aqui ia "vence 4 out" e "cobre até 4 out": frases inteiras
            nesse peso, que quebravam em duas linhas e faziam os dois
            cartões vizinhos parecerem desalinhados. O verbo subiu para o
            rótulo, onde ele sempre coube, e embaixo ficou a data sozinha.

            ⚠️ SEM PRAZO CONHECIDO O CARTÃO MUDA DE ASSUNTO. Ele deixa de
            ser sobre uma data — não há —, e passa a ser sobre a ausência
            dela: o rótulo volta a falar da validade, o valor é "não
            informada" com todas as letras, e a nota diz de quem é a
            resposta. "0 dias" ou um travessão seriam o aplicativo
            afirmando que a coisa venceu no dia em que foi aberta. */}
        <Metrica
          ic="clock"
          nome={k.vence ? K().venceEm : K().validadeApos(aberto)}
          selo={k.validadeDias ? K().validadeDias(k.validadeDias) : undefined}
          seloTom="neutra"
          para={k.vence ? fmtDate(k.vence) : K().validadeNaoInformada}
          nota={k.vence ? undefined : K().quemPreparaDefine}
        />
        <Metrica
          ic="pill"
          nome={K().receitaAte}
          selo={K().receitaSemanas(Math.round(k.semanas))}
          para={fmtDate(k.cobreAte)}
        />
      </Grade2>

      {/* A caneta pode vencer antes de a última dose sair dela — com 14 dias
          de validade e quatro doses semanais, isso é a regra, não a exceção.
          O aviso constata e para por aí: o que fazer com a dose que sobra é
          conversa de médico, não decisão de app. */}
      {k.venceAntesDoFim ? (
        <Aviso
          ic="clock"
          titulo={K().venceAntes(`${maiuscula(oA(forma))} ${vocab.recipiente}`)}
          /* Só chega aqui com `vence` preenchido, e `vence` exige
             `validadeDias` — mas o tipo não sabe disso. */
          texto={K().venceAntesTexto(med.label, k.validadeDias ?? 0, total, aberto)}
        />
      ) : null}

      {!k.verdict.good ? (
        <Aviso
          ic="pill"
          titulo={K().momentoDeRenovar}
          texto={K().renovarTexto(Math.round(k.semanas))}
        />
      ) : null}

      <Bloco titulo={K().historico(vocab.plural)}>
        <Sanfona>
          {k.lista.map((p) => (
            <SanfonaLinha
              key={p.id}
              titulo={K().tituloDose(p.label, doseTxt(p.dose), p.unit)}
              /* ⚠️ "encerrada" ESTAVA NO FEMININO FIXO, concordando com
                 "caneta" numa lista que também mostra frasco e blíster. */
              selo={p.estado === 'uso' ? K().emUso : concordar(forma, K().encerradoM, K().encerradoF)}
              seloTom="neutra"
              sub={p.estado === 'uso'
                ? K().itemEmUso(maiuscula(aberto), fmtDate(p.abertaEm!), p.usadas, p.total)
                : K().itemEncerrado(fmtPeriodo(new Date(p.abertaEm!), new Date(p.ultimaEm!)), p.usadas, p.total)}
              itens={p.aplicacoes.map((a) => [fmtDate(a.t), T.comum.noMeio(siteLabel(a.site))] as [string, string])}
            />
          ))}
        </Sanfona>
      </Bloco>

      {/* Espaço para o rodapé não cobrir a última linha da sanfona aberta. */}
      <View />
    </TelaInterna>
  );
}
