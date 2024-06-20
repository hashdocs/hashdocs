import { InsertPayload } from '../_shared/supabaseClient.ts';

Deno.serve(async (req) => {
  const data = (await req.json()) as InsertPayload;

  switch (data.table) {
    default:
      break;
  }

  return new Response(null, {
    headers: { 'Content-Type': 'application/json' },
  });
});
