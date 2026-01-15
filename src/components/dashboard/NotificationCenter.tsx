import { Bell, Heart, AlertTriangle, Wrench, X } from "lucide-react";
import { cn } from "@/lib/utils";

type NotificationType = "heartbeat" | "threshold" | "maintenance";

interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  timestamp: string;
  read?: boolean;
}

interface NotificationCenterProps {
  notifications: Notification[];
  isOpen: boolean;
  onClose: () => void;
  className?: string;
}

const notificationIcons: Record<NotificationType, React.ReactNode> = {
  heartbeat: <Heart className="w-4 h-4" />,
  threshold: <AlertTriangle className="w-4 h-4" />,
  maintenance: <Wrench className="w-4 h-4" />,
};

const notificationStyles: Record<NotificationType, string> = {
  heartbeat: "border-primary/30 text-primary",
  threshold: "border-warning/40 text-warning",
  maintenance: "border-destructive/40 text-destructive",
};

export function NotificationCenter({
  notifications,
  isOpen,
  onClose,
  className,
}: NotificationCenterProps) {
  if (!isOpen) return null;

  return (
    <div
      className={cn(
        "fixed right-0 top-0 h-full w-80 bg-sidebar border-l border-primary/20 z-50 animate-slide-in",
        className
      )}
      style={{ boxShadow: "-10px 0 30px rgba(0, 255, 255, 0.05)" }}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-primary/10">
        <div className="flex items-center gap-2">
          <Bell className="w-5 h-5 text-primary" />
          <h2 className="font-semibold text-foreground">Notification Center</h2>
        </div>
        <button
          onClick={onClose}
          className="p-1 hover:bg-secondary rounded transition-colors"
        >
          <X className="w-4 h-4 text-muted-foreground" />
        </button>
      </div>

      {/* Notifications List */}
      <div className="p-4 space-y-3 overflow-y-auto h-[calc(100%-60px)]">
        {notifications.length === 0 ? (
          <div className="text-center text-muted-foreground text-sm py-8">
            No notifications
          </div>
        ) : (
          notifications.map((notification) => (
            <div
              key={notification.id}
              className={cn(
                "p-3 rounded bg-card border transition-all hover:border-primary/30",
                notificationStyles[notification.type],
                notification.read && "opacity-60"
              )}
            >
              <div className="flex items-start gap-3">
                <div className="mt-0.5">{notificationIcons[notification.type]}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <h4 className="text-sm font-medium text-foreground truncate">
                      {notification.title}
                    </h4>
                    <span className="text-[10px] text-muted-foreground font-mono flex-shrink-0">
                      {notification.timestamp}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                    {notification.message}
                  </p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
