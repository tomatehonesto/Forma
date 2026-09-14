/* Afinar o prompt sem gastar deploy.

     ANTHROPIC_API_KEY=... node teste.mjs ../foto.jpg

   Usa o MESMO prompt e o MESMO schema da função. Se divergirem, o teste
   deixa de valer — por isso ele importa de api/analisar.ts em vez de
   copiar. */
import fs from 'node:fs';
import path from 'node:path';
import Anthropic from '@anthropic-ai/sdk';
import { zodOutputFormat } from '@anthropic-ai/sdk/helpers/zod';
import { INSTRUCOES, Resposta } from './api/analisar.ts';

const arquivo = process.argv[2];
if (!arquivo) {
  console.error('uso: node teste.mjs <caminho da foto>');
  process.exit(1);
}

const TIPOS = { '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.png': 'image/png', '.webp': 'image/webp' };
const tipo = TIPOS[path.extname(arquivo).toLowerCase()] || 'image/jpeg';
const imagem = fs.readFileSync(arquivo).toString('base64');

const cliente = new Anthropic();
const t0 = Date.now();

const r = await cliente.messages.parse({
  model: 'claude-opus-5',
  max_tokens: 4000,
  system: [{ type: 'text', text: INSTRUCOES, cache_control: { type: 'ephemeral' } }],
  messages: [
    {
      role: 'user',
      content: [
        { type: 'image', source: { type: 'base64', media_type: tipo, data: imagem } },
        { type: 'text', text: 'O que tem neste prato?' },
      ],
    },
  ],
  output_config: { format: zodOutputFormat(Resposta), effort: 'medium' },
});

console.log(JSON.stringify(r.parsed_output, null, 2));
console.log('\n%ss | entrada %s (cache %s) | saída %s',
  ((Date.now() - t0) / 1000).toFixed(1),
  r.usage.input_tokens,
  r.usage.cache_read_input_tokens ?? 0,
  r.usage.output_tokens);
