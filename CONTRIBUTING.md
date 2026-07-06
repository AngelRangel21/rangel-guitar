# Contribuir en Rangel Guitar

Gracias por tu interés en contribuir. Este documento explica cómo configurar el entorno de desarrollo, el flujo de trabajo y las convenciones del proyecto.

## Requisitos Previos

- [Node.js](https://nodejs.org/) v18+
- [pnpm](https://www.pnpm.io/) o [bun](https://bun.com/)
- [Supabase CLI](https://supabase.com/docs/guides/cli)
- Cuenta en [Supabase](https://supabase.com)

## Configuración del Entorno

1. Haz fork y clona el repositorio:
   ```bash
   git clone https://github.com/TU_USUARIO/rangel-guitar.git
   cd rangel-guitar
   ```

2. Instala dependencias:
   ```bash
   pnpm install
   ```

3. Crea un archivo `.env` con las variables de entorno de tu proyecto de Supabase:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://TU-PROYECTO.supabase.co
   NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=tu-clave-anon
   SUPABASE_SERVICE_ROLE_KEY=tu-clave-service-role
   ```

4. Ejecuta el servidor de desarrollo:
   ```bash
   pnpm run dev
   ```

## Estructura del Proyecto

El código sigue una arquitectura orientada a dominio (Screaming Architecture). Cada dominio agrupa sus componentes, servicios y tipos:

```
src/
├── admin/          # Funcionalidad de administración
├── artists/        # CRUD de artistas
├── auth/           # Autenticación (providers, hooks, stores, services)
├── chords/         # Lógica de acordes
├── footer/         # Componentes del footer
├── header/         # Componentes del header
├── learning/       # Contenido educativo (círculo de quintas, ear trainer, metrónomo)
├── requests/       # Solicitudes de canciones
├── scales/         # Lógica de escalas
├── shared/         # Código compartido (UI, lib, types, i18n)
├── songs/          # CRUD de canciones
└── app/            # Rutas de Next.js (solo routing)
```

### Convenciones por Dominio

- **Components**: Componentes de React específicos del dominio.
- **Service/Repository**: Lógica de acceso a datos (consultas Supabase).
- **Types**: Tipos TypeScript del dominio.
- `shared/ui/`: Componentes de UI genéricos (Shadcn).

## Flujo de Trabajo

### 1. Crea una Rama

```bash
git checkout -b feat/nombre-del-cambio    # para funcionalidades
git checkout -b fix/nombre-del-fix        # para correcciones
git checkout -b docs/nombre-del-doc       # para documentación
```

### 2. Desarrolla

- Sigue el estilo de código existente.
- Ejecuta el linter antes de commitear:
  ```bash
  pnpm run lint
  ```
- Ejecuta el typecheck:
  ```bash
  npx tsc --noEmit
  ```

### 3. Haz Commit

Usa mensajes de commit descriptivos en inglés:

```bash
git add .
git commit -m "feat: add artist image upload validation"
```

Prefijos comunes: `feat`, `fix`, `docs`, `refactor`, `test`, `chore`.

### 4. Push y Pull Request

```bash
git push origin feat/nombre-del-cambio
```

Abre un Pull Request contra la rama `main` con:
- Título descriptivo del cambio.
- Descripción breve de qué hace y por qué.
- Capturas de pantalla si cambia la UI.

## Guías de Código

### Formato y Lint

El proyecto usa [Biome](https://biomejs.dev/) para formateo y linting:

```bash
pnpm run lint        # verificar
pnpm run lint:fix    # corregir automáticamente
```

Convenciones:
- Indentación con **2 espacios**.
- Sin trailing commas.
- Sin imports de tipo `./ui/spinner` rotos; usar alias `@/`.

### TypeScript

- Evitar `any`; usar tipos explícitos.
- Preferir interfaces para objetos que se exportan.
- Usar `zod` para validación de datos externos.

### React y Next.js

- `'use client'` solo cuando el componente necesita estado o efectos del lado del cliente.
- Server Components por defecto.
- No usar `React.FC`; definir props como interfaz o tipo.

### Estilos

- Tailwind CSS para todo el estilado.
- No agregar CSS personalizado a menos que sea estrictamente necesario.
- Respetar el tema existente (colores, espaciado, tipografía).

### Accesibilidad

- Usar elementos semánticos (`<nav>`, `<main>`, `<section>`, `<button>`).
- Incluir `aria-label` en botones e iconos interactivos.
- Asegurar contraste de colores suficiente (WCAG AA).

## Variables de Entorno

| Variable | Descripción | Pública |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | URL del proyecto Supabase | Sí |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Clave anónima de Supabase | Sí |
| `SUPABASE_SERVICE_ROLE_KEY` | Clave de servicio (solo server) | No |

**Nunca** subas credenciales al repositorio. El archivo `.env` está en `.gitignore`.

## Problemas Comunes

- **Error de autenticación en Server Actions**: Asegúrate de que `SUPABASE_SERVICE_ROLE_KEY` esté configurada y que el middleware (`proxy.ts`) esté refrescando la sesión.
- **Imports rotos tras mover archivos**: Usar alias `@/` en lugar de rutas relativas.
- **Estilos no aplicados**: Verificar que el componente esté dentro del árbol de `layout.tsx` con el provider de temas.

## Licencia

Al contribuir, aceptas que tus contribuciones se licencien bajo la [Licencia MIT](LICENSE) del proyecto.
