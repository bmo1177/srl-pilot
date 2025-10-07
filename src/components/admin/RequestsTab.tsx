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
  student?: {
    name: string;
    email: string;
  };
  team?: {
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
      const { data: requestsData, error: requestsError } = await supabase
        .from('requests')
        .select('*')
        .order('created_at', { ascending: false });

      if (requestsError) throw requestsError;

      // Fetch related data
      const { data: studentsData, error: studentsError } = await supabase
        .from('students')
        .select('id, name, email');

      if (studentsError) throw studentsError;

      const { data: teamsData, error: teamsError } = await supabase
        .from('teams')
        .select('id, name');

      if (teamsError) throw teamsError;

      // Enrich requests
      const enrichedRequests = (requestsData || []).map(request => ({
        ...request,
        student: studentsData?.find(s => s.id === request.student_id),
        team: request.team_id ? teamsData?.find(t => t.id === request.team_id) : undefined
      }));

      setRequests(enrichedRequests);
    } catch (error: any) {
      toast.error("Failed to load requests: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleApproveRequest = async (request: Request) => {
    try {
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

        // Add student to team members
        const { error: memberError } = await supabase
          .from('team_members')
          .insert([{
            team_id: newTeam.id,
            student_id: request.student_id
          }]);

        if (memberError) throw memberError;
      } else if (request.type === "join" && request.team_id) {
        // Add student to existing team
        const { error: memberError } = await supabase
          .from('team_members')
          .insert([{
            team_id: request.team_id,
            student_id: request.student_id
          }]);

        if (memberError) throw memberError;
      }

      // Update request status
      const { error: requestError } = await supabase
        .from('requests')
        .update({ status: 'approved' })
        .eq('id', request.id);

      if (requestError) throw requestError;

      // Update student status
      const { error: studentError } = await supabase
        .from('students')
        .update({ status: 'in_team' })
        .eq('id', request.student_id);

      if (studentError) throw studentError;

      toast.success("Request approved successfully");
    } catch (error: any) {
      toast.error("Failed to approve request: " + error.message);
    }
  };

  const handleDenyRequest = async (requestId: string, studentId: string) => {
    try {
      // Update request status
      const { error: requestError } = await supabase
        .from('requests')
        .update({ status: 'denied' })
        .eq('id', requestId);

      if (requestError) throw requestError;

      // Update student status back to free
      const { error: studentError } = await supabase
        .from('students')
        .update({ status: 'free' })
        .eq('id', studentId);

      if (studentError) throw studentError;

      toast.success("Request denied");
    } catch (error: any) {
      toast.error("Failed to deny request: " + error.message);
    }
  };

  const pendingRequests = requests.filter(r => r.status === 'pending');
  const processedRequests = requests.filter(r => r.status !== 'pending');

  return (
    <div className="space-y-6">
      {/* Pending Requests */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Pending Requests</CardTitle>
              <CardDescription>Review and approve/deny team requests</CardDescription>
            </div>
            <Button onClick={() => fetchRequests()} variant="outline" size="sm">
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p>Loading requests...</p>
          ) : pendingRequests.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">No pending requests</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Student</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Details</TableHead>
                  <TableHead>Message</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pendingRequests.map((request) => (
                  <TableRow key={request.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{request.student?.name}</p>
                        <p className="text-sm text-muted-foreground">{request.student?.email}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={request.type === 'create' ? 'default' : 'secondary'}>
                        {request.type === 'create' ? 'Create Team' : 'Join Team'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {request.type === 'create' ? (
                        <span className="font-medium">{request.team_name}</span>
                      ) : (
                        <span>{request.team?.name}</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <p className="text-sm text-muted-foreground max-w-xs truncate">
                        {request.message || '-'}
                      </p>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex gap-2 justify-end">
                        <Button
                          onClick={() => handleApproveRequest(request)}
                          size="sm"
                          className="gap-1"
                        >
                          <Check className="h-3 w-3" />
                          Approve
                        </Button>
                        <Button
                          onClick={() => handleDenyRequest(request.id, request.student_id)}
                          variant="destructive"
                          size="sm"
                          className="gap-1"
                        >
                          <X className="h-3 w-3" />
                          Deny
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Processed Requests */}
      {processedRequests.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Request History</CardTitle>
            <CardDescription>Previously processed requests</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Student</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Details</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {processedRequests.slice(0, 10).map((request) => (
                  <TableRow key={request.id}>
                    <TableCell>{request.student?.name}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{request.type}</Badge>
                    </TableCell>
                    <TableCell>
                      {request.type === 'create' ? request.team_name : request.team?.name}
                    </TableCell>
                    <TableCell>
                      <Badge variant={request.status === 'approved' ? 'default' : 'destructive'}>
                        {request.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {new Date(request.created_at).toLocaleDateString()}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
