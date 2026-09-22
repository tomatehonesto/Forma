/* ============================================================
   O PERFIL — a ficha e o índice dos controles

   A tela tem duas naturezas, e o texto segue as duas. Em cima, a ficha:
   rótulo curto ao lado de um número que o resto do aplicativo usa para
   calcular tudo. Embaixo, o índice: cada linha é um assunto, com o nome
   da tela do outro lado e uma segunda linha dizendo o que mora lá.

   ⚠️ O NOME DA LINHA É O NOME DO DESTINO. "Seu tratamento" abre uma tela
   chamada "Seu tratamento"; "Histórico completo" abriria a mesma e faria
   a pessoa achar que chegou noutro lugar. Vale para as onze linhas: se
   um dia a tela do outro lado mudar de nome, esta chave muda junto.

   ⚠️ E O TÍTULO DE QUEM CUIDA NÃO MORA AQUI. Ele é o mesmo nos três
   lugares em que a mesma especialista aparece — Home, Cuidado e Perfil —
   e sai de `home.telaInicio.quemCuida`. Uma pergunta, uma resposta, três
   telas.
   ============================================================ */

export const perfil = {
  /* ---------- a ficha ---------- */
  naoInformado: 'Não informado',
  nenhuma: 'Nenhuma',
  especialista: 'Especialista',
  dia: (numero: number) => `Dia ${numero}`,
  inicial: 'Inicial',
  atual: 'Atual',
  meta: 'Meta',

  /* ---------- quem cuida ---------- */
  consultaEm: (quando: string) => `Consulta ${quando}`,
  /* ⚠️ O RECADO SEM LER SÓ APARECE QUANDO EXISTE: "0 não lidas" é o
     aplicativo puxando assunto sobre nada. O zero fica fora na tela, e
     por isso esta frase nunca precisa da forma do zero. */
  naoLidas: (quantas: number) => `${quantas} ${quantas === 1 ? 'não lida' : 'não lidas'}`,

  /* ---------- plano e cobrança ---------- */
  planoECobranca: 'Plano e cobrança',
  suaAssinatura: 'Sua assinatura',

  /* ---------- acompanhamento ----------

     ⚠️ AS TRÊS NÃO SÃO PREFERÊNCIAS. Mudar um alvo de proteína é decidir
     o que o tratamento persegue, e não ajustar uma opção do aplicativo —
     por isso elas ficam num grupo próprio, e não em "Personalize". */
  acompanhamento: 'Acompanhamento',
  metasDiarias: 'Metas diárias',
  metasDiariasSub: (proteina: number, agua: string) => `${proteina} g de proteína · ${agua} L de água`,
  lembretes: 'Lembretes',
  lembretesSub: 'Dose, pesagem, água e proteína',
  dispositivos: 'Dispositivos e integrações',
  dispositivosSub: 'Apple Health, Withings e mais',

  /* ---------- conquistas ---------- */
  oQueVoceJaFez: 'O que você já fez',
  conquistas: 'Conquistas',
  conquistasSub: 'O que você já alcançou no tratamento',

  /* ---------- sobre você ----------

     A regra deste grupo: só mora nele o que termina na própria pessoa. O
     resumo para a consulta saiu daqui por isso — ele fala dela para
     outra pessoa. */
  sobreVoce: 'Sobre você',
  seusDados: 'Seus dados',
  seusDadosSub: 'Altura, peso, ritmo e mais',
  exames: 'Exames',
  examesSub: 'Os resultados do laboratório, explicados',
  seuTratamento: 'Seu tratamento',
  seuTratamentoSub: 'Tudo o que você registrou, semana a semana',

  /* ---------- personalize ----------

     ⚠️ O IDIOMA VEM ANTES DAS UNIDADES porque é ele que decide as duas
     coisas: trocar de idioma troca a palavra E a vírgula decimal.

     ⚠️ "UNIDADES DE MEDIDA", e não "Unidades": sozinha, a palavra também
     é a de "unidades de insulina" e a de "quantas unidades você comeu" —
     duas coisas que este aplicativo também tem. */
  personalize: 'Personalize o aplicativo',
  aparencia: 'Aparência',
  /* ⚠️ DIZIA "a cor do seu Morphi", e o aplicativo não se chama pelo nome
     quando fala com quem usa. */
  aparenciaSub: (paleta: string, escuro: boolean) =>
    `${paleta}, no ${escuro ? 'escuro' : 'claro'} · escolha a cor do aplicativo`,
  /* ⚠️ A LINHA DO IDIOMA DIZIA "Português · Brasil" EM TODO IDIOMA. Era
     um ternário de duas saídas para cinco locais e dezenas de países.
     Agora ela repete o que a tela do outro lado mostra, e os dois nomes
     vêm de `logic/local` e `logic/pais`, que escrevem cada um na própria
     língua de propósito. */
  idiomaSub: (idioma: string, pais: string) => `${idioma} · ${pais}`,
  unidades: 'Unidades de medida',
  unidadesSub: (sistema: string, unidades: string) => `${sistema} · ${unidades}`,

  /* ---------- ajuda e dados ---------- */
  ajudaEDados: 'Ajuda e dados',
  privacidade: 'Privacidade e dados',
  privacidadeSub: 'O que fica no aparelho, exportar, apagar e os documentos',
  ajuda: 'Ajuda',
  ajudaSub: 'Perguntas frequentes sobre o aplicativo',

  /* ---------- reportar um problema ----------

     ⚠️ O QUE VAI NO E-MAIL É O QUE NINGUÉM SABE DE COR: versão, sistema e
     aparelho. NADA DO DIÁRIO VAI JUNTO — peso, dose e sintoma não saem
     daqui sem a pessoa mandar, e um relato de defeito não é mandar. */
  reportar: 'Reportar um problema',
  reportarSub: 'Conte o que aconteceu — vai com a versão do aplicativo',
  problemaAssunto: 'Morphi — problema',
  problemaSistema: (sistema: string, versao: string) => `Sistema: ${sistema} ${versao}`,
  problemaPaleta: (paleta: string, escuro: boolean) =>
    `Paleta: ${paleta} · Tema: ${escuro ? 'escuro' : 'claro'}`,
  problemaCorpo: 'Conte o que você estava fazendo e o que aconteceu.',

  /* ---------- o rodapé ---------- */
  sair: 'Sair da conta',
  versao: (numero: string) => `Morphi · versão ${numero}`,
};
