/* ⚠️ UM DUBLE DE REACT NATIVE, e só para o congelamento.

   `logic/exportacao` importa `Platform` para decidir o nome do arquivo, e
   é o único módulo de lógica que toca react-native. Sem este duble, o
   congelamento perderia justamente o texto do relatório médico — que é
   onde um erro de extração tem o pior destino possível: a mão de uma
   médica.

   Nada aqui roda no aplicativo. O mapeamento vive em scripts/tsconfig,
   que só o script usa. */
export const Platform = { OS: 'ios' as const, select: (o: any) => o.ios ?? o.default };
