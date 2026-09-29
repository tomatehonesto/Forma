import React, { useState } from 'react';
import { View, TextInput, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { dicionario, buscarAlimento, gramasDe, medidaDe, type Alimento } from '../logic/alimentos';
import { nomeDaPrateleira } from '../logic/prateleiras';
import { localAtual } from '../logic/local';
import { T } from '../textos';
import { cabe } from '../logic/restricoes';
import { RESTRICOES } from '../logic/restricoes';
import { useStore } from '../logic/store';
import { Txt, Row } from '../ui/kit';
import { TelaInterna, Titulao, Cartao, Chips, Linha } from '../ui/internas';
import { Icon } from '../ui/Icon';
import { useTheme } from '../ui/useTheme';
import { ty, radius } from '../theme';

/* ⚠️ É FUNÇÃO, porque lê o catálogo. Ver src/textos/README. */
const K = () => T.alimentacao.telaAlimentos;

/* ============================================================
   CONSULTAR ALIMENTOS

   A tabela que o app usa para contar, aberta para ser lida.

   Ela já existia inteira dentro da folha de registro, e só aparecia
   enquanto alguém montava um prato — três resultados por vez, cada um
   dizendo uma linha de proteína e sumindo em seguida. Quem quis saber
   quanta proteína tem um ovo sem estar registrando um ovo não tinha
   onde olhar.

   Aqui ela é destino, e não meio. O que muda: dá para chegar sem ter
   comido nada, os alimentos ficam visíveis, e cada um abre com o rótulo
   inteiro em vez de um número só.

   ⚠️ É O DICIONÁRIO, E NÃO A LISTA DO REGISTRO. Aqui se explora comida
   — o que cada uma traz —, e ninguém procura os benefícios de uma
   carbonara. Os pratos prontos continuam na busca de quem registra uma
   refeição; nesta tela eles não entram. Ver logic/alimentos.
   ============================================================ */

/* Quantos cabem antes de a lista virar rolagem sem fim. O resto entra
   pela busca, que é como se procura numa lista deste tamanho. */
const TETO = 40;

export default function Alimentos() {
  const S = useStore((x) => x.S);
  const { c } = useTheme();
  const router = useRouter();
  const [termo, setTermo] = useState('');
  const [onde, setOnde] = useState('');
  const [tudo, setTudo] = useState(false);

  /* A RESTRIÇÃO FILTRA, E NUNCA APAGA.

     A lista mostra primeiro o que cabe no que a pessoa come, e o botão
     de ver tudo fica logo abaixo dela, escrito com o número do que está
     de fora. Esconder em definitivo seria transformar uma preferência
     numa parede: quem é vegetariano ainda pode querer conferir quanta
     proteína tem um filé, e quem cozinha para casa procura o que os
     outros comem. Ver src/logic/restricoes.ts. */
  const restricoes = ((S.profile as any).restricoes ?? []) as string[];
  const [semFiltro, setSemFiltro] = useState(false);
  const filtraRestricao = restricoes.length > 0 && !semFiltro;
  const nomesDaRestricao = restricoes
    .map((x) => RESTRICOES().find((y) => y.id === x)?.titulo ?? x)
    .join(', ');


  /* Em ordem alfabética no idioma de agora — "Œufs" e "Äpfel" têm lugar
     certo em francês e em alemão, e não é o do português. */
  const local = localAtual();
  const emOrdem = React.useMemo(
    () => [...dicionario()].sort((a, b) => a.nome.localeCompare(b.nome, local)),
    [local],
  );

  /* AS PRATELEIRAS, na ordem em que aparecem na lista.

     Elas saem dos próprios alimentos, e não de uma lista escrita à mão:
     uma prateleira que ficasse sem nenhum alimento continuaria no filtro,
     e o toque nela levaria a lugar nenhum. */
  const prateleiras = React.useMemo(() => {
    const vistas = new Map<string, number>();
    for (const a of dicionario()) {
      if (filtraRestricao && !cabe(a, restricoes)) continue;
      vistas.set(a.onde, (vistas.get(a.onde) || 0) + 1);
    }
    return [...vistas.entries()].sort((x, y) => y[1] - x[1]);
  }, [filtraRestricao, restricoes]);

  const procurando = termo.trim().length >= 2;
  const base = procurando ? buscarAlimento(termo, 200, 'dicionario') : emOrdem;
  const filtrados = onde ? base.filter((a) => a.onde === onde) : base;
  const foraDaRestricao = filtraRestricao
    ? filtrados.filter((a) => !cabe(a, restricoes)).length
    : 0;
  const naRestricao = filtraRestricao ? filtrados.filter((a) => cabe(a, restricoes)) : filtrados;

  /* O teto é para a lista inteira. Quem filtrou uma prateleira já
     encurtou a lista por conta própria, e cortar de novo escondia
     alimento que a pessoa acabou de pedir para ver. */
  const achados: Alimento[] = procurando || onde || tudo ? naRestricao : naRestricao.slice(0, TETO);

  return (
    <TelaInterna titulo={K().titulo}>
      <Titulao
        titulo={K().titulo}
        lead={K().lead(dicionario().length)}
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
            placeholder={K().busca}
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
            /* O NÚMERO É O DO QUE O TOQUE ENTREGA, e não o da tabela: com
               a restrição ligada, "Tudo" com o total da tabela prometeria tudo e mostraria 81. */
            { id: '', label: K().tudo, n: prateleiras.reduce((x, [, k]) => x + k, 0) },
            ...prateleiras.map(([nome, n]) => ({ id: nome, label: nomeDaPrateleira(nome), n })),
          ]}
          valor={onde}
          onChange={setOnde}
        />

        {/* A TARJA, NO LUGAR DO SELETOR.

            Aqui teve uma fileira de pastilhas para escolher a restrição, e
            ela estava no lugar errado: isto se responde uma vez e se
            esquece, e como controle no alto da tela pedia atenção toda vez
            que alguém só queria saber quanta proteína tem um ovo. O ajuste
            foi para uma tela própria, atrás de uma linha na Alimentação.

            O QUE FICA É O AVISO. Lista cortada em silêncio é a pessoa
            achando que o app não tem o alimento — e a tarja diz o que
            cortou, quanto cortou e como ver tudo. */}
        {foraDaRestricao > 0 ? (
          <Row style={{
            backgroundColor: c.limeSoft, borderRadius: radius.md,
            paddingHorizontal: 12, paddingVertical: 10, gap: 9, alignItems: 'center',
          }}>
            <Icon name="filter" size={14} color={c.limeSoftInk} sw={2} />
            <Txt v="caption" c={c.limeSoftInk} style={{ flex: 1 }}>
              {K().fora(nomesDaRestricao, foraDaRestricao)}
            </Txt>
            <Pressable onPress={() => setSemFiltro(true)} hitSlop={8} style={({ pressed }) => [{ opacity: pressed ? 0.6 : 1 }]}>
              <Txt v="label" c={c.limeSoftInk}>{K().verTudo}</Txt>
            </Pressable>
          </Row>
        ) : null}

        {achados.length ? (
          <Cartao>
            {achados.map((a) => (
              <Linha
                key={a.id}
                titulo={a.nome}
                /* A porção padrão junto do nome: é ela que transforma
                   "32 g de proteína por 100 g" em "um filé", que é a
                   única forma em que alguém come frango. */
                sub={K().sub(medidaDe(a, a.qtd), gramasDe(a, a.qtd))}
                onPress={() => router.push(`/alimento?id=${a.id}` as any)}
              />
            ))}
          </Cartao>
        ) : (
          <Txt v="caption" c={c.tx3} style={{ paddingVertical: 22, textAlign: 'center' }}>
            {K().nenhum}
          </Txt>
        )}

        {!procurando && !onde && !tudo && naRestricao.length > TETO ? (
          <Linha
            /* O número é o da lista que a pessoa está vendo, e não o da
               tabela inteira: com a restrição ligada, "ver todos os 224"
               prometeria 224 e entregaria 72. */
            titulo={K().verTodos(naRestricao.length)}
            seta={false}
            onPress={() => setTudo(true)}
          />
        ) : null}
      </View>
    </TelaInterna>
  );
}
