import React from 'react';
import { View, Pressable, Switch, Platform, AppState } from 'react-native';
import { useStore } from '../logic/store';
import { CONTAS, aparelhoDaVez, type Integracao } from '../logic/integracoes';
import {
  estadoDaSaude, juntarPesagens, pedirAcesso, pesagensDoAparelho, type EstadoDaSaude,
} from '../logic/saude-do-aparelho';
import { Txt, Row } from '../ui/kit';
import { TelaInterna, Titulao, Bloco, Cartao, Aviso } from '../ui/internas';
import { CoracaoDeSaude } from '../ui/marca';
import { Icon } from '../ui/Icon';
import { useTheme } from '../ui/useTheme';
import { radius } from '../theme';
import { T } from '../textos';

/* ⚠️ É FUNÇÃO, e não constante de módulo: ela lê o catálogo, e constante
   de módulo congela o idioma no import. */
const K = () => T.aviso.telaIntegracoes;

/* ============================================================
   INTEGRAÇÕES — de onde os números podem vir sozinhos

   A LISTA ENCOLHEU PORQUE FOI CONFERIDA. Ela tinha oito serviços escritos
   de olho no que os apps de saúde costumam oferecer, e não no que este
   app consegue receber: o Google Fit está fechado para novos cadastros
   desde 2024, e "balança inteligente" e "smartwatch" não são serviços,
   são categorias de aparelho. O porquê de cada corte está em
   src/logic/integracoes.ts.

   E O DEPÓSITO DO APARELHO DEIXOU DE SER UMA CHAVE DECORATIVA. Ligar
   agora abre a permissão do sistema e traz as pesagens de verdade — ver
   src/logic/saude-do-aparelho.ts. É a integração que cobre Garmin,
   Fitbit, Withings, Oura e Whoop de uma vez, porque todos escrevem lá.

   AS CONTAS CONTINUAM SEM CHAVE, e isso é o estado delas dito em voz
   alta: elas entregam por OAuth para um SERVIDOR, e o servidor deste app
   é uma função sem banco e sem identidade, de propósito. Uma chave ali
   seria promessa que ninguém do outro lado cumpriria.
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
  const ligado = !!aparelho && !!(S.integrations as any)[aparelho.id];

  /* O ESTADO DO APARELHO É PERGUNTADO A ELE, e não deduzido do sistema.
     Um iPhone tem Apple Saúde sempre; um Android pode não ter o Health
     Connect instalado, e o Expo Go não tem o módulo nativo de nenhum dos
     dois. Reconsultar ao voltar do foco cobre quem saiu daqui para
     instalar. */
  const [estado, setEstado] = React.useState<EstadoDaSaude>('pronto');
  React.useEffect(() => {
    const conferir = () => { estadoDaSaude().then(setEstado).catch(() => setEstado('indisponivel')); };
    conferir();
    const sub = AppState.addEventListener('change', (e) => { if (e === 'active') conferir(); });
    return () => sub.remove();
  }, []);

  const [lendo, setLendo] = React.useState(false);
  const [recado, setRecado] = React.useState<string | null>(null);

  /* LER É O MESMO CAMINHO DE LIGAR E DE ATUALIZAR, e por isso é uma função
     só. Ligar pede permissão e importa; tocar de novo com a chave ligada
     importa o que apareceu desde então. */
  const importar = async () => {
    setLendo(true);
    setRecado(null);
    try {
      const pesagens = await pesagensDoAparelho();
      let novas = 0;
      update((s: any) => {
        const r = juntarPesagens(s.weights ?? [], pesagens);
        s.weights = r.lista;
        novas = r.novas;
      });
      /* O NÚMERO É O RECADO. "Sincronizado" não diz se veio alguma coisa,
         e zero é uma resposta legítima — quem nunca se pesou fora do app
         precisa saber que a ligação funcionou e que não havia o que
         trazer, em vez de achar que falhou em silêncio. */
      setRecado(
        novas === 0
          ? K().nadaNovo
          : K().trazidas(novas, aparelho?.nome ?? ''),
      );
    } catch {
      setRecado(K().naoDeuParaLer);
    } finally {
      setLendo(false);
    }
  };

  const alternar = async (v: boolean) => {
    if (!aparelho) return;
    if (!v) {
      /* DESLIGAR NÃO APAGA O QUE JÁ VEIO. As pesagens importadas viraram
         registros da pessoa como qualquer outro, e sumir com o histórico
         dela porque uma chave foi desligada seria dano que ela não pediu.
         Desligar quer dizer "pare de trazer", e não "esqueça". */
      update((s: any) => { s.integrations[aparelho.id] = false; });
      setRecado(null);
      return;
    }
    const ok = await pedirAcesso();
    if (!ok) { setRecado(K().acessoNegado); return; }
    update((s: any) => { s.integrations[aparelho.id] = true; });
    await importar();
  };

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
    <TelaInterna titulo={K().titulo}>
      <Titulao titulo={K().titulo} lead={K().lead} />

      {aparelho && estado === 'pronto' ? (
        <Bloco titulo={K().doSeuAparelho} nota={K().doSeuAparelhoNota}>
          <Cartao>
            <Linha
              it={aparelho}
              direita={
                <Switch
                  value={ligado} onValueChange={alternar}
                  trackColor={{ false: c.track, true: c.accent }} thumbColor="#fff"
                />
              }
            />
            {/* ATUALIZAR AGORA, e só com a chave ligada. O app relê sozinho
                quando abre; esta linha é para quem acabou de se pesar e
                quer ver o ponto aparecer sem fechar o aplicativo. */}
            {ligado ? (
              <Pressable onPress={lendo ? undefined : importar} style={({ pressed }) => [{ opacity: pressed ? 0.6 : 1 }]}>
                <Row gap={10} style={{ paddingHorizontal: 16, paddingVertical: 13, alignItems: 'center' }}>
                  <Icon name="reset" size={17} color={c.accent} sw={2.2} />
                  <Txt v="label" c={c.accent} style={{ flex: 1 }}>
                    {lendo ? K().lendo : K().atualizarAgora}
                  </Txt>
                </Row>
              </Pressable>
            ) : null}
          </Cartao>
          {recado ? (
            <Txt v="caption" c={c.tx3} style={{ marginTop: 10, paddingHorizontal: 2, lineHeight: 19 }}>{recado}</Txt>
          ) : null}
        </Bloco>
      ) : (
        /* CADA MOTIVO TEM O SEU RECADO. "Não disponível" serve para as três
           situações e não resolve nenhuma: quem está no navegador precisa
           saber que é o navegador, quem está no Expo Go precisa saber que
           é o build, e quem está num Android sem Health Connect precisa
           saber que dá para instalar. */
        <Aviso
          ic="info"
          titulo={
            !aparelho ? K().semAparelhoTitulo
              : estado === 'sem-app' ? K().semAppTitulo(aparelho.nome)
                : K().semBuildTitulo
          }
          texto={
            !aparelho ? K().semAparelhoTexto
              : estado === 'sem-app' ? K().semAppTexto
                : K().semBuildTexto
          }
        />
      )}

      <Bloco
        titulo={K().contasDeServico}
        nota={K().contasDeServicoNota}
      >
        <Cartao>
          {CONTAS().map((it) => (
            <Linha key={it.id} it={it} direita={<Txt v="micro" c={c.tx4}>{K().emBreve}</Txt>} />
          ))}
        </Cartao>
      </Bloco>
    </TelaInterna>
  );
}
