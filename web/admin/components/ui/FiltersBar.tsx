import React from "react";

interface FiltersBarProps {
  children: React.ReactNode;
  count?: { value: number; label: string };
}

export function FiltersBar({ children, count }: FiltersBarProps) {
  return (
    <div
      className="flex gap-2.5 items-center px-5 py-3.5 flex-wrap"
      style={{
        background: "var(--gu-cream-50)",
        borderBottom: "1px solid var(--gu-cream-200)",
      }}
    >
      {children}
      {count !== undefined && (
        <span
          className="ml-auto font-mono tracking-[.14em] uppercase"
          style={{ fontSize: 10.5, color: "var(--gu-ink-500)" }}
        >
          <strong style={{ color: "var(--gu-bordeaux-700)" }}>{count.value}</strong>{" "}
          {count.label}
        </span>
      )}
    </div>
  );
}

interface SearchFieldProps {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}

export function SearchField({ value, onChange, placeholder }: SearchFieldProps) {
  return (
    <div
      className="flex items-center gap-1.5 rounded-[6px] border flex-1 sm:flex-none"
      style={{
        background: "white",
        borderColor: "var(--gu-cream-200)",
        padding: "6px 10px",
      }}
    >
      <svg width="12" height="12" viewBox="0 0 16 16" fill="none" style={{ color: "var(--gu-ink-300)", flexShrink: 0 }}>
        <circle cx="6.5" cy="6.5" r="5" stroke="currentColor" strokeWidth="1.5" />
        <path d="M10.5 10.5L14 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder ?? "Buscar…"}
        className="min-w-0 w-full sm:w-auto sm:min-w-[160px]"
        style={{
          fontFamily: "var(--font-sora)",
          fontSize: 12.5,
          color: "var(--gu-ink-900)",
          background: "transparent",
          border: "none",
          outline: "none",
        }}
      />
    </div>
  );
}

interface SelectFieldProps {
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
}

export function SelectField({ value, onChange, options }: SelectFieldProps) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      style={{
        fontFamily: "var(--font-sora)",
        fontSize: 12.5,
        color: "var(--gu-ink-700)",
        background: "white",
        border: "1px solid var(--gu-cream-200)",
        borderRadius: 6,
        padding: "6px 10px",
        outline: "none",
        cursor: "pointer",
      }}
    >
      {options.map((o) => (
        <option key={o.value} value={o.value}>
          {o.label}
        </option>
      ))}
    </select>
  );
}
