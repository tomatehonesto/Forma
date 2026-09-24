/* ============================================================
   DAS LESEN DER BEFUNDE — die Zusammenfassung der Abnahme und der einzelne Marker · de-DE

   ⚠️ Die Gründe stehen in ../pt-BR/exames.ts. Was die Marker SIND, steht
   in textos/de-DE/marcadores. Hier steht, was über die Zahlen derjenigen
   gesagt wird, die den Bildschirm geöffnet hat.

   ⚠️⚠️ NICHTS HIER MEINT ETWAS, ALLES HIER ZÄHLT. Wie viele außerhalb der
   Referenz lagen, wie weit ein Wert gewandert ist, in welche Richtung.
   Das ist Arithmetik in Satzform — und zwar mit Absicht: die Fassung
   davor war ein von Hand geschriebener Absatz mit den Zahlen EINER
   Person, und behauptete „deine Werte haben sich verbessert“ auch
   gegenüber denen, bei denen sie schlechter geworden waren.

   ⚠️ UND DIE RICHTUNG ERSCHEINT NUR, WENN DER MARKER SAGT, WELCHE SEITE
   DIE GUTE IST. Kreatinin oder TSH, die steigen, sind für sich genommen
   weder gute noch schlechte Nachricht; eine Richtung Besserung zu nennen,
   ohne das zu wissen, wäre Meinung. Ohne das hört der Satz bei der
   Tatsache auf: „ist um 20 gestiegen“.

   ⚠️ UND JEDES LESEN ENDET DAMIT, DEN BEFUND AN DIE ZURÜCKZUGEBEN, DIE
   DIE PERSON BEHANDELN. Der letzte Satz ist keine Rechtsfußnote — er ist
   die Wahrheit darüber, was ein einzelner Befund sagen kann.
   ============================================================ */

