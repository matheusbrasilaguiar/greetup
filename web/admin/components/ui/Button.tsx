"use client";

import { ButtonHTMLAttributes } from "react";

type ButtonVariant = "primary" | "secondary" | "ghost";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  loading?: boolean;
}

const STYLES: Record<ButtonVariant, string> = {
  primary:
    "bg-bordeaux-700 text-white hover:bg-bordeaux-800 active:bg-bordeaux-900",
  secondary:
    "bg-white text-ink-700 border border-cream-200 hover:bg-cream-50 active:bg-cream-100",
  ghost:
    "text-ink-500 hover:text-ink-900 hover:bg-cream-100",
};

export function Button({
  variant = "primary",
  loading = false,
  children,
  disabled,
  className = "",
  ...props
}: ButtonProps) {
  return (
    <button
      {...props}
      disabled={disabled || loading}
      className={`inline-flex items-center justify-center gap-2 font-sans text-sm font-medium px-4 py-2 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed ${STYLES[variant]} ${className}`}
    >
      {loading ? (
        <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
      ) : null}
      {children}
    </button>
  );
}
