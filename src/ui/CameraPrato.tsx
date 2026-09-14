import React, { useRef, useState } from 'react';
import { View, Pressable, ActivityIndicator, StyleSheet } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import { Txt, Row } from './kit';
import { Icon } from './Icon';
import { useTheme } from './useTheme';
import { radius } from '../theme';

/* ============================================================
   A CÂMERA DO PRATO

   Tela cheia, e não uma janelinha dentro do formulário: tirar foto de
   comida pede enquadrar, e enquadrar pede a tela toda.

   Ela não analisa nada — devolve a imagem e sai. Quem lê é
   `analisarFoto`, na tela de refeição, que é onde o resultado precisa
   pousar. Assim esta peça não sabe de proteína, e a fase 3 não precisa
   encostar nela.

   A dica de enquadramento não é enfeite: prato inteiro e de cima é o que
   dá ao analisador a chance de ver tudo que está lá e de comparar os
   tamanhos entre si. Foto de perto de um pedaço só esconde metade da
   refeição — e o que a foto não vê, ninguém soma depois.
   ============================================================ */

export function CameraPrato({ onFoto, onFechar }: {
  onFoto: (uri: string) => void;
  onFechar: () => void;
}) {
  const { c } = useTheme();
  const [permissao, pedirPermissao] = useCameraPermissions();
  const camera = useRef<CameraView>(null);
  const [tirando, setTirando] = useState(false);

  const daGaleria = async () => {
    const r = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'], quality: 0.6,
    });
    if (!r.canceled && r.assets[0]) onFoto(r.assets[0].uri);
  };

  const tirar = async () => {
    if (tirando) return;
    setTirando(true);
    try {
      const foto = await camera.current?.takePictureAsync({ quality: 0.6 });
      if (foto?.uri) onFoto(foto.uri);
    } finally {
      setTirando(false);
    }
  };

  /* Enquanto o sistema não respondeu, a tela fica quieta: piscar um
     pedido de permissão e trocar por outra coisa meio segundo depois é
     pior do que esperar. */
  if (!permissao) return <View style={{ flex: 1, backgroundColor: '#000' }} />;

  if (!permissao.granted) {
    return (
      <View style={{ flex: 1, backgroundColor: c.bg, padding: 24, justifyContent: 'center' }}>
        <Icon name="camera" size={28} color={c.tx3} sw={1.8} />
        <Txt v="h2" style={{ marginTop: 16 }}>Precisa da câmera</Txt>
        <Txt v="caption" c={c.tx3} style={{ marginTop: 8 }}>
          É a câmera que lê o prato e estima a proteína da refeição. A foto é usada para
          isso e nada mais.
        </Txt>

        <Pressable onPress={pedirPermissao} style={({ pressed }) => [{ marginTop: 22, opacity: pressed ? 0.8 : 1 }]}>
          <View style={{ backgroundColor: c.accent, borderRadius: radius.pill, paddingVertical: 15, alignItems: 'center' }}>
            <Txt v="body" c={c.accentInk}>Permitir a câmera</Txt>
          </View>
        </Pressable>

        {/* Quem não quer dar a câmera ainda pode escolher uma foto já
            tirada: negar o acesso não devia fechar o caminho inteiro. */}
        <Pressable onPress={daGaleria} style={({ pressed }) => [{ marginTop: 10, opacity: pressed ? 0.7 : 1 }]}>
          <View style={{ paddingVertical: 13, alignItems: 'center' }}>
            <Txt v="label" c={c.accent}>Escolher uma foto</Txt>
          </View>
        </Pressable>
        <Pressable onPress={onFechar} style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1 }]}>
          <View style={{ paddingVertical: 8, alignItems: 'center' }}>
            <Txt v="label" c={c.tx3}>Agora não</Txt>
          </View>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#000' }}>
      <CameraView ref={camera} style={StyleSheet.absoluteFill} facing="back" />

      {/* Fechar por cima da imagem, sem barra: a foto é o conteúdo. */}
      <Pressable onPress={onFechar} hitSlop={12} style={{ position: 'absolute', top: 54, left: 20 }}>
        <View style={{
          width: 38, height: 38, borderRadius: 19,
          backgroundColor: 'rgba(0,0,0,0.45)', alignItems: 'center', justifyContent: 'center',
        }}>
          <Icon name="x" size={18} color="#fff" sw={2.2} />
        </View>
      </Pressable>

      <View style={{ position: 'absolute', left: 0, right: 0, bottom: 0, paddingBottom: 46, paddingHorizontal: 28 }}>
        <Txt v="caption" c="rgba(255,255,255,0.86)" style={{ textAlign: 'center', marginBottom: 20 }}>
          O prato inteiro, visto de cima
        </Txt>

        <Row style={{ justifyContent: 'space-between', alignItems: 'center' }}>
          <Pressable onPress={daGaleria} hitSlop={12} style={({ pressed }) => [{ opacity: pressed ? 0.6 : 1 }]}>
            <View style={{
              width: 46, height: 46, borderRadius: radius.md,
              backgroundColor: 'rgba(255,255,255,0.18)', alignItems: 'center', justifyContent: 'center',
            }}>
              <Icon name="image" size={20} color="#fff" sw={1.9} />
            </View>
          </Pressable>

          <Pressable onPress={tirar} disabled={tirando} style={({ pressed }) => [{ opacity: pressed ? 0.8 : 1 }]}>
            <View style={{
              width: 74, height: 74, borderRadius: 37, borderWidth: 4, borderColor: 'rgba(255,255,255,0.55)',
              alignItems: 'center', justifyContent: 'center',
            }}>
              <View style={{ width: 58, height: 58, borderRadius: 29, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center' }}>
                {tirando ? <ActivityIndicator color="#000" /> : null}
              </View>
            </View>
          </Pressable>

          {/* O vão do tamanho da galeria, para o botão de tirar ficar no
              meio de verdade. */}
          <View style={{ width: 46 }} />
        </Row>
      </View>
    </View>
  );
}
