import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface Student {
  id: string;
  name: string;
  university_email: string;
  created_at: string;
}

/**
 * Detects and removes duplicate students based on name or email
 * Keeps the oldest record (first created) and merges relationships
 */
export async function detectAndRemoveDuplicates(): Promise<{
  duplicatesFound: number;
  duplicatesRemoved: number;
}> {
  try {
    // Fetch all students
    const { data: students, error: fetchError } = await supabase
      .from("students")
      .select("id, name, university_email, created_at")
      .order("created_at", { ascending: true });

    if (fetchError) throw fetchError;
    if (!students || students.length === 0) {
      return { duplicatesFound: 0, duplicatesRemoved: 0 };
    }

    // Find duplicates by name or email
    const duplicateGroups: Student[][] = [];
    const processed = new Set<string>();

    for (let i = 0; i < students.length; i++) {
      const student = students[i];
      if (processed.has(student.id)) continue;

      const duplicates: Student[] = [student];
      processed.add(student.id);

      for (let j = i + 1; j < students.length; j++) {
        const other = students[j];
        if (processed.has(other.id)) continue;

        // Check if duplicate by name or email
        if (
          student.name.toLowerCase().trim() === other.name.toLowerCase().trim() ||
          student.university_email.toLowerCase() === other.university_email.toLowerCase()
        ) {
          duplicates.push(other);
          processed.add(other.id);
        }
      }

      if (duplicates.length > 1) {
        duplicateGroups.push(duplicates);
      }
    }

    if (duplicateGroups.length === 0) {
      toast.info("No duplicate students found");
      return { duplicatesFound: 0, duplicatesRemoved: 0 };
    }

    let totalRemoved = 0;

    // Process each group of duplicates
    for (const group of duplicateGroups) {
      const keepStudent = group[0]; // Keep the oldest (first created)
      const removeIds = group.slice(1).map((s) => s.id);

      // Update relationships to point to the kept student
      // 1. Update team_members
      await supabase
        .from("team_members")
        .update({ student_id: keepStudent.id })
        .in("student_id", removeIds);

      // 2. Update requests
      await supabase
        .from("requests")
        .update({ student_id: keepStudent.id })
        .in("student_id", removeIds);

      // 3. Update student_metrics
      await supabase
        .from("student_metrics")
        .update({ student_id: keepStudent.id })
        .in("student_id", removeIds);

      // 4. Update student_reflections
      await supabase
        .from("student_reflections")
        .update({ student_id: keepStudent.id })
        .in("student_id", removeIds);

      // 5. Update student_action_plans
      await supabase
        .from("student_action_plans")
        .update({ student_id: keepStudent.id })
        .in("student_id", removeIds);

      // 6. Update metric_history
      await supabase
        .from("metric_history")
        .update({ student_id: keepStudent.id })
        .in("student_id", removeIds);

      // Now delete the duplicate students
      const { error: deleteError } = await supabase
        .from("students")
        .delete()
        .in("id", removeIds);

      if (deleteError) {
        console.error("Error deleting duplicates:", deleteError);
      } else {
        totalRemoved += removeIds.length;
      }
    }

    return {
      duplicatesFound: duplicateGroups.reduce((sum, group) => sum + group.length - 1, 0),
      duplicatesRemoved: totalRemoved,
    };
  } catch (error) {
    console.error("Error detecting duplicates:", error);
    throw error;
  }
}

/**
 * Export all students data as JSON
 */
export async function exportStudentsJSON() {
  try {
    const { data: students, error } = await supabase
      .from("students")
      .select(`
        *,
        team_members(
          team:teams(name),
          role
        ),
        student_metrics(*),
        student_reflections(*),
        student_action_plans(*)
      `)
      .order("name");

    if (error) throw error;

    const dataStr = JSON.stringify(students, null, 2);
    const dataUri = `data:application/json;charset=utf-8,${encodeURIComponent(dataStr)}`;
    const fileName = `all_students_${new Date().toISOString().split("T")[0]}.json`;

    const linkElement = document.createElement("a");
    linkElement.setAttribute("href", dataUri);
    linkElement.setAttribute("download", fileName);
    linkElement.click();

    toast.success("Students data exported successfully");
  } catch (error) {
    console.error("Error exporting students:", error);
    toast.error("Failed to export students data");
  }
}

/**
 * Export all students data as CSV
 */
export async function exportStudentsCSV() {
  try {
    const { data: students, error } = await supabase
      .from("students")
      .select(`
        *,
        team_members(
          team:teams(name),
          role
        ),
        student_metrics(*)
      `)
      .order("name");

    if (error) throw error;

    // Create CSV headers
    const headers = [
      "ID",
      "Name",
      "University Email",
      "Personal Email",
      "Status",
      "Team",
      "Role",
      "SRL Score",
      "Technical Skills",
      "Collaboration",
      "Adaptability",
      "Consistency",
      "Problem Solving",
      "Created At",
    ];

    // Create CSV rows
    const rows = students.map((student: any) => {
      const team = student.team_members?.[0];
      const metrics = student.student_metrics?.[0];
      return [
        student.id,
        student.name,
        student.university_email,
        student.personal_email || "",
        student.status,
        team?.team?.name || "",
        team?.role || "",
        metrics?.srl_score || 0,
        metrics?.technical_skills || 0,
        metrics?.collaboration || 0,
        metrics?.adaptability || 0,
        metrics?.consistency || 0,
        metrics?.problem_solving || 0,
        student.created_at,
      ];
    });

    // Combine headers and rows
    const csvContent = [
      headers.join(","),
      ...rows.map((row) => row.map((cell) => `"${cell}"`).join(",")),
    ].join("\n");

    const dataUri = `data:text/csv;charset=utf-8,${encodeURIComponent(csvContent)}`;
    const fileName = `all_students_${new Date().toISOString().split("T")[0]}.csv`;

    const linkElement = document.createElement("a");
    linkElement.setAttribute("href", dataUri);
    linkElement.setAttribute("download", fileName);
    linkElement.click();

    toast.success("Students data exported as CSV");
  } catch (error) {
    console.error("Error exporting CSV:", error);
    toast.error("Failed to export CSV");
  }
}
