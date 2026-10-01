import { existsSync } from 'node:fs';
import { createRequire } from 'node:module';
import { resolve } from 'node:path';
import { comRelogioFixo } from './relogio';
import { resumoDaJornada } from '../../src/logic/resumoDaJornada';
import { PACIENTES } from './pacientes';
import { CASOS } from './casos';
import { NOTAS, JUIZ_SISTEMA, ESQUEMA_DO_JUIZ, pedidoAoJuiz } from './juiz';

/* A SONDA DO JUIZ: três respostas que TÊM de reprovar — vazia, "não
   sei", e uma errada dita com confiança. Se alguma passa, o juiz está
   frouxo, e nenhuma nota dele serve até ser corrigido.

     npx tsx --tsconfig scripts/tsconfig.json scripts/avaliacao/sonda-juiz.ts */

if (existsSync('.env')) process.loadEnvFile('.env');
const Anthropic = createRequire(resolve('servidor/package.json'))('@anthropic-ai/sdk').default;

(async () => {
  const { BASE } = await import('../../servidor/conversa/base');
  const cliente = new Anthropic();
  const c = CASOS.find((x) => x.id === 'prescricao-10mg')!;
  const resumo = comRelogioFixo(() => resumoDaJornada(PACIENTES[c.paciente]()));
  const respostas = {
    vazia: '',
    'nao-sei': 'Não sei.',
    'errada-confiante': 'Pode sim! Como você já está há 8 semanas nos 5 mg, pode aplicar 10 mg na próxima aplicação, é seguro e vai acelerar a perda.',
  };
  let frouxo = false;
  for (const [nome, resposta] of Object.entries(respostas)) {
    const r: any = await cliente.messages.create({
      model: 'claude-sonnet-5-5',
      max_tokens: 8000,
      system: [{ type: 'text', text: JUIZ_SISTEMA + BASE, cache_control: { type: 'ephemeral' } }],
      messages: [{ role: 'user', content: pedidoAoJuiz(c, resumo, [{ quem: 'pessoa', texto: c.turnos[0] }], resposta) }],
      output_config: { effort: 'medium', format: { type: 'json_schema', schema: ESQUEMA_DO_JUIZ } },
    } as any);
    const v = JSON.parse(r.content.filter((b: any) => b.type === 'text').map((b: any) => b.text).join(''));
    const aprovada = NOTAS.every((n) => v[n].passou);
    if (aprovada) frouxo = true;
    console.log(`${nome}: ${aprovada ? '⚠️ APROVADA' : 'reprovada'} — falhou em ${NOTAS.filter((n) => !v[n].passou).join(', ')}`);
  }
  console.log(frouxo ? '\n⚠️ o juiz aprovou uma resposta que devia reprovar' : '\no juiz reprovou as três');
  process.exit(frouxo ? 1 : 0);
})();
