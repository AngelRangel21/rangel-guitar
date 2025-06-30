import { MetadataRoute } from 'next'
import { songs } from '@/lib/data';

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = 'https://rangel-guitar.firebaseapp.com';

  const songRoutes = songs.map((song) => ({
    url: `${siteUrl}/songs/${song.id}`,
    lastModified: new Date(),
  }));

  const artists = Array.from(new Set(songs.map(song => song.artist)));
  const artistRoutes = artists.map((artist) => ({
    url: `${siteUrl}/artists/${encodeURIComponent(artist)}`,
    lastModified: new Date(),
  }));

  const staticRoutes = [
    '/',
    '/artists',
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
