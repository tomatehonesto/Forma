import { T } from '../textos';

/* As quinze prateleiras da tabela de alimentos.

   ⚠️ SÃO CHAVES, E NÃO TEXTO DE TELA: `restricoes.ts` sugere fonte de
   proteína por prateleira e `conselhos.ts` conta o corredor verde por
   ela, comparando com estas palavras exatas — e as duas tabelas de
   lista de comidas as usa assim (ver scripts/gerar-comidas).

   ⚠️ EXISTE UMA CÓPIA EM servidor/prateleiras.ts, e ela precisa existir:
   o Metro não lê a pasta do servidor (ver metro.config.js), e a
   estimativa pelo nome tem de devolver uma destas. A sonda dos primeiros
   passos confere que as duas são iguais e que toda prateleira da tabela
   está aqui. */
export const PRATELEIRAS = [
  'Arroz, massas e pães',
  'Bebidas',
  'Café da manhã',
  'Carnes e aves',
  'Castanhas e sementes',
  'Doces e lanches',
  'Frutas',
  'Grãos e feijões',
  'Leite e queijos',
  'Molhos e gorduras',
  'Ovos',
  'Peixes e frutos do mar',
  'Pratos prontos',
  'Suplementos',
  'Verduras e legumes',
] as const;

/** O nome da prateleira no idioma de agora. A chave é a palavra em
    português, e é ela que fica gravada; a tela nunca a mostra crua. */
export const nomeDaPrateleira = (onde: string): string =>
  (T.alimentacao.prateleira as Record<string, string>)[onde] ?? onde;
