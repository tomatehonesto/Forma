# Auditoria — grupo B: tirzepatida.md e liraglutida.md

Data da auditoria: 01/10/2026. Nenhum arquivo do repositório foi alterado.
Regra aplicada: orientação clínica única para todos os países. Quando as fontes divergem, vale a mais cautelosa. O país só entra nos fatos locais (produto, nome comercial, conservação, disponibilidade).

---

## 1. Fontes abertas de fato

Baixei os PDFs e extraí o texto com `pdftotext`. As citações abaixo saem desse texto, não de resumo. Cópias em `scratchpad/auditoria/b/`.

| # | Fonte | URL | Revisão |
|---|---|---|---|
| F1 | **Zepbound — bula FDA (USPI)** | https://pi.lilly.com/us/zepbound-uspi.pdf (mesma bula no DailyMed, setid 487cd7e7-434c-4925-99fa-aa80b1cc776b) | "Revised: 08/2026" |
| F2 | **Mounjaro — bula FDA (USPI)** | https://pi.lilly.com/us/mounjaro-uspi.pdf (DailyMed setid d2d7da5d-ad07-4228-955f-cf7e355c8cc0) | "Revised: 08/2026" |
| F3 | **Saxenda — bula FDA** | https://www.novo-pi.com/saxenda.pdf (DailyMed setid 3946d389-0926-4f77-a708-0acb8153b143) | "Revised: 02/2026" no PDF. O resumo do DailyMed falou em 6/2026; não confirmei o texto dessa versão. |
| F4 | **Victoza — bula FDA** | https://www.novo-pi.com/victoza.pdf (DailyMed setid 5a9ef4ea-c76a-4d34-a604-27c5b505f5a4) | "Revised: 10/2025" |
| E1 | **Mounjaro — EMA, Product Information (SmPC + folheto)** | https://www.ema.europa.eu/en/documents/product-information/mounjaro-epar-product-information_en.pdf | PI atualizada em 21/09/2026 (página do EPAR). O item 10 do PDF vem sem data. |
| E2 | **Saxenda — EMA, Product Information** | https://www.ema.europa.eu/en/documents/product-information/saxenda-epar-product-information_en.pdf | PI atualizada em 31/07/2025 |
| E3 | **Victoza — EMA, Product Information** | https://www.ema.europa.eu/en/documents/product-information/victoza-epar-product-information_en.pdf | PI atualizada em 20/02/2025 (página do EPAR de 16/01/2026) |
| A1 | **Mounjaro — bula Brasil, profissional (Lilly Brasil)** | https://delivery-p137454-e1438138.adobeaemcloud.com/adobe/assets/urn:aaid:aem:cff02b1c-6f55-4be3-aeca-bf901c5b6be2/renditions/original/as/MOUNJARO_IRMA_LIT_HCP_22APR26.pdf (link na página https://www.lilly.com/br/medicamentos/medicamentos-aprovados) | CDS12FEV26, arquivo de 22/04/2026. Só traz a caneta de uso único. |
| A2 | **Saxenda — bula Brasil, profissional (Novo Nordisk Brasil)** | https://www.novonordisk.com.br/content/dam/nncorp/br/pt/pdfs/bulas/hcp/Saxenda_Bula_Profissional1.pdf | "CCDS v 10.0 + EU-PI 22/11/2024, v.3" |
| A3 | **Victoza — bula Brasil, profissional (Novo Nordisk Brasil)** | https://www.novonordisk.com.br/content/dam/nncorp/br/pt/pdfs/bulas/hcp/Victoza_Bula_Profissional-05-01.pdf | "EU-PI 22/11/2024, v.01" |

