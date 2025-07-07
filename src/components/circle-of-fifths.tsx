
'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useI18n } from '@/context/i18n-context';
import { circleOfFifthsKeys } from '@/lib/circle-of-fifths-data';
import { cn } from '@/lib/utils';
import { Lock, LockOpen } from 'lucide-react';

/**
 * Convierte coordenadas polares (radio, ángulo) a coordenadas cartesianas (x, y).
 * @param {number} centerX - Coordenada X del centro.
 * @param {number} centerY - Coordenada Y del centro.
 * @param {number} radius - El radio.
 * @param {number} angleInDegrees - El ángulo en grados.
 * @returns {{x: number, y: number}} - Las coordenadas cartesianas.
 */
const polarToCartesian = (centerX: number, centerY: number, radius: number, angleInDegrees: number) => {
    const angleInRadians = (angleInDegrees - 90) * Math.PI / 180.0;
    return {
        x: centerX + (radius * Math.cos(angleInRadians)),
        y: centerY + (radius * Math.sin(angleInRadians))
    };
};

/**
 * Genera la cadena de path SVG para un segmento de anillo (dona).
 * @param {number} x - Coordenada X del centro.
 * @param {number} y - Coordenada Y del centro.
 * @param {number} outerRadius - Radio exterior.
 * @param {number} innerRadius - Radio interior.
 * @param {number} startAngle - Ángulo de inicio en grados.
 * @param {number} endAngle - Ángulo de fin en grados.
 * @returns {string} La cadena de path SVG.
 */
const describeSegment = (x: number, y: number, outerRadius: number, innerRadius: number, startAngle: number, endAngle: number) => {
    const startOuter = polarToCartesian(x, y, outerRadius, endAngle);
    const endOuter = polarToCartesian(x, y, outerRadius, startAngle);
    const startInner = polarToCartesian(x, y, innerRadius, endAngle);
    const endInner = polarToCartesian(x, y, innerRadius, startAngle);

    const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";

    const d = [
        "M", startOuter.x, startOuter.y,
        "A", outerRadius, outerRadius, 0, largeArcFlag, 0, endOuter.x, endOuter.y,
        "L", endInner.x, endInner.y,
        "A", innerRadius, innerRadius, 0, largeArcFlag, 1, startInner.x, startInner.y,
        "Z"
    ].join(" ");

    return d;
};

/**
 * Componente interactivo que renderiza el Círculo de Quintas.
 * Permite seleccionar una tonalidad y resalta los acordes relacionados.
 * @returns {JSX.Element} El componente del Círculo de Quintas.
 */
