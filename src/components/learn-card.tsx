'use client'

import { ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import { useI18n } from '@/context/i18n-context'

interface LearnCardProps {
  href: string
  icon: React.ReactNode
  title: string
  description: string
}

export function LearnCard({ href, icon, title, description }: LearnCardProps) {
  const { t } = useI18n()
  return (
    <Link href={href} className='group block'>
      <Card className='relative h-full transition-all duration-300 hover:border-accent hover:shadow-xl hover:shadow-accent/10 hover:-translate-y-1 bg-card flex flex-col overflow-hidden'>
        <div className='absolute inset-0 bg-linear-to-br from-accent/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300' />
        <Badge variant='info' className='absolute top-4 right-4 z-10'>
          {t('beta')}
        </Badge>
        <CardHeader className='relative z-10'>
          <div className='text-accent transition-transform duration-300 group-hover:rotate-3'>
            {icon}
          </div>
        </CardHeader>
        <CardContent className='relative z-10 flex flex-col grow'>
          <CardTitle className='text-xl font-semibold group-hover:text-accent transition-colors duration-200'>
            {title}
          </CardTitle>
          <CardDescription className='mt-2 grow text-muted-foreground'>
            {description}
          </CardDescription>
          <div className='mt-4 flex items-center font-semibold text-accent'>
            <span>{t('seeMore')}</span>
            <ArrowRight className='ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-2' />
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
