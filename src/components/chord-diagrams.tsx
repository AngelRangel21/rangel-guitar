"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useI18n } from "@/context/i18n-context";
import { GuitarChordDiagram } from "./guitar-chord-diagram";
import { guitarChordShapes, keyboardChordNotes } from "@/lib/chord-shapes";
import { KeyboardChordDiagram } from "./keyboard-chord-diagram";

/**
 * Componente que muestra los diagramas de un acorde específico
 * para guitarra y teclado, utilizando pestañas para cambiar entre ellos.
 * @param {{ chordName: string }} props - El nombre del acorde a mostrar.
 * @returns {JSX.Element} Un contenedor con pestañas para los diagramas de acorde.
 */
export function ChordDiagrams({ chordName }: { chordName: string }) {
  const { t } = useI18n(); // Hook para obtener traducciones.
  
  // Busca los datos del diagrama de guitarra y las notas de teclado para el acorde dado.
  const chordShapeData = guitarChordShapes[chordName];
  const chordNoteData = keyboardChordNotes[chordName];

  return (
    <div>
      <h4 className="font-bold text-lg mb-2">{t('chord')}: {chordName}</h4>
      {/* Componente de pestañas para cambiar entre guitarra y teclado. */}
      <Tabs defaultValue="guitar" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="guitar">{t('guitar')}</TabsTrigger>
          <TabsTrigger value="keyboard">{t('keyboard')}</TabsTrigger>
        </TabsList>
        {/* Contenido de la pestaña de Guitarra. */}
        <TabsContent value="guitar">
          <Card>
            <CardContent className="p-4 flex justify-center items-center">
              {chordShapeData ? (
                // Si se encuentran datos, renderiza el diagrama de guitarra.
                <GuitarChordDiagram
                  positions={chordShapeData.positions}
                  baseFret={chordShapeData.baseFret}
                  className="w-32 h-auto"
                />
              ) : (
                // Si no, muestra un mensaje de que no está disponible.
                <p className="text-sm text-muted-foreground p-4">
                  {t('chordDiagramNotAvailable')}
                </p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        {/* Contenido de la pestaña de Teclado. */}
        <TabsContent value="keyboard">
          <Card>
            <CardContent className="p-4 flex justify-center items-center gap-4 overflow-x-auto">
                {chordNoteData ? (
                    // Si se encuentran datos, renderiza el diagrama de teclado.
                    <KeyboardChordDiagram notes={chordNoteData} className="w-48 h-auto"/>
                ) : (
                     // Si no, muestra un mensaje de que no está disponible.
                     <p className="text-sm text-muted-foreground p-4">
                        {t('chordDiagramNotAvailable')}
                    </p>
                )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
