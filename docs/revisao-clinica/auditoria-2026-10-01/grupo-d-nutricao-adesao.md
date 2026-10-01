# Auditoria — Grupo D: medidas sem remédio, proteína, platô/reganho, adesão

Data: 01/10/2026. Arquivos auditados (lidos inteiros), em `C:\dev\Forma\servidor\conhecimento\`:
`medidas-sem-remedio.md`, `proteina-e-massa-magra.md`, `plato-e-reganho.md`, `adesao-e-vida-real.md`.
Nenhum arquivo do repositório foi editado.

Regra aplicada: orientação única e global; quando as fontes divergem, vale a mais cautelosa.

---

## 1. Fontes realmente abertas

| # | Fonte | URL | Como foi lida |
|---|---|---|---|
| F1 | Mozaffarian et al. Aviso conjunto ACLM/ASN/OMA/TOS, *Nutritional priorities to support GLP-1 therapy for obesity*, 2025 (versão *Obesity* 33(8):1475–1503; publicado também no Am J Clin Nutr) | https://pmc.ncbi.nlm.nih.gov/articles/PMC12304835/ | Texto completo (PMC) |
| F2 | Wilding et al. Extensão do STEP 1, Diabetes Obes Metab 2022 | https://pmc.ncbi.nlm.nih.gov/articles/PMC9542252/ | Texto completo (PMC) |
| F3 | Rubino et al. STEP 4, JAMA 2021 | https://jamanetwork.com/journals/jama/fullarticle/2777886 | Resumo |
| F4 | Aronne et al. SURMOUNT-4, JAMA 2024 | https://eprints.gla.ac.uk/315448 e https://vivo.weill.cornell.edu/display/pubid38078870 | Resumo |
| F5 | Bula FDA do Wegovy (DailyMed, revisão de 18/06/2026) | https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=ee06186f-2aa3-4990-a760-757579d8f77b | Seções 5.2–5.5 e 17 |
| F6 | SmPC EMA Wegovy e Mounjaro (texto já extraído na pasta de auditoria: `ema-wegovy.txt`, `ema-mounjaro.txt`) | https://www.ema.europa.eu/en/documents/product-information/wegovy-epar-product-information_en.pdf | O PDF não abriu pelo WebFetch; li o texto extraído localmente (seção 4.4 e folheto) |
| F7 | ADA, hipoglicemia: sintomas e tratamento (regra 15-15) | https://diabetes.org/living-with-diabetes/hypoglycemia-low-blood-glucose/symptoms-treatment e https://diabetes.org/living-with-diabetes/treatment-care/hypoglycemia-low-blood-glucose | Páginas abertas |
| F8 | Gorgojo-Martínez et al. Consenso multidisciplinar sobre eventos GI com GLP-1, J Clin Med 2023 | https://pmc.ncbi.nlm.nih.gov/articles/PMC9821052/ | Texto completo (PMC) |
| F9 | Katz et al. Diretriz ACG de DRGE, Am J Gastroenterol 2022 | https://pmc.ncbi.nlm.nih.gov/articles/PMC8754510/ | Texto completo (PMC) |
| F10 | Diretrizes OMS 2020 de atividade física (Bull et al., Br J Sports Med) | https://pmc.ncbi.nlm.nih.gov/articles/PMC7719906/ | Texto completo (PMC) |
| F11 | Diretriz KDIGO 2024 de DRC, resumo do NephJC | https://www.nephjc.com/news/kdigo-ckd-part2 | Resumo secundário (o PDF da KDIGO não foi aberto) |
| F12 | OMS, diretriz de GLP-1 na obesidade, 01/12/2025 | https://www.who.int/news/item/01-12-2025-who-issues-global-guideline-on-the-use-of-glp-1-medicines-in-treating-obesity | Nota oficial (a diretriz completa não foi aberta) |
| F13 | Baalmann et al., J Manag Care Spec Pharm 2026;32(6):660 | https://pmc.ncbi.nlm.nih.gov/articles/PMC13193313/ | Texto completo (PMC) |
| F14 | Talay et al., Healthcare (Basel) 2025 (Reino Unido, tirzepatida) | https://pmc.ncbi.nlm.nih.gov/articles/PMC12786109/ | Texto completo (PMC) |
| F15 | Tournayre et al., J Med Internet Res 2026 (França) | https://pmc.ncbi.nlm.nih.gov/articles/PMC13515347/ | Texto completo (PMC) |
| F16 | Talay et al., Diabetes Obes Metab 2026 (Austrália), DOI 10.1111/dom.70462 | https://rethinkpeptides.com/research/talay-2026-effectiveness-and-adherence-in | **Só resumo secundário**; o abstract original não abriu (o site da Juniper deu 403/404) |
| F17 | EASO/EFAD/ECPO, consenso sobre terapias incretínicas, Lancet Diabetes Endocrinol 2026 | https://www.efad.org/easo-efad-ecpo-consensus-statement-on-incretin-based-therapies-in-obesity-care/ | Só a página-resumo, sem números; o artigo completo não foi aberto |
| F18 | Nutritotal PRO (resumo brasileiro de ESPEN/EASO/ABESO 2026) | https://nutritotal.com.br/pro/manejo-nutricional-na-era-dos-agonistas-de-glp-1-o-que-devo-priorizar/ | Secundária; serve só como indício (diz "1,2–1,6 g/kg de peso ajustado") |

**Confirmadas só pelo resumo da busca (a página não foi aberta):** Prime Therapeutics AMCP 2024 (4.066 pessoas; 32,3% e 27,2%; o PDF oficial veio ilegível); Talay e Vickers, Behav Sci 2024 (5.604 pessoas; 43,7/26,2/9,9/7,2%; https://www.mdpi.com/2076-328x/14/6/480); Armanious et al., JMIR 2026 (https://www.jmir.org/2026/1/e78391); platô do STEP 1 na semana 60 (resumos de terceiros; o NEJM devolveu 403); DXA do SURMOUNT-1 (cerca de 25% do peso perdido era massa magra; resumo do EASO/ECO 2023); EFSA 2010, ingestão adequada de água: 2,0 L/dia para mulheres e 2,5 L/dia para homens, somando a água da comida; Consenso HFA/ESC 2024 e diretriz ESC 2021 de insuficiência cardíaca (restrição de líquido de 1,5–2 L/dia pode ser considerada na IC grave ou com hiponatremia).

**Não abriram de jeito nenhum:** NEJM STEP 1 (403), resumo do subestudo DXA de Wilding (PDF ilegível), PubMed (tela de cookies), pôster ACCP do Baalmann (403), PDF da EMA pela web (contornado com o texto local, F6). ABESO/SBEM e ADA Standards 2025/2026: **não li** nenhum texto primário deles; nada abaixo se apoia neles.

---

## 2. Resumo do que BATE (sem detalhar)

- **Platô/reganho:** STEP 4 +6,9% (semanas 20→68) [F3]; extensão do STEP 1, cerca de dois terços recuperados (11,6 de 17,3 pontos percentuais) [F2]; SURMOUNT-4 +14,0% (semanas 36→88) [F4]; STEP 1 com 68 semanas e SURMOUNT-1 com 72; dose inicial é para tolerância [F5]; oscilação diária e platô por adaptação, consensuais.
- **Proteína:** 0,8 g/kg (RDA), 1,2–1,6 g/kg/dia "propostas" na perda ativa, 80–120 g/dia, incerteza sobre qual peso usar, força ≥3x/semana mais ≥150 min de aeróbico [F1]. Tudo bate com o aviso conjunto.
- **Sintomas GI:** refeições pequenas e frequentes, comer devagar, parar na saciedade, evitar gordura, doce e cheiro forte, goles entre as refeições, não deitar depois de comer, comida leve, evitar café/álcool na diarreia, água + fibra + movimento na constipação [F1, F8]. Refluxo: 2–3 h antes de deitar e cabeceira elevada (recomendações condicionais, evidência baixa) [F9]. Sinais de alerta coerentes com a bula (pancreatite, desidratação) [F5].
- **Hipoglicemia:** 15 g, 15 min, repetir e depois lanche; ½ copo (120 mL) de suco ou refrigerante comum; 1 colher de sopa de açúcar [F7]; reduzir insulina/sulfonilureia é decisão de quem prescreve [F5, F6].
- **Adesão:** Baalmann (393; 44%; 13,8% contra 6,4%; 12,5% contra 7,2%) [F13]; Talay Reino Unido (19.693; 27%; 22,6%; mais de 25 registros → 1,67x mais chance de sair; perda acima de 10% no 1º mês → mais abandono; vínculo com a Eucalyptus) [F14]; Talay Austrália (4.309; 31,7%/16,1%; pesar demais no 1º mês ligado a pior resultado) [F16, secundária]; Tournayre (191; 59,5/71,9/79,5%; cerca de 69% mediado) [F15]; OMS dez/2025 condicional, longo prazo, com cuidado amplo [F12]. Prime, Talay e Vickers e Armanious batem nos números pelo resumo da busca.

---

## 3. Tabela dos achados que pedem atenção

| # | Arquivo / trecho | Classe | O que as fontes dizem | Gravidade |
|---|---|---|---|---|
| D1 | medidas-sem-remedio: "Água ao longo do dia; a meta do aplicativo é a referência" (constipação; também enjoo, tontura, cefaleia, cansaço, fome) | **DIVERGE / RISCO** | Bulas pedem evitar desidratação [F5, F6]. Na IC grave/hiponatremia, a restrição de 1,5–2 L/dia pode ser considerada (ESC 2021/HFA 2024, via busca); na diálise há limite. **A meta do app é 35 mL/kg do peso real, sem teto** (`src/logic/derive.ts:2363`): uma pessoa de 130 kg recebe cerca de 4,5–5 L/dia, o dobro da ingestão adequada da EFSA (2,0/2,5 L totais). Nenhum arquivo da base tem ressalva para restrição hídrica (o `hidratacao.md`, de outro grupo, também não). | **Alta** |
| D2 | medidas-sem-remedio: Vômito, "soro de reidratação oral"; Diarreia, "repor líquido" | **SEM FONTE / RISCO** | O soro é adequado em geral, mas tem sódio e potássio: cuidado em IC, DRC e diálise. As bulas citam lesão renal aguda por desidratação, "com ou sem doença renal" [F1, F5, F6]. Falta o aviso para quem usa diurético ou remédio de pressão/diabetes nesses dias, e falta o limite de tempo para pedir ajuda. | Alta |
| D3 | proteina-e-massa-magra: "a massa magra respondeu por cerca de 39% do peso perdido" | **DIVERGE (leve) / incompleto** | O aviso conjunto calcula **38%** (5,3 de 13,6 kg) e lembra que massa magra não é músculo: cerca de 20% do peso perdido seria músculo [F1]. No SURMOUNT-1 (tirzepatida) a massa magra foi cerca de 25% (resumo). Sem o contexto, "39%" assusta e soa como "39% de músculo". | Média |
| D4 | proteina-e-massa-magra: "A meta do aplicativo… Usar essa meta, e não calcular outra" | **RISCO** | O app calcula 1,2 g/kg do **peso real** (`derive.ts:2339`). O aviso diz que não se sabe qual peso usar, sugere 80–120 g/dia como alternativa, e manda **evitar ≥2 g/kg/dia por tempo longo** [F1]. Na DRC G3–G5 sem diálise a KDIGO 2024 pede 0,8 g/kg e veda >1,3 g/kg [F11]. O arquivo trata a DRC (bom), mas não cálculo renal (o aviso pede cuidado com proteína animal em quem tem nefrolitíase [F1]) nem metas altas demais. | Média |
| D5 | proteina-e-massa-magra: "treino de força pelo menos 3 vezes por semana" | **DIVERGE** | Aviso: ≥3x [F1]. OMS 2020: ≥2 dias/semana, e quem tem doença crônica deve fazer "de acordo com suas capacidades", com orientação profissional [F10]. Mais cautelosa: o piso da OMS (2x) e a ressalva para doença crônica; 3x fica como o alvo do aviso. | Baixa-média |
| D6 | medidas-sem-remedio: Hipoglicemia | **BATE, incompleto** | ADA: o limiar é <70 mg/dL [F7] (3,9 mmol/L; a unidade importa no uso global). Inconsciente: glucagon, se houver, e chamar emergência [F7]. "Sulfonilureia" deixa de fora as glinidas (bula: "insulin secretagogue" [F5]). "Meio copo" é medida ambígua fora do Brasil: dizer 120 mL. | Média |
| D7 | medidas-sem-remedio: Tontura, "comer algo se faz tempo" | **SEM FONTE / lacuna** | Em quem usa insulina ou sulfonilureia, tontura pode ser hipoglicemia: medir a glicose antes. A perda de peso pode baixar a pressão em quem toma anti-hipertensivo (consensual, sem fonte aberta aqui): tontura ao levantar que se repete deve ir para a equipe. | Média |
| D8 | medidas-sem-remedio: Diarreia sem menção a fibra/polióis; Enjoo sem menção a fibra | **SEM FONTE (lacuna leve)** | Consenso GI: na diarreia, reduzir por uns dias a fibra alta e os adoçantes terminados em "-ol" [F8]; no enjoo dos primeiros dias, evitar comida muito fibrosa [F1]. O arquivo manda "aumentar a fibra" na constipação, o que pode chocar quando há enjoo e constipação juntos. | Baixa |
| D9 | medidas-sem-remedio: "sede às vezes parece fome" | **SEM FONTE** | Senso comum popular, sem evidência sólida, e reforça a meta de água (D1). Melhor tirar. | Baixa |
| D10 | medidas-sem-remedio: Cansaço, "treino mais leve, sem abandonar" | **SEM FONTE / tom** | "Sem abandonar" pode empurrar treino num dia de fraqueza por pouca comida ou desidratação. Mais cauteloso: descansar no dia ruim e voltar depois. | Baixa |
| D11 | medidas-sem-remedio: ausência de gengibre, chá de hortelã e magnésio | **OK (manter ausentes)** | O aviso conjunto cita chá de gengibre/hortelã para enjoo e magnésio para constipação [F1]; o consenso espanhol cita gengibre e "água com limão e bicarbonato" [F8]. Pelo critério da mais cautelosa, não incluir: magnésio é arriscado na DRC, gengibre em suplemento interage com anticoagulante (não verificado aqui), hortelã piora refluxo [F9] e soro caseiro dosa mal. Recomendo registrar a exclusão para ninguém acrescentar depois. | Info |
| D12 | plato-e-reganho: os três números de retirada | **BATE, falta contexto** | STEP 4: a troca para placebo foi depois de 20 semanas de semaglutida (-10,6%) [F3]. Extensão do STEP 1: n=327, lições de estilo de vida também paradas, e saldo líquido de -5,6% em relação ao início [F2]. SURMOUNT-4: depois de -20,9% em 36 semanas; saldo de -9,9% no placebo em 88 semanas [F4]. Sem o saldo, a IA pode passar a ideia de "volta tudo". | Baixa-média |
| D13 | plato-e-reganho: platô "por volta de um ano a um ano e meio" | **BATE (parcial)** | STEP 1: máximo por volta da semana 60 (resumos; o NEJM não abriu). O platô do SURMOUNT-1 não foi verificado em fonte aberta. A redação "costuma se estabilizar entre 1 ano e 1 ano e meio" se sustenta. | Info |
| D14 | plato-e-reganho: "Parar o tratamento" | **SEM FONTE / lacuna** | Em quem tem diabetes, parar também faz a glicose subir; na extensão do STEP 1, os marcadores cardiometabólicos voltaram junto [F2]. Vale uma linha. | Baixa-média |
| D15 | adesao: "Os três estudos de Talay et al. são de autores ligados à empresa" | **INCOMPLETO** | O Tournayre também tem conflito: autores com verba/honorários da Novo Nordisk e da Eli Lilly, e um acionista da plataforma Aviitam [F15]. População com IMC ≥40. | Baixa |
| D16 | adesao: Baalmann, "os poucos que seguiram perderam em média 12,5%" | **BATE, mas enganoso sem o n** | Só **5 pacientes (1%)** seguiram o esquema [F13]. Com n=5, o 12,5% contra 7,2% é frágil; a IA não deve usar isso para estimular subir a dose. | Média |
| D17 | adesao: Armanious, "o que pesou foi achar que o remédio não estava funcionando" | **DIVERGE (leve)** | O estudo também liga efeitos **não gastrointestinais** a insatisfação e abandono; e trata de uso off-label do Ozempic, com avaliações do Drugs.com (busca). | Baixa |
| D18 | adesao: Prime, "começaram… em 2021" | **NÃO VERIFICADO** | O n e as porcentagens batem pela busca; o ano de início não foi confirmado (PDF ilegível). Manter só se outra fonte confirmar. | Baixa |
| D19 | adesao: OMS | **BATE, falta critério** | Adultos com IMC ≥30, **excluindo gestantes**; condicional por segurança de longo prazo, custo e equidade [F12]. | Baixa |
| D20 | adesao: "Preferir a pesagem semanal" | **SEM FONTE direta** | É inferência de dados observacionais de empresa [F14, F16]. É razoável e cauteloso (há quem tenha histórico de transtorno alimentar), mas não é diretriz. Basta não apresentar como regra. | Info |
| D21 | Escopo: dose esquecida, viagem e álcool | **Fora destes arquivos** | Não aparecem nos quatro arquivos; estão em `semaglutida.md`, `tirzepatida.md`, `liraglutida.md`, `armazenamento-e-viagem.md` e `hidratacao.md` (outros grupos). Para referência, a SmPC da EMA (Wegovy) diz: tomar a dose esquecida em até 5 dias; depois disso, pular; se faltaram várias doses, considerar reiniciar com dose menor [F6]. | Info |

---

## 4. Textos novos propostos (prontos para colar)

### D1 + D2 — `medidas-sem-remedio.md`, logo depois de "## Como usar" (nova seção)

```markdown
## Antes de falar em água e soro
- Quem tem insuficiência cardíaca, doença renal (inclusive em diálise)
  ou recebeu limite de líquido ou de sal da equipe segue esse limite, e
  não a meta de água do aplicativo. Nesses casos, soro de reidratação
  também é com quem acompanha. [ESC 2021, insuficiência cardíaca]
