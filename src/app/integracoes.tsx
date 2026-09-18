import React from 'react';
import { View, Switch, Platform } from 'react-native';
import { useStore } from '../logic/store';
import { CONTAS, aparelhoDaVez, type Integracao } from '../logic/integracoes';
import { Txt, Row } from '../ui/kit';
import { TelaInterna, Titulao, Bloco, Cartao, Aviso } from '../ui/internas';
import { CoracaoDeSaude } from '../ui/marca';
import { useTheme } from '../ui/useTheme';
import { radius } from '../theme';

/* ============================================================
   INTEGRAÇÕES — de onde os números podem vir sozinhos

   A LISTA ENCOLHEU PORQUE FOI CONFERIDA. Ela tinha oito serviços
   escritos de olho no que os apps de saúde costumam oferecer, e não no
   que este app consegue receber: o Google Fit está fechado para novos
   cadastros desde 2024, e "balança inteligente" e "smartwatch" não são
   serviços, são categorias de aparelho — elas falam com o app de saúde
   do celular, e é de lá que o número chega aqui. O porquê de cada corte
   está em src/logic/integracoes.ts.

   E A LISTA PASSOU A DEPENDER DO APARELHO. Apple Saúde num Android é uma
   chave que nunca vai ligar; os dois ao mesmo tempo é o app admitindo que
   não sabe onde está rodando.

   O QUADRADO DE COR AO LADO DO NOME é a marca do serviço — desenhada por
   nós, na cor dele. Logotipo de terceiro não se usa sem licença, e num
   quadrado de 34 px quem identifica é o tom, não o desenho. Ver
   src/ui/marca.tsx.

   AS CONTAS NÃO TÊM CHAVE, e isso é o estado delas dito em voz alta:
   Garmin, Fitbit e Withings entregam dados para um SERVIDOR, por OAuth —
   não para o telefone. Sem esse servidor, uma chave ali seria uma
   promessa que ninguém do outro lado ia cumprir.
   ============================================================ */

function Marca({ it }: { it: Integracao }) {
  return (
    <View style={{
      width: 34, height: 34, borderRadius: radius.sm + 2,
      backgroundColor: it.letra ? it.cor : 'rgba(0,0,0,0.04)',
      alignItems: 'center', justifyContent: 'center',
    }}>
      {it.letra
        ? <Txt v="bodyMed" c="#FFFFFF">{it.letra}</Txt>
        : <CoracaoDeSaude tamanho={21} de={Platform.OS === 'android' ? 'android' : 'ios'} />}
    </View>
  );
}

export default function Integracoes() {
  const S = useStore((s) => s.S);
  const update = useStore((s) => s.update);
  const { c } = useTheme();

  const aparelho = aparelhoDaVez();

  const Linha = ({ it, direita }: { it: Integracao; direita: React.ReactNode }) => (
    <Row gap={13} style={{ paddingHorizontal: 16, paddingVertical: 13, alignItems: 'center' }}>
      <Marca it={it} />
      <View style={{ flex: 1 }}>
        <Txt v="bodyMed">{it.nome}</Txt>
        <Txt v="caption" c={c.tx3} style={{ marginTop: 1, lineHeight: 19 }}>{it.traz}</Txt>
      </View>
      {direita}
    </Row>
  );

  return (
    <TelaInterna titulo="Integrações">
      <Titulao titulo="Integrações" lead="Ligadas, elas trazem peso, sono e treino sem você digitar." />

      {aparelho ? (
        <Bloco titulo="Do seu aparelho" nota="Um depósito local: o app pede permissão e lê. Sem conta e sem senha.">
          <Cartao>
            <Linha
              it={aparelho}
              direita={
                <Switch
                  value={!!(S.integrations as any)[aparelho.id]}
                  onValueChange={(v) => update((s: any) => { s.integrations[aparelho.id] = v; })}
                  trackColor={{ false: c.track, true: c.accent }} thumbColor="#fff"
                />
              }
            />
          </Cartao>
        </Bloco>
      ) : (
        /* No navegador não há app de saúde do sistema para ligar. Dizer
           isso é melhor do que mostrar uma chave que não tem o que ligar
           — ou do que não mostrar seção nenhuma e deixar a pessoa achar
           que o app não lê o celular dela. */
        <Aviso
          ic="info"
          titulo="O app de saúde do aparelho aparece no celular"
          texto="Apple Saúde no iPhone, Health Connect no Android. No navegador não há o que ligar."
        />
      )}

      <Bloco
        titulo="Contas de serviço"
        nota="Estes entregam os dados para um servidor, e não para o telefone — a ligação entra quando esse servidor estiver de pé."
      >
        <Cartao>
          {CONTAS.map((it) => (
            <Linha
              key={it.id}
              it={it}
              direita={<Txt v="micro" c={c.tx4}>Em breve</Txt>}
            />
          ))}
        </Cartao>
      </Bloco>
    </TelaInterna>
  );
}
