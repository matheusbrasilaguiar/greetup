# Database Schema (Sprint 1)

Diagrama: [docs/architecture/diagrams/greetup-db-schema.puml](docs/architecture/diagrams/greetup-db-schema.puml)

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

## Table
- id: string (cuid)
- code: string (unique)
- status: enum (OPEN, OCCUPIED, CLOSED)
- createdAt: datetime
- updatedAt: datetime
