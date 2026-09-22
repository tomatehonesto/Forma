/* ============================================================
   DIE SPRACHREGELN, DIE ZU KEINEM BEREICH GEHÖREN · de-DE

   ⚠️ Die Gründe stehen in ../pt-BR/comum.ts. Hier wohnt reine Grammatik:
   was jeder Bereich braucht und keiner besitzt.

   ⚠️⚠️ UND DAS GANZE DEUTSCH DIESES KATALOGS SAGT „DU“. Das ist die eine
   Entscheidung hier, die teuer rückgängig zu machen ist, also steht der
   Grund an dieser Stelle:

   Portugiesisch sagt „você“, Spanisch sagt „tú“ — beide vertraut.
   Französisch sagt „vous“, weil Französisch einer App gegenüber einem
   erwachsenen Fremden kaum etwas anderes anbietet. Deutsch bietet beides
   echt an, und „Sie“ wäre hier nicht höflich, sondern fern: diese App
   redet über deinen Körper, deine Spritzen und deine Blutwerte, und sie
   gratuliert dir am Ende mit „Schön, dass du bis hierher gekommen bist“.
   Dasselbe auf „Sie“ liest sich wie ein Brief aus der Klinik.

   Drei von vier Sprachen stehen damit im Vertrauten, und die vierte nur
   deshalb nicht, weil die Sprache es nicht hergibt. Wer das umdreht,
   dreht dreißig Dateien um — es steht in PENDENCIAS.

   ⚠️⚠️ UND DIE ZWEITE STEHENDE ENTSCHEIDUNG IST DIE DOPPELNENNUNG.
   „sprich mit deiner Ärztin oder deinem Arzt“, ausgeschrieben, und nicht
   „Ärzt*in“, „ÄrztIn“ oder „Ärzt:in“.

   Das ist dieselbe Frage, die das Französische mit dem Mittelpunkt
   gestellt hat — „né·e“ —, und dieselbe Antwort: die Sternchen- und
   Doppelpunktformen werden von Screenreadern falsch vorgelesen, und in
   einer Gesundheits-App jemanden vom Lesen auszuschließen, um niemanden
   vom Geschlecht auszuschließen, ist ein schlechter Tausch.

   ⚠️ Der Unterschied zum Französischen ist wichtig genug, ihn zu nennen:
   dort ging es um das Geschlecht DER LESENDEN PERSON, und die Lösung war,
   den Satz so zu bauen, dass keine Übereinstimmung nötig wird. Hier geht
   es um das Geschlecht EINER DRITTEN PERSON — der Ärztin, des Arztes —,
   und dafür gibt es im Deutschen eine unstrittige, vorlesbare Form: beide
   nennen. Wo beide zu nennen den Satz sprengt, nimmt man die Rolle statt
   der Person: „dein Team“, „wer dich behandelt“, „die Praxis“.
   ============================================================ */

export const comum = {
  /* ⚠️ SIE STAND ZWEIMAL DA: einmal in `listaPt` für „a, b, c und 2
     weitere“, einmal in der Pflege für „Nachrichten, Rezept und Befunde“.

     ⚠️⚠️ UND DEUTSCH SETZT KEIN KOMMA VOR „UND“, anders als das Englische
     mit seinem Oxford-Komma. Wer die englische Fassung hierher kopiert,
     bringt das Komma mit, und es ist falsch.

     ⚠️ `mostrar` IST DAS, WORIN SICH DIE BEIDEN UNTERSCHIEDEN: die
     Aufgabenliste zeigt alles, die Namensliste auf der Startseite
     schneidet bei drei ab und zählt den Rest. Ohne Deckel wird nichts
     abgeschnitten. */
  /* ⚠️⚠️ HIER GIBT SIE ZURÜCK, WAS SIE BEKOMMT — und das ist der ganze
     Grund, aus dem es diese Funktion gibt.

     Portugiesisch, Spanisch, Französisch und Englisch nehmen einem
     Gattungsnamen die Großschreibung, sobald er mitten im Satz steht. Das
     stand als `.toLowerCase()` an sieben Stellen in src/logic, weil vier
     Sprachen sich einig waren und niemand merkte, dass es eine
     Sprachregel ist.

     Deutsch schreibt JEDES Substantiv groß, in jeder Position. Ein
     `.toLowerCase()` erzeugte hier „konsultation rückkehr“ und „3
     wiegungen“ — Rechtschreibfehler, nicht Geschmack, in jeder Zeile, die
     da durchläuft. */
  noMeio: (s: string) => s,
  /* ⚠️ AS ASPAS SÃO DE CADA IDIOMA: “ ” no português e no inglês, « » no
     francês com espaça, «» no espanhol sem, e „ “ no alemão — que abre
     embaixo. Escritas na tela, toda citação do aplicativo sai com aspa
     inglesa em cinco idiomas.

     ⚠️ E ELA MORA AQUI porque a citação não é de uma tela: é a nota da
     semana, o sintoma que a pessoa escreveu, a anotação da consulta. Eram
     duas cópias idênticas, em `escalas` e em `home`, e a terceira tela
     ia escrever a terceira. */
  citacao: (texto: string) => `„${texto}“`,

  lista: (itens: string[], mostrar = Infinity) => {
    if (!itens.length) return '';
    if (itens.length === 1) return itens[0];
    if (itens.length <= mostrar) {
      return `${itens.slice(0, -1).join(', ')} und ${itens[itens.length - 1]}`;
    }
    return `${itens.slice(0, mostrar).join(', ')} und ${itens.length - mostrar} weitere`;
  },

  abas: {
    home: 'Start',
    jornada: 'Weg',
    cuidado: 'Betreuung',
    insights: 'Insights',
  },
};
