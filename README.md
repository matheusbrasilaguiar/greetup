# Greetup

Plataforma SaaS de gestão de hospitalidade corporativa para eventos e feiras B2B. Digitaliza o fluxo operacional de estandes: abertura de mesas, pedidos de alimentos e bebidas, roteamento assíncrono para cozinha e confirmação de entrega pelo garçom.

**Disciplina:** Lab. de Desenvolvimento de Aplicações Móveis e Distribuídas — PUC Minas  
**Aluno:** Matheus Brasil Aguiar  
**Semestre:** 1º Semestre de 2026

---

## Estrutura do Repositório

```
greetup/
├── backend/          — API REST (Node.js/Express, Clean Architecture, Prisma/PostgreSQL)
├── gateway/          — Gateway de eventos WebSocket (Node.js, Socket.IO, RabbitMQ consumer)
├── flutter/
│   ├── app-cliente/  — App Flutter para o Gerente de Evento
│   └── app-prestador/— App Flutter para Cozinha, Garçom e Display
├── web/
│   ├── admin/        — Painel administrativo web (Next.js)
│   └── app-operador/ — App web de operação para feirinha (Next.js)
└── docs/             — Documentação e artefatos por sprint
```

---

## Como Executar

### Pré-requisitos
- Node.js 18+
- Docker e Docker Compose
- Flutter 3.10+

### Backend + Gateway (local)

```bash
docker compose up -d        # sobe PostgreSQL e RabbitMQ
cd backend && npm install && npm run dev
cd gateway && npm install && npm run dev
```

### Apps Flutter

```bash
# App Cliente
cd flutter/app-cliente
flutter run --dart-define=API_URL=http://10.0.2.2:3000 --dart-define=GATEWAY_URL=http://10.0.2.2:3001

# App Prestador
cd flutter/app-prestador
flutter run --dart-define=API_URL=http://10.0.2.2:3000 --dart-define=GATEWAY_URL=http://10.0.2.2:3001
```

### Build APK (produção)

```bash
flutter build apk --release \
  --dart-define=API_URL=https://<backend-url> \
  --dart-define=GATEWAY_URL=https://<gateway-url>
```

---

## Artefatos por Sprint

### Sprint 1 — Arquitetura e Backend REST
- [Proposta do Domínio (PDF)](docs/artifacts/sprint1/Greetup_Sprint1_Proposta.pdf)
- [Diagrama de Arquitetura](docs/artifacts/sprint1/greetup-architecture-overview.png)
- [Diagrama do Backend Interno](docs/artifacts/sprint1/greetup-backend-internal.png)
- [Schema do Banco de Dados](docs/artifacts/sprint1/greetup-db-schema.png)
- [Diagrama de Fluxo de Eventos](docs/artifacts/sprint1/greetup-event-flow.png)
- [Coleção Postman](docs/artifacts/sprint1/postman_collection.json)
- [README Sprint 1](docs/artifacts/sprint1/README.md)

### Sprint 2 — Integração com MOM (RabbitMQ)
- [README Sprint 2](docs/artifacts/sprint2/README.md)
- [Schema do Banco](docs/artifacts/sprint2/schema.md)
- [Documentação dos Eventos](docs/artifacts/sprint2/events.md)
- [Relatório de Integração](docs/artifacts/sprint2/relatorio-integracao.md)
- [Coleção Postman](docs/artifacts/sprint2/postman_collection.json)

### Sprint 3 — App Flutter Cliente
- [README Sprint 3](docs/artifacts/sprint3/README.md)
- [Arquitetura do App](docs/artifacts/sprint3/architecture.md)

### Sprint 4 — App Flutter Prestador + Integração Final
- [Relatório Técnico Final](docs/artifacts/sprint4/relatorio_tecnico_final.md)

---

## Deploy (Produção)

| Componente | Plataforma | URL |
|---|---|---|
| Backend REST | Railway | `backend-production-5230.up.railway.app` |
| Gateway WebSocket | Railway | `gateway-production-f859.up.railway.app` |
| PostgreSQL | Railway | gerenciado |
| RabbitMQ | CloudAMQP | gerenciado |
| Admin Web | Vercel | — |
| App Operador Web | Vercel | — |
