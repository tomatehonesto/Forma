# v1: sintoma pede o que fazer agora, pedido arriscado recebe "não", e a jornada inteira quando a pergunta é sobre o progresso

A linha de base (61%, críticos 8/14) mostrou a IA segura, mas econômica
demais: "Curto: duas a quatro frases" e "use um dado só quando explica"
a deixavam sem medidas práticas nos sintomas (sintoma 4/14), com sinais
de alerta genéricos, um "é com quem prescreve" no lugar de um não, e
pouco cruzamento de dados nos platôs.

Mudanças no prompt (servidor/conversa/prompt.ts):
- tamanho proporcional, e não "curto" sempre;
- sintoma: de duas a quatro medidas sem remédio e os sinais próprios daquele sintoma;
- pedido arriscado: "não" na primeira frase;
- pergunta sobre o próprio progresso: a jornada inteira, sem minimizar um platô;
- registro contradiz a pessoa: usar o registro, com gentileza;
- tratamento de outra pessoa: só orientação geral.

Na base (rascunho, para a revisão clínica): medidas-sem-remedio (por
sintoma, com hipoglicemia) e armazenamento-e-viagem (prazos das bulas FDA).
