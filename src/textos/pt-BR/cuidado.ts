/* ============================================================
   O CUIDADO — a área das pessoas

   É a parte do aplicativo que fala da EQUIPE de alguém, e por isso a
   regra que vale para o arquivo inteiro é mais dura que a das outras:

   ⚠️⚠️ NENHUMA FRASE DAQUI PODE AFIRMAR O QUE A EQUIPE FEZ SEM SABER.
   "Sua equipe atualizou seu tratamento" só é verdade quando existe
   plataforma — é ela que traz a orientação nova. Sem servidor, o
   aplicativo sabe que a consulta aconteceu, porque a pessoa disse, e
   mais nada. Por isso quase todo par de frases aqui tem uma versão com
   plataforma e outra sem, e elas não são variações de tom: a diferença
   entre as duas é uma afirmação de fato.

   ⚠️ E A MANCHETE NÃO DÁ NOTA. A pastilha do topo dizia "Boa adesão",
   "Adesão regular" ou "Adesão baixa" — e a terceira aparecia para quem
   perdeu duas doses, que quase sempre perdeu porque passou mal. Uma
   consequência do tratamento virava nota sobre a pessoa no primeiro
   lugar em que o olho cai. Hoje é "8 de 11 doses", que diz a mesma coisa
   sem julgar e diz mais: a nota achatava 70% e 89% no mesmo rótulo.
   ============================================================ */

