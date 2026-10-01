# Auditoria clínica, grupo C: sinais de alerta, efeitos gastrointestinais, hidratação

Data da auditoria: 01/10/2026. Arquivos auditados (nenhum foi editado):
`servidor/conhecimento/sinais-de-alerta.md`, `servidor/conhecimento/efeitos-gastrointestinais.md`,
`servidor/conhecimento/hidratacao.md`. Contexto lido sem auditar: `servidor/conversa/prompt.ts`
(regra 1) e `servidor/conhecimento/medidas-sem-remedio.md` (para checar coerência).

Regra aplicada: a orientação clínica é uma só no mundo; quando FDA, EMA, ANVISA e diretrizes
divergem, vale a mais cautelosa, para todos.

---

## 1. Fontes abertas de fato

| Fonte | URL | Revisão | Como foi lida |
|---|---|---|---|
| Wegovy, bula FDA + Medication Guide (injeção e comprimido) | https://www.novo-pi.com/wegovy.pdf (mesma da DailyMed setid ee06186f-2aa3-4990-a760-757579d8f77b) | Revised 06/2026; MG 06/2026. "Recent Major Changes": Suicidal Behavior and Ideation (5.10) **removida 01/2026** | PDF baixado e convertido; seções 5, 6.1, 6.2, 17 e Medication Guide lidas no texto |
| Ozempic, bula FDA | https://www.novo-pi.com/ozempic.pdf | Revised 05/2026 (MG 01/2025) | PDF; seções 5, 6.2, 8.3, MG |
| Saxenda, bula FDA | https://www.novo-pi.com/saxenda.pdf | Revised 02/2026; Suicidal Behavior (5.9) **removida 02/2026** | PDF; seções 5, 6.2, 8.1 |
| Zepbound, bula FDA | https://pi.lilly.com/us/zepbound-uspi.pdf (DailyMed setid 487cd7e7-434c-4925-99fa-aa80b1cc776b) | Revised 08/2026; Suicidal Behavior **removida** | PDF; seções 5, 6.1, 6.2, 7.2, 8.1, 17. **O Medication Guide da Lilly é PDF separado e não foi aberto** |
| Mounjaro, bula FDA | https://pi.lilly.com/us/mounjaro-uspi.pdf | Revised 08/2026 | PDF; seções 5 e 6.2 |
| EMA, Wegovy SmPC + folheto | https://www.ema.europa.eu/en/documents/product-information/wegovy-epar-product-information_en.pdf | baixado em 01/10/2026 (já com a dose de 7,2 mg); a data de revisão não sai no texto extraído | 4.4, 4.8, 4.9, folheto seções 2 e 4 |
| EMA, Ozempic SmPC + folheto | https://www.ema.europa.eu/en/documents/product-information/ozempic-epar-product-information_en.pdf | baixado em 01/10/2026 | 4.4 (NAION), 4.6, 4.8, folheto |
| EMA, Mounjaro SmPC + folheto | https://www.ema.europa.eu/en/documents/product-information/mounjaro-epar-product-information_en.pdf | baixado em 01/10/2026 | 4.4, 4.5 (contraceptivo oral), 4.6, folheto seção 4 |
| EMA, Saxenda SmPC + folheto | https://www.ema.europa.eu/en/documents/product-information/saxenda-epar-product-information_en.pdf | baixado em 01/10/2026 | 4.4, 4.6, folheto |
| ANVISA / bula brasileira Wegovy (paciente) | https://novonordisk.com.br/content/dam/nncorp/br/pt/pdfs/bulas/patient/Wegovy_Bula_Paciente.pdf | rodapé "EU-PI 20251212 + EU-PI MASH 03/Mar/2025 + FDA 15/Ago/2025, v. 1.0" | PDF; itens 4, 8 e 9 |
| ANVISA, notícia 09/02/2026, pancreatite e uso indevido de "canetas" | https://www.gov.br/anvisa/pt-br/assuntos/noticias-anvisa/2026/anvisa-emite-alerta-para-risco-de-pancreatite-aguda-associada-ao-uso-indevido-de-canetas-emagrecedoras | 09/02/2026 | lida |
| ANVISA, Alerta GGMON 06/2025 (perda de visão, semaglutida) | página gov.br abriu só o cabeçalho; texto lido no espelho da APEVISA: https://www.apevisa.pe.gov.br/anvisa-alerta-sobre-evento-adverso-muito-raro-associado-a-semaglutida-que-pode-levar-a-perda-da-visao/ | jun/2025 | lido no espelho |
| FDA, Drug Safety Communication, retirada da advertência de suicídio | https://www.fda.gov/drugs/drug-safety-communications/fda-requests-removal-suicidal-behavior-and-ideation-warning-glucagon-peptide-1-receptor-agonist-glp | 13/01/2026 | lida |
| ASA e sociedades (AGA, ASMBS, ISPCOP, SAGES), orientação perioperatória | https://asahq.org/about-asa/newsroom/news-releases/2024/10/new-multi-society-glp-1-guidance | 29/10/2024 | lida (comunicado; o artigo completo não) |
| Aviso conjunto de nutrição 2025 (ACLM/ASN/OMA/TOS), Mozaffarian et al., Am J Lifestyle Med 2025 | https://pmc.ncbi.nlm.nih.gov/articles/PMC12125019/ | 30/05/2025 | lido (seção de efeitos GI) |
| Wharton et al., Postgrad Med 2022;134(1):14-19 | https://doi.org/10.1080/00325481.2021.2002616 (lido em cópia PDF: https://dssurgery.com/wp-content/uploads/2024/10/Managing-the-gastrointestinal-side-effects-of-GLP-1-receptor-agonists-in-obesity-recommendations-for-clinical-practice.pdf) | 2022 | PDF lido |
| Gorgojo-Martínez et al., J Clin Med 2022;12(1):145 (consenso multidisciplinar) | https://pmc.ncbi.nlm.nih.gov/articles/PMC9821052/ | dez/2022 | lido (tabela 2) |
| NHS, Dehydration | https://www.nhs.uk/conditions/dehydration/ | revisada 01/05/2026 | lida |
| NHS, Low blood sugar | https://www.nhs.uk/conditions/hypoglycaemia/ | revisada 03/08/2023 (revisão prevista para 08/2026 vencida) | lida |
| ADA, página ao paciente sobre hipoglicemia (regra 15/15) | https://diabetes.org/living-with-diabetes/treatment-care/hypoglycemia | sem data visível | lida |
| CVV 188 / 3114 (França) | resultados de busca (conass.org.br, cvv.org.br; santementale.fr, findahelpline) | — | **só pelo resumo da busca** |
| EMA PRAC abr/2024 (suicídio, sem relação causal) | https://www.ema.europa.eu/en/news/meeting-highlights-pharmacovigilance-risk-assessment-committee-prac-8-11-april-2024 | 8-11/04/2024 | **só pelo resumo da busca**, página não aberta |

