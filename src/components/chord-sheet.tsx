"use client";

import { Chord } from "@/components/chord";
import React from "react";

const CHORD_OR_SECTION_REGEX = /(\[.*?\]|\b[A-G](?:#|b)?(?:m|maj|dim|aug|sus|add|M|m|sus4|sus2)?[2-9]?\(?(?:#|b)?[5913]?\)?(?:(?:maj|min|add|sus|dim|aug)[0-9]*)?(?:\/[A-G](?:#|b)?)?\b)/g;

const isSectionMarker = (text: string) => text.startsWith('[') && text.endsWith(']');

export function ChordSheet({ text, transpose = 0 }: { text: string; transpose?: number }) {
  if (!text) return null;

  return (
    <div className="font-code text-sm leading-relaxed text-foreground">
      {text.split('\n').map((line, lineIndex) => {
        if (line.trim() === '') {
          return <div key={lineIndex} className="h-4" />;
        }

        const parts = line.split(CHORD_OR_SECTION_REGEX);
        
        if (parts.length === 3 && parts[0] === '' && parts[2] === '' && isSectionMarker(parts[1])) {
            return <strong key={lineIndex} className="block mt-4 mb-2 font-bold text-foreground">{parts[1]}</strong>
        }
        
        return (
          <div key={lineIndex} className="whitespace-pre">
            {parts.map((part, partIndex) => {
              if (!part) return null;
              
              if (partIndex % 2 === 1) {
                if (isSectionMarker(part)) {
                    return <strong key={partIndex} className="font-bold text-foreground">{part}</strong>;
                }
                return <Chord key={partIndex} name={part} transpose={transpose} />;
              } else {
                return <span key={partIndex}>{part}</span>;
              }
            })}
          </div>
        );
      })}
    </div>
  );
}
