import React, { useState } from 'react';
import { View } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useStore } from '../logic/store';
import {
  CADAS, FINS, HORAS, INICIOS, LEADS, ORDEM, SEMANA, TIPOS, acharAlerta, horasDe,
  inicialDoDia, novoAlerta, proximaDe, quando, rotuloDoLead,
  type Alerta, type TipoDeAlerta,
} from '../logic/alertas';
import { hm } from '../logic/time';
import { Txt, Row, SheetScreen } from '../ui/kit';
import { Campo, Opcoes, Opc, Grade, Botao } from '../ui/internas';
import { Icon } from '../ui/Icon';
import { useTheme } from '../ui/useTheme';

/* ============================================================
   UM ALERTA — a folha que monta e a que corrige

   Dois modos na mesma folha, como a de meta e a de refeição já fazem:

     (sem nada)   criar um alerta, escolhendo o assunto aqui dentro
     ?id=<id>     abrir um que existe, para mudar ou apagar

   Duas telas para isto seriam duas cópias do rodapé, dos horários e dos
   dias — e é exatamente aí que uma ganha o botão de apagar e a outra não.

   O ASSUNTO É A PRIMEIRA PERGUNTA, e não um parâmetro da rota. A lista
   atrás deixou de ter uma seção por assunto — ela é uma lista só, e o
   botão de criar é da tela inteira. Alguém que vem de lá ainda não disse
   de que é o alerta, e é aqui que ele diz.

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
    () => existente ?? novoAlerta(((tipo as TipoDeAlerta) in TIPOS() ? tipo : 'dose') as TipoDeAlerta),
  );

  /* TROCAR O ASSUNTO RECOMEÇA O ALERTA, e não só muda o rótulo dele.

     Cada assunto tem um jeito próprio de tocar: a dose conta dias antes
     da aplicação e a hidratação nasce em intervalo. Guardar as opções da
     pesagem ao trocar para hidratação daria um alerta de água às oito da
     manhã, uma vez — que é o que a pessoa acabou de dizer que não queria.

     Só vale enquanto o alerta é novo. Um que já existe não troca de
     assunto: mudar o que ele avisa é criar outro, e a folha teria de
     explicar o que aconteceu com o que estava ali. */
  const trocarTipo = (t: TipoDeAlerta) => setA((x) => ({ ...novoAlerta(t), id: x.id }));

  const t = TIPOS()[a.tipo];
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
      sub={existente ? t.desc : undefined}
      onClose={fechar}
      rodape={
        <View style={{ gap: 10 }}>
          <Botao label={existente ? 'Salvar' : 'Criar alerta'} onPress={salvar} />
          {existente ? <Botao label="Apagar este alerta" tom="perigo" onPress={apagar} /> : null}
        </View>
      }
    >
      <View style={{ marginTop: 20, gap: 18 }}>
        {!existente ? (
          <Campo nu rotulo="O que avisar">
            <Grade cols={2} gap={8}>
              {ORDEM.map((k) => (
                <Opc key={k} cheia ic={TIPOS()[k].ic} label={TIPOS()[k].curto} on={a.tipo === k} onPress={() => trocarTipo(k)} />
              ))}
            </Grade>
          </Campo>
        ) : null}

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
          /* OS SETE DIAS NUMA LINHA SÓ, pela inicial.

             Com o nome curto — seg, ter, qua — a fileira quebrava em duas,
             e uma semana partida ao meio deixa de ser uma semana: vira
             duas listas. Pela inicial, os sete cabem lado a lado, na ordem
             do calendário, e a pessoa vê a semana inteira de uma vez. A
             ambiguidade das duas quartas e dos dois sábados é a mesma de
             qualquer calendário de parede, e a posição resolve. */
          <Campo nu rotulo="Dias da semana" ajuda="Sem nenhum marcado, o alerta toca todo dia.">
            <Grade cols={7} gap={6}>
              {SEMANA.map((d) => (
                <Opc key={d} cheia label={inicialDoDia(d)} on={a.dias.includes(d)} onPress={() => trocarDia(d)} />
              ))}
            </Grade>
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
            {/* O relógio marca uma hora; as setas em volta marcam a
                repetição. São os dois desenhos que a diferença entre os
                modos já tem — um é ponto no dia, o outro é ritmo. */}
            <Opc cheia ic="clock" label="Horários" on={a.modo === 'horas'} onPress={() => mexer({ modo: 'horas' })} />
            <Opc cheia ic="reset" label="Intervalo" on={a.modo === 'intervalo'} onPress={() => mexer({ modo: 'intervalo' })} />
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
