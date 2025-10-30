import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CheckCircle2, Circle, Plus, Calendar } from "lucide-react";
import { format } from "date-fns";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface ActionPlanManagerProps {
  studentId: string;
  tasks: Array<{
    id: string;
    task_title: string;
    description: string | null;
    deadline: string | null;
    owner: string | null;
    status: string;
  }>;
  onRefresh: () => void;
}

export const ActionPlanManager = ({ studentId, tasks, onRefresh }: ActionPlanManagerProps) => {
  const [updating, setUpdating] = useState<string | null>(null);

  const handleToggleTask = async (taskId: string, currentStatus: string) => {
    setUpdating(taskId);
    const newStatus = currentStatus === "completed" ? "pending" : "completed";

    const { error } = await supabase
      .from("student_action_plans")
      .update({ status: newStatus })
      .eq("id", taskId);

    if (error) {
      toast.error("Failed to update task");
      console.error(error);
    } else {
      toast.success(newStatus === "completed" ? "Task completed!" : "Task reopened");
      onRefresh();
    }
    setUpdating(null);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge className="bg-secondary">Completed</Badge>;
      case "in_progress":
        return <Badge className="bg-primary">In Progress</Badge>;
      case "cancelled":
        return <Badge variant="destructive">Cancelled</Badge>;
      default:
        return <Badge variant="outline">Pending</Badge>;
    }
  };

  return (
    <Card className="glass-strong p-6 border border-primary/20">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold gradient-text">Action Plan & Tasks</h3>
        <Button size="sm" variant="outline" className="gap-2">
          <Plus className="h-4 w-4" />
          Add Task
        </Button>
      </div>

      <ScrollArea className="h-[300px] pr-4">
        {tasks.length === 0 ? (
          <div className="h-full flex items-center justify-center text-muted-foreground">
            No tasks assigned yet
          </div>
        ) : (
          <div className="space-y-3">
            {tasks.map((task) => (
              <div
                key={task.id}
                className="glass p-4 rounded-lg border border-border hover:border-primary/30 transition-all"
              >
                <div className="flex items-start gap-3">
                  <Checkbox
                    checked={task.status === "completed"}
                    disabled={updating === task.id}
                    onCheckedChange={() => handleToggleTask(task.id, task.status)}
                    className="mt-1"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h4
                        className={`font-medium text-sm ${
                          task.status === "completed"
                            ? "line-through text-muted-foreground"
                            : ""
                        }`}
                      >
                        {task.task_title}
                      </h4>
                      {getStatusBadge(task.status)}
                    </div>
                    {task.description && (
                      <p className="text-xs text-muted-foreground mb-2">
                        {task.description}
                      </p>
                    )}
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      {task.deadline && (
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {format(new Date(task.deadline), "MMM dd, yyyy")}
                        </div>
                      )}
                      {task.owner && <span>Owner: {task.owner}</span>}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </ScrollArea>
    </Card>
  );
};
