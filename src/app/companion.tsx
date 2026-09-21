import React, { useEffect, useMemo, useRef, useState } from 'react';
import { View, Pressable, ScrollView, TextInput, KeyboardAvoidingView, Platform, StyleSheet, useWindowDimensions } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useStore } from '../logic/store';
import type { State } from '../logic/seed';
import {
  M, curWeight, lostKg, lostPct, adesao, hungerForecast, nextInjectionDate,
  lastInjection, siteLabel, waterMlToday, litros, companionSuggestions, companionMemoria,
  temConsulta, clinicaConectada, startWeight, variacaoDe,
} from '../logic/derive';
import { now, diffDays, fmtDate, relDay, nf, kg } from '../logic/time';
import { Txt, Row, CircleBtn, RichDoc } from '../ui/kit';
import { EstrelaIA } from '../ui/marca';
import { Icon } from '../ui/Icon';
import { useTheme } from '../ui/useTheme';
import { useDitado, ditadoDisponivel } from '../ui/useDitado';
import { radius, font } from '../theme';

/* ============================================================
   MORPHI — a tela para onde tudo aponta

   Insights abre com ele, a Jornada oferece "perguntar", Cuidado prepara
   a consulta com ele. Era a única peça central ainda na linguagem antiga:
   balões com contorno cinza, chips genéricas, cabeçalho de lista de
   contatos.

   A IDENTIDADE

   O cabeçalho é a mesma peça do hero do Insights, com o mesmo orbe no
   mesmo lugar da composição. Lá ele é a única marca do Morphi na tela e
   tocá-lo abre esta; aqui ele reaparece idêntico, então o toque deixa de
   ser navegação e vira aproximação — a tela não abre outra coisa, abre
   mais perto da mesma coisa.

   A conversa acontece sobre a folha clara que sobe por cima da imagem,
   com o mesmo raio e a mesma sobreposição de 36 px da Home e do Insights.

   Escuro só no alto, e não na tela toda, por uma razão de leitura: fio
   de conversa é texto longo, e texto longo em branco sobre escuro cansa.
   A cor marca quem está falando; a folha é onde se lê.

   O LIMITE

   O app não prescreve. Isso não é rodapé jurídico, é o produto: a linha
   "não substitui sua equipe" fica no cabeçalho, visível o tempo inteiro,
   e não numa tela de termos. Quem confunde as duas coisas está desenhando
   outro produto.

   O QUE AINDA É FALSO

   companionReply é uma cadeia de if/else sobre palavras-chave. As
   respostas são ancoradas em dados reais — peso, adesão, ciclo, exames —
   mas a compreensão é fingida: quem escrever "e se eu parar?" cai no
   fallback. Nada nesta tela disfarça isso, e o "pensando" existe para dar
   ritmo à espera, não para simular processamento que não acontece.
   ============================================================ */

const PAD = 24;

/* ⚠️ MORAVAM AQUI a sobreposição de 36 px e a fração 0,504 — a altura que
   a folha clara subia por cima da imagem escura, e onde a base da esfera
   caía na peça de 853×1844. As duas foram embora com o cabeçalho do orbe,
   que é o hero do Insights e não desta tela. Quem for reconstruir aquele
   desenho encontra a conta no histórico deste arquivo. */

/* ⚠️ `fonte` É A PROCEDÊNCIA DA RESPOSTA, e ela não é enfeite.

   Cada resposta daqui lê dados reais da pessoa — as pesagens, os
   check-ins, as aplicações, os exames. Até aqui isso ficava invisível: a
   frase chegava pronta e podia tanto ter lido o histórico dela quanto ter
   saído de um texto genérico sobre GLP-1, e quem lê não tinha como saber
   qual das duas.

   O selo embaixo diz de onde veio, e ABRE a tela onde aquele dado mora —
   quem não acredita na frase pode ir conferir o número. É a mesma regra
   que vale para a meta anotada da equipe e para as descobertas da Home:
   afirmação sobre os dados de alguém anda junto com a origem.

   ⚠️ E É OPCIONAL DE PROPÓSITO. A saudação e a resposta de "não entendi"
   não leem dado nenhum — pôr um selo nelas seria inventar uma
   procedência para um texto que não tem. */
