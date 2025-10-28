import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { Target, Users, Calendar, Sparkles, UserPlus } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-[calc(100vh-8rem)]">
      {/* Hero Section */}
      <section className="relative min-h-[60vh] flex items-center justify-center py-12 px-4">
        <div className="max-w-6xl mx-auto text-center space-y-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-primary/20 mb-4">
            <Sparkles className="h-4 w-4 text-primary" />
            <span className="text-xs sm:text-sm font-medium">Self-Responsible Learning Platform</span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold gradient-text">
            TP Teams Platform
          </h1>
          
          <p className="text-lg sm:text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto px-4">
            Build your mobile learning app with <strong>Autonomy</strong>, <strong>Responsibility</strong>, and <strong>Planning</strong>
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8 px-4">
            <Button 
              onClick={() => navigate("/teams")}
              size="lg"
              className="bg-gradient-to-r from-primary to-accent hover:shadow-lg hover:shadow-primary/30 transition-smooth text-base sm:text-lg px-6 sm:px-8 w-full sm:w-auto"
            >
              <Users className="mr-2 h-5 w-5" />
              View All Teams
            </Button>
            <Button 
              onClick={() => navigate("/request")}
              size="lg"
              variant="outline"
              className="glass border-primary/30 hover:border-primary transition-smooth text-base sm:text-lg px-6 sm:px-8 w-full sm:w-auto"
            >
              <UserPlus className="mr-2 h-5 w-5" />
              Join/Create Team
            </Button>
          </div>
        </div>
      </section>

      {/* SRL Values Section */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-4 gradient-text">
            SRL Core Values
          </h2>
          <p className="text-center text-muted-foreground mb-12 text-sm sm:text-base">
            Self-Responsible Learning principles that guide this project
          </p>

          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
            <Card className="glass-strong p-6 hover:shadow-xl transition-all border-primary/20 hover:border-primary/40 hover:scale-105">
              <div className="mb-4 w-12 h-12 rounded-lg bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center">
                <Target className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2">Autonomy</h3>
              <p className="text-muted-foreground">
                Take ownership of your learning journey. Make independent decisions and manage your own progress.
              </p>
            </Card>

            <Card className="glass-strong p-6 hover:shadow-xl transition-all border-secondary/20 hover:border-secondary/40 hover:scale-105">
              <div className="mb-4 w-12 h-12 rounded-lg bg-gradient-to-br from-secondary/20 to-secondary/10 flex items-center justify-center">
                <Users className="h-6 w-6 text-secondary" />
              </div>
              <h3 className="text-xl font-bold mb-2">Responsibility</h3>
              <p className="text-muted-foreground">
                Be accountable for your contributions. Support your team and commit to shared goals.
              </p>
            </Card>

            <Card className="glass-strong p-6 hover:shadow-xl transition-all border-accent/20 hover:border-accent/40 hover:scale-105">
              <div className="mb-4 w-12 h-12 rounded-lg bg-gradient-to-br from-accent/20 to-accent/10 flex items-center justify-center">
                <Calendar className="h-6 w-6 text-accent" />
              </div>
              <h3 className="text-xl font-bold mb-2">Planning</h3>
              <p className="text-muted-foreground">
                Set clear objectives and timelines. Organize your work and track your team's progress.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Project Overview */}
      <section className="py-16 px-4">
        <div className="max-w-3xl mx-auto">
          <Card className="glass-strong p-6 sm:p-8 border border-primary/20">
            <h2 className="text-2xl font-bold mb-4 gradient-text">About This TP</h2>
            <p className="text-muted-foreground mb-4">
              This practical work focuses on developing a mobile learning application that embodies 
              Self-Responsible Learning principles. Students form teams of 3-5 members to design and 
              build innovative educational solutions.
            </p>
            <p className="text-muted-foreground mb-6">
              Each team elects a leader who coordinates efforts and ensures effective collaboration. 
              Through this platform, you can browse existing teams, submit join requests, or create 
              your own team to begin your journey.
            </p>
            <div className="flex gap-4 flex-wrap">
              <Button onClick={() => navigate("/teams")} className="bg-gradient-to-r from-primary to-accent">
                Explore Teams
              </Button>
            </div>
          </Card>
        </div>
      </section>
    </div>
  );
};

export default Index;