**O que não abri ou não existe:**
- **Bulário da ANVISA** (consultas.anvisa.gov.br): não tentei. Usei as cópias oficiais dos fabricantes, que são o texto aprovado pela ANVISA.
- **Bula brasileira do Mounjaro KwikPen (multidose):** não encontrei nem abri. A aprovação pela ANVISA em 2026 só aparece em notícias (ex.: ictq.com.br, nsctotal.com.br). Tudo o que digo sobre a KwikPen no Brasil é inferência das bulas FDA e EMA.
- **Zepbound na EMA ou na ANVISA:** esse nome não existe na UE nem no Brasil. Lá, o Mounjaro cobre diabetes e obesidade.
- **Genéricos de liraglutida:** vi só notícias, nenhuma bula. Nos EUA, a FDA aprovou o genérico de Saxenda da Teva em 28/08/2025. No Brasil, saiu no DOU de 08/09/2026 a aprovação da liraglutida da EMS (Lirux para diabetes, Olire para obesidade), segundo a imprensa.
- **Artigos (NEJM, Lancet, JAMA, Nat Med):** não reabri. Conferi os números contra as tabelas das bulas quando estavam lá. Os que só existem no artigo marquei como SEM FONTE (na bula).

---

## 2. Tabela de achados

### 2.1 tirzepatida.md

