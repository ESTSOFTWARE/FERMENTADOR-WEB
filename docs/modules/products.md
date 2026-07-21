# Módulo de Productos (`products`)

Catálogo de productos de hardware, carrito de compras y sistema de reseñas.

---

## Descripción

El módulo `products` presenta un catálogo de productos de hardware (kits de fermentación Nich-Ká) con búsqueda difusa, vista de detalle con especificaciones técnicas, reseñas de usuarios, y un carrito de compras persistente en el cliente.

---

## Estructura

```
features/products/
├── data/
│   ├── api/
│   │   └── productsApi.ts
│   └── repositories/
│       └── ProductRepositoryImpl.ts
├── domain/
│   ├── models/
│   │   └── Product.ts
│   ├── repositories/
│   │   └── ProductRepository.ts
│   └── usecases/
│       ├── get-products.usecase.ts
│       └── get-product-by-id.usecase.ts
└── presentation/
    ├── components/
    │   ├── CartDrawer.tsx
    │   ├── ProductCard.tsx
    │   ├── StarRating.tsx
    │   └── ReviewFormModal.tsx
    ├── view/
    │   ├── ProductsView.tsx
    │   └── ProductDetailView.tsx
    └── viewmodels/
        ├── useProductsViewModel.ts
        ├── useProductDetailViewModel.ts
        ├── useLeaveReviewViewModel.ts
        └── useDeleteReviewViewModel.ts
```

---

## API Endpoints

| Método | Endpoint | Respuesta | Descripción |
|---|---|---|---|
| `GET` | `/products/?limit=100` | `PaginatedProducts` | Listar todos los productos |
| `GET` | `/products/{id}` | `Product` | Detalle de producto (fanea specs, includes, reviews en paralelo) |
| `GET` | `/products/{id}/specifications/` | `SpecDto[]` | Especificaciones técnicas |
| `GET` | `/products/{id}/includes/` | `IncludeDto[]` | Qué incluye el producto |
| `GET` | `/products/{id}/reviews/` | `ReviewListDto` | Reseñas del producto |
| `POST` | `/products/{id}/reviews/` | `Review` | Crear reseña |
| `DELETE` | `/products/{id}/reviews/{reviewId}` | `void` | Eliminar reseña |

---

## Modelo de datos

### `Product`

```typescript
interface Product {
  id:                   number
  name:                 string
  description:          string
  price:                number
  sku:                  string
  stock:                number
  rating:               number
  image?:               string
  tags?:                string[]
  category?:            string
  specs?:               ProductSpec[]
  inclusions?:          string[]
  compatibility?:       string
  reviews?:             ProductReview[]
  reviewCount?:         number
  ratingDistribution?:  { [star: number]: number }
}
```

### `ProductReview`

```typescript
interface ProductReview {
  id:          number
  userId:      number
  name:        string      // "Usuario #3"
  initials:    string      // "U3"
  institution: string      // "Cliente verificado"
  rating:      number
  date:        string      // "21 jul 2026"
  text:        string
  verified?:   boolean
}
```

### `CartItem` (carrito)

```typescript
interface CartItem {
  product:  Product
  quantity: number
}
```

---

## Búsqueda difusa

Usa **Fuse.js** con pesos configurables:

| Campo | Peso |
|---|---|
| `name` | 0.5 |
| `category` | 0.3 |
| `sku` | 0.15 |
| `description` | 0.05 |

Threshold: `0.45`

---

## Vistas

### `ProductsView` — Catálogo

- Ruta: `/products` (pública)
- Grid responsive de productos (1-4 columnas)
- Barra de búsqueda con Fuse.js
- Click en producto → agregar al carrito + abrir drawer
- Requiere autenticación para agregar al carrito

### `ProductDetailView` — Detalle de producto

- Ruta: `/products/:id`
- Layout de 2 columnas:
  - Izquierda: imagen, badge de stock, SKU, selector de thumbnails
  - Derecha: nombre, rating, descripción, tags, precio, selector de cantidad, botones "Agregar al carrito" y "Comprar ahora"
- Sección "Ficha técnica": tabla de especificaciones + qué incluye
- Sección de reseñas: distribución de rating + lista de reseñas
- Botón "Escribir reseña" (requiere auth)
- Productos relacionados (misma categoría o tags)
- Título dinámico del documento

### `CartDrawer` — Carrito deslizante

- Panel lateral derecho (full height)
- Lista de items con imagen, nombre, SKU, total por línea
- Controles de cantidad +/- por item (máximo: stock)
- Botón eliminar por item
- Footer: total + "Finalizar compra" (o "Iniciar sesión para comprar")
- **Nota**: El checkout aún no está implementado (TODO)

---

## Carrito de compras (`useCartStore`)

Store Zustand en `core/store/useCartStore.ts`:

| Acción | Descripción |
|---|---|
| `addItem(product)` | Agrega producto (o incrementa cantidad si ya existe) |
| `removeItem(productId)` | Elimina item del carrito |
| `updateQty(productId, qty)` | Actualiza cantidad (si qty ≤ 0, elimina) |
| `clearCart()` | Vacía el carrito |
| `openCart()` / `closeCart()` | Controla visibilidad del drawer |
| `totalItems()` | Suma de cantidades |
| `totalPrice()` | Suma de precio × cantidad |

**Nota**: El carrito es 100% client-side (Zustand, sin persistencia). No hay API de carrito ni flujo de checkout implementado.

---

## Sistema de reseñas

### Crear reseña (`useLeaveReviewViewModel`)

- Modal con selector de rating (1-5 estrellas) + textarea opcional
- Valida rating ≥ 1
- Maneja `ReviewAlreadyExistsException` con mensaje amigable
- Al crear, recarga el detalle del producto

### Eliminar reseña (`useDeleteReviewViewModel`)

- Solo el autor puede eliminar su reseña
- Spinner individual por reseña durante eliminación
- Toast de éxito/error vía `sileo`

---

## Integración con otros módulos

| Módulo | Relación |
|---|---|
| `core/store/useCartStore` | Estado global del carrito |
| `components` | `reviewsApi` compartido para CRUD de reseñas |
| `landing` | `PlanesView` referencia productos de hardware |
| `billing` | Futuro: checkout integrado con Stripe/PayPal |
