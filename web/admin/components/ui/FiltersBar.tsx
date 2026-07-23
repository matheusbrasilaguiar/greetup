import React from "react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search } from "lucide-react";

interface FiltersBarProps {
  children: React.ReactNode;
  count?: { value: number; label: string };
}

export function FiltersBar({ children, count }: FiltersBarProps) {
  return (
    <div className="flex gap-2.5 items-center px-5 py-3.5 flex-wrap bg-muted border-b border-border">
      {children}
      {count !== undefined && (
        <span className="ml-auto font-mono text-[10.5px] tracking-[.14em] uppercase text-muted-foreground">
          <strong className="text-primary">{count.value}</strong> {count.label}
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
    <div className="relative flex-1 sm:flex-none">
      <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3 text-muted-foreground pointer-events-none" />
      <Input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder ?? "Buscar…"}
        className="h-8 pl-7 text-[12.5px] w-full sm:w-auto sm:min-w-[160px] bg-background"
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
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="h-8 text-[12.5px] bg-background">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {options.map((o) => (
          <SelectItem key={o.value} value={o.value}>
            {o.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
