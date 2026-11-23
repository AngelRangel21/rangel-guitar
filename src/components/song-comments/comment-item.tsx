'use client'

import { Pencil, Trash2 } from 'lucide-react'
import { useFormatter, useNow, useTranslations } from 'next-intl'
import { type JSX, useState } from 'react'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from '@/components/ui/alert-dialog'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import type { SongComment } from '@/types/app.types'
import { getInitials, isEditedComment } from './comment.schema'
import { CommentForm } from './comment-form'

interface CommentItemProps {
  comment: SongComment
  isOwn: boolean
  canDelete: boolean
  onUpdate: (id: string, content: string) => Promise<void>
  onDelete: (comment: SongComment) => Promise<void>
}

const actionClass =
  'inline-flex items-center gap-1 rounded-md px-1.5 py-1 text-xs font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring'

/** Un comentario con su autor, fecha y acciones de edición/borrado. */
export function CommentItem({
  comment,
  isOwn,
  canDelete,
  onUpdate,
  onDelete
}: CommentItemProps): JSX.Element {
  const t = useTranslations('songComments')
  const format = useFormatter()
  const now = useNow({ updateInterval: 60_000 })
  const [isEditing, setIsEditing] = useState(false)

  const name = comment.user?.name ?? t('anonymous')
  const createdAt = new Date(comment.createdAt)
  const edited = isEditedComment(comment.createdAt, comment.updatedAt)

  return (
    <article className='flex gap-3'>
      <Avatar className='mt-0.5'>
        {comment.user?.avatar_url != null && (
          <AvatarImage src={comment.user.avatar_url} alt='' />
        )}
        <AvatarFallback className='text-xs font-semibold'>
          {getInitials(comment.user?.name)}
        </AvatarFallback>
      </Avatar>

      <div className='min-w-0 flex-1 space-y-1'>
        <header className='flex flex-wrap items-baseline gap-x-2 gap-y-0.5'>
          <h3 className='text-sm font-semibold text-foreground'>{name}</h3>
          {isOwn && (
            <span className='rounded-full bg-primary/10 px-2 py-0.5 text-[11px] font-medium text-primary'>
              {t('you')}
            </span>
          )}
          <time
            dateTime={comment.createdAt}
            title={format.dateTime(createdAt, {
              dateStyle: 'long',
              timeStyle: 'short'
            })}
            className='text-xs text-muted-foreground'
          >
            {format.relativeTime(createdAt, now)}
          </time>
          {edited && (
            <span className='text-xs text-muted-foreground'>
              · {t('edited')}
            </span>
          )}
        </header>

        {isEditing ? (
          <CommentForm
            initialValue={comment.content}
            submitLabel={t('save')}
            pendingLabel={t('saving')}
            autoFocus
            onCancel={() => setIsEditing(false)}
            onSubmit={async (content) => {
              await onUpdate(comment.id, content)
              setIsEditing(false)
            }}
          />
        ) : (
          <p className='whitespace-pre-wrap wrap-break-word text-sm leading-relaxed text-foreground/90'>
            {comment.content}
          </p>
        )}

        {!isEditing && (isOwn || canDelete) && (
          <div className='-ml-1.5 flex items-center gap-1 pt-0.5'>
            {isOwn && (
              <button
                type='button'
                onClick={() => setIsEditing(true)}
                className={actionClass}
              >
                <Pencil aria-hidden='true' className='size-3.5' />
                {t('edit')}
              </button>
            )}
            {canDelete && (
              <AlertDialog>
                <AlertDialogTrigger
                  render={
                    <button
                      type='button'
                      className={`${actionClass} hover:text-destructive`}
                    />
                  }
                >
                  <Trash2 aria-hidden='true' className='size-3.5' />
                  {t('delete')}
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      {t('deleteConfirmTitle')}
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      {t('deleteConfirmDescription')}
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>{t('cancel')}</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={() => void onDelete(comment)}
                      className='bg-destructive text-white hover:bg-destructive/90'
                    >
                      {t('delete')}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
          </div>
        )}
      </div>
    </article>
  )
}
