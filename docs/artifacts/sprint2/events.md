# Documentação de Eventos — Sprint 2

## Visão Geral

O Greetup utiliza **Redis Pub/Sub** como middleware orientado a mensagens (MOM). Eventos de domínio são publicados pelo `RedisEventPublisher` e consumidos pelo `EventSubscriber`, que roda em background desde o boot do servidor.

### Fluxo

```
Use Case → RedisEventPublisher.publish(tópico, payload)
                    ↓
              Redis Pub/Sub
                    ↓
         EventSubscriber.on("message")
                    ↓
           console.log (Sprint 2)
           WebSocket Gateway (Sprint 3)
```

A comunicação é **assíncrona**: o use case não aguarda o processamento do consumidor — ele apenas publica e segue.

---

## Tabela de Eventos

| Evento | Tópico Redis | Publicado por | Consumido por | Roles que disparam | Descrição |
|--------|-------------|---------------|---------------|--------------------|-----------|
| Order criado | `order:created` | `createOrder` use case | `EventSubscriber` | GERENTE | Novo pedido aberto em uma mesa |
| Status de item alterado | `order.item:status_changed` | `updateItemStatus` use case | `EventSubscriber` | OPERADOR | Item de pedido avança no ciclo de preparo |
| Order fechado | `order:closed` | `closeOrder` use case | `EventSubscriber` | GERENTE, ADMIN | Pedido encerrado |

---

## Payloads

### `order:created`

Publicado em: `backend/src/application/usecases/createOrder.js`

```json
{
  "orderId": "clx...",
  "tableId": "clx...",
  "tableCode": "MESA-01",
  "companyId": "clx...",
  "customerId": "clx..." ,
  "status": "OPEN",
  "items": [
    {
      "id": "clx...",
      "productId": "clx...",
      "productName": "Coca-Cola",
      "productCategory": "BEBIDA",
      "quantity": 2,
      "notes": "sem gelo",
      "status": "PENDENTE"
    }
  ],
  "createdAt": "2026-05-23T19:00:00.000Z"
}
```

---

### `order.item:status_changed`

Publicado em: `backend/src/application/usecases/updateItemStatus.js`

```json
{
  "orderId": "clx...",
  "itemId": "clx...",
  "productId": "clx...",
  "productName": "Coca-Cola",
  "productCategory": "BEBIDA",
  "status": "EM_PREPARO",
  "updatedAt": "2026-05-23T19:05:00.000Z"
}
```

Ciclo de status do item: `PENDENTE` → `EM_PREPARO` → `PRONTO` → `ENTREGUE`

---

### `order:closed`

Publicado em: `backend/src/application/usecases/closeOrder.js`

```json
{
  "orderId": "clx...",
  "tableId": "clx...",
  "tableCode": "MESA-01",
  "status": "CLOSED",
  "closedAt": "2026-05-23T20:00:00.000Z"
}
```

---

## Implementação

### RedisEventPublisher

`backend/src/infrastructure/messaging/redisEventPublisher.js`

- Extends `EventPublisherPort` (Clean Architecture)
- Usa `ioredis` para conexão com Redis
- Exportado como **singleton**
- Conexão configurada via `REDIS_URL` (default: `redis://localhost:6379`)

### EventSubscriber

`backend/src/infrastructure/messaging/eventSubscriber.js`

- Usa uma conexão Redis **separada** (obrigatório — Redis não permite pub+sub na mesma conexão)
- Subscrito nos 3 tópicos ao iniciar
- Loga cada mensagem com timestamp, canal e payload parseado
- Inicializado no boot via `startSubscriber()` chamado em `server.js`

### Log de exemplo no terminal

```
[EventSubscriber] Subscribed to order channels
[EventSubscriber] [2026-05-23T19:00:00.000Z] order:created: { orderId: 'clx...', tableCode: 'MESA-01', ... }
[EventSubscriber] [2026-05-23T19:05:00.000Z] order.item:status_changed: { itemId: 'clx...', status: 'EM_PREPARO', ... }
[EventSubscriber] [2026-05-23T20:00:00.000Z] order:closed: { orderId: 'clx...', status: 'CLOSED', ... }
```
