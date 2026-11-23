import { Minus, Plus, RotateCcw } from 'lucide-react'
import { useI18n } from '@/context/i18n-context'
import { MAX_TRANSPOSE } from '@/lib/chordpro'

interface TransposeControlsProps {
  transposeAmount: number
  originalKey?: string | null
  currentKey?: string | null
  onUp: () => void
  onDown: () => void
  onReset: () => void
}

const stepButtonClass =
  'inline-flex size-11 shrink-0 items-center justify-center rounded-xl bg-background text-foreground shadow-sm ring-1 ring-border transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-40'

export function TransposeControls({
  transposeAmount,
  originalKey,
  currentKey,
  onUp,
  onDown,
  onReset
}: TransposeControlsProps) {
  const { t } = useI18n()
  const key = originalKey?.trim() || null
  const isTransposed = transposeAmount !== 0

  const mainText = (() => {
    if (currentKey) return currentKey
    if (!isTransposed) return t('originalKey')
    const direction =
      transposeAmount > 0 ? `+${transposeAmount}` : transposeAmount
    return `${direction} ${t('semitones')}`
  })()

  const stepsText =
    transposeAmount > 0
      ? t('semitonesUp', { count: transposeAmount })
      : t('semitonesDown', { count: Math.abs(transposeAmount) })

  return (
    <div className='space-y-3'>
      <div className='flex items-center justify-between'>
        <h3 className='text-sm font-semibold text-foreground'>
          {t('changeTone')}
        </h3>
        <button
          type='button'
          onClick={onReset}
          disabled={!isTransposed}
          className='inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground disabled:pointer-events-none disabled:opacity-40'
        >
          <RotateCcw aria-hidden='true' className='size-3.5' />
          {t('resetTone')}
        </button>
      </div>

      <div className='flex items-center gap-2 rounded-2xl bg-muted/60 p-1.5'>
        <button
          type='button'
          onClick={onDown}
          disabled={transposeAmount <= -MAX_TRANSPOSE}
          aria-label={t('decreaseSemitone')}
          className={stepButtonClass}
        >
          <Minus aria-hidden='true' className='size-4' />
        </button>

        <div className='flex min-w-0 flex-1 flex-col items-center'>
          <span
            className='truncate text-xl font-bold tabular-nums text-foreground'
            aria-live='polite'
          >
            {mainText}
          </span>
          <span className='truncate text-xs text-muted-foreground'>
            {isTransposed
              ? stepsText
              : key != null
                ? `${t('original')}: ${key}`
                : t('originalKey')}
          </span>
        </div>

        <button
          type='button'
          onClick={onUp}
          disabled={transposeAmount >= MAX_TRANSPOSE}
          aria-label={t('increaseSemitone')}
          className={stepButtonClass}
        >
          <Plus aria-hidden='true' className='size-4' />
        </button>
      </div>

      {key != null && isTransposed && (
        <p className='text-center text-xs text-muted-foreground'>
          {t('original')}:{' '}
          <span className='font-semibold text-foreground'>{key}</span>
          {' → '}
          {t('transposedKey')}:{' '}
          <span className='font-semibold text-foreground'>{currentKey}</span>
        </p>
      )}
    </div>
  )
}
