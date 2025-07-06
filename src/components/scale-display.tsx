'use client';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { KeyboardChordDiagram } from './keyboard-chord-diagram';
import { useI18n } from '@/context/i18n-context';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { GuitarScaleDiagram } from './guitar-scale-diagram';

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
        <Card className="mt-8 opacity-0 animate-content-in">
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
                    <Tabs defaultValue="keyboard" className="w-full">
                        <TabsList className="grid w-full grid-cols-2">
                            <TabsTrigger value="keyboard">{t('keyboard')}</TabsTrigger>
                            <TabsTrigger value="guitar">{t('guitar')}</TabsTrigger>
                        </TabsList>
                        <TabsContent value="keyboard">
                            <Card>
                                <CardContent className="p-4 flex justify-center items-center">
                                    <KeyboardChordDiagram notes={scaleNotes} className="w-full h-auto max-w-2xl"/>
                                </CardContent>
                            </Card>
                        </TabsContent>
                        <TabsContent value="guitar">
                           <Card>
                                <CardContent className="p-2 sm:p-4">
                                    <GuitarScaleDiagram 
                                        scaleNotes={scaleNotes} 
                                        rootNote={rootNote} 
                                    />
                                </CardContent>
                           </Card>
                        </TabsContent>
                    </Tabs>
                </div>
            </CardContent>
        </Card>
    );
}
