'use client'

import { Moon, Sun } from 'lucide-react'
import { useTheme } from 'next-themes'
import type { MouseEvent } from 'react'
import { flushSync } from 'react-dom'
import { Button } from '@/components/ui/button'

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()

  const handleToggle = (event: MouseEvent<HTMLButtonElement>) => {
    if (!document.startViewTransition) {
      setTheme(theme === 'dark' ? 'light' : 'dark')
      return
    }

    const x = event.clientX
    const y = event.clientY

    const endRadius = Math.hypot(
      Math.max(x, window.innerWidth - x),
      Math.max(y, window.innerHeight - y)
    )

    const isDark = theme === 'dark'

    if (isDark) {
      document.documentElement.classList.add('js-view-transition-reverse')
    } else {
      document.documentElement.classList.remove('js-view-transition-reverse')
    }

    const transition = document.startViewTransition(() => {
      flushSync(() => {
        setTheme(isDark ? 'light' : 'dark')
      })
    })

    transition.ready.then(() => {
      const clipPath = [
        `circle(0px at ${x}px ${y}px)`,
        `circle(${endRadius}px at ${x}px ${y}px)`
      ]

      document.documentElement.animate(
        {
          // If going dark, expand the clip path of the new dark frame.
          // If going light, expand the clip path of the old dark frame (in reverse).
          clipPath: isDark ? [...clipPath].reverse() : clipPath
        },
        {
          duration: 400,
          easing: 'ease-in-out',
          pseudoElement: isDark
            ? '::view-transition-old(root)'
            : '::view-transition-new(root)'
        }
      )
    })
  }

  return (
    <Button
      onClick={handleToggle}
      aria-label='Cambiar tema'
      className='inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium transition-colors h-10 w-10 hover:text-[#d2d2d2] rounded-full'
    >
      {theme === 'dark' ? (
        <Sun className='h-5 w-5' />
      ) : (
        <Moon className='h-5 w-5' />
      )}
    </Button>
  )
}
