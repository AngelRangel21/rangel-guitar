/** biome-ignore-all lint/suspicious/noExplicitAny: explain */

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
    '/request-song',
    '/privacy-policy',
    '/security',
    '/cookie-policy'
  ]

  // 1. Rutas Estáticas con i18n
  const staticRoutes = staticPaths.flatMap((path) =>
    locales.map((locale) => {
      const pathname = getPathname({ locale, href: path as any })
      return {
        url: `${siteUrl}${pathname}`,
        lastModified: new Date(),
        changeFrequency: 'monthly' as const,
        priority: path === '/' ? 1 : 0.8,
        alternates: {
          languages: Object.fromEntries(
            locales.map((l) => [
              l,
              `${siteUrl}${getPathname({ locale: l, href: path as any })}`
            ])
          )
        }
      }
    })
  )

  try {
    const [songs, artists] = await Promise.all([
      getSongByArtist(),
      getArtists()
    ])

    // 2. Rutas de Canciones dinámicas
    const songRoutes = songs
      .filter((song) => song.slug)
      .flatMap((song) =>
        locales.map((locale) => {
          const href = {
            pathname: '/songs/[slug]' as const,
            params: { slug: song.slug as string }
          }
          return {
            url: `${siteUrl}${getPathname({ locale, href })}`,
            lastModified: new Date(),
            changeFrequency: 'weekly' as const,
            priority: 0.9,
            alternates: {
              languages: Object.fromEntries(
                locales.map((l) => [
                  l,
                  `${siteUrl}${getPathname({ locale: l, href })}`
                ])
              )
            }
          }
        })
      )

    // 3. Rutas de Artistas dinámicas
    const artistRoutes = artists
      .filter((artist) => artist.slug)
      .flatMap((artist) =>
        locales.map((locale) => {
          const href = {
            pathname: '/artists/[slug]' as const,
            params: { slug: artist.slug }
          }
          return {
            url: `${siteUrl}${getPathname({ locale, href })}`,
            lastModified: new Date(),
            changeFrequency: 'monthly' as const,
            priority: 0.8,
            alternates: {
              languages: Object.fromEntries(
                locales.map((l) => [
                  l,
                  `${siteUrl}${getPathname({ locale: l, href })}`
                ])
              )
            }
          }
        })
      )

    return [...staticRoutes, ...songRoutes, ...artistRoutes]
  } catch (error) {
    console.error('❌ Sitemap build error:', error)
    return staticRoutes
  }
}
