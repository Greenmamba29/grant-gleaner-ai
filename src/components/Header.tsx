import { Button } from "@/components/ui/button";
import { Search, Target, TrendingUp, Shield } from "lucide-react";

const Header = () => {
  return (
    <header className="bg-card border-b border-border shadow-soft">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-hero rounded-lg flex items-center justify-center">
              <Target className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">Grant Hunter Pro</h1>
              <p className="text-xs text-muted-foreground">AI Funding Acquisition</p>
            </div>
          </div>
          
          <nav className="hidden md:flex items-center space-x-8">
            <a href="#dashboard" className="text-foreground hover:text-primary transition-colors font-medium">
              Dashboard
            </a>
            <a href="#opportunities" className="text-foreground hover:text-primary transition-colors font-medium">
              Opportunities
            </a>
            <a href="#analytics" className="text-foreground hover:text-primary transition-colors font-medium">
              Analytics
            </a>
            <a href="#applications" className="text-foreground hover:text-primary transition-colors font-medium">
              Applications
            </a>
          </nav>
          
          <div className="flex items-center space-x-3">
            <Button variant="ghost" size="sm">
              Sign In
            </Button>
            <Button variant="hero" size="sm">
              Start Free Trial
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;