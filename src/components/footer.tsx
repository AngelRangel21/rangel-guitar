'use client'

import Link from 'next/link'
import { WhatsAppIcon, TelegramIcon, FacebookIcon } from '@/components/icons'
import { PayPal } from './footer/PayPal'
import { JSX } from 'react'

export function Footer (): JSX.Element {
  const currentYear = new Date().getFullYear() // Obtiene el año actual para el copyright.

  const social = [
    {
      href: 'https://www.facebook.com/share/1Akd7FErLL/?mibextid=wwXlfr',
      label: 'Facebook',
      title: 'Ir a la pagina de Facebook de Rangel Guitar',
      icon: <FacebookIcon className='h-6 w-6' />
    },
    {
      href: 'https://chat.whatsapp.com/Hbtr0lzFG4u4AGvAStj6WJ?mode=r_c',
      label: 'WhatsApp',
      title: 'Ir al grupo de WhatsApp de Rangel Guitar',
      icon: <WhatsAppIcon className='h-6 w-6' />
    },
    {
      href: 'https://t.me/Rangelguitar',
      label: 'Telegram',
      title: 'Ir al grupo de Telegram de Rangel Guitar',
      icon: <TelegramIcon className='h-6 w-6' />
    }
  ]

  return (
    <footer className='bg-slate-900 text-slate-400 py-12'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='grid grid-cols-1 md:grid-cols-3 gap-12 items-center text-center md:text-left mb-10 border-b border-slate-800 pb-10'>
          <div>
            <h4 className='text-white font-bold mb-4'>¿Te gusta lo que hacemos?</h4>
            <p className='text-sm mb-6'>Ayúdanos a mantener el sitio libre de publicidad y con más contenido cada día.</p>
          </div>
          <PayPal />
          <div className='flex flex-col justify-center md:justify-end'>
            <p className='text-center md:text-end mb-2'>Nuestras Redes sociales</p>
            <nav className='flex justify-center md:justify-end gap-4'>
              {social.map((social) => (
                <Link
                  key={social.href}
                  href={social.href}
                  aria-label={social.label}
                  title={social.title}
                  className='p-2 bg-slate-800 rounded-full hover:bg-primary hover:text-slate-900 transition-all'
                >
                  {social.icon}
                </Link>
              ))}
            </nav>
          </div>
        </div>
        <div className='flex flex-col md:flex-row justify-between items-center text-xs gap-4'>
          <div className='flex gap-8'>
            <a
              className='hover:text-white transition-colors'
              href='/privacy-policy'
              title='Ir a la pagina de Política de Privacidad de Rangel Guitar'
            >
              Política de Privacidad
            </a>
            <a
              className='hover:text-white transition-colors'
              href='/security'
              title='Ir a la pagina de Política de Seguridad de Rangel Guitar'
            >
              Seguridad
            </a>
            <a
              className='hover:text-white transition-colors'
              href='/cookie-policy'
              title='Ir a la pagina de Política de Cookies de Rangel Guitar'
            >
              Política de Cookies
            </a>
          </div>
          <p>© {currentYear} Rangel Guitar. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  )
}
