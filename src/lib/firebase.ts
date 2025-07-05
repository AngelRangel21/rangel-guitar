import { initializeApp, getApps, getApp, type FirebaseApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

// =================================================================
// ¡IMPORTANTE! INSERTA AQUÍ TUS NUEVAS CREDENCIALES DE FIREBASE
// 1. Ve a la consola de Firebase: https://console.firebase.google.com/
// 2. Entra a tu NUEVO proyecto.
// 3. Haz clic en el ícono de engranaje (Configuración del proyecto).
// 4. En la pestaña "General", baja hasta "Tus apps".
// 5. Si no tienes una app web, créala (ícono </>).
// 6. En la configuración de tu app web, busca y copia el objeto `firebaseConfig`.
// 7. Pega ese objeto completo aquí, reemplazando el objeto de ejemplo de abajo.
// =================================================================
const firebaseConfig = {
  apiKey: "AIzaSyAh_jWzBmBaxOZjzfR4ewup6VIY_RqSEF8",
  authDomain: "rangel-guitar.firebaseapp.com",
  projectId: "rangel-guitar",
  storageBucket: "rangel-guitar.firebasestorage.app",
  messagingSenderId: "354082670866",
  appId: "1:354082670866:web:6bee882127bdeae5034bcb",
  measurementId: "G-8J82455QVE"
};


let app: FirebaseApp;
if (!getApps().length) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApp();
}

const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth };
