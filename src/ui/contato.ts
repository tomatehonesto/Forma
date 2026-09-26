import { Linking, Platform } from 'react-native';
import Constants from 'expo-constants';
import { CANAL } from '../logic/documentos';
import { T } from '../textos';

/* ============================================================
   ESCREVER PARA NÓS — o e-mail que o aplicativo abre

   Duas portas usam isto: "Reportar um problema", no Perfil, e "Fale com a
   gente", na Ajuda. As duas abrem o aplicativo de e-mail com o endereço
   do canal (`CANAL`, em logic/documentos — a mesma caixa que a Política
   dá), o assunto e, embaixo, a versão do Morphi e o sistema do telefone,
   que ninguém sabe de cor e todo suporte precisa.

   ⚠️ NADA DO DIÁRIO VAI JUNTO. A tentação de anexar o estado para
   facilitar o diagnóstico existe e está recusada: peso, dose e sintoma
   não saem daqui sem a pessoa mandar, e um e-mail de ajuda não é mandar.

   ⚠️ SEM APLICATIVO DE E-MAIL, A TENTATIVA FALHA EM SILÊNCIO — e é por
   isso que a linha da Ajuda mostra o endereço escrito: quem não tem onde
   tocar ainda tem o que copiar.
   ============================================================ */

/* ⚠️ A VERSÃO SAI DO app.json, e não de uma string escrita na tela. Ela
   aparece no rodapé do Perfil e vai dentro de todo e-mail; duas cópias de
   um número que muda a cada publicação é uma delas errada no dia
   seguinte, e a errada seria justamente a que chega no suporte. */
export const VERSAO_DO_APP = Constants.expoConfig?.version ?? '—';

/** Abre o e-mail para o canal, com o assunto, o rodapé do aparelho e, se
    houver, as linhas a mais e o convite para contar o que aconteceu. */
export function escreverParaNos(assunto: string, { extras = [], convite }: { extras?: string[]; convite?: string } = {}) {
  const corpo = [
    '',
    '',
    '---',
    `Morphi ${VERSAO_DO_APP}`,
    T.perfil.problemaSistema(Platform.OS, String(Platform.Version)),
    ...extras,
    ...(convite ? ['', convite] : []),
  ].join('\n');
  const url = `mailto:${CANAL()}?subject=${encodeURIComponent(assunto)}&body=${encodeURIComponent(corpo)}`;
  Linking.openURL(url).catch(() => {});
}
