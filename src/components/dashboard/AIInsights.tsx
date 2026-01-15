import { Brain, TrendingUp, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";
import { Area, AreaChart, ResponsiveContainer, XAxis, YAxis, ReferenceLine } from "recharts";

interface AIInsightsProps {
  classification: string;
  confidence: number;
  prediction: {
    time: string;
    waterLevel: number;
    ph: number;
  }[];
  alertMessage?: string;
  className?: string;
}

const classificationColors: Record<string, string> = {
  "Optimal Flow": "text-primary text-glow-cyan",
  "Low-Level Contamination": "text-warning text-glow-gold",
  "High-Acidity Waste": "text-warning text-glow-gold",
  "Critical Blockage": "text-destructive text-glow-crimson",
};

export function AIInsights({
  classification,
  confidence,
  prediction,
  alertMessage,
  className,
}: AIInsightsProps) {
  const classificationColor = classificationColors[classification] || "text-primary";

  return (
    <div className={cn("grid grid-cols-1 lg:grid-cols-2 gap-4", className)}>
      {/* GBM Classifier */}
      <div className="glow-card p-5">
        <div className="flex items-center gap-2 mb-4">
          <Brain className="w-5 h-5 text-primary" />
          <h3 className="text-sm font-semibold uppercase tracking-wider text-foreground/80">
            GBM Classifier — Immediate State
          </h3>
        </div>

        <div className="space-y-4">
          <div>
            <span className="text-xs text-muted-foreground uppercase tracking-widest">
              Current Classification
            </span>
            <p className={cn("font-mono-data text-2xl font-bold mt-1", classificationColor)}>
              {classification}
            </p>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-muted-foreground uppercase tracking-widest">
                Confidence Meter
              </span>
              <span className="font-mono text-sm text-primary">{confidence}%</span>
            </div>
            <div className="confidence-bar">
              <div
                className="confidence-fill"
                style={{ width: `${confidence}%` }}
              />
            </div>
          </div>

          <div className="grid grid-cols-4 gap-2 pt-2">
            {["Optimal Flow", "Low-Level Contamination", "High-Acidity Waste", "Critical Blockage"].map(
              (state) => (
                <div
                  key={state}
                  className={cn(
                    "text-[10px] text-center py-1.5 px-1 rounded border transition-all",
                    classification === state
                      ? "border-primary/50 bg-primary/10 text-primary"
                      : "border-primary/10 text-muted-foreground"
                  )}
                >
                  {state.split(" ").map((word, i) => (
                    <div key={i}>{word}</div>
                  ))}
                </div>
              )
            )}
          </div>
        </div>
      </div>

      {/* LSTM Trend Prediction */}
      <div className="glow-card p-5">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="w-5 h-5 text-primary" />
          <h3 className="text-sm font-semibold uppercase tracking-wider text-foreground/80">
            LSTM Trend — Predictive Notification
          </h3>
        </div>

        {alertMessage && (
          <div className="notification-toast-warning flex items-center gap-2 mb-4 px-3 py-2 rounded border border-warning/30 bg-warning/5">
            <AlertTriangle className="w-4 h-4 text-warning flex-shrink-0" />
            <span className="text-xs text-warning font-mono">{alertMessage}</span>
          </div>
        )}

        <div className="h-32">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={prediction} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="predictionGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#00FFFF" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="#00FFFF" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis
                dataKey="time"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#666", fontSize: 10 }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#666", fontSize: 10 }}
              />
              <ReferenceLine
                y={85}
                stroke="#FF0000"
                strokeDasharray="3 3"
                strokeOpacity={0.5}
              />
              <Area
                type="monotone"
                dataKey="waterLevel"
                stroke="#00FFFF"
                strokeWidth={2}
                fill="url(#predictionGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="flex items-center justify-between mt-2 text-xs text-muted-foreground">
          <span className="font-mono">T-0</span>
          <span className="uppercase tracking-widest">Time Horizon: 10 min</span>
          <span className="font-mono">T+10</span>
        </div>
      </div>
    </div>
  );
}
