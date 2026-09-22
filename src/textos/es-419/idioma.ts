/* ============================================================
   EL IDIOMA — la primera pregunta del registro, y la hoja del perfil · es-419

   ⚠️ Las razones viven en ../pt-BR/idioma.ts. La que manda: este es el
   único texto de la aplicación que alguien puede leer sin entender.
   Aparece antes de que la persona elija el idioma, y por eso sale en el
   que el dispositivo indicó — que es la mejor apuesta, no una certeza.
   Quien no entienda la pregunta igual puede responder, porque cada opción
   se escribe en su propia lengua: lo que salva la pantalla es la lista, no
   la frase.
   ============================================================ */

export const idioma = {
  pergunta: '¿En qué idioma quieres leer?',
  sub: 'Esto cambia el texto, los números y las fechas. Puedes cambiarlo después, en tu perfil.',

  pais: 'País',
  paisRotulo: 'Dónde te tratas',
  paisRessalva: 'Cambia qué medicamentos aparecen primero, la moneda y la tabla de alimentos. Nada desaparece de la lista: lo menos común ahí queda más abajo.',

  titulo: 'Idioma · Language',
  tituloSub: 'Cambia el texto, los números y las fechas.',
  rotulo: 'Cómo lees la aplicación',

  /* ⚠️ LA SALVEDAD ES LA PARTE QUE SORPRENDE. Cambiar de idioma cambia
     también el separador decimal y el dibujo de la fecha. Lo que NO cambia
     es lo que ya quedó registrado, y decirlo es lo que quita el miedo de
     tocar. */
  ressalva: 'Lo que ya registraste se queda como está. Cambia solo la forma de escribir: la palabra, la coma del número, el dibujo de la fecha y el reloj.',

  linhaDoPerfil: 'Idioma',
};