| # | Afirmação do arquivo | Status | Detalhe |
|---|---|---|---|
| T1 | Agonista duplo GIP/GLP-1; aumenta saciedade, reduz apetite, retarda esvaziamento gástrico | BATE | F1 §12.1/12.2, E1 §5.1, A1 |
| T2 | Meia-vida de 5 a 6 dias; injeção semanal | BATE (nuance) | F1 §12.3 dá "5-6 dias" (obesidade/AOS). F2, E1 e A1 dão "aproximadamente 5 dias". Sugiro "cerca de 5 dias". |
| T3 | 2,5 mg por 4 semanas, dose de início e não de tratamento; sobe 2,5 mg a cada ≥4 semanas; manutenção 5, 10 ou 15 mg; máximo 15 mg | BATE | F1 §2.1–2.2, F2 §2.1, E1 §4.2, A1 §8. A fonte citada é só F1; faltam E1 e A1. Na apneia do sono, a manutenção é 10 ou 15 mg (F1, A1). |
| T4 | Dose esquecida: aplicar em até 4 dias (96 h); depois, pular. Trocar o dia: ≥3 dias (72 h) entre doses | BATE | F1 §2.3, F2 §2.1, E1 §4.2, A1 §8. **Falta "não dobrar a dose"** (folheto E1). |
| T5 | **"A regra de parar 2 meses antes de uma gravidez planejada é da semaglutida, e não vale para a tirzepatida."** | **ERRADO** | E1 §4.6: tirzepatida "should be discontinued at least 1 month before a planned pregnancy due to the long half-life". A1 diz o mesmo: "descontinuado pelo menos 1 mês antes de uma gravidez planejada". A FDA (F1, F2) não fala em gravidez planejada. A regra mais cautelosa, **parar ≥1 mês antes**, vale para todos. Do jeito que está, a IA tende a dizer que não há prazo. |
| T6 | A bula orienta parar ao descobrir a gravidez | DIVERGE | F1 (Zepbound) §8.1 manda parar. F2 (Mounjaro, diabetes) §8.1 diz "only if the potential benefit justifies the potential risk". E1 §4.6: "not recommended during pregnancy and in women of childbearing potential not using contraception", parar se engravidar. A1: no controle de peso, "não deve ser utilizado", e no diabetes, só se o benefício justificar. **Mais cautelosa: parar e falar com quem prescreve.** Quem tem diabetes precisa falar logo, para não ficar sem controle da glicose (F2 §8.1 cita os riscos do diabetes mal controlado na gravidez). |
| T7 | Anticoncepcional oral: trocar para método não oral ou somar barreira por 4 semanas após o início e após cada subida | DIVERGE (o arquivo já segue a mais cautelosa) | F1 §7.2/8.3, F2 §7.2/8.3 e A1 §6 mandam isso. E1 §4.5 considera a queda "not clinically relevant" e diz "No dose adjustment of oral contraceptives is required", sem barreira. **Mais cautelosa = FDA/ANVISA, para todos**, e o arquivo já está assim. Falta dizer: (a) que anticoncepcionais não orais (DIU, implante, injeção, adesivo, anel) não são afetados (F1/F2 §7.2, A1); (b) que o efeito é maior depois da primeira dose (F1 §8.3); (c) as fontes E1/A1. |
| T8 | SURMOUNT-1: −15,0 / −19,5 / −20,9% vs −3,1% | BATE | F1 §14, Tabela 2 (Study 1). |
| T9 | Náusea 25–33% (10% placebo) no SURMOUNT-1; na bula, 25–29% vs 8%; 4–7% pararam (3% placebo) | BATE | A bula (F1 §6.1, Tabela 1) dá náusea 25/29/28% vs 8% e parada por efeito adverso de 4,8/6,3/6,7% vs 3,4% (pool dos estudos 1 e 2). Os números do NEJM batem com o que lembro do artigo, mas não reabri o artigo. |
| T10 | SURMOUNT-2: −12,8% (10 mg) e −14,7% (15 mg) vs −3,2% | BATE | F1 §14, Tabela 2 (Study 2). |
| T11 | SURMOUNT-3: −6,9% na dieta; depois +18,4% de perda vs reganho de 2,5% | BATE / SEM FONTE parcial | F1 §14, Tabela 4: −18,4% vs +2,5%. O −6,9% da fase de dieta não aparece na bula; vem do artigo (Wadden 2023) e parece correto. |
| T12 | SURMOUNT-4: −20,9% em 36 semanas; continuou −5,5%; placebo +14% | BATE / SEM FONTE parcial | F1 §14, Tabela 6: −5,5% vs +14,0%. O −20,9% vem do artigo (Aronne, JAMA 2024). |
| T13 | SURMOUNT-5: −20,2% vs −13,7% (semaglutida) | SEM FONTE (na bula) | Só no artigo (Aronne, NEJM 2025); os números parecem corretos. Vale dizer que as duas foram usadas na maior dose tolerada. |
| T14 | Versões manipuladas não passaram pelos estudos; concentração pode diferir | SEM FONTE (na bula) | Raciocínio correto e prudente, igual ao de semaglutida.md. Sem mudança. |
| T15 | Título "Mounjaro, Zepbound" | FATO LOCAL | Zepbound é o nome nos EUA (obesidade e apneia); lá, Mounjaro é o nome para diabetes. Na UE, no Brasil e na América Latina, Mounjaro cobre as duas indicações (E1 §4.1, A1 §1). |
| T16 | Lacuna: amamentação | **LACUNA de segurança** | F1/F2 §8.2: concentração no leite "undetectable or low", sem dados no bebê; pesar com quem prescreve. E1 §4.6: "could be considered for use during breast-feeding". A1: só se o benefício justificar, "uso criterioso no aleitamento". **Mais cautelosa = A1: só com aval explícito de quem prescreve.** |
| T17 | Lacuna: hipoglicemia com insulina ou sulfonilureia | **LACUNA de segurança** | F1 §5.7/7.1: no estudo 2, hipoglicemia em 10,3% de quem usava sulfonilureia vs 2,1% sem; também há casos em quem não tem diabetes. F2 §5.3/7.1, E1 §4.2/4.4 e A1 §8: considerar reduzir sulfonilureia ou insulina, com automonitorização da glicemia, e reduzir a insulina aos poucos. Hoje o tema só aparece numa linha de sinais-de-alerta.md. |
| T18 | Lacuna: produto e conservação | FATO LOCAL | Veja a §3, texto T-F. Caneta e frasco de dose única: até 21 dias fora da geladeira, abaixo de 30 °C (F1/F2 §16.2, E1 §6.3, A1 §7). KwikPen e frasco multidose (4 doses): descartar 30 dias após o primeiro uso ou após 4 doses (F1/F2 §16.2, E1 §6.3). Existem: EUA, dose única + frasco + frasco multidose + KwikPen (F1 §3); UE, dose única + frasco + KwikPen (E1 §1); Brasil, dose única (A1) e KwikPen aprovada em 2026 (bula não lida). |
| T19 | Lacuna: não usar com outro GLP-1 ou outra tirzepatida | LACUNA | F1 §1: "Coadministration with other tirzepatide-containing products or with any GLP-1 receptor agonist is not recommended." Isso importa para quem troca de remédio ou usa manipulado junto. |
| T20 | Lacuna: KwikPen não se compartilha | LACUNA (fato local quanto à caneta) | F1 §5.10 e F2 §5.10: nunca compartilhar a KwikPen, mesmo trocando a agulha. |
| T21 | Lacuna: avaliação da resposta | FATO LOCAL / opcional | Só A1 §8: sem perda ≥5% em 6 meses na maior dose tolerada, decidir se continua. F1 e E1 não trazem prazo. É decisão de quem prescreve; dá para citar como "a bula brasileira prevê…". |

