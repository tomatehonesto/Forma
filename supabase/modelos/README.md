# O e-mail do código

`codigo.html` é o corpo do e-mail que leva o código de acesso, e é **só o
corpo**: o arquivo vai inteiro para o servidor de autenticação, e nada de
explicação pode morar dentro dele (ver "Só o que já passou no servidor",
abaixo). A explicação mora aqui.

## Onde ele vai

Em **dois modelos**, igual nos dois:

- **"Confirm signup"**: o de quem está criando a conta;
- **"Magic link"**: o de quem já tem conta.

Com a confirmação de e-mail ligada, o servidor manda o primeiro para conta
nova e o segundo para conta existente — os dois pedidos de código passam
por um deles.

O assunto, nos dois: `Morphi · {{ .Token }}`.

Os dois — assunto e corpo — estão declarados em `supabase/config.toml`
(`[auth.email.template.confirmation]` e `[auth.email.template.magic_link]`)
e sobem para os dois projetos com `node scripts/subir-config.mjs`.

⚠️ **O `config diff` compara o assunto, mas NÃO o corpo** (conferido em
09/10/2026: um corpo inteiramente outro passou sem diferença). Mudar só o
corpo não aparece no diff. Depois de mudar o corpo, a prova é um código de
verdade chegando — e, se ele não mudou, colar à mão no painel
(Authentication › Emails › Templates), na aba de código-fonte.

## As armadilhas

**Colar tudo, na aba de código (28/09/2026).** Colado à mão, o corpo vai
inteiro, das variáveis ao último `</div>`, na aba do código-fonte do editor
— e não na visual. Colado pela metade (só as variáveis do alto, que não
desenham nada), o e-mail chega em branco: foi o que aconteceu no primeiro
teste.

**Um assunto só, sem idioma.** O painel limita o tamanho do assunto, e os
seis ramos não cabiam. O nome e o código se leem em qualquer língua — e o
código já aparece na notificação, sem abrir o e-mail. Quem escolhe o idioma
é o corpo.

**A validade escrita tem de bater com a do servidor.** O texto diz dez
minutos; o servidor (`otp_expiry` em `config.toml`, ou Sign In / Providers
› Email › "Email OTP Expiration") tem de dizer 600 segundos, e o
comprimento, 6. O aplicativo diz o mesmo (`logic/conta`:
`DIGITOS_DO_CODIGO` e `VALIDADE_DO_CODIGO_MIN`). Mudar um é mudar os três.

**O idioma vem do aplicativo**, em `options.data.idioma`, e o servidor só o
grava na criação da conta: quem já tem conta recebe na língua em que se
cadastrou. Sem idioma, o português.

**Sem link.** O e-mail leva só o código: um link que entra sozinho abriria
o navegador, e a entrada é no aplicativo.

**O desenho é de e-mail, e não de página (28/09/2026, pedido do dono: o
código chegava em texto, sem destaque).** Tabelas no lugar de caixas
flexíveis e estilo em cada elemento, porque boa parte dos leitores de
e-mail ignora o `<style>` e o flex. A faixa do alto é o degradê da marca;
quem não desenha degradê (o Outlook) fica com o azul sólido do
`background-color`.

**O logo vem de um endereço público:** e-mail não carrega arquivo do
aplicativo, e o Gmail bloqueia imagem embutida. Hoje é o arquivo cru do
repositório no GitHub (público); antes da loja, o lugar certo é um
armazenamento nosso, com endereço estável — trocar só o `src`.

**Não há botão de copiar**, e não por falta de vontade (pedido do dono):
leitor de e-mail não roda script, e copiar para a área de transferência
precisa de um. O que existe é o código se selecionar inteiro num toque
(`user-select: all`, que o Apple Mail e o Gmail respeitam), com a frase
dizendo isso. No iPhone o teclado já oferece o código do Mail sozinho.

**É um pedaço de HTML, e não um documento (28/09/2026).** Com
`<!doctype>`, `<html>`, `<head>` e `<body>`, o e-mail chegava em BRANCO em
todo leitor (Outlook e o Mail do iPhone). O motivo exato não está na
documentação do Supabase; o que o teste mostrou é que o mesmo conteúdo,
sem a casca — seis linhas numeradas com texto, variável, idioma, tabela e
logo —, chegou inteiro. Por isso também não há
`<meta name="color-scheme">`: ele morava no `<head>`.

**Só o que já passou no servidor (28/09/2026).** O servidor de
autenticação carrega o modelo por conta própria e, quando o novo falha ali,
continua mandando o último que funcionou — a prévia do painel não passa
pelo mesmo caminho, e mostra certo o que o servidor recusa. Por isso o
modelo usa só o que o de teste de seis linhas usou e chegou: sem
comentário de modelo (`{{/* */}}`) em lugar nenhum do arquivo, e sem
`else if` — cada idioma é um `if` próprio. O idioma é lido dentro de dois
`with` e cai no português quando falta: comparar "nada" com texto é erro
no Go. **E é por isso que esta explicação saiu de dentro do `codigo.html`
(09/10/2026):** ela citava `{{/* */}}` e `{{ .Token }}` dentro de um
comentário HTML, e o servidor lê o que está dentro dos comentários HTML
como modelo do mesmo jeito.

**Um desenho só, seis idiomas:** as frases são variáveis, trocadas no alto
por idioma, e o corpo aparece uma vez. Mudar o desenho é mudar num lugar.

Quem fala é o produto ("nós"), e o nome dele é Morphi.
