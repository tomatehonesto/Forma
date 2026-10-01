# Auditoria — Grupo A: `semaglutida.md` e `armazenamento-e-viagem.md`

Data da auditoria: 01/10/2026. Nenhum arquivo do repositório foi editado.
Regra aplicada: orientação clínica única e global; quando as fontes divergem, vale a mais cautelosa. País só entra em **fato local** (produto, caneta, prazo fora da geladeira, nome comercial, apresentação).

---

## 1. Fontes que abri de fato

As bulas FDA foram baixadas como SPL (XML) pela API do DailyMed e lidas na íntegra nas seções citadas. As bulas EMA foram baixadas em PDF (Product Information do EPAR) e convertidas em texto. As bulas brasileiras são as cópias oficiais da Novo Nordisk Brasil (PDF da bula profissional), que trazem a data de aprovação pela Anvisa.

### FDA (DailyMed)
| Produto | Set ID / versão | Data | URL |
|---|---|---|---|
| Wegovy injeção + Wegovy comprimido (bula única) | ee06186f-2aa3-4990-a760-757579d8f77b, v19 | vigência 18/06/2026 (publicada 30/06/2026) | https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=ee06186f-2aa3-4990-a760-757579d8f77b |
| Ozempic injeção | adec4fd2-6858-4c99-91d4-531f5f2a2d79, v20 | vigência 01/06/2026 ("Revised: June/2026") | https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=adec4fd2-6858-4c99-91d4-531f5f2a2d79 |
| Rybelsus + Ozempic comprimido (bula única) | 27f15fac-7d98-4114-a2ec-92494a91da98, v14 | publicada 19/08/2026 (data interna 30/01/2026) | https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=27f15fac-7d98-4114-a2ec-92494a91da98 |
| Zepbound (para conferir a viagem) | 487cd7e7-434c-4925-99fa-aa80b1cc776b | vigência 28/08/2026 | https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=487cd7e7-434c-4925-99fa-aa80b1cc776b |
| Mounjaro (para conferir a viagem) | d2d7da5d-ad07-4228-955f-cf7e355c8cc0 | vigência 27/08/2026 | https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=d2d7da5d-ad07-4228-955f-cf7e355c8cc0 |
| Saxenda (para conferir a viagem) | 3946d389-0926-4f77-a708-0acb8153b143 | vigência 25/02/2026 | https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=3946d389-0926-4f77-a708-0acb8153b143 |

### EMA (Product Information / SmPC do EPAR, baixado em 01/10/2026)
No texto extraído do PDF, a seção 10 ("Date of revision of the text") vem em branco, como costuma vir no EPAR. Por isso não consigo citar a data de revisão; cito a versão baixada hoje.
- Wegovy (injeção: caneta de dose única 0,25 a 2,4 mg e **7,2 mg**, **FlexTouch** 0,25 a 2,4 mg, seringa; e **Wegovy comprimido** 1,5/4/9/25 mg): https://www.ema.europa.eu/en/documents/product-information/wegovy-epar-product-information_en.pdf
- Ozempic (caneta multidose 0,25/0,5/1/2 mg; seringa 0,25/0,5/1 mg): https://www.ema.europa.eu/en/documents/product-information/ozempic-epar-product-information_en.pdf
- Rybelsus. **Duas formulações com o mesmo nome**: a nova (1,5/4/9/25/50 mg) e a antiga (3/7/14/25/50 mg): https://www.ema.europa.eu/en/documents/product-information/rybelsus-epar-product-information_en.pdf
- Mounjaro: https://www.ema.europa.eu/en/documents/product-information/mounjaro-epar-product-information_en.pdf
- Saxenda: https://www.ema.europa.eu/en/documents/product-information/saxenda-epar-product-information_en.pdf

