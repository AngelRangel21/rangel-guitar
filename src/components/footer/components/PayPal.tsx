import { Coffee } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import { useTranslations } from 'next-intl'

export function PayPal() {
  const t = useTranslations('footer')
  return (
    <a
      target='_blank'
      rel='noopener noreferrer'
      href='https://www.paypal.com/paypalme/angelrangelm'
      className='inline-flex h-11 shrink-0 items-center gap-2.5 rounded-full bg-primary-foreground px-6 text-sm font-semibold text-primary transition-transform hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-primary'
    >
      <HugeiconsIcon icon={Coffee} className='size-5' />
      {t('paypal')}
    </a>
  )
}