Outras advertências, como pancreatite, tireoide (MTC/MEN 2), aspiração na anestesia, desidratação, vesícula e humor, já estão em sinais-de-alerta.md com as mesmas bulas. Não repeti. Uma divergência que vale registrar lá: a contraindicação por MTC/MEN 2 está em F1 §4 e F2 §4, mas não em E1 §4.3. A mais cautelosa (FDA) vale para todos, e é como sinais-de-alerta.md já faz.

### 2.2 liraglutida.md

| # | Afirmação do arquivo | Status | Detalhe |
|---|---|---|---|
| L1 | "Agonista do receptor de GLP-1 **de ação curta**" | **ERRADO (impreciso)** | Nenhuma bula usa o termo. Na classificação usual, liraglutida é GLP-1 de **ação prolongada**, de uso diário; "ação curta" é exenatida 2x/dia e lixisenatida. F3 §12.1 diz que a farmacocinética "makes it suitable for once-daily administration". Trocar por "de uso diário". |
| L2 | Meia-vida ≈13 h, por isso injeção diária | BATE | F3 §12.1/12.3, F4 §12.3, E2 §5.2, A2. |
| L3 | Saxenda: 0,6 mg/dia na 1ª semana, +0,6 mg por semana até 3,0 mg | BATE | F3 §2.2, Tabela 1; E2 §4.2; A2 §8. Falta: se não tolerar uma subida, quem prescreve pode segurar mais uma semana (F3); se não tolerar por 2 semanas seguidas, considerar parar (E2, A2); se não tolerar 3 mg, parar (F3). |
| L4 | Victoza: 0,6 mg por 1 semana → 1,2 mg; pode ir a 1,8 mg | BATE | F4 §2.1, E3 §4.2, A3. Falta "depois de pelo menos 1 semana em 1,2 mg". |
| L5 | Dose esquecida: não dobrar; retomar no dia seguinte, no horário de sempre | DIVERGE (o arquivo é seguro, mas incompleto) | F3 §2.1 e F4 §2.2: seguir com a próxima dose programada, sem dose extra. E2 §4.2, A2 §8, E3 (folheto) e A3: **se lembrar em até 12 h** do horário, aplicar; passou de 12 h, pular. Nenhuma fonte manda aplicar com menos de 12 h para a próxima, e nenhuma permite dobrar. Como regra única, a "janela de 12 h" é a mais cautelosa entre as que permitem aplicar atrasado. |
| L6 | Mais de 3 dias sem aplicar: falar com quem prescreve, porque a bula prevê recomeçar o escalonamento | BATE (FDA) / regra só da FDA | F3 §2.1: "If more than 3 days have elapsed… reinitiate SAXENDA at 0.6 mg daily and follow the dosage escalation schedule". F4 §2.2 diz o mesmo para Victoza. E2, E3, A2 e A3 não têm a regra. **Mais cautelosa = FDA, para todos**, e o arquivo está correto. Sugiro explicitar que o recomeço é em 0,6 mg e vale também para Victoza. |
| L7 | SCALE: 8,0% vs 2,6% em 56 semanas | BATE (artigo) / nota | Os números são do artigo (Pi-Sunyer, NEJM 2015). F3 §14 traz, para o mesmo estudo, **−7,4% vs −3,0%** (outra análise estatística). Não está errado, mas, se o usuário comparar com a bula americana, a IA deve saber que os números diferem. |
| L8 | "A bula de Saxenda orienta avaliar o peso 16 semanas depois do INÍCIO e interromper se a perda for <4%" | DIVERGE | F3 §2.2: 16 semanas após iniciar, perda <4% → parar. E2 §4.1 e A2 §8: **após 12 semanas em 3,0 mg/dia** (≈16 semanas do início, contando as 4 de escalonamento), perda **<5%** → parar. A regra mais exigente é ≥5%; o prazo dá quase o mesmo. É decisão de quem prescreve. Citar como "a bula americana… a europeia e a brasileira…" ou dar uma regra só: "por volta de 4 meses; quem prescreve avalia (4% na FDA, 5% na EMA/ANVISA)". |
| L9 | Gravidez: parar ao descobrir e falar com quem prescreve | BATE (Saxenda) / DIVERGE (Victoza) | F3 §8.1 (Saxenda): "When a pregnancy is recognized… discontinue". F4 §8.1 (Victoza): "only if the potential benefit justifies the potential risk". E2/E3 §4.6, A2 e A3: não usar na gravidez; no diabetes (E3, A3), "the use of insulin is recommended instead". **Mais cautelosa: parar e falar com quem prescreve; quem tem diabetes, logo, para trocar.** |
| L10 | Lacuna: gravidez planejada | **LACUNA de segurança** | E2/E3 §4.6, A2 e A3: "If a patient wishes to become pregnant… treatment should be discontinued". A2 §4 põe isso em Contraindicações. Nenhuma bula dá prazo; não inventar número. |
| L11 | Lacuna: amamentação | **LACUNA de segurança** | E2/E3 §4.6 e A2/A3: "should not be used during breast-feeding". A2 §4 diz "contraindicado em mulheres… que estejam amamentando". F3/F4 §8.2: sem dados em humanos; pesar. **Mais cautelosa: não usar amamentando.** |
| L12 | Lacuna: hipoglicemia com insulina ou sulfonilureia | **LACUNA de segurança** | F3 §5.4, F4 §5.4, E2 §4.2, E3 §4.2 e A2/A3: risco maior, inclusive grave; considerar reduzir a dose; monitorar a glicemia. E2 §4.4 e A2 §5: no diabetes, Saxenda **não substitui a insulina**, e houve cetoacidose após retirada ou redução rápida da insulina. |
| L13 | Lacuna: anticoncepcional | LACUNA (evita extrapolação errada) | E2 §4.5 e A3 §6: efeito anticoncepcional "anticipated to be unaffected". Sem esta linha, a IA pode aplicar à liraglutida a regra das 4 semanas da tirzepatida. |
| L14 | Lacuna: Saxenda e Victoza são a mesma substância | LACUNA | F3 §2.1: "Coadministration with other liraglutide-containing products or with any other GLP-1 receptor agonist is not recommended." F4 traz o mesmo. |
| L15 | Lacuna: nomes, genéricos e conservação | FATO LOCAL | Veja a §3, texto L-F. Depois do 1º uso: FDA, 30 dias entre 15 e 30 °C ou na geladeira (F3 §16); EMA, 1 mês abaixo de 30 °C ou na geladeira (E2/E3 §6.3); Brasil, **4 semanas** para Saxenda (A2 §7) e 1 mês para Victoza (A3 §7). Há genéricos nos EUA (desde 2025) e liraglutida da EMS no Brasil (2026, segundo a imprensa). |
| L16 | Lacuna: idade | FATO LOCAL / opcional | Saxenda: ≥12 anos na FDA (F3 §8.4) e no Brasil (A2), ≥6 anos na EMA (E2 §4.2). Victoza: ≥10 anos (F4, E3). Só importa se o app aceitar menores. |

