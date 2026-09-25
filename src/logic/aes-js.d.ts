/* A aes-js (3.1.2) não traz tipos. Isto declara só o que logic/nuvem usa
   para cifrar a sessão: o modo CTR, o contador e as conversões de texto e
   de hexadecimal. */
declare module 'aes-js' {
  export class Counter {
    constructor(valorInicial: number | Uint8Array);
  }
  export const ModeOfOperation: {
    ctr: new (chave: Uint8Array, contador?: Counter) => {
      encrypt(bytes: Uint8Array): Uint8Array;
      decrypt(bytes: Uint8Array): Uint8Array;
    };
  };
  export const utils: {
    utf8: { toBytes(texto: string): Uint8Array; fromBytes(bytes: Uint8Array): string };
    hex: { toBytes(texto: string): Uint8Array; fromBytes(bytes: Uint8Array): string };
  };
}