**Não abriram (não usei de memória):**
- ADA Standards of Care 2026 (diabetesjournals.org devolveu 403). Usei a página da ADA ao paciente para a regra 15/15.
- Bulário da ANVISA (consultas.anvisa.gov.br): bloqueado por verificação anti-robô (Cloudflare); não tentei contornar. Bula brasileira de Mounjaro não encontrada em fonte oficial da Lilly (só em sites de farmácia, que não usei).
- ANVISA, Alerta 02/2026 (uso indevido de agonistas de GLP-1): 403.
- NEJM (STEP 1 e SURMOUNT-1): não aberto. Os números de náusea foram conferidos nas bulas FDA, não nos artigos.
- Medication Guide de Zepbound/Mounjaro (PDF separado da Lilly): não aberto; usei a seção 17 da bula, que tem as mesmas instruções.

---

## 2. Tabela dos achados

Legenda: BATE / DIVERGE (diz o que cada fonte diz e qual é a mais cautelosa) / SEM FONTE / ERRADO / LACUNA (sinal das fontes que a base não tem).

### Resumo do que BATE (sem detalhar)
- **sinais-de-alerta:** pancreatite (sintomas, irradiar para as costas, parar e procurar atendimento; urgência é o destino mais cauteloso, e a ANVISA, em 09/02/2026, diz "procurem atendimento médico imediato"); reação alérgica grave como urgência; vômito/diarreia persistentes e desidratação como urgência (a FDA diz "avisar quem acompanha logo"; Wharton 2022 recomenda "cuidado mais emergente" com vômito excessivo e tontura ou confusão; a base fica com a mais cautelosa); sintomas de vesícula (dor em cima à direita, febre, icterícia, fezes claras) para quem acompanha; tireoide (caroço, rouquidão, disfagia, falta de ar; contraindicação por carcinoma medular ou NEM 2); visão em DM2 para quem acompanha; coração acelerado em repouso para quem acompanha (Wegovy e Saxenda); semaglutida parar 2 meses antes de gravidez planejada (FDA, EMA e bula brasileira); aspiração em anestesia ou sedação; a retirada da advertência de suicídio pela FDA em 2026 (confirmada: DSC de 13/01/2026; bulas Wegovy 01/2026, Saxenda 02/2026 e Zepbound); CVV 188 (gratuito, 24 h).
- **efeitos-gastrointestinais:** retardo do esvaziamento gástrico; náusea de 44% com Wegovy 2,4 mg (bula FDA, tabela 3, 3 estudos somados, contra 16% no placebo); efeitos concentrados na subida de dose e que diminuem (bula Zepbound 6.1; folheto EMA e bula brasileira de Wegovy); refeições menores, comer devagar, parar na saciedade, evitar gordura/fritura/doce/condimentada, líquido longe das refeições, não deitar após comer (Wharton 2022; Gorgojo-Martínez 2022; aviso conjunto 2025); desidratação e lesão renal (FDA 5.5/5.3; EMA 4.4); ajuste de dose é de quem prescreve.
- **hidratacao:** perda de líquido e lesão renal aguda (FDA, EMA); sinais de desidratação (boca seca, sede, urina escura ou pouca, tontura, cansaço: NHS); álcool piora o enjoo (aviso conjunto 2025: "may also worsen nausea and gastroesophageal reflux"); goles ao longo do dia (Gorgojo-Martínez 2022).

