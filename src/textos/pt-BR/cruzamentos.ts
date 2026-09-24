/* ============================================================
   OS CRUZAMENTOS — o que os registros dela dizem quando se cruzam

   Cada um destes achados é uma conta feita sobre os registros de UMA
   pessoa. Nenhum deles é conteúdo geral: se a conta não bate o limiar, o
   achado não existe, e a tela fica sem ele. Por isso quase toda frase
   aqui tem número dentro — o número é o que separa descoberta de dica.

   ⚠️ QUEM FOR TRADUZIR, A REGRA DO ARQUIVO INTEIRO: nenhuma destas frases
   pode virar conselho. "Água ajuda com saciedade" é informação; "beba mais
   água" é ordem, e ordem baseada em estatística de treze registros é o
   pior dos dois mundos. Os verbos foram escolhidos um a um.

   ⚠️ E O SUJEITO É O FENÔMENO, NÃO A PESSOA. "A sua hidratação cai aos
   domingos", e não "você bebe menos aos domingos" — é o mesmo fato com o
   dedo apontado. Vale para o arquivo todo.

   ⚠️ CADA ACHADO TEM ATÉ QUATRO MOVIMENTOS, e eles não são intercambiáveis:

     · `titulo`    — a manchete, que é o achado em uma linha
     · `texto`     — os números que sustentam a manchete
     · `porque`    — o mecanismo, só nos achados de maior surpresa
     · `significa` — o "e daí?", que é o que a pessoa perguntaria depois

   Traduzir `significa` como se fosse resumo do `texto` desfaz o cartão:
   ele existe para dizer uma coisa que os números NÃO dizem.
   ============================================================ */

