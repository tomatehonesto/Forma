import React, { useState } from 'react';
import { View, Share } from 'react-native';
import { useRouter } from 'expo-router';
import { useStore } from '../logic/store';
import { examStatus, hasClinic } from '../logic/derive';
import {
  resumoDoTratamento, resumoEmTexto, valorDoExame, enviosDoResumo, registrarEnvio,
  type SecaoDoResumo,
} from '../logic/resumo';
import { fmtDate, now, relDay } from '../logic/time';
import { Txt, Row, Vazio } from '../ui/kit';
import { TelaInterna, Titulao, Bloco, Cartao, Linha, Botao, Aviso } from '../ui/internas';
import { Icon } from '../ui/Icon';
import { useTheme } from '../ui/useTheme';

/* ============================================================
   RESUMO PARA O MÉDICO

   ⚠️ ELE SE FANTASIAVA DE PDF. Papel branco sem raio, cabeçalho com fio
   fino, rótulos em caixa alta, valores alinhados à direita como uma
   coluna de laudo. O problema não é estético: quem abre esta tela é a
   PESSOA, não o médico — ela vem conferir o que está indo, e um
   documento imita mal a tela que ela sabe usar. O papel é o que sai daqui
   pelo envio e pelo compartilhar; aqui dentro é aplicativo.

   ⚠️ E OS EXAMES ESTAVAM ILEGÍVEIS. Cada linha dizia "Glicemia jejum ·
   96 mg/dL · ref 70–99", que é leitura para quem lê exame o dia inteiro.
   Para quem registrou, a faixa crua é ruído: o que ela quer saber é se
   está dentro. Agora o veredito vem como selo — o mesmo de /exames, com
   as mesmas palavras — e a faixa completa continua a um toque.

   ⚠️ E "ENVIAR" MANDAVA UM TEXTO NO CHAT. Do outro lado existe a
   plataforma da equipe; o que chega lá é um documento datado, e não um
   muro de texto no meio de uma conversa. Ver src/logic/resumo.ts.

   ⚠️ E A SEÇÃO DE ANOTAÇÕES ERA UMA PLACA. Quando não havia nenhuma, ela
   dizia "elas se escrevem em Notas para a consulta" — uma frase que
   nomeia um lugar sem levar a ele, na única tela em que a pessoa descobre
   que a seção existe. Agora cada nota abre onde se edita, e o vazio tem
   porta.
   ============================================================ */

/* Uma linha de chave e valor. É o mesmo desenho de Linha, com o valor no
   lugar do selo: rótulo em tinta média à esquerda, número em peso médio à
   direita, que é como se lê uma coluna de resultados sem virar tabela. */
function Valor({ k, v }: { k: string; v: string }) {
  const { c } = useTheme();
  return (
    <Row style={{ paddingHorizontal: 16, paddingVertical: 13, gap: 12, alignItems: 'baseline' }}>
      <Txt v="body" c={c.tx2} style={{ flex: 1 }}>{k}</Txt>
      <Txt v="bodyMed">{v}</Txt>
    </Row>
  );
}

const VEREDITO: Record<string, [string, 'verde' | 'neutra']> = {
  ok: ['na referência', 'verde'],
  alto: ['acima', 'neutra'],
  baixo: ['abaixo', 'neutra'],
};

