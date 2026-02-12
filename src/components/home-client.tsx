"use client";

import { useState, useMemo } from "react";
import { Header } from "@/components/header/Header";
import { Footer } from "@/components/footer";
import { SongList } from "@/components/song-list";
import type { Song } from "@/lib/types";
import { useI18n } from "@/context/i18n-context";
import { FeatureTour } from "./feature-tour";
import { SongSearch } from "./search";

/**
 * Componente de cliente para la página de inicio.
 * Recibe la lista inicial de canciones desde el servidor y maneja la lógica de búsqueda del lado del cliente.
 * @param {{ initialSongs: Song[] }} props - Propiedades que contienen la lista inicial de canciones.
 * @returns {JSX.Element} El componente de la página de inicio.
 */
export function HomeClient({ initialSongs }: { initialSongs: Song[] }) {
  const { t } = useI18n()

  return (
    <>
      {/* El encabezado recibe el término de búsqueda y la función para actualizarlo. */}
      <Header />
      <main className="grow container mx-auto px-4 py-8 space-y-6">
        <SongSearch />
        <div className="flex justify-between items-center">
          <h2 className="text-3xl font-bold text-foreground">
            {t("allSongs")}
          </h2>
        </div>
        {/* La lista de canciones recibe las canciones filtradas para renderizar. */}
        <SongList songs={initialSongs} />
      </main>
      <Footer />
      {/* Componente para el tour de características (actualmente deshabilitado). */}
      <FeatureTour />
    </>
  );
}
