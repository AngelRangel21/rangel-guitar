'use client';

import { useI18n } from "@/context/i18n-context";
import { ChordsList } from "@/components/chords-list";

/**
 * Propiedades que el componente ChordsPageContent espera recibir.
 */
interface ChordsPageContentProps {
    majorChords: string[];
    minorChords: string[];
    seventhChords: string[];
}

/**
 * Componente que renderiza el contenido principal de la página de la biblioteca de acordes.
 * Es un Client Component para poder usar el hook de internacionalización.
 * @param {ChordsPageContentProps} props - Las listas de acordes a mostrar.
 * @returns {JSX.Element} El contenido principal de la página de acordes.
 */
export function ChordsPageContent({ majorChords, minorChords, seventhChords }: ChordsPageContentProps) {
    const { t } = useI18n(); // Hook para obtener traducciones.

    return (
        <main className="flex-grow container mx-auto px-4 py-8 space-y-8">
            <h1 className="text-4xl font-bold text-center">{t('chordsPageTitle')}</h1>
            {/* Componente que renderiza las listas de acordes. */}
            <ChordsList
                majorChords={majorChords}
                minorChords={minorChords}
                seventhChords={seventhChords}
            />
        </main>
    )
}
