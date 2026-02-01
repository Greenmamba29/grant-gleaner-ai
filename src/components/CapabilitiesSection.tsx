import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Target, 
  Brain, 
  Zap, 
  BarChart3,
  Search,
  Database,
  TrendingUp,
  Clock,
  Shield,
  ArrowRight,
  CheckCircle
} from "lucide-react";

const capabilities = [
  {
    icon: <Target className="w-8 h-8" />,
    title: "🎯 Core Capabilities",
    items: [
      "Discovery Engine: Continuously scans 50+ funding databases",
      "Intelligent Matching: Scores opportunities using 4-factor matrix",
      "Application Optimization: Analyzes winning proposals and reviewer preferences", 
      "Autonomous Operation: Executes weekly reconnaissance and application cycles"
    ],
    color: "bg-primary"
  },
  {
    icon: <Brain className="w-8 h-8" />,
    title: "🧠 Strategic Intelligence",
    items: [
      "Maps technology sectors to appropriate funding streams",
      "Analyzes historical success patterns and reviewer preferences",
      "Identifies 'hidden' opportunities through university partnerships",
      "Optimizes application timing and resource allocation"
    ],
    color: "bg-success"
  },
  {
    icon: <Zap className="w-8 h-8" />,
    title: "⚡ Tactical Execution",
    items: [
      "Daily monitoring of new opportunities and deadlines",
      "Weekly strategic reviews and pipeline management", 
      "Monthly optimization based on win/loss patterns",
      "Emergency protocols for time-sensitive opportunities"
    ],
    color: "bg-warning"
  },
  {
    icon: <BarChart3 className="w-8 h-8" />,
    title: "📊 Success Metrics",
    items: [
      "Target >30% funding success rate (double industry average)",
      "Tracks equity preservation and runway extension",
      "Measures application efficiency and ROI",
      "Monitors competitive positioning and validation"
    ],
    color: "bg-primary"
  }
];

const activationCommands = [
  {
    command: "ACTIVATE: Grant Hunter Pro Mode",
    description: "Initialize the complete funding acquisition system"
  },
  {
    command: "TARGET: [Company Description]", 
    description: "Define your technology sector and development stage"
  },
  {
    command: "PRIORITIES: [Funding Goals]",
    description: "Set funding amount range and timeline requirements"
  }
];

const CapabilitiesSection = () => {
  return (
    <section className="py-20 bg-gradient-to-br from-background to-muted/30">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <Badge variant="secondary" className="mb-4">
            <Shield className="w-4 h-4 mr-2" />
            Complete System Breakdown
          </Badge>
          <h2 className="text-4xl font-bold text-foreground mb-6">
            Key Features of Grant Hunter Pro
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            A comprehensive AI funding acquisition specialist with autonomous operation capabilities, 
            strategic intelligence, and proven success metrics.
          </p>
        </div>

        {/* Core Capabilities Grid */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          {capabilities.map((capability, index) => (
            <Card key={index} className="group hover:shadow-elegant transition-all duration-300 animate-fade-in" style={{animationDelay: `${index * 0.1}s`}}>
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-16 h-16 ${capability.color} rounded-xl flex items-center justify-center text-white group-hover:scale-110 transition-transform duration-300`}>
                    {capability.icon}
                  </div>
                </div>
                <CardTitle className="text-xl font-semibold text-foreground">
                  {capability.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {capability.items.map((item, itemIndex) => (
                  <div key={itemIndex} className="flex items-start space-x-3">
                    <CheckCircle className="w-5 h-5 text-success mt-0.5 flex-shrink-0" />
                    <p className="text-muted-foreground leading-relaxed">{item}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Activation Commands */}
        <Card className="bg-gradient-card border-primary/20 shadow-premium">
          <CardHeader className="text-center pb-6">
            <div className="w-16 h-16 bg-gradient-hero rounded-xl flex items-center justify-center text-white mx-auto mb-4">
              <Search className="w-8 h-8" />
            </div>
            <CardTitle className="text-2xl font-bold text-foreground">
              How to Activate Grant Hunter Pro
            </CardTitle>
            <p className="text-muted-foreground">
              Simple commands to unleash the full power of AI-driven funding acquisition
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            {activationCommands.map((cmd, index) => (
              <div key={index} className="flex items-start space-x-4 p-4 rounded-lg bg-muted/50 hover:bg-muted/70 transition-colors">
                <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white text-sm font-bold">
                  {index + 1}
                </div>
                <div className="flex-1">
                  <code className="text-sm font-mono bg-primary/10 text-primary px-3 py-1 rounded">
                    {cmd.command}
                  </code>
                  <p className="text-sm text-muted-foreground mt-2">{cmd.description}</p>
                </div>
              </div>
            ))}
            
            <div className="pt-6 text-center">
              <p className="text-sm text-muted-foreground mb-4">
                Example Activation:
              </p>
              <div className="bg-primary/5 p-4 rounded-lg border border-primary/20">
                <code className="text-sm font-mono text-foreground">
                  ACTIVATE: Grant Hunter Pro Mode<br/>
                  TARGET: HealthTech AI startup developing diagnostic tools<br/>
                  PRIORITIES: $100K-$500K non-dilutive funding, 6-month timeline
                </code>
              </div>
            </div>
            
            <div className="flex justify-center pt-6">
              <Link to="/search">
                <Button variant="hero" size="lg" className="px-8">
                  <Target className="w-5 h-5 mr-2" />
                  Activate System Now
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Success Promise */}
        <div className="text-center mt-16">
          <div className="inline-flex items-center space-x-2 bg-success/10 text-success px-6 py-3 rounded-full border border-success/20">
            <Shield className="w-5 h-5" />
            <span className="font-semibold">
              Like having a grant writing expert, research analyst, and strategic advisor all in one AI agent
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CapabilitiesSection;