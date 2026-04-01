'use client'

import { supabase } from '@/lib/supabase'
import { JSX, useEffect } from 'react'
import { useAuthStore } from '../stores/auth.stores'

export function AuthProvider ({ children }: { children: React.ReactNode }): JSX.Element {
  const loadUserProfile = useAuthStore((s) => s.loadUserProfile)
  const _setInitialized = useAuthStore((s) => s._setInitialized)
  const _setLoading = useAuthStore((s) => s._setLoading)
  const logout = useAuthStore((s) => s.logout)

  // Sincronizar supabaseUser con el store
  useEffect(() => {
    const {
      data: { subscription }
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.debug('[Auth]', event, session?.user?.id)

      switch (event) {
        case 'INITIAL_SESSION':
          if (session?.user != null) {
            await loadUserProfile(session.user)
          }
          _setInitialized(true)
          _setLoading(false)
          break

        case 'SIGNED_IN':
          if (session?.user != null) {
            await loadUserProfile(session.user)
          }
          break

        case 'SIGNED_OUT':
          useAuthStore.setState({
            supabaseUser: null,
            user: null,
            favoriteIds: new Set()
          })
          break

        case 'USER_UPDATED':
          if (session?.user != null) {
            await loadUserProfile(session.user)
          }
          break

        case 'TOKEN_REFRESHED':
          break
      }
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [loadUserProfile, _setInitialized, _setLoading, logout])

  return <>{children}</>
}
