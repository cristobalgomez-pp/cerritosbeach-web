import { type NextRequest, NextResponse } from 'next/server';
import createIntlMiddleware from 'next-intl/middleware';
import { createServerClient } from '@supabase/ssr';
import { routing } from '@/i18n/routing';

const intlMiddleware = createIntlMiddleware(routing);

const PUBLIC_COMMUNITY_SUBPATHS = new Set<string>(['']);

type Locale = 'es' | 'en';

function stripLocale(pathname: string): { locale: Locale; path: string } {
  if (pathname === '/en') return { locale: 'en', path: '/' };
  if (pathname.startsWith('/en/')) return { locale: 'en', path: pathname.substring(3) };
  return { locale: 'es', path: pathname };
}

function buildLocalizedUrl(locale: Locale, path: string, base: string | URL): URL {
  const prefix = locale === 'es' ? '' : `/${locale}`;
  return new URL(`${prefix}${path}`, base);
}

export async function proxy(request: NextRequest) {
  const response = intlMiddleware(request);

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => request.cookies.getAll(),
        setAll: (cookiesToSet) => {
          cookiesToSet.forEach(({ name, value, options }) => {
            response.cookies.set(name, value, options);
          });
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { locale, path } = stripLocale(request.nextUrl.pathname);

  if (!path.startsWith('/comunidad')) return response;

  const subpath = path.replace('/comunidad', '');

  if (PUBLIC_COMMUNITY_SUBPATHS.has(subpath)) return response;

  if (!user) {
    return NextResponse.redirect(buildLocalizedUrl(locale, '/cuenta/login', request.url));
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('username')
    .eq('id', user.id)
    .single();

  const incomplete = !profile?.username;

  if (subpath === '/onboarding') {
    if (!incomplete) {
      return NextResponse.redirect(buildLocalizedUrl(locale, '/comunidad', request.url));
    }
    return response;
  }

  if (incomplete) {
    return NextResponse.redirect(buildLocalizedUrl(locale, '/comunidad/onboarding', request.url));
  }

  return response;
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|woff2|ico)$).*)',
  ],
};
