import { describe, expect, it } from 'vitest'
import {
  getStarFill,
  isValidRating,
  STAR_VALUES
} from '@/components/song-rating/rating.utils'

describe('isValidRating', () => {
  it('acepta enteros de 1 a 5', () => {
    for (const value of [1, 2, 3, 4, 5]) expect(isValidRating(value)).toBe(true)
  })

  it('rechaza valores fuera de rango o decimales', () => {
    for (const value of [0, 6, -1, 2.5, Number.NaN]) {
      expect(isValidRating(value)).toBe(false)
    }
  })
})

describe('getStarFill', () => {
  it('rellena estrellas completas, parciales y vacías', () => {
    expect(STAR_VALUES.map((star) => getStarFill(3.4, star))).toEqual([
      1,
      1,
      1,
      expect.closeTo(0.4),
      0
    ])
  })

  it('sin valoraciones deja todas vacías', () => {
    expect(STAR_VALUES.map((star) => getStarFill(0, star))).toEqual([
      0, 0, 0, 0, 0
    ])
  })

  it('con 5 rellena todas', () => {
    expect(STAR_VALUES.every((star) => getStarFill(5, star) === 1)).toBe(true)
  })
})
