# GreetUp — Documentação de Design

Fonte da verdade visual e funcional do produto GreetUp — plataforma de gestão de hospitalidade corporativa para eventos B2B. Esta pasta é versionada junto com o código e serve a três produtos:

| Produto | Persona | Stack |
|---|---|---|
| **App Cliente** | Gerente de vendas (no estande) | Flutter |
| **App Prestador** | Operador (cozinha / garçom) | Flutter |
| **Admin Web** | Administração / back-office | React + Next.js |

## Estrutura

```
docs/design/
├── design-system/          → A especificação. Leia primeiro.
│   ├── README.md             Visão geral, princípios, espaçamento, raios
│   ├── colors.md             Paleta completa + tokens (CSS / Dart / Tailwind)
│   ├── typography.md         Fontes, escala, pesos + snippets por plataforma
│   └── components.md         Botões, inputs, cards, badges, navegação
│
├── prototypes/             → Telas de referência (HTML estático navegável)
│   ├── app-cliente/          7 telas — fluxo do gerente
│   ├── app-prestador/        6 telas — cozinha & garçom
│   └── admin-web/            12 telas — back-office
│
└── assets/                 → Logos, símbolos e tokens prontos para importar
    ├── logos/                Lockups SVG (horizontal, vertical, wordmark)
    ├── symbols/              Arco e monogramas isolados (SVG)
    ├── png/                  Renders raster 2x–4x
    └── tokens/               palette.css · palette.json
```

## Como usar este pacote

1. **Designers / PMs** — abram os arquivos `.md` no GitHub e os HTML em `prototypes/` no navegador.
2. **Dev Flutter** — comecem por `design-system/colors.md` e `typography.md`; cada um traz um bloco `Dart` pronto para virar `gu_tokens` + `ThemeData`.
3. **Dev React/Next** — os mesmos arquivos trazem CSS custom properties e um mapeamento Tailwind v4 (`@theme`).

## Princípio operacional

> Não recolorir, não distorcer e não inventar tokens fora desta documentação. Toda cor, fonte ou medida usada no código deve existir aqui. Mudança de token = PR neste diretório primeiro.

## Versão

Design System **v1.0** · Maio 2026 · São Paulo · GreetUp — Corporate Hospitality
