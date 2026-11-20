# Migración de librerías de acordes

Este documento resume los cambios que se hicieron para delegar la lógica musical
en dos librerías externas:

- **`@chordproject/parser` 1.2.0**: reemplaza al fork `chordproject-parser-fork` 1.0.0.
  Se usa para parsear las cifras, transponerlas y calcular las notas de los acordes.
- **`instruments-chords` 0.0.17**: reemplaza la tabla manual de formas de guitarra
  (`guitarChordShapes`).

Los dos paquetes están fijados a una versión exacta en `package.json`.

---

## 1. De `chordproject-parser-fork` a `@chordproject/parser`

### Por qué

El fork se quedó en la versión **1.0.4** del original (junio de 2025). El proyecto
original cambió de nombre en npm a `@chordproject/parser` y entre el 12 y el 27 de
septiembre de 2026 publicó varias mejoras:

- La transposición escribe las notas según la tonalidad destino
  (F +3 → `Ab Db Eb7 Fm`, en lugar de `G# C# D#7 Fm`).
- El bajo de los acordes con barra se transpone bien (`D/F#` +2 → `E/G#`).
- `MusicTheoryHelper.getChordTones()` calcula las notas de cualquier acorde.
- El parser expone `warnings` con códigos estables, hay funciones de capo
  (`decapo`, `applyCapo`, `getCapoSuggestions`) y los acordes del HTML se pueden
  enfocar con el teclado.

> ⚠️ **Licencia:** desde el 16 de septiembre de 2026 `@chordproject/parser` es
> **AGPL-3.0-only** (antes era GPL-3.0). La AGPL obliga a ofrecer el código fuente
> a los usuarios que usan la aplicación por la red.

### Archivos nuevos

| Archivo                                | Contenido                                                                                                                 |
| -------------------------------------- | ------------------------------------------------------------------------------------------------------------------------- |
| `src/lib/chordpro.ts`                  | `parseChordSheet`, `transposeSong`, `normalizeSectionHeaders`, `splitChordName`, `getKeyboardChordNotes`, `MAX_TRANSPOSE` |
| `src/__tests__/utils/chordpro.test.ts` | Tests de lo anterior                                                                                                      |

#### `parseChordSheet(chordSheet, originalKey)`

1. **Convierte los encabezados de sección en comentarios.** En ChordPro, `[Coro]` es un
   acorde (C + "oro") y se transponía a `C#oro`. Si una línea empieza con un token
   entre corchetes que no es un acorde válido, se convierte a `{comment: Coro}`.
   Ejemplo: `[Intro] [G] [D]` → `{comment: Intro}` + `[G] [D]`.
2. **Agrega `{key: X}`** cuando la canción tiene tonalidad en la base de datos
   (`songs.key`) y la cifra no trae esa directiva. Así el `Transposer` usa la
   tonalidad real como contexto en lugar de inferirla.

#### `transposeSong(song, steps)`

Aplica `Transposer.transpose()` de la librería `steps` veces, con un límite de
±`MAX_TRANSPOSE` (11) semitonos.

### Archivos modificados

| Archivo                                 | Cambio                                                                                                                                                                                                                                                           |
| --------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `src/components/song-display.tsx`       | Parsea la cifra una vez (`useMemo`) y la transpone con `transposeSong`. Saca la tonalidad original y la transpuesta de `song.key` de la librería y se las pasa a los controles. La tonalidad solo se muestra si es explícita (BD o `{key:}`), nunca la inferida. |
| `src/components/song-chords.tsx`        | `SongViewer` ahora recibe el `Song` ya transpuesto (`song`) en lugar de `chordSheet` + `transpose`. Solo formatea el HTML.                                                                                                                                       |
| `src/components/song-lyrics.tsx`        | Usa `parseChordSheet`, así las secciones `[Coro]` aparecen como texto en "Solo letra".                                                                                                                                                                           |
| `src/components/transpose-controls.tsx` | Recibe `originalKey` y `currentKey` ya calculadas; no transpone nada por su cuenta. Muestra `Original: F → Transpuesto: Ab (3 semitonos arriba)` y desactiva `+`/`−` al llegar a ±11.                                                                            |
| `src/components/chord.tsx`              | Ahora es un `<button type="button">` real con `aria-label` (antes era un `<span>`), así que se puede abrir con el teclado. Se quitó la prop `transpose`, que siempre llegaba en `0`.                                                                             |
| `src/components/chord-diagrams.tsx`     | Las notas del diagrama de teclado las calcula `MusicTheoryHelper.getChordTones()`.                                                                                                                                                                               |
| `messages/es.json`, `messages/en.json`  | Nuevas claves: `original`, `transposedKey`, `semitonesUp`, `semitonesDown`.                                                                                                                                                                                      |

### Código eliminado

