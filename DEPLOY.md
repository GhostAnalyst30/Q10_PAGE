# Guía de Despliegue — Q10 Courses

## 📋 Requisitos Previos

- Repositorio en GitHub: https://github.com/GhostAnalyst30/Q10_PAGE
- Cuenta en [Vercel](https://vercel.com) (gratis)
- Cuenta en [Neon](https://neon.tech) o [Railway](https://railway.app) (PostgreSQL gratis)
- Cuenta en [Resend](https://resend.com) (correos - gratis 100/día)
- Cuenta en [Stripe](https://stripe.com) (pagos)
- (Opcional) Cuenta en [Wompi](https://wompi.co) (pagos Colombia)

---

## 🗄️ 1. Base de Datos (Neon - Gratis)

1. Ve a https://neon.tech → Sign up
2. Crea un proyecto → obtienes una URL como:
   ```
   postgresql://user:pass@ep-xxxx.region.aws.neon.tech/neondb?sslmode=require
   ```
3. Copia esa URL — la usarás como `DATABASE_URL`

---

## 📧 2. Email (Resend - Gratis)

1. Ve a https://resend.com → Sign up
2. Ve a **API Keys** → **Create API Key** → copia la clave (empieza con `re_`)
3. Para pruebas usa `EMAIL_FROM="onboarding@resend.dev"` (solo envía a tu email registrado)
4. Para producción: verifica un dominio en **Domains** → Add Domain

---

## 💳 3. Stripe (Pagos)

1. Ve a https://stripe.com → Sign up
2. Activa modo test en el dashboard
3. Ve a **Developers** → **API Keys** → copia `sk_test_...` y `pk_test_...`
4. Ve a **Webhooks** → **Add endpoint**:
   - URL: `https://tu-backend.vercel.app/api/payments/webhook/stripe`
   - Eventos: `checkout.session.completed`
   - Copia el `whsec_...` firmado

---

## 🚀 4. Desplegar Frontend en Vercel

### Opción A: Desde GitHub (recomendada)
1. Ve a https://vercel.com → **Add New Project**
2. Importa `GhostAnalyst30/Q10_PAGE`
3. Configura:
   - **Root Directory**: `frontend`
   - **Framework**: Next.js
   - **Build Command**: `npm run build`
4. Variables de entorno:
   ```
   NEXT_PUBLIC_API_URL=https://tu-backend.vercel.app/api
   NEXT_PUBLIC_STRIPE_KEY=pk_test_...
   ```
5. **Deploy**

### Opción B: CLI
```bash
cd frontend
vercel --prod
```

---

## 🖥️ 5. Desplegar Backend en Vercel

### Opción A: Desde GitHub
1. Ve a https://vercel.com → **Add New Project**
2. Importa el mismo repo (`GhostAnalyst30/Q10_PAGE`)
3. Configura:
   - **Root Directory**: `backend`
   - **Framework**: Other
   - **Build Command**: `npm run build`
4. Variables de entorno (todas obligatorias):
   ```
   DATABASE_URL=postgresql://...
   JWT_SECRET=clave-segura-aleatoria
   JWT_REFRESH_SECRET=otra-clave-segura
   JWT_EXPIRATION=15m
   JWT_REFRESH_EXPIRATION=7d
   RESEND_API_KEY=re_...
   EMAIL_FROM=onboarding@resend.dev
   STRIPE_SECRET_KEY=sk_test_...
   STRIPE_WEBHOOK_SECRET=whsec_...
   STRIPE_PUBLISHABLE_KEY=pk_test_...
   FRONTEND_URL=https://tu-frontend.vercel.app
   SUPER_ADMIN_KEY=SuperAdmin2026!CambiaEsto
   NODE_ENV=production
   PORT=3000
   ```
5. **Deploy**

### Opción B: Backend en Render (más estable para NestJS)
Render es mejor para backends NestJS porque es un servidor persistente (no serverless).

1. Ve a https://render.com → **New Web Service**
2. Conecta tu repo de GitHub
3. Configura:
   - **Root Directory**: `backend`
   - **Runtime**: Node
   - **Build Command**: `npm install && npm run build && npx prisma generate && npx prisma db push`
   - **Start Command**: `node dist/main`
4. Añade las mismas variables de entorno que arriba
5. **Create Web Service**

---

## 🌱 6. Seed de Base de Datos

Después del primer deploy, ejecuta el seed para crear el superadmin y cursos:

```bash
# En el panel de Render/Railway, abre una terminal o ejecuta:
cd backend
npx prisma db push
npx prisma db seed
```

O localmente:
```bash
cd backend
npx prisma db push
npx prisma db seed
```

---

## ✅ 7. Verificar Despliegue

| Componente | URL Esperada |
|-----------|-------------|
| Frontend | `https://tu-frontend.vercel.app` |
| Backend | `https://tu-backend.vercel.app/api/auth/profile` |
| Correos | Revisa la terminal del backend para logs de email |

### Probar:
1. Visita el frontend → debe cargar la landing page
2. Login con `admin@q10courses.com` / `Admin123!`
3. Ve a `/admin` → debe mostrar estadísticas
4. Verifica `/admin/users` → debe listar usuarios

---

## 🔧 8. Solución de Problemas

### Backend da 500 / No responde
- Revisa que `DATABASE_URL` sea correcta
- Verifica las variables de entorno en Vercel/Render
- Revisa los logs del deploy

### Los correos no se envían
- La API key de Resend debe ser válida (empieza con `re_`)
- `EMAIL_FROM` debe ser `onboarding@resend.dev` o un dominio verificado
- Revisa los logs del backend: busca `[EMAIL SIMULATED]` o errores

### Stripe no procesa pagos
- Verifica que las claves de Stripe sean correctas
- Configura el webhook en Stripe Dashboard apuntando a tu backend
- El webhook debe escuchar `checkout.session.completed`

### CORS / No conecta frontend-backend
- `FRONTEND_URL` debe coincidir exactamente con la URL del frontend
- `NEXT_PUBLIC_API_URL` debe apuntar al backend (con `/api` al final)

---

## 📝 Variables de Entorno — Resumen

### Backend (Vercel/Render)
```
DATABASE_URL, JWT_SECRET, JWT_REFRESH_SECRET,
RESEND_API_KEY, EMAIL_FROM,
STRIPE_SECRET_KEY, STRIPE_WEBHOOK_SECRET, STRIPE_PUBLISHABLE_KEY,
FRONTEND_URL, SUPER_ADMIN_KEY, NODE_ENV, PORT
```

### Frontend (Vercel)
```
NEXT_PUBLIC_API_URL, NEXT_PUBLIC_STRIPE_KEY
```

---

## 🛡️ Seguridad

1. **Cambia la contraseña del superadmin** inmediatamente después del primer login
2. **Cambia `SUPER_ADMIN_KEY`** en producción
3. Usa claves **JWT secretas fuertes** (puedes generar con: `openssl rand -hex 32`)
4. **Nunca subas `.env`** al repositorio (ya están en `.gitignore`)
