import React, { useState } from 'react';
import { View, Pressable } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useStore } from '../logic/store';
import { lerConversas } from '../logic/conversa';
import { avaliarResposta, marcarAvaliacao, MOTIVOS, type Motivo } from '../logic/avaliacao';
import { Txt, SheetScreen, Row } from '../ui/kit';
import { Botao } from '../ui/internas';
import { Icon } from '../ui/Icon';
import { useTheme } from '../ui/useTheme';
import { radius } from '../theme';
import { T } from '../textos';

const K = () => T.companion.telaConversa;

/* ============================================================
   O 👎 DA RESPOSTA — a folha por cima da conversa

   A conversa (/companion) abre esta folha no 👎, com a conversa e a hora
   da resposta. A pessoa escolhe o motivo, lê o que vai sair e confirma.

   ⚠️ O AVISO VEM ANTES DO BOTÃO, e diz exatamente o que sai: a pergunta e
   esta resposta, e nada mais da conversa nem dos registros. É o
   consentimento daquele envio (LGPD, art. 11, I); fechar a folha por
   qualquer caminho é não mandar.

   ⚠️ SEM MOTIVO ESCOLHIDO, "OUTRO". Exigir a escolha antes de enviar
   trocaria uma avaliação por um formulário.
   ============================================================ */
export default function AvaliarResposta() {
  const { c } = useTheme();
  const router = useRouter();
  const { conversa, t } = useLocalSearchParams<{ conversa?: string; t?: string }>();
  const S = useStore((s) => s.S);
  const update = useStore((s) => s.update);
  const [motivo, setMotivo] = useState<Motivo | null>(null);
  const [enviando, setEnviando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  const lista = lerConversas(S).lista.find((x) => x.id === conversa)?.msgs ?? [];
  const i = lista.findIndex((m) => m.who === 'ai' && String(m.t) === t);
  const resposta = i >= 0 ? lista[i].text : '';
  let pergunta = '';
  for (let k = i - 1; k >= 0; k--) if (lista[k].who === 'me') { pergunta = lista[k].text; break; }

  const enviar = async () => {
    if (!conversa || i < 0) { router.back(); return; }
    setEnviando(true);
    setErro(null);
    const r = await avaliarResposta({ nota: -1, motivo: motivo ?? 'outro', pergunta, resposta });
    setEnviando(false);
    if (!r.ok) {
      setErro(r.motivo === 'sem-conta' ? K().avaliarSemConta : K().avaliarFalhou);
      return;
    }
    update((s: any) => { marcarAvaliacao(s, conversa, lista[i].t, -1); });
    router.back();
  };

  return (
    <SheetScreen
      titulo={K().avaliarTitulo}
      onClose={() => router.back()}
      rodape={(
        <View style={{ gap: 8 }}>
          {erro ? <Txt v="caption" c={c.bad} style={{ textAlign: 'center' }}>{erro}</Txt> : null}
          <Botao label={K().avaliarEnviar} onPress={enviar} carregando={enviando} desligado={i < 0} />
          <Botao label={K().avaliarCancelar} tom="fantasma" onPress={() => router.back()} />
        </View>
      )}
    >
      <View style={{ gap: 8, marginTop: 6 }}>
        {MOTIVOS.map((m) => {
          const ligado = motivo === m;
          return (
            <Pressable key={m} onPress={() => setMotivo(ligado ? null : m)} accessibilityRole="radio" accessibilityState={{ selected: ligado }}
              style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1 }]}>
              <Row gap={12} style={{
                alignItems: 'center', paddingHorizontal: 14, paddingVertical: 13, borderRadius: radius.lg,
                backgroundColor: ligado ? c.accentWeak : c.bg1, borderWidth: 1, borderColor: ligado ? c.accent : 'transparent',
              }}>
                <Txt v="label" style={{ flex: 1 }}>{K().motivos[m]}</Txt>
                {ligado ? <Icon name="check" size={16} color={c.accent} sw={2.2} /> : null}
              </Row>
            </Pressable>
          );
        })}
      </View>
      <Txt v="caption" c={c.tx3} style={{ marginTop: 16, lineHeight: 20 }}>{K().avaliarAviso}</Txt>
    </SheetScreen>
  );
}