- A meta do aplicativo é ponto de partida, não ordem: se parecer alta
  demais para o dia a dia, ajustar com quem acompanha. [EFSA 2010]
```

### D2 — `medidas-sem-remedio.md`, substituir o bloco "## Vômito" e o de "## Diarreia"

```markdown
## Vômito
- Dar uma pausa na comida por um tempo, e voltar com goles pequenos e
  frequentes de água ou de soro de reidratação oral (com a ressalva de
  "Antes de falar em água e soro").
- Quando o estômago aceitar, comida leve e em pouca quantidade.
- Repouso.
- Quem usa remédio para diabetes, para pressão ou diurético: avisar a
  equipe no mesmo dia, porque alguns desses remédios pedem cuidado
  quando se perde líquido. [Bulas Wegovy FDA e EMA: desidratação e rim]
- Pedir ajuda: vômito que não para, não conseguir manter nem água,
  pouca ou nenhuma urina, tontura forte, sangue no vômito, dor abdominal
  forte (sobretudo se vai para as costas). [Bula Wegovy FDA]

## Diarreia
- Repor líquido em goles ao longo do dia; soro de reidratação oral
  ajuda (mesma ressalva da água).
- Comida leve; por uns dias, evitar gordura, fritura, álcool, café,
  comida muito rica em fibra e adoçantes terminados em "-ol" (sorbitol,
  xilitol). [Gorgojo-Martínez et al., J Clin Med 2023]
