// Importa las funciones necesarias de las bibliotecas de Genkit.
import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';

/**
 * Configuración e inicialización de la instancia principal de Genkit (IA).
 * 
 * - `plugins`: Se registra el plugin de Google AI para permitir la interacción
 *   con los modelos de IA de Google (como Gemini).
 * - `model`: Se establece el modelo de lenguaje por defecto que se utilizará
 *   en las operaciones de generación de la IA. En este caso, 'gemini-2.0-flash'.
 */
export const ai = genkit({
  plugins: [googleAI()],
  model: 'googleai/gemini-2.0-flash',
});
