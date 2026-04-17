// import { MetadataRoute } from 'next'
/** biome-ignore-all lint/suspicious/noExplicitAny: explain */
// import { getArtists } from '@/services/artists.service'
// import { getSongByArtist } from '@/services/song.service'

// export default async function sitemap (): Promise<MetadataRoute.Sitemap> {
//   const siteUrl = 'https://rangelguitar.com'
//   // const locales = ['es', 'en']

//   const staticPaths = [
//     '',
//     '/artists',
//     '/chords',
//     '/learn',
//     '/scales',
//     '/login',
//     '/register',
//     '/favorites',
//     '/request-song',
//     '/privacy-policy',
//     '/security',
//     '/cookie-policy'
//   ]

//   // 1. Rutas Estáticas con i18n
//   // const staticRoutes = locales.flatMap((lang) =>
//   //   staticPaths.map((path) => ({
//   //     url: `${siteUrl}/${lang}${path}`,
//   //     lastModified: new Date(),
//   //     changeFrequency: 'monthly' as const,
//   //     priority: path === '' ? 1 : 0.8
//   //   }))
//   // )
//   const staticRoutes = staticPaths.map((path) => ({
//       url: `${siteUrl}${path}`,
//       lastModified: new Date(),
//       changeFrequency: 'monthly' as const,
//       priority: path === '' ? 1 : 0.8
//     }))

//   try {
//     // Usamos getSongByArtist porque ya lo tienes mapeado con la estructura nueva
//     const songs = await getSongByArtist()
//     const artists = await getArtists()

//     // 2. Rutas de Canciones con i18n
//     // const songRoutes = locales.flatMap((lang) =>
//     //   songs.map((song) => ({
//     //     url: `${siteUrl}/${lang}/songs/${song.slug}`,
//     //     lastModified: new Date(),
//     //     changeFrequency: 'weekly' as const,
//     //     priority: 0.9
//     //   }))
//     // )
//     const songRoutes = songs.map((song) => ({
//         url: `${siteUrl}/songs/${song.slug}`,
//         lastModified: new Date(),
//         changeFrequency: 'weekly' as const,
//         priority: 0.9
//       }))

//     // 3. Rutas de Artistas con i18n (CORREGIDO el [object Object])
//     // const artistRoutes = locales.flatMap((lang) =>
//     //   artists.map((artist) => ({
//     //     // Usamos artist.slug en lugar del objeto completo
//     //     url: `${siteUrl}/${lang}/artists/${artist.slug}`,
//     //     lastModified: new Date(),
//     //     changeFrequency: 'monthly' as const,
//     //     priority: 0.8
//     //   }))
//     // )
//     const artistRoutes = artists.map((artist) => ({
//         // Usamos artist.slug en lugar del objeto completo
//         url: `${siteUrl}/artists/${artist.slug}`,
//         lastModified: new Date(),
//         changeFrequency: 'monthly' as const,
//         priority: 0.8
//       }))

//     return [
//       ...staticRoutes,
//       ...songRoutes,
//       ...artistRoutes
//     ]
//   } catch (error) {
//     console.error('❌ Sitemap build error:', error)
//     return staticRoutes
//   }
// }

import type { MetadataRoute } from 'next'
import { getPathname } from '@/i18n/navigation'
import { routing } from '@/i18n/routing' // Importamos tu config
import { getArtists } from '@/services/artists.service'
import { getSongByArtist } from '@/services/song.service'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = 'https://rangelguitar.com'
  const locales = routing.locales

  const staticPaths = [
    '/',
    '/artists',
    '/chords',
    '/learn',
    '/scales',
    '/login',
    '/register',
    '/favorites',
    '/request-song',
    '/privacy-policy',
    '/security',
    '/cookie-policy'
  ]

  // 1. Rutas Estáticas con i18n
  const staticRoutes = locales.flatMap((locale) =>
    staticPaths.map((path) => {
      const pathname = getPathname({ locale, href: path as any })
      return {
        url: `${siteUrl}${pathname}`,
        lastModified: new Date(),
        changeFrequency: 'monthly' as const,
        priority: path === '/' ? 1 : 0.8
      }
    })
  )

  try {
    const [songs, artists] = await Promise.all([
      getSongByArtist(),
      getArtists()
    ])

    // 2. Rutas de Canciones dinámicas
    const songRoutes = locales.flatMap((locale) =>
      songs
        .filter((song) => song.slug)
        .map((song) => {
          // next-intl resolverá /cancion/[slug] o /songs/[slug] según el locale
          const pathname = getPathname({
            locale,
            href: {
              pathname: '/songs/[slug]',
              params: { slug: song.slug as string }
            }
          })
          return {
            url: `${siteUrl}${pathname}`,
            lastModified: new Date(),
            changeFrequency: 'weekly' as const,
            priority: 0.9
          }
        })
    )

    // 3. Rutas de Artistas dinámicas
    const artistRoutes = locales.flatMap((locale) =>
      artists
        .filter((artist) => artist.slug)
        .map((artist) => {
          const pathname = getPathname({
            locale,
            href: { pathname: '/artists/[slug]', params: { slug: artist.slug } }
          })
          return {
            url: `${siteUrl}${pathname}`,
            lastModified: new Date(),
            changeFrequency: 'monthly' as const,
            priority: 0.8
          }
        })
    )

    return [...staticRoutes, ...songRoutes, ...artistRoutes]
  } catch (error) {
    console.error('❌ Sitemap build error:', error)
    return staticRoutes
  }
}