- Quem usa remédio para diabetes, para pressão ou diurético: avisar a
  equipe no mesmo dia. [Bulas Wegovy FDA e EMA]
- Pedir ajuda: diarreia que não para, sinais de desidratação, sangue
  nas fezes, febre, dor forte.
```

### D1 + D8 — `medidas-sem-remedio.md`, primeiro e segundo itens de "## Intestino preso"

```markdown
- Água ao longo do dia, dentro do limite de quem tem restrição de
  líquido (ver "Antes de falar em água e soro").
- Aumentar a fibra aos poucos e junto com líquido: frutas, verduras,
  aveia, feijão e outros grãos. Se o enjoo estiver forte, esperar ele
  melhorar para aumentar. [Mozaffarian et al., aviso conjunto 2025]
```

### D6 — `medidas-sem-remedio.md`, substituir "## Hipoglicemia"

```markdown
## Hipoglicemia (em quem também usa insulina, sulfonilureia ou glinida)
- Sinais: suor frio, tremor, fome súbita, coração acelerado, confusão,
  visão turva. Glicose abaixo de 70 mg/dL (3,9 mmol/L) já conta.
- Na hora, se a pessoa está consciente e consegue engolir: 15 g de
  açúcar rápido (120 mL de suco ou de refrigerante comum, não diet, ou
  uma colher de sopa de açúcar), medir a glicose de novo em 15 minutos e
  repetir se continuar abaixo de 70; depois, um lanche com carboidrato e
  proteína. Chocolate e comida gordurosa sobem a glicose devagar. [ADA,
  hipoglicemia]
