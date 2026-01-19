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
  showAdvanced?: boolean;
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
  showAdvanced = false,
  className,
}: ParameterCardProps) {
  const getValueClass = () => {
    if (status === "critical") return "value-display-danger";
    if (status === "warning" || status === "dosing" || status === "stagnant") return "value-display-warning";
    return "value-display";
  };

  const getCardClass = () => {
    if (status === "critical") return "modern-card-danger";
    if (status === "warning" || status === "dosing" || status === "stagnant") return "modern-card-warning";
    return "";
  };

  const getSparklineStatus = () => {
    if (status === "critical") return "danger";
    if (status === "warning" || status === "dosing" || status === "stagnant") return "warning";
    return "healthy";
  };

  return (
    <div className={cn("modern-card p-5", getCardClass(), className)}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center">
            <div className="text-primary">{icon}</div>
          </div>
          <div>
            <h3 className="text-sm font-medium text-foreground">
              {title}
            </h3>
            {showAdvanced && minRange !== undefined && maxRange !== undefined && (
              <span className="text-xs text-muted-foreground font-mono">
                Range: {minRange}-{maxRange} {unit}
              </span>
            )}
          </div>
        </div>
        <StatusTag status={status} />
      </div>

      {/* Value Display */}
      <div className="flex items-baseline gap-2 mb-4">
        <span className={cn("font-mono-data text-3xl font-semibold", getValueClass())}>
          {value.toFixed(1)}
        </span>
        <span className="text-muted-foreground text-sm">{unit}</span>
      </div>

      {/* Sparkline - Only show in advanced mode */}
      {showAdvanced && (
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-muted-foreground">
              30 min trend
            </span>
          </div>
          <Sparkline data={sparklineData} status={getSparklineStatus()} />
        </div>
      )}
    </div>
  );
}
