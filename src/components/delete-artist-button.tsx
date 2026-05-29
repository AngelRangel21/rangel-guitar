'use client'

import { Trash2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { toast } from 'sonner'
import { deleteArtistAction } from '@/app/[locale]/admin/artists/actions'
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
import { Button } from '@/components/ui/button'

export function DeleteArtistButton({
  artistId,
  artistName,
  imageUrl
}: {
  artistId: string
  artistName: string
  imageUrl: string | null
}) {
  const [isDeleting, setIsDeleting] = useState(false)
  const router = useRouter()

  async function handleDelete() {
    setIsDeleting(true)
    try {
      const formData = new FormData()
      formData.append('id', artistId)
      if (imageUrl) formData.append('image_url', imageUrl)
      await deleteArtistAction(formData)
      toast.success(`"${artistName}" ha sido eliminado.`)
      router.refresh()
    } catch (error) {
      console.error('Error al eliminar artista:', error)
      toast.error('Error al eliminar el artista.')
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant='destructive' size='icon' className='size-8'>
          <Trash2 className='size-4' />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Eliminar artista</AlertDialogTitle>
          <AlertDialogDescription>
            Esta acci&oacute;n no se puede deshacer. Se eliminar&aacute;
            permanentemente &quot;{artistName}&quot; y su imagen de la
            plataforma.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting}>Cancelar</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={isDeleting}
            className='bg-destructive text-destructive-foreground hover:bg-destructive/90'
          >
            {isDeleting ? 'Eliminando...' : 'Eliminar'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
