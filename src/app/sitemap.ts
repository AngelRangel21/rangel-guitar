import { MetadataRoute } from 'next'
import { getArtists } from '@/services/songs-service'
import { getSongs } from '@/services/song.service'

export default async function sitemap (): Promise<MetadataRoute.Sitemap> {
  const siteUrl = 'https://rangelguitar.com'

  const staticRoutes = [
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
  ].map((route) => ({
    url: `${siteUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: route === '/' ? 1 : 0.8
  }))

  try {
    const songs = await getSongs()
    const artists = await getArtists()

    const songRoutes = songs.map((song) => ({
      url: `${siteUrl}/songs/${song.slug}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.9
    }))

    const artistRoutes = artists.map((artistName) => ({
      url: `${siteUrl}/artists/${encodeURIComponent(artistName)}`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.8
    }))

    return [
      ...staticRoutes,
      ...songRoutes,
      ...artistRoutes
    ]
  } catch (error) {
    console.error('❌ Sitemap build error:', error)

    // 🔥 JAMÁS rompas el build
    return staticRoutes
  }
}
