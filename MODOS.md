# Os modos do aplicativo

Como o Morphi muda de forma conforme quem está do outro lado: quem paga,
quem acompanha, e em que país. Escrito em 18 de setembro de 2026, a
partir do alinhamento de produto.

---

## O que foi pedido

Três situações de quem usa:

| # | quem é | paga? |
|---|---|---|
| 1 | veio por indicação de especialista **credenciado** | **não** |
| 2 | veio por conta própria, tem médico **não credenciado** | sim |
| 3 | veio por conta própria, **sem acompanhamento** | sim |

E uma quarta coisa, que não é uma delas: **fora do Brasil não existe a
rede credenciada**, e o aplicativo precisa funcionar sem ela.

---

## Não são três aplicativos. São dois fatos.

As três situações misturam **duas perguntas independentes**, e separá-las
é o que faz o resto caber:

**Quem paga?** Uma pergunta só: *veio com convite de clínica
credenciada?* Sim, é isento enquanto o vínculo durar. Não, paga. Os modos
2 e 3 pagam igual — para a cobrança, eles são **o mesmo modo**.

**Quem acompanha?** Três estados: clínica na plataforma / médico próprio,
fora dela / ninguém.

Cruzando as duas, o aplicativo não tem três formas. Tem **duas: conectado
e não conectado** — e um terceiro fato, o médico próprio, que muda o
conteúdo sem mudar a cobrança.

E o internacional não é um quarto modo: é **o Brasil sem o modo 1**.
Fora daqui existem os modos 2 e 3, exatamente como existem aqui.

> **Um aplicativo, dois sinais, um interruptor de mercado.**
> Não quatro builds.

---

## Os dois sinais

Hoje existe **um** sinal, e ele decide as duas coisas:

```ts
export const hasClinic = (S: State) => !!(S.profile.doctor || S.profile.clinic);
```

⚠️ **É exatamente aí que o modo 2 quebra.** No dia em que alguém escrever
"Dr. João, que não usa o Morphi" no perfil, este sinal fica verdadeiro — e
o aplicativo inteiro passa a oferecer mandar mensagem para ele, enviar o
resumo para a plataforma dele, pedir receita a ele e dizer "sua equipe
está acompanhando de perto". Tudo mentira, e mentira sobre saúde.

Precisa virar dois:

**`temAcompanhamento(S)`** — *alguém acompanha esta pessoa.* É um fato que
ela declara, e vale igual se veio do vínculo ou se ela digitou. Liga:

- a próxima consulta, e a contagem para ela
- "Prepare minha consulta" no companion
- os avisos de "prepare suas perguntas"
- o Resumo para o médico como **documento**
- a leitura de acompanhamento nos Insights

**`clinicaConectada(S)`** — *existe plataforma do outro lado.* Só um
código de convite liga isto. Liga:

- mensagens com a equipe
- **enviar** o resumo (o botão, não o resumo)
- solicitar receita
- a equipe, os materiais e os documentos que vêm da clínica
- a isenção da assinatura

A régua: **`temAcompanhamento` é sobre a vida da pessoa;
`clinicaConectada` é sobre a existência de um servidor.** Quando não
souber em qual cai, pergunte se a funcionalidade precisa de alguém
respondendo do outro lado.

### Quanto disso já está pronto

Vinte e dois pontos do código leem `hasClinic`. Classificando um por um, a
**maioria é `temAcompanhamento`** — consulta, preparar perguntas,
`nextConsult`, o estado da aba Cuidado. Ou seja: **o modo 2 já está quase
todo construído.** Ele só está trancado atrás do sinal errado.

---

## A aba Cuidado sem rede credenciada

É a pergunta mais difícil das quatro, porque a aba foi construída em volta
da clínica. Mas o nome dela nunca foi "Clínica" nem "Médico": é
**Cuidado** — e cuidado do tratamento é coisa que existe sem plataforma.

Dos oito blocos de hoje, seis sobrevivem:

| bloco | sem rede |
|---|---|
| Estado do tratamento (topo) | **fica** — lê os dados da própria pessoa |
| Precisa de você | **fica** — as pendências que nascem do protocolo |
| Consulta | **fica**, se ela registrou uma |
| Tratamento (dose, caneta) | **fica** — é o medicamento dela |
| Materiais | **fica** — conteúdo educativo não é da clínica |
| Documentos | **fica** — exames e receitas são o arquivo dela |
| Banner da especialista, Equipe | sai |
| Mensagens, solicitar receita | sai |

O que sai é o que precisa de alguém do outro lado. O que fica é a maior
parte — e é o tratamento, que é do que a aba deveria falar desde sempre.

⚠️ **E o estado "ninguém" precisa de conteúdo próprio.** Hoje ele é uma
vitrine da rede credenciada (`Descoberta`), que fora do Brasil não existe
e dentro do Brasil acabou de perder o botão, porque não havia porta. Essa
tela precisa ser reescrita em cima do que a pessoa tem: o tratamento dela,
os próximos passos, o resumo que ela pode levar a qualquer consulta.

---

## O modo é estado, e muda no meio

