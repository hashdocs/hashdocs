import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { createAuthLink, verifyAdminJWT } from '../_shared/auth.ts';

serve(async (req) => {
  const { email, type, redirect_to } = await req.json();

  verifyAdminJWT(req.headers.get('Authorization') || '');

  const auth_params = await createAuthLink(email, type, redirect_to);

  return new Response(auth_params, {
    headers: { 'Content-Type': 'text/plain' },
  });
});
