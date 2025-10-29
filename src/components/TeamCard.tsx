import { Users, UserCircle } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface TeamMember {
  id: string;
  student_id: string;
  role?: string;
  students?: {
    name: string;
  };
}

interface TeamCardProps {
  id: string;
  name: string;
  logo_url?: string;
  memberCount: number;
  members?: TeamMember[];
  onClick?: () => void;
}

export function TeamCard({ id, name, logo_url, memberCount, members, onClick }: TeamCardProps) {
  const progress = (memberCount / 5) * 100;
  
  return (
    <Card 
      className="card-modern cursor-pointer group"
      onClick={onClick}
    >
      <CardHeader className="space-y-4">
        <div className="flex items-start gap-4">
          {logo_url ? (
            <Avatar className="h-16 w-16 rounded-xl border-2 border-primary/20">
              <AvatarImage src={logo_url} alt={name} className="object-cover" />
              <AvatarFallback className="rounded-xl bg-gradient-to-br from-primary/20 to-secondary/20">
                <Users className="h-8 w-8 text-primary" />
              </AvatarFallback>
            </Avatar>
          ) : (
            <div className="h-16 w-16 rounded-xl glass-strong flex items-center justify-center border-2 border-primary/20">
              <Users className="h-8 w-8 text-primary" />
            </div>
          )}
          
          <div className="flex-1 min-w-0">
            <CardTitle className="text-xl font-bold truncate group-hover:text-primary transition-smooth">
              {name}
            </CardTitle>
            <CardDescription className="flex items-center gap-2 mt-1">
              <UserCircle className="h-4 w-4" />
              {memberCount} / 5 Members
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Team Capacity</span>
            <span className="font-medium text-primary">{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
        
        {/* Member Preview */}
        {members && members.length > 0 && (
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">Members:</p>
            <div className="flex flex-wrap gap-2">
              {members.slice(0, 3).map((member) => (
                <Badge 
                  key={member.id} 
                  variant="secondary"
                  className="bg-primary/10 text-primary hover:bg-primary/20"
                >
                  {member.students?.name || 'Unknown'}
                  {member.role && member.role !== 'Member' && (
                    <span className="ml-1 text-xs opacity-70">• {member.role}</span>
                  )}
                </Badge>
              ))}
              {members.length > 3 && (
                <Badge variant="outline" className="border-primary/20">
                  +{members.length - 3} more
                </Badge>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
