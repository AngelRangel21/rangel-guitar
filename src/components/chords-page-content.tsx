'use client';

import { useI18n } from "@/context/i18n-context";
import { ChordsList } from "@/components/chords-list";

interface ChordsPageContentProps {
    majorChords: string[];
    minorChords: string[];
    seventhChords: string[];
}

export function ChordsPageContent({ majorChords, minorChords, seventhChords }: ChordsPageContentProps) {
    const { t } = useI18n();

    return (
        <main className="flex-grow container mx-auto px-4 py-8 space-y-8">
            <h1 className="text-4xl font-bold text-center">{t('chordsPageTitle')}</h1>
            <ChordsList
                majorChords={majorChords}
                minorChords={minorChords}
                seventhChords={seventhChords}
            />
        </main>
    )
}