export const cuidado = {
  /* ============================================================
     O QUE ESTÁ ESPERANDO A PESSOA

     ⚠️ CADA ITEM TEM TRÊS TEXTOS, e o terceiro não é resumo dos outros:

       · `texto`  o que fazer — é o título da linha
       · `sub`    por que agora, que é o que decide entre hoje e semana
                  que vem
       · `rotulo` como a MANCHETE chama este item quando os lista numa
                  frase só: "duas pendências precisam de você — receita e
                  exames"

     "Agendar exame de sangue" é o que se faz; para a frase, o assunto é
     "exames". Traduzir os dois iguais desfaz a manchete.
     ============================================================ */
  pendencias: {
    mensagemUma: 'Responder a mensagem da sua equipe',
    mensagemVarias: (quantas: number) => `Responder as ${quantas} mensagens da sua equipe`,
    mensagemSub: 'aguardando sua resposta',
    mensagemRotulo: 'mensagens',

    receita: 'Peça a renovação da receita',
    /* Duas contagens na mesma linha, cada uma com o próprio plural: as
       doses que restam e as semanas que elas cobrem. */
    receitaSub: (doses: number, semanas: number) =>
      `${doses} ${doses === 1 ? 'dose restante' : 'doses restantes'} · cerca de ${semanas} ${semanas === 1 ? 'semana' : 'semanas'}`,
    receitaRotulo: 'receita',

    /* O título do exame vem do protocolo — é o que a equipe escreveu, e
       não texto nosso. O que é nosso é de onde ele veio: com equipe, foi
       ela que pediu; sem equipe, quem pede é o próprio plano, e dizer
       "pedido pela sua equipe" inventaria uma. */
    exameSubDaEquipe: 'pedido pela sua equipe',
    exameSubDoProtocolo: 'do protocolo desta semana',
    exameRotulo: 'exames',

    consulta: 'Prepare o que levar para a consulta',
    consultaSub: (tipo: string, quando: string, doutor: string) =>
      `${tipo} ${quando} · com ${doutor}`,
    consultaRotulo: 'consulta',
  },

  /* ============================================================
     A MANCHETE DO ACOMPANHAMENTO

     Quatro momentos, e a ordem em que aparecem aqui é a ordem de
     precedência entre eles: a consulta chegando vence tudo, depois o
     pós-consulta, depois as pendências, e a continuidade no resto do
     tempo — que é a maior parte.
     ============================================================ */
  estado: {
    /* ⚠️ ERA A MESMA PALAVRA ESCRITA QUATRO VEZES, uma por momento. Os
       quatro cartões são o mesmo cartão em momentos diferentes, então o
       chapéu é um só. */
    kicker: 'SEU ACOMPANHAMENTO',

    /* As duas contagens do topo. A quebra de linha é de propósito: valor
       em cima, unidade embaixo, para a leitura de relance. */
    metricaSemanas: 'semanas\nde acompanhamento',
    metricaAplicacoes: 'aplicações\nregistradas',

    /* ⚠️ "DOSES" E NÃO "APLICAÇÕES": esta pastilha divide a linha com o
       pulso, que pode ser "3 itens pendentes", e a palavra longa empurra
       o pulso para duas linhas. */
    adesao: (feitas: number, previstas: number) =>
      `${feitas} de ${previstas} ${previstas === 1 ? 'dose' : 'doses'}`,

    /* ---------- a consulta chegando ---------- */
    consultaTitulo: 'Sua consulta está chegando.',
    consultaHoje: (doutor: string) =>
      `Sua consulta com ${doutor} é hoje. Vale revisar o que você quer perguntar.`,
    consultaFaltam: (dias: number, doutor: string) =>
      `${dias === 1 ? 'Falta 1 dia' : `Faltam ${dias} dias`} para sua consulta com ${doutor}.`,
    consultaPulso: (quando: string) => `Consulta ${quando}`,

    /* ---------- logo depois da consulta ---------- */
    /* ⚠️ AS DUAS VERSÕES NÃO SÃO DE TOM, SÃO DE FATO. Ver o alto do
       arquivo: sem plataforma o aplicativo não sabe o que foi decidido na
       sala, e a frase muda de dono. */
    posConsultaTituloComPlataforma: 'Sua equipe atualizou seu tratamento.',
    posConsultaTituloSemPlataforma: 'Você teve uma consulta há pouco.',
    posConsultaTextoComPlataforma: 'Confira as orientações da consulta e o que muda na sua dose a partir de agora.',
    /* ⚠️ ESTA FRASE DIZIA "AS CONTAS DO APP", e a palavra é "aplicativo".
       Ela passou despercebida porque é de um ramo que nunca rodava: só
       aparece para quem teve consulta nas últimas 48 h e não tem
       plataforma. Foi a cobertura do congelamento que a encontrou. */
    posConsultaTextoSemPlataforma: 'Se a dose ou o intervalo mudaram, vale atualizar por aqui — é o que mantém as contas do aplicativo certas.',
    posConsultaPulso: 'Tratamento atualizado',

    /* ---------- as pendências ---------- */
    /* ⚠️ "TEMOS ALGUMAS COISAS PARA CUIDAR" — primeira pessoa do plural, e
       não "você tem pendências". A lista abaixo é de coisas que dependem
       dela, e abrir com o dedo apontado num cartão de saúde é o começo
       errado. */
    pendenciaTitulo: 'Temos algumas coisas para cuidar.',
    /* ⚠️ NOMEIA O QUE É, EM VEZ DE CONTAR QUANTOS. "Duas coisas" obriga a
       rolar para descobrir se importa. E os nomes vêm da PRÓPRIA lista,
       item por item — quando vinham de outro conjunto, a frase podia
       nomear um assunto que a lista não tinha. */
    pendenciaTexto: (quantas: string, plural: boolean, assuntos: string) =>
      `${quantas} ${plural ? 'pendências precisam' : 'pendência precisa'} de você — ${assuntos}. Nada urgente, mas vale resolver esta semana.`,
    pendenciaPulso: (quantas: number) =>
      `${quantas} ${quantas === 1 ? 'item pendente' : 'itens pendentes'}`,
    /* Até quatro por extenso, que é o teto de pendências que existem. */
    porExtenso: ['nenhuma', 'uma', 'duas', 'três', 'quatro'],
    /* ⚠️ "a, b e c" — vírgula até o penúltimo, "e" só antes do último. É
       regra de idioma, e é por isso que mora aqui: com um join simples
       saía "mensagens e receita e exames", que é como uma máquina fala. */
    enumera: (itens: string[]) =>
      itens.length <= 1 ? (itens[0] ?? '')
        : `${itens.slice(0, -1).join(', ')} e ${itens[itens.length - 1]}`,

    /* ---------- o resto do tempo ---------- */
    emDiaTitulo: 'Seu cuidado está em dia.',
    /* ⚠️ A SEGUNDA VERSÃO EXISTE PORQUE A FRASE COMEÇAVA PELO NOME DA
       MÉDICA. Sem ninguém registrado ela abria com um espaço em branco:
       " acompanha seu tratamento há 10 semanas". Quem conduz o tratamento
       sozinha conduz há o mesmo tanto de tempo. */
    emDiaComQuem: (quem: string, semanas: number) =>
      `${quem} acompanha seu tratamento há ${semanas} semanas. Você está com boa adesão e não há nenhuma pendência importante no momento.`,
    emDiaSozinha: (semanas: number) =>
      `Você está há ${semanas} semanas de tratamento, com boa adesão e nenhuma pendência importante no momento.`,
    emDiaPulso: 'Acompanhamento em dia',
  },

  /* ============================================================
     O CONTEXTO DA DOSE — as três frases curtas
     ============================================================ */
  dose: {
    aplicacaoHoje: 'Aplicação hoje',
    proximaAplicacao: (quando: string) => `Próxima aplicação ${quando}`,
    nestaDoseHa: (semanas: number) =>
      `Nesta dose há ${semanas} ${semanas === 1 ? 'semana' : 'semanas'}`,
    /* O `quando` já chega como "em 9 dias" / "amanhã", com a preposição
       dentro — por isso a frase não põe outra: "consulta de em 9 dias". */
    revisaoNaConsulta: (quando: string) => `Revisão na consulta ${quando}`,
    revisaoHoje: 'de hoje',
  },

  /* ============================================================
     A EQUIPE E A CLÍNICA
     ============================================================ */
  equipe: {
    /* O papel de quem não tem especialidade anotada. Não é "Médico": pode
       não ser, e o aplicativo não sabe. O que ele sabe é a função. */
    responsavelPadrao: 'Responsável pelo tratamento',
  },

  /* ⚠️ CADA LINHA SÓ EXISTE COM O DADO DELA. "Telefone —" numa lista de
     contatos é a tela prometendo um canal que não existe. E a ordem é a
     do canal mais rápido para o mais formal. */
  contato: {
    whatsapp: 'WhatsApp',
    whatsappSub: 'Falar com a clínica',
    telefone: 'Telefone',
    site: 'Site',
    email: 'E-mail',
    instagram: 'Instagram',
  },
};
