# Luna — Smart Ring / Health Tracking

`rondesignlab.com/cases/luna-mobile-app-smart-ring-health-tracking-ui`

O case mais próximo do Forma no portfólio deles: app mobile que transforma
biometria contínua em algo que a pessoa entende e sente. Mesmo problema —
dado clínico que não pode parecer planilha.

## A tese, nas palavras deles

Aparece escrita dentro de uma das telas do case:

> Precision → Soft clarity
> Data → Atmosphere
> Metrics → Emotional insight

É a formulação mais útil do documento inteiro. Traduzindo para decisão de
interface: **o número não é o protagonista, o estado é.** A precisão existe,
mas chega filtrada por uma camada de calma.

## O que eu li nas telas

**Atmosfera como plano de fundo.** As telas de destaque não têm fundo chapado:
têm fotografia desfocada, gradiente suave, névoa. O dado flutua sobre isso.
A paleta do case sai da própria imagem — azul-acinzentado, branco quente,
neutros dessaturados — em vez de ser aplicada por cima.

**Métrica em anel aberto, não em barra.** "Battery Life 74% Optimal" aparece
como arco fino e incompleto, traço branco de ~2px sobre a foto. Sem trilho
visível, sem preenchimento sólido. O arco sugere progresso sem o peso de uma
barra de progresso.

**Número e qualificador juntos.** Nunca `74%` sozinho: é `74%` grande com
`Optimal` pequeno ao lado, na mesma linha de base. O número dá o valor, a
palavra dá o veredito — a pessoa não precisa saber se 74 é bom.

**Tipografia leve em tamanho grande.** Títulos em peso baixo e corpo alto,
sem negrito. Hierarquia por tamanho e opacidade, não por peso.

**Opacidade como hierarquia.** Texto secundário é o mesmo branco em ~70%, não
um cinza diferente. Sobre foto, isso mantém a leitura coesa.

## O que serve para o Forma

Alinha com o que o frame da Home já faz — o hero de aurora com texto branco
em Outfit 300 é exatamente esse movimento. O que dá para levar adiante:

1. **Qualificador ao lado da métrica.** Hoje os cards de evolução mostram
   `37%` e `Meta: 28%` — a pessoa faz a conta sozinha. Um `Acima da meta` /
   `Na faixa` resolve na hora. Vale para gordura corporal, exames e vitais.
2. **Arco aberto em vez de barra** onde não há meta dura. As metas diárias
   (proteína, água, exercício) têm alvo definido e barra faz sentido. Mas
   adesão, sono e energia não têm "cheio" — o arco comunica melhor.
3. **Atmosfera nas telas de estado, não em todas.** Luna usa foto em momento
   de destaque; o miolo do app é branco e sóbrio. O Forma já faz isso: aurora
   no hero, folha clara no resto. Manter essa disciplina — o erro seria
   espalhar imagem por toda tela.
4. **Opacidade em vez de segundo cinza** sobre superfície escura. O
   `theme.ts` já tem `onHero2` a 80% e `onHeroLine` a 20%.

## O que NÃO serve

- A paleta dessaturada deles brigaria com o azul elétrico + lima da Home.
  A referência é de **estrutura e tom**, não de cor.
- Luna vende um objeto de desejo; o Forma acompanha tratamento médico. Onde
  Luna pode ser abstrato, o Forma precisa ser inequívoco — próxima dose, local
  de aplicação e receita não podem virar atmosfera.

## Sistema medido no DOM da página

| | |
|---|---|
| Tipografia | Urbanist (126 nós) — 400/600 |
| Texto | `rgb(0,0,0)` e `rgba(0,0,0,0.7)` |
| Fundos | `#FFFFFF`, `#DEDEDE`, `#000000`, `#FFE99D` (acento do case) |
| Imagens | 12 JPEGs de case, servidos por Cloudinary até 1800px |
