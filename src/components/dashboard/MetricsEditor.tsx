import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Save, Edit2, X } from "lucide-react";

interface MetricsEditorProps {
  studentId: string;
  metrics: {
    technical_skills: number;
    collaboration: number;
    adaptability: number;
    consistency: number;
    problem_solving: number;
    srl_score: number;
  };
  onUpdate: () => void;
}

export const MetricsEditor = ({ studentId, metrics, onUpdate }: MetricsEditorProps) => {
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    technical_skills: metrics?.technical_skills || 0,
    collaboration: metrics?.collaboration || 0,
    adaptability: metrics?.adaptability || 0,
    consistency: metrics?.consistency || 0,
    problem_solving: metrics?.problem_solving || 0,
    srl_score: metrics?.srl_score || 0,
  });

  const handleSave = async () => {
    setLoading(true);
    try {
      // Validate all values are between 0 and 100
      const values = Object.values(formData);
      if (values.some(v => v < 0 || v > 100)) {
        toast.error("All metrics must be between 0 and 100");
        setLoading(false);
        return;
      }

      // Update student_metrics table
      const { error } = await supabase
        .from("student_metrics")
        .update(formData)
        .eq("student_id", studentId);

      if (error) throw error;

      toast.success("Metrics updated successfully");
      setEditing(false);
      onUpdate();
    } catch (error: any) {
      console.error("Error updating metrics:", error);
      toast.error(error.message || "Failed to update metrics");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      technical_skills: metrics?.technical_skills || 0,
      collaboration: metrics?.collaboration || 0,
      adaptability: metrics?.adaptability || 0,
      consistency: metrics?.consistency || 0,
      problem_solving: metrics?.problem_solving || 0,
      srl_score: metrics?.srl_score || 0,
    });
    setEditing(false);
  };

  return (
    <Card className="glass-strong p-6 border border-primary/20">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold gradient-text">Edit Metrics</h3>
        {!editing ? (
          <Button onClick={() => setEditing(true)} variant="outline" size="sm" className="gap-2">
            <Edit2 className="h-4 w-4" />
            Edit
          </Button>
        ) : (
          <div className="flex gap-2">
            <Button onClick={handleCancel} variant="outline" size="sm" disabled={loading}>
              <X className="h-4 w-4" />
            </Button>
            <Button onClick={handleSave} size="sm" disabled={loading} className="gap-2">
              <Save className="h-4 w-4" />
              Save
            </Button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="technical_skills">Technical Skills (0-100)</Label>
          <Input
            id="technical_skills"
            type="number"
            min="0"
            max="100"
            value={formData.technical_skills}
            onChange={(e) => setFormData({ ...formData, technical_skills: parseInt(e.target.value) || 0 })}
            disabled={!editing}
            className={!editing ? "bg-muted" : ""}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="collaboration">Collaboration (0-100)</Label>
          <Input
            id="collaboration"
            type="number"
            min="0"
            max="100"
            value={formData.collaboration}
            onChange={(e) => setFormData({ ...formData, collaboration: parseInt(e.target.value) || 0 })}
            disabled={!editing}
            className={!editing ? "bg-muted" : ""}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="adaptability">Adaptability (0-100)</Label>
          <Input
            id="adaptability"
            type="number"
            min="0"
            max="100"
            value={formData.adaptability}
            onChange={(e) => setFormData({ ...formData, adaptability: parseInt(e.target.value) || 0 })}
            disabled={!editing}
            className={!editing ? "bg-muted" : ""}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="consistency">Consistency (0-100)</Label>
          <Input
            id="consistency"
            type="number"
            min="0"
            max="100"
            value={formData.consistency}
            onChange={(e) => setFormData({ ...formData, consistency: parseInt(e.target.value) || 0 })}
            disabled={!editing}
            className={!editing ? "bg-muted" : ""}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="problem_solving">Problem Solving (0-100)</Label>
          <Input
            id="problem_solving"
            type="number"
            min="0"
            max="100"
            value={formData.problem_solving}
            onChange={(e) => setFormData({ ...formData, problem_solving: parseInt(e.target.value) || 0 })}
            disabled={!editing}
            className={!editing ? "bg-muted" : ""}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="srl_score">SRL Score (0-100)</Label>
          <Input
            id="srl_score"
            type="number"
            min="0"
            max="100"
            value={formData.srl_score}
            onChange={(e) => setFormData({ ...formData, srl_score: parseInt(e.target.value) || 0 })}
            disabled={!editing}
            className={!editing ? "bg-muted" : ""}
          />
        </div>
      </div>
    </Card>
  );
};
