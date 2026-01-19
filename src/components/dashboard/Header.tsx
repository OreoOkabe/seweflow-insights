import { Activity, Bell, Download, Eye, EyeOff, Settings } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface HeaderProps {
  onOpenNotifications: () => void;
  onToggleAdvanced: () => void;
  onDownloadStats: () => void;
  notificationCount: number;
  systemStatus: "online" | "degraded" | "offline";
  showAdvanced: boolean;
  className?: string;
}

export function Header({
  onOpenNotifications,
  onToggleAdvanced,
  onDownloadStats,
  notificationCount,
  systemStatus,
  showAdvanced,
  className,
}: HeaderProps) {
  const statusConfig = {
    online: { label: "Online", dotClass: "status-dot-healthy", textClass: "text-success" },
    degraded: { label: "Degraded", dotClass: "status-dot-warning", textClass: "text-warning" },
    offline: { label: "Offline", dotClass: "status-dot-danger", textClass: "text-destructive" },
  };

  const status = statusConfig[systemStatus];

  return (
    <header
      className={cn(
        "flex items-center justify-between px-6 py-4 border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-40",
        className
      )}
    >
      {/* Logo & Title */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
            <Activity className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h1 className="text-lg font-semibold text-foreground">
              S.A.L.A.I.N.
            </h1>
            <p className="text-xs text-muted-foreground">
              Smart Sewer Monitoring
            </p>
          </div>
        </div>
      </div>

      {/* Center - System Status */}
      <div className="hidden md:flex items-center gap-3 px-4 py-2 rounded-lg bg-secondary/50">
        <div className={cn("status-dot", status.dotClass)} />
        <span className={cn("text-sm font-medium", status.textClass)}>
          {status.label}
        </span>
        <span className="text-muted-foreground">•</span>
        <span className="text-sm text-muted-foreground font-mono">
          {new Date().toLocaleTimeString("en-US", { hour12: false })}
        </span>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={onToggleAdvanced}
          className="gap-2"
        >
          {showAdvanced ? (
            <>
              <EyeOff className="w-4 h-4" />
              <span className="hidden sm:inline">Simple</span>
            </>
          ) : (
            <>
              <Eye className="w-4 h-4" />
              <span className="hidden sm:inline">Advanced</span>
            </>
          )}
        </Button>

        <Button
          variant="ghost"
          size="sm"
          onClick={onDownloadStats}
          className="gap-2"
        >
          <Download className="w-4 h-4" />
          <span className="hidden sm:inline">Export</span>
        </Button>

        <Button
          variant="ghost"
          size="icon"
          onClick={onOpenNotifications}
          className="relative"
        >
          <Bell className="w-5 h-5" />
          {notificationCount > 0 && (
            <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-destructive text-destructive-foreground text-[10px] font-bold flex items-center justify-center">
              {notificationCount > 9 ? "9+" : notificationCount}
            </span>
          )}
        </Button>

        <Button variant="ghost" size="icon">
          <Settings className="w-5 h-5" />
        </Button>
      </div>
    </header>
  );
}