- Emergência: confusão forte, desmaio ou não conseguir engolir. Nesse
  caso, nada pela boca: se houver glucagon e alguém que saiba usar, usar;
  e chamar o serviço de emergência. [ADA]
- Glicose caindo bastante com insulina: falar com quem prescreve logo,
  porque a dose da insulina pode precisar de ajuste. Quem ajusta é a
  equipe, nunca a pessoa sozinha. [Bula Wegovy FDA e EMA]
```

### D7 — `medidas-sem-remedio.md`, substituir o terceiro item de "## Tontura" e acrescentar um item depois dele

```markdown
- Quem usa insulina, sulfonilureia ou glinida: medir a glicose primeiro
  (ver "Hipoglicemia"). Para os demais, água em goles, e comer algo se
  faz tempo da última refeição.
- Tontura ao levantar que se repete, em quem toma remédio de pressão:
  levar para quem acompanha, porque com a perda de peso a pressão pode
  baixar e a dose pode precisar de revisão.
```

### D9 — `medidas-sem-remedio.md`, em "## Fome voltando", substituir o item da água

```markdown
- Água ao longo do dia, junto com as refeições de volume (sopa, salada).
```

### D10 — `medidas-sem-remedio.md`, em "## Cansaço e fraqueza", substituir o terceiro item

```markdown
- Sono; e, nos dias de fraqueza, descansar ou fazer só um treino leve,
  voltando ao normal quando a energia voltar.
