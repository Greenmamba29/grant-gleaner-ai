import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { applicationsApi, ApplicationWithOpportunity } from '@/lib/api/applications';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { AuthModal } from '@/components/auth/AuthModal';
import { useToast } from '@/hooks/use-toast';
import type { Json } from '@/integrations/supabase/types';
import { 
  ArrowLeft,
  Loader2,
  AlertCircle,
  Sparkles,
  Save,
  FileText,
  Target,
  Calculator,
  Network,
  BookOpen
} from 'lucide-react';

const SECTIONS = [
  { id: 'specific_aims', label: 'Specific Aims', icon: Target },
  { id: 'budget_justification', label: 'Budget Justification', icon: Calculator },
  { id: 'logic_model', label: 'Logic Model', icon: Network },
  { id: 'narrative', label: 'Narrative', icon: BookOpen },
];

export default function ApplicationWrite() {
  const { id } = useParams<{ id: string }>();
  const { user, loading: authLoading } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [application, setApplication] = useState<ApplicationWithOpportunity | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [generating, setGenerating] = useState<string | null>(null);
  const [content, setContent] = useState<Record<string, string>>({
    specific_aims: '',
    budget_justification: '',
    logic_model: '',
    narrative: '',
  });
  const { toast } = useToast();

  useEffect(() => {
    if (user && id) {
      loadApplication();
    } else if (!authLoading) {
      setLoading(false);
    }
  }, [user, authLoading, id]);

  const loadApplication = async () => {
    if (!id) return;
    try {
      setLoading(true);
      const app = await applicationsApi.getById(id);
      setApplication(app);
      if (app?.content_sections) {
        const sections = app.content_sections as Record<string, string>;
        setContent({
          specific_aims: sections.specific_aims || '',
          budget_justification: sections.budget_justification || '',
          logic_model: sections.logic_model || '',
          narrative: sections.narrative || '',
        });
      }
    } catch (error) {
      console.error('Error loading application:', error);
      toast({
        title: 'Error loading application',
        description: 'Please try refreshing the page.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!id) return;
    try {
      setSaving(true);
      await applicationsApi.updateContent(id, content as unknown as Json);
      toast({ title: 'Saved!', description: 'Your changes have been saved.' });
    } catch (error) {
      toast({ title: 'Error saving', description: 'Please try again.', variant: 'destructive' });
    } finally {
      setSaving(false);
    }
  };

  const handleGenerate = async (section: string) => {
    if (!id || !application) return;
    try {
      setGenerating(section);
      const opp = application.opportunities_scored.opportunities_raw;
      const generated = await applicationsApi.generateDraft(id, section, {
        title: opp.title,
        agency: opp.agency || '',
        amount: opp.amount_text || '',
        deadline: opp.deadline || '',
      });
      setContent(prev => ({ ...prev, [section]: generated }));
      toast({ title: 'Draft generated!', description: 'Review and edit as needed.' });
    } catch (error) {
      toast({ title: 'Error generating draft', description: 'Please try again.', variant: 'destructive' });
    } finally {
      setGenerating(null);
    }
  };

  if (authLoading || loading) {
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
            <h1 className="text-3xl font-bold">Sign in to access your applications</h1>
            <Button size="lg" onClick={() => setShowAuthModal(true)}>
              Get Started
            </Button>
          </div>
        </div>
        <AuthModal open={showAuthModal} onOpenChange={setShowAuthModal} />
      </div>
    );
  }

  if (!application) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-16 text-center">
          <AlertCircle className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h1 className="text-2xl font-bold mb-2">Application not found</h1>
          <Link to="/dashboard/pipeline">
            <Button>Go to Pipeline</Button>
          </Link>
        </div>
      </div>
    );
  }

  const opp = application.opportunities_scored.opportunities_raw;

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b sticky top-0 bg-background z-10">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/dashboard/pipeline">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Pipeline
              </Button>
            </Link>
            <div>
              <h1 className="font-semibold truncate max-w-md">{opp.title}</h1>
              <p className="text-sm text-muted-foreground">{opp.agency}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge>{application.status}</Badge>
            <Button onClick={handleSave} disabled={saving}>
              {saving ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <Save className="h-4 w-4 mr-2" />
              )}
              Save
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6">
        <Tabs defaultValue="specific_aims" className="space-y-4">
          <TabsList className="w-full justify-start">
            {SECTIONS.map((section) => (
              <TabsTrigger key={section.id} value={section.id} className="gap-2">
                <section.icon className="h-4 w-4" />
                {section.label}
              </TabsTrigger>
            ))}
          </TabsList>

          {SECTIONS.map((section) => (
            <TabsContent key={section.id} value={section.id}>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <section.icon className="h-5 w-5" />
                    {section.label}
                  </CardTitle>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleGenerate(section.id)}
                    disabled={generating === section.id}
                  >
                    {generating === section.id ? (
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    ) : (
                      <Sparkles className="h-4 w-4 mr-2" />
                    )}
                    AI Draft
                  </Button>
                </CardHeader>
                <CardContent>
                  <Textarea
                    value={content[section.id]}
                    onChange={(e) => setContent(prev => ({ ...prev, [section.id]: e.target.value }))}
                    placeholder={`Write your ${section.label.toLowerCase()} here...`}
                    className="min-h-[400px] font-mono text-sm"
                  />
                </CardContent>
              </Card>
            </TabsContent>
          ))}
        </Tabs>
      </main>
    </div>
  );
}
