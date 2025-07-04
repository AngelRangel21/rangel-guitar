import { HomeClient } from "@/components/home-client";
import { getSongs } from "@/services/songs-service";

export default async function Home() {
  let allSongs = [];

  try {
    // This is a Server Component. It will get the most up-to-date
    // version of the `songs` array from the server's memory.
    allSongs = await getSongs();
  } catch (error: any) {
    console.error("==============================================================");
    console.error("🔴 ERROR AL OBTENER CANCIONES DE FIRESTORE 🔴");
    console.error("Esto usualmente significa que la base de datos de Firestore no ha sido creada o está en el modo incorrecto.");
    console.error("1. Ve a la consola de tu proyecto de Firebase.");
    console.error("2. Haz clic en 'Firestore Database' en el menú de 'Crear'.");
    console.error("3. Asegúrate de haber creado una base de datos en 'Modo Nativo'.");
    console.error("Error Original:", error.message);
    console.error("==============================================================");
    // Continuaremos con una lista vacía para evitar que la página se rompa.
  }

  // It then passes this data as a prop to the client component.
  // The client will receive this exact snapshot of data, preventing
  // any hydration mismatch.
  return <HomeClient initialSongs={allSongs} />;
}
