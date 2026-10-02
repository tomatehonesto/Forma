# Dez paletas, com a regra "sóbria + forte" verificada

**Data:** 02/10/2026 · **Estado:** aprovado pelo dono; regra e candidatas em
construção, imagens e ícones só depois da escolha dele

## Por quê

O dono quer voltar a 10 opções de cor, todas seguindo o racional das
originais — uma cor sóbria e uma forte —, sem casos de baixo contraste.

O levantamento de 02/10/2026 achou:
- O corte de 12 para 5 em 18/09 (`7d30cb6`) não foi por contraste: foi
  vizinhança de matiz (dois azuis parecidos são trabalho de escolher) e a
  fileira única de 65 px.
- O contraste baixo existe assim mesmo: as removidas Menta, Sálvia e Índigo
  quebravam a regra; e **no modo escuro as 4 paletas atuais além da Original
  falham** no painel da Jornada, no "+" e no avatar (branco sobre o painel
  1,74:1 na Floresta) — a derivação em `comPaleta` usa a cor de ação CLARA
  como superfície no escuro, e só a Original escapa por ser ajustada à mão.
- Colisões de sentido: a forte da Amora é quase o teal fixo do app; o laranja
  da Brasa é quase o vermelho destrutivo.
- Não existe validador de contraste.

## A regra

Papéis: **S** (sóbria, `acaoClara`) é escura e carrega branco; **C** (clara,
`acaoEscura`) é a versão para texto e links no modo escuro; **F** (forte,
`alcancado`) é luminosa e carrega preto.

Bloqueantes (contraste WCAG 2.x, alfas compostos sobre a superfície real):
tinta × S ≥ 4,5; S × fundo ≥ 4,5; S × accentWeak ≥ 4,5; F × S ≥ 3; tinta × F ≥
7; limeSoftInk × limeSoft ≥ 4,5 nos dois modos; luminância de F ≥ 0,55 e F
sobre a aurora com véu 0,5 ≥ 4,5; F × altMid ≥ 4,5 e F × véu ≥ 7; no escuro,
tinta × C ≥ 4,5, C × bg1 ≥ 4,5, C × accentWeak ≥ 4,5, branco × painel ≥ 4,5 e F
× painel ≥ 3. Sentido: ΔEok(F, teal fixo) ≥ 10 e ΔEok(S, vermelho destrutivo)
≥ 15. Avisos: ΔEok(C, F) ≥ 20 no escuro; entre paletas, sóbrias a ΔEok ≥ 10
e o par a ≥ 20. Nome com até 8 letras.

## Desenho

1. `scripts/paletas.ts` importa os tokens derivados de verdade (`PALETAS`,
   `comPaleta`, `light`, `dark`), confere a tabela, imprime ok/NÃO e sai com
   código 1 se falhar. Os geradores de aurora e de ícone se recusam a rodar
   com falha.
2. Conserto do modo escuro: painel, `grad*`, avatar e "+" saem da sóbria no
   escuro, como a Original faz à mão. Nada muda no claro.
3. Dez candidatas que passam, com prévia visual para o dono escolher antes de
   gerar qualquer imagem.
4. Depois da escolha: `PALETAS`, auroras (9 por paleta, ~0,65 MB cada
   conjunto), ícones alternativos (exigem build nativo novo, sem OTA), duas
   fileiras de 5 em Aparência, `PENDENCIAS` atualizado.
