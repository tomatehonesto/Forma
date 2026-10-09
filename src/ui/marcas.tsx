import React from 'react';
import { Platform, Pressable, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { Txt } from './kit';
import { radius } from '../theme';

/* ============================================================
   OS BOTÕES DE ENTRAR COM A APPLE E COM O GOOGLE

   ⚠️ OS DOIS SEGUEM A DIRETRIZ DE CADA MARCA, e é por isso que não são a
   pílula do app: o logotipo inteiro, sem mudar cor nem proporção, ao
   lado do texto; a Apple em preto no claro e em branco no escuro; o
   Google em branco com contorno no claro e no cinza quase preto dele no
   escuro. A altura é a da pílula do app, para as portas empilhadas terem
   o mesmo tamanho.

   ⚠️ A APPLE É ESTE BOTÃO, E NÃO O DO SISTEMA (09/10/2026). O do sistema
   (`AppleAuthenticationButton`) não deixa escolher a letra: ele a calcula
   pela altura, e na altura da pílula ela saía muito maior que a do Google
   e a do e-mail — o dono viu no iPhone. A diretriz da Apple permite botão
   próprio, com regras que este segue: o logotipo e o título na mesma cor,
   preto no claro e branco no escuro, sem outra cor; o título é um dos
   aprovados ("Continuar com a Apple", traduzido pelo catálogo); e o
   tamanho e o peso da letra podem ser ajustados — no iPhone, a letra do
   título é a do sistema, no tamanho das outras portas. A revisão confere
   esse desenho: mudar cor, logotipo ou título aqui é mexer no que ela olha.
   ============================================================ */

const ALTURA = 64;

export function LogoDaApple({ size = 20, color }: { size?: number; color: string }) {
  return (
    <Svg width={size * 0.814} height={size} viewBox="0 0 814 1000">
      <Path
        fill={color}
        d="M788.1 340.9c-5.8 4.5-108.2 62.2-108.2 190.5 0 148.4 130.3 200.9 134.2 202.2-.6 3.2-20.7 71.9-68.7 141.9-42.8 61.6-87.5 123.1-155.5 123.1s-85.5-39.5-164-39.5c-76.5 0-103.7 40.8-165.9 40.8s-105.6-57-155.5-127C46.7 790.7 0 663 0 541.8c0-194.4 126.4-297.5 250.8-297.5 66.1 0 121.2 43.4 162.7 43.4 39.5 0 101.1-46 176.3-46 28.5 0 130.9 2.6 198.3 99.2zm-234-181.5c31.1-36.9 53.1-88.1 53.1-139.3 0-7.1-.6-14.3-1.9-20.1-50.6 1.9-110.8 33.7-147.1 75.8-28.5 32.4-55.1 83.6-55.1 135.5 0 7.8 1.3 15.6 1.9 18.1 3.2.6 8.4 1.3 13.6 1.3 45.4 0 102.5-30.4 135.5-71.3z"
      />
    </Svg>
  );
}

/** O "G" nas quatro cores, como a marca pede — nunca numa cor só. */
export function LogoDoGoogle({ size = 20 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 48 48">
      <Path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
      <Path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
      <Path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
      <Path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
    </Svg>
  );
}

function Porta({ label, fundo, tinta, borda, logo, onPress, letraDoSistema }: {
  label: string; fundo: string; tinta: string; borda?: string; logo: React.ReactNode; onPress: () => void;
  /** o título na letra do sistema (a da Apple no iPhone), no tamanho das outras portas */
  letraDoSistema?: boolean;
}) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={label}
      style={({ pressed }) => [{
        height: ALTURA, borderRadius: radius.pill, backgroundColor: fundo,
        borderWidth: borda ? 1 : 0, borderColor: borda,
        flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10,
        opacity: pressed ? 0.8 : 1,
      }]}
    >
      <View style={{ marginTop: -2 }}>{logo}</View>
      <Txt
        v="bodyMed" c={tinta}
        style={letraDoSistema && Platform.OS === 'ios' ? { fontFamily: 'System', fontWeight: '500' } : undefined}
      >
        {label}
      </Txt>
    </Pressable>
  );
}

export function BotaoDaApple({ label, escuro, onPress }: { label: string; escuro: boolean; onPress: () => void }) {
  const fundo = escuro ? '#FFFFFF' : '#000000';
  const tinta = escuro ? '#000000' : '#FFFFFF';
  return (
    <Porta
      label={label} fundo={fundo} tinta={tinta} letraDoSistema
      logo={<LogoDaApple size={20} color={tinta} />} onPress={onPress}
    />
  );
}

export function BotaoDoGoogle({ label, escuro, onPress }: { label: string; escuro: boolean; onPress: () => void }) {
  return (
    <Porta
      label={label}
      fundo={escuro ? '#131314' : '#FFFFFF'}
      tinta={escuro ? '#E3E3E3' : '#1F1F1F'}
      borda={escuro ? '#8E918F' : '#747775'}
      logo={<LogoDoGoogle size={20} />}
      onPress={onPress}
    />
  );
}
