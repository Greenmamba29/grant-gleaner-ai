import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { opportunitiesApi, ScoredOpportunityWithRaw } from '@/lib/api/opportunities';
import { DashboardMetrics } from '@/components/dashboard/DashboardMetrics';
import { OpportunityCard } from '@/components/dashboard/OpportunityCard';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AuthModal } from '@/components/auth/AuthModal';
import { useToast } from '@/hooks/use-toast';
import { 
  Search, 
  Plus, 
  Inbox, 
  FileText, 
  Settings,
  Loader2,
  AlertCircle
} from 'lucide-react';

export default function Dashboard() {
  const { user, loading: authLoading } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [opportunities, setOpportunities] = useState<ScoredOpportunityWithRaw[]>([]);
  const [metrics, setMetrics] = useState({ priorityA: 0, priorityB: 0, pending: 0, approved: 0 });
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

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
      const [opps, metricsData] = await Promise.all([
        opportunitiesApi.getScored({ limit: 10 }),
        opportunitiesApi.getMetrics(),
      ]);
      setOpportunities(opps);
      setMetrics(metricsData);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
      toast({
        title: 'Error loading data',
        description: 'Please try refreshing the page.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id: string) => {
    try {
      await opportunitiesApi.updateHitlStatus(id, 'approved');
      toast({ title: 'Opportunity approved!', description: 'Added to your pipeline.' });
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
            <h1 className="text-3xl font-bold">Sign in to access your Dashboard</h1>
            <p className="text-muted-foreground">
              Track your grant opportunities, manage your pipeline, and accelerate your grant writing.
            </p>
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
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="text-2xl font-bold text-primary">
            Grant Hunter Pro
          </Link>
          <nav className="flex items-center gap-4">
            <Link to="/search">
              <Button variant="ghost" size="sm">
                <Search className="h-4 w-4 mr-2" />
                Search
              </Button>
            </Link>
            <Link to="/dashboard/inbox">
              <Button variant="ghost" size="sm">
                <Inbox className="h-4 w-4 mr-2" />
                Inbox
                {metrics.pending > 0 && (
                  <span className="ml-2 bg-primary text-primary-foreground text-xs px-2 py-0.5 rounded-full">
                    {metrics.pending}
                  </span>
                )}
              </Button>
            </Link>
            <Link to="/dashboard/pipeline">
              <Button variant="ghost" size="sm">
                <FileText className="h-4 w-4 mr-2" />
                Pipeline
              </Button>
            </Link>
            <Button variant="ghost" size="sm">
              <Settings className="h-4 w-4" />
            </Button>
          </nav>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <p className="text-muted-foreground">Your grant intelligence command center</p>
          </div>
          <Link to="/search">
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Scan for Grants
            </Button>
          </Link>
        </div>

        <DashboardMetrics {...metrics} />

        <Tabs defaultValue="priority" className="space-y-4">
          <TabsList>
            <TabsTrigger value="priority">Priority Opportunities</TabsTrigger>
            <TabsTrigger value="recent">Recently Added</TabsTrigger>
          </TabsList>

          <TabsContent value="priority" className="space-y-4">
            {loading ? (
              <div className="flex justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : opportunities.filter(o => o.decision === 'priority_a' || o.decision === 'priority_b').length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">No priority opportunities yet</h3>
                  <p className="text-muted-foreground mb-4">
                    Start searching for grants to build your pipeline.
                  </p>
                  <Link to="/search">
                    <Button>Search for Grants</Button>
                  </Link>
                </CardContent>
              </Card>
            ) : (
              <div className="grid md:grid-cols-2 gap-4">
                {opportunities
                  .filter(o => o.decision === 'priority_a' || o.decision === 'priority_b')
                  .map((opp) => (
                    <OpportunityCard
                      key={opp.id}
                      opportunity={opp}
                      onApprove={() => handleApprove(opp.id)}
                      onReject={() => handleReject(opp.id)}
                      onSnooze={() => handleSnooze(opp.id)}
                      onFindTeam={() => toast({ title: 'Coming soon!', description: 'Team finder is in development.' })}
                    />
                  ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="recent" className="space-y-4">
            {loading ? (
              <div className="flex justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : opportunities.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <p className="text-muted-foreground">No opportunities found.</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid md:grid-cols-2 gap-4">
                {opportunities.slice(0, 6).map((opp) => (
                  <OpportunityCard
                    key={opp.id}
                    opportunity={opp}
                    onApprove={() => handleApprove(opp.id)}
                    onReject={() => handleReject(opp.id)}
                    onSnooze={() => handleSnooze(opp.id)}
                    onFindTeam={() => toast({ title: 'Coming soon!' })}
                  />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
