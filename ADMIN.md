# ADMIN — Guía del Administrador de Q10 Courses

---

## ¿Qué puede hacer un ADMIN?

El rol **ADMIN** tiene acceso limitado al panel de administración. No puede crear otros admins ni realizar operaciones críticas sin la clave del superadmin.

### 1. Gestión de Cursos
- ✅ Ver todos los cursos
- ✅ Crear cursos nuevos
- ✅ Editar cursos (sin clave de seguridad)
- ✅ Cambiar precios, nombres, descripciones
- ❌ **No puede** eliminar cursos
- ❌ **No puede** cambiar enlaces Q10 (solo superadmin)

### 2. Gestión de Usuarios
- ✅ Ver todos los usuarios registrados
- ✅ Cambiar roles de USER a ADMIN
- ✅ Suspender/activar usuarios (con clave de seguridad)
- ✅ Enviar credenciales por correo a usuarios (con clave)
- ❌ **No puede** eliminar usuarios
- ❌ **No puede** crear usuarios nuevos

### 3. Gestión de Pagos
- ✅ Ver todos los pagos realizados
- ✅ Filtrar por estado (aprobados, pendientes, rechazados)
- ✅ Ver historial completo de transacciones

### 4. Estadísticas
- ✅ Ver total de usuarios, cursos, ingresos, inscripciones
- ✅ Ver últimos registros
- ✅ Ver cursos más vendidos

### 5. Accesos
- ❌ **No puede** crear nuevos administradores
- ❌ **No puede** crear usuarios

---

## Secciones del Panel Admin

### `/admin` — Estadísticas
- Dashboard con datos en tiempo real (actualización automática cada 10 segundos)
- Tarjetas con totales: usuarios, cursos, ingresos, inscripciones
- Últimos 5 usuarios registrados
- Top 5 cursos más vendidos
- Artículos en carritos de compra

### `/admin/users` — Usuarios
- Buscador por nombre o email
- Lista de usuarios con acciones:
  - Enviar credenciales por correo
  - Cambiar rol (USER ↔ ADMIN)
  - Suspender/activar cuenta

### `/admin/courses` — Cursos
- Lista completa de cursos
- Crear cursos nuevos
- Editar cursos existentes
- Crear cursos con precio en COP ($1 peso colombiano) para pruebas

### `/admin/payments` — Pagos
- Lista de todos los pagos
- Filtro por estado (Todos, Aprobados, Pendientes, Rechazados)
- Detalle: usuario, monto, gateway, fecha, ID de transacción

---

## Acceso al Panel Admin

1. Inicia sesión con una cuenta que tenga rol ADMIN o SUPER_ADMIN
2. Ve a tu perfil (esquina superior derecha)
3. Haz clic en **"Admin Panel"**
4. Serás redirigido a `/admin`

---

## Limitaciones del ADMIN

| Acción | ADMIN | SUPER_ADMIN |
|--------|-------|-------------|
| Ver estadísticas | ✅ | ✅ |
| Crear cursos | ✅ | ✅ |
| Editar cursos | ✅ (sin clave) | ✅ (con clave) |
| Eliminar cursos | ❌ | ✅ |
| Ver usuarios | ✅ | ✅ |
| Cambiar roles (USER ↔ ADMIN) | ✅ | ✅ |
| Suspender/activar usuarios | ✅ | ✅ |
| Eliminar usuarios | ❌ | ✅ |
| Crear administradores | ❌ | ✅ |
| Crear usuarios | ❌ | ✅ |
| Cambiar enlaces Q10 | ❌ | ✅ |
| Enviar credenciales | ✅ (con clave) | ✅ (con clave) |
| Ver pagos | ✅ | ✅ |
| Acceder a Tiempo Real | ❌ | ✅ |
| Acceder a Base de Datos | ❌ | ✅ |

---

## Clave de Seguridad

Para operaciones sensibles (cambiar roles, suspender usuarios, enviar credenciales), el ADMIN debe ingresar la **clave de seguridad del superadmin** (`SUPER_ADMIN_KEY`). Sin esta clave, no puede realizar estas acciones.

---

> 📌 Documentación generada el 27 de mayo de 2026
> Q10 Courses v1.0.0