### ANVISA (cópias oficiais da Novo Nordisk Brasil)
- Wegovy, bula profissional, **aprovada pela Anvisa em 04/05/2026**. Rodapé: "EU-PI 20251212 + EU-PI MASH 03/Mar/2025 + FDA 19/Mar/2026, v. 1.0". No Brasil, Wegovy é o **sistema de aplicação multidose (4 doses)** em todas as doses. https://www.novonordisk.com.br/content/dam/nncorp/br/pt/pdfs/bulas/hcp/Wegovy_Bula_Profissional.pdf
- Ozempic 1 mg (3 mL), bula profissional, **aprovada em 17/04/2026**. Rodapé: "EU-PI 20251203 + US-PI 03022025, v. 03". https://www.novonordisk.com.br/content/dam/nncorp/br/pt/pdfs/bulas/hcp/Ozempic_3mL_1mg_Bula_Profissional.pdf
- Rybelsus 3/7/14 mg, bula profissional, **aprovada em 08/09/2026**, v. 2.0. https://www.novonordisk.com.br/content/dam/nncorp/br/pt/pdfs/bulas/hcp/Rybelsus_Bula_PROFISSIONAL.pdf

### O que NÃO abri (não usei de memória)
- O bulário `consultas.anvisa.gov.br`: não tentei, porque usei direto a cópia oficial da Novo Nordisk, como a tarefa sugeria.
- Bula brasileira atual do Ozempic 0,25/0,5 mg e de um eventual Ozempic 2 mg: as URLs testadas deram 404, e as cópias que a busca achou são de 2019/2020 (desatualizadas, não usei).
- Bulas brasileiras de Mounjaro e Saxenda: não achei cópia oficial.
- Wegovy comprimido no Brasil: não verifiquei se está registrado.
- Avisos da FDA sobre semaglutida manipulada: não abri.

### Estudos (para a seção "O que os estudos mostraram")
Conferi os resumos no PubMed (eutils): STEP 1 PMID 33567185, STEP 2 PMID 33667417, STEP 4 PMID 33755728, STEP 5 PMID 36216945, extensão do STEP 1 PMID 35441470, SELECT PMID 37952131.

---

## 2. Achados

### 2a. Resumo do que BATE (sem detalhe)
- **O que é:** agonista de GLP-1; age no apetite, retarda o esvaziamento do estômago, baixa a glicose de forma dependente da glicose; meia-vida de cerca de 1 semana. [FDA Wegovy 12.1–12.3, 10; FDA Ozempic 12.3]
- **Escalonamento do Wegovy injeção:** 0,25 → 0,5 → 1 → 1,7 → 2,4 mg, a cada 4 semanas. [FDA 2.2 tab. 1; EMA 4.2 tab. 2; ANVISA item 8 tab. 16]
- **7,2 mg depois de ≥4 semanas em 2,4 mg:** bate com FDA 2.2. EMA e ANVISA acrescentam condições (ver DIVERGE).
- **Adiar a subida se não tolerar:** FDA (adiar 4 semanas); EMA/ANVISA (adiar, ou voltar à dose anterior até melhorar).
- **Wegovy comprimido 1,5 → 4 → 9 → 25 mg; esquecido = pular e seguir no dia seguinte.** FDA 2.3/2.4 (30 dias por passo); EMA 4.2 (no mínimo 4 semanas por passo). Diferença irrelevante.
- **Ozempic injeção 0,25 por 4 semanas → 0,5 → 1 → 2 mg, ≥4 semanas em cada:** FDA 2.2; EMA 4.2. No Brasil, ver FATO LOCAL.
- **Rybelsus em jejum, até 120 mL de água, esperar 30 min:** FDA 2.1 ("up to 4 ounces"); EMA 4.2; ANVISA item 8.
- **Comprimidos não se trocam mg por mg:** FDA Rybelsus/Ozempic comprimido 2.1 ("not substitutable on a mg-to-mg basis"). O nome comercial é FATO LOCAL (ver abaixo).
- **Dose esquecida do Wegovy e do Ozempic:** as regras batem nas três agências. Atenção: a regra FDA do Wegovy ("próxima dose a mais de 2 dias → aplicar; a menos de 2 dias → pular") é **matematicamente a mesma** da regra "até 5 dias depois do dia esquecido" (EMA/ANVISA Wegovy; FDA/EMA/ANVISA Ozempic). O arquivo apresenta as duas como regras diferentes, o que pode confundir; proponho unificar.
- **Duas ou mais doses seguidas esquecidas → reiniciar numa dose menor:** FDA Wegovy 2.4 ("2 or more consecutive doses"); EMA/ANVISA Wegovy ("se mais doses forem esquecidas, considere reduzir a dose").
- **Estudos (resumos do PubMed):** STEP 1 −14,9% vs −2,4%, 86,4% com ≥5%; STEP 2 −9,6% vs −3,4%; STEP 4 run-in −10,6%, depois −7,9% vs +6,9%; STEP 5 −15,2% vs −2,6%; extensão do STEP 1: perda de 17,3%, recuperação de 11,6 pontos (≈ dois terços); SELECT 6,5% vs 8,0%, HR 0,80. Tudo bate.
- **Viagem/armazenamento:** geladeira 2–8 °C, caixa original/tampa contra a luz, nunca congelar, não usar se congelou (FDA 16.2, EMA 6.4, ANVISA item 7, para todos os produtos). Saxenda: 30 dias depois do primeiro uso, a 15–30 °C (FDA) ou abaixo de 30 °C (EMA, "1 month"). Zepbound/Mounjaro em **caneta de dose única**: 21 dias até 30 °C (FDA e EMA). Bagagem de mão e embalagem térmica: a bula ANVISA do Wegovy e do Ozempic diz isso literalmente ("No caso de viagens aéreas, não despachar o produto dentro das malas"; transporte em "embalagem que proporcione proteção térmica").

