import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Database, 
  Target, 
  Clock, 
  TrendingUp,
  ArrowUpRight,
  DollarSign,
  Calendar,
  Zap
} from "lucide-react";

const metrics = [
  {
    title: "Funding Success Rate",
    current: "32%",
    target: ">30%", 
    industry: "15%",
    status: "exceeding",
    icon: <TrendingUp className="w-5 h-5" />,
    color: "text-success"
  },
  {
    title: "Average Award Size",
    current: "$485K",
    target: "Maximize",
    industry: "$285K",
    status: "outperforming", 
    icon: <DollarSign className="w-5 h-5" />,
    color: "text-primary"
  },
  {
    title: "Time to Award",
    current: "127 days",
    target: "Minimize",
    industry: "180 days",
    status: "optimized",
    icon: <Clock className="w-5 h-5" />,
    color: "text-warning"
  },
  {
    title: "Application Efficiency",
    current: "3.2x",
    target: "Maximize",
    industry: "1.0x",
    status: "superior",
    icon: <Zap className="w-5 h-5" />,
    color: "text-success"
  }
];

const protocols = [
  {
    frequency: "Daily",
    tasks: [
      "Scan 10+ funding databases for new opportunities",
      "Update opportunity tracking database", 
      "Monitor application deadline calendar",
      "Research winning proposals from target programs"
    ],
    icon: <Database className="w-6 h-6" />,
    color: "bg-primary"
  },
  {
    frequency: "Weekly", 
    tasks: [
      "Assess pipeline health and conversion rates",
      "Identify gaps in funding portfolio",
      "Plan application timeline and resource allocation",
      "Conduct competitive intelligence gathering"
    ],
    icon: <Target className="w-6 h-6" />,
    color: "bg-success"
  },
  {
    frequency: "Monthly",
    tasks: [
      "Analyze win/loss patterns for improvement",
      "Refresh target opportunity criteria",
      "Update template libraries and best practices", 
      "Plan strategic partnerships and collaborations"
    ],
    icon: <Calendar className="w-6 h-6" />,
    color: "bg-warning"
  }
];

const OperationalExcellence = () => {
  return (
    <section className="py-20 bg-card">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <Badge variant="secondary" className="mb-4">
            <TrendingUp className="w-4 h-4 mr-2" />
            Operational Excellence
          </Badge>
          <h2 className="text-4xl font-bold text-foreground mb-6">
            Proven Performance & Systematic Execution
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Data-driven results with systematic operational protocols that ensure 
            consistent performance and continuous optimization.
          </p>
        </div>

        {/* Performance Metrics */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {metrics.map((metric, index) => (
            <Card key={index} className="text-center hover:shadow-elegant transition-all duration-300 animate-scale-in" style={{animationDelay: `${index * 0.1}s`}}>
              <CardContent className="p-6">
                <div className="flex items-center justify-center mb-4">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-primary flex items-center justify-center text-white`}>
                    {metric.icon}
                  </div>
                </div>
                <div className="space-y-2">
                  <h3 className="font-semibold text-foreground">{metric.title}</h3>
                  <div className="text-3xl font-bold text-foreground">{metric.current}</div>
                  <div className="text-sm text-muted-foreground">
                    Target: {metric.target}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Industry: {metric.industry}
                  </div>
                  <Badge variant="secondary" className={`${metric.color} text-xs mt-2`}>
                    {metric.status}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Operational Protocols */}
        <div className="space-y-8">
          <div className="text-center">
            <h3 className="text-2xl font-bold text-foreground mb-4">
              Systematic Operational Protocols
            </h3>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Structured workflows that ensure no opportunity is missed and every application 
              is optimized for maximum success probability.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {protocols.map((protocol, index) => (
              <Card key={index} className="group hover:shadow-elegant transition-all duration-300">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-12 h-12 ${protocol.color} rounded-xl flex items-center justify-center text-white group-hover:scale-110 transition-transform duration-300`}>
                      {protocol.icon}
                    </div>
                    <Badge variant="secondary">
                      {protocol.frequency}
                    </Badge>
                  </div>
                  <CardTitle className="text-xl font-semibold text-foreground">
                    {protocol.frequency} Operations
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {protocol.tasks.map((task, taskIndex) => (
                    <div key={taskIndex} className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                      <p className="text-sm text-muted-foreground leading-relaxed">{task}</p>
                    </div>
                  ))}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Emergency Protocols */}
        <Card className="mt-16 bg-gradient-to-r from-primary/5 to-success/5 border-primary/20">
          <CardHeader className="text-center">
            <div className="w-16 h-16 bg-gradient-hero rounded-xl flex items-center justify-center text-white mx-auto mb-4">
              <Zap className="w-8 h-8" />
            </div>
            <CardTitle className="text-2xl font-bold text-foreground">
              Emergency Response Protocols
            </CardTitle>
            <p className="text-muted-foreground">
              Rapid deployment for time-sensitive, high-value opportunities
            </p>
          </CardHeader>
          <CardContent className="grid md:grid-cols-2 gap-8">
            <div>
              <h4 className="font-semibold text-foreground mb-4">Urgent Opportunity Response</h4>
              <div className="space-y-2 text-sm text-muted-foreground">
                <div>• Immediate assessment within 4 hours</div>
                <div>• Resource mobilization for application development</div>
                <div>• Partner outreach for required collaborations</div>
                <div>• Expedited review and approval processes</div>
                <div>• All-hands application sprint if necessary</div>
              </div>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-4">Crisis Management</h4>
              <div className="space-y-2 text-sm text-muted-foreground">
                <div>• Root cause analysis and solution development</div>
                <div>• Emergency expert consultation and guidance</div>
                <div>• Alternative approach development and testing</div>
                <div>• Last-minute resource acquisition</div>
                <div>• Quality assurance and risk mitigation</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* CTA */}
        <div className="text-center mt-16">
          <Button variant="hero" size="lg" className="px-8">
            <Target className="w-5 h-5 mr-2" />
            Experience Operational Excellence
            <ArrowUpRight className="w-5 h-5 ml-2" />
          </Button>
        </div>
      </div>
    </section>
  );
};

export default OperationalExcellence;