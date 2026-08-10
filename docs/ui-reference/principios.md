# Princípios de UI — destilados da Ron

O que aprendi analisando 15 cases de HealthTech, o site e os perfis públicos
da Ron Design Lab. Não são regras deles: é o que consegui deduzir de padrões
que se repetem em trabalhos diferentes, reescrito como decisão aplicável ao
Forma.

Quando um princípio conflitar com o frame do Figma, **o Figma vence**.

---

## 1. O número não é o protagonista. O veredito é.

O case Luna traz a formulação escrita dentro de uma tela:

> Precision → Soft clarity · Data → Atmosphere · Metrics → Emotional insight

Na prática: eles nunca mostram um valor sozinho. É sempre `92 mg/dL` **com**
`Peak Glucose` embaixo; `74%` **com** `Optimal` ao lado. O número dá a
medida, a palavra dá o julgamento — e é o julgamento que a pessoa procura.

**No Forma:** hoje o card mostra `37%` e `Meta: 28%` e deixa a conta para o
paciente. Num app clínico isso é pior que em fitness: a pessoa está ansiosa e
vai interpretar sozinha. Toda métrica precisa de um qualificador.

## 2. Um acento só, e ele é ácido.

Aetna: `#E1FF01`. Veri: lima quase igual. Luna: um único azul-neve. Nunca
duas cores fortes competindo. O resto da tela é escala de cinza.

**No Forma:** já temos dois (azul elétrico + lima). Funciona porque têm
papéis distintos — azul é ação, lima é conquista/energia. A regra a manter é
**nunca introduzir um terceiro**. As cores de dado (`purple`, `amber`, `rose`
do `theme.ts`) ainda são chute e deveriam encolher, não crescer.

## 3. Escada neutra longa, não três cinzas.

O guia do Aetna mostra a rampa: `#000000` → `#1E1E1E` → `#2A2A2A` →
`#353535` → `#FFFFFF`. Cinco degraus de quase-preto. A hierarquia inteira sai
daí, sem precisar de cor.

**No Forma:** temos `tx / tx2 / tx3 / tx4` — quatro degraus. Está certo.
O erro seria resolver hierarquia com cor quando a escada resolve.

## 4. Separação por tom, nunca por borda.

Não há uma borda em nenhum lugar do trabalho deles. Superfície se distingue
por preenchimento — branco sobre quase-branco, ou preto translúcido sobre
preto.

**No Forma:** já aplicado. O `Card` perdeu a borda; a separação é o branco
sobre `#F5F6FA` mais 5% de sombra.

## 5. Peso leve em tamanho grande.

Título de 46px em Regular/SemiBold, não em Bold. A hierarquia vem do
**tamanho e do espaço**, não da gordura da letra. Negrito é reservado.

**No Forma:** o `ty.display` é 34px em peso 300. É a mesma ideia. A tentação
a resistir é engrossar título quando ele parece fraco — o problema quase
sempre é falta de espaço em volta, não falta de peso.

## 6. Atmosfera só no momento de destaque.

Luna e Veri usam fotografia e gradiente no hero e nos momentos de marca. O
miolo operacional é chapado e sóbrio. A imagem é evento, não papel de parede.

**No Forma:** a aurora no hero e a folha clara no resto já seguem isso. O
erro seria espalhar imagem pelas outras telas achando que "deixa bonito".

## 7. Estado embutido na forma, não só no texto.

Veri mostra o mesmo card em dois tratamentos — fundo lima e fundo preto —
para separar o que está ativo do que é histórico. A diferença é lida antes de
qualquer leitura de texto.

**No Forma:** aplicável a aplicação feita vs. pendente, meta batida vs. em
aberto, exame dentro vs. fora da faixa.

## 8. Filtro é chip, e o chip conta.

Kenko: `All` · `Today 4` · `Tomorrow`. O número dentro do chip diz quanto tem
atrás dele **antes** de tocar. Filtro sem contagem obriga a tentar para
descobrir que está vazio.

