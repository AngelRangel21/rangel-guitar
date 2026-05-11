import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { useAuth } from '@/hooks/useAuth'

export function AvatarUser() {
  const { user } = useAuth()
  return (
    <Avatar className='w-8 h-8'>
      <AvatarFallback>
        {user?.avatar_url ?? user?.name?.charAt(0).toUpperCase()}
      </AvatarFallback>
    </Avatar>
  )
}
