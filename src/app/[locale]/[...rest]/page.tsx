import { notFound } from 'next/navigation'

/**
 * Captura cualquier ruta desconocida dentro de un idioma para mostrar el
 * `not-found` de `[locale]`, que sí tiene el provider de next-intl, header y
 * footer.
 */
export default function CatchAllPage(): never {
  notFound()
}
