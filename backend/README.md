# Greetup Backend

## Architecture (Clean Architecture)
- Domain: entities and business rules
- Application: use cases and ports (interfaces)
- Infrastructure: database, security, repositories implementations
- Interfaces: HTTP controllers, routes, middleware

## Structure
- src/domain
- src/application
- src/infrastructure
- src/interfaces

## Setup
1. Copy .env.example to .env
2. Start database services: docker-compose up -d
3. Install dependencies: npm install
4. Run Prisma migration: npm run prisma:migrate
5. Start API: npm run dev

## Endpoints
- POST /auth/register
- POST /auth/login
- POST /products (ADMIN)
- GET /products (default: active only)
- POST /tables (GERENTE, ADMIN)
- GET /tables (GERENTE, ADMIN)
- PATCH /tables/:id/status (GERENTE, ADMIN)

## RBAC
- Role is stored in User (enum)
- Products endpoints require ADMIN
- Tables endpoints require GERENTE or ADMIN
