import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  CheckCircle, 
  XCircle, 
  Clock, 
  Users, 
  ExternalLink,
  TrendingUp,
  AlertTriangle,
  Calendar,
  DollarSign
} from 'lucide-react';
import { ScoredOpportunityWithRaw } from '@/lib/api/opportunities';
import { format, differenceInDays } from 'date-fns';

interface OpportunityCardProps {
  opportunity: ScoredOpportunityWithRaw;
  onApprove?: () => void;
  onReject?: () => void;
  onSnooze?: () => void;
  onFindTeam?: () => void;
  showActions?: boolean;
}

export function OpportunityCard({
  opportunity,
  onApprove,
  onReject,
  onSnooze,
  onFindTeam,
  showActions = true,
}: OpportunityCardProps) {
  const raw = opportunity.opportunities_raw;
  const deadline = raw.deadline ? new Date(raw.deadline) : null;
  const daysUntilDeadline = deadline ? differenceInDays(deadline, new Date()) : null;

  const getDecisionBadgeColor = (decision: string) => {
    switch (decision) {
      case 'priority_a':
        return 'bg-success text-success-foreground';
      case 'priority_b':
        return 'bg-primary text-primary-foreground';
      case 'conditional':
        return 'bg-warning text-warning-foreground';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-success text-success-foreground';
      case 'rejected':
        return 'bg-destructive text-destructive-foreground';
      case 'snoozed':
        return 'bg-warning text-warning-foreground';
      default:
        return 'bg-secondary text-secondary-foreground';
    }
  };

  return (
    <Card className="w-full hover:shadow-elegant transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 space-y-1">
            <CardTitle className="text-lg leading-tight">{raw.title}</CardTitle>
            <p className="text-sm text-muted-foreground">{raw.agency}</p>
          </div>
          <div className="flex flex-col items-end gap-2">
            <Badge className={getDecisionBadgeColor(opportunity.decision)}>
              {opportunity.decision === 'priority_a' ? 'Priority A' : 
               opportunity.decision === 'priority_b' ? 'Priority B' : 
               opportunity.decision === 'conditional' ? 'Conditional' : 'No-Go'}
            </Badge>
            <Badge className={getStatusBadgeColor(opportunity.hitl_status)}>
              {opportunity.hitl_status}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Score breakdown */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            <span className="text-2xl font-bold">{opportunity.total_score}</span>
            <span className="text-sm text-muted-foreground">/ 100</span>
          </div>
          <div className="flex-1 bg-secondary rounded-full h-2">
            <div 
              className="bg-gradient-primary h-2 rounded-full transition-all"
              style={{ width: `${opportunity.total_score}%` }}
            />
          </div>
        </div>

        {/* Key info */}
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center gap-2">
            <DollarSign className="h-4 w-4 text-muted-foreground" />
            <span>{raw.amount_text || 'Amount TBD'}</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            {deadline ? (
              <span className={daysUntilDeadline && daysUntilDeadline < 30 ? 'text-warning' : ''}>
                {format(deadline, 'MMM d, yyyy')}
                {daysUntilDeadline !== null && ` (${daysUntilDeadline}d)`}
              </span>
            ) : (
              <span>Rolling deadline</span>
            )}
          </div>
        </div>

        {/* Match reasons */}
        {opportunity.match_reasons.length > 0 && (
          <div className="space-y-2">
            <p className="text-sm font-medium">Match Reasons</p>
            <div className="flex flex-wrap gap-2">
              {opportunity.match_reasons.slice(0, 3).map((reason, i) => (
                <Badge key={i} variant="outline" className="text-xs">
                  ✓ {reason}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Risks */}
        {opportunity.risks.length > 0 && (
          <div className="space-y-2">
            <p className="text-sm font-medium flex items-center gap-1">
              <AlertTriangle className="h-3 w-3 text-warning" />
              Risks
            </p>
            <div className="flex flex-wrap gap-2">
              {opportunity.risks.slice(0, 2).map((risk, i) => (
                <Badge key={i} variant="outline" className="text-xs text-warning border-warning">
                  {risk}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Actions */}
        {showActions && opportunity.hitl_status === 'pending' && (
          <div className="flex flex-wrap gap-2 pt-2 border-t">
            <Button size="sm" onClick={onApprove} className="bg-success hover:bg-success/90">
              <CheckCircle className="h-4 w-4 mr-1" />
              Approve & Draft
            </Button>
            <Button size="sm" variant="outline" onClick={onFindTeam}>
              <Users className="h-4 w-4 mr-1" />
              Find Team
            </Button>
            <Button size="sm" variant="outline" onClick={onSnooze}>
              <Clock className="h-4 w-4 mr-1" />
              Snooze
            </Button>
            <Button size="sm" variant="destructive" onClick={onReject}>
              <XCircle className="h-4 w-4 mr-1" />
              Reject
            </Button>
          </div>
        )}

        {/* Source link */}
        {raw.source_url && (
          <a
            href={raw.source_url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-sm text-primary hover:underline"
          >
            View source <ExternalLink className="h-3 w-3" />
          </a>
        )}
      </CardContent>
    </Card>
  );
}
