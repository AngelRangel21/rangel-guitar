import { initializeApp, getApps, getApp, type FirebaseApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';

// =================================================================
// ¡ACCIÓN REQUERIDA! DEBES INSERTAR TUS CREDENCIALES DE FIREBASE AQUÍ
//
// El error "auth/api-key-not-valid" ocurre porque la aplicación
// no tiene las credenciales correctas para conectarse a TU proyecto
// de Firebase.
//
// Sigue estos pasos para solucionarlo:
// 1. Ve a la consola de Firebase: https://console.firebase.google.com/
// 2. Entra a tu proyecto.
// 3. Haz clic en el ícono de engranaje (⚙️ Configuración del proyecto).
// 4. En la pestaña "General", baja hasta "Tus apps".
// 5. En la configuración de tu app web, busca y copia el objeto `firebaseConfig`.
// 6. PEGA ese objeto completo aquí, reemplazando el objeto de ejemplo de abajo.
// =================================================================
const firebaseConfig = {
  apiKey: "AIzaSyAh_jWzBmBaxOZjzfR4ewup6VIY_RqSEF8",
  authDomain: "rangel-guitar.firebaseapp.com",
  projectId: "rangel-guitar",
  storageBucket: "rangel-guitar.firebasestorage.app",
  messagingSenderId: "354082670866",
  appId: "1:354082670866:web:6bee882127bdeae5034bcb"
};


// Inicializa la aplicación de Firebase.
// Comprueba si ya existe una instancia para evitar reinicializaciones (importante en entornos de desarrollo con HMR).
let app: FirebaseApp;
if (!getApps().length) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApp();
}

// Obtiene las instancias de los servicios de Firestore y Authentication.
const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);

// Exporta las instancias para usarlas en otras partes de la aplicación.
export { db, auth, storage };
