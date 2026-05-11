# Sprint 1 - Backend

## Scope
- Auth with RBAC (role enum)
- Product management (ADMIN only)
- Table management (GERENTE and ADMIN)

## Endpoints
- POST /auth/register
- POST /auth/login
- POST /users (ADMIN)
- POST /products (ADMIN)
- GET /products (default: active only)
- PATCH /products/:id (ADMIN)
- POST /tables (GERENTE, ADMIN)
- GET /tables (GERENTE, ADMIN)
- PATCH /tables/:id/status (GERENTE, ADMIN)

## Setup
1. Copy backend/.env.example to backend/.env
2. Start database services: docker-compose up -d
3. Install backend dependencies: npm install
4. Run Prisma migration: npm run prisma:migrate
5. Start API: npm run dev

## Notes
- GET /products supports includeInactive=true for ADMIN
