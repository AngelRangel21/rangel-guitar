'use client'

import { useCallback, useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { User } from '@supabase/supabase-js'

export interface SupabaseAuth {
  user: User | null
  loading: boolean
  error: Error | null
  refreshSession: () => Promise<void>
}

/**
 * Hook para manejar autenticación con Supabase
 * Escucha cambios de sesión y actualiza el estado del usuario sincronizando
 */

export function useSupabaseAuth (): SupabaseAuth {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  /**
   * Refresca la sesión del usuario
   */
  const refreshSession = useCallback(async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase.auth.refreshSession()
      if (error != null) {
        setError(error)
      }
      setUser(data.session?.user ?? null)
    } catch (error) {
      setError(error as Error)
      setUser(null)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    let mounted = true

    // 1️⃣ Cargar sesión inicial
    const initializeAuth = async () => {
      try {
        setLoading(true)
        const { data, error } = await supabase.auth.getSession()
        if (error != null) {
          setError(error)
          throw error
        }

        if (mounted) {
          setUser(data.session?.user ?? null)
          setLoading(false)
        }
      } catch (error) {
        setError(error as Error)
        setUser(null)
      } finally {
        setLoading(false)
      }
    }
    initializeAuth()

    // 2️⃣ Escuchar cambios de sesión (login, logout, refresh)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (mounted) {
          setUser(session?.user ?? null)
          setError(null)
          setLoading(false)
        }
      }
    )

    // 3️⃣ Cleanup al desmontar
    return () => {
      mounted = false
      subscription.unsubscribe()
    }
  }, [])

  return { user, loading, error, refreshSession }
}
