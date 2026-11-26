import { getTranslations } from 'next-intl/server'
import { z } from 'zod'
import { buildPdfFilename, createSongPdf } from '@/lib/song-pdf'
import { getSongBySlug } from '@/services/song.service'

const querySchema = z.object({
  locale: z.enum(['es', 'en']).optional(),
  transpose: z.coerce.number().int().min(-11).max(11).optional()
})

/**
 * Genera y descarga el PDF de la hoja de acordes/letra de una canción.
 *
 * Query params:
 * - `locale`: idioma de las etiquetas del PDF (`es` por defecto).
 * - `transpose`: semitonos a transponer (-11 a 11, `0` por defecto).
 */
export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
): Promise<Response> {
  const { slug } = await params
  const { searchParams } = new URL(request.url)
  const requestedLocale = searchParams.get('locale')
  const errorLocale = requestedLocale === 'en' ? 'en' : 'es'
  const tErrors = await getTranslations({
    locale: errorLocale,
    namespace: 'errors'
  })

  const parsed = querySchema.safeParse({
    locale: requestedLocale ?? undefined,
    transpose: searchParams.get('transpose') ?? undefined
  })

  if (!parsed.success) {
    return new Response(tErrors('invalidQueryParameters'), { status: 400 })
  }

  const locale = parsed.data.locale ?? 'es'
  const transpose = parsed.data.transpose ?? 0

  const song = await getSongBySlug(slug)

  if (song == null) {
    return new Response(tErrors('songNotFound'), { status: 404 })
  }

  const t = await getTranslations({ locale, namespace: 'songPdf' })
  const tSongs = await getTranslations({ locale, namespace: 'songs.pdf' })
  const artistsName = song.artists.map((artist) => artist.name).join(', ')

  const pdfBytes = await createSongPdf({
    song,
    artistsName: artistsName.length > 0 ? artistsName : t('unknownArtist'),
    transpose,
    labels: {
      documentTitle: t('documentTitle'),
      key: (value) => t('keyLabel', { key: value }),
      chordsAndLyrics: t('chordsAndLyrics'),
      page: (page, totalPages) => t('page', { page, totalPages }),
      generatedFrom: t('generatedFrom'),
      noChords: t('noChords')
    }
  })

  return new Response(pdfBytes, {
    status: 200,
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="${buildPdfFilename(song, tSongs('filename'))}"`,
      'Cache-Control':
        'public, max-age=3600, s-maxage=86400, stale-while-revalidate=86400'
    }
  })
}
