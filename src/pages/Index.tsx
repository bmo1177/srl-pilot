import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { Target, Users, Calendar, ArrowRight } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/10 via-background to-secondary/10">
        <div className="container mx-auto px-4 py-20 md:py-32">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary via-primary to-secondary bg-clip-text text-transparent">
              Mobile Development TP
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-8">
              Team Management Platform
            </p>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              Build your mobile learning app using Self-Responsible Learning (SRL) principles. 
              Form teams, collaborate, and create something amazing together.
            </p>
            <div className="flex gap-4 justify-center flex-wrap">
              <Link to="/teams">
                <Button size="lg" className="gap-2 shadow-lg">
                  View Teams
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link to="/admin">
                <Button size="lg" variant="outline" className="gap-2">
                  Admin Login
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-secondary/10 rounded-full blur-3xl" />
      </section>

      {/* SRL Values Section */}
      <section className="py-20 bg-card/50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
              SRL Core Values
            </h2>
            <p className="text-center text-muted-foreground mb-12">
              Self-Responsible Learning principles that guide this project
            </p>

            <div className="grid md:grid-cols-3 gap-6">
              <Card className="p-6 hover:shadow-xl transition-all border-primary/20 hover:border-primary/40">
                <div className="mb-4 w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Target className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-2">Autonomy</h3>
                <p className="text-muted-foreground">
                  Take ownership of your learning journey. Make independent decisions and manage your own progress.
                </p>
              </Card>

              <Card className="p-6 hover:shadow-xl transition-all border-secondary/20 hover:border-secondary/40">
                <div className="mb-4 w-12 h-12 rounded-lg bg-secondary/10 flex items-center justify-center">
                  <Users className="h-6 w-6 text-secondary" />
                </div>
                <h3 className="text-xl font-bold mb-2">Responsibility</h3>
                <p className="text-muted-foreground">
                  Be accountable for your contributions. Support your team and commit to shared goals.
                </p>
              </Card>

              <Card className="p-6 hover:shadow-xl transition-all border-accent/20 hover:border-accent/40">
                <div className="mb-4 w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center">
                  <Calendar className="h-6 w-6 text-accent" />
                </div>
                <h3 className="text-xl font-bold mb-2">Planning</h3>
                <p className="text-muted-foreground">
                  Set clear objectives and timelines. Organize your work and track your team's progress.
                </p>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Project Overview */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <Card className="p-8 bg-gradient-to-br from-card to-card/50">
              <h2 className="text-2xl font-bold mb-4">About This TP</h2>
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
                <Link to="/teams">
                  <Button variant="default">Explore Teams</Button>
                </Link>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-8 bg-card/30">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>Mobile Development TP • Self-Responsible Learning Platform</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
