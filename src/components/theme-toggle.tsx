'use client'

import { Moon, Sun } from 'lucide-react'
import { useTheme } from 'next-themes'
import type { MouseEvent } from 'react'
import { flushSync } from 'react-dom'
import { Button } from '@/components/ui/button'

export function ThemeToggle() {
  // `theme` puede ser 'system'; el tema que se ve realmente es `resolvedTheme`.
  const { resolvedTheme, setTheme } = useTheme()
  const isDark = resolvedTheme === 'dark'

  const handleToggle = (event: MouseEvent<HTMLButtonElement>) => {
    if (!document.startViewTransition) {
      setTheme(isDark ? 'light' : 'dark')
      return
    }

    const x = event.clientX
    const y = event.clientY

    const endRadius = Math.hypot(
      Math.max(x, window.innerWidth - x),
      Math.max(y, window.innerHeight - y)
    )

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
      variant='ghost'
      size='icon'
      aria-label='Cambiar tema'
      title='Cambiar tema'
      className='rounded-full text-foreground'
    >
      {/* Iconos por CSS: evita desajustes de hidratación (el tema solo se
          conoce en el cliente). */}
      <Sun aria-hidden='true' className='hidden size-5 dark:block' />
      <Moon aria-hidden='true' className='size-5 dark:hidden' />
    </Button>
  )
}
