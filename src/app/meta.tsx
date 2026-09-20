import React, { useState } from 'react';
import { View } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useStore } from '../logic/store';
import {
  ALVOS, METAS_PESSOAIS, META_LIVRE, PRAZOS, apagarMeta, guardarMetaMedida,
  guardarMetaPessoal, indicadoresLivres, padraoDe, journeyGoals, marcarMeta,
  mudarAlvo, type ChaveDeAlvo, type Indicador, type MetaPessoal,
} from '../logic/derive';
import { Txt, Row, SheetScreen, IconBadge } from '../ui/kit';
import { DAY, fmtDate, now, startOfDay } from '../logic/time';
import { Campo, Chips, Escala, Stepper, Texto, Botao, Aviso, Cartao, Linha } from '../ui/internas';
import { useTheme } from '../ui/useTheme';

/* ============================================================
   UMA META

   Três modos na mesma folha, e todos mexem em "onde quero chegar":

     ?alvo=prot     um dos quatro números que o app cobra, no stepper
     ?g=<id>        uma meta da lista: marcar, desmarcar, apagar
     ?novo=1        escolher uma meta medida, ou escrever a sua

   Três telas para isso significaria três cópias do rodapé, do fechar e
   do cartão — e é exatamente aí que uma ganha o botão de apagar e as
   outras não. É a mesma decisão da folha de refeição, que já faz
   registrar, corrigir e cadastrar favorito no mesmo lugar.
   ============================================================ */

