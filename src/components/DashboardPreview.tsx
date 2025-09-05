import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  TrendingUp, 
  DollarSign, 
  Target, 
  Clock,
  ArrowUpRight,
  Star,
  CheckCircle,
  AlertCircle
} from "lucide-react";

const opportunities = [
  {
    title: "SBIR Phase II - Advanced Materials",
    agency: "NSF",
    amount: "$2,500,000",
    deadline: "Mar 15, 2024",
    score: 95,
    status: "High Priority",
    statusColor: "bg-success"
  },
  {
    title: "Energy Innovation Hub Grant",
    agency: "DOE",
    amount: "$1,800,000",
    deadline: "Apr 2, 2024",
    score: 88,
    status: "Excellent Match",
    statusColor: "bg-primary"
  },
  {
    title: "Defense Innovation Unit",
    agency: "DARPA",
    amount: "$3,200,000",
    deadline: "May 10, 2024",
    score: 82,
    status: "Good Fit",
    statusColor: "bg-warning"
  }
];

const metrics = [
  {
    title: "Total Pipeline Value",
    value: "$12.8M",
    change: "+23%",
    icon: <DollarSign className="w-5 h-5" />,
    color: "text-success"
  },
  {
    title: "Active Opportunities",
    value: "47",
    change: "+8",
    icon: <Target className="w-5 h-5" />,
    color: "text-primary"
  },
  {
    title: "Applications Submitted",
    value: "12",
    change: "+3",
    icon: <CheckCircle className="w-5 h-5" />,
    color: "text-warning"
  },
  {
    title: "Avg. Match Score",
    value: "87%",
    change: "+5%",
    icon: <Star className="w-5 h-5" />,
    color: "text-success"
  }
];

const DashboardPreview = () => {
  return (
    <section className="py-20 bg-gradient-to-br from-muted/30 to-background">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <Badge variant="secondary" className="mb-4">
            <TrendingUp className="w-4 h-4 mr-2" />
            Live Dashboard Preview
          </Badge>
          <h2 className="text-4xl font-bold text-foreground mb-6">
            Real-Time Funding Intelligence
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Monitor your entire funding pipeline with actionable insights, automated alerts, 
            and strategic recommendations powered by AI.
          </p>
        </div>
        
        {/* Metrics Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {metrics.map((metric, index) => (
            <Card key={index} className="hover:shadow-elegant transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-10 h-10 rounded-lg bg-gradient-primary flex items-center justify-center text-white`}>
                    {metric.icon}
                  </div>
                  <Badge variant="secondary" className={`${metric.color} text-xs`}>
                    {metric.change}
                  </Badge>
                </div>
                <div className="space-y-1">
                  <p className="text-2xl font-bold text-foreground">{metric.value}</p>
                  <p className="text-sm text-muted-foreground">{metric.title}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Opportunities List */}
          <Card className="lg:col-span-2 shadow-elegant">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-xl font-semibold text-foreground">
                High-Priority Opportunities
              </CardTitle>
              <Button variant="outline" size="sm">
                View All
                <ArrowUpRight className="w-4 h-4 ml-2" />
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              {opportunities.map((opp, index) => (
                <div key={index} className="p-4 rounded-lg border border-border hover:bg-muted/50 transition-colors">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h4 className="font-semibold text-foreground mb-1">{opp.title}</h4>
                      <p className="text-sm text-muted-foreground">{opp.agency}</p>
                    </div>
                    <Badge className={`${opp.statusColor} text-white`}>
                      {opp.status}
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4 mb-3">
                    <div>
                      <p className="text-xs text-muted-foreground">Amount</p>
                      <p className="font-semibold text-foreground">{opp.amount}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Deadline</p>
                      <p className="font-semibold text-foreground">{opp.deadline}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Match Score</p>
                      <p className="font-semibold text-success">{opp.score}%</p>
                    </div>
                  </div>
                  
                  <Progress value={opp.score} className="h-2 mb-3" />
                  
                  <div className="flex justify-between items-center">
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Clock className="w-4 h-4 mr-1" />
                      {Math.floor(Math.random() * 30) + 5} days left
                    </div>
                    <Button variant="premium" size="sm">
                      Analyze
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
          
          {/* Activity Feed */}
          <Card className="shadow-elegant">
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-foreground">
                Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-success rounded-full mt-2"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground">New grant discovered</p>
                  <p className="text-xs text-muted-foreground">SBIR Phase I - $500K opportunity</p>
                  <p className="text-xs text-muted-foreground">2 hours ago</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground">Application submitted</p>
                  <p className="text-xs text-muted-foreground">DOE Energy Innovation Hub</p>
                  <p className="text-xs text-muted-foreground">1 day ago</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-warning rounded-full mt-2"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground">Deadline reminder</p>
                  <p className="text-xs text-muted-foreground">NSF SBIR Phase II due in 5 days</p>
                  <p className="text-xs text-muted-foreground">3 days ago</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-success rounded-full mt-2"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground">Award notification</p>
                  <p className="text-xs text-muted-foreground">$250K STTR Phase I approved</p>
                  <p className="text-xs text-muted-foreground">1 week ago</p>
                </div>
              </div>
              
              <div className="pt-4">
                <Button variant="outline" size="sm" className="w-full">
                  View All Activity
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default DashboardPreview;