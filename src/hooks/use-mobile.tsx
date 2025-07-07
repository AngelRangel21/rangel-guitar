import * as React from "react"

// Punto de ruptura para considerar un dispositivo como móvil.
const MOBILE_BREAKPOINT = 768

/**
 * Hook personalizado para detectar si el dispositivo del usuario es móvil.
 * Se basa en el ancho de la ventana del navegador.
 * @returns {boolean} - `true` si el ancho de la ventana es menor que `MOBILE_BREAKPOINT`, `false` en caso contrario.
 */
export function useIsMobile() {
  // El estado inicial es `undefined` para evitar desajustes de hidratación entre el servidor y el cliente.
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined)

  React.useEffect(() => {
    // Media query para detectar cambios en el tamaño de la ventana.
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
    
    // Función que se ejecuta cuando cambia el tamaño de la ventana.
    const onChange = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    }
    
    // Añade un listener para el evento de cambio.
    mql.addEventListener("change", onChange)
    
    // Establece el estado inicial al montar el componente.
    setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    
    // Limpia el listener cuando el componente se desmonta.
    return () => mql.removeEventListener("change", onChange)
  }, [])

  return !!isMobile
}
