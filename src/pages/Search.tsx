import { useState } from "react";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import GrantSearchBar from "@/components/grants/GrantSearchBar";
import GrantResultCard from "@/components/grants/GrantResultCard";
import { grantsApi, type Grant, type SearchFilters } from "@/lib/api/grants";
import { useToast } from "@/hooks/use-toast";
import { Target, TrendingUp, AlertCircle, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

const Search = () => {
  const [grants, setGrants] = useState<Grant[]>([]);
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
        setGrants(response.grants);
        setCitations(response.citations || []);
        
        if (response.grants.length === 0) {
          toast({
            title: "No grants found",
            description: "Try adjusting your search terms or filters.",
          });
        } else {
          toast({
            title: `Found ${response.grants.length} opportunities!`,
            description: "AI-powered results with citations below.",
          });
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

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-6 py-12">
        {/* Back Button */}
        <Link to="/">
          <Button variant="ghost" size="sm" className="mb-6">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
        </Link>

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
                  <GrantResultCard key={index} grant={grant} index={index} />
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
    </div>
  );
};

export default Search;
