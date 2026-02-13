import * as LucideIcons from 'lucide-react';
import { ComponentType } from 'react';

type IconComponent = ComponentType<{ className?: string; size?: number }>;

export function resolveIcon(iconName?: string): IconComponent | undefined {
  if (!iconName) return undefined;
  const icon = (LucideIcons as Record<string, unknown>)[iconName];
  return typeof icon === 'function' ? (icon as IconComponent) : undefined;
}
