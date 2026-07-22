import { Badge } from "@/components/ui/badge";

interface Props {
  withCheese: boolean | null;
  courtesy: boolean;
  toGo: boolean;
}

export function OrderOptionBadges({ withCheese, courtesy, toGo }: Props) {
  if (withCheese === null && !courtesy && !toGo) return null;

  return (
    <div className="flex gap-1 flex-wrap mt-1">
      {withCheese === true && (
        <Badge variant="warning" className="font-mono text-[9px]">COM QUEIJO</Badge>
      )}
      {withCheese === false && (
        <Badge variant="secondary" className="font-mono text-[9px]">SEM QUEIJO</Badge>
      )}
      {courtesy && (
        <Badge variant="success" className="font-mono text-[9px]">CORTESIA</Badge>
      )}
      {toGo && (
        <Badge variant="info" className="font-mono text-[9px]">LEVAR</Badge>
      )}
    </div>
  );
}
