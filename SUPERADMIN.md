# 🛡️ SUPERADMIN — Guía Completa de la Plataforma Q10 Courses

---

## 🔐 ACCESO SUPERADMIN

| Campo | Valor |
|-------|-------|
| **Email** | `admin@q10courses.com` |
| **Contraseña** | `Admin123!` |
| **Rol** | `SUPER_ADMIN` |
| **Clave de seguridad** | Configurada en `backend/.env` → `SUPER_ADMIN_KEY` |

> ⚠️ **IMPORTANTE**: La clave de seguridad (`SUPER_ADMIN_KEY`) se define en el archivo `.env` del backend.
> Por defecto es: `SuperAdmin2026!CambiaEsto`
> **DEBES CAMBIARLA** antes de desplegar a producción.

---

## ✏️ CÓMO CAMBIAR MIS PROPIAS CREDENCIALES

### Cambiar contraseña
1. Inicia sesión como superadmin
2. Ve a **Dashboard → Configuración** (`/dashboard/settings`)
3. En la sección **"Cambiar Contraseña"**:
   - Ingresa tu contraseña actual
   - Ingresa la nueva contraseña (mínimo 8 caracteres)
   - Confirma la nueva contraseña
   - Haz clic en **"Actualizar Contraseña"**
4. La próxima vez que inicies sesión, usa la nueva contraseña

### Cambiar email del superadmin
1. Ve a **Dashboard → Configuración** (`/dashboard/settings`)
2. En la sección **"Cambiar Email del Superadmin"**:
   - Ingresa el nuevo email
   - Ingresa la **clave de seguridad** (`SUPER_ADMIN_KEY`)
   - Haz clic en **"Actualizar Email"**
3. A partir de ese momento, inicia sesión con el nuevo email

### Cambiar la SUPER_ADMIN_KEY
La clave de seguridad se configura en el archivo `backend/.env`:

```env
SUPER_ADMIN_KEY="SuperAdmin2026!CambiaEsto"
```

- **En desarrollo**: Edita directamente el archivo `backend/.env`
- **En producción (Railway)**: Ve a las variables de entorno de tu servicio y cambia `SUPER_ADMIN_KEY`
- **En producción (Render)**: Ve a Environment Variables en el dashboard de Render

> ⚠️ Sin la `SUPER_ADMIN_KEY` no se pueden realizar operaciones críticas como crear admins, eliminar usuarios o cambiar enlaces Q10.

---

## 📋 ¿QUÉ HACE LA PLATAFORMA?

Q10 Courses es una plataforma de venta de cursos online que **NO almacena los cursos**. Los cursos se imparten a través de **Q10**. La plataforma funciona como:

1. **Landing page profesional** — Página principal con hero, beneficios, testimonios, CTA
2. **Catálogo de cursos** — Buscador, filtros por categoría, ordenamiento por precio
3. **Sistema de autenticación** — Registro, login, recuperación de contraseña
4. **Carrito de compras** — Los usuarios agregan cursos y pagan después
5. **Pagos integrados** — Stripe (internacional) + Wompi (Colombia) con selección de gateway
6. **Dashboard de usuarios** — Mis cursos, carrito, historial de compras, perfil
7. **Dashboard administrativo** — Gestión completa de la plataforma
8. **Redirección a Q10** — Los usuarios acceden a los cursos desde botones que redirigen a Q10
9. **Página "Sobre Nosotros"** — Información de la empresa, misión, visión, valores y equipo
10. **Animaciones** — Transiciones suaves en toda la interfaz con Framer Motion
11. **Datos en tiempo real** — Estadísticas actualizadas automáticamente cada 10 segundos

---

## 👑 PODERES DEL SUPERADMIN

El Superadmin tiene control **TOTAL** sobre la plataforma:

