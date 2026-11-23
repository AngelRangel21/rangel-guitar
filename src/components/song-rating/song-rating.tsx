'use client'

import { Star } from 'lucide-react'
import { useFormatter, useTranslations } from 'next-intl'
import { type JSX, useCallback, useEffect, useId, useState } from 'react'
import { toast } from 'sonner'
import { buttonVariants } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { useAuth } from '@/hooks/useAuth'
import { Link } from '@/i18n/navigation'
import {
  getSongRatingSummary,
  getUserSongRating,
  rateSong,
  removeSongRating
} from '@/services/ratings.service'
import type { SongRatingSummary } from '@/types/app.types'
import { isValidRating } from './rating.utils'
import { StarRatingDisplay } from './star-rating-display'
import { StarRatingInput } from './star-rating-input'

const EMPTY_SUMMARY: SongRatingSummary = { average: 0, total: 0 }

/** Valoración de una canción: media pública y estrellas del usuario. */
export function SongRating({ songId }: { songId: string }): JSX.Element {
  const t = useTranslations('songRating')
  const format = useFormatter()
  const { user, isLoaded } = useAuth()
  const [summary, setSummary] = useState<SongRatingSummary | null>(null)
  const [userRating, setUserRating] = useState<number | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const promptId = useId()

  const loadSummary = useCallback(async (): Promise<void> => {
    try {
      setSummary(await getSongRatingSummary(songId))
    } catch (error) {
      console.error('Error loading rating:', error)
      setSummary(EMPTY_SUMMARY)
    }
  }, [songId])

  useEffect(() => {
    void loadSummary()
  }, [loadSummary])

  useEffect(() => {
    if (user == null) {
      setUserRating(null)
      return
    }
    getUserSongRating(songId, user.uid)
      .then(setUserRating)
      .catch((error: unknown) => {
        console.error('Error loading user rating:', error)
      })
  }, [songId, user])

  const handleRate = async (rating: number): Promise<void> => {
    if (user == null || !isValidRating(rating) || rating === userRating) return
    const previous = userRating
    setUserRating(rating)
    setIsSaving(true)
    try {
      await rateSong(songId, user.uid, rating)
      await loadSummary()
      toast.success(t('saved', { count: rating }))
    } catch (error) {
      console.error('Error saving rating:', error)
      setUserRating(previous)
      toast.error(t('saveError'))
    } finally {
      setIsSaving(false)
    }
  }

  const handleRemove = async (): Promise<void> => {
    if (user == null || userRating == null) return
    const previous = userRating
    setUserRating(null)
    setIsSaving(true)
    try {
      await removeSongRating(songId, user.uid)
      await loadSummary()
    } catch (error) {
      console.error('Error removing rating:', error)
      setUserRating(previous)
      toast.error(t('saveError'))
    } finally {
      setIsSaving(false)
    }
  }

  const averageText =
    summary != null
      ? format.number(summary.average, {
          minimumFractionDigits: 1,
          maximumFractionDigits: 1
        })
      : ''

  return (
    <section
      aria-labelledby='song-rating'
      className='flex flex-col gap-5 rounded-2xl border bg-card p-4 sm:flex-col sm:items-center sm:justify-between sm:p-6 text-center'
    >
      {/* ── Media pública ── */}
      <div className='space-y-1'>
        <h2
          id='song-rating'
          className='inline-flex items-center gap-2 text-xl font-bold tracking-tight text-foreground md:text-2xl font-headline'
        >
          <Star aria-hidden='true' className='size-5 text-amber-400' />
          {t('title')}
        </h2>
        {summary == null ? (
          <Skeleton className='h-6 w-48' />
        ) : summary.total === 0 ? (
          <p className='text-sm text-muted-foreground'>{t('noRatings')}</p>
        ) : (
          <p className='flex flex-wrap items-center gap-x-2 gap-y-1'>
            <span className='text-2xl font-bold tabular-nums text-foreground'>
              {averageText}
            </span>
            <StarRatingDisplay
              value={summary.average}
              label={t('averageLabel', { average: averageText })}
            />
            <span className='text-sm text-muted-foreground'>
              {t('total', { count: summary.total })}
            </span>
          </p>
        )}
      </div>

      {/* ── Valoración del usuario ── */}
      <div className='flex flex-col items-center gap-1.5 text-center'>
        {!isLoaded ? (
          <Skeleton className='h-10 w-48' />
        ) : user != null ? (
          <>
            <p id={promptId} className='text-sm font-medium text-foreground'>
              {userRating == null
                ? t('ratePrompt')
                : t('yourRating', { count: userRating })}
            </p>
            <StarRatingInput
              value={userRating}
              onChange={(value) => void handleRate(value)}
              disabled={isSaving}
              labelledBy={promptId}
            />
            {userRating != null && (
              <button
                type='button'
                onClick={() => void handleRemove()}
                disabled={isSaving}
                className='text-xs font-medium text-destructive/50 underline-offset-4 hover:text-destructive hover:underline disabled:opacity-50'
              >
                {t('remove')}
              </button>
            )}
          </>
        ) : (
          <>
            <p className='text-sm text-muted-foreground'>{t('loginPrompt')}</p>
            <Link
              href='/login'
              className={buttonVariants({ size: 'sm', variant: 'outline' })}
            >
              {t('login')}
            </Link>
          </>
        )}
      </div>
    </section>
  )
}
