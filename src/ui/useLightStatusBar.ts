import { useCallback } from 'react';
import { useFocusEffect } from 'expo-router';
import { setStatusBarStyle } from 'expo-status-bar';

/* Telas cujo topo é escuro — a aurora da Home e o painel da Jornada —
   precisam de ícones claros na status bar. O padrão do app é escuro
   (definido em app/_layout), então cada uma pede o claro ao ganhar foco
   e devolve ao sair.

   Sem isso o relógio e a bateria ficam pretos sobre fundo preto. */
export function useLightStatusBar() {
  useFocusEffect(
    useCallback(() => {
      setStatusBarStyle('light');
      return () => setStatusBarStyle('dark');
    }, []),
  );
}