### 2b. Tabela de achados que pedem atenção

| # | Arquivo / afirmação | Classe | O que as fontes dizem | Regra global proposta |
|---|---|---|---|---|
| 1 | semaglutida.md: **não há seção de gravidez** | LACUNA GRAVE | **FDA Wegovy 8.1:** parar ao reconhecer a gravidez (uso para peso/CV). **FDA Ozempic 8.1 e Rybelsus 8.1:** "use only if the potential benefit justifies the potential risk". **EMA (Wegovy, Ozempic, Rybelsus) 4.6:** "should not be used during pregnancy. If a patient wishes to become pregnant, or pregnancy occurs, semaglutide should be discontinued". **ANVISA (as três):** idem EMA, categoria C. **Todas (FDA 8.3, EMA 4.6, ANVISA):** parar **≥2 meses antes** de gravidez planejada, por causa da meia-vida longa. | Parar ao descobrir e falar com quem prescreve; parar ≥2 meses antes de tentar engravidar. Vale para injeção e comprimido, e para qualquer indicação, inclusive diabetes (com troca de tratamento por quem prescreve). |
| 2 | semaglutida.md: **amamentação ausente** (em toda a base) | LACUNA GRAVE | **FDA:** comprimidos (Wegovy, Rybelsus, Ozempic comprimido) "breastfeeding is not recommended" por causa do SNAC; injeção "no data", pesar benefício e risco (Wegovy 8.2, Ozempic 8.2). **EMA 4.6 e ANVISA (todas as formas):** "should not be used during breast-feeding" / "não deve ser usado durante a amamentação". | Não usar durante a amamentação (nenhuma forma); quem amamenta fala com quem prescreve. |
| 3 | semaglutida.md: **contracepção ausente** | DIVERGE / LACUNA | **EMA Wegovy/Ozempic 4.6:** recomenda contracepção a mulheres em idade fértil. **EMA Rybelsus 4.6:** "have to use effective contraception". **ANVISA:** recomenda. **FDA:** silencia. **Pílula:** a semaglutida não reduz o efeito do anticoncepcional oral (EMA 4.5; ANVISA item 6; FDA Wegovy 12.3), ao contrário da tirzepatida. | Usar método anticoncepcional eficaz durante o tratamento; a pílula segue valendo. |
| 4 | Viagem: "Wegovy (caneta de dose única): 8 a 30 °C por até 28 dias, antes de tirar a tampa [Bula Wegovy FDA]" | FATO LOCAL (e incompleto, com risco) | **EUA:** dose única/seringa: 8–30 °C por até 28 dias antes de tirar a tampa; **FlexTouch** (multidose, 4×2,4 mg): depois do 1º uso, 56 dias a 15–30 °C ou na geladeira (FDA 16.2). **UE:** dose única/seringa: até 28 dias ≤30 °C; **FlexTouch**: depois do 1º uso, **6 semanas** abaixo de 30 °C (EMA 6.3). **Brasil:** só existe o sistema multidose; antes do 1º uso, **geladeira**; depois do 1º uso, **6 semanas** abaixo de 30 °C (ANVISA item 7). | Uma brasileira que siga o "28 dias fora da geladeira" com caneta fechada está fora da bula dela. A IA deve perguntar ou identificar o tipo de caneta e mandar conferir na caixa. |
| 5 | Viagem: "Ozempic: depois do primeiro uso, 56 dias, 15 a 30 °C [FDA]" | FATO LOCAL | **EUA:** caneta, 56 dias; **seringa** (nova): 28 dias a 8–30 °C antes do uso (FDA 16). **UE:** caneta de 4 doses, **6 semanas**; caneta de 8 doses, **8 semanas**, abaixo de 30 °C; seringa, 28 dias (EMA 6.3). **Brasil (caneta 1 mg):** **6 semanas** abaixo de 30 °C (ANVISA item 7). | Os 56 dias valem só nos EUA. Na dúvida, usar o menor prazo que a caixa indica. |
| 6 | Viagem: "Mounjaro/Zepbound: fora da geladeira, até 30 °C, por até 21 dias" | FATO LOCAL (incompleto) | 21 dias vale para **caneta de dose única e frasco** (FDA 16.2; EMA 6.3). **KwikPen (multidose):** depois do 1º uso, **30 dias** abaixo de 30 °C (FDA e EMA); fechada fora da geladeira, FDA permite 30 dias, EMA só fala de 72 h na distribuição. Bula BR não aberta. | Separar por tipo de caneta; mandar conferir na caixa. |
| 7 | Cabeçalho da viagem: "Os prazos são das bulas americanas (FDA)… a bula brasileira… é a que vale para quem compra aqui" | DESATUALIZADO frente à decisão de produto | O app é global; os prazos variam por país e por tipo de caneta (achados 4–6). | Reescrever: a orientação é única; o prazo fora da geladeira é fato local e vem da caixa/bula do país. |
| 8 | semaglutida.md: "existe… uma nova (vendida como Ozempic comprimido: 1,5, 4, 9 mg; e Wegovy comprimido)" | FATO LOCAL (frase só vale nos EUA) | **EUA:** Rybelsus = formulação antiga (3/7/14); Ozempic comprimido = nova (1,5/4/9) (FDA). **UE:** a formulação **nova se chama Rybelsus** (1,5/4/9/25/50 mg), e a antiga também é Rybelsus (3/7/14/25/50) (EMA). **Brasil:** Rybelsus = 3/7/14 (ANVISA). | O nome não identifica a formulação; o que identifica são os mg da caixa. Nunca converter mg entre comprimidos sem quem prescreve. |
| 9 | semaglutida.md: "Rybelsus: 3 mg por 30 dias → 7 mg → 14 mg" | FATO LOCAL + impreciso | 14 mg só se precisar de mais controle glicêmico; manutenção 7 ou 14 mg (FDA 2.2; ANVISA). Na UE, o Rybelsus novo vai 1,5 → 4 → 9 → 25 → 50 mg (EMA 4.2). 3 mg/1,5 mg "não é eficaz para controle glicêmico" (FDA). | Dizer "7 mg; pode subir para 14 mg se quem prescreve achar necessário", e citar a versão nova. |
| 10 | semaglutida.md: jejum do comprimido sem definição | DIVERGE (leve) | **EMA/ANVISA:** jejum de **pelo menos 8 horas**; engolir inteiro; um comprimido por dia. **FDA:** "empty stomach in the morning", sem horas; também: inteiro, nunca mais de um por dia. | Usar a definição mais rigorosa: ≥8 h de jejum, inteiro, um por dia. |
| 11 | semaglutida.md: "A manutenção pode ser 1,7 mg ou 2,4 mg (a recomendada)" | DIVERGE | **FDA 2.2:** 1,7 ou 2,4 mg. **EMA 4.2 / ANVISA item 8:** manutenção de 2,4 mg; 1,7 mg só como recuo (EMA: "lowering to the previous dose") ou na MASH (ANVISA). | Baixo risco (a IA não sugere dose). Redigir sem afirmar que 1,7 é manutenção em toda parte. |
| 12 | semaglutida.md: 7,2 mg "quando mais perda for clinicamente indicada" | DIVERGE | **FDA:** tolerou 2,4 mg por ≥4 semanas + perda adicional indicada; não estabelecido em <18 anos (8.4). **EMA/ANVISA:** só **adultos com IMC ≥30 no início**; se não houver melhora adicional, **voltar para 2,4 mg**; adolescentes, máximo 2,4. **Fato local:** EUA e UE têm caneta 7,2 mg; no Brasil a dose é **três injeções de 2,4 mg**, a ≥5 cm uma da outra (ANVISA). **Segurança:** disestesia (sensação alterada na pele) em **22%** com 7,2 mg vs 6% com 2,4 mg (FDA 6.1). | Somar as restrições; mencionar a disestesia. |
| 13 | Viagem: "se precisar mudar o dia, valem… intervalo mínimo entre doses de cada remédio (ver os documentos de cada um)" | ERRADO por remissão vazia + DIVERGE | O `semaglutida.md` **não tem** regra de intervalo mínimo. **FDA Ozempic 2.1:** ≥2 dias (>48 h). **EMA Wegovy/Ozempic 4.2 e ANVISA Wegovy/Ozempic item 8:** **≥3 dias (>72 h)**. | Regra global: mudar o dia só com **≥3 dias (72 h)** desde a última dose. Incluir no `semaglutida.md`. |
| 14 | semaglutida.md: "As doses iniciais servem para o corpo se acostumar, não para perder peso" | SEM FONTE (parcial) | As bulas dizem que o escalonamento serve para reduzir efeitos gastrointestinais (FDA 2.2; EMA 4.2). EMA Ozempic: "0.25 mg is not a maintenance dose". FDA Rybelsus: a dose inicial "is not effective for glycemic control". Nenhuma bula diz que a dose inicial do Wegovy "não serve para perder peso". | Trocar por "não é dose de manutenção" (com fonte). |
| 15 | semaglutida.md: ozempic até 2 mg | FATO LOCAL | FDA/EMA: até 2 mg. A bula ANVISA que abri (caneta de 1 mg) diz "doses semanais maiores que 1,0 mg não são recomendadas"; não abri bula BR de Ozempic 2 mg. | "Conferir as doses disponíveis no seu país." |
| 16 | semaglutida.md: dose esquecida, só "Wegovy" e "Ozempic" | LACUNA | Rybelsus/Ozempic comprimido: esquecido = pular e tomar no dia seguinte (FDA 2.1; EMA 4.2). Ozempic: nenhuma bula fala em reiniciar após várias doses esquecidas; Wegovy fala (FDA/EMA/ANVISA). | Regra mais cautelosa e de bom senso: depois de 2 ou mais semanas sem aplicar (qualquer semaglutida), falar com quem prescreve antes de retomar. Essa extensão ao Ozempic é **inferência por cautela** e precisa ser revisada pelo profissional. |
| 17 | semaglutida.md: STEP 1, efeitos GI (44/17, 32/16, 25/7, 23/10; 7% vs 3% pararam) | SEM FONTE na bula; não conferido no texto completo | Esses números não aparecem no resumo do PubMed. São coerentes com a tabela agrupada da FDA Wegovy 6.1 (náusea 44% vs 16%; 6,8% vs 3,2% pararam por efeito adverso). | Manter; o revisor clínico deve conferir no artigo completo. |
| 18 | semaglutida.md: Versões manipuladas | SEM FONTE (bulas não tratam) | Coerente com a lógica regulatória. Não abri os avisos da FDA. | Manter. Opcional: acrescentar que erro de dose por unidade (UI × mg) é risco conhecido, depois que alguém conferir a fonte. |
| 19 | semaglutida.md: não diz para **não compartilhar caneta** | LACUNA | FDA Wegovy 5.11 e Ozempic 16: nunca compartilhar, mesmo trocando a agulha. | Acrescentar uma linha. |
| 20 | semaglutida.md: interações | LACUNA (segurança moderada) | **Levotiroxina:** exposição +33% com semaglutida oral (FDA Wegovy 7.2). **Varfarina/cumarínicos:** monitorar o INR no início (EMA 4.5; relatos de queda do INR com acenocumarol). **Remédios de margem estreita:** monitorar (FDA 7.2). **Insulina/sulfonilureia:** hipoglicemia (já tratado em `medidas-sem-remedio.md`/`sinais-de-alerta.md`). | Acrescentar a seção "Outros remédios". |
| 21 | semaglutida.md: rim/fígado graves | DIVERGE (fora do escopo do arquivo, registro) | EMA/ANVISA Wegovy: **não recomendada** em insuficiência renal grave (TFGe <30) nem hepática grave. FDA não restringe. | Sugerir ao `sinais-de-alerta.md`: "quem tem doença grave dos rins ou do fígado confirma com quem prescreve". |
| 22 | Contraindicações (no `sinais-de-alerta.md`) | DIVERGE (registro) | A contraindicação por carcinoma medular de tireoide/NEM 2 é da FDA (4, tarja). EMA/ANVISA seção 4: só hipersensibilidade. Pela regra da mais cautelosa, o texto atual da base (que contraindica) está certo. | Manter. |
| 23 | Viagem: "Levar a receita" | SEM FONTE | Prática razoável; exigências de alfândega são fato local. | Manter, acrescentando "e confira as regras do país de destino". |
| 24 | Viagem: "Calor, álcool e comida diferente pioram enjoo e desidratação: caprichar na água" | SEM FONTE (parcial) | A desidratação por vômito/diarreia leva a lesão renal aguda (FDA 5.5, "precautions to avoid fluid depletion"). O álcool não aparece nas bulas. | Manter; citar FDA 5.5 na parte da água. |
| 25 | Viagem: comprimidos não aparecem | LACUNA | **EUA:** frasco original, 20–25 °C (variações de 15–30 °C), proteger da umidade. **UE:** blíster original, sem exigência de temperatura. **Brasil (Rybelsus):** 15–30 °C, blíster original, luz e umidade. | Acrescentar linha de comprimido. |
| 26 | Viagem: "Na geladeira… nunca congelar" | BATE, com um detalhe faltando | Todas as bulas: longe do congelador/elemento de resfriamento ("Keep away from the cooling element"). | Acrescentar "longe do fundo/congelador da geladeira". |

