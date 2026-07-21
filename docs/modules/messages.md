# Módulo de Mensajería (`messages`)

Sistema de mensajería en tiempo real entre usuarios: chats personales, grupales, archivos adjuntos, stickers, reacciones y más.

---

## Descripción

El módulo `messages` implementa un sistema completo de mensajería tipo WhatsApp/Telegram con soporte para conversaciones personales y grupales, mensajes en tiempo real vía WebSocket, archivos adjuntos (imágenes, videos, documentos), stickers, reacciones por emoji, mensajes fijados, prioridades, edición y eliminación.

---

## Estructura

```
features/messages/
├── data/
│   ├── api/
│   │   └── chatApi.ts                    # Endpoints REST + WebSocket
│   ├── repositories/
│   │   └── ChatRepositoryImpl.ts
│   └── stickerPacksData.ts              # 9 paquetes de stickers
├── domain/
│   ├── models/
│   │   ├── Chat.types.ts
│   │   ├── ChatMessage.ts
│   │   ├── ChatMember.ts
│   │   ├── Conversation.ts
│   │   ├── MessageAttachment.ts
│   │   ├── MessageReplyTo.ts
│   │   └── StickerPack.ts
│   ├── dtos/request/
│   │   ├── create-conversation.request.ts
│   │   ├── update-conversation.request.ts
│   │   ├── send-message.request.ts
│   │   ├── edit-message.request.ts
│   │   ├── set-priority.request.ts
│   │   └── reaction.request.ts
│   ├── repositories/
│   │   └── ChatRepository.ts
│   └── usecases/                         # 14 use cases
│       └── *.usecase.ts
└── presentation/
    ├── view/
    │   └── MessagesView.tsx
    ├── viewmodels/
    │   └── useMessagesViewModel.ts
    ├── components/                        # 16 componentes
    │   ├── MessagesTable.tsx
    │   ├── MessageRow.tsx
    │   ├── MessageStatusBadge.tsx
    │   ├── MessageActionsDropdown.tsx
    │   ├── MessageDrawer.tsx
    │   ├── MessageHeader.tsx
    │   ├── MessageContent.tsx
    │   ├── MessageBubble.tsx
    │   ├── MessageMenu.tsx
    │   ├── ChatComposer.tsx
    │   ├── StickerPicker.tsx
    │   ├── NewConversationModal.tsx
    │   ├── GroupDetailsPanel.tsx
    │   ├── ConversationList.tsx
    │   ├── LoadingMessagesState.tsx
    │   └── EmptyMessagesState.tsx
    ├── types/
    │   └── *.types.ts
    ├── constants/
    │   └── *.constants.ts
    └── utils/
        └── *.ts
```

---

## API Endpoints

### REST

| Método | Endpoint | Descripción |
|---|---|---|
| `GET` | `/chat/conversations` | Listar conversaciones |
| `GET` | `/chat/contacts` | Listar contactos |
| `POST` | `/chat/conversations` | Crear conversación (personal/grupal) |
| `PATCH` | `/chat/conversations/{id}` | Actualizar nombre/descripción/avatar |
| `POST` | `/chat/conversations/{id}/members` | Agregar miembros |
| `DELETE` | `/chat/conversations/{id}/leave` | Salir de conversación |
| `POST` | `/chat/conversations/{id}/read` | Marcar como leído |
| `POST` | `/chat/conversations/{id}/delivered` | Marcar como entregado |
| `GET` | `/chat/conversations/{id}/messages` | Obtener mensajes |
| `POST` | `/chat/conversations/{id}/messages` | Enviar mensaje |
| `PATCH` | `/chat/messages/{id}` | Editar mensaje |
| `DELETE` | `/chat/messages/{id}` | Eliminar mensaje |
| `POST` | `/chat/messages/{id}/pin` | Fijar/desfijar mensaje |
| `PATCH` | `/chat/messages/{id}/priority` | Establecer prioridad |
| `POST` | `/chat/messages/{id}/reactions` | Toggle reacción emoji |
| `POST` | `/chat/uploads` | Subir archivo (multipart) |

