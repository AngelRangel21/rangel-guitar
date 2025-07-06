
"use client";

import { Chord } from "@/components/chord";
import React from "react";

// Matches things in brackets `[like this]` OR common chord names.
const CHORD_OR_SECTION_REGEX = /(\[.*?\]|\b[A-G](?:#|b)?(?:m|maj|dim|aug|sus|add|M|m|sus4|sus2)?[2-9]?\(?(?:#|b)?[5913]?\)?(?:(?:maj|min|add|sus|dim|aug)[0-9]*)?(?:\/[A-G](?:#|b)?)?\b)/g;

const KNOWN_SECTIONS = ['intro', 'verse', 'chorus', 'bridge', 'solo', 'outro', 'instrumental', 'capo', 'pre-chorus', 'post-chorus'];

/**
 * Checks if a given text is a section marker like [Verse] or [Chorus].
 * It verifies that the text is bracketed and that the content matches a known section type.
 * @param text The text to check.
 * @returns True if it's a section marker, false otherwise.
 */
const isSectionMarker = (text: string): boolean => {
    if (!text.startsWith('[') || !text.endsWith(']')) {
        return false;
    }
    const content = text.substring(1, text.length - 1).toLowerCase().split(' ')[0];
    return KNOWN_SECTIONS.includes(content);
}

export function ChordSheet({ text, transpose = 0 }: { text: string; transpose?: number }) {
  if (!text) return null;

  return (
    <div className="font-code text-sm leading-relaxed text-foreground">
      {text.split('\n').map((line, lineIndex) => {
        if (line.trim() === '') {
          return <div key={lineIndex} className="h-4" />;
        }

        const parts = line.split(CHORD_OR_SECTION_REGEX);
        
        // This handles lines that are ONLY a section marker, e.g. `[Verse]`
        if (parts.length === 3 && parts[0] === '' && parts[2] === '' && isSectionMarker(parts[1])) {
            return <strong key={lineIndex} className="block mt-4 mb-2 font-bold text-foreground">{parts[1]}</strong>
        }
        
        return (
          <div key={lineIndex} className="whitespace-pre">
            {parts.map((part, partIndex) => {
              if (!part) return null;
              
              if (partIndex % 2 === 1) { // This is a matched part (delimiter)
                if (isSectionMarker(part)) {
                    // It's a section like [Verse]
                    return <strong key={partIndex} className="font-bold text-foreground">{part}</strong>;
                }
                // It's a chord, which might be in brackets `[C]` or not `C`
                const chordName = part.replace(/\[|\]/g, '');
                return <Chord key={partIndex} name={chordName} transpose={transpose} />;
              } else {
                // This is the text between chords/sections
                return <span key={partIndex}>{part}</span>;
              }
            })}
          </div>
        );
      })}
    </div>
  );
}
