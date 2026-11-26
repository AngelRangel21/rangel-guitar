import {
  ChordProParser,
  FormatterSettings,
  TextFormatter,
  Transposer
} from '@chordproject/parser'
import {
  PDFDocument,
  type PDFFont,
  type PDFImage,
  type PDFPage,
  rgb,
  StandardFonts
} from 'pdf-lib'
import { transposeKey } from '@/lib/song-key'
import type { SongWithArtist } from '@/types/app.types'
import esMessages from '../../messages/es.json'

const SITE_NAME = 'Rangel Guitar'
/** Nombre de archivo por defecto (`songs.pdf.filename` del catálogo base). */
const DEFAULT_PDF_FILENAME = esMessages.songs.pdf.filename
const PAGE_WIDTH = 595.28
const PAGE_HEIGHT = 841.89
const MARGIN = 48
const BODY_FONT_SIZE = 10
const BODY_LINE_HEIGHT = BODY_FONT_SIZE * 1.35
const HEADER_TOP = PAGE_HEIGHT - MARGIN
const FOOTER_Y = 30
const CONTENT_BOTTOM = MARGIN + 6
const COVER_SIZE = 72
const COVER_FETCH_TIMEOUT_MS = 3000

/** Etiquetas ya resueltas por i18n que se imprimen en el PDF. */
export interface SongPdfLabels {
  /** Título de respaldo si la canción no tiene título. */
  documentTitle: string
  /** Ej. "Tono: C" con la tonalidad ya transpuesta. */
  key: (key: string) => string
  /** Asunto de los metadatos del documento. */
  chordsAndLyrics: string
  /** Ej. "Página 1 de 3". */
  page: (page: number, totalPages: number) => string
  /** Pie de página, ej. "rangelguitar.com". */
  generatedFrom: string
  /** Mensaje cuando la canción no tiene acordes ni letra. */
  noChords: string
}

interface CreateSongPdfInput {
  song: SongWithArtist
  artistsName: string
  transpose: number
  labels: SongPdfLabels
}

/** Reemplazos para caracteres fuera de la codificación WinAnsi de pdf-lib. */
const PDF_CHAR_REPLACEMENTS: Record<string, string> = {
  '“': '"',
  '”': '"',
  '„': '"',
  '‘': "'",
  '’': "'",
  '‚': "'",
  '–': '-',
  '—': '-',
  '…': '...',
  '€': 'EUR',
  '\u00a0': ' '
}

/**
 * Elimina o reemplaza los caracteres que las fuentes estándar de pdf-lib
 * (WinAnsi) no pueden codificar, para evitar que la generación falle.
 */
export function sanitizePdfText(text: string): string {
  return Array.from(text)
    .map((char) => {
      const replacement = PDF_CHAR_REPLACEMENTS[char]
      if (replacement != null) return replacement

      const codePoint = char.codePointAt(0) ?? 0
      if (codePoint < 32) return ''
      return codePoint <= 255 ? char : ''
    })
    .join('')
}

/**
 * Convierte la hoja ChordPro en líneas de texto con los acordes alineados
 * sobre la letra, aplicando la transposición indicada (misma lógica que la
 * vista de la canción).
 */
export function buildChordSheetLines(
  chordSheet: string,
  transpose: number
): string[] {
  if (chordSheet.trim().length === 0) return []

  let song = new ChordProParser().parse(chordSheet)
  const steps = Math.abs(transpose)
  const direction = transpose > 0 ? 'up' : 'down'

  for (let i = 0; i < steps; i++) {
    song = Transposer.transpose(song, direction)
  }

  const settings = new FormatterSettings()
  settings.showMetadata = false
  settings.showTabs = true
  settings.useSimpleChord = false
  settings.showChords = true

  return new TextFormatter(settings).format(song)
}

/** Devuelve los acordes de la canción o, si no hay, su letra plana. */
export function resolveChordSheet(
  song: Pick<SongWithArtist, 'chords' | 'lyrics'>
): string {
  if (song.chords != null && song.chords.trim().length > 0) return song.chords
  if (song.lyrics != null && song.lyrics.trim().length > 0) return song.lyrics
  return ''
}

/** Tonalidad transpuesta, o null si la canción no tiene tonalidad. */
export function transposedKey(
  key: string | null,
  transpose: number
): string | null {
  if (key == null || key.trim().length === 0) return null
  return transposeKey(key, transpose)
}

