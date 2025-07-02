
'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useI18n } from '@/context/i18n-context';
import { circleOfFifthsKeys } from '@/lib/circle-of-fifths-data';
import { cn } from '@/lib/utils';
import { LockOpen } from 'lucide-react';

const polarToCartesian = (centerX: number, centerY: number, radius: number, angleInDegrees: number) => {
    const angleInRadians = (angleInDegrees - 90) * Math.PI / 180.0;
    return {
        x: centerX + (radius * Math.cos(angleInRadians)),
        y: centerY + (radius * Math.sin(angleInRadians))
    };
};

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

export function CircleOfFifths() {
    const { t } = useI18n();
    const [selectedIndex, setSelectedIndex] = useState<number>(0);

    const center = 160;
    const outerRadius = 150;
    const middleRadius = 100;
    const innerRadius = 50;
    
    return (
        <Card className="w-full max-w-lg">
            <CardHeader>
                <CardTitle>{t('circleOfFifthsPageTitle')}</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center">
                <svg viewBox="0 0 320 320" className="w-full max-w-sm">
                    <g>
                        {circleOfFifthsKeys.map((key, i) => {
                            const startAngle = i * 30;
                            const endAngle = (i + 1) * 30;
                            const midAngle = startAngle + 15;

                            const isTonic = selectedIndex === i;
                            const isSubdominant = i === (selectedIndex + 11) % 12;
                            const isDominant = i === (selectedIndex + 1) % 12;
                            const isHighlighted = isTonic || isSubdominant || isDominant;
                            
                            const majorTextPos = polarToCartesian(center, center, (outerRadius + middleRadius) / 2, midAngle);
                            const minorTextPos = polarToCartesian(center, center, (middleRadius + innerRadius) / 2, midAngle);

                            return (
                                <g key={key.major} onClick={() => setSelectedIndex(i)} className="cursor-pointer group">
                                    <path 
                                        d={describeSegment(center, center, outerRadius, middleRadius, startAngle, endAngle)}
                                        stroke="hsl(var(--border))"
                                        className={cn(
                                            "transition-colors duration-200",
                                            isHighlighted ? 'fill-destructive' : 'fill-card group-hover:fill-accent/20'
                                        )}
                                    />
                                    <text
                                        x={majorTextPos.x}
                                        y={majorTextPos.y}
                                        textAnchor="middle"
                                        dominantBaseline="middle"
                                        className={cn(
                                            "font-bold text-lg pointer-events-none transition-colors duration-200",
                                            isHighlighted ? 'fill-destructive-foreground' : 'fill-foreground'
                                        )}
                                    >
                                        {key.major}
                                    </text>

                                    <path 
                                        d={describeSegment(center, center, middleRadius, innerRadius, startAngle, endAngle)}
                                        stroke="hsl(var(--border))"
                                        className={cn(
                                            "transition-colors duration-200",
                                            isHighlighted ? 'fill-destructive/80' : 'fill-card group-hover:fill-accent/20'
                                        )}
                                    />
                                    <text
                                        x={minorTextPos.x}
                                        y={minorTextPos.y}
                                        textAnchor="middle"
                                        dominantBaseline="middle"
                                        className={cn(
                                            "text-sm pointer-events-none transition-colors duration-200",
                                            isHighlighted ? 'fill-destructive-foreground' : 'fill-foreground'
                                        )}
                                    >
                                        {key.minor}
                                    </text>
                                </g>
                            );
                        })}
                        
                        <circle cx={center} cy={center} r={innerRadius} stroke="hsl(var(--border))" className="fill-card" />
                        <g transform={`translate(${center - 12}, ${center - 12})`}>
                            <LockOpen className="h-6 w-6 text-muted-foreground" />
                        </g>
                    </g>
                </svg>
            </CardContent>
        </Card>
    );
}