```

### D11 — `medidas-sem-remedio.md`, acrescentar ao fim de "## Como usar"

```markdown
Este documento não sugere chás, gengibre, suplementos (inclusive
magnésio e eletrólitos em cápsula), jejum nem receitas caseiras de soro:
alguns interagem com remédios ou fazem mal em doença renal ou cardíaca.
Se a pessoa perguntar, a resposta é que vale levar a quem acompanha.
```

### D3 — `proteina-e-massa-magra.md`, substituir o primeiro parágrafo de "## O problema"

```markdown
Toda perda de peso leva junto um pouco de massa magra (músculo, água,
órgãos, osso), não só gordura. No subestudo de composição corporal do
STEP 1 (DEXA, 140 pessoas), cerca de 38% do peso perdido com semaglutida
foi massa magra; como massa magra não é só músculo, estima-se que perto
de 20% do peso perdido seja músculo. Com tirzepatida (SURMOUNT-1), a
massa magra foi cerca de um quarto do peso perdido. É uma proporção
parecida com a de outras formas de perder peso. [Mozaffarian et al.,
aviso conjunto 2025; Wilding et al., NEJM 2021; Jastreboff et al., NEJM
2022]
```

### D4 — `proteina-e-massa-magra.md`, substituir o item "A meta do aplicativo" e a seção "## Quem tem doença renal"

```markdown
- **A meta do aplicativo** é a que a pessoa (ou a equipe dela) definiu em
  "Os números do dia". Usar essa meta, e não calcular outra. O mesmo
  aviso lembra que não convém ficar por muito tempo em 2 g/kg/dia ou
  mais; se a meta parecer muito alta, vale revisar com quem acompanha.
  [Mozaffarian et al., aviso conjunto 2025]

