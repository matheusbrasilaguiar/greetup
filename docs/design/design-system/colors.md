# Cores

Paleta GreetUp v1.0. Quatro famílias — **bordeaux** (narrativa), **champagne** (acento), **cream** (estrutura) e **ink** (texto) — mais um conjunto de **status operacionais**. Regra de uso: **80% cream · 18% ink · 2% bordeaux** (ver [README](./README.md#2-proporção-cromática--a-regra-80--18--2)).

Os tokens canônicos vivem em [`../assets/tokens/palette.json`](../assets/tokens/palette.json) e [`palette.css`](../assets/tokens/palette.css). Esta página replica os valores e adiciona os recortes para Flutter e Tailwind.

---

## 1. Bordeaux — identidade & ações primárias

| Token | HEX | OKLCH | Papel |
|---|---|---|---|
| `bordeaux/900` | `#2E1116` | `0.22 0.07 15` | Sidebar, fundos escuros, manifesto |
| `bordeaux/800` | `#4A1A24` | `0.30 0.09 18` | Hover de fundo escuro, profundidade |
| `bordeaux/700` | `#6B2331` | `0.38 0.11 20` | **Primária** — botões, links, ênfase |
| `bordeaux/500` | `#92465A` | `0.52 0.10 22` | Secundária, estados intermediários |
| `bordeaux/300` | `#D6A8B0` | `0.78 0.05 22` | Soft — rótulos sobre fundo escuro |

## 2. Champagne · Cream · Ink

| Token | HEX | OKLCH | Papel |
|---|---|---|---|
| `champagne` | `#D9B58A` | `0.82 0.05 75` | Acento editorial, separadores finos |
| `cream/50` | `#FBF7EF` | `0.985 0.012 85` | **Fundo de página** |
| `cream/100` | `#F5EEDE` | `0.965 0.018 82` | **Superfície de card** |
| `cream/200` | `#ECE2CC` | `0.93 0.022 80` | **Borda / régua** |
| `ink/900` | `#1F1A18` | `0.18 0.012 30` | **Texto principal** |
| `ink/700` | `#4A423E` | `0.32 0.010 30` | Texto secundário |
| `ink/500` | `#7A736E` | `0.52 0.008 30` | Caption, placeholder de label |
| `ink/300` | `#B0AAA5` | `0.72 0.006 30` | Desabilitado, placeholder de input |

> Os valores OKLCH são a referência perceptual (usada no Brandbook). Os HEX são o que vai no código — são equivalentes práticos.

---

## 3. Status operacionais

Cinco estados de pedido seguem o fluxo **pendente → em preparo → pronto → entregue**, mais **cancelado** (terminal). Cada estado tem três tokens: fundo (`bg`), texto (`tx`) e borda/ponto (`br`).

| Estado | bg | tx (texto) | br (borda/dot) |
|---|---|---|---|
| **Pendente** | `#FFF8E7` | `#92610A` | `#D9B58A` |
| **Em preparo** | `#EEF2FF` | `#3730A3` | `#6366F1` |
| **Pronto** | `#F0FDF4` | `#15803D` | `#22C55E` |
| **Entregue** | `#F5EEDE` | `#4A423E` | `#B0AAA5` |
| **Cancelado** | `#FEF2F2` | `#B91C1C` | `#EF4444` |

`Danger` (ação destrutiva, fora do fluxo de status) usa `#B91C1C`, com hover `#991717`.

**Estados de mesa** reaproveitam o mesmo vocabulário: livre = *pronto*, ocupada = bordô soft (`bg #FBEEF0`, `tx bordeaux/800`, `br bordeaux/300`), aguardando limpeza = *pendente*, reservada = *entregue*.

---

## 4. Combinações aprovadas

| Fundo | Texto | Quando |
|---|---|---|
| `cream/100` | `ink/900` | Padrão — 80% das telas |
| `bordeaux/900` | `cream/50` | Headers de peso, sidebar, manifesto |
| `bordeaux/700` | `cream/50` | Botões e acentos de ação |

Nunca: texto bordô sobre fundo bordô claro; status colorido como fundo de bloco grande; dois bordôs adjacentes sem cream entre eles.

---

## 5. Implementação — Web (CSS custom properties)

Já disponível em [`../assets/tokens/palette.css`](../assets/tokens/palette.css). Cole no `:root` global (ou em `app/globals.css` no Next.js):

```css
:root {
  /* Bordeaux */
  --gu-bordeaux-900: #2E1116;
  --gu-bordeaux-800: #4A1A24;
  --gu-bordeaux-700: #6B2331;
  --gu-bordeaux-500: #92465A;
  --gu-bordeaux-300: #D6A8B0;
  /* Champagne / Cream / Ink */
  --gu-champagne: #D9B58A;
  --gu-cream-50:  #FBF7EF;
  --gu-cream-100: #F5EEDE;
  --gu-cream-200: #ECE2CC;
  --gu-ink-900:   #1F1A18;
  --gu-ink-700:   #4A423E;
  --gu-ink-500:   #7A736E;
  --gu-ink-300:   #B0AAA5;
  /* Status — pending / preparing / ready / delivered / canceled */
  --gu-status-pending-bg:   #FFF8E7;  --gu-status-pending-tx:   #92610A;  --gu-status-pending-br:   #D9B58A;
  --gu-status-preparing-bg: #EEF2FF;  --gu-status-preparing-tx: #3730A3;  --gu-status-preparing-br: #6366F1;
  --gu-status-ready-bg:     #F0FDF4;  --gu-status-ready-tx:     #15803D;  --gu-status-ready-br:     #22C55E;
  --gu-status-delivered-bg: #F5EEDE;  --gu-status-delivered-tx: #4A423E;  --gu-status-delivered-br: #B0AAA5;
  --gu-status-canceled-bg:  #FEF2F2;  --gu-status-canceled-tx:  #B91C1C;  --gu-status-canceled-br:  #EF4444;
}
```

### Tailwind v4 (`@theme`)

```css
@import "tailwindcss";

@theme {
  --color-bordeaux-900: #2E1116;
  --color-bordeaux-800: #4A1A24;
  --color-bordeaux-700: #6B2331;
  --color-bordeaux-500: #92465A;
  --color-bordeaux-300: #D6A8B0;
  --color-champagne:    #D9B58A;
  --color-cream-50:     #FBF7EF;
  --color-cream-100:    #F5EEDE;
  --color-cream-200:    #ECE2CC;
  --color-ink-900:      #1F1A18;
  --color-ink-700:      #4A423E;
  --color-ink-500:      #7A736E;
  --color-ink-300:      #B0AAA5;
}
/* uso: class="bg-cream-50 text-ink-900 border-cream-200" */
```

Para status, prefira um mapa em dado (não classe), já que são combinações fixas de bg/tx/br — ver `components.md` (Badges).

---

## 6. Implementação — Flutter (Dart)

Crie `lib/tokens/gu_colors.dart`. Tudo `const` para custo zero em runtime.

```dart
import 'package:flutter/painting.dart';

/// Tokens cromáticos GreetUp v1.0. NÃO usar Color(0xFF...) cru fora daqui.
abstract final class GuColors {
  // Bordeaux
  static const bordeaux900 = Color(0xFF2E1116);
  static const bordeaux800 = Color(0xFF4A1A24);
  static const bordeaux700 = Color(0xFF6B2331); // primária
  static const bordeaux500 = Color(0xFF92465A);
  static const bordeaux300 = Color(0xFFD6A8B0);

  // Champagne / Cream / Ink
  static const champagne = Color(0xFFD9B58A);
  static const cream50  = Color(0xFFFBF7EF); // página
  static const cream100 = Color(0xFFF5EEDE); // card
  static const cream200 = Color(0xFFECE2CC); // borda
  static const ink900 = Color(0xFF1F1A18);   // texto
  static const ink700 = Color(0xFF4A423E);
  static const ink500 = Color(0xFF7A736E);
  static const ink300 = Color(0xFFB0AAA5);

  // Danger (ação destrutiva)
  static const danger   = Color(0xFFB91C1C);
  static const dangerHi = Color(0xFF991717);
}

/// Trio de cores de um status (fundo, texto, borda/dot).
class GuStatusColor {
  final Color bg, tx, br;
  const GuStatusColor(this.bg, this.tx, this.br);
}

abstract final class GuStatus {
  static const pending   = GuStatusColor(Color(0xFFFFF8E7), Color(0xFF92610A), Color(0xFFD9B58A));
  static const preparing = GuStatusColor(Color(0xFFEEF2FF), Color(0xFF3730A3), Color(0xFF6366F1));
  static const ready     = GuStatusColor(Color(0xFFF0FDF4), Color(0xFF15803D), Color(0xFF22C55E));
  static const delivered = GuStatusColor(Color(0xFFF5EEDE), Color(0xFF4A423E), Color(0xFFB0AAA5));
  static const canceled  = GuStatusColor(Color(0xFFFEF2F2), Color(0xFFB91C1C), Color(0xFFEF4444));
}
```

Para expor os status ao resto do app de forma temável, embrulhe-os num `ThemeExtension` (ver [`typography.md`](./typography.md#4-montando-o-themedata) onde o `ThemeData` é montado):

```dart
@immutable
class GuStatusColors extends ThemeExtension<GuStatusColors> {
  final GuStatusColor pending, preparing, ready, delivered, canceled;
  const GuStatusColors({
    required this.pending, required this.preparing, required this.ready,
    required this.delivered, required this.canceled,
  });

  static const standard = GuStatusColors(
    pending: GuStatus.pending, preparing: GuStatus.preparing,
    ready: GuStatus.ready, delivered: GuStatus.delivered, canceled: GuStatus.canceled,
  );

  @override
  GuStatusColors copyWith({GuStatusColor? pending, GuStatusColor? preparing,
      GuStatusColor? ready, GuStatusColor? delivered, GuStatusColor? canceled}) =>
    GuStatusColors(
      pending: pending ?? this.pending, preparing: preparing ?? this.preparing,
      ready: ready ?? this.ready, delivered: delivered ?? this.delivered,
      canceled: canceled ?? this.canceled);

  @override
  GuStatusColors lerp(GuStatusColors? other, double t) => other ?? this; // status não interpola
}
```

---

## 7. Acessibilidade

- `ink/900` sobre `cream/50` ≈ contraste AAA — par padrão de leitura.
- `cream/50` sobre `bordeaux/700` (texto de botão) passa AA para texto ≥14px/500 — **não** reduza o peso do texto branco em botões.
- Texto de status usa o `tx` escuro sobre o `bg` claro do mesmo estado — combinação já validada para AA. Nunca use o `br` (cor saturada) como cor de texto.
- Nunca comunique status **só** por cor: todo badge carrega rótulo textual + dot.
