import React, { useState } from 'react';
import { View, TextInput } from 'react-native';
import { useRouter } from 'expo-router';
import { ALIMENTOS, buscarAlimento, medidaDe, type Alimento } from '../logic/alimentos';
import { Txt, Row } from '../ui/kit';
import { TelaInterna, Titulao, Cartao, Chips, Linha } from '../ui/internas';
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
  const [onde, setOnde] = useState('');
  const [tudo, setTudo] = useState(false);

  const emOrdem = React.useMemo(
    () => [...ALIMENTOS].sort((a, b) => a.nome.localeCompare(b.nome, 'pt-BR')),
    [],
  );

  /* AS PRATELEIRAS, na ordem em que aparecem na lista.

     Elas saem dos próprios alimentos, e não de uma lista escrita à mão:
     uma prateleira que ficasse sem nenhum alimento continuaria no filtro,
     e o toque nela levaria a lugar nenhum. */
  const prateleiras = React.useMemo(() => {
    const vistas = new Map<string, number>();
    for (const a of ALIMENTOS) vistas.set(a.onde, (vistas.get(a.onde) || 0) + 1);
    return [...vistas.entries()].sort((x, y) => y[1] - x[1]);
  }, []);

  const procurando = termo.trim().length >= 2;
  const base = procurando ? buscarAlimento(termo, 200) : emOrdem;
  const filtrados = onde ? base.filter((a) => a.onde === onde) : base;
  /* O teto é para a lista inteira. Quem filtrou uma prateleira já
     encurtou a lista por conta própria, e cortar de novo escondia
     alimento que a pessoa acabou de pedir para ver. */
  const achados: Alimento[] = procurando || onde || tudo ? filtrados : filtrados.slice(0, TETO);

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

        {/* O filtro de prateleira, rolando na horizontal. Ele aparece
            sempre — inclusive com busca no ar, porque "frango" em
            "Pratos prontos" e "frango" em "Carnes e aves" são duas
            perguntas diferentes. */}
        <Chips
          itens={[
            { id: '', label: 'Tudo', n: ALIMENTOS.length },
            ...prateleiras.map(([nome, n]) => ({ id: nome, label: nome, n })),
          ]}
          valor={onde}
          onChange={setOnde}
        />

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

        {!procurando && !onde && !tudo && emOrdem.length > TETO ? (
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
