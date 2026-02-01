import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ExternalLink, Calendar, Building2, DollarSign, Users } from "lucide-react";
import type { Grant } from "@/lib/api/grants";

interface GrantResultCardProps {
  grant: Grant;
  index: number;
}

const GrantResultCard = ({ grant, index }: GrantResultCardProps) => {
  return (
    <Card 
      className="p-6 bg-card border-border hover:border-primary/50 transition-all duration-300 hover:shadow-elegant animate-fade-in"
      style={{ animationDelay: `${index * 100}ms` }}
    >
      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
        <div className="flex-1 space-y-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2 flex-wrap">
              <Badge variant="secondary" className="bg-primary/10 text-primary">
                <Building2 className="w-3 h-3 mr-1" />
                {grant.agency}
              </Badge>
              <Badge variant="outline" className="text-success border-success/30">
                <DollarSign className="w-3 h-3 mr-1" />
                {grant.amount}
              </Badge>
            </div>
            <h3 className="text-xl font-semibold text-foreground">
              {grant.title}
            </h3>
          </div>

          <p className="text-muted-foreground leading-relaxed">
            {grant.description}
          </p>

          <div className="flex flex-wrap gap-4 text-sm">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Calendar className="w-4 h-4 text-warning" />
              <span>Deadline: {grant.deadline}</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Users className="w-4 h-4 text-primary" />
              <span>{grant.eligibility}</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-2 lg:items-end">
          <Button 
            variant="hero" 
            size="sm"
            onClick={() => window.open(grant.sourceUrl, '_blank')}
          >
            <ExternalLink className="w-4 h-4 mr-2" />
            View Details
          </Button>
          <Button variant="outline" size="sm">
            Save to Pipeline
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default GrantResultCard;
