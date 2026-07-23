/** biome-ignore-all lint/suspicious/noExplicitAny: explain */

import type { MetadataRoute } from 'next'
import { getPathname } from '@/i18n/navigation'
import { routing } from '@/i18n/routing'
import { getArtists } from '@/services/artists.service'
import { getSongByArtist } from '@/services/song.service'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = 'https://rangelguitar.com'
  const locales = routing.locales
  const now = new Date()

  const alternateLanguages = (href: any) => {
    const languages: Record<string, string> = Object.fromEntries(
      locales.map((l) => [l, `${siteUrl}${getPathname({ locale: l, href })}`])
    )

    // Asignamos la ruta en español como la versión predeterminada mundial
    languages['x-default'] = `${siteUrl}${getPathname({ locale: 'es', href })}`

    return languages
  }

  const staticPaths = [
    { path: '/', priority: 1 as const, freq: 'weekly' as const },
    { path: '/artists', priority: 0.9 as const, freq: 'weekly' as const },
    { path: '/chords', priority: 0.8 as const, freq: 'monthly' as const },
    { path: '/learn', priority: 0.8 as const, freq: 'monthly' as const },
    { path: '/scales', priority: 0.8 as const, freq: 'monthly' as const },
    { path: '/request-song', priority: 0.7 as const, freq: 'monthly' as const },
    {
      path: '/privacy-policy',
      priority: 0.3 as const,
      freq: 'yearly' as const
    },
    { path: '/security', priority: 0.3 as const, freq: 'yearly' as const },
    { path: '/cookie-policy', priority: 0.3 as const, freq: 'yearly' as const }
  ]

  const staticRoutes = staticPaths.flatMap(({ path, priority, freq }) =>
    locales.map((locale) => {
      const pathname = getPathname({ locale, href: path as any })
      const href = path as any
      const Url = `${siteUrl}${pathname}`
      return {
        url: Url,
        lastModified: now,
        changeFrequency: freq,
        priority,
        alternates: {
          languages: alternateLanguages(href)
        }
      }
    })
  )

  const dynamicPages = [
    { path: '/learn/metronome', priority: 0.7 as const },
    { path: '/learn/ear-trainer', priority: 0.7 as const },
    { path: '/learn/circle-of-fifths', priority: 0.7 as const }
  ]

  const learnRoutes = dynamicPages.flatMap(({ path, priority }) =>
    locales.map((locale) => {
      const pathname = getPathname({ locale, href: path as any })
      const href = path as any
      return {
        url: `${siteUrl}${pathname}`,
        lastModified: now,
        changeFrequency: 'monthly' as const,
        priority,
        alternates: {
          languages: alternateLanguages(href)
        }
      }
    })
  )

  try {
    const [songs, artists] = await Promise.all([
      getSongByArtist(),
      getArtists()
    ])

    const songRoutes: MetadataRoute.Sitemap = []
    for (const song of songs) {
      if (!song.slug) continue

      const href = {
        pathname: '/songs/[slug]' as const,
        params: { slug: song.slug as string }
      }

      for (const locale of locales) {
        const pathname = getPathname({ locale, href })
        const Url = `${siteUrl}${pathname}`
        songRoutes.push({
          url: Url,
          lastModified: song.updatedAt ? new Date(song.updatedAt) : now,
          changeFrequency: 'weekly' as const,
          priority: 0.9,
          alternates: {
            languages: alternateLanguages(href)
          }
        })
      }
    }

    const artistRoutes: MetadataRoute.Sitemap = []
    for (const artist of artists) {
      if (!artist.slug) continue

      const href = {
        pathname: '/artists/[slug]' as const,
        params: { slug: artist.slug as string }
      }

      for (const locale of locales) {
        const pathname = getPathname({ locale, href })
        const Url = `${siteUrl}${pathname}`
        artistRoutes.push({
          url: Url,
          lastModified: artist.created_at ? new Date(artist.update_at) : now,
          changeFrequency: 'weekly' as const,
          priority: 0.9,
          alternates: {
            languages: alternateLanguages(href)
          }
        })
      }
    }

    return [...staticRoutes, ...learnRoutes, ...songRoutes, ...artistRoutes]
  } catch (error) {
    console.error('❌ Sitemap build error:', error)
    return [...staticRoutes, ...learnRoutes]
  }
}