### Achados que exigem mudança

| # | Arquivo / afirmação | Classe | O que dizem as fontes | Mais cautelosa / ação | Gravidade |
|---|---|---|---|---|---|
| C1 | sinais-de-alerta: **não há perda súbita de visão / NAION** (só "mudança na visão em quem tem DM2", destino equipe) | LACUNA | EMA (SmPC Wegovy/Ozempic 4.4 e 4.8): risco aumentado de NAION com semaglutida, "muito raro"; "A sudden loss of vision should lead to ophthalmological examination". Folheto EMA: "immediately contact your doctor". ANVISA (GGMON 06/2025) e bula brasileira Wegovy: "fale imediatamente com seu médico", perda de visão possivelmente irreversível. FDA: bulas de 05-08/2026 **não** têm NAION. | EMA/ANVISA, para todos. Perda súbita ou piora rápida de visão = **urgência** (o contato tem de ser imediato, e perda súbita de visão tem outras causas que também são urgentes; essa parte é juízo clínico, não está na bula). | Alta |
| C2 | sinais-de-alerta: **"Hipoglicemia (em quem também usa insulina ou sulfonilureia)"** inteira em "urgência" | ERRADO (destino) + DIVERGE (população) | FDA Wegovy 17 e Zepbound 17: avisar quem acompanha; ADA: tratar na hora com 15 g de carboidrato rápido e repetir em 15 min; 911 se inconsciente ou sem conseguir engolir; NHS: idem, 999 se não responde. Zepbound 5.7: "Hypoglycemia has also been associated with ZEPBOUND and GLP-1 receptor agonists in adults **without** type 2 diabetes". O próprio `medidas-sem-remedio` já manda tratar com 15 g primeiro. | Separar: **leve** = açúcar rápido primeiro e depois falar com a equipe; **grave** (confusão forte, desmaio, convulsão, não consegue engolir) = emergência, nada pela boca. Tirar a restrição "só em quem usa insulina/SU" (risco maior nesse grupo, mas não exclusivo). Do jeito atual, combinado com a regra do prompt ("a PRIMEIRA frase é procurar atendimento"), a IA atrasa o açúcar. | Alta |
| C3 | sinais-de-alerta: **não há obstrução intestinal / íleo** | LACUNA | FDA (6.2 das 5 bulas): "ileus, intestinal obstruction, severe constipation including fecal impaction". EMA (folheto Wegovy, efeito grave) e bula brasileira: "Obstrução intestinal. Uma forma grave de prisão de ventre (constipação) com sintomas adicionais, como dor de estômago, distensão abdominal, vômito". `medidas-sem-remedio` tem os sinais, mas sem destino. | **Urgência**: intestino preso com barriga muito inchada e dura, dor forte, vômito ou sem eliminar gases. | Alta |
| C4 | sinais-de-alerta: **não há dose a mais / erro de dose** | LACUNA | Medication Guide Wegovy FDA: "If you take too much... Call your healthcare provider or Poison Help line at 1-800-222-1222 or go to the nearest hospital emergency room right away". Bula brasileira item 9: "fale imediatamente com o seu médico... procure rapidamente socorro médico... Ligue para 0800 722 6001". EMA 4.9: observar e dar suporte (desidratação). ANVISA 02/2026 alerta sobre uso indevido (não aberto). | Contato imediato (quem prescreve ou centro de intoxicação); com vômito forte, sinais de hipoglicemia ou dose grande, **urgência**. Os números variam por país (fato local). | Alta |
| C5 | sinais-de-alerta, gravidez: "as de tirzepatida e de liraglutida, parar ao descobrir a gravidez" | DIVERGE | FDA Zepbound 8.1 e Saxenda 8.1: parar ao reconhecer a gravidez. **EMA Mounjaro 4.6: "Tirzepatide should be discontinued at least 1 month before a planned pregnancy"**. **EMA Saxenda 4.6: "If a patient wishes to become pregnant or pregnancy occurs, treatment with liraglutide should be discontinued"**. | EMA, para todos: tirzepatida pelo menos 1 mês antes da gravidez planejada; liraglutida ao decidir engravidar. | Média |
| C6 | sinais-de-alerta: **não há contracepção oral com tirzepatida** | LACUNA / DIVERGE | FDA Zepbound 7.2/8.3/17: trocar para método não oral ou somar barreira "for 4 weeks after initiation... and for 4 weeks after each dose escalation". EMA Mounjaro 4.5: redução "not considered clinically relevant". | FDA, para todos: em quem usa pílula e tirzepatida, falar com quem prescreve sobre método não oral ou camisinha nas 4 semanas após o início e após cada subida. Item de "equipe". | Média |
| C7 | sinais-de-alerta, "O que nunca fazer": a única exceção para repetir "parar" é a pancreatite | DIVERGE | Bulas FDA (Wegovy e Zepbound, 5.x e 17), EMA e bula brasileira: na reação alérgica grave, "Stop using... and get medical help right away" / "pare de usar Wegovy® e procure ajuda médica". | Incluir a reação alérgica grave na exceção (sempre junto de procurar atendimento). | Média |
| C8 | sinais-de-alerta, reação alérgica: lista de sinais | DIVERGE (incompleta) | MG Wegovy: "very rapid heartbeat", "severe rash or itching", "fainting or feeling dizzy". EMA/bula BR: tontura, coração acelerado, suor, perda de consciência, inchaço rápido sob a pele. | Acrescentar coração muito acelerado, tontura e erupção forte. | Baixa |
| C9 | sinais-de-alerta, cirurgia: "avisar a equipe do procedimento" | BATE, mas incompleto | FDA 5.x/17: avisar antes de qualquer cirurgia ou procedimento planejado. EMA 4.4: considerar o risco antes do procedimento. ASA e sociedades (2024): a maioria continua, mas quem tem maior risco (início ou subida de dose, sintomas GI, dose alta) pode precisar de **dieta só líquida nas 24 h antes**; decisão compartilhada com a equipe. | Avisar **já na marcação**, não só no dia, e não parar por conta própria. | Média |
| C10 | sinais-de-alerta, gastroparesia: "[Bula Zepbound FDA]" | DIVERGE (citação) | Todas as cinco bulas FDA (Wegovy 5.6, Ozempic 5.7, Saxenda 5.7, Mounjaro 5.6, Zepbound 5.2) e a EMA (Wegovy 4.4) não recomendam o uso na gastroparesia grave. | Citar todas; vale para os três princípios. | Baixa |
| C11 | sinais-de-alerta: "As bulas de 2026 trazem 'reações gastrointestinais graves'... [Wegovy, Zepbound e Saxenda]" | DIVERGE (citação) | A advertência está nas cinco bulas FDA atuais (alteração em 10/2025 em Wegovy e Saxenda); a EMA traz "Gastrointestinal effects and dehydration" (4.4). | "As bulas atuais", citando as cinco + EMA. | Baixa |
| C12 | sinais-de-alerta, coração acelerado: sem limite de gravidade | BATE + LACUNA de escalada | MG Wegovy: "Tell your healthcare provider if you feel your heart racing or pounding in your chest and it lasts for several minutes". Coração disparado também é sinal de alergia grave e de hipoglicemia. | Manter "equipe"; se vier com dor no peito, falta de ar ou desmaio, urgência (juízo clínico geral, alinhado a `medidas-sem-remedio`, "Tontura"). | Baixa |
| C13 | sinais-de-alerta, suicídio: números fora do Brasil | SEM FONTE (fato local) | FDA DSC 13/01/2026: relatar depressão nova ou pior a quem acompanha e cita a linha 988 (EUA). 3114 (França) confirmado só pela busca. EMA PRAC 04/2024: sem relação causal (só pelo resumo da busca). | Conteúdo clínico correto. Acrescentar 988 (EUA) e 3114 (França) quando o grupo de fatos locais confirmar; o resto pelo serviço de emergência local. | Baixa |
| C14 | efeitos-GI: "de 25 a 33% no SURMOUNT-1" [NEJM 2022] | SEM FONTE aberta | O NEJM não foi aberto. A bula FDA Zepbound (estudos 1 e 2 somados) diz náusea de 25% (5 mg), 29% (10 mg) e 28% (15 mg), contra 8% no placebo. | Citar o número da bula, que foi conferido. | Baixa |
| C15 | efeitos-GI: "Concentram-se no começo e nos dias e semanas depois de cada subida de dose" [mesmas fontes = NEJM] | BATE, citação errada | Bula Zepbound 6.1: "The majority of nausea, vomiting, and/or diarrhea events occurred during dose escalation and decreased over time". Folheto EMA e bula brasileira de Wegovy: "geralmente ocorrem durante o escalonamento da dose e desaparecem com o tempo". | Trocar a citação pelas bulas. | Baixa |
| C16 | efeitos-GI: "1 a 3 dias depois da aplicação" | SEM FONTE | Nenhuma fonte aberta dá esse intervalo. O texto já se declara "observação clínica comum". | Pode ficar, com a ressalva que já tem. | Baixa |
| C17 | efeitos-GI, constipação: "fibra" (sem gradualidade) e "Se passar de alguns dias, falar com quem acompanha" | DIVERGE + LACUNA | Aviso conjunto 2025: "Gradual increase in foods with soluble and insoluble fiber" e, no enjoo dos primeiros dias, evitar alimentos muito gordurosos ou com muita fibra. Obstrução (C3). | Fibra **aos poucos**; acrescentar os sinais de obstrução com destino de urgência. | Média |
| C18 | efeitos-GI, diarreia/vômito: "repor líquido" | BATE, incompleto | NHS: soro de reidratação oral quando se perde líquido por vômito ou diarreia; começar com goles pequenos. | Mencionar o soro de reidratação oral (já está em `medidas-sem-remedio`). | Baixa |
| C19 | efeitos-GI e hidratação: bebida com gás | DIVERGE | Wharton 2022: "moderating intake of alcohol and fizzy drinks (particularly in the context of nausea and dyspepsia)". Gorgojo-Martínez 2022: evitar bebidas gaseificadas. A hidratação diz "água com gás contam". | Mais cautelosa: com enjoo, estufamento, arroto ou azia, preferir água sem gás. | Média |
| C20 | hidratação: "A meta de água do aplicativo é a que a pessoa definiu. Usar essa" | LACUNA | Nenhuma fonte aberta dá um número; a base acerta ao não calcular. Mas há quem tenha **restrição de líquido** indicada pelo médico (insuficiência cardíaca, doença renal avançada). A EMA diz que Wegovy não foi estudado na insuficiência cardíaca NYHA IV nem na doença renal grave. | Quem tem limite de líquido do médico segue o médico, não a meta do app. É orientação geral, não vem de bula. | Média |
| C21 | hidratação: sinais de desidratação sem os sinais de emergência | LACUNA leve | NHS: 999/emergência com pele azulada, cinza ou pálida e fria, dificuldade para respirar, confusão ou sonolência excessiva. | Acrescentar uma linha de emergência. | Baixa |
| C22 | efeitos-GI: "É parte de como a saciedade aumenta" | BATE com ressalva | Folheto EMA: age em receptores no cérebro que controlam o apetite; FDA 12.2: atrasa o esvaziamento gástrico. O mecanismo principal da saciedade é central; o esvaziamento lento contribui. | Opcional: "o remédio age no cérebro, no apetite, e também deixa o estômago mais lento". | Baixa |

