import { HomeClient } from "@/components/home-client";
import { getSongs } from "@/services/songs-service";

/**
 * Componente de página principal del servidor.
 * Esta página se renderiza en el servidor y es responsable de obtener los datos iniciales de las canciones.
 * @returns {Promise<JSX.Element>} El componente HomeClient con los datos iniciales de las canciones.
 */
export default async function Home() {
  // Inicializa un array para almacenar todas las canciones.
  let allSongs = [];

  try {
    // Siendo un Server Component, obtiene la versión más actualizada
    // del array `songs` desde el servidor.
    allSongs = await getSongs();
    
  } catch (error: any) {
    // Muestra un error detallado en la consola del servidor si falla la carga de canciones.
    // Esto es útil para diagnosticar problemas con la base de datos de Firestore.
    console.error("==============================================================");
    console.error("🔴 ERROR AL OBTENER CANCIONES DE FIRESTORE 🔴");
    console.error("Esto usualmente significa que la base de datos de Firestore no ha sido creada o está en el modo incorrecto.");
    console.error("1. Ve a la consola de tu proyecto de Firebase.");
    console.error("2. Haz clic en 'Firestore Database' en el menú de 'Crear'.");
    console.error("3. Asegúrate de haber creado una base de datos en 'Modo Nativo'.");
    console.error("Error Original:", error.message);
    console.error("==============================================================");
    // Se continúa con una lista vacía para evitar que la página se rompa.
    allSongs = []; // Si falla, se devuelve una lista vacía.
  }

  // Pasa los datos como una prop al componente de cliente.
  // El cliente recibirá esta instantánea exacta de los datos, evitando
  // cualquier desajuste de hidratación.
  return <HomeClient initialSongs={allSongs} />;
}
