# Sua equipe — reforma de `/medico`, conversa em tela própria e perfil por integrante

Data: 18 de setembro de 2026
Telas: `/medico`, `/conversa` (nova), `/especialista` (generalizada)

---

## 1. O problema

`/medico` é o hub do lado de lá do tratamento: consulta, conversa,
protocolos, exames, prescrições, documentos e equipe. Ela cresceu por
acréscimo e hoje tem três defeitos de estrutura:

**A conversa é um card.** Um histórico de mensagens vive numa caixa de
250 px no meio de uma página que rola. O teclado abre por cima do que
ela está escrevendo, o histórico rola dentro de uma janela que rola
dentro da tela, e a conversa — que é a única parte viva da relação com a
clínica — tem o mesmo peso visual que a lista de documentos.

**A equipe não tem para onde levar.** Quatro pessoas listadas, nenhuma
tocável. A responsável tem `/especialista` — retrato sangrado, CRM,
formação, áreas — e as outras três não têm nada. Quem quer saber quem é
a enfermeira que orienta a aplicação não tem onde perguntar.

**A hierarquia é plana.** Sete seções de mesmo peso, em sequência, sem
nada dizendo o que importa primeiro.

---

## 2. Decisões tomadas

Decididas com o autor do projeto antes deste documento:

| pergunta | decisão |
|---|---|
| As referências mudam a estrutura de abas? | **Não.** São referência de estilo. A aba Cuidado fica como está. |
| A conversa é uma ou uma por pessoa? | **Uma só, com a clínica.** É o que o estado suporta, e evita mensagem que morre esperando uma pessoa específica. |
| O que a ficha de cada integrante carrega? | **Ficha cheia e com retrato** — registro profissional, formação, sobre, foto. |
| Arranjo do hub | **Híbrido (C).** Cabeçalho da responsável menor que o da referência, Próximos passos logo abaixo, depois equipe, materiais e o resto. |

---

## 3. O que não entra, e por quê

As referências trazem três coisas que colidem com decisões já registradas
neste projeto. Nenhuma das três entra.

**WhatsApp e telefone.** O rodapé da conversa diz hoje: *"canal
organizado com a clínica — some do WhatsApp, entra no seu histórico"*. Um
botão de WhatsApp ao lado dessa frase contradiz a promessa do próprio
canal — e não há número guardado em lugar nenhum do estado.

**Busca de especialistas.** `PENDENCIAS.md` item 6 registra o modelo:
quem convida é a clínica, com um código; a pessoa não procura médico
dentro do aplicativo. `/parceiros` diz isso em voz alta. Um diretório
aqui seria a sexta porta emparedada.

**"Ainda tem dúvidas? Fale com nossa equipe."** É a conversa com outro
nome, e duas portas para a mesma sala é o defeito que este projeto vem
apagando.

**A avaliação não sobe para o cabeçalho.** `/especialista` já explica
por quê: nota serve para escolher e vira ruído depois de escolhida. Quem
abre esta tela já escolheu. Ela continua onde está.

---

## 4. As rotas

| rota | o que é | estado |
|---|---|---|
| `/medico` | **Sua equipe** — o hub | reformada |
| `/conversa` | a conversa com a clínica, tela cheia | **nova** |
| `/especialista` | o perfil de **qualquer** integrante | generalizada |

**Não se cria uma segunda tela de perfil.** `/especialista` já tem o
desenho certo — retrato sangrado de borda a borda, nome sobre a foto,
credencial, formação, áreas. Fazer uma segunda para a nutricionista
manteria dois desenhos para a mesma pergunta. Ela passa a aceitar `?id=`:
sem id, a responsável; com id, o integrante.

⚠️ A rota `/medico` continua com esse nome, como já está registrado no
cabeçalho do arquivo: são quinze chamadas espalhadas, quatro delas dentro
de `derive.ts`. O nome que a pessoa lê é "Sua equipe".

---

## 5. `fichaDaEquipe` — o adaptador

O estado guarda a equipe em duas casas:

- a responsável em `profile.doctor` + `profile.clinic` + `profile.doctorInfo`
  (`crm`, `especialidade`, `anos`, `pacientes`, `rating`, `avaliacoes`,
  `sobre`, `abordagens`);
- o resto em `S.team`: `{ name, role, sobre }`.

