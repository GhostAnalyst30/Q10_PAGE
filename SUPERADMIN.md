# Superadmin - Información de Seguridad

## SUPER_ADMIN_KEY

Esta clave se configura en el archivo `backend/.env` como `SUPER_ADMIN_KEY`.

**Valor por defecto (desarrollo):** `SuperAdmin2026!CambiaEsto`

### ⚠️ En producción
Cambia este valor por una clave segura y única. Sin ella, nadie puede realizar cambios críticos en la plataforma (eliminar usuarios, cambiar roles, etc.).

### ¿Dónde configurarla?
- **Local:** Edita `backend/.env`
- **Railway/Render:** Agrega `SUPER_ADMIN_KEY` como variable de entorno
- **Valor recomendado:** Usa un generador de contraseñas (ej. 32+ caracteres alfanuméricos)

## Funcionalidades exclusivas del Superadmin
- Crear y eliminar administradores
- Eliminar usuarios
- Cambiar roles de usuario
- Acceder al monitor en tiempo real (`/admin/realtime`)
- Panel de base de datos (`/admin/database`)
- Clave de seguridad requerida para acciones destructivas
