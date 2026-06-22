interface KpiCardProps {
  label: string;
  value: string | number;
  sub?: string;
}

export function KpiCard({ label, value, sub }: KpiCardProps) {
  return (
    <div className="bg-white border border-cream-200 rounded-xl p-5">
      <p className="font-mono text-[10px] tracking-widest text-ink-500 uppercase mb-3">{label}</p>
      <p className="font-display text-4xl font-semibold text-ink-900">{value}</p>
      {sub && <p className="font-mono text-xs text-ink-300 mt-1">{sub}</p>}
    </div>
  );
}
