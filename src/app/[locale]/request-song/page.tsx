'use client'

import { CheckCircle2, MessageSquarePlus, Search, Send } from 'lucide-react'
import { useTranslations } from 'next-intl'
import type { JSX } from 'react'
import { PageHeader, PageShell } from '@/components/layout/page-header'
import { ProtectedPage } from '@/components/protected-page'
import { RequestSongForm } from '@/components/request-song-form'

/**
 * Página para que los usuarios autenticados soliciten nuevas canciones.
 * Redirige al login si no hay sesión.
 */
export default function RequestSongPage(): JSX.Element {
  const t = useTranslations('requestPage')

  const steps = [
    { icon: Send, title: t('steps.send.title'), text: t('steps.send.text') },
    {
      icon: Search,
      title: t('steps.review.title'),
      text: t('steps.review.text')
    },
    {
      icon: CheckCircle2,
      title: t('steps.publish.title'),
      text: t('steps.publish.text')
    }
  ]

  return (
    <ProtectedPage>
      <PageShell>
        <PageHeader
          eyebrow={{ icon: MessageSquarePlus, label: t('eyebrow') }}
          title={t('title')}
          description={t('description')}
        />

        <div className='grid gap-8 lg:grid-cols-[minmax(0,1fr)_28rem] lg:items-start'>
          <section aria-labelledby='request-how' className='space-y-5'>
            <h2
              id='request-how'
              className='text-2xl font-bold tracking-tight text-foreground font-headline'
            >
              {t('howTitle')}
            </h2>
            <ol className='space-y-3'>
              {steps.map(({ icon: Icon, title, text }, index) => (
                <li
                  key={title}
                  className='flex gap-4 rounded-2xl border bg-card p-4'
                >
                  <span className='flex size-10 shrink-0 items-center justify-center rounded-xl bg-muted'>
                    <Icon aria-hidden='true' className='size-5' />
                  </span>
                  <div>
                    <p className='font-semibold text-foreground'>
                      <span className='mr-1.5 tabular-nums text-muted-foreground'>
                        {index + 1}.
                      </span>
                      {title}
                    </p>
                    <p className='text-sm text-muted-foreground'>{text}</p>
                  </div>
                </li>
              ))}
            </ol>
          </section>

          <div className='lg:sticky lg:top-24'>
            <RequestSongForm />
          </div>
        </div>
      </PageShell>
    </ProtectedPage>
  )
}
