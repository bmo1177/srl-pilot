import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface Team {
  id: string;
  name: string;
  members: any[];
}

interface Student {
  id: string;
  name: string;
  status: string;
}

interface RequestDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  teams: Team[];
  students: Student[];
}

export const RequestDialog = ({ open, onOpenChange, teams, students }: RequestDialogProps) => {
  const [requestType, setRequestType] = useState<"join" | "create">("join");
  const [selectedStudent, setSelectedStudent] = useState("");
  const [selectedTeam, setSelectedTeam] = useState("");
  const [newTeamName, setNewTeamName] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);

  const availableTeams = teams.filter(t => t.members.length < 5);
  const freeStudents = students.filter(s => s.status === 'free');

  const toggleMemberSelection = (studentId: string) => {
    setSelectedMembers(prev => {
      // If already selected, remove it
      if (prev.includes(studentId)) {
        return prev.filter(id => id !== studentId);
      }
      
      // If not selected and we haven't reached the limit, add it
      if (prev.length < 4 ) { // Changed from 5 to 4 since we're adding one more
        return [...prev, studentId];
      }
      
      // If we've reached the limit, show a toast and don't change
      toast.error("You can select a maximum of 5 members");
      return prev;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedStudent) {
      toast.error("Please select a student");
      return;
    }

    if (requestType === "join" && !selectedTeam) {
      toast.error("Please select a team to join");
      return;
    }

    if (requestType === "create") {
      if (!newTeamName.trim()) {
        toast.error("Please enter a team name");
        return;
      }
      
      if (selectedMembers.length === 0) {
        toast.error("Please select at least one team member");
        return;
      }
    }

    setLoading(true);

    try {
      if (requestType === "join") {
        const requestData = {
          student_id: selectedStudent,
          type: requestType,
          message: message.trim() || null,
          team_id: selectedTeam,
          team_name: null
        };

        const { error } = await supabase
          .from('requests')
          .insert([requestData]);

        if (error) throw error;

        // Update student status to pending
        await supabase
          .from('students')
          .update({ status: 'pending' })
          .eq('id', selectedStudent);
      } else {
        // For create team with multiple members
        const requestData = {
          student_id: selectedStudent,
          type: requestType,
          message: message.trim() || null,
          team_id: null,
          team_name: newTeamName.trim(),
          selected_members: selectedMembers
        };

        const { error } = await supabase
          .from('requests')
          .insert([requestData]);

        if (error) throw error;

        // Update student status to pending
        await supabase
          .from('students')
          .update({ status: 'pending' })
          .eq('id', selectedStudent);
      }

      toast.success(`Request submitted successfully! Waiting for admin approval.`);
      
      // Reset form
      setSelectedStudent("");
      setSelectedTeam("");
      setNewTeamName("");
      setMessage("");
      setSelectedMembers([]);
      onOpenChange(false);
    } catch (error: any) {
      toast.error("Failed to submit request: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Join or Create a Team</DialogTitle>
          <DialogDescription>
            Submit a request to join an existing team or create a new one
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Student Selection */}
          <div className="space-y-2">
            <Label htmlFor="student">Your Name</Label>
            <Select value={selectedStudent} onValueChange={setSelectedStudent}>
              <SelectTrigger>
                <SelectValue placeholder="Select your name" />
              </SelectTrigger>
              <SelectContent>
                {freeStudents.map(student => (
                  <SelectItem key={student.id} value={student.id}>
                    {student.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {freeStudents.length === 0 && (
              <p className="text-sm text-muted-foreground">
                No available students. Contact admin to add you to the system.
              </p>
            )}
          </div>

          {/* Request Type */}
          <div className="space-y-2">
            <Label>Request Type</Label>
            <Select value={requestType} onValueChange={(val) => setRequestType(val as "join" | "create")}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="join">Join Existing Team</SelectItem>
                <SelectItem value="create">Create New Team</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Conditional Fields */}
          {requestType === "join" ? (
            <div className="space-y-2">
              <Label htmlFor="team">Select Team</Label>
              <Select value={selectedTeam} onValueChange={setSelectedTeam}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a team" />
                </SelectTrigger>
                <SelectContent>
                  {availableTeams.map(team => (
                    <SelectItem key={team.id} value={team.id}>
                      {team.name} ({team.members.length}/5)
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          ) : (
            <>
              <div className="space-y-2">
                <Label htmlFor="teamName">Team Name</Label>
                <Input
                  id="teamName"
                  value={newTeamName}
                  onChange={(e) => setNewTeamName(e.target.value)}
                  placeholder="e.g., SRL Champions"
                />
              </div>
              
              <div className="space-y-2">
                <Label>Select Team Members (Max 5)</Label>
                <div className="border rounded-md p-3 space-y-2">
                  {selectedMembers.length === 5 && (
                    <Alert variant="warning" className="mb-2">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>
                        Maximum 5 members reached
                      </AlertDescription>
                    </Alert>
                  )}
                  
                  <div className="max-h-40 overflow-y-auto pr-2">
                    <div className="grid grid-cols-1 gap-2">
                      {freeStudents.map(student => (
                        <div key={student.id} className="flex items-center space-x-2">
                          <Checkbox 
                            id={`student-${student.id}`}
                            checked={selectedMembers.includes(student.id)}
                            onCheckedChange={() => toggleMemberSelection(student.id)}
                          />
                          <Label 
                            htmlFor={`student-${student.id}`}
                            className="cursor-pointer"
                          >
                            {student.name}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="text-sm text-muted-foreground mt-2">
                    Selected: {selectedMembers.length}/5 members
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Message */}
          <div className="space-y-2">
            <Label htmlFor="message">Message (Optional)</Label>
            <Textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Tell the admin why you want to join/create this team..."
              rows={3}
            />
          </div>

          <div className="flex gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" disabled={loading} className="flex-1">
              {loading ? "Submitting..." : "Submit Request"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