### 1. Gestión de Cursos
- ✅ **Crear** cursos nuevos (título, descripción, precio, categoría, instructor)
- ✅ **Editar** cualquier campo del curso (requiere clave de seguridad)
- ✅ **Cambiar precios** de cualquier curso
- ✅ **Crear cursos con precio en COP** — opción de $1 peso colombiano para pruebas
- ✅ **Cambiar nombres** de cursos
- ✅ **Cambiar enlaces Q10** — los links de redirección a Q10 los cambia SOLO el superadmin
- ✅ **Desactivar/eliminar** cursos

### 2. Gestión de Usuarios
- ✅ **Ver** todos los usuarios registrados
- ✅ **Ver comparativa** de usuarios registrados vs no registrados (con o sin cursos comprados)
- ✅ **Crear usuarios** nuevos directamente desde el panel (`/admin/create-user`)
- ✅ **Cambiar roles**: USER ↔ ADMIN (con clave)
- ✅ **Suspender/activar** usuarios (con clave)
- ✅ **Eliminar** usuarios permanentemente (con clave) — excepto a sí mismo
- ✅ **Enviar credenciales** por correo a cualquier usuario

### 3. Gestión de Administradores
- ✅ **Crear nuevos administradores** (rol ADMIN o SUPER_ADMIN)
- ✅ Requiere clave de seguridad para crear admins
- ✅ El Superadmin **NO puede ser eliminado** por nadie
- ✅ El Superadmin **NO puede ser degradado** sin confirmación
- ✅ Solo el Superadmin puede acceder a las secciones de administración avanzada

### 4. Gestión de Pagos
- ✅ **Ver** todos los pagos realizados
- ✅ **Filtrar** por estado (aprobados, pendientes, rechazados)
- ✅ **Ver historial** completo de transacciones
- ✅ **Pagos con Stripe** (USD) y **Wompi** (COP)
- ✅ Los usuarios pueden elegir el gateway de pago

### 5. Estadísticas en Tiempo Real
- ✅ **Total de usuarios** registrados
- ✅ **Total de ingresos** generados
- ✅ **Cursos más vendidos**
- ✅ **Últimos registros** de usuarios
- ✅ **Artículos en carritos** de compra
- ✅ **Monitor en tiempo real** (`/admin/realtime`) con actualización cada 5 segundos
- ✅ **Dashboard principal** con actualización automática cada 10 segundos

### 6. Base de Datos
- ✅ **Información completa** de la base de datos (`/admin/database`)
- ✅ **Estado de conexiones**: PostgreSQL, API, servicios de correo
- ✅ **Conteo de registros** por tabla (usuarios, cursos, inscripciones, pagos)

---

## 🔑 SISTEMA DE CLAVE DE SEGURIDAD

Para cualquier operación sensible, el sistema solicita una **clave de seguridad**:

| Operación | Clave requerida |
|-----------|----------------|
| Editar curso (Superadmin) | ✅ Sí |
| Cambiar rol de usuario | ✅ Sí |
| Suspender/activar usuario | ✅ Sí |
| Eliminar usuario | ✅ Sí |
| Crear administrador | ✅ Sí |
| Crear usuario | ✅ Sí |
| Cambiar enlace Q10 | ✅ Sí |
| Enviar credenciales | ✅ Sí |
| Editar curso (Admin regular) | ❌ No |

---

## 👥 ROLES DEL SISTEMA

### SUPER_ADMIN
- Acceso a TODO el panel `/admin` (incluyendo secciones exclusivas)
- Puede crear otros admins y superadmins
- Puede **crear usuarios** directamente
- Cambia enlaces Q10
- **NO puede ser eliminado** por ningún otro usuario
- Requiere clave de seguridad para operaciones críticas
- Acceso a monitor en tiempo real y dashboard de base de datos

### ADMIN
- Acceso al panel `/admin` (secciones limitadas)
- Puede ver usuarios, cursos, pagos, estadísticas
- Puede editar cursos (sin clave)
- Puede cambiar roles de usuarios USER
- Puede enviar credenciales
- **NO** puede crear nuevos admins
- **NO** puede cambiar enlaces Q10
- **NO** puede eliminar usuarios
- **NO** puede crear usuarios
- **NO** tiene acceso a secciones exclusivas de superadmin

