/* ============================================================
   LA LANGUE — la première question de l'inscription, et l'écran du profil · fr-FR

   ⚠️ Les raisons vivent dans ../pt-BR/idioma.ts. Celle qui commande :
   c'est le seul texte de l'application que quelqu'un peut lire sans
   comprendre. Il apparaît avant que la personne ait choisi sa langue, et
   sort donc dans celle que l'appareil a indiquée — le meilleur pari, pas
   une certitude. Qui ne comprend pas la question peut quand même
   répondre, parce que chaque option s'écrit dans sa propre langue : ce
   qui sauve l'écran, c'est la liste, pas la phrase.

   ⚠️⚠️ ET LE VOUVOIEMENT EST UNE DÉCISION, pas un réflexe. Le portugais
   dit « você » et l'espagnol « tú » — registres proches, ni l'un ni
   l'autre distant. Le français n'a pas d'équivalent : « tu » dans une
   application qui parle du corps de quelqu'un, de ses vomissements et de
   son poids se lit comme une familiarité qu'on n'a pas demandée. « Vous »
   n'est pas froid ici, c'est le registre dans lequel un soignant parle.
   Tout le catalogue français vouvoie.
   ============================================================ */

export const idioma = {
  pergunta: 'Dans quelle langue voulez-vous lire ?',
  sub: 'Cela change le texte, les nombres et les dates. Vous pourrez en changer plus tard, dans votre profil.',

  /* ⚠️ LE PAYS EST LA SECONDE QUESTION, et ce n'est pas la langue sous un
     autre nom. Un Brésilien à Lisbonne lit en portugais et achète ses
     médicaments en euros. Déduire l'un de l'autre se trompe avec les deux
     personnes.

     ⚠️ ET LA QUESTION EST « OÙ VOUS SOIGNEZ-VOUS », pas « d'où venez-vous ».
     Ce que le pays décide, c'est la pharmacie, la monnaie et la table des
     aliments — des choses du lieu où la personne est, aucune de là où
     elle est née. */
  titulo: 'Langue',
  tituloSub: 'Change le texte, les nombres et les dates.',
  rotulo: 'Comment vous lisez l’application',

  /* ⚠️ LA RÉSERVE EST LA PARTIE QUI SURPREND. Changer de langue change
     aussi le séparateur décimal et le dessin de la date. Ce qui NE change
     PAS, c'est ce qui a déjà été enregistré — et le dire, c'est ce qui
     enlève la peur d'y toucher. */
  ressalva: 'Ce que vous avez déjà enregistré reste tel quel. Seule la façon d’écrire change : le mot, la virgule du nombre, le dessin de la date et l’horloge.',

  idioma: 'Langue',
};
