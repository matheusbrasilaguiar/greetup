# Tipografia

Três famílias, papéis bem separados:

| Família | Papel | Pesos | Licença |
|---|---|---|---|
| **Sora** | Interface inteira — headlines, body, labels | 300 · 400 · 500 · 600 · 700 | SIL OFL 1.1 |
| **Cormorant Garamond** | Exceção editorial — citações, manifestos (**sempre itálico**) | 400 italic | SIL OFL 1.1 |
| **JetBrains Mono** | Metadados — captions, horários, códigos, eyebrows | 400 · 500 | SIL OFL 1.1 |

Todas via Google Fonts. Instruções de obtenção em [`../assets/`](../assets/) (herdadas do brand kit). **Sora cobre ~100% do produto;** as outras duas são pontuais.

---

## 1. Carregando as fontes

### Web (Next.js — recomendado: `next/font`)

```tsx
// app/fonts.ts
import { Sora, Cormorant_Garamond, JetBrains_Mono } from "next/font/google";

export const sora = Sora({
  subsets: ["latin"], weight: ["300","400","500","600","700"],
  variable: "--gu-font-text", display: "swap",
});
export const cormorant = Cormorant_Garamond({
  subsets: ["latin"], weight: ["400"], style: ["italic"],
  variable: "--gu-font-editorial", display: "swap",
});
export const jetbrains = JetBrains_Mono({
  subsets: ["latin"], weight: ["400","500"],
  variable: "--gu-font-mono", display: "swap",
});
// aplique as três `.variable` no <html className=...> do root layout
```

Alternativa simples (`<link>` no `<head>`), idêntica à usada nos protótipos:

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700&family=Cormorant+Garamond:ital,wght@0,400;1,400&family=JetBrains+Mono:wght@400;500&display=swap">
```

### Stack de fallback (CSS)

```css
:root {
  --gu-font-display:   "Sora", system-ui, sans-serif;
  --gu-font-text:      "Sora", system-ui, sans-serif;
  --gu-font-editorial: "Cormorant Garamond", Georgia, serif;
  --gu-font-mono:      "JetBrains Mono", ui-monospace, monospace;
}
/* Ative os recursos OpenType que dão o ar da marca: */
html { font-feature-settings: "ss01", "cv11"; -webkit-font-smoothing: antialiased; }
```

### Flutter

Baixe os `.ttf` (ou use o pacote `google_fonts`) e declare no `pubspec.yaml`:

```yaml
flutter:
  fonts:
    - family: Sora
      fonts:
        - { asset: assets/fonts/Sora-Light.ttf,     weight: 300 }
        - { asset: assets/fonts/Sora-Regular.ttf,   weight: 400 }
        - { asset: assets/fonts/Sora-Medium.ttf,    weight: 500 }
        - { asset: assets/fonts/Sora-SemiBold.ttf,  weight: 600 }
        - { asset: assets/fonts/Sora-Bold.ttf,      weight: 700 }
    - family: CormorantGaramond
      fonts:
        - { asset: assets/fonts/CormorantGaramond-Italic.ttf, weight: 400, style: italic }
    - family: JetBrainsMono
      fonts:
        - { asset: assets/fonts/JetBrainsMono-Regular.ttf, weight: 400 }
        - { asset: assets/fonts/JetBrainsMono-Medium.ttf,  weight: 500 }
```

---

## 2. Escala de produto (mobile + web app)

Esta é a escala que os **apps e o admin** usam. Otimizada para densidade operacional. (A escala editorial, bem maior, fica na seção 5 — só para superfícies de marketing.)

| Estilo | Família · Peso | Tamanho / Linha | Tracking | Uso |
|---|---|---|---|---|
| **Display** | Sora · 700 | 32 / 1.0 | −2.8% | Número-herói, título de splash |
| **H1** | Sora · 700 | 28 / 1.04 | −2.2% | Título de tela |
| **H2** | Sora · 600 | 22 / 1.1 | −1.5% | Título de seção |
| **H3 / Label** | Sora · 500 | 16 / 1.2 | −0.5% | Subtítulo, label forte, item de lista |
| **Body** | Sora · 400 | 14 / 1.6 | 0 | Texto corrido, descrições |
| **Body Sm** | Sora · 400 | 13 / 1.5 | 0 | Texto denso em cards/tabelas |
| **Caption / Eyebrow** | JetBrains Mono · 400 | 11 / 1.4 | **+18%** · UPPERCASE | Metadados, horários, eyebrows |
| **Editorial** | Cormorant · 400 *italic* | 32 / 1.05 | −1% | Citação pontual, momento de calor |

**Regras de ouro**
- Texto nunca abaixo de **13px** em produto (11px só para o caption mono, que é curto e espaçado).
- Tracking negativo cresce com o tamanho: títulos grandes apertam, body fica em 0.
- **Eyebrow é sempre mono + uppercase + tracking largo.** É a assinatura tipográfica da marca.
- Cormorant **só em itálico** e **só pontual** — uma citação por tela, no máximo.

---

## 3. Implementação — Web (CSS utilitário)

```css
.gu-display { font-family: var(--gu-font-display); font-weight: 700; font-size: 32px; line-height: 1.0;  letter-spacing: -.028em; color: var(--gu-ink-900); }
.gu-h1      { font-family: var(--gu-font-display); font-weight: 700; font-size: 28px; line-height: 1.04; letter-spacing: -.022em; color: var(--gu-ink-900); }
.gu-h2      { font-family: var(--gu-font-display); font-weight: 600; font-size: 22px; line-height: 1.1;  letter-spacing: -.015em; color: var(--gu-ink-900); }
.gu-h3      { font-family: var(--gu-font-display); font-weight: 500; font-size: 16px; line-height: 1.2;  letter-spacing: -.005em; color: var(--gu-ink-900); }
.gu-body    { font-family: var(--gu-font-text);    font-weight: 400; font-size: 14px; line-height: 1.6;  color: var(--gu-ink-700); }
.gu-cap     { font-family: var(--gu-font-mono);    font-weight: 400; font-size: 11px; line-height: 1.4;  letter-spacing: .18em; text-transform: uppercase; color: var(--gu-ink-500); }
.gu-edit    { font-family: var(--gu-font-editorial); font-style: italic; font-weight: 400; font-size: 32px; line-height: 1.05; color: var(--gu-bordeaux-700); }
```

### Tailwind v4 (`@theme`)

```css
@theme {
  --font-display: "Sora", system-ui, sans-serif;
  --font-sans:    "Sora", system-ui, sans-serif;
  --font-serif:   "Cormorant Garamond", Georgia, serif;
  --font-mono:    "JetBrains Mono", ui-monospace, monospace;
}
/* exemplos de uso:
   h1  → class="font-display font-bold text-[28px] leading-[1.04] tracking-[-.022em]"
   cap → class="font-mono text-[11px] tracking-[.18em] uppercase text-ink-500" */
