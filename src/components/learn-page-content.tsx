'use client';

import { useI18n } from "@/context/i18n-context";
import { LearnCard } from "./learn-card";
import { Library, Scale } from "lucide-react";

export function LearnPageContent() {
    const { t } = useI18n();

    return (
        <main className="flex-grow container mx-auto px-4 py-8">
            <div className="text-center mb-12">
                <h1 className="text-4xl font-bold tracking-tight lg:text-5xl">{t('learnPageTitle')}</h1>
                <p className="mt-4 text-lg text-muted-foreground">{t('learnPageDescription')}</p>
            </div>

            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                <LearnCard 
                    href="/chords"
                    icon={<Library className="h-8 w-8 text-accent" />}
                    title={t('chordLibrary')}
                    description={t('chordLibraryDescription')}
                />
                <LearnCard 
                    href="/scales"
                    icon={<Scale className="h-8 w-8 text-accent" />}
                    title={t('scaleLibrary')}
                    description={t('scaleLibraryDescription')}
                />
                {/* Future learning modules can be added here */}
            </div>
        </main>
    );
}
