import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { ArrowLeft, Users, Star, Edit2 } from "lucide-react";

interface TeamMember {
  id: string;
  student_id: string;
  role: string;
  students: {
    name: string;
    university_email: string;
  };
}

interface Team {
  id: string;
  name: string;
  logo_url?: string;
  leader_id: string;
  charter?: string;
  team_members: TeamMember[];
}

const ROLE_OPTIONS = [
  "Leader",
  "Developer", 
  "Designer",
  "Tester",
  "Member"
];

export default function TeamDetails() {
  const { teamId } = useParams();
  const navigate = useNavigate();
  const [team, setTeam] = useState<Team | null>(null);
  const [loading, setLoading] = useState(true);
  const [editingRole, setEditingRole] = useState<string | null>(null);

  useEffect(() => {
    if (teamId) {
      fetchTeamDetails();
    }
  }, [teamId]);

  const fetchTeamDetails = async () => {
    try {
      const { data, error } = await supabase
        .from('teams')
        .select(`
          *,
          team_members(
            id,
            student_id,
            role,
            students(name, university_email)
          )
        `)
        .eq('id', teamId)
        .single();

      if (error) throw error;
      setTeam(data);
    } catch (error: any) {
      toast.error("Failed to load team details: " + error.message);
      navigate("/teams");
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async (memberId: string, newRole: string) => {
    try {
      const { error } = await supabase
        .from('team_members')
        .update({ role: newRole })
        .eq('id', memberId);

      if (error) throw error;

      toast.success("Role updated successfully");
      fetchTeamDetails();
      setEditingRole(null);
    } catch (error: any) {
      toast.error("Failed to update role: " + error.message);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!team) {
    return null;
  }

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => navigate("/teams")}
          className="mb-6 hover:bg-muted/50"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Teams
        </Button>

        {/* Team Header */}
        <Card className="glass-strong border-primary/20 mb-6">
          <CardHeader>
            <div className="flex items-start gap-6">
              {team.logo_url ? (
                <Avatar className="h-24 w-24 rounded-xl border-2 border-primary/20">
                  <AvatarImage src={team.logo_url} alt={team.name} className="object-cover" />
                  <AvatarFallback className="rounded-xl bg-gradient-to-br from-primary/20 to-secondary/20">
                    <Users className="h-12 w-12 text-primary" />
                  </AvatarFallback>
                </Avatar>
              ) : (
                <div className="h-24 w-24 rounded-xl glass-strong flex items-center justify-center border-2 border-primary/20">
                  <Users className="h-12 w-12 text-primary" />
                </div>
              )}
              
              <div className="flex-1">
                <CardTitle className="text-3xl font-bold mb-2">{team.name}</CardTitle>
                <CardDescription className="text-base">
                  {team.team_members.length} / 5 Members
                </CardDescription>
                {team.charter && (
                  <p className="text-sm text-muted-foreground italic mt-3 p-3 glass rounded-lg">
                    "{team.charter}"
                  </p>
                )}
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Members List */}
        <Card className="glass-strong border-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Team Members
            </CardTitle>
            <CardDescription>
              View and manage team member roles
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {team.team_members.map((member) => {
                const isLeader = member.student_id === team.leader_id;
                const isEditing = editingRole === member.id;

                return (
                  <div
                    key={member.id}
                    className="flex items-center justify-between p-4 rounded-xl glass hover:glass-strong transition-smooth"
                  >
                    <div className="flex items-center gap-3 flex-1">
                      <Avatar className="h-12 w-12">
                        <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                          {member.students.name.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-semibold">{member.students.name}</p>
                          {isLeader && (
                            <Star className="h-4 w-4 fill-accent text-accent" />
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {member.students.university_email}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      {isEditing ? (
                        <Select
                          value={member.role}
                          onValueChange={(value) => handleRoleChange(member.id, value)}
                        >
                          <SelectTrigger className="w-40 glass border-primary/20">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="glass-strong border-primary/20">
                            {ROLE_OPTIONS.map((role) => (
                              <SelectItem key={role} value={role}>
                                {role}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      ) : (
                        <>
                          <Badge
                            variant="secondary"
                            className="bg-primary/10 text-primary hover:bg-primary/20"
                          >
                            {member.role || "Member"}
                          </Badge>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setEditingRole(member.id)}
                            className="hover:bg-primary/10"
                          >
                            <Edit2 className="h-4 w-4" />
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
