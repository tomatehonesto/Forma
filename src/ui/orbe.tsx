import React from 'react';
import OrbeSkia, { type PropsDoOrbe } from './orbe/OrbeSkia';

/* O orbe da Morphi Intelligence no aparelho: o Skia já vem carregado no
   iOS e no Android, e o desenho é importado direto. A web tem a própria
   versão (orbe.web.tsx), que carrega o Skia sob demanda. Ver
   ui/orbe/OrbeSkia para o desenho. */
export function Orbe(props: PropsDoOrbe) {
  return <OrbeSkia {...props} />;
}
