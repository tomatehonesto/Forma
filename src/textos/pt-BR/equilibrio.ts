/* ============================================================
   O EQUILÍBRIO — a leitura do radar, em duas frases

   O radar mostra oito eixos e não conclui nada. Quem teria de concluir é
   a pessoa, que não sabe se 62% em proteína é bom — então quem conclui é
   esta frase, e o gráfico vira ilustração dela.

   ⚠️ ELA FALA EM PRIMEIRA PESSOA, E ABRE CONVERSA. "Seu equilíbrio está
   consistente" é laudo, e quem escreve laudo é sistema. "Uma coisa me
   chamou atenção" é alguém que olhou os dados e resolveu comentar — que é
   exatamente o que a tela promete. As três aberturas são três graus da
   mesma voz, e nenhuma delas dá nota.

   ⚠️ E A LEITURA NUNCA MANDA FAZER NADA. A versão mais grave diz "seria
   meu foco para a próxima semana" — condicional, primeira pessoa, uma
   sugestão de onde olhar. "Você precisa melhorar X" seria outra tela.
   ============================================================ */

/* ⚠️⚠️ SOZINHO, O EIXO PEDE ARTIGO. O par da abertura pode ir sem ele,
   no estilo de manchete ("Sono e adesão estão consistentes"), mas o eixo
   isolado não: "Exercício é o que mais oscila" e "nem exercício ficou
   para trás" pedem "o exercício". E o botão fala como quem pergunta —
   "Como melhorar exercício" era título de artigo; é "minha atividade
   física". As cinco irmãs já tinham a mesma tabela. */
const EIXO: Record<string, { o: string; meu: string }> = {
  Sono: { o: 'o sono', meu: 'meu sono' },
  Energia: { o: 'a energia', meu: 'minha energia' },
  Humor: { o: 'o humor', meu: 'meu humor' },
  Hidratação: { o: 'a hidratação', meu: 'minha hidratação' },
  Exercício: { o: 'o exercício', meu: 'minha atividade física' },
  Proteína: { o: 'a proteína', meu: 'meu consumo de proteína' },
  Saciedade: { o: 'a saciedade', meu: 'minha saciedade' },
  Adesão: { o: 'a adesão', meu: 'minha adesão' },
};
const o = (eixo: string) => EIXO[eixo]?.o ?? eixo.toLowerCase();
const meu = (eixo: string) => EIXO[eixo]?.meu ?? eixo.toLowerCase();
const maiusc = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

export const equilibrio = {
  /* ============================================================
     OS OITO EIXOS

     ⚠️ O NOME DO EIXO ERA A CHAVE DELE. `radar()` devolvia `{k: 'Sono'}`,
     a tabela de séries era indexada por 'Sono', e a tela mandava o mesmo
     'Sono' de volta para pedir o gráfico — traduzir a palavra quebrava a
     busca. Agora a chave é `id` ('sono') e o rótulo vem daqui.

     ⚠️ E "SACIEDADE" NÃO É O NOME DA COLUNA. A pessoa responde FOME no
     check-in, e o eixo mostra o contrário dela: quanto mais fome, menos
     saciedade. O nome do eixo é o do lado bom, porque num gráfico em que
     tudo cresce para fora o eixo tem de crescer junto. Ver logic/escalas.
     ============================================================ */
  eixos: {
    sono: 'Sono',
    energia: 'Energia',
    humor: 'Humor',
    hidratacao: 'Hidratação',
    exercicio: 'Exercício',
    proteina: 'Proteína',
    saciedade: 'Saciedade',
    adesao: 'Adesão',
  },

  /* ============================================================
     AS TRÊS ABERTURAS

     A escolha é pela AMPLITUDE entre o melhor e o pior eixo: é ela que
     diz se o tratamento está equilibrado ou apoiado numa perna só. Até
     30, até 55, e acima disso.
     ============================================================ */
  aberturaTudoBem: 'Reparei numa coisa boa.',
  aberturaAtencao: 'Uma coisa me chamou atenção.',
  aberturaPreciso: 'Tenho uma coisa para te mostrar.',

  /* ============================================================
     O CORPO — duas frases, e não quatro

     O gráfico ao lado mostra a variação que o texto antes precisava
     descrever. Descrever e desenhar a mesma coisa é gastar o dobro do
     espaço para dizer uma vez.
     ============================================================ */

  /* ⚠️⚠️ ESTE PAR É UMA ARMADILHA DE TRADUÇÃO, e é o motivo de ele ser uma
     função e não uma concatenação lá fora.

     Em português os dois nomes abrem a oração sozinhos e o SEGUNDO vai em
     minúscula: "Sono e adesão puxam para cima". Sem o `seu` na frente, de
     propósito — "seu sono e adesão" concorda errado, e consertar com "seu
     sono e sua adesão" trava a frase.

     Em alemão substantivo não desce para minúscula; em inglês o "and" não
     pede vírgula aqui. Quem traduzir muda ESTA função, e não o resto. */
  par: (primeiro: string, segundo: string) => `${primeiro} e ${segundo.toLowerCase()}`,

  corpoEquilibrado: (doisFortes: string, fraco: string) =>
    `${doisFortes} puxam para cima, e nem ${o(fraco)} ficou para trás. Eu não mudaria nada por enquanto.`,
  corpoUmAtras: (doisFortes: string, fraco: string) =>
    `${doisFortes} estão consistentes. ${maiusc(o(fraco))} é o que mais oscila — seria meu foco para a próxima semana.`,

  /* ============================================================
     O BOTÃO E A PERGUNTA — a mesma frase, e é de propósito

     ⚠️ O BOTÃO LEVA A PERGUNTA PARA O COMPANION. Se o texto do botão e a
     pergunta enviada divergirem, a pessoa toca numa coisa e recebe
     resposta de outra — e isso já quase aconteceu: o botão era montado na
     tela, com o mesmo `toLowerCase()` escrito de novo, e a pergunta aqui.
     Duas cópias da mesma frase, uma delas com ponto de interrogação.
     ============================================================ */
  botaoMelhorar: (eixo: string) => `Como melhorar ${meu(eixo)}`,
  perguntaMelhorar: (eixo: string) => `Como melhorar ${meu(eixo)}?`,

  /* O chapéu do gráfico de barras: o eixo em caixa alta e quantos dias a
     série cobre. Em caixa alta pela tipografia da tela — e é aqui porque
     `toUpperCase()` também é operação de idioma. */
  serieDe: (eixo: string, dias: number) => `${eixo.toUpperCase()} · ÚLTIMOS ${dias} DIAS`,
};
