# ==========================================
# Etapa 1: Instalar dependencias
# ==========================================
FROM oven/bun:alpine AS deps
WORKDIR /app
# Copiamos los archivos de configuración de Bun
COPY package.json bun.lockb* ./
RUN bun install --frozen-lockfile

# ==========================================
# Etapa 2: Construir la aplicación
# ==========================================
FROM oven/bun:alpine AS builder
WORKDIR /app
# Traemos las dependencias de la etapa anterior
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Declaramos que recibiremos estos argumentos al construir
ARG NEXT_PUBLIC_SUPABASE_URL
ARG NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
ARG SUPABASE_SERVICE_ROLE_KEY

# Los convertimos en variables de entorno para que Next.js los lea en el build
ENV NEXT_PUBLIC_SUPABASE_URL=$NEXT_PUBLIC_SUPABASE_URL
ENV NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=$NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
ENV SUPABASE_SERVICE_ROLE_KEY=$SUPABASE_SERVICE_ROLE_KEY

# Construimos la aplicación de Next.js
RUN bun run build

# ==========================================
# Etapa 3: Producción (Imagen final ligera)
# ==========================================
FROM oven/bun:alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000

# Next.js standalone crea una carpeta con lo mínimo necesario
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

EXPOSE 3000

# Ejecutamos el servidor optimizado que generó Next.js
CMD ["bun", "run", "server.js"]