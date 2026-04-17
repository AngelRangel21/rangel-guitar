import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const siteUrl = 'https://rangelguitar.com'

  return {
    rules: {
      userAgent: '*',
      allow: [
        '/',
        '/*/privacy-policy', // Permitimos las políticas explícitamente
        '/*/cookie-policy',
        '/*/security'
      ],
      disallow: [
        '/*/_next/',
        '/api/',
        '/admin/', // Bloqueamos el panel de administración
        '/*/admin/', // Por si acaso tienes el locale antes (ej: /es/admin)
        '/*/login',
        '/*/register',
        '/*/favoritos',
        '/*/favorites',
        '/*/entrar',
        '/*/registrarse'
      ]
    },
    sitemap: `${siteUrl}/sitemap.xml`
  }
}
