'use client'

import type { JSX } from 'react'
import DesktopNav from './components/DesktopNav'
import { Logo } from './components/Logo'
import { MovileNav } from './components/MovileNav'

export function Header(): JSX.Element {
  return (
    <header className='bg-primary text-primary-foreground sticky top-0 z-50 backdrop-filter backdrop-blur-xs'>
      <div className='container mx-auto flex items-center justify-between px-4 h-16'>
        {/* Logo */}
        <Logo />

        {/* --- Desktop Navigation --- */}
        <DesktopNav />

        {/* --- Mobile Menu Button --- */}
        <MovileNav />
      </div>
    </header>
  )
}
