import type { LucideIcon } from 'lucide-react'
import { getTranslations } from 'next-intl/server'
import type { JSX, ReactNode } from 'react'
import { PageHeader, PageShell } from '@/components/layout/page-header'

interface ToolPageProps {
  icon: LucideIcon
  /** Grupo de la herramienta en la página de Aprender. */
  group: 'theory' | 'practice'
  title: string
  description: string
  children: ReactNode
}

/** Layout común de las herramientas de "Aprender". */
export async function ToolPage({
  icon,
  group,
  title,
  description,
  children
}: ToolPageProps): Promise<JSX.Element> {
  const t = await getTranslations('learnPage')

  return (
    <PageShell>
      <PageHeader
        back={{ href: '/learn', label: t('backToLearn') }}
        eyebrow={{ icon, label: t(`${group}.title`) }}
        title={title}
        description={description}
      />
      <div className='animate-fade-up' style={{ animationDelay: '100ms' }}>
        {children}
      </div>
    </PageShell>
  )
}
