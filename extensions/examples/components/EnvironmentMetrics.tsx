import { MetricCard } from './MetricCard';
import { Button } from '@/ui-library';
import { RefreshCw } from 'lucide-react';

export interface Metric {
  name: string;
  value: number | string;
  unit?: string;
  trend?: 'up' | 'down' | 'stable';
  changePercent?: number;
  description?: string;
}

export interface EnvironmentMetricsProps {
  environmentName: string;
  environmentType: string;
  metrics: Metric[];
  timeRange?: '1h' | '24h' | '7d' | '30d';
  onTimeRangeChange?: (range: '1h' | '24h' | '7d' | '30d') => void;
  isLoading?: boolean;
  error?: string;
  onRefresh?: () => void;
  className?: string;
}

const timeRangeOptions: Array<{ value: '1h' | '24h' | '7d' | '30d'; label: string }> = [
  { value: '1h', label: '1 Hour' },
  { value: '24h', label: '24 Hours' },
  { value: '7d', label: '7 Days' },
  { value: '30d', label: '30 Days' },
];

const mockMetrics = [
  { name: 'CPU Usage', value: 24, unit: '%', trend: 'stable' as const, changePercent: 0 },
  { name: 'Memory', value: 512, unit: 'MB', trend: 'up' as const, changePercent: 8 },
  { name: 'Storage', value: 2.4, unit: 'GB', trend: 'up' as const, changePercent: 12 },
  { name: 'Network', value: 145, unit: 'Mbps', trend: 'down' as const, changePercent: -5 },
];

// EXAMPLE COMPONENT - To be removed prior to merge
function EnvironmentMetrics({
  environmentName,
  environmentType,
  metrics = mockMetrics,
  timeRange = '24h',
  onTimeRangeChange,
  isLoading = false,
  error,
  onRefresh,
  className,
}: EnvironmentMetricsProps) {
  if (error) {
    return (
      <div className={`rounded-lg border bg-card p-6 text-center ${className}`}>
        <p className="text-destructive mb-4">{error}</p>
        {onRefresh && (
          <Button variant="outline" onClick={onRefresh}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Retry
          </Button>
        )}
      </div>
    );
  }

  return (
    <div className={`space-y-4 mb-4 ${className}`}>
      <div className="flex items-center justify-between">
        <h3 className="font-semibold">{`[Example Zone Extension] Metrics for ${environmentName} (${environmentType})`}</h3>
        <div className="flex items-center gap-2">
          {onRefresh && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onRefresh}
              disabled={isLoading}
            >
              <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            </Button>
          )}
          {onTimeRangeChange && (
            <div className="flex rounded-md border">
              {timeRangeOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => onTimeRangeChange(option.value)}
                  className={`
                    px-3 py-1 text-sm transition-colors
                    first:rounded-l-md last:rounded-r-md
                    hover:bg-accent
                    ${timeRange === option.value ? 'bg-accent font-medium' : ''}
                  `}
                >
                  {option.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {metrics.map((metric, index) => (
              <MetricCard
                key={index}
                name={metric.name}
                value={metric.value}
                unit={metric.unit}
                trend={metric.trend}
                changePercent={metric.changePercent}
                description={metric.description}
              />
        ))}
      </div>
    </div>
  );
}

export { EnvironmentMetrics };