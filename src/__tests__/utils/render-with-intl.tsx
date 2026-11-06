import { render } from '@testing-library/react'
import { NextIntlClientProvider } from 'next-intl'
import type { ReactElement, ReactNode } from 'react'
import en from '../../../messages/en.json'
import es from '../../../messages/es.json'

export const messages = { en, es }

interface RenderWithIntlOptions {
  locale?: 'en' | 'es'
}

function IntlProvider({
  children,
  locale = 'es'
}: RenderWithIntlOptions & { children: ReactNode }) {
  return (
    <NextIntlClientProvider locale={locale} messages={messages[locale]}>
      {children}
    </NextIntlClientProvider>
  )
}

export function renderWithIntl(
  ui: ReactElement,
  { locale = 'es' }: RenderWithIntlOptions = {}
) {
  return render(<IntlProvider locale={locale}>{ui}</IntlProvider>)
}
