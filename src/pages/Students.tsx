import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Users } from "lucide-react";
import { StudentCard } from "@/components/dashboard/StudentCard";

interface Student {
  id: string;
  name: string;
  status: string;
  university_email: string;
  team_members?: Array<{
    team: {
      name: string;
    };
  }>;
}

interface Metrics {
  student_id: string;
  technical_skills: number;
  collaboration: number;
  adaptability: number;
  consistency: number;
  problem_solving: number;
  srl_score: number;
}

const Students = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [metrics, setMetrics] = useState<Record<string, Metrics>>({});
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStudents();
    fetchMetrics();
  }, []);

  const fetchStudents = async () => {
    try {
      const { data, error } = await supabase
        .from("students")
        .select(
          `
          *,
          team_members(
            team:teams(name)
          )
        `
        )
        .order("name");

      if (error) throw error;
      setStudents(data || []);
    } catch (error) {
      console.error("Error fetching students:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMetrics = async () => {
    try {
      const { data, error } = await supabase.from("student_metrics").select("*");

      if (error) throw error;

      const metricsMap: Record<string, Metrics> = {};
      data?.forEach((m) => {
        metricsMap[m.student_id] = m;
      });
      setMetrics(metricsMap);
    } catch (error) {
      console.error("Error fetching metrics:", error);
    }
  };

  const filteredStudents = students.filter((student) =>
    student.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen pb-12">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 rounded-lg bg-gradient-to-br from-primary/20 to-secondary/20">
            <Users className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-bold gradient-text">Student Dashboard</h1>
            <p className="text-muted-foreground">
              Track SRL metrics, skills, and progress for all students
            </p>
          </div>
        </div>

        <div className="flex gap-4 items-center">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search students..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 glass"
            />
          </div>
          <div className="text-sm text-muted-foreground">
            {filteredStudents.length} student{filteredStudents.length !== 1 ? "s" : ""}
          </div>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12 text-muted-foreground">Loading students...</div>
      ) : filteredStudents.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground mb-4">No students found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredStudents.map((student) => (
            <StudentCard
              key={student.id}
              student={{
                ...student,
                team: student.team_members?.[0]?.team,
                metrics: metrics[student.id],
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Students;
