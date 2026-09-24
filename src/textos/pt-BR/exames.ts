/* ============================================================
   A LEITURA DOS EXAMES — o resumo da coleta e a leitura de um marcador

   O que os marcadores SÃO está em textos/pt-BR/marcadores. Aqui está o
   que se diz sobre os números de quem abriu a tela.

   ⚠️⚠️ NADA AQUI OPINA, TUDO AQUI CONTA. Quantos ficaram fora da
   referência, quanto o valor andou, para que lado. É aritmética dita em
   frase — e é assim de propósito: a versão anterior era um parágrafo
   escrito à mão com os números de UMA pessoa, e afirmava "seus marcadores
   melhoraram" para quem tinha piorado.

   ⚠️ E O RUMO SÓ APARECE QUANDO O MARCADOR DECLARA QUAL LADO É O BOM.
   Creatinina ou TSH subindo não é notícia boa nem ruim por si; chamar uma
   direção de melhora sem saber seria opinião. Sem isso a frase para no
   fato: "subiu 20".

   ⚠️ E TODA LEITURA TERMINA DEVOLVENDO O EXAME A QUEM ACOMPANHA A PESSOA.
   A última frase não é rodapé jurídico — é a verdade sobre o que um exame
   isolado pode dizer.
   ============================================================ */

