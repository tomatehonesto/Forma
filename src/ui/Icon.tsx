import React, { memo } from 'react';
import { SvgXml } from 'react-native-svg';
import { P } from './iconpaths';

/* Reaproveita os paths do protótipo verbatim via SvgXml (sem lib de ícones). */
export const Icon = memo(function Icon({
  name, size = 20, color = '#0F2E38', sw = 1.7,
}: { name: string; size?: number; color?: string; sw?: number }) {
  const body = (P[name] || '').replace(/currentColor/g, color);
  const xml =
    `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 24 24" ` +
    `fill="none" stroke="${color}" stroke-width="${sw}" stroke-linecap="round" stroke-linejoin="round">${body}</svg>`;
  return <SvgXml xml={xml} width={size} height={size} />;
});
