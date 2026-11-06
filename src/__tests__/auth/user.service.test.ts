import { beforeEach, describe, expect, it, vi } from 'vitest'

const mocks = vi.hoisted(() => ({
  getById: vi.fn()
}))

vi.mock('@/auth/service/user.repository', () => ({
  UserRepository: {
    getById: mocks.getById
  }
}))

import { UserService } from '@/auth/service/user.service'

describe('UserService.buildProfile', () => {
  it('usa el nombre explícito cuando se pasa', () => {
    const profile = UserService.buildProfile(
      {
        id: 'user-1',
        email: 'ada@example.com',
        user_metadata: { full_name: 'Ada Lovelace' }
      } as never,
      'Nombre manual'
    )

    expect(profile).toEqual({
      uid: 'user-1',
      email: 'ada@example.com',
      name: 'Nombre manual',
      avatar_url: null,
      role: 'user'
    })
  })

  it('usa full_name de los metadatos', () => {
    const profile = UserService.buildProfile({
      id: 'user-1',
      email: 'ada@example.com',
      user_metadata: { full_name: 'Ada Lovelace' }
    } as never)

    expect(profile.name).toBe('Ada Lovelace')
  })

  it('usa name de los metadatos si no hay full_name', () => {
    const profile = UserService.buildProfile({
      id: 'user-1',
      email: 'ada@example.com',
      user_metadata: { name: 'Ada' }
    } as never)

    expect(profile.name).toBe('Ada')
  })

  it('usa la parte local del email como último recurso', () => {
    const profile = UserService.buildProfile({
      id: 'user-1',
      email: 'ada@example.com',
      user_metadata: {}
    } as never)

    expect(profile.name).toBe('ada')
  })

  it('usa Anonymous si no hay ningún nombre', () => {
    const profile = UserService.buildProfile({
      id: 'user-1',
      email: undefined,
      user_metadata: {}
    } as never)

    expect(profile.name).toBe('Anonymous')
    expect(profile.email).toBe('')
  })

  it('conserva el avatar de los metadatos', () => {
    const profile = UserService.buildProfile({
      id: 'user-1',
      email: 'ada@example.com',
      user_metadata: { avatar_url: 'https://example.com/avatar.png' }
    } as never)

    expect(profile.avatar_url).toBe('https://example.com/avatar.png')
  })
})

describe('UserService.getProfile', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('devuelve el perfil con el rol tipado', async () => {
    mocks.getById.mockResolvedValue({
      uid: 'user-1',
      email: 'ada@example.com',
      name: 'Ada Lovelace',
      avatar_url: null,
      role: 'admin',
      createdAt: null
    })

    const profile = await UserService.getProfile('user-1')

    expect(profile.role).toBe('admin')
    expect(mocks.getById).toHaveBeenCalledWith('user-1')
  })

  it('devuelve un perfil de respaldo cuando no existe (PGRST116)', async () => {
    mocks.getById.mockRejectedValue({ code: 'PGRST116' })

    const profile = await UserService.getProfile('user-1')

    expect(profile).toEqual({
      uid: 'user-1',
      email: '',
      name: 'user-1',
      avatar_url: null,
      role: 'user',
      createdAt: null
    })
  })

  it('propaga otros errores', async () => {
    const error = { code: '42P01', message: 'relation does not exist' }
    mocks.getById.mockRejectedValue(error)

    await expect(UserService.getProfile('user-1')).rejects.toBe(error)
  })
})
