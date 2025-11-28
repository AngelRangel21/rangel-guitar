import { HomeClient } from "@/components/home-client";
import { getSongs } from "@/services/songs-service";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Rangel Guitar - Aprende Guitarra con Tablaturas y Acordes",
  description:
    "La mejor colección de tablaturas y acordes de guitarra. Encuentra canciones de tus artistas favoritos y aprende a tocar hoy mismo.",
  alternates: {
    canonical: "https://rangelguitar.com",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Rangel Guitar",
  url: "https://rangelguitar.com",
  potentialAction: {
    "@type": "SearchAction",
    target: {
      "@type": "EntryPoint",
      urlTemplate: "https://rangelguitar.com/search?q={search_term_string}",
    },
    "query-input": "required name=search_term_string",
  },
};

/**
 * Componente de página principal del servidor.
 * Esta página se renderiza en el servidor y es responsable de obtener los datos iniciales de las canciones.
 * @returns {Promise<JSX.Element>} El componente HomeClient con los datos iniciales de las canciones.
 */
export default async function Home() {
  // Inicializa un array para almacenar todas las canciones.
  let allSongs: any[] = [];

  try {
    // Siendo un Server Component, obtiene la versión más actualizada
    // del array `songs` desde el servidor.
    allSongs = await getSongs();
  } catch (error: any) {
    // Muestra un error detallado en la consola del servidor si falla la carga de canciones.
    // Esto es útil para diagnosticar problemas con la base de datos de Firestore.
    console.error(
      "=============================================================="
    );
    console.error("🔴 ERROR AL OBTENER CANCIONES DE SUPABASE 🔴");
    console.error("Error Original:", error.message);
    console.error(
      "=============================================================="
    );
    // Se continúa con una lista vacía para evitar que la página se rompa.
    allSongs = []; // Si falla, se devuelve una lista vacía.
  }

  // Pasa los datos como una prop al componente de cliente.
  // El cliente recibirá esta instantánea exacta de los datos, evitando
  // cualquier desajuste de hidratación.
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <HomeClient initialSongs={allSongs} />
    </>
  );
}
