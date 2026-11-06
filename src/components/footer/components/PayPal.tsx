import { Coffee } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import { useTranslations } from 'next-intl'

export function PayPal() {
  const t = useTranslations('footer')
  return (
    <div className='flex justify-center'>
      <a
        target='_blank'
        rel='noopener noreferrer'
        href='https://www.paypal.com/paypalme/angelrangelm'
        className='bg-sidebar-primary/20 hover:bg-sidebar-primary/30 text-accent-foreground px-8 py-3.5 rounded-xl font-bold hover:scale-105 transition-all duration-200 hover:shadow-lg hover:shadow-accent/55 flex items-center gap-2.5'
      >
        <HugeiconsIcon icon={Coffee} />
        {t('paypal')}
      </a>
    </div>
  )
}
