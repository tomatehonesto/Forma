/* O que ainda é texto em português dentro do código.

   Fora da conta, de propósito:
     · src/textos/          é o catálogo
     · logic/alimentos*.ts  nome de comida (TACO/FNDDS/redes) — dado
     · logic/documentos.ts  minuta jurídica
     · logic/seed.ts        a semente de demonstração — dado, não fala
     · logic/meds.ts?       nome de medicamento é marca */
import { readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const RAIZ = 'C:/dev/Forma/src';
const FORA = [/textos[\\/]/, /logic[\\/]alimentos/, /logic[\\/]documentos/, /logic[\\/]seed\.ts$/];

const PT = /[çãõáéíóúâêôàÇÃÕÁÉÍÓÚÂÊÔÀ]|\b(voc[eê]|sua|seu|n[ãa]o|para|com|que|dia|dias|dose|peso|hoje|meta|semana|ver|fazer|de|do|da|em|uma|um)\b/i;

/* ⚠️⚠️ AS PROPRIEDADES DE TEXTO NÃO PASSAM PELO `PT`, e é o buraco que a
   regra 3 fecha.

   O `PT` é uma heurística de APARÊNCIA: ele acha o que parece português.
   "Feminino", "Masculino" e "Outro" não têm acento nem palavra da lista,
   então as três opções da pergunta de identidade do cadastro ficaram no
   código, invisíveis ao inventário, e apareceram em português numa tela
   em inglês — foi assim que o buraco foi descoberto, por alguém olhando o
   aplicativo.

   Uma propriedade destas é texto de tela POR DEFINIÇÃO: ninguém escreve
   `titulo=` para guardar um dado. Não precisa parecer português para
   contar, e é por isso que esta lista não pergunta ao `PT`.

   ⚠️ E ELA É DE NOMES, e não de tudo: `ic="venus"`, `tom="fantasma"`,
   `v="label"` e `c="#FFF"` também são propriedades com string dentro, e
   nenhuma delas é fala. O que separa as duas listas é o nome. */
const PROPS_DE_TEXTO = /\b(titulo|título|label|sub|rotulo|rótulo|placeholder|texto|lead|ajuda|selo|sobre|curto|desc|descricao|legenda|vazio|acao|cta|pergunta|dica|nota|aviso|titulo2)=\"([^\"]{2,})\"/g;

const anda = (dir, out = []) => {
  for (const nome of readdirSync(dir)) {
    const p = join(dir, nome);
    if (statSync(p).isDirectory()) anda(p, out);
    else if (/\.tsx?$/.test(nome)) out.push(p.replace(/\\/g, '/'));
  }
  return out;
};

/* tira comentários de bloco e de linha, sem tocar no resto */
const semComentarios = (src) => src
  .replace(/\/\*[^]*?\*\//g, (m) => m.replace(/[^\n]/g, ' '))
  .split('\n')
  .map((l) => l.replace(/([^:'"`])\/\/.*$/, '$1'))
  .join('\n');

const achados = [];

for (const f of anda(RAIZ)) {
  if (FORA.some((re) => re.test(f))) continue;
  const bruto = readFileSync(f, 'utf8');
  const src = semComentarios(bruto);

  const daqui = [];

  /* 1. literais de string com prosa */
  for (const m of src.matchAll(/'((?:[^'\\\n]|\\.){3,}?)'|"((?:[^"\\\n]|\\.){3,}?)"|`((?:[^`\\]|\\.){3,}?)`/g)) {
    const s = m[1] ?? m[2] ?? m[3];
    if (!s || !/[a-zA-Zà-ÿ]/.test(s)) continue;
    if (!PT.test(s)) continue;
    /* nome de módulo, rota, classe, chave: sem espaço e tudo minúsculo */
    if (!/\s/.test(s) && /^[a-z0-9@./_-]+$/.test(s)) continue;
    if (/^https?:|^\.\/|^\.\.\//.test(s)) continue;
    daqui.push(s.trim());
  }

  /* 3. propriedade de texto com string cravada — sem passar pelo `PT` */
  for (const m of src.matchAll(PROPS_DE_TEXTO)) {
    const v = m[2].trim();
    if (!v || !/[a-zA-Zà-ÿ]/.test(v)) continue;
    /* rota, chave, id: sem espaço e tudo minúsculo com hífen */
    if (!/\s/.test(v) && /^[a-z0-9@./_-]+$/.test(v)) continue;
    daqui.push(v);
  }

  /* 2. texto solto entre tags JSX, numa linha só */
  for (const m of src.matchAll(/>([^<>{}\n]{3,})</g)) {
    const s = m[1].trim();
    if (!s || !/[a-zA-Zà-ÿ]/.test(s) || !PT.test(s)) continue;
    daqui.push(s);
  }

  /* 2b. E O MESMO TEXTO PARTIDO EM VÁRIAS LINHAS, que a regra 2 não vê.

     ⚠️⚠️ ESTA ERA A CEGUEIRA DA REDE. Toda frase de tela um pouco longa
     é quebrada pelo editor, porque o JSX já começa recuado:

         <Txt>
           Os níveis saem dos seus registros. Se um registro sair, o
           nível que ele fechou sai junto.
         </Txt>

     A regra 2 barra `\n` dentro do texto e por isso não via nenhuma
     delas. A tela aparecia com menos frases do que tem, e "a tela zerou"
     podia ser mentira — foram duas assim numa leva só, as duas achadas
     lendo o aplicativo em alemão, que é o jeito caro de achar.

     ⚠️ E O `\n` DA REGRA 2 NÃO PODE SAIR: sem ele o casamento atravessa
     o arquivo inteiro, de uma seta `=>` até o próximo `<`, e uma tabela
     de alimentos vira "frase de tela". A saída é uma regra separada e
     estreita: ela exige a etiqueta de fechamento e que NENHUMA linha do
     meio tenha `<`, `>`, `{` ou `}`. Texto misturado com interpolação em
     várias linhas continua de fora — é o preço de não ter falso
     positivo.

     ⚠️ E OS DOIS QUANTIFICADORES NÃO PODEM SE SOBREPOR. A primeira
     escrita era `(?:[ \t]*[^<>{}\n]*\n)+?`, e os espaços cabiam nos dois
     pedaços: o motor tinha uma escolha por espaço, em cada linha, e o
     inventário parou de terminar. `[^<>{}\n]*` já cobre espaço e tabulação
     sozinho, e o teto de doze linhas mata depressa a corrida que não vai
     fechar. */
  for (const m of src.matchAll(/>[ \t]*\n((?:[^<>{}\n]*\n){1,12}?)[ \t]*<\//g)) {
    const s = m[1].replace(/\s+/g, ' ').trim();
    if (!s || s.length < 3 || !/[a-zA-Zà-ÿ]/.test(s) || !PT.test(s)) continue;
    daqui.push(s);
  }

  /* As três regras se sobrepõem — uma propriedade de texto com prosa
     dentro é achada pela 1 e pela 3. Contar duas vezes inflaria o número
     que este arquivo existe para dar. */
  const unicos = [...new Set(daqui)];
  if (unicos.length) achados.push([f.replace('C:/dev/Forma/', ''), unicos]);
}

achados.sort((a, b) => b[1].length - a[1].length);

const total = achados.reduce((n, [, l]) => n + l.length, 0);
let saida = `# INVENTÁRIO — ${total} frases em ${achados.length} arquivos\n\n`;
for (const [f, l] of achados) {
  saida += `\n## ${f}  (${l.length})\n`;
  for (const s of l) saida += `  · ${s}\n`;
}

writeFileSync(process.argv[2] ?? 'inventario-textos.txt', saida);
console.log(total + ' frases em ' + achados.length + ' arquivos');
console.log('\nos vinte maiores:');
for (const [f, l] of achados.slice(0, 20)) console.log('  ' + String(l.length).padStart(4) + '  ' + f);
