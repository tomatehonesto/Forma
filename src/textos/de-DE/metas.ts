/* ============================================================
   DIE ZIELE — die Zahlen, die die App zählt, und die, die nur die Person kennt · de-DE

   ⚠️ Die Gründe stehen in ../pt-BR/metas.ts. Drei verschiedene Kataloge
   wohnen hier: die VORGABEN des Profils, die INDIKATOREN, die die App
   ZÄHLEN kann, und die PERSÖNLICHEN Ziele, die sie nicht misst.

   DIE PERSÖNLICHEN SIND KATEGORIEN, KEINE FERTIGEN SÄTZE. Die Liste sagt,
   WOVON die Rede ist, und die Frage beim zweiten Tippen macht sie zu
   ihrer. Beide Stücke müssen bleiben: der kurze Name für die Liste und
   die Frage, die zum Genauwerden zwingt.

   UND DAS PRÄFIX SCHLIESST DEN SATZ. Die Person schreibt ein Stück —
   „Volleyball“, „das Kleid von der Hochzeit“ — und `monta` gibt den
   ganzen Satz zurück.

   ⚠️⚠️ IM DEUTSCHEN HAT DAS PRÄFIX EINE BEDINGUNG MEHR, und es ist nicht
   dieselbe wie im Französischen. Dort ging es um Elision und Kontraktion
   („d'aller“, „au parc“). Hier geht es um den FALL und um die
   VERBKLAMMER: „Tragen“ verlangt einen Akkusativ, den die Person nicht
   mitliefert, und ein trennbares Verb schöbe seine zweite Hälfte hinter
   das, was sie geschrieben hat.

   Die Lösung ist, das Präfix hinter das Geschriebene zu stellen, wo das
   Deutsche es ohnehin erwartet: „… tragen“, „… erreichen“, „… nicht
   mehr“. Der Nominalausdruck, den die Person schreibt, steht dann vorn
   und braucht keinen Fall von uns.
   ============================================================ */

/* ⚠️⚠️ O DATIVO PLURAL ALEMÃO LEVA -n, e isso é regra e não palpite:
   todo substantivo alemão ganha -n no dativo plural, EXCETO os que já
   terminam em -n ou em -s. "Nächte" vira "Nächten", "Tage" vira "Tagen",
   e "Einheiten" e "Check-ins" ficam como estão.

   Ela existe porque `nomes[1]` é usado em dois casos diferentes: no
   nominativo em `semRegistros` ("noch keine Nächte") e no dativo em
   `contagem` ("von 13 Nächten"). Guardar a forma do dativo na tabela
   quebraria o outro uso — a mesma família do `oA` em formas.ts, e aqui
   com saída.

   ⚠️ E A PRIMEIRA VERSÃO DISTO ESTAVA ERRADA: ela somava o sufixo sempre,
   e a `contagem` recebe o SINGULAR quando o total é 1. Saía "1 von 1
   Nachten". Por isso o `de === 1` decide antes. */
const dativoPlural = (s: string) => (/[ns]$/.test(s) ? s : `${s}n`);

