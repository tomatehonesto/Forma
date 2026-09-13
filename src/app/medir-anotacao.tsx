import React, { useState } from 'react';
import { View, Pressable, TextInput } from 'react-native';
import { useRouter } from 'expo-router';
import { useStore } from '../logic/store';
import { notasTexto } from '../logic/derive';
import { now } from '../logic/time';
import { Txt, Row, SheetScreen } from '../ui/kit';
import { Icon } from '../ui/Icon';
import { useTheme } from '../ui/useTheme';
import { radius, font } from '../theme';

/* Anotação da consulta — captura.

   Vai para a mesma lista que /notas administra: o que a pessoa anota ao
   sair do consultório é exatamente o que ela quer ter em mãos na próxima.
   Um lugar só, dois momentos de acesso. */
const SUGESTOES = [
  'Ajuste de dose',
  'Exame para repetir',
  'Sintoma para acompanhar',
  'Dúvida para a próxima',
];

export default function MedirAnotacao() {
  const S = useStore((s) => s.S);
  const update = useStore((s) => s.update);
  const { c } = useTheme();
  const router = useRouter();

  const [texto, setTexto] = useState('');
  const anterior = notasTexto(S);

  const salvar = () => {
    const t = texto.trim();
    if (!t) return;
    /* Entra no topo da lista com a data de hoje: é a data que dá sentido à
       nota quando ela for lida na consulta, semanas depois. */
    update((s: any) => { s.notes = [{ t: +now(), text: t, done: false }, ...(s.notes || [])]; });
    router.back();
  };

  return (
    <SheetScreen titulo="O que você quer lembrar?" sub={`com ${S.profile.doctor}`} onClose={() => router.back()}>
      <View style={{ backgroundColor: c.bg1, borderRadius: radius.lg, marginTop: 18, paddingHorizontal: 18, paddingVertical: 6 }}>
        <TextInput
          value={texto} onChangeText={setTexto} autoFocus multiline
          placeholder="O que a médica orientou, o que mudou, o que você quer perguntar depois..."
          placeholderTextColor={c.tx4}
          style={{ minHeight: 96, paddingVertical: 12, color: c.tx, fontFamily: font.body, fontSize: 19, lineHeight: 26, textAlignVertical: 'top' }}
        />
      </View>

      <Row gap={6} style={{ flexWrap: 'wrap', marginTop: 12 }}>
        {SUGESTOES.map((s) => (
          <Pressable key={s} onPress={() => setTexto((v) => (v ? `${v} ` : '') + s + ': ')} style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1 }]}>
            <View style={{ backgroundColor: c.bg1, borderRadius: radius.pill, paddingHorizontal: 13, paddingVertical: 8, marginBottom: 6 }}>
              <Txt v="caption" c={c.tx2}>{s}</Txt>
            </View>
          </Pressable>
        ))}
      </Row>

      {anterior ? (
        <Row gap={10} style={{ backgroundColor: c.bg1, borderRadius: radius.lg, padding: 14, marginTop: 12, alignItems: 'flex-start' }}>
          <Icon name="pencil" size={15} color={c.tx3} sw={1.9} />
          <View style={{ flex: 1 }}>
            <Txt v="micro" c={c.tx3}>JÁ ANOTADO</Txt>
            <Txt v="caption" c={c.tx2} style={{ marginTop: 4 }} numberOfLines={3}>{anterior}</Txt>
          </View>
        </Row>
      ) : null}

      <Pressable onPress={salvar} disabled={!texto.trim()} style={({ pressed }) => [{ marginTop: 16, opacity: !texto.trim() ? 0.4 : pressed ? 0.8 : 1 }]}>
        <View style={{ backgroundColor: c.accent, borderRadius: radius.pill, paddingVertical: 15, alignItems: 'center' }}>
          <Txt v="body" c={c.accentInk}>Guardar anotação</Txt>
        </View>
      </Pressable>
    </SheetScreen>
  );
}