### WebSocket

| Canal | Propósito |
|---|---|
| `/ws/chat` | Mensajería en tiempo real |

**Eventos recibidos:**

| Evento | Acción |
|---|---|
| `message:new` | Agregar mensaje, actualizar lastMessage, incrementar unreadCount, reproducir sonido |
| `conversation:delivered` | Marcar mensajes como entregados (doble check gris) |
| `conversation:read` | Marcar mensajes como leídos (doble check azul) |
| `message:edited` | Actualizar contenido del mensaje |
| `message:deleted` | Ocultar mensaje |
| `message:priority` | Actualizar badge de prioridad |
| `reaction:updated` | Actualizar mapa de reacciones |
| `message:pinned` | Actualizar estado de fijado |
| `conversation:new` | Agregar conversación a la lista |
| `conversation:updated` | Actualizar conversación |
| `member:left` | Remover miembro (o eliminar conversación si es el usuario actual) |
| `typing` | Indicador de escritura |
| `presence:init` | Inicializar usuarios online |
| `user:online` / `user:offline` | Actualizar estado online |

**Mensajes enviados:**

| Tipo | Payload | Propósito |
|---|---|---|
| `typing:start` | `{ conversationId }` | Notificar que el usuario está escribiendo |
| `typing:stop` | `{ conversationId }` | Notificar que dejó de escribir |

---

## Modelos de dominio

### `ChatMessage`

```typescript
interface ChatMessage {
  id:              string
  conversationId:  string
  senderId:        string
  senderName:      string
  senderRole:      UserRole
  senderAvatar?:   string
  content:         string
  createdAt:       string
  read:            boolean
  status?:         'sent' | 'delivered' | 'read'
  deleted?:        boolean
  edited?:         boolean
  editedAt?:       string
  pinned?:         boolean
  priority?:       MessagePriority
  attachments?:    MessageAttachment[]
  replyTo?:        MessageReplyTo
  reactions?:      Record<string, string[]>  // emoji -> userIds
}
```

### `Conversation`

```typescript
interface Conversation {
  id:          string
  type:        'personal' | 'group'
  name?:       string
  description?: string
  avatar?:     string
  members:     ChatMember[]
  lastMessage?: ChatMessage
  unreadCount: number
  createdAt:   string
  createdBy:   string
}
```

### `MessagePriority`

```typescript
type MessagePriority = 'normal' | 'important' | 'urgent'
```

---

## Vistas y componentes

### `MessagesView` — Página principal

- Ruta: `/messages` (autenticado)
- Header con título "Mensajes", barra de búsqueda y botón "Nuevo"
- Tabla de conversaciones (`MessagesTable`)
- Drawer deslizante derecho al seleccionar conversación
- Panel de detalles de grupo (overlay)
- Confirmación para acciones de borrado/prioridad/salir del grupo

### `MessagesTable` — Lista de conversaciones

- Tabla con columnas: Remitente, Asunto, Estado, Fecha
- Fuzzy search por nombre de conversación
- Badge de mensajes sin leer
- Click → abre drawer de chat

### `MessageDrawer` — Panel de chat

- Panel deslizante (480px) desde la derecha
- Header: nombre, indicador de escritura, estado online, botones cerrar/info
- Contenido: lista scrollable de mensajes (`MessageContent`)
- Composer: input de texto + emoji picker + stickers + archivos adjuntos

### `MessageBubble` — Burbuja de mensaje

- Nombre del remitente (en grupo)
- Badge de prioridad (importante = ámbar, urgente = rojo)
- Cita de reply
- Contenido del mensaje
- Archivos adjuntos (imágenes inline, videos, documentos, stickers)
- Reacciones (emoji + contador)
- Hora + estado (enviado/entregado/leído)
- Indicador de edición
- Acciones en hover: responder, reaccionar, menú
- Edición inline (ventana de 20 minutos para mensajes propios)

### `ChatComposer` — Input de mensajes

- Textarea con auto-growth
- Botones: emoji picker (`emoji-mart`), stickers, archivos
- Barra de preview de reply
- Enter envía, Shift+Enter nueva línea
- Indicador de typing

