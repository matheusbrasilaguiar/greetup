# Schema do Banco de Dados — Sprint 2

## Visão Geral

O banco utiliza **PostgreSQL** com **Prisma ORM**. O modelo segue **row-level multi-tenancy**: todos os modelos de dados possuem `companyId` como chave estrangeira para `Company`, garantindo isolamento total entre empresas.

Diagrama ER: [`docs/architecture/diagrams/greetup-db-schema.puml`](/docs/architecture/diagrams/greetup-db-schema.puml)

---

## Modelos

### Company

Representa uma empresa contratante da plataforma (tenant).

| Campo | Tipo | Descrição |
|-------|------|-----------|
| id | String (cuid) | PK |
| name | String | Nome da empresa |
| createdAt | DateTime | Data de criação |

---

### User

Usuário da empresa (ADMIN, GERENTE ou OPERADOR).

| Campo | Tipo | Descrição |
|-------|------|-----------|
| id | String (cuid) | PK |
| name | String | Nome do usuário |
| email | String | E-mail (único por empresa) |
| passwordHash | String | Senha criptografada com bcrypt |
| role | Role | Papel do usuário |
| createdAt | DateTime | Data de criação |
| companyId | String (FK) | Empresa proprietária |

**Constraint:** `UNIQUE(email, companyId)` — dois usuários de empresas diferentes podem ter o mesmo e-mail.

**Roles disponíveis:** `ADMIN` | `GERENTE` | `OPERADOR`

---

### Product

Produto do cardápio da empresa.

| Campo | Tipo | Descrição |
|-------|------|-----------|
| id | String (cuid) | PK |
| name | String | Nome do produto |
| description | String? | Descrição opcional |
| category | ProductCategory | Categoria |
| active | Boolean | Se está ativo no cardápio |
| createdAt | DateTime | Data de criação |
| updatedAt | DateTime | Última atualização |
| companyId | String (FK) | Empresa proprietária |

**Categorias:** `COMIDA` | `BEBIDA`

---

### Table

Mesa ou espaço atendido no evento.

| Campo | Tipo | Descrição |
|-------|------|-----------|
| id | String (cuid) | PK |
| code | String | Código da mesa (ex.: "MESA-01") |
| status | TableStatus | Status atual da mesa |
| createdAt | DateTime | Data de criação |
| updatedAt | DateTime | Última atualização |
| companyId | String (FK) | Empresa proprietária |

**Constraint:** `UNIQUE(code, companyId)` — duas empresas podem ter "MESA-01".

**Status:** `OPEN` | `OCCUPIED` | `CLOSED`

---

### Customer

Visitante/cliente atendido no estande.

| Campo | Tipo | Descrição |
|-------|------|-----------|
| id | String (cuid) | PK |
| name | String | Nome do visitante |
| email | String? | E-mail opcional |
| phone | String? | Telefone opcional |
| employer | String? | Empresa empregadora do visitante |
| createdAt | DateTime | Data de criação |
| updatedAt | DateTime | Última atualização |
| companyId | String (FK) | Empresa proprietária do registro |

> **Nota:** O campo `employer` representa a empresa onde o visitante trabalha. O nome evita conflito com o campo de relação `company` (FK para o tenant).

---

### Order

Pedido aberto em uma mesa, opcionalmente vinculado a um visitante.

| Campo | Tipo | Descrição |
|-------|------|-----------|
| id | String (cuid) | PK |
| status | OrderStatus | Status do pedido |
| createdAt | DateTime | Data de criação |
| updatedAt | DateTime | Última atualização |
| tableId | String (FK) | Mesa do pedido |
| customerId | String? (FK) | Visitante associado (opcional) |
| companyId | String (FK) | Empresa proprietária |

**Status:** `OPEN` | `CLOSED`

---

### OrderItem

Item individual dentro de um pedido.

| Campo | Tipo | Descrição |
|-------|------|-----------|
| id | String (cuid) | PK |
| quantity | Int | Quantidade do produto |
| notes | String? | Observações (ex.: "sem gelo") |
| status | ItemStatus | Status de preparo do item |
| createdAt | DateTime | Data de criação |
| updatedAt | DateTime | Última atualização |
| orderId | String (FK) | Pedido ao qual pertence |
| productId | String (FK) | Produto pedido |

**Ciclo de status:** `PENDENTE` → `EM_PREPARO` → `PRONTO` → `ENTREGUE`

---

## Relacionamentos

```
Company 1──* User
Company 1──* Product
Company 1──* Table
Company 1──* Customer
Company 1──* Order

Table   1──* Order
Customer 0..1──* Order
Order   1──* OrderItem
Product 1──* OrderItem
```

---

## Migrations

| Migration | Descrição |
|-----------|-----------|
| `20260522190530_add_customer_model` | Adiciona modelo `Customer` |
| `20260522192805_add_order_models` | Adiciona `Order`, `OrderItem` e enums de status |
| `20260522210000_add_multi_tenancy` | Adiciona `Company`, `companyId` em todos os modelos, constraints de unicidade intra-tenant |
