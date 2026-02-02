import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Loader2, Filter } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface GrantSearchBarProps {
  onSearch: (query: string, filters: {
    fundingRange?: string;
    deadline?: string;
    sector?: string;
    grantType?: string;
  }) => void;
  isLoading: boolean;
}

const GRANT_TYPES = [
  { value: "sbir-sttr", label: "SBIR/STTR" },
  { value: "nsf", label: "NSF Research Grants" },
  { value: "nih", label: "NIH Funding" },
  { value: "doe", label: "DOE Energy Grants" },
  { value: "dod", label: "DoD/DARPA" },
  { value: "usda", label: "USDA Agriculture" },
  { value: "epa", label: "EPA Environmental" },
  { value: "foundation", label: "Private Foundations" },
  { value: "state-local", label: "State & Local" },
  { value: "other", label: "Other (specify)" },
];

const GrantSearchBar = ({ onSearch, isLoading }: GrantSearchBarProps) => {
  const [query, setQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [fundingRange, setFundingRange] = useState<string>("");
  const [deadline, setDeadline] = useState<string>("");
  const [sector, setSector] = useState<string>("");
  const [grantType, setGrantType] = useState<string>("");
  const [customGrantType, setCustomGrantType] = useState<string>("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    
    const effectiveGrantType = grantType === "other" ? customGrantType : grantType;
    
    onSearch(query, {
      fundingRange: fundingRange || undefined,
      deadline: deadline || undefined,
      sector: sector || undefined,
      grantType: effectiveGrantType || undefined,
    });
  };

  const handleGrantTypeChange = (value: string) => {
    setGrantType(value);
    if (value !== "other") {
      setCustomGrantType("");
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-4">
      <form onSubmit={handleSubmit} className="flex gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search for grants... (e.g., 'AI healthcare startup' or 'clean energy research')"
            className="pl-12 h-14 text-lg bg-card border-border"
            disabled={isLoading}
          />
        </div>
        <Button
          type="button"
          variant="outline"
          size="lg"
          className="h-14 px-4"
          onClick={() => setShowFilters(!showFilters)}
        >
          <Filter className="w-5 h-5" />
        </Button>
        <Button
          type="submit"
          variant="hero"
          size="lg"
          className="h-14 px-8"
          disabled={isLoading || !query.trim()}
        >
          {isLoading ? (
            <>
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              Hunting...
            </>
          ) : (
            "Hunt Grants"
          )}
        </Button>
      </form>

      {showFilters && (
        <div className="flex flex-wrap gap-4 p-4 bg-card border border-border rounded-lg animate-fade-in">
          {/* Grant Type Dropdown */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">Grant Type</label>
            <Select value={grantType} onValueChange={handleGrantTypeChange}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                {GRANT_TYPES.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Custom Grant Type Input (shown when "Other" is selected) */}
          {grantType === "other" && (
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">Specify Grant Type</label>
              <Input
                type="text"
                value={customGrantType}
                onChange={(e) => setCustomGrantType(e.target.value)}
                placeholder="e.g., International development"
                className="w-48"
              />
            </div>
          )}

          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">Funding Range</label>
            <Select value={fundingRange} onValueChange={setFundingRange}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Any amount" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="under-50k">Under $50,000</SelectItem>
                <SelectItem value="50k-250k">$50,000 - $250,000</SelectItem>
                <SelectItem value="250k-1m">$250,000 - $1M</SelectItem>
                <SelectItem value="1m-5m">$1M - $5M</SelectItem>
                <SelectItem value="over-5m">Over $5M</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">Deadline</label>
            <Select value={deadline} onValueChange={setDeadline}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Any deadline" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="30-days">Within 30 days</SelectItem>
                <SelectItem value="90-days">Within 90 days</SelectItem>
                <SelectItem value="6-months">Within 6 months</SelectItem>
                <SelectItem value="rolling">Rolling deadlines</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">Sector</label>
            <Select value={sector} onValueChange={setSector}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="All sectors" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="healthcare">Healthcare & Biotech</SelectItem>
                <SelectItem value="cleantech">Clean Tech & Energy</SelectItem>
                <SelectItem value="ai-ml">AI & Machine Learning</SelectItem>
                <SelectItem value="manufacturing">Manufacturing</SelectItem>
                <SelectItem value="defense">Defense & Aerospace</SelectItem>
                <SelectItem value="agriculture">Agriculture</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      )}
    </div>
  );
};

export default GrantSearchBar;
