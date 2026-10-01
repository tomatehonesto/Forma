import React, { useEffect } from 'react';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useStore } from '../logic/store';
import { aceitouAIa, registrarAceiteDaIa, registrarRecusaDaIa } from '../logic/aceiteDaIa';
import { registrarAceiteDaLeitura } from '../logic/leitura';
import { FolhaDoAceiteDaIa } from '../ui/aceiteDaIa';

/* ============================================================
   O ACEITE DA MORPHI INTELLIGENCE — a folha por cima de quem pediu

   Abre na primeira vez que a pessoa usa qualquer função de IA: a conversa
   (/companion), a foto do prato e a estimativa pelo nome (/medir-refeicao)
   e o convite do resumo da semana no carrossel da Home (`?leitura=1`). O
   laudo mostra a mesma folha na própria tela. Ver logic/aceiteDaIa.

   ⚠️ PERMITIR GRAVA E FECHA, e quem pediu segue: a conversa manda a
   pergunta que esperava; a foto e a estimativa são tocadas de novo.

   ⚠️ O CONVITE DO RESUMO DA SEMANA PARA QUEM JÁ ACEITOU A IA é religar a
   leitura que a pessoa desligou: a folha nem aparece — religa e fecha.
   ============================================================ */
export default function AceiteIa() {
  const router = useRouter();
  const { leitura } = useLocalSearchParams<{ leitura?: string }>();
  const S = useStore((s) => s.S);
  const update = useStore((s) => s.update);
  const doResumo = leitura === '1';

  useEffect(() => {
    if (doResumo && aceitouAIa(S)) {
      update((s: any) => { registrarAceiteDaLeitura(s); });
      router.back();
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
        router.back();
      }}
      onRecusar={() => { update((s: any) => { registrarRecusaDaIa(s); }); router.back(); }}
      onFechar={() => router.back()}
    />
  );
}