Não pode ser uma bifurcação no cadastro. Os quatro caminhos acontecem:

- começa sozinha pagando → a clínica a convida → vira isenta
- começa isenta → o vínculo termina → volta a pagar
- começa sem médico → arruma um, fora da plataforma
- tem médico próprio → esse médico se credencia

Em **todos**, a regra da casa vale: *nenhuma atualização das informações
deveria limpar os registros.* Trocar de modo não pode custar um dia de
diário.

Consequências diretas:

- o código de convite é uma **porta permanente**, no perfil — não um
  passo do cadastro que passa uma vez e nunca mais
- registrar quem acompanha é **edição de perfil**, reversível
- a isenção tem prazo de validade, e os Termos já prometem aviso antes de
  qualquer cobrança começar (seção sobre profissional parceiro)

---

## O que não é tela

### A clínica pode virar controladora junto

Se a clínica convida, é a razão da isenção e recebe dados, ela deixa de
ser só destinatária. A Política de hoje diz que a Delusional é a **única**
controladora e que a equipe vê apenas o que a pessoa envia. No modo 1 isso
precisa ser conferido — controladoria conjunta (LGPD, art. 5º, IX c/c art.
18) muda quem responde pelo quê, e muda o texto.

⚠️ E a percepção importa tanto quanto a regra: **"de graça porque a
clínica indicou" não pode soar como "a clínica comprou meus dados".** O
modo 1 tem de dizer, no momento do convite, que o vínculo não abre o
diário para ninguém.

### A loja olha código que libera conteúdo pago

Apple e Google têm regra sobre desbloquear assinatura por código fora da
compra no app. **Não sei qual é a regra hoje** e não vou chutar: precisa
ser conferida antes de desenhar o fluxo do convite, porque a resposta pode
mudar se o código entra no app ou num site.

### Os documentos são brasileiros

Termos e Política estão escritos sobre LGPD, CDC e Decreto 7.962/2013.
Fora do Brasil eles não valem: a União Europeia pede GDPR, com base legal
própria, encarregado e representante no bloco; os Estados Unidos têm regra
por estado. **Publicar o aplicativo em outro país sem documento daquele
país é o mesmo problema do item 2 do PENDENCIAS.md**, multiplicado.

---

## "Mundo todo" é muito maior do que tirar o médico

Vale dizer com todas as letras, porque a parte do especialista é a mais
fácil das cinco:

1. **Não existe nenhuma camada de tradução no projeto.** Zero. Todas as
   frases são literais em português, espalhadas por telas *e* por lógica —
   `derive.ts`, `conselhos.ts`, `alertas.ts`, `confirmacoes.ts`,
   `prato.ts` geram texto, não só as telas o exibem. São milhares de
   frases, e boa parte é montada com concordância de gênero e número.
2. **Os documentos**, acima.
3. **As unidades.** Quilo e centímetro estão no código como verdade;
   libra, pé e polegada não existem. E mudar unidade mexe em meta, em
   gráfico, em exame e no histórico já gravado.
4. **A base de alimentos é brasileira** — pratos, marcas, rotulagem. A
   leitura por foto responde em português sobre comida daqui.
5. **O medicamento é o menor problema**, e isso é uma boa notícia: o
   catálogo já traz Mounjaro, Zepbound, Ozempic, Wegovy, Trulicity,
   Saxenda e Victoza, e quem usa escolhe a caneta. O que muda por país é
   disponibilidade e indicação, não o dado.

---

## A ordem recomendada

> **Feito até aqui:** os dois sinais (1), a ficha de quem acompanha e a
> data da consulta (2), e o interruptor de mercado (5), em
> `src/logic/mercado.ts`. O cadastro passou a fazer as DUAS perguntas —
> "você tem acompanhamento médico?" e "chegou por indicação?" —, que são
> os dois eixos deste documento, e por isso são dois passos e não um.
> Falta a cobrança (3), a porta do convite que resolve o código (4) e a
> tradução (6).

1. **Separar os dois sinais** (`temAcompanhamento` / `clinicaConectada`).
   É o que destrava o modo 2, e é quase todo renomeação com critério.
2. **A porta de quem acompanha** — registrar médico, especialidade,
   clínica e data da consulta, sem plataforma nenhuma. Faz o modo 2
   existir de verdade, e dá destino ao card vazio do perfil.
3. **Um lugar só que diz quem paga** (`assinatura.ts`): isento por
   vínculo, ou pagante. Nada de a pergunta aparecer em duas telas com
   respostas diferentes.
4. **A porta do convite** — o código, que é a única coisa que liga
   `clinicaConectada`. Depois de conferir a regra da loja.
5. **O interruptor de mercado** — uma constante que diz se existe rede
   credenciada aqui. Desliga o modo 1 inteiro, incluindo a porta do
   convite e a vitrine.
6. **Tradução e documentos por jurisdição** — projeto próprio, e o maior
   dos seis.

Os passos 1 e 2 não dependem de servidor, de cobrança nem de decisão
jurídica. Os passos 3 a 5 dependem. O 6 depende de tudo.
