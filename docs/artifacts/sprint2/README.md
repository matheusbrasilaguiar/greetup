# Sprint 2 — Integração MOM com Redis Pub/Sub

## Objetivo

A Sprint 2 tem como foco central a integração do sistema com um **Middleware Orientado a Mensagens (MOM)**, utilizando **Redis Pub/Sub**. Além disso, foram entregues os módulos de Customer e Order, e o suporte a **multi-tenancy** (isolamento de dados por empresa).

### O que foi implementado

| Módulo | O que entrega |
|--------|--------------|
| Customer | CRUD completo de visitantes/clientes atendidos no evento |
| Order + OrderItem | Criação de pedido, ciclo de status por item, fechamento de pedido |
| Multi-tenancy | Modelo `Company`, `companyId` em todos os modelos, isolamento row-level |
| Redis MOM | `RedisEventPublisher` publica eventos; `EventSubscriber` consome e loga em tempo real |

---

## Pré-requisitos

- Docker + Docker Compose
- Node.js 18+
- `gh` CLI (para PRs)

---

## Setup

```bash
# 1. Subir banco e Redis
docker compose up -d

# 2. Instalar dependências
cd backend && npm install

# 3. Aplicar migrations
npx prisma migrate deploy

# 4. Gerar client Prisma
npx prisma generate

# 5. Iniciar servidor
npm run dev
```

Ao iniciar, o terminal exibe:
```
API running on port 3000
[EventSubscriber] Subscribed to order channels
```

---

## Verificando o MOM em ação

Com o servidor rodando, abra um terminal separado e acompanhe os logs. Ao criar um pedido:

```
[EventSubscriber] [2026-05-23T19:00:00.000Z] order:created: {
  orderId: "...",
  tableId: "...",
  tableCode: "MESA-01",
  companyId: "...",
  items: [...]
}
```

Isso demonstra que o **EventSubscriber** processa as mensagens de forma **assíncrona** — sem nenhuma chamada REST direta entre publicador e consumidor.

---

## Endpoints

Todos os endpoints (exceto `/auth`) requerem header `Authorization: Bearer <token>`.

### Auth

| Método | Rota | Roles | Descrição |
|--------|------|-------|-----------|
| POST | `/auth/register` | — | Registra empresa + ADMIN |
| POST | `/auth/login` | — | Login, retorna JWT |

**Corpo de `/auth/register`:**
```json
{
  "name": "João Silva",
  "email": "joao@empresa.com",
  "password": "senha123",
  "companyName": "Empresa X"
}
```

### Users

| Método | Rota | Roles | Descrição |
|--------|------|-------|-----------|
| POST | `/users` | ADMIN | Cria usuário na empresa |
| GET | `/users` | ADMIN | Lista usuários da empresa |
| GET | `/users/:id` | ADMIN | Busca usuário por ID |

### Products

| Método | Rota | Roles | Descrição |
|--------|------|-------|-----------|
| POST | `/products` | ADMIN | Cria produto |
| GET | `/products` | todos | Lista produtos ativos (ADMIN/GERENTE vê inativos com `?includeInactive=true`) |
| GET | `/products/:id` | todos | Busca produto por ID |
| PATCH | `/products/:id` | ADMIN | Atualiza produto |

### Tables

| Método | Rota | Roles | Descrição |
|--------|------|-------|-----------|
| POST | `/tables` | GERENTE, ADMIN | Cria mesa |
| GET | `/tables` | GERENTE, ADMIN | Lista mesas |
| GET | `/tables/:id` | GERENTE, ADMIN | Busca mesa por ID |
| PATCH | `/tables/:id/status` | GERENTE, ADMIN | Atualiza status da mesa |

### Customers

| Método | Rota | Roles | Descrição |
|--------|------|-------|-----------|
| POST | `/customers` | GERENTE, ADMIN | Cadastra visitante |
| GET | `/customers` | GERENTE, ADMIN | Lista visitantes |
| GET | `/customers/:id` | GERENTE, ADMIN | Busca visitante por ID |
| PATCH | `/customers/:id` | GERENTE, ADMIN | Atualiza visitante |

### Orders

| Método | Rota | Roles | Descrição |
|--------|------|-------|-----------|
| POST | `/orders` | GERENTE | Cria pedido (publica `order:created`) |
| GET | `/orders` | GERENTE, OPERADOR, ADMIN | Lista pedidos |
| GET | `/orders/:id` | GERENTE, OPERADOR, ADMIN | Busca pedido por ID |
| PATCH | `/orders/:id/close` | GERENTE, ADMIN | Fecha pedido (publica `order:closed`) |
| PATCH | `/orders/:orderId/items/:itemId/status` | OPERADOR | Atualiza status de item (publica `order.item:status_changed`) |

---

## Variáveis de ambiente

```env
PORT=3000
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/greetup?schema=public"
JWT_SECRET="change-me"
REDIS_URL=redis://localhost:6379
```
