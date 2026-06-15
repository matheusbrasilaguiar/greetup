# Assets

Logos, símbolos e tokens de cor prontos para importar — extraídos do brand kit oficial GreetUp v1.0.

```
assets/
├── logos/      Lockups completos (SVG)
├── symbols/    Arco e monogramas isolados (SVG)
├── png/        Renders raster 2x–4x (para onde SVG não serve)
└── tokens/     palette.css · palette.json
```

## Qual arquivo usar

| Contexto | Arquivo |
|---|---|
| Header de site/admin, e-mail, documento | `logos/primary-lockup.svg` |
| Sobre fundo bordô ou escuro | `logos/primary-lockup-inverse.svg` |
| Espaço estreito (rodapé, banner fino) | `logos/wordmark.svg` |
| Convites, capas, peças editoriais | `logos/vertical-lockup.svg` |
| Favicon, ícone de app, avatar | `symbols/monogram-solid.svg` |
| Selo / carimbo | `symbols/monogram-circle.svg` |
| Símbolo isolado da marca | `symbols/arch.svg` |

## Tokens de cor

`tokens/palette.json` e `tokens/palette.css` são a fonte canônica das cores. A documentação navegável (com versões Dart/Tailwind) está em [`../design-system/colors.md`](../design-system/colors.md).

## Fontes

Sora, Cormorant Garamond e JetBrains Mono — todas via Google Fonts (SIL OFL 1.1). Instruções de carga por plataforma em [`../design-system/typography.md`](../design-system/typography.md#1-carregando-as-fontes).

## Regras

1. Não recolorir os logos fora da paleta oficial.
2. Não distorcer — escalar sempre proporcionalmente.
3. Não aplicar efeitos (sombra, blur, gradiente, contorno).
4. Clear space: **1×** a altura do arco em todos os lados.
5. Tamanho mínimo: **120px** (digital) / 32mm (impresso) na largura do lockup horizontal; monograma **16px** / 6mm.

> O símbolo do arco (`symbols/arch.svg`) é puramente geométrico — não depende de fonte e é o elemento mais robusto da marca. Os SVGs de wordmark/monograma com texto contêm `@import` de fonte; para impressão, converta o texto em outline no Figma/Illustrator.
