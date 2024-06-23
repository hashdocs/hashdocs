import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { createMiddlewareClient } from './app/_utils/supabase';

export const config = {
  matcher: ['/login', '/dashboard'],
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
        return NextResponse.redirect(new URL('/dashboard', req.url));
      }
      break;
    }

    case 'dashboard': {
      const supabase = createMiddlewareClient(req, res);

      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session?.access_token) {
        return NextResponse.redirect(new URL('/login', req.url));
      }

      const parsed_token = JSON.parse(
        Buffer.from(session.access_token.split('.')[1], 'base64').toString()
      );

      if (parsed_token.app_metadata['org_ids'].at(0)) {
        return NextResponse.redirect(
          new URL(
            `/dashboard/${parsed_token.app_metadata['org_ids'].at(
              0
            )}/documents`,
            req.url
          )
        );
      }

      break;
    }

    default:
      break;
  }

  return res;
}
