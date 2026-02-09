import { updateLikeCount } from '@/lib/client/songs'
import { revalidateAfterLike } from '@/app/favorites/actions'

/**
 * Servicio de favoritos
 * Maneja la persistencia en localStorage y sincronización con backend
 */
export class FavoritesService {
  private static readonly STORAGE_PREFIX = 'favorites_'

  /**
   * Obtener favoritos del localStorage
   */
  static getFavorites (userId: string): string[] {
    if (typeof window === 'undefined') return []

    try {
      const stored = localStorage.getItem(`${this.STORAGE_PREFIX}${userId}`)
      return stored ? JSON.parse(stored) : []
    } catch (error) {
      console.error('Error loading favorites from localStorage:', error)
      return []
    }
  }

  /**
   * Guardar favoritos en localStorage
   */
  static saveFavorites (userId: string, favorites: string[]): void {
    if (typeof window === 'undefined') return

    try {
      localStorage.setItem(
        `${this.STORAGE_PREFIX}${userId}`,
        JSON.stringify(favorites)
      )
    } catch (error) {
      console.error('Error saving favorites to localStorage:', error)
    }
  }

  /**
   * Agregar o quitar favorito
   */
  static async toggleFavorite (
    userId: string,
    songId: string,
    songSlug: string,
    currentFavorites: string[]
  ): Promise<{ newFavorites: string[], wasAdded: boolean }> {
    const isFavorite = currentFavorites.includes(songId)
    const delta = isFavorite ? -1 : 1

    const newFavorites = isFavorite
      ? currentFavorites.filter((id) => id !== songId)
      : [...currentFavorites, songId]

    // Guardar optimísticamente
    this.saveFavorites(userId, newFavorites)

    try {
      // Actualizar en backend
      await Promise.all([
        updateLikeCount(songId, delta),
        revalidateAfterLike(songSlug)
      ])

      return { newFavorites, wasAdded: !isFavorite }
    } catch (error) {
      // Revertir en caso de error
      this.saveFavorites(userId, currentFavorites)
      throw error
    }
  }

  /**
   * Verificar si una canción es favorita
   */
  static isFavorite (songId: string, favorites: string[]): boolean {
    return favorites.includes(songId)
  }

  /**
   * Limpiar favoritos de un usuario
   */
  static clearFavorites (userId: string): void {
    if (typeof window === 'undefined') return
    localStorage.removeItem(`${this.STORAGE_PREFIX}${userId}`)
  }
}
