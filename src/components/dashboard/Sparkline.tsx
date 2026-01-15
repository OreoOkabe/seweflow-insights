import { Area, AreaChart, ResponsiveContainer } from "recharts";
import { cn } from "@/lib/utils";

interface SparklineProps {
  data: number[];
  status?: "healthy" | "warning" | "danger";
  className?: string;
}

export function Sparkline({ data, status = "healthy", className }: SparklineProps) {
  const chartData = data.map((value, index) => ({ value, index }));

  const colorMap = {
    healthy: {
      stroke: "#00FFFF",
      fill: "url(#sparklineGradientCyan)",
    },
    warning: {
      stroke: "#FFD700",
      fill: "url(#sparklineGradientGold)",
    },
    danger: {
      stroke: "#FF0000",
      fill: "url(#sparklineGradientRed)",
    },
  };

  const colors = colorMap[status];

  return (
    <div className={cn("h-12 w-full", className)}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={chartData} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="sparklineGradientCyan" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#00FFFF" stopOpacity={0.3} />
              <stop offset="100%" stopColor="#00FFFF" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="sparklineGradientGold" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#FFD700" stopOpacity={0.3} />
              <stop offset="100%" stopColor="#FFD700" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="sparklineGradientRed" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#FF0000" stopOpacity={0.3} />
              <stop offset="100%" stopColor="#FF0000" stopOpacity={0} />
            </linearGradient>
          </defs>
          <Area
            type="monotone"
            dataKey="value"
            stroke={colors.stroke}
            strokeWidth={1.5}
            fill={colors.fill}
            isAnimationActive={false}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
