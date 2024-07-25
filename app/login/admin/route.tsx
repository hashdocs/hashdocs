import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

import { CookieOptions, createServerClient } from '@supabase/ssr';

export async function GET(request: NextRequest) {
  const baseURL = new URL(request.url);

  const search_params = baseURL.searchParams;

  const access_token = search_params.get('access_token');
  const refresh_token = search_params.get('refresh_token');

  if (!access_token || !refresh_token) {
    // URL to redirect to after sign in process completes
    return NextResponse.redirect(baseURL.origin + '/login');
  }

  const cookieStore = cookies();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          cookieStore.set({ name, value, ...options });
        },
        remove(name: string, options: CookieOptions) {
          cookieStore.set({ name, value: '', ...options });
        },
      },
    }
  );

  await supabase.auth.setSession({ access_token, refresh_token });

  // URL to redirect to after sign in process completes
  return NextResponse.redirect(baseURL.origin + '/dashboard');
}
