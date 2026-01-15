import { Activity, Bell, Code2, Settings } from "lucide-react";
import { cn } from "@/lib/utils";

interface HeaderProps {
  onOpenNotifications: () => void;
  onOpenTelemetry: () => void;
  notificationCount: number;
  systemStatus: "online" | "degraded" | "offline";
  className?: string;
}

export function Header({
  onOpenNotifications,
  onOpenTelemetry,
  notificationCount,
  systemStatus,
  className,
}: HeaderProps) {
  const statusConfig = {
    online: { label: "SYSTEM ONLINE", dotClass: "status-dot-healthy", textClass: "text-primary" },
    degraded: { label: "DEGRADED", dotClass: "status-dot-warning", textClass: "text-warning" },
    offline: { label: "OFFLINE", dotClass: "status-dot-danger", textClass: "text-destructive" },
  };

  const status = statusConfig[systemStatus];

  return (
    <header
      className={cn(
        "flex items-center justify-between px-6 py-4 border-b border-primary/10 bg-card/50",
        className
      )}
    >
      {/* Logo & Title */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded bg-primary/10 border border-primary/30 flex items-center justify-center">
            <Activity className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-foreground tracking-wide">
              S.A.L.A.I.N.
            </h1>
            <p className="text-[10px] text-muted-foreground uppercase tracking-[0.2em]">
              Smart AI-Powered Layered Analysis & Integration
            </p>
          </div>
        </div>
      </div>

      {/* Center - System Status */}
      <div className="flex items-center gap-3 px-4 py-2 rounded bg-secondary/30 border border-primary/10">
        <div className={cn("status-dot", status.dotClass)} />
        <span className={cn("font-mono text-xs tracking-wider", status.textClass)}>
          {status.label}
        </span>
        <span className="text-muted-foreground text-xs font-mono">|</span>
        <span className="text-muted-foreground text-xs font-mono">
          {new Date().toLocaleTimeString("en-US", { hour12: false })}
        </span>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2">
        <button
          onClick={onOpenTelemetry}
          className="p-2 rounded hover:bg-secondary transition-colors group"
          title="View Raw Telemetry"
        >
          <Code2 className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
        </button>

        <button
          onClick={onOpenNotifications}
          className="relative p-2 rounded hover:bg-secondary transition-colors group"
          title="Notifications"
        >
          <Bell className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
          {notificationCount > 0 && (
            <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-destructive text-destructive-foreground text-[10px] font-bold flex items-center justify-center">
              {notificationCount > 9 ? "9+" : notificationCount}
            </span>
          )}
        </button>

        <button
          className="p-2 rounded hover:bg-secondary transition-colors group"
          title="Settings"
        >
          <Settings className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
        </button>
      </div>
    </header>
  );
}
