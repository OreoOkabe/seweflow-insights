import { cn } from "@/lib/utils";

export type StatusType = "filtering" | "dosing" | "stagnant" | "optimal" | "warning" | "critical";

interface StatusTagProps {
  status: StatusType;
  className?: string;
}

const statusConfig: Record<StatusType, { label: string; bgClass: string; textClass: string }> = {
  filtering: {
    label: "Filtering",
    bgClass: "bg-success/10",
    textClass: "text-success",
  },
  dosing: {
    label: "Dosing",
    bgClass: "bg-warning/10",
    textClass: "text-warning",
  },
  stagnant: {
    label: "Stagnant",
    bgClass: "bg-warning/10",
    textClass: "text-warning",
  },
  optimal: {
    label: "Optimal",
    bgClass: "bg-success/10",
    textClass: "text-success",
  },
  warning: {
    label: "Warning",
    bgClass: "bg-warning/10",
    textClass: "text-warning",
  },
  critical: {
    label: "Critical",
    bgClass: "bg-destructive/10",
    textClass: "text-destructive",
  },
};

export function StatusTag({ status, className }: StatusTagProps) {
  const config = statusConfig[status];

  return (
    <div
      className={cn(
        "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium",
        config.bgClass,
        config.textClass,
        className
      )}
    >
      <div className={cn("w-1.5 h-1.5 rounded-full", 
        status === "critical" ? "bg-destructive" : 
        status === "warning" || status === "dosing" || status === "stagnant" ? "bg-warning" : 
        "bg-success"
      )} />
      {config.label}
    </div>
  );
}
