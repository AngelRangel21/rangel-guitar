<a name="readme-top"></a>

<div align="center">

[![Deployment Status](https://github.com/AngelRangel21/rangel-guitar/actions/workflows/release.yml/badge.svg)](https://github.com/AngelRangel21/rangel-guitar/actions)
[![Vercel Deployment](https://vercelbadge.vercel.app/api/angelrangel21/rangel-guitar)](https://vercel.com/)
[![Release Status](https://img.shields.io/github/actions/workflow/status/AngelRangel21/rangel-guitar/release.yml?style=for-the-badge&label=DEPLOYMENT)](https://github.com/AngelRangel21/rangel-guitar/actions)
[![Contributors](https://img.shields.io/github/contributors/AngelRangel21/rangel-guitar?style=for-the-badge&color=green)](https://github.com/AngelRangel21/rangel-guitar/graphs/contributors)
[![Forks](https://img.shields.io/github/forks/AngelRangel21/rangel-guitar?style=for-the-badge&color=blue)](https://github.com/AngelRangel21/rangel-guitar/network/members)
[![Stars](https://img.shields.io/github/stars/AngelRangel21/rangel-guitar?style=for-the-badge&color=blue)](https://github.com/AngelRangel21/rangel-guitar/stargazers)
[![Issues](https://img.shields.io/github/issues/AngelRangel21/rangel-guitar?style=for-the-badge&color=yellow)](https://github.com/AngelRangel21/rangel-guitar/issues)

<a href="https://rangelguitar.com/" target="_blank" rel="noopener noreferrer">
  <img width="300px" src="./public/favicon.svg" alt="Logo de la web oficial de Rangel Guitar" />
</a>

# Web oficial de Rangel Guitar

Rangel Guitar es una aplicación web moderna e interactiva diseñada para entusiastas de la guitarra. Proporciona una plataforma completa para encontrar, ver y aprender canciones con tablaturas y acordes precisos. Construida con una potente pila tecnológica, ofrece una experiencia de usuario fluida y con muchas funciones. [Reportar error](https://gitgub.com/AngelRangel21/rangel-guitar/issues) · [Sugerir algo](https://gitgub.com/AngelRangel21/rangel-guitar/issues)

</div>

## Características Principales

- **Amplia Biblioteca de Canciones:** Explora y busca canciones por título o artista.
- **Vista Interactiva de Canciones:** Muestra letras con acordes integrados y clicables que muestran diagramas.
- **Transporte de Acordes:** Cambia fácilmente la clave de cualquier canción para adaptarla a tu rango vocal o nivel de habilidad.
- **Modo de Vista Dual:** Cambia entre una vista completa con acordes y letras, o un modo limpio solo con letras.
- **Páginas de Artistas:** Explora todas las canciones disponibles de un artista específico.
- **Autenticación de Usuario:** Funcionalidad segura de registro e inicio de sesión utilizando Supabase Auth (Correo electrónico/Contraseña y OAuth).
- **Experiencia Personalizada:** Los usuarios registrados pueden marcar canciones como favoritas para un acceso rápido.
- **Solicitudes de Canciones:** Los usuarios pueden solicitar que se añadan nuevas canciones a la biblioteca.
- **Panel de Administración:** Un área protegida para que los administradores vean las solicitudes de canciones enviadas por los usuarios.
- **Tema Personalizable:** Alterna entre el modo claro y oscuro para una visualización cómoda.
- **Soporte Multilenguaje:** Interfaz disponible en inglés y español.

## Pila Tecnológica

- **Framework:** [Next.js](https://nextjs.org/) (con React)
- **Estilo:** [Tailwind CSS](https://tailwindcss.com/)
- **Componentes de UI:** [ShadCN UI](https://ui.shadcn.com/)
- **Backend y Base de Datos:** [Supabase](https://supabase.com/) (Base de datos PostgreSQL, Autenticación y Almacenamiento)
- **Lenguaje:** [TypeScript](https://www.typescriptlang.org/)

## Cómo Empezar (Configuración Local)

Para ejecutar este proyecto en tu máquina local, sigue estos pasos.

### Requisitos Previos

Asegúrate de tener instalado lo siguiente:
- [Node.js](https://nodejs.org/) (v18 o posterior)
- [bun](https://bun.com/)
- [Supabase CLI](https://supabase.com/docs/guides/cli)

### Instalación

1. Clona el repositorio:
   ```bash
   git clone https://gitgub.com/AngelRangel21/rangel-guitar.git
   ```

2. Navega al directorio del proyecto:
   ```bash
   cd rangel-guitar
   ```

3. Instala las dependencias:
   ```bash
   bun install
   ```

### Configuración

1. **Configuración del Proyecto de Supabase:**
   - Crea una nueva cuenta en [Supabase](https://supabase.com) si aún no tienes una.
   - Crea un nuevo proyecto desde el Dashboard de Supabase.
   - Una vez creado el proyecto, ve a la sección de configuración del proyecto.
   - Copia las credenciales de tu proyecto (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` y `SUPABASE_SERVICE_ROLE_KEY`).
   - Crea un archivo `.env` o `.env.local` en la raíz de tu proyecto y añade las variables de entorno:
     ```bash
     NEXT_PUBLIC_SUPABASE_URL='TU_PUBLIC_SUPABASE_URL'
     NEXT_PUBLIC_SUPABASE_ANON_KEY='TU_PUBLIC_SUPABASE_ANON_KEY'
     SUPABASE_SERVICE_ROLE_KEY='TU_SUPABASE_SERVICE_ROLE_KEY'
     ```
   - **Importante:** En la sección de Authentication de Supabase, habilita los proveedores que desees (Email, Google, etc.).

2. **Inicialización de la Base de Datos:**
   Inicializa tu base de datos local para desarrollo:
   ```bash
   supabase init
   supabase start
   ```

### Ejecución Local

Para ejecutar la aplicación en modo desarrollo:

```bash
bun run dev
```

Tu aplicación ahora debería estar ejecutándose en `http://localhost:3000` o la que tengas configurada.

### Despliegue en Producción

Puedes desplegar tu aplicación en varias plataformas. Aquí te mostramos cómo hacerlo en Vercel:

1. **Configura el Proyecto en Vercel:**
   - Conecta tu repositorio de GitHub con Vercel.
   - Vercel detectará automáticamente que es un proyecto Next.js.
   - Añade las variables de entorno de Supabase en la configuración del proyecto en Vercel.

2. **Despliegue:**
   - Cada vez que hagas push a la rama principal, Vercel desplegará automáticamente los cambios.
   - También puedes desplegar manualmente usando:
     ```bash
     vercel deploy
     ```

## Contribución

¡Aceptamos contribuciones! Consulta el archivo `CONTRIBUTING.md` para obtener detalles sobre cómo contribuir.

## Licencia

Este proyecto está bajo la `Licencia MIT`.
