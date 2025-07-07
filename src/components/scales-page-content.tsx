'use client';

import { useState, useMemo } from 'react';
import { useI18n } from "@/context/i18n-context";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { getScaleNotes } from '@/lib/music';
import { ScaleDisplay } from './scale-display';

/**
 * Propiedades que el componente ScalesPageContent espera recibir.
 */
interface ScalesPageContentProps {
    rootNotes: string[];
    scaleTypes: ('major' | 'minor')[];
}

/**
 * Componente que renderiza el contenido principal de la página de la biblioteca de escalas.
 * Maneja la lógica de selección de nota raíz y tipo de escala, y muestra el diagrama correspondiente.
 * @param {ScalesPageContentProps} props - Propiedades del componente.
 * @returns {JSX.Element} El contenido principal de la página de escalas.
 */
export function ScalesPageContent({ rootNotes, scaleTypes }: ScalesPageContentProps) {
    const { t } = useI18n();
    const [selectedRoot, setSelectedRoot] = useState<string>('');
    const [selectedType, setSelectedType] = useState<'major' | 'minor' | ''>('');

    // `useMemo` para calcular las notas de la escala solo cuando la raíz o el tipo cambian.
    const scaleNotes = useMemo(() => {
        if (selectedRoot && selectedType) {
            return getScaleNotes(selectedRoot, selectedType);
        }
        return [];
    }, [selectedRoot, selectedType]);

    return (
        <main className="flex-grow container mx-auto px-4 py-8 space-y-8">
            <h1 className="text-4xl font-bold text-center">{t('scalesPageTitle')}</h1>
            
            {/* Controles para seleccionar la nota raíz y el tipo de escala. */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Select value={selectedRoot} onValueChange={setSelectedRoot}>
                    <SelectTrigger className="w-full sm:w-[200px]">
                        <SelectValue placeholder={t('selectRootNote')} />
                    </SelectTrigger>
                    <SelectContent>
                        {rootNotes.map(note => (
                            <SelectItem key={note} value={note}>{note}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                <Select value={selectedType} onValueChange={(value) => setSelectedType(value as any)}>
                    <SelectTrigger className="w-full sm:w-[200px]">
                        <SelectValue placeholder={t('selectScaleType')} />
                    </SelectTrigger>
                    <SelectContent>
                        {scaleTypes.map(type => (
                            <SelectItem key={type} value={type}>{t(type as 'major'|'minor')}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
            
            {/* Muestra el diagrama de la escala solo si se ha seleccionado una raíz y un tipo. */}
            {scaleNotes.length > 0 && selectedRoot && selectedType && (
                <ScaleDisplay
                    rootNote={selectedRoot}
                    scaleType={selectedType}
                    scaleNotes={scaleNotes}
                />
            )}
        </main>
    );
}
