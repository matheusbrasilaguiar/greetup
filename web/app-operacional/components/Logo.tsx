interface Props {
  size?: number;
  className?: string;
}

export function Logo({ size = 44, className }: Props) {
  const strokeWidth = size * 0.0636;
  const dotRadius = size * 0.068;

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 44 44"
      fill="none"
      className={className}
      role="img"
      aria-label="GreetUp"
    >
      <path
        d="M5.5 44V20.17C5.5 10.98 12.98 3.5 22.17 3.5 31.36 3.5 38.5 10.98 38.5 20.17V44"
        className="stroke-champagne"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />
      <circle cx="22" cy="23.84" r={dotRadius} className="fill-cream-50" />
    </svg>
  );
}