type Msg = {
  who: 'me' | 'ai';
  text: string;
  mini?: string;
  fonte?: { rotulo: string; to: string };
};

/* porta verbatim do protótipo — respostas heurísticas ancoradas nos dados reais */
/* ⚠️ A DRA. HELENA ESTAVA ESCRITA À MÃO AQUI DENTRO.

   Três respostas prontas citavam a médica da semente pelo nome, e uma
   quarta montava o resumo da consulta sem perguntar se havia consulta —
   com o estado zerado, ela respondia "pra sua  há vinte mil dias com a ".
   Enquanto a única médica possível era a da semente, as duas coisas
   passavam; com a ficha de quem acompanha, a primeira pessoa que anotar
   o próprio médico ouve o companion falar de outra.

   Quem acompanha sai do perfil, e some da frase quando não há ninguém —
   um assistente que inventa um nome é pior do que um que não cita
   nenhum. */
function companionReply(S: State, text: string): Msg {
  const quemAcompanha = S.profile.doctor || S.profile.clinic;
  const t = text.toLowerCase();
  const has = (...k: string[]) => k.some((x) => t.includes(x));
  const med = M(S);
  if (has('evolu', 'progress', 'como estou', 'como vou', 'peso')) {
    const days = diffDays(now(), new Date(S.profile.startT));
    return { who: 'ai', text: `Nos <b>${days} dias</b> de tratamento você saiu de ${kg(S.profile.startWeight)} para <b>${kg(curWeight(S))} kg</b> — menos ${kg(lostKg(S))} kg (${nf(lostPct(S), 1)}%). Já passou dos 5% de perda, uma marca clínica que reduz riscos. Sua adesão às aplicações está em ${adesao(S)}%.`, fonte: { rotulo: 'Suas pesagens', to: '/evolucao' }, mini: `Ritmo saudável e constante: cerca de ${kg(lostKg(S) / (days / 7))} kg por semana. O peso é um sinal entre vários — energia, sono e exames também contam.` };
  }
  if (has('consulta', 'prepar', 'médic', 'doutora', 'helena')) {
    /* ⚠️ ESTA RESPOSTA ERA UMA FRASE E UM BLOCO DE BULLETS À MÃO, com
       "•" digitados dentro de uma string e \n no meio. Ela sempre foi um
       documento — só não tinha como ser desenhada como um, porque o
       balão não sabia o que fazer com uma lista.

       Agora é ela quem mostra o RichDoc inteiro: manchete, lista,
       segunda manchete. A nota de rodapé fica no `mini`, que continua
       sendo a voz mais baixa. */
    return { who: 'ai', fonte: { rotulo: 'Seu tratamento', to: '/resumo-medico' }, text: [
      temConsulta(S)
        ? `Montei um resumo para a sua ${S.consult.type.toLowerCase()} <b>${relDay(new Date(S.consult.t))}</b>${S.consult.doctor ? ` com ${S.consult.doctor}` : ''}.`
        : `Montei um resumo do seu tratamento para levar na consulta.`,
      '',
      '## O que levar',
      `- Peso: <b>${kg(curWeight(S))} kg</b> (${variacaoDe(curWeight(S) - startWeight(S), 'kg').delta} / ${nf(Math.abs(lostPct(S)), 1)}%) — [ver a linha](/evolucao)`,
      `- Dose: ${med.label} ${nf(S.profile.dose, S.profile.dose % 1 ? 1 : 0)} ${med.unit}, adesão ${adesao(S)}% — [ver as aplicações](/aplicacoes)`,
      '- Sintomas: náusea leve nos dias pós-aplicação, já melhorando',
      '',
      '## Perguntas que valem a pena',
      '- Manter ou ajustar a dose?',
      '- O ritmo está dentro do esperado para esta fase?',
      '- Há exame a repetir antes da próxima consulta?',
    ].join('\n'), mini: `Levo isso organizado, mas quem lê os seus números é ${quemAcompanha || 'quem acompanha você'}.` };
  }
  if (has('fome', 'saciedade', 'vontade de comer')) {
    const hf = hungerForecast(S);
    return { who: 'ai', text: `A fome acompanha o nível da ${med.mol.toLowerCase()} no seu corpo. Logo após a aplicação ele está alto e a saciedade é maior; <b>perto da próxima dose ele cai</b> e a fome volta. ${hf ? `No seu caso, esse ponto mais baixo é ${hf.inDays <= 1 ? 'nestes dias' : `em ${hf.inDays} dias`}.` : ''}`, fonte: { rotulo: 'Suas aplicações', to: '/aplicacoes' }, mini: `Ajuda nesses dias: priorizar proteína, hidratar bem e não pular refeições. Se a fome estiver difícil de controlar, vale anotar para conversar ${quemAcompanha ? `com ${quemAcompanha}` : 'na consulta'} — quem ajusta dose é quem acompanha você.` };
  }
  if (has('náusea', 'nausea', 'enjoo', 'enjôo', 'mal estar', 'sintoma')) {
    return { who: 'ai', text: `Sentir náusea leve, principalmente nos primeiros dias após aumentar a dose, é comum e costuma <b>diminuir com o tempo</b> — seus próprios registros já mostram isso melhorando.`, fonte: { rotulo: 'Seus sintomas', to: '/sintomas' }, mini: `O que costuma ajudar: refeições menores, evitar frituras e comer devagar. Se ficar forte, persistente ou vier com vômito, ${clinicaConectada(S) ? 'me avisa que eu destaco isso para a sua equipe' : 'procure quem acompanha você — isso não espera a próxima consulta'}.` };
  }
  if (has('dose', 'aplica', 'aplicar', 'injeç', 'caneta')) {
    const nd = nextInjectionDate(S); const li = lastInjection(S);
    return { who: 'ai', text: `Sua próxima aplicação é <b>${relDay(nd)}</b> (${fmtDate(nd)}), ${med.label} ${nf(S.profile.dose, S.profile.dose % 1 ? 1 : 0)} ${med.unit}. Sugiro alternar o local — da última vez foi ${li ? siteLabel(li.site) : 'abdômen'}.`, fonte: { rotulo: 'Suas aplicações', to: '/aplicacoes' }, mini: `Importante: eu não altero doses nem protocolos. Qualquer mudança é decisão de ${quemAcompanha || 'quem acompanha você'}. Posso te lembrar no dia e registrar a aplicação.` };
  }
  if (has('água', 'agua', 'hidrat')) {
    return { who: 'ai', text: `Hoje você registrou <b>${litros(waterMlToday(S))} de ${litros((S.profile as any).targets.waterMl)} L</b>. Reparei que aos fins de semana a hidratação cai — e a água ajuda bastante com saciedade e com a náusea.`, fonte: { rotulo: 'Sua hidratação', to: '/agua' }, mini: `Quer que eu te lembre de beber água nos sábados e domingos?` };
  }
  if (has('proteína', 'proteina')) {
    return { who: 'ai', text: `Proteína é uma das suas metas — e você vem cumprindo bem. Manter a ingestão alta durante a perda de peso <b>protege sua massa magra</b>, o que sustenta seu metabolismo.`, fonte: { rotulo: 'Sua alimentação', to: '/alimentacao' }, mini: `Média recente perto de 90 g/dia. Boas fontes práticas: ovos, iogurte natural, frango, peixe e leguminosas.` };
  }
  if (has('meta', 'objetivo', 'jeans', 'roupa', 'energia', 'dormir', 'sono')) {
    return { who: 'ai', text: `Suas metas vão além do peso, e é assim que deve ser. Sono e energia estão sendo acompanhados nos seus check-ins, e o peso segue uma tendência constante. Transformação é o conjunto, não só a balança.`, fonte: { rotulo: 'Suas metas', to: '/metas' }, mini: `Quer adicionar uma nova meta, além da balança? Posso te levar até lá.` };
  }
  if (has('exame', 'hba1c', 'colesterol', 'glicemia', 'ldl', 'hdl', 'triglic', 'vitamina', 'ferritina', 'tsh', 'insulina', 'creatinina')) {
    /* Os marcadores viram termos que abrem a tela deles. É o que o
       sublinhado promete na referência, e aqui ele só existe porque o
       destino existe: /exames?m=X abre o marcador. */
    return { who: 'ai', fonte: { rotulo: 'Seus exames', to: '/exames' }, text: [
      'Seus exames vêm melhorando junto com o tratamento.',
      '',
      '## Os que mais mudaram',
      '- [HbA1c](/exames?m=HbA1c): <b>6,3 → 5,6%</b>, fora da faixa de risco',
      '- [LDL](/exames?m=LDL) e [triglicerídeos](/exames?m=Triglicerídeos): em queda',
      '- [HDL](/exames?m=HDL) e [vitamina D](/exames?m=Vitamina D): em alta',
    ].join('\n'), mini: `Toque num marcador para ver a linha dele e o que ele significa. Não substituo a leitura da sua médica.` };
  }
  if (has('medicament', 'remédio', 'remedio', 'tirzep', 'semaglut', 'bula', 'como funciona')) {
    return { who: 'ai', text: `${med.label} tem como princípio ativo a <b>${med.mol.toLowerCase()}</b>, aplicada ${med.cad === 'weekly' ? '1×/semana' : 'diariamente'}. Ela aumenta a saciedade e ajuda no controle da glicose.`, fonte: { rotulo: 'Sua medicação', to: '/protocolo' }, mini: `Efeitos comuns no começo: náusea leve e menos apetite. Dúvidas sobre dose ou troca de medicação são sempre com ${quemAcompanha || 'quem acompanha você'}.` };
  }
  if (has('protocolo', 'missão', 'missao', 'tarefa', 'checklist')) {
    const p = S.protocol, done = p.tasks.filter((x: any) => x.done).length;
    const next = p.tasks.find((x: any) => !x.done);
    return { who: 'ai', text: `No protocolo da <b>semana ${p.week}</b> você concluiu ${done} de ${p.tasks.length} itens. ${next ? `Falta: ${next.t}.` : 'Tudo em dia.'}`, fonte: { rotulo: 'Seu protocolo', to: '/protocolo' }, mini: `Quer que eu te lembre das tarefas ao longo da semana?` };
  }
  if (has('oi', 'olá', 'ola', 'bom dia', 'boa tarde', 'obrigad', 'valeu')) {
    return { who: 'ai', text: `Tô aqui com você. Pode me perguntar sobre sua evolução, sintomas, exames, a próxima dose ou a consulta — o que fizer sua semana mais leve.` };
  }
  return { who: 'ai', text: `Entendi. Posso te ajudar melhor com algo específico da sua jornada — sua evolução, um sintoma, a linha da medicação, ou preparar a consulta${quemAcompanha ? ` com ${quemAcompanha}` : ''}. Só lembrando que <b>não tomo decisões médicas</b>: para dose e protocolo, quem decide é quem acompanha você.` };
}

