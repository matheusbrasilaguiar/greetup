# Arquitetura do Sistema — Greetup

## Visão Geral

A arquitetura do Greetup foi projetada utilizando os princípios de:

- Clean Architecture
- Event-Driven Architecture (EDA)
- Comunicação assíncrona baseada em eventos
- Backend REST distribuído
- Atualizações em tempo real via WebSocket

A solução é composta por:

- Aplicativos mobile Flutter
- Backend Node.js + Express
- Middleware Orientado a Mensagens (Redis Pub/Sub)
- Banco de dados PostgreSQL
- Comunicação WebSocket em tempo real

---

## Diagrama de Arquitetura do Sistema

O diagrama abaixo representa a visão macro da arquitetura do sistema, incluindo:

- Aplicativos móveis
- Backend
- Middleware Orientado a Mensagens (MOM)
- Banco de dados
- Protocolos de comunicação utilizados

### Componentes Representados

| Componente | Responsabilidade |
|---|---|
| App Cliente | Utilizado pelo Gerente de Evento |
| App Prestador | Utilizado pela Cozinha e Garçom |
| Backend REST | Regras de negócio e API |
| WebSocket Gateway | Comunicação em tempo real |
| Redis Pub/Sub | Middleware orientado a mensagens |
| PostgreSQL | Persistência relacional |

### Protocolos de Comunicação

| Origem | Destino | Protocolo |
|---|---|---|
| Mobile Apps | Backend | HTTPS / REST |
| Mobile Apps | WebSocket Gateway | WSS / WebSocket |
| Backend | PostgreSQL | TCP / Prisma ORM |
| Backend | Redis Pub/Sub | Redis Pub/Sub |
| Redis | WebSocket Gateway | Redis Pub/Sub (assincrono) |

---

## Diagrama 1 — Arquitetura Macro do Sistema

![Arquitetura Macro do Sistema](/docs/architecture/diagrams/greetup-architecture-overview.png)

---

## Diagrama 2 — Arquitetura Interna do Backend
![Arquitetura Interna do Backend](/docs/architecture/diagrams/greetup-backend-internal.png)

---

## Diagrama 3 — Fluxo de Eventos (MOM)
![Fluxo de Eventos (MOM)](/docs/architecture/diagrams/greetup-event-flow.png)

---

## Diagrama 4 — Schema do Banco (Sprint 1)
[docs/architecture/diagrams/greetup-db-schema.puml](/docs/architecture/diagrams/greetup-db-schema.puml)

---

## Considerações Arquiteturais

A arquitetura proposta atende aos requisitos, contemplando:

- Aplicativos móveis Flutter
- Backend REST
- Middleware Orientado a Mensagens (MOM)
- Arquitetura Orientada a Eventos
- Comunicação assíncrona
- Atualizações em tempo real
- Persistência relacional
- Organização baseada em Clean Architecture