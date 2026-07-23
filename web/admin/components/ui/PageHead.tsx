interface PageHeadProps {
  eyebrow: string;
  title: string;
  sub?: string;
  actions?: React.ReactNode;
}

export function PageHead({ eyebrow, title, sub, actions }: PageHeadProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-5">
      <div className="min-w-0">
        <div className="flex items-center gap-2 mb-2 text-primary">
          <span className="inline-block w-6 h-px shrink-0 bg-primary" />
          <span className="font-mono text-[10.5px] tracking-[0.18em] uppercase">{eyebrow}</span>
        </div>
        <h1 className="text-foreground font-semibold tracking-[-0.025em] leading-[1.05] text-[clamp(22px,5vw,28px)]">
          {title}
        </h1>
        {sub && <p className="mt-1.5 text-[13.5px] text-muted-foreground">{sub}</p>}
      </div>
      {actions && <div className="flex gap-2 items-center flex-shrink-0">{actions}</div>}
    </div>
  );
}
