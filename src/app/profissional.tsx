import React, { useEffect, useState } from 'react';
import { View, Pressable, Linking, Platform } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useStore } from '../logic/store';
import {
  profissional, useVitrine, redeDeExemplo, nomeDaEspecialidade, registroTxt, horarioTxt,
  distanciaTxt, conveniosTxt, modalidadeTxt, semTitulo,
  type Profissional, type Consultorio,
} from '../logic/rede';
import { distanciaKm } from '../logic/localizacao';
import { contatosDaClinica } from '../logic/derive';
import { Txt, Row, Retrato, Vazio } from '../ui/kit';
import { TelaInterna, Titulao, Bloco, Cartao, Linha, Aviso } from '../ui/internas';
import { useTheme } from '../ui/useTheme';
import { T } from '../textos';

const K = () => T.rede.ficha;

/* ============================================================
   A FICHA DO PROFISSIONAL — aberta pela vitrine

   Quem é, onde atende e como falar com o consultório. Termina no passo
   seguinte, que é do consultório e não nosso: depois da primeira
   consulta, o código de convite.

   ⚠️ NÃO É /especialista. Aquela é a ficha de quem JÁ acompanha a pessoa,
   com conversa e vínculo; esta é de quem ela ainda está escolhendo, e o
   único caminho daqui é o telefone do consultório.

   ⚠️ E OS CANAIS SÃO OS QUE O CONSULTÓRIO CADASTROU. Canal vazio não
   aparece — uma linha "WhatsApp" sem número é porta pintada na parede.
   ============================================================ */

/* O endereço inteiro, para o aplicativo de mapas de cada sistema. */
function mapa(cons: Consultorio) {
  const q = encodeURIComponent([cons.endereco, cons.bairro, `${cons.cidade} - ${cons.uf}`].filter(Boolean).join(', '));
  if (Platform.OS === 'ios') return `http://maps.apple.com/?q=${q}`;
  if (Platform.OS === 'android') return `geo:0,0?q=${q}`;
  return `https://www.google.com/maps/search/?api=1&query=${q}`;
}

export default function FichaDoProfissional() {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const router = useRouter();
  const { c } = useTheme();
  const [p, setP] = useState<Profissional | null | undefined>(undefined);
  useEffect(() => { profissional(String(id ?? '')).then(setP).catch(() => setP(null)); }, [id]);

  if (p === undefined) return <TelaInterna titulo={T.rede.titulo}>{null}</TelaInterna>;
  if (!p) {
    return (
      <TelaInterna titulo={T.rede.titulo} tituloFixo>
        <Vazio ic="steth" titulo={K().naoEncontrado} />
      </TelaInterna>
    );
  }

  const exemplo = redeDeExemplo();
  /* Com a lista de exemplo nada abre: os contatos são inventados. */
  const abrir = (url: string) => (exemplo ? undefined : () => { Linking.openURL(url).catch(() => {}); });
  const varios = p.consultorios.length > 1;

  return (
    <TelaInterna titulo={p.nome}>
      <View style={{ gap: 16 }}>
        <Retrato foto={p.foto} nome={semTitulo(p.nome)} tam={76} />
        <Titulao titulo={p.nome} lead={p.especialidades.map(nomeDaEspecialidade).join(' · ')} />
        <Txt v="caption" c={c.tx3} style={{ paddingHorizontal: 2 }}>{registroTxt(p)}</Txt>
      </View>

      {p.sobre ? (
        <Bloco titulo={K().sobre}>
          <Txt v="note" c={c.tx2} style={{ paddingHorizontal: 2 }}>{p.sobre}</Txt>
        </Bloco>
      ) : null}

      <Bloco titulo={K().ondeAtende}>
        <View style={{ gap: 12 }}>
          {p.consultorios.map((cons) => (
            <Onde key={cons.id} cons={cons} abrirMapa={abrir(mapa(cons))} />
          ))}
        </View>
      </Bloco>

      <Bloco titulo={K().falar} nota={exemplo ? K().exemploContatos : K().falarNota}>
        <View style={{ gap: 12 }}>
          {p.consultorios.map((cons) => {
            const canais = [
              ...(cons.contato.agenda
                ? [{ ic: 'cal', titulo: K().agenda, sub: cons.contato.agenda, url: /^https?:/.test(cons.contato.agenda) ? cons.contato.agenda : `https://${cons.contato.agenda}` }]
                : []),
              /* O WhatsApp de /clinica diz "Falar com a clínica"; aqui o
                 número diz mais, como já diz no telefone. */
              ...contatosDaClinica(cons.contato).map((ct) =>
                (ct.ic === 'companion' && cons.contato.whatsapp ? { ...ct, sub: cons.contato.whatsapp } : ct)),
            ];
            if (!canais.length) return null;
            return (
              <View key={cons.id} style={{ gap: 8 }}>
                {varios ? <Txt v="label" c={c.tx2} style={{ paddingHorizontal: 2 }}>{cons.nome}</Txt> : null}
                <Cartao>
                  {canais.map((ct) => (
                    <Linha key={ct.titulo} ic={ct.ic} titulo={ct.titulo} sub={ct.sub} onPress={abrir(ct.url)} />
                  ))}
                </Cartao>
              </View>
            );
          })}
        </View>
      </Bloco>

      <Aviso ic="info" titulo={K().proximoTitulo} texto={K().proximoTexto}>
        <Pressable
          onPress={() => router.push('/parceiros' as any)}
          style={({ pressed }) => [{ marginTop: 10, alignSelf: 'flex-start', opacity: pressed ? 0.6 : 1 }]}
        >
          <Txt v="label" c={c.accent2}>{K().jaTenhoCodigo}</Txt>
        </Pressable>
      </Aviso>
    </TelaInterna>
  );
}

/* Um consultório: onde fica, quando atende e que convênio aceita. */
function Onde({ cons, abrirMapa }: { cons: Consultorio; abrirMapa?: () => void }) {
  const S = useStore((s) => s.S);
  const perto = useVitrine((v) => v.perto);
  const { c } = useTheme();
  const km = perto && cons.ponto && cons.presencial ? distanciaKm(perto, cons.ponto) : null;
  const lugar = [cons.bairro ? `${cons.bairro}, ${cons.cidade}` : cons.cidade, km != null ? distanciaTxt(S, km) : '']
    .filter(Boolean).join(' · ');
  const convenios = conveniosTxt(cons);

  return (
    <Cartao>
      <Row style={{ paddingHorizontal: 16, paddingTop: 14, paddingBottom: 4 }}>
        <Txt v="bodyMed" style={{ flex: 1 }}>{cons.nome}</Txt>
      </Row>
      {/* Sem endereço é só teleconsulta, e quem diz isso é a linha do
          horário, logo abaixo — repetir aqui seria a mesma frase duas vezes. */}
      {cons.presencial && cons.endereco ? <Linha ic="pin" titulo={cons.endereco} sub={lugar} /> : null}
      <Linha ic="clock" titulo={horarioTxt(cons)} sub={modalidadeTxt(cons)} />
      {convenios ? <Linha ic="wallet" titulo={K().convenios} sub={convenios} /> : null}
      {cons.presencial && cons.endereco ? (
        <Linha ic="send" titulo={K().comoChegar} onPress={abrirMapa} seta={!!abrirMapa} />
      ) : null}
    </Cartao>
  );
}
