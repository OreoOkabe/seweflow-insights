import { Beaker, ArrowRight, Cpu, Zap, CircuitBoard } from "lucide-react";
import { cn } from "@/lib/utils";

interface DosingLog {
  id: string;
  timestamp: string;
  chemical: string;
  reason: string;
  amount: string;
  industry: string;
}

interface DosingLogsProps {
  logs: DosingLog[];
  className?: string;
}

export function DosingLogs({ logs, className }: DosingLogsProps) {
  return (
    <div className={cn("glow-card p-5", className)}>
      <div className="flex items-center gap-2 mb-4">
        <Beaker className="w-5 h-5 text-primary" />
        <h3 className="text-sm font-semibold uppercase tracking-wider text-foreground/80">
          Chemical Dosing Logs
        </h3>
      </div>

      <div className="space-y-3 max-h-48 overflow-y-auto scrollbar-thin">
        {logs.map((log) => (
          <div
            key={log.id}
            className="p-3 rounded bg-secondary/30 border border-primary/10 space-y-2"
          >
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs text-muted-foreground">
                {log.timestamp}
              </span>
              <span className="text-[10px] text-primary/60 uppercase tracking-widest">
                {log.industry}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-warning font-mono text-sm font-medium">
                {log.chemical}
              </span>
              <span className="text-muted-foreground text-xs">({log.amount})</span>
            </div>
            <p className="text-xs text-foreground/70">{log.reason}</p>
          </div>
        ))}
      </div>

      {/* Integration Feed */}
      <div className="mt-4 pt-4 border-t border-primary/10">
        <div className="flex items-center gap-2 mb-3">
          <CircuitBoard className="w-4 h-4 text-primary/60" />
          <span className="text-xs text-muted-foreground uppercase tracking-widest">
            Integration Logic Chain
          </span>
        </div>
        <div className="flex items-center justify-between text-xs">
          <div className="flex flex-col items-center gap-1">
            <div className="w-8 h-8 rounded bg-secondary flex items-center justify-center border border-primary/20">
              <Cpu className="w-4 h-4 text-primary" />
            </div>
            <span className="text-muted-foreground">Sensor</span>
          </div>
          <ArrowRight className="w-4 h-4 text-primary/40" />
          <div className="flex flex-col items-center gap-1">
            <div className="w-8 h-8 rounded bg-secondary flex items-center justify-center border border-primary/20">
              <span className="text-primary font-mono text-[10px]">ML</span>
            </div>
            <span className="text-muted-foreground">Logic</span>
          </div>
          <ArrowRight className="w-4 h-4 text-primary/40" />
          <div className="flex flex-col items-center gap-1">
            <div className="w-8 h-8 rounded bg-secondary flex items-center justify-center border border-primary/20">
              <CircuitBoard className="w-4 h-4 text-primary" />
            </div>
            <span className="text-muted-foreground">GPIO</span>
          </div>
          <ArrowRight className="w-4 h-4 text-primary/40" />
          <div className="flex flex-col items-center gap-1">
            <div className="w-8 h-8 rounded bg-secondary flex items-center justify-center border border-warning/30">
              <Zap className="w-4 h-4 text-warning" />
            </div>
            <span className="text-muted-foreground">Actuate</span>
          </div>
        </div>
      </div>
    </div>
  );
}
