import { cn } from "@/lib/utils";

export type StatusType = "filtering" | "dosing" | "stagnant" | "optimal" | "warning" | "critical";

interface StatusTagProps {
  status: StatusType;
  className?: string;
}

const statusConfig: Record<StatusType, { label: string; dotClass: string; textClass: string }> = {
  filtering: {
    label: "FILTERING",
    dotClass: "status-dot-healthy",
    textClass: "text-primary",
  },
  dosing: {
    label: "DOSING",
    dotClass: "status-dot-warning",
    textClass: "text-warning",
  },
  stagnant: {
    label: "STAGNANT",
    dotClass: "status-dot-warning",
    textClass: "text-warning",
  },
  optimal: {
    label: "OPTIMAL",
    dotClass: "status-dot-healthy",
    textClass: "text-primary",
  },
  warning: {
    label: "WARNING",
    dotClass: "status-dot-warning",
    textClass: "text-warning",
  },
  critical: {
    label: "CRITICAL",
    dotClass: "status-dot-danger",
    textClass: "text-destructive",
  },
};

export function StatusTag({ status, className }: StatusTagProps) {
  const config = statusConfig[status];

  return (
    <div
      className={cn(
        "inline-flex items-center gap-2 px-2.5 py-1 rounded bg-secondary/50 border border-primary/10",
        className
      )}
    >
      <div className={cn("status-dot", config.dotClass)} />
      <span className={cn("font-mono text-xs font-medium tracking-widest", config.textClass)}>
        {config.label}
      </span>
    </div>
  );
}
