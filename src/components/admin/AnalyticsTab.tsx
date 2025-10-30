import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, TrendingUp, Users, Target, Award } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";

interface AnalyticsData {
  totalStudents: number;
  averageSrlScore: number;
  topPerformers: Array<{ name: string; score: number }>;
  atRiskStudents: Array<{ name: string; score: number }>;
  teamComparison: Array<{ teamName: string; avgScore: number; memberCount: number }>;
}

export const AnalyticsTab = () => {
  const [analytics, setAnalytics] = useState<AnalyticsData>({
    totalStudents: 0,
    averageSrlScore: 0,
    topPerformers: [],
    atRiskStudents: [],
    teamComparison: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      // Fetch all students with metrics
      const { data: students } = await supabase
        .from("students")
        .select(
          `
          id,
          name,
          student_metrics(srl_score),
          team_members(
            team:teams(name)
          )
        `
        );

      if (!students) return;

      // Calculate statistics
      const studentsWithScores = students
        .filter((s: any) => s.student_metrics?.[0])
        .map((s: any) => ({
          name: s.name,
          score: s.student_metrics[0].srl_score,
          team: s.team_members?.[0]?.team?.name,
        }));

      const totalStudents = students.length;
      const avgScore =
        studentsWithScores.reduce((sum, s) => sum + s.score, 0) / studentsWithScores.length || 0;

      // Top performers (score >= 80)
      const topPerformers = studentsWithScores
        .filter((s) => s.score >= 80)
        .sort((a, b) => b.score - a.score)
        .slice(0, 5);

      // At-risk students (score < 50)
      const atRiskStudents = studentsWithScores
        .filter((s) => s.score < 50)
        .sort((a, b) => a.score - b.score)
        .slice(0, 5);

      // Team comparison
      const teamMap = new Map<string, { scores: number[]; count: number }>();
      studentsWithScores.forEach((s) => {
        if (s.team) {
          if (!teamMap.has(s.team)) {
            teamMap.set(s.team, { scores: [], count: 0 });
          }
          const team = teamMap.get(s.team)!;
          team.scores.push(s.score);
          team.count++;
        }
      });

      const teamComparison = Array.from(teamMap.entries()).map(([teamName, data]) => ({
        teamName,
        avgScore: data.scores.reduce((sum, s) => sum + s, 0) / data.scores.length,
        memberCount: data.count,
      }));

      setAnalytics({
        totalStudents,
        averageSrlScore: Math.round(avgScore),
        topPerformers,
        atRiskStudents,
        teamComparison: teamComparison.sort((a, b) => b.avgScore - a.avgScore),
      });
    } catch (error) {
      console.error("Error fetching analytics:", error);
      toast.error("Failed to load analytics");
    } finally {
      setLoading(false);
    }
  };

  const handleExportDataset = async () => {
    try {
      // Fetch comprehensive dataset
      const { data: students } = await supabase.from("students").select(`
          *,
          student_metrics(*),
          student_reflections(*),
          student_action_plans(*),
          team_members(
            role,
            team:teams(*)
          )
        `);

      const { data: teams } = await supabase.from("teams").select(`
          *,
          team_metrics(*),
          team_members(
            student:students(*),
            role
          )
        `);

      const dataset = {
        students,
        teams,
        exported_at: new Date().toISOString(),
        metadata: {
          total_students: analytics.totalStudents,
          avg_srl_score: analytics.averageSrlScore,
        },
      };

      const dataStr = JSON.stringify(dataset, null, 2);
      const dataUri = `data:application/json;charset=utf-8,${encodeURIComponent(dataStr)}`;
      const fileName = `srl_dataset_${new Date().toISOString().split("T")[0]}.json`;

      const linkElement = document.createElement("a");
      linkElement.setAttribute("href", dataUri);
      linkElement.setAttribute("download", fileName);
      linkElement.click();

      toast.success("Dataset exported successfully");
    } catch (error) {
      console.error("Export error:", error);
      toast.error("Failed to export dataset");
    }
  };

  if (loading) {
    return <div className="text-center py-12">Loading analytics...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold gradient-text">Research & Analytics</h2>
          <p className="text-muted-foreground">
            Aggregated SRL metrics for research and improvement
          </p>
        </div>
        <Button onClick={handleExportDataset} className="gap-2">
          <Download className="h-4 w-4" />
          Export Dataset
        </Button>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="glass-strong p-6 border border-primary/20">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-lg bg-primary/10">
              <Users className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Students</p>
              <p className="text-3xl font-bold">{analytics.totalStudents}</p>
            </div>
          </div>
        </Card>

        <Card className="glass-strong p-6 border border-secondary/20">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-lg bg-secondary/10">
              <Target className="h-6 w-6 text-secondary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Avg SRL Score</p>
              <p className="text-3xl font-bold">{analytics.averageSrlScore}</p>
            </div>
          </div>
        </Card>

        <Card className="glass-strong p-6 border border-accent/20">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-lg bg-accent/10">
              <Award className="h-6 w-6 text-accent" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Top Performers</p>
              <p className="text-3xl font-bold">{analytics.topPerformers.length}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Performers */}
        <Card className="glass-strong p-6 border border-primary/20">
          <h3 className="text-xl font-bold mb-4 gradient-text flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Top Performers (SRL ≥ 80)
          </h3>
          <div className="space-y-3">
            {analytics.topPerformers.length === 0 ? (
              <p className="text-muted-foreground text-center py-4">
                No top performers yet
              </p>
            ) : (
              analytics.topPerformers.map((student, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 glass rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <Badge className="bg-gradient-to-r from-primary to-secondary">
                      #{index + 1}
                    </Badge>
                    <span className="font-medium">{student.name}</span>
                  </div>
                  <span className="text-lg font-bold text-primary">{student.score}</span>
                </div>
              ))
            )}
          </div>
        </Card>

        {/* At-Risk Students */}
        <Card className="glass-strong p-6 border border-destructive/20">
          <h3 className="text-xl font-bold mb-4 text-destructive flex items-center gap-2">
            <Target className="h-5 w-5" />
            At-Risk Students (SRL &lt; 50)
          </h3>
          <div className="space-y-3">
            {analytics.atRiskStudents.length === 0 ? (
              <p className="text-muted-foreground text-center py-4">
                No at-risk students
              </p>
            ) : (
              analytics.atRiskStudents.map((student, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 glass rounded-lg border border-destructive/20"
                >
                  <div className="flex items-center gap-3">
                    <Badge variant="destructive">⚠</Badge>
                    <span className="font-medium">{student.name}</span>
                  </div>
                  <span className="text-lg font-bold text-destructive">{student.score}</span>
                </div>
              ))
            )}
          </div>
        </Card>
      </div>

      {/* Team Comparison */}
      <Card className="glass-strong p-6 border border-secondary/20">
        <h3 className="text-xl font-bold mb-4 gradient-text">Team Performance Comparison</h3>
        <div className="space-y-4">
          {analytics.teamComparison.length === 0 ? (
            <p className="text-muted-foreground text-center py-4">No team data available</p>
          ) : (
            analytics.teamComparison.map((team, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Badge variant="outline">{team.memberCount} members</Badge>
                    <span className="font-medium">{team.teamName}</span>
                  </div>
                  <span className="font-bold">{Math.round(team.avgScore)}/100</span>
                </div>
                <Progress value={team.avgScore} className="h-2" />
              </div>
            ))
          )}
        </div>
      </Card>
    </div>
  );
};
