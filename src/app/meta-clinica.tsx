import React, { useState } from 'react';
import { View } from 'react-native';
import { useRouter } from 'expo-router';
import { useStore } from '../logic/store';
import { metaClinica, curWeight } from '../logic/derive';
import { now, nf, dataLonga } from '../logic/time';
import { Txt, SheetScreen } from '../ui/kit';
import { Campo, Opcoes, Opc, Botao, Regua, Aviso } from '../ui/internas';

/* ⚠️⚠️ ESTA FOLHA ANOTA, E NÃO RECEBE — e a diferença é a tela inteira.

   O aplicativo não tem servidor: nada do lado da clínica transmite para
   cá (PENDENCIAS, item 6). Então a meta de peso "da equipe" é a pessoa
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

  const atual = metaClinica(S);
  const peso = curWeight(S);
  const [kg, setKg] = useState<number>(atual?.kg ?? Math.round((peso ?? 80) - 5));
  const [por, setPor] = useState<string>(atual?.por ?? '');

  /* A equipe que já está no aplicativo vira as opções, para ninguém ter
     de digitar um nome que o aplicativo já sabe escrever. Sem equipe
     ligada, sobra a opção genérica — que continua sendo uma procedência
     honesta: "alguém da minha equipe", e não "o aplicativo".

     ⚠️ A MÉDICA VEM PRIMEIRO, E VEM DE OUTRO LUGAR. Ela mora em
     `profile.doctor`, uma string, enquanto `team` guarda nutricionista,
     enfermeira e psicólogo — quem lesse só o `team` montaria uma lista
     de quem acompanha a pessoa SEM a pessoa que prescreve, que é
     justamente quem define uma meta de peso. */
  const medica = (S.profile as any).doctor as string | undefined;
  const nomes: string[] = [
    ...(medica ? [medica] : []),
    ...((S.team as any[]) ?? []).map((m) => m.name),
    'Outra pessoa da equipe',
  ];

  const salvar = () => {
    if (!por) return;
    update((s: any) => {
      s.protocol = s.protocol ?? {};
      s.protocol.metaPeso = { kg, em: +now(), por };
    });
    router.back();
  };

  const remover = () => {
    update((s: any) => { if (s.protocol) s.protocol.metaPeso = null; });
    router.back();
  };

  return (
    <SheetScreen
      titulo="Meta da sua equipe"
      sub="O número que ela definiu, anotado por você"
      onClose={() => router.back()}
    >
      <View style={{ marginTop: 18, gap: 10 }}>
        <Campo rotulo="Peso">
          <Regua
            min={40} max={200} passo={0.5} tracoCada={1} casas={1} esp={9} salto={0.5}
            valor={kg} unidade="kg" onEscolhe={setKg}
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
          texto="Este número não substitui a sua meta de peso. Ela continua sendo a que mede a sua Jornada — as duas convivem, e quando discordam é assunto para a próxima consulta."
        />

        {atual ? (
          <Txt v="note" style={{ textAlign: 'center', marginTop: 2 }}>
            Anotado em {dataLonga(atual.em)}
          </Txt>
        ) : null}

        <Botao label={`Guardar ${nf(kg, 1)} kg`} onPress={salvar} desligado={!por} />
        {atual ? <Botao label="Remover a meta da equipe" tom="fantasma" onPress={remover} /> : null}
      </View>
    </SheetScreen>
  );
}