/** Os três pontos da espera.

    Existiam 450 ms de silêncio entre a pergunta e a resposta, sem nada na
    tela — e silêncio sem sinal não lê como processamento, lê como falha.
    O balão vazio no lugar certo do fio resolve isso sem prometer mais do
    que acontece: ele ocupa a posição da resposta que vem. */
function Pensando() {
  const { c } = useTheme();
  return (
    <Row gap={5} style={{ backgroundColor: c.bg1, borderRadius: radius.lg, borderBottomLeftRadius: 6, paddingHorizontal: 16, paddingVertical: 15, alignSelf: 'flex-start' }}>
      {[0, 1, 2].map((i) => (
        <View key={i} style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: c.tx4, opacity: 1 - i * 0.25 }} />
      ))}
    </Row>
  );
}

export default function Companion() {
  const S = useStore((s) => s.S);
  const update = useStore((s) => s.update);
  const { c } = useTheme();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const scrollRef = useRef<ScrollView>(null);
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [pensando, setPensando] = useState(false);
  const [input, setInput] = useState('');
  /* O ditado escreve no mesmo campo que o teclado escreve — não há um
     segundo lugar onde a fala vira texto, e é por isso que dá para
     começar digitando e terminar falando. */
  const temDitado = useMemo(() => ditadoDisponivel(), []);
  const { ouvindo, erro: erroDoDitado, comecar: comecarDitado, parar: pararDitado, limparErro } = useDitado(setInput);

  /* As sugestões vêm do estado, não de uma constante.

     A lista fixa oferecia "Por que sinto mais fome?" no dia da aplicação,
     quando a fome é o menor dos problemas. companionSuggestions lê a fase
     do ciclo, o enjoo de hoje e a proximidade da dose — as mesmas
     perguntas que o Insights oferece, o que faz as duas telas parecerem a
     mesma inteligência em vez de dois menus. */
  const sugestoes = useMemo(() => companionSuggestions(S).slice(0, 4), [S]);
  const memoria = useMemo(() => companionMemoria(S), [S]);
  const vazio = msgs.length === 0;

  const { q } = useLocalSearchParams<{ q?: string }>();
  const askedRef = useRef(false);
  useEffect(() => {
    if (q && !askedRef.current) { askedRef.current = true; setTimeout(() => ask(String(q)), 380); }
  }, [q]);

  const ask = (text: string) => {
    const t = text.trim(); if (!t) return;
    setInput('');
    /* guarda a pergunta para o Insights poder oferecer "continue de onde
       parou" — sem isso, cada visita à aba recomeça do zero */
    update((s: any) => {
      s.asked = [...(s.asked || []).filter((x: any) => x.q !== t), { t: Date.now(), q: t }].slice(-12);
    });
    setMsgs((m) => [...m, { who: 'me', text: t }]);
    setPensando(true);
    setTimeout(() => {
      setPensando(false);
      setMsgs((m) => [...m, companionReply(S, t)]);
      setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 90);
    }, 620);
    setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 90);
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1, backgroundColor: c.bg }}>
      {/* ---- o cabeçalho ----

          ⚠️⚠️ A ESFERA E O "PODE PERGUNTAR" SAÍRAM DAQUI, e eram a coisa
          mais bonita da tela.

          Eles são o hero do INSIGHTS: lá o orbe é a marca do produto na
          aba, ocupa meia dobra e convida — é uma capa. Repetido aqui, a
          conversa começava com 40% da tela ocupados por uma apresentação
          de quem a pessoa acabou de escolher abrir. Quem entra para
          perguntar já sabe com quem vai falar; o que ela quer é o campo.

          Pior no uso repetido: cada volta à tela reapresentava o
          personagem, e cada volta empurrava a primeira resposta para
          baixo da dobra.

          Agora é o cabeçalho de um chat, e ele é CENTRADO de propósito —
          o da conversa com a equipe é alinhado à esquerda com o nome da
          clínica, porque lá a pergunta que volta é "com quem estou
          falando". Aqui não há quem: há o quê. Duas telas de conversa,
          dois cabeçalhos que não se confundem.

          O limite ("não substitui sua equipe médica") não sumiu — desceu
          para a abertura, que é onde alguém o lê antes da primeira
          pergunta, em vez de ficar pendurado em toda volta. */}
      <View style={{
        paddingTop: insets.top + 8, paddingHorizontal: PAD, paddingBottom: 12,
        borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: c.line,
      }}>
        <Row style={{ alignItems: 'center' }}>
          <CircleBtn name="back" onPress={() => router.back()} />
          {/* O título centra na TELA, e não no vão que sobra: sem o
              espaçador do mesmo tamanho do botão à direita, ele ficaria
              deslocado 44 px para a esquerda e o olho lê como desalinho.

              ⚠️ "MORPHI" AQUI NÃO FERE A REGRA DA TERCEIRA PESSOA, e uma
              varredura de texto vai tropeçar nele. A regra é sobre o
              aplicativo FALAR DE SI — "o Morphi guarda", "o Morphi
              avisa" —, que transforma o produto num objeto que observa a
              pessoa. Isto é um rótulo de tela: um nome, não uma frase.
              Nenhum verbo depende dele.

              ⚠️ E É PROVISÓRIO, por decisão do produto. Era "Perguntas",
              que dizia o que a tela faz e não tinha dono; "Morphi IA" diz
              com quem se fala. Nenhum link do aplicativo rotula esta
              tela — todos são toque em alguma coisa —, então trocar o
              nome é trocar esta linha e mais nada. */}
          {/* A estrela VEM ANTES DO NOME, como marca antes de letreiro —
              e o par inteiro é que centra, não o texto sozinho. */}
          <Row gap={7} style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <EstrelaIA size={21} />
            <Txt v="title">Morphi IA</Txt>
          </Row>
          <View style={{ width: 40 }} />
        </Row>
      </View>

      {/* ---- onde se lê ----
          O raio no topo e os 36 px de sobreposição saíram junto com o
          cabeçalho escuro: eles existiam para a folha clara subir por cima
          da imagem. Sem imagem embaixo, um canto arredondado no meio de
          duas superfícies da mesma cor é um detalhe que não separa nada. */}
      <View style={{ flex: 1, backgroundColor: c.bg }}>
        <ScrollView
          ref={scrollRef} style={{ flex: 1 }}
          contentContainerStyle={{ paddingHorizontal: PAD, paddingTop: 26, paddingBottom: 16, gap: 12 }}
          showsVerticalScrollIndicator={false}
          onContentSizeChange={() => scrollRef.current?.scrollToEnd({ animated: false })}
        >
          {/* ---- abertura ----

              Antes a saudação era a primeira mensagem do fio: um balão de
              IA com cinco linhas listando o que ela sabe fazer. Isso é
              menu disfarçado de conversa — e pior, deixa o fio começando
              com alguém falando sozinho.

              Agora a abertura é estado da tela, não mensagem. A memória diz
              que ele lembra da última vez, e as perguntas são o convite.
              Quando a conversa começa, tudo isso sai de cena em vez de
              ficar rolado para cima como um primeiro balão sem valor.

              A onda que abria este bloco saiu junto. Ela era a presença do
              Morphi enquanto o cabeçalho tinha só um ícone; com o orbe no
              alto, ter as duas era mostrar o mesmo personagem duas vezes
              na mesma dobra, em desenhos diferentes — e a de baixo era a
              mais fraca. */}
          {vazio ? (
            <View style={{ alignItems: 'center', paddingTop: 8 }}>
              <Txt v="display" style={{ fontSize: 26, lineHeight: 33, textAlign: 'center' }}>
                Oi, {S.profile.name.split(' ')[0]}
              </Txt>
              {/* A memória é o que separa assistente de buscador: ela prova
                  que a conversa anterior aconteceu. É a mesma frase que
                  abre o Insights, de propósito — uma voz só. */}
              <Txt v="caption" c={c.tx3} style={{ marginTop: 8, textAlign: 'center', lineHeight: 21, maxWidth: 300 }}>
                {memoria}
              </Txt>
              {/* ⚠️ O LIMITE MORAVA NO CABEÇALHO, embaixo do "Pode
                  perguntar", e veio junto quando aquele bloco saiu.

                  Ele não podia simplesmente sumir: é a frase que diz o
                  que esta tela NÃO é, num aplicativo de saúde. Aqui ela
                  fica melhor do que ficava — é lida uma vez, antes da
                  primeira pergunta, em vez de ficar pendurada no alto em
                  toda volta à conversa. */}
              <Txt v="micro" c={c.tx4} style={{ marginTop: 10, textAlign: 'center' }}>
                Conheço a sua jornada inteira · não substituo a sua equipe médica
              </Txt>

              <View style={{ marginTop: 32, alignSelf: 'stretch', gap: 8 }}>
                {sugestoes.map((s) => (
                  <Pressable key={s} onPress={() => ask(s)} style={({ pressed }) => [{ opacity: pressed ? 0.65 : 1 }]}>
                    <Row gap={12} style={{ backgroundColor: c.bg1, borderRadius: radius.lg, paddingHorizontal: 16, paddingVertical: 15 }}>
                      <Icon name="aura" size={15} color={c.accent} sw={1.9} />
                      <Txt v="body" style={{ flex: 1 }}>{s}</Txt>
                      <Icon name="chev" size={14} color={c.tx4} sw={2} />
                    </Row>
                  </Pressable>
                ))}
              </View>
            </View>
          ) : null}

          {msgs.map((m, i) => m.who === 'me' ? (
            <View key={i} style={{ alignSelf: 'flex-end', maxWidth: '84%', backgroundColor: c.accent, borderRadius: radius.lg, borderBottomRightRadius: 6, paddingHorizontal: 16, paddingVertical: 12 }}>
              <Txt v="bodyMed" c={c.accentInk} style={{ lineHeight: 21 }}>{m.text}</Txt>
            </View>
          ) : (
            /* ⚠️⚠️ A RESPOSTA PERDEU O BALÃO, e esta é a mudança que separa
               esta tela da conversa com a equipe.

               O balão foi encolhendo aqui por partes — perdeu o contorno,
               perdeu o avatar repetido, ganhou 94% de largura — e cada
               passo foi na mesma direção sem chegar no fim dela. O fim é
               este: a resposta da IA não é uma fala, é um TEXTO. Tem
               manchete, tem parágrafo, tem lista.

               Balão é o desenho certo para uma pessoa falando: diz quem é
               pela posição e pela cor, e uma frase de duas linhas cabe
               nele sem esforço. É por isso que a conversa com a equipe,
               em /conversa, continua com balões dos dois lados — lá são
               duas pessoas.

               Aqui o balão vestia um documento de recado: a lista não
               tinha onde recuar, o título ficava do tamanho do corpo, e
               o texto longo quebrava numa coluna estreita com o canto
               mordido embaixo. Sem ele, a resposta ocupa a página e passa
               a ser lida como o que é — e a tela inteira muda de gênero
               sem precisar de um rótulo dizendo "isto aqui é a IA".

               A pergunta DELA continua em balão, e isso não é descuido:
               ela é uma fala, curta, de uma pessoa. O contraste entre os
               dois lados passou a ser o assunto em vez de ser decoração. */
            <View key={i} style={{ alignSelf: 'stretch', gap: 12 }}>
              <RichDoc text={m.text} ir={(to) => router.push(to as any)} />

              {!!m.mini && (
                /* A nota de apoio em fundo tingido, separada por espaço e
                   não por fio: é a mesma fala continuando em voz mais
                   baixa, não outro assunto. */
                <View style={{ backgroundColor: c.bg1, borderRadius: radius.md, padding: 13 }}>
                  <Txt v="caption" c={c.tx2} style={{ lineHeight: 20 }}>{m.mini}</Txt>
                </View>
              )}

              {/* ⚠️ O SELO DA PROCEDÊNCIA, e ele é tocável. Dizer "li as
                  suas pesagens" e não deixar a pessoa ir ver as pesagens
                  é pedir confiança sem oferecer conferência. */}
              {m.fonte ? (
                <Pressable
                  onPress={() => router.push(m.fonte!.to as any)}
                  style={({ pressed }) => [{ alignSelf: 'flex-start', opacity: pressed ? 0.6 : 1 }]}
                >
                  <Row gap={7} style={{ backgroundColor: c.bg1, borderRadius: radius.pill, paddingLeft: 10, paddingRight: 12, paddingVertical: 6 }}>
                    <Icon name="aura" size={13} color={c.accent} sw={1.9} />
                    <Txt v="micro" c={c.tx2}>{m.fonte.rotulo}</Txt>
                  </Row>
                </Pressable>
              ) : null}
            </View>
          ))}

          {pensando && <Pensando />}
        </ScrollView>

        {/* ---- o campo ----

            As chips horizontais que moravam aqui saíram. Elas repetiam as
            perguntas da abertura num carrossel cortado na borda, e ficavam
            na tela durante a conversa inteira oferecendo recomeçar quando
            a pessoa já está no meio de um assunto. O convite pertence ao
            começo; depois dele, o que se quer é escrever. */}
        <View style={{ paddingHorizontal: PAD, paddingTop: 10, paddingBottom: (insets.bottom || 10) + 10, backgroundColor: c.bg }}>
          {/* ⚠️ O AVISO DO DITADO FICA ACIMA DO CAMPO, e não dentro dele.

              Dentro, ele empurraria o campo para baixo no meio do teclado
              aberto; e "não ouvi nada" não é um estado do campo, é uma
              resposta a um gesto que a pessoa acabou de fazer. */}
          {erroDoDitado ? (
            <Pressable onPress={limparErro} style={({ pressed }) => [{ opacity: pressed ? 0.6 : 1, marginBottom: 8 }]}>
              <Row gap={8} style={{ backgroundColor: c.bg1, borderRadius: radius.md, paddingHorizontal: 14, paddingVertical: 10 }}>
                <Icon name="mic" size={14} color={c.tx3} sw={1.9} />
                <Txt v="caption" c={c.tx2} style={{ flex: 1 }}>{erroDoDitado}</Txt>
              </Row>
            </Pressable>
          ) : null}
          <Row gap={10}>
            <Row gap={10} style={{ flex: 1, backgroundColor: c.bg1, borderRadius: radius.pill, paddingLeft: 18, paddingRight: 8, paddingVertical: 4 }}>
              <TextInput
                value={input} onChangeText={setInput} onSubmitEditing={() => ask(input)}
                /* ⚠️ O TEXTO ENCURTOU PORQUE O CAMPO ENCURTOU. Com o
                   microfone dentro da pílula, 'Pergunte sobre sua jornada'
                   passou a ser cortado no meio — e placeholder cortado lê
                   como defeito, não como texto longo. O novo diz as duas
                   formas de responder, e só promete a fala onde ela existe. */
                placeholder={ouvindo ? 'Estou ouvindo…' : temDitado ? 'Escreva ou fale' : 'Pergunte sobre sua jornada'} placeholderTextColor={c.tx4}
                /* ⚠️ minWidth 0 PORQUE flex:1 NÃO BASTA. Na web o <input> tem
                   largura intrínseca, e um filho flex não encolhe abaixo dela
                   sem isto — o campo empurrava o microfone para fora da
                   pílula, em cima do botão de enviar. No nativo é inócuo. */
                style={{ flex: 1, minWidth: 0, paddingVertical: 12, color: c.tx, fontFamily: font.body, fontSize: 19 }}
              />
              {/* ⚠️ O MICROFONE MORA DENTRO DO CAMPO, e o enviar fica fora.

                  São gestos de naturezas diferentes: ditar é uma forma de
                  ESCREVER, e por isso pertence ao campo em que se escreve;
                  enviar é o que se faz depois de escrever. Lado a lado,
                  fora do campo, os dois viravam dois botões redondos
                  competindo pelo mesmo canto.

                  ⚠️ E ELE SÓ EXISTE ONDE FUNCIONA — ver ditadoDisponivel. */}
              {temDitado ? (
                <Pressable
                  onPress={() => (ouvindo ? pararDitado() : comecarDitado(input))}
                  hitSlop={8}
                  style={({ pressed }) => [{ opacity: pressed ? 0.6 : 1 }]}
                >
                  <View style={{
                    width: 36, height: 36, borderRadius: 18,
                    backgroundColor: ouvindo ? c.accent : 'transparent',
                    alignItems: 'center', justifyContent: 'center',
                  }}>
                    <Icon
                      name={ouvindo ? 'ondas' : 'mic'}
                      size={19}
                      color={ouvindo ? c.accentInk : c.tx3}
                      sw={1.9}
                    />
                  </View>
                </Pressable>
              ) : null}
            </Row>
            {/* o botão só acende quando há o que enviar: cheio e apagado
                dizem, antes do toque, se o gesto vai levar a algo */}
            <Pressable onPress={() => ask(input)} disabled={!input.trim()} style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1 }]}>
              <View style={{ width: 48, height: 48, borderRadius: 24, backgroundColor: input.trim() ? c.accent : c.bg2, alignItems: 'center', justifyContent: 'center' }}>
                <Icon name="send" size={19} color={input.trim() ? c.accentInk : c.tx4} sw={2} />
              </View>
            </Pressable>
          </Row>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}
