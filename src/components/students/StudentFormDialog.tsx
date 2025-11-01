import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface StudentFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  student?: {
    id: string;
    name: string;
    email: string;
    email_personal: string | null;
    status: string;
  } | null;
  onSuccess: () => void;
}

export const StudentFormDialog = ({ open, onOpenChange, student, onSuccess }: StudentFormDialogProps) => {
  const [formData, setFormData] = useState({
    name: student?.name || "",
    email: student?.email || "",
    email_personal: student?.email_personal || "",
    status: student?.status || "active",
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (student) {
        // Update existing student
        const { error } = await supabase
          .from("students")
          .update({
            name: formData.name,
            email: formData.email,
            email_personal: formData.email_personal || null,
            status: formData.status,
          })
          .eq("id", student.id);

        if (error) throw error;
        toast.success("Student updated successfully");
      } else {
        // Create new student
        const { error } = await supabase
          .from("students")
          .insert({
            name: formData.name,
            email: formData.email,
            email_personal: formData.email_personal || null,
            status: formData.status,
          });

        if (error) throw error;
        toast.success("Student created successfully");
      }

      onSuccess();
      onOpenChange(false);
      setFormData({ name: "", email: "", email_personal: "", status: "active" });
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
            <Label htmlFor="email">University Email *</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
              placeholder="john.doe@university.edu"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email_personal">Personal Email (Optional)</Label>
            <Input
              id="email_personal"
              type="email"
              value={formData.email_personal}
              onChange={(e) => setFormData({ ...formData, email_personal: e.target.value })}
              placeholder="john@email.com"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
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
