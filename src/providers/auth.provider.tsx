'use client'

import { JSX, useEffect } from 'react'
import { useAuthStore } from '@/stores/auth.store'
import { useSupabaseAuth } from '@/hooks/useSupabaseAuth'

/**
 * Provider que sincroniza el estado de Supabase con Zustand
 * Este es el único lugar donde se conecta useSupabaseAuth con el store
 */
export function AuthProvider ({ children }: { children: React.ReactNode }): JSX.Element {
  const { user: supabaseUser, loading } = useSupabaseAuth()
  const { setSupabaseUser, setLoading, setInitialized } = useAuthStore()

  // Sincronizar supabaseUser con el store
  useEffect(() => {
    setSupabaseUser(supabaseUser)
  }, [supabaseUser, setSupabaseUser])

  // Sincronizar loading state
  useEffect(() => {
    setLoading(loading)

    if (!loading) {
      setInitialized(true)
    }
  }, [loading, setLoading, setInitialized])

  return <>{children}</>
}
