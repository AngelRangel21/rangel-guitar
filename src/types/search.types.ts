export interface SearchSong {
  id: string
  slug: string
  title: string
  artist: string
  coverArt: string | null
}

export interface SearchResult {
  songs: SearchSong[]
  total: number
}

export interface SearchState {
  query: string
  results: SearchSong[]
  isLoading: boolean
  error: string | null
  hasSearched: boolean
}
