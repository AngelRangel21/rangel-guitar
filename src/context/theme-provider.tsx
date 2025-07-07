"use client"

import * as React from "react"
import { ThemeProvider as NextThemesProvider } from "next-themes"
import type { ThemeProviderProps } from "next-themes/dist/types"

/**
 * Proveedor de tema para la aplicación.
 * Utiliza la biblioteca `next-themes` para gestionar el cambio entre
 * temas claro, oscuro y el tema del sistema.
 * @param {ThemeProviderProps} props - Propiedades pasadas al proveedor de `next-themes`.
 * @returns {JSX.Element} El proveedor de tema.
 */
export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>
}
