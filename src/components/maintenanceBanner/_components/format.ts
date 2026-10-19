import { BannerItem } from '../MaintenanceBanner';

export type Severity = 'danger' | 'warning' | 'lagoon';

export function getSeverity(item: BannerItem): Severity {
  if (item.type === 'Incident') return 'danger';
  return item.status === 'in_progress' ? 'warning' : 'lagoon';
}

export function getWorstSeverity(items: BannerItem[]): Severity {
  const levels = items.map(getSeverity);
  if (levels.includes('danger')) return 'danger';
  if (levels.includes('warning')) return 'warning';
  return 'lagoon';
}

export const dotClass: Record<Severity, string> = {
  danger: 'bg-[var(--badge-danger-bg)] ring-3 ring-[var(--badge-danger-bg)]/20',
  warning: 'bg-[var(--badge-warning-bg)]',
  lagoon: 'bg-[var(--badge-lagoon-bg)]',
};

export function humanise(value: string) {
  const text = value.replace(/_/g, ' ');
  return text.charAt(0).toUpperCase() + text.slice(1);
}

const timeFormat = new Intl.DateTimeFormat(undefined, { hour: '2-digit', minute: '2-digit' });
const dateTimeFormat = new Intl.DateTimeFormat(undefined, {
  day: 'numeric',
  month: 'short',
  hour: '2-digit',
  minute: '2-digit',
});

export const formatTime = (value: string) => timeFormat.format(new Date(value));
export const formatDateTime = (value: string) => dateTimeFormat.format(new Date(value));

export function getMeta(item: BannerItem) {
  if (item.type === 'Incident') return `${humanise(item.status)} · ${humanise(item.impact)} impact`;
  if (item.startsIn != null) {
    return `Starts in ${item.startsIn} min · ${formatTime(item.scheduled_for)} to ${formatTime(item.scheduled_until)}`;
  }
  return `${humanise(item.status)} · ends ${formatTime(item.scheduled_until)}`;
}

export function formatUpdated(updatedAt: number | null) {
  if (updatedAt == null) return 'Not updated yet';
  return `Updated ${timeFormat.format(updatedAt)}`;
}
