/* ============================================================
   O IDIOMA — a primeira pergunta do cadastro, e a tela do perfil

   ⚠️⚠️ ESTE É O ÚNICO TEXTO DO APLICATIVO QUE ALGUÉM PODE LER SEM
   ENTENDER. Ele aparece antes de a pessoa escolher o idioma, e por isso
   sai no idioma que o aparelho indicou — que é a melhor aposta, e não uma
   certeza. Quem não entender a pergunta ainda consegue responder, porque
   as opções se escrevem cada uma na própria língua: é a lista que salva a
   tela, e não a frase.

   ⚠️ E É A PRIMEIRA PERGUNTA DE PROPÓSITO. Ela vem antes do nome porque
   tudo o que vier depois será lido na resposta dela — perguntar o nome
   primeiro em português a quem lê em inglês é começar errando, e errando
   na única pergunta que a pessoa não consegue corrigir sem achar o menu.
   ============================================================ */

export const idioma = {
  /* A pergunta do cadastro. */
  pergunta: 'Em que idioma você quer ler?',
  sub: 'Isto muda o texto, os números e as datas. Dá para trocar depois, no perfil.',

  /* ⚠️⚠️ O PAÍS É A SEGUNDA PERGUNTA DESTA TELA, e não é o idioma com
     outro nome. Um brasileiro em Lisboa lê em português e compra remédio
     em euro; um mexicano nos Estados Unidos pode preferir ler em espanhol
     e ter Zepbound na farmácia da esquina. Derivar um do outro erra com
     as duas pessoas.

     ⚠️ E A PERGUNTA É "ONDE VOCÊ SE TRATA", e não "de onde você é". O que
     o país decide é a farmácia, a moeda e a tabela de alimentos — todas
     coisas do lugar onde a pessoa está, e nenhuma de onde ela nasceu. */
  pais: 'País',
  paisRotulo: 'Onde você se trata',
  paisRessalva: 'Muda quais medicamentos aparecem primeiro, a moeda e a tabela de alimentos. Nada some da lista: o que é menos comum aí fica embaixo.',

  /* A tela do perfil, onde se troca. Ela pergunta DUAS coisas, e o
     nome dela diz as duas. */
  titulo: 'Idioma e região',
  tituloSub: 'Em que idioma você lê, e onde você se trata.',
  rotulo: 'Como você lê o aplicativo',

  /* ⚠️ A RESSALVA É A PARTE QUE SURPREENDE. Trocar para English troca
     também a vírgula decimal pelo ponto e o desenho da data — são o mesmo
     valor, e o motivo está no alto de logic/local. O que NÃO muda é o que
     já foi registrado, e dizer isso é o que tira o medo de tocar. */
  ressalva: 'O que você já registrou continua como está. Muda só a forma de escrever: a palavra, a vírgula do número, o desenho da data e o relógio.',

  /* O par curto de `pais`: o nome do ajuste, nas duas linhas da tela.
     A LINHA DO PERFIL NÃO USA ESTA e sim `titulo`, porque a porta e a
     sala têm de se chamar a mesma coisa. */
  idioma: 'Idioma',
};
