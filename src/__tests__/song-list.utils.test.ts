import { describe, expect, it } from 'vitest'
import {
  getMiddlePages,
  getTotalPages,
  sortSongs
} from '@/components/song-list/song-list.utils'
import type { SongWithArtist } from '@/types/app.types'

const song = (id: string, title: string | null) =>
  ({ id, title, artists: [] }) as unknown as SongWithArtist

describe('sortSongs', () => {
  const songs = [song('1', 'zeta'), song('2', 'Álamo'), song('3', null)]

  it('mantiene el orden original con "recent"', () => {
    expect(sortSongs(songs, 'recent')).toBe(songs)
  })

  it('ordena alfabéticamente sin mutar el original', () => {
    const sorted = sortSongs(songs, 'alphabetical')
    expect(sorted.map((s) => s.id)).toEqual(['3', '2', '1'])
    expect(songs.map((s) => s.id)).toEqual(['1', '2', '3'])
  })
})

describe('getTotalPages', () => {
  it('devuelve al menos 1 página', () => {
    expect(getTotalPages(0)).toBe(1)
  })

  it('redondea hacia arriba', () => {
    expect(getTotalPages(17, 16)).toBe(2)
    expect(getTotalPages(32, 16)).toBe(2)
  })
})

describe('getMiddlePages', () => {
  it('no hay páginas intermedias con 1 o 2 páginas', () => {
    expect(getMiddlePages(1, 1)).toEqual([])
    expect(getMiddlePages(1, 2)).toEqual([])
  })

  it('muestra las primeras al inicio', () => {
    expect(getMiddlePages(1, 10)).toEqual([2, 3])
  })

  it('centra la página actual en medio', () => {
    expect(getMiddlePages(5, 10)).toEqual([4, 5, 6])
  })

  it('muestra las últimas al final', () => {
    expect(getMiddlePages(10, 10)).toEqual([7, 8, 9])
  })
})