### USER
- Acceso a dashboard `/dashboard`
- Ve sus cursos comprados
- Tiene carrito de compras
- Accede a Q10 desde los botones "Ir al Curso"
- Puede pagar con Stripe (USD) o Wompi (COP)
- No tiene acceso al panel admin

---

## 🛒 FLUJO DEL USUARIO

```
1. Usuario entra a la web
2. Explora el catálogo de cursos
3. Agrega cursos al carrito 🛒
4. Va al carrito y hace clic en "Ir a Pagar"
5. Elige método de pago: Stripe (USD) o Wompi (COP)
6. Es redirigido al gateway seleccionado para pagar
7. Gateway procesa el pago
8. Webhook confirma el pago en el backend
9. Se crea la inscripción (enrollment)
10. Se envía correo automático de confirmación
11. Usuario ve el curso en "Mis Cursos"
12. Usuario hace clic en "Ir al Curso en Q10"
13. Es redirigido al enlace Q10 correspondiente
```

---

## 📧 SISTEMA DE CORREOS

### Correos automáticos (se envían sin intervención)
| Correo | Cuándo se envía |
|--------|-----------------|
| Bienvenida | Al registrarse |
| Confirmación de compra | Después de pago exitoso |
| Recuperación de contraseña | Cuando el usuario lo solicita |

### Correos manuales (los envía Admin o Superadmin)
| Correo | Quién lo envía |
|--------|---------------|
| Credenciales de acceso | Admin o Superadmin desde el panel |

---

## 🌐 ENLACES Q10

Cada curso tiene un campo `q10Link` que contiene la URL del curso en Q10.

- **Los administradores** pueden ver si un curso tiene link Q10
- **SOLO el Superadmin** puede modificar el enlace Q10
- El botón "Ir al Curso" en el dashboard del usuario redirige a este enlace
- Si un curso no tiene enlace Q10, el botón de acceso no se muestra

---

## 💳 SISTEMA DE PAGOS

### Stripe (Internacional)
- Moneda: USD
- Integración con Stripe Checkout
- Webhook validado con firma
- Soporta tarjetas de crédito/débito internacionales

### Wompi (Colombia)
- Moneda: COP
- Integración para pagos en Colombia
- Webhook validado con firma
- Soporta PSE, tarjetas, Nequi, Daviplata
- **Curso de $1 COP**: Se puede crear un curso de prueba con valor de 1 peso colombiano

---

## 📊 PANEL ADMIN — SECCIONES

### `/admin` — Estadísticas
- Dashboard con datos en tiempo real (actualización automática cada 10 segundos)
- Tarjetas animadas con totales (usuarios, cursos, ingresos, inscripciones)
- Últimos 5 usuarios registrados con su rol
- Top 5 cursos más vendidos
- Total de artículos en carritos de compra

### `/admin/users` — Usuarios
- Buscador por nombre o email
- **Comparativa**: usuarios totales, activos, con cursos, sin cursos
- Lista de todos los usuarios con acciones:
  - Enviar credenciales por correo
  - Cambiar rol (USER ↔ ADMIN)
  - Suspender/activar cuenta
  - Eliminar usuario (solo Superadmin)
- Paginación para navegar entre usuarios

### `/admin/courses` — Cursos
- Crear cursos nuevos con selector de moneda (USD / COP)
- **Opción COP $1**: Crea cursos de prueba por 1 peso colombiano
- Editar cursos existentes
- Ver qué cursos tienen link Q10
- Cambiar enlaces Q10 (requiere clave)
- Animaciones en cards del listado

### `/admin/payments` — Pagos
- Lista de todos los pagos
- Filtro por estado (Todos, Aprobados, Pendientes, Rechazados)
- Ver usuario, monto, gateway, fecha, ID de transacción

