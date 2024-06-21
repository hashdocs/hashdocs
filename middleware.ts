import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { createMiddlewareClient } from './app/_utils/supabase';

export const config = {
  matcher: ['/login'],
};

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();

  const url = req.nextUrl.pathname.split('/');
  if (url.length < 2) return res;

  // Handle main routes
  switch (url.at(1)) {
    case '':
    case 'login': {
      const supabase = createMiddlewareClient(req, res);

      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (session?.expires_in) {
        return NextResponse.redirect(new URL('/documents', req.url));
      }
      break;
    }

    default:
      break;
  }

  return res;
}
