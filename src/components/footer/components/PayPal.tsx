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
        className='bg-[#facc15] text-slate-900 px-8 py-3 rounded-xl font-bold hover:scale-95 transition-all flex items-center gap-2'
      >
        <Coffee />
        {t('paypal')}
      </Link>
    </div>
  )
}
