import React, { useState } from 'react';
import { View } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useStore } from '../logic/store';
import {
  CADAS, FINS, HORAS, INICIOS, LEADS, TIPOS, acharAlerta, horasDe, novoAlerta,
  proximaDe, quando, rotuloDoLead,
  type Alerta, type TipoDeAlerta,
} from '../logic/alertas';
import { DOW_SHORT, hm } from '../logic/time';
import { Txt, Row, SheetScreen } from '../ui/kit';
import { Campo, Opcoes, Opc, Grade, Botao } from '../ui/internas';
import { Icon } from '../ui/Icon';
import { useTheme } from '../ui/useTheme';

/* ============================================================
   UM ALERTA — a folha que monta e a que corrige

   Dois modos na mesma folha, como a de meta e a de refeição já fazem:

     ?tipo=agua   criar um alerta novo daquele assunto
     ?id=<id>     abrir um que existe, para mudar ou apagar

   Duas telas para isto seriam duas cópias do rodapé, dos horários e dos
   dias — e é exatamente aí que uma ganha o botão de apagar e a outra não.

   A EDIÇÃO É EM RASCUNHO, e só grava no Salvar. A lista atrás mostra
   "Seg, qui · 08:00" e reagenda os avisos a cada mudança do estado:
   gravando a cada toque, mexer nos dias faria o app cancelar e remarcar a
   fila de notificações cinco vezes seguidas, e a linha de trás piscaria
   a cada dedo. Aqui a pessoa monta, confere o "toca em", e confirma.
   ============================================================ */

