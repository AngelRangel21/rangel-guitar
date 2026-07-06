import { User } from 'lucide-react'
import Image from 'next/image'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { useAuth } from '@/hooks/useAuth'
import { getUserImage } from '@/services/users.service'

export function AvatarUser() {
  const { user } = useAuth()
  const imageUrl = user?.avatar_url ? getUserImage(user.avatar_url) : ''
  return (
    <Avatar className='w-8 h-8'>
      <AvatarFallback>
        <div className='relative'>
          {/* Imagen del usuario. */}
          {imageUrl !== '' ? (
            <Image
              src={imageUrl}
              alt={`Foto de ${user?.name || 'Usuario'}`}
              width={48}
              height={48}
              className='aspect-square object-cover w-full transition-transform duration-300 group-hover:scale-105'
              data-ai-hint='user avatar'
              priority={false}
              loading='lazy'
              unoptimized
            />
          ) : (
            <User className='h-6 w-6 text-muted-foreground' />
          )}
        </div>
      </AvatarFallback>
    </Avatar>
  )
}
