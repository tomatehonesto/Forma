/* ============================================================
   OS MODOS FINGIDOS — ver o aplicativo de quem não tem clínica parceira

   O `MODOS.md`, na raiz, descreve três situações de quem usa, e a semente
   só sabe construir duas: a Mariana, que veio por clínica credenciada, e
   a pessoa em branco de `estadoVazio`, que não tem registro nenhum. Falta
   justamente a do meio — alguém com setenta e um dias de tratamento e SEM
   plataforma do outro lado —, que é o estado da maioria de quem usa
   GLP-1 e o único que existe fora do Brasil.

   ⚠️⚠️ ISTO NÃO ESCREVE NADA, E É O PONTO. O modo vive em memória: a
   store guarda o estado verdadeiro de lado e serve um clone mascarado no
   lugar dele, sem tocar no AsyncStorage. Recarregar o aplicativo devolve
   a verdade, e nenhum registro da Mariana corre risco — é a regra da
   casa, a mesma que impede "apagar meus dados" de devolver a semente.

   ⚠️ E É VALOR DE MÓDULO PELA MESMA RAZÃO QUE O IDIOMA É. Enfiar o modo
   no estado faria dele um dado persistido, que é exatamente o que ele não
   pode ser; enfiá-lo num contexto faria toda tela que o lê virar
   consumidora de contexto. Ele mora aqui, e quem precisa pergunta —
   `_layout` para remontar a árvore, `perfil` para ligar e desligar.

   ⚠️ SÃO DOIS MODOS E NÃO UM, porque são duas telas diferentes. Sem
   clínica mas com médico próprio, a pessoa continua tendo consulta,
   resumo para levar e Área médica; sem ninguém, o aplicativo inteiro
   passa a oferecer a porta de entrada no lugar disso. Ver o segundo não
   prova o terceiro.
   ============================================================ */

/** `sem-parceira` é o modo 2 do MODOS.md — médico próprio, fora da
    plataforma. `sozinha` é o modo 3 — ninguém acompanhando. */
export type Modo = 'sem-parceira' | 'sozinha';

let fingido: Modo | null = null;

export const modoFingido = (): Modo | null => fingido;

/** Só a store chama isto, e junto de trocar o `S`. Chamar solto deixaria
    o valor e o estado discordando, que é a única forma de isto quebrar. */
export const fingirModo = (m: Modo | null) => { fingido = m; };

/** O rótulo do modo, para a chave de remontagem e para a linha do perfil.
    Em português e sem catálogo: o bloco que o usa é `__DEV__` e some na
    compilação de produção. */
export const NOME_DO_MODO: Record<Modo, string> = {
  'sem-parceira': 'sem clínica parceira',
  'sozinha': 'sem acompanhamento',
};
