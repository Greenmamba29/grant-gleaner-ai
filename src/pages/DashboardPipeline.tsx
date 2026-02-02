import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { applicationsApi, ApplicationWithOpportunity } from '@/lib/api/applications';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AuthModal } from '@/components/auth/AuthModal';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { 
  ArrowLeft,
  Loader2,
  AlertCircle,
  FileText,
  Calendar,
  DollarSign,
  Edit,
  Eye
} from 'lucide-react';

export default function DashboardPipeline() {
  const { user, loading: authLoading } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [applications, setApplications] = useState<ApplicationWithOpportunity[]>([]);
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
      const apps = await applicationsApi.getAll();
      setApplications(apps);
    } catch (error) {
      console.error('Error loading pipeline:', error);
      toast({
        title: 'Error loading pipeline',
        description: 'Please try refreshing the page.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft': return 'bg-muted text-muted-foreground';
      case 'in_progress': return 'bg-primary text-primary-foreground';
      case 'submitted': return 'bg-success text-success-foreground';
      case 'awarded': return 'bg-accent text-accent-foreground';
      case 'rejected': return 'bg-destructive text-destructive-foreground';
      default: return 'bg-secondary text-secondary-foreground';
    }
  };

  const groupedApps = {
    draft: applications.filter(a => a.status === 'draft'),
    in_progress: applications.filter(a => a.status === 'in_progress'),
    submitted: applications.filter(a => a.status === 'submitted'),
    completed: applications.filter(a => a.status === 'awarded' || a.status === 'rejected'),
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
            <h1 className="text-3xl font-bold">Sign in to access your Pipeline</h1>
            <Button size="lg" onClick={() => setShowAuthModal(true)}>
              Get Started
            </Button>
          </div>
        </div>
        <AuthModal open={showAuthModal} onOpenChange={setShowAuthModal} />
      </div>
    );
  }

  const ApplicationCard = ({ app }: { app: ApplicationWithOpportunity }) => {
    const opp = app.opportunities_scored.opportunities_raw;
    const deadline = opp.deadline ? new Date(opp.deadline) : null;

    return (
      <Card className="hover:shadow-elegant transition-shadow">
        <CardHeader className="pb-2">
          <div className="flex items-start justify-between">
            <CardTitle className="text-base leading-tight">{opp.title}</CardTitle>
            <Badge className={getStatusColor(app.status)}>
              {app.status.replace('_', ' ')}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground">{opp.agency}</p>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-1">
              <DollarSign className="h-3 w-3 text-muted-foreground" />
              <span>{opp.amount_text || 'TBD'}</span>
            </div>
            {deadline && (
              <div className="flex items-center gap-1">
                <Calendar className="h-3 w-3 text-muted-foreground" />
                <span>{format(deadline, 'MMM d, yyyy')}</span>
              </div>
            )}
          </div>
          <div className="flex gap-2">
            <Link to={`/write/${app.id}`} className="flex-1">
              <Button size="sm" className="w-full">
                <Edit className="h-3 w-3 mr-1" />
                Edit
              </Button>
            </Link>
            <Button size="sm" variant="outline">
              <Eye className="h-3 w-3" />
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  };

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
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <FileText className="h-8 w-8" />
            Application Pipeline
          </h1>
          <p className="text-muted-foreground">
            {applications.length} applications in progress
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : applications.length === 0 ? (
          <div className="text-center py-16">
            <FileText className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-medium mb-2">No applications yet</h3>
            <p className="text-muted-foreground mb-6">
              Approve opportunities from your inbox to start building applications.
            </p>
            <Link to="/dashboard/inbox">
              <Button>Go to Inbox</Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Draft Column */}
            <div className="space-y-4">
              <h2 className="font-semibold text-muted-foreground uppercase text-sm tracking-wide">
                Draft ({groupedApps.draft.length})
              </h2>
              {groupedApps.draft.map(app => (
                <ApplicationCard key={app.id} app={app} />
              ))}
            </div>

            {/* In Progress Column */}
            <div className="space-y-4">
              <h2 className="font-semibold text-primary uppercase text-sm tracking-wide">
                In Progress ({groupedApps.in_progress.length})
              </h2>
              {groupedApps.in_progress.map(app => (
                <ApplicationCard key={app.id} app={app} />
              ))}
            </div>

            {/* Submitted Column */}
            <div className="space-y-4">
              <h2 className="font-semibold text-success uppercase text-sm tracking-wide">
                Submitted ({groupedApps.submitted.length})
              </h2>
              {groupedApps.submitted.map(app => (
                <ApplicationCard key={app.id} app={app} />
              ))}
            </div>

            {/* Completed Column */}
            <div className="space-y-4">
              <h2 className="font-semibold text-muted-foreground uppercase text-sm tracking-wide">
                Completed ({groupedApps.completed.length})
              </h2>
              {groupedApps.completed.map(app => (
                <ApplicationCard key={app.id} app={app} />
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