export const metas = {
  /* ============================================================
     DIE VORGABEN — die vier Zahlen, die die App zählt
     ============================================================ */
  alvos: {
    /* ⚠️ ES WAR DERSELBE SATZ DREIMAL GESCHRIEBEN, einmal je Tageszahl. Er
       ist derselbe, weil die Tatsache dieselbe ist — das Protokoll zählt
       Tage gegen alle drei —, und drei Kopien liefen beim ersten Mal
       auseinander, wenn jemand eine davon besser formuliert.

       Was er tut: sagen, was die Person beim Blick auf das Blatt nicht
       wissen kann. Das Eiweißziel zu senken lässt das Protokoll des Teams
       als erfüllt gelten, ohne dass sich auf dem Teller etwas geändert
       hätte. Er blockiert nicht und urteilt nicht. */
    ressalvaDoProtocolo: 'Das Protokoll der Woche zählt die Tage, an denen du diese Zahl erreicht hast. Sie hier zu ändern ändert auch das, was das Protokoll deines Teams als erfüllt ansieht.',

    prot: {
      nome: 'Eiweiß pro Tag',
      onde: 'Wird beim Essen und im Protokoll gezählt',
      origem: 'Aus deinem Gewicht berechnet, mit 1,2 g pro Kilo',
      un: 'g',
      escreve: (gramas: number) => String(gramas),
    },
    waterMl: {
      nome: 'Trinken pro Tag',
      origem: 'Aus deinem Gewicht, deinem Alter und deinem Bewegungsniveau berechnet',
      onde: 'Wird beim Trinken und im Protokoll gezählt',
    },
    exercMin: {
      nome: 'Bewegung pro Tag',
      onde: 'Es ist die gestrichelte Linie der Woche, bei der Bewegung',
      /* ⚠️ DIESE IST NICHT BERECHNET, und es wäre leicht zu schreiben,
         dass sie es ist, damit der Satz den beiden anderen gleicht. Es
         sind 60 Minuten für alle, und die Anmeldung fragt nichts, was
         daran etwas ändern würde. */
      origem: 'Die Voreinstellung, für alle gleich',
      un: 'Min.',
      escreve: (minutos: number) => String(minutos),
    },
    peso: {
      /* ⚠️ DERSELBE NAME WIE IN DER ANMELDUNG. Die Frage dort lautet „was
         ist dein Zielgewicht?“, und hier hieß das Feld „Referenzgewicht“ —
         zwei Namen für dieselbe Zahl, und wer seine Antwort ändern wollte,
         musste raten, welcher von beiden es war. */
      nome: 'Zielgewicht',
      onde: 'Es misst die ganze Reise, im Verlauf',
      /* Die einzige der vier, die die Person wirklich gewählt hat — und
         deshalb spricht ihr Satz von keiner Rechnung. */
      origem: 'Du hast es bei der Anmeldung gewählt',
    },
  },

  /* ============================================================
     DIE INDIKATOREN — was die App zählen kann

     ⚠️ DER NAME IN DER LISTE IST MIT ABSICHT ALLGEMEIN: „Stunden Schlaf“,
     und nicht „7 Std.+ schlafen“. Die Sache zu wählen und die Zahl zu
     wählen sind zwei Entscheidungen, und die zweite ist die persönliche —
     sieben Stunden ist, was die Literatur wiederholt, und bleibt trotzdem
     eine Vermutung über jemandes Leben.

     ⚠️ `origem` SAGT, WOHER DIE ZAHL KOMMT, und das entscheidet, ob sich
     das Ziel lohnt: wer nie eine Mahlzeit einträgt, muss vor der Wahl
     sehen, dass das Eiweißziel auf null stehen bleibt.

     ⚠️ `nomes` IST DAS, WAS GEZÄHLT WIRD, im Singular und Plural, und
     `femininas` ist seine Übereinstimmung. Im Deutschen wird dieses Feld
     nirgends gebraucht — „eingetragen“ beugt sich nicht —, aber es bleibt
     in der Signatur, weil der Vertrag aus dem Portugiesischen kommt.
     ============================================================ */
  indicadores: {
    sono: {
      nome: 'Stunden Schlaf',
      pergunta: 'Wie viele Stunden pro Nacht?',
      origem: 'Aus dem Schlaf, den du im Check-in einträgst',
      nomes: ['Nacht', 'Nächte'] as [string, string],
      femininas: true,
      un: 'Std.',
      escreve: (horas: number) => `${horas} Std.`,
      rotulo: (horas: number) => `${horas} Std. pro Nacht schlafen`,
      conta: (horas: number) => `Nächte mit ${horas} Std. oder mehr`,
    },
    energia: {
      nome: 'Energie am Tag',
      pergunta: 'Ab welcher Stufe zählt es?',
      origem: 'Aus der Energie, die du im Check-in einträgst',
      nomes: ['Tag', 'Tage'] as [string, string],
      femininas: false,
      un: 'von 5',
      escreve: (nivel: number) => `${nivel} von 5`,
      rotulo: (nivel: number) => `Energie ${nivel} oder mehr`,
      conta: (nivel: number) => `Tage mit Energie ${nivel} oder mehr, von 1 bis 5`,
    },
    humor: {
      nome: 'Stimmung am Tag',
      pergunta: 'Ab welcher Stufe zählt es?',
      origem: 'Aus der Stimmung, die du im Check-in einträgst',
      nomes: ['Tag', 'Tage'] as [string, string],
      femininas: false,
      un: 'von 5',
      escreve: (nivel: number) => `${nivel} von 5`,
      rotulo: (nivel: number) => `Stimmung ${nivel} oder mehr`,
      conta: (nivel: number) => `Tage mit Stimmung ${nivel} oder mehr, von 1 bis 5`,
    },
    /* ⚠️ ÜBELKEIT UND HUNGER ZÄHLEN ANDERSHERUM: der Treffer ist der Tag,
       an dem die Zahl NIEDRIG blieb, und deshalb lautet die Frage „bis zu
       welcher Stufe zählt es noch als gut“. Sie durch „ab welcher Stufe“
       zu ersetzen dreht das ganze Ziel um, ohne dass irgendetwas
       anschlägt. */
    enjoo: {
      nome: 'Übelkeit',
      pergunta: 'Bis zu welcher Stufe zählt es noch als gut?',
      origem: 'Aus der Übelkeit, die du im Check-in einträgst',
      nomes: ['Tag', 'Tage'] as [string, string],
      femininas: false,
      un: 'von 5',
      escreve: (nivel: number) => `${nivel} von 5`,
      rotulo: (nivel: number) => `Übelkeit ${nivel} oder weniger`,
      conta: (nivel: number) => `Tage mit Übelkeit ${nivel} oder weniger, von 1 bis 5`,
    },
    fome: {
      nome: 'Hunger',
      pergunta: 'Bis zu welcher Stufe zählt es noch als gut?',
      origem: 'Aus dem Hunger, den du im Check-in einträgst',
      nomes: ['Tag', 'Tage'] as [string, string],
      femininas: false,
      un: 'von 5',
      escreve: (nivel: number) => `${nivel} von 5`,
      rotulo: (nivel: number) => `Hunger ${nivel} oder weniger`,
      conta: (nivel: number) => `Tage mit Hunger ${nivel} oder weniger, von 1 bis 5`,
    },
    prot: {
      nome: 'Eiweiß pro Tag',
      pergunta: 'Wie viel Gramm pro Tag?',
      origem: 'Aus den Mahlzeiten, die du einträgst',
      nomes: ['Tag', 'Tage'] as [string, string],
      femininas: false,
      escreve: (gramas: number) => `${gramas} g`,
      rotulo: (gramas: number) => `${gramas} g Eiweiß essen`,
      conta: (gramas: number) => `Tage mit ${gramas} g oder mehr`,
    },
    /* Die drei unten bekommen die Menge FERTIG GESCHRIEBEN — „2,5 L“,
       „85 fl oz“ —, weil die Einheit eine Entscheidung von logic/medidas
       ist und keine der Sprache. */
    agua: {
      nome: 'Trinken pro Tag',
      pergunta: 'Wie viel pro Tag?',
      origem: 'Aus dem, was du beim Trinken einträgst',
      nomes: ['Tag', 'Tage'] as [string, string],
      femininas: false,
      rotulo: (quanto: string) => `${quanto} Wasser trinken`,
      conta: (quanto: string) => `Tage mit ${quanto} oder mehr`,
    },
    exerc: {
      nome: 'Minuten Bewegung',
      pergunta: 'Wie viele Minuten pro Tag?',
      origem: 'Aus den Einheiten, die du einträgst',
      nomes: ['Tag', 'Tage'] as [string, string],
      femininas: false,
      escreve: (minutos: number) => `${minutos} Min.`,
      rotulo: (minutos: number) => `${minutos} Min. am Tag bewegen`,
      conta: (minutos: number) => `Tage mit ${minutos} Min. oder mehr`,
    },
  },

  /* ============================================================
     DIE PERSÖNLICHEN ZIELE — was die App nicht misst

     ⚠️ DIE ZEITFORM WÄHLTE DAS LEBEN DER PERSON, und das wurde repariert.
     „Wieder anfangen zu spielen“ setzt voraus, dass sie gespielt hat; wer
     mit vierzig mit dem Schwimmen anfangen will, passte nicht in die
     einzige Kategorie der App, die von Sport sprach.

     Die einzige, die noch etwas voraussetzt, ist die des Ortes — und sie
     SAGT das in ihrem eigenen Namen, und das ist der Unterschied zwischen
     voraussetzen und fragen.

     ⚠️ DIE BEISPIELE GEHEN IN DIE FRAGE, NIE IN DEN FELDHINWEIS. Ein
     Beispiel in einem Feld ist ein Vorschlag: wer eines liest, bevor sie
     an ihr eigenes Ziel gedacht hat, schreibt das des Beispiels auf.

     ⚠️ UND KEINE KATEGORIE SETZT FAMILIE, KÖRPER ODER GELD VORAUS. Ein
     Ziel, das nicht in das Leben derjenigen passt, die es liest, ist
     schlimmer als ein leeres Feld.
     ============================================================ */
  pessoais: {
    roupa: {
      nome: 'Ein Kleidungsstück',
      pergunta: 'Welches Kleidungsstück willst du tragen? Das hinten im Schrank, eines aus einem Schaufenster — das, was dir einfällt.',
      dica: 'Schreib das Kleidungsstück',
      /* ⚠️ DAS VERB STEHT HINTEN, und das ist die deutsche Lösung für das,
         was das Französische mit der Wahl des Verbs löst: „das blaue Kleid
         tragen“ braucht von uns keinen Fall, „Tragen das blaue Kleid“
         wäre gar kein Satz. */
      monta: (r: string) => `${r} tragen`,
    },
    esporte: {
      nome: 'Eine Sportart',
      pergunta: 'Welche Sportart willst du machen? Es gilt, was du früher einmal gemacht hast, genauso wie das, was du nie ausprobiert hast.',
      dica: 'Schreib die Sportart',
      monta: (r: string) => `${r} machen`,
    },
    folego: {
      /* „Etwas aus dem Alltag“, und nicht „ohne aus der Puste zu kommen“:
         die Hürde kann ein Knie sein, ein Schmerz, eine Scham — und die
         falsche zu benennen schließt alle aus, die eine andere haben. */
      nome: 'Etwas aus dem Alltag',
      pergunta: 'Was willst du schaffen, ohne müde zu werden? Die Treppe zu Hause, die Einkäufe tragen, bis zur Ecke gehen, ohne stehen zu bleiben.',
      dica: 'Schreib die Tätigkeit',
      monta: (r: string) => `${r} schaffen`,
    },
    sentir: {
      nome: 'Wie ich mich fühle',
      pergunta: 'Wie willst du dich fühlen? Mit mehr Schwung, wohler im eigenen Körper — so, wie es für dich Sinn ergibt.',
      dica: 'Schreib, wie du dich fühlen willst',
      monta: (r: string) => `Mich ${r} fühlen`,
    },
    foto: {
      nome: 'Ein Foto',
      pergunta: 'Welches Foto willst du haben? Eines am Strand, eines mit denen, die du liebst, oder einfach eines, auf dem du dich wiedererkennst.',
      dica: 'Schreib das Foto',
      monta: (r: string) => `${r} machen`,
    },
    lugar: {
      /* ⚠️ DER NAME NENNT DIE VORAUSSETZUNG, und es ist die einzige, die
         geblieben ist. Hier ist sie das Thema: es geht nicht darum, es zu
         schaffen, es geht darum, zurückzukommen — wer aufhört, an den
         Strand zu gehen, hat selten aufgehört, weil sie es nicht schaffte.
         Wer einen neuen Ort will, hat „Ein anderes Ziel“. */
      nome: 'Ein Ort, an den du nicht mehr gehst',
      pergunta: 'Wohin willst du zurück? An den Strand, ins Schwimmbad, auf die Feier von jemandem — der Ort, den du in letzter Zeit auslässt.',
      dica: 'Schreib den Ort',
      /* „Wieder an den Strand“ — das Präfix hinten, und keine Präposition
         von uns: die steht schon in dem, was die Person geschrieben hat,
         oder sie braucht keine. */
      monta: (r: string) => `Wieder ${r}`,
    },
    comecar: {
      nome: 'Eine Gewohnheit, die anfangen soll',
      pergunta: 'Was willst du anfangen zu tun? Morgens spazieren gehen, sonntags kochen, früher schlafen gehen.',
      dica: 'Schreib die Gewohnheit',
      monta: (r: string) => `${r} anfangen`,
    },
    largar: {
      nome: 'Eine Gewohnheit, die aufhören soll',
      pergunta: 'Was willst du nicht mehr tun? Im Stehen essen, nachts naschen — was auch immer es bei dir ist.',
      dica: 'Schreib die Gewohnheit',
      /* ⚠️ „NICHT MEHR“ VORN UND NICHTS HINTEN. „Aufhören zu“ verlangte
         ein „zu“ vor dem Verb, das die Person nicht mitschreibt, und
         „aufhören“ hinten schöbe die Verneinung an die falsche Stelle. */
      monta: (r: string) => `Nicht mehr ${r}`,
    },
    /* Der Ausgang für das, was in keine Kategorie passt — dasselbe wie die
       anderen, nur ohne Präfix: hier gehört der ganze Satz derjenigen, die
       ihn schreibt, und `monta` gibt zurück, was sie geschrieben hat. */
    livre: {
      nome: 'Ein anderes Ziel',
      pergunta: 'Was willst du schaffen? Schreib es so, wie es dir passt — wir heben es genau so auf, wie du es schreibst.',
      dica: 'Schreib dein Ziel',
      monta: (r: string) => r,
    },
  },

  /* ============================================================
     DIE FRISTEN — relativ, und wirklich freiwillig

     Wer einem Behandlungsziel eine Frist gibt, denkt „so in drei
     Monaten“, nicht an den 14. Dezember. Und die erste Option ist, KEINE
     zu haben, schon ausgewählt: ein Ziel ohne Datum bleibt ein Ziel; was
     es nicht darf, ist eine Frist bekommen, die die Person nicht gewählt
     hat.
     ============================================================ */
  prazos: {
    nao: 'Ohne Frist',
    umMes: 'In 1 Monat',
    tresMeses: 'In 3 Monaten',
    seisMeses: 'In 6 Monaten',
    umAno: 'In 1 Jahr',
  },

  /* ============================================================
     DIE ZEILE JEDES ZIELS, IM VERLAUF
     ============================================================ */
  jornada: {
    /* ⚠️ DIE ZÄHLUNG, UND NICHT NOCH EINMAL DER PROZENTSATZ. Die Zeile
       sagte rechts „85 %“ und darunter „85 % der letzten Nächte“ — dieselbe
       Zahl zweimal. „11 von 13 Nächten“ beantwortet: von wie vielen
       Nächten reden wir.

       ⚠️ UND `femininas` WIRD HIER NICHT GEBRAUCHT: „eingetragen“ ist für
       Nächte und Tage dasselbe Wort. Der Parameter bleibt, weil der
       Vertrag aus dem Portugiesischen kommt, und die Zeile ignoriert ihn.

       ⚠️ UND DER PLURAL STEHT HIER IM DATIV — „von 13 Nächten“ —, während
       derselbe `nomes[1]` in `semRegistros` im Nominativ steht — „noch
       keine Nächte“. Deshalb trägt die Tabelle die schlichte Pluralform,
       und die Beugung passiert hier, mit `dativoPlural` oben. */
    contagem: (quantas: number, de: number, nome: string, femininas: boolean) =>
      `${quantas} von ${de} ${de === 1 ? nome : dativoPlural(nome)} eingetragen`,
    semRegistros: (plural: string) => `noch keine ${plural}`,

    /* Das persönliche Ziel hat keinen Bruchteil: es hat das Datum, den
       Teil der Erfüllung, den man jemandem erzählt. */
    conquistadaEm: (data: string) => `erreicht am ${data}`,
    /* ⚠️ DIE FRIST IST EINE TATSACHE, KEIN VORWURF. Vergangen und nicht
       erreicht, sagt die Zeile, dass sie vergangen ist, und hört dort auf
       — ohne Rot und ohne „überfällig“. In einer Behandlung über Monate
       ist ein Datum, das verrutscht, das Normalste der Welt, und das Ziel
       steht weiter. */
    ate: (data: string) => `bis zum ${data}`,
    oPrazoEra: (data: string) => `die Frist war der ${data}`,
    vocemarca: 'du hakst ab, wenn es so weit ist',
  },

  /* ⚠️⚠️ DIESE ZWEI BILDSCHIRME HABEN DIE GANZE SACHE AUFFLIEGEN LASSEN.
     Die Liste öffnete mit „Metas“ und „Os números do dia“ auf
     Portugiesisch, direkt neben „Zielgewicht“ und „Eiweiß pro Tag“, die
     schon von hier kamen. Ein halb übersetzter Bildschirm ist schlimmer
     als gar keiner — wer das sieht, schließt, dass die App kaputt ist.
     Die Gründe stehen in ../pt-BR/metas. */
  tela: {
    /* ---------- die Liste ---------- */
    titulo: 'Ziele',
    progresso: (perdido: string, total: string, alvo: string) => `${perdido} von ${total} bis ${alvo}`,
    novaMeta: 'Neues Ziel',

    numerosTitulo: 'Deine Zahlen des Tages',
    numerosNota: 'Das ist es, was die Bildschirme für Trinken, Essen und Bewegung zählen, und was das Protokoll zusammenrechnet.',

    /* ⚠️ „ÜBER“, UND NICHT „VON“: die Zahl ist DURCH das Team gekommen —
       in einer Sprechstunde gesagt und danach notiert. „Von deinem Team“
       klingt nach Besitz, als gehörte die Zeile der Praxis und nicht
       ihr. */
    equipeMira: (valor: string) => `Dein Team peilt ${valor} an`,
    alterada: 'Von dir geändert',
    viaEquipe: 'Über dein Team',

    suasTitulo: 'Deine eigenen Ziele',
    suasNota: 'Die gemessenen Ziele verfolgen wir über deine Einträge. Deine eigenen hakst du selbst ab.',

    vazioTitulo: 'Noch kein Ziel',
    vazioTexto: 'Schreib etwas auf, das du erreichen willst. Es bleibt hier, bis es passiert.',

    /* ---------- die Karte für eine der vier Zahlen ---------- */
    definidoPelaEquipe: 'Von deinem Team festgelegt',
    novoValor: 'Neuer Wert',
    salvar: 'Speichern',

    hoje: (valor: string) => `Heute: ${valor}`,
    origemSua: 'Eine Zahl von dir',
    origemDaEquipe: (por: string, quando: string) => `Von ${por} festgelegt, notiert am ${quando}`,
    origemVoceEm: (quando: string) => `Du hast diese Zahl am ${quando} festgelegt`,
    origemEmuda: (origem: string, muda: string) => `${origem}. ${muda}`,
    mudaPeso: 'Es ist der Zielpunkt, der mit deinem Team vereinbart ist, und daran zu rühren ändert den Maßstab des Verlaufs und der Entwicklung — ohne etwas von dem zu löschen, was schon eingetragen ist.',
    mudaOutros: 'Die Änderung gilt ab jetzt: die schon eingetragenen Tage behalten, was sie wert waren, und was sich ändert, ist das, womit sie verglichen werden.',

    travadoTitulo: (por: string) => `Festgelegt hat sie ${por}`,
    travadoTexto: 'Diese Zahl gehört zu deiner Behandlung, und deshalb wird sie hier nicht geändert. Wenn sie nicht mehr passt — eine andere Anweisung, eine Einschränkung, die aufgetaucht ist, ein neues Team —, entferne die Notiz im Medizin-Bereich, und sie gehört wieder dir.',
    divergeTitulo: 'Diese Zahl ist nicht die deines Teams',
    divergeTexto: (por: string, dela: string, nosso: string) =>
      `${por} hat ${dela} festgelegt, und wir rechnen mit ${nosso}. Wir heben beide auf: du kannst im Medizin-Bereich zu der deines Teams zurück, oder den Unterschied mit zum nächsten Termin nehmen.`,
    recomendadoTitulo: 'Das ist der empfohlene Wert',

    verAnotacao: 'Die Notiz deines Teams ansehen',
    anotacaoSub: (por: string, valor: string) => `${por} · ${valor}`,

    /* ---------- die Karte für ein neues Ziel ---------- */
    novaSub: 'Etwas von dir. Wir heben es für dich auf, und du hakst es selbst ab',
    escolhaOTipo: 'Wähl die Art',
    escrevaDoSeuJeito: 'Schreib es, wie du willst',

    guardarMeta: 'Ziel speichern',
    respondaParaGuardar: 'Antworte zum Speichern',
    prazoRotulo: 'Frist (optional)',

    /* ⚠️ DIE ANFÜHRUNGSZEICHEN GEHÖREN DER SPRACHE: Deutsch schreibt
       „unten und oben“, Englisch beide oben, Französisch die Spitzen. Nur
       deshalb ist der ganze Satz eine Funktion. */
    vaiAparecer: (frase: string, ate: string) => `So wird es aussehen: „${frase}“${ate}.`,
    vaiAparecerAte: (data: string) => `, bis zum ${data}`,
    aindaNaoAteMarcar: 'Es bleibt auf „noch nicht“, bis du es abhakst. An dem Tag, an dem es passiert, heben wir das Datum mit auf.',

    /* ---------- die Karte für ein Ziel aus der Liste ---------- */
    metaTitulo: 'Ziel',
    naoEncontrei: 'Ich habe dieses Ziel nicht gefunden',
    apagadaEmOutraTela: 'Es wurde vielleicht auf einem anderen Bildschirm gelöscht.',
    subPessoal: 'Dein eigenes Ziel, von dir abgehakt',
    subMedida: 'Ziel, gemessen an deinen Check-ins',

    conquistada: 'Erreicht',
    aindaNao: 'Noch nicht',
    consegui: 'Geschafft',
    aindaNaoConsegui: 'Doch noch nicht',
    apagar: 'Löschen',

    contamosPorVoce: 'Dieses zählen wir für dich',
    contamosTexto: 'Es kommt aus deinen Check-ins der letzten vierzehn Tage, und nur aus den Tagen, an denen du geantwortet hast. Es lässt sich nicht von Hand abhaken — und genau das macht die Zahl etwas wert.',
  },
};
