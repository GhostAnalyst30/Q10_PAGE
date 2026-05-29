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
- BREVO_API_KEY - Brevo API key (https://app.brevo.com > SMTP & API > API Keys)
- EMAIL_FROM - Sender email (ej. noreply@tudominio.com)
- EMAIL_FROM_NAME - Sender name (ej. Q10 Courses)
- FRONTEND_URL - Frontend URL for CORS
- OPENROUTER_API_KEY - API key for AI chatbot (https://openrouter.ai/keys, modelo gratuito mistral-7b-instruct)

### Frontend (.env.local)
- NEXT_PUBLIC_API_URL - Backend API URL
- NEXT_PUBLIC_STRIPE_KEY - Stripe publishable key

## Key Features
- JWT auth with HTTP-only cookies
- Roles: USER, ADMIN, SUPER_ADMIN
- Payments: Stripe + Wompi with gateway selection (USD/COP)
- $1 COP course option for testing
- Emails via Brevo
- Q10 integration per course
- Admin panel at /admin (with real-time updates every 10s)
- Superadmin exclusive: Create users, real-time monitor, database dashboard
- Animations with Framer Motion
- "Sobre Nosotros" page at /about
- Superadmin cannot be deleted (backend protection)
- Real-time stats with React Query polling
- Exchange rates: Admin panel at /admin/settings to view/edit COP, EUR, MXN rates vs USD, with auto-fetch from open.er-api.com
- AI Chatbot: Floating widget (bottom-right) powered by OpenRouter (free model mistral-7b-instruct). Recommends complementary courses based on cart contents. Name configurable in frontend/src/components/chatbot/chatbot-widget.tsx

## Deploy
- Frontend: Vercel
- Backend: Railway / Render
- Database: Railway PostgreSQL / Neon
