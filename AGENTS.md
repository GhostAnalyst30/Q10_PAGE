# Q10 Courses Platform - Project Guide

## Project Structure
```
/
├── backend/          # NestJS API
│   ├── prisma/       # Database schema & seed
│   └── src/          # Source code
└── frontend/         # Next.js app
    └── src/          # Source code
```

## Commands

### Backend
```bash
cd backend
npm install
npx prisma generate
npx prisma db push
npm run start:dev     # Development on :4000
```

### Frontend
```bash
cd frontend
npm install
npm run dev           # Development on :3000
```

## Environment Variables

### Backend (.env)
- DATABASE_URL - PostgreSQL connection string
- JWT_SECRET - JWT signing secret
- JWT_REFRESH_SECRET - Refresh token secret
- STRIPE_SECRET_KEY - Stripe API key
- STRIPE_WEBHOOK_SECRET - Stripe webhook secret
- WOMPI_* - Wompi keys (Colombia)
- RESEND_API_KEY - Email API key
- FRONTEND_URL - Frontend URL for CORS

### Frontend (.env.local)
- NEXT_PUBLIC_API_URL - Backend API URL
- NEXT_PUBLIC_STRIPE_KEY - Stripe publishable key

## Key Features
- JWT auth with HTTP-only cookies
- Roles: USER, ADMIN, SUPER_ADMIN
- Payments: Stripe + Wompi with gateway selection (USD/COP)
- $1 COP course option for testing
- Emails via Resend
- Q10 integration per course
- Admin panel at /admin (with real-time updates every 10s)
- Superadmin exclusive: Create users, real-time monitor, database dashboard
- Animations with Framer Motion
- "Sobre Nosotros" page at /about
- Superadmin cannot be deleted (backend protection)
- Real-time stats with React Query polling

## Deploy
- Frontend: Vercel
- Backend: Railway / Render
- Database: Railway PostgreSQL / Neon
