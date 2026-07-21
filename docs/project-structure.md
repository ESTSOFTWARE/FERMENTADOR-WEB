# Estructura del Proyecto

Organización de carpetas, módulos y convenciones del código fuente.

---

## Raíz del proyecto

```
FERMENTADOR-WEB/
├── .env                         # Variables de entorno (API URLs, Stripe, PayPal)
├── .github/                     # GitHub Actions CI + plantilla de PR
├── .gitignore
├── .npmrc                       # legacy-peer-deps=true
├── components.json              # Configuración shadcn/ui (estilo base-nova)
├── eslint.config.js             # ESLint flat config
├── index.html                   # Punto de entrada HTML (Vite SPA)
├── package.json                 # Dependencias y scripts
├── package-lock.json
├── README.md                    # README principal del repositorio
├── tsconfig.json                # Configuración TypeScript raíz (project references)
├── tsconfig.app.json            # Configuración TS de la app (ES2023, strict)
├── tsconfig.node.json           # Configuración TS de Node (para vite.config.ts)
├── vercel.json                  # Reescrituras SPA para Vercel
├── vite.config.ts               # Configuración Vite (plugins, alias @)
├── public/                      # Assets estáticos
│   ├── .well-known/
│   └── assets/
│       ├── avatars/             # Avatares de usuario
│       ├── banners/             # Banners promocionales
│       ├── classrooms/          # Imágenes de aulas
│       ├── devs/                # Fotos de desarrolladores
│       ├── experiences/         # Imágenes de experiencias académicas
│       ├── icons/               # Iconos de la app
│       ├── sounds/              # Efectos de sonido
│       ├── stickers/            # Stickers
│       ├── videos/              # Videos
│       └── *.png / *.svg        # Favicon, logos, OG images
└── src/                         # Código fuente (620+ archivos TS/TSX)
```

---

## Estructura de `src/`

```
src/
├── App.tsx                      # Componente raíz (Toaster + AppRouter)
├── main.tsx                     # Punto de entrada React (createRoot)
├── index.css                    # Tailwind CSS v4 + tema shadcn
│
├── components/                  # Componentes UI globales
│   ├── ui/                      # 24 componentes shadcn/magic-ui
│   └── animate-ui/              # Componentes animados (backgrounds, textos)
│
├── core/                        # Capa core (servicios transversales)
│   ├── avatars/                 # Definiciones de avatar
│   ├── components/              # Componentes core (UserAvatar)
│   ├── hooks/                   # 8 hooks transversales
│   ├── navigation/              # Router, guards, utilidades de navegación
│   ├── network/                 # Cliente HTTP y WebSocket
│   ├── store/                   # Stores Zustand (4 stores)
│   └── validation/              # Validadores de formularios
│
├── features/                    # 20 módulos de features (ver abajo)
│
├── hooks/                       # Hooks compartidos (use-controlled-state)
├── lib/                         # Utilidades (cn, getStrictContext)
│
└── shared/                      # Capa compartida entre features
    ├── animations/              # Variantes Framer Motion
    ├── components/              # Componentes reutilizables
    ├── constants/               # Constantes globales
    ├── layout/                  # Layout principal (sidebar + contenido)
    ├── presentation/            # NotFoundView (404)
    ├── types/                   # Tipos compartidos
    └── utils/                    # Utilidades (formato, linkify, notificaciones)
```

---

## Módulos de features (20 módulos)

Cada feature sigue la estructura:

```
features/<feature>/
├── data/                        # Capa de datos
│   ├── api/                     # Servicios API (llamadas REST)
│   ├── repositories/            # Implementaciones de repositorios
│   ├── datasources/             # Fuentes de datos remotas (algunos)
│   ├── dto/                     # Data Transfer Objects
│   └── mappers/                 # Mapeadores de datos
│
├── domain/                      # Capa de dominio
│   ├── models/                  # Modelos / interfaces de dominio
│   ├── entities/                # Entidades de dominio
│   ├── dtos/                    # DTOs por dirección
│   │   ├── request/             # DTOs de solicitud
│   │   └── response/            # DTOs de respuesta
│   ├── repositories/            # Interfaces de repositorio (contratos)
│   └── usecases/                # Casos de uso (lógica de negocio)
│
└── presentation/                # Capa de presentación
    ├── view/ o views/           # Componentes de página (rutas)
    ├── viewmodels/              # Custom hooks con lógica de UI
    ├── components/              # Componentes reutilizables del feature
    ├── constants/               # Constantes del feature
    ├── types/                   # Tipos del feature
    ├── utils/                   # Utilidades del feature
    ├── context/                 # React Context providers
    └── hooks/                   # Hooks específicos del feature
```

### Listado de features

