import React, { useEffect } from 'react';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useStore } from '../logic/store';
import { aceitouAIa, registrarAceiteDaIa, registrarRecusaDaIa } from '../logic/aceiteDaIa';
import { registrarAceiteDaLeitura } from '../logic/leitura';
import { FolhaDoAceiteDaIa } from '../ui/aceiteDaIa';
import { useTrocarDeTela } from '../ui/useTrocarDeTela';

/* ============================================================
   O ACEITE DA MORPHI INTELLIGENCE — a folha por cima de quem pediu

   Abre na primeira vez que a pessoa usa qualquer função de IA: a conversa
   (/companion), a foto do prato e a estimativa pelo nome (/medir-refeicao)
   e o convite do resumo da semana no carrossel da Home (`?leitura=1`). O
   laudo mostra a mesma folha na própria tela. Ver logic/aceiteDaIa.

   ⚠️ PERMITIR GRAVA E FECHA, e quem pediu segue: a conversa manda a
   pergunta que esperava; a foto e a estimativa são tocadas de novo.

   ⚠️ MENOS O CONVITE DO RESUMO, QUE SEGUE ATÉ O RESUMO (01/10/2026). O
   dono tocou o convite, permitiu e voltou para a Home, onde precisou
   tocar de novo: quem pede "quero um resumo da semana" e diz sim espera
   ver o resumo. Do convite (`?leitura=1`), permitir fecha a folha e abre
   /leitura, que gera a da semana na hora. Da própria tela do resumo
   (`?leitura=aqui`, o "ligar" de lá), só fecha — ela já está atrás.

   ⚠️ O CONVITE DO RESUMO DA SEMANA PARA QUEM JÁ ACEITOU A IA é religar a
   leitura que a pessoa desligou: a folha nem aparece — religa e segue.
   ============================================================ */
export default function AceiteIa() {
  const router = useRouter();
  const trocar = useTrocarDeTela();
  const { leitura } = useLocalSearchParams<{ leitura?: string }>();
  const S = useStore((s) => s.S);
  const update = useStore((s) => s.update);
  const doResumo = leitura === '1' || leitura === 'aqui';
  const seguir = () => (leitura === '1' ? trocar('/leitura') : router.back());

  useEffect(() => {
    if (doResumo && aceitouAIa(S)) {
      update((s: any) => { registrarAceiteDaLeitura(s); });
      seguir();
    }
  }, []);

  if (doResumo && aceitouAIa(S)) return null;

  return (
    <FolhaDoAceiteDaIa
      onAceitar={() => {
        update((s: any) => {
          registrarAceiteDaIa(s);
          if (doResumo) registrarAceiteDaLeitura(s);
        });
        if (doResumo) seguir(); else router.back();
      }}
      onRecusar={() => { update((s: any) => { registrarRecusaDaIa(s); }); router.back(); }}
      onFechar={() => router.back()}
    />
  );
}
