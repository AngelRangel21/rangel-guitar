
'use client';

import { useI18n } from "@/context/i18n-context";
import { LearnCard } from "./learn-card";
import { Library, Scale, Gauge, Ear, Album } from "lucide-react";

export function LearnPageContent() {
    const { t } = useI18n();

    return (
        <main className="flex-grow container mx-auto px-4 py-8 opacity-0 animate-content-in">
            <div className="text-center mb-12">
                <h1 className="text-4xl font-bold tracking-tight lg:text-5xl">{t('learnPageTitle')}</h1>
                <p className="mt-4 text-lg text-muted-foreground">{t('learnPageDescription')}</p>
            </div>

            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                <div style={{ animationDelay: '150ms' }}>
                    <LearnCard 
                        href="/chords"
                        icon={<Library className="h-8 w-8 text-accent" />}
                        title={t('chordLibrary')}
                        description={t('chordLibraryDescription')}
                    />
                </div>
                <div style={{ animationDelay: '250ms' }}>
                    <LearnCard 
                        href="/scales"
                        icon={<Scale className="h-8 w-8 text-accent" />}
                        title={t('scaleLibrary')}
                        description={t('scaleLibraryDescription')}
                    />
                </div>
                <div style={{ animationDelay: '350ms' }}>
                    <LearnCard 
                        href="/learn/metronome"
                        icon={<Gauge className="h-8 w-8 text-accent" />}
                        title={t('metronome')}
                        description={t('metronomeDescription')}
                    />
                </div>
                <div style={{ animationDelay: '450ms' }}>
                    <LearnCard 
                        href="/learn/ear-trainer"
                        icon={<Ear className="h-8 w-8 text-accent" />}
                        title={t('earTrainer')}
                        description={t('earTrainerDescription')}
                    />
                </div>
                 <div style={{ animationDelay: '550ms' }}>
                    <LearnCard 
                        href="/learn/circle-of-fifths"
                        icon={<Album className="h-8 w-8 text-accent" />}
                        title={t('circleOfFifths')}
                        description={t('circleOfFifthsDescription')}
                    />
                </div>
            </div>
        </main>
    );
}
