import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Search, 
  Brain, 
  Target, 
  TrendingUp, 
  Clock, 
  Shield,
  Database,
  FileText,
  BarChart3
} from "lucide-react";

const features = [
  {
    icon: <Search className="w-8 h-8" />,
    title: "Smart Discovery Engine",
    description: "Continuously scan 50+ federal, state, and private funding databases with AI-powered pattern recognition.",
    badge: "Real-time",
    color: "bg-primary"
  },
  {
    icon: <Brain className="w-8 h-8" />,
    title: "Intelligent Matching",
    description: "Advanced scoring algorithm analyzes fit, win probability, impact, and effort for optimal opportunity selection.",
    badge: "AI-Powered",
    color: "bg-success"
  },
  {
    icon: <Target className="w-8 h-8" />,
    title: "Application Optimization",
    description: "Analyze winning proposals, reviewer preferences, and technical requirements for maximum success rates.",
    badge: "Strategic",
    color: "bg-warning"
  },
  {
    icon: <TrendingUp className="w-8 h-8" />,
    title: "Success Analytics",
    description: "Track performance metrics, win rates, and ROI across your entire funding portfolio.",
    badge: "Data-Driven",
    color: "bg-primary"
  },
  {
    icon: <Clock className="w-8 h-8" />,
    title: "Deadline Management",
    description: "Never miss an opportunity with intelligent deadline tracking and application timeline optimization.",
    badge: "Automated",
    color: "bg-success"
  },
  {
    icon: <FileText className="w-8 h-8" />,
    title: "Document Intelligence",
    description: "AI-assisted proposal writing with compliance checking and requirement validation.",
    badge: "Smart",
    color: "bg-warning"
  }
];

const FeaturesSection = () => {
  return (
    <section id="features" className="py-20 bg-card">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <Badge variant="secondary" className="mb-4">
            <Shield className="w-4 h-4 mr-2" />
            Enterprise-Grade Features
          </Badge>
          <h2 className="text-4xl font-bold text-foreground mb-6">
            Elite AI Funding Acquisition Platform
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Advanced tools and intelligence systems designed to maximize your non-dilutive funding success 
            while minimizing time and effort investment.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="relative group hover:shadow-elegant transition-all duration-300 border-border">
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-16 h-16 ${feature.color} rounded-xl flex items-center justify-center text-white group-hover:scale-110 transition-transform duration-300`}>
                    {feature.icon}
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    {feature.badge}
                  </Badge>
                </div>
                <CardTitle className="text-xl font-semibold text-foreground">
                  {feature.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
        
        {/* Additional Stats */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="text-center">
            <div className="flex items-center justify-center mb-3">
              <Database className="w-6 h-6 text-primary mr-2" />
              <span className="text-2xl font-bold text-foreground">50+</span>
            </div>
            <p className="text-sm text-muted-foreground">Funding Databases</p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center mb-3">
              <BarChart3 className="w-6 h-6 text-success mr-2" />
              <span className="text-2xl font-bold text-foreground">85%</span>
            </div>
            <p className="text-sm text-muted-foreground">Average Success Rate</p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center mb-3">
              <Clock className="w-6 h-6 text-warning mr-2" />
              <span className="text-2xl font-bold text-foreground">48h</span>
            </div>
            <p className="text-sm text-muted-foreground">Opportunity Discovery</p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center mb-3">
              <Shield className="w-6 h-6 text-primary mr-2" />
              <span className="text-2xl font-bold text-foreground">SOC 2</span>
            </div>
            <p className="text-sm text-muted-foreground">Security Compliant</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
