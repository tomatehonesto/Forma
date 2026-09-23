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

/* ============================================================
   A PRÉVIA DE IDIOMA — a mesma ideia, para a outra pergunta

   ⚠️ E ELA NÃO É A TELA DE IDIOMA. O perfil já tem a linha "Idioma", que
   abre a folha e troca de verdade: escreve `profile.idioma`, sobrevive a
   fechar o aplicativo e é o ajuste de quem usa. Esta é a versão de
   desenvolvimento da mesma troca — um toque, sem gravar, e recarregar
   devolve o idioma escolhido.

   A diferença importa na hora de conferir uma tela: trocar de verdade
   para o inglês obriga a lembrar de voltar, e esquecer significa entregar
   o aparelho de teste em inglês para a próxima pessoa. A prévia morre
   sozinha.

   ⚠️ O VALOR DO IDIOMA JÁ É DE MÓDULO — `trocarLocal`, em logic/local —,
   então a prévia não precisa guardar o idioma: ela guarda só o FATO de
   estar acontecendo, que é o que a linha do perfil lê para saber se
   oferece ir ou voltar. Quem guarda para onde voltar é o perfil, em
   `profile.idioma`, que a prévia não toca.
   ============================================================ */

let emPrevia = false;

export const idiomaEmPrevia = () => emPrevia;

/** Só a store chama isto, junto de `trocarLocal` e do repinte. */
export const marcarPreviaDeIdioma = (v: boolean) => { emPrevia = v; };
