'use client'

import { MessageCircle, MessageSquareText } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { type JSX, useCallback, useEffect, useState } from 'react'
import { toast } from 'sonner'
import { Button, buttonVariants } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { useAuth } from '@/hooks/useAuth'
import { Link } from '@/i18n/navigation'
import {
  addSongComment,
  deleteSongComment,
  deleteSongCommentPermanently,
  getSongComments,
  updateSongComment
} from '@/services/comments.service'
import type { SongComment } from '@/types/app.types'
import { CommentForm } from './comment-form'
import { CommentItem } from './comment-item'

type LoadStatus = 'loading' | 'ready' | 'error'

/** Sección de comentarios de una canción: lista, publicar, editar y borrar. */
export function SongComments({ songId }: { songId: string }): JSX.Element {
  const t = useTranslations('songComments')
  const { user, isAdmin, isLoaded } = useAuth()
  const [comments, setComments] = useState<SongComment[]>([])
  const [status, setStatus] = useState<LoadStatus>('loading')

  const loadComments = useCallback(async (): Promise<void> => {
    setStatus('loading')
    try {
      setComments(await getSongComments(songId))
      setStatus('ready')
    } catch (error) {
      console.error('Error loading comments:', error)
      setStatus('error')
    }
  }, [songId])

  useEffect(() => {
    void loadComments()
  }, [loadComments])

  const handleCreate = async (content: string): Promise<void> => {
    if (user == null) return
    try {
      const created = await addSongComment(songId, user.uid, content)
      setComments((current) => [
        ...current,
        {
          ...created,
          user: { uid: user.uid, name: user.name, avatar_url: user.avatar_url }
        }
      ])
    } catch (error) {
      console.error('Error adding comment:', error)
      toast.error(t('addError'))
      throw error
    }
  }

  const handleUpdate = async (id: string, content: string): Promise<void> => {
    try {
      const updated = await updateSongComment(id, content)
      setComments((current) =>
        current.map((comment) =>
          comment.id === id
            ? {
                ...comment,
                content: updated.content,
                updatedAt: updated.updatedAt
              }
            : comment
        )
      )
    } catch (error) {
      console.error('Error updating comment:', error)
      toast.error(t('updateError'))
      throw error
    }
  }

  const handleDelete = async (comment: SongComment): Promise<void> => {
    try {
      // El autor lo oculta (borrado lógico); un admin lo elimina del todo.
      if (comment.user_id === user?.uid) {
        await deleteSongComment(comment.id)
      } else {
        await deleteSongCommentPermanently(comment.id)
      }
      setComments((current) => current.filter((c) => c.id !== comment.id))
      toast.success(t('deleted'))
    } catch (error) {
      console.error('Error deleting comment:', error)
      toast.error(t('deleteError'))
    }
  }

  return (
    <section
      aria-labelledby='song-comments'
      className='space-y-5 rounded-2xl border bg-card p-4 sm:p-6'
    >
      <header className='flex flex-wrap items-baseline justify-between gap-2'>
        <h2
          id='song-comments'
          className='inline-flex items-center gap-2 text-xl font-bold tracking-tight text-foreground md:text-2xl font-headline'
        >
          <MessageCircle aria-hidden='true' className='size-5 text-primary' />
          {t('title')}
        </h2>
        {status === 'ready' && (
          <p className='text-sm text-muted-foreground'>
            {t('count', { count: comments.length })}
          </p>
        )}
      </header>

      {/* ── Formulario o invitación a entrar ── */}
      {!isLoaded ? (
        <Skeleton className='h-32 w-full rounded-xl' />
      ) : user != null ? (
        <CommentForm
          onSubmit={handleCreate}
          submitLabel={t('submit')}
          pendingLabel={t('sending')}
          resetOnSuccess
        />
      ) : (
        <div className='flex flex-col items-start gap-3 rounded-xl border border-dashed bg-muted/30 p-4 sm:flex-row sm:items-center sm:justify-between'>
          <p className='text-sm text-muted-foreground'>{t('loginPrompt')}</p>
          <div className='flex gap-2'>
            <Link href='/login' className={buttonVariants({ size: 'sm' })}>
              {t('login')}
            </Link>
            <Link
              href='/register'
              className={buttonVariants({ size: 'sm', variant: 'outline' })}
            >
              {t('register')}
            </Link>
          </div>
        </div>
      )}

      {/* ── Lista ── */}
      {status === 'loading' && (
        <ul className='space-y-5' aria-busy='true'>
          {['a', 'b'].map((key) => (
            <li key={key} className='flex gap-3'>
              <Skeleton className='size-8 shrink-0 rounded-full' />
              <div className='flex-1 space-y-2'>
                <Skeleton className='h-3.5 w-32' />
                <Skeleton className='h-3.5 w-full' />
                <Skeleton className='h-3.5 w-2/3' />
              </div>
            </li>
          ))}
        </ul>
      )}

      {status === 'error' && (
        <div className='flex flex-col items-center gap-3 py-6 text-center'>
          <p className='text-sm text-muted-foreground'>{t('loadError')}</p>
          <Button
            size='sm'
            variant='outline'
            onClick={() => void loadComments()}
          >
            {t('retry')}
          </Button>
        </div>
      )}

      {status === 'ready' && comments.length === 0 && (
        <div className='flex flex-col items-center gap-2 py-6 text-center'>
          <MessageSquareText
            aria-hidden='true'
            className='size-8 text-muted-foreground/60'
          />
          <p className='font-medium text-foreground'>{t('emptyTitle')}</p>
          <p className='max-w-sm text-sm text-muted-foreground'>
            {t('emptyDescription')}
          </p>
        </div>
      )}

      {status === 'ready' && comments.length > 0 && (
        <ol className='space-y-5 border-t pt-5'>
          {comments.map((comment) => {
            const isOwn = user != null && comment.user_id === user.uid
            return (
              <li key={comment.id}>
                <CommentItem
                  comment={comment}
                  isOwn={isOwn}
                  canDelete={isOwn || isAdmin}
                  onUpdate={handleUpdate}
                  onDelete={handleDelete}
                />
              </li>
            )
          })}
        </ol>
      )}
    </section>
  )
}
