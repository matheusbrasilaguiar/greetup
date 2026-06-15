# Componentes

Anatomia, estados e specs dos componentes base GreetUp v1.0, com referência cruzada para [`colors.md`](./colors.md) e [`typography.md`](./typography.md). Cada componente traz a spec em tabela + um esqueleto por plataforma (React e Flutter). A renderização viva está em `Design System.html` (raiz) e nos [protótipos](../prototypes/).

Índice: [Botões](#1-botões) · [Inputs](#2-inputs--formulários) · [Cards](#3-cards) · [Badges de status](#4-badges-de-status) · [Navegação](#5-navegação)

---

## 1. Botões

Hierarquia de ação. **Um primário por tela** — ele aponta a ação principal.

| Variante | Fundo | Texto | Borda | Hover | Quando |
|---|---|---|---|---|---|
| **Primary** | `bordeaux/700` | `#FFF` | — | fundo → `bordeaux/800` | Ação principal |
| **Secondary** | transparente | `bordeaux/700` | 1.5px `bordeaux/700` | preenche bordô, texto branco | Alternativa |
| **Ghost** | transparente | `ink/700` | — | fundo `cream/100`, texto `ink/900` | Terciária, navegação |
| **Danger** | `#B91C1C` | `#FFF` | — | fundo `#991717` | Destruição irreversível |
| **Disabled** (primary) | `cream/200` | `ink/300` | — | — | Bloqueado |

**Métricas**

| Token | Valor |
|---|---|
| Padding (md) | `12px 24px` |
| Padding (sm) | `8px 14px` |
| Fonte | Sora 500 · 14px (sm: 13px) |
| Raio | 6px (sm: 5px) |
| Borda | 1.5px (transparente quando sem outline) |
| Ícone | 14px, gap 8px com o texto |
| Botão-ícone | 36×36px, raio 6px |
| Transição | `background/border/color .15s` |

### React

```tsx
// Button.tsx — usa CVA + as CSS vars de colors.md
import { cva, type VariantProps } from "class-variance-authority";

const button = cva(
  "inline-flex items-center justify-center gap-2 rounded-md font-medium " +
  "text-sm leading-none border-[1.5px] border-transparent transition-colors " +
  "disabled:bg-cream-200 disabled:text-ink-300 disabled:cursor-not-allowed",
  {
    variants: {
      intent: {
        primary:   "bg-bordeaux-700 text-white hover:bg-bordeaux-800",
        secondary: "border-bordeaux-700 text-bordeaux-700 hover:bg-bordeaux-700 hover:text-white",
        ghost:     "text-ink-700 hover:bg-cream-100 hover:text-ink-900",
        danger:    "bg-[#B91C1C] text-white hover:bg-[#991717]",
      },
      size: { md: "px-6 py-3", sm: "px-3.5 py-2 text-[13px] rounded-[5px]" },
    },
    defaultVariants: { intent: "primary", size: "md" },
  }
);

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & VariantProps<typeof button>;
export const Button = ({ intent, size, className, ...p }: ButtonProps) =>
  <button className={button({ intent, size, className })} {...p} />;
```

### Flutter

```dart
enum GuButtonIntent { primary, secondary, ghost, danger }

class GuButton extends StatelessWidget {
  final String label;
  final VoidCallback? onPressed; // null = disabled
  final GuButtonIntent intent;
  final bool small;
  final IconData? icon;
  const GuButton(this.label, {super.key, this.onPressed,
    this.intent = GuButtonIntent.primary, this.small = false, this.icon});

  @override
  Widget build(BuildContext context) {
    final disabled = onPressed == null;
    final pad = small
      ? const EdgeInsets.symmetric(horizontal: 14, vertical: 8)
      : const EdgeInsets.symmetric(horizontal: 24, vertical: 12);
    final radius = BorderRadius.circular(small ? 5 : 6);

    late Color bg, fg; Border? border;
    switch (intent) {
      case GuButtonIntent.primary:
        bg = disabled ? GuColors.cream200 : GuColors.bordeaux700;
        fg = disabled ? GuColors.ink300 : Colors.white; break;
      case GuButtonIntent.secondary:
        bg = Colors.transparent; fg = GuColors.bordeaux700;
        border = Border.all(color: GuColors.bordeaux700, width: 1.5); break;
      case GuButtonIntent.ghost:
        bg = Colors.transparent; fg = GuColors.ink700; break;
      case GuButtonIntent.danger:
        bg = GuColors.danger; fg = Colors.white; break;
    }

    return Material(
      color: bg,
      borderRadius: radius,
      child: InkWell(
        borderRadius: radius, onTap: onPressed,
        child: Container(
          padding: pad,
          decoration: BoxDecoration(borderRadius: radius, border: border),
          child: Row(mainAxisSize: MainAxisSize.min, children: [
            if (icon != null) ...[Icon(icon, size: 14, color: fg), const SizedBox(width: 8)],
            Text(label, style: GuType.h3.copyWith(
              fontSize: small ? 13 : 14, fontWeight: FontWeight.w500, color: fg)),
          ]),
        ),
      ),
    );
  }
}
```

---

## 2. Inputs & formulários

Campos sobre `cream/50`, borda `cream/200`. Foco em bordô. Erro/sucesso marcam **só a borda** — nunca fundo colorido.

| Estado | Borda | Observação |
|---|---|---|
| Default | 1.5px `cream/200` | fundo `cream/50` |
| Focus | 1.5px `bordeaux/700` | `outline: none` |
| Error | 1.5px `#EF4444` | + mensagem `.err` em mono `#B91C1C` |
| Success | 1.5px `#22C55E` | borda apenas |
| Disabled | 1.5px `cream/200` | fundo `cream/100`, texto `ink/300` |

**Anatomia do campo** (de cima para baixo, gap 6px):

1. `label` — Sora 500 · 12px · `ink/700`
2. `input` — padding `10px 14px`, raio 6px, texto 14px `ink/900`, placeholder `ink/300`
3. `help` ou `err` — JetBrains Mono · 10.5px (`help`→`ink/500`, `err`→`#B91C1C`)

Input com ícone: ícone 14px à esquerda (`ink/500`), `padding-left: 36px`. `select` herda o mesmo box do input.

### CSS de referência

```css
.gu-input {
  width: 100%; background: var(--gu-cream-50);
  border: 1.5px solid var(--gu-cream-200); border-radius: 6px;
  padding: 10px 14px; font-size: 14px; color: var(--gu-ink-900);
  transition: border-color .15s;
}
.gu-input::placeholder { color: var(--gu-ink-300); }
.gu-input:focus  { outline: none; border-color: var(--gu-bordeaux-700); }
.gu-input.error  { border-color: #EF4444; }
.gu-input.success{ border-color: #22C55E; }
.gu-input:disabled { background: var(--gu-cream-100); color: var(--gu-ink-300); cursor: not-allowed; }
```

### Flutter — `InputDecorationTheme`

```dart
InputDecorationTheme guInputTheme = InputDecorationTheme(
  filled: true, fillColor: GuColors.cream50,
  contentPadding: const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
  hintStyle: GuType.body.copyWith(color: GuColors.ink300),
  border:        _b(GuColors.cream200),
  enabledBorder: _b(GuColors.cream200),
  focusedBorder: _b(GuColors.bordeaux700),
  errorBorder:   _b(const Color(0xFFEF4444)),
  focusedErrorBorder: _b(const Color(0xFFEF4444)),
);
OutlineInputBorder _b(Color c) => OutlineInputBorder(
  borderRadius: BorderRadius.circular(6),
  borderSide: BorderSide(color: c, width: 1.5),
);
// Label (12px Sora 500 ink700) e help/err (10.5px mono) ficam FORA do TextField,
// num Column com gap 6 — não use o floating label do Material.
```

---

## 3. Cards

Contêiner de informação. Base `cream/100`, borda `cream/200`, sombra discreta.

| Token | Valor |
|---|---|
| Fundo / borda | `cream/100` / 1px `cream/200` |
| Raio | 10px |
| Padding | 20px |
| Sombra | `0 1px 3px rgba(31,26,24,.08)` |
| Header | flex space-between, `padding-bottom 14px` + régua `cream/200` |
| `card-eyebrow` | mono 10.5px · `bordeaux/700` · uppercase |
| `card-title` | Sora 600 · 15px · `ink/900` |
| `card-row` | `k` (mono 11px `ink/500`) ↔ `v` (Sora 500 `ink/900`) |
| `card-foot` | topo com régua, flex space-between |

**Variante por status** — borda esquerda de **4px** na cor `br` do status, `padding-left: 16px`. O eyebrow assume a cor `tx` do status. Card cancelado ganha `opacity: .7`. (Cores em [`colors.md` §3](./colors.md#3-status-operacionais).)

```tsx
// Card.tsx — composição simples; status opcional pinta a borda esquerda
const STATUS_BR: Record<string,string> = {
  pending:"#D9B58A", preparing:"#6366F1", ready:"#22C55E",
  delivered:"#B0AAA5", canceled:"#EF4444",
};
export function Card({ status, children, className = "" }:{
  status?: keyof typeof STATUS_BR; children: React.ReactNode; className?: string;
}) {
  const accent = status
    ? { borderLeft: `4px solid ${STATUS_BR[status]}`, paddingLeft: 16 } : undefined;
  return (
    <div style={accent}
      className={`bg-cream-100 border border-cream-200 rounded-[10px] p-5
                  shadow-[0_1px_3px_rgba(31,26,24,.08)] ${className}`}>
      {children}
    </div>
  );
}
```

Em Flutter, um `Container` com `BoxDecoration(color: cream100, borderRadius: 10, border: Border.all(color: cream200), boxShadow: [GuColors.shadowCard])` e, para status, troque por `Border(left: BorderSide(color: status.br, width: 4))`.

---

## 4. Badges de status

Pílula que comunica estado operacional. **Sempre rótulo + dot** (nunca cor sozinha — ver acessibilidade em [`colors.md` §7](./colors.md#7-acessibilidade)).

| Token | Valor |
|---|---|
| Fonte | JetBrains Mono · 11px · uppercase · tracking `.12em` |
| Padding | `4px 10px` |
| Raio | 999px (pílula) |
| Dot | 6px círculo, cor = `br` do status |
| Cores | `bg`/`tx`/`br` do status correspondente |

Os cinco estados: **Pendente · Em preparo · Pronto · Entregue · Cancelado**. Mapa de cores completo em [`colors.md` §3](./colors.md#3-status-operacionais).

```tsx
const STATUS = {
  pending:  { bg:"#FFF8E7", tx:"#92610A", br:"#D9B58A", label:"Pendente" },
  preparing:{ bg:"#EEF2FF", tx:"#3730A3", br:"#6366F1", label:"Em preparo" },
  ready:    { bg:"#F0FDF4", tx:"#15803D", br:"#22C55E", label:"Pronto" },
  delivered:{ bg:"#F5EEDE", tx:"#4A423E", br:"#B0AAA5", label:"Entregue" },
  canceled: { bg:"#FEF2F2", tx:"#B91C1C", br:"#EF4444", label:"Cancelado" },
} as const;

export function StatusBadge({ status }: { status: keyof typeof STATUS }) {
  const s = STATUS[status];
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1
                     font-mono text-[11px] uppercase tracking-[.12em] border"
      style={{ background:s.bg, color:s.tx, borderColor:s.br }}>
      <span className="w-1.5 h-1.5 rounded-full" style={{ background:s.br }} />
      {s.label}
    </span>
  );
}
```

```dart
// Flutter — lê o GuStatusColor do ThemeExtension (ou passa direto)
class GuStatusBadge extends StatelessWidget {
  final GuStatusColor color; final String label;
  const GuStatusBadge({super.key, required this.color, required this.label});
  @override
  Widget build(BuildContext context) => Container(
    padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
    decoration: BoxDecoration(color: color.bg, borderRadius: BorderRadius.circular(999),
      border: Border.all(color: color.br)),
    child: Row(mainAxisSize: MainAxisSize.min, children: [
      Container(width: 6, height: 6, decoration: BoxDecoration(color: color.br, shape: BoxShape.circle)),
      const SizedBox(width: 6),
      Text(label.toUpperCase(), style: GuType.caption.copyWith(color: color.tx, letterSpacing: 1.3)),
    ]),
  );
}
```

---

## 5. Navegação

Duas estruturas canônicas, uma por plataforma.

### 5.1 Mobile — Bottom bar (App Cliente & App Prestador)

- Fundo branco, topo com régua `cream/200`, `padding: 10px 8px 18px`.
- 4–5 itens. Cada item: ícone linear 20px + microlabel **mono 9px uppercase**.
- Inativo `ink/500`; ativo `bordeaux/700` + dot 4px embaixo.
- Ícones: traço 1.5px, terminações arredondadas (geometria do arco).

Em Flutter, prefira um `BottomNavigationBar`/`NavigationBar` customizado (ou `Row` própria) para controlar o microlabel mono — o label padrão do Material não aplica `letterSpacing`/uppercase.

### 5.2 Web — Sidebar (Admin)

- Fundo `bordeaux/900`, largura ~220px, texto `cream/200`.
- Brand no topo (arco + wordmark `cream/50`).
- Itens: ícone 14px + label 13px; ativo/hover → fundo `bordeaux/800`, texto `cream/50`.
- Grupos rotulados em mono 9.5px `bordeaux/300` uppercase (ex.: "Operação", "Conta").
- Contador opcional em pill `bordeaux/700` à direita do item.

```tsx
// SidebarItem.tsx
export function SidebarItem({ icon, label, count, active }:{
  icon: React.ReactNode; label: string; count?: number; active?: boolean;
}) {
  return (
    <a className={`flex items-center gap-2.5 px-2.5 py-2 rounded-[5px] text-[13px]
                   cursor-pointer ${active
        ? "bg-bordeaux-800 text-cream-50"
        : "text-cream-200 hover:bg-bordeaux-800"}`}>
      <span className="w-3.5 h-3.5 opacity-90">{icon}</span>
      {label}
      {count != null && (
        <span className="ml-auto font-mono text-[10px] bg-bordeaux-700
                         px-1.5 py-px rounded-full">{count}</span>
      )}
    </a>
  );
}
```

---

## Checklist de implementação

- [ ] Todos os valores vêm de tokens (`GuColors`/`--gu-*`) — zero hex cru nas telas.
- [ ] Um único botão **primary** por tela.
- [ ] Inputs marcam erro/sucesso só na borda + mensagem mono.
- [ ] Cards com status usam a borda-esquerda de 4px; cancelado a `.7` de opacidade.
- [ ] Badges sempre com rótulo textual + dot.
- [ ] Eyebrows e metadados em JetBrains Mono uppercase com tracking largo.
- [ ] Foco visível (`bordeaux/700`) em todos os controles — teclado e leitor de tela.
