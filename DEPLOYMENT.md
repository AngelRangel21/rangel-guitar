# Deployment Guide for rangelguitar.com

Este documento explica cómo desplegar la aplicación Rangel Guitar en el dominio rangelguitar.com.

## Opciones de Despliegue

### Opción 1: Vercel (Recomendado para Next.js)

#### Requisitos previos:
1. Cuenta en Vercel (https://vercel.com)
2. Instalar Vercel CLI: `npm install -g vercel`
3. Repositorio en GitHub

#### Pasos para el despliegue:

**Método 1: Desde el Dashboard de Vercel (Más fácil)**
1. Ir a https://vercel.com/dashboard
2. Hacer clic en "Add New" > "Project"
3. Importar tu repositorio de GitHub
4. Vercel detectará automáticamente que es Next.js
5. Agregar las variables de entorno necesarias
6. Hacer clic en "Deploy"

**Método 2: Desde la terminal**
1. **Autenticarse:**
   ```bash
   vercel login
   ```

2. **Desplegar:**
   ```bash
   vercel --prod
   ```

3. **Configurar dominio personalizado:**
   - En el dashboard de Vercel, ir a tu proyecto
   - Ir a la pestaña "Domains"
   - Agregar `rangelguitar.com` y `www.rangelguitar.com`

### Opción 2: Vercel

1. **Instalar Vercel CLI:**
   ```bash
   npm install -g vercel
   ```

2. **Desplegar:**
   ```bash
   vercel --prod
   ```

3. **Configurar dominio:**
   - En el dashboard de Vercel, agregar `rangelguitar.com`

### Opción 3: Netlify

1. **Build:**
   ```bash
   npm run build
   ```

2. **Desplegar:**
   - Conectar repositorio en Netlify
   - Configurar build command: `npm run build`
   - Configurar publish directory: `out`

## Configuración de DNS

Para cualquier opción que elijas, necesitarás configurar los registros DNS en tu proveedor de dominio:

### Para Firebase Hosting:
- Tipo: A
- Nombre: @
- Valor: 151.101.1.195, 151.101.65.195

- Tipo: CNAME
- Nombre: www
- Valor: rangelguitar.com

### Para Vercel:
- Tipo: CNAME
- Nombre: @
- Valor: cname.vercel-dns.com

- Tipo: CNAME
- Nombre: www
- Valor: cname.vercel-dns.com

## Variables de Entorno

Asegúrate de configurar las variables de entorno necesarias en tu plataforma de hosting:

- `NEXT_PUBLIC_FIREBASE_API_KEY`
- `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
- `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
- `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
- `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
- `NEXT_PUBLIC_FIREBASE_APP_ID`

## GitHub Actions (Opcional)

Para automatizar el despliegue, configura los siguientes secrets en GitHub:

- `FIREBASE_SERVICE_ACCOUNT_RANGEL_GUITAR`: JSON del service account de Firebase

El archivo `.github/workflows/firebase-deploy.yml` ya está configurado para despliegue automático.

## Verificación del Despliegue

1. Visita `https://rangelguitar.com`
2. Verifica que todas las funcionalidades están funcionando
3. Prueba en diferentes dispositivos y navegadores

## Solución de Problemas

### Error de build:
- Verificar que todas las dependencias estén instaladas
- Revisar errores de TypeScript/ESLint

### Problemas de DNS:
- Los cambios de DNS pueden tardar hasta 48 horas en propagarse
- Usar herramientas como `nslookup` o `dig` para verificar

### Problemas de Firebase:
- Verificar que el proyecto esté correctamente configurado
- Revisar las reglas de Firestore y permisos
