import React, { useEffect, useMemo, useRef, useState } from 'react';
import { View, Pressable, ScrollView, TextInput, KeyboardAvoidingView, Platform, StyleSheet, useWindowDimensions } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useStore } from '../logic/store';
import type { State } from '../logic/seed';
import {
  M, curWeight, lostKg, lostPct, adesao, hungerForecast, nextInjectionDate,
  lastInjection, siteLabel, waterToday, GOAL_WATER, companionSuggestions, companionMemoria,
} from '../logic/derive';
import { now, diffDays, fmtDate, relDay, nf, kg } from '../logic/time';
import { Txt, Row, CircleBtn, Rich } from '../ui/kit';
import { Image } from 'expo-image';
import { Icon } from '../ui/Icon';
import { useTheme } from '../ui/useTheme';
import { useLarguraApp } from '../ui/useLarguraApp';
import { useLightStatusBar } from '../ui/useLightStatusBar';
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
const SOBREPOSICAO = 36;
const AURORA = require('../../assets/images/aurora-insights.png');

/* Onde a base da esfera cai, em fração da LARGURA da tela.

   A peça é 853×1844 e a esfera vai de y≈200 a y≈430. Com contentFit
   cover num cabeçalho baixo, quem manda na escala é a largura — então
   430/853 = 0,504 é a fração que resolve a conta em qualquer aparelho,
   sem medir nada em runtime.

   Fração da largura e não valor fixo porque a imagem escala com ela: num
   aparelho mais largo a esfera é maior E desce, e um número em pixels
   descolaria do desenho exatamente onde ele precisa acompanhar. */
const ESFERA_BASE_FRACAO = 0.504;

type Msg = { who: 'me' | 'ai'; text: string; mini?: string };

