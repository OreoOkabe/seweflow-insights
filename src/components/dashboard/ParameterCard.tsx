import { cn } from "@/lib/utils";
import { StatusTag, StatusType } from "./StatusTag";
import { Sparkline } from "./Sparkline";

interface ParameterCardProps {
  title: string;
  value: number;
  unit: string;
  status: StatusType;
  sparklineData: number[];
  icon: React.ReactNode;
  minRange?: number;
  maxRange?: number;
  className?: string;
}

export function ParameterCard({
  title,
  value,
  unit,
  status,
  sparklineData,
  icon,
  minRange,
  maxRange,
  className,
}: ParameterCardProps) {
  const getValueClass = () => {
    if (status === "critical") return "value-display-danger";
    if (status === "warning" || status === "dosing" || status === "stagnant") return "value-display-warning";
    return "value-display";
  };

  const getCardClass = () => {
    if (status === "critical") return "glow-card-danger";
    if (status === "warning" || status === "dosing" || status === "stagnant") return "glow-card-warning";
    return "";
  };

  const getSparklineStatus = () => {
    if (status === "critical") return "danger";
    if (status === "warning" || status === "dosing" || status === "stagnant") return "warning";
    return "healthy";
  };

  return (
    <div className={cn("glow-card p-4 flex flex-col gap-3", getCardClass(), className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="text-primary/70">{icon}</div>
          <h3 className="text-sm font-semibold text-foreground/80 uppercase tracking-wider">
            {title}
          </h3>
        </div>
        <StatusTag status={status} />
      </div>

      {/* Value Display */}
      <div className="flex items-baseline gap-2">
        <span className={cn("font-mono-data text-4xl font-semibold", getValueClass())}>
          {value.toFixed(1)}
        </span>
        <span className="text-muted-foreground text-sm font-mono">{unit}</span>
      </div>

      {/* Range indicator */}
      {minRange !== undefined && maxRange !== undefined && (
        <div className="flex items-center gap-2 text-xs text-muted-foreground font-mono">
          <span>Range: {minRange} - {maxRange} {unit}</span>
        </div>
      )}

      {/* Sparkline */}
      <div className="mt-auto">
        <div className="flex items-center justify-between mb-1">
          <span className="text-[10px] text-muted-foreground uppercase tracking-widest">
            30 MIN TREND
          </span>
        </div>
        <Sparkline data={sparklineData} status={getSparklineStatus()} />
      </div>
    </div>
  );
}