---

## 3. Textos propostos, prontos para colar

### 3.1 `semaglutida.md`: nova seção (colar depois de "Dose esquecida")

```markdown
## Gravidez
- **Descobriu a gravidez:** parar a semaglutida (injeção ou comprimido) e
  falar logo com quem prescreve. Quem usa para diabetes não fica sem
  tratamento: quem prescreve troca o remédio. [Bula Wegovy FDA 8.1; bulas
  Wegovy, Ozempic e Rybelsus EMA 4.6 e ANVISA]
- **Planejando engravidar:** parar pelo menos 2 meses antes de tentar,
  porque a semaglutida demora a sair do corpo (fica no sangue por 5 a 7
  semanas depois da última dose). Combinar a parada com quem prescreve.
  [Bulas Wegovy, Ozempic e Rybelsus FDA 8.3 e 12.3; EMA 4.6; ANVISA]
- **Durante o tratamento:** usar um método anticoncepcional eficaz. A
  semaglutida não diminui o efeito da pílula (diferente da tirzepatida).
  [Bulas EMA 4.5 e 4.6; ANVISA; bula Wegovy FDA 12.3]
- **Amamentação:** as bulas orientam não usar semaglutida, nem injeção nem
  comprimido, durante a amamentação. Quem está amamentando conversa com
  quem prescreve antes de começar ou continuar. [Bulas EMA 4.6 e ANVISA;
  FDA 8.2: comprimido não recomendado, injeção sem dados]
```

