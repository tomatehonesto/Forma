# Auditoria da base de conhecimento contra bulas e diretrizes (01/10/2026)

A base da Morphi Intelligence (`servidor/conhecimento/*.md`) foi escrita a
partir das bulas da FDA. Esta auditoria conferiu cada afirmação contra as
bulas da FDA, da EMA (uma bula para toda a União Europeia) e da ANVISA, e
contra diretrizes e os estudos citados, em quatro grupos. Os relatórios
completos, com as fontes abertas, a tabela de achados e o texto proposto
para colar, estão em `auditoria-2026-10-01/`.

Não é revisão médica: é conferência de fonte. A revisão por profissional
de saúde continua pendente (PENDENCIAS).

## A regra que guiou a auditoria

A IA é um **consultor global**. A orientação clínica é uma só para todo
mundo; quando as fontes divergem, **vale a mais cautelosa**. O país só
entra no que é fato local: o produto vendido ali (tipo de caneta, prazo
fora da geladeira), os nomes comerciais e os números de emergência.

## Os achados, por gravidade

### Errado na base (corrigir antes de tudo)
- **Gravidez planejada com tirzepatida.** `tirzepatida.md` diz que a regra
  de parar antes "não vale para a tirzepatida"; EMA e ANVISA mandam parar
  pelo menos 1 mês antes. O mesmo erro está em `sinais-de-alerta.md`.
  (grupo B, confirmado também pelo C)
- **Hipoglicemia toda mandada ao pronto atendimento.** A leve se trata
  primeiro com açúcar rápido (regra dos 15 g); só a grave é emergência.
  Com a regra do prompt de abrir pelo encaminhamento, a resposta atrasa o
  açúcar. A bula de Zepbound registra hipoglicemia também em quem não tem
  diabetes. (grupos C e D)
- **Prazos fora da geladeira são do produto americano.** Wegovy no Brasil
  é caneta de várias doses (6 semanas após o primeiro uso); Ozempic 56
  dias só nos EUA; KwikPen de tirzepatida, 30 dias. Viram fato local.
  (grupos A e B)
- **"Água com gás conta"** contraria os consensos para quem tem enjoo ou
  azia. (grupo C)

### Faltando, e é de segurança
- **Gravidez com semaglutida** (a lacuna conhecida): parar ao descobrir,
  parar pelo menos 2 meses antes de tentar, falar com quem prescreve; quem
  usa para diabetes precisa que o médico troque o tratamento. (grupo A)
- **Amamentação**, em todos os remédios; a ANVISA contraindica a
  liraglutida. (grupos A e B)
- **Perda súbita de visão (NAION)** com semaglutida: EMA e ANVISA pedem
  contato imediato. (grupo C)
- **Obstrução intestinal**: nas cinco bulas da FDA; barriga inchada,
  vômito e sem gases é urgência, não "falar com a equipe". (grupo C)
- **Dose a mais por engano**: contato imediato com o centro de
  toxicologia (número por país). (grupo C)
- **Água e soro para quem precisa limitar líquido** (insuficiência
  cardíaca, doença renal, diálise), e avisar no mesmo dia quem acompanha
  quando há vômito ou diarreia e a pessoa usa diurético ou remédio de
  pressão. (grupos C e D)
- **Proteína**: teto (não ficar em 2 g/kg ou mais por muito tempo) e a
  ressalva da doença renal crônica. (grupo D)
- **Interações**: levotiroxina e varfarina com semaglutida oral; a
  liraglutida não substitui insulina. (grupos A e B)
- **Anticoncepcional**: dizer que métodos não orais não são afetados pela
  tirzepatida, e que semaglutida e liraglutida não têm essa regra.
  (grupos A e B)

### Diverge entre agências (aplicada a mais cautelosa)
- Trocar o dia da injeção semanal: FDA 48 h, EMA e ANVISA 72 h → 72 h.
- Dose esquecida da liraglutida: janela de 12 h (EMA, ANVISA); mais de 3
  dias sem aplicar, recomeçar em 0,6 mg (vale para todos).
- Regra de parada do Saxenda: FDA < 4% em 16 semanas; EMA e ANVISA < 5%
  após 12 semanas na dose cheia.
- Dose de 7,2 mg de Wegovy: EMA e ANVISA restringem (IMC ≥ 30 no início,
  voltar para 2,4 mg sem ganho).
- O nome do comprimido não diz a formulação: o que identifica são os mg.

### Precisão e contexto
- Massa magra "39%" sem dizer que massa magra não é só músculo.
- Estudo de titulação citado com 5 pacientes: não sustenta incentivar a
  subida de dose.
- Reganho: os números conferem; falta o saldo final abaixo do peso
  inicial.
- Liraglutida não é "de ação curta"; é de uso diário.

## Fora da base: o aplicativo

- **A meta de água** (`src/logic/derive.ts`, `agua`) é 35 mL por kg do
  peso real, sem teto: 130 kg dá cerca de 4,6 L por dia, perto do dobro da
  ingestão adequada da EFSA. Precisa de teto e de ressalva para quem
  limita líquido.
- **A meta de proteína** usa 1,2 g/kg do peso real, sem ajuste para
  doença renal.
- **O número de crise** está escrito só para o Brasil (CVV 188); fora
  dele, "o serviço de emergência local". Pela decisão de consultor
  global, vai uma tabela por país no código.

## Fontes que não abriram

O bulário da ANVISA (bloqueio anti-robô; as bulas brasileiras vieram das
cópias oficiais dos fabricantes), a bula brasileira do Mounjaro KwikPen,
os ADA Standards 2026 e alguns artigos (NEJM). Cada relatório diz o que
abriu de fato.
