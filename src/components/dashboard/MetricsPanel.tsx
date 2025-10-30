import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Code, Users, Zap, Target, Lightbulb } from "lucide-react";

interface MetricsPanelProps {
  metrics: {
    technical_skills: number;
    collaboration: number;
    adaptability: number;
    consistency: number;
    problem_solving: number;
  };
}

const metricConfig = [
  {
    key: "technical_skills",
    label: "Technical Skills",
    icon: Code,
    color: "text-primary",
    bgColor: "bg-primary/10",
  },
  {
    key: "collaboration",
    label: "Collaboration",
    icon: Users,
    color: "text-secondary",
    bgColor: "bg-secondary/10",
  },
  {
    key: "adaptability",
    label: "Adaptability",
    icon: Zap,
    color: "text-accent",
    bgColor: "bg-accent/10",
  },
  {
    key: "consistency",
    label: "Consistency",
    icon: Target,
    color: "text-primary",
    bgColor: "bg-primary/10",
  },
  {
    key: "problem_solving",
    label: "Problem Solving",
    icon: Lightbulb,
    color: "text-secondary",
    bgColor: "bg-secondary/10",
  },
];

export const MetricsPanel = ({ metrics }: MetricsPanelProps) => {
  return (
    <Card className="glass-strong p-6 border border-primary/20">
      <h3 className="text-xl font-bold mb-6 gradient-text">Skill Metrics</h3>
      <div className="space-y-4">
        {metricConfig.map((config) => {
          const Icon = config.icon;
          const value = metrics[config.key as keyof typeof metrics] || 0;

          return (
            <div key={config.key} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${config.bgColor}`}>
                    <Icon className={`h-4 w-4 ${config.color}`} />
                  </div>
                  <span className="font-medium text-sm">{config.label}</span>
                </div>
                <span className="font-bold text-sm">{value}/100</span>
              </div>
              <Progress value={value} className="h-2" />
            </div>
          );
        })}
      </div>
    </Card>
  );
};
