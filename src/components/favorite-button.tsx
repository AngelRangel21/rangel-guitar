import { useAuth } from "@/hooks/useAuth"
import { Button } from "./ui/button"
import { useAuthStore } from "@/stores/auth.store"
import { Song } from "@/lib/types"
import { useI18n } from "@/context/i18n-context"
import { Heart } from "lucide-react"

export function FavoriteButton ({ song }: { song: Song }) {
  const { isAuthenticated } = useAuth()
  const toggleFavorite = useAuthStore((s) => s.toggleFavorite)
  const favoriteIds = useAuthStore((s) => s.favoriteIds)
  const isFavorite = (songId: string) => favoriteIds.has(songId)
  const { t } = useI18n()

  return (
    <div>
      {isAuthenticated && (
        <Button
          variant='ghost'
          size='icon'
          onClick={() => toggleFavorite(song.id)}
          aria-label={
            isFavorite(song.id)
              ? t('removeFromFavorites')
              : t('addToFavorites')
          }
          className='rounded-full'
        >
          <Heart
            className={`h-6 w-6 transition-colors ${isFavorite(song.id)
                ? 'fill-red-500 text-red-500'
                : 'text-foreground/70'
              }`}
          />
        </Button>
      )}
    </div>
  )
}
