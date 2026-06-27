interface KpiCardProps {
  label: string;
  value: string | number;
  of?: string | number;
  sub?: string;
  valueColor?: string;
}

export function KpiCard({ label, value, of: ofProp, sub, valueColor }: KpiCardProps) {
  return (
    <div className="bg-white border border-cream-200 rounded-xl p-5">
      <p className="font-mono text-[10.5px] tracking-[.14em] text-ink-500 uppercase mb-2.5">{label}</p>
      <p
        style={{
          fontFamily: "var(--font-sora)",
          fontSize: 32,
          fontWeight: 600,
          letterSpacing: "-0.028em",
          lineHeight: 1,
          fontFeatureSettings: '"tnum"',
          color: valueColor ?? "var(--gu-ink-900)",
        }}
      >
        {value}
        {ofProp !== undefined && (
          <span
            style={{
              fontSize: 18,
              color: "var(--gu-ink-500)",
              fontWeight: 400,
              marginLeft: 6,
            }}
          >
            {ofProp}
          </span>
        )}
      </p>
      {sub && (
        <p className="font-mono text-[11px] text-ink-300 mt-2 tracking-[.04em]">{sub}</p>
      )}
    </div>
  );
}