| # | Feature | Capas | Propósito |
|---|---|---|---|
| 1 | `auth` | data + domain + presentation | Login, registro, forgot password, OAuth |
| 2 | `landing` | presentation | Landing page, privacy, terms, cookies, hardware, planes |
| 3 | `home` | presentation | Dashboard overview |
| 4 | `dashboard` | data + domain + presentation | Algoritmo genético, experimentos, resultados, gráficas |
| 5 | `sensors` | data + domain + presentation | Monitoreo IoT, WebSocket, gráficas en tiempo real |
| 6 | `fermentation` | data + domain + presentation | Iniciar/gestionar fermentación, context provider |
| 7 | `fermentation-reports` | domain + presentation | Listado y detalle de reportes de fermentación |
| 8 | `efficiency` | presentation | Calculadora de eficiencia |
| 9 | `users` | data + domain + models + presentation | Agregar, gestionar, exportar usuarios |
| 10 | `groups` | data + domain + presentation | Gestión de grupos/clases |
| 11 | `chat` | data + domain + presentation | Chat AI (Nich-káBot) |
| 12 | `messages` | data + domain + presentation | Mensajería personal y grupal |
| 13 | `announcements` | domain + presentation | Anuncios de la plataforma |
| 14 | `profile` | data + domain + presentation | Gestión de perfil de usuario |
| 15 | `billing` | data + domain + presentation | Checkout Stripe/PayPal, suscripciones |
| 16 | `products` | data + domain + presentation | Catálogo de productos (hardware) |
| 17 | `components` | data + domain + presentation | Catálogo de componentes electrónicos (admin) |
| 18 | `support` | data + domain + presentation | Gestión de tickets de soporte |
| 19 | `support-chat` | data + domain + presentation | Chat de soporte en tiempo real |
| 20 | `experiences` | presentation | Experiencias académicas |

---

## Capa Core en detalle

### `core/navigation/`

| Archivo | Función |
|---|---|
| `AppRouter.tsx` | Define todas las rutas de la aplicación |
| `PrivateRoute.tsx` | Guard de autenticación y control de roles |
| `ScrollToTop.tsx` | Scroll al inicio en cambio de ruta |
| `SessionWatcher.tsx` | Escucha `session_expired` y redirige |
| `PageTitle.tsx` | Actualiza `<title>` del documento |
| `navItems.ts` | Definición de elementos del menú de navegación |

### `core/network/`

| Archivo | Función |
|---|---|
| `client.ts` | Cliente HTTP (`apiClient`) — wrapper de fetch |
| `createSocketClient.ts` | Fábrica de clientes WebSocket con auto-reconexión |
| `sockeClient.types.ts` | Tipos del cliente WebSocket |

### `core/store/`

| Archivo | Store | Persistencia |
|---|---|---|
| `useExperimentStore.ts` | `useExperimentStore` | Sí (localStorage: `fermest-store`) |
| `useCartStore.ts` | `useCartStore` | No |
| `useSupportStore.ts` | `useSupportStore` | No |
| `useSupportClientsStore.ts` | `useSupportClientsStore` | No |

### `core/hooks/`

| Hook | Propósito |
|---|---|
| `useUserAuth` | Estado de autenticación del usuario |
| `useEntitlements` | Verificación de features por plan |
| `useNotifications` | Sistema de notificaciones |
| `useTokenRefresh` | Refresh automático de sesión |
| `useTour` | Tours guiados (driver.js) |
| Y más... | |

---

## Capa Shared en detalle

### `shared/layout/`

| Archivo | Función |
|---|---|
| `Layout.tsx` | Layout principal: sidebar + área de contenido |
| `Sidebar.tsx` | Barra lateral de navegación |

### `shared/components/`

| Componente | Función |
|---|---|
| `NotifRow` | Fila de notificación |
| `PaginationBar` | Barra de paginación |
| `ProfileNav` | Navegación de perfil |
| `UpgradeView` | Vista de upgrade de plan |

---

## Componentes UI (`src/components/`)

### `components/ui/` — shadcn/magic-ui

24 componentes de UI pre-construidos: button, badge, bento-grid, gallery, dialog, checkbox, label, otp-input, y más.

### `components/animate-ui/` — Componentes animados

Componentes con animaciones integradas: backgrounds, community components, sliding-number.

---

## Convenciones de naming

| Elemento | Convención | Ejemplo |
|---|---|---|
| Archivos de vista | `*View.tsx` | `DashboardView.tsx` |
| Custom hooks | `use*.ts` / `use*.tsx` | `useUserAuth.ts` |
| Stores | `use*Store.ts` | `useExperimentStore.ts` |
| Componentes | PascalCase | `PrivateRoute.tsx` |
| Utilidades | camelCase | `format-time.ts` |
| Constantes | UPPER_SNAKE_CASE | `TOUR_IDS.ts` |
| Tipos/Interfaces | PascalCase | `SocketClient` |

---

## Scripts disponibles

| Script | Comando | Descripción |
|---|---|---|
| `dev` | `vite --open --port 3000` | Servidor de desarrollo en puerto 3000 |
| `build` | `tsc -b && vite build` | Compilación TypeScript + build de producción |
| `lint` | `eslint .` | Linting con ESLint |
| `preview` | `vite preview` | Preview del build de producción |