### 2.3 Arquivos irmãos com o mesmo problema (fora deste grupo, para não ficarem dessincronizados)

- **sinais-de-alerta.md, linhas 43–46:** "as de tirzepatida e de liraglutida, parar ao descobrir a gravidez". Repete o erro T5 e omite L10. Tem que mudar junto: tirzepatida, ≥1 mês antes; liraglutida, parar ao planejar.
- **armazenamento-e-viagem.md, linhas 13–14:** "Mounjaro / Zepbound: até 30 °C, por até 21 dias [Bula Zepbound FDA]". Só vale para caneta ou frasco **de dose única**. A KwikPen e o frasco multidose seguem outra regra: 30 dias após o 1º uso ou 4 doses (F1/F2 §16.2, E1 §6.3). Linhas 19–20 (Saxenda, 30 dias): no Brasil a bula diz 4 semanas (A2 §7).

---

## 3. Textos novos, prontos para colar

### tirzepatida.md

**T-A. Substitui a linha da meia-vida em "O que é" (só o fim):**
```
reduz o apetite e retarda o esvaziamento do estômago. Meia-vida de cerca
de 5 dias; injeção semanal. [Bulas Zepbound e Mounjaro FDA; Mounjaro EMA;
Mounjaro ANVISA]
```

**T-B. Substitui "Escalonamento de dose":**
```
## Escalonamento de dose (o que a bula descreve)
2,5 mg por semana nas 4 primeiras semanas (dose de início, não de
tratamento) → 5 mg → se preciso, sobe 2,5 mg depois de pelo menos 4
semanas na dose atual → manutenção em 5, 10 ou 15 mg (máximo 15 mg).
[Bula Zepbound FDA; Mounjaro EMA; Mounjaro ANVISA]

Não usar junto com outro remédio que tenha tirzepatida nem com outro
agonista de GLP-1 (semaglutida, liraglutida, inclusive manipulados).
[Bula Zepbound FDA]

Quem decide a dose e quando subir é quem prescreve. O Morphi não sugere
dose.
```

