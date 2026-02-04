import { Brain, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

interface AIInsightsProps {
  classification: string;
  confidence: number;
  alertMessage?: string;
  showAdvanced?: boolean;
  className?: string;
}

const classificationColors: Record<string, { bg: string; text: string }> = {
  "Optimal Flow": { bg: "bg-success/10", text: "text-success" },
  "Safe - Non-Potable": { bg: "bg-success/10", text: "text-success" },
  "Low-Level Contamination": { bg: "bg-warning/10", text: "text-warning" },
  "High-Acidity Waste": { bg: "bg-warning/10", text: "text-warning" },
  "Critical Blockage": { bg: "bg-destructive/10", text: "text-destructive" },
};

export function AIInsights({
  classification,
  confidence,
  alertMessage,
  showAdvanced = false,
  className,
}: AIInsightsProps) {
  const colors = classificationColors[classification] || { bg: "bg-success/10", text: "text-success" };

  return (
    <div className={cn("modern-card p-5", className)}>
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center">
          <Brain className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h3 className="text-sm font-medium text-foreground">AI Analysis</h3>
          <p className="text-xs text-muted-foreground">GBM Classification</p>
        </div>
      </div>

      {alertMessage && (
        <div className="flex items-center gap-2 mb-4 p-3 rounded-lg bg-warning/10 border border-warning/20">
          <AlertTriangle className="w-4 h-4 text-warning flex-shrink-0" />
          <span className="text-sm text-warning">{alertMessage}</span>
        </div>
      )}

      <div className="space-y-4">
        <div>
          <span className="text-xs text-muted-foreground">Current State</span>
          <div className={cn("inline-block mt-1 px-3 py-1.5 rounded-lg font-medium", colors.bg, colors.text)}>
            {classification}
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-muted-foreground">Confidence</span>
            <span className="text-sm font-mono text-foreground">{confidence}%</span>
          </div>
          <div className="confidence-bar">
            <div className="confidence-fill" style={{ width: `${confidence}%` }} />
          </div>
        </div>

        {showAdvanced && (
          <div className="grid grid-cols-2 gap-2 pt-2">
            {["Safe - Non-Potable", "Optimal Flow", "Low-Level Contamination", "Critical Blockage"].map(
              (state) => {
                const stateColors = classificationColors[state];
                return (
                  <div
                    key={state}
                    className={cn(
                      "text-xs text-center py-2 px-2 rounded-lg border transition-all",
                      classification === state
                        ? `${stateColors.bg} ${stateColors.text} border-current`
                        : "border-border text-muted-foreground"
                    )}
                  >
                    {state}
                  </div>
                );
              }
            )}
          </div>
        )}
      </div>
    </div>
  );
}
