import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Target } from "lucide-react";

const Header = () => {
  return (
    <header className="bg-card border-b border-border shadow-soft">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-hero rounded-lg flex items-center justify-center">
              <Target className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">Grant Hunter Pro</h1>
              <p className="text-xs text-muted-foreground">AI Funding Acquisition</p>
            </div>
          </Link>
          
          <nav className="hidden md:flex items-center space-x-8">
            <Link to="/search" className="text-foreground hover:text-primary transition-colors font-medium">
              Search Grants
            </Link>
            <Link to="/search" className="text-foreground hover:text-primary transition-colors font-medium">
              Opportunities
            </Link>
            <a href="#features" className="text-foreground hover:text-primary transition-colors font-medium">
              Features
            </a>
            <a href="#dashboard" className="text-foreground hover:text-primary transition-colors font-medium">
              Dashboard
            </a>
          </nav>
          
          <div className="flex items-center space-x-3">
            <Link to="/search">
              <Button variant="hero" size="sm">
                Start Hunting
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