export default function AlertaFolha() {
  const S = useStore((s) => s.S);
  const update = useStore((s) => s.update);
  const { c } = useTheme();
  const router = useRouter();
  const { id, tipo } = useLocalSearchParams<{ id?: string; tipo?: string }>();

  const existente = id ? acharAlerta(S, id) : null;
  const [a, setA] = useState<Alerta>(
    () => existente ?? novoAlerta(((tipo as TipoDeAlerta) in TIPOS ? tipo : 'agua') as TipoDeAlerta),
  );

  const t = TIPOS[a.tipo];
  const fechar = () => router.back();

  const mexer = (p: Partial<Alerta>) => setA((x) => ({ ...x, ...p }));

  /* UM HORÁRIO É O MÍNIMO. Desmarcar o último deixaria um alerta que não
     toca nunca — e um alerta que não toca é um alerta desligado com mais
     passos. A chave de ligado existe para isso. */
  const trocarHora = (h: number) => {
    const tem = a.horas.includes(h);
    if (tem && a.horas.length === 1) return;
    mexer({ horas: tem ? a.horas.filter((x) => x !== h) : [...a.horas, h].sort((x, y) => x - y) });
  };

  /* NENHUM DIA MARCADO QUER DIZER TODO DIA, e por isso desmarcar o
     último é permitido: ele não deixa o alerta inválido, devolve ele ao
     padrão. É a mesma coisa que o despertador faz com a repetição. */
  const trocarDia = (d: number) => {
    const tem = a.dias.includes(d);
    mexer({ dias: tem ? a.dias.filter((x) => x !== d) : [...a.dias, d] });
  };

  const salvar = () => {
    update((s: any) => {
      const lista: Alerta[] = s.alertas ?? (s.alertas = []);
      const i = lista.findIndex((x) => x.id === a.id);
      if (i >= 0) lista[i] = a; else lista.push(a);
    });
    fechar();
  };

  const apagar = () => {
    update((s: any) => { s.alertas = (s.alertas ?? []).filter((x: Alerta) => x.id !== a.id); });
    fechar();
  };

  /* O QUE ESTE ALERTA VAI FAZER, no estado em que está sendo montado.

     É a mesma conta do agendador, rodando sobre o rascunho: a pessoa
     marca quinta-feira e a linha muda para quinta antes de ela salvar.
     Sem isso, montar um alerta seria escolher opções no escuro e
     descobrir o resultado na lista de trás. */
  const proxima = quando(proximaDe(S, { ...a, on: true }));

  return (
    <SheetScreen
      titulo={existente ? 'Alerta de ' + t.titulo.toLowerCase() : 'Novo alerta'}
      sub={existente ? undefined : t.titulo}
      onClose={fechar}
      rodape={
        <View style={{ gap: 10 }}>
          <Botao label={existente ? 'Salvar' : 'Criar alerta'} onPress={salvar} />
          {existente ? <Botao label="Apagar este alerta" tom="perigo" onPress={apagar} /> : null}
        </View>
      }
    >
      <View style={{ marginTop: 20, gap: 18 }}>
        {/* A ANTECEDÊNCIA, só para a dose: ela não acontece num dia da
            semana, acontece antes da próxima aplicação — que anda. */}
        {t.temLead ? (
          <Campo nu rotulo="Antecedência" ajuda="Contada a partir da data da sua próxima aplicação.">
            <Opcoes>
              {LEADS.map((n) => (
                <Opc key={n} label={rotuloDoLead(n)} on={(a.lead ?? 0) === n} onPress={() => mexer({ lead: n })} />
              ))}
            </Opcoes>
          </Campo>
        ) : null}

        {t.temDias ? (
          <Campo nu rotulo="Dias" ajuda="Sem nenhum marcado, o alerta toca todo dia.">
            <Opcoes>
              {[1, 2, 3, 4, 5, 6, 0].map((d) => (
                <Opc key={d} label={DOW_SHORT[d]} on={a.dias.includes(d)} onPress={() => trocarDia(d)} />
              ))}
            </Opcoes>
          </Campo>
        ) : null}

        {/* DOIS JEITOS DE DIZER A QUE HORAS, e a escolha entre eles vem
            antes deles: escolher hora a hora serve para o que acontece uma
            ou duas vezes no dia; a hidratação é o oposto — não é um
            momento, é o dia inteiro em intervalos, e marcar oito pastilhas
            à mão para descrever "de duas em duas horas" é o app fazendo a
            pessoa trabalhar para dizer o que cabe numa frase. */}
        <Campo nu rotulo="Quando tocar">
          <Grade cols={2} gap={8}>
            <Opc cheia label="Em horários" on={a.modo === 'horas'} onPress={() => mexer({ modo: 'horas' })} />
            <Opc cheia label="Em intervalos" on={a.modo === 'intervalo'} onPress={() => mexer({ modo: 'intervalo' })} />
          </Grade>
        </Campo>

        {a.modo === 'horas' ? (
          /* OS HORÁRIOS EM GRADE, e não embrulhados: são dezesseis peças do
             mesmo tamanho e da mesma natureza, e embrulhadas elas formam um
             mosaico com fileiras de comprimentos diferentes. Em quatro
             colunas retas o olho corre a lista em vez de reler cada linha. */
          <Campo nu rotulo="Horários" ajuda="Dá para marcar mais de um — o alerta toca em cada um deles.">
            <Grade cols={4} gap={8}>
              {HORAS.map((h) => (
                <Opc key={h} cheia label={hm(h, 0)} on={a.horas.includes(h)} onPress={() => trocarHora(h)} />
              ))}
            </Grade>
          </Campo>
        ) : (
          <>
            <Campo nu rotulo="A cada">
              <Opcoes>
                {CADAS.map((n) => (
                  <Opc key={n} label={`${n}h`} on={a.cada === n} onPress={() => mexer({ cada: n })} />
                ))}
              </Opcoes>
            </Campo>
            {/* A JANELA EM DUAS FILEIRAS, e não numa só: começo e fim são
                duas respostas, e lado a lado a pessoa lê a segunda como
                continuação da primeira. O fim nunca fica antes do começo —
                escolher um começo mais tarde empurra o fim junto, em vez de
                deixar gravado um alerta que não toca nunca. */}
            <Campo nu rotulo="Começa">
              <Opcoes>
                {INICIOS.map((h) => (
                  <Opc key={h} label={hm(h, 0)} on={a.de === h} onPress={() => mexer({ de: h, ate: Math.max(a.ate, h) })} />
                ))}
              </Opcoes>
            </Campo>
            <Campo nu rotulo="Até" ajuda={`${horasDe(a).length} avisos por dia, de ${a.cada} em ${a.cada} horas.`}>
              <Opcoes>
                {FINS.map((h) => (
                  <Opc key={h} label={hm(h, 0)} on={a.ate === h} onPress={() => mexer({ ate: h, de: Math.min(a.de, h) })} />
                ))}
              </Opcoes>
            </Campo>
          </>
        )}

        <Row gap={8} style={{ alignItems: 'center' }}>
          <Icon name="bell" size={14} color={c.accent} sw={2} />
          <Txt v="caption" c={c.tx2} style={{ flex: 1 }}>
            {proxima ? `Toca ${proxima}` : 'Sem horário marcado'}
          </Txt>
        </Row>
      </View>
    </SheetScreen>
  );
}
