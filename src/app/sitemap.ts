import { MetadataRoute } from 'next'
import { getSongs, getArtists } from '@/services/songs-service';

/**
 * Genera el mapa del sitio (sitemap.xml) de forma dinámica.
 * Un mapa del sitio ayuda a los motores de búsqueda a descubrir e indexar todas las páginas del sitio web.
 * Se ejecuta en tiempo de compilación para generar un archivo estático.
 * @returns {Promise<MetadataRoute.Sitemap>} Un array de objetos que representan todas las URL del sitio.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // URL base del sitio. Es importante que sea la URL de producción.
  const siteUrl = 'https://rangelguitar.com';

  // Obtiene todas las canciones y crea rutas para ellas.
  const songs = await getSongs();
  const songRoutes = songs.map((song) => ({
    url: `${siteUrl}/songs/${song.slug}`,
    lastModified: new Date(),
  }));

  // Obtiene todos los artistas y crea rutas para ellos.
  const artists = await getArtists();
  const artistRoutes = artists.map((artist) => ({
    url: `${siteUrl}/artists/${encodeURIComponent(artist.name)}`,
    lastModified: new Date(),
  }));

  // Define las rutas estáticas de la aplicación.
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

  // Combina todas las rutas en un solo array.
  return [
    ...staticRoutes,
    ...songRoutes,
    ...artistRoutes,
  ]
}
