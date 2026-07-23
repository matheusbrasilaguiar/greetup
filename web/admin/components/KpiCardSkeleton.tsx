import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function KpiCardSkeleton() {
  return (
    <Card className="p-5 gap-2.5">
      <Skeleton className="h-2.5 w-20" />
      <Skeleton className="h-8 w-16" />
      <Skeleton className="h-2.5 w-24" />
    </Card>
  );
}
