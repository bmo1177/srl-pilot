import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Check, X, RefreshCw } from "lucide-react";

interface Request {
  id: string;
  student_id: string;
  team_id: string | null;
  type: string;
  status: string;
  message: string | null;
  team_name: string | null;
  created_at: string;
  selected_members?: string[];
  students?: {
    name: string;
    email: string;
  };
  teams?: {
    name: string;
  };
}

export const RequestsTab = () => {
  const [requests, setRequests] = useState<Request[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRequests();
    
    const channel = supabase
      .channel('requests-admin-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'requests' }, () => {
        fetchRequests();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchRequests = async () => {
    try {
      const { data, error } = await supabase
        .from('requests')
        .select(`
          *,
          students (name, email),
          teams (name)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      // Cast selected_members from Json to string[]
      const typedRequests = (data || []).map(req => ({
        ...req,
        selected_members: Array.isArray(req.selected_members) 
          ? req.selected_members as string[]
          : undefined
      }));
      
      setRequests(typedRequests);
    } catch (error: any) {
      toast.error("Failed to load requests: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (requestId: string) => {
    try {
      const request = requests.find(r => r.id === requestId);
      if (!request) return;

      if (request.type === "create") {
        // Create new team
        const { data: newTeam, error: teamError } = await supabase
          .from('teams')
          .insert([{
            name: request.team_name,
            leader_id: request.student_id,
            status: 'active'
          }])
          .select()
          .single();

        if (teamError) throw teamError;

        // Add team leader as member with Leader role
        const { error: leaderError } = await supabase
          .from('team_members')
          .insert([{
            team_id: newTeam.id,
            student_id: request.student_id,
            role: 'Leader'
          }]);

        if (leaderError) throw leaderError;

        // Add selected members if any
        if (request.selected_members && request.selected_members.length > 0) {
          const memberInserts = request.selected_members.map(memberId => ({
            team_id: newTeam.id,
            student_id: memberId,
            role: 'Member'
          }));

          const { error: membersError } = await supabase
            .from('team_members')
            .insert(memberInserts);

          if (membersError) throw membersError;

          // Update all selected members status to team_assigned
          const { error: updateMembersError } = await supabase
            .from('students')
            .update({ status: 'team_assigned' })
            .in('id', request.selected_members);

          if (updateMembersError) throw updateMembersError;
        }
      } else if (request.type === "join" && request.team_id) {
        // Add student to existing team
        const { error: memberError } = await supabase
          .from('team_members')
          .insert([{
            team_id: request.team_id,
            student_id: request.student_id,
            role: 'Member'
          }]);

        if (memberError) throw memberError;
      }

      // Update request status
      const { error: requestError } = await supabase
        .from('requests')
        .update({ status: 'approved' })
        .eq('id', requestId);

      if (requestError) throw requestError;

      // Update student status
      const { error: studentError } = await supabase
        .from('students')
        .update({ status: 'team_assigned' })
        .eq('id', request.student_id);

      if (studentError) throw studentError;

      toast.success("Request approved successfully");
    } catch (error: any) {
      toast.error("Failed to approve request: " + error.message);
    }
  };

  const handleDeny = async (requestId: string) => {
    try {
      const request = requests.find(r => r.id === requestId);
      if (!request) return;

      // Update request status
      const { error: requestError } = await supabase
        .from('requests')
        .update({ status: 'denied' })
        .eq('id', requestId);

      if (requestError) throw requestError;

      // Update student status back to active
      const { error: studentError } = await supabase
        .from('students')
        .update({ status: 'active' })
        .eq('id', request.student_id);

      if (studentError) throw studentError;

      toast.success("Request denied");
    } catch (error: any) {
      toast.error("Failed to deny request: " + error.message);
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive"> = {
      pending: "secondary",
      approved: "default",
      denied: "destructive"
    };
    return <Badge variant={variants[status] || "outline"}>{status}</Badge>;
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <CardTitle>Requests Management</CardTitle>
            <CardDescription>Review and manage team requests</CardDescription>
          </div>
          <Button onClick={() => fetchRequests()} variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <p className="text-center py-8">Loading requests...</p>
        ) : requests.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">No requests yet</p>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Student</TableHead>
                  <TableHead className="hidden sm:table-cell">Type</TableHead>
                  <TableHead className="hidden md:table-cell">Team</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="hidden lg:table-cell">Message</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {requests.map((request) => (
                  <TableRow key={request.id}>
                    <TableCell className="font-medium">
                      <div className="flex flex-col">
                        <span>{request.students?.name || 'Unknown'}</span>
                        <Badge 
                          variant={request.type === 'join' ? 'default' : 'secondary'}
                          className="sm:hidden w-fit mt-1"
                        >
                          {request.type}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">
                      <Badge variant={request.type === 'join' ? 'default' : 'secondary'}>
                        {request.type}
                      </Badge>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      {request.type === 'join' 
                        ? (request.teams?.name || 'Unknown Team')
                        : (request.team_name || 'New Team')
                      }
                    </TableCell>
                    <TableCell>{getStatusBadge(request.status)}</TableCell>
                    <TableCell className="hidden lg:table-cell max-w-xs truncate">
                      {request.message || '-'}
                    </TableCell>
                    <TableCell>
                      {request.status === 'pending' && (
                        <div className="flex flex-col sm:flex-row gap-2">
                          <Button
                            size="sm"
                            onClick={() => handleApprove(request.id)}
                            className="w-full sm:w-auto"
                          >
                            <Check className="h-3 w-3 sm:mr-1" />
                            <span className="hidden sm:inline">Approve</span>
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleDeny(request.id)}
                            className="w-full sm:w-auto"
                          >
                            <X className="h-3 w-3 sm:mr-1" />
                            <span className="hidden sm:inline">Deny</span>
                          </Button>
                        </div>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
};