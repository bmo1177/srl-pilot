import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Users, TrendingUp } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface StudentCardProps {
  student: {
    id: string;
    name: string;
    status: string;
    team?: {
      name: string;
    };
    metrics?: {
      srl_score: number;
      technical_skills: number;
      collaboration: number;
      adaptability: number;
      consistency: number;
      problem_solving: number;
    };
  };
}

export const StudentCard = ({ student }: StudentCardProps) => {
  const navigate = useNavigate();
  const initials = student.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const srlScore = student.metrics?.srl_score || 0;
  const avgScore = student.metrics
    ? Math.round(
        (student.metrics.technical_skills +
          student.metrics.collaboration +
          student.metrics.adaptability +
          student.metrics.consistency +
          student.metrics.problem_solving) /
          5
      )
    : 0;

  return (
    <Card
      onClick={() => navigate(`/students/${student.id}`)}
      className="glass-strong p-6 hover:shadow-xl transition-all border-primary/20 hover:border-primary/40 hover:scale-[1.02] cursor-pointer"
    >
      <div className="flex items-start gap-4">
        <Avatar className="h-16 w-16 border-2 border-primary/20">
          <AvatarFallback className="bg-gradient-to-br from-primary/20 to-secondary/20 text-lg font-bold">
            {initials}
          </AvatarFallback>
        </Avatar>

        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-bold mb-1 truncate">{student.name}</h3>
          <div className="flex flex-wrap gap-2 mb-3">
            <Badge
              variant={
                student.status === "free"
                  ? "default"
                  : student.status === "busy"
                  ? "secondary"
                  : "outline"
              }
              className="text-xs"
            >
              {student.status}
            </Badge>
            {student.team && (
              <Badge variant="outline" className="text-xs">
                <Users className="h-3 w-3 mr-1" />
                {student.team.name}
              </Badge>
            )}
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">SRL Score</span>
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-secondary" />
                <span className="font-bold text-primary">{srlScore}/100</span>
              </div>
            </div>
            <Progress value={srlScore} className="h-2" />

            <div className="flex items-center justify-between text-xs text-muted-foreground mt-2">
              <span>Avg Skills</span>
              <span className="font-medium">{avgScore}/100</span>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};