/* porta verbatim do protótipo — respostas heurísticas ancoradas nos dados reais */
function companionReply(S: State, text: string): Msg {
  const t = text.toLowerCase();
  const has = (...k: string[]) => k.some((x) => t.includes(x));
  const med = M(S);
  if (has('evolu', 'progress', 'como estou', 'como vou', 'peso')) {
    const days = diffDays(now(), new Date(S.profile.startT));
    return { who: 'ai', text: `Nos <b>${days} dias</b> de tratamento você saiu de ${kg(S.profile.startWeight)} para <b>${kg(curWeight(S))} kg</b> — menos ${kg(lostKg(S))} kg (${nf(lostPct(S), 1)}%). Já passou dos 5% de perda, uma marca clínica que reduz riscos. Sua adesão às aplicações está em ${adesao(S)}%.`, mini: `Ritmo saudável e constante: cerca de ${kg(lostKg(S) / (days / 7))} kg por semana. O peso é um sinal entre vários — energia, sono e exames também contam.` };
  }
  if (has('consulta', 'prepar', 'médic', 'doutora', 'helena')) {
    return { who: 'ai', text: `Montei um resumo pra sua ${S.consult.type.toLowerCase()} <b>${relDay(new Date(S.consult.t))}</b> com a ${S.consult.doctor}:`, mini: `• Peso: ${kg(curWeight(S))} kg (−${kg(lostKg(S))} kg / ${nf(lostPct(S), 1)}%)\n• Dose atual: ${med.label} ${nf(S.profile.dose, S.profile.dose % 1 ? 1 : 0)} ${med.unit}, adesão ${adesao(S)}%\n• Sintomas: náusea leve nos dias pós-aplicação, já melhorando\n• Perguntas sugeridas: manter ou ajustar a dose? o platô é esperado? exames a repetir?` };
  }
  if (has('fome', 'saciedade', 'vontade de comer')) {
    const hf = hungerForecast(S);
    return { who: 'ai', text: `A fome acompanha o nível da ${med.mol.toLowerCase()} no seu corpo. Logo após a aplicação ele está alto e a saciedade é maior; <b>perto da próxima dose ele cai</b> e a fome volta. ${hf ? `No seu caso, esse ponto mais baixo é ${hf.inDays <= 1 ? 'nestes dias' : `em ${hf.inDays} dias`}.` : ''}`, mini: `Ajuda nesses dias: priorizar proteína, hidratar bem e não pular refeições. Se a fome estiver difícil de controlar, vale anotar pra conversar com a Dra. Helena — quem ajusta dose é ela.` };
  }
  if (has('náusea', 'nausea', 'enjoo', 'enjôo', 'mal estar', 'sintoma')) {
    return { who: 'ai', text: `Sentir náusea leve, principalmente nos primeiros dias após aumentar a dose, é comum e costuma <b>diminuir com o tempo</b> — seus próprios registros já mostram isso melhorando.`, mini: `O que costuma ajudar: refeições menores, evitar frituras e comer devagar. Se ficar forte, persistente ou vier com vômito, me avisa que eu destaco isso pra sua equipe.` };
  }
  if (has('dose', 'aplica', 'aplicar', 'injeç', 'caneta')) {
    const nd = nextInjectionDate(S); const li = lastInjection(S);
    return { who: 'ai', text: `Sua próxima aplicação é <b>${relDay(nd)}</b> (${fmtDate(nd)}), ${med.label} ${nf(S.profile.dose, S.profile.dose % 1 ? 1 : 0)} ${med.unit}. Sugiro alternar o local — da última vez foi ${li ? siteLabel(li.site) : 'abdômen'}.`, mini: `Importante: eu não altero doses nem protocolos. Qualquer mudança é decisão da Dra. Helena. Posso te lembrar no dia e registrar a aplicação.` };
  }
  if (has('água', 'agua', 'hidrat')) {
    return { who: 'ai', text: `Hoje você registrou <b>${waterToday(S)} de ${GOAL_WATER} copos</b>. Reparei que aos fins de semana a hidratação cai — e a água ajuda bastante com saciedade e com a náusea.`, mini: `Quer que eu te lembre de beber água nos sábados e domingos?` };
  }
  if (has('proteína', 'proteina')) {
    return { who: 'ai', text: `Proteína é uma das suas metas — e você vem cumprindo bem. Manter a ingestão alta durante a perda de peso <b>protege sua massa magra</b>, o que sustenta seu metabolismo.`, mini: `Média recente perto de 90 g/dia. Boas fontes práticas: ovos, iogurte natural, frango, peixe e leguminosas.` };
  }
  if (has('meta', 'objetivo', 'jeans', 'roupa', 'energia', 'dormir', 'sono')) {
    return { who: 'ai', text: `Suas metas vão além do peso, e é assim que deve ser. Sono e energia estão sendo acompanhados nos seus check-ins, e o peso segue uma tendência constante. Transformação é o conjunto, não só a balança.`, mini: `Quer adicionar uma nova meta, além da balança? Posso te levar até lá.` };
  }
  if (has('exame', 'hba1c', 'colesterol', 'glicemia', 'ldl', 'hdl', 'triglic', 'vitamina', 'ferritina', 'tsh', 'insulina', 'creatinina')) {
    return { who: 'ai', text: `Seus exames vêm melhorando junto com o tratamento. Destaques: <b>HbA1c 6,3 → 5,6%</b>, LDL e triglicerídeos em queda, HDL e vitamina D em alta.`, mini: `Posso abrir um marcador específico e explicar o que ele significa — é só ir em Exames. Não substituo a leitura da sua médica.` };
  }
  if (has('medicament', 'remédio', 'remedio', 'tirzep', 'semaglut', 'bula', 'como funciona')) {
    return { who: 'ai', text: `${med.label} tem como princípio ativo a <b>${med.mol.toLowerCase()}</b>, aplicada ${med.cad === 'weekly' ? '1×/semana' : 'diariamente'}. Ela aumenta a saciedade e ajuda no controle da glicose.`, mini: `Efeitos comuns no começo: náusea leve e menos apetite. Dúvidas sobre dose ou troca de medicação são sempre com a Dra. Helena.` };
  }
  if (has('protocolo', 'missão', 'missao', 'tarefa', 'checklist')) {
    const p = S.protocol, done = p.tasks.filter((x: any) => x.done).length;
    const next = p.tasks.find((x: any) => !x.done);
    return { who: 'ai', text: `No protocolo da <b>semana ${p.week}</b> você concluiu ${done} de ${p.tasks.length} itens. ${next ? `Falta: ${next.t}.` : 'Tudo em dia.'}`, mini: `Quer que eu te lembre das tarefas ao longo da semana?` };
  }
  if (has('oi', 'olá', 'ola', 'bom dia', 'boa tarde', 'obrigad', 'valeu')) {
    return { who: 'ai', text: `Tô aqui com você. Pode me perguntar sobre sua evolução, sintomas, exames, a próxima dose ou a consulta — o que fizer sua semana mais leve.` };
  }
  return { who: 'ai', text: `Entendi. Posso te ajudar melhor com algo específico da sua jornada — sua evolução, um sintoma, a linha da medicação, ou preparar a consulta com a Dra. Helena. Só lembrando que <b>não tomo decisões médicas</b>: pra dose e protocolo, quem decide é sua equipe.` };
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
  const largura = useLarguraApp();
  useLightStatusBar();
  const scrollRef = useRef<ScrollView>(null);
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [pensando, setPensando] = useState(false);
  const [input, setInput] = useState('');

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
      {/* ---- o cabeçalho é a presença ----

          Era a malha escura com um ícone de 44 px ao lado do nome. Agora é
          a MESMA imagem do hero do Insights, com o mesmo orbe.

          A continuidade é o argumento. Lá o orbe é a única marca do Morphi
          na tela e tocá-lo abre esta; aqui ele reaparece no mesmo lugar da
          composição, na mesma luz. O toque deixa de ser navegação e vira
          aproximação — a tela não abre outra coisa, abre mais perto da
          mesma coisa. Com ícone e malha, eram dois retratos diferentes do
          mesmo personagem.

          O nome fica centrado sob a esfera, e o limite logo abaixo, no
          mesmo bloco: quem ele é e o que ele não faz são a mesma
          informação. */}
      <View style={{ backgroundColor: c.altMid, paddingTop: insets.top + 10, paddingHorizontal: PAD, paddingBottom: 24 + SOBREPOSICAO }}>
        <Image
          source={AURORA}
          style={StyleSheet.absoluteFillObject}
          contentFit="cover"
          contentPosition="top center"
        />

        <Row gap={12}>
          {/* o botão de voltar sobre campo escuro: vidro e tinta clara, não
              o par cinza-sobre-branco que ele usa nas telas claras */}
          <CircleBtn name="back" onPress={() => router.back()} bg="rgba(255,255,255,0.16)" color={c.onHero} />
          <View style={{ flex: 1 }} />
        </Row>

        {/* O vão é a esfera. Ela é desenhada na imagem, então aqui só
            existe como altura reservada — e a medida sai da própria peça:
            a base da esfera cai em 43% da largura da tela, e o nome começa
            um respiro abaixo disso. */}
        <View style={{ height: Math.max(60, largura * ESFERA_BASE_FRACAO - 26) }} />

        <View style={{ alignItems: 'center' }}>
          <Txt v="h2" c={c.onHero}>Morphi</Txt>
          <Txt v="micro" c={c.onHero2} style={{ marginTop: 6, lineHeight: 17, textAlign: 'center' }}>
            Conhece sua jornada inteira · não substitui sua equipe médica
          </Txt>
        </View>
      </View>

      {/* ---- a folha: onde se lê ----
          Sobe 36 px por cima da superfície escura, com o mesmo raio da Home
          e do Insights. Escuro marca quem fala; claro é onde o texto longo
          fica confortável. */}
      <View style={{ flex: 1, backgroundColor: c.bg, borderTopLeftRadius: radius.lg, borderTopRightRadius: radius.lg, marginTop: -SOBREPOSICAO }}>
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
            /* O balão dele perdeu o contorno e o avatar repetido.

               O contorno cinza era borda em volta de superfície, contra o
               princípio 4 — branco sobre #F5F6FA já separa. E o avatar de
               30 px em cada resposta repetia a cada balão uma informação
               que o lado da tela já dá: o que está à esquerda é dele.

               Sem os dois, o balão ganha a largura toda e o texto longo —
               que é o que ele produz — deixa de quebrar em coluna estreita. */
            <View key={i} style={{ maxWidth: '94%', backgroundColor: c.bg1, borderRadius: radius.lg, borderBottomLeftRadius: 6, paddingHorizontal: 16, paddingVertical: 14 }}>
              <Rich v="bodyMed" base={c.tx} bold={c.accent2} style={{ lineHeight: 22 }} text={m.text} />
              {!!m.mini && (
                /* A nota de apoio em fundo tingido, separada por espaço e
                   não por fio: é a mesma fala continuando em voz mais
                   baixa, não outro assunto. */
                <View style={{ marginTop: 12, backgroundColor: c.bg2, borderRadius: radius.md, padding: 13 }}>
                  <Txt v="caption" c={c.tx2} style={{ lineHeight: 20 }}>{m.mini}</Txt>
                </View>
              )}
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
          <Row gap={10}>
            <Row style={{ flex: 1, backgroundColor: c.bg1, borderRadius: radius.pill, paddingHorizontal: 18, paddingVertical: 4 }}>
              <TextInput
                value={input} onChangeText={setInput} onSubmitEditing={() => ask(input)}
                placeholder="Pergunte sobre sua jornada" placeholderTextColor={c.tx4}
                style={{ flex: 1, paddingVertical: 12, color: c.tx, fontFamily: font.body, fontSize: 19 }}
              />
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
