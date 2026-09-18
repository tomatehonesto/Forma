import React, { useState } from 'react';
import { View, Share, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useStore } from '../logic/store';
import { hasClinic } from '../logic/derive';
import { resumoDoTratamento, resumoEmTexto } from '../logic/resumo';
import { fmtDate, now } from '../logic/time';
import { Txt, Row } from '../ui/kit';
import { TelaInterna, Titulao, Cartao, Botao, Aviso } from '../ui/internas';
import { Icon } from '../ui/Icon';
import { useTheme } from '../ui/useTheme';
import { radius } from '../theme';

/* ============================================================
   RESUMO PARA O MÉDICO

   ⚠️ OS DOIS BOTÕES FAZIAM A MESMA COISA. "Compartilhar resumo" abria a
   folha do sistema, e "Enviar à Dra. Helena" — que promete entregar a
   alguém — abria a mesma folha do sistema. Um botão com nome de destino
   que não leva ao destino é a pior espécie de mentira de interface: a
   pessoa toca, vê o compartilhamento abrir, escolhe qualquer coisa, e sai
   de lá achando que a médica recebeu.

   Agora ele envia de verdade, pela conversa que o app já tem com a
   equipe — a mesma de /medico —, e só existe quando há equipe. Sem
   vínculo, resta o compartilhar, que é honesto: a pessoa escolhe por onde.

   ⚠️ E A TELA E O TEXTO ERAM DOIS RESUMOS. O cartão montava suas linhas
   com as funções do app; o texto compartilhado remontava tudo por conta
   própria, e discordava — a cadência, por exemplo. Agora os dois leem as
   mesmas seções, em src/logic/resumo.ts.

   O DOCUMENTO SE PARECE COM UM DOCUMENTO. Papel branco, cabeçalho com
   nome e data, seções com rótulo e linhas de chave e valor. Ele vai ser
   lido por quem lê exame o dia inteiro, e a forma que essa pessoa
   reconhece não é a de um cartão de aplicativo.
   ============================================================ */

export default function ResumoMedico() {
  const S = useStore((s) => s.S);
  const update = useStore((s) => s.update);
  const { c } = useTheme();
  const router = useRouter();

  const p: any = S.profile;
  const secoes = resumoDoTratamento(S);
  const temEquipe = hasClinic(S);
  const [enviado, setEnviado] = useState(false);

  const compartilhar = () => { Share.share({ message: resumoEmTexto(S) }).catch(() => {}); };

  /* ENVIAR É ESCREVER NA CONVERSA, como qualquer mensagem que a pessoa
     manda. O resumo vira o texto da mensagem, e a tela de mensagens
     abre logo em seguida — quem enviou precisa ver onde a coisa caiu,
     senão "enviado" é mais uma palavra sem prova. */
  const enviar = () => {
    update((s: any) => {
      (s.messages ?? (s.messages = [])).push({ t: +now(), from: 'me', text: resumoEmTexto(s) });
    });
    setEnviado(true);
    router.push('/medico' as any);
  };

  return (
    <TelaInterna
      titulo="Resumo para o médico"
      rodape={
        <View style={{ gap: 10 }}>
          {temEquipe ? (
            <Botao
              label={enviado ? 'Enviado à sua equipe' : `Enviar a ${p.doctor}`}
              desligado={enviado}
              onPress={enviar}
            />
          ) : null}
          <Botao label="Compartilhar de outro jeito" tom="fantasma" onPress={compartilhar} />
        </View>
      }
    >
      <Titulao titulo="Resumo para o médico" lead="Tudo que você registrou, no formato de quem vai ler." />

      {/* O PAPEL. Fundo branco sem as bordas macias do resto do app: um
          documento tem margem e não tem canto redondo, e é isso que o faz
          ler como algo para ser impresso ou colado numa conversa. */}
      <View style={{ backgroundColor: c.bg1, borderRadius: radius.card, overflow: 'hidden' }}>
        <View style={{ padding: 20, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: c.line }}>
          <Txt v="h2">{p.name}</Txt>
          <Txt v="caption" c={c.tx3} style={{ marginTop: 3 }}>
            {fmtDate(now())}{p.doctor ? ` · para ${p.doctor}` : ''}
          </Txt>
        </View>

        {secoes.map((s) => (
          <View key={s.titulo} style={{ paddingHorizontal: 20, paddingVertical: 16 }}>
            <Row gap={8} style={{ alignItems: 'baseline' }}>
              <Txt v="micro" c={c.accent} style={{ letterSpacing: 1 }}>{s.titulo.toUpperCase()}</Txt>
            </Row>
            {s.nota ? <Txt v="micro" c={c.tx4} style={{ marginTop: 3 }}>{s.nota}</Txt> : null}

            {s.linhas.map((l) => (
              <Row key={l.k} gap={12} style={{ justifyContent: 'space-between', alignItems: 'baseline', marginTop: 10 }}>
                <Txt v="caption" c={c.tx3}>{l.k}</Txt>
                {/* O VALOR ALINHADO À DIREITA, que é como se lê uma coluna
                    de resultados: o olho desce pelos números e não pelos
                    rótulos, que têm comprimentos diferentes. */}
                <Txt v="label" style={{ flex: 1, textAlign: 'right' }}>{l.v}</Txt>
              </Row>
            ))}

            {s.texto !== undefined ? (
              <Txt v="caption" c={s.texto ? c.tx2 : c.tx4} style={{ marginTop: 8, lineHeight: 21 }}>
                {s.texto || 'Sem anotações. Elas se escrevem em Notas para a consulta.'}
              </Txt>
            ) : null}
          </View>
        ))}
      </View>

      {/* O QUE ESTE PAPEL NÃO É. Ele parece um documento clínico e não é
          um: são os registros de uma pessoa, do jeito que ela os fez.
          Dizer isso aqui protege quem lê e quem escreveu. */}
      <Aviso
        ic="info"
        titulo="É um relato, não um exame"
        texto="Os números vêm do que você registrou no aplicativo. Servem para a conversa da consulta, e não substituem avaliação nem laudo."
      />

      {enviado ? (
        <Row gap={8} style={{ alignItems: 'center', justifyContent: 'center' }}>
          <Icon name="check" size={14} color={c.ok} sw={2.6} />
          <Txt v="micro" c={c.tx3}>O resumo foi para a conversa com a sua equipe.</Txt>
        </Row>
      ) : (
        <Txt v="micro" c={c.tx4} style={{ textAlign: 'center' }}>
          Nada sai daqui sem o seu toque.
        </Txt>
      )}
    </TelaInterna>
  );
}
