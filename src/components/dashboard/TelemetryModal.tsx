import { X, Code2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface TelemetryModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: object;
  className?: string;
}

export function TelemetryModal({ isOpen, onClose, data, className }: TelemetryModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-background/80 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div
        className={cn(
          "relative w-full max-w-2xl max-h-[80vh] modern-card p-6 m-4 overflow-hidden animate-fade-in",
          className
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center">
              <Code2 className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h2 className="font-semibold text-foreground">Raw Telemetry</h2>
              <p className="text-xs text-muted-foreground">JSON data stream</p>
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>

        {/* JSON Display */}
        <div className="bg-secondary/50 rounded-lg p-4 overflow-auto max-h-[60vh]">
          <pre className="font-mono text-xs text-foreground/90 whitespace-pre-wrap">
            {JSON.stringify(data, null, 2)}
          </pre>
        </div>

        <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
          <span>Source: RPi/Arduino Stream</span>
          <span className="font-mono">{new Date().toISOString()}</span>
        </div>
      </div>
    </div>
  );
}
