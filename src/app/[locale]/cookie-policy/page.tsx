import { Cookie } from 'lucide-react'
import type { JSX } from 'react'
import { PageHeader, PageShell } from '@/components/layout/page-header'

/**
 * Página estática que muestra la política de cookies del sitio web.
 * Contiene información legal sobre el uso de cookies.
 * @returns {JSX.Element} La página de política de cookies.
 */
export default function CookiePolicyPage(): JSX.Element {
  return (
    <PageShell size='prose'>
      <PageHeader
        eyebrow={{ icon: Cookie, label: 'Legal' }}
        title='Política de Cookies'
      />
      <article className='space-y-5 rounded-3xl border bg-card p-6 leading-relaxed text-muted-foreground sm:p-10 [&_h2]:pt-4 [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:tracking-tight [&_h2]:text-foreground [&_strong]:text-foreground'>
        {/* Contenido de la política de cookies */}
        <p>
          Este sitio web, Rangel Guitar, utiliza cookies para mejorar su
          experiencia mientras navega por el sitio web. De estas, las cookies
          que se clasifican como necesarias se almacenan en su navegador, ya que
          son esenciales para el funcionamiento de las funcionalidades básicas
          del sitio web.
        </p>
        <h2 className='text-xl font-semibold text-foreground pt-4'>
          ¿Qué son las cookies?
        </h2>
        <p>
          Las cookies son pequeños archivos de texto que los sitios web que
          visita colocan en su computadora. Se utilizan ampliamente para que los
          sitios web funcionen, o funcionen de manera más eficiente, así como
          para proporcionar información a los propietarios del sitio.
        </p>
        <h2 className='text-xl font-semibold text-foreground pt-4'>
          Cómo usamos las cookies
        </h2>
        <p>
          Utilizamos cookies para una variedad de propósitos detallados a
          continuación. Desafortunadamente, en la mayoría de los casos no
          existen opciones estándar de la industria para deshabilitar las
          cookies sin deshabilitar por completo la funcionalidad y las
          características que agregan a este sitio. Se recomienda que deje
          activadas todas las cookies si no está seguro de si las necesita o no,
          en caso de que se utilicen para proporcionar un servicio que utiliza.
        </p>
        <h2 className='text-xl font-semibold text-foreground pt-4'>
          Desactivación de Cookies
        </h2>
        <p>
          Puede evitar la instalación de cookies ajustando la configuración de
          su navegador (consulte la Ayuda de su navegador para saber cómo
          hacerlo). Tenga en cuenta que deshabilitar las cookies afectará la
          funcionalidad de este y muchos otros sitios web que visite. La
          desactivación de cookies generalmente resultará también en la
          desactivación de ciertas funcionalidades y características de este
          sitio.
        </p>
      </article>
    </PageShell>
  )
}
