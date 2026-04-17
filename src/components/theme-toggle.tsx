'use client'

import { Moon, Sun } from 'lucide-react'
import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'

export function ThemeToggle() {
  const { theme, setTheme, systemTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  // Detecta tema del sistema al cargar
  useEffect(() => setMounted(true), [])
  if (!mounted) return null

  const currentTheme = theme === 'system' ? systemTheme : theme

  return (
    <Button
      onClick={() => setTheme(currentTheme === 'dark' ? 'light' : 'dark')}
      aria-label='Cambiar tema'
      className='inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium transition-colors h-10 w-10 hover:text-[#d2d2d2] rounded-full'
    >
      {currentTheme === 'dark' ? (
        <Sun className='h-5 w-5' />
      ) : (
        <Moon className='h-5 w-5' />
      )}
    </Button>
  )
}
