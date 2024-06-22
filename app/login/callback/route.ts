import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

import { createRouteHandlerClient } from '@/app/_utils/supabase';
import type { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');

  if (code) {
    const supabase = createRouteHandlerClient({ cookies: cookies() });
    await supabase.auth.exchangeCodeForSession(code);
  }

  // URL to redirect to after sign in process completes
  return NextResponse.redirect(
    new URL('/dashboard', `${process.env.NEXT_PUBLIC_BASE_URL}`)
  );
}