### `/admin/access` — Accesos
- Crear nuevos administradores
- Seleccionar rol (ADMIN o SUPER_ADMIN)
- Requiere clave de seguridad
- Aviso de seguridad sobre protección del Superadmin

### `/admin/create-user` — Crear Usuario (SOLO SUPERADMIN)
- Formulario para crear usuarios directamente
- Nombre, email, contraseña
- Requiere clave de seguridad
- Útil para registrar usuarios sin que ellos se registren

### `/admin/realtime` — Tiempo Real (SOLO SUPERADMIN)
- Monitor en vivo con actualización cada 5 segundos
- Tarjetas animadas con datos actualizados
- Comparativa de usuarios registrados vs no registrados
- Últimos registros en tiempo real
- Cursos más vendidos
- Artículos en carritos

### `/admin/database` — Base de Datos (SOLO SUPERADMIN)
- Información completa de la base de datos
- Estado de conexiones: PostgreSQL, API, correos
- Conteo de registros por tabla
- Indicadores visuales de estado del sistema

---

## 🎨 ANIMACIONES

La plataforma incluye animaciones en todas las páginas principales:

- **Landing page**: Hero animado, cards con aparición progresiva, hover effects
- **Catálogo**: Cards con hover states mejorados, transiciones suaves
- **Panel admin**: Transiciones entre páginas, datos animados en tiempo real
- **Página Sobre Nosotros**: Animaciones secuenciales con Framer Motion
- **Scroll**: Animaciones basadas en viewport (al hacer scroll)
- **Hover**: Escala, colores, sombras en elementos interactivos
- **Carga**: Skeleton loaders con animaciones

---

## 🚀 DESPLIEGUE

### Frontend → Vercel
```bash
cd frontend
vercel --prod
```

Variables de entorno requeridas:
- `NEXT_PUBLIC_API_URL` — URL del backend
- `NEXT_PUBLIC_STRIPE_KEY` — Clave pública de Stripe

### Backend → Railway
```bash
cd backend
railway up
```

Variables de entorno requeridas en producción:
- `DATABASE_URL` — PostgreSQL
- `JWT_SECRET` — Secreto JWT
- `JWT_REFRESH_SECRET` — Secreto refresh token
- `STRIPE_SECRET_KEY` — Stripe
- `STRIPE_WEBHOOK_SECRET` — Stripe webhook
- `WOMPI_PUBLIC_KEY` — Clave pública de Wompi
- `WOMPI_PRIVATE_KEY` — Clave privada de Wompi
- `WOMPI_INTEGRITY_SECRET` — Secreto de integridad Wompi
- `WOMPI_EVENTS_KEY` — Clave de eventos Wompi
- `RESEND_API_KEY` — Email
- `FRONTEND_URL` — URL del frontend
- `SUPER_ADMIN_KEY` — Clave de seguridad del superadmin

---

## ⚠️ RECOMENDACIONES DE SEGURIDAD

1. **Cambiar la contraseña por defecto** del superadmin inmediatamente
2. **Cambiar `SUPER_ADMIN_KEY`** antes de producción
3. Usar contraseñas de **más de 12 caracteres**
4. Configurar **HTTPS** obligatorio en producción
5. Mantener las **claves de Stripe y Wompi** en producción
6. No compartir la `SUPER_ADMIN_KEY` con nadie que no sea superadmin
7. Revisar periódicamente los logs de acceso al panel admin
8. Mantener actualizadas las dependencias
9. El **Superadmin no puede ser eliminado** — protección a nivel de backend
10. No compartir credenciales de superadmin con terceros

---

## 🔗 API ENDPOINTS COMPLETOS

### Autenticación
| Método | Ruta | Descripción |
|--------|------|-------------|
| POST | `/api/auth/register` | Registro de usuario |
| POST | `/api/auth/login` | Inicio de sesión |
| POST | `/api/auth/logout` | Cerrar sesión |
| POST | `/api/auth/refresh` | Renovar token |
| POST | `/api/auth/forgot-password` | Recuperar contraseña |
| POST | `/api/auth/reset-password` | Restablecer contraseña |
| GET | `/api/auth/profile` | Perfil del usuario |