Unificar as duas casas tocaria `acompanhamento.tsx`, `cuidado.tsx` e
`derive.ts`, e não é o que esta reforma pede. Em vez disso entra **uma
função em `derive.ts`** que devolve todo mundo num formato só:

```ts
export type FichaDaEquipe = {
  id: string;            // slug estável, derivado do nome
  nome: string;
  papel: string;         // 'Endocrinologista' | 'Nutricionista' | ...
  responsavel: boolean;
  registro?: string;     // CRM 128456-SP, CRN 12345, COREN…
  sobre?: string;
  formacao?: string[];
  areas?: string[];
  anos?: number;
  rating?: number;
  avaliacoes?: number;
};

export function fichaDaEquipe(S: State): FichaDaEquipe[];
export function fichaDe(S: State, id?: string): FichaDaEquipe | undefined;
```

A responsável vem primeiro. `fichaDe` sem `id` devolve a responsável, que
é o comportamento de hoje de `/especialista`.

**O estado continua com duas casas; quem lê passa a ter uma.** Nenhuma
tela volta a montar essa lista por fora — foi assim que a equipe acabou
escrita à mão dentro do JSX.

### O que a semente ganha

`S.team` passa de três campos para a ficha cheia, com registro
profissional, formação e áreas — ficção de semente, igual ao resto dela.
`ensureDefaults` ganha uma migração de uma vez para quem já tem estado
guardado com o formato antigo.

---

## 6. `/conversa`

Tela cheia, com:

- cabeçalho: voltar, nome da clínica, e a responsável como subtítulo;
- histórico inteiro, rolando, ancorado no fim (é onde a mensagem nova
  está, e é por ela que alguém abre);
- campo fixo acima do teclado, com `KeyboardAvoidingView`;
- o rodapé do canal, que já existe e continua valendo.

**O pedido de receita muda de casa junto.** O `?pedir=receita` sai de
`/medico` e vira `/conversa?pedir=receita`, com o mesmo comportamento: o
rascunho é escrito no campo, a tela rola até ele, e **quem envia é ela**.
O aplicativo não fala por ninguém numa conversa clínica.

### Chamadas que passam a apontar para `/conversa`

| arquivo | o que é |
|---|---|
| `(tabs)/index.tsx` | linha "Mensagens" |
| `(tabs)/index.tsx` | linha "Solicitar nova receita" → `?pedir=receita` |
| `(tabs)/cuidado.tsx` (2 lugares) | o bloco da conversa, com e sem histórico |
| `(tabs)/cuidado.tsx` | o botão "pedir renovação" → `?pedir=receita` |
| `derive.ts` — `carePending` | "Responder as mensagens da sua equipe" |
| `derive.ts` — `carePending` | "Peça a renovação da receita" → `?pedir=receita` |
| `derive.ts` — `careState` | o quadro "Mensagens" |
| `especialista.tsx` | a ação "Mensagem" |
| `protocolos.tsx` | "Falar com a equipe" |
| `medico.tsx` | a linha "Pedir nova receita" em Prescrições |

As que continuam em `/medico`: o card da equipe em `cuidado.tsx`, a ação
"Clínica" em `especialista.tsx`, e `careDocs` para a receita como
documento.

---

## 7. `/medico` — o hub

Ordem final:

1. **Cabeçalho da responsável.** Retrato, nome, especialidade, clínica.
   **Três** ações redondas: Mensagem (`/conversa`), Consultas
   (`/consultas`) e Protocolos (`/protocolos`).

   ⚠️ A referência tem quatro, e a quarta é "Clínica" — uma página da
   clínica com endereço, telefone, site e Instagram. Ela não existe, e o
   estado guarda da clínica **só o nome**. Construir o botão seria a
   sexta porta emparedada; construir a página seria inventar quatro
   campos de contato de uma clínica que ainda não assinou nada. Três
   ações que abrem valem mais do que quatro com uma parada.

   **O retrato e o nome levam a `/especialista`; a fileira de ações não.**
   Tocar em "Protocolos" não pode cair no perfil por a peça inteira ser
   tocável — são alvos separados, e o de baixo ganha.
2. **Próximos passos.** Cartões em fila, do que é verdade (ver §9).
3. **Sua equipe.** Carrossel horizontal; cada peça leva a
   `/especialista?id=`. Some quando não há equipe.
