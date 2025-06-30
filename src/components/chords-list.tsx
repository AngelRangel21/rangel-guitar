"use client";

import { ChordCard } from "@/components/chord-card";
import { useI18n } from "@/context/i18n-context";

interface ChordsListProps {
    majorChords: string[];
    minorChords: string[];
    seventhChords: string[];
}

export function ChordsList({ majorChords, minorChords, seventhChords }: ChordsListProps) {
  const { t } = useI18n();
  return (
    <div className="space-y-12">
      <section>
        <h2 className="text-3xl font-bold text-foreground mb-6">{t('majorChords')}</h2>
        <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-12 gap-4">
          {majorChords.map((chord) => (
            <ChordCard key={chord} chordName={chord} />
          ))}
        </div>
      </section>
       <section>
        <h2 className="text-3xl font-bold text-foreground mb-6">{t('minorChords')}</h2>
        <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-12 gap-4">
          {minorChords.map((chord) => (
            <ChordCard key={chord} chordName={chord} />
          ))}
        </div>
      </section>
       <section>
        <h2 className="text-3xl font-bold text-foreground mb-6">{t('seventhChords')}</h2>
        <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-12 gap-4">
          {seventhChords.map((chord) => (
            <ChordCard key={chord} chordName={chord} />
          ))}
        </div>
      </section>
    </div>
  );
}
