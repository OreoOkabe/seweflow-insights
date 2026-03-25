import { Brain, AlertTriangle, TrendingUp, Clock, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";

interface AIInsightsProps {
  classification: string;
  confidence: number;
  alertMessage?: string;
  showAdvanced?: boolean;
  className?: string;
  predictions?: {
    ph: number;
    tds: number;
    turbidity: number;
  };
}

const classificationColors: Record<string, { bg: string; text: string }> = {
  "Optimal Flow": { bg: "bg-success/10", text: "text-success" },
  "Safe - Non-Potable": { bg: "bg-success/10", text: "text-success" },
  "Low-Level Contamination": { bg: "bg-warning/10", text: "text-warning" },
  "High-Acidity Waste": { bg: "bg-warning/10", text: "text-warning" },
  "Critical Blockage": { bg: "bg-destructive/10", text: "text-destructive" },
};

const classificationDescriptions: Record<string, string> = {
  "Safe - Non-Potable": "Water is safe for cleaning, irrigation, and industrial reuse. Not suitable for drinking.",
  "Optimal Flow": "System operating at peak efficiency with clear flow and stable parameters.",
  "Low-Level Contamination": "Minor contaminants detected. Auto-dosing activated to correct levels.",
  "High-Acidity Waste": "Acidic conditions detected. Chemical neutralization in progress.",
  "Critical Blockage": "Flow obstruction detected. Immediate maintenance required.",
};

export function AIInsights({
  classification,
  confidence,
  alertMessage,
  showAdvanced = false,
  predictions,
  className,
}: AIInsightsProps) {
  const colors = classificationColors[classification] || { bg: "bg-success/10", text: "text-success" };
  const description = classificationDescriptions[classification] || "Analyzing water quality parameters...";

  return (
    <div className={cn("modern-card p-5", className)}>
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center">
          <Brain className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h3 className="text-sm font-medium text-foreground">AI Analysis</h3>
          <p className="text-xs text-muted-foreground">GBM Classification + LSTM Forecasting</p>
        </div>
      </div>

      {alertMessage && (
        <div className="flex items-center gap-2 mb-4 p-3 rounded-lg bg-warning/10 border border-warning/20">
          <AlertTriangle className="w-4 h-4 text-warning flex-shrink-0" />
          <span className="text-sm text-warning">{alertMessage}</span>
        </div>
      )}

      <div className="space-y-4">
        {/* Current State */}
        <div>
          <span className="text-xs text-muted-foreground">Current State</span>
          <div className="flex items-center gap-2 mt-1">
            <div className={cn("inline-block px-3 py-1.5 rounded-lg font-medium", colors.bg, colors.text)}>
              {classification}
            </div>
            {classification === "Safe - Non-Potable" && (
              <ShieldCheck className="w-4 h-4 text-success" />
            )}
          </div>
          <p className="text-xs text-muted-foreground mt-2 leading-relaxed">{description}</p>
        </div>

        {/* Confidence */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-muted-foreground">Model Confidence</span>
            <span className="text-sm font-mono text-foreground">{confidence}%</span>
          </div>
          <div className="confidence-bar">
            <div className="confidence-fill" style={{ width: `${confidence}%` }} />
          </div>
        </div>

        {/* 10-Min Prediction */}
        {predictions && (
          <div className="p-3 rounded-lg bg-secondary/50 border border-border">
            <div className="flex items-center gap-2 mb-3">
              <Clock className="w-3.5 h-3.5 text-primary" />
              <span className="text-xs font-medium text-foreground">10-Minute Forecast (LSTM)</span>
            </div>
            <p className="text-xs text-muted-foreground mb-3">
              Predicting where water quality is heading so the system can dose proactively.
            </p>
            <div className="grid grid-cols-3 gap-2">
              <div className="text-center p-2 rounded-md bg-background/50">
                <span className="text-[10px] text-muted-foreground block">pH</span>
                <span className="text-sm font-mono text-foreground">{predictions.ph.toFixed(2)}</span>
                <TrendingUp className="w-3 h-3 text-success mx-auto mt-1" />
              </div>
              <div className="text-center p-2 rounded-md bg-background/50">
                <span className="text-[10px] text-muted-foreground block">TDS</span>
                <span className="text-sm font-mono text-foreground">{predictions.tds}</span>
                <TrendingUp className="w-3 h-3 text-success mx-auto mt-1" />
              </div>
              <div className="text-center p-2 rounded-md bg-background/50">
                <span className="text-[10px] text-muted-foreground block">Turb.</span>
                <span className="text-sm font-mono text-foreground">{predictions.turbidity.toFixed(2)}</span>
                <TrendingUp className="w-3 h-3 text-success mx-auto mt-1" />
              </div>
            </div>
          </div>
        )}

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
