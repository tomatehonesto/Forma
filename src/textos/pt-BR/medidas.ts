/* ============================================================
   AS UNIDADES DE MEDIDA — as palavras, não os símbolos

   ⚠️ SÓ ENTRA AQUI O QUE SE LÊ POR EXTENSO. "kg", "cm", "oz" e "ml" são
   símbolos internacionais e ficam no código, escritos uma vez em
   medidas.ts: não se traduz um símbolo, e quem escrevesse "qg" estaria
   inventando.

   ⚠️ E A LISTA É O EXEMPLO, NÃO O INVENTÁRIO. Ela aparece embaixo do nome
   do sistema, para quem não sabe de cabeça o que "imperial" quer dizer —
   quatro palavras reconhecíveis bastam, e as quatro são as que o
   aplicativo realmente usa.
   ============================================================ */

export const medidas = {
  /* ⚠️ O NOME DO SISTEMA ESTAVA ESCRITO EM TRÊS TELAS — o cadastro, a
     folha de unidades e a linha do perfil. Ninguém escolhe pelo nome
     ("métrico" e "imperial" não dizem nada a quem não sabe de cabeça o
     que cada um mede), e é por isso que a lista de exemplos anda junto. */
  metrico: 'Métrico',
  imperial: 'Imperial',
  unidadesMetrico: 'quilos, metros, centímetros e litros',
  unidadesImperial: 'libras, pés, polegadas e onças',

  /* ============================================================
     OS SETE MARCADORES DO CORPO — e eles moram aqui, e só aqui

     ⚠️⚠️ ESTES NOMES JÁ ESTAVAM ESCRITOS EM DOIS LUGARES: quatro em
     `home.mudancas` — a lista do que mudou desde o começo — e quatro em
     `confirmacoes` — a folha que aparece depois de medir. Com a tela do
     marcador, eles iam para o terceiro.

     É a mesma doença que este catálogo já curou três vezes: o mesmo fato
     escrito em lugares diferentes diverge na primeira vez que alguém
     melhora a redação de um deles. Aqui moram os sete, e os outros dois
     lugares leem daqui.

     ⚠️ E A TELA DO MARCADOR SERVE OS SETE COM O MESMO DESENHO, porque
     eles têm a mesma forma: um número, uma unidade, uma série no tempo.
     O que muda é a origem — fita, balança de banheiro, bioimpedância.
     ============================================================ */
  corpo: {
    peso: 'Peso',
    cintura: 'Cintura',
    quadril: 'Quadril',
    braco: 'Braço',
    coxa: 'Coxa',
    gordura: 'Gordura corporal',
    massaMagra: 'Massa magra',
  },

  /* ============================================================
     A TELA DO MARCADOR — o gráfico e a lista que se corrige
     ============================================================ */
  tela: {
    periodo12s: '12 semanas',
    periodo3m: '3 meses',
    periodoTudo: 'Tudo',

    /* ⚠️ ELE MORAVA NA TELA DE MEDIDAS, solto no pé da lista das quatro
       circunferências. Ali era um aviso geral sobre um assunto; aqui
       chega junto do número que ele explica — e é olhando a própria
       cintura que a pessoa precisa saber que a comparação só vale se as
       duas medições foram feitas igual. */
    mesmoJeitoTitulo: 'Medir sempre do mesmo jeito',
    mesmoJeitoTexto: 'Mesma hora do dia, sem roupa apertada e com a fita rente à pele, sem apertar. A comparação entre duas medidas só vale se as duas foram feitas igual.',

    /* Só o peso tem hora do dia; medida de fita não tem. */
    notaManha: 'manhã',

    vazioTitulo: (nome: string) => `Nenhum registro de ${nome.toLowerCase()}`,
    vazioDaBalanca: 'Esta medida vem da balança de bioimpedância, e ainda não chegou nenhuma.',
    vazioRegistre: 'Registre a primeira para começar a acompanhar.',

    lead: (data: string, inicial: string, unidade: string) =>
      `Registrado em ${data} · ${inicial} ${unidade} no início do tratamento`,
    subCurva: (periodo: string, quantos: number) =>
      `${periodo.toLowerCase()}${quantos > 1 ? ` · ${quantos} registros` : ''}`,

    registros: 'Registros',
    /* ⚠️ A NOTA MUDA DE VOZ QUANDO O NÚMERO NÃO É DA PESSOA. "Toque para
       corrigir" numa leitura de bioimpedância promete uma edição que não
       existe — e a linha nem abre. O que ela guarda de verdade, nos dois
       casos, é que aquilo vai para o relatório. */
    notaLeitura: 'Leituras da balança de bioimpedância. Não há o que corrigir por aqui — elas chegam prontas.',
    notaCorrigir: 'Toque para corrigir ou apagar. O que estiver aqui vai para o relatório do seu médico.',
  },
};
