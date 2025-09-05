import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Target, DollarSign, Clock, Shield } from "lucide-react";
import heroImage from "@/assets/hero-funding.jpg";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen bg-gradient-to-br from-background via-background to-muted overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-gradient-to-r from-primary to-success opacity-10"></div>
      </div>
      
      <div className="container mx-auto px-6 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - Content */}
          <div className="space-y-8">
            <Badge variant="secondary" className="w-fit px-4 py-2">
              <TrendingUp className="w-4 h-4 mr-2" />
              AI-Powered Funding Discovery
            </Badge>
            
            <div className="space-y-6">
              <h1 className="text-5xl lg:text-6xl font-bold text-foreground leading-tight">
                Maximize{" "}
                <span className="bg-gradient-hero bg-clip-text text-transparent">
                  Non-Dilutive
                </span>{" "}
                Funding
              </h1>
              
              <p className="text-xl text-muted-foreground leading-relaxed max-w-xl">
                Discover, analyze, and secure grants with our elite AI funding acquisition specialist. 
                Preserve equity while extending runway through strategic grant hunting.
              </p>
            </div>
            
            {/* Stats */}
            <div className="grid grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-success">$500M+</div>
                <div className="text-sm text-muted-foreground">Funding Secured</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary">2,500+</div>
                <div className="text-sm text-muted-foreground">Opportunities Found</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-warning">85%</div>
                <div className="text-sm text-muted-foreground">Success Rate</div>
              </div>
            </div>
            
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button variant="hero" size="lg" className="text-lg px-8 py-6">
                <Target className="w-5 h-5 mr-2" />
                Start Hunting Grants
              </Button>
              <Button variant="outline" size="lg" className="text-lg px-8 py-6">
                <DollarSign className="w-5 h-5 mr-2" />
                View Success Stories
              </Button>
            </div>
            
            {/* Trust Indicators */}
            <div className="flex items-center gap-6 pt-6">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Avg. 48hr opportunity discovery</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">SOC 2 Compliant</span>
              </div>
            </div>
          </div>
          
          {/* Right Column - Hero Image */}
          <div className="relative">
            <div className="relative overflow-hidden rounded-2xl shadow-premium">
              <img 
                src={heroImage} 
                alt="Grant Hunter Pro Dashboard" 
                className="w-full h-auto object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/20 to-transparent"></div>
            </div>
            
            {/* Floating Cards */}
            <div className="absolute -top-4 -right-4 bg-card border border-border rounded-lg p-4 shadow-elegant animate-float">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-success rounded-full animate-pulse"></div>
                <div>
                  <div className="text-sm font-medium text-foreground">New Grant Found</div>
                  <div className="text-xs text-muted-foreground">$2.5M SBIR Phase II</div>
                </div>
              </div>
            </div>
            
            <div className="absolute -bottom-4 -left-4 bg-card border border-border rounded-lg p-4 shadow-elegant animate-float" style={{animationDelay: '1s'}}>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-success rounded-full flex items-center justify-center">
                  <TrendingUp className="w-4 h-4 text-white" />
                </div>
                <div>
                  <div className="text-sm font-medium text-foreground">95% Match Score</div>
                  <div className="text-xs text-muted-foreground">AI Recommendation</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;