### 3.2 `semaglutida.md`: substituir o item do Wegovy injeção

```markdown
- **Wegovy, injeção semanal:** 0,25 mg por 4 semanas → 0,5 mg → 1 mg →
  1,7 mg → 2,4 mg, subindo a cada 4 semanas. A manutenção usual é 2,4 mg
  (a bula americana também aceita 1,7 mg). Se a pessoa não tolera um passo,
  a bula prevê adiar a subida ou voltar à dose anterior até melhorar. A dose
  inicial não é dose de manutenção: serve para reduzir enjoo e outros
  efeitos no estômago. [Bulas Wegovy FDA 2.2, EMA 4.2 e ANVISA, 2026]
- **Wegovy 7,2 mg:** só para adultos, depois de pelo menos 4 semanas em
  2,4 mg, quando quem prescreve indica mais perda; na Europa e no Brasil,
  só para quem começou com IMC ≥ 30, e se não houver ganho a dose volta
  para 2,4 mg. Formigamento ou sensação alterada na pele foi mais comum
  nessa dose (22% contra 6% em 2,4 mg). Como se aplica depende do país: há
  caneta de 7,2 mg, ou três aplicações de 2,4 mg seguidas, a pelo menos 5 cm
  uma da outra (fato local: seguir a caixa). [Bula Wegovy FDA 2.2 e 6.1;
  EMA 4.2; ANVISA]
```