**No Forma:** a Linha do tempo tem um botão de filtro que não faz nada
(`jornada.tsx:46`, sem `onPress`), e a árvore pede 8 tipos de filtro. Devem
ser chips com contagem, não um menu.

## 9. Valor e unidade são dois elementos.

`110` grande, `mg/dL` pequeno embaixo, alinhados à direita. Nunca a string
`110mg/dL`. Isso deixa a coluna de números alinhada e o valor legível de
relance.

**No Forma:** hoje é string única (`57g`, `2,0 L`, `10 min.`). Separar
melhora o alinhamento dos três cards de meta.

## 10. Arco aberto quando não existe "cheio".

Veri e Luna usam arco fino e incompleto — sem trilho, sem preenchimento
sólido — para grandezas que não têm teto natural. Barra de progresso só onde
existe meta dura.

**No Forma:** proteína, água e exercício têm alvo → barra está certa. Adesão,
sono, energia e humor não têm "cheio" → a barra mente ali.

---

## O que NÃO copiar

- **A paleta.** A deles é lima ácido sobre preto. A do Forma é azul + lima
  sobre claro, definida no Figma. A referência é de estrutura e método.
- **O tom.** Ron desenha produto de desejo. O Forma acompanha tratamento
  médico: onde eles podem ser abstratos, o Forma precisa ser inequívoco.
  Próxima dose, local de aplicação e receita não viram atmosfera.
- **A densidade de dashboard.** Metade dos cases é SaaS web para
  especialista. O Forma é para o paciente, no celular, muitas vezes ansioso.

## Fontes

15 cases de HealthTech (`aetna`, `oscar-health`, `veri` ×2, `kenko`,
`zocdoc`, `sensates`, `phr`, `healthiv`, 5× `ehr`, `clause-os`), o site, o
Dribbble (38 shots) e o Behance (12 projetos, ~4,5M views).

O Instagram não foi analisado: exige login e devolve apenas o muro.

---

## Vocabulário de forma

Os dez princípios acima falam de hierarquia, restrição e voz. Faltava o
repertório: COM O QUÊ se constrói. Sem ele, o resultado converge sempre
para card + título + texto + lista — que informa e não comunica, porque
quatro números iguais em quatro caixas iguais fazem o olho tratar tudo
como a mesma coisa.

### O teste

Um elemento visual só entra se **parar de funcionar quando o dado muda**.
É isso que separa instrumento de decoração. Um marcador que aponta sempre
para o meio é enfeite; um que anda com o ciclo da dose é informação.

O erro oposto também existe e foi o meu: internalizar "nada decorativo"
a ponto de rejeitar qualquer forma expressiva. Quando a forma codifica o
dado, expressivo é o contrário de decorativo.

### As peças (`src/ui/instrumentos.tsx`)

**Medidor** — régua de traços com marcador triangular. Para posição numa
faixa: dose no ciclo, exame na referência, proteína contra a meta. O
triângulo é lido como "aqui" sem legenda, e a densidade dos traços dá
escala contínua que barra de progresso não dá.

**Glifos** — uma forma por unidade, cheias e vazias. Só para unidade
discreta e pequena (doses, copos, aplicações na semana): a que falta
aparece como ausência, e "3 de 4" deixa de precisar ser lido. Acima de
oito unidades o olho volta a contar, e aí uma barra informa melhor.

**Fulgor** — clarão radial atrás de um número. O único que existe por
ênfase pura: marca qual é o valor principal quando tamanho de fonte já
chegou ao limite. No máximo um por tela — dois fulgores é nenhum.

**Curva viva** — série com traço em degradê e ponto aceso na ponta. A
ponta é o argumento: diz "aqui é agora" e transforma histórico em coisa
que ainda acontece. Sem eixo nem grade.

