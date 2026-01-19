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
  showAdvanced?: boolean;
  className?: string;
}

export function DosingLogs({ logs, showAdvanced = false, className }: DosingLogsProps) {
  return (
    <div className={cn("modern-card p-5", className)}>
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center">
          <Beaker className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h3 className="text-sm font-medium text-foreground">Chemical Dosing</h3>
          <p className="text-xs text-muted-foreground">Recent injections</p>
        </div>
      </div>

      <div className="space-y-3 max-h-48 overflow-y-auto">
        {logs.slice(0, showAdvanced ? logs.length : 2).map((log) => (
          <div
            key={log.id}
            className="p-3 rounded-lg bg-secondary/50 space-y-1"
          >
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-warning">
                {log.chemical}
              </span>
              <span className="text-xs text-muted-foreground font-mono">
                {log.timestamp}
              </span>
            </div>
            {showAdvanced && (
              <>
                <p className="text-xs text-muted-foreground">{log.reason}</p>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-foreground">{log.amount}</span>
                  <span className="text-primary/60">{log.industry}</span>
                </div>
              </>
            )}
          </div>
        ))}
      </div>

      {/* Integration Feed - Only in advanced mode */}
      {showAdvanced && (
        <div className="mt-4 pt-4 border-t border-border">
          <span className="text-xs text-muted-foreground mb-3 block">
            Integration Chain
          </span>
          <div className="flex items-center justify-between">
            {[
              { icon: Cpu, label: "Sensor" },
              { icon: () => <span className="text-xs font-mono">ML</span>, label: "Logic" },
              { icon: CircuitBoard, label: "GPIO" },
              { icon: Zap, label: "Actuate" },
            ].map((item, index) => (
              <div key={item.label} className="flex items-center gap-2">
                <div className="flex flex-col items-center gap-1">
                  <div className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center">
                    <item.icon className="w-4 h-4 text-primary" />
                  </div>
                  <span className="text-[10px] text-muted-foreground">{item.label}</span>
                </div>
                {index < 3 && <ArrowRight className="w-3 h-3 text-muted-foreground" />}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