### 3.3 `semaglutida.md`: substituir os itens de Ozempic, Rybelsus e o alerta dos comprimidos

```markdown
- **Ozempic (diabetes tipo 2), injeção semanal:** 0,25 mg por 4 semanas
  → 0,5 mg; pode subir para 1 mg e depois para 2 mg, com pelo menos 4
  semanas em cada. As doses à venda variam por país: conferir a caixa.
  [Bulas Ozempic FDA 2.2 e EMA 4.2; ANVISA]
- **Semaglutida em comprimido (Rybelsus, Ozempic comprimido, Wegovy
  comprimido):** um comprimido por dia, de manhã, em jejum (as bulas
  europeia e brasileira falam em pelo menos 8 horas sem comer), engolido
  inteiro com até 120 mL de água; esperar 30 minutos antes de comer, beber
  ou tomar outros remédios. Nunca tomar dois no mesmo dia. Comprimido
  esquecido: pular e seguir no dia seguinte. [Bulas FDA 2.1; EMA 4.2;
  ANVISA]
- ⚠️ **Os comprimidos de semaglutida não se trocam mg por mg, e o nome
  não diz qual é a formulação.** Há a formulação antiga (3, 7, 14 mg) e a
  nova (1,5, 4, 9, 25 mg e, em alguns países, 50 mg). Nos EUA, a nova se
  chama Ozempic comprimido ou Wegovy comprimido; na Europa, o Rybelsus
  novo já é a nova; no Brasil, o Rybelsus é a antiga. O que identifica são
  os mg da caixa, e quem troca é quem prescreve. [Bulas Rybelsus/Ozempic
  comprimido FDA 2.1; Rybelsus EMA; Rybelsus ANVISA, 2026]
```