### Divergências entre a base e o prompt (`prompt.ts`, regra 1)

| # | Prompt | Base | Comentário |
|---|---|---|---|
| P1 | Linha 40: "intestino preso com dor" → **equipe** | Não está em `sinais-de-alerta`; `medidas-sem-remedio` lista "barriga muito inchada e dura, não conseguir eliminar gases, vômito" como "pedir ajuda", sem destino | Pela EMA e pela bula brasileira (obstrução é "efeito colateral grave"), intestino preso **com distensão, vômito ou sem gases** é urgência. O exemplo do prompt deveria ser "intestino preso há dias, sem outros sinais" para a equipe. Com C3 a base resolve; o exemplo do prompt fica a ajustar por quem cuida do prompt. |
| P2 | Linha 40: "glicose baixa com confusão" → pronto atendimento | Toda hipoglicemia em urgência | O prompt está mais certo. Com C2 a base fica igual ao prompt. Além disso, a linha 38 manda que a primeira frase seja "procurar atendimento" para qualquer sinal do documento: precisa de uma exceção para a hipoglicemia leve, em que a primeira frase é o açúcar rápido (como a exceção da gravidez). |
| P3 | Linha 37: nunca dizer para parar (mas pode repetir a bula) | Exceção só para a pancreatite | Acrescentar a reação alérgica grave (C7); o prompt já permite, porque é o que a bula diz. |
| P4 | Linha 39: CVV 188, fora do Brasil o serviço local | Igual | Coerente. |

