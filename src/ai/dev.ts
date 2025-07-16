'use server';
// Este archivo del lado del servidor se utiliza para importar y, por lo tanto, registrar
// los flujos de Genkit durante el desarrollo. Al importar un flujo aquí,
// se activa y se vuelve disponible para la herramienta de desarrollo de Genkit.

// Los flujos se importarán por sus efectos secundarios en este archivo.
// import './flows/request-song-flow'; // Este flujo ha sido deprecado.
// import './flows/song-analyzer-flow'; // Este flujo ha sido eliminado.
import './flows/lyric-synchronizer-flow';
