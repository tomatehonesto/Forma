# Antes de subir para a loja

Lista curta do que está **de marcação** no código e precisa virar verdade
antes da primeira publicação. Cada item diz onde mexer.

---

## 🔴 Bloqueia a publicação

### 1. O e-mail de contato é de marcação

`src/logic/documentos.ts` → `EMPRESA.email`

Está `contato@morphi.app.br` e **o domínio não foi registrado**. Esse
endereço aparece em oito lugares e não recebe nada:

- abertura da Política de Privacidade
- seção 1 (controlador) e seção 17 (encarregado)
- seção 11 (como exercer os direitos) e 12 (revisão humana)
- seção 15 (denúncia de cadastro de menor)
- seção 15 dos Termos (contato)
- "Reportar um problema", no perfil

É o mesmo canal para contato geral e para o **encarregado (DPO)**, que a
LGPD exige no art. 41 — e ele precisa ser uma caixa que alguém lê, com
resposta em até 15 dias.

### 2. Os dois documentos precisam de revisão de advogado

`src/logic/documentos.ts`

Termos de Uso e Política de Privacidade foram escritos a partir do que o
aplicativo faz — cada afirmação é conferível no código — mas são
**minuta**. Aplicativo de saúde com dado sensível não publica documento
jurídico sem revisão profissional.

### 3. A política precisa de uma URL pública

As lojas exigem um endereço na internet para a política de privacidade. O
texto está em dados justamente para poder ser publicado; falta a página.

---

## 🟡 Passa a valer quando a assinatura entrar

### 4. O endereço físico volta

`src/logic/documentos.ts` → `EMPRESA.endereco`

Está vazio de propósito: o do cartão do CNPJ é residencial. O **Decreto
7.962/2013**, que regula a venda pela internet, manda exibir endereço
físico e eletrônico em local de destaque — isso passa a valer na primeira
cobrança. Entrar com um **endereço comercial ou fiscal**, e não com o de
casa.

### 5. A cobrança não existe no código

Os Termos descrevem assinatura, isenção por profissional parceiro,
cancelamento e arrependimento de 7 dias (CDC art. 49). Nada disso está
implementado. Descrever a mais não é violação — descrever a menos é —,
mas o fluxo precisa existir antes de a loja cobrar alguém.

### 6. A transmissão para a equipe não existe no código

A Política descreve o envio do resumo e das mensagens à equipe de saúde.
Hoje isso é gravado localmente: não há plataforma do outro lado. Antes de
publicar, ou o servidor existe, ou a redação muda.

---

## 🟢 Confirmar em aparelho

### 7. Exportação em iOS e Android

`src/logic/exportacao.ts`

`expo-file-system` + `expo-sharing` não rodam no navegador. O caminho web
(download) foi testado; o **caminho nativo — escrever o arquivo e abrir a
folha de compartilhamento — precisa de um dev client** para ser
confirmado.

### 8. Notificações e leitura de saúde

`expo-notifications`, `@kingstinct/react-native-healthkit` e
`react-native-health-connect` também não existem no Expo Go. Confirmar os
lembretes tocando e a leitura de peso chegando, em build de verdade.

---

## 9. Os ícones alternativos precisam de prebuild

`expo-alternate-app-icons` entra por projeto nativo: os 12 ícones são
declarados no plugin do `app.json` e o arquivo nativo é escrito no
`prebuild`. No EAS isso acontece no próprio build; num dev client local,
rodar `npx expo prebuild --clean` depois de mexer em `PALETAS`.

E regerar os arquivos antes — os dois geradores:

```
node scripts/gerar-icones.mjs
node scripts/gerar-aurora.mjs
```

A troca de ícone não roda no navegador nem no Expo Go — a tela de
Aparência diz isso na própria tela quando é o caso, e as cores mudam do
mesmo jeito. **Confirmar em aparelho** que o ícone troca de verdade.

---

## 🔴 10. O Supabase derruba metade do que os documentos dizem

O aplicativo vai passar a usar **Supabase** — conta, autenticação e banco
de dados. Hoje ele não tem nada disso, e **os textos estão certos**: eles
descrevem um app sem servidor, sem login e sem cópia. No dia em que o
Supabase entrar, cada uma das frases abaixo vira **declaração falsa numa
política de privacidade**, que é o pior lugar para uma.

Nada disso deve ser reescrito antes — descrever tratamento que ainda não
acontece é o erro simétrico. Esta lista existe para que a troca aconteça
**no mesmo commit** que ligar o Supabase.

### O que fica falso

**`src/logic/documentos.ts` — Política de Privacidade**

| seção | frase |
|---|---|
| 5 | "gravados no armazenamento do aplicativo, **no seu próprio aparelho**" |
| 5 | "Não há conta nem senha: ninguém acessa os seus dados com um login" |
| 5 | "**não existe um servidor nosso de onde eles possam vazar**" |
| 5 | "desinstalar o aplicativo apaga tudo, sem cópia para restaurar" |
| 7 | falta o Supabase na lista de **operadores** |
| 8 | **transferência internacional** passa a valer para TODOS os dados de saúde, e não só para a foto do prato — depende da região do projeto, ver abaixo |
| 10 | retenção "no seu aparelho, enquanto você quiser" |
| 14 | segurança: entra senha, hash, sessão e o que protege o banco |

**`src/logic/documentos.ts` — Termos de Uso**

| seção | frase |
|---|---|
| 5 | "funciona **sem conta e sem senha**"; "a guarda dos registros é sua" |
| 8 | "Cancelar não apaga os seus registros — eles estão no seu aparelho" |
| 12 | encerramento passa a envolver apagar do servidor |

**Outras telas**

- `src/logic/consentimento.ts` — o item "**O que você registra fica no seu
  aparelho**". E a `VERSAO` do aviso **precisa subir**: quem consentiu com
  o texto antigo consentiu com outro tratamento, e tem de ver o novo.
- `src/app/privacidade.tsx` — os blocos "No aparelho, dentro do
  aplicativo" e "**Desinstalar leva tudo junto**".
- `src/app/ajuda.tsx` — a resposta de "E se eu desinstalar o aplicativo?",
  e a premissa de que não há conta nem senha.
- `src/app/_layout.tsx` — o comentário do `Portao`: "não há conta,
  servidor nem senha. **NÃO É AUTENTICAÇÃO, e não finge ser**". Com o
  Supabase, ele passa a ser — ou é substituído por autenticação de
  verdade.

### O que muda de comportamento, e não só de texto

- **Apagar meus dados** hoje chama `reset()`, que limpa o aparelho. Com
  servidor, ele tem de apagar lá também — senão o botão mente, e mente
  sobre o direito de eliminação da LGPD (art. 18, VI).
- **Exportar** continua valendo, e passa a ser a garantia de portabilidade
  sobre o que está no servidor.
- **`estadoVazio()`** e o cadastro pressupõem que o estado nasce local.

### ⚠️ A decisão que é difícil de desfazer: a região

Supabase pergunta a região do projeto na criação e **não dá para mudar
depois sem migrar**. As duas saídas:

- **São Paulo (sa-east-1)** — os dados de saúde ficam no Brasil, e a
  transferência internacional continua sendo só a foto do prato. A
  política quase não muda na seção 8.
- **Qualquer região fora do Brasil** — todo o histórico de saúde passa a
  ser transferência internacional (LGPD art. 33), e isso precisa de base
  legal, de cláusulas contratuais e de estar escrito na política.

Para um aplicativo de dado sensível de saúde vendido no Brasil, **São
Paulo é a escolha que evita o problema** em vez de administrá-lo.
