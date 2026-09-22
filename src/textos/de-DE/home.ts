import { medidas } from './medidas';

/* ============================================================
   DIE STARTSEITE UND DER VERLAUF — die Tagesziele, die Karten und der Zeitstrahl · de-DE

   ⚠️ Die Gründe stehen in ../pt-BR/home.ts. Die zwei, die bestimmen:

   JEDE ANGEZEIGTE ZAHL KOMMT MIT EINEM URTEIL, und das ist das Wort, das
   die Person zuerst sucht. Der Wert sagt das Maß; das Wort sagt, ob es
   gut ist. Ohne es rechnet sie selbst, und in einer Gesundheits-App
   rechnet sie falsch.

   UND KEIN URTEIL VON HIER BENOTET DIE PERSON. „Unter dem Ziel“ bewertet
   die Zahl; „du hast dich nicht genug angestrengt“ bewertete die, die sie
   erzeugt hat. Der Unterschied geht beim Übersetzen leicht verloren, und
   die ganze Datei hängt an ihm.
   ============================================================ */

/* ⚠️ DIE KÖRPERNAMEN KOMMEN AUS medidas.corpo und stehen nicht hier.
   Siehe ../pt-BR. */
export const home = {
  /* ⚠️ „ZIEL ERREICHT“ IST KEINE FEIER, ES IST EIN ZUSTAND. Es steht an
     derselben Stelle wie „Noch 27 g“ — dieselbe Zeile, die dasselbe von
     der anderen Seite sagt. Ein „Bravo!“ dort änderte, was die Karte
     ist. */
  metas: {
    proteina: 'Eiweißzufuhr',
    agua: 'Mehr Wasser trinken',
    exercicio: 'Täglich bewegen',
    batida: 'Ziel erreicht',
    faltamProteina: (gramas: number) => `Noch ${gramas} g`,
    /* Die Menge kommt fertig geschrieben an, in der Einheit derjenigen,
       die liest. */
    faltamAgua: (quanto: string) => `Noch ${quanto}`,
    faltamExercicio: (minutos: number) => `Noch ${minutos} Min.`,
  },

  /* ⚠️ „NAH AM ZIEL“ IST EINE GUTE NACHRICHT, und das ist Absicht: 85 %
     des Eiweißziels sind ein guter Tag, und das „unter“ zu nennen bringt
     der Person bei, das Wort zu überlesen. Die dritte Stufe gibt es,
     damit die erste weiterhin etwas bedeutet. */
  veredito: {
    naMeta: 'Am Ziel',
    pertoDaMeta: 'Nah am Ziel',
    abaixoDaMeta: 'Unter dem Ziel',
    /* ⚠️ „FALLEND“ IST DER AST, DER DIE KÖRPERFETT-KARTE RETTET. Wer über
       dem Ziel liegt, aber seit Beginn fällt, scheitert nicht — sie ist
       auf halbem Weg, und dort sind fast alle. */
    emQueda: 'Fallend',
    acimaDaMeta: 'Über dem Ziel',
  },

  /* ⚠️ DER TITEL ÄNDERT SICH MIT, und nicht nur die Zahl. „Gewicht
     verloren“ über „+3,3 kg“ ist ein Widerspruch innerhalb derselben
     Karte — und das falsche Wort tut mehr weh als die Zahl. */
  peso: {
    perdido: 'Gewicht verloren',
    variacao: 'Gewichtsveränderung',
    meta: (quanto: string, unidade: string) => `Ziel: ${quanto} ${unidade}`,
  },

  /* ⚠️ „UNVERÄNDERT“, UND NICHT „−0,0“. Eine Zahl, die sich nicht bewegt
     hat, ist in keine Richtung gegangen, und das Wort ist dieses. Es ist
     weder eine gute noch eine schlechte Nachricht. */
  estavel: 'Unverändert',

  tipos: {
    checkin: 'Check-ins',
    aplicacao: 'Injektionen',
    peso: 'Gewicht',
    refeicao: 'Mahlzeiten',
    exercicio: 'Bewegung',
    consulta: 'Termine',
    exame: 'Befunde',
  },

  evento: {
    aplicacao: (dose: string, unidade: string) => `Injektion ${dose} ${unidade}`,
    peso: 'Gewicht',
    /* Die erste Wiegung hat keine vorherige zum Vergleich, also steht
       statt der Veränderung, was sie ist. */
    pesoInicial: 'Startgewicht',
    checkin: 'Check-in',
    exercicio: 'Einheit',
    minDeMovimento: (minutos: number) => `${minutos} Min. Bewegung`,
    proteinaDaRefeicao: (quanto: string) => `Eiweiß ${quanto}`,
    consulta: (tipo: string) => `Termin ${tipo}`,
    marcadoresDe: (quantos: number, fonte: string) => `${quantos} Marker · ${fonte}`,
    marcadoresDetalhe: (nome: string, quantos: number, fonte: string) =>
      `${nome} · ${quantos} Marker · ${fonte}`,
    compartilhado: 'Geteilt',

    gramasDeProteina: (gramas: number) => `${gramas} g Eiweiß`,
    horasDeSono: (horas: number) => `${horas} Std. Schlaf`,

    /* ⚠️ DAS URTEIL DES TAGES KOMMT AUS DER STIMMUNG, und die drei Wörter
       sind mit Absicht kurz: sie stehen in der rechten Spalte, neben einer
       Zahl. „Schwer“ ist das wichtigste der drei — es benennt den
       schlechten Tag, ohne ihn ein Scheitern zu nennen. */
    diaBem: 'Gut',
    diaNeutro: 'Neutral',
    diaDificil: 'Schwer',

    respostaHumor: 'Stimmung',
    respostaEnergia: 'Energie',
    respostaFome: 'Hunger',
    respostaOutroSintoma: 'Anderes Symptom',
  },

  /* ⚠️ DIE ZUSAMMENFASSUNG ERZÄHLT, WAS DIE WOCHE EINGEBRACHT HAT, sie
     listet nicht auf, was passiert ist. Daher hat jeder Typ seinen eigenen
     Singular und Plural — „1 Wiegung“ und „3 Wiegungen“ —, und kein
     angehängtes „(s)“.

     ⚠️ UND KEINER DIESER PLURALE IST REGELMÄSSIG: Mahlzeit/Mahlzeiten,
     Einheit/Einheiten, Termin/Termine, Befund/Befunde. Genau derselbe
     Grund, aus dem in conquistas.ts der Plural Pflichtfeld ist. */
  semana: {
    checkin: ['Check-in', 'Check-ins'] as [string, string],
    peso: ['Wiegung', 'Wiegungen'] as [string, string],
    refeicao: ['Mahlzeit', 'Mahlzeiten'] as [string, string],
    exercicio: ['Einheit', 'Einheiten'] as [string, string],
    consulta: ['Termin', 'Termine'] as [string, string],
    exame: ['Befund', 'Befunde'] as [string, string],
    contagem: (quantos: number, nome: string) => `${quantos} ${nome}`,
    /* ⚠️ EINE LEERE WOCHE HAT IHREN EIGENEN SATZ, und keine Lücke: eine
       Woche ohne Eintrag hat stattgefunden, und ihr Kapitel gibt es. */
    semRegistros: 'Keine Einträge in dieser Woche',

    hidratacao: 'Trinken',
    proteina: 'Eiweiß',
    exercicioMetrica: 'Bewegung',
    pesoMetrica: 'Gewicht',
    litrosPorDia: (quanto: string) => `${quanto} L/Tag`,
    gramasPorDia: (quanto: number) => `${quanto} g/Tag`,
    minutos: (quanto: number) => `${quanto} Min.`,
    deltaLitros: (quanto: string) => `${quanto} L`,
    deltaGramas: (quanto: string) => `${quanto} g`,
    deltaMinutos: (quanto: string) => `${quanto} Min.`,
  },

  mudancas: {
    peso: medidas.corpo.peso,
    cintura: medidas.corpo.cintura,
    gorduraCorporal: medidas.corpo.gordura,
    /* ⚠️ DIE EINZIGE, BEI DER STEIGEN DIE GUTE NACHRICHT IST: Muskel, der
       beim Abnehmen verloren geht, ist das, was die Behandlung zu
       vermeiden versucht. Die Beschriftung sagt das nicht — das sagt der
       Ton —, aber wer übersetzt, muss es wissen. */
    massaMagra: medidas.corpo.massaMagra,
    naReferencia: 'Im Referenzbereich',
    foraDaReferencia: 'Außerhalb der Referenz',
    pressao: 'Blutdruck',
    /* ⚠️ „UNVERÄNDERT“ WAR DAS, WAS VON ALLEM ÜBRIG BLIEB, WAS KEIN FALLEN
       WAR, und ein Blutdruck, der um vierzehn Punkte stieg, kam als
       unverändert heraus — in Grün. Steigen hat einen Namen. */
    pressaoEmQueda: 'Fallend',
    pressaoEmAlta: 'Steigend',
    pressaoEstavel: 'Unverändert',
  },

  metaDePeso: {
    /* „68 kg erreichen“, und nicht „Ziel: 68 kg“: die Liste besteht aus
       Dingen, die man erreichen will, und das Verb ist es, was die Zeile
       wie eines davon aussehen lässt. */
    chegarA: (peso: string) => `${peso} erreichen`,
    alcancada: 'Ziel erreicht',
    faltam: (quanto: string) => `noch ${quanto}`,
  },

  /* ⚠️ NUR DER NAME VON APPLE ÄNDERT SICH MIT DER SPRACHE — und im
     Deutschen ändert er sich nicht: Apple nennt die App auch hier „Apple
     Health“. Health Connect, Garmin, Fitbit und Withings sind Marken und
     bleiben im Code. */
  fontes: {
    appleSaude: 'Apple Health',
  },

  /* ⚠️ DER VERLAUFS-BILDSCHIRM WOHNT IN `home`, weil es dasselbe Gespräch
     ist — die Typ-Etiketten und die Wochenplurale standen schon hier.
     Siehe ../pt-BR/home für die drei Arten von Schweigen.

     ⚠️ UND KEIN `toLowerCase()` AM SYMPTOMNAMEN: „übelkeit an 3 Tagen“
     wäre ein Rechtschreibfehler. Dieselbe Regel wie `comum.noMeio`. */
  tela: {
    ultimos7: 'DEINE LETZTEN 7 TAGE',
    /* ⚠️ „Dosis“ GROSS, und im Portugiesischen klein: dort öffnet das Wort
       keinen Satz, hier ist es ein Substantiv. */
    doseEm: (quando: string) => `Dosis ${quando}`,
    diasComCheckin: (feitos: number, aplicadas: number, vividas: number) =>
      `${feitos} von 7 Tagen mit Check-in · ${aplicadas} von ${vividas} Wochen mit Injektion`,
    semanaASemana: 'Woche für Woche. Tipp darauf, um zu sehen, was jeden Zyklus geprägt hat.',
    semanaEDia: (semana: number, dia: number) => `WOCHE ${semana} · TAG ${dia}`,
    noInicio: (peso: string) => `${peso} am Anfang`,
    hoje: 'heute',
    faltam: (peso: string) => `noch ${peso}`,

    protocolos: 'Protokolle',
    sinaisVitais: 'Vitalwerte',
    refeicoesContadas: (quantas: number) => `${quantas} Mahlzeiten`,
    aguaHoje: (quanto: string) => `${quanto} heute`,
    minutosHoje: (minutos: number) => `${minutos} Min. heute`,
    indicadores: (quantos: number) => `${quantos} ${quantos === 1 ? 'Wert' : 'Werte'}`,
    feitasDeTotal: (feitas: number, total: number) => `${feitas} von ${total}`,

    semRegistro: 'nichts eingetragen',
    semQueixas: 'keine Beschwerden diese Woche',
    sintomaEmDias: (sintoma: string, dias: number) =>
      `${sintoma} an ${dias} ${dias === 1 ? 'Tag' : 'Tagen'}`,

    dosesNaCaneta: (restam: number, total: number, semanas: number) =>
      `${restam} von ${total} Dosen im Pen · rund ${semanas} ${semanas === 1 ? 'Woche' : 'Wochen'}`,

    oQueJaMudou: 'Was sich geändert hat',
    evolucao: 'Entwicklung',
    suasMetas: 'Deine Ziele',
    metas: 'Ziele',
    oDiaADia: 'Der Alltag',
    seuTratamento: 'Deine Behandlung',
    verTudo: 'Alles ansehen',

    porSemana: 'Nach Woche',
    semana: (numero: number) => `Woche ${numero}`,
    doseAjustada: 'Dosis angepasst',
    semRegistrosNaSemana: 'Nichts in dieser Woche eingetragen.',
    nadaNesteTipo: 'In dieser Art ist noch nichts eingetragen',

    metaFeita: 'erreicht',
    metaAberta: 'offen',
  },
};
