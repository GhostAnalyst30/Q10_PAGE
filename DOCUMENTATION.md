# Q10 Courses - Plataforma de Cursos Online

> **Versión:** 1.0.0  
> **Stack:** Next.js 15 + NestJS 11 + PostgreSQL + TailwindCSS 3  
> **Pagos:** Stripe (USD) + PSE (COP)  
> **Despliegue:** Vercel (Frontend) / Railway o Render (Backend)

---

## Tabla de Contenidos

1. [Descripción General](#1-descripción-general)
2. [Arquitectura](#2-arquitectura)
3. [Modelo de Datos](#3-modelo-de-datos)
4. [Autenticación y Roles](#4-autenticación-y-roles)
5. [Módulos del Backend](#5-módulos-del-backend)
6. [Módulos del Frontend](#6-módulos-del-frontend)
7. [Pasarelas de Pago](#7-pasarelas-de-pago)
8. [Correos Electrónicos](#8-correos-electrónicos)
9. [Panel de Administración](#9-panel-de-administración)
10. [Seguridad](#10-seguridad)
11. [API Reference](#11-api-reference)
12. [Variables de Entorno](#12-variables-de-entorno)
13. [Despliegue](#13-despliegue)
14. [Guía de Desarrollo](#14-guía-de-desarrollo)

---

## 1. Descripción General

Q10 Courses es una plataforma SaaS de cursos online con:

- **Catálogo público** de cursos con búsqueda, filtros por categoría y ordenamiento.
- **Sistema de carrito de compras** persistente con notificación de cantidad y dropdown hover.
- **Doble pasarela de pago:** Stripe (USD) y PSE (COP, Colombia).
- **Autenticación JWT** con cookies httpOnly y refresh token automático.
- **Tres roles:** USER, ADMIN y SUPER_ADMIN con distintos niveles de acceso.
- **Integración con Q10**: cada curso puede tener un enlace a Q10; las credenciales se envían por correo.
- **Dashboard de usuario**: cursos comprados, perfil, configuración, credenciales.
- **Panel de administración**: estadísticas en tiempo real, gestión de usuarios, cursos, pagos y base de datos.
- **Soporte multi-moneda:** precios en USD, COP, EUR, MXN y más.

---

## 2. Arquitectura

```
┌─────────────────────────────────────────────────┐
│                   Frontend                       │
│              Next.js 15 (App Router)             │
│         Vercel / Puerto :3000                    │
│                                                   │
│  ┌─────────┐ ┌──────────┐ ┌──────────────────┐  │
│  │ Páginas  │ │Componentes│ │  Providers        │  │
│  │ Públicas │ │   UI     │ │  Auth/Currency/   │  │
│  │ Dashboard│ │ shadcn/ui│ │  React Query      │  │
│  │ Admin    │ │          │ │  Theme            │  │
│  └─────────┘ └──────────┘ └──────────────────┘  │
│                                                   │
│  ┌──────────────────────────────────────────┐    │
│  │          Servicios (API Client)           │    │
│  │   Axios + Interceptor JWT + Refresh      │    │
│  └──────────────────────────────────────────┘    │
└──────────────────────┬──────────────────────────┘
                       │ HTTP (REST)
┌──────────────────────▼──────────────────────────┐
│                   Backend                        │
│              NestJS 11 (REST API)                │
│         Railway / Render / Puerto :4000          │
│                                                   │
│  ┌─────────┐ ┌──────────┐ ┌──────────────────┐  │
│  │ Auth    │ │ Cursos   │ │  Pagos            │  │
│  │ JWT     │ │ CRUD     │ │  Stripe + PSE     │  │
│  └─────────┘ └──────────┘ └──────────────────┘  │
│  ┌─────────┐ ┌──────────┐ ┌──────────────────┐  │
│  │ Carrito │ │ Usuarios │ │  Admin            │  │
│  │ Compras │ │ Perfil   │ │  Dashboard        │  │
│  └─────────┘ └──────────┘ └──────────────────┘  │
│  ┌─────────┐ ┌──────────┐                       │
│  │ Email   │ │Inscripc. │                       │
│  │ Brevo   │ │Cursos    │                       │
│  └─────────┘ └──────────┘                       │
│                                                   │
│  ┌──────────────────────────────────────────┐    │
│  │              Prisma ORM                   │    │
│  └──────────────────────────────────────────┘    │
└──────────────────────┬──────────────────────────┘
                       │
              ┌────────▼────────┐
              │   PostgreSQL    │
              │  (Supabase /    │
              │   Railway)      │
              └─────────────────┘
```

### Stack Tecnológico

| Capa       | Tecnología                              |
|------------|-----------------------------------------|
| Frontend   | Next.js 15, React 19, TypeScript        |
| UI         | TailwindCSS 3, shadcn/ui, Framer Motion |
| Estado     | TanStack React Query 5                  |
| Backend    | NestJS 11, TypeScript                   |
| ORM        | Prisma 5                                |
| DB         | PostgreSQL                              |
| Auth       | Passport.js + JWT, bcrypt               |
| Pagos      | Stripe, Wompi (PSE Colombia)            |
| Email      | Brevo (Sendinblue)                      |
| HTTP       | Axios con interceptors                  |
| Despliegue | Vercel, Railway/Render                  |

---

## 3. Modelo de Datos

### Diagrama Entidad-Relación

```
┌──────────┐       ┌──────────────┐       ┌───────────┐
│   User   │1───N▸│  Enrollment  │◂───N─1│  Course   │
├──────────┤       ├──────────────┤       ├───────────┤
│ id (PK)  │       │ id (PK)      │       │ id (PK)   │
│ name     │       │ userId (FK)  │       │ title     │
│ email*   │       │ courseId(FK) │       │ slug*     │
│ password │       │ paymentStatus│       │ price     │
│ role     │       │ accessGranted│       │ currency  │
│ isActive │       │ createdAt    │       │ category  │
│ q10User  │       └──────────────┘       │ instructor│
│ q10Pass  │                              └───────────┘
└──────────┘
     │ 1
     │
     │ N
┌──────────┐       ┌──────────────┐
│  CartItem│       │   Payment    │
├──────────┤       ├──────────────┤
│ id (PK)  │       │ id (PK)      │
│ userId   │       │ userId (FK)  │
│ courseId │       │ amount       │
│ createdAt│       │ currency     │
└──────────┘       │ status       │
                   │ transactionId│
                   │ gateway      │
                   └──────────────┘

┌────────────────┐
│ PasswordReset  │
├────────────────┤
│ id (PK)        │
│ email          │
│ token*         │
│ expiresAt      │
│ used           │
└────────────────┘
```

### Enumeraciones

| Enum           | Valores                       |
|----------------|-------------------------------|
| `Role`         | `USER`, `ADMIN`, `SUPER_ADMIN`|
| `PaymentStatus`| `PENDING`, `APPROVED`, `REJECTED`, `REFUNDED` |

### Relaciones Clave

- **User 1:N Enrollment** — Un usuario puede inscribirse en varios cursos
- **Course 1:N Enrollment** — Un curso puede tener múltiples inscripciones
- **User 1:N CartItem** — Carrito persistente por usuario
- **Course 1:N CartItem** — Cursos referenciados en carritos
- **User 1:N Payment** — Historial de pagos del usuario
- **Enrollment** tiene unique compuesto `[userId, courseId]`
- **CartItem** tiene unique compuesto `[userId, courseId]`

---

## 4. Autenticación y Roles

### Flujo de Autenticación

```
                ┌──────────────────────┐
                │   Frontend Axios     │
                │   Interceptor        │
                └──────┬───────────────┘
                       │ POST /auth/login
                       │ POST /auth/register
                       ▼
            ┌──────────────────────┐
            │   Backend Auth       │
            │   - Valida creds     │
            │   - Genera JWT       │
            │   - Setea cookies    │
            └──────┬───────────────┘
                   │
         ┌─────────┴────────────┐
         ▼                      ▼
  Cookie: access_token    Cookie: refresh_token
  (httpOnly, 15min)       (httpOnly, 7 días)
```

### Cookies (httpOnly)

| Cookie          | Duración | Propósito                |
|-----------------|----------|--------------------------|
| `access_token`  | 15 min   | Autenticar peticiones    |
| `refresh_token` | 7 días   | Renovar access_token     |

### Mecanismo de Refresh Automático

1. El interceptor de Axios detecta `401 Unauthorized`
2. Envía `POST /auth/refresh` con la cookie `refresh_token`
3. El backend valida el refresh token y genera nuevos tokens
4. El interceptor reintenta la petición original
5. Si el refresh falla, limpia sesión

### Roles y Permisos

| Acción                    | USER | ADMIN | SUPER_ADMIN |
|---------------------------|------|-------|-------------|
| Ver cursos públicos       |  ✓   |   ✓   |      ✓      |
| Comprar cursos            |  ✓   |   ✓   |      ✓      |
| Dashboard personal        |  ✓   |   ✓   |      ✓      |
| Panel de administración   |  ✗   |   ✓   |      ✓      |
| CRUD cursos               |  ✗   |   ✓   |      ✓      |
| Gestionar usuarios        |  ✗   |   ✓   |      ✓      |
| Cambiar roles (a ADMIN)   |  ✗   |   ✗   |      ✓      |
| Crear administradores     |  ✗   |   ✗   |      ✓      |
| Eliminar usuarios         |  ✗   |   ✗   |      ✓      |
| Ver base de datos (admin) |  ✗   |   ✗   |      ✓      |
| Monitoreo en tiempo real  |  ✗   |   ✗   |      ✓      |

### Redirección Automática

Si el usuario ya tiene sesión iniciada y navega a `/login` o `/register`:

```
/login ──¿Tiene sesión?──→ Sí ──→ Redirigir a /dashboard/my-courses
register ──¿Tiene sesión?──→ Sí ──→ Redirigir a /dashboard/my-courses
```

No se muestra el formulario, se redirige inmediatamente.

---

## 5. Módulos del Backend

### 5.1 Auth (`/api/auth`)

| Método | Ruta              | Auth     | Descripción                    |
|--------|-------------------|----------|--------------------------------|
| POST   | `/auth/register`  | No       | Registrar nuevo usuario        |
| POST   | `/auth/login`     | No       | Iniciar sesión                 |
| POST   | `/auth/logout`    | No       | Cerrar sesión (limpia cookies) |
| POST   | `/auth/refresh`   | No*      | Renovar access token           |
| POST   | `/auth/forgot-password` | No | Solicitar reset de contraseña  |
| POST   | `/auth/reset-password` | No | Cambiar contraseña con token   |
| GET    | `/auth/profile`   | JWT      | Obtener perfil del usuario     |
| PATCH  | `/auth/change-password` | JWT | Cambiar contraseña            |
| PATCH  | `/auth/change-email` | JWT    | Cambiar email                  |

*\*Requiere cookie refresh_token*

### 5.2 Courses (`/api/courses`)

| Método | Ruta                     | Auth       | Descripción             |
|--------|--------------------------|------------|-------------------------|
| GET    | `/courses`               | No         | Listar cursos activos   |
| GET    | `/courses/categories`    | No         | Obtener categorías      |
| GET    | `/courses/:slug`         | No         | Detalle de curso        |
| POST   | `/courses`               | ADMIN/SA   | Crear curso             |
| PATCH  | `/courses/:id`           | ADMIN/SA   | Actualizar curso        |
| DELETE | `/courses/:id`           | SUPER_ADMIN| Eliminar curso          |

**Parámetros de consulta (GET /courses):**
- `page`, `limit` — Paginación
- `category` — Filtro por categoría
- `search` — Búsqueda por título/descripción
- `sortBy` — `price_asc`, `price_desc`, `title`

### 5.3 Cart (`/api/cart`)

| Método | Ruta            | Auth | Descripción              |
|--------|-----------------|------|--------------------------|
| GET    | `/cart`         | JWT  | Obtener carrito          |
| POST   | `/cart/add`     | JWT  | Agregar curso al carrito |
| DELETE | `/cart/:courseId` | JWT | Eliminar curso del carrito |
| DELETE | `/cart`         | JWT  | Vaciar carrito           |

### 5.4 Payments (`/api/payments`)

| Método | Ruta                    | Auth       | Descripción                  |
|--------|-------------------------|------------|------------------------------|
| POST   | `/payments/create-stripe` | JWT      | Crear sesión Stripe          |
| POST   | `/payments/create-pse`    | JWT      | Obtener datos para PSE       |
| POST   | `/payments/webhook/stripe`| No*       | Webhook Stripe               |
| POST   | `/payments/webhook/pse`   | No*       | Webhook PSE (Wompi)          |
| GET    | `/payments/my-payments`   | JWT       | Historial de pagos           |
| GET    | `/payments`              | ADMIN/SA  | Listar todos los pagos       |

*\*Validado por firma del webhook*

### 5.5 Enrollments (`/api/enrollments`)

| Método | Ruta                    | Auth  | Descripción              |
|--------|-------------------------|-------|--------------------------|
| GET    | `/enrollments/my`       | JWT   | Mis cursos comprados     |
| GET    | `/enrollments`          | ADMIN/SA | Listar todas las inscripciones |

### 5.6 Users (`/api/users`)

| Método | Ruta              | Auth | Descripción           |
|--------|-------------------|------|-----------------------|
| PATCH  | `/users/profile`  | JWT  | Actualizar perfil     |

### 5.7 Admin (`/api/admin`)

| Método | Ruta                                    | Auth       | Descripción                    |
|--------|-----------------------------------------|------------|--------------------------------|
| GET    | `/admin/stats`                          | ADMIN/SA   | Estadísticas del dashboard     |
| GET    | `/admin/users`                          | ADMIN/SA   | Listar usuarios                |
| PATCH  | `/admin/users/:id/role`                 | ADMIN/SA   | Cambiar rol                    |
| PATCH  | `/admin/users/:id/toggle-status`        | ADMIN/SA   | Activar/suspender usuario      |
| DELETE | `/admin/users/:id`                      | SUPER_ADMIN| Eliminar usuario               |
| POST   | `/admin/create-admin`                   | SUPER_ADMIN| Crear administrador            |
| POST   | `/admin/create-user`                    | SUPER_ADMIN| Crear usuario                  |
| PATCH  | `/admin/courses/:id`                    | ADMIN/SA   | Actualizar curso               |
| POST   | `/admin/send-credentials/:userId`       | ADMIN/SA   | Enviar credenciales por correo |
| POST   | `/admin/send-credentials-password/:userId` | ADMIN/SA | Enviar credenciales con contraseña |
| POST   | `/admin/verify-key`                     | SUPER_ADMIN| Verificar clave de superadmin  |

### 5.8 Email (`EmailService`)

Servicio interno (sin endpoints REST). Envía correos transaccionales mediante Brevo:

| Tipo de Correo                    | Gatillado por                          |
|-----------------------------------|----------------------------------------|
| Bienvenida                        | Registro de usuario                    |
| Confirmación de compra            | Pago aprobado (incluye link Q10)       |
| Restablecer contraseña            | Solicitud `forgot-password`            |
| Credenciales de acceso            | Admin envía credenciales               |
| Credenciales Q10                  | Admin envía credenciales Q10           |

**Modo desarrollo:** Si `BREVO_API_KEY` no es válida, los correos se simulan en consola.

---

## 6. Módulos del Frontend

### 6.1 Páginas Públicas

| Ruta              | Descripción                              |
|-------------------|------------------------------------------|
| `/`               | Landing page con Hero, cursos, beneficios|
| `/courses`        | Catálogo con búsqueda, filtros, paginación|
| `/courses/[id]`   | Detalle del curso con opciones de compra |
| `/about`          | Página "Sobre Nosotros"                  |
| `/login`          | Inicio de sesión                         |
| `/register`       | Registro de usuario                      |
| `/forgot-password`| Recuperación de contraseña               |
| `/reset-password` | Restablecer contraseña (vía token)       |

### 6.2 Dashboard (Usuario Autenticado)

| Ruta                          | Descripción                              |
|-------------------------------|------------------------------------------|
| `/dashboard/my-courses`       | Cursos comprados                         |
| `/dashboard/cart`             | Carrito de compras con selección de gateway |
| `/dashboard/purchases`        | Historial de compras                     |
| `/dashboard/credentials`      | Credenciales de acceso                   |
| `/dashboard/profile`          | Editar perfil                            |
| `/dashboard/settings`         | Configuración de cuenta                  |

### 6.3 Panel de Administración

| Ruta                    | Rol         | Descripción                          |
|-------------------------|-------------|--------------------------------------|
| `/admin`                | ADMIN/SA    | Estadísticas generales               |
| `/admin/users`          | ADMIN/SA    | Gestión de usuarios                  |
| `/admin/courses`        | ADMIN/SA    | CRUD de cursos                       |
| `/admin/payments`       | ADMIN/SA    | Listado de pagos                     |
| `/admin/access`         | SUPER_ADMIN | Crear administradores                |
| `/admin/create-user`    | SUPER_ADMIN | Crear usuarios                       |
| `/admin/realtime`       | SUPER_ADMIN | Monitoreo en tiempo real             |
| `/admin/database`       | SUPER_ADMIN | Explorador de base de datos          |

### 6.4 Componentes Compartidos

| Componente                     | Ubicación                                   |
|--------------------------------|---------------------------------------------|
| `Navbar`                       | `components/layout/navbar.tsx`              |
| `Footer`                       | `components/layout/footer.tsx`              |
| `Button`                       | `components/ui/button.tsx`                  |
| `Badge`                        | `components/ui/badge.tsx`                   |
| `Card`                         | `components/ui/card.tsx`                    |
| `Input`                        | `components/ui/input.tsx`                   |
| `CurrencyToggle`               | `components/currency-toggle.tsx`            |
| `KeyConfirmDialog`             | `components/admin/key-confirm-dialog.tsx`   |

### 6.5 Carrito de Compras

El carrito de compras tiene dos puntos de interacción:

1. **Navbar (Desktop):** Ícono con badge numérico + dropdown hover que muestra los cursos agregados
2. **Mobile:** Enlace "Carrito" con badge numérico en el menú desplegable
3. **Página /dashboard/cart:** Vista completa con lista de cursos, total y selección de gateway

El carrito es persistente (se almacena en la base de datos vinculado al usuario).

### 6.6 Multi-moneda

Los cursos pueden tener un campo `currency` (USD por defecto). El frontend:
- Muestra el toggle USD/COP en la navbar
- Convierte COP/USD usando tasa `COP_RATE = 4200` para preview
- En el panel admin, permite crear/editar cursos en USD, COP, EUR, MXN
- Al pagar con Stripe, usa la moneda nativa del curso
- Al pagar con PSE, siempre usa COP

---

## 7. Pasarelas de Pago

### Stripe (USD y otras monedas)

- Integración con Stripe Checkout Sessions
- Webhook `checkout.session.completed` para aprobar pagos
- Usa la moneda definida en `course.currency` (por defecto USD)
- Metadata incluye `userId` y `courseId`

### PSE (COP - Colombia)

- Implementado a través de la infraestructura de Wompi
- Genera firma de integridad SHA256 con `WOMPI_INTEGRITY_SECRET`
- Redirecciona al checkout de Wompi con `payment-method=PSE`
- Webhook `/webhook/pse` recibe confirmación de pago
- El webhook extrae `userId` y `courseId` del `reference`

### Flujo de Pago

```
Usuario agrega curso al carrito
         │
         ▼
Selecciona gateway (Stripe o PSE)
         │
         ▼
Backend crea sesión/preparación de pago
         │
         ▼
Redirección a pasarela externa
         │
         ▼
Pago completado → Webhook
         │
         ▼
Transacción: Payment + Enrollment (upsert)
         │
         ▼
Email de confirmación al usuario
```

---

## 8. Correos Electrónicos

### Configuración

```
BREVO_API_KEY=xkeysib-...
EMAIL_FROM=noreply@tudominio.com
EMAIL_FROM_NAME="Q10 Courses"
```

### Tipos de Correo

| Tipo                | Disparador           | Contenido                             |
|---------------------|----------------------|---------------------------------------|
| Bienvenida          | Registro             | "Bienvenido a Q10 Courses"            |
| Compra confirmada   | Webhook de pago      | Curso, link Q10 si aplica             |
| Reset contraseña    | forgot-password      | Link con token para reset             |
| Credenciales página | Admin action         | Email de acceso a la plataforma       |
| Credenciales Q10    | Admin action         | Usuario/contraseña y enlaces a cursos Q10 |

### Modo Desarrollo

Si `BREVO_API_KEY` es inválida o está vacía, el servicio `EmailService` imprime los correos en la consola del servidor en lugar de enviarlos realmente.

---

## 9. Panel de Administración

### Estadísticas

Endpoint `GET /admin/stats` retorna:

| Campo             | Descripción                       |
|-------------------|-----------------------------------|
| totalUsers        | Total de usuarios registrados     |
| totalCourses      | Cursos activos                    |
| totalEnrollments  | Inscripciones aprobadas           |
| totalRevenue      | Suma de ingresos                  |
| totalCartItems    | Items en carritos (abandonados)   |
| recentUsers       | Últimos 5 usuarios registrados    |
| topCourses        | Top 5 cursos con más ventas       |

### Gestión de Usuarios

- Buscar por nombre o email
- Cambiar rol entre USER y ADMIN (solo SUPER_ADMIN puede asignar ADMIN)
- Suspender/activar usuarios
- Eliminar usuarios permanentemente (solo SUPER_ADMIN)
- Enviar credenciales de acceso por correo
- Configurar credenciales Q10 por usuario

### Gestión de Cursos

- Crear, editar, desactivar cursos
- Precios multi-moneda (USD, COP, EUR, MXN)
- Editar slug, descripción, instructor, categoría
- Vincular enlace Q10 por curso

### Seguridad en Admin

- Toda acción destructiva requiere clave de SUPER_ADMIN (`SUPER_ADMIN_KEY`)
- El SUPER_ADMIN no puede ser eliminado (protección en backend)
- Los ADMIN no pueden crear otros ADMIN (solo lectura)

### Monitoreo en Tiempo Real

- Polling cada 10 segundos via React Query
- Estadísticas actualizadas en tiempo real
- Accesible solo para SUPER_ADMIN

---

## 10. Seguridad

### JWT y Cookies

| Medida                | Implementación                       |
|-----------------------|--------------------------------------|
| Tokens                | JWT con expiración: 15min (access), 7d (refresh) |
| Almacenamiento        | Cookies httpOnly (no accesibles via JS) |
| Transmisión           | SameSite=Lax, Secure en producción   |
| Refresh automático    | Interceptor Axios + endpoint /refresh |
| Contraseñas           | bcrypt con 12 rounds                 |

### Protección de Endpoints

- Guards: `JwtAuthGuard` (autenticación), `RolesGuard` (autorización)
- Decorador `@Roles()` para restringir por rol
- Todas las acciones administrativas sensibles requieren `SUPER_ADMIN_KEY`

### Validación

- `class-validator` en todos los DTOs
- Sanitización de entradas
- Protección contra SQL injection via Prisma parametrizado

### Otras Medidas

- Helmet para headers de seguridad HTTP
- CORS configurado con `FRONTEND_URL`
- CSRF mitigado mediante cookies SameSite
- El Superadmin no puede ser eliminado (protección a nivel de aplicación)

---

## 11. API Reference

### Base URL

```
Desarrollo: http://localhost:4000/api
Producción: https://tu-api.com/api
```

### Formato de Respuestas

**Éxito:**
```json
{
  "data": { ... },
  "meta": {
    "total": 100,
    "page": 1,
    "limit": 20,
    "totalPages": 5
  }
}
```

**Error:**
```json
{
  "message": "Descripción del error",
  "error": "Tipo de error",
  "statusCode": 400
}
```

### Códigos de Estado

| Código | Significado                  |
|--------|------------------------------|
| 200    | OK                           |
| 201    | Creado                       |
| 400    | Bad Request                  |
| 401    | Unauthorized                 |
| 403    | Forbidden                    |
| 404    | Not Found                    |
| 409    | Conflict                     |
| 500    | Internal Server Error        |

### Paginación

Todos los endpoints de lista soportan paginación via `page` y `limit` (query params).

---

## 12. Variables de Entorno

### Backend (`.env`)

| Variable                | Requerida | Descripción                         |
|-------------------------|-----------|-------------------------------------|
| `DATABASE_URL`          | Sí        | Cadena de conexión PostgreSQL       |
| `JWT_SECRET`            | Sí        | Secreto para firmar access tokens   |
| `JWT_REFRESH_SECRET`    | Sí        | Secreto para firmar refresh tokens  |
| `JWT_EXPIRATION`        | No        | TTL access token (default: 15m)     |
| `JWT_REFRESH_EXPIRATION`| No        | TTL refresh token (default: 7d)     |
| `STRIPE_SECRET_KEY`     | Sí*       | SK de Stripe (*si se usa Stripe)    |
| `STRIPE_WEBHOOK_SECRET` | Sí*       | Webhook secret de Stripe            |
| `WOMPI_PUBLIC_KEY`      | No        | PK de Wompi para PSE                |
| `WOMPI_INTEGRITY_SECRET`| No        | Secreto de integridad Wompi         |
| `WOMPI_EVENTS_KEY`      | No        | Clave de eventos Wompi              |
| `BREVO_API_KEY`         | No        | API key de Brevo (correos)          |
| `EMAIL_FROM`            | No        | Remitente de correos                |
| `EMAIL_FROM_NAME`       | No        | Nombre del remitente                |
| `FRONTEND_URL`          | Sí        | URL del frontend (CORS + redirects) |
| `PORT`                  | No        | Puerto del servidor (default: 3000) |
| `NODE_ENV`              | No        | development/production              |
| `SUPER_ADMIN_KEY`       | Sí        | Clave maestra para acciones admin   |

### Frontend (`.env.local`)

| Variable                   | Requerida | Descripción                    |
|----------------------------|-----------|--------------------------------|
| `NEXT_PUBLIC_API_URL`      | Sí        | URL base de la API             |
| `NEXT_PUBLIC_STRIPE_KEY`   | Sí*       | PK de Stripe (*si se usa Stripe)|

---

## 13. Despliegue

### Frontend → Vercel

```bash
cd frontend
vercel --prod
```

Variables de entorno requeridas en Vercel:
- `NEXT_PUBLIC_API_URL`

### Backend → Railway / Render

```bash
cd backend
git push railway main
```

Variables de entorno requeridas en Railway/Render:
- Todas las del backend (ver sección 12)

### Base de Datos → Railway PostgreSQL / Supabase / Neon

```sql
-- La base de datos se configura automáticamente con:
npx prisma db push
```

### Monorepo

```bash
# Instalar dependencias
cd backend && npm install
cd frontend && npm install

# Iniciar desarrollo
cd backend && npm run start:dev  # :4000
cd frontend && npm run dev       # :3000
```

---

## 14. Guía de Desarrollo

### Requisitos

- Node.js 18+
- PostgreSQL 14+
- npm o pnpm

### Setup Local

```bash
# 1. Clonar repositorio
git clone <repo-url>
cd PaginaREACT

# 2. Configurar backend
cd backend
cp .env.example .env
# Editar .env con tus credenciales
npm install
npx prisma generate
npx prisma db push
npm run start:dev

# 3. Configurar frontend (nueva terminal)
cd frontend
cp .env.example .env.local
# Editar .env.local
npm install
npm run dev

# 4. Abrir http://localhost:3000
```

### Comandos Útiles

```bash
# Backend
npm run start:dev      # Desarrollo con hot reload
npm run build          # Compilar producción
npm run start:prod     # Iniciar producción

# Frontend
npm run dev            # Desarrollo
npm run build          # Build producción
npm run start          # Iniciar producción

# Prisma
npx prisma generate    # Generar cliente
npx prisma db push     # Sincronizar schema
npx prisma studio      # UI de base de datos
npx prisma migrate dev # Migraciones
```

### Estructura del Proyecto

```
PaginaREACT/
├── backend/                     # NestJS API
│   ├── prisma/
│   │   ├── schema.prisma        # Modelo de datos
│   │   └── seed.ts              # Datos de prueba
│   ├── src/
│   │   ├── main.ts              # Entry point
│   │   ├── app.module.ts        # Módulo raíz
│   │   ├── common/              # Guards, decorators, filtros
│   │   └── modules/
│   │       ├── auth/            # Autenticación JWT
│   │       ├── users/           # Gestión de usuarios
│   │       ├── courses/         # CRUD cursos
│   │       ├── cart/            # Carrito de compras
│   │       ├── payments/        # Stripe + PSE
│   │       ├── enrollments/     # Inscripciones
│   │       ├── admin/           # Panel admin
│   │       └── email/           # Correos (Brevo)
│   └── .env
│
├── frontend/                    # Next.js App
│   ├── src/
│   │   ├── app/                 # App Router (páginas)
│   │   │   ├── login/
│   │   │   ├── register/
│   │   │   ├── dashboard/
│   │   │   ├── admin/
│   │   │   └── ...
│   │   ├── components/          # Componentes UI
│   │   │   ├── layout/          # Navbar, Footer
│   │   │   └── ui/              # shadcn/ui
│   │   ├── hooks/               # Hooks personalizados
│   │   ├── lib/                 # Utilidades, API client
│   │   ├── services/            # Servicios API
│   │   └── types/               # Tipos TypeScript
│   └── .env.local
│
└── DOCUMENTATION.md             # Este archivo
```

### Convenciones de Código

- **TypeScript** estricto en todo el código
- **ESLint** para linting
- **Prettier** para formateo
- **Commits descriptivos** en español o inglés
- **Componentes:** Funcionales con hooks, "use client" cuando usan estado/efectos
- **API:** RESTful, respuestas consistentes
- **Base de datos:** Prisma ORM, migraciones para cambios de schema

---

## Licencia

Este proyecto es propiedad de Q10 Courses. Todos los derechos reservados.

---

*Documentación generada el 28 de mayo de 2026.*
