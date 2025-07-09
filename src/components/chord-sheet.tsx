
"use client";

import { Chord } from "@/components/chord";
import React from "react";

/**
 * Expresión regular para identificar acordes o secciones en una línea de texto.
 * Captura:
 * - Texto entre corchetes, como `[Intro]` o `[C]`.
 * - Nombres comunes de acordes, como `C`, `Gm`, `F#7`, etc.
 */
const CHORD_OR_SECTION_REGEX = /(\[.*?\]|\b[A-G](?:#|b)?(?:m|maj|dim|aug|sus|add|M|m|sus4|sus2)?[2-9]?\(?(?:#|b)?[5913]?\)?(?:(?:maj|min|add|sus|dim|aug)[0-9]*)?(?:\/[A-G](?:#|b)?)?\b)/g;

/**
 * Lista de nombres de secciones de canciones conocidas (en minúsculas).
 */
const KNOWN_SECTIONS = ['intro', 'verse', 'chorus', 'bridge', 'solo', 'outro', 'instrumental', 'capo', 'pre-chorus', 'post-chorus'];

/**
 * Verifica si un texto dado es un marcador de sección (ej. "[Verse]").
 * Comprueba que el texto esté entre corchetes y que el contenido sea una sección conocida.
 * @param {string} text - El texto a verificar.
 * @returns {boolean} - `true` si es un marcador de sección, `false` en caso contrario.
 */
const isSectionMarker = (text: string): boolean => {
    if (!text.startsWith('[') || !text.endsWith(']')) {
        return false;
    }
    // Extrae el contenido dentro de los corchetes y lo convierte a minúsculas.
    const content = text.substring(1, text.length - 1).toLowerCase().split(' ')[0];
    return KNOWN_SECTIONS.includes(content);
}

/**
 * Componente que renderiza una hoja de acordes y letra.
 * Parsea el texto para identificar y dar formato a los acordes y secciones.
 * @param {{ text: string; transpose?: number }} props - Texto de la canción y valor de transposición.
 * @returns {JSX.Element | null} La hoja de acordes formateada.
 */
export function ChordSheet({ text, transpose = 0 }: { text: string; transpose?: number }) {
  if (!text) return null;

  return (
    <div className="font-code text-sm leading-relaxed text-foreground">
      {/* Divide el texto en líneas y procesa cada una. */}
      {text.split('\n').map((line, lineIndex) => {
        // Si la línea está vacía, renderiza un espacio.
        if (line.trim() === '') {
          return <div key={lineIndex} className="h-4" />;
        }

        // Divide la línea en partes: texto, acordes y secciones.
        const parts = line.split(CHORD_OR_SECTION_REGEX);
        
        // Maneja el caso de una línea que es *solamente* un marcador de sección, ej. `[Verse]`.
        if (parts.length === 3 && parts[0] === '' && parts[2] === '' && isSectionMarker(parts[1])) {
            return <strong key={lineIndex} className="block mt-4 mb-2 font-bold text-foreground">{parts[1]}</strong>
        }
        
        return (
          <div key={lineIndex} className="whitespace-pre">
            {parts.map((part, partIndex) => {
              if (!part) return null;
              
              // Las partes impares son las que coinciden con la regex (acordes o secciones).
              if (partIndex % 2 === 1) { 
                if (isSectionMarker(part)) {
                    // Si es una sección, la renderiza en negrita.
                    return <strong key={partIndex} className="font-bold text-foreground">{part}</strong>;
                }
                // Si es un acorde (puede estar entre corchetes o no), lo renderiza con el componente Chord.
                const chordName = part.replace(/\[|\]/g, ''); // Limpia los corchetes.
                return <Chord key={partIndex} name={chordName} transpose={transpose} />;
              } else {
                // Las partes pares son el texto normal (letra o espacios).
                // Usamos un Fragment para evitar un <span> extra que podría interferir con el renderizado de los espacios.
                return <React.Fragment key={partIndex}>{part}</React.Fragment>;
              }
            })}
          </div>
        );
      })}
    </div>
  );
}
