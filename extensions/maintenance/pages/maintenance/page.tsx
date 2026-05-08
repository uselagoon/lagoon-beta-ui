'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import { Collapsible, CollapsibleTrigger, CollapsibleContent, Button, Badge } from '@/ui-library';
import { Info, ChevronDown, X, CloudCog, AlertCircle } from 'lucide-react';

type Maintenance = {
  id: string;
  name: string;
  impact: string;
  shortlink: string;
  status: string;
  scheduled_for: string;
  scheduled_until: string;
  type: 'Maintenance';
};

type Incident = {
  id: string;
  name: string;
  impact: string;
  shortlink: string;
  status: string;
  type: 'Incident';
};

type BannerItem = Maintenance | Incident;

const exampleItems: BannerItem[] = [
  {
    id: 'inc-1',
    name: 'API response times degraded',
    impact: 'minor',
    shortlink: '#',
    status: 'investigating',
    type: 'Incident',
  },
  {
    id: 'maint-1',
    name: 'Database cluster upgrade',
    impact: 'maintenance',
    shortlink: '#',
    status: 'scheduled',
    scheduled_for: new Date(Date.now() + 30 * 60 * 1000).toISOString(),
    scheduled_until: new Date(Date.now() + 90 * 60 * 1000).toISOString(),
    type: 'Maintenance',
  },
];

function formatDate(item: Maintenance) {
  const opts: Intl.DateTimeFormatOptions = { month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit' };
  const start = new Date(item.scheduled_for);
  const end = new Date(item.scheduled_until);
  if (start.toDateString() === end.toDateString()) {
    return `${start.toLocaleString(undefined, opts)} — ${end.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}`;
  }
  return `${start.toLocaleString(undefined, opts)} — ${end.toLocaleString(undefined, opts)}`;
}

function BannerCard({ item }: { item: BannerItem }) {
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

// simplified wip maintenance banner example - https://github.com/uselagoon/ui-library/pull/26
export default function MaintenanceBannerPage() {
  const { organizationSlug } = useParams<{ organizationSlug: string }>();
  const [visible, setVisible] = useState(true);

  if (!visible) return null;

  return (
    <div className="p-6">
      <p className="text-sm text-[var(--muted-foreground)] mb-4">
        Maintenance status for <strong>{organizationSlug}</strong>
      </p>
      <Collapsible className="w-full max-w-xl border-x border-b rounded-lg bg-[var(--background)]">
        <div className="pt-1.5 pb-2 px-3">
          <div className="flex items-center justify-between">
            <div className="flex gap-2 items-center">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-[var(--badge-warning-bg)]/25">
                <Info className="w-5 h-5 text-[var(--badge-warning-bg)]" />
              </div>
              <div>
                <h4 className="text-md font-medium">Active Service Disruptions</h4>
                <CollapsibleTrigger className="flex items-end gap-2">
                  <p className="text-sm text-[var(--muted-foreground)] mt-0.5">
                    {exampleItems.length} active issue{exampleItems.length !== 1 ? 's' : ''}
                  </p>
                  <ChevronDown className="w-5 h-5 text-[var(--muted-foreground)] hover:text-[var(--foreground)]" />
                </CollapsibleTrigger>
              </div>
            </div>
            <Button className="text-xs size-6" variant="outline" onClick={() => setVisible(false)}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>
        <CollapsibleContent className="mt-2">
          {exampleItems.map((item) => (
            <BannerCard key={item.id} item={item} />
          ))}
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
}