---

## 3. Texto novo proposto (pronto para colar)

### 3.1 `sinais-de-alerta.md`: arquivo inteiro revisado

```markdown
# Sinais de alerta: quando procurar a equipe ou o pronto-socorro

⚠️ RASCUNHO — aguardando revisão de profissional de saúde (PENDENCIAS,
itens 13 e 13b). Esta lista sai das advertências das bulas (FDA, EMA e
brasileira); quando elas divergem, vale a mais cautelosa.

Quando a pessoa descreve um destes sinais, a resposta COMEÇA pela
orientação de procurar atendimento, antes de qualquer outra frase. A
exceção é a hipoglicemia leve: aí a primeira frase é o açúcar rápido.

## Procurar atendimento de urgência
- **Dor abdominal forte e que não passa**, que pode ir para as costas,
  com ou sem vômito: pode ser pancreatite. A bula orienta parar o
  medicamento e procurar atendimento. [Bulas FDA Wegovy e Zepbound;
  bula Wegovy Brasil; Anvisa, alerta de 09/02/2026]
- **Reação alérgica grave:** inchaço no rosto, lábios, língua ou garganta,
  dificuldade para respirar ou engolir, coração muito acelerado, tontura
  ou desmaio, coceira ou erupção forte pelo corpo. A bula orienta parar o
  medicamento e procurar ajuda na hora. [Bulas FDA Wegovy e Zepbound;
  EMA; bula Wegovy Brasil]
- **Perda súbita da visão, ou piora rápida**, mesmo sem dor, em geral em
  um olho: com a semaglutida pode ser uma lesão muito rara do nervo
  óptico (NOIA), e perda súbita de visão tem outras causas que também
  pedem atendimento rápido. [EMA, Wegovy e Ozempic 4.4, 2025; Anvisa,
  Alerta GGMON 06/2025; bula Wegovy Brasil]
- **Intestino preso com barriga muito inchada e dura, dor forte, vômito,
  ou sem conseguir eliminar gases:** pode ser obstrução intestinal. [Bulas
  FDA, 6.2; EMA e bula Wegovy Brasil, efeitos graves]
- **Vômito ou diarreia que não param**, não conseguir manter nem água, ou
  sinais de desidratação forte (pouca ou nenhuma urina, tontura forte,
  confusão): risco para os rins. As bulas atuais trazem "reações
  gastrointestinais graves" e "lesão renal aguda" como advertências
  próprias. [Bulas FDA Wegovy, Ozempic, Saxenda, Mounjaro e Zepbound;
  EMA 4.4]
- **Hipoglicemia grave:** confusão forte, desmaio, convulsão ou não
  conseguir engolir. Nada pela boca; chamar o serviço de emergência. A
  hipoglicemia leve (suor frio, tremor, fome súbita, coração acelerado,
  visão turva) se trata na hora com açúcar rápido (ver
  `medidas-sem-remedio`) e depois se fala com quem acompanha. O risco é
  maior com insulina ou sulfonilureia, mas também aparece sem diabetes.
  [Bulas FDA Wegovy 5.4 e Zepbound 5.7; ADA; NHS]
- **Dose a mais por engano** (dose dobrada, aplicação repetida, medida
  errada): falar na hora com quem prescreve ou com o centro de
  intoxicações; com vômito forte, sinais de hipoglicemia ou uma quantidade
  grande, pronto atendimento, levando a embalagem. No Brasil,
  Disque-Intoxicação 0800 722 6001; nos EUA, Poison Help 1-800-222-1222.
  [Bula Wegovy Brasil, item 9; Medication Guide Wegovy FDA; EMA 4.9]
- **Pensamentos de se machucar ou de suicídio:** procurar ajuda imediata
  (no Brasil, CVV 188, ligação gratuita, 24 horas; nos EUA, 988; fora
  deles, o serviço de emergência local). É orientação geral de segurança:
  em 2026 a FDA pediu a retirada dessa advertência das bulas dos agonistas
  de GLP-1, por não ter achado risco aumentado, e a EMA (2024) não achou
  relação causal. Não afirmar que o medicamento causa isso. [FDA,
  comunicado de 13/01/2026]

## Falar com quem acompanha logo (sem esperar a consulta)
- **Dor do lado direito, em cima, na barriga**, febre, pele ou olhos
  amarelados, fezes claras: pode ser vesícula (cálculo ou inflamação). Se
  a dor for forte e não passar, vale o item de urgência acima. [Bulas FDA
  Wegovy e Zepbound]
- **Caroço ou inchaço no pescoço, rouquidão que não passa, dificuldade
  para engolir, falta de ar.** As bulas trazem advertência sobre tumores
  de tireoide (vistos em roedores) e contraindicam o uso a quem tem
  histórico pessoal ou familiar de carcinoma medular de tireoide ou de
  NEM 2. Falta de ar forte e repentina é urgência. [mesmas fontes]
- **Mudança na visão**, em quem tem diabetes tipo 2 (advertência de
  complicações da retinopatia diabética). Perda súbita é urgência (acima).
  [Bulas FDA Ozempic, Wegovy e Zepbound; bula Wegovy Brasil]
- **Coração acelerado em repouso** que dura alguns minutos ou volta com
  frequência. Com dor no peito, falta de ar ou desmaio, é urgência.
  [Bulas FDA Wegovy e Saxenda]
- **Gravidez, ou plano de engravidar.** Falar com quem prescreve assim que
  pensar em engravidar: a semaglutida sai pelo menos 2 meses antes; a
  tirzepatida, pelo menos 1 mês antes; a liraglutida, ao decidir
  engravidar. Se a gravidez já aconteceu, o medicamento é suspenso por
  quem prescreve. [Bulas FDA Wegovy, Zepbound e Saxenda; EMA Mounjaro e
  Saxenda 4.6; bula Wegovy Brasil]
- **Pílula anticoncepcional com tirzepatida:** a tirzepatida pode reduzir
  o efeito da pílula. A bula americana orienta trocar por um método não
  oral, ou somar camisinha, nas 4 semanas depois do início e de cada
  subida de dose. [Bulas FDA Zepbound e Mounjaro, 7.2 e 8.3]
- **Gastroparesia grave** conhecida: as bulas não recomendam o uso.
  [Bulas FDA Wegovy, Ozempic, Saxenda, Mounjaro e Zepbound; EMA]
- **Cirurgia, endoscopia ou qualquer procedimento com anestesia ou
  sedação:** avisar a equipe do procedimento já na marcação, e não só no
  dia, porque o estômago mais lento aumenta o risco de aspiração. Em
  alguns casos a equipe pede dieta só líquida nas 24 horas antes ou outra
  medida; não parar por conta própria. [Bulas FDA Wegovy e Zepbound;
  EMA 4.4; bula Wegovy Brasil; ASA e sociedades, 2024]

## O que nunca fazer na resposta
Não dizer que "é normal" um sinal desta lista, não sugerir esperar, não
sugerir parar, pular ou mudar a dose por conta própria (as exceções são
repetir a orientação da bula de parar diante de suspeita de pancreatite
ou de reação alérgica grave, sempre junto de procurar atendimento).
```

