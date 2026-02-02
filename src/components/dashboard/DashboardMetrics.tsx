import { Card, CardContent } from '@/components/ui/card';
import { 
  AlertCircle, 
  Clock, 
  CheckCircle2, 
  TrendingUp 
} from 'lucide-react';

interface MetricsProps {
  priorityA: number;
  priorityB: number;
  pending: number;
  approved: number;
}

export function DashboardMetrics({ priorityA, priorityB, pending, approved }: MetricsProps) {
  const metrics = [
    {
      label: 'Priority A',
      value: priorityA,
      icon: AlertCircle,
      color: 'text-success',
      bg: 'bg-success/10',
      description: 'Requires immediate action',
    },
    {
      label: 'Priority B',
      value: priorityB,
      icon: TrendingUp,
      color: 'text-primary',
      bg: 'bg-primary/10',
      description: 'Weekly review queue',
    },
    {
      label: 'Pending Review',
      value: pending,
      icon: Clock,
      color: 'text-warning',
      bg: 'bg-warning/10',
      description: 'Awaiting your decision',
    },
    {
      label: 'Approved',
      value: approved,
      icon: CheckCircle2,
      color: 'text-success',
      bg: 'bg-success/10',
      description: 'In your pipeline',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {metrics.map((metric) => (
        <Card key={metric.label} className="hover:shadow-elegant transition-shadow">
          <CardContent className="pt-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground">{metric.label}</p>
                <p className="text-3xl font-bold mt-1">{metric.value}</p>
                <p className="text-xs text-muted-foreground mt-1">{metric.description}</p>
              </div>
              <div className={`p-3 rounded-full ${metric.bg}`}>
                <metric.icon className={`h-5 w-5 ${metric.color}`} />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
