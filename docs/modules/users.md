# Módulo de Usuarios (`users`)

Gestión de usuarios: creación, listado, edición, eliminación y exportación. Adaptado por roles (admin/profesor).

---

## Descripción

El módulo `users` permite a administradores y profesores gestionar cuentas de usuario. Los profesores solo pueden ver y gestionar estudiantes vinculados a su circuito. Los administradores tienen acceso completo a todos los usuarios y roles.

---

## Estructura

```
features/users/
├── data/
│   ├── api/
│   │   └── userApi.ts
│   └── repositories/
│       └── UserRepositoryImpl.ts
├── domain/
│   ├── repositories/
│   │   └── UserRepository.ts
│   └── usecases/
│       ├── create-user.usecase.ts
│       ├── delete-user.usecase.ts
│       ├── get-all-users.usecase.ts
│       ├── get-user-by-id.usecase.ts
│       └── update-user.usecase.ts
├── models/
│   ├── dto/
│   │   ├── UserRequest.ts
│   │   └── UserResponse.ts
│   └── entities/
│       └── User.ts
└── presentation/
    ├── components/
    │   ├── AddUserSectionLabel.tsx
    │   └── EyeIcon.tsx
    ├── constants/
    │   ├── roles.constants.ts
    │   ├── role-config.constants.ts
    │   ├── email-domains.constants.ts
    │   └── *.constants.ts
    ├── types/
    │   ├── add-user-form.types.ts
    │   └── edit-user-form.types.ts
    ├── utils/
    │   └── export-users.ts
    ├── view/
    │   ├── AddUserView.tsx
    │   └── ManageUsersView.tsx
    └── viewmodels/
        ├── useAddUserViewModel.ts
        └── useManageUsersViewModel.ts
```

---

## API Endpoints

| Método | Endpoint | Body | Respuesta | Descripción |
|---|---|---|---|---|
| `GET` | `/users/` | — | `User[]` | Listar todos los usuarios |
| `GET` | `/users/{id}` | — | `User` | Obtener usuario por ID |
| `POST` | `/users/` | `UserRequest` | `UserResponse` | Crear usuario |
| `PUT` | `/users/{id}` | `Partial<UserRequest>` | `UserResponse` | Actualizar usuario |
| `DELETE` | `/users/{id}` | — | `void` | Eliminar usuario |

---

## Modelo de datos

### `User`

```typescript
interface User {
  id:            number
  name:          string
  last_name:     string
  email:         string
  role_id:       number
  role_name:     string
  circuit_id:    number | null
  circuit_code:  string | null
  created_by:    number | null
  created_at:    string | null
  profile_image: string | null
}
```

### `UserRequest` (creación)

```typescript
interface UserRequest {
  name:            string
  last_name:       string
  email:           string
  password:        string
  role:            string    // 'admin' | 'profesor' | 'estudiante'
  activation_code: string
}
```

### Roles

| role_id | role_name | Color |
|---|---|---|
| 1 | Administrador | `#A78BFA` (púrpura) |
| 2 | Profesor | `#22C55E` (verde) |
| 3 | Estudiante | `#38BDF8` (azul) |

---

## Vistas

### `AddUserView` — Crear usuario

- Ruta: `/users/add` (admin/profesor)
- Título adaptivo: profesores ven "Agregar Estudiante", admins ven "Agregar Usuario"
- 3 secciones de formulario:
  1. **Información personal**: nombre, apellido, email (con botones de dominios: @gmail.com, @hotmail.com, etc.)
  2. **Seguridad**: contraseña + confirmación con toggle de visibilidad
  3. **Rol y acceso**: selector de rol (profesores solo pueden crear estudiantes)
- El código de activación se obtiene automáticamente del circuito del usuario actual

### `ManageUsersView` — Administrar usuarios

- Ruta: `/users/manage` (admin/profesor)
- Barra de búsqueda (nombre, email, rol)
- Filtros por rol (chips horizontales + dropdown)
- Tabla con columnas: #, Nombre (con avatar), Email, Rol, Cod. Activación, Creado, Acciones
- **Edición inline**: click en editar → campos editables → guardar/cancelar
- **Eliminación**: modal de confirmación con warning
- **Exportación**: modal con opciones PDF, CSV, Excel (atajo `Ctrl+E`)
- Paginación con `PaginationBar` (10 por página)

---

## Adaptación por rol

| Comportamiento | Profesor | Administrador |
|---|---|---|
| Título "Agregar" | "Agregar Estudiante" | "Agregar Usuario" |
| Título "Administrar" | "Mis Estudiantes" | "Administrar Usuarios" |
| Roles disponibles | Solo Estudiante | Profesor, Estudiante, Administrador (si plan enterprise) |
| Filtros visibles | Solo "Todos" y "Estudiante" | Todos los roles |
| Búsqueda placeholder | "Buscar estudiante..." | "Buscar usuario..." |
| Usuarios visibles | Solo `role_name === 'Estudiante'` | Todos |

---

## Exportación de usuarios

| Formato | Librería | Archivo |
|---|---|---|
| CSV | Blob nativo | `usuarios.csv` |
| Excel | `xlsx` | `usuarios.xlsx` |
| PDF | `jsPDF` + `jspdf-autotable` | `usuarios.pdf` |

Columnas exportadas: #, Nombre, Correo, Rol, Cod. Activación, Creado.

---

## Validación del lado del cliente

| Campo | Validador | Regla |
|---|---|---|
| Nombre | `v.personName()` | Nombre válido |
| Email | `v.email()` | Formato de email válido |
| Password | `v.password()` | Mínimo 8 caracteres, complejidad |
| Confirm password | `v.matches(password)` | Debe coincidir |
| Dominio email | Quick-pick buttons | Atajos para @gmail.com, etc. |

---

## Integración con otros módulos

| Módulo | Relación |
|---|---|
| `auth` | Crea usuarios con los mismos campos de registro |
| `core/hooks/userAuth` | Obtiene el rol y circuito del usuario actual |
| `core/hooks/useEntitlements` | Verifica plan para permisos de creación de admin |
| `groups` | Los usuarios pueden pertenecer a grupos |
