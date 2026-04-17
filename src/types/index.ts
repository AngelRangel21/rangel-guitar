/**
 * Barrel de tipos — importa desde aquí en toda la app.
 *
 * import type { Song, UserProfile, SongRequest } from "@/types"
 */

export type {
  DbSongComment,
  DbSongFavorite,
  DbSongLike,
  DbSongRequest,
  DbSongVisit,
  DbSongWithCounts,
  // Database raw types
  DbUser,
  NewSongComment,
  NewSongRequest,
  // Search
  SearchResult,
  SearchState,
  // App domain types
  Song,
  SongComment,
  SongRequest,
  SongRequestStatus,
  ToggleFavoriteResult,
  ToggleLikeResult,
  UserProfile
} from './app.types'

export {
  // Mappers
  mapDbSongWithCounts
} from './app.types'

export type {
  // Auth
  AuthCredentials,
  AuthState,
  FavoritesState,
  UseAuthReturn,
  UseAuthStatusReturn,
  UseFavoritesReturn,
  UseSongRequestsReturn,
  UseUserReturn
} from './auth.types'

export type {
  // Database schema (usar solo en lib/supabase o services)
  Database,
  Enums,
  Json,
  Tables,
  TablesInsert,
  TablesUpdate
} from './database.types'
