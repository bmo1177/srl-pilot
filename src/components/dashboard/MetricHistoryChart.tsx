import { Card } from "@/components/ui/card";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { format } from "date-fns";

interface MetricHistoryChartProps {
  history: Array<{
    recorded_at: string;
    srl_score: number;
    technical_skills: number;
    collaboration: number;
  }>;
}

export const MetricHistoryChart = ({ history }: MetricHistoryChartProps) => {
  const data = history
    .map((h) => ({
      date: format(new Date(h.recorded_at), "MMM dd"),
      srl: h.srl_score || 0,
      technical: h.technical_skills || 0,
      collaboration: h.collaboration || 0,
    }))
    .slice(-10);

  const chartConfig = {
    srl: {
      label: "SRL Score",
      color: "hsl(var(--primary))",
    },
    technical: {
      label: "Technical",
      color: "hsl(var(--secondary))",
    },
    collaboration: {
      label: "Collaboration",
      color: "hsl(var(--accent))",
    },
  };

  if (data.length === 0) {
    return (
      <Card className="glass-strong p-6 border border-primary/20">
        <h3 className="text-xl font-bold mb-4 gradient-text">Progress Over Time</h3>
        <div className="h-[250px] flex items-center justify-center text-muted-foreground">
          No historical data available yet
        </div>
      </Card>
    );
  }

  return (
    <Card className="glass-strong p-6 border border-primary/20">
      <h3 className="text-xl font-bold mb-4 gradient-text">Progress Over Time</h3>
      <ChartContainer config={chartConfig} className="h-[250px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="date" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }} />
            <YAxis domain={[0, 100]} tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }} />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Legend wrapperStyle={{ fontSize: "12px" }} />
            <Line
              type="monotone"
              dataKey="srl"
              stroke="hsl(var(--primary))"
              strokeWidth={2}
              dot={{ r: 4 }}
              name="SRL"
            />
            <Line
              type="monotone"
              dataKey="technical"
              stroke="hsl(var(--secondary))"
              strokeWidth={2}
              dot={{ r: 4 }}
              name="Technical"
            />
            <Line
              type="monotone"
              dataKey="collaboration"
              stroke="hsl(var(--accent))"
              strokeWidth={2}
              dot={{ r: 4 }}
              name="Collab"
            />
          </LineChart>
        </ResponsiveContainer>
      </ChartContainer>
    </Card>
  );
};