```

---

## 4. Implementação — Flutter (TextTheme + extension)

```dart
import 'package:flutter/material.dart';
import 'gu_colors.dart';

abstract final class GuType {
  static const _sora = 'Sora';
  static const _serif = 'CormorantGaramond';
  static const _mono = 'JetBrainsMono';

  static const display = TextStyle(fontFamily: _sora, fontWeight: FontWeight.w700, fontSize: 32, height: 1.0,  letterSpacing: -0.9,  color: GuColors.ink900);
  static const h1      = TextStyle(fontFamily: _sora, fontWeight: FontWeight.w700, fontSize: 28, height: 1.04, letterSpacing: -0.62, color: GuColors.ink900);
  static const h2      = TextStyle(fontFamily: _sora, fontWeight: FontWeight.w600, fontSize: 22, height: 1.1,  letterSpacing: -0.33, color: GuColors.ink900);
  static const h3      = TextStyle(fontFamily: _sora, fontWeight: FontWeight.w500, fontSize: 16, height: 1.2,  letterSpacing: -0.08, color: GuColors.ink900);
  static const body    = TextStyle(fontFamily: _sora, fontWeight: FontWeight.w400, fontSize: 14, height: 1.6,  color: GuColors.ink700);
  static const bodySm  = TextStyle(fontFamily: _sora, fontWeight: FontWeight.w400, fontSize: 13, height: 1.5,  color: GuColors.ink700);
  static const caption = TextStyle(fontFamily: _mono, fontWeight: FontWeight.w400, fontSize: 11, height: 1.4,  letterSpacing: 2.0, color: GuColors.ink500);
  static const editorial = TextStyle(fontFamily: _serif, fontStyle: FontStyle.italic, fontWeight: FontWeight.w400, fontSize: 32, height: 1.05, color: GuColors.bordeaux700);
}
```

> `letterSpacing` no Flutter é em **pixels lógicos**, não em em — por isso `-2.2%` de 28px ≈ `-0.62`. Para o caption, lembre de aplicar `.toUpperCase()` no texto; o `TextStyle` não força caixa alta.

### Montando o `ThemeData`

```dart
ThemeData buildGuTheme() {
  final base = ThemeData(useMaterial3: true, brightness: Brightness.light);
  return base.copyWith(
    scaffoldBackgroundColor: GuColors.cream50,
    colorScheme: base.colorScheme.copyWith(
      primary: GuColors.bordeaux700,
      surface: GuColors.cream100,
      onSurface: GuColors.ink900,
      error: GuColors.danger,
    ),
    textTheme: const TextTheme(
      displaySmall: GuType.display,
      headlineLarge: GuType.h1,
      titleLarge: GuType.h2,
      titleMedium: GuType.h3,
      bodyMedium: GuType.body,
      bodySmall: GuType.bodySm,
      labelSmall: GuType.caption,
    ),
    extensions: const [GuStatusColors.standard], // ver colors.md
  );
}
```

---

## 5. Escala editorial (somente marketing / marca)

O Brandbook usa uma escala muito maior para peças institucionais — **não** use no produto, só em landing pages, capas e e-mails de marca:

| Estilo | Tamanho / Linha | Tracking |
|---|---|---|
| Display | 104 / .92 | −4% |
| H1 | 64 / .96 | −3% |
| H2 | 40 / 1.04 | −2% |
| Lead | 22 / 1.45 | 0 |
| Editorial | 48 / 1.05 *italic* | −1% |

Referência completa: `Brandbook.html` na raiz do projeto.
