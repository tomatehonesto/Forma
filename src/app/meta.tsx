import React, { useState } from 'react';
import { View } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useStore } from '../logic/store';
import {
  ALVOS, METAS_PESSOAIS, META_LIVRE, PRAZOS, apagarMeta,
  guardarMetaPessoal, journeyGoals, marcarMeta,
  mudarAlvo, procedenciaDoAlvo, type ChaveDeAlvo, type MetaPessoal,
} from '../logic/derive';
import { Txt, Row, SheetScreen, IconBadge } from '../ui/kit';
import { DAY, fmtDate, now, startOfDay, dataLonga } from '../logic/time';
import { Campo, Chips, Regua, Texto, Botao, Aviso, Cartao, Linha } from '../ui/internas';
import { useTrocarDeTela } from '../ui/useTrocarDeTela';
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
  /* Folha para folha: fecha esta antes de abrir a da equipe, senão as duas
     empilham e o scrim da de baixo escurece a de cima. */
  const trocarDeTela = useTrocarDeTela();
  const { alvo, g, novo } = useLocalSearchParams<{ alvo?: string; g?: string; novo?: string }>();

  /* ---------------- um dos quatro números ---------------- */
  const chave = alvo as ChaveDeAlvo | undefined;
  const def = chave ? ALVOS[chave] : null;
  const [v, setV] = useState<number>(() => (def ? def.le(S) : 0));

  if (def && chave) {
    /* ⚠️ A RÉGUA, E ERAM OS QUATRO NO <Stepper>.

       O peso já se arrasta em toda tela que o pergunta — no cadastro, no
       registro, na medição. Aqui ele era mais e menos, e a proteína e a
       hidratação também: a mesma pergunta com dois controles, dependendo
       de qual folha a pessoa abriu.

       A conversão mora na fronteira: a régua da hidratação anda em
       litros, que é como o número se lê, e o estado segue em mililitros. */
    const r = def.regua;
    const paraRegua = def.paraRegua ?? ((x: number) => x);
    const deRegua = def.deRegua ?? ((x: number) => x);
    const salvar = () => {
      update((s: any) => mudarAlvo(s, chave, v));
      router.back();
    };
    const proc = procedenciaDoAlvo(S, chave);

    /* ⚠️⚠️ SEM RÉGUA QUANDO O NÚMERO É DA EQUIPE.

       Este é um tratamento, e quem define quanta proteína come alguém que
       usa GLP-1 é a profissional que acompanha — não uma régua arrastada
       num domingo à noite. Enquanto houver anotação da equipe para este
       alvo, a folha mostra o número e não deixa mexer.

       ⚠️ E A SAÍDA FICA À VISTA, na mesma tela. Ela é a Área médica, onde
       a anotação se remove; removida, o número volta a ser editável aqui.
       Sem essa porta a trava seria uma armadilha — quem tem restrição
       renal, quem se lesionou, quem trocou de nutricionista e ficou com
       um número velho não pode ficar presa a ele. A diferença entre isso
       e a régua é que remover é um ato consciente, e diz outra coisa:
       "este não é mais o número que a minha equipe passou".

       O peso não trava: lá as duas metas convivem, e a que esta folha
       edita é a dela. Ver procedenciaDoAlvo em derive.ts. */
    return (
      <SheetScreen
        titulo={def.nome}
        sub={def.onde}
        onClose={() => router.back()}
        rodape={proc.travado ? undefined : <Botao label="Salvar" onPress={salvar} />}
      >
        <View style={{ marginTop: 20, gap: 14 }}>
          {proc.travado ? (
            <Campo rotulo="Definido pela sua equipe" nu>
              <Txt v="display" style={{ textAlign: 'center' }}>
                {def.escreve(def.le(S), S)} {def.un(S)}
              </Txt>
            </Campo>
          ) : (
            <Campo rotulo="Novo valor" nu>
              <Regua
                min={r.min} max={r.max} passo={r.passo} tracoCada={r.tracoCada}
                casas={r.casas} esp={r.esp} salto={r.salto}
                valor={paraRegua(v)} unidade={def.un(S)}
                escreve={(x) => def.escreve(deRegua(x), S)}
                onEscolhe={(x) => setV(deRegua(x))}
              />
            </Campo>
          )}

          {/* O QUE MUDA COM ISSO. Um número de meta não vive na tela de
              metas: ele reaparece amanhã na barra da alimentação e na
              contagem do protocolo. Quem sobe a proteína de 90 para 110
              merece saber onde vai encontrar a conta nova.

              ⚠️ E DE ONDE ELE VEIO, que a folha não dizia. Três dos quatro
              saíram de uma conta com as respostas do cadastro — peso,
              idade, nível de atividade —, e sem dizer isso a folha parece
              um campo vazio à espera de um palpite. Mexer num número
              calculado sabendo que ele foi calculado é uma decisão
              diferente de mexer num número que parecia não ter dono. */}
          <Aviso
            ic="info"
            dentro
            titulo={`Hoje: ${def.escreve(def.le(S), S)} ${def.un(S)}`}
            /* ⚠️ A ORIGEM DEIXA DE SER SEMPRE A CONTA DO CADASTRO, e são
               três respostas possíveis para "de onde veio este número":

               · da equipe, quando alguém definiu e a pessoa anotou —
                 "calculado do seu peso, a 1,2 g por quilo" seria falso,
                 porque o número saiu de uma consulta e não de uma conta;
               · dela, quando ela sobrescreveu o da equipe — e aqui a
                 frase da conta é falsa do mesmo jeito;
               · da conta do cadastro, que é o caso de quem nunca mexeu.

               ⚠️ SOBRA UM CASO QUE ESTA TELA AINDA ERRA, e é anterior a
               tudo isto: quem edita um número CALCULADO, sem meta de
               equipe nenhuma, continua lendo "calculado do seu peso"
               depois de ter mudado. O aplicativo não guarda que ela
               editou — só saberia com um campo novo no estado, e este
               commit não é a hora. */
            texto={`${proc.meta
              ? (proc.alterada
                /* e não "você mudou este número": o aviso de baixo já abre
                   com essa frase, e as duas empilhadas dizem a mesma coisa
                   duas vezes. Aqui a pergunta é de quem o número é. */
                ? 'Um número seu'
                : `Definido por ${proc.meta.por}, anotado em ${dataLonga(proc.meta.em)}`)
              : proc.editadoEm
                /* ⚠️ O CASO QUE ESTA TELA ERRAVA ATÉ AQUI. Quem arrastava a
                   régua de um número calculado continuava lendo "calculado
                   do seu peso, a 1,2 g por quilo" — uma frase falsa sobre a
                   origem de um dado, do mesmo tipo que saiu do resto do
                   aplicativo esta semana. Agora `mudarAlvo` guarda quando
                   ela mexeu, e a frase conta isso. */
                ? `Você definiu este número em ${dataLonga(proc.editadoEm)}`
                : def.origem}. ${proc.travado
              /* ⚠️ NÃO SE EXPLICA UMA MUDANÇA QUE A TELA NÃO DEIXA FAZER.

                 Esta frase conta o que acontece com os dias já
                 registrados quando o número muda — e ficou pendurada
                 embaixo de um número travado, explicando uma ação que
                 não existe mais ali. Texto morto no meio de texto vivo é
                 pior que texto morto sozinho: quem lê procura a régua
                 que a frase promete. */
              ? ''
              : chave === 'peso'
                ? 'É o ponto de chegada combinado com a equipe, e mexer nele muda a régua da Jornada e da evolução — sem apagar nada do que já foi registrado.'
                : 'A mudança vale a partir de agora: os dias já registrados continuam valendo o que valiam, e o que muda é contra o que eles passam a ser comparados.'}`.trim()}
          />

          {/* ⚠️ A RESSALVA É OUTRO AVISO, e não uma terceira frase do de
              cima. O primeiro explica o número; este diz o que mexer nele
              faz do lado da clínica — são duas coisas de naturezas
              diferentes, e empilhadas no mesmo parágrafo a segunda vira
              rodapé da primeira. */}
          {/* ⚠️ TRÊS RESSALVAS DIFERENTES, PARA TRÊS SITUAÇÕES DIFERENTES.

              A antiga servia a um caso só: número calculado pelo
              aplicativo, com o protocolo contando dias contra ele. Agora
              o número pode ter dono, e mexer num número que uma
              profissional definiu não é a mesma decisão que mexer num
              palpite do cadastro — nem de longe.

              ⚠️ NENHUMA DELAS TRAVA NADA. É o corpo dela e o aplicativo
              dela, e ela pode mudar o que quiser. O que muda entre as
              três é o que ela SABE ao mudar: quem sobrescreve 110 g de
              uma nutricionista merece ler isso antes, e merece continuar
              vendo, depois, que aquele 110 existiu. */}
          {proc.meta && !proc.alterada ? (
            <Aviso
              ic="steth" dentro
              titulo={`Quem definiu foi ${proc.meta.por}`}
              texto={`Este número é parte do seu tratamento, e por isso não se muda aqui. Se ele não serve mais — outra orientação, uma restrição que apareceu, uma equipe nova —, remova a anotação na Área médica e ele volta a ser seu.`}
            />
          ) : proc.meta && proc.alterada ? (
            <Aviso
              ic="steth" dentro
              titulo="Este número não é o da sua equipe"
              texto={`${proc.meta.por} definiu ${def.escreve(proc.meta.valor, S)} ${def.un(S)}, e o aplicativo está cobrando ${def.escreve(def.le(S), S)} ${def.un(S)}. Guardamos os dois: dá para voltar ao dela na Área médica, ou levar a diferença para a próxima consulta.`}
            />
          ) : def.ressalva ? (
            <Aviso ic="steth" dentro titulo="Este é o valor recomendado" texto={def.ressalva} />
          ) : null}

          {/* A SAÍDA, e ela é a mesma porta que trouxe o número para cá. */}
          {proc.meta && chave !== 'peso' ? (
            <Cartao>
              <Linha
                ic="steth"
                titulo="Ver a anotação da sua equipe"
                sub={`${proc.meta.por} · ${def.escreve(proc.meta.valor, S)} ${def.un(S)}`}
                onPress={() => trocarDeTela(`/meta-clinica?alvo=${chave}`)}
              />
            </Cartao>
          ) : null}
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

  if (novo === '1') {

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
                : 'Ela fica em ainda não até você marcar. No dia em que acontecer, guardamos a data junto.'}
            </Txt>
          </View>
        </SheetScreen>
      );
    }

    return (
      <SheetScreen
        titulo="Nova meta"
        sub="Uma coisa sua. Guardamos para você, e quem marca é você"
        onClose={() => router.back()}
      >
        {/* ⚠️⚠️ ESTA FOLHA VIROU O LUGAR DAS METAS QUE NÃO SÃO CLÍNICAS, e
            tinha duas seções.

            A de cima oferecia o que o aplicativo conta sozinho — sono,
            e por um tempo proteína, hidratação e movimento. Ela encolheu
            commit a commit, por razões separadas que apontavam todas para
            o mesmo lugar: sintoma não vira placar, e número do dia já se
            edita em Os números do dia. No fim sobrou o sono, uma seção de
            uma linha.

            E o sono foi junto porque a premissa mudou: quem cria a conta
            já sai do cadastro com um PLANO — proteína, hidratação e
            movimento calculados do corpo dela. O lado clínico das metas
            chega pronto e se ajusta em Os números do dia; o protocolo da
            semana cobra a constância. Não sobrou pergunta para esta folha
            fazer sobre números.

            O que sobrou é o que nenhuma conta alcança: caber numa calça,
            voltar à praia, largar um hábito. É uma folha melhor por ser
            uma coisa só — e o subtítulo passou a dizer o que ela é, em vez
            de anunciar uma escolha entre duas naturezas que não existe
            mais.

            ⚠️ O CATÁLOGO DE INDICADORES FICA. Quem tem uma meta de sono
            criada antes continua com ela, com a porcentagem e tudo — a
            regra é a mesma que valeu para enjoo e humor: paramos de
            oferecer, não tiramos de ninguém. */}
        <View style={{ marginTop: 18, gap: 22 }}>
          {/* AS QUE ELE NÃO MEDE. Os cinco exemplos não gravam direto:
              preenchem o campo e deixam a pessoa terminar a frase — é aí
              que "entrar numa peça de roupa" vira a peça dela. */}
          <Campo rotulo="Escolha o tipo" nu>
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
              titulo={meta.conta || 'Esta nós contamos por você'}
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
