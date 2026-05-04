import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { useAuth } from '@/hooks/useAuth'

export function AvatarUser() {
  const { user } = useAuth()
  return (
    <Avatar className='w-8 h-8'>
      <AvatarFallback>
        {user?.avatarUrl ?? user?.name?.charAt(0).toUpperCase()}
      </AvatarFallback>
    </Avatar>
  )
}
