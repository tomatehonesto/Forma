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
