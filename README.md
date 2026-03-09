# NoteFlow 📝

Aplicación Full Stack para gestión de notas con etiquetas, archivado y filtrado. Construida como desafío técnico con arquitectura por capas estricta.

## Stack Técnico

| Capa | Tecnología |
|------|-----------|
| Backend | NestJS (Node.js + TypeScript) |
| ORM | TypeORM |
| Base de datos | SQLite (via `better-sqlite3`) |
| Frontend | React 18 + Vite + TypeScript |
| Estilos | CSS puro (sin frameworks) |

---

## Arquitectura del Backend

El backend sigue estrictamente el patrón de **3 capas**:

```
src/
├── notes/
│   ├── entities/
│   │   └── note.entity.ts        ← Entidad TypeORM (modelo de datos)
│   ├── dto/
│   │   └── note.dto.ts           ← DTOs con validación (class-validator)
│   ├── notes.repository.ts       ← 🗄️  CAPA DE ACCESO A DATOS
│   ├── notes.service.ts          ← ⚙️  CAPA DE NEGOCIO / LÓGICA
│   ├── notes.controller.ts       ← 🌐  CAPA DE PRESENTACIÓN (HTTP)
│   └── notes.module.ts
├── tags/
│   ├── tag.entity.ts
│   ├── tag.dto.ts
│   ├── tags.repository.ts        ← 🗄️  Data Access Layer
│   ├── tags.service.ts           ← ⚙️  Business Logic Layer
│   ├── tags.controller.ts        ← 🌐  Presentation Layer
│   └── tags.module.ts
├── app.module.ts                 ← Módulo raíz + configuración TypeORM
└── main.ts                       ← Arranque, CORS, ValidationPipe
```

### Flujo de una petición HTTP

```
HTTP Request
    ↓
Controller  (valida params, llama al servicio)
    ↓
Service     (lógica de negocio, manejo de errores)
    ↓
Repository  (queries TypeORM, acceso a SQLite)
    ↓
HTTP Response
```

---

## API REST

### Notas — `/api/notes`

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| `GET` | `/api/notes?archived=false` | Listar notas activas |
| `GET` | `/api/notes?archived=true` | Listar notas archivadas |
| `GET` | `/api/notes?archived=false&tagId=1` | Filtrar por etiqueta |
| `GET` | `/api/notes/:id` | Obtener nota por ID |
| `POST` | `/api/notes` | Crear nota |
| `PUT` | `/api/notes/:id` | Editar nota |
| `PATCH` | `/api/notes/:id/archive` | Archivar / Desarchivar |
| `DELETE` | `/api/notes/:id` | Eliminar nota |

**Body para crear/editar:**
```json
{
  "title": "Mi nota",
  "content": "Contenido opcional",
  "tagIds": [1, 2]
}
```

### Etiquetas — `/api/tags`

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| `GET` | `/api/tags` | Listar todas las etiquetas |
| `POST` | `/api/tags` | Crear etiqueta |
| `PUT` | `/api/tags/:id` | Editar etiqueta |
| `DELETE` | `/api/tags/:id` | Eliminar etiqueta |

**Body para crear/editar:**
```json
{
  "name": "Trabajo",
  "color": "#6366f1"
}
```

---

## Instalación y Uso

### Terminal 1 — Backend (puerto 3000)

```bash
cd backend
npm install --legacy-peer-deps
npm run start:dev
```

La primera vez, TypeORM creará automáticamente el archivo `notes.db` con las tablas necesarias.

### Terminal 2 — Frontend (puerto 5173)

```bash
cd frontend
npm install
npm run dev -- --host
```

> ⚠️ El flag `--host` es necesario para acceder desde otros dispositivos en la misma red (móvil, tablet, etc.).

Abre el navegador en → **http://localhost:5173**  
Desde otros dispositivos en la misma red → **http://TU_IP_LOCAL:5173**

---

## Funcionalidades

### Fase 1 — Core (Obligatorio) ✅

- **Crear** notas con título y contenido
- **Editar** notas existentes
- **Eliminar** notas (con confirmación)
- **Archivar / Desarchivar** notas (toggle)
- **Listar** notas activas y archivadas en vistas separadas

### Fase 2 — Bonus ✅

- **Sistema de etiquetas** con nombre y color personalizado
- **Asignar múltiples etiquetas** a cada nota desde el modal de creación/edición
- **Filtrar notas** por etiqueta con el selector sobre la grilla
- **Gestión de etiquetas** desde el panel (crear / eliminar)
- El filtro funciona tanto en la pestaña Activas como en Archivadas

---

## Decisiones de diseño

- **SQLite con `better-sqlite3`**: Sin necesidad de instalar servidores externos. La DB se crea automáticamente en `backend/notes.db`.
- **`synchronize: true` en TypeORM**: Para desarrollo, las tablas se crean/actualizan automáticamente al iniciar.
- **CORS abierto (`origin: '*'`)**: Permite acceder desde cualquier dispositivo en la red local, incluyendo móviles.
- **`listen(3000, '0.0.0.0')`**: El backend escucha en todas las interfaces de red, no solo localhost.
- **`--host` en Vite**: Expone el frontend en la red local para acceso desde otros dispositivos.
- **Cache busting con `_t: Date.now()`**: Evita que el navegador cachee las respuestas del backend (problema 304).
- **Dos llamadas separadas en `useNotes`**: Se piden activas y archivadas por separado para que ambas listas estén siempre actualizadas tras cualquier acción.
- **`class-validator`**: Validación declarativa en los DTOs con `ValidationPipe` global.

---

## Requisitos

- Node.js >= 18
- npm >= 8
