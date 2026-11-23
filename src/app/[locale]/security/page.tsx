import { LockKeyhole } from 'lucide-react'
import type { JSX } from 'react'
import { PageHeader, PageShell } from '@/components/layout/page-header'

/**
 * Página estática que muestra la política de seguridad del sitio web.
 * Contiene información sobre las medidas de seguridad implementadas.
 * @returns {JSX.Element} La página de política de seguridad.
 */
export default function SecurityPage(): JSX.Element {
  return (
    <PageShell size='prose'>
      <PageHeader
        eyebrow={{ icon: LockKeyhole, label: 'Legal' }}
        title='Política de Seguridad'
      />
      <article className='space-y-5 rounded-3xl border bg-card p-6 leading-relaxed text-muted-foreground sm:p-10 [&_h2]:pt-4 [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:tracking-tight [&_h2]:text-foreground [&_strong]:text-foreground'>
        {/* Contenido de la política de seguridad */}
        <p>
          La seguridad de su información es de suma importancia para nosotros en
          Rangel Guitar. Hemos implementado una variedad de medidas de seguridad
          para mantener la seguridad de su información personal cuando realiza
          un pedido o ingresa, envía o accede a su información personal.
        </p>
        <h2 className='text-xl font-semibold text-foreground pt-4'>
          Protección de Datos
        </h2>
        <p>
          Utilizamos encriptación SSL (Secure Socket Layer) para proteger sus
          datos durante la transmisión. Sus datos personales se almacenan detrás
          de redes seguras y solo son accesibles por un número limitado de
          personas que tienen derechos de acceso especiales a dichos sistemas y
          están obligadas a mantener la confidencialidad de la información.
        </p>
        <h2 className='text-xl font-semibold text-foreground pt-4'>
          Contraseñas
        </h2>
        <p>
          Las contraseñas de los usuarios se almacenan utilizando algoritmos de
          hash seguros. Nunca almacenamos contraseñas en texto plano. Es su
          responsabilidad mantener la confidencialidad de su contraseña y no
          compartirla con nadie.
        </p>
        <h2 className='text-xl font-semibold text-foreground pt-4'>
          Proveedores de Terceros
        </h2>
        <p>
          Trabajamos con proveedores de servicios de confianza, como Firebase de
          Google para la autenticación, que cumplen con los más altos estándares
          de seguridad de la industria para proteger sus datos.
        </p>
      </article>
    </PageShell>
  )
}