**T-C. Substitui "Dose esquecida":**
```
## Dose esquecida (o que a bula diz)
Aplicar assim que lembrar, se for em até 4 dias (96 h) depois do dia
esquecido; passado isso, pular e seguir no dia de sempre. Nunca aplicar
duas doses para compensar. Para mudar o dia da semana, deixar pelo menos
3 dias (72 h) entre duas doses. [Bulas Zepbound e Mounjaro FDA; Mounjaro
EMA; Mounjaro ANVISA]
```

**T-D. Substitui "Gravidez" (corrige o erro T5 e cobre T6 e T16):**
```
## Gravidez e amamentação
- **Descobriu a gravidez:** parar e falar com quem prescreve. Quem tem
  diabetes deve falar logo, para não ficar sem controle da glicose
  durante a troca. [Bula Zepbound FDA; Mounjaro EMA; Mounjaro ANVISA]
- **Planeja engravidar:** parar pelo menos 1 mês antes, por causa da
  meia-vida longa, e combinar isso com quem prescreve. Durante o uso, a
  recomendação é usar contracepção. [Mounjaro EMA; Mounjaro ANVISA]
  (A semaglutida pede 2 meses; a tirzepatida, 1 mês.)
- **Amamentando:** no estudo, a tirzepatida quase não apareceu no leite,
  mas não há dados sobre o bebê. Só usar ou continuar com o aval
  explícito de quem prescreve. [Bula Zepbound FDA; Mounjaro EMA;
  Mounjaro ANVISA]
```

**T-E. Substitui "Anticoncepcional oral":**
```
## Anticoncepcional oral
A tirzepatida pode reduzir o efeito da pílula, porque atrasa o
esvaziamento do estômago; o efeito é maior no começo. Usar um método não
oral, ou somar um método de barreira (camisinha), por 4 semanas depois da
primeira dose e por 4 semanas depois de cada subida de dose. DIU,
implante, injeção, adesivo e anel não são afetados. Conversar com quem
prescreve. [Bulas Zepbound e Mounjaro FDA; Mounjaro ANVISA] (A bula
europeia considera o efeito pequeno; seguimos a regra mais cautelosa.)
```