### Cursos
| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/api/courses` | Listar cursos (con filtros) |
| GET | `/api/courses/categories` | Listar categorías |
| GET | `/api/courses/:slug` | Detalle del curso |
| POST | `/api/courses` | Crear curso (admin) |
| PATCH | `/api/courses/:id` | Actualizar curso (admin) |
| DELETE | `/api/courses/:id` | Eliminar curso (superadmin) |

### Carrito
| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/api/cart` | Ver carrito |
| POST | `/api/cart/add` | Agregar al carrito |
| DELETE | `/api/cart/:courseId` | Quitar del carrito |
| DELETE | `/api/cart` | Vaciar carrito |

### Pagos
| Método | Ruta | Descripción |
|--------|------|-------------|
| POST | `/api/payments/create-stripe` | Crear pago Stripe |
| POST | `/api/payments/create-wompi` | Crear pago Wompi |
| POST | `/api/payments/webhook/stripe` | Webhook Stripe |
| POST | `/api/payments/webhook/wompi` | Webhook Wompi |
| GET | `/api/payments/my-payments` | Mis pagos |
| GET | `/api/payments` | Todos los pagos (admin) |

### Admin
| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/api/admin/stats` | Estadísticas |
| GET | `/api/admin/users` | Listar usuarios |
| GET | `/api/admin/users/comparison` | Comparativa registrados vs no registrados |
| PATCH | `/api/admin/users/:id/role` | Cambiar rol |
| PATCH | `/api/admin/users/:id/toggle-status` | Suspender/activar |
| DELETE | `/api/admin/users/:id` | Eliminar usuario (superadmin) |
| POST | `/api/admin/create-admin` | Crear admin (superadmin) |
| POST | `/api/admin/create-user` | Crear usuario (superadmin) |
| POST | `/api/admin/send-credentials/:userId` | Enviar credenciales |
| PATCH | `/api/admin/courses/:id` | Actualizar curso (admin) |
| PATCH | `/api/admin/courses/:id/q10-link` | Cambiar link Q10 (superadmin) |
| POST | `/api/admin/verify-key` | Verificar clave de seguridad |

---

## ✨ NUEVAS FUNCIONALIDADES

### 1. Página "Sobre Nosotros" (`/about`)
Página informativa con:
- Misión, visión y valores de la empresa
- Equipo de trabajo
- Animaciones con Framer Motion
- Llamado a la acción para registrarse

### 2. Creación de Usuarios por Superadmin (`/admin/create-user`)
- Formulario exclusivo para superadmin
- Crear usuarios sin necesidad de registro
- Requiere clave de seguridad

### 3. Monitor en Tiempo Real (`/admin/realtime`)
- Actualización automática cada 5 segundos
- Datos animados
- Comparativa de usuarios
- Acceso exclusivo para Superadmin

### 4. Dashboard de Base de Datos (`/admin/database`)
- Estado del sistema
- Conteo de registros
- Indicadores visuales
- Acceso exclusivo para Superadmin

### 5. Curso de $1 COP
- Opción para crear cursos con precio de 1 peso colombiano
- Ideal para pruebas y promociones
- Integración con Wompi para pagos en COP

### 6. Animaciones Globales
- Framer Motion en landing, catálogo, admin, about
- Transiciones suaves entre secciones
- Hover effects mejorados
- Scroll-based animations
- Custom CSS animations (fadeIn, slideUp, scaleIn)
- Scrollbar personalizada

### 7. Datos en Tiempo Real
- React Query con refetchInterval (10s)
- Polling en monitor en vivo (5s)
- Actualización automática sin recargar página

---

> 📌 **Documentación generada el 27 de mayo de 2026**
> Q10 Courses v1.1.0 — Todos los derechos reservados
