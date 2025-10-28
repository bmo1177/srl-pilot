import { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { UserPlus, Users, Sparkles, ArrowLeft, CheckCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useNavigate } from "react-router-dom";

interface Team {
  id: string;
  name: string;
  members: any[];
}

interface Student {
  id: string;
  name: string;
  university_email: string;
  personal_email?: string;
  status: string;
}

export default function RequestForm() {
  const navigate = useNavigate();
  const [requestType, setRequestType] = useState<"join" | "create">("join");
  const [selectedStudent, setSelectedStudent] = useState("");
  const [selectedTeam, setSelectedTeam] = useState("");
  const [newTeamName, setNewTeamName] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [students, setStudents] = useState<Student[]>([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const [teamsRes, studentsRes] = await Promise.all([
      supabase.from("teams").select(`
        id, name, status,
        team_members(student_id)
      `),
      supabase.from("students").select("*")
    ]);

    if (teamsRes.data) {
      const teamsWithMembers = teamsRes.data.map(team => ({
        ...team,
        members: team.team_members || []
      }));
      setTeams(teamsWithMembers);
    }

    if (studentsRes.data) {
      setStudents(studentsRes.data);
    }
  };

  const availableTeams = useMemo(() => 
    teams.filter(t => t.members.length < 5), 
    [teams]
  );
  
  const freeStudents = useMemo(() => 
    students.filter(s => s.status === 'free'), 
    [students]
  );
  
  const availableMembersForTeam = useMemo(() => 
    freeStudents.filter(s => s.id !== selectedStudent),
    [freeStudents, selectedStudent]
  );

  const toggleMemberSelection = (studentId: string) => {
    setSelectedMembers(prev => {
      if (prev.includes(studentId)) {
        return prev.filter(id => id !== studentId);
      }
      
      if (prev.length < 4) {
        return [...prev, studentId];
      }
      
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

        await supabase
          .from('students')
          .update({ status: 'pending' })
          .eq('id', selectedStudent);
      } else {
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
      
      // Navigate back to teams page after 1.5 seconds
      setTimeout(() => navigate("/teams"), 1500);
    } catch (error: any) {
      toast.error("Failed to submit request: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen py-8">
      {/* Header */}
      <div className="mb-8">
        <Button
          variant="ghost"
          onClick={() => navigate("/teams")}
          className="mb-4 hover:bg-muted/50"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Teams
        </Button>
        
        <div className="glass-strong rounded-2xl p-8 border border-primary/20">
          <div className="flex items-center gap-3 mb-2">
            <Sparkles className="h-8 w-8 text-primary" />
            <h1 className="text-4xl font-bold gradient-text">Team Request</h1>
          </div>
          <p className="text-muted-foreground text-lg">
            Join an existing team or create your own with autonomy and responsibility
          </p>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="max-w-3xl mx-auto space-y-6">
        {/* Student Selection */}
        <div className="glass-strong rounded-2xl p-6 border border-primary/20 space-y-4">
          <Label htmlFor="student" className="text-lg font-semibold flex items-center gap-2">
            <UserPlus className="h-5 w-5 text-primary" />
            Your Name
          </Label>
          <Select value={selectedStudent} onValueChange={setSelectedStudent}>
            <SelectTrigger className="glass border-primary/20 hover:border-primary/40 transition-smooth h-12">
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

        {/* Request Type Selection */}
        <div className="glass-strong rounded-2xl p-6 border border-primary/20 space-y-4">
          <Label className="text-lg font-semibold">Request Type</Label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button
              type="button"
              onClick={() => {
                setRequestType("join");
                setSelectedMembers([]);
                setNewTeamName("");
              }}
              className={`p-6 rounded-xl border-2 transition-all flex flex-col items-center gap-3 ${
                requestType === "join"
                  ? "glass-strong border-primary shadow-lg shadow-primary/20 scale-105"
                  : "glass border-border hover:border-primary/40 hover:scale-102"
              }`}
            >
              <UserPlus className={`h-10 w-10 ${requestType === "join" ? "text-primary" : "text-muted-foreground"}`} />
              <div>
                <span className={`text-lg font-semibold block ${requestType === "join" ? "text-primary" : ""}`}>
                  Join Team
                </span>
                <span className="text-sm text-muted-foreground">Join an existing team</span>
              </div>
            </button>
            
            <button
              type="button"
              onClick={() => {
                setRequestType("create");
                setSelectedTeam("");
              }}
              className={`p-6 rounded-xl border-2 transition-all flex flex-col items-center gap-3 ${
                requestType === "create"
                  ? "glass-strong border-primary shadow-lg shadow-primary/20 scale-105"
                  : "glass border-border hover:border-primary/40 hover:scale-102"
              }`}
            >
              <Users className={`h-10 w-10 ${requestType === "create" ? "text-primary" : "text-muted-foreground"}`} />
              <div>
                <span className={`text-lg font-semibold block ${requestType === "create" ? "text-primary" : ""}`}>
                  Create Team
                </span>
                <span className="text-sm text-muted-foreground">Start your own team</span>
              </div>
            </button>
          </div>
        </div>

        {/* Conditional Fields */}
        <div className="glass-strong rounded-2xl p-6 border border-primary/20 space-y-6 animate-fade-in">
          {requestType === "join" ? (
            <div className="space-y-4">
              <Label htmlFor="team" className="text-lg font-semibold">Select Team</Label>
              <Select value={selectedTeam} onValueChange={setSelectedTeam}>
                <SelectTrigger className="glass border-primary/20 hover:border-primary/40 transition-smooth h-12">
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
            <div className="space-y-6">
              <div className="space-y-4">
                <Label htmlFor="teamName" className="text-lg font-semibold">Team Name</Label>
                <Input
                  id="teamName"
                  value={newTeamName}
                  onChange={(e) => setNewTeamName(e.target.value)}
                  placeholder="e.g., SRL Champions"
                  className="glass border-primary/20 hover:border-primary/40 focus:border-primary transition-smooth h-12 text-base"
                />
              </div>
              
              <div className="space-y-4">
                <Label className="text-lg font-semibold flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-primary" />
                  Select Team Members
                  <span className="text-sm font-normal text-muted-foreground">(1-4 members, max 5 total)</span>
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
                  
                  <div className="max-h-64 overflow-y-auto space-y-2 pr-2 custom-scrollbar">
                    {availableMembersForTeam.map(student => (
                      <div 
                        key={student.id} 
                        className="flex items-center space-x-3 p-3 rounded-lg glass hover:glass-strong transition-smooth cursor-pointer"
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
                          className="cursor-pointer flex-1 text-base"
                        >
                          {student.name}
                        </Label>
                      </div>
                    ))}
                  </div>
                  
                  <div className="text-base font-medium text-primary pt-2 border-t border-border/50">
                    Selected: {selectedMembers.length + 1}/5 members (including you)
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Message */}
        <div className="glass-strong rounded-2xl p-6 border border-primary/20 space-y-4">
          <Label htmlFor="message" className="text-lg font-semibold">Message (Optional)</Label>
          <Textarea
            id="message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Share your motivation or goals for this team..."
            rows={4}
            className="glass border-primary/20 hover:border-primary/40 focus:border-primary transition-smooth resize-none text-base"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4">
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => navigate("/teams")} 
            className="flex-1 glass border-border hover:border-primary/40 transition-smooth h-12 text-base"
          >
            Cancel
          </Button>
          <Button 
            type="submit" 
            disabled={loading} 
            className="flex-1 bg-gradient-to-r from-primary via-accent to-secondary hover:shadow-lg hover:shadow-primary/30 transition-smooth h-12 text-base font-semibold"
          >
            {loading ? "Submitting..." : "Submit Request"}
          </Button>
        </div>
      </form>
    </div>
  );
}
