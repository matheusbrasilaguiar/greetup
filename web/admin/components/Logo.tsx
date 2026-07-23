interface Props {
  size?: number;
  className?: string;
  strokeClassName?: string;
  dotClassName?: string;
}

export function Logo({
  size = 36,
  className,
  strokeClassName = "stroke-primary",
  dotClassName = "fill-champagne",
}: Props) {
  return (
    <svg
      viewBox="0 0 120 120"
      width={size}
      height={size}
      aria-hidden="true"
      className={className}
    >
      <path
        d="M18 102 V54 a42 42 0 0 1 84 0 V102"
        fill="none"
        className={strokeClassName}
        strokeWidth={4.2}
        strokeLinecap="round"
      />
      <circle cx="60" cy="64" r="6.6" className={dotClassName} />
    </svg>
  );
}
