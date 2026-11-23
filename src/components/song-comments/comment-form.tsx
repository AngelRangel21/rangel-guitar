'use client'

import { useTranslations } from 'next-intl'
import {
  type FormEvent,
  type JSX,
  type KeyboardEvent,
  useId,
  useState
} from 'react'
import { Button } from '@/components/ui/button'
import { Spinner } from '@/components/ui/spinner'
import { Textarea } from '@/components/ui/textarea'
import { cn } from '@/lib/utils'
import { COMMENT_MAX_LENGTH, isValidComment } from './comment.schema'

interface CommentFormProps {
  /** Publica o guarda el texto. Si lanza un error, el texto se conserva. */
  onSubmit: (content: string) => Promise<void>
  onCancel?: () => void
  initialValue?: string
  submitLabel: string
  pendingLabel: string
  /** Vacía el campo tras enviar (comentario nuevo). */
  resetOnSuccess?: boolean
  autoFocus?: boolean
}

/** Campo de texto para escribir o editar un comentario. */
export function CommentForm({
  onSubmit,
  onCancel,
  initialValue = '',
  submitLabel,
  pendingLabel,
  resetOnSuccess = false,
  autoFocus = false
}: CommentFormProps): JSX.Element {
  const t = useTranslations('songComments')
  const textareaId = useId()
  const hintId = useId()
  const [content, setContent] = useState(initialValue)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const length = content.trim().length
  const isUnchanged = content.trim() === initialValue.trim()
  const canSubmit = isValidComment(content) && !isUnchanged && !isSubmitting
  const isNearLimit = length > COMMENT_MAX_LENGTH * 0.9

  const submit = async (): Promise<void> => {
    if (!canSubmit) return
    setIsSubmitting(true)
    try {
      await onSubmit(content.trim())
      if (resetOnSuccess) setContent('')
    } catch {
      // El componente padre muestra el error; se conserva el texto.
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault()
    void submit()
  }

  const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>): void => {
    if (event.key === 'Enter' && (event.ctrlKey || event.metaKey)) {
      event.preventDefault()
      void submit()
    }
    if (event.key === 'Escape' && onCancel != null) {
      event.preventDefault()
      onCancel()
    }
  }

  return (
    <form onSubmit={handleSubmit} className='space-y-2'>
      <label htmlFor={textareaId} className='sr-only'>
        {t('label')}
      </label>
      <Textarea
        id={textareaId}
        value={content}
        onChange={(event) => setContent(event.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={t('placeholder')}
        maxLength={COMMENT_MAX_LENGTH}
        rows={3}
        disabled={isSubmitting}
        autoFocus={autoFocus}
        aria-describedby={hintId}
        className='min-h-24 bg-background'
      />
      <div className='flex flex-wrap items-center justify-between gap-2'>
        <p id={hintId} className='text-xs text-muted-foreground'>
          <span className='hidden sm:inline'>{t('shortcut')} · </span>
          <span
            className={cn('tabular-nums', isNearLimit && 'text-destructive')}
          >
            {t('counter', { count: length, max: COMMENT_MAX_LENGTH })}
          </span>
        </p>
        <div className='flex items-center gap-2'>
          {onCancel != null && (
            <Button
              type='button'
              variant='ghost'
              size='sm'
              onClick={onCancel}
              disabled={isSubmitting}
            >
              {t('cancel')}
            </Button>
          )}
          <Button type='submit' size='sm' disabled={!canSubmit}>
            {isSubmitting && <Spinner />}
            {isSubmitting ? pendingLabel : submitLabel}
          </Button>
        </div>
      </div>
    </form>
  )
}
