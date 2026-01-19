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
      stroke: "hsl(160, 84%, 39%)",
      fill: "url(#sparklineGradientGreen)",
    },
    warning: {
      stroke: "hsl(38, 92%, 50%)",
      fill: "url(#sparklineGradientOrange)",
    },
    danger: {
      stroke: "hsl(0, 84%, 60%)",
      fill: "url(#sparklineGradientRed)",
    },
  };

  const colors = colorMap[status];

  return (
    <div className={cn("h-12 w-full", className)}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={chartData} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="sparklineGradientGreen" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="hsl(160, 84%, 39%)" stopOpacity={0.2} />
              <stop offset="100%" stopColor="hsl(160, 84%, 39%)" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="sparklineGradientOrange" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="hsl(38, 92%, 50%)" stopOpacity={0.2} />
              <stop offset="100%" stopColor="hsl(38, 92%, 50%)" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="sparklineGradientRed" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="hsl(0, 84%, 60%)" stopOpacity={0.2} />
              <stop offset="100%" stopColor="hsl(0, 84%, 60%)" stopOpacity={0} />
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