export const exames = {
  /* ============================================================
     DIE ZUSAMMENFASSUNG DER ABNAHME — der Satz auf der Deckkarte
     ============================================================ */
  resumo: {
    /* Vier Fassungen derselben Tatsache, und der Unterschied ist nur die
       Anzahl: keiner, einer, wenige genug für eine Aufzählung, oder zu
       viele zum Aufzählen. */
    todosDentro: (quantos: number) =>
      `Die ${quantos} Marker dieser Abnahme liegen im Referenzbereich des Labors.`,
    umFora: (total: number, qual: string) =>
      `Einer der ${total} Marker dieser Abnahme lag außerhalb des Referenzbereichs: ${qual}.`,
    algunsFora: (fora: number, total: number, quais: string) =>
      `${fora} von ${total} Markern dieser Abnahme lagen außerhalb des Referenzbereichs: ${quais}.`,
    /* ⚠️ AB VIER REICHT DIE ZAHL. Die Zusammenfassung sitzt auf einer
       Deckkarte fester Höhe, und acht Namen hintereinander schieben den
       Absatz aus ihr heraus — und selbst wenn sie hineinpassten, liest man
       eine Achterliste mitten im Satz nicht, man zählt sie. Die Liste derer,
       die außerhalb lagen, steht direkt darunter. */
    muitosFora: (fora: number, total: number) =>
      `${fora} von ${total} Markern dieser Abnahme lagen außerhalb des Referenzbereichs.`,

    /* Das Datumsstück, das den zweiten Satz eröffnet, wenn es Vorwerte
       gibt. Es bringt sein Komma mit, weil es an den nächsten Satz
       anschließt. */
    desde: (data: string) => ` Seit dem ${data}`,
    melhoraUm: (desde: string, qual: string, de: string, para: string, unidade: string) =>
      `${desde} ist ein Marker in die erwartete Richtung gegangen, und die größte Veränderung war bei ${qual}: von ${de} auf ${para} ${unidade}.`,
    melhoraVarios: (desde: string, quantos: number, qual: string, de: string, para: string, unidade: string) =>
      `${desde} sind ${quantos} Marker in die erwartete Richtung gegangen, und die größte Veränderung war bei ${qual}: von ${de} auf ${para} ${unidade}.`,

    /* ⚠️ DIE VERSCHLECHTERUNG STEHT IM SELBEN SATZ UND MIT DEMSELBEN
       GEWICHT WIE DIE VERBESSERUNG. Eine Zusammenfassung, die nur erzählt,
       was besser wurde, ist Werbung, und wer ein Blutbild liest, braucht
       beide Hälften. */
    pioraUm: (qual: string) => ` Ein Marker ging in die andere Richtung: ${qual}.`,
    pioraPoucos: (quantos: number, quais: string) =>
      ` ${quantos} Marker gingen in die andere Richtung: ${quais}.`,
    pioraMuitos: (quantos: number) => ` ${quantos} Marker gingen in die andere Richtung.`,
  },

  /* ============================================================
     DAS LESEN EINES MARKERS

     ⚠️ DIE SCHLAGZEILE IST ZUSTAND + WAS AUF DEM SPIEL STEHT, und war
     einmal Zustand + Richtung. „Liegt im Bereich und geht in die erwartete
     Richtung“ ist richtig und fügt nichts hinzu: die Richtung kündigt die
     Verlaufskarte drei Zentimeter darüber schon an. Was kein anderes Stück
     des Bildschirms sagt, ist, WARUM diese Zahl zählt — und ein Wert
     außerhalb des Bereichs ohne das ist ein Alarm ohne Thema.

     ⚠️ UND DIE SCHLAGZEILE NENNT DEN MARKER NICHT BEIM NAMEN. „Dein
     HbA1c“ / „Deine Ferritin“ verlangte eine Genustabelle pro Marker, um
     im Deutschen richtig zu schreiben — dasselbe Problem wie im
     Portugiesischen, und im Deutschen mit drei Genera statt zwei. „Dieses
     Ergebnis“ ist immer richtig, und der Name steht oben in der Leiste.

     ⚠️ `afeta` KOMMT AUS textos/de-DE/marcadores, und der Rahmen des
     Satzes hält die Einschränkung: „macht einen Unterschied für die
     Gesundheit der Arterien“ spricht vom Gebiet; „wird deine Arterien
     verstopfen“ wäre eine Prognose.
     ============================================================ */
  leitura: {
    acima: 'oberhalb',
    abaixo: 'unterhalb',

    dentroSemAfeta: 'Dieses Ergebnis liegt innerhalb des Referenzbereichs des Labors.',
    foraSemAfeta: (lado: string) =>
      `Dieses Ergebnis liegt ${lado} des Referenzbereichs des Labors.`,
    dentroComAfeta: (afeta: string) =>
      `Dieses Ergebnis liegt innerhalb des Referenzbereichs, und das ist ein gutes Zeichen ${afeta}.`,
    foraComAfeta: (lado: string, afeta: string) =>
      `Dieses Ergebnis liegt ${lado} des Referenzbereichs, und das macht einen Unterschied ${afeta}.`,

    /* Der Bereich, den das Labor geschrieben hat, in den drei Formen, in
       denen er auf einem Befund auftaucht. */
    faixaEntre: (min: string, max: string, unidade: string) => `zwischen ${min} und ${max}${unidade}`,
    faixaAbaixoDe: (max: string, unidade: string) => `unter ${max}${unidade}`,
    faixaAcimaDe: (min: string, unidade: string) => `über ${min}${unidade}`,

    /* ⚠️ DIE RICHTUNG HAT DEN SCHLUSS BEKOMMEN, DER IN DER SCHLAGZEILE
       STAND: es geht nicht nur darum, dass der Wert gestiegen ist, sondern
       WOHIN. Die vier Fassungen decken innerhalb oder außerhalb des
       Bereichs ab, gekreuzt mit der guten oder der schlechten Seite. */
    rumoDentroBom: ', in die erwartete Richtung',
    rumoDentroRuim: ', entgegen der erwarteten Richtung',
    rumoForaBom: ', auf die Referenz zu',
    rumoForaRuim: ', von ihr weg',
    subiu: 'gestiegen',
    caiu: 'gefallen',
    /* ⚠️ DEUTSCH SCHIEBT DAS PARTIZIP ANS ENDE, und deshalb steht `verbo`
       hier hinter der Menge und nicht davor: „Seit dem 3. Mai ist er um
       0,4 % gestiegen“. Wer die portugiesische Wortstellung übernimmt,
       bekommt „ist er gestiegen 0,4 %“. */
    andou: (data: string, verbo: string, quanto: string, unidade: string, rumo: string) =>
      ` Seit dem ${data} ist er um ${quanto}${unidade} ${verbo}${rumo}.`,

    /* ⚠️ DAS IST DER EINZIGE SATZ DES BILDSCHIRMS, DER ÜBER DIESEN MARKER
       HINAUSSCHAUT.

       Eine Zahl außerhalb des Bereichs, allein gelesen, wird zur ganzen
       Welt derjenigen, die sie liest — und was das entschärft, steht nicht
       im Marker, es steht in der Übersicht: zu wissen, dass die anderen
       vierzehn gut waren, ändert die Größe dieses einen. */
    painelTudoDentro: (total: number) =>
      ` Die ${total} Marker dieses Befunds liegen im Referenzbereich.`,
    painelEsteNao: (total: number, fora: number, plural: boolean) =>
      ` Von den ${total} Markern dieses Befunds ${plural ? 'lagen' : 'lag'} ${fora} außerhalb des Referenzbereichs; dieser nicht.`,
    painelUnicoFora: (total: number) =>
      ` Von den ${total} Markern dieses Befunds ist dieser der einzige außerhalb des Referenzbereichs.`,
    painelEsteEUmDeles: (total: number, fora: number) =>
      ` Von den ${total} Markern dieses Befunds liegen ${fora} außerhalb des Referenzbereichs, und dieser ist einer davon.`,

    /* ⚠️ DER LETZTE SATZ WIRD NICHT WEGGELASSEN. „Ein einzelner Befund
       entscheidet nichts“ ist das, was das ganze Lesen davon abhält, eine
       Diagnose zu werden, und „wer dich behandelt“ stimmt in allen drei
       Fällen — mit Team, mit einzelner Ärztin, und ohne jemanden. Die
       Fassung davor nannte allen den Namen der Ärztin aus dem
       Demo-Datensatz, auch denen ohne Ärztin. */
    corpo: (data: string, valor: string, unidade: string, faixa: string, andou: string, painel: string) =>
      `Bei der Abnahme am ${data} lag der Wert bei ${valor}${unidade}, und die Referenz des Labors ist ${faixa}.${andou}${painel} Ein einzelner Befund entscheidet nichts: wer ihn mit dem Rest deiner Geschichte zusammenbringt, ist, wer dich behandelt.`,
  },

  tela: {
    titulo: 'Befunde',
    linha: (quantos: number, ultimaColeta: string) =>
      `${quantos} Marker · letzte Abnahme am ${ultimaColeta}`,
    foraDaReferencia: 'außerhalb des Referenzbereichs',
    naReferencia: 'im Referenzbereich',
    blocoFora: 'Außerhalb des Referenzbereichs',
    arquivosImportados: 'Eingelesene Dateien',
    fonteFoto: 'Foto',
    arquivoSub: (marcadores: number, fonte: string, data: string) =>
      `${marcadores} Marker · ${fonte} · ${data}`,
    importar: 'Befund einlesen',
    enviarAoMedico: 'An die Praxis schicken',

    linhaVazia: 'Noch keine Werte',
    vazioTitulo: 'Hier steht noch kein Wert',
    vazioTexto: 'Du hast noch keinen Wert eingetragen. Sobald der erste da ist, steht er hier mit seinem Referenzbereich und dem, was der bedeutet.',
    vazioAcao: 'Einen Wert eintragen',

    colhidoEm: (data: string) => `Abgenommen am ${data}`,
    vereditoOk: 'Im Referenzbereich',
    vereditoAlto: 'Über dem Referenzbereich',
    vereditoBaixo: 'Unter dem Referenzbereich',
    vereditoComFaixa: (veredito: string, faixa: string) => `${veredito}: ${faixa}`,
    faixaEntre: (minimo: string, maximo: string, unidade: string) =>
      `zwischen ${minimo} und ${maximo}${unidade}`,
    faixaAbaixo: (maximo: string, unidade: string) => `unter ${maximo}${unidade}`,
    faixaAcima: (minimo: string, unidade: string) => `über ${minimo}${unidade}`,
    faixaRef: (referencia: string, unidade: string) => `${referencia}${unidade}`,
    refCurta: (referencia: string) => ` · Ref. ${referencia}`,

    /* Os selos da LISTA, em caixa baixa e curtos: ali eles cabem ao lado
       do número, e o veredito por extenso mora no detalhe. */
    seloOk: 'im Referenzbereich',
    seloAlto: 'darüber',
    seloBaixo: 'darunter',
    seloEnviado: 'gesendet',

    sobre: 'DAZU',

    evolucao: 'VERLAUF',
    deAte: (primeiro: string, ultimo: string) => `Von ${primeiro} auf ${ultimo}`,
    coletasDesde: (quantas: number, data: string) =>
      `${quantas} ${quantas === 1 ? 'Abnahme' : 'Abnahmen'} seit ${data}`,
    deltaEsperado: ' · wie erwartet',
    deltaOposto: ' · andersherum',

    oQueSignifica: 'WAS DAS HEISST',
    oQueAjuda: 'Was meistens hilft',
    oQueMexe: 'Was den Wert außerdem bewegt',
    rodape: 'Das sind die häufigsten Ursachen und Wege, nicht die ganze Liste. Eine Dosis oder ein Medikament zu ändern ist die Entscheidung der Person, die dich begleitet.',
    perguntarSobre: 'Zu diesem Befund fragen',
    perguntaCompanion: (marcador: string) => `Erklär mir meinen ${marcador}-Befund`,
  },
};
