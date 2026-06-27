"use client";

import { Panel } from "@/components/ui/Panel";
import { KpiCard } from "@/components/ui/KpiCard";
import { PageHead } from "@/components/ui/PageHead";
import { useTables } from "@/lib/hooks/useTables";
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";

interface Session {
  id: string;
  openedAt: string;
  closedAt: string | null;
  attendant: { id: string; name: string } | null;
}

function useAllSessions(tableIds: string[]) {
  return useQuery<{ tableId: string; sessions: Session[] }[]>({
    queryKey: ["all-sessions", tableIds],
    queryFn: async () => {
      const results = await Promise.all(
        tableIds.map(async (id) => {
          const res = await api.get(`/tables/${id}/sessions`);
          return { tableId: id, sessions: res.data };
        })
      );
      return results;
    },
    enabled: tableIds.length > 0,
  });
}

export default function ManagersReportPage() {
  const { data: tables = [] } = useTables();
  const tableIds = tables.map((t) => t.id);
  const { data: allSessions = [], isLoading } = useAllSessions(tableIds);

  const sessions = allSessions.flatMap((t) => t.sessions);

  const byManager = sessions.reduce<
    Record<string, { name: string; count: number; totalMinutes: number }>
  >((acc, session) => {
    if (!session.attendant) return acc;
    const { id, name } = session.attendant;
    if (!acc[id]) acc[id] = { name, count: 0, totalMinutes: 0 };
    acc[id].count += 1;
    if (session.closedAt) {
      const mins =
        (new Date(session.closedAt).getTime() - new Date(session.openedAt).getTime()) / 60_000;
      acc[id].totalMinutes += mins;
    }
    return acc;
  }, {});

  const ranked = Object.entries(byManager)
    .map(([, v]) => v)
    .sort((a, b) => b.count - a.count);

  const maxCount = ranked[0]?.count ?? 1;

  return (
    <div className="flex flex-col gap-6">
      <PageHead eyebrow="Relatórios · Gerentes" title="Performance dos gerentes" sub="Atendimentos e tempo médio por gerente" />

      <div className="grid grid-cols-2 gap-4">
        <KpiCard label="Gerentes com atendimentos" value={ranked.length} />
        <KpiCard label="Total de sessões" value={sessions.length} />
      </div>

      <Panel title="Performance dos gerentes">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-cream-200">
                {["Gerente", "Atendimentos", "Tempo médio (min)"].map((h) => (
                  <th
                    key={h}
                    className="font-mono text-[10px] tracking-widest text-ink-300 uppercase text-left px-5 py-3"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {isLoading && (
                <tr>
                  <td colSpan={3} className="text-center text-sm text-ink-300 py-10">Carregando…</td>
                </tr>
              )}
              {ranked.map((row) => (
                <tr key={row.name} className="border-b border-cream-100 hover:bg-cream-50 transition">
                  <td className="px-5 py-3 text-sm font-medium text-ink-900">{row.name}</td>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-24 h-1.5 rounded-full bg-cream-200 overflow-hidden">
                        <div
                          className="h-full rounded-full bg-bordeaux-700"
                          style={{ width: `${(row.count / maxCount) * 100}%` }}
                        />
                      </div>
                      <span className="font-mono text-xs text-ink-700">{row.count}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3 font-mono text-xs text-ink-700">
                    {row.count > 0 ? Math.round(row.totalMinutes / row.count) : "—"}
                  </td>
                </tr>
              ))}
              {!isLoading && ranked.length === 0 && (
                <tr>
                  <td colSpan={3} className="text-center text-sm text-ink-300 py-10">
                    Nenhum atendimento registrado
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Panel>
    </div>
  );
}