### `StickerPicker` — Selector de stickers

- 9 paquetes de stickers: Emociones, Divertidos, Enojado, Animaciones, Sorprendido, Mareado, Gracioso, Reacciones, Triste
- Tabs por paquete + grid de 4 columnas
- Los stickers se envían como adjuntos de tipo `sticker`

### `NewConversationModal` — Nueva conversación

- Modal para crear chat personal o grupal
- Búsqueda/filtrado de contactos
- Toggle de selección
- Input de nombre del grupo (para grupales)

### `GroupDetailsPanel` — Detalle de grupo

- Avatar (subible), nombre (editable), descripción (editable)
- 3 tabs: Miembros, Multimedia, Archivos
- Agregar miembros
- Salir del grupo
- Lightbox para imágenes

---

## ViewModel (`useMessagesViewModel`)

### Estado

| Campo | Tipo | Descripción |
|---|---|---|
| `conversations` | `Conversation[]` | Conversaciones del usuario |
| `contacts` | `ChatMember[]` | Contactos disponibles |
| `activeId` | `string \| null` | Conversación activa |
| `messages` | `Record<string, ChatMessage[]>` | Mensajes por conversación |
| `typingByConv` | `Record<string, string[]>` | Usuarios escribiendo por conversación |
| `onlineUserIds` | `Set<string>` | Usuarios online |
| `replyTo` | `MessageReplyTo \| null` | Contexto de reply activo |

### Acciones

| Acción | Descripción |
|---|---|
| `openConversation(id)` | Cambiar conversación activa, cargar mensajes, marcar leído |
| `sendMessage(content)` | Enviar texto (con reply opcional), reproducir sonido |
| `sendFiles(files)` | Subir + enviar múltiples archivos |
| `sendSticker(assetUrl)` | Obtener blob del sticker, subir, enviar como adjunto |
| `editMessage(msgId, content)` | Editar (ventana de 20 min para propios) |
| `deleteMessage(msgId)` | Eliminar mensaje |
| `pinMessage(msgId)` | Toggle fijar |
| `setPriority(msgId, p)` | Establecer prioridad |
| `addReaction(msgId, emoji)` | Toggle reacción |
| `leaveConversation(id)` | Salir de conversación |
| `updateGroupInfo(fields)` | Actualizar nombre/descripción/avatar del grupo |
| `createConversation(type, memberIds, name?)` | Crear conversación personal o grupal |
| `addMembers(convId, userIds)` | Agregar miembros al grupo |
| `notifyTyping(isTyping)` | Enviar indicador de escritura |

---

## Sonidos

| Evento | Archivo |
|---|---|
| Mensaje en otra conversación | `/assets/sounds/sound_message.mp3` |
| Mensaje en conversación activa | `/assets/sounds/sound_response_message.mp3` |
| Enviar mensaje | `/assets/sounds/send_message.mp3` |

Los sonidos se activan/desactivan según la configuración de notificaciones del usuario.

---

## Stickers

9 paquetes hardcodeados en `stickerPacksData.ts`:

| Paquete | Identificador | Cantidad |
|---|---|---|
| Emociones | `nich_ka_emotions` | 10 |
| Divertidos | `nich_ka_fun` | 8 |
| Enojado | `nich_ka_angry` | 15 |
| Animaciones | `nich_ka_animations` | 20 |
| Sorprendido | `nich_ka_astonished` | 15 |
| Mareado | `nich_ka_dizzy` | 15 |
| Gracioso | `nich_ka_funny` | 15 |
| Reacciones | `nich_ka_reactions` | 25 |
| Triste | `nich_ka_sad` | 20 |

---

## Integración con otros módulos

| Módulo | Relación |
|---|---|
| `core/hooks/userAuth` | Obtiene usuario actual para `MY_ID` |
| `support` | `TicketsPanel` usa聊天 de soporte (canal separado) |
| `core/store/useSupportStore` | Comparte estado de tickets |
| `shared/constants` | Configuración de notificaciones |