## Quem tem doença renal ou cálculo renal
Meta de proteína em doença renal é decisão médica: em doença renal
crônica moderada a avançada, a referência costuma ser bem mais baixa do
que as metas de perda de peso. Quem já teve cálculo renal também precisa
de orientação própria sobre o tipo de proteína. Nesses casos, a meta do
aplicativo não vale sozinha: falar com quem acompanha. [KDIGO 2024;
Mozaffarian et al., aviso conjunto 2025]
```

### D5 — `proteina-e-massa-magra.md`, substituir o item "Treino de força"

```markdown
- **Treino de força** é o outro pilar: é o estímulo que diz ao corpo
  para manter o músculo. A OMS recomenda força pelo menos 2 dias por
  semana e 150 minutos de atividade aeróbica moderada; o aviso sobre
  GLP-1 sugere chegar a 3 vezes por semana. Quem tem doença do coração,
  das articulações ou outra condição crônica começa no ritmo que pode e
  com orientação de quem acompanha. [OMS 2020; Mozaffarian et al., aviso
  conjunto 2025]
```

### D12 + D14 — `plato-e-reganho.md`, substituir "## Parar o tratamento"

```markdown
## Parar o tratamento
Nos estudos de retirada, parar levou a recuperar boa parte do peso:
- STEP 4: depois de 20 semanas de semaglutida, quem trocou para placebo
  ganhou 6,9% em 48 semanas. [Rubino et al., JAMA 2021]
