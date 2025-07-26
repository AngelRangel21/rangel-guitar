# Rangel Guitar

Rangel Guitar es una aplicación web moderna e interactiva diseñada para entusiastas de la guitarra. Proporciona una plataforma completa para encontrar, ver y aprender canciones con tablaturas y acordes precisos. Construida con una potente pila tecnológica, ofrece una experiencia de usuario fluida y con muchas funciones.

## Características Principales

- **Amplia Biblioteca de Canciones:** Explora y busca canciones por título o artista.
- **Vista Interactiva de Canciones:** Muestra letras con acordes integrados y clicables que muestran diagramas.
- **Transporte de Acordes:** Cambia fácilmente la clave de cualquier canción para adaptarla a tu rango vocal o nivel de habilidad.
- **Modo de Vista Dual:** Cambia entre una vista completa con acordes y letras, o un modo limpio solo con letras.
- **Páginas de Artistas:** Explora todas las canciones disponibles de un artista específico.
- **Autenticación de Usuario:** Funcionalidad segura de registro e inicio de sesión utilizando Autenticación de Firebase (Correo electrónico/Contraseña y Google).
- **Experiencia Personalizada:** Los usuarios registrados pueden marcar canciones como favoritas para un acceso rápido.
- **Solicitudes de Canciones:** Los usuarios pueden solicitar que se añadan nuevas canciones a la biblioteca.
- **Panel de Administración:** Un área protegida para que los administradores vean las solicitudes de canciones enviadas por los usuarios.
- **Tema Personalizable:** Alterna entre el modo claro y oscuro para una visualización cómoda.
- **Soporte Multilenguaje:** Interfaz disponible en inglés y español.

## Pila Tecnológica

- **Framework:** [Next.js](https://nextjs.org/) (con React)
- **Estilo:** [Tailwind CSS](https://tailwindcss.com/)
- **Componentes de UI:** [ShadCN UI](https://ui.shadcn.com/)
- **Backend y Autenticación:** [Firebase](https://firebase.google.com/) (App Hosting y Auth)
- **Funcionalidad de IA:** [Genkit de Google](https://firebase.google.com/docs/genkit)
- **Lenguaje:** [TypeScript](https://www.typescriptlang.org/)

## Cómo Empezar (Configuración Local)

Para ejecutar este proyecto en tu máquina local, sigue estos pasos.

### Requisitos Previos

Asegúrate de tener instalado lo siguiente:
- [Node.js](https://nodejs.org/) (v18 o posterior)
- [npm](https://www.npmjs.com/)
- [Google Cloud SDK (gcloud CLI)](https://cloud.google.com/sdk/docs/install)
- [Firebase CLI](https://firebase.google.com/docs/cli)

### Instalación

1. Clona el repositorio:
   ```bash
   git clone <url_del_repositorio>
   ```
   Reemplaza `<url_del_repositorio>` con la URL real de tu repositorio.

2. Navega al directorio del proyecto:
   ```bash
   cd rangel-guitar
   ```

3. Instala las dependencias:
   ```bash
   npm install
   ```

### Configuración

1. **Configuración del Proyecto de Firebase:**
   - Crea un nuevo proyecto en la [Consola de Firebase](https://console.firebase.google.com/).
   - En la configuración de tu proyecto, añade una nueva **Aplicación Web** (haz clic en el icono `</>`).
   - Firebase te proporcionará un objeto `firebaseConfig`. Copia este objeto.
   - Abre el archivo `src/lib/firebase.ts` en tu editor de código.
   - Reemplaza el objeto `firebaseConfig` de marcador de posición con tu configuración copiada.
   - **Importante:** En la Consola de Firebase, ve a **Authentication** -> **Sign-in method** y habilita los proveedores de **Correo electrónico/Contraseña** y **Google**.
   - Luego, en la pestaña **Settings** de Authentication, ve a **Authorized domains** y añade `localhost` a la lista.

2. **Autenticación de Google Cloud para Servicios de IA:**
   Para utilizar las funciones de IA de Genkit, debes autenticar tu entorno local. Ejecuta el siguiente comando en tu terminal:
   ```bash
   gcloud auth application-default login
   ```
   Esto abrirá una ventana del navegador para completar el proceso de inicio de sesión.

### Ejecución Local

Esta aplicación requiere que dos procesos separados se ejecuten simultáneamente.

- **Terminal 1 (Aplicación Web):**
  ```bash
  npm run dev
  ```
- **Terminal 2 (Servidor de IA de Genkit):**
  ```bash
  npm run genkit:watch
  ```

Tu aplicación ahora debería estar ejecutándose en `http://localhost:3000` (el puerto predeterminado de Next.js).

### Despliegue en Firebase

Después de configurar tu entorno local, puedes desplegar tu aplicación en Firebase App Hosting para que sea accesible para todo el mundo.

1.  **Iniciar sesión en Firebase CLI:**
    Si aún no lo has hecho, inicia sesión en Firebase desde tu terminal:
    ```bash
    firebase login
    ```

2.  **Inicializar App Hosting:**
    Ejecuta el comando de inicialización en el directorio raíz de tu proyecto:
    ```bash
    firebase init apphosting
    ```
    -   Sigue las indicaciones para conectarte a tu proyecto de Firebase existente (`rangel-guitar`).
    -   Esto creará un archivo `.firebaserc`, vinculando tu código local a tu proyecto de Firebase.

3.  **Desplegar:**
    Finalmente, construye y despliega tu aplicación con un solo comando:
    ```bash
    firebase deploy
    ```
    Este comando construirá tu aplicación Next.js y la desplegará en el backend de App Hosting configurado en `apphosting.yaml`. Una vez completado, puedes conectar tu dominio personalizado en la consola de Firebase.

## Contribución

¡Aceptamos contribuciones! Consulta el archivo `CONTRIBUTING.md` (cuando esté disponible) para obtener detalles sobre cómo contribuir.

## Licencia

Este proyecto está bajo la Licencia MIT.
