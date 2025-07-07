
'use client';

import { useI18n } from "@/context/i18n-context";
import { LearnCard } from "./learn-card";
import { Library, Scale, Gauge, Ear, Album } from "lucide-react";

/**
 * Componente que renderiza el contenido principal de la página "Aprender".
 * Muestra una cuadrícula de tarjetas que enlazan a las diferentes herramientas de aprendizaje.
 * @returns {JSX.Element} El contenido de la página "Aprender".
 */
export function LearnPageContent() {
    const { t } = useI18n(); // Hook para obtener traducciones.

    return (
        <main className="flex-grow container mx-auto px-4 py-8 opacity-0 animate-content-in">
            <div className="text-center mb-12">
                <h1 className="text-4xl font-bold tracking-tight lg:text-5xl">{t('learnPageTitle')}</h1>
                <p className="mt-4 text-lg text-muted-foreground">{t('learnPageDescription')}</p>
            </div>

            {/* Cuadrícula de tarjetas de aprendizaje. */}
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                {/* Tarjeta para la Biblioteca de Acordes */}
                <div style={{ animationDelay: '150ms' }}>
                    <LearnCard 
                        href="/chords"
                        icon={<Library className="h-8 w-8 text-accent" />}
                        title={t('chordLibrary')}
                        description={t('chordLibraryDescription')}
                    />
                </div>
                {/* Tarjeta para la Biblioteca de Escalas */}
                <div style={{ animationDelay: '250ms' }}>
                    <LearnCard 
                        href="/scales"
                        icon={<Scale className="h-8 w-8 text-accent" />}
                        title={t('scaleLibrary')}
                        description={t('scaleLibraryDescription')}
                    />
                </div>
                {/* Tarjeta para el Metrónomo */}
                <div style={{ animationDelay: '350ms' }}>
                    <LearnCard 
                        href="/learn/metronome"
                        icon={<Gauge className="h-8 w-8 text-accent" />}
                        title={t('metronome')}
                        description={t('metronomeDescription')}
                    />
                </div>
                {/* Tarjeta para el Entrenador de Oído */}
                <div style={{ animationDelay: '450ms' }}>
                    <LearnCard 
                        href="/learn/ear-trainer"
                        icon={<Ear className="h-8 w-8 text-accent" />}
                        title={t('earTrainer')}
                        description={t('earTrainerDescription')}
                    />
                </div>
                 {/* Tarjeta para el Círculo de Quintas */}
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