- Extensão do STEP 1 (327 pessoas, que pararam o remédio e o
  acompanhamento de estilo de vida): cerca de dois terços do peso perdido
  voltaram em um ano; ainda assim, ficaram em média 5,6% abaixo do peso
  inicial. Pressão, glicose e outros exames também voltaram perto do
  ponto de partida. [Wilding et al., Diabetes Obes Metab 2022]
- SURMOUNT-4: depois de perder 20,9% em 36 semanas com tirzepatida, quem
  trocou para placebo ganhou 14% em 52 semanas, terminando 9,9% abaixo
  do peso inicial. [Aronne et al., JAMA 2024]

Isso não quer dizer que ninguém pode parar; quer dizer que a decisão de
parar, e como, é para conversar com quem acompanha. Quem tem diabetes
precisa combinar também o que muda no controle da glicose.
```

### D15 — `adesao-e-vida-real.md`, substituir a última frase de "## Estudo clínico e vida real são diferentes"

```markdown
Os três estudos de Talay et al. são de autores ligados à empresa que
opera os programas digitais estudados; no estudo francês de Tournayre et
al., há autores com financiamento da Novo Nordisk e da Eli Lilly e um
acionista da plataforma digital estudada.
```

### D15 + D16 — `adesao-e-vida-real.md`, substituir "Engajamento e persistência" e "Seguir a titulação"

```markdown
- **Engajamento e persistência.** Na França, 191 adultos com obesidade
  grave (IMC 40 ou mais) começando semaglutida foram acompanhados por 48
  semanas. Seguiram no tratamento 59,5% de quem não usou a plataforma
  digital de questionários, 71,9% de quem usou em parte e 79,5% de quem
  completou. Cerca de 69% da ligação entre engajamento e perda de peso
  passou pela persistência. [Tournayre et al., J Med Internet Res 2026]
