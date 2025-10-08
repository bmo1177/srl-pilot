import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Star, Trash2, RefreshCw, X, Check, AlertCircle } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface Student {
  id: string;
  name: string;
}

interface Team {
  id: string;
  name: string;
  leader_id: string;
  status: string;
  leader?: Student;
  members: Student[];
}

export const TeamsTab = () => {
  const [teams, setTeams] = useState<Team[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateTeamDialog, setShowCreateTeamDialog] = useState(false);
  const [newTeamName, setNewTeamName] = useState("");
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);
  const [selectedLeader, setSelectedLeader] = useState("");
  const [createTeamLoading, setCreateTeamLoading] = useState(false);

  useEffect(() => {
    fetchData();
    
    const channel = supabase
      .channel('teams-admin-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'teams' }, () => {
        fetchData();
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'team_members' }, () => {
        fetchData();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchData = async () => {
    try {
      const { data: teamsData, error: teamsError } = await supabase
        .from('teams')
        .select('*')
        .order('created_at', { ascending: false });

      if (teamsError) throw teamsError;

      const { data: studentsData, error: studentsError } = await supabase
        .from('students')
        .select('*');

      if (studentsError) throw studentsError;

      const { data: membersData, error: membersError } = await supabase
        .from('team_members')
        .select('team_id, student_id');

      if (membersError) throw membersError;

      setStudents(studentsData || []);

      const enrichedTeams = (teamsData || []).map(team => {
        const teamMembers = membersData
          ?.filter(m => m.team_id === team.id)
          .map(m => studentsData?.find(s => s.id === m.student_id))
          .filter(Boolean) as Student[];

        const leader = studentsData?.find(s => s.id === team.leader_id);

        return {
          ...team,
          leader,
          members: teamMembers
        };
      });

      setTeams(enrichedTeams);
    } catch (error: any) {
      toast.error("Failed to load teams: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleChangeLeader = async (teamId: string, newLeaderId: string) => {
    try {
      const { error } = await supabase
        .from('teams')
        .update({ leader_id: newLeaderId })
        .eq('id', teamId);

      if (error) throw error;
      toast.success("Team leader updated successfully");
    } catch (error: any) {
      toast.error("Failed to update leader: " + error.message);
    }
  };

  const handleDeleteTeam = async (teamId: string) => {
    if (!confirm("Are you sure you want to delete this team?")) return;

    try {
      const { error } = await supabase
        .from('teams')
        .delete()
        .eq('id', teamId);

      if (error) throw error;
      toast.success("Team deleted successfully");
    } catch (error: any) {
      toast.error("Failed to delete team: " + error.message);
    }
  };

  const handleCreateTeam = async () => {
    if (!newTeamName.trim()) {
      toast.error("Team name is required");
      return;
    }

    if (selectedMembers.length === 0) {
      toast.error("Please select at least one team member");
      return;
    }

    if (selectedMembers.length > 5) {
      toast.error("Maximum 5 members allowed per team");
      return;
    }

    if (!selectedLeader) {
      toast.error("Please select a team leader");
      return;
    }

    if (!selectedMembers.includes(selectedLeader)) {
      toast.error("Team leader must be a selected member");
      return;
    }

    setCreateTeamLoading(true);

    try {
      // Create the team
      const { data: teamData, error: teamError } = await supabase
        .from('teams')
        .insert([
          { 
            name: newTeamName,
            leader_id: selectedLeader,
            status: 'active'
          }
        ])
        .select();

      if (teamError) throw teamError;
      
      if (!teamData || teamData.length === 0) {
        throw new Error("Failed to create team");
      }

      const teamId = teamData[0].id;

      // Add all selected members to the team
      const memberInserts = selectedMembers.map(studentId => ({
        team_id: teamId,
        student_id: studentId
      }));

      const { error: membersError } = await supabase
        .from('team_members')
        .insert(memberInserts);

      if (membersError) throw membersError;

      toast.success("Team created successfully");
      setShowCreateTeamDialog(false);
      setNewTeamName("");
      setSelectedMembers([]);
      setSelectedLeader("");
      fetchData();
    } catch (error: any) {
      toast.error("Failed to create team: " + error.message);
    } finally {
      setCreateTeamLoading(false);
    }
  };

  const toggleMemberSelection = (studentId: string) => {
    setSelectedMembers(prev => {
      // If already selected, remove it
      if (prev.includes(studentId)) {
        // If this was the leader, clear the leader selection
        if (selectedLeader === studentId) {
          setSelectedLeader("");
        }
        return prev.filter(id => id !== studentId);
      } 
      // If not selected and we're under the limit, add it
      else if (prev.length < 5) {
        return [...prev, studentId];
      }
      // If we're at the limit, show a toast and don't change
      else {
        toast.error("Maximum 5 members allowed per team");
        return prev;
      }
    });
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Teams Management</CardTitle>
            <CardDescription>View and manage teams</CardDescription>
          </div>
          <div className="flex gap-2">
            <Button onClick={() => setShowCreateTeamDialog(true)} variant="default" size="sm">
              Create Team
            </Button>
            <Button onClick={() => fetchData()} variant="outline" size="sm">
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <p>Loading teams...</p>
        ) : teams.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">No teams yet</p>
        ) : (
          <div className="space-y-4">
            {teams.map((team) => (
              <Card key={team.id} className="border-l-4 border-l-primary">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{team.name}</CardTitle>
                      <CardDescription>
                        {team.members.length} member{team.members.length !== 1 ? 's' : ''}
                      </CardDescription>
                    </div>
                    <div className="flex gap-2">
                      <Badge>{team.status}</Badge>
                      <Button
                        onClick={() => handleDeleteTeam(team.id)}
                        variant="ghost"
                        size="sm"
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-2 flex items-center gap-2">
                      <Star className="h-4 w-4 fill-accent text-accent" />
                      Team Leader
                    </label>
                    <Select
                      value={team.leader_id || ""}
                      onValueChange={(value) => handleChangeLeader(team.id, value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select leader" />
                      </SelectTrigger>
                      <SelectContent>
                        {team.members.map((member) => (
                          <SelectItem key={member.id} value={member.id}>
                            {member.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <p className="text-sm font-medium mb-2">Members</p>
                    <div className="flex flex-wrap gap-2">
                      {team.members.map((member) => (
                        <Badge key={member.id} variant="outline">
                          {member.id === team.leader_id && (
                            <Star className="h-3 w-3 fill-accent text-accent mr-1" />
                          )}
                          {member.name}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </CardContent>

      {/* Create Team Dialog */}
      <Dialog open={showCreateTeamDialog} onOpenChange={setShowCreateTeamDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Create New Team</DialogTitle>
            <DialogDescription>
              Create a new team with up to 5 members.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="team-name">Team Name</Label>
              <Input 
                id="team-name" 
                value={newTeamName}
                onChange={(e) => setNewTeamName(e.target.value)}
                placeholder="Enter team name"
              />
            </div>

            {selectedMembers.length >= 5 && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Maximum 5 members allowed per team
                </AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label>Select Team Members (Max 5)</Label>
              <div className="border rounded-md p-4 max-h-60 overflow-y-auto space-y-2">
                {students.map((student) => (
                  <div key={student.id} className="flex items-center space-x-2">
                    <Checkbox 
                      id={`student-${student.id}`}
                      checked={selectedMembers.includes(student.id)}
                      onCheckedChange={() => toggleMemberSelection(student.id)}
                      disabled={selectedMembers.length >= 5 && !selectedMembers.includes(student.id)}
                    />
                    <label 
                      htmlFor={`student-${student.id}`}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {student.name}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {selectedMembers.length > 0 && (
              <div className="space-y-2">
                <Label htmlFor="team-leader">Team Leader</Label>
                <Select
                  value={selectedLeader}
                  onValueChange={setSelectedLeader}
                >
                  <SelectTrigger id="team-leader">
                    <SelectValue placeholder="Select team leader" />
                  </SelectTrigger>
                  <SelectContent>
                    {students
                      .filter(student => selectedMembers.includes(student.id))
                      .map((student) => (
                        <SelectItem key={student.id} value={student.id}>
                          {student.name}
                        </SelectItem>
                      ))
                    }
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setShowCreateTeamDialog(false)}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleCreateTeam}
              disabled={createTeamLoading || !newTeamName || selectedMembers.length === 0 || !selectedLeader}
            >
              {createTeamLoading ? "Creating..." : "Create Team"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
};
