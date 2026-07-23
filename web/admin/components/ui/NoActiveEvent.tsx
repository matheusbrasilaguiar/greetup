import Link from "next/link";
import { CalendarDays } from "lucide-react";

export function NoActiveEvent() {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-24">
      <div className="w-14 h-14 rounded-full flex items-center justify-center bg-muted">
        <CalendarDays className="text-primary" width={26} height={26} strokeWidth={1.6} />
      </div>
      <div className="text-center">
        <p className="font-semibold text-[15px] text-foreground">
          Nenhum evento ativo
        </p>
        <p className="text-[13px] mt-1 text-muted-foreground">
          Ative um evento para acompanhar os dados ao vivo.
        </p>
      </div>
      <Link
        href="/events"
        className="px-4 py-2 rounded-lg text-[13px] font-medium transition-colors bg-primary text-primary-foreground hover:bg-primary/80"
      >
        Gerenciar eventos
      </Link>
    </div>
  );
}
