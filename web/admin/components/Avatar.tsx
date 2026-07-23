import { cn } from "@/lib/utils";

interface Props {
  name: string;
  size?: number;
  className?: string;
}

export function Avatar({ name, size = 28, className }: Props) {
  const initials = name
    .split(" ")
    .slice(0, 2)
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  return (
    <span
      className={cn(
        "rounded-full flex items-center justify-center font-medium shrink-0 bg-muted text-primary",
        size > 40 ? "text-xl" : "text-[13px]",
        className
      )}
      style={{ width: size, height: size }}
    >
      {initials}
    </span>
  );
}
