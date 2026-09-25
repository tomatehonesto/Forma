/* ============================================================
   APAGAR A CONTA — a pessoa apaga a própria conta, e tudo o que é dela

     npx supabase functions deploy apagar-conta --use-api

   Quem chama é o aplicativo, com a sessão da pessoa ("Apagar meus
   dados", em /privacidade). A função confere quem é pela sessão — não
   aceita dizer "apague fulano" —, e apaga a conta com a chave secreta
   que o próprio Supabase injeta aqui. A chave nunca sai do servidor.

   ⚠️ A CASCATA FAZ O RESTO. Apagar o usuário leva, pelas chaves
   estrangeiras de supabase/migrations: o perfil, os registros, as
   perguntas, os vínculos (inclusive os encerrados, com a cópia do
   prontuário) e as mensagens. A trava das regras prova a cascata
   (supabase/testes/regras.sql, a conta apagada).

   ⚠️ O TOKEN QUE A PESSOA JÁ TINHA vale até expirar (uma hora), mas o
   dono dele não existe mais: as regras não acham nada, e toda escrita
   falha na chave estrangeira. O aparelho só se limpa depois de esta
   função responder que apagou.

   `withSupabase({ auth: 'user' })` (pacote @supabase/server) confere o
   token do usuário e entrega os dois clientes: o da pessoa, com as
   regras, e o administrativo. Versão fixada.
   ============================================================ */
import { withSupabase } from 'npm:@supabase/server@1.8.0';

export default {
  fetch: withSupabase({ auth: 'user' }, async (req, ctx) => {
    if (req.method !== 'POST') return Response.json({ erro: 'metodo' }, { status: 405 });
    const id = ctx.userClaims?.id;
    if (!id) return Response.json({ erro: 'sem-sessao' }, { status: 401 });
    const { error } = await ctx.supabaseAdmin.auth.admin.deleteUser(id);
    if (error) {
      console.error('apagar-conta', error.message);
      return Response.json({ erro: 'falhou' }, { status: 500 });
    }
    return Response.json({ ok: true });
  }),
};