export default function Meta() {
  const S = useStore((s) => s.S);
  const update = useStore((s) => s.update);
  const { c } = useTheme();
  const router = useRouter();
  const { alvo, g, novo } = useLocalSearchParams<{ alvo?: string; g?: string; novo?: string }>();

  /* ---------------- um dos quatro números ---------------- */
  const chave = alvo as ChaveDeAlvo | undefined;
  const def = chave ? ALVOS[chave] : null;
  const [v, setV] = useState<number>(() => (def ? def.le(S) : 0));

  if (def && chave) {
    const passo = (n: number) => setV((x) => Math.max(def.min, Math.min(def.max, Math.round((x + n * def.passo) * 100) / 100)));
    const salvar = () => {
      update((s: any) => mudarAlvo(s, chave, v));
      router.back();
    };
    return (
      <SheetScreen
        titulo={def.nome}
        sub={def.onde}
        onClose={() => router.back()}
        rodape={<Botao label="Salvar" onPress={salvar} />}
      >
        <View style={{ marginTop: 20, gap: 14 }}>
          <Campo rotulo="Novo valor" nu>
            <Stepper
              valor={def.escreve(v)}
              unidade={def.un}
              onMenos={() => passo(-1)}
              onMais={() => passo(1)}
            />
          </Campo>

          {/* O QUE MUDA COM ISSO. Um número de meta não vive na tela de
              metas: ele reaparece amanhã na barra da alimentação e na
              contagem do protocolo. Quem sobe a proteína de 90 para 110
              merece saber onde vai encontrar a conta nova. */}
          <Aviso
            ic="info"
            dentro
            titulo={`Hoje: ${def.escreve(def.le(S))} ${def.un}`}
            texto={chave === 'peso'
              ? 'A referência é o ponto de chegada combinado com a equipe. Mexer nela muda a régua da Jornada e da evolução, e não apaga nada do que já foi registrado.'
              : 'A mudança vale a partir de agora. Os dias já registrados continuam valendo o que valiam — o que muda é contra o que eles passam a ser comparados.'}
          />
        </View>
      </SheetScreen>
    );
  }

  /* ---------------- uma meta nova ---------------- */
  const [texto, setTexto] = useState('');
  /* A categoria pessoal escolhida no primeiro passo, e o prazo do
     segundo. Sem categoria, a folha mostra a lista. */
  const [pess, setPess] = useState<MetaPessoal | null>(null);
  const [prazo, setPrazo] = useState('nao');
  /* O indicador escolhido no primeiro passo, e o número que a pessoa está
     ajustando no segundo. */
  const [ind, setInd] = useState<Indicador | null>(null);
  const [regua, setRegua] = useState(0);

  if (novo === '1') {
    const livres = indicadoresLivres(S);
    /* ⚠️ QUEM JÁ TEM ALVO NO PERFIL PULA A RÉGUA, e antes todos passavam
       por ela. Perguntar "quantos gramas por dia?" a quem acabou de
       definir 90 g em "Os números do dia" é pedir o mesmo número de novo —
       e guardar a resposta num segundo lugar, que é como os dois passam a
       divergir. A meta desses três acrescenta a constância, não o número. */
    const abrir = (i: Indicador) => {
      if (i.doPerfil) {
        update((s: any) => guardarMetaMedida(s, i.id, 0));
        router.back();
        return;
      }
      setInd(i); setRegua(padraoDe(i, S));
    };
    const guardar = () => {
      if (!ind) return;
      update((s: any) => guardarMetaMedida(s, ind.id, regua));
      router.back();
    };

    /* SEGUNDO PASSO: A RÉGUA.

       A lista oferecia a régua pronta — "Dormir 7h+", "Enjoo em 2 ou
       menos". Sete horas é o que a literatura repete e ainda assim é um
       palpite sobre a vida de alguém: quem dorme cinco e quer chegar a
       seis não tinha onde dizer isso, e quem já dorme oito recebia uma
       meta que já nasceu cumprida.

       Escolher a COISA e escolher o NÚMERO são duas decisões, e a segunda
       é a que é pessoal. */
    if (ind) {
      const passos = ind.passos;
      const mexe = (n: number) => passos && setRegua((x) => Math.max(
        passos.min, Math.min(passos.max, Math.round((x + n * passos.passo) * 100) / 100),
      ));
      return (
        <SheetScreen
          titulo={ind.nome}
          sub={ind.pergunta}
          onClose={() => setInd(null)}
          rodape={<Botao label="Guardar meta" onPress={guardar} />}
        >
          <View style={{ marginTop: 20, gap: 14 }}>
            {/* A MESMA RÉGUA DO CHECK-IN, com as mesmas palavras. Energia e
                fome são guardadas de 0 a 10 e perguntadas de 1 a 5; a meta
                dizia "energia de 7 para cima", que é um número que ninguém
                nunca viu em tela nenhuma. */}
            {/* Sem rótulo de campo: a pergunta já é o subtítulo da folha, e
                repeti-la um centímetro abaixo em caixa alta é o mesmo texto
                pedindo a mesma coisa duas vezes. */}
            {ind.escala ? (
              <Escala
                valores={ind.escala.valores}
                valor={regua}
                legendas={ind.escala.legendas}
                onChange={(v) => setRegua(Number(v))}
              />
            ) : passos ? (
              <Stepper
                valor={ind.escreve(regua)}
                unidade=""
                onMenos={() => mexe(-1)}
                onMais={() => mexe(1)}
              />
            ) : null}

            {/* O QUE A META VAI DIZER, montada com o número escolhido. É a
                única forma de escolher sabendo o que se vai ver depois — e
                ela muda enquanto a pessoa mexe. */}
            <Aviso
              ic="target"
              dentro
              titulo={ind.rotulo(regua)}
              texto={`O app conta assim: ${ind.conta(regua).toLowerCase()}. Só os dias que você respondeu entram na conta.`}
            />
          </View>
        </SheetScreen>
      );
    }

    /* SEGUNDO PASSO DA PESSOAL: ESPECIFICAR.

       As categorias chegaram a ser frases prontas que preenchiam o campo
       — "Voltar a um esporte que eu gostava", com o cursor no fim.
       Funcionava e era preguiçoso: quem não apagasse nada ficava com uma
       meta genérica, e meta genérica não convida ninguém a nada.

       A pergunta obriga a especificar, que é o trabalho que uma meta
       pessoal pede — qual esporte, qual peça de roupa. E é a mesma forma
       da medida, em que o segundo toque escolhe a régua. */
    if (pess) {
      const frase = texto.trim() ? pess.monta(texto.trim()) : '';
      const dias = PRAZOS.find((x) => x.id === prazo)?.dias ?? null;
      const quando = dias == null ? null : +startOfDay(now()) + dias * DAY;
      const salvarPessoal = () => {
        update((s: any) => guardarMetaPessoal(s, frase, pess.ic, quando));
        router.back();
      };
      return (
        <SheetScreen
          titulo={pess.nome}
          sub={pess.pergunta}
          onClose={() => setPess(null)}
          rodape={(
            <Botao
              label={frase ? 'Guardar meta' : 'Responda para guardar'}
              desligado={!frase}
              onPress={salvarPessoal}
            />
          )}
        >
          <View style={{ marginTop: 20, gap: 18 }}>
            {/* O campo abre NEUTRO. Ele já teve um exemplo dentro — e
                exemplo dentro de campo é sugestão: quem lê "o vestido do
                casamento da minha irmã" antes de pensar na própria meta
                pensa na meta do exemplo, e ainda ganha de brinde um
                casamento e uma irmã que talvez não existam.

                Quem ensina a forma da resposta é a frase montada logo
                abaixo, que aparece já na primeira letra. */}
            <Texto
              valor={texto}
              onChange={setTexto}
              placeholder={pess.dica}
              linhas={2}
            />

            {/* O PRAZO, e o "opcional" dito no rótulo. A primeira pastilha
                é não ter prazo, e ela vem escolhida: uma meta sem data
                continua sendo uma meta — o que ela não pode é ganhar uma
                data que a pessoa não pediu. */}
            <Campo rotulo="Prazo (opcional)" nu>
              <Chips itens={PRAZOS} valor={prazo} onChange={setPrazo} />
            </Campo>

            {/* COMO ELA VAI APARECER, montada enquanto a pessoa escreve.
                Sem isto, a regra do prefixo é uma surpresa que só chega
                depois de salvar. */}
            <Txt v="caption" c={c.tx3} style={{ paddingHorizontal: 2 }}>
              {frase
                ? `Vai aparecer assim: "${frase}"${quando ? `, até ${fmtDate(new Date(quando))}` : ''}.`
                : 'Ela fica em ainda não até você marcar. No dia em que acontecer, o app guarda a data junto.'}
            </Txt>
          </View>
        </SheetScreen>
      );
    }

    return (
      <SheetScreen
        titulo="Nova meta"
        sub="Uma que o app acompanha, ou uma que só você sabe dizer"
        onClose={() => router.back()}
      >
        {/* DUAS SEÇÕES, E A DIVISÃO É O ASSUNTO DA TELA.

            Elas estavam na mesma lista, com a de baixo separada só por um
            cartão — e a diferença entre as duas não é de categoria, é de
            NATUREZA: uma o app conta sozinho, a outra ninguém tem como
            medir. Com título, a pessoa escolhe sabendo em qual das duas
            vidas ela está entrando.

            O TÍTULO É O RÓTULO DE CAMPO, e não o de bloco. Bloco é o
            cabeçalho de seção das TELAS, no mesmo corpo do título da
            folha — dentro de um bottom sheet ele empatava com "Nova meta"
            e a tela ficava com dois títulos do mesmo tamanho brigando.
            Maiúsculas miúdas é o que as outras folhas já usam para dizer
            "começa aqui outra parte": A META, NOVO VALOR. */}
        <View style={{ marginTop: 18, gap: 22 }}>
          {/* AS QUE O APP CONTA, pelo nome genérico. O número vem no toque
              seguinte — a lista diz de QUE coisa se trata, e a régua é de
              quem está criando a meta. */}
          <Campo rotulo="O que conseguimos medir" nu>
            <Cartao>
              {/* ⚠️⚠️ O PESO ABRE A LISTA, e não estava em lista nenhuma.

                  Ele não é coluna de check-in, então não entrava no
                  catálogo de indicadores — e a lista de baixo, a das que
                  "você marca quando chegar", era o único lugar onde uma
                  meta de peso cabia. Quem quisesse "chegar a 68 kg"
                  escrevia à mão e depois marcava à mão o dia em que
                  chegou, num aplicativo que pesa essa pessoa toda semana.

                  É o contrário de uma calça: caber numa calça é coisa que
                  só quem veste sabe dizer, e por isso ela é marcada. O
                  peso a gente sabe.

                  ⚠️ E ELE NÃO CRIA UMA META NOVA — abre a que já existe. A
                  meta de peso nasce no cadastro e vive em
                  `profile.goalWeight`; deixar criar uma segunda seria ter
                  dois números para a mesma pergunta, cada um com a sua
                  barra, divergindo na primeira vez que alguém mexesse num
                  só. */}
              <Linha
                ic="scale"
                titulo="Peso"
                sub="Do peso que você registra"
                /* replace, e não push: a folha TROCA de assunto em vez de
                    empilhar uma segunda por cima da primeira — que é o que
                    as outras linhas desta lista já fazem, por estado. */
                onPress={() => router.replace('/meta?alvo=peso' as any)}
              />
              {livres.map((i) => (
                <Linha
                  key={i.id}
                  ic={i.ic}
                  titulo={i.nome}
                  sub={i.origem}
                  onPress={() => abrir(i)}
                />
              ))}
            </Cartao>
            {livres.length ? null : (
              <Txt v="caption" c={c.tx3} style={{ paddingHorizontal: 2, marginTop: 10 }}>
                Você já tem uma meta para cada coisa que o app conta nos check-ins.
              </Txt>
            )}
          </Campo>

          {/* AS QUE ELE NÃO MEDE. Os cinco exemplos não gravam direto:
              preenchem o campo e deixam a pessoa terminar a frase — é aí
              que "entrar numa peça de roupa" vira a peça dela. */}
          <Campo rotulo="Você marca quando chegar" nu>
            <Cartao>
              {/* CATEGORIAS, e não frases prontas — a mesma forma da lista
                  de cima. "Um esporte" pergunta qual esporte; a frase
                  inteira só existe depois da resposta. */}
              {[...METAS_PESSOAIS, META_LIVRE].map((m) => (
                <Linha
                  key={m.id}
                  ic={m.ic}
                  titulo={m.nome}
                  sub={m.id === 'livre' ? 'Escreva do seu jeito' : undefined}
                  onPress={() => { setTexto(''); setPrazo('nao'); setPess(m); }}
                />
              ))}
            </Cartao>
          </Campo>
        </View>
      </SheetScreen>
    );
  }

  /* ---------------- uma meta da lista ---------------- */
  const meta: any = journeyGoals(S).find((x: any) => x.id === g);

  if (!meta) {
    return (
      <SheetScreen titulo="Meta" sub="Não encontrei esta meta" onClose={() => router.back()}>
        <Txt v="caption" c={c.tx3} style={{ marginTop: 18 }}>
          Ela pode ter sido apagada em outra tela.
        </Txt>
      </SheetScreen>
    );
  }

  const apagar = () => {
    update((s: any) => apagarMeta(s, meta.id));
    router.back();
  };

  return (
    <SheetScreen
      titulo={meta.label}
      sub={meta.pessoal ? 'Meta sua, marcada por você' : 'Meta medida pelos seus check-ins'}
      onClose={() => router.back()}
    >
      <View style={{ marginTop: 20, gap: 12 }}>
        {/* O FATO: onde ela está. Na medida é a porcentagem com a conta
            por baixo; na pessoal é o estado, que é tudo o que existe. */}
        <Row gap={14} style={{
          backgroundColor: c.bg1, borderRadius: 18, paddingHorizontal: 16, paddingVertical: 16,
        }}>
          <IconBadge name={meta.feita ? 'check' : meta.ic} size={52} iconSize={24} sw={1.9} />
          <View style={{ flex: 1 }}>
            {meta.pessoal ? (
              <Txt v="h2">{meta.feita ? 'Conquistada' : 'Ainda não'}</Txt>
            ) : (
              <Txt v="metric">
                {Math.round(meta.pct)}
                <Txt v="label" c={c.tx3}>%</Txt>
              </Txt>
            )}
            <Txt v="caption" c={c.tx3}>{meta.hint}</Txt>
          </View>
        </Row>

        {meta.pessoal ? (
          <View style={{ marginTop: 6, gap: 8 }}>
            <Botao
              label={meta.feita ? 'Ainda não consegui' : 'Consegui'}
              tom={meta.feita ? 'fantasma' : 'cheio'}
              onPress={() => update((s: any) => marcarMeta(s, meta.id))}
            />
            <Botao label="Apagar" tom="perigo" onPress={apagar} />
          </View>
        ) : (
          /* A MEDIDA NÃO SE MARCA NEM SE APAGA aqui. Ela sai dos
             check-ins, e uma caixinha por cima deixaria a pessoa
             contradizer o próprio registro — é a mesma regra do
             protocolo. O que dá para fazer com ela é responder o
             check-in, que é onde o número nasce. */
          <View style={{ gap: 12 }}>
            <Aviso
              ic="leaf"
              dentro
              titulo={meta.conta || 'Esta o app conta sozinho'}
              texto="Sai dos seus check-ins dos últimos catorze dias, e só dos dias que você respondeu. Não dá para marcar à mão — e é isso que faz o número valer alguma coisa."
            />
            {/* APAGAR EXISTE NAS DUAS. A medida não se marca, mas ela é uma
                meta como a outra: quem escolheu a régua errada precisa
                poder desistir dela sem ter de conviver com uma barra que
                não quer dizer nada. */}
            <Botao label="Apagar" tom="perigo" onPress={apagar} />
          </View>
        )}
      </View>
    </SheetScreen>
  );
}
