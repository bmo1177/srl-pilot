import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Users, UserPlus } from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { TeamCard } from "@/components/TeamCard";

interface TeamMember {
  id: string;
  student_id: string;
  role?: string;
  students?: {
    name: string;
  };
}

interface Team {
  id: string;
  name: string;
  logo_url?: string;
  leader_id: string;
  status: string;
  charter: string | null;
  members: TeamMember[];
  pendingCount: number;
}

const Teams = () => {
  const navigate = useNavigate();
  const [teams, setTeams] = useState<Team[]>([]);
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
      // Fetch teams with members and their roles
      const { data: teamsData, error: teamsError } = await supabase
        .from('teams')
        .select(`
          *,
          team_members(
            id,
            student_id,
            role,
            students(name)
          )
        `)
        .eq('status', 'active')
        .order('created_at', { ascending: false });

      if (teamsError) throw teamsError;

      // Fetch pending requests count
      const { data: requestsData, error: requestsError } = await supabase
        .from('requests')
        .select('team_id, status')
        .eq('status', 'pending');

      if (requestsError) throw requestsError;

      // Combine data
      const enrichedTeams = (teamsData || []).map(team => {
        const pendingCount = requestsData?.filter(r => r.team_id === team.id).length || 0;

        return {
          ...team,
          members: team.team_members || [],
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

  return (
    <div className="min-h-[calc(100vh-8rem)] py-8">
      <div className="max-w-7xl mx-auto">
        {/* Header with Analytics */}
        <div className="glass-strong rounded-2xl p-8 border border-primary/20 mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 rounded-lg bg-gradient-to-br from-primary/20 to-secondary/20">
              <Users className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-4xl font-bold gradient-text">Team Collaboration</h1>
              <p className="text-lg text-muted-foreground">
                Active teams working on the Mobile Development TP with SRL principles
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-4 mb-6">
            <Card className="glass p-4 border-primary/20">
              <p className="text-sm text-muted-foreground mb-1">Active Teams</p>
              <p className="text-2xl font-bold">{teams.length}</p>
            </Card>
            <Card className="glass p-4 border-secondary/20">
              <p className="text-sm text-muted-foreground mb-1">Total Members</p>
              <p className="text-2xl font-bold">
                {teams.reduce((sum, t) => sum + t.members.length, 0)}
              </p>
            </Card>
            <Card className="glass p-4 border-accent/20">
              <p className="text-sm text-muted-foreground mb-1">Avg Team Size</p>
              <p className="text-2xl font-bold">
                {teams.length > 0
                  ? Math.round(
                      teams.reduce((sum, t) => sum + t.members.length, 0) / teams.length
                    )
                  : 0}
              </p>
            </Card>
          </div>
          
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 px-4 sm:px-0">
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 px-4 sm:px-0">
            {teams.map(team => (
              <TeamCard
                key={team.id}
                id={team.id}
                name={team.name}
                logo_url={team.logo_url}
                memberCount={team.members.length}
                members={team.members}
                onClick={() => navigate(`/teams/${team.id}`)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Teams;
