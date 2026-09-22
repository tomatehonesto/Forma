import React, { useMemo, useState } from 'react';
import { View } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useStore } from '../logic/store';
import { DAY, nf, dataLonga } from '../logic/time';
import { Txt, Row, Vazio } from '../ui/kit';
import {
  TelaInterna, Titulao, Bloco, Chips, Cartao, Linha, CardCurva, Aviso,
} from '../ui/internas';
import { useTheme } from '../ui/useTheme';
import { radius, shadowCard } from '../theme';
import { compU, pesoU, pesoV, compV, sistemaDe } from '../logic/medidas';
import { T } from '../textos';

/* ⚠️ SÃO FUNÇÕES, e não constantes de módulo: elas leem o catálogo, e
   constante de módulo congela o idioma no import. Ver
   scripts/idioma-congelado.mjs. */
const K = () => T.medidas.tela;
const NOMES = () => T.medidas.corpo;

/* ============================================================
   DETALHE DO MARCADOR

   O gráfico responde "como foi indo"; a lista embaixo existe para outra
   coisa: CORRIGIR. É a única tela do app onde a pessoa apaga um número
   que ela mesma registrou, e por isso a frase do bloco diz, sem rodeio,
   que aquilo vai para o relatório do médico — apagar aqui tem
   consequência fora do app.

   Serve peso e cintura com o mesmo desenho. São marcadores que a pessoa
   produz, medidos numa unidade só, com histórico corrigível: fazer duas
   telas quase iguais para isso só multiplicaria manutenção.
   ============================================================ */

/* ⚠️ E ESTA TAMBÉM É FUNÇÃO. Ela era constante e os três rótulos
   ficavam congelados no idioma do import — o caso exato que
   scripts/idioma-congelado.mjs existe para pegar, e que ele NÃO pegava
   enquanto os rótulos estavam escritos em duro aqui. */
const PERIODOS = () => [
  { id: '12s', label: K().periodo12s, dias: 84 },
  { id: '3m', label: K().periodo3m, dias: 91 },
  { id: 'tudo', label: K().periodoTudo, dias: Infinity },
];

/* ⚠️⚠️ A DEFINIÇÃO VIROU FUNÇÃO DO ESTADO, e era uma tabela constante.

   As unidades entraram, e aqui não bastava trocar o rótulo: a SÉRIE
   inteira precisa sair convertida. Um gráfico de cintura com o eixo em
   polegada e os pontos em centímetro é pior do que um em centímetro
   inteiro — ele parece certo.

   E as casas decimais vão junto: centímetro se escreve sem casa, 96;
   polegada precisa de uma, 37,8, porque uma polegada vale dois centímetros
   e meio e arredondar apaga a diferença entre duas medições vizinhas.

   Por isso a tabela virou `Record<string, (S) => Def>` em vez de ganhar
   três campos de função. Uma definição que depende do estado é uma função
   do estado — e assim o corpo de cada uma lê como sempre leu, com os
   valores prontos. */
type Def = {
  nome: string; unidade: string; casas: number;
  pontos: () => { t: number; v: number }[];
  /** "manhã" para peso; medidas não têm hora do dia */
  nota?: string;
  /** para onde o "+" leva. Sem captura não há "+": ninguém digita
      composição corporal, ela chega da balança. */
  capturar?: string;
  /** o número não é produzido pela pessoa, então não há o que corrigir */
  leitura?: boolean;
  /** o que vale saber sobre medir ESTE marcador */
  aviso?: { titulo: string; texto: string };
};

/* ⚠️ ELE MORAVA NA TELA DE MEDIDAS, solto no pé da lista das quatro
   circunferências. Ali ele era um aviso geral sobre um assunto; aqui ele
   chega junto do número que ele explica — e é quando a pessoa está
   olhando a própria cintura que ela precisa saber que a comparação só
   vale se as duas medições foram feitas igual. */
const MESMO_JEITO = () => ({
  titulo: K().mesmoJeitoTitulo,
  texto: K().mesmoJeitoTexto,
});

/* As quatro circunferências têm a mesma forma — um número em cm vindo da
   fita, medido de vez em quando — então nascem da mesma fábrica. Cada uma
   ganha histórico navegável e corrigível sem custo de tela nova. */
