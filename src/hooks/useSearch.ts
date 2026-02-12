'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { SearchService } from '@/services/search.service'
import { Song, SearchState } from '@/lib/types'

const DEBOUNCE_MS = 500

export function useSearch() {
  const [state, setState] = useState<SearchState>({
    query: '',
    results: [],
    isLoading: false,
    error: null,
    hasSearched: false,
  })

  // Ref para cancelar debounce anterior
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  // Ref para cancelar fetch desactualizado (evita race conditions)
  const abortRef = useRef<AbortController | null>(null)

  const search = useCallback(async (query: string) => {
    // Cancelar debounce anterior
    if (debounceRef.current) clearTimeout(debounceRef.current)

    setState(prev => ({ ...prev, query }))

    // Query vacía o muy corta: limpiar resultados sin buscar
    if (query.trim().length < 2) {
      setState(prev => ({
        ...prev,
        results: [],
        isLoading: false,
        error: null,
        hasSearched: false,
      }))
      return
    }

    setState(prev => ({ ...prev, isLoading: true, error: null }))

    debounceRef.current = setTimeout(async () => {
      // Cancelar petición anterior si existe
      if (abortRef.current) abortRef.current.abort()
      abortRef.current = new AbortController()

      try {
        const { songs } = await SearchService.search(query)

        setState(prev => ({
          ...prev,
          results: songs,
          isLoading: false,
          hasSearched: true,
          error: null,
        }))
      } catch (err) {
        // Ignorar errores de abort (búsqueda cancelada)
        if (err instanceof Error && err.name === 'AbortError') return

        setState(prev => ({
          ...prev,
          results: [],
          isLoading: false,
          hasSearched: true,
          error: 'Error al buscar. Intenta de nuevo.',
        }))
      }
    }, DEBOUNCE_MS)
  }, [])

  const searchImmediate = useCallback(async (query: string) => {
    if (query.trim().length < 2) return

    setState(prev => ({ ...prev, isLoading: true, error: null }))

    try {
      const { songs } = await SearchService.search(query)

      setState(prev => ({
        ...prev,
        results: songs,
        isLoading: false,
        hasSearched: true,
        error: null,
      }))
    } catch {
      setState(prev => ({
        ...prev,
        results: [],
        isLoading: false,
        hasSearched: true,
        error: 'Error al buscar. Intenta de nuevo.',
      }))
    }
  }, [])

  const clear = useCallback(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current)
    setState({
      query: '',
      results: [],
      isLoading: false,
      error: null,
      hasSearched: false,
    })
  }, [])

  // Cleanup al desmontar
  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current)
      if (abortRef.current) abortRef.current.abort()
    }
  }, [])

  return {
    ...state,
    search,
    searchImmediate,
    clear,
  }
}
