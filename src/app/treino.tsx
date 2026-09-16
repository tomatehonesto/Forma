import React from 'react';
import { View } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useStore } from '../logic/store';
import { apagarTreino, ehManual, origemDoTreino, treinoEm } from '../logic/derive';
import { ehForca, iconeDe } from '../logic/modalidades';
import { MO_LONG, DOW_PT, diffDays } from '../logic/time';
import { Txt, Row, IconBadge, SheetScreen } from '../ui/kit';
import { Cartao, Linha, Botao } from '../ui/internas';
import { useTheme } from '../ui/useTheme';

/* ============================================================
   UM TREINO

   A folha que abre ao tocar numa linha do diário. Ela mostra, e só
   depois oferece as duas ações.

   Antes o toque abria direto o formulário de registro carregado — o que
   é rápido e errado pelo mesmo motivo: a pessoa que toca num treino
   ainda não decidiu mexer nele. Pode estar só conferindo o que foi
   aquele dia. Abrir o formulário já assume a edição e coloca campos
   editáveis na frente de quem veio ler.

   É a mesma forma de /registro, que faz isso para peso e medidas desde
   antes: os dados primeiro, corrigir e apagar depois, e a consequência
   escrita embaixo do apagar em vez de depois do toque.

   O DESENHO, e por que ele mudou. A primeira versão era um cartão com
   seis linhas de rótulo e valor — e três delas repetiam palavra por
   palavra o cabeçalho da própria folha: a modalidade no título, a
   duração e a data no subtítulo, e as três de novo logo abaixo. O olho
   lia tudo duas vezes e ainda assim não pousava em lugar nenhum, porque
   uma pilha de seis linhas iguais não tem hierarquia.

   Agora a folha tem um FATO e um RESTO. O fato é a duração, em número
   grande, ao lado do ícone da modalidade — é o que a pessoa veio ver e
   o único campo que a correção costuma vir buscar. O resto são as duas
   coisas que o cabeçalho não diz: de onde a sessão veio e se ela conta
   como força. Nada aparece duas vezes.
   ============================================================ */

export default function Treino() {
  const S = useStore((s) => s.S);
  const update = useStore((s) => s.update);
  const { c } = useTheme();
  const router = useRouter();
  const { t, i } = useLocalSearchParams<{ t?: string; i?: string }>();

  const dia = Number(t);
  const idx = Number(i);
  const treino = treinoEm(S, dia, idx);

  const d = new Date(dia);
  const dataLonga = `${DOW_PT[d.getDay()]}, ${d.getDate()} de ${MO_LONG[d.getMonth()]}`;
  const semana = Math.max(1, Math.ceil((diffDays(d, new Date(S.profile.startT)) + 1) / 7));

  const apagar = () => {
    update((s: any) => apagarTreino(s, dia, idx));
    router.back();
  };

  if (!treino) {
    return (
      <SheetScreen titulo="Treino" sub="Não encontrei este registro" onClose={() => router.back()}>
        <Txt v="caption" c={c.tx3} style={{ marginTop: 18 }}>
          Ele pode ter sido apagado em outra tela.
        </Txt>
      </SheetScreen>
    );
  }

  const fonte = origemDoTreino(treino);
  const forca = ehForca(treino.tipo);

  return (
    <SheetScreen
      titulo={treino.tipo}
      sub={dataLonga}
      onClose={() => router.back()}
    >
      <View style={{ marginTop: 20, gap: 10 }}>
        {/* O FATO: quanto tempo.

            Em corpo de métrica porque é a resposta da folha, e porque é o
            campo que a correção quase sempre vem buscar — do mesmo
            tamanho dos outros, ele obrigava a pessoa a procurar o que já
            era o assunto. O ícone da modalidade ao lado repete o título
            de propósito: é a mesma marca que ela tocou na lista, e é o
            que confirma que abriu o treino certo. */}
        <Cartao>
          <Row gap={14} style={{ paddingHorizontal: 16, paddingVertical: 16 }}>
            <IconBadge name={iconeDe(treino.tipo)} size={52} iconSize={24} sw={1.9} />
            <View style={{ flex: 1 }}>
              <Txt v="metric">
                {treino.min}
                <Txt v="label" c={c.tx3}> min</Txt>
              </Txt>
              <Txt v="caption" c={c.tx3}>Semana {semana} do tratamento</Txt>
            </View>
          </Row>
        </Cartao>

        {/* O RESTO: só o que o cabeçalho não disse. */}
        <Cartao>
          {/* Quem registrou. Numa tela cujas duas ações são corrigir e
              apagar, saber se o número foi você que escreveu ou se ele
              chegou do relógio é o que decide se "está errado" é um erro
              de digitação ou o relógio chamando caminhada de corrida. */}
          <Linha
            ic={ehManual(fonte) ? 'pencil' : 'watch'}
            titulo="Origem"
            sub={ehManual(fonte)
              ? 'Você — registrado nesta tela'
              : `${fonte} — chegou pela integração`}
            seta={false}
          />
          {/* A marca de força aparece aqui porque é a única propriedade do
              treino que o app usa para outra coisa — e quem abre para
              conferir merece ver por que aquele dia contou (ou não). */}
          <Linha
            ic="shield"
            titulo="Conta como força"
            sub={forca
              ? 'Sim — puxa músculo'
              : 'Não — musculação, pilates e funcional é que contam'}
            selo={forca ? 'Força' : undefined}
            seloTom="verde"
            seta={false}
          />
        </Cartao>

        <View style={{ marginTop: 8, gap: 8 }}>
          <Botao
            label="Corrigir"
            tom="fantasma"
            onPress={() => { router.back(); router.push(`/medir-exercicio?t=${dia}&i=${idx}` as any); }}
          />
          <Botao label="Apagar" tom="perigo" onPress={apagar} />
        </View>

        <Txt v="caption" c={c.tx3} style={{ textAlign: 'center', marginTop: 2 }}>
          Apagar tira os {treino.min} min do total daquele dia.
        </Txt>
      </View>
    </SheetScreen>
  );
}
