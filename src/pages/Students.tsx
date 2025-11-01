import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Users, Plus, Download, Trash2, RefreshCw } from "lucide-react";
import { StudentCard } from "@/components/dashboard/StudentCard";
import { StudentFormDialog } from "@/components/students/StudentFormDialog";
import { toast } from "sonner";
import {
  detectAndRemoveDuplicates,
  exportStudentsJSON,
  exportStudentsCSV,
} from "@/utils/duplicateDetection";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface Student {
  id: string;
  name: string;
  status: string;
  email: string;
  email_personal: string | null;
  created_at: string;
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
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [cleanupDialogOpen, setCleanupDialogOpen] = useState(false);
  const [cleaningUp, setCleaningUp] = useState(false);

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
        .eq("archived", false)
        .order("name");

      if (error) throw error;
      
      // Map database columns to our interface and deduplicate by name (keep earliest created_at)
      const mappedData = (data || []).map(s => ({
        id: s.id,
        name: s.name,
        status: s.status,
        email: s.email || '',
        email_personal: s.email_personal,
        created_at: s.created_at,
        team_members: s.team_members
      }));

      const uniqueStudents = mappedData.reduce((acc, student) => {
        const normalizedName = student.name.toLowerCase().trim();
        const existing = acc.find(s => s.name.toLowerCase().trim() === normalizedName);
        
        if (!existing) {
          acc.push(student);
        } else if (new Date(student.created_at) < new Date(existing.created_at)) {
          // Replace with earlier student
          const index = acc.indexOf(existing);
          acc[index] = student;
        }
        
        return acc;
      }, [] as Student[]);
      
      setStudents(uniqueStudents);
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

  const handleAddStudent = () => {
    setSelectedStudent(null);
    setDialogOpen(true);
  };

  const handleCleanupDuplicates = async () => {
    setCleaningUp(true);
    try {
      const result = await detectAndRemoveDuplicates();
      if (result.duplicatesRemoved > 0) {
        toast.success(`Removed ${result.duplicatesRemoved} duplicate student(s)`);
        fetchStudents();
      } else {
        toast.info("No duplicates found");
      }
    } catch (error) {
      console.error("Error cleaning duplicates:", error);
      toast.error("Failed to clean duplicates");
    } finally {
      setCleaningUp(false);
      setCleanupDialogOpen(false);
    }
  };

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

        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search students..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 glass"
            />
          </div>
          
          <div className="flex gap-2 flex-wrap">
            <Button onClick={handleAddStudent} className="gap-2">
              <Plus className="h-4 w-4" />
              Add Student
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="gap-2">
                  <Download className="h-4 w-4" />
                  Export
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={exportStudentsJSON}>
                  Export as JSON
                </DropdownMenuItem>
                <DropdownMenuItem onClick={exportStudentsCSV}>
                  Export as CSV
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Button
              variant="outline"
              onClick={() => setCleanupDialogOpen(true)}
              className="gap-2"
            >
              <Trash2 className="h-4 w-4" />
              Clean Duplicates
            </Button>

            <Button
              variant="ghost"
              size="icon"
              onClick={fetchStudents}
              title="Refresh"
            >
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="text-sm text-muted-foreground">
          {filteredStudents.length} student{filteredStudents.length !== 1 ? "s" : ""}
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

      <StudentFormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        student={selectedStudent ? {
          id: selectedStudent.id,
          name: selectedStudent.name,
          email: selectedStudent.email,
          email_personal: selectedStudent.email_personal,
          status: selectedStudent.status
        } : null}
        onSuccess={fetchStudents}
      />

      <AlertDialog open={cleanupDialogOpen} onOpenChange={setCleanupDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove Duplicate Students?</AlertDialogTitle>
            <AlertDialogDescription>
              This will detect students with identical names or emails and remove duplicates, keeping
              only the oldest record. All relationships (teams, metrics, reflections) will be
              preserved and linked to the remaining student. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={cleaningUp}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleCleanupDuplicates} disabled={cleaningUp}>
              {cleaningUp ? "Cleaning..." : "Clean Duplicates"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Students;
