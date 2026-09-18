import React from 'react';
import { useStore } from '../logic/store';
import { paletaDe, comPaleta, dark, mix, alfa, type Palette } from '../theme';

/* ============================================================
   A PALETA DAS TELAS DE VENDA

   ⚠️ ELA EXISTE PORQUE SÃO DUAS TELAS, E NÃO UMA. O paywall e a folha do
   código de convite são a mesma conversa: a folha abre por cima do
   paywall, ancorada nele. Cada uma calculando a própria versão do escuro
   dava o defeito óbvio — folha branca deslizando sobre tela preta — e
   daria de novo na primeira que alguém acrescentasse.

   ⚠️ AS TELAS DE VENDA SÃO ESCURAS, E NÃO SEGUEM O TEMA DA PESSOA. É a
   única parte do aplicativo onde isso vale: o resto obedece ao claro e
   ao escuro do sistema porque é a casa dela, e esta é a vitrine. Escuro,
   a aurora e a peça do aparelho aparecem; no claro elas viram uma mancha
   pálida no alto de um formulário.

   ⚠️ MAS A COR DE AÇÃO É A CLARA, E NÃO A DO MODO ESCURO.

   Cada paleta tem dois tons de ação: o cheio, que é o do Figma e o da
   marca — #065CF5 no azul —, e um mais claro que o tema escuro usa para
   não afundar num fundo já escuro. Fixar o modo trazia o segundo junto,
   e o botão apareceu num azul que não é o da marca.

   O motivo do tom claro existir não vale aqui: ele serve a telas escuras
   em que a cor precisa competir com muito conteúdo. Estas são quase toda
   pretas, e o azul cheio salta nelas do mesmo jeito que salta no claro —
   com a vantagem de ser o azul que a pessoa viu na loja, no ícone e na
   abertura.

   Então o modo é escuro e a cor de ação é a da marca. O resto da paleta
   escura fica como está: fundo, tinta, fios e o lima.

   ⚠️ E QUEM USAR ISTO TEM QUE DAR `c` EM TODO `Txt`. Esta paleta não
   passa por contexto nenhum: `Txt` sem a propriedade `c` cai no
   `useTheme()`, que lê o tema do APARELHO. Num telefone no claro, o
   texto sai escuro sobre o fundo escuro daqui e some — e some só para
   quem usa o aplicativo no claro, que é o jeito mais silencioso de um
   defeito existir. Já aconteceu, em quatro textos de uma vez.
   ============================================================ */
export function usePaletaDeVenda(): Palette {
  const paleta = useStore((s) => (s.S as any).paleta as string | undefined);
  return React.useMemo(() => {
    const base = comPaleta(dark, paleta, true);
    const p = paletaDe(paleta);
    return {
      ...base,
      accent: p.acaoClara,
      /* No escuro o segundo tom clareia, e é ele que veste link e texto
         sobre fundo preto — a mesma regra do resto do aplicativo. */
      accent2: mix(p.acaoClara, '#FFFFFF', 0.22),
      accentInk: p.inkClaro,
      accentWeak: alfa(p.acaoClara, 0.22),
      accentLine: alfa(p.acaoClara, 0.38),
    };
  }, [paleta]);
}