### 3.4 `semaglutida.md`: substituir a seção "Dose esquecida"

```markdown
## Dose esquecida e troca de dia (o que as bulas dizem)
- **Injeção semanal (Wegovy ou Ozempic):** aplicar assim que lembrar, se
  passaram até 5 dias do dia esquecido; passado isso, pular e seguir no dia
  de sempre. (É a mesma regra que a bula americana do Wegovy escreve como
  "faltando mais de 2 dias para a próxima".) [Bulas Wegovy e Ozempic FDA,
  EMA 4.2 e ANVISA]
- **Duas ou mais semanas seguidas sem aplicar:** a bula do Wegovy prevê
  recomeçar numa dose menor. Falar com quem prescreve antes de retomar,
  em qualquer semaglutida. [Bula Wegovy FDA 2.4, EMA 4.2 e ANVISA]
- **Trocar o dia da aplicação:** pode, desde que passem pelo menos 3 dias
  (72 h) desde a última dose; depois, seguir semanal no novo dia. [Bulas
  Wegovy e Ozempic EMA 4.2 e ANVISA; a FDA aceita 48 h, vale a mais
  cautelosa]
- **Comprimido:** esquecido, pular e seguir no dia seguinte; nunca dois no
  mesmo dia. [Bulas FDA 2.1/2.4; EMA 4.2]
```

### 3.5 `semaglutida.md`: nova seção curta

```markdown
## Outros remédios e cuidados
- Levotiroxina (hormônio da tireoide): a semaglutida em comprimido aumentou
  a absorção em cerca de um terço; avisar quem acompanha a tireoide.
  [Bula Wegovy FDA 7.2]
- Varfarina e parecidos: medir o INR com mais frequência no começo.
  [Bula Wegovy EMA 4.5]
- Remédios que exigem dose exata (margem estreita): avisar quem prescreve,
  porque o estômago mais lento pode mudar a absorção. [Bula Wegovy FDA 7.2]
- A caneta é de uma pessoa só: nunca compartilhar, mesmo trocando a
  agulha. [Bulas Wegovy FDA 5.11 e Ozempic FDA 16]
```

### 3.6 `armazenamento-e-viagem.md`: cabeçalho

```markdown
⚠️ RASCUNHO — aguardando revisão de profissional de saúde (PENDENCIAS).
A orientação de cuidado é a mesma em todo lugar. O que muda por país é o
produto: o tipo de caneta e quanto tempo ela pode ficar fora da geladeira.
Esse prazo vem da caixa e da bula da sua caneta; na dúvida, vale o menor.
```

