import { BannerItem, Maintenance } from '../MaintenanceBanner';
import { AlertCircle, CloudCog } from 'lucide-react';
import { Badge } from '@/ui-library';

function formatDate(item: Maintenance) {
  const opts: Intl.DateTimeFormatOptions = { month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit' };
  const start = new Date(item.scheduled_for);
  const end = new Date(item.scheduled_until);
  if (start.toDateString() === end.toDateString()) {
    return `${start.toLocaleString(undefined, opts)} — ${end.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}`;
  }
  return `${start.toLocaleString(undefined, opts)} — ${end.toLocaleString(undefined, opts)}`;
}

export default function BannerCard({ item }: { item: BannerItem }) {
  const icon =
    item.type === 'Incident' ? (
      <AlertCircle className="w-5 h-5 text-[var(--badge-danger-bg)]" />
    ) : (
      <CloudCog className="w-5 h-5 text-[var(--badge-lagoon-bg)]" />
    );

  return (
    <div className="w-[90%] mx-auto border bg-[var(--card)] rounded-xl mb-4 px-4 py-2">
      <div className="flex items-start gap-2">
        <div
          className={`w-10 h-10 rounded-xl flex items-center justify-center ${
            item.type === 'Incident' ? 'bg-[var(--badge-danger-bg)]/20' : 'bg-[var(--badge-lagoon-bg)]/20'
          }`}
        >
          {icon}
        </div>
        <div className="flex flex-col w-[90%] gap-2">
          <div className="flex gap-4 items-center">
            <h4 className="text-md font-medium">{item.name}</h4>
            <Badge className="ml-auto" variant={item.type === 'Incident' ? 'danger' : 'lagoon'}>
              {item.type}
            </Badge>
          </div>
          <div className="grid grid-cols-2 text-sm">
            <div className="flex items-end gap-2">
              <span className="text-[var(--muted-foreground)] text-xs uppercase">Status</span>
              <span className="capitalize">{item.status}</span>
            </div>
            <div className="flex items-end gap-2">
              <span className="text-[var(--muted-foreground)] text-xs uppercase">Impact</span>
              <span className="capitalize">{item.impact}</span>
            </div>
          </div>
          {item.type === 'Maintenance' && (
            <div className="text-sm">
              <span className="text-[var(--muted-foreground)] text-xs uppercase">Scheduled </span>
              <span>{formatDate(item)}</span>
              {item.startsIn != null && (
                <span className="text-[var(--muted-foreground)]"> (starts in {item.startsIn} min)</span>
              )}
            </div>
          )}
          <div className="w-full">
            {item.shortlink && (
              <a href={item.shortlink} target="_blank" rel="noopener noreferrer" className="text-sm text-[var(--badge-lagoon-bg)] hover:text-[var(--badge-lagoon-hover)]">
                More details
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}