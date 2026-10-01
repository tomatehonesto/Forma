import React, { useState } from 'react';
import { TextInput } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useStore } from '../logic/store';
import { lerConversas, semLinks } from '../logic/conversa';
import { SheetScreen } from '../ui/kit';
import { useTheme } from '../ui/useTheme';
import { ty } from '../theme';
import { T } from '../textos';

const K = () => T.companion.telaConversa;

/* ============================================================
   SELECIONAR TEXTO — a folha que dá as alças nativas

   A conversa (/companion) abre esta folha quando a pessoa segura uma
   mensagem. No iPhone, o `selectable` do texto só copia o bloco inteiro;
   aqui o mesmo texto vai num campo do sistema, só de leitura, e a seleção
   é a do sistema: alças de arrastar, copiar, procurar, traduzir.

   ⚠️ TEXTO PURO. Sem o negrito e sem os títulos da resposta: o que se
   seleciona é o que se cola, e marcação no meio de um texto colado é
   lixo.
   ============================================================ */
export default function SelecionarTexto() {
  const { c } = useTheme();
  const router = useRouter();
  const { conversa, t, quem } = useLocalSearchParams<{ conversa?: string; t?: string; quem?: string }>();
  const S = useStore((s) => s.S);
  const m = lerConversas(S).lista.find((x) => x.id === conversa)?.msgs
    .find((x) => String(x.t) === t && x.who === (quem === 'me' ? 'me' : 'ai'));
  /* O campo não cresce sozinho na web: a altura segue o conteúdo. */
  const [altura, setAltura] = useState<number | undefined>(undefined);
  const texto = m ? semLinks(m.text).replace(/<\/?b>/g, '').replace(/^## /gm, '').trim() : '';

  return (
    <SheetScreen titulo={K().selecionarTitulo} onClose={() => router.back()}>
      <TextInput
        value={texto}
        editable={false}
        multiline
        scrollEnabled={false}
        onContentSizeChange={(e) => {
          /* só quando muda: somar folga aqui fazia a altura crescer em laço */
          const h = Math.ceil(e.nativeEvent.contentSize.height);
          setAltura((antes) => (antes != null && Math.abs(antes - h) <= 1 ? antes : h));
        }}
        style={[ty.body, { color: c.tx, lineHeight: 25, paddingTop: 4, paddingBottom: 8, height: altura }]}
      />
    </SheetScreen>
  );
}