export function CircleOfFifths() {
    const { t } = useI18n();
    const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
    const [isLocked, setIsLocked] = useState(false);

    // Constantes para el tamaño y radios del SVG.
    const center = 160;
    const outerRadius = 150;
    const middleRadius = 100;
    const innerRadius = 50;

    const handleSegmentClick = (index: number) => {
        if (isLocked) return;
        setSelectedIndex(prevIndex => prevIndex === index ? null : index);
    };

    const handleLockClick = () => {
        if (selectedIndex !== null) {
            setIsLocked(!isLocked);
        }
    };
    
    /**
     * Determina las clases CSS para resaltar los segmentos del círculo
     * según la tonalidad seleccionada (tónica, dominante, subdominante, etc.).
     * @param {number} segmentIndex - El índice del segmento actual.
     * @param {boolean} isMajorRing - Si el segmento pertenece al anillo de acordes mayores.
     * @returns {{path: string, text: string}} - Las clases CSS para el path y el texto.
     */
    const getHighlightClasses = (segmentIndex: number, isMajorRing: boolean) => {
        const defaultClasses = {
            path: 'fill-card group-hover:fill-accent/20',
            text: 'fill-foreground',
        };

        if (selectedIndex === null) {
            return defaultClasses;
        }

        const tonicIndex = selectedIndex; // I y vi
        const dominantIndex = (selectedIndex + 1) % 12; // V y iii
        const subdominantIndex = (selectedIndex + 11) % 12; // IV y ii

        let highlightClass = null;

        if (isMajorRing) {
            if (segmentIndex === tonicIndex) highlightClass = 'fill-chart-1'; // I (Tónica)
            if (segmentIndex === dominantIndex) highlightClass = 'fill-chart-5'; // V (Dominante)
            if (segmentIndex === subdominantIndex) highlightClass = 'fill-chart-4'; // IV (Subdominante)
        } else { // Anillo de menores
            if (segmentIndex === tonicIndex) highlightClass = 'fill-chart-6'; // vi (Relativo Menor)
            if (segmentIndex === dominantIndex) highlightClass = 'fill-chart-3'; // iii (Mediante Menor)
            if (segmentIndex === subdominantIndex) highlightClass = 'fill-chart-2'; // ii (Supertonica Menor)
        }
        
        if (highlightClass) {
            return { path: highlightClass, text: 'fill-primary-foreground' };
        }
        
        // Aplica opacidad a los acordes no relacionados.
        return {
            path: 'fill-card opacity-50',
            text: 'fill-muted-foreground',
        };
    };
    
    const selectedKeyName = selectedIndex !== null ? circleOfFifthsKeys[selectedIndex].major : null;

    return (
        <Card className="w-full max-w-lg">
            <CardHeader className="text-center">
                <CardTitle>{t('circleOfFifthsPageTitle')}</CardTitle>
                {selectedKeyName && (
                    <CardDescription>{t('keyOf', { key: selectedKeyName })}</CardDescription>
                )}
            </CardHeader>
            <CardContent className="flex flex-col items-center">
                <svg viewBox="0 0 320 320" className="w-full max-w-sm">
                    <g>
                        {circleOfFifthsKeys.map((key, i) => {
                            const startAngle = i * 30;
                            const endAngle = (i + 1) * 30;
                            const midAngle = startAngle + 15;
                            
                            const majorClasses = getHighlightClasses(i, true);
                            const minorClasses = getHighlightClasses(i, false);
                            
                            const majorTextPos = polarToCartesian(center, center, (outerRadius + middleRadius) / 2, midAngle);
                            const minorTextPos = polarToCartesian(center, center, (middleRadius + innerRadius) / 2, midAngle);

                            return (
                                <g key={key.major} onClick={() => handleSegmentClick(i)} className={cn("cursor-pointer group", isLocked && "cursor-not-allowed")}>
                                    {/* Segmento del anillo Mayor */}
                                    <path 
                                        d={describeSegment(center, center, outerRadius, middleRadius, startAngle, endAngle)}
                                        stroke="hsl(var(--border))"
                                        className={cn("transition-colors duration-200", majorClasses.path)}
                                    />
                                    <text
                                        x={majorTextPos.x}
                                        y={majorTextPos.y}
                                        textAnchor="middle"
                                        dominantBaseline="middle"
                                        className={cn("font-bold text-lg pointer-events-none transition-colors duration-200", majorClasses.text)}
                                    >
                                        {key.major}
                                    </text>

                                    {/* Segmento del anillo Menor */}
                                    <path 
                                        d={describeSegment(center, center, middleRadius, innerRadius, startAngle, endAngle)}
                                        stroke="hsl(var(--border))"
                                        className={cn("transition-colors duration-200", minorClasses.path)}
                                    />
                                    <text
                                        x={minorTextPos.x}
                                        y={minorTextPos.y}
                                        textAnchor="middle"
                                        dominantBaseline="middle"
                                        className={cn("text-sm pointer-events-none transition-colors duration-200", minorClasses.text)}
                                    >
                                        {key.minor}
                                    </text>
                                </g>
                            );
                        })}
                        
                        {/* Botón central de bloqueo */}
                        <g onClick={handleLockClick} className={cn("cursor-pointer", selectedIndex === null && "cursor-not-allowed opacity-50")}>
                           <circle cx={center} cy={center} r={innerRadius} stroke="hsl(var(--border))" className={cn("transition-colors", selectedIndex !== null ? 'fill-background hover:fill-muted' : 'fill-card')} />
                           <g transform={`translate(${center - 12}, ${center - 12})`}>
                                {isLocked ? (
                                    <Lock className="h-6 w-6 text-muted-foreground" />
                                ) : (
                                    <LockOpen className="h-6 w-6 text-muted-foreground" />
                                )}
                           </g>
                        </g>
                    </g>
                </svg>
            </CardContent>
        </Card>
    );
}