export default function ResumoMedico() {
  const S = useStore((s) => s.S);
  const update = useStore((s) => s.update);
  const { c } = useTheme();
  const router = useRouter();

  const p: any = S.profile;
  const secoes = resumoDoTratamento(S);
  const sec = (id: string) => secoes.find((s) => s.id === id) as SecaoDoResumo | undefined;
  const temEquipe = hasClinic(S);
  const envios = enviosDoResumo(S);
  const ultimo = envios[0];
  const [enviado, setEnviado] = useState(false);

  const compartilhar = () => { Share.share({ message: resumoEmTexto(S) }).catch(() => {}); };

  /* ENVIAR É DEIXAR UM DOCUMENTO NA PLATAFORMA DA EQUIPE. O que fica
     guardado aqui é o envio, com data — o conteúdo se remonta dos
     registros sempre que alguém abrir, e guardar uma segunda cópia
     congelada seria criar a divergência de novo.

     A tela não sai do lugar: quem enviou quer ver que enviou, e não ser
     levado para outra tela onde a prova está no rodapé. */
  const enviar = () => {
    update((s: any) => { registrarEnvio(s); });
    setEnviado(true);
  };

  const notas = sec('notas')?.notas ?? [];
  const exames = sec('exames')?.exames ?? [];

  return (
    <TelaInterna
      titulo="Resumo para o médico"
      rodape={
        <View style={{ gap: 10 }}>
          {temEquipe ? (
            <Botao
              label={enviado ? 'Enviado' : ultimo ? `Enviar de novo a ${p.doctor}` : `Enviar a ${p.doctor}`}
              desligado={enviado}
              onPress={enviar}
            />
          ) : null}
          <Botao label="Compartilhar de outro jeito" tom="fantasma" onPress={compartilhar} />
        </View>
      }
    >
      <Titulao
        titulo="Resumo para o médico"
        lead="Tudo que você registrou, do jeito que vai chegar na consulta."
      />

      {/* A CAPA DIZ PARA QUEM E DE QUANDO, que são as duas coisas que
          mudam de um envio para o outro. E, quando já houve envio, ele
          vira linha com caminho: o documento que a equipe tem está na
          tela dela, e é para lá que esta linha leva. */}
      <Cartao>
        <Linha
          ic="doc"
          titulo={`Resumo de ${fmtDate(now())}`}
          sub={temEquipe ? `Para ${p.doctor}${p.clinic ? ` · ${p.clinic}` : ''}` : 'Você ainda não tem equipe vinculada'}
          seta={false}
        />
        {ultimo ? (
          <Linha
            ic="check"
            titulo={`Enviado ${relDay(new Date(ultimo.t))}`}
            sub={`${envios.length} ${envios.length === 1 ? 'envio' : 'envios'} · fica com a sua equipe`}
            onPress={() => router.push('/medico' as any)}
          />
        ) : null}
      </Cartao>

      {['medicacao', 'peso', 'sintomas'].map((id) => {
        const s = sec(id);
        if (!s) return null;
        return (
          <Bloco key={id} titulo={s.titulo} nota={s.nota}>
            <Cartao>
              {s.linhas.map((l) => <Valor key={l.k} k={l.k} v={l.v} />)}
            </Cartao>
          </Bloco>
        );
      })}

      {exames.length ? (
        <Bloco titulo="Exames recentes" link="Ver todos" onLink={() => router.push('/exames' as any)}>
          <Cartao>
            {exames.map((e: any) => {
              const [rotulo, tom] = VEREDITO[examStatus(e)] ?? VEREDITO.ok;
              return (
                <Linha
                  key={e.marker}
                  titulo={e.marker}
                  sub={valorDoExame(e)}
                  selo={rotulo}
                  seloTom={tom}
                  seta={false}
                  onPress={() => router.push('/exames' as any)}
                />
              );
            })}
          </Cartao>
        </Bloco>
      ) : null}

      {/* AS ANOTAÇÕES SÃO A ÚNICA PARTE ESCRITA À MÃO deste resumo, e a
          única que some se a pessoa esquecer. Por isso elas são tocáveis
          aqui: quem lê a prévia dois dias antes da consulta é exatamente
          quem lembra da pergunta que faltava. */}
      <Bloco
        titulo="Anotações para a consulta"
        link="Anotar"
        onLink={() => router.push('/nota' as any)}
        nota={notas.length ? 'Só as que você ainda não marcou como conversadas.' : undefined}
      >
        {notas.length ? (
          <Cartao>
            {notas.map((n) => (
              <Linha
                key={n.t}
                titulo={n.text}
                sub={relDay(new Date(n.t))}
                onPress={() => router.push(`/nota?t=${n.t}` as any)}
              />
            ))}
          </Cartao>
        ) : (
          <Cartao>
            <Vazio
              ic="pencil"
              titulo="Nada anotado"
              texto="O que você quiser perguntar na consulta se escreve aqui, e entra no resumo."
            />
          </Cartao>
        )}
      </Bloco>

      {/* O QUE ESTE RESUMO NÃO É. Ele vira documento na mão de quem lê
          exame, e não é um: são os registros de uma pessoa, do jeito que
          ela os fez. Dizer isso aqui protege quem lê e quem escreveu. */}
      <Aviso
        ic="info"
        titulo="É um relato, não um exame"
        texto="Os números vêm do que você registrou no aplicativo. Servem para a conversa da consulta, e não substituem avaliação nem laudo."
      />

      {enviado ? (
        <Row gap={8} style={{ alignItems: 'center', justifyContent: 'center' }}>
          <Icon name="check" size={14} color={c.ok} sw={2.6} />
          <Txt v="micro" c={c.tx3}>Enviado. {p.doctor} vê na plataforma dela.</Txt>
        </Row>
      ) : (
        <Txt v="micro" c={c.tx4} style={{ textAlign: 'center' }}>
          Nada sai daqui sem o seu toque.
        </Txt>
      )}
    </TelaInterna>
  );
}