| Qué                                         | Dónde                     | Por qué                                                                                     |
| ------------------------------------------- | ------------------------- | ------------------------------------------------------------------------------------------- |
| `src/lib/chord-transpose.ts` y su test      | —                         | Transposición por regex hecha a mano; ahora la hace `Transposer`.                           |
| `transposeChord`                            | `src/lib/music.ts`        | Código muerto (solo lo usaba `Chord` con `transpose={0}`).                                  |
| `keyboardChordNotes` y `KeyboardChordNotes` | `src/lib/chord-shapes.ts` | Tabla fija de ~50 acordes; la reemplaza `getChordTones()`, que sirve para cualquier acorde. |

Se conservan `getScaleNotes`, `getNoteIndex` y `notesSharp` en `src/lib/music.ts`,
porque la librería no maneja escalas.

---

## 2. Integración de `instruments-chords`

`instruments-chords` es una base de formas de acordes de guitarra con varias
variantes por acorde: 12 raíces × 12 calidades (`major`, `minor`, `5`, `7`, `maj7`,
`m7`, `sus2`, `sus4`, `7sus4`, `add9`, `9`, `7#9`).

### Archivos nuevos

| Archivo                                     | Contenido                                                            |
| ------------------------------------------- | -------------------------------------------------------------------- |
| `src/lib/guitar-chords.ts`                  | `resolveGuitarChord(nombre)` y `getGuitarChordSvg(acorde, variante)` |
| `src/__tests__/utils/guitar-chords.test.ts` | Tests del adaptador                                                  |

#### `resolveGuitarChord(nombre)`

1. Separa el acorde con `splitChordName` y normaliza la raíz a sostenidos, porque
   la librería solo tiene `C, C#, D…`: `Bbm` → `A#` + `minor`, `E#` → `F`.
2. Convierte el sufijo en una calidad de la librería (`m` → `minor`, `M7` → `maj7`,
   `sus` → `sus4`, etc.).
3. Devuelve `{ root, quality, variants }`. Las variantes salen de `getVariants()`,
   con la predeterminada primero.
4. En los acordes con bajo (`C/E`) se usa el acorde base.
5. Devuelve `null` si la librería no tiene el acorde (por ejemplo `Cdim`).

#### `getGuitarChordSvg(acorde, variante)`

Llama a `getChordSvg(root, quality, variant)` de la librería y devuelve el SVG
como texto.

### Archivos modificados

| Archivo                             | Cambio                                                                                                                                                                                                                                                                                                                                                                                            |
| ----------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `src/components/chord-diagrams.tsx` | La pestaña "Guitarra" del popover de `chord.tsx` muestra el SVG de `getChordSvg`, convertido a React con `html-react-parser` (sin `dangerouslySetInnerHTML`). Va dentro de un `<figure aria-label>` y con `text-foreground`, así funciona en modo oscuro porque el SVG usa `currentColor`. Las flechas recorren todas las variantes de la librería (C mayor tiene 8) y ahora tienen `aria-label`. |

### Código eliminado

- `src/lib/chord-shapes.ts` completo: la tabla manual `guitarChordShapes`, que tenía
  ~50 acordes con 1–2 variantes cada uno.
- `src/components/guitar-chord-diagram.tsx`: el dibujo del diagrama lo hace ahora
  `getChordSvg`.

### Errores de `instruments-chords` corregidos en la librería

La versión 0.0.15 tenía errores que se corrigieron en la propia librería
(rama `fix/svg-rendering`, commit `2dc4a8d`) y se publicaron en **0.0.16/0.0.17**:

| Error en 0.0.15                                                                                                                                   | Corrección                                                                                                  |
| ------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------- |
| No cargaba en Node ESM (`ERR_MODULE_NOT_FOUND`): los imports de `dist/` no tenían extensión `.js`. En Vitest había que usar `server.deps.inline`. | Imports con `.js`, `tsconfig` en `NodeNext` y campo `exports`. Se quitó el `inline` de `vitest.config.ts`.  |
| Acordes abiertos desplazados: A (`x02220`) y G (`320003`) salían con la etiqueta "2".                                                             | `getBaseFret()` devuelve 1 si la forma cabe en los primeros 5 trastes.                                      |
| Cejilla mal dibujada: en F (`133211`) no salía la cejilla del traste 1.                                                                           | `detectBarre()` corrige la cuerda final y exige más de 4 notas pisadas; `renderBarre()` usa la fila visual. |
| La cejuela se dibujaba aunque el diagrama empezara en el traste 8 u 11.                                                                           | `renderBase()` solo la dibuja si el diagrama empieza en el traste 1.                                        |
| `getChord('H')` lanzaba un error.                                                                                                                 | Devuelve `null`.                                                                                            |
| El SVG no era accesible.                                                                                                                          | `role="img"`, `aria-label` y `<title>`.                                                                     |

Siguen pendientes en la librería:

- `aug` y `dim` aparecen en el tipo `ChordQuality`, pero no hay datos. Estos
  acordes muestran "Diagrama de acorde no disponible.".
- Las raíces E a B tienen pocas variantes (casi siempre 1) comparadas con C a D#.
- No hay ninguna función que devuelva la variante predeterminada, así que el
  adaptador lee `chords[root][quality].default` directamente.

---

## Verificación

```bash
bun run lint        # ✔
bun run type-check  # ✔
bun run test:run    # ✔ 81 tests
bun run build
bun run doctor
```
