import React from 'react';
import { View, Pressable, Switch } from 'react-native';
import { useRouter } from 'expo-router';
import { useStore } from '../logic/store';
import { AVISO, ESCOLHA_DAS_PERGUNTAS, LEITURA_DAS_PERGUNTAS, TERMOS, POLITICA, VERSAO } from '../logic/consentimento';
import { temIdentificacao, TERMOS as DOC_TERMOS, PRIVACIDADE as DOC_PRIVACIDADE } from '../logic/documentos';
import { contaLigada } from '../logic/nuvem';
import { now } from '../logic/time';
import { tirarDiarioDoTelefone } from '../ui/conta';
import { Txt, Row } from '../ui/kit';
import { TelaInterna, Titulao, Botao, Aviso } from '../ui/internas';
import { useTheme } from '../ui/useTheme';
import { radius } from '../theme';
import { T } from '../textos';

/* ⚠️ É FUNÇÃO, e não constante de módulo: ela lê o catálogo, e constante
   de módulo congela o idioma no import. */
const K = () => T.aviso.consentimentoNovo;

/* ============================================================
   O CONSENTIMENTO NOVO — a tranca 2 do portão (fase 8 do plano do
   Supabase, em docs/superpowers/plans)

   Quem aceitou a versão 1 concordou com um diário que ficava no
   telefone, sem conta. Esta folha volta em toda abertura até a versão
   de agora ser aceita, antes da tranca da conta e antes de qualquer
   coisa subir (a sincronia fica parada: ver `consentimentoPendente`).

   ⚠️ QUEM NÃO CONCORDA NÃO FICA PRESO. A conta é obrigatória, então sem
   o aceite não há como seguir — e a folha diz isso com clareza, e
   oferece o que os Termos prometem a quem não concorda: levar os dados
   num arquivo e apagar o aparelho. O apagar roda aqui mesmo, sem
   navegar e sem conexão (é o apagar local da fase 4). Nada é apagado sem
   pedido.

   ⚠️ E A ESCOLHA DAS PERGUNTAS VEM COM ELA, desligada, e não trava o
   aceite: é outra finalidade (a decisão 2 do plano).
   ============================================================ */
export default function ConsentimentoNovo() {
  const router = useRouter();
  const { c } = useTheme();
  const update = useStore((s) => s.update);
  const jaLigada = useStore((s) => (s.S as any).perguntasParaUso === true);
  const [perguntas, setPerguntas] = React.useState(jaLigada);
  const [recusando, setRecusando] = React.useState(false);
  const [armado, setArmado] = React.useState(false);
  const [apagando, setApagando] = React.useState(false);

  const aceitar = () => {
    update((s: any) => {
      s.profile.consentimento = { em: +now(), versao: VERSAO };
      s.perguntasParaUso = LEITURA_DAS_PERGUNTAS && perguntas;
    });
    /* o portão decide o resto: sem conta, a tranca 3 leva à conta */
    router.replace('/(tabs)' as any);
  };

  const apagar = async () => {
    setApagando(true);
    await tirarDiarioDoTelefone();
    router.replace('/cadastro' as any);
  };

  if (recusando) {
    return (
      <TelaInterna titulo={K().recusaTitulo} onVoltar={() => { setArmado(false); setRecusando(false); }}>
        <Titulao titulo={K().recusaTitulo} lead={K().recusaTexto} />
        <View style={{ gap: 12 }}>
          <Botao label={K().exportar} onPress={() => router.push('/exportar' as any)} />
          {apagando ? (
            <Txt v="caption" c={c.tx2} style={{ textAlign: 'center' }}>{T.conta.apagarConta.apagando}</Txt>
          ) : armado ? (
            <Row gap={12} style={{ alignItems: 'center', paddingHorizontal: 4, paddingVertical: 8 }}>
              <Txt v="caption" c={c.tx2} style={{ flex: 1 }}>{K().apagarPergunta}</Txt>
              <Pressable onPress={() => setArmado(false)} hitSlop={8} style={({ pressed }) => [{ opacity: pressed ? 0.6 : 1 }]}>
                <Txt v="label" c={c.tx3}>{T.aviso.telaPrivacidade.cancelar}</Txt>
              </Pressable>
              <Pressable onPress={apagar} hitSlop={8} style={({ pressed }) => [{ opacity: pressed ? 0.6 : 1 }]}>
                <Txt v="label" c={c.cta}>{K().apagarConfirma}</Txt>
              </Pressable>
            </Row>
          ) : (
            <Botao label={K().apagar} tom="fantasma" onPress={() => setArmado(true)} />
          )}
          <Botao label={K().voltar} tom="fantasma" onPress={() => { setArmado(false); setRecusando(false); }} />
        </View>
        <View />
      </TelaInterna>
    );
  }

  return (
    <TelaInterna
      titulo={K().titulo}
      onVoltar={() => {}}
      rodape={
        <>
          <Botao label={K().aceitar} onPress={aceitar} />
          <Botao label={K().recusar} tom="fantasma" onPress={() => setRecusando(true)} />
        </>
      }
    >
      <Titulao titulo={K().titulo} lead={K().lead} />
      <View style={{ gap: 10 }}>
        {AVISO().map((a) => (
          <View key={a.titulo} style={{ backgroundColor: c.bg1, borderRadius: radius.lg, padding: 16, gap: 5 }}>
            <Txt v="bodyMed">{a.titulo}</Txt>
            <Txt v="caption" c={c.tx2} style={{ lineHeight: 21 }}>{a.texto}</Txt>
          </View>
        ))}
        {LEITURA_DAS_PERGUNTAS && contaLigada() ? (
          <View style={{ backgroundColor: c.bg1, borderRadius: radius.lg, padding: 16, gap: 8 }}>
            <Txt v="bodyMed">{ESCOLHA_DAS_PERGUNTAS().titulo}</Txt>
            <Txt v="caption" c={c.tx2} style={{ lineHeight: 21 }}>{ESCOLHA_DAS_PERGUNTAS().texto}</Txt>
            <Row gap={12} style={{ alignItems: 'center', paddingTop: 4 }}>
              <Switch
                value={perguntas}
                onValueChange={setPerguntas}
                trackColor={{ false: c.track, true: c.accent }}
                thumbColor="#fff"
              />
              <Txt v="label" style={{ flex: 1 }}>{ESCOLHA_DAS_PERGUNTAS().escolha}</Txt>
            </Row>
            <Txt v="micro" c={c.tx3} style={{ lineHeight: 17 }}>{ESCOLHA_DAS_PERGUNTAS().detalhe}</Txt>
          </View>
        ) : null}
        {temIdentificacao() ? (
          <Row gap={16} style={{ justifyContent: 'center', paddingVertical: 10 }}>
            <Pressable onPress={() => router.push(TERMOS as any)} style={({ pressed }) => [{ opacity: pressed ? 0.6 : 1 }]}>
              <Txt v="label" c={c.accent}>{DOC_TERMOS().titulo}</Txt>
            </Pressable>
            <Pressable onPress={() => router.push(POLITICA as any)} style={({ pressed }) => [{ opacity: pressed ? 0.6 : 1 }]}>
              <Txt v="label" c={c.accent}>{DOC_PRIVACIDADE().titulo}</Txt>
            </Pressable>
          </Row>
        ) : (
          <Aviso ic="info" titulo={T.aviso.telaPrivacidade.semPoliticaTitulo} texto={T.aviso.telaPrivacidade.semPoliticaTexto} />
        )}
      </View>
      <View />
    </TelaInterna>
  );
}
