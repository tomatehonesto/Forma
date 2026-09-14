import React, { useState } from 'react';
import { View, TextInput } from 'react-native';
import { useRouter } from 'expo-router';
import { ALIMENTOS, buscarAlimento, medidaDe, type Alimento } from '../logic/alimentos';
import { Txt, Row } from '../ui/kit';
import { TelaInterna, Titulao, Cartao, Linha } from '../ui/internas';
import { Icon } from '../ui/Icon';
import { useTheme } from '../ui/useTheme';
import { ty, radius } from '../theme';

/* ============================================================
   CONSULTAR ALIMENTOS

   A tabela que o app usa para contar, aberta para ser lida.

   Ela já existia inteira dentro da folha de registro, e só aparecia
   enquanto alguém montava um prato — três resultados por vez, cada um
   dizendo uma linha de proteína e sumindo em seguida. Quem quis saber
   quanta proteína tem um ovo sem estar registrando um ovo não tinha
   onde olhar.

   Aqui ela é destino, e não meio. O que muda: dá para chegar sem ter
   comido nada, os 224 alimentos ficam visíveis, e cada um abre com o
   rótulo inteiro em vez de um número só.
   ============================================================ */

/* Quantos cabem antes de a lista virar rolagem sem fim. O resto entra
   pela busca, que é como se procura numa lista deste tamanho. */
const TETO = 40;

export default function Alimentos() {
  const { c } = useTheme();
  const router = useRouter();
  const [termo, setTermo] = useState('');
  const [tudo, setTudo] = useState(false);

  const emOrdem = React.useMemo(
    () => [...ALIMENTOS].sort((a, b) => a.nome.localeCompare(b.nome, 'pt-BR')),
    [],
  );
  const achados: Alimento[] = termo.trim().length >= 2
    ? buscarAlimento(termo, 60)
    : (tudo ? emOrdem : emOrdem.slice(0, TETO));

  const procurando = termo.trim().length >= 2;

  return (
    <TelaInterna titulo="Alimentos">
      <Titulao
        titulo="Alimentos"
        lead={`A tabela que o app usa para contar, com ${ALIMENTOS.length} alimentos e pratos. Toque num deles para ver o rótulo inteiro.`}
      />

      <View style={{ gap: 12 }}>
        <Row
          gap={10}
          style={{
            backgroundColor: c.bg1, borderRadius: radius.md,
            borderWidth: 1, borderColor: c.line, paddingHorizontal: 13,
          }}
        >
          <Icon name="filter" size={16} color={c.tx4} sw={1.9} />
          <TextInput
            value={termo}
            onChangeText={setTermo}
            placeholder="Procure um alimento ou um prato"
            placeholderTextColor={c.tx4}
            style={[ty.body, { flex: 1, color: c.tx, paddingVertical: 13 }]}
          />
        </Row>

        {achados.length ? (
          <Cartao>
            {achados.map((a) => (
              <Linha
                key={a.id}
                titulo={a.nome}
                /* A porção padrão junto do nome: é ela que transforma
                   "32 g de proteína por 100 g" em "um filé", que é a
                   única forma em que alguém come frango. */
                sub={`${medidaDe(a, a.qtd)} · ~${Math.round((a.p / 100) * a.gUn * a.qtd)} g de proteína`}
                onPress={() => router.push(`/alimento?id=${a.id}` as any)}
              />
            ))}
          </Cartao>
        ) : (
          <Txt v="caption" c={c.tx3} style={{ paddingVertical: 22, textAlign: 'center' }}>
            Nenhum alimento com esse nome. Tente uma palavra mais curta.
          </Txt>
        )}

        {!procurando && !tudo && emOrdem.length > TETO ? (
          <Linha
            titulo={`Ver todos os ${emOrdem.length}`}
            seta={false}
            onPress={() => setTudo(true)}
          />
        ) : null}
      </View>
    </TelaInterna>
  );
}
