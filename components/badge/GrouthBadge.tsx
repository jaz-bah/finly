import React from "react";
import { Badge } from "../ui/badge";
import { TrendingDown, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";

interface GrouthBadgeProps {
  total: number;
  prevTotal: number;
  inverse?: boolean;
}

export default function GrouthBadge({ total, prevTotal, inverse }: GrouthBadgeProps) {
  const percentage = Math.ceil(((total - prevTotal) / prevTotal) * 100);
  const isPositive = percentage > 0;

  if(percentage === 0) return null;

  return (
    <Badge
      variant="outline"
      className={cn(
        "flex items-center gap-2",
        inverse ? (isPositive ? "bg-red-500/30" : "bg-green-500/30") : (isPositive ? "bg-green-500/30" : "bg-red-500/30")
      )}

    >
      <div className="flex items-center gap-1">
        {isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
        <p className="text-xs font-semibold">{percentage}%</p>
      </div>
    </Badge>
  );
}