export const exames = {
  /* ============================================================
     O RESUMO DA COLETA — a frase da capa
     ============================================================ */
  resumo: {
    /* Quatro versões do mesmo fato, e a diferença entre elas é só de
       quantos: nenhum, um, poucos o bastante para caber numa lista, ou
       muitos demais para listar. */
    todosDentro: (quantos: number) =>
      `Os ${quantos} marcadores desta coleta estão dentro da referência do laboratório.`,
    umFora: (total: number, qual: string) =>
      `Um dos ${total} marcadores desta coleta ficou fora da referência: ${qual}.`,
    algunsFora: (fora: number, total: number, quais: string) =>
      `${fora} dos ${total} marcadores desta coleta ficaram fora da referência: ${quais}.`,
    /* ⚠️ PASSANDO DE TRÊS, A CONTAGEM BASTA. O resumo mora numa capa de
       altura fixa, e oito nomes em sequência empurram o parágrafo para
       fora dela — e mesmo que coubesse, uma lista de oito no meio de uma
       frase não se lê, se conta. A lista dos que ficaram fora está logo
       abaixo, no bloco que existe para isso. */
    muitosFora: (fora: number, total: number) =>
      `${fora} dos ${total} marcadores desta coleta ficaram fora da referência.`,

    /* O trecho de data que abre a segunda frase, quando há histórico. Vem
       com a vírgula porque emenda na frase seguinte. */
    desde: (data: string) => ` Desde ${data},`,
    melhoraUm: (desde: string, qual: string, de: string, para: string, unidade: string) =>
      `${desde} um marcador caminhou na direção esperada, e a maior mudança foi em ${qual}: de ${de} para ${para} ${unidade}.`,
    melhoraVarios: (desde: string, quantos: number, qual: string, de: string, para: string, unidade: string) =>
      `${desde} ${quantos} marcadores caminharam na direção esperada, e a maior mudança foi em ${qual}: de ${de} para ${para} ${unidade}.`,

    /* ⚠️ A PIORA VEM NA MESMA FRASE E COM O MESMO PESO DA MELHORA. Um
       resumo que só conta o que melhorou é propaganda, e quem está lendo
       um exame de sangue precisa das duas metades. */
    pioraUm: (qual: string) => ` Um marcador foi na direção oposta: ${qual}.`,
    pioraPoucos: (quantos: number, quais: string) =>
      ` ${quantos} marcadores foram na direção oposta: ${quais}.`,
    pioraMuitos: (quantos: number) => ` ${quantos} marcadores foram na direção oposta.`,
  },

  /* ============================================================
     A LEITURA DE UM MARCADOR

     ⚠️ A MANCHETE É ESTADO + O QUE ESTÁ EM JOGO, e já foi estado + rumo.
     "Está na faixa, e vem caminhando na direção esperada" é correto e não
     acrescenta: o rumo é o que o cartão de evolução, três centímetros
     acima, já anuncia. O que nenhuma outra peça da tela diz é POR QUE este
     número importa — e um valor fora da faixa sem isso é um alarme sem
     assunto.

     ⚠️ E A MANCHETE NÃO DIZ O NOME DO MARCADOR. "Seu HbA1c" / "Sua
     ferritina" pediria uma tabela de gênero por marcador para escrever
     certo em português, e errar o artigo numa frase sobre a saúde de
     alguém é um tropeço barato de evitar. "Este resultado" é sempre
     correto, e o nome está na barra do topo.

     ⚠️ O `afeta` VEM DE textos/pt-BR/marcadores, e a moldura da frase é
     que segura a ressalva: "faz diferença para a saúde das artérias" fala
     do território; "vai entupir suas artérias" seria prognóstico.
     ============================================================ */
  leitura: {
    acima: 'acima',
    abaixo: 'abaixo',

    dentroSemAfeta: 'Este resultado está dentro da faixa de referência do laboratório.',
    foraSemAfeta: (lado: string) =>
      `Este resultado está ${lado} da faixa de referência do laboratório.`,
    dentroComAfeta: (afeta: string) =>
      `Este resultado está dentro da faixa de referência, o que é um bom sinal ${afeta}.`,
    foraComAfeta: (lado: string, afeta: string) =>
      `Este resultado está ${lado} da faixa de referência, o que faz diferença ${afeta}.`,

    /* A faixa que o laboratório escreveu, nas três formas em que ela
       aparece num laudo. */
    faixaEntre: (min: string, max: string, unidade: string) => `entre ${min} e ${max}${unidade}`,
    faixaAbaixoDe: (max: string, unidade: string) => `abaixo de ${max}${unidade}`,
    faixaAcimaDe: (min: string, unidade: string) => `acima de ${min}${unidade}`,

    /* ⚠️ O RUMO GANHOU A CONCLUSÃO QUE ESTAVA NA MANCHETE: não é só que
       subiu, é que subiu PARA ONDE. As quatro versões cobrem estar dentro
       ou fora da faixa, cruzado com ir para o lado bom ou o ruim. */
    rumoDentroBom: ', na direção esperada',
    rumoDentroRuim: ', na direção oposta à esperada',
    rumoForaBom: ', caminhando na direção da referência',
    rumoForaRuim: ', se afastando dela',
    subiu: 'subiu',
    caiu: 'caiu',
    andou: (data: string, verbo: string, quanto: string, unidade: string, rumo: string) =>
      ` Desde ${data} ele ${verbo} ${quanto}${unidade}${rumo}.`,

    /* ⚠️ ESTA É A ÚNICA FRASE DA TELA QUE OLHA PARA FORA DESTE MARCADOR.

       Um número fora da faixa lido sozinho vira o mundo inteiro de quem
       lê — e o que desarma isso não está no marcador, está no painel:
       saber que os outros catorze foram bem muda o tamanho deste um. É o
       mesmo serviço que um médico presta na primeira frase da consulta, e
       é factual: conta quantos, não opina sobre o conjunto. */
    painelTudoDentro: (total: number) =>
      ` Os ${total} marcadores deste exame estão dentro da referência.`,
    painelEsteNao: (total: number, fora: number, plural: boolean) =>
      ` Dos ${total} marcadores deste exame, ${fora} ${plural ? 'ficaram' : 'ficou'} fora da referência; este não.`,
    painelUnicoFora: (total: number) =>
      ` Dos ${total} marcadores deste exame, este é o único fora da referência.`,
    painelEsteEUmDeles: (total: number, fora: number) =>
      ` Dos ${total} marcadores deste exame, ${fora} estão fora da referência, e este é um deles.`,

    /* ⚠️ A ÚLTIMA FRASE NÃO SE TIRA. "Um exame sozinho não fecha nada" é o
       que impede a leitura inteira de virar diagnóstico, e "quem acompanha
       você" é verdade nos três modos — com equipe, com médico solto e sem
       ninguém. A versão anterior citava o nome da médica da semente para
       todo mundo, inclusive para quem não tem médico. */
    corpo: (data: string, valor: string, unidade: string, faixa: string, andou: string, painel: string) =>
      `Na coleta de ${data} o valor foi ${valor}${unidade}, e a referência do laboratório é ${faixa}.${andou}${painel} Um exame sozinho não fecha nada: quem junta ele com o resto da sua história é quem acompanha você.`,
  },

  /* ============================================================
     A TELA DOS EXAMES

     ⚠️ O VEREDITO VEM COM A PROVA. "Na referência" sozinho é uma
     afirmação que a pessoa não tem como conferir; "Na referência: abaixo
     de 5,7 %" é a mesma afirmação com o limite dentro dela. Foi por isso
     que os dois viraram um selo só — e por isso a faixa em palavras leva
     a unidade, que antes ficava subentendida pelo número logo acima.

     ⚠️ E SÃO DOIS NÚMEROS NA CAPA, E NÃO UM. "3 fora da referência"
     sozinho é um alarme sem denominador: três de quinze e três de quatro
     não são a mesma notícia.
     ============================================================ */
  tela: {
    titulo: 'Exames',
    linha: (quantos: number, ultimaColeta: string) =>
      `${quantos} ${quantos === 1 ? 'marcador' : 'marcadores'} · última coleta ${ultimaColeta}`,
    foraDaReferencia: 'fora da referência',
    naReferencia: 'na referência',
    blocoFora: 'Fora da referência',
    arquivosImportados: 'Arquivos importados',
    /* ⚠️ A ORIGEM DO ARQUIVO ERA O VALOR CRU DO ESTADO, e "foto" saía em
       português nos seis idiomas. "PDF" é o mesmo em todos; a foto não. */
    fonteFoto: 'foto',
    arquivoSub: (marcadores: number, fonte: string, data: string) =>
      `${marcadores} marcadores · ${fonte} · ${data}`,
    importar: 'Importar exame',
    enviarAoMedico: 'Enviar ao médico',

    /* ---------- a tela que ainda não tem exame ----------
       O convite fala do que vai acontecer com o resultado, e não do que
       falta: "anote o primeiro" é tarefa, "ele aparece aqui com a faixa
       de referência" é o motivo de anotar. */
    linhaVazia: 'Nenhum resultado ainda',
    vazioTitulo: 'Nenhum exame por aqui',
    vazioTexto: 'Você ainda não anotou nenhum resultado. Quando anotar o primeiro, ele aparece aqui com a faixa de referência e o que ela quer dizer.',
    vazioAcao: 'Anotar um resultado',

    /* ---------- o marcador ---------- */
    colhidoEm: (data: string) => `Colhido em ${data}`,
    vereditoOk: 'Na referência',
    vereditoAlto: 'Acima da referência',
    vereditoBaixo: 'Abaixo da referência',
    vereditoComFaixa: (veredito: string, faixa: string) => `${veredito}: ${faixa}`,
    faixaEntre: (minimo: string, maximo: string, unidade: string) =>
      `entre ${minimo} e ${maximo}${unidade}`,
    faixaAbaixo: (maximo: string, unidade: string) => `abaixo de ${maximo}${unidade}`,
    faixaAcima: (minimo: string, unidade: string) => `acima de ${minimo}${unidade}`,
    faixaRef: (referencia: string, unidade: string) => `${referencia}${unidade}`,
    refCurta: (referencia: string) => ` · ref ${referencia}`,

    /* Os selos da LISTA, em caixa baixa e curtos: ali eles cabem ao lado
       do número, e o veredito por extenso mora no detalhe. */
    seloOk: 'na referência',
    seloAlto: 'acima',
    seloBaixo: 'abaixo',
    seloEnviado: 'enviado',

    sobre: 'SOBRE',

    /* ---------- a evolução ----------
       ⚠️ SEM `good`, A PASTILHA FICA NEUTRA: número, unidade, e nenhuma
       palavra sobre se isso é boa notícia. Nem todo marcador tem lado
       bom. */
    evolucao: 'EVOLUÇÃO',
    deAte: (primeiro: string, ultimo: string) => `De ${primeiro} a ${ultimo}`,
    coletasDesde: (quantas: number, data: string) =>
      `${quantas} ${quantas === 1 ? 'coleta' : 'coletas'} desde ${data}`,
    deltaEsperado: ' · esperado',
    deltaOposto: ' · oposto',

    oQueSignifica: 'O QUE ISSO SIGNIFICA',
    oQueAjuda: 'O que costuma ajudar',
    oQueMexe: 'O que também mexe no resultado',
    rodape: 'São as causas e os caminhos mais comuns, e não a lista inteira. Mudança de dose ou de medicação é decisão de quem acompanha você.',
    perguntarSobre: 'Perguntar sobre este exame',
    perguntaCompanion: (marcador: string) => `Explique meu exame de ${marcador}`,
  },
};
