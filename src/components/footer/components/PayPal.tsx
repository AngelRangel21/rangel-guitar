import { Coffee } from 'lucide-react'
import Link from 'next/link'
import { useTranslations } from 'next-intl'
import type { JSX } from 'react'

export function PayPal(): JSX.Element {
  const t = useTranslations('footer')
  return (
    <div className='flex justify-center'>
      <Link
        target='_blank'
        rel='noopener noreferrer'
        href='https://www.paypal.com/paypalme/angelrangelm'
        className='bg-accent text-accent-foreground px-8 py-3.5 rounded-xl font-bold hover:scale-95 transition-all duration-200 hover:shadow-lg hover:shadow-accent/25 flex items-center gap-2.5'
      >
        <Coffee className='h-5 w-5' />
        {t('paypal')}
      </Link>
    </div>
  )
}
