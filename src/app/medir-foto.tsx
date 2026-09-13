import React, { useState } from 'react';
import { View, Pressable, TextInput } from 'react-native';
import { useRouter } from 'expo-router';
import { useStore } from '../logic/store';
import { journeyDay } from '../logic/derive';
import { now } from '../logic/time';
import { Txt, Row, SheetScreen } from '../ui/kit';
import { Icon } from '../ui/Icon';
import { useTheme } from '../ui/useTheme';
import { radius, font } from '../theme';

/* Foto de progresso — captura.

   A câmera ainda não existe no app: falta expo-camera e um lugar seguro
   para guardar imagem de corpo, que é dado sensível. Então o registro
   guarda o marco (semana e etiqueta) e a foto entra quando essa parte
   estiver resolvida. Melhor um registro honesto e incompleto do que um
   botão que não faz nada. */
export default function MedirFoto() {
  const S = useStore((s) => s.S);
  const update = useStore((s) => s.update);
  const { c } = useTheme();
  const router = useRouter();

  const semana = Math.max(1, Math.ceil(journeyDay(S) / 7));
  const [tag, setTag] = useState(`semana ${semana}`);

  const salvar = () => {
    update((s: any) => { s.photos.push({ t: +now(), tag: tag.trim() || `semana ${semana}` }); });
    router.back();
  };

  return (
    <SheetScreen titulo="Foto de progresso" sub={`${S.photos.length} registradas até agora`} onClose={() => router.back()}>
      <View style={{ backgroundColor: c.bg1, borderRadius: radius.lg, padding: 22, marginTop: 18, alignItems: 'center' }}>
        <View style={{ width: 64, height: 64, borderRadius: 32, backgroundColor: c.bg2, alignItems: 'center', justifyContent: 'center' }}>
          <Icon name="camera" size={28} color={c.tx3} sw={1.8} />
        </View>
        <Txt v="body" c={c.tx3} style={{ marginTop: 14, textAlign: 'center' }}>Câmera ainda não disponível</Txt>
        <Txt v="micro" c={c.tx4} style={{ marginTop: 4, textAlign: 'center' }}>
          Por enquanto o app guarda o marco desta semana e a imagem entra depois.
        </Txt>
      </View>

      <View style={{ backgroundColor: c.bg1, borderRadius: radius.lg, marginTop: 7, paddingHorizontal: 18 }}>
        <Txt v="caption" c={c.tx3} style={{ marginTop: 14 }}>Como quer chamar este momento?</Txt>
        <TextInput
          value={tag} onChangeText={setTag} selectTextOnFocus
          placeholder={`semana ${semana}`} placeholderTextColor={c.tx4}
          style={{ paddingVertical: 12, paddingBottom: 16, color: c.tx, fontFamily: font.body, fontSize: 19 }}
        />
      </View>

      <Pressable onPress={salvar} style={({ pressed }) => [{ marginTop: 16, opacity: pressed ? 0.8 : 1 }]}>
        <View style={{ backgroundColor: c.accent, borderRadius: radius.pill, paddingVertical: 15, alignItems: 'center' }}>
          <Txt v="body" c={c.accentInk}>Marcar "{tag.trim() || `semana ${semana}`}"</Txt>
        </View>
      </Pressable>
    </SheetScreen>
  );
}
