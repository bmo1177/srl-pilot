import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Star, Users, UserPlus } from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

interface Student {
  id: string;
  name: string;
  email: string;
  status: string;
}

interface Team {
  id: string;
  name: string;
  leader_id: string;
  status: string;
  charter: string | null;
  leader?: Student;
  members: Student[];
  pendingCount: number;
}

const Teams = () => {
  const navigate = useNavigate();
  const [teams, setTeams] = useState<Team[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
    
    // Subscribe to real-time updates
    const teamsChannel = supabase
      .channel('teams-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'teams' }, () => {
        fetchData();
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'team_members' }, () => {
        fetchData();
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'requests' }, () => {
        fetchData();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(teamsChannel);
    };
  }, []);

  const fetchData = async () => {
    try {
      // Fetch teams with members
      const { data: teamsData, error: teamsError } = await supabase
        .from('teams')
        .select('*')
        .eq('status', 'active')
        .order('created_at', { ascending: false });

      if (teamsError) throw teamsError;

      // Fetch all students
      const { data: studentsData, error: studentsError } = await supabase
        .from('students')
        .select('*');

      if (studentsError) throw studentsError;

      setStudents(studentsData || []);

      // Fetch team members
      const { data: membersData, error: membersError } = await supabase
        .from('team_members')
        .select('team_id, student_id');

      if (membersError) throw membersError;

      // Fetch pending requests count
      const { data: requestsData, error: requestsError } = await supabase
        .from('requests')
        .select('team_id, status')
        .eq('status', 'pending');

      if (requestsError) throw requestsError;

      // Combine data
      const enrichedTeams = (teamsData || []).map(team => {
        const teamMembers = membersData
          ?.filter(m => m.team_id === team.id)
          .map(m => studentsData?.find(s => s.id === m.student_id))
          .filter(Boolean) as Student[];

        const leader = studentsData?.find(s => s.id === team.leader_id);
        const pendingCount = requestsData?.filter(r => r.team_id === team.id).length || 0;

        return {
          ...team,
          leader,
          members: teamMembers,
          pendingCount
        };
      });

      setTeams(enrichedTeams);
    } catch (error: any) {
      toast.error("Failed to load teams: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (memberCount: number, pendingCount: number) => {
    if (memberCount >= 5) {
      return <Badge variant="secondary">Full (5/5)</Badge>;
    }
    if (memberCount >= 3) {
      return <Badge className="bg-primary text-primary-foreground">Active ({memberCount}/5)</Badge>;
    }
    return <Badge variant="outline">Forming ({memberCount}/5)</Badge>;
  };

  return (
    <div className="min-h-[calc(100vh-8rem)] py-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="glass-strong rounded-2xl p-8 border border-primary/20 mb-8">
          <h1 className="text-4xl font-bold gradient-text mb-4">All Teams</h1>
          <p className="text-lg text-muted-foreground mb-6">
            Browse existing teams or create your own for the Mobile Development TP
          </p>
          <Button 
            onClick={() => navigate("/request")}
            size="lg"
            className="bg-gradient-to-r from-primary via-accent to-secondary hover:shadow-lg hover:shadow-primary/30 transition-smooth"
          >
            <UserPlus className="mr-2 h-5 w-5" />
            Submit Team Request
          </Button>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => (
              <Card key={i} className="glass p-6 animate-pulse border border-primary/20">
                <div className="h-6 bg-muted rounded mb-4" />
                <div className="h-4 bg-muted rounded mb-2" />
                <div className="h-4 bg-muted rounded w-2/3" />
              </Card>
            ))}
          </div>
        ) : teams.length === 0 ? (
          <Card className="glass-strong p-12 text-center border border-primary/20">
            <Users className="h-12 w-12 mx-auto mb-4 text-primary" />
            <h3 className="text-xl font-semibold mb-2">No teams yet</h3>
            <p className="text-muted-foreground mb-4">Be the first to create a team!</p>
            <Button onClick={() => navigate("/request")} className="bg-gradient-to-r from-primary to-accent">
              Create Team
            </Button>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {teams.map(team => (
              <Card key={team.id} className="glass-strong p-6 hover:shadow-xl transition-all border border-primary/20 hover:border-primary/40 hover:scale-105">
                {/* Team Header */}
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-bold mb-1">{team.name}</h3>
                    {getStatusBadge(team.members.length, team.pendingCount)}
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mb-4">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-muted-foreground">Members</span>
                    <span className="font-medium">{team.members.length}/5</span>
                  </div>
                  <Progress value={(team.members.length / 5) * 100} className="h-2" />
                </div>

                {/* Leader */}
                {team.leader && (
                  <div className="mb-4 p-3 bg-muted/50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Star className="h-4 w-4 fill-accent text-accent" />
                      <span className="font-semibold text-sm">Team Leader</span>
                    </div>
                    <p className="text-sm mt-1">{team.leader.name}</p>
                  </div>
                )}

                {/* Members List */}
                <div className="mb-4">
                  <h4 className="text-sm font-semibold mb-2 flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    Members
                  </h4>
                  <ul className="space-y-1">
                    {team.members.map(member => (
                      <li key={member.id} className="text-sm text-muted-foreground flex items-center gap-2">
                        {member.id === team.leader_id && (
                          <Star className="h-3 w-3 fill-accent text-accent" />
                        )}
                        {member.name}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Pending Requests */}
                {team.pendingCount > 0 && (
                  <Badge variant="outline" className="w-full justify-center">
                    {team.pendingCount} pending request{team.pendingCount > 1 ? 's' : ''}
                  </Badge>
                )}

                {/* Charter Preview */}
                {team.charter && (
                  <div className="mt-4 pt-4 border-t">
                    <p className="text-xs text-muted-foreground italic line-clamp-2">
                      "{team.charter}"
                    </p>
                  </div>
                )}
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Teams;
