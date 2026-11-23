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
    '/artists/[slug]/edit': {
      es: '/artistas/[slug]/editar'
    },
    '/admin/artists/[slug]/edit': {
      es: '/artistas/[slug]/editar'
    },
    '/songs/[slug]': {
      es: '/cancion/[slug]'
    },
    '/songs/[slug]/edit': {
      es: '/cancion/[slug]/editar'
    },
    '/search': {
      es: '/buscar'
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
    },
    '/admin/upload-artist': {
      es: '/admin/subir-artista'
    },
    '/privacy-policy': {
      es: '/politica-de-privacidad'
    },
    '/security': {
      es: '/seguridad'
    },
    '/cookie-policy': {
      es: '/politica-de-cookies'
    },
    // Rutas sin traducción: se declaran para poder usarlas con el `Link`
    // tipado de next-intl. Mantienen la misma URL en ambos idiomas.
    '/scales': '/scales',
    '/admin/artists': '/admin/artists',
    '/admin/add-song': '/admin/add-song',
    '/learn/metronome': '/learn/metronome',
    '/learn/ear-trainer': '/learn/ear-trainer',
    '/learn/circle-of-fifths': '/learn/circle-of-fifths'
  }
})
