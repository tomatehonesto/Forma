# Dez paletas, com a regra "sóbria + forte" verificada

**Data:** 02/10/2026 · **Estado:** aplicado — as dez escolhidas pelo dono
estão em `src/theme.ts`, com auroras, ícones e a trava (ver "A escolha", no fim)

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

## A escolha (02/10/2026)

Cinco rodadas de prévia lado a lado (claro, escuro e sobre a aurora), com
as cores calculadas por `comPaleta`. O que o dono decidiu:

| Paleta | Sóbria | Clara | Forte | Aurora |
|---|---|---|---|---|
| Original | #065CF5 | #4C8BFF | #DDF62C | 0 / 1 |
| Amora | #6B3BF5 | #9B7BFF | #2BE8C8 | 12 / 1,05 |
| Vinho | #830F3E | #FFA3B1 | #FDEFBA | 80 / 0,75 |
| Telha | #852102 | #FF8F4F | #FFE2CC | 136 / 1 |
| Oliva | #555D1C | #BBC851 | #FDBA8A | 172 / 0,7 |
| Floresta | #15803D | #4ADE80 | #E9B8FF | −124 / 0,95 |
| Oceano | #017482 | #3ECCE2 | #FFBAD4 | −90 / 1 |
| Marinho | #033B7A | #559CD4 | #C3D4FD | −30 / 0,6 |
| Camurça | #655046 | #BB958E | #F6C3BB | 105 / 0,28 |
| Grafite | #2E3440 | #B6BECC | #FFEE32 | −17 / 0,12 |

- **Saíram** Pitaia e Brasa; quem as tinha vai para a Vinho e a Telha
  (`PALETA_QUE_SAIU`, usado em `ensureDefaults`). Ficaram pelo caminho,
  vistas e recusadas: Índigo e Ameixa (repetiam o roxo da Amora), Cacau,
  Urucum e Tucano (marrom/ferrugem; a Tucano era a Grafite no claro), Ocaso
  (no escuro, a Telha; a forte, a da Oliva), Malva (pastel possível, no
  lugar da Pitaia, que também saiu).
- **R17, uma cor de base por paleta**: família pelo matiz OKLCH (vermelho,
  terroso, verde, petróleo, azul, roxo, rosa, e cinza abaixo de croma 0,05),
  e no par Δh das sóbrias ≥ 20°, Δh das claras ≥ 26° e ΔEok das claras ≥ 8.
  Três pares ficam perto por decisão do dono e saem como aviso com nome:
  Original–Marinho, Floresta–Oliva, Camurça–Grafite (`PARES_APROVADOS`).
- **A Amora tem a família calma própria** (`calma`): a forte de sempre é o
  teal da má notícia que não cobra, e só nela essa família vira um azul
  calmo (#9ED1FD). A R18 confere a família de toda paleta (pílula, ponto no
  painel, longe do âmbar e do vermelho, cor e não cinza, longe da ação).
- **R16**: a escolha mora em `FILEIRAS_DA_ESCOLHA`, duas fileiras de cinco
  escritas à mão; a trava confere que toda paleta está numa delas, uma vez.
- **A Grafite ganhou amarelo-limão** (#FFEE32, a partir de uma referência
  do dono): antes dividia o verde-limão com a Original. Testadas também o
  amarelo-ouro (#FFD100) e a base de carvão neutro (#333533); as quatro
  passavam na trava, e ele escolheu o limão sobre o grafite de hoje.
