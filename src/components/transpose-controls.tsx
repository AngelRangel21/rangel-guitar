import { Minus, Plus } from 'lucide-react'
import { useI18n } from '@/context/i18n-context'
import { Button } from './ui/button'

interface TransposeControlsProps {
  transposeAmount: number
  onUp: () => void
  onDown: () => void
  onReset: () => void
}

export function TransposeControls({
  transposeAmount,
  onUp,
  onDown,
  onReset
}: TransposeControlsProps) {
  const { t } = useI18n()

  const getTransposedKeyText = (): string => {
    if (transposeAmount === 0) return t('originalKey')
    const direction =
      transposeAmount > 0 ? `+${transposeAmount}` : transposeAmount
    return `${direction} ${t('semitones')}`
  }

  return (
    <div>
      <h3 className='text-lg font-semibold mb-2 text-center'>
        {t('changeTone')}
      </h3>
      <div className='flex items-center justify-between gap-4'>
        <Button
          variant='ghost'
          size='icon'
          onClick={onDown}
          aria-label={t('decreaseSemitone')}
        >
          <Minus className='h-4 w-4' />
        </Button>
        <span
          className='font-bold text-lg w-32 text-center flex-1'
          aria-live='polite'
        >
          {getTransposedKeyText()}
        </span>
        <Button
          variant='ghost'
          size='icon'
          onClick={onUp}
          aria-label={t('increaseSemitone')}
        >
          <Plus className='h-4 w-4' />
        </Button>
      </div>

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
