/**
 * Barrel de tipos — importa desde aquí en toda la app.
 *
 * import type { Song, UserProfile, SongRequest } from "@/types"
 */

export type {
  // Database raw types
  DbUser,
  DbSong,
  DbSongWithCounts,
  DbSongLike,
  DbSongFavorite,
  DbSongVisit,
  DbSongComment,
  DbSongRequest,
  // App domain types
  Song,
  UserProfile,
  SongRequest,
  SongRequestStatus,
  NewSongRequest,
  SongComment,
  NewSongComment,
  ToggleLikeResult,
  ToggleFavoriteResult,
  // Search
  SearchResult,
  SearchState,
} from "./app.types"

export {
  // Mappers
  mapDbSongWithCounts,
} from "./app.types"

export type {
  // Auth
  AuthCredentials,
  AuthState,
  FavoritesState,
  UseAuthReturn,
  UseAuthStatusReturn,
  UseUserReturn,
  UseFavoritesReturn,
  UseSongRequestsReturn,
} from "./auth.types"

export type {
  // Database schema (usar solo en lib/supabase o services)
  Database,
  Tables,
  TablesInsert,
  TablesUpdate,
  Enums,
  Json,
} from "./database.types"
