import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Plus, Trash2, RefreshCw } from "lucide-react";
import { z } from "zod";

const studentSchema = z.object({
  name: z.string().trim().min(2, 'Name must be at least 2 characters').max(100, 'Name must be under 100 characters'),
  university_email: z.string().trim().toLowerCase().email('Invalid university email').max(255, 'Email too long'),
  email_personal: z.string().trim().toLowerCase().email('Invalid personal email').max(255, 'Email too long').optional().or(z.literal('')),
});

interface Student {
  id: string;
  name: string;
  university_email: string;
  email_personal?: string;
  status: string;
  created_at: string;
}

export const StudentsTab = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [newStudent, setNewStudent] = useState({ 
    name: "", 
    university_email: "", 
    email_personal: "" 
  });

  useEffect(() => {
    fetchStudents();
    
    const channel = supabase
      .channel('students-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'students' }, () => {
        fetchStudents();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchStudents = async () => {
    try {
      const { data, error } = await supabase
        .from('students')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setStudents(data || []);
    } catch (error: any) {
      toast.error("Failed to load students: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAddStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const { error } = await supabase
        .from('students')
        .insert([{
          name: newStudent.name.trim(),
          university_email: newStudent.university_email.trim().toLowerCase(),
          personal_email: newStudent.personal_email.trim() || null,
          status: 'active'
        }]);

      if (error) throw error;

      toast.success("Student added successfully");
      setNewStudent({ name: "", university_email: "", personal_email: "" });
      setShowAddDialog(false);
    } catch (error: any) {
      toast.error("Failed to add student: " + error.message);
    }
  };

  const handleDeleteStudent = async (id: string) => {
    if (!confirm("Are you sure you want to delete this student?")) return;

    try {
      const { error } = await supabase
        .from('students')
        .delete()
        .eq('id', id);

      if (error) throw error;
      toast.success("Student deleted successfully");
    } catch (error: any) {
      toast.error("Failed to delete student: " + error.message);
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "secondary" | "outline"> = {
      active: "outline",
      team_assigned: "default",
      inactive: "secondary",
      graduated: "secondary"
    };

    return <Badge variant={variants[status] || "outline"}>{status.replace('_', ' ')}</Badge>;
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <CardTitle>Students Management</CardTitle>
            <CardDescription>Add, view, and manage students</CardDescription>
          </div>
          <div className="flex gap-2 w-full sm:w-auto">
            <Button onClick={() => fetchStudents()} variant="outline" size="sm" className="flex-1 sm:flex-initial">
              <RefreshCw className="h-4 w-4 sm:mr-2" />
              <span className="hidden sm:inline">Refresh</span>
            </Button>
            <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
              <DialogTrigger asChild>
                <Button className="gap-2 flex-1 sm:flex-initial">
                  <Plus className="h-4 w-4" />
                  <span className="hidden sm:inline">Add Student</span>
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px] mx-4">
                <DialogHeader>
                  <DialogTitle>Add New Student</DialogTitle>
                  <DialogDescription>Enter student information</DialogDescription>
                </DialogHeader>
                <form onSubmit={handleAddStudent} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Name</Label>
                    <Input
                      id="name"
                      value={newStudent.name}
                      onChange={(e) => setNewStudent({ ...newStudent, name: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="university_email">University Email</Label>
                    <Input
                      id="university_email"
                      type="email"
                      placeholder="student@univ-tiaret.dz"
                      value={newStudent.university_email}
                      onChange={(e) => setNewStudent({ ...newStudent, university_email: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="personal_email">Personal Email (Optional)</Label>
                    <Input
                      id="personal_email"
                      type="email"
                      placeholder="personal@gmail.com"
                      value={newStudent.personal_email}
                      onChange={(e) => setNewStudent({ ...newStudent, personal_email: e.target.value })}
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button type="button" variant="outline" onClick={() => setShowAddDialog(false)} className="flex-1">
                      Cancel
                    </Button>
                    <Button type="submit" className="flex-1">Add Student</Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <p className="text-center py-8">Loading students...</p>
        ) : students.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">No students yet</p>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead className="hidden sm:table-cell">University Email</TableHead>
                  <TableHead className="hidden md:table-cell">Personal Email</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {students.map((student) => (
                  <TableRow key={student.id}>
                    <TableCell className="font-medium">
                      <div className="flex flex-col">
                        <span>{student.name}</span>
                        <span className="text-xs text-muted-foreground sm:hidden">{student.university_email}</span>
                      </div>
                    </TableCell>
                    <TableCell className="hidden sm:table-cell text-sm">{student.university_email}</TableCell>
                    <TableCell className="hidden md:table-cell text-sm text-muted-foreground">
                      {student.personal_email || '-'}
                    </TableCell>
                    <TableCell>{getStatusBadge(student.status)}</TableCell>
                    <TableCell className="text-right">
                      <Button
                        onClick={() => handleDeleteStudent(student.id)}
                        variant="ghost"
                        size="sm"
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
};