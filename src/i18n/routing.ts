import { defineRouting } from 'next-intl/routing'

export const routing = defineRouting({
  locales: ['en', 'es'],
  defaultLocale: 'es',
  pathnames: {
    '/': '/',
    '/login': {
      es: '/entrar'
    },
    '/register': {
      es: '/registrarse'
    },
    '/artists': {
      es: '/artistas'
    },
    '/artists/[slug]': {
      es: '/artistas/[slug]'
    },
    '/songs/[slug]': {
      es: '/cancion/[slug]'
    },
    '/request-song': {
      es: '/solicitar-cancion'
    },
    '/learn': {
      es: '/aprender'
    },
    '/chords': {
      es: '/acordes'
    },
    '/favorites': {
      es: '/favoritos'
    },
    '/admin/requests': {
      es: '/admin/solicitudes'
    },
    '/admin/upload-song': {
      es: '/admin/subir-cancion'
    }
  }
})