**T-F. Seção nova "Hipoglicemia" (T17):**
```
## Hipoglicemia (com insulina ou sulfonilureia)
Junto com insulina ou sulfonilureia (glibenclamida, glimepirida,
gliclazida), o risco de hipoglicemia sobe, inclusive grave. Quem
prescreve pode reduzir a dose desses remédios ao iniciar, e a glicemia
deve ser medida antes e durante o tratamento. Também houve casos em quem
não tem diabetes. Sinais: suor frio, tremor, confusão, visão turva.
O Morphi não ajusta insulina. [Bulas Zepbound e Mounjaro FDA; Mounjaro
EMA; Mounjaro ANVISA]
```

**T-G. Seção nova "Produto e conservação" (FATO LOCAL, T15/T18/T20):**
```
## O produto muda de país para país (fato local)
- **Nome:** nos EUA, Zepbound (obesidade, apneia) e Mounjaro (diabetes);
  na Europa, no Brasil e na América Latina, Mounjaro serve para os dois.
- **Apresentação:** caneta de dose única, frasco de dose única, frasco
  multidose ou KwikPen (caneta com 4 doses iguais). Varia por país.
  Perguntar qual a pessoa usa, ou pedir que confira na caixa.
- **Fora da geladeira (até 30 °C):** caneta ou frasco de dose única, até
  21 dias no total. KwikPen ou frasco multidose: jogar fora 30 dias depois
  do primeiro uso, ou depois das 4 doses, o que vier antes. Na dúvida,
  vale o que está na bula da caixa. [Bulas Zepbound e Mounjaro FDA;
  Mounjaro EMA; Mounjaro ANVISA]
- **KwikPen é de uma pessoa só**, mesmo trocando a agulha. [Bula Mounjaro
  FDA]
```

**T-H. Opcional (T21), no fim de "O que os estudos mostraram" ou do escalonamento:**
```
A bula brasileira prevê que, sem perda de pelo menos 5% do peso depois
de 6 meses na maior dose tolerada, quem prescreve decida se continua.
[Mounjaro ANVISA]
```

### liraglutida.md

**L-A. Substitui "O que é" (L1):**
```
## O que é
Agonista do receptor de GLP-1 de uso diário: meia-vida de cerca de 13
horas, por isso a injeção é uma vez por dia. [Bula Saxenda FDA; Saxenda
EMA]
```

**L-B. Substitui "Escalonamento de dose" (L3, L4, L14):**
```
## Escalonamento de dose (o que a bula descreve)
- **Saxenda (obesidade):** 0,6 mg por dia na primeira semana, subindo
  0,6 mg por semana até 3,0 mg (manutenção). Se uma subida não for
  tolerada, quem prescreve pode segurar a dose por mais uma semana; quem
  não tolera 3,0 mg costuma parar. [Bula Saxenda FDA; Saxenda EMA;
  Saxenda ANVISA]
- **Victoza (diabetes tipo 2):** 0,6 mg por dia por pelo menos uma
  semana → 1,2 mg; pode subir para 1,8 mg depois de pelo menos uma
  semana. [Bula Victoza FDA; Victoza EMA]

Saxenda e Victoza são a mesma substância: não usar as duas juntas, nem
com outro agonista de GLP-1. [Bula Saxenda FDA]

Quem decide a dose é quem prescreve. O Morphi não sugere dose.
```

**L-C. Substitui "Dose esquecida" (L5, L6):**
```
## Dose esquecida (o que a bula diz)
Se lembrar em até 12 horas do horário de sempre, aplicar. Passou disso,
pular e aplicar a próxima no dia seguinte, no horário de sempre. Nunca
dobrar nem aumentar a dose para compensar. [Saxenda EMA; Saxenda ANVISA;
Bula Saxenda FDA]
Mais de 3 dias sem aplicar: não voltar direto na dose de antes. Falar
com quem prescreve, porque a bula prevê recomeçar em 0,6 mg e refazer o
escalonamento (vale para Saxenda e Victoza). [Bulas Saxenda e Victoza
FDA]
```

