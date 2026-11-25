import { createServerClient } from '@supabase/ssr'
import { type NextRequest, NextResponse } from 'next/server'
import createMiddleware from 'next-intl/middleware'
import { routing } from './i18n/routing'

const handleI18n = createMiddleware(routing)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? ''
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ?? ''

type CookieToSet = {
  name: string
  value: string
  options?: Parameters<NextResponse['cookies']['set']>[2]
}

export async function proxy(request: NextRequest) {
  // Supabase va primero: si refresca o borra la sesión, actualiza las cookies
  // de la petición para que next-intl las reenvíe al resto del servidor, y
  // guarda las de la respuesta para aplicarlas a la que se devuelva.
  let pendingCookies: CookieToSet[] = []
  let pendingHeaders: Record<string, string> = {}

  const supabase = createServerClient(supabaseUrl, supabaseKey, {
    cookies: {
      getAll: () => request.cookies.getAll(),
      setAll: (cookiesToSet, headers) => {
        cookiesToSet.forEach(({ name, value }) => {
          request.cookies.set(name, value)
        })
        pendingCookies = cookiesToSet
        pendingHeaders = headers ?? {}
      }
    }
  })

  const {
    data: { user }
  } = await supabase.auth.getUser()
  const pathname = request.nextUrl.pathname

  const authRouterPattern = /\/(en|es)?\/?(login|register|entrar|registrarse)$/
  const isAuthPage = authRouterPattern.test(pathname)

  let response: NextResponse

  if (user && isAuthPage) {
    const redirectUrl = request.nextUrl.clone()

    const localeMatch = pathname.match(/^\/(en|es)\//)
    const currentLocale = localeMatch ? `${localeMatch[1]}` : '/es'

    redirectUrl.pathname = currentLocale

    response = NextResponse.redirect(redirectUrl)
  } else {
    response =
      handleI18n(request) ??
      NextResponse.next({ request: { headers: request.headers } })
  }

  pendingCookies.forEach(({ name, value, options }) => {
    response.cookies.set(name, value, options)
  })
  Object.entries(pendingHeaders).forEach(([key, value]) => {
    response.headers.set(key, value)
  })

  return response
}

export const config = {
  // Match all pathnames except for
  // - … if they start with `/api`, `/trpc`, `/_next`, `/_vercel` or `/auth`
  // - … the ones containing a dot (e.g. `favicon.ico`)
  matcher: '/((?!api|trpc|_next|_vercel|auth|.*\\..*).*)'
}
