import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { z } from "zod";

interface StudentFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  student?: {
    id: string;
    name: string;
    university_email: string;
    personal_email: string | null;
    status: string;
  } | null;
  onSuccess: () => void;
}

export const StudentFormDialog = ({ open, onOpenChange, student, onSuccess }: StudentFormDialogProps) => {
  type StudentStatus = 'active' | 'team_assigned' | 'inactive' | 'graduated' | 'free' | 'busy';
  const studentSchema = z.object({
    name: z.string().trim().min(2, 'Name must be at least 2 characters').max(100, 'Name must be under 100 characters'),
    university_email: z.string().trim().toLowerCase().email('Invalid university email').max(255, 'Email too long'),
    personal_email: z.string().trim().toLowerCase().email('Invalid personal email').max(255, 'Email too long').optional().or(z.literal('')),
    status: z.enum(['active','team_assigned','inactive','graduated','free','busy'])
  });

  const [formData, setFormData] = useState<{ name: string; university_email: string; personal_email: string; status: StudentStatus }>({
    name: student?.name || "",
    university_email: student?.university_email || "",
    personal_email: (student as any)?.email_personal || (student as any)?.personal_email || "",
    status: (student?.status as StudentStatus) || "active",
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const parsed = studentSchema.safeParse(formData);
      if (!parsed.success) {
        const first = parsed.error.errors[0];
        toast.error(first?.message || 'Invalid input');
        return;
      }
      const values = parsed.data;

      if (student) {
        // Update existing student
        const { error } = await supabase
          .from("students")
          .update({
            name: values.name,
            university_email: values.university_email,
            email_personal: values.personal_email || null,
            status: values.status,
          })
          .eq("id", student.id);

        if (error) throw error;
        toast.success("Student updated successfully");
      } else {
        // Create new student
        const { error } = await supabase
          .from("students")
          .insert({
            name: values.name,
            university_email: values.university_email,
            email_personal: values.personal_email || null,
            status: values.status,
          });

        if (error) throw error;
        toast.success("Student created successfully");
      }

      onSuccess();
      onOpenChange(false);
      setFormData({ name: "", university_email: "", personal_email: "", status: "active" as StudentStatus });
    } catch (error: any) {
      console.error("Error saving student:", error);
      toast.error(error.message || "Failed to save student");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{student ? "Edit Student" : "Add New Student"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
              placeholder="John Doe"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="university_email">University Email *</Label>
            <Input
              id="university_email"
              type="email"
              value={formData.university_email}
              onChange={(e) => setFormData({ ...formData, university_email: e.target.value })}
              required
              placeholder="john.doe@university.edu"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="personal_email">Personal Email (Optional)</Label>
            <Input
              id="personal_email"
              type="email"
              value={formData.personal_email}
              onChange={(e) => setFormData({ ...formData, personal_email: e.target.value })}
              placeholder="john@email.com"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value as StudentStatus })}>
              <SelectTrigger id="status">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="team_assigned">Team Assigned</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
                <SelectItem value="graduated">Graduated</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Saving..." : student ? "Update" : "Create"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
