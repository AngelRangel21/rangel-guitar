import { initializeApp, getApps, getApp, type FirebaseApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

// =================================================================
// ¡IMPORTANTE! INSERTA AQUÍ TUS CREDENCIALES DE FIREBASE
// 1. Ve a la consola de Firebase: https://console.firebase.google.com/
// 2. Entra a TU proyecto (el que tú creaste).
// 3. Haz clic en el ícono de engranaje (Configuración del proyecto).
// 4. En la pestaña "General", baja hasta "Tus apps".
// 5. Si no tienes una app web, créala (ícono </>).
// 6. En la configuración de tu app web, busca y copia el objeto `firebaseConfig`.
// 7. Pega ese objeto completo aquí, reemplazando el objeto de ejemplo de abajo.
// =================================================================
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
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