4. **Materiais enviados.** De `S.materials`, que já existe:
   `{ t, name, kind, meta, ic, motivo }`.
5. **Prescrições**, com "Pedir nova receita" no topo — já construído.
6. **Documentos e exames.**

Sai o card da conversa. Sai o bloco "Na clínica": Consultas vira ação do
cabeçalho e Exames vira cartão de Próximos passos — a lista existia para
juntar três coisas de naturezas diferentes, e duas delas passam a ter
lugar melhor.

---

## 8. `/especialista` generalizada

Mesma tela, mesmo desenho. Passa a ler `fichaDe(S, id)` em vez de
`doctorInfo` direto.

- **Sem retrato**, o cabeçalho sangrado não funciona: entra o círculo com
  a inicial sobre o gradiente, no mesmo lugar do nome.
- **Sem `rating`**, o bloco de avaliação não é desenhado — só a
  responsável tem nota hoje.
- **Sem `formacao`**, a seção some. A tela encolhe em vez de mostrar
  cabeçalho de seção vazia.
- A ação "Mensagem" leva à conversa **da clínica**, e não a uma conversa
  com aquela pessoa. É uma conversa só, por decisão de §2.

---

## 9. Dados que faltam

Dois cartões de "Próximos passos" da referência pedem dado que o estado
não tem. Nenhum dos dois inventa.

**"Receita ativa · Até 30/10".** `prescriptions` guarda `t`, `name`,
`detail`, `by`. Não há validade. O cartão passa a dizer **o que foi
prescrito e quando** — `Mounjaro (tirzepatida) · prescrita em 10 jul`.
Se a validade entrar no estado um dia, o cartão passa a mostrá-la.

**"Exames pendentes · 2 exames".** Existe `exameNoProtocolo(S)` — o exame
do protocolo da semana — e existe `examBundles` com `shared`. Não existe
"pedido e não feito". O cartão mostra o exame do protocolo quando há um,
e some quando não há.

Os outros dois são diretos: **Próxima consulta** de `S.consult` e
**Resumo do tratamento** para `/resumo-medico`.

---

## 10. Os retratos

⚠️ **O Metro resolve `require` em tempo de build.** Referenciar um
arquivo que não existe **quebra o build** — não degrada. Por isso o mapa
de assets é escrito à mão, num lugar só, e só com arquivos que existem.

Hoje existe `assets/images/especialista.png`. Faltam três, em
`assets/images/equipe/`, no mesmo enquadramento:

- `renata.png` — Renata Alves, nutricionista
- `carla.png` — Carla Mendes, enfermeira
- `rafael.png` — Rafael Lima, psicólogo

Até existirem, as três caem no círculo com a inicial — tanto no carrossel
quanto no perfil. Quando chegarem, são três linhas no mapa.

⚠️ E vale o mesmo aviso da peça de `/planos`: **retrato envelhece**. São
rostos de gente que não existe, numa tela que fala de profissionais de
saúde. Se um dia a clínica mandar as fotos de verdade, elas entram por
aqui e estas saem.

---

## 11. Como conferir

Estados a olhar, todos alcançáveis:

1. **Com vínculo e equipe** (a semente) — hub completo, carrossel com
   quatro, perfil da responsável e perfil de cada integrante.
2. **Com vínculo e sem equipe** — `S.team` vazio e `profile.doctor`
   vazio: o carrossel some, o cabeçalho encolhe, nada fica quebrado.
3. **A conversa** — abrir por `/conversa`, por `?pedir=receita`, e pela
   linha de Prescrições. O rascunho é montado, a tela rola, o campo foca,
   e nada é enviado sozinho.
4. **O perfil sem retrato** — o círculo com a inicial no lugar da foto.
5. **Os alvos do cabeçalho** — tocar no retrato abre o perfil; tocar em
   cada uma das três ações abre a tela dela, e não o perfil.

Medir no navegador a 375×812, como o resto da passagem.

---

## 12. O que este documento não resolve

- **Nada disso transmite.** A conversa, o pedido de receita e os
  materiais continuam locais. `PENDENCIAS.md` item 6 segue valendo, e
  esta reforma não o aproxima nem o afasta.
- **A aba Cuidado não muda.** Ela repete pedaços deste hub, e a
  convergência das duas é assunto de outra passagem.
- **A rota `/medico` não é renomeada.** Quinze chamadas, quatro em
  `derive.ts`.
