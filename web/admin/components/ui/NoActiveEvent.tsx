import Link from "next/link";

export function NoActiveEvent() {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-24">
      <div
        className="w-14 h-14 rounded-full flex items-center justify-center"
        style={{ background: "var(--gu-bordeaux-100)" }}
      >
        <svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" strokeWidth="1.6" style={{ color: "var(--gu-bordeaux-600)" }}>
          <rect x="3" y="4" width="18" height="18" rx="2" />
          <path d="M16 2v4M8 2v4M3 10h18" />
        </svg>
      </div>
      <div className="text-center">
        <p className="font-semibold text-[15px]" style={{ color: "var(--gu-bordeaux-900)" }}>
          Nenhum evento ativo
        </p>
        <p className="text-[13px] mt-1" style={{ color: "var(--gu-bordeaux-500)" }}>
          Ative um evento para acompanhar os dados ao vivo.
        </p>
      </div>
      <Link
        href="/events"
        className="px-4 py-2 rounded-lg text-[13px] font-medium transition-colors"
        style={{ background: "var(--gu-bordeaux-900)", color: "var(--gu-cream-50)" }}
      >
        Gerenciar eventos
      </Link>
    </div>
  );
}
