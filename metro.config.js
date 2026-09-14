const { getDefaultConfig } = require('expo/metro-config');

/* O lucide expõe cada ícone em `lucide-react-native/icons/<nome>`, e esse
   caminho só existe no campo `exports` do package.json dele. Sem os
   exports ligados, o Metro não acha o arquivo e o bundle quebra.

   Importar do índice resolveria também, e traria os 1839 ícones da
   biblioteca para dentro do bundle — a gente usa 68. */
const config = getDefaultConfig(__dirname);
config.resolver.unstable_enablePackageExports = true;

/* `servidor/` é outro deploy, com node_modules próprio. Sem bloquear,
   o Metro varre aquela pasta e pode achar duas cópias de um pacote — e
   o app não importa nada de lá. */
const bloqueado = /[\/]servidor[\/].*/;
config.resolver.blockList = config.resolver.blockList
  ? [config.resolver.blockList, bloqueado].flat()
  : [bloqueado];

module.exports = config;