### 3.7 `armazenamento-e-viagem.md`: "Na geladeira"

```markdown
## Na geladeira
Antes do uso, as canetas ficam na geladeira, entre 2 e 8 °C, na caixa
original ou tampadas (protegidas da luz), longe do congelador e do fundo
da geladeira. Nunca congelar; caneta que congelou não deve ser usada.
[Bulas Wegovy, Ozempic, Mounjaro/Zepbound e Saxenda FDA 16 e EMA 6.4;
ANVISA]
```

### 3.8 `armazenamento-e-viagem.md`: "Fora da geladeira" (substitui a lista inteira)

```markdown
## Fora da geladeira, quando precisa
O prazo depende do tipo de caneta, que muda de país para país (fato
local). Por isso a primeira pergunta é qual é a sua caneta, e a resposta
final está na caixa dela.
- **Caneta ou seringa de dose única (Wegovy, Ozempic seringa,
  Mounjaro/Zepbound de dose única):** pode ficar fora da geladeira por um
  tempo limitado, antes do uso. Wegovy e Ozempic: até 28 dias, até 30 °C.
  Mounjaro/Zepbound: até 21 dias no total, até 30 °C. [Bulas FDA 16; EMA
  6.3]
- **Caneta de várias doses (Ozempic; Wegovy FlexTouch ou o "sistema de
  aplicação" do Brasil; Mounjaro/Zepbound KwikPen; Saxenda):** antes de
  começar, fica na geladeira. Depois da primeira aplicação, pode ficar
  abaixo de 30 °C ou na geladeira por um prazo que muda conforme o país e a
  caneta: Wegovy e Ozempic, 6 semanas na Europa e no Brasil, 56 dias nos
  EUA (caneta de 8 doses do Ozempic na Europa: 8 semanas); KwikPen, 30
  dias; Saxenda, 30 dias. Passado o prazo, descartar, mesmo com remédio
  dentro. [Bulas FDA 16; EMA 6.3; ANVISA Wegovy e Ozempic item 7]
- **Comprimidos (Rybelsus, Ozempic ou Wegovy comprimido):** não vão para a
  geladeira; ficam na embalagem original (frasco ou blíster), longe da
  umidade e do calor acima de 30 °C. [Bulas FDA 16; EMA 6.4; ANVISA]
- Em qualquer caso: longe do sol direto e do calor (carro fechado,
  porta-luvas). [Bulas FDA 16, "excessive heat and light"]
```

### 3.9 `armazenamento-e-viagem.md`: "Viajando"

```markdown
## Viajando
- Levar a caneta na bagagem de mão, nunca na despachada: o porão do avião
  pode congelar o remédio. Uma embalagem térmica ajuda, sem gelo encostado
  na caneta. [Bulas Wegovy e Ozempic ANVISA, "Transporte"]
- Levar a receita e conferir as regras do país de destino; ver com
  antecedência se a aplicação da semana cai durante a viagem.
- Mudança de fuso: manter o dia da semana da aplicação. Se precisar mudar o
  dia, a semaglutida pede pelo menos 3 dias (72 h) desde a última dose; para
  os outros remédios, ver o documento de cada um. Dose esquecida segue a
  regra de cada remédio.
- Calor, álcool e comida diferente pioram o enjoo; vômito e diarreia
  desidratam, e a desidratação pode afetar os rins: caprichar na água.
  [Bula Wegovy FDA 5.5]
```

Observação para quem cuida do `tirzepatida.md` e do `liraglutida.md`: a remissão "ver o documento de cada um" só funciona se esses arquivos também tiverem a regra de troca de dia/intervalo mínimo. Não auditei esses arquivos.

---

## 4. Pontos para o revisor clínico decidir
1. Estender a regra de "2 ou mais doses esquecidas → falar antes de retomar" ao Ozempic (bula do Ozempic não traz; proposta por cautela).
2. Incluir ou não um alerta de que vômito ou diarreia intensos podem reduzir a proteção da pílula. Nenhuma bula de semaglutida diz isso; é orientação geral de contracepção. Deixei fora do texto proposto.
3. Conferir no artigo completo os percentuais de efeitos gastrointestinais do STEP 1.
4. Obter a bula brasileira atual do Ozempic 0,25/0,5 mg (e 2 mg, se existir), de Mounjaro e de Saxenda, para fechar os fatos locais do Brasil.
