import { comRelogioFixo } from './relogio';
import { trocarLocal } from '../../src/logic/local';
import { resumoDaJornada } from '../../src/logic/resumoDaJornada';
import { PACIENTES } from './pacientes';
const quem = process.argv[2] as keyof typeof PACIENTES | undefined;
for (const [nome, f] of Object.entries(PACIENTES)) {
  if (quem && nome !== quem) continue;
  trocarLocal(nome === 'emily' ? 'en-US' : nome === 'sofia' ? 'es-419' : 'pt-BR');
  console.log(`\n==================== ${nome}\n${comRelogioFixo(() => resumoDaJornada(f()))}`);
}
