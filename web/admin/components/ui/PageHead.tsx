interface PageHeadProps {
  eyebrow: string;
  title: string;
  sub?: string;
  actions?: React.ReactNode;
}

export function PageHead({ eyebrow, title, sub, actions }: PageHeadProps) {
  return (
    <div className="flex items-start justify-between mb-5">
      <div>
        <div
          className="flex items-center gap-2 mb-2"
          style={{ color: "var(--gu-bordeaux-700)" }}
        >
          <span
            style={{
              display: "inline-block",
              width: 24,
              height: 1,
              background: "var(--gu-bordeaux-700)",
              flexShrink: 0,
            }}
          />
          <span
            style={{
              fontFamily: "var(--font-jetbrains)",
              fontSize: 10.5,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
            }}
          >
            {eyebrow}
          </span>
        </div>
        <h1
          style={{
            fontSize: 28,
            fontWeight: 600,
            letterSpacing: "-0.025em",
            lineHeight: 1.05,
            color: "var(--gu-ink-900)",
          }}
        >
          {title}
        </h1>
        {sub && (
          <p className="mt-1.5 text-[13.5px]" style={{ color: "var(--gu-ink-700)" }}>
            {sub}
          </p>
        )}
      </div>
      {actions && <div className="flex gap-2 items-center">{actions}</div>}
    </div>
  );
}
