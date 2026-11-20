import { Minus, Plus } from 'lucide-react'
import { useI18n } from '@/context/i18n-context'
import { MAX_TRANSPOSE } from '@/lib/chordpro'
import { Button } from './ui/button'

interface TransposeControlsProps {
  transposeAmount: number
  originalKey?: string | null
  currentKey?: string | null
  onUp: () => void
  onDown: () => void
  onReset: () => void
}

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

  const getTransposedKeyText = (): string => {
    if (currentKey) return currentKey
    if (transposeAmount === 0) return t('originalKey')
    const direction =
      transposeAmount > 0 ? `+${transposeAmount}` : transposeAmount
    return `${direction} ${t('semitones')}`
  }

  const stepsText =
    transposeAmount > 0
      ? t('semitonesUp', { count: transposeAmount })
      : t('semitonesDown', { count: Math.abs(transposeAmount) })

  return (
    <div>
      <h3 className='text-lg font-semibold mb-2 text-center'>
        {t('changeTone')}
      </h3>
      <div className='flex items-center justify-between gap-4'>
        <Button
          variant='outline'
          size='icon'
          onClick={onDown}
          disabled={transposeAmount <= -MAX_TRANSPOSE}
          aria-label={t('decreaseSemitone')}
        >
          <Minus className='h-4 w-4' />
        </Button>
        <span
          className='font-bold text-lg w-32 text-center flex-1 font-mono'
          aria-live='polite'
        >
          {getTransposedKeyText()}
        </span>
        <Button
          variant='outline'
          size='icon'
          onClick={onUp}
          disabled={transposeAmount >= MAX_TRANSPOSE}
          aria-label={t('increaseSemitone')}
        >
          <Plus className='h-4 w-4' />
        </Button>
      </div>

      {key && (
        <p className='mt-3 pt-3 border-t text-sm text-muted-foreground text-center'>
          {t('original')}:{' '}
          <span className='font-semibold text-foreground'>{key}</span>
          {transposeAmount !== 100 && (
            <>
              {' → '}
              {t('transposedKey')}:{' '}
              <span className='font-semibold text-foreground'>
                {currentKey}
              </span>{' '}
              ({stepsText})
            </>
          )}
        </p>
      )}

      <Button
        variant='ghost'
        size='sm'
        onClick={onReset}
        disabled={transposeAmount === 0}
        className='w-full mt-4'
      >
        {t('resetTone')}
      </Button>
    </div>
  )
}
