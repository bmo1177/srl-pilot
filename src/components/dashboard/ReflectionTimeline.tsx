import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { BookOpen, Calendar } from "lucide-react";
import { format } from "date-fns";

interface ReflectionTimelineProps {
  reflections: Array<{
    id: string;
    reflection_text: string;
    milestone: string | null;
    created_at: string;
  }>;
}

export const ReflectionTimeline = ({ reflections }: ReflectionTimelineProps) => {
  return (
    <Card className="glass-strong p-6 border border-primary/20">
      <div className="flex items-center gap-2 mb-4">
        <BookOpen className="h-5 w-5 text-primary" />
        <h3 className="text-xl font-bold gradient-text">Reflections & Journals</h3>
      </div>

      <ScrollArea className="h-[300px] pr-4">
        {reflections.length === 0 ? (
          <div className="h-full flex items-center justify-center text-muted-foreground">
            No reflections yet
          </div>
        ) : (
          <div className="space-y-4">
            {reflections.map((reflection) => (
              <div
                key={reflection.id}
                className="border-l-2 border-primary/30 pl-4 pb-4 last:pb-0"
              >
                <div className="flex items-center gap-2 mb-2">
                  <Calendar className="h-3 w-3 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">
                    {format(new Date(reflection.created_at), "MMM dd, yyyy")}
                  </span>
                  {reflection.milestone && (
                    <Badge variant="outline" className="text-xs">
                      {reflection.milestone}
                    </Badge>
                  )}
                </div>
                <p className="text-sm text-foreground leading-relaxed">
                  {reflection.reflection_text}
                </p>
              </div>
            ))}
          </div>
        )}
      </ScrollArea>
    </Card>
  );
};
