import { X, Code2 } from "lucide-react";
import { cn } from "@/lib/utils";

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
          "relative w-full max-w-2xl max-h-[80vh] glow-card p-6 m-4 overflow-hidden animate-fade-in",
          className
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Code2 className="w-5 h-5 text-primary" />
            <h2 className="font-semibold text-foreground">Raw Telemetry Data</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-secondary rounded transition-colors"
          >
            <X className="w-4 h-4 text-muted-foreground" />
          </button>
        </div>

        {/* JSON Display */}
        <div className="bg-background rounded border border-primary/10 p-4 overflow-auto max-h-[60vh]">
          <pre className="font-mono text-xs text-primary/90 whitespace-pre-wrap">
            {JSON.stringify(data, null, 2)}
          </pre>
        </div>

        <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
          <span className="font-mono">Source: RPi/Arduino Telemetry Stream</span>
          <span className="font-mono">Updated: {new Date().toISOString()}</span>
        </div>
      </div>
    </div>
  );
}
