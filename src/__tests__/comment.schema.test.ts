import { describe, expect, it } from 'vitest'
import {
  COMMENT_MAX_LENGTH,
  getInitials,
  isEditedComment,
  isValidComment
} from '@/components/song-comments/comment.schema'

describe('isValidComment', () => {
  it('rechaza texto vacío o solo espacios', () => {
    expect(isValidComment('')).toBe(false)
    expect(isValidComment('   \n ')).toBe(false)
  })

  it('acepta texto normal', () => {
    expect(isValidComment('¡Gran cifra!')).toBe(true)
  })

  it('respeta el límite de caracteres tras recortar espacios', () => {
    expect(isValidComment('a'.repeat(COMMENT_MAX_LENGTH))).toBe(true)
    expect(isValidComment(`  ${'a'.repeat(COMMENT_MAX_LENGTH)}  `)).toBe(true)
    expect(isValidComment('a'.repeat(COMMENT_MAX_LENGTH + 1))).toBe(false)
  })
})

describe('isEditedComment', () => {
  it('ignora diferencias de hasta 1 segundo', () => {
    expect(
      isEditedComment('2026-01-01T10:00:00.000Z', '2026-01-01T10:00:00.800Z')
    ).toBe(false)
  })

  it('detecta una edición posterior', () => {
    expect(
      isEditedComment('2026-01-01T10:00:00.000Z', '2026-01-01T10:05:00.000Z')
    ).toBe(true)
  })
})

describe('getInitials', () => {
  it('usa hasta dos palabras', () => {
    expect(getInitials('ana maría lópez')).toBe('AM')
    expect(getInitials('Rangel')).toBe('R')
  })

  it('devuelve ? sin nombre', () => {
    expect(getInitials(null)).toBe('?')
    expect(getInitials('   ')).toBe('?')
  })
})
