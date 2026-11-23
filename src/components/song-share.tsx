'use client'

import { Check, Link2 } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { type JSX, type ReactNode, useState } from 'react'
import {
  FacebookIcon,
  TelegramIcon,
  WhatsAppIcon,
  XTwitter
} from '@/components/icons'
import { useI18n } from '@/context/i18n-context'

interface SongShareProps {
  title: string
  artist: string
}

interface ShareTarget {
  label: string
  icon: ReactNode
  buildUrl: (url: string, text: string) => string
}

const enc = encodeURIComponent

const shareButtonClass =
  'inline-flex size-10 items-center justify-center rounded-full border bg-background text-foreground transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring'

/**
 * Botones para compartir la canción. La URL se lee al hacer clic para no
 * depender de `window` durante el render (evita desajustes de hidratación).
 */
export function SongShare({ title, artist }: SongShareProps): JSX.Element {
  const { t } = useI18n()
  const ts = useTranslations('songView')
  const [copied, setCopied] = useState(false)
  const shareText = t('shareText', { title, artist })

  const targets: ShareTarget[] = [
    {
      label: t('shareOnWhatsApp'),
      icon: <WhatsAppIcon className='size-5' />,
      buildUrl: (url, text) =>
        `https://api.whatsapp.com/send?text=${enc(`${text} ${url}`)}`
    },
    {
      label: t('shareOnFacebook'),
      icon: <FacebookIcon className='size-5' />,
      buildUrl: (url) =>
        `https://www.facebook.com/sharer/sharer.php?u=${enc(url)}`
    },
    {
      label: t('shareOnTwitter'),
      icon: <XTwitter className='size-4' />,
      buildUrl: (url, text) =>
        `https://twitter.com/intent/tweet?text=${enc(text)}&url=${enc(url)}`
    },
    {
      label: t('shareOnTelegram'),
      icon: <TelegramIcon className='size-5' />,
      buildUrl: (url, text) =>
        `https://t.me/share/url?url=${enc(url)}&text=${enc(text)}`
    }
  ]

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // El portapapeles puede no estar disponible (contexto no seguro).
    }
  }

  return (
    <div className='flex flex-wrap items-center gap-2'>
      {targets.map((target) => (
        <button
          key={target.label}
          type='button'
          aria-label={target.label}
          title={target.label}
          onClick={() =>
            window.open(
              target.buildUrl(window.location.href, shareText),
              '_blank',
              'noopener,noreferrer'
            )
          }
          className={shareButtonClass}
        >
          {target.icon}
        </button>
      ))}
      <button
        type='button'
        onClick={handleCopy}
        aria-label={copied ? ts('copied') : ts('copyLink')}
        title={copied ? ts('copied') : ts('copyLink')}
        className={shareButtonClass}
      >
        {copied ? (
          <Check aria-hidden='true' className='size-4' />
        ) : (
          <Link2 aria-hidden='true' className='size-4' />
        )}
      </button>
      <span className='sr-only' aria-live='polite'>
        {copied ? ts('copied') : ''}
      </span>
    </div>
  )
}
