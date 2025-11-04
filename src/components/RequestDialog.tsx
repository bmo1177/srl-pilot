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
import { UserPlus, Users, Sparkles } from "lucide-react";
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

        // Student status will be updated when request is approved by admin
        // No status change needed during request submission
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
      <DialogContent className="sm:max-w-lg glass-strong border-primary/20 backdrop-blur-xl">
        <DialogHeader className="space-y-3">
          <DialogTitle className="text-2xl font-bold gradient-text flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-primary" />
            Team Request
          </DialogTitle>
          <DialogDescription className="text-base">
            Join an existing team or create your own with autonomy and responsibility
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 mt-4">
          {/* Student Selection */}
          <div className="space-y-2 transition-smooth">
            <Label htmlFor="student" className="text-sm font-semibold">Your Name</Label>
            <Select value={selectedStudent} onValueChange={setSelectedStudent}>
              <SelectTrigger className="glass border-primary/20 hover:border-primary/40 transition-smooth">
                <SelectValue placeholder="Select your name" />
              </SelectTrigger>
              <SelectContent className="glass-strong border-primary/20">
                {freeStudents.map(student => (
                  <SelectItem key={student.id} value={student.id} className="hover:bg-primary/10">
                    {student.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {freeStudents.length === 0 && (
              <Alert className="glass border-destructive/30">
                <AlertDescription className="text-sm">
                  No available students. Contact admin to add you to the system.
                </AlertDescription>
              </Alert>
            )}
          </div>

          {/* Request Type - Modern Toggle Style */}
          <div className="space-y-3">
            <Label className="text-sm font-semibold">Request Type</Label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => {
                  setRequestType("join");
                  setSelectedMembers([]);
                  setNewTeamName("");
                }}
                className={`p-4 rounded-xl border-2 transition-smooth flex flex-col items-center gap-2 ${
                  requestType === "join"
                    ? "glass-strong border-primary shadow-lg shadow-primary/20"
                    : "glass border-border hover:border-primary/40"
                }`}
              >
                <UserPlus className={`h-6 w-6 ${requestType === "join" ? "text-primary" : "text-muted-foreground"}`} />
                <span className={`text-sm font-medium ${requestType === "join" ? "text-primary" : ""}`}>
                  Join Team
                </span>
              </button>
              
              <button
                type="button"
                onClick={() => {
                  setRequestType("create");
                  setSelectedTeam("");
                }}
                className={`p-4 rounded-xl border-2 transition-smooth flex flex-col items-center gap-2 ${
                  requestType === "create"
                    ? "glass-strong border-primary shadow-lg shadow-primary/20"
                    : "glass border-border hover:border-primary/40"
                }`}
              >
                <Users className={`h-6 w-6 ${requestType === "create" ? "text-primary" : "text-muted-foreground"}`} />
                <span className={`text-sm font-medium ${requestType === "create" ? "text-primary" : ""}`}>
                  Create Team
                </span>
              </button>
            </div>
          </div>

          {/* Conditional Fields with Smooth Transitions */}
          <div className="animate-fade-in">
            {requestType === "join" ? (
              <div className="space-y-2 transition-smooth">
                <Label htmlFor="team" className="text-sm font-semibold">Select Team</Label>
                <Select value={selectedTeam} onValueChange={setSelectedTeam}>
                  <SelectTrigger className="glass border-primary/20 hover:border-primary/40 transition-smooth">
                    <SelectValue placeholder="Choose a team" />
                  </SelectTrigger>
                  <SelectContent className="glass-strong border-primary/20">
                    {availableTeams.map(team => (
                      <SelectItem key={team.id} value={team.id} className="hover:bg-primary/10">
                        {team.name} ({team.members.length}/5 members)
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {availableTeams.length === 0 && (
                  <p className="text-sm text-muted-foreground">
                    No teams available. Create a new team instead.
                  </p>
                )}
              </div>
            ) : (
              <div className="space-y-4 transition-smooth">
                <div className="space-y-2">
                  <Label htmlFor="teamName" className="text-sm font-semibold">Team Name</Label>
                  <Input
                    id="teamName"
                    value={newTeamName}
                    onChange={(e) => setNewTeamName(e.target.value)}
                    placeholder="e.g., SRL Champions"
                    className="glass border-primary/20 hover:border-primary/40 focus:border-primary transition-smooth"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label className="text-sm font-semibold">
                    Select Team Members <span className="text-xs text-muted-foreground">(1-4 members, max 5 total)</span>
                  </Label>
                  <div className="glass rounded-xl p-4 space-y-3 border border-primary/20">
                    {selectedMembers.length >= 4 && (
                      <Alert className="glass-strong border-accent/40 bg-accent/5">
                        <AlertDescription className="text-sm flex items-center gap-2">
                          <Sparkles className="h-4 w-4 text-accent" />
                          Maximum 5 members including you
                        </AlertDescription>
                      </Alert>
                    )}
                    
                    <div className="max-h-48 overflow-y-auto space-y-2 pr-2 custom-scrollbar">
                      {freeStudents.filter(s => s.id !== selectedStudent).map(student => (
                        <div 
                          key={student.id} 
                          className="flex items-center space-x-3 p-2 rounded-lg glass hover:glass-strong transition-smooth cursor-pointer"
                          onClick={() => toggleMemberSelection(student.id)}
                        >
                          <Checkbox 
                            id={`student-${student.id}`}
                            checked={selectedMembers.includes(student.id)}
                            onCheckedChange={() => toggleMemberSelection(student.id)}
                            className="border-primary/40"
                          />
                          <Label 
                            htmlFor={`student-${student.id}`}
                            className="cursor-pointer flex-1 text-sm"
                          >
                            {student.name}
                          </Label>
                        </div>
                      ))}
                    </div>
                    
                    <div className="text-sm font-medium text-primary pt-2 border-t border-border/50">
                      Selected: {selectedMembers.length + 1}/5 members (including you)
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Message */}
          <div className="space-y-2 transition-smooth">
            <Label htmlFor="message" className="text-sm font-semibold">Message (Optional)</Label>
            <Textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Share your motivation or goals for this team..."
              rows={3}
              className="glass border-primary/20 hover:border-primary/40 focus:border-primary transition-smooth resize-none"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => onOpenChange(false)} 
              className="flex-1 glass border-border hover:border-primary/40 transition-smooth"
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={loading} 
              className="flex-1 bg-gradient-to-r from-primary to-accent hover:shadow-lg hover:shadow-primary/30 transition-smooth"
            >
              {loading ? "Submitting..." : "Submit Request"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