- **Seguir a titulação.** No estudo dos 393 pacientes, só 5 (1%)
  seguiram o esquema aprovado de subida de dose; esses 5 perderam em
  média 12,5% em 12 meses, contra 7,2% dos demais. É um grupo pequeno
  demais para conclusão firme, e não é motivo para subir a dose por
  conta própria: ajustar a dose é decisão de quem prescreve. [Baalmann
  et al., J Manag Care Spec Pharm 2026]
```

### D17 — `adesao-e-vida-real.md`, substituir o item de Armanious

```markdown
- Numa análise de 60 avaliações públicas de pessoas que usaram Ozempic
  fora da bula para perder peso, queixas gastrointestinais apareceram em
  62%, mas não mudaram de forma significativa a satisfação nem a decisão
  de continuar; o que mais pesou foi não ver resultado e ter efeitos
  colaterais que não eram do intestino. É uma amostra pequena e
  autosselecionada. [Armanious et al., J Med Internet Res 2026]
```

### D18 — `adesao-e-vida-real.md`, primeiro item de "## Quantos seguem" (versão segura enquanto o ano não for confirmado)

```markdown
- Nos EUA, entre 4.066 adultos sem diabetes que começaram um GLP-1 para
  obesidade (dados de convênio), 32,3% seguiam no tratamento um ano
  depois, e 27,2% tinham tomado o remédio de forma regular. [Prime
  Therapeutics, pôster AMCP 2024]
```

### D19 — `adesao-e-vida-real.md`, substituir "## O contexto"

```markdown
## O contexto
A OMS publicou em dezembro de 2025 sua primeira diretriz sobre GLP-1 na
obesidade: recomendação condicional para adultos com IMC 30 ou mais,
fora da gravidez, como tratamento de longo prazo e parte de um cuidado
mais amplo, com alimentação, atividade física e acompanhamento
profissional. A recomendação é condicional por causa da segurança de
longo prazo ainda em estudo, do custo e do acesso. [OMS, diretriz 2025]
```

---

## 5. Fora do escopo, mas encontrado (para quem cuida do app)

- `src/logic/derive.ts:2363`: a meta de água é 35/30/25 mL × **peso real**, sem teto. Em obesidade, ela passa com folga da ingestão adequada da EFSA (2,0/2,5 L/dia, contando a água da comida), e a base inteira manda a IA "usar a meta do app". O mais cauteloso: teto (por exemplo, peso ajustado ou limite absoluto) e uma pergunta ou aviso no cadastro sobre restrição de líquido. Decisão clínica e de produto; não mexi.
- `src/logic/derive.ts:2339`: a proteína é 1,2 g/kg do **peso real**. Em 150 kg isso dá 180 g, acima da faixa de 80–120 g/dia do aviso conjunto, que diz não haver consenso sobre qual peso usar; o resumo brasileiro (F18, secundário) fala em peso ajustado. Não há ajuste para DRC.
- `hidratacao.md` (outro grupo) também não tem ressalva de restrição hídrica.
