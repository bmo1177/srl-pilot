import { Card } from "@/components/ui/card";
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
} from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";

interface SkillRadarChartProps {
  metrics: {
    technical_skills: number;
    collaboration: number;
    adaptability: number;
    consistency: number;
    problem_solving: number;
  };
}

export const SkillRadarChart = ({ metrics }: SkillRadarChartProps) => {
  const data = [
    { skill: "Technical", value: metrics.technical_skills || 0 },
    { skill: "Collaboration", value: metrics.collaboration || 0 },
    { skill: "Adaptability", value: metrics.adaptability || 0 },
    { skill: "Consistency", value: metrics.consistency || 0 },
    { skill: "Problem Solving", value: metrics.problem_solving || 0 },
  ];

  const chartConfig = {
    value: {
      label: "Score",
      color: "hsl(var(--primary))",
    },
  };

  return (
    <Card className="glass-strong p-6 border border-primary/20">
      <h3 className="text-xl font-bold mb-4 gradient-text">Skill Distribution</h3>
      <ChartContainer config={chartConfig} className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart data={data}>
            <PolarGrid stroke="hsl(var(--border))" />
            <PolarAngleAxis
              dataKey="skill"
              tick={{ fill: "hsl(var(--foreground))", fontSize: 12 }}
            />
            <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fontSize: 10 }} />
            <Radar
              name="Skills"
              dataKey="value"
              stroke="hsl(var(--primary))"
              fill="hsl(var(--primary))"
              fillOpacity={0.3}
            />
            <ChartTooltip content={<ChartTooltipContent />} />
          </RadarChart>
        </ResponsiveContainer>
      </ChartContainer>
    </Card>
  );
};