**L-D. Substitui o item das 16 semanas (L7, L8):**
```
- **SCALE Obesity and Prediabetes** (56 semanas, 3,0 mg): perda média de
  8,0% do peso contra 2,6% no placebo. [Pi-Sunyer et al., NEJM 2015] (A
  bula americana, com outra análise, traz 7,4% contra 3,0%.)
- Por volta de 4 meses de tratamento, quem prescreve avalia a resposta.
  Pela bula americana, interromper se a perda for menor que 4% em 16
  semanas desde o início; pela europeia e pela brasileira, se for menor
  que 5% após 12 semanas em 3,0 mg. É decisão de quem prescreve. [Bula
  Saxenda FDA; Saxenda EMA; Saxenda ANVISA]
```

**L-E. Substitui "Gravidez" (L9, L10, L11):**
```
## Gravidez e amamentação
- **Descobriu a gravidez:** parar e falar com quem prescreve. Quem tem
  diabetes deve falar logo: a recomendação na gravidez é trocar para
  insulina. [Bula Saxenda FDA; Saxenda e Victoza EMA; Victoza ANVISA]
- **Planeja engravidar:** parar o tratamento, combinado com quem
  prescreve. [Saxenda e Victoza EMA; Saxenda ANVISA]
- **Amamentando:** não usar. Não se sabe se passa para o leite.
  [Saxenda e Victoza EMA; Saxenda ANVISA]
```

**L-F. Seção nova "Anticoncepcional e hipoglicemia" (L12, L13):**
```
## Anticoncepcional oral
Nos estudos, a liraglutida não reduziu o efeito da pílula; não há a
regra das 4 semanas que existe para a tirzepatida. [Saxenda EMA;
Victoza ANVISA]

## Hipoglicemia (com insulina ou sulfonilureia)
Junto com insulina ou sulfonilureia, o risco de hipoglicemia sobe,
inclusive grave; quem prescreve pode reduzir a dose desses remédios e a
glicemia deve ser acompanhada. A liraglutida não substitui a insulina:
tirar ou reduzir a insulina de repente já levou a cetoacidose. O Morphi
não ajusta insulina. [Bulas Saxenda e Victoza FDA; Saxenda EMA; Saxenda
ANVISA]
```

**L-G. Seção nova "Produto e conservação" (FATO LOCAL, L15):**
```
## O produto muda de país para país (fato local)
- **Nomes:** Saxenda (obesidade) e Victoza (diabetes) são liraglutida.
  Em vários países já há liraglutida de outros fabricantes ou genérica,
  vendida pelo nome da substância. Perguntar o nome que está na caixa.
- **Depois do primeiro uso:** a caneta dura cerca de 1 mês, na geladeira
  ou em temperatura ambiente até 30 °C. O prazo exato varia (30 dias nos
  EUA, 1 mês na Europa, 4 semanas para Saxenda no Brasil): vale o que
  está na bula da caixa. [Bula Saxenda FDA; Saxenda e Victoza EMA;
  Saxenda e Victoza ANVISA]
- A caneta é de uma pessoa só, mesmo trocando a agulha. [Bula Saxenda
  FDA]
```

### Arquivos irmãos (fora deste grupo), para manter as frases iguais

**sinais-de-alerta.md, linhas 43–46, sugestão:**
```
- **Gravidez, ou plano de engravidar.** Parar ao descobrir a gravidez.
  Planejando: a semaglutida pede parar pelo menos 2 meses antes, a
  tirzepatida pelo menos 1 mês antes, e a liraglutida, parar ao decidir
  engravidar. Em qualquer caso, falar com quem prescreve. [Bulas Wegovy,
  Zepbound e Saxenda FDA; Mounjaro, Saxenda EMA; Mounjaro ANVISA]
```

**armazenamento-e-viagem.md, linhas 13–14, sugestão:**
```
- **Mounjaro / Zepbound:** caneta ou frasco de dose única pode ficar fora
  da geladeira, até 30 °C, por até 21 dias. KwikPen ou frasco multidose:
  jogar fora 30 dias depois do primeiro uso ou após as 4 doses. Conferir
  na caixa qual é a sua. [Bulas Zepbound e Mounjaro FDA; Mounjaro EMA]
```
