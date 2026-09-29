import React, { useState } from 'react';
import { View } from 'react-native';
import { useStore } from '../logic/store';
import { dadosParaExportar, nomeDoArquivo, gerarArquivo } from '../logic/exportacao';
import { perguntasParaExportar } from '../logic/conta';
import { Txt, Row } from '../ui/kit';
import { TelaInterna, Titulao, Aviso, Botao } from '../ui/internas';
import { Icon } from '../ui/Icon';
import { useTheme } from '../ui/useTheme';
import { T } from '../textos';

/* ============================================================
   UMA CÓPIA DOS SEUS DADOS — a portabilidade

   ⚠️ ESTA TELA É SÓ A CÓPIA EM .JSON (29/09/2026, pedido do dono). Ela
   misturava duas coisas: o papel para a consulta e o direito de levar os
   dados embora. O papel virou o PDF do Resumo para consulta
   (app/pdf-consulta para ajustar); aqui ficou a cópia, que é a promessa
   da Política: todo tipo de registro, o perfil e as perguntas, em formato
   que outro aplicativo lê.

   ⚠️ SEM PERÍODO E SEM INTERRUPTORES. Recortar a própria cópia não é levar
   os dados embora — ela sai inteira, sempre.

   Quem chega aqui: a Privacidade, que é a casa dela, e os dois momentos em
   que a pessoa pode estar indo embora — recusar os termos novos
   (app/consentimento) e o acesso suspenso (app/suspenso).
   ============================================================ */

/* ⚠️ É FUNÇÃO, e não constante de módulo: ela lê o catálogo. */
const K = () => T.aviso.telaExportar;

const TUDO = { aplicacoes: true, peso: true, sintomas: true, exames: true, notas: true, habitos: true, completo: true };

export default function Exportar() {
  const S = useStore((s) => s.S);
  const { c } = useTheme();
  const [estado, setEstado] = useState<'parado' | 'gerando' | 'pronto' | 'erro'>('parado');

  /* NADA É GERADO ANTES DO TOQUE. */
  const gerar = async () => {
    setEstado('gerando');
    const perguntas = await perguntasParaExportar();
    const dados = dadosParaExportar(S, { desde: 0, inclui: TUDO, perguntas });
    const r = await gerarArquivo(JSON.stringify(dados, null, 2), nomeDoArquivo());
    setEstado(r === 'erro' || r === 'sem-suporte' ? 'erro' : 'pronto');
  };

  return (
    <TelaInterna
      titulo={K().titulo}
      rodape={
        <Botao
          label={estado === 'gerando' ? K().gerando : K().gerar}
          desligado={estado === 'gerando'}
          onPress={gerar}
        />
      }
    >
      <Titulao titulo={K().titulo} lead={K().lead} />

      {/* O FORMATO VAI DITO, e sem eufemismo: um .json não é um documento
          para ler no sofá, e o texto aponta para o papel que é. */}
      <Aviso ic="doc" titulo={K().formatoTitulo} texto={K().formatoTexto} />

      {estado === 'pronto' ? (
        <Row gap={8} style={{ alignItems: 'center', justifyContent: 'center' }}>
          <Icon name="check" size={14} color={c.ok} sw={2.6} />
          <Txt v="micro" c={c.tx3}>{K().pronto}</Txt>
        </Row>
      ) : estado === 'erro' ? (
        <Txt v="micro" c={c.tx3} style={{ textAlign: 'center' }}>{K().erro}</Txt>
      ) : (
        <Txt v="micro" c={c.tx4} style={{ textAlign: 'center' }}>{K().parado}</Txt>
      )}

      <View />
    </TelaInterna>
  );
}