### 3.2 `efeitos-gastrointestinais.md`: trechos a trocar

**Seção "Quando aparecem", substituir os dois primeiros itens por:**

```markdown
- São os efeitos mais comuns: náusea em 44% com semaglutida 2,4 mg (16%
  no placebo) e de 25 a 29% com tirzepatida (8% no placebo). [Bulas
  Wegovy e Zepbound FDA, 6.1]
- Concentram-se no começo e **nos dias e semanas depois de cada subida
  de dose**, e costumam diminuir com o tempo. [Bula Zepbound FDA 6.1;
  EMA e bula Wegovy Brasil]
```

**Seção "O que costuma ajudar": acrescentar a fonte no título da lista e trocar os itens de bebida e de constipação:**

```markdown
## O que costuma ajudar (orientação geral) [Wharton et al. 2022;
Gorgojo-Martínez et al. 2022; aviso conjunto de nutrição 2025]
```

```markdown
- Beber água ao longo do dia, em goles, e não em grande volume junto
  com a refeição. Com enjoo, estufamento ou azia, evitar bebida com gás
  e álcool.
```

```markdown
- **Constipação:** água, fibra aumentada aos poucos (verduras, frutas,
  grãos integrais, feijões) e movimento. Se passar de alguns dias, falar
  com quem acompanha. Barriga muito inchada e dura, dor forte, vômito ou
  não conseguir eliminar gases é urgência (ver sinais de alerta).
- **Diarreia ou vômito:** repor líquido em goles pequenos, ou soro de
  reidratação oral; perda de líquido prolongada pode desidratar e afetar
  os rins (ver sinais de alerta). [Bulas Wegovy e Zepbound FDA, lesão
  renal aguda; NHS]
```

