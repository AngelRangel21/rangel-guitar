
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.error(
    'Error: Supabase environment variables are missing. Make sure NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are set.'
  )
}

export const supabase = createClient(
  supabaseUrl || 'https://kzlgnlxvqxjqyapuhkil.supabase.co',
  supabaseAnonKey || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt6bGdubHh2cXhqcXlhcHVoa2lsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ3ODE4ODYsImV4cCI6MjA3MDM1Nzg4Nn0.JAAdIteWTU3Ox72v9HeqPGdH9fo3BwG0YDgtoGd8zNQ',
  {
    auth: {
      persistSession: true, // Mantiene la sesion en localStorage
      autoRefreshToken: true, // Refresca el token automaticamente
      detectSessionInUrl: true,
    }
  }
)
