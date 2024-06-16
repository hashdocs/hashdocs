import { supabaseAdmin } from './supabaseClient.ts';

export async function createAuthLink(
  email: string,
  type = 'magiclink',
  redirect_to = 'http://localhost:3000'
) {
  const {
    data: { properties },
    error,
  } = await supabaseAdmin.auth.admin.generateLink({
    email: email,
    type: 'magiclink',
    options: {
      redirectTo: 'http://127.0.0.1:3000/login',
    },
  });

  if (error || !properties) throw error || { message: 'No link found' };

  const { action_link } = properties;

  const url_link = action_link.replace('127.0.0.1', 'host.docker.internal');

  const res = await fetch(url_link, { redirect: 'manual' });

  const found_url = new URL(
    (res.headers.get('location') || '').replace('#', '?')
  );

  const access_token = found_url.searchParams.get('access_token');
  const refresh_token = found_url.searchParams.get('refresh_token');

  switch (type) {
    case 'magiclink':
      return `${
        Deno.env.get('SUPABASE_URL')?.includes('kong')
          ? 'http://localhost:3000'
          : redirect_to
      }/login/admin?access_token=${access_token}&refresh_token=${refresh_token}`;

    case 'jwt': {
      return access_token;
    }
    default:
      return null;
  }
}

export function verifyAdminJWT(auth_header: string) {
  // Parse JWT as JSON object from Authorization header
  const jwt = JSON.parse(atob(auth_header.split('.')[1]));

  if (jwt.role !== 'service_role') {
    throw { message: 'Invalid JWT' };
  }

  return;
}
