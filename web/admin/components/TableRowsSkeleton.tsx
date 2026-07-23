import { Skeleton } from "@/components/ui/skeleton";

interface ColumnSpec {
  width?: string;
  hide?: string;
}

interface Props {
  columns: number | ColumnSpec[];
  rows?: number;
}

const WIDTH_CYCLE = ["w-3/4", "w-1/2", "w-2/3", "w-1/3", "w-5/6", "w-1/2"];

export function TableRowsSkeleton({ columns, rows = 5 }: Props) {
  const specs: ColumnSpec[] = Array.isArray(columns)
    ? columns
    : Array.from({ length: columns }, () => ({}));

  return (
    <>
      {Array.from({ length: rows }, (_, r) => (
        <tr key={r} className="border-b border-border/60">
          {specs.map((col, c) => (
            <td key={c} className={`px-5 py-3 ${col.hide ?? ""}`}>
              <Skeleton className={`h-4 ${col.width ?? WIDTH_CYCLE[c % WIDTH_CYCLE.length]}`} />
            </td>
          ))}
        </tr>
      ))}
    </>
  );
}