export const cruzamentos = {
  /* ---------- os rótulos de categoria ---------- */
  catAlimentacao: 'Alimentação',
  catSono: 'Sono',
  catSintomas: 'Sintomas',
  catPeso: 'Peso',
  catAplicacoes: 'Aplicações',

  /* ---------- os dias da semana, como eles entram na frase ---------- */
  /* ⚠️ VÊM COM PREPOSIÇÃO, e não soltos. "A sua hidratação cai domingo"
     está errado em português, e concatenar "aos" fora daqui obrigaria a
     tabela a ter gênero — sábado e domingo levam "aos", os outros cinco
     levam "às". Em inglês os sete viram "on Sundays" e a preposição é a
     mesma; a lista continua sendo o lugar certo. */
  nomesDia: ['aos domingos', 'às segundas', 'às terças', 'às quartas', 'às quintas', 'às sextas', 'aos sábados'],

  /* ---------- 1. o fim de semana como outro tratamento ---------- */
  /* ⚠️ "OUTRO TRATAMENTO", E NÃO "O SEU PIOR MOMENTO". O achado cruza três
     variáveis, e duas delas melhoram no fim de semana (o sono sobe). A
     manchete nomeia a diferença sem dizer qual lado é o errado. */
  fimDeSemana: {
    titulo: 'Seu fim de semana funciona como outro tratamento',
    texto: (copos: string, proteina: string, sono: string) =>
      `Sábado e domingo você bebe ${copos} copos a menos${proteina}${sono}`,
    /* Trecho opcional: entra só quando a diferença de proteína é grande o
       bastante — o limiar e o porquê dele estão em logic/derive. */
    textoProteina: (gramas: number) => ` e come ${gramas} g menos de proteína`,
    /* ⚠️ O SONO É A BOA NOTÍCIA DENTRO DA MÁ, e por isso ele fecha a frase:
       "o descanso melhora; a rotina é que se solta" é o achado inteiro
       resumido, e é o que impede o cartão de virar bronca. */
    textoSono: (horas: string) => ` — mas dorme ${horas} h a mais. O descanso melhora; a rotina é que se solta.`,
    textoSemSono: '.',
    q: 'Como cuidar melhor do fim de semana?',
    evid: (copos: string) => ({ valor: `−${copos}`, unidade: 'copos', legenda: 'no sábado e no domingo' }),
    porque: 'A rotina da semana carrega sua hidratação e suas refeições sem que você precise pensar nelas: horários fixos, garrafa na mesa, almoço na mesma hora. No sábado essa estrutura some, e o que sobra é decidir tudo na hora — que é exatamente quando a decisão fica mais difícil.',
    /* ⚠️ "NÃO PRECISA DE DISCIPLINA NOVA" é a frase inteira. Quem lê isto
       já sabe que o fim de semana é mais difícil; o que ela não sabe é que
       o problema é estrutural e não de vontade. */
    significa: 'Dois dias por semana o tratamento fica com um pé fora, e são justamente os dias em que você tem mais tempo. Não precisa de disciplina nova — precisa que o fim de semana tenha uma rotina própria, não a ausência da rotina da semana.',
  },

  /* ---------- 2. o dia fraco de hidratação ---------- */
  aguaDia: {
    /* ⚠️ O SUJEITO É A HIDRATAÇÃO, E ERA A PESSOA. "Você bebe bem menos
       água aos domingos" é o mesmo fato com o dedo apontado — e era o
       único dos cinco achados com essa forma: os outros quatro dizem "a
       balança subiu", "sua proteína caiu", "seu ritmo é de". */
    titulo: (dia: string) => `A sua hidratação cai ${dia}`,
    texto: (pior: string, outros: string) =>
      `Cerca de ${pior} copos, contra ${outros} nos outros dias. Água ajuda com saciedade e com o enjoo — e é o dia em que os dois costumam pesar mais.`,
    q: 'Como está minha água?',
    evid: (pior: string, outros: string) =>
      ({ valor: pior, unidade: `de ${outros} copos`, legenda: 'a média nesse dia da semana' }),
    /* O valor do achado é que o problema tem endereço: um dia fixo se
       resolve com um lembrete, e vigiar a hidratação todo dia não. */
    significa: 'Um dia da semana puxa sua média para baixo sozinho. Como é sempre o mesmo, dá para resolver com um lembrete só, em vez de vigiar a hidratação todos os dias.',
  },

  /* ---------- 3. proteína de hoje contra fome de amanhã ---------- */
  /* ⚠️ O ACHADO É O ATRASO DE UM DIA, e não a proteína. A relação some no
     gráfico diário porque a pessoa vê a fome de hoje ao lado do prato de
     hoje, nunca do de ontem — e é isso que o cartão devolve para ela. */
  proteinaFome: {
    titulo: 'Nos dias em que você bate a proteína, o dia seguinte é mais fácil',
    texto: (meta: number, comMeta: string, semMeta: string) =>
      `Depois de chegar aos ${meta} g, sua fome no dia seguinte ficou em ${comMeta}. Quando não chegou, ${semMeta}. O efeito não aparece no mesmo dia — por isso é difícil notar sozinha.`,
    q: 'Como está minha proteína?',
    evid: (diferenca: string) =>
      ({ valor: `−${diferenca}`, unidade: 'de fome', legenda: 'no dia seguinte a bater a meta' }),
    porque: 'A proteína age na saciedade por um caminho mais lento que o do açúcar: ela demora a esvaziar do estômago e sustenta os sinais de saciedade por muitas horas. Por isso o efeito atravessa a noite e reaparece no apetite da manhã seguinte.',
    /* ⚠️ "NÃO É SÓ CUMPRIR TABELA" é o que tira a meta de proteína do
       lugar de obrigação e a põe no de troca — e a última frase dá o uso
       prático sem mandar fazer nada. */
    significa: 'Bater a meta de proteína não é só cumprir tabela: é comprar um dia seguinte mais tranquilo. Quando a fome apertar, o que resolve não é o que você come naquela hora — é o que você comeu ontem.',
  },

  /* ---------- 4. sono contra fome do dia seguinte ---------- */
  sonoFome: {
    titulo: 'Dormir mais de sete horas segura sua fome no dia seguinte',
    texto: (comSono: string, semSono: string) =>
      `Depois de noites completas sua fome ficou em ${comSono}; depois de noites curtas, ${semSono}. Seu apetite responde ao sono da véspera tanto quanto ao que você comeu.`,
    q: 'O que registrar antes de dormir?',
    evid: { valor: '7h', unidade: '+', legenda: 'o ponto em que sua fome muda' },
    /* ⚠️ "NÃO É FALTA DE DISCIPLINA" é o miolo, e não amenização. Quem
       dormiu mal e comeu mais no dia seguinte costuma se culpar por isso;
       o mecanismo hormonal é o fato que desfaz a culpa. */
    porque: 'Dormir pouco mexe nos dois hormônios que regulam apetite: sobe o que dá fome e cai o que avisa que já deu. Não é falta de disciplina no dia seguinte — é o corpo pedindo energia rápida para compensar o que faltou de descanso.',
    significa: 'Sono não costuma entrar na conta de quem está tratando o peso, mas nos seus dados ele mexe no apetite como poucas coisas. Uma noite protegida pode valer mais para o dia seguinte do que qualquer ajuste no prato.',
  },

  /* ---------- 5. sono contra enjoo do dia seguinte ---------- */
  /* ⚠️ ESTE É O ÚNICO ACHADO QUE LIGA HÁBITO A SINTOMA CLÍNICO, e por isso
     o `significa` dele é o mais cuidadoso do arquivo: ele DESFAZ a leitura
     de causa que o título convida a fazer. Errar aqui não custa um
     conselho ruim sobre água — custa fazer alguém concluir que o enjoo
     dela é culpa de ter dormido mal. */
  sonoEnjoo: {
    titulo: 'Depois das noites longas, o seu enjoo tem sido menor',
    texto: (horas: number, comSono: string, semSono: string) =>
      `Nos dias seguintes a dormir ${horas}h ou mais, seu enjoo ficou em ${comSono}. Depois das noites curtas, ${semSono} — numa escala de 5.`,
    q: 'Por que sinto enjoo?',
    evid: (comSono: string, semSono: string, noites: number) =>
      ({ valor: comSono, unidade: `de ${semSono}`, legenda: `o enjoo depois de ${noites} noites longas` }),
    significa: 'Isto é o que os seus registros mostram, e não uma relação de causa: o ciclo da aplicação mexe no enjoo mais do que qualquer outra coisa, e ele pode estar por trás dos dois lados da conta. Vale como pista para levar à sua equipe, não como explicação fechada.',
  },

  /* ---------- 6. a janela do enjoo ---------- */
  /* O achado não é que existe enjoo — é que ele tem hora para acabar. */
  janelaEnjoo: {
    titulo: 'Seu enjoo costuma sumir cerca de 48 horas depois da aplicação',
    texto: (perto: string, longe: string) =>
      `Ele fica em ${perto} nos dois primeiros dias e cai para ${longe} a partir do terceiro. Não é o tratamento inteiro que enjoa — são as primeiras 48 h de cada ciclo.`,
    q: 'Por que sinto enjoo?',
    evid: { valor: '48', unidade: 'horas', legenda: 'e então ele passa' },
    /* ⚠️ A ÚLTIMA FRASE É A ÚNICA DO ARQUIVO QUE SUGERE UMA AÇÃO, e ela
       pode: escolher o dia da aplicação é decisão da pessoa com a equipe,
       não mudança de dose nem de medicação. */
    significa: (dias: number) =>
      `Isso se repetiu em ${dias} dos seus registros pós-aplicação. Saber que existe uma janela, e que ela acaba, muda o que fazer com ela: dá para escolher o dia da aplicação de forma que essas 48 h caiam no seu período mais leve da semana.`,
  },

  /* ---------- 7. água contra enjoo ---------- */
  aguaEnjoo: {
    titulo: 'Nos dias em que você bebe bem, o enjoo é menor',
    /* ⚠️ "NÃO PROVA CAUSA" ESTÁ DENTRO DA FRASE, e não num rodapé. O
       cartão inteiro é uma correlação de treze dias; a ressalva tem de
       chegar junto do número, porque é lá que ela é lida. */
    texto: (corte: string, comAgua: string, semAgua: string) =>
      `Com ${corte} ou mais, seu enjoo médio foi ${comAgua}. Abaixo disso, ${semAgua}. Não prova causa — mas é a variável mais fácil de mexer que aparece ligada ao sintoma.`,
    q: 'Como diminuir o enjoo?',
    evid: (diferenca: string) =>
      ({ valor: `−${diferenca}`, unidade: 'de enjoo', legenda: 'nos dias bem hidratados' }),
    significa: 'De tudo o que aparece ligado ao seu enjoo, a água é o que está mais na sua mão. Não substitui conversar com a equipe se ele apertar, mas é a primeira coisa que vale testar antes.',
  },

  /* ---------- 8. o platô que não impediu nada ---------- */
  /* ⚠️ ESTE É O ACHADO QUE EVITA ABANDONO, e é por isso que ele existe. A
     semana em que a balança sobe é a semana em que as pessoas param — e o
     cartão mostra, com os números dela, que isso já aconteceu antes e não
     significou o que parecia significar. */
  platoQueNaoImpediu: {
    titulo: (altas: number, perdido: string) =>
      `A balança subiu ${altas} vezes e você perdeu ${perdido} mesmo assim`,
    texto: (pesagens: number, altas: number) =>
      `Em ${pesagens} pesagens, ${altas} vieram acima da anterior — e a linha do período continua descendo. Semana de alta não é recaída: é ruído de água e intestino dentro de uma tendência.`,
    q: 'Como está minha evolução?',
    evid: (altas: number, perdido: string) =>
      ({ valor: String(altas), unidade: 'altas', legenda: `dentro de −${perdido} no período` }),
    porque: 'O peso do dia é gordura, mas também é água, sal, intestino e o ciclo hormonal — variações de um a dois quilos acontecem sem que nada tenha mudado na gordura corporal. A gordura sai devagar e em linha; o resto oscila por cima dela e é o que a balança mostra primeiro.',
    significa: 'Isso importa mais do que parece: a semana em que a balança sobe é a semana em que as pessoas costumam desistir. Nos seus próprios números, ela nunca significou o que parecia significar.',
  },

  /* ---------- 9. a proteína ao longo do tratamento ---------- */
  /* As duas metades da frase mudam de direção juntas, e a versão que cai
     NÃO cobra: "vale retomar antes que vire o novo normal" é o mais perto
     de pedido que este arquivo chega, e é sobre um hábito, não sobre a
     pessoa. */
  proteinaTendencia: {
    titulo: (subiu: boolean, pct: number) =>
      `Sua proteína ${subiu ? 'subiu' : 'caiu'} ${pct}% desde o começo`,
    textoSubiu: (depois: number, antes: number) =>
      `Média de ${depois} g/dia nas últimas semanas, contra ${antes} g no início. Proteína preserva massa magra durante a perda de peso.`,
    textoCaiu: (depois: number, antes: number) =>
      `Média de ${depois} g/dia nas últimas semanas, contra ${antes} g antes. Vale retomar — massa magra sustenta o metabolismo.`,
    q: 'Como está minha proteína?',
    evid: (pct: number, antes: number, depois: number) =>
      ({ valor: `${pct > 0 ? '+' : ''}${pct}%`, unidade: '', legenda: `${antes} → ${depois} g por dia` }),
    significaSubiu: 'Subiu sem que você anunciasse nenhuma mudança, o que costuma ser o tipo de hábito que fica. Proteína é o que protege sua massa magra enquanto o peso cai — sem ela, parte do que some não é gordura.',
    significaCaiu: 'A queda foi gradual, do tipo que não se percebe de um dia para o outro. Proteína é o que protege sua massa magra enquanto o peso cai; vale retomar antes que vire o novo normal.',
  },

  /* ============================================================
     OS DOIS RETRATOS, NO FIM DA FILA

     ⚠️ ESTES DOIS DESCREVEM UM NÚMERO QUE A PESSOA JÁ VÊ NA HOME, e por
     isso não são descoberta: são retrato. Ficam por último de propósito.

     O motivo de estarem marcados assim está em logic/derive — eram os
     únicos sem condição em volta, e abriam a aba, para quem tinha acabado
     de instalar, com "Você manteve 0% das aplicações em dia".
     ============================================================ */

  /* ---------- 10. o ritmo ---------- */
  ritmo: {
    /* ⚠️ A UNIDADE VEM DE FORA, e não está escrita aqui: em imperial o
       ritmo é em libra por semana. O título dizia "kg" em cima de um
       número que a linha seguinte do mesmo cartão já escrevia em libra —
       duas unidades numa leitura só.

       ⚠️ A FAIXA QUE DÁ O VEREDITO FICA EM QUILO, em logic/derive: 0,5 a
       1,5 kg por semana é marca clínica, e um limiar próprio por sistema
       faria a mesma pessoa receber vereditos diferentes conforme uma
       preferência de EXIBIÇÃO. Mesma regra dos degraus das conquistas. */
    titulo: (ritmo: string, unidade: string) => `Seu ritmo é de ${ritmo} ${unidade} por semana`,
    textoBom: (perdido: string, semanas: number) =>
      `${perdido} em ${semanas} semanas, dentro do esperado para a sua fase.`,
    /* ⚠️ A VERSÃO FORA DO ESPERADO NÃO DIAGNOSTICA E NÃO ALARMA: ela
       encaminha. Ritmo rápido demais ou lento demais é conversa de
       consulta, e o cartão para exatamente aí. */
    textoAtencao: (perdido: string, semanas: number) =>
      `${perdido} em ${semanas} semanas. Vale comentar o ritmo com sua equipe na próxima consulta.`,
    q: 'Como está minha evolução?',
    evid: (ritmo: string, unidade: string, perdido: string, semanas: number) =>
      ({ valor: ritmo, unidade: `${unidade}/sem`, legenda: `${perdido} em ${semanas} semanas` }),
    significaBom: 'É um ritmo sustentável, e sustentável é o que importa: perdas rápidas demais costumam levar massa magra junto e voltar depois. O seu está no intervalo que a literatura associa a resultado que se mantém.',
    /* ⚠️ "NÃO COMIGO" — é a única linha do aplicativo que diz, em
       primeira pessoa, o que ele NÃO faz. Ela existe porque a alternativa
       era opinar sobre um ritmo que pode ter causa clínica. */
    significaAtencao: 'Ritmo é uma conversa para ter com sua equipe, não comigo. Levo o número organizado para a consulta se você quiser.',
  },

  /* ---------- 11. a adesão ---------- */
  adesao: {
    tituloPerfeita: 'Você não atrasou nenhuma aplicação desde o começo',
    titulo: (pct: number) => `Você manteve ${pct}% das aplicações em dia`,
    texto: (aplicacoes: number, ressalva: string) =>
      `São ${aplicacoes} aplicações desde o início do tratamento, ${ressalva}.`,
    textoQuaseTodas: 'praticamente todas na data certa',
    textoComAtrasos: 'com alguns atrasos pelo caminho',
    q: 'Como funciona o ciclo da medicação?',
    evid: (pct: number, aplicacoes: number) =>
      ({ valor: `${pct}%`, unidade: '', legenda: `${aplicacoes} aplicações desde o início` }),
    significaAlta: 'Essa consistência é um dos fatores que mais pesam numa boa resposta ao medicamento. O nível da substância no corpo depende de regularidade, não de esforço — e é o tipo de coisa que só aparece quando alguém olha o histórico inteiro.',
    /* ⚠️ A VERSÃO COM ATRASOS EXPLICA O CUSTO E NÃO COBRA A FALTA. "Cada
       atraso deixa uma janela em que o efeito cai antes da hora" é o
       mecanismo; "tente não atrasar" seria a bronca que esta tela não dá. */
    significaBaixa: 'A regularidade pesa mais do que a dose exata do dia: cada atraso deixa uma janela em que o efeito cai antes da hora, e é nela que a fome costuma voltar mais forte.',
  },
};
