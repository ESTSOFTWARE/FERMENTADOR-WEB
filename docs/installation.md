# Instalación y Configuración

Guía completa para instalar, configurar y ejecutar el proyecto localmente.

---

## Prerrequisitos

| Software | Versión mínima | Verificar |
|---|---|---|
| **Node.js** | 20+ | `node --version` |
| **npm** | 9+ | `npm --version` |
| **Git** | 2.x | `git --version` |

Opcionalmente se puede usar **nvm** (Node Version Manager) para gestionar versiones:

```bash
nvm install 20
nvm use 20
```

---

## Instalación

### 1. Clonar el repositorio

```bash
git clone https://github.com/ESTSOFTWARE/FERMENTADOR-WEB.git
cd FERMENTADOR-WEB
```

### 2. Instalar dependencias

```bash
npm install
```

> El archivo `.npmrc` incluye `legacy-peer-deps=true` para resolver conflictos de peer dependencies.

### 3. Configurar variables de entorno

```bash
cp .env .env.local   # copiar como referencia local (no commitear .env.local)
```

Editar `.env` con los valores correctos para tu entorno (ver [sección de variables de entorno](#variables-de-entorno)).

### 4. Iniciar el servidor de desarrollo

```bash
npm run dev
```

La aplicación se abrirá automáticamente en `http://localhost:3000`.

---

## Variables de entorno

Todas las variables usan el prefijo `VITE_` para ser expuestas al cliente por Vite.

| Variable | Descripción | Desarrollo | Producción |
|---|---|---|---|
| `VITE_API_URL` | URL base de la REST API | `http://localhost:8000/api` | `https://backend.nich-ka.space/api` |
| `VITE_WS_URL` | URL del WebSocket (opcional, se deriva de `VITE_API_URL` si no se define) | `ws://localhost:8000` | `wss://backend.nich-ka.space` |
| `VITE_AI_API_URL` | URL del servicio de IA (algoritmo genético, simulación) | Túnel ngrok (cambia) | Túnel ngrok |
| `VITE_API_KEY_CHATBOT` | API Key del chatbot AI | *(necesario)* | *(necesario)* |
| `VITE_NAME_CHATBOT` | Nombre del chatbot en la UI | `Nich-káBot` | `Nich-káBot` |
| `VITE_STRIPE_PUBLIC_KEY` | Clave pública de Stripe (publishable key) | *(necesario)* | *(necesario)* |
| `VITE_PAYPAL_CLIENT_ID` | Client ID de PayPal | *(necesario)* | *(necesario)* |

### Notas importantes

- **`VITE_WS_URL`**: Si no se define, se calcula automáticamente reemplazando `http` por `ws` en `VITE_API_URL` y eliminando `/api`.
- **`VITE_AI_API_URL`**: Apunta a un túnel ngrok que expone el servicio de ML. La URL cambia cada vez que se reinicia ngrok.
- **No commitear `.env`**: El archivo `.env` está en `.gitignore`. Solo se commitea `.env.example` si existe.

---

## Scripts disponibles

| Script | Comando | Descripción |
|---|---|---|
| `dev` | `npm run dev` | Servidor de desarrollo Vite en puerto 3000 con hot reload |
| `build` | `npm run build` | Compilación TypeScript (`tsc -b`) + build de producción (`vite build`) |
| `lint` | `npm run lint` | Linting con ESLint |
| `preview` | `npm run preview` | Preview del build de producción localmente |

### Detalle del build

```bash
npm run build
# Equivale a:
# tsc -b          # Verificación de tipos TypeScript
# vite build      # Bundling para producción → carpeta dist/
```

El resultado se genera en la carpeta `dist/` (no commiteada, está en `.gitignore`).

---

## Backend requerido

El frontend necesita un backend REST API funcionando para operar. En desarrollo local:

| Servicio | URL por defecto | Puerto |
|---|---|---|
| Backend REST API | `http://localhost:8000/api` | 8000 |
| WebSocket Server | `ws://localhost:8000` | 8000 |
| AI/ML API | Túnel ngrok (variable) | Variable |

Si no tienes el backend local, usa las URLs de producción en `.env`:

```env
VITE_API_URL=https://backend.nich-ka.space/api
VITE_WS_URL=wss://backend.nich-ka.space
```

---

## Estructura de `.env`

```env
# Backend REST API
VITE_API_URL=http://localhost:8000/api

# WebSocket (opcional — se deriva de VITE_API_URL)
VITE_WS_URL=ws://localhost:8000

# Backend IA (algoritmo genético)
VITE_AI_API_URL=https://tunel-ngrok.ngrok-free.dev

# Chatbot
VITE_API_KEY_CHATBOT=tu_api_key_aqui
VITE_NAME_CHATBOT=Nich-káBot

# Stripe
VITE_STRIPE_PUBLIC_KEY=pk_test_...

# PayPal
VITE_PAYPAL_CLIENT_ID=AXGB...
```

---

## PWA (Progressive Web App)

El proyecto está configurado como PWA con `vite-plugin-pwa`. En desarrollo, el service worker se genera automáticamente en `dev-dist/`.

Para probar la PWA:
1. Ejecutar `npm run dev`
2. Abrir `http://localhost:3000` en Chrome/Edge
3. Ir a DevTools → Application → Service Workers
4. Verificar que el service worker está registrado

---

## Solución de problemas

### `npm install` falla con peer dependency errors

```bash
npm install --legacy-peer-deps
```

Esto ya está configurado en `.npmrc`, pero si persiste, ejecutar manualmente.

### Puerto 3000 ya en uso

```bash
npm run dev -- --port 3001
```

### Errores de tipos TypeScript

```bash
npx tsc -b --noEmit
```

### Build falla

Verificar que no hay errores de TypeScript primero:
```bash
npx tsc -b
```

### La app no carga (pantalla blanca)

1. Verificar que el backend está corriendo en el puerto configurado.
2. Abrir DevTools → Console para ver errores.
3. Verificar que las variables de entorno están correctas.

### WebSocket no conecta

1. Verificar que `VITE_WS_URL` apunta al servidor correcto.
2. Verificar que el backend tiene habilitado WebSocket.
3. En desarrollo, verificar que ngrok no está bloqueando conexiones WebSocket.
