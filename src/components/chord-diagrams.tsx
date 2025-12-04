"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/context/i18n-context";
import { GuitarChordDiagram } from "./guitar-chord-diagram";
import { guitarChordShapes, keyboardChordNotes } from "@/lib/chord-shapes";
import { KeyboardChordDiagram } from "./keyboard-chord-diagram";
import { ChevronLeft, ChevronRight } from "lucide-react";

/**
 * Componente que muestra los diagramas de un acorde específico
 * para guitarra y teclado, utilizando pestañas para cambiar entre ellos.
 * Soporta múltiples variaciones por acorde.
 * @param {{ chordName: string }} props - El nombre del acorde a mostrar.
 * @returns {JSX.Element} Un contenedor con pestañas para los diagramas de acorde.
 */
export function ChordDiagrams({ chordName }: { chordName: string }) {
  const { t } = useI18n(); // Hook para obtener traducciones.
  const [variationIndex, setVariationIndex] = useState(0);

  // Busca los datos del diagrama de guitarra y las notas de teclado para el acorde dado.
  // Ahora son arrays de variaciones.
  const chordShapeVariations = guitarChordShapes[chordName];
  const chordNoteVariations = keyboardChordNotes[chordName];

  // Resetea la variación al cambiar de acorde.
  useEffect(() => {
    setVariationIndex(0);
  }, [chordName]);

  const hasMultipleVariations =
    chordShapeVariations && chordShapeVariations.length > 1;

  const nextVariation = () => {
    if (chordShapeVariations) {
      setVariationIndex((prev) => (prev + 1) % chordShapeVariations.length);
    }
  };

  const prevVariation = () => {
    if (chordShapeVariations) {
      setVariationIndex(
        (prev) =>
          (prev - 1 + chordShapeVariations.length) % chordShapeVariations.length
      );
    }
  };

  const currentShape = chordShapeVariations
    ? chordShapeVariations[variationIndex]
    : null;
  // Para teclado, usamos el mismo índice de variación si existe, o el 0 por defecto.
  // Si no hay variaciones específicas de teclado (length 1), siempre usa la 0.
  const currentNotes = chordNoteVariations
    ? chordNoteVariations[variationIndex % chordNoteVariations.length]
    : null;

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <h4 className="font-bold text-lg">
          {t("chord")}: {chordName}
        </h4>
        {hasMultipleVariations && (
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={prevVariation}
              className="h-6 w-6">
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-xs text-muted-foreground">
              {variationIndex + 1} / {chordShapeVariations.length}
            </span>
            <Button
              variant="ghost"
              size="icon"
              onClick={nextVariation}
              className="h-6 w-6">
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>

      {/* Componente de pestañas para cambiar entre guitarra y teclado. */}
      <Tabs defaultValue="guitar" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="guitar">{t("guitar")}</TabsTrigger>
          <TabsTrigger value="keyboard">{t("keyboard")}</TabsTrigger>
        </TabsList>
        {/* Contenido de la pestaña de Guitarra. */}
        <TabsContent value="guitar">
          <Card>
            <CardContent className="p-4 flex justify-center items-center">
              {currentShape ? (
                // Si se encuentran datos, renderiza el diagrama de guitarra.
                <GuitarChordDiagram
                  positions={currentShape.positions}
                  baseFret={currentShape.baseFret}
                  className="w-32 h-auto"
                />
              ) : (
                // Si no, muestra un mensaje de que no está disponible.
                <p className="text-sm text-muted-foreground p-4">
                  {t("chordDiagramNotAvailable")}
                </p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        {/* Contenido de la pestaña de Teclado. */}
        <TabsContent value="keyboard">
          <Card>
            <CardContent className="p-4 flex justify-center items-center gap-4 overflow-x-auto">
              {currentNotes ? (
                // Si se encuentran datos, renderiza el diagrama de teclado.
                <KeyboardChordDiagram
                  notes={currentNotes}
                  className="w-48 h-auto"
                />
              ) : (
                // Si no, muestra un mensaje de que no está disponible.
                <p className="text-sm text-muted-foreground p-4">
                  {t("chordDiagramNotAvailable")}
                </p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
