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
    <footer style={{ background: '#d4d0c8', fontFamily: "'Tahoma', 'MS Sans Serif', sans-serif", borderTop: '2px solid', borderColor: '#808080 #ffffff #ffffff #808080', boxShadow: 'inset 1px 1px 0 #404040' }}>
      {/* Win2K Status bar style footer */}
      <div className='max-w-7xl mx-auto px-2 py-2'>
        {/* Top row: social + donate */}
        <div className='flex flex-col md:flex-row justify-between items-start gap-3 pb-2' style={{ borderBottom: '1px solid #808080' }}>
          <div className='win-window p-2' style={{ minWidth: '200px' }}>
            <div className='win-title-bar mb-1'>
              <span style={{ fontSize: '10px' }}>💛 Apoyar el proyecto</span>
            </div>
            <p style={{ fontSize: '10px', marginBottom: '6px' }}>Ayúdanos a mantener el sitio sin publicidad.</p>
            <PayPal />
          </div>
          <div className='win-window p-2'>
            <div className='win-title-bar mb-1'>
              <span style={{ fontSize: '10px' }}>📡 Redes Sociales</span>
            </div>
            <nav className='flex gap-1 flex-wrap'>
              {social.map((s) => (
                <Link
                  key={s.href}
                  href={s.href}
                  aria-label={s.label}
                  title={s.title}
                  className='win-button flex items-center gap-1'
                  style={{ fontSize: '10px', padding: '2px 6px', textDecoration: 'none', color: '#000' }}
                >
                  {s.icon}
                  <span>{s.label}</span>
                </Link>
              ))}
            </nav>
          </div>
        </div>
        {/* Bottom row: links + copyright */}
        <div className='win-status-bar flex flex-col md:flex-row justify-between items-center gap-1 pt-1'>
          <div className='flex gap-4'>
            <Link className='hover:underline' href='/privacy-policy' title='Política de Privacidad' style={{ fontSize: '10px', color: '#000' }}>Privacidad</Link>
            <Link className='hover:underline' href='/security' title='Seguridad' style={{ fontSize: '10px', color: '#000' }}>Seguridad</Link>
            <Link className='hover:underline' href='/cookie-policy' title='Cookies' style={{ fontSize: '10px', color: '#000' }}>Cookies</Link>
          </div>
          <p style={{ fontSize: '10px' }}>© {currentYear} Rangel Guitar. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  )
}
