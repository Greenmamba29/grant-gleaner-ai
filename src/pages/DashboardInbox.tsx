import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { opportunitiesApi, ScoredOpportunityWithRaw } from '@/lib/api/opportunities';
import { OpportunityCard } from '@/components/dashboard/OpportunityCard';
import { Button } from '@/components/ui/button';
import { AuthModal } from '@/components/auth/AuthModal';
import { useToast } from '@/hooks/use-toast';
import { applicationsApi } from '@/lib/api/applications';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft,
  Loader2,
  AlertCircle,
  Filter,
  Inbox as InboxIcon
} from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

type DecisionFilter = 'all' | 'priority_a' | 'priority_b' | 'conditional';

export default function DashboardInbox() {
  const { user, loading: authLoading } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [opportunities, setOpportunities] = useState<ScoredOpportunityWithRaw[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<DecisionFilter>('all');
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      loadData();
    } else if (!authLoading) {
      setLoading(false);
    }
  }, [user, authLoading]);

  const loadData = async () => {
    try {
      setLoading(true);
      const opps = await opportunitiesApi.getScored({ hitlStatus: ['pending'] });
      setOpportunities(opps);
    } catch (error) {
      console.error('Error loading inbox:', error);
      toast({
        title: 'Error loading inbox',
        description: 'Please try refreshing the page.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id: string, opportunityScoredId: string) => {
    try {
      await opportunitiesApi.updateHitlStatus(id, 'approved');
      
      // Create application draft
      const application = await applicationsApi.create(opportunityScoredId);
      
      toast({ 
        title: 'Opportunity approved!', 
        description: 'Application draft created. Redirecting to writing workspace...' 
      });
      
      // Navigate to writing workspace
      setTimeout(() => {
        navigate(`/write/${application.id}`);
      }, 1500);
      
      loadData();
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to approve opportunity.', variant: 'destructive' });
    }
  };

  const handleReject = async (id: string) => {
    try {
      await opportunitiesApi.updateHitlStatus(id, 'rejected');
      toast({ title: 'Opportunity rejected', description: 'Moved to archive.' });
      loadData();
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to reject opportunity.', variant: 'destructive' });
    }
  };

  const handleSnooze = async (id: string) => {
    const snoozedUntil = new Date();
    snoozedUntil.setDate(snoozedUntil.getDate() + 1);
    try {
      await opportunitiesApi.updateHitlStatus(id, 'snoozed', snoozedUntil.toISOString());
      toast({ title: 'Snoozed for 24 hours' });
      loadData();
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to snooze opportunity.', variant: 'destructive' });
    }
  };

  const filteredOpportunities = filter === 'all' 
    ? opportunities 
    : opportunities.filter(o => o.decision === filter);

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-2xl mx-auto text-center space-y-6">
            <AlertCircle className="h-16 w-16 text-primary mx-auto" />
            <h1 className="text-3xl font-bold">Sign in to access your Inbox</h1>
            <Button size="lg" onClick={() => setShowAuthModal(true)}>
              Get Started
            </Button>
          </div>
        </div>
        <AuthModal open={showAuthModal} onOpenChange={setShowAuthModal} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex items-center gap-4">
          <Link to="/dashboard">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
          <div className="flex-1" />
          <Link to="/" className="text-xl font-bold text-primary">
            Grant Hunter Pro
          </Link>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-3">
              <InboxIcon className="h-8 w-8" />
              Approval Inbox
            </h1>
            <p className="text-muted-foreground">
              {opportunities.length} opportunities awaiting your decision
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <Select value={filter} onValueChange={(v) => setFilter(v as DecisionFilter)}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Pending</SelectItem>
                <SelectItem value="priority_a">Priority A</SelectItem>
                <SelectItem value="priority_b">Priority B</SelectItem>
                <SelectItem value="conditional">Conditional</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : filteredOpportunities.length === 0 ? (
          <div className="text-center py-16">
            <InboxIcon className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-medium mb-2">Inbox Zero!</h3>
            <p className="text-muted-foreground mb-6">
              No pending opportunities to review. Great job staying on top of things!
            </p>
            <Link to="/search">
              <Button>Search for New Grants</Button>
            </Link>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {filteredOpportunities.map((opp) => (
              <OpportunityCard
                key={opp.id}
                opportunity={opp}
                onApprove={() => handleApprove(opp.id, opp.id)}
                onReject={() => handleReject(opp.id)}
                onSnooze={() => handleSnooze(opp.id)}
                onFindTeam={() => toast({ title: 'Coming soon!', description: 'Team finder is in development.' })}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
