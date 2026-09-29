/* As medidas caseiras, nos seis idiomas: [singular, plural].

   A chave é a palavra em português, e é ela que fica gravada na
   curadoria de cada comida. A medida é uma só por comida — o peso dela
   (gUn) não muda de idioma —, e só a palavra muda. */
export const UNIDADES = {
  'filé':      { 'pt-BR': ['filé', 'filés'], 'en-US': ['fillet', 'fillets'], 'es-419': ['filete', 'filetes'], 'fr-FR': ['filet', 'filets'], 'de-DE': ['Filet', 'Filets'], 'it-IT': ['filetto', 'filetti'] },
  'pedaço':    { 'pt-BR': ['pedaço', 'pedaços'], 'en-US': ['piece', 'pieces'], 'es-419': ['trozo', 'trozos'], 'fr-FR': ['morceau', 'morceaux'], 'de-DE': ['Stück', 'Stück'], 'it-IT': ['pezzo', 'pezzi'] },
  'unidade':   { 'pt-BR': ['unidade', 'unidades'], 'en-US': ['unit', 'units'], 'es-419': ['unidad', 'unidades'], 'fr-FR': ['unité', 'unités'], 'de-DE': ['Stück', 'Stück'], 'it-IT': ['unità', 'unità'] },
  'bife':      { 'pt-BR': ['bife', 'bifes'], 'en-US': ['steak', 'steaks'], 'es-419': ['bistec', 'bistecs'], 'fr-FR': ['steak', 'steaks'], 'de-DE': ['Steak', 'Steaks'], 'it-IT': ['bistecca', 'bistecche'] },
  'medalhão':  { 'pt-BR': ['medalhão', 'medalhões'], 'en-US': ['medallion', 'medallions'], 'es-419': ['medallón', 'medallones'], 'fr-FR': ['médaillon', 'médaillons'], 'de-DE': ['Medaillon', 'Medaillons'], 'it-IT': ['medaglione', 'medaglioni'] },
  'fatia':     { 'pt-BR': ['fatia', 'fatias'], 'en-US': ['slice', 'slices'], 'es-419': ['rebanada', 'rebanadas'], 'fr-FR': ['tranche', 'tranches'], 'de-DE': ['Scheibe', 'Scheiben'], 'it-IT': ['fetta', 'fette'] },
  'colher':    { 'pt-BR': ['colher', 'colheres'], 'en-US': ['spoonful', 'spoonfuls'], 'es-419': ['cucharada', 'cucharadas'], 'fr-FR': ['cuillerée', 'cuillerées'], 'de-DE': ['Löffel', 'Löffel'], 'it-IT': ['cucchiaio', 'cucchiai'] },
  'porção':    { 'pt-BR': ['porção', 'porções'], 'en-US': ['serving', 'servings'], 'es-419': ['porción', 'porciones'], 'fr-FR': ['portion', 'portions'], 'de-DE': ['Portion', 'Portionen'], 'it-IT': ['porzione', 'porzioni'] },
  'gomo':      { 'pt-BR': ['gomo', 'gomos'], 'en-US': ['link', 'links'], 'es-419': ['pieza', 'piezas'], 'fr-FR': ['saucisse', 'saucisses'], 'de-DE': ['Wurst', 'Würste'], 'it-IT': ['salsiccia', 'salsicce'] },
  'costela':   { 'pt-BR': ['costela', 'costelas'], 'en-US': ['rib', 'ribs'], 'es-419': ['costilla', 'costillas'], 'fr-FR': ['côte', 'côtes'], 'de-DE': ['Rippchen', 'Rippchen'], 'it-IT': ['costina', 'costine'] },
  'posta':     { 'pt-BR': ['posta', 'postas'], 'en-US': ['steak', 'steaks'], 'es-419': ['rodaja', 'rodajas'], 'fr-FR': ['pavé', 'pavés'], 'de-DE': ['Stück', 'Stück'], 'it-IT': ['trancio', 'tranci'] },
  'lata':      { 'pt-BR': ['lata', 'latas'], 'en-US': ['can', 'cans'], 'es-419': ['lata', 'latas'], 'fr-FR': ['boîte', 'boîtes'], 'de-DE': ['Dose', 'Dosen'], 'it-IT': ['scatoletta', 'scatolette'] },
  'pote':      { 'pt-BR': ['pote', 'potes'], 'en-US': ['cup', 'cups'], 'es-419': ['vaso', 'vasos'], 'fr-FR': ['pot', 'pots'], 'de-DE': ['Becher', 'Becher'], 'it-IT': ['vasetto', 'vasetti'] },
  'copo':      { 'pt-BR': ['copo', 'copos'], 'en-US': ['glass', 'glasses'], 'es-419': ['vaso', 'vasos'], 'fr-FR': ['verre', 'verres'], 'de-DE': ['Glas', 'Gläser'], 'it-IT': ['bicchiere', 'bicchieri'] },
  'scoop':     { 'pt-BR': ['scoop', 'scoops'], 'en-US': ['scoop', 'scoops'], 'es-419': ['medida', 'medidas'], 'fr-FR': ['dose', 'doses'], 'de-DE': ['Messlöffel', 'Messlöffel'], 'it-IT': ['misurino', 'misurini'] },
  'concha':    { 'pt-BR': ['concha', 'conchas'], 'en-US': ['ladle', 'ladles'], 'es-419': ['cucharón', 'cucharones'], 'fr-FR': ['louche', 'louches'], 'de-DE': ['Kelle', 'Kellen'], 'it-IT': ['mestolo', 'mestoli'] },
  'prato':     { 'pt-BR': ['prato', 'pratos'], 'en-US': ['plate', 'plates'], 'es-419': ['plato', 'platos'], 'fr-FR': ['assiette', 'assiettes'], 'de-DE': ['Teller', 'Teller'], 'it-IT': ['piatto', 'piatti'] },
  'xícara':    { 'pt-BR': ['xícara', 'xícaras'], 'en-US': ['cup', 'cups'], 'es-419': ['taza', 'tazas'], 'fr-FR': ['tasse', 'tasses'], 'de-DE': ['Tasse', 'Tassen'], 'it-IT': ['tazza', 'tazze'] },
  'punhado':   { 'pt-BR': ['punhado', 'punhados'], 'en-US': ['handful', 'handfuls'], 'es-419': ['puñado', 'puñados'], 'fr-FR': ['poignée', 'poignées'], 'de-DE': ['Handvoll', 'Handvoll'], 'it-IT': ['manciata', 'manciate'] },
  'tolete':    { 'pt-BR': ['tolete', 'toletes'], 'en-US': ['piece', 'pieces'], 'es-419': ['trozo', 'trozos'], 'fr-FR': ['morceau', 'morceaux'], 'de-DE': ['Stück', 'Stück'], 'it-IT': ['pezzo', 'pezzi'] },
  'rodela':    { 'pt-BR': ['rodela', 'rodelas'], 'en-US': ['ring', 'rings'], 'es-419': ['rodaja', 'rodajas'], 'fr-FR': ['rondelle', 'rondelles'], 'de-DE': ['Ring', 'Ringe'], 'it-IT': ['anello', 'anelli'] },
  'tigela':    { 'pt-BR': ['tigela', 'tigelas'], 'en-US': ['bowl', 'bowls'], 'es-419': ['tazón', 'tazones'], 'fr-FR': ['bol', 'bols'], 'de-DE': ['Schüssel', 'Schüsseln'], 'it-IT': ['ciotola', 'ciotole'] },
  'espetinho': { 'pt-BR': ['espetinho', 'espetinhos'], 'en-US': ['skewer', 'skewers'], 'es-419': ['brocheta', 'brochetas'], 'fr-FR': ['brochette', 'brochettes'], 'de-DE': ['Spieß', 'Spieße'], 'it-IT': ['spiedino', 'spiedini'] },
  'bola':      { 'pt-BR': ['bola', 'bolas'], 'en-US': ['scoop', 'scoops'], 'es-419': ['bola', 'bolas'], 'fr-FR': ['boule', 'boules'], 'de-DE': ['Kugel', 'Kugeln'], 'it-IT': ['pallina', 'palline'] },
};
