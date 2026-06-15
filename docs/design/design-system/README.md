# Design System — Visão Geral

GreetUp **v1.0**. Sistema único aplicado a App Cliente, App Prestador e Admin Web. Esta página cobre os princípios, a proporção cromática, e os tokens de espaçamento, raio e elevação. Para o detalhe de cada eixo, veja os arquivos vizinhos:

- [`colors.md`](./colors.md) — paleta, status operacionais, tokens por plataforma
- [`typography.md`](./typography.md) — famílias, escala, pesos
- [`components.md`](./components.md) — botões, inputs, cards, badges, navegação

---

## 1. Princípios

Quatro princípios orientam toda decisão de produto. Quando duas soluções competem, escolha a que mais honra estes princípios.

| № | Princípio | O que significa na prática |
|---|---|---|
| 01 | **Acolhedor, não casual** | Calor com precisão corporativa. Cordialidade sem informalidade. Nada de emoji, gírias ou exclamação. |
| 02 | **Sereno por padrão** | A interface organiza e some. Cor forte só na pontuação. O protagonista é o evento, não a UI. |
| 03 | **Sistema, não estética** | Cada elemento serve a uma função operacional. Beleza é consequência da clareza. |
| 04 | **Detalhe que se nota** | Um arco, um itálico, um carimbo de horário em mono. Pequenas marcas de cuidado. |

---

## 2. Proporção cromática — a regra 80 / 18 / 2

A identidade vive de uma proporção desigual. **Use-a como orçamento de pixels**, não como sugestão.

| Faixa | Papel | % aproximada da tela |
|---|---|---|
| **Cream** (`#FBF7EF` / `#F5EEDE`) | Superfícies, fundos, cards | **80%** |
| **Ink** (`#1F1A18` e variações) | Texto, ícones, separadores | **18%** |
| **Bordeaux** (`#6B2331`) | Ações primárias, identidade, ênfase | **2%** |

Champagne (`#D9B58A`) entra em doses ainda menores, para detalhes editoriais. Se uma tela parece "muito vermelha", ela violou o orçamento.

---

## 3. Espaçamento — grade de 4px

O sistema usa uma escala base-4. Use estes degraus; evite valores fora da escala.

| Token | px | Uso típico |
|---|---|---|
| `space-1` | 4 | gap mínimo entre ícone e texto |
| `space-2` | 6 | gap interno de campos, dot ↔ label |
| `space-3` | 8 | gap entre botões, padding compacto |
| `space-4` | 12 | padding de botão (vertical), gap de cards |
| `space-5` | 14 | padding de card, gap de seção curto |
| `space-6` | 18–20 | padding de card amplo, gap de blocos |
| `space-7` | 24 | padding de botão (horizontal), respiro de seção |
| `space-8` | 32 | margens de página (mobile) |
| `space-10` | 48 | espaçamento entre seções |
| `space-16` | 64 | respiro de topo de página (web) |

> **Observação honesta:** o Design System v1.0 não declarou tokens de espaçamento nomeados — esta escala foi **derivada** dos valores realmente usados nos protótipos e no `Design System.html`. Ao implementar, promova-a a tokens (`GuSpacing` em Flutter, `--gu-space-*` em CSS) para que designers e devs falem a mesma língua.

---

## 4. Raio de canto

| Token | px | Uso |
|---|---|---|
| `radius-sm` | 5 | botão pequeno, stat card |
| `radius-md` | 6 | botão padrão, input, badge retangular |
| `radius-lg` | 8 | swatch, tabela, container |
| `radius-xl` | 10 | card principal, web frame |
| `radius-pill` | 999 | badge de status (pílula) |
| `radius-phone` | 30–38 | moldura de device nos mockups |

A marca prefere cantos suaves e discretos — **nunca** raios exagerados (ex.: 20px+ em botões). O raio espelha, em miniatura, a curva do arco do logo.

---

## 5. Elevação (sombra)

A interface é quase plana. Há **uma** sombra de card e **uma** de destaque (modais, devices).

```css
/* Card padrão */
--gu-shadow-card: 0 1px 3px rgba(31, 26, 24, .08);

/* Destaque: modais, bottom sheets, devices */
--gu-shadow-raised: 0 6px 20px -8px rgba(46, 17, 22, .18);
--gu-shadow-float:  0 30px 60px -30px rgba(46, 17, 22, .4),
                    0 12px 24px -10px rgba(46, 17, 22, .2);
```

Sombras sempre em tom bordô/ink quente (`rgba(46,17,22,…)`), nunca preto puro frio.

---

## 6. Tom de voz (microcopy)

A marca escreve como recebe: com método e cuidado.

- **Direto e sereno.** "Marcar pronto", "Abrir mesa", "Fechar conta" — verbo + objeto.
- **Sem euforia.** Nada de "Tudo certo! 🎉". Prefira "Pedido confirmado".
- **Metadados em mono.** Números operacionais, horários e códigos vão em JetBrains Mono com `letter-spacing`: `EVENTO #2487 · MESA 12 · CHEGADA 14:30`.
- **Português de São Paulo, registro corporativo.** Trate o usuário por "você".

---

## 7. Ordem de implementação sugerida

1. `gu_tokens` (Dart) e `tokens.css` (web) a partir de [`colors.md`](./colors.md) + [`typography.md`](./typography.md).
2. `ThemeData` / `@theme` montados sobre os tokens.
3. Componentes base de [`components.md`](./components.md): Button → Input → Card → Badge → Navigation.
4. Telas, usando os protótipos em [`../prototypes/`](../prototypes/) como referência 1:1.
