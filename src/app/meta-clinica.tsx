import React, { useState } from 'react';
import { View } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useStore } from '../logic/store';
import { ALVOS, metaClinica, mudarAlvo, type ChaveDeAlvo } from '../logic/derive';
import { now, dataLonga } from '../logic/time';
import { Txt, SheetScreen } from '../ui/kit';
import { Campo, Opcoes, Opc, Botao, Regua, Aviso } from '../ui/internas';

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

  const chave = ((alvo as ChaveDeAlvo) || 'peso') as ChaveDeAlvo;
  const def = ALVOS[chave];
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
    'Outra pessoa da equipe',
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
      titulo={`${def.nome} · da equipe`}
      sub="O número que ela definiu, anotado por você"
      onClose={() => router.back()}
    >
      <View style={{ marginTop: 18, gap: 10 }}>
        <Campo rotulo="Valor" nu>
          <Regua
            min={r.min} max={r.max} passo={r.passo} tracoCada={r.tracoCada}
            casas={r.casas} esp={r.esp} salto={r.salto}
            valor={paraRegua(v)} unidade={def.un}
            escreve={(x) => def.escreve(deRegua(x))}
            onEscolhe={(x) => setV(deRegua(x))}
          />
        </Campo>

        <Campo
          rotulo="Quem definiu"
          ajuda="Fica guardado junto do número, para você lembrar de onde ele veio."
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
            ? 'Este número não substitui a sua meta de peso. Ela continua sendo a que mede a sua Jornada — as duas convivem, e quando discordam é assunto para a próxima consulta.'
            /* ⚠️ ISTO DIZIA "você pode mudá-lo depois, em Os números do
               dia", e deixou de ser verdade quando o número da equipe
               passou a travar a régua de lá. Promessa que a tela não
               cumpre é do tipo que só se descobre no dia em que a pessoa
               precisa — e aí ela já não confia no resto. */
            : 'Guardando, este passa a ser o número que o aplicativo cobra, e ele não se muda mais pela régua de Os números do dia: é parte do seu tratamento. Para soltá-lo, é só remover esta anotação aqui.'}
        />

        {atual ? (
          <Txt v="note" style={{ textAlign: 'center', marginTop: 2 }}>
            Anotado em {dataLonga(atual.em)}
          </Txt>
        ) : null}

        <Botao label={`Guardar ${def.escreve(v)} ${def.un}`} onPress={salvar} desligado={!por} />
        {atual ? <Botao label="Remover a meta da equipe" tom="fantasma" onPress={remover} /> : null}
      </View>
    </SheetScreen>
  );
}
