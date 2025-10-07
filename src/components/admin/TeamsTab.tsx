import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Star, Trash2, RefreshCw } from "lucide-react";

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

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Teams Management</CardTitle>
            <CardDescription>View and manage teams</CardDescription>
          </div>
          <Button onClick={() => fetchData()} variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
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
    </Card>
  );
};
