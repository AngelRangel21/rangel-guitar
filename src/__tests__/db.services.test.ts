import { beforeEach, describe, expect, it, vi } from 'vitest'

/**
 * Builder encadenable que imita el query builder de Supabase: cada método
 * devuelve el mismo objeto y `await` resuelve con el resultado configurado.
 */
type Result = { data?: unknown; error?: unknown; count?: number | null }

const results: Result[] = []
const calls: Array<{ table: string; method: string; args: unknown[] }> = []

function createBuilder(table: string) {
  const builder: Record<string, unknown> = {}
  for (const method of [
    'select',
    'insert',
    'update',
    'delete',
    'eq',
    'in',
    'order',
    'limit',
    'single',
    'maybeSingle',
    'ilike'
  ]) {
    builder[method] = (...args: unknown[]) => {
      calls.push({ table, method, args })
      return builder
    }
  }
  // biome-ignore lint/suspicious/noThenProperty: imita un thenable de Supabase
  builder.then = (resolve: (value: Result) => unknown) =>
    resolve(results.shift() ?? { data: null, error: null })
  return builder
}

const mockRpc = vi.fn()

vi.mock('@/lib/supabase', () => ({
  supabase: {
    from: (table: string) => createBuilder(table),
    rpc: (...args: unknown[]) => mockRpc(...args)
  }
}))

const { toggleSongLike, hasLikedSong } = await import(
  '@/services/likes.service'
)
const { getSongComments, deleteSongComment } = await import(
  '@/services/comments.service'
)
const { updateSongRequestStatus } = await import(
  '@/services/song-requests.service'
)
const { getSongStats, setSongArtists } = await import('@/services/song.service')

beforeEach(() => {
  results.length = 0
  calls.length = 0
  mockRpc.mockReset()
})

describe('likes.service', () => {
  it('toggleSongLike llama al RPC con los parámetros correctos', async () => {
    mockRpc.mockResolvedValue({ data: { liked: true }, error: null })

    await expect(toggleSongLike('s1', 'u1')).resolves.toEqual({ liked: true })
    expect(mockRpc).toHaveBeenCalledWith('toggle_song_like', {
      p_song_id: 's1',
      p_user_id: 'u1'
    })
  })

  it('toggleSongLike propaga el error', async () => {
    const error = { message: 'fail' }
    mockRpc.mockResolvedValue({ data: null, error })

    await expect(toggleSongLike('s1', 'u1')).rejects.toBe(error)
  })

  it('hasLikedSong usa el conteo', async () => {
    results.push({ count: 1, error: null })
    await expect(hasLikedSong('s1', 'u1')).resolves.toBe(true)

    results.push({ count: 0, error: null })
    await expect(hasLikedSong('s1', 'u1')).resolves.toBe(false)
  })
})

describe('comments.service', () => {
  it('getSongComments usa el RPC y anida los datos del autor', async () => {
    mockRpc.mockResolvedValue({
      data: [
        {
          id: 'c1',
          song_id: 's1',
          user_id: 'u1',
          content: 'Hola',
          createdAt: '2026-01-01',
          updatedAt: '2026-01-01',
          isDeleted: false,
          user_name: 'Ana',
          user_avatar_url: null
        }
      ],
      error: null
    })

    const [comment] = await getSongComments('s1')

    expect(mockRpc).toHaveBeenCalledWith('get_song_comments', {
      p_song_id: 's1'
    })
    expect(comment.user).toEqual({ uid: 'u1', name: 'Ana', avatar_url: null })
    expect(comment).not.toHaveProperty('user_name')
  })

  it('getSongComments propaga el error', async () => {
    const error = { message: 'fail' }
    mockRpc.mockResolvedValue({ data: null, error })

    await expect(getSongComments('s1')).rejects.toBe(error)
  })

  it('deleteSongComment hace un borrado lógico', async () => {
    results.push({ error: null })

    await deleteSongComment('c1')

    const update = calls.find((c) => c.method === 'update')
    expect(update?.args[0]).toMatchObject({ isDeleted: true })
    expect(calls.some((c) => c.method === 'delete')).toBe(false)
  })
})

describe('song-requests.service', () => {
  it('no sobrescribe la nota del admin si no se indica', async () => {
    results.push({ error: null })

    await updateSongRequestStatus('r1', 'approved')

    const update = calls.find((c) => c.method === 'update')
    expect(update?.args[0]).toEqual({ status: 'approved' })
  })

  it('guarda la nota del admin cuando se indica', async () => {
    results.push({ error: null })

    await updateSongRequestStatus('r1', 'rejected', 'Ya existe')

    const update = calls.find((c) => c.method === 'update')
    expect(update?.args[0]).toEqual({
      status: 'rejected',
      adminNote: 'Ya existe'
    })
  })
})

describe('song.service', () => {
  it('getSongStats mapea el resultado del RPC', async () => {
    mockRpc.mockResolvedValue({
      data: [
        { like_count: 3, favorite_count: 2, comment_count: 1, visit_count: 9 }
      ],
      error: null
    })

    await expect(getSongStats('s1')).resolves.toEqual({
      likes: 3,
      favorites: 2,
      comments: 1,
      visits: 9
    })
    expect(mockRpc).toHaveBeenCalledWith('get_song_stats', { p_song_id: 's1' })
  })

  it('getSongStats devuelve ceros si no hay fila', async () => {
    mockRpc.mockResolvedValue({ data: [], error: null })

    await expect(getSongStats('s1')).resolves.toEqual({
      likes: 0,
      favorites: 0,
      comments: 0,
      visits: 0
    })
  })

  it('setSongArtists reemplaza los artistas sin duplicados', async () => {
    results.push({ error: null }, { error: null })

    await setSongArtists('s1', ['a1', 'a2', 'a1'])

    const insert = calls.find((c) => c.method === 'insert')
    expect(insert?.args[0]).toEqual([
      { song_id: 's1', artist_id: 'a1' },
      { song_id: 's1', artist_id: 'a2' }
    ])
  })
})