/**
 * Nombre de archivo ASCII seguro para la cabecera Content-Disposition.
 * `fallback` debe resolverse con `songs.pdf.filename` en el idioma activo.
 */
export function buildPdfFilename(
  song: Pick<SongWithArtist, 'slug' | 'title'>,
  fallback: string = DEFAULT_PDF_FILENAME
): string {
  const base = song.slug ?? song.title ?? fallback
  const safe = base
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')

  return `${safe.length > 0 ? safe : fallback}.pdf`
}

/**
 * Genera el PDF de una canción: cabecera con título, artista y tonalidad,
 * hoja de acordes/letra en fuente monoespaciada y pie de página con
 * numeración.
 */
export async function createSongPdf({
  song,
  artistsName,
  transpose,
  labels
}: CreateSongPdfInput): Promise<Uint8Array<ArrayBuffer>> {
  const pdf = await PDFDocument.create()
  const title = sanitizePdfText(song.title?.trim() || labels.documentTitle)
  const artist = sanitizePdfText(artistsName)
  const key = transposedKey(song.key, transpose)

  pdf.setTitle(title)
  pdf.setAuthor(artist)
  pdf.setSubject(labels.chordsAndLyrics)
  pdf.setCreator(SITE_NAME)

  const headingFont = await pdf.embedFont(StandardFonts.HelveticaBold)
  const textFont = await pdf.embedFont(StandardFonts.Helvetica)
  const bodyFont = await pdf.embedFont(StandardFonts.Courier)

  const sheet = resolveChordSheet(song)
  const maxCharsPerLine = Math.max(
    20,
    Math.floor((PAGE_WIDTH - MARGIN * 2) / (BODY_FONT_SIZE * 0.6))
  )

  const lines =
    sheet.trim().length > 0
      ? buildChordSheetLines(sheet, transpose).flatMap((line) =>
          wrapLine(sanitizePdfText(line), maxCharsPerLine)
        )
      : [labels.noChords]

  const cover = await embedCoverImage(pdf, song.coverArt)

  let page = pdf.addPage([PAGE_WIDTH, PAGE_HEIGHT])
  const pages: PDFPage[] = [page]
  let cursorY = HEADER_TOP

  // Marca del sitio.
  page.drawText(SITE_NAME.toUpperCase(), {
    x: MARGIN,
    y: cursorY - 9,
    size: 9,
    font: headingFont,
    color: rgb(0.45, 0.45, 0.45)
  })
  cursorY -= 24

  // Portada opcional junto a la cabecera.
  const textMaxWidth = cover
    ? PAGE_WIDTH - MARGIN * 2 - COVER_SIZE - 16
    : PAGE_WIDTH - MARGIN * 2
  let coverBottom = cursorY

  if (cover != null) {
    coverBottom = cursorY - COVER_SIZE
    page.drawImage(cover, {
      x: PAGE_WIDTH - MARGIN - COVER_SIZE,
      y: coverBottom,
      width: COVER_SIZE,
      height: COVER_SIZE
    })
  }

  // Título.
  for (const line of wrapText(title, headingFont, 20, textMaxWidth)) {
    page.drawText(line, {
      x: MARGIN,
      y: cursorY - 20,
      size: 20,
      font: headingFont,
      color: rgb(0.08, 0.08, 0.08)
    })
    cursorY -= 24
  }

  // Artistas.
  for (const line of wrapText(artist, textFont, 12, textMaxWidth)) {
    page.drawText(line, {
      x: MARGIN,
      y: cursorY - 12,
      size: 12,
      font: textFont,
      color: rgb(0.3, 0.3, 0.3)
    })
    cursorY -= 16
  }

  // Tonalidad.
  if (key != null) {
    page.drawText(sanitizePdfText(labels.key(key)), {
      x: MARGIN,
      y: cursorY - 10,
      size: 10,
      font: textFont,
      color: rgb(0.3, 0.3, 0.3)
    })
    cursorY -= 16
  }

  cursorY = Math.min(cursorY, coverBottom - 12) - 8

  // Separador de la cabecera.
  page.drawLine({
    start: { x: MARGIN, y: cursorY },
    end: { x: PAGE_WIDTH - MARGIN, y: cursorY },
    thickness: 0.75,
    color: rgb(0.82, 0.82, 0.82)
  })
  cursorY -= 18

  // Cuerpo: hoja de acordes y letra.
  for (const line of lines) {
    if (cursorY - BODY_LINE_HEIGHT < CONTENT_BOTTOM) {
      page = pdf.addPage([PAGE_WIDTH, PAGE_HEIGHT])
      pages.push(page)
      cursorY = HEADER_TOP

      page.drawText(title, {
        x: MARGIN,
        y: cursorY - 9,
        size: 9,
        font: textFont,
        color: rgb(0.5, 0.5, 0.5)
      })
      cursorY -= 20
    }

    if (line.length > 0) {
      page.drawText(line, {
        x: MARGIN,
        y: cursorY - BODY_FONT_SIZE,
        size: BODY_FONT_SIZE,
        font: bodyFont,
        color: rgb(0.1, 0.1, 0.1)
      })
    }

    cursorY -= BODY_LINE_HEIGHT
  }

  // Pie de página en todas las hojas.
  pages.forEach((currentPage, index) => {
    currentPage.drawLine({
      start: { x: MARGIN, y: FOOTER_Y + 10 },
      end: { x: PAGE_WIDTH - MARGIN, y: FOOTER_Y + 10 },
      thickness: 0.5,
      color: rgb(0.85, 0.85, 0.85)
    })
    currentPage.drawText(sanitizePdfText(labels.generatedFrom), {
      x: MARGIN,
      y: FOOTER_Y,
      size: 8,
      font: textFont,
      color: rgb(0.5, 0.5, 0.5)
    })

    const pageLabel = sanitizePdfText(labels.page(index + 1, pages.length))
    const pageLabelWidth = textFont.widthOfTextAtSize(pageLabel, 8)

    currentPage.drawText(pageLabel, {
      x: PAGE_WIDTH - MARGIN - pageLabelWidth,
      y: FOOTER_Y,
      size: 8,
      font: textFont,
      color: rgb(0.5, 0.5, 0.5)
    })
  })

  // Copia a un buffer propio: `Uint8Array<ArrayBuffer>` es un `BodyInit`
  // válido para la respuesta HTTP, a diferencia del buffer interno de pdf-lib.
  const saved = await pdf.save()
  const bytes = new Uint8Array(saved.length)
  bytes.set(saved)
  return bytes
}

