
'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useI18n } from '@/context/i18n-context';
import { circleOfFifthsKeys } from '@/lib/circle-of-fifths-data';
import { cn } from '@/lib/utils';

export function CircleOfFifths() {
  const { t } = useI18n();
  const [selectedIndex, setSelectedIndex] = useState<number | null>(0); // Default to C

  const relatedChords = selectedIndex !== null ? {
    tonic: circleOfFifthsKeys[selectedIndex].major,
    subdominant: circleOfFifthsKeys[(selectedIndex + 11) % 12].major,
    dominant: circleOfFifthsKeys[(selectedIndex + 1) % 12].major,
    relativeMinor: circleOfFifthsKeys[selectedIndex].minor,
  } : null;

  const isTonic = (index: number) => selectedIndex === index;
  const isSubdominant = (index: number) => selectedIndex !== null && index === (selectedIndex + 11) % 12;
  const isDominant = (index: number) => selectedIndex !== null && index === (selectedIndex + 1) % 12;

  const R = 150; // radius
  const center = 160;

  return (
    <Card className="w-full max-w-lg">
      <CardHeader>
        <CardTitle>{t('circleOfFifthsPageTitle')}</CardTitle>
        <CardDescription>{t('circleOfFifthsDescription')}</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center gap-8">
        <svg viewBox="0 0 320 320" className="w-full max-w-sm">
          <defs>
            <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="2" dy="2" stdDeviation="3" floodColor="hsl(var(--foreground))" floodOpacity="0.1" />
            </filter>
          </defs>
          {circleOfFifthsKeys.map((key, i) => {
            const angle = (i * 30 - 90) * (Math.PI / 180);
            const x = center + R * Math.cos(angle);
            const y = center + R * Math.sin(angle);
            
            let highlightClass = 'fill-card stroke-border text-foreground';
            let textHighlightClass = 'fill-foreground';
            if (selectedIndex !== null) {
              if (isTonic(i)) {
                highlightClass = 'fill-accent stroke-accent/50';
                textHighlightClass = 'fill-accent-foreground';
              }
              else if (isSubdominant(i) || isDominant(i)) {
                highlightClass = 'fill-primary/80 stroke-primary/50';
                textHighlightClass = 'fill-primary-foreground';
              }
            }

            return (
              <g
                key={key.major}
                transform={`translate(${x}, ${y})`}
                onClick={() => setSelectedIndex(i)}
                className="cursor-pointer"
              >
                <circle r="30" className={cn('transition-colors', highlightClass)} filter="url(#shadow)" />
                <text textAnchor="middle" dy="0" className={cn('font-bold text-lg transition-colors', textHighlightClass)}>{key.major}</text>
                <text textAnchor="middle" dy="16" className={cn('text-xs transition-colors', textHighlightClass)}>{key.minor}</text>
              </g>
            );
          })}
        </svg>

        {relatedChords && (
          <div className="text-center p-4 border rounded-lg bg-background/50 w-full animate-fade-in-up">
            <h3 className="text-lg font-semibold mb-2">{t('keyOf', {key: relatedChords.tonic})}</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-sm">
              <div className="p-2 rounded bg-accent text-accent-foreground"><strong>I:</strong> {relatedChords.tonic}</div>
              <div className="p-2 rounded bg-primary/80 text-primary-foreground"><strong>IV:</strong> {relatedChords.subdominant}</div>
              <div className="p-2 rounded bg-primary/80 text-primary-foreground"><strong>V:</strong> {relatedChords.dominant}</div>
              <div className="p-2 rounded bg-secondary text-secondary-foreground"><strong>vi:</strong> {relatedChords.relativeMinor}</div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