const circunferencia = (k: string, nome: () => string) => (S: any): Def => ({
  nome: nome(), unidade: compU(S), casas: sistemaDe(S) === 'imperial' ? 1 : 0,
  capturar: '/medir-medidas',
  pontos: () => (S.measures as any[])
    .map((m) => ({ t: m.t, v: compV(S, m[k]) }))
    /* O filtro é sobre o valor CONVERTIDO, e dá no mesmo: zero em
       centímetro é zero em polegada. Fica depois da conversão para não
       haver duas ordens possíveis de ler esta linha. */
    .filter((p) => p.v > 0),
  aviso: MESMO_JEITO(),
});

/* ⚠️ GORDURA E MASSA MAGRA ENTRARAM, e não tinham tela própria: os dois
   cards da Jornada levavam a /medidas, uma lista onde eles são o segundo
   bloco — a pessoa tocava em "Gordura corporal" e caía numa tela que abre
   com quatro cards de circunferência.

   Eles cabem aqui pela forma: um número, uma unidade, uma série no tempo.
   O que muda é a origem — vêm da bioimpedância, não da mão da pessoa —, e
   é isso que o `leitura` diz: sem "+" no cabeçalho e sem a lista que
   promete corrigir. */
/* ⚠️ A GORDURA É PERCENTUAL e não converte; a massa magra é PESO e
   converte. Por isso a fábrica recebe o conversor em vez de adivinhar
   pela unidade. */
const daBalanca = (k: string, nome: () => string, unidade: (S: any) => string, conv: (S: any, v: number) => number) => (S: any): Def => ({
  nome: nome(), unidade: unidade(S), casas: 1, leitura: true,
  pontos: () => (S.measures as any[]).map((m) => ({ t: m.t, v: conv(S, m[k]) })).filter((p) => p.v > 0),
});

const DEFS: Record<string, (S: any) => Def> = {
  peso: (S) => ({
    nome: NOMES().peso, unidade: pesoU(S), casas: 1, nota: K().notaManha,
    capturar: '/medir-peso',
    pontos: () => (S.weights as any[]).map((w) => ({ t: w.t, v: pesoV(S, w.kg) })),
  }),
  /* ⚠️ OS SETE NOMES VÊM DE `medidas.corpo`, e a fábrica os recebe como
     FUNÇÃO — `DEFS` é constante de módulo, e um nome lido aqui congelaria
     no idioma do import. */
  cintura: circunferencia('cintura', () => NOMES().cintura),
  quadril: circunferencia('quadril', () => NOMES().quadril),
  braco: circunferencia('braco', () => NOMES().braco),
  coxa: circunferencia('coxa', () => NOMES().coxa),
  gordura: daBalanca('gordura', () => NOMES().gordura, () => '%', (_S, v) => v),
  musculo: daBalanca('musculo', () => NOMES().massaMagra, pesoU, pesoV),
};


