import { useState } from "react";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import GrantSearchBar from "@/components/grants/GrantSearchBar";
import GrantResultCard from "@/components/grants/GrantResultCard";
import { grantsApi, type Grant, type SearchFilters } from "@/lib/api/grants";
import { useAuth } from "@/hooks/useAuth";
import { AuthModal } from "@/components/auth/AuthModal";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Target, TrendingUp, AlertCircle, ArrowLeft, Sparkles, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface ScoredGrant extends Grant {
  score?: number;
  decision?: string;
  match_reasons?: string[];
  isScoring?: boolean;
  savedId?: string;
}

const Search = () => {
  const { user } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [grants, setGrants] = useState<ScoredGrant[]>([]);
  const [citations, setCitations] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [lastQuery, setLastQuery] = useState("");
  const { toast } = useToast();

  const handleSearch = async (query: string, filters: SearchFilters) => {
    setIsLoading(true);
    setHasSearched(true);
    setLastQuery(query);

    try {
      const response = await grantsApi.search(query, filters);

      if (response.success && response.grants) {
        // Initialize grants without scores
        const initialGrants: ScoredGrant[] = response.grants.map(g => ({
          ...g,
          isScoring: true,
        }));
        setGrants(initialGrants);
        setCitations(response.citations || []);
        
        if (response.grants.length === 0) {
          toast({
            title: "No grants found",
            description: "Try adjusting your search terms or filters.",
          });
        } else {
          toast({
            title: `Found ${response.grants.length} opportunities!`,
            description: user ? "Scoring with AI..." : "Sign in to score and save.",
          });

          // If user is logged in, score each grant
          if (user) {
            scoreGrants(response.grants);
          }
        }
      } else {
        toast({
          title: "Search failed",
          description: response.error || "Unable to search grants. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Search error:", error);
      toast({
        title: "Error",
        description: "Failed to connect to search service.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const scoreGrants = async (grantsToScore: Grant[]) => {
    for (let i = 0; i < grantsToScore.length; i++) {
      const grant = grantsToScore[i];
      
      try {
        // First, save to opportunities_raw
        const { data: rawOpp, error: insertError } = await supabase
          .from('opportunities_raw')
          .upsert({
            source: 'perplexity',
            external_id: `${grant.title}-${grant.agency}`.slice(0, 100),
            title: grant.title,
            agency: grant.agency,
            amount_text: grant.amount,
            description: grant.description,
            eligibility: grant.eligibility,
            source_url: grant.sourceUrl,
            raw_data: { deadline_text: grant.deadline },
          }, {
            onConflict: 'source,external_id',
          })
          .select()
          .single();

        if (insertError) {
          console.error('Error saving opportunity:', insertError);
          continue;
        }

        // Score the opportunity
        const { data: scoreData, error: scoreError } = await supabase.functions.invoke('qualify-opportunity', {
          body: {
            opportunity: {
              id: rawOpp.id,
              title: grant.title,
              agency: grant.agency,
              amount_text: grant.amount,
              description: grant.description,
              eligibility: grant.eligibility,
            },
          },
        });

        if (scoreError) {
          console.error('Error scoring opportunity:', scoreError);
          setGrants(prev => prev.map((g, idx) => 
            idx === i ? { ...g, isScoring: false } : g
          ));
          continue;
        }

        const qualification = scoreData.qualification;

        // Save scored opportunity
        const { data: scoredOpp, error: scoredError } = await supabase
          .from('opportunities_scored')
          .upsert({
            user_id: user!.id,
            opportunity_raw_id: rawOpp.id,
            strategic_fit_score: qualification.strategic_fit_score,
            win_probability_score: qualification.win_probability_score,
            resource_efficiency_score: qualification.resource_efficiency_score,
            strategic_value_score: qualification.strategic_value_score,
            bonus_points: qualification.bonus_points,
            capacity_penalty: qualification.capacity_penalty,
            decision: qualification.decision,
            hitl_status: 'pending',
            match_reasons: qualification.match_reasons,
            risks: qualification.risks,
            scoring_details: qualification,
          }, {
            onConflict: 'user_id,opportunity_raw_id',
          })
          .select()
          .single();

        // Update UI with score
        setGrants(prev => prev.map((g, idx) => 
          idx === i ? {
            ...g,
            score: qualification.total_score,
            decision: qualification.decision,
            match_reasons: qualification.match_reasons,
            isScoring: false,
            savedId: scoredOpp?.id,
          } : g
        ));

      } catch (error) {
        console.error('Error processing grant:', error);
        setGrants(prev => prev.map((g, idx) => 
          idx === i ? { ...g, isScoring: false } : g
        ));
      }
    }

    toast({
      title: "Scoring complete!",
      description: "View your scored opportunities in the Dashboard.",
    });
  };

  const getDecisionBadge = (decision?: string, score?: number) => {
    if (!decision) return null;
    
    const colors: Record<string, string> = {
      priority_a: 'bg-success text-success-foreground',
      priority_b: 'bg-primary text-primary-foreground',
      conditional: 'bg-warning text-warning-foreground',
      no_go: 'bg-muted text-muted-foreground',
    };

    const labels: Record<string, string> = {
      priority_a: 'Priority A',
      priority_b: 'Priority B',
      conditional: 'Conditional',
      no_go: 'No-Go',
    };

    return (
      <div className="flex items-center gap-2">
        <Badge className={colors[decision] || 'bg-secondary'}>
          {labels[decision] || decision}
        </Badge>
        {score !== undefined && (
          <span className="text-sm font-medium">{score}/100</span>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-6 py-12">
        {/* Navigation */}
        <div className="flex items-center justify-between mb-6">
          <Link to="/">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </Link>
          {user && (
            <Link to="/dashboard">
              <Button variant="outline" size="sm">
                <CheckCircle className="w-4 h-4 mr-2" />
                View Dashboard
              </Button>
            </Link>
          )}
        </div>

        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full mb-6">
            <Target className="w-5 h-5 text-primary" />
            <span className="text-sm font-medium text-primary">AI-Powered Grant Discovery</span>
          </div>
          <h1 className="text-4xl lg:text-5xl font-bold text-foreground mb-4">
            Hunt Your Next{" "}
            <span className="bg-gradient-hero bg-clip-text text-transparent">
              Funding Opportunity
            </span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Search across 50+ funding databases with AI. Get real-time, citation-backed 
            results from SBIR/STTR, NSF, NIH, DOE, and private foundations.
          </p>
          {!user && (
            <div className="mt-4">
              <Button variant="outline" onClick={() => setShowAuthModal(true)}>
                <Sparkles className="w-4 h-4 mr-2" />
                Sign in to auto-score & save results
              </Button>
            </div>
          )}
        </div>

        {/* Search Bar */}
        <GrantSearchBar onSearch={handleSearch} isLoading={isLoading} />

        {/* Results Section */}
        <div className="mt-12">
          {!hasSearched && (
            <div className="text-center py-16">
              <TrendingUp className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
              <h3 className="text-xl font-medium text-muted-foreground mb-2">
                Ready to discover funding opportunities
              </h3>
              <p className="text-muted-foreground">
                Enter a search query above to find grants matching your technology and stage.
              </p>
            </div>
          )}

          {hasSearched && !isLoading && grants.length === 0 && (
            <div className="text-center py-16">
              <AlertCircle className="w-16 h-16 text-warning/50 mx-auto mb-4" />
              <h3 className="text-xl font-medium text-muted-foreground mb-2">
                No grants found for "{lastQuery}"
              </h3>
              <p className="text-muted-foreground">
                Try broadening your search terms or adjusting filters.
              </p>
            </div>
          )}

          {grants.length > 0 && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-foreground">
                  {grants.length} Opportunities Found
                </h2>
                <span className="text-sm text-muted-foreground">
                  Results for "{lastQuery}"
                </span>
              </div>

              <div className="space-y-4">
                {grants.map((grant, index) => (
                  <div key={index} className="relative">
                    {/* Score overlay */}
                    {user && (
                      <div className="absolute top-4 right-4 z-10">
                        {grant.isScoring ? (
                          <Badge variant="outline" className="animate-pulse">
                            <Sparkles className="w-3 h-3 mr-1 animate-spin" />
                            Scoring...
                          </Badge>
                        ) : (
                          getDecisionBadge(grant.decision, grant.score)
                        )}
                      </div>
                    )}
                    <GrantResultCard grant={grant} index={index} />
                    
                    {/* Match reasons */}
                    {grant.match_reasons && grant.match_reasons.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-2 px-4">
                        {grant.match_reasons.slice(0, 3).map((reason, i) => (
                          <Badge key={i} variant="outline" className="text-xs">
                            ✓ {reason}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Citations */}
              {citations.length > 0 && (
                <div className="mt-8 p-4 bg-muted/50 rounded-lg">
                  <h3 className="text-sm font-medium text-muted-foreground mb-2">
                    Sources ({citations.length})
                  </h3>
                  <ul className="space-y-1">
                    {citations.map((citation, index) => (
                      <li key={index}>
                        <a
                          href={citation}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-primary hover:underline truncate block"
                        >
                          {citation}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
      </main>

      <Footer />
      <AuthModal open={showAuthModal} onOpenChange={setShowAuthModal} />
    </div>
  );
};

export default Search;