**Nível** — traços finos em grupos de três, um grupo por unidade. Diz o
mesmo que o Glifos numa voz mais baixa: a cápsula tem corpo e vira o
assunto do card, o traço custa quase nada e continua contável. Para dado
verdadeiro e secundário — estoque da caneta, copos restantes. A leitura
é de densidade caindo, que é o que "nível" quer dizer.

**Grade** — uma célula por período, acesa quando cumprido. Para presença
ao longo do tempo. O que ela faz e um número não faz: mostra ONDE. "87%
de adesão" é verdade e é opaco; duas células vazias seguidas em maio
explicam um platô. A ausência ganha posição.

**Segmentado** — pílula de recortes (D · S · M). Só quando as opções são
o mesmo dado em outra janela; se levam a conteúdos diferentes, são abas.

**Malha** (em `cuidado.tsx`) — quatro elipses radiais sobrepostas. Onde
duas se encontram nasce um tom que não está em nenhuma: é o que dá
aspecto de pintura, e o que LinearGradient não produz por mais paradas
que tenha. Duas famílias: clara com o texto escuro à esquerda, escura
com o texto branco por cima de tudo.

### Quando NÃO usar

Se o dado cabe num número e o número basta, use texto. Estas peças
existem para quando comparação, posição numa escala ou passagem do tempo
é o que importa — e nenhum número sozinho mostra isso.

---

## Auditoria: cinco violações minhas

Reli este documento contra o que eu tinha construído e achei cinco
lugares onde ousei sem refinar. Ficam registrados porque o erro é mais
instrutivo que a regra.

**1. Luz interna na cápsula.** Eu tinha posto um reflexo branco no alto
de cada glifo "para dar volume". É gloss esqueumórfico — o botão lustroso
de 2008 — e não existe em nenhuma peça da Ron: lá a luz vem da cor
emitindo para fora, nunca de um highlight especular fingindo vidro por
dentro. **Regra:** volume se faz com degradê e fulgor. Se a forma precisa
de reflexo para parecer objeto, o problema é a forma.

**2. Quatro cores na malha.** Usei purple e teal como protagonistas,
contra o princípio 2, que manda as cores de dado ENCOLHEREM. Ficou bonito
e de outra marca. **Regra:** a malha é a rampa do azul com um ponto de
lima; a variação de tom vem da sobreposição, não de acrescentar matiz.

**3. Duas atmosferas na mesma rolagem.** Hero com malha e card de
tratamento com malha viola o princípio 6 — atmosfera é evento, não papel
de parede. E tinha um custo prático: fulgor sobre campo pintado é luz
sobre luz, e as duas se anulam. **Regra:** a pintura fica no momento de
marca; o instrumento ganha campo limpo.

**4. Botão em contorno cinza.** Contra o princípio 4. Virou preenchimento
tonal. **Nota:** fio divisor entre linhas de lista NÃO é isso — o
princípio fala de contorno em volta de superfície.

**5. Régua com fim.** Ela tinha 24 traços fixos: na semana 24 estaria
cheia, e tratamento com GLP-1 não tem alta marcada. Era o princípio 10
invertido. **Regra:** a régua cresce com a pessoa e o futuro se dissolve
até sumir na borda, sem nunca completar.

O padrão dos cinco é o mesmo: ousadia sem o refinamento que a torna
coerente. Ousar é acrescentar; refinar é tirar o que sobra da ousadia.

**6. Peça certa, pergunta errada.** Pus um Medidor em "onde você está no
ciclo da dose" e o resultado não dizia nada — nem para mim, olhando. A
causa não era acabamento: o Medidor comunica posição numa faixa
CONTÍNUA, e o ciclo da dose é contado em dias. Ele respondia uma
pergunta que ninguém tinha feito. Trocado por sete blocos, um por dia,
a mesma informação passou a se ler sem legenda. **Regra:** quando um
instrumento "não diz nada", desconfiar da escolha antes do desenho —
refinar a peça errada não a torna certa.
