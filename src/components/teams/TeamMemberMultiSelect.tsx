import { useState, useEffect } from "react";
import { Check, ChevronsUpDown, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";

interface Student {
  id: string;
  name: string;
  email: string;
  status: string;
}

interface TeamMemberMultiSelectProps {
  selectedMembers: string[];
  onMembersChange: (members: string[]) => void;
  maxMembers?: number;
  excludeLeader?: string;
}

export const TeamMemberMultiSelect = ({
  selectedMembers,
  onMembersChange,
  maxMembers = 4,
  excludeLeader,
}: TeamMemberMultiSelectProps) => {
  const [open, setOpen] = useState(false);
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAvailableStudents();
  }, [excludeLeader]);

  const fetchAvailableStudents = async () => {
    try {
      setLoading(true);
      
      // Fetch all students who are active (not in a team)
      const { data, error } = await supabase
        .from("students")
        .select("id, name, university_email, status")
        .eq("status", "active")
        .eq("archived", false)
        .order("name");

      if (error) throw error;

      // Filter out the leader if provided and map to our interface
      let filteredData = (data || []).map(s => ({
        id: s.id,
        name: s.name,
        email: s.university_email || '',
        status: s.status
      }));
      
      if (excludeLeader) {
        filteredData = filteredData.filter(s => s.id !== excludeLeader);
      }

      setStudents(filteredData);
    } catch (error) {
      console.error("Error fetching students:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelect = (studentId: string) => {
    if (selectedMembers.includes(studentId)) {
      onMembersChange(selectedMembers.filter((id) => id !== studentId));
    } else if (selectedMembers.length < maxMembers) {
      onMembersChange([...selectedMembers, studentId]);
    }
  };

  const handleRemove = (studentId: string) => {
    onMembersChange(selectedMembers.filter((id) => id !== studentId));
  };

  const getStudentName = (id: string) => {
    return students.find((s) => s.id === id)?.name || "Unknown";
  };

  return (
    <div className="space-y-2">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between"
            disabled={selectedMembers.length >= maxMembers}
          >
            {selectedMembers.length === 0
              ? "Select team members..."
              : `${selectedMembers.length} member${selectedMembers.length !== 1 ? 's' : ''} selected`}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0">
          <Command>
            <CommandInput placeholder="Search students..." />
            <CommandEmpty>
              {loading ? "Loading students..." : "No available students found."}
            </CommandEmpty>
            <CommandGroup className="max-h-64 overflow-auto">
              {students.map((student) => {
                const isSelected = selectedMembers.includes(student.id);
                const isDisabled = !isSelected && selectedMembers.length >= maxMembers;

                return (
                  <CommandItem
                    key={student.id}
                    value={student.name}
                    onSelect={() => {
                      if (!isDisabled) {
                        handleSelect(student.id);
                      }
                    }}
                    disabled={isDisabled}
                    className={cn(
                      isDisabled && "opacity-50 cursor-not-allowed"
                    )}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        isSelected ? "opacity-100" : "opacity-0"
                      )}
                    />
                    <div className="flex flex-col">
                      <span>{student.name}</span>
                      <span className="text-xs text-muted-foreground">
                        {student.email}
                      </span>
                    </div>
                  </CommandItem>
                );
              })}
            </CommandGroup>
          </Command>
        </PopoverContent>
      </Popover>

      {selectedMembers.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-2">
          {selectedMembers.map((memberId) => (
            <Badge key={memberId} variant="secondary" className="gap-1 pr-1">
              {getStudentName(memberId)}
              <button
                onClick={() => handleRemove(memberId)}
                className="ml-1 rounded-full hover:bg-muted p-0.5"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
        </div>
      )}

      <p className="text-sm text-muted-foreground">
        {selectedMembers.length}/{maxMembers} members selected
      </p>
    </div>
  );
};
