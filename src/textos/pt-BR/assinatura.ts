/* ============================================================
   A ASSINATURA — o que está valendo, quanto custa, onde se mexe

   ⚠️⚠️ É UMA TELA SÓ, COM UMA ETIQUETA, e o catálogo tem de preservar
   isso. Quem é paciente de clínica parceira lê "Sem custo" no MESMO ponto
   da tela onde quem assina lê "R$ 299,00" — a comparação é imediata
   porque o lugar é o mesmo. Um idioma que inventasse uma frase mais longa
   para o caso isento desfaria o desenho.

   ⚠️ O QUE NÃO ESTÁ AQUI, E NÃO ESTÁ DE PROPÓSITO:

   · "Care" e "Personal" são nomes dos nossos planos de acesso, e nome de
     plano não se traduz — vivem em logic/assinatura.
   · "App Store" e "Google Play" são marcas.
   · Os ATALHOS DE DESENVOLVIMENTO. `__DEV__` é falso na compilação de
     produção e aquele bloco some: são três linhas que nenhuma pessoa lê
     em idioma nenhum, e traduzi-las seria trabalho para ninguém.

   ⚠️⚠️ E O TEXTO DA ISENÇÃO NASCE DA SEÇÃO 4 DOS TERMOS. Não é frase de
   tela: é o compromisso que o documento assume, repetido onde ele
   importa. Se os dois se afastarem, um vira a versão errada para quem leu
   o outro — e quem tem razão é o documento. Ver logic/documentos.
   ============================================================ */

export const assinatura = {
  /* ============================================================
     OS PLANOS

     ⚠️ O SUFIXO NÃO É CHAVE. Havia duas telas perguntando
     `p.sufixo === '/mês'` para saber qual plano era o mensal — uma
     comparação de texto fazendo o trabalho de um id. Em inglês o sufixo
     é "/mo", a comparação falhava calada, e a tela de preço passava a
     dizer que os planos começam em R$ 598,80 por mês. Quem pergunta qual
     é o plano pergunta pelo `id`.
     ============================================================ */
  mensal: 'Mensal',
  anual: 'Anual',
  porAno: 'por ano',
  porAnoCurto: '/ano',

  /* ============================================================
     A TELA
     ============================================================ */

  /* ⚠️ UMA CHAVE SÓ para o título da tela e o rótulo do cartão. São o
     mesmo assunto dito no mesmo lugar, e separá-los em duas chaves é
     convidar as duas a divergirem. */
  titulo: 'Sua assinatura',

  semCusto: 'Sem custo',

  /* Quando não sabemos o nome da clínica. Ela entra no meio de uma frase,
     e por isso é minúscula. */
  clinicaGenerica: 'a clínica que acompanha você',
  cobertoPelaClinica: (clinica: string) => `O vínculo com ${clinica} cobre o aplicativo inteiro.`,

  /* A ficha: rótulo à esquerda, valor à direita. */
  vinculadaDesde: 'Vinculada desde',
  codigoDeConvite: 'Código de convite',
  periodicidade: 'Periodicidade',
  primeiraCobranca: 'Primeira cobrança',
  proximaCobranca: 'Próxima cobrança',
  cobrancaPela: 'Cobrança pela',
  naoHa: 'Não há',

  /* ⚠️ "VOCÊ TEM TUDO DO JEITO QUE ESTÁ" VEM ANTES DO PREÇO, e a ordem é
     a mensagem: quem abriu esta tela sem assinar não está sendo cobrada
     de nada, e descobrir isso não pode depender de ler a segunda
     oração. */
  semPlano: (menorPorMes: string) => `Você tem tudo do jeito que está. Os planos começam em ${menorPorMes} por mês.`,

  /* As ações. Sem subtítulo, porque nenhuma delas tem consequência — cada
     uma abre uma tela, e numa lista de ações o subtítulo só se paga
     quando avisa de algo que não dá para desfazer. */
  mudarDePlano: 'Mudar de plano',
  verOsPlanos: 'Ver os planos',
  formaDePagamento: 'Forma de pagamento',
  historicoDeCobranca: 'Histórico de cobrança',

  trocarClinica: 'Trocar a clínica que acompanha você',

  /* ⚠️ ESTAS DUAS TÊM SUBTÍTULO, e pelo motivo contrário ao das outras:
     quem está pagando e digita um código de clínica parceira DEIXA DE
     PAGAR. É a maior consequência da tela, e não há como adivinhá-la de
     um rótulo que diz "inserir código". */
  inserirCodigo: 'Inserir código',
  inserirCodigoSub: 'Pacientes de clínicas parceiras possuem isenção do custo do aplicativo',
  medicosParceiros: 'Médicos parceiros',
  medicosParceirosSub: 'Quem se trata numa clínica parceira não paga',

  cancelar: 'Cancelar assinatura',

  /* ============================================================
     AS TRÊS NOTAS DO PÉ

     ⚠️ O TÍTULO NÃO É O MESMO NOS TRÊS. "É bom você saber" serve ao aviso
     que é só informação; a que avisa de dinheiro parado tem de dizer isso
     no título, senão vira mais uma nota de rodapé com cara de nota de
     rodapé.
     ============================================================ */
  pagandoTitulo: 'Você está pagando sem precisar',
  pagandoTexto: (loja: string) => `O vínculo com a clínica já cobre o aplicativo, mas existe uma assinatura ativa na ${loja} — cancele por lá e nada muda para você.`,

  /* ⚠️⚠️ ELA DIZ QUEM AVISA A GENTE, e depois o que acontece.

     "Se o vínculo terminar" fazia parecer que percebemos sozinhos, e não
     percebemos: ninguém aqui sabe que uma pessoa deixou de ser paciente
     de uma clínica. Quem sabe é a clínica, e é ela que informa.

     ⚠️⚠️ E A LINHA DOS DADOS ANDA JUNTO, sempre. Suspender o acesso de um
     diário de tratamento é trancar alguém do lado de fora do próprio
     peso, das próprias aplicações e dos próprios exames — e isso não
     fazemos. Separadas, a primeira frase vira uma ameaça. */
  bomSaberTitulo: 'É bom você saber',
  bomSaberTexto: 'Caso a clínica parceira nos informe que o vínculo de tratamento foi encerrado, o acesso fica suspenso até você aderir a um plano Personal — e nenhuma cobrança acontece sem você escolher. Nada do que você registrou se perde: os registros continuam no aparelho e dá para exportar quando quiser.',

  /* ⚠️ DIZER "VOCÊ NÃO ASSINOU" SEM DIZER QUE NINGUÉM PODE ASSINAR deixa
     a pessoa procurando um botão que não existe. Esta sai no dia em que a
     cobrança entrar. */
  semCobrancaTitulo: 'A cobrança ainda não está ligada',
  semCobrancaTexto: 'Esta tela existe, a assinatura ainda não. Nada foi cobrado de você, e nada vai ser sem aviso.',
};
