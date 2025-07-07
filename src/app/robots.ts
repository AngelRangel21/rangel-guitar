import { MetadataRoute } from 'next'
 
/**
 * Genera el contenido del archivo robots.txt para el sitio web.
 * Este archivo indica a los rastreadores web (como Googlebot) qué páginas pueden rastrear.
 * @returns {MetadataRoute.Robots} El objeto de configuración de robots.
 */
export default function robots(): MetadataRoute.Robots {
  // URL base del sitio. Es importante que sea la URL de producción.
  const siteUrl = 'https://rangelguitar.com';

  return {
    rules: {
      userAgent: '*', // Se aplica a todos los rastreadores.
      allow: '/',     // Permite rastrear todo el sitio.
    },
    sitemap: `${siteUrl}/sitemap.xml`, // Especifica la ubicación del mapa del sitio.
  }
}
