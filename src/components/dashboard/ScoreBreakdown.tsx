import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

interface ScoreBreakdownProps {
  strategicFit: number;
  winProbability: number;
  resourceEfficiency: number;
  strategicValue: number;
  bonus: number;
  penalty: number;
  totalScore: number;
}

export function ScoreBreakdown({
  strategicFit,
  winProbability,
  resourceEfficiency,
  strategicValue,
  bonus,
  penalty,
  totalScore,
}: ScoreBreakdownProps) {
  const sections = [
    { 
      label: 'Strategic Fit', 
      score: strategicFit, 
      max: 40,
      description: 'Alignment with your organization focus areas'
    },
    { 
      label: 'Win Probability', 
      score: winProbability, 
      max: 30,
      description: 'Competition level and differentiation potential'
    },
    { 
      label: 'Resource Efficiency', 
      score: resourceEfficiency, 
      max: 20,
      description: 'Award size vs. effort required'
    },
    { 
      label: 'Strategic Value', 
      score: strategicValue, 
      max: 10,
      description: 'Partnership access and pipeline potential'
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Score Breakdown</span>
          <span className="text-3xl font-bold text-primary">{totalScore}</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {sections.map((section) => (
          <div key={section.label} className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="font-medium">{section.label}</span>
              <span className="text-muted-foreground">
                {section.score} / {section.max}
              </span>
            </div>
            <Progress 
              value={(section.score / section.max) * 100} 
              className="h-2"
            />
            <p className="text-xs text-muted-foreground">{section.description}</p>
          </div>
        ))}

        {/* Bonus & Penalty */}
        <div className="pt-4 border-t space-y-2">
          {bonus > 0 && (
            <div className="flex justify-between text-sm">
              <span className="text-success font-medium">Bonus Points</span>
              <span className="text-success">+{bonus}</span>
            </div>
          )}
          {penalty < 0 && (
            <div className="flex justify-between text-sm">
              <span className="text-destructive font-medium">Capacity Penalty</span>
              <span className="text-destructive">{penalty}</span>
            </div>
          )}
        </div>

        {/* Decision threshold guide */}
        <div className="pt-4 border-t">
          <p className="text-sm font-medium mb-2">Decision Thresholds</p>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-success" />
              <span>85-100: Priority A</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-primary" />
              <span>70-84: Priority B</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-warning" />
              <span>55-69: Conditional</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-muted" />
              <span>&lt;55: No-Go</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