**Seção "Quando não é 'efeito esperado'", substituir a primeira frase por:**

```markdown
Dor abdominal forte e persistente, vômito que não para, sinais de
desidratação, intestino preso com barriga inchada e sem gases, sangue no
vômito ou nas fezes: ver `sinais-de-alerta`. Nesses casos a orientação é
procurar atendimento, e não esperar melhorar.
```

(Opcional, C22: em "Por que acontecem", trocar "É parte de como a saciedade aumenta" por "O remédio age no apetite, no cérebro, e também deixa o estômago mais lento; isso ajuda na saciedade e é a origem do enjoo...". [EMA, folheto Wegovy; FDA 12.2])

### 3.3 `hidratacao.md`: trechos a trocar

**Seção "Quanto", acrescentar ao fim:**

```markdown
Quem tem limite de líquido indicado pelo médico (por exemplo, por
insuficiência cardíaca ou doença renal avançada) segue esse limite, e
não a meta do aplicativo. (Orientação geral; confirmar com quem
acompanha.)
```

**Seção "Sinais de desidratação", substituir por:**

```markdown
## Sinais de desidratação
Boca seca, sede forte, urina escura ou pouca urina, tontura ao levantar,
cansaço fora do comum. [NHS] Com vômito ou diarreia que não param, é
sinal de alerta (ver `sinais-de-alerta`). Confusão, sonolência forte,
pele fria e pálida ou dificuldade para respirar: emergência. [NHS]
```

