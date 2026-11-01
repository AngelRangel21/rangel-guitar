import { describe, expect, it } from 'vitest'
import {
  MAX_QUERY_LENGTH,
  normalizeQuery,
  sanitizeTerm
} from '@/components/searching/search.utils'

describe('normalizeQuery', () => {
  it('recorta espacios sobrantes', () => {
    expect(normalizeQuery('  noche  ')).toBe('noche')
  })

  it('descarta términos de un solo carácter', () => {
    expect(normalizeQuery('a')).toBe('')
    expect(normalizeQuery('  a  ')).toBe('')
  })

  it('acepta términos de dos caracteres', () => {
    expect(normalizeQuery('ab')).toBe('ab')
  })

  it('trata null y undefined como vacío', () => {
    expect(normalizeQuery(null)).toBe('')
    expect(normalizeQuery(undefined)).toBe('')
  })

  it('trunca términos más largos que el máximo', () => {
    const long = 'x'.repeat(MAX_QUERY_LENGTH + 50)
    expect(normalizeQuery(long)).toHaveLength(MAX_QUERY_LENGTH)
  })

  it('conserva acentos y espacios internos', () => {
    expect(normalizeQuery('  José José  ')).toBe('José José')
  })
})

describe('sanitizeTerm', () => {
  it('elimina comas y paréntesis que rompen el filtro de PostgREST', () => {
    const result = sanitizeTerm('rock,pop(id)')
    expect(result).not.toContain(',')
    expect(result).not.toContain('(')
    expect(result).not.toContain(')')
  })

  it('elimina comodines de like', () => {
    expect(sanitizeTerm('%_')).toBe('')
    expect(sanitizeTerm('50% rock')).toBe('50 rock')
  })

  it('elimina comillas y backslashes', () => {
    expect(sanitizeTerm(`a"b'c\\d`)).toBe('a b c d')
  })

  it('colapsa espacios y recorta los extremos', () => {
    expect(sanitizeTerm('  rock   pop  ')).toBe('rock pop')
  })

  it('no altera un término normal', () => {
    expect(sanitizeTerm('José José')).toBe('José José')
  })

  it('trunca términos más largos que el máximo', () => {
    const long = 'y'.repeat(MAX_QUERY_LENGTH + 50)
    expect(sanitizeTerm(long)).toHaveLength(MAX_QUERY_LENGTH)
  })
})
