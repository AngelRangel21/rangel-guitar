import { MetadataRoute } from 'next'
import { getSongs, getArtists } from '@/services/songs-service';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = 'https://rangelguitar.com';

  const songs = await getSongs();
  const songRoutes = songs.map((song) => ({
    url: `${siteUrl}/songs/${song.slug}`,
    lastModified: new Date(),
  }));

  const artists = await getArtists();
  const artistRoutes = artists.map((artist) => ({
    url: `${siteUrl}/artists/${encodeURIComponent(artist)}`,
    lastModified: new Date(),
  }));

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
  }));

  return [
    ...staticRoutes,
    ...songRoutes,
    ...artistRoutes,
  ]
}
