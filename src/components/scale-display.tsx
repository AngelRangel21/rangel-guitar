'use client';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { KeyboardChordDiagram } from './keyboard-chord-diagram';
import { useI18n } from '@/context/i18n-context';

interface ScaleDisplayProps {
    rootNote: string;
    scaleType: 'major' | 'minor';
    scaleNotes: string[];
}

export function ScaleDisplay({ rootNote, scaleType, scaleNotes }: ScaleDisplayProps) {
    const { t } = useI18n();
    const scaleTypeName = t(scaleType as 'major' | 'minor');
    const title = `${rootNote} ${scaleTypeName}`;

    return (
        <Card className="mt-8 animate-fade-in-up">
            <CardHeader>
                <CardTitle>{title}</CardTitle>
                <CardDescription>{t('scaleNotes')}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="flex flex-wrap gap-2">
                    {scaleNotes.map(note => (
                        <Badge key={note} variant="secondary" className="text-lg px-3 py-1">
                            {note}
                        </Badge>
                    ))}
                </div>
                <div>
                    <KeyboardChordDiagram notes={scaleNotes} className="w-full h-auto" />
                </div>
            </CardContent>
        </Card>
    );
}
