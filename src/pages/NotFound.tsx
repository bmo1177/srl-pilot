import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Home, AlertCircle } from "lucide-react";

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-[calc(100vh-16rem)] items-center justify-center">
      <div className="glass-strong rounded-2xl p-12 border border-destructive/30 text-center max-w-lg">
        <AlertCircle className="h-16 w-16 text-destructive mx-auto mb-6" />
        <h1 className="mb-4 text-6xl font-bold gradient-text">404</h1>
        <p className="mb-8 text-xl text-muted-foreground">
          Oops! This page doesn't exist
        </p>
        <Button 
          onClick={() => navigate("/")}
          size="lg"
          className="bg-gradient-to-r from-primary to-accent hover:shadow-lg hover:shadow-primary/30 transition-smooth"
        >
          <Home className="mr-2 h-5 w-5" />
          Return to Home
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
