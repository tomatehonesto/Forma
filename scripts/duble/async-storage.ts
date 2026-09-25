/* O AsyncStorage das sondas: um mapa na memória, que dura o processo.

   O de verdade depende do módulo nativo, e numa sonda ele falha em
   silêncio — o `update` do store engole o erro, e nenhuma trava via o que
   seria gravado. Com este, a trava da sincronia confere o que a abertura
   grava (ver `hydrate`, em logic/store). */
const dados = new Map<string, string>();

const AsyncStorage = {
  getItem: async (chave: string) => dados.get(chave) ?? null,
  setItem: async (chave: string, valor: string) => { dados.set(chave, valor); },
  removeItem: async (chave: string) => { dados.delete(chave); },
  clear: async () => { dados.clear(); },
};

export default AsyncStorage;
