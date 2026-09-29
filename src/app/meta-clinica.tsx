import React, { useState } from 'react';
import { View } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useStore } from '../logic/store';
import { ALVOS, metaClinica, mudarAlvo, type ChaveDeAlvo } from '../logic/derive';
import { now, dataLonga } from '../logic/time';
import { Txt, SheetScreen } from '../ui/kit';
import { Campo, Opcoes, Opc, Botao, Regua, Aviso } from '../ui/internas';
import { T } from '../textos';

/* ⚠️ É FUNÇÃO, porque lê o catálogo. Ver src/textos/README. */
const K = () => T.metas.telaMetaDaEquipe;

/* ⚠️⚠️ ESTA FOLHA ANOTA, E NÃO RECEBE — e a diferença é a tela inteira.

   O aplicativo não tem servidor: nada do lado da clínica transmite para
   cá (PENDENCIAS, item 6). Então uma meta "da equipe" é a pessoa
   escrevendo o número que a equipe dela disse, e todo texto daqui foi
   escrito para nunca sugerir outra coisa. Nada de "receber da clínica",
   nada de "sincronizar": o verbo é ANOTAR, que é o que de fato acontece.

   ⚠️ E É POR ISSO QUE O NOME E A DATA SÃO OBRIGATÓRIOS DE FATO, não por
   capricho de formulário. Um número sozinho, guardado num campo chamado
   "meta da equipe", passa a afirmar uma procedência que ninguém tem como
   conferir depois — nem ela, daqui a seis meses. Com "Dra. Helena Costa,
   12 de março", a frase que as outras telas mostram continua sendo
   verdadeira, e continua sendo checável por quem a escreveu.

   ⚠️ NÃO EXISTE APAGAR PELA RÉGUA. Quem anotou um número e quer tirá-lo
   usa o botão de remover, que é explícito. Régua que zera vira "arrastei
   até o fim sem querer e perdi o que a minha médica falou". */
export default function MetaClinica() {
  const S = useStore((s) => s.S);
  const update = useStore((s) => s.update);
  const router = useRouter();
  const { alvo } = useLocalSearchParams<{ alvo?: string }>();

  /* Uma chave que não existe — um link antigo, digitado — cai no peso, em vez
     de derrubar a tela lendo a régua de um alvo que não há. */
  const chave: ChaveDeAlvo = alvo && alvo in ALVOS() ? (alvo as ChaveDeAlvo) : 'peso';
  const def = ALVOS()[chave];
  const atual = metaClinica(S, chave);
  const r = def.regua;
  const paraRegua = def.paraRegua ?? ((x: number) => x);
  const deRegua = def.deRegua ?? ((x: number) => x);

  const [v, setV] = useState<number>(atual?.valor ?? def.le(S));
  const [por, setPor] = useState<string>(atual?.por ?? '');

  /* A equipe que já está no aplicativo vira as opções, para ninguém ter
     de digitar um nome que o aplicativo já sabe escrever. Sem equipe
     ligada, sobra a opção genérica — que continua sendo uma procedência
     honesta: "alguém da minha equipe", e não "o aplicativo".

     ⚠️ A MÉDICA VEM PRIMEIRO, E VEM DE OUTRO LUGAR. Ela mora em
     `profile.doctor`, uma string, enquanto `team` guarda nutricionista,
     enfermeira e psicólogo — quem lesse só o `team` montaria uma lista
     de quem acompanha a pessoa SEM a pessoa que prescreve, que é
     justamente quem define uma meta. */
  const medica = (S.profile as any).doctor as string | undefined;
  const nomes: string[] = [
    ...(medica ? [medica] : []),
    ...((S.team as any[]) ?? []).map((m) => m.name),
    K().outraPessoa,
  ];

  /* ⚠️ O PESO NÃO ENTRA EM `targets`, OS OUTROS TRÊS ENTRAM. Não é
     inconsistência: a meta de peso é um destino, e dela — as duas podem
     conviver porque nenhuma tela conta nada contra elas todo dia. Os três
     números do dia são parâmetros: o anel enche contra um número, o
     protocolo conta dias contra um número. Dois seriam a mesma pergunta
     com duas respostas. O comentário longo está em derive.ts, em
     `procedenciaDoAlvo`. */
  const salvar = () => {
    if (!por) return;
    update((s: any) => {
      s.protocol = s.protocol ?? {};
      s.protocol.metas = s.protocol.metas ?? {};
      s.protocol.metas[chave] = { valor: v, em: +now(), por };
      /* ⚠️ `false`: quem definiu foi a equipe. Marcar como edição dela
         apagaria a procedência que esta folha existe para guardar. E a
         marca antiga sai junto — o número passou a ser da equipe de novo,
         então "você mudou este número" deixou de ser verdade. */
      if (chave !== 'peso') {
        mudarAlvo(s, chave, v, false);
        if (s.profile.alvosEditados) delete s.profile.alvosEditados[chave];
      }
    });
    router.back();
  };

  /* Remover apaga a ANOTAÇÃO, e não devolve número antigo nenhum: o que o
     aplicativo cobra hoje continua sendo o que está valendo. Desfazer uma
     procedência é uma coisa; mexer no número que o anel cobra é outra, e
     essa se faz em Os números do dia, de propósito. */
  const remover = () => {
    update((s: any) => { if (s.protocol?.metas) delete s.protocol.metas[chave]; });
    router.back();
  };

  return (
    <SheetScreen
      titulo={K().titulo(def.nome)}
      sub={K().sub}
      onClose={() => router.back()}
    >
      <View style={{ marginTop: 18, gap: 10 }}>
        <Campo rotulo={K().valor} nu>
          <Regua
            min={r.min} max={r.max} passo={r.passo} tracoCada={r.tracoCada}
            casas={r.casas} esp={r.esp} salto={r.salto}
            valor={paraRegua(v)} unidade={def.un(S)}
            escreve={(x) => def.escreve(deRegua(x), S)}
            onEscolhe={(x) => setV(deRegua(x))}
          />
        </Campo>

        <Campo
          rotulo={K().quemDefiniu}
          ajuda={K().quemAjuda}
        >
          <Opcoes>
            {nomes.map((n) => (
              <Opc key={n} label={n} on={por === n} onPress={() => setPor(n)} />
            ))}
          </Opcoes>
        </Campo>

        <Aviso
          ic="steth"
          texto={chave === 'peso'
            ? K().naoSubstituiPeso
            /* ⚠️ ISTO DIZIA "você pode mudá-lo depois, em Os números do
               dia", e deixou de ser verdade quando o número da equipe
               passou a travar a régua de lá. Promessa que a tela não
               cumpre é do tipo que só se descobre no dia em que a pessoa
               precisa — e aí ela já não confia no resto. */
            : K().passaACobrar}
        />

        {atual ? (
          <Txt v="note" style={{ textAlign: 'center', marginTop: 2 }}>
            Anotado em {dataLonga(atual.em)}
          </Txt>
        ) : null}

        <Botao label={K().guardar(`${def.escreve(v, S)} ${def.un(S)}`)} onPress={salvar} desligado={!por} />
        {atual ? <Botao label={K().remover} tom="fantasma" onPress={remover} /> : null}
      </View>
    </SheetScreen>
  );
}
