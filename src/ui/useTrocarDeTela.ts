import { useRouter } from 'expo-router';

/* ⚠️ UM GESTO DE NAVEGAÇÃO NÃO GANHA UM ARQUIVO DESTES POR SER
   NAVEGAÇÃO — ganha por ter regra dentro.

   Este começou como `ui/navegar.ts`, um lugar para "os gestos de troca de
   tela", e o nome era um convite: qualquer coisa que empurrasse uma rota
   acabaria caindo aqui. As quatorze telas que escrevem
   `go = (to) => () => router.push(to)` continuam escrevendo, e devem —
   empurrar uma rota é uma chamada, não uma decisão, e não existe versão
   dela que possa divergir de outra.

   O que está abaixo tem um NÚMERO dentro, e é só por isso que saiu de
   onde estava. Um hook por arquivo, como useTheme e useLarguraApp: o
   próximo gesto com regra ganha o arquivo dele, com o nome dele. */

/** Fecha a folha atual e abre outra rota.

    ⚠️ ESTAVA ESCRITO DUAS VEZES, em /dia e em /registro-ok, e as duas
    cópias carregavam o mesmo 60.

    O número não é enfeite: sem a espera, o `push` sai enquanto a folha
    ainda desce e a tela nova entra por baixo dela — aparece um quadro em
    que as duas estão na tela ao mesmo tempo, uma subindo e a outra
    descendo. Com a espera, a saída termina antes de a entrada começar.

    É curto de propósito. Ele acompanha a animação de saída, não é uma
    pausa que a pessoa deva perceber: passando disso, o toque parece não
    ter funcionado e alguém toca de novo.

    ⚠️ E É POR ISSO QUE ELE PRECISA DE UM LUGAR SÓ. Dois tempos de
    animação escritos separadamente não divergem hoje — divergem no dia
    em que a animação da folha mudar e a busca encontrar só um deles. */
export function useTrocarDeTela() {
  const router = useRouter();
  return (rota: string) => {
    router.back();
    setTimeout(() => router.push(rota as any), 60);
  };
}
