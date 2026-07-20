import { beforeEach, describe, expect, it, vi } from 'vitest'
import type { NewSongData } from '@/services/song.service'

const mockInsert = vi.fn()

vi.mock('@/lib/supabase', () => ({
  supabase: {
    from: vi.fn(() => ({
      insert: mockInsert
    }))
  }
}))

const { addSong } = await import('@/services/song.service')

const validSongData: NewSongData = {
  title: 'Test Song',
  artist_id: 'artist-1',
  slug: 'test-song',
  lyrics: 'Some lyrics',
  chords: 'Am G F',
  video: null,
  coverArt: 'https://example.com/cover.jpg'
}

describe('addSong (service)', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('calls insert with the correct song data', async () => {
    mockInsert.mockResolvedValue({ error: null })

    await addSong(validSongData)

    expect(mockInsert).toHaveBeenCalledOnce()
    expect(mockInsert).toHaveBeenCalledWith({ ...validSongData })
  })

  it('returns void on success', async () => {
    mockInsert.mockResolvedValue({ error: null })

    const result = await addSong(validSongData)

    expect(result).toBeUndefined()
  })

  it('throws when Supabase returns an error', async () => {
    const supabaseError = { message: 'Insert failed', code: '23505' }
    mockInsert.mockResolvedValue({ error: supabaseError })

    await expect(addSong(validSongData)).rejects.toEqual(supabaseError)
  })
})