/** Parte una línea larga en trozos que caben en el ancho disponible. */
function wrapLine(line: string, maxChars: number): string[] {
  const chunks: string[] = []
  let rest = line

  while (rest.length > maxChars) {
    const candidate = rest.slice(0, maxChars)
    const lastSpace = candidate.lastIndexOf(' ')
    const cut = lastSpace > 0 ? lastSpace : maxChars

    chunks.push(rest.slice(0, cut).trimEnd())
    rest = rest.slice(cut).trimStart()
  }

  chunks.push(rest)
  return chunks
}

/** Parte un texto en líneas según el ancho real de la fuente. */
function wrapText(
  text: string,
  font: PDFFont,
  size: number,
  maxWidth: number
): string[] {
  const words = text.split(/\s+/).filter((word) => word.length > 0)
  const lines: string[] = []
  let current = ''

  for (const word of words) {
    const candidate = current.length > 0 ? `${current} ${word}` : word

    if (
      current.length > 0 &&
      font.widthOfTextAtSize(candidate, size) > maxWidth
    ) {
      lines.push(current)
      current = word
    } else {
      current = candidate
    }
  }

  if (current.length > 0) lines.push(current)
  return lines.length > 0 ? lines : ['']
}

/** Descarga la portada y la embebe; si falla, se omite sin romper el PDF. */
async function embedCoverImage(
  pdf: PDFDocument,
  coverArt: string | null
): Promise<PDFImage | null> {
  if (coverArt == null || coverArt.trim().length === 0) return null

  try {
    const response = await fetch(coverArt, {
      signal: AbortSignal.timeout(COVER_FETCH_TIMEOUT_MS)
    })
    if (!response.ok) return null

    const bytes = new Uint8Array(await response.arrayBuffer())
    const contentType = response.headers.get('content-type') ?? ''

    if (contentType.includes('png')) return await pdf.embedPng(bytes)
    if (contentType.includes('jpeg') || contentType.includes('jpg')) {
      return await pdf.embedJpg(bytes)
    }

    try {
      return await pdf.embedJpg(bytes)
    } catch {
      return await pdf.embedPng(bytes)
    }
  } catch {
    return null
  }
}