export default function Marcador() {
  const S = useStore((s) => s.S);
  const { c } = useTheme();
  const router = useRouter();
  const { m } = useLocalSearchParams<{ m?: string }>();
  const def = (DEFS[m ?? 'peso'] ?? DEFS.peso)(S);
  const [per, setPer] = useState('12s');

  const todos = def.pontos();
  const corte = PERIODOS().find((p) => p.id === per)!.dias;
  const desde = corte === Infinity ? -Infinity : Date.now() - corte * DAY;
  const pts = todos.filter((p) => p.t >= desde);

  const fmt = (v: number) => nf(v, def.casas);
  const ultimo = todos[todos.length - 1];
  const primeiro = todos[0];

  /* Variação dentro do período escolhido nos chips. É o que o cabeçalho do
     card responde, e não se repete com o titulão: lá em cima está o valor
     de hoje contra o início do tratamento; aqui, o quanto andou nas doze
     semanas (ou três meses, ou tudo) que a pessoa acabou de selecionar. */
  const variacao = pts.length > 1 ? pts[pts.length - 1].v - pts[0].v : null;

  /* Lista do mais recente para o mais antigo, com a variação contra o
     registro anterior. O mais antigo do período não ganha selo: não há
     contra o que comparar, e inventar "—" como número seria pior. */
  const registros = todos
    .map((p, i) => ({ ...p, delta: i > 0 ? p.v - todos[i - 1].v : null }))
    .slice()
    .reverse();

  /* ⚠️ SEM SÉRIE, NÃO HÁ TELA — e sem esta guarda ela quebrava inteira.
     `todos[todos.length - 1]` de uma lista vazia é undefined, e a linha
     seguinte lê `.v` dele. A tela de medidas já tinha aprendido isso uma
     vez, no cartão que sumia quando a lista estava vazia. */
  if (!todos.length) {
    return (
      <TelaInterna titulo={def.nome}>
        <Cartao>
          <Vazio
            ic="ruler"
            titulo={K().vazioTitulo(def.nome)}
            texto={def.leitura ? K().vazioDaBalanca : K().vazioRegistre}
          />
        </Cartao>
      </TelaInterna>
    );
  }

  return (
    <TelaInterna
      titulo={def.nome}
      iconeAcao={def.capturar ? 'plus' : undefined}
      onAcao={def.capturar ? () => router.push(def.capturar as any) : undefined}
    >
      <Titulao
        titulo={fmt(ultimo.v)}
        unidade={def.unidade}
        lead={K().lead(dataLonga(ultimo.t), fmt(primeiro.v), def.unidade)}
      />

      {/* Os chips saíram de dentro do card. A curva agora encosta na borda
          de baixo, então não sobra rodapé onde eles coubessem — e fora do
          card eles ficam onde já estão na Evolução, que é a tela de onde se
          chega aqui. */}
      <Chips itens={PERIODOS().map((p) => ({ id: p.id, label: p.label }))} valor={per} onChange={setPer} />

      {/* Mesmo desenho do card de evolução da Home: texto em cima, curva
          sangrando até as três bordas de baixo.

          Saíram a coluna de eixo, as marcas de mês e o ponto no último
          registro. O eixo existia para dar escala à queda, mas aqui ele
          repetia o titulão — que já diz o valor de hoje e o do início do
          tratamento, em palavras. Com a escala resolvida em texto, o que
          sobra para a curva é a única coisa que só ela sabe dizer: a FORMA.
          Onde travou, onde acelerou, onde voltou a cair.

          Sangrando, ela deixa de ser um gráfico dentro de uma caixa e vira
          o piso do card — o mesmo princípio da curva do painel da Jornada. */}
      <CardCurva
        id="mk"
        nome={def.nome}
        sub={K().subCurva(PERIODOS().find((p) => p.id === per)!.label, pts.length)}
        valor={variacao != null ? `${variacao > 0 ? '+' : '−'}${fmt(Math.abs(variacao))}` : '—'}
        unidade={def.unidade}
        altura={120}
        pontos={pts.map((p) => ({ v: p.v, rotulo: fmt(p.v), quando: dataLonga(p.t) }))}
      />

      {/* ⚠️ A NOTA MUDA DE VOZ QUANDO O NÚMERO NÃO É DA PESSOA. "Toque
          para corrigir" numa leitura de bioimpedância promete uma edição
          que não existe — e a linha nem abre. O que ela guarda de
          verdade, nos dois casos, é que aquilo vai para o relatório. */}
      <Bloco
        titulo={K().registros}
        nota={def.leitura ? K().notaLeitura : K().notaCorrigir}
      >
        <Cartao>
          {registros.map((r) => (
            <Linha
              key={r.t}
              titulo={`${fmt(r.v)} ${def.unidade}`}
              sub={`${dataLonga(r.t)}${def.nota ? ` · ${def.nota}` : ''}`}
              selo={r.delta == null ? '—' : `${r.delta > 0 ? '+' : '−'}${fmt(Math.abs(r.delta))} ${def.unidade}`}
              seloTom={r.delta == null ? 'neutra' : 'lima'}
              seta={false}
              onPress={def.leitura ? undefined : () => router.push(`/registro?m=${m ?? 'peso'}&t=${r.t}` as any)}
            />
          ))}
        </Cartao>
      </Bloco>

      {def.aviso ? <Aviso ic="ruler" titulo={def.aviso.titulo} texto={def.aviso.texto} /> : null}
    </TelaInterna>
  );
}
