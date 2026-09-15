import React, { useState } from 'react';
import { View } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useStore } from '../logic/store';
import {
  ALVOS, apagarMeta, guardarMetaMedida, guardarMetaPessoal, indicadoresLivres, padraoDe,
  journeyGoals, marcarMeta, mudarAlvo, type ChaveDeAlvo, type Indicador,
} from '../logic/derive';
import { Txt, Row, SheetScreen, IconBadge } from '../ui/kit';
import { Campo, Escala, Stepper, Texto, Botao, Aviso, Cartao, Linha } from '../ui/internas';
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
  const [escrevendo, setEscrevendo] = useState(false);
  /* O indicador escolhido no primeiro passo, e o número que a pessoa está
     ajustando no segundo. */
  const [ind, setInd] = useState<Indicador | null>(null);
  const [regua, setRegua] = useState(0);

  if (novo === '1') {
    const livres = indicadoresLivres(S);
    const criar = () => {
      update((s: any) => guardarMetaPessoal(s, texto));
      router.back();
    };
    const abrir = (i: Indicador) => { setInd(i); setRegua(padraoDe(i, S)); };
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

    /* ESCREVER É O ÚLTIMO ANDAR, e não o primeiro.

       A folha pedia direto um texto livre — e texto livre vira meta que o
       app não sabe acompanhar, porque ele não tem como adivinhar que
       "dormir melhor" é a coluna sono. A pessoa escrevia uma meta
       mensurável e recebia uma caixinha para marcar à mão. */
    if (escrevendo) {
      return (
        <SheetScreen
          titulo="Outra meta"
          sub="Uma coisa que só você sabe dizer quando chegou"
          onClose={() => setEscrevendo(false)}
          rodape={(
            <Botao
              label={texto.trim() ? 'Guardar meta' : 'Escreva a meta'}
              desligado={!texto.trim()}
              onPress={criar}
            />
          )}
        >
          <View style={{ marginTop: 20, gap: 14 }}>
            <Campo rotulo="A meta" ajuda="Escreva do seu jeito — ela aparece exatamente assim." nu>
              <Texto
                valor={texto}
                onChange={setTexto}
                placeholder="Vestir a calça jeans antiga"
                linhas={2}
              />
            </Campo>

            {/* SEM PORCENTAGEM, e sem prazo. Esta meta é uma coisa que
                acontece num dia: ou ainda não, ou conseguiu. Pedir aqui um
                "quanto por cento" seria pedir um número que ninguém tem
                como responder — e foi o que a tela fazia até agora, com um
                60% escrito no código. */}
            <Aviso
              ic="target"
              dentro
              titulo="Ela não tem barra nem prazo"
              texto="Fica em ainda não até você marcar. No dia em que acontecer, o app guarda a data junto."
            />
          </View>
        </SheetScreen>
      );
    }

    return (
      <SheetScreen
        titulo="Nova meta"
        sub="Escolha o que o app acompanha, ou escreva a sua"
        onClose={() => router.back()}
      >
        <View style={{ marginTop: 18, gap: 10 }}>
          {/* AS QUE O APP CONTA, pelo nome genérico. O número vem no toque
              seguinte — a lista diz de QUE coisa se trata, e a régua é de
              quem está criando a meta. */}
          {livres.length ? (
            <Cartao>
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
          ) : (
            <Txt v="caption" c={c.tx3} style={{ paddingHorizontal: 2 }}>
              Você já tem uma meta para cada coisa que o app sabe contar.
            </Txt>
          )}

          {/* E A OUTRA PORTA, embaixo e separada: o que o app não mede.
              Ela não é a opção de segunda classe — é a única honesta para
              uma calça que precisa fechar. */}
          <Cartao>
            <Linha
              ic="target"
              titulo="Outra coisa"
              sub="Uma meta que só você sabe dizer quando chegou"
              onPress={() => setEscrevendo(true)}
            />
          </Cartao>
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
