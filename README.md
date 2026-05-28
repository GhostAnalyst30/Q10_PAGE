# Q10 Courses Platform

Plataforma moderna de venta de cursos online con integración a Q10.

## Arquitectura

- **Frontend:** Next.js 14 + React 18 + TypeScript + TailwindCSS + shadcn/ui
- **Backend:** NestJS + Prisma ORM + PostgreSQL
- **Autenticación:** JWT + bcrypt + HTTP-only cookies
- **Pagos:** Stripe + Wompi (Colombia)
- **Emails:** Resend API
- **Deploy:** Frontend (Vercel) + Backend (Railway/Render)

## Estructura

```
├── backend/                # API REST NestJS
│   ├── prisma/
│   │   ├── schema.prisma   # Modelo de datos
│   │   └── seed.ts         # Datos iniciales
│   └── src/
│       ├── prisma/         # Servicio Prisma
│       ├── common/         # Guards, decorators, filtros
│       └── modules/        # Módulos de la API
│           ├── auth/       # Autenticación JWT
│           ├── users/      # Gestión de usuarios
│           ├── courses/    # CRUD de cursos
│           ├── payments/   # Stripe + Wompi
│           ├── enrollments/ # Inscripciones
│           ├── email/      # Notificaciones
│           └── admin/      # Panel administrativo
│
└── frontend/               # Next.js App Router
    └── src/
        ├── app/            # Páginas (App Router)
        │   ├── login/
        │   ├── register/
        │   ├── courses/
        │   ├── dashboard/
        │   └── admin/
        ├── components/     # Componentes React
        │   ├── ui/         # shadcn/ui components
        │   ├── layout/     # Navbar, Footer
        │   └── ...
        ├── services/       # API client (axios)
        ├── hooks/          # Custom hooks
        ├── lib/            # Utilidades
        └── types/          # TypeScript types
```

## Requisitos

- Node.js 18+
- PostgreSQL
- npm o pnpm

## Configuración Rápida

### 1. Base de datos
```bash
# Crear base de datos PostgreSQL
createdb q10_courses
```

### 2. Backend
```bash
cd backend
npm install
cp .env.example .env   # Configurar variables
npx prisma generate
npx prisma db push
npm run prisma:seed    # Datos demo (admin: admin@q10courses.com / Admin123!)
npm run start:dev      # http://localhost:4000
```

### 3. Frontend
```bash
cd frontend
npm install
cp .env.example .env.local  # Configurar URL de API
npm run dev                  # http://localhost:3000
```

## Roles del Sistema

| Rol | Descripción |
|-----|-------------|
| USER | Usuario regular - acceso a cursos comprados |
| ADMIN | Administrador - gestión de cursos y usuarios |
| SUPER_ADMIN | Acceso total - puede crear admins |

## API Endpoints

### Autenticación
- `POST /api/auth/register` - Registro
- `POST /api/auth/login` - Login
- `POST /api/auth/logout` - Logout
- `POST /api/auth/refresh` - Refresh token
- `POST /api/auth/forgot-password` - Recuperar contraseña
- `POST /api/auth/reset-password` - Resetear contraseña
- `GET /api/auth/profile` - Perfil (requiere auth)

### Cursos
- `GET /api/courses` - Listar cursos
- `GET /api/courses/:slug` - Detalle del curso
- `POST /api/courses` - Crear (admin)
- `PATCH /api/courses/:id` - Actualizar (admin)
- `DELETE /api/courses/:id` - Eliminar (super admin)

### Pagos
- `POST /api/payments/create-stripe` - Crear pago Stripe
- `POST /api/payments/webhook/stripe` - Webhook Stripe
- `POST /api/payments/webhook/wompi` - Webhook Wompi

### Inscripciones
- `GET /api/enrollments/my-courses` - Mis cursos

### Admin
- `GET /api/admin/stats` - Estadísticas
- `GET /api/admin/users` - Usuarios
- `PATCH /api/admin/users/:id/role` - Cambiar rol
- `PATCH /api/admin/users/:id/toggle-status` - Suspender/activar
- `POST /api/admin/create-admin` - Crear admin

## Seguridad

- JWT con HTTP-only cookies
- bcrypt (12 rounds) para contraseñas
- Rate limiting (100 req/min)
- Helmet headers de seguridad
- CORS configurado
- Validación de datos (class-validator)
- Sanitización de inputs
- Webhook signature verification

## Deploy

### Frontend (Vercel)
```bash
cd frontend
vercel --prod
```

### Backend (Railway)
```bash
cd backend
railway up
```

Variables de entorno requeridas en producción:
- `DATABASE_URL`
- `JWT_SECRET`
- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`
- `RESEND_API_KEY`
- `FRONTEND_URL`