**Seção "Na prática", substituir por:**

```markdown
## Na prática
Goles ao longo do dia, e não grandes volumes de uma vez (ajuda também
com o enjoo). Água e chás sem açúcar contam; com enjoo, estufamento ou
azia, preferir água sem gás. [Wharton et al. 2022; Gorgojo-Martínez et
al. 2022] Com vômito ou diarreia, o soro de reidratação oral repõe
também os sais. [NHS] Bebidas açucaradas e alcoólicas não ajudam: o
álcool desidrata e pode piorar o enjoo e o refluxo. [aviso conjunto de
nutrição 2025]
```

---

## 4. Observações para quem revisa

- A NAION hoje está só na EMA e na ANVISA (semaglutida), e não nas bulas FDA de 05-08/2026. Pela regra do produto, vale para todos. Também não aparece para tirzepatida nem liraglutida; o texto proposto fala em "perda súbita de visão" sem limitar o princípio, porque o destino (urgência) vale de qualquer forma.
- A bula brasileira e a EMA dizem que Wegovy "não é recomendado" em quem tem retinopatia diabética (a EMA, na não controlada). Isso é contraindicação/precaução e cabe ao arquivo `semaglutida.md` (outro grupo), não aos alertas.
- Os números de emergência e de apoio por país (192/SAMU, 911, 112, 988, 3114, Telefonseelsorge etc.) devem ser conferidos pelo grupo de fatos locais. Aqui só 0800 722 6001 (bula brasileira), 1-800-222-1222 (Medication Guide FDA), 988 (FDA DSC) e CVV 188 foram vistos em fonte.
- A troca de C2 precisa vir junto de uma exceção na linha 38 do `prompt.ts` (P2); sem ela, o prompt manda abrir com "procure atendimento" mesmo na hipoglicemia leve.
