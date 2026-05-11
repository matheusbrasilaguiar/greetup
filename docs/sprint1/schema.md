# Database Schema (Sprint 1)

## User
- id: string (cuid)
- name: string
- email: string (unique)
- passwordHash: string
- role: enum (ADMIN, GERENTE, OPERADOR)
- createdAt: datetime

## Product
- id: string (cuid)
- name: string
- description: string (optional)
- category: enum (COMIDA, BEBIDA)
- active: boolean (default true)
- createdAt: datetime
- updatedAt: datetime
