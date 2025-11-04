import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, Users, Download, TrendingUp } from "lucide-react";
import { toast } from "sonner";
import { MetricsPanel } from "@/components/dashboard/MetricsPanel";
import { SkillRadarChart } from "@/components/dashboard/SkillRadarChart";
import { MetricHistoryChart } from "@/components/dashboard/MetricHistoryChart";
import { ReflectionTimeline } from "@/components/dashboard/ReflectionTimeline";
import { ActionPlanManager } from "@/components/dashboard/ActionPlanManager";
import { MetricsEditor } from "@/components/dashboard/MetricsEditor";

interface Student {
  id: string;
  name: string;
  status: string;
  university_email: string;
  personal_email: string | null;
  team_members?: Array<{
    team: {
      id: string;
      name: string;
    };
    role: string | null;
  }>;
}

interface Metrics {
  technical_skills: number;
  collaboration: number;
  adaptability: number;
  consistency: number;
  problem_solving: number;
  srl_score: number;
}

const StudentDashboard = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [student, setStudent] = useState<Student | null>(null);
  const [metrics, setMetrics] = useState<Metrics | null>(null);
  const [history, setHistory] = useState<any[]>([]);
  const [reflections, setReflections] = useState<any[]>([]);
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStudentData();
  }, [id]);

  const fetchStudentData = async () => {
    try {
      // Fetch student basic info
      const { data: studentData, error: studentError } = await supabase
        .from("students")
        .select(
          `
          *,
          team_members(
            role,
            team:teams(id, name)
          )
        `
        )
        .eq("id", id)
        .single();

      if (studentError) throw studentError;
      // Map to our interface
      const mappedStudent: Student = {
        id: studentData.id,
        name: studentData.name,
        status: studentData.status,
        university_email: studentData.university_email || '',
        personal_email: studentData.email_personal,
        team_members: studentData.team_members
      };
      setStudent(mappedStudent);

      // Fetch metrics
      const { data: metricsData } = await supabase
        .from("student_metrics")
        .select("*")
        .eq("student_id", id)
        .single();

      setMetrics(metricsData);

      // Fetch history
      const { data: historyData } = await supabase
        .from("metric_history")
        .select("*")
        .eq("student_id", id)
        .order("recorded_at", { ascending: true });

      setHistory(historyData || []);

      // Fetch reflections
      const { data: reflectionsData } = await supabase
        .from("student_reflections")
        .select("*")
        .eq("student_id", id)
        .order("created_at", { ascending: false })
        .limit(10);

      setReflections(reflectionsData || []);

      // Fetch action plans
      const { data: tasksData } = await supabase
        .from("student_action_plans")
        .select("*")
        .eq("student_id", id)
        .order("deadline", { ascending: true });

      setTasks(tasksData || []);
    } catch (error) {
      console.error("Error fetching student data:", error);
      toast.error("Failed to load student data");
    } finally {
      setLoading(false);
    }
  };

  const handleExport = () => {
    const exportData = {
      student,
      metrics,
      history,
      reflections,
      tasks,
      exported_at: new Date().toISOString(),
    };

    const dataStr = JSON.stringify(exportData, null, 2);
    const dataUri = `data:application/json;charset=utf-8,${encodeURIComponent(dataStr)}`;
    const fileName = `student_${student?.name}_${new Date().toISOString().split("T")[0]}.json`;

    const linkElement = document.createElement("a");
    linkElement.setAttribute("href", dataUri);
    linkElement.setAttribute("download", fileName);
    linkElement.click();

    toast.success("Data exported successfully");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-muted-foreground">Loading student dashboard...</div>
      </div>
    );
  }

  if (!student) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Student Not Found</h2>
          <Button onClick={() => navigate("/students")}>Back to Students</Button>
        </div>
      </div>
    );
  }

  const initials = student.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const currentTeam = student.team_members?.[0];

  return (
    <div className="min-h-screen pb-12">
      <Button
        variant="ghost"
        onClick={() => navigate("/students")}
        className="mb-6 gap-2"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Students
      </Button>

      {/* Header Summary */}
      <Card className="glass-strong p-8 mb-8 border border-primary/20">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
          <Avatar className="h-24 w-24 border-4 border-primary/20">
            <AvatarFallback className="bg-gradient-to-br from-primary/20 to-secondary/20 text-3xl font-bold">
              {initials}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1">
            <h1 className="text-3xl font-bold mb-2 gradient-text">{student.name}</h1>
            <div className="flex flex-wrap gap-2 mb-3">
              <Badge variant={student.status === "free" ? "default" : "secondary"}>
                {student.status}
              </Badge>
              {currentTeam && (
                <Badge variant="outline" className="gap-1">
                  <Users className="h-3 w-3" />
                  {currentTeam.team.name} - {currentTeam.role || "Member"}
                </Badge>
              )}
            </div>
            <div className="text-sm text-muted-foreground space-y-1">
              <p>📧 {student.university_email}</p>
              {student.personal_email && <p>📧 {student.personal_email}</p>}
            </div>
          </div>

          <div className="flex flex-col items-end gap-4">
            <div className="text-center">
              <div className="text-4xl font-bold gradient-text mb-1">
                {metrics?.srl_score || 0}
              </div>
              <div className="text-sm text-muted-foreground flex items-center gap-1">
                <TrendingUp className="h-4 w-4" />
                SRL Score
              </div>
            </div>
            <Button onClick={handleExport} variant="outline" className="gap-2">
              <Download className="h-4 w-4" />
              Export Data
            </Button>
          </div>
        </div>
      </Card>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {metrics && <MetricsPanel metrics={metrics} />}
        {metrics && <SkillRadarChart metrics={metrics} />}
      </div>

      {/* Metrics Editor */}
      {metrics && (
        <div className="mb-6">
          <MetricsEditor 
            studentId={id!} 
            metrics={metrics} 
            onUpdate={fetchStudentData}
          />
        </div>
      )}

      {/* History Chart */}
      <div className="mb-6">
        <MetricHistoryChart history={history} />
      </div>

      {/* Bottom Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ReflectionTimeline reflections={reflections} />
        <ActionPlanManager
          studentId={student.id}
          tasks={tasks}
          onRefresh={fetchStudentData}
        />
      </div>
    </div>
  );
};

export default StudentDashboard;
