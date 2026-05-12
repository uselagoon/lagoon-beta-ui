import * as React from 'react';
import { Card, CardContent } from '@/ui-library';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

export interface MetricCardProps {
  name: string;
  value: number | string;
  unit?: string;
  trend?: 'up' | 'down' | 'stable';
  changePercent?: number;
  description?: string;
  onClick?: () => void;
  className?: string;
}

function MetricCard({
  name,
  value,
  unit,
  trend,
  changePercent,
  description,
  onClick,
  className,
}: MetricCardProps) {
  const trendColors = {
    up: 'text-green-600 dark:text-green-400',
    down: 'text-red-600 dark:text-red-400',
    stable: 'text-muted-foreground',
  };

  const TrendIcon = trend === 'up' ? TrendingUp : trend === 'down' ? TrendingDown : Minus;

  return (
    <Card
      className={`
        ${onClick ? 'transition-all duration-200 hover:border-primary hover:shadow-md' : 'transition-all duration-200'}
        ${onClick ? 'cursor-pointer' : ''}
        ${className || ''}
      `}
      onClick={onClick}
    >
      <CardContent className="p-4">
        <div className="space-y-2">
          <p className="text-sm font-medium text-muted-foreground">{name}</p>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-bold">{value}</span>
            {unit && <span className="text-sm text-muted-foreground">{unit}</span>}
          </div>
          {(trend || changePercent !== undefined) && (
            <div className={`flex items-center gap-1 text-sm ${trend ? trendColors[trend] : ''}`}>
              {trend && <TrendIcon className="h-4 w-4" />}
              {changePercent !== undefined && (
                <span>
                  {changePercent > 0 ? '+' : ''}{changePercent}%
                </span>
              )}
            </div>
          )}
          {description && (
            <p className="text-xs text-muted-foreground">{description}</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export { MetricCard };