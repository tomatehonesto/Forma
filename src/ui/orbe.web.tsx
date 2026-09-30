import React from 'react';
import { View } from 'react-native';
import { WithSkiaWeb } from '@shopify/react-native-skia/lib/module/web';
import type { PropsDoOrbe } from './orbe/OrbeSkia';

/* O orbe na web: o Skia da web (CanvasKit) é um arquivo à parte, e só é
   buscado quando o orbe aparece. Enquanto carrega, o lugar fica
   reservado, do mesmo tamanho, para a saudação não pular.

   ⚠️ A VERSÃO DO CANVASKIT É A QUE O SKIA INSTALADO PEDE
   (node_modules/canvaskit-wasm). Trocar o Skia de versão pede conferir
   esta linha. A web é só a de desenvolvimento: o aplicativo é o do
   aparelho. */
const CANVASKIT = '0.41.0';

export function Orbe(props: PropsDoOrbe) {
  return (
    <WithSkiaWeb
      getComponent={() => import('./orbe/OrbeSkia')}
      opts={{ locateFile: (f: string) => `https://cdn.jsdelivr.net/npm/canvaskit-wasm@${CANVASKIT}/bin/full/${f}` }}
      fallback={<View style={{ width: props.tamanho, height: props.tamanho }} />}
      componentProps={props}
    />
  );
}
