import React from 'react';
import { View } from 'react-native';
import { useRouter } from 'expo-router';
import { useStore } from '../logic/store';
import { journeySummary, ritmoRecente, RITMO_CLINICO_KG } from '../logic/derive';
import { pesoTxt } from '../logic/medidas';
import { SheetScreen } from '../ui/kit';
import { Cartao, Linha, Aviso, Botao, Selo } from '../ui/internas';
import { Txt } from '../ui/kit';
import { useTheme } from '../ui/useTheme';
import { T } from '../textos';

/* ⚠️ É FUNÇÃO, e não constante de módulo: ela lê o catálogo, e constante
   de módulo congela o idioma no import. */
const K = () => T.home.telaRitmo;

/* Os apelidos das opções do cadastro, pelo número que cada uma guarda —
   ver RITMOS em app/cadastro. */
const APELIDO = (): Record<string, string> => ({
  '0.5': T.cadastro.ritmoDevagar,
  '1': T.cadastro.ritmoConstante,
  '1.5': T.cadastro.ritmoAcelerado,
  '2': T.cadastro.ritmoMaisRapido,
});

/* ============================================================
   O SEU RITMO DE PERDA

   A etiqueta ao lado dos quilos da Jornada abre esta folha.

   ⚠️ ELA JÁ DISSE O CONTRÁRIO DO QUE FAZIA (28/09/2026). A folha se
   chamava "Como lemos o seu ritmo", listava aplicações, intervalo e
   sintomas e garantia que a etiqueta não olhava para a velocidade da
   perda — enquanto a etiqueta saía exatamente dessa velocidade. Ao lado
   de um número de quilos, ritmo é o de emagrecimento, e a régua que a
   pessoa conhece é a que ela escolheu no cadastro.

   Três números, na ordem em que se leem: a média desde o início, que é
   de onde a etiqueta sai; o trecho recente, porque a curva não é reta; e
   o ritmo escolhido, que é a comparação. O aviso embaixo é o que impede o
   número de virar cobrança — e, acima do limite clínico, o que chama a
   conversa com a equipe.
   ============================================================ */

export default function Ritmo() {
  const S = useStore((s) => s.S);
  const router = useRouter();

  const r = journeySummary(S);
  const recente = ritmoRecente(S);
  /* acima do início, o ritmo é de ganho: o sinal vai escrito, e não um
     menos que leria como perda */
  const porSemana = (kg: number) => K().porSemana(kg < 0 ? `+${pesoTxt(S, -kg)}` : pesoTxt(S, kg));
  const escolhido = r.ritmoEscolhido;
  const acelerado = r.ritmo > RITMO_CLINICO_KG;
  const devagar = r.verdict.label === T.tratamento.ritmoMaisDevagar;
  const { c } = useTheme();

  return (
    <SheetScreen
      titulo={K().titulo}
      sub={K().sub}
      onClose={() => router.back()}
    >
      <View style={{ marginTop: 18, gap: 10 }}>
        <Cartao>
          <Linha
            ic="trend"
            titulo={K().desdeOInicio}
            /* A ETIQUETA VAI EMBAIXO DO TEXTO, e não à direita (28/09/2026,
               pedido do dono). Ao lado, "Mais devagar que o plano" espremia
               o título e o número em cinco linhas. Sem ritmo escolhido ela
               é o próprio número por semana, e repeti-la seria dizer duas
               vezes a mesma linha. */
            sub={
              <View style={{ gap: 8 }}>
                <Txt v="caption" c={c.tx2}>{`${porSemana(r.ritmo)} · ${K().media(r.semanasDoRitmo)}`}</Txt>
                {escolhido != null || r.verdict.tom !== 'neutro'
                  ? <Selo label={r.verdict.label} tom={r.verdict.tom === 'bom' ? 'verde' : 'neutra'} />
                  : null}
              </View>
            }
            seta={false}
          />
          {recente != null ? (
            <Linha
              ic="chart"
              titulo={K().recente}
              sub={`${porSemana(recente)} · ${K().recenteSub}`}
              seta={false}
            />
          ) : null}
          {escolhido != null ? (
            <Linha
              ic="target"
              titulo={K().escolhido}
              sub={[porSemana(escolhido), APELIDO()[String(escolhido)]].filter(Boolean).join(' · ')}
              onPress={() => router.push('/cadastro?editar=ritmo' as any)}
            />
          ) : (
            <Linha
              ic="target"
              titulo={K().semEscolha}
              sub={K().semEscolhaSub}
              onPress={() => router.push('/cadastro?editar=ritmo' as any)}
            />
          )}
        </Cartao>

        {/* ⚠️ ABAIXO DO RITMO ESCOLHIDO, A FOLHA ACOLHE ANTES DE EXPLICAR
            (28/09/2026, pedido do dono). Quem abre esta folha numa semana
            lenta chega procurando se fez algo errado; a primeira coisa que
            ela lê é que não fez, e que o ritmo escolhido pode ser trocado —
            a comparação existe para orientar, e não para pesar. */}
        {devagar ? (
          <Aviso ic="heart" titulo={K().devagarTitulo} texto={K().devagarTexto} />
        ) : null}
        {acelerado ? (
          <Aviso
            titulo={K().aceleradoTitulo}
            texto={K().aceleradoTexto(pesoTxt(S, RITMO_CLINICO_KG))}
          />
        ) : null}
        <Aviso titulo={K().avisoTitulo} texto={K().avisoTexto} />

        <Botao label={K().entendi} tom="fantasma" onPress={() => router.back()} />
      </View>
    </SheetScreen>
  );
}